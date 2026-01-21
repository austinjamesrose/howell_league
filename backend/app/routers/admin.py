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

@router.post("/weekly-stats/")
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

@router.post("/bonuses/")
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

@router.post("/playoffs/")
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

@router.post("/sync-playoffs/")
def sync_playoff_wins(season: int = 2025, db: Session = Depends(get_db)):
    """
    Sync playoff WINS from NFL game results.
    Creates PlayoffAppearance entries for QBs who WON in each round.

    Points per playoff WIN:
    - Wild Card: 3 points
    - Divisional: 6 points
    - Conference Championship: 10 points
    - Super Bowl: 15 points (+25 bonus)
    """
    try:
        result = NFLStatsService.sync_playoff_appearances(db, season)
        return {
            "message": f"Successfully synced playoff wins for {season}",
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to sync playoffs: {str(e)}")

@router.post("/seed-awards/")
def seed_awards(season: int = 2025, db: Session = Depends(get_db)):
    """
    Seed Player of the Week and Player of the Month awards for the season.
    Data sourced from Pro-Football-Reference.com.

    Only affects CONF_POW and CONF_POM bonuses - does NOT touch other stats.
    Safe to run multiple times (clears and re-adds POW/POM awards).
    """
    # Players of the Week - 10 points each (CONF_POW)
    # Only includes QBs that are on league rosters
    players_of_week = [
        # AFC
        {"name": "Josh Allen", "week": 1},
        {"name": "Josh Allen", "week": 11},
        {"name": "Josh Allen", "week": 14},
        {"name": "Patrick Mahomes", "week": 4},
        {"name": "Patrick Mahomes", "week": 6},
        {"name": "C.J. Stroud", "week": 5},
        {"name": "Lamar Jackson", "week": 9},
        {"name": "Drake Maye", "week": 13},
        {"name": "Trevor Lawrence", "week": 15},
        {"name": "Joe Burrow", "week": 16},
        # NFC
        {"name": "J.J. McCarthy", "week": 1},
        {"name": "Jared Goff", "week": 2},
        {"name": "Caleb Williams", "week": 3},
        {"name": "Jordan Love", "week": 8},
        {"name": "Jordan Love", "week": 13},
        {"name": "Bryce Young", "week": 11},
        {"name": "Brock Purdy", "week": 16},
        {"name": "Matthew Stafford", "week": 18},
    ]

    # Players of the Month - 20 points each (CONF_POM)
    players_of_month = [
        {"name": "Trevor Lawrence", "month": "December"},
        {"name": "Matthew Stafford", "month": "November"},
        {"name": "Matthew Stafford", "month": "December"},
    ]

    # Clear existing POW/POM bonuses for the season
    db.query(SeasonBonus).filter(
        SeasonBonus.season == season,
        SeasonBonus.bonus_type.in_([BonusType.CONF_POW, BonusType.CONF_POM])
    ).delete(synchronize_session=False)
    db.commit()

    pow_count = 0
    pom_count = 0
    pow_points = 0
    pom_points = 0
    team_points = {}

    # Add Players of the Week
    for award in players_of_week:
        qb = db.query(Quarterback).filter(
            Quarterback.name == award["name"],
            Quarterback.season == season
        ).first()

        if qb:
            bonus = SeasonBonus(
                qb_id=qb.id,
                season=season,
                bonus_type=BonusType.CONF_POW,
                points=10.0
            )
            db.add(bonus)
            pow_count += 1
            pow_points += 10

            if qb.squad:
                team_points[qb.squad.name] = team_points.get(qb.squad.name, 0) + 10

    # Add Players of the Month
    for award in players_of_month:
        qb = db.query(Quarterback).filter(
            Quarterback.name == award["name"],
            Quarterback.season == season
        ).first()

        if qb:
            bonus = SeasonBonus(
                qb_id=qb.id,
                season=season,
                bonus_type=BonusType.CONF_POM,
                points=20.0
            )
            db.add(bonus)
            pom_count += 1
            pom_points += 20

            if qb.squad:
                team_points[qb.squad.name] = team_points.get(qb.squad.name, 0) + 20

    db.commit()

    return {
        "message": f"Awards seeded successfully for {season}",
        "pow_awards": pow_count,
        "pow_points": pow_points,
        "pom_awards": pom_count,
        "pom_points": pom_points,
        "total_awards": pow_count + pom_count,
        "total_points": pow_points + pom_points,
        "points_by_team": team_points
    }


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

@router.post("/seed-database/")
def seed_database(season: int = 2025, db: Session = Depends(get_db)):
    """
    ONE-TIME SETUP: Seeds the database with teams and QBs.
    WARNING: This clears existing data!
    """
    from app.models.models import Squad

    # Check if already seeded
    existing_squads = db.query(Squad).filter(Squad.season == season).count()
    if existing_squads > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Database already has {existing_squads} squads for {season}. Delete them first if you want to re-seed."
        )

    # Roster data
    rosters = {
        "Team AP": {
            "owner": "Austin Poncelet",
            "qbs": [
                {"name": "Justin Herbert", "nfl_team": "LAC"},
                {"name": "Russell Wilson", "nfl_team": "NYG"},
                {"name": "Baker Mayfield", "nfl_team": "TB"},
                {"name": "Tua Tagovailoa", "nfl_team": "MIA"},
                {"name": "C.J. Stroud", "nfl_team": "HOU"},
                {"name": "Joe Flacco", "nfl_team": "CIN"},
                {"name": "Bo Nix", "nfl_team": "DEN"},
                {"name": "Jameis Winston", "nfl_team": "NYG"},
            ]
        },
        "Team Jar-Jar": {
            "owner": "Brad Foster",
            "qbs": [
                {"name": "Patrick Mahomes", "nfl_team": "KC"},
                {"name": "Kirk Cousins", "nfl_team": "ATL"},
                {"name": "Jalen Hurts", "nfl_team": "PHI"},
                {"name": "Kyle McCord", "nfl_team": "PHI"},
                {"name": "Trevor Lawrence", "nfl_team": "JAX"},
                {"name": "Brock Purdy", "nfl_team": "SF"},
                {"name": "Michael Penix Jr.", "nfl_team": "ATL"},
                {"name": "Jaxson Dart", "nfl_team": "NYG"},
            ]
        },
        "Team Mojo": {
            "owner": "Marc Orlando",
            "qbs": [
                {"name": "Josh Allen", "nfl_team": "BUF"},
                {"name": "Justin Fields", "nfl_team": "NYJ"},
                {"name": "Geno Smith", "nfl_team": "SEA"},
                {"name": "Cam Ward", "nfl_team": "TEN"},
                {"name": "Drake Maye", "nfl_team": "NE"},
                {"name": "Shedeur Sanders", "nfl_team": "CLE"},
                {"name": "Deshaun Watson", "nfl_team": "CLE"},
                {"name": "Mason Rudolph", "nfl_team": "PIT"},
            ]
        },
        "Team BMOC": {
            "owner": "Sean McLaughlin",
            "qbs": [
                {"name": "Bryce Young", "nfl_team": "CAR"},
                {"name": "Matthew Stafford", "nfl_team": "LAR"},
                {"name": "Aaron Rodgers", "nfl_team": "NYJ"},
                {"name": "Quinn Ewers", "nfl_team": "MIA"},
                {"name": "Sam Darnold", "nfl_team": "SEA"},
                {"name": "Tyler Shough", "nfl_team": "NO"},
                {"name": "Caleb Williams", "nfl_team": "CHI"},
                {"name": "Spencer Rattler", "nfl_team": "NO"},
            ]
        },
        "Team TK": {
            "owner": "Tyler Krieger",
            "qbs": [
                {"name": "Joe Burrow", "nfl_team": "CIN"},
                {"name": "Lamar Jackson", "nfl_team": "BAL"},
                {"name": "Will Levis", "nfl_team": "TEN"},
                {"name": "Jared Goff", "nfl_team": "DET"},
                {"name": "Daniel Jones", "nfl_team": "IND"},
                {"name": "Dillon Gabriel", "nfl_team": "CLE"},
                {"name": "Derek Carr", "nfl_team": "NO"},
                {"name": "J.J. McCarthy", "nfl_team": "MIN"},
            ]
        },
        "Team Rose": {
            "owner": "Austin Rose",
            "qbs": [
                {"name": "Dak Prescott", "nfl_team": "DAL"},
                {"name": "Kyler Murray", "nfl_team": "ARI"},
                {"name": "Anthony Richardson", "nfl_team": "IND"},
                {"name": "Jordan Love", "nfl_team": "GB"},
                {"name": "Joe Milton III", "nfl_team": "DAL"},
                {"name": "Jayden Daniels", "nfl_team": "WAS"},
                {"name": "Jalen Milroe", "nfl_team": "SEA"},
                {"name": "Will Howard", "nfl_team": "PIT"},
            ]
        },
    }

    # Create squads and QBs
    total_qbs = 0
    for squad_name, squad_data in rosters.items():
        squad = Squad(
            name=squad_name,
            owner=squad_data["owner"],
            season=season
        )
        db.add(squad)
        db.flush()  # Get the squad ID

        for qb_data in squad_data["qbs"]:
            qb = Quarterback(
                name=qb_data["name"],
                nfl_team=qb_data["nfl_team"],
                squad_id=squad.id,
                season=season
            )
            db.add(qb)
            total_qbs += 1

    db.commit()

    return {
        "message": f"Database seeded successfully for {season} season!",
        "squads_created": len(rosters),
        "qbs_created": total_qbs,
        "next_steps": [
            "Visit /api/admin/sync-stats/ to sync NFL stats",
            "Visit /api/admin/sync-wins/ to sync QB wins"
        ]
    }
