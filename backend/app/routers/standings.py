from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.config import get_db
from app.services.standings import StandingsService

router = APIRouter(prefix="/api/standings", tags=["standings"])

@router.get("/")
def get_standings(season: int = 2025, db: Session = Depends(get_db)):
    """
    Get league standings for a season.
    Squads are ranked by total points (sum of top 5 QBs).
    """
    standings = StandingsService.get_league_standings(db, season)
    return {"season": season, "standings": standings}

@router.get("/worst-qb")
def get_worst_qb(season: int = 2025, db: Session = Depends(get_db)):
    """
    Get the worst QB (lowest points > 0) for the season.
    Used for league naming tradition.
    """
    worst_qb = StandingsService.get_worst_qb(db, season)
    return {"season": season, "worst_qb": worst_qb}
