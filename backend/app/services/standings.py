from sqlalchemy.orm import Session
from app.models.models import Squad, Quarterback
from typing import List, Dict

class StandingsService:
    """
    Service for calculating league standings based on top 5 QBs per squad.
    """

    # League dues for 2025 season (Section 2 of league_rules.md)
    LEAGUE_DUES_2025 = 70

    @staticmethod
    def get_projected_payout(rank: int, season: int = 2025) -> int:
        """
        Calculate projected payout based on current rank.

        Payout structure (Section 2 of league_rules.md):
        - 1st place: Receives all dues from losers
        - 2nd place: Doesn't pay dues ($0)
        - 3rd-5th place: Pay dues
        - 6th place: Pays 3x dues

        Args:
            rank: Current rank (1-6)
            season: Season year (for dues calculation)

        Returns:
            Projected payout (positive = earnings, negative = loss)
        """
        dues = StandingsService.LEAGUE_DUES_2025

        if rank == 1:
            # 1st place receives all dues: $70*3 + $210 = $420
            return (dues * 3) + (dues * 3)
        elif rank == 2:
            # 2nd place doesn't pay
            return 0
        elif rank in [3, 4, 5]:
            # 3rd-5th pay regular dues
            return -dues
        elif rank == 6:
            # Last place pays 3x dues
            return -(dues * 3)
        else:
            return 0

    @staticmethod
    def get_qb_total_points(qb: Quarterback) -> float:
        """
        Calculate total points for a quarterback (weekly stats + bonuses + playoffs).
        """
        total = 0.0

        # Sum all weekly stats points
        for stat in qb.weekly_stats:
            total += stat.points

        # Sum all season bonuses
        for bonus in qb.season_bonuses:
            total += bonus.points

        # Sum all playoff appearances
        for playoff in qb.playoff_appearances:
            total += playoff.points

        return round(total, 2)

    @staticmethod
    def get_squad_top_qbs(squad: Squad, limit: int = 5) -> List[Dict]:
        """
        Get top N QBs for a squad, sorted by total points.
        """
        qb_points = []

        for qb in squad.quarterbacks:
            total_points = StandingsService.get_qb_total_points(qb)
            qb_points.append({
                "qb_id": qb.id,
                "name": qb.name,
                "nfl_team": qb.nfl_team,
                "total_points": total_points
            })

        # Sort by points descending
        qb_points.sort(key=lambda x: x["total_points"], reverse=True)

        # Return top N
        return qb_points[:limit]

    @staticmethod
    def get_squad_total_points(squad: Squad) -> float:
        """
        Calculate total points for a squad (sum of top 5 QBs only).
        """
        top_qbs = StandingsService.get_squad_top_qbs(squad, limit=5)
        return round(sum(qb["total_points"] for qb in top_qbs), 2)

    @staticmethod
    def get_league_standings(db: Session, season: int) -> List[Dict]:
        """
        Get league standings for a season, ranked by total points.
        """
        squads = db.query(Squad).filter(Squad.season == season).all()

        standings = []
        for squad in squads:
            total_points = StandingsService.get_squad_total_points(squad)
            top_qbs = StandingsService.get_squad_top_qbs(squad, limit=5)

            standings.append({
                "squad_id": squad.id,
                "squad_name": squad.name,
                "owner": squad.owner,
                "total_points": total_points,
                "top_qbs": top_qbs
            })

        # Sort by total points descending
        standings.sort(key=lambda x: x["total_points"], reverse=True)

        # Add rank and projected payout
        for i, standing in enumerate(standings):
            rank = i + 1
            standing["rank"] = rank
            standing["projected_payout"] = StandingsService.get_projected_payout(rank, season)

        return standings

    @staticmethod
    def get_worst_qb(db: Session, season: int) -> Dict:
        """
        Get the QB with the lowest points (> 0) for the season.
        This is for the league name tradition (renaming after worst QB).
        """
        qbs = db.query(Quarterback).filter(Quarterback.season == season).all()

        worst_qb = None
        lowest_points = float('inf')

        for qb in qbs:
            total_points = StandingsService.get_qb_total_points(qb)

            # Only consider QBs with > 0 points
            if total_points > 0 and total_points < lowest_points:
                lowest_points = total_points
                worst_qb = {
                    "qb_id": qb.id,
                    "name": qb.name,
                    "nfl_team": qb.nfl_team,
                    "squad_name": qb.squad.name if qb.squad else "Free Agent",
                    "total_points": total_points
                }

        return worst_qb
