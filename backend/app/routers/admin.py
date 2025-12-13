from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database.config import get_db
from app.models.models import (
    WeeklyStat, SeasonBonus, PlayoffAppearance, Quarterback,
    BonusType, PlayoffRound
)
from app.services.scoring import ScoringEngine
from app.services.nfl_stats import NFLStatsService
import os

router = APIRouter(prefix="/api/admin", tags=["admin"])

class PasswordVerify(BaseModel):
    password: str

@router.post("/verify-password/")
def verify_admin_password(data: PasswordVerify):
    """
    Verify admin password for access to admin panel.
    Returns success if password matches environment variable.
    """
    admin_password = os.getenv("ADMIN_PASSWORD", "")

    if not admin_password:
        raise HTTPException(status_code=500, detail="Admin password not configured")

    if data.password == admin_password:
        return {
            "success": True,
            "message": "Authentication successful"
        }
    else:
        raise HTTPException(status_code=401, detail="Invalid password")

class WeeklyStatCreate(BaseModel):
    qb_id: int
    week: int
    season: int
    passing_yards: int = 0
    rushing_yards: int = 0
    passing_tds: int = 0
    rushing_tds: int = 0
    receiving_tds: int = 0
    interceptions: int = 0
    fumbles: int = 0
    game_won: bool = False
    prime_time_win: bool = False

class SeasonBonusCreate(BaseModel):
    qb_id: int
    season: int
    bonus_type: str

class PlayoffAppearanceCreate(BaseModel):
    qb_id: int
    season: int
    round: str
    won_super_bowl: bool = False

@router.post("/weekly-stats")
def add_weekly_stat(stat_data: WeeklyStatCreate, db: Session = Depends(get_db)):
    """
    Add or update weekly stats for a QB.
    Points are automatically calculated based on league rules.
    """
    # Check if QB exists
    qb = db.query(Quarterback).filter(Quarterback.id == stat_data.qb_id).first()
    if not qb:
        raise HTTPException(status_code=404, detail="Quarterback not found")

    # Check if stat already exists for this week
    existing_stat = db.query(WeeklyStat).filter(
        WeeklyStat.qb_id == stat_data.qb_id,
        WeeklyStat.week == stat_data.week,
        WeeklyStat.season == stat_data.season
    ).first()

    if existing_stat:
        # Update existing stat
        for key, value in stat_data.model_dump().items():
            if key not in ["qb_id", "week", "season"]:
                setattr(existing_stat, key, value)
        stat = existing_stat
    else:
        # Create new stat
        stat = WeeklyStat(**stat_data.model_dump())
        db.add(stat)

    # Calculate points
    stat.points = ScoringEngine.calculate_weekly_points(stat)

    db.commit()
    db.refresh(stat)

    return {
        "message": "Weekly stats saved successfully",
        "week": stat.week,
        "qb_name": qb.name,
        "points": stat.points
    }

@router.post("/bonuses")
def add_season_bonus(bonus_data: SeasonBonusCreate, db: Session = Depends(get_db)):
    """
    Add a season bonus (MVP, Rookie of Year, etc.) for a QB.
    """
    # Check if QB exists
    qb = db.query(Quarterback).filter(Quarterback.id == bonus_data.qb_id).first()
    if not qb:
        raise HTTPException(status_code=404, detail="Quarterback not found")

    # Validate bonus type
    try:
        bonus_type = BonusType[bonus_data.bonus_type]
    except KeyError:
        raise HTTPException(status_code=400, detail=f"Invalid bonus type: {bonus_data.bonus_type}")

    # Calculate points for this bonus
    points = ScoringEngine.get_bonus_points(bonus_type)

    # Check if bonus already exists
    existing_bonus = db.query(SeasonBonus).filter(
        SeasonBonus.qb_id == bonus_data.qb_id,
        SeasonBonus.season == bonus_data.season,
        SeasonBonus.bonus_type == bonus_type
    ).first()

    if existing_bonus:
        raise HTTPException(status_code=400, detail="This bonus already exists for this QB")

    # Create bonus
    bonus = SeasonBonus(
        qb_id=bonus_data.qb_id,
        season=bonus_data.season,
        bonus_type=bonus_type,
        points=points
    )
    db.add(bonus)
    db.commit()
    db.refresh(bonus)

    return {
        "message": "Bonus added successfully",
        "qb_name": qb.name,
        "bonus_type": bonus_type.value,
        "points": points
    }

@router.post("/playoffs")
def add_playoff_appearance(playoff_data: PlayoffAppearanceCreate, db: Session = Depends(get_db)):
    """
    Add a playoff appearance for a QB.
    """
    # Check if QB exists
    qb = db.query(Quarterback).filter(Quarterback.id == playoff_data.qb_id).first()
    if not qb:
        raise HTTPException(status_code=404, detail="Quarterback not found")

    # Validate playoff round
    try:
        playoff_round = PlayoffRound[playoff_data.round]
    except KeyError:
        raise HTTPException(status_code=400, detail=f"Invalid playoff round: {playoff_data.round}")

    # Calculate points for this playoff appearance
    points = ScoringEngine.get_playoff_points(playoff_round, playoff_data.won_super_bowl)

    # Check if playoff appearance already exists
    existing_playoff = db.query(PlayoffAppearance).filter(
        PlayoffAppearance.qb_id == playoff_data.qb_id,
        PlayoffAppearance.season == playoff_data.season,
        PlayoffAppearance.round == playoff_round
    ).first()

    if existing_playoff:
        raise HTTPException(status_code=400, detail="This playoff appearance already exists for this QB")

    # Create playoff appearance
    playoff = PlayoffAppearance(
        qb_id=playoff_data.qb_id,
        season=playoff_data.season,
        round=playoff_round,
        won_super_bowl=playoff_data.won_super_bowl,
        points=points
    )
    db.add(playoff)
    db.commit()
    db.refresh(playoff)

    return {
        "message": "Playoff appearance added successfully",
        "qb_name": qb.name,
        "round": playoff_round.value,
        "points": points
    }

@router.post("/sync-stats/")
def sync_nfl_stats(season: int = 2025, db: Session = Depends(get_db)):
    """
    Sync NFL season aggregate stats from nflreadpy.
    This will fetch season totals for all rostered QBs and update the database.
    """
    try:
        result = NFLStatsService.sync_qb_season_stats(db, season)
        return {
            "message": f"Successfully synced season stats for {season}",
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to sync stats: {str(e)}")

@router.post("/sync-wins/")
def sync_qb_wins(season: int = 2025, db: Session = Depends(get_db)):
    """
    Sync QB wins from NFL game results.
    Only credits wins to the starting QB for each game.

    Awards:
    - 3 points for regular season win
    - 4 points for prime time win (games starting at 5 PM or later)
    """
    try:
        result = NFLStatsService.sync_qb_wins(db, season)
        return {
            "message": f"Successfully synced QB wins for {season}",
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to sync wins: {str(e)}")

@router.get("/debug-nfl-columns/")
def debug_nfl_columns(season: int = 2024):
    """
    Debug endpoint to see what columns are available in NFL data.
    """
    try:
        import nflreadpy as nfl
        stats = nfl.load_player_stats(seasons=[season], summary_level="reg")
        data = stats.to_pandas()
        qb_data = data[data['position'] == 'QB']
        return {
            "columns": list(data.columns),
            "total_players": len(data),
            "total_qbs": len(qb_data),
            "sample_qb": qb_data.head(1).to_dict('records')[0] if len(qb_data) > 0 else {}
        }
    except Exception as e:
        return {"error": str(e)}
