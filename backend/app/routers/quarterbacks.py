from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.config import get_db
from app.models.models import Quarterback
from app.services.standings import StandingsService

router = APIRouter(prefix="/api/quarterbacks", tags=["quarterbacks"])

@router.get("/")
def get_all_quarterbacks(season: int = 2025, db: Session = Depends(get_db)):
    """
    Get all quarterbacks for a season with their total points.
    """
    qbs = db.query(Quarterback).filter(Quarterback.season == season).all()

    result = []
    for qb in qbs:
        total_points = StandingsService.get_qb_total_points(qb)
        result.append({
            "id": qb.id,
            "name": qb.name,
            "nfl_team": qb.nfl_team,
            "squad_name": qb.squad.name if qb.squad else "Free Agent",
            "total_points": total_points
        })

    # Sort by points descending
    result.sort(key=lambda x: x["total_points"], reverse=True)

    return {"season": season, "quarterbacks": result}

@router.get("/{qb_id}")
def get_quarterback_details(qb_id: int, db: Session = Depends(get_db)):
    """
    Get detailed scoring breakdown for a quarterback.
    Includes weekly stats, bonuses, and playoff appearances.
    """
    qb = db.query(Quarterback).filter(Quarterback.id == qb_id).first()

    if not qb:
        raise HTTPException(status_code=404, detail="Quarterback not found")

    # Weekly stats breakdown
    weekly_stats = []
    weekly_total = 0.0
    for stat in qb.weekly_stats:
        weekly_stats.append({
            "week": stat.week,
            "passing_yards": stat.passing_yards,
            "rushing_yards": stat.rushing_yards,
            "passing_tds": stat.passing_tds,
            "rushing_tds": stat.rushing_tds,
            "receiving_tds": stat.receiving_tds,
            "interceptions": stat.interceptions,
            "fumbles": stat.fumbles,
            "game_won": stat.game_won,
            "prime_time_win": stat.prime_time_win,
            "points": stat.points
        })
        weekly_total += stat.points

    # Season bonuses breakdown
    bonuses = []
    bonus_total = 0.0
    for bonus in qb.season_bonuses:
        bonuses.append({
            "type": bonus.bonus_type.value,
            "points": bonus.points
        })
        bonus_total += bonus.points

    # Playoff appearances breakdown
    playoffs = []
    playoff_total = 0.0
    for playoff in qb.playoff_appearances:
        playoffs.append({
            "round": playoff.round.value,
            "won_super_bowl": playoff.won_super_bowl,
            "points": playoff.points
        })
        playoff_total += playoff.points

    total_points = weekly_total + bonus_total + playoff_total

    return {
        "qb_id": qb.id,
        "name": qb.name,
        "nfl_team": qb.nfl_team,
        "squad_name": qb.squad.name if qb.squad else "Free Agent",
        "season": qb.season,
        "total_points": round(total_points, 2),
        "breakdown": {
            "weekly_stats": {
                "stats": weekly_stats,
                "total": round(weekly_total, 2)
            },
            "bonuses": {
                "awards": bonuses,
                "total": round(bonus_total, 2)
            },
            "playoffs": {
                "appearances": playoffs,
                "total": round(playoff_total, 2)
            }
        }
    }
