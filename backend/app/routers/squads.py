from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.config import get_db
from app.models.models import Squad
from app.services.standings import StandingsService

router = APIRouter(prefix="/api/squads", tags=["squads"])

@router.get("/")
def get_all_squads(season: int = 2025, db: Session = Depends(get_db)):
    """
    Get all squads for a season with their total points.
    """
    squads = db.query(Squad).filter(Squad.season == season).all()

    result = []
    for squad in squads:
        total_points = StandingsService.get_squad_total_points(squad)
        result.append({
            "id": squad.id,
            "name": squad.name,
            "owner": squad.owner,
            "season": squad.season,
            "total_points": total_points,
            "qb_count": len(squad.quarterbacks)
        })

    return {"season": season, "squads": result}

@router.get("/{squad_id}/roster/")
def get_squad_roster(squad_id: int, db: Session = Depends(get_db)):
    """
    Get a squad's roster (all QBs) with their individual points.
    Indicates which QBs are in the top 5 (counting toward standings).
    """
    squad = db.query(Squad).filter(Squad.id == squad_id).first()

    if not squad:
        raise HTTPException(status_code=404, detail="Squad not found")

    # Get all QBs with points
    roster = []
    for qb in squad.quarterbacks:
        total_points = StandingsService.get_qb_total_points(qb)
        roster.append({
            "qb_id": qb.id,
            "name": qb.name,
            "nfl_team": qb.nfl_team,
            "total_points": total_points
        })

    # Sort by points descending
    roster.sort(key=lambda x: x["total_points"], reverse=True)

    # Mark top 5 QBs
    for i, qb in enumerate(roster):
        qb["is_top_5"] = i < 5
        qb["rank"] = i + 1

    return {
        "squad_id": squad.id,
        "squad_name": squad.name,
        "owner": squad.owner,
        "season": squad.season,
        "roster": roster
    }
