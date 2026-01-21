"""
NFL Stats service using nflreadpy to fetch season aggregate QB stats.
"""
import nflreadpy as nfl
from sqlalchemy.orm import Session
from app.models.models import Quarterback, WeeklyStat, PlayoffAppearance, PlayoffRound
from app.services.scoring import ScoringEngine
from typing import Dict
from datetime import datetime

class NFLStatsService:
    """
    Service to fetch and sync NFL stats from nflreadpy.
    """

    @staticmethod
    def fetch_season_stats(season: int):
        """
        Fetch season aggregate stats for all QBs from NFL data.

        Args:
            season: NFL season year

        Returns:
            DataFrame with QB season totals (pandas)
        """
        # Load player stats with regular season summary
        # summary_level="reg" gives us season totals for regular season
        player_stats = nfl.load_player_stats(seasons=[season], summary_level="reg")

        # Convert from Polars to pandas for compatibility
        return player_stats.to_pandas()

    @staticmethod
    def sync_qb_season_stats(db: Session, season: int) -> Dict:
        """
        Sync season aggregate stats to our database.
        Stores as week=0 to represent season totals.

        Args:
            db: Database session
            season: Season year

        Returns:
            Summary of synced stats
        """
        # Fetch NFL season aggregate data
        season_data = NFLStatsService.fetch_season_stats(season)

        # Filter to only QBs
        season_data = season_data[season_data['position'] == 'QB']

        # Get all our rostered QBs
        rostered_qbs = db.query(Quarterback).filter(Quarterback.season == season).all()

        # Create a mapping of QB names to our QB records
        # Need to handle name matching - try both player_name and player_display_name
        qb_map = {qb.name: qb for qb in rostered_qbs}

        stats_synced = 0
        stats_updated = 0
        stats_created = 0

        for _, row in season_data.iterrows():
            # Get player name from the stats data
            player_name = row.get('player_name')
            player_display_name = row.get('player_display_name')

            # Try to match by name (try both formats)
            qb = None
            if player_name in qb_map:
                qb = qb_map[player_name]
            elif player_display_name in qb_map:
                qb = qb_map[player_display_name]

            # Only sync if this QB is rostered in our league
            if not qb:
                continue

            # Check if season stat already exists (week=0 represents season total)
            existing_stat = db.query(WeeklyStat).filter(
                WeeklyStat.qb_id == qb.id,
                WeeklyStat.week == 0,
                WeeklyStat.season == season
            ).first()

            # Extract stats from NFL data (season aggregates)
            passing_yards = int(row.get('passing_yards', 0) or 0)
            rushing_yards = int(row.get('rushing_yards', 0) or 0)
            passing_tds = int(row.get('passing_tds', 0) or 0)
            rushing_tds = int(row.get('rushing_tds', 0) or 0)
            interceptions = int(row.get('passing_interceptions', 0) or 0)
            fumbles_lost = int(row.get('sack_fumbles_lost', 0) or 0)

            # Games won - will need manual entry or additional lookup
            games_won = 0  # TODO: Implement game results lookup

            if existing_stat:
                # Update existing season stat
                existing_stat.passing_yards = passing_yards
                existing_stat.rushing_yards = rushing_yards
                existing_stat.passing_tds = passing_tds
                existing_stat.rushing_tds = rushing_tds
                existing_stat.interceptions = interceptions
                existing_stat.fumbles = fumbles_lost
                # Note: game_won field is per-game, so we'll use manual entry for wins
                existing_stat.points = ScoringEngine.calculate_weekly_points(existing_stat)
                stats_updated += 1
            else:
                # Create new season stat entry
                new_stat = WeeklyStat(
                    qb_id=qb.id,
                    week=0,  # Week 0 = season aggregate
                    season=season,
                    passing_yards=passing_yards,
                    rushing_yards=rushing_yards,
                    passing_tds=passing_tds,
                    rushing_tds=rushing_tds,
                    interceptions=interceptions,
                    fumbles=fumbles_lost,
                    game_won=False  # Will be updated manually for win totals
                )
                new_stat.points = ScoringEngine.calculate_weekly_points(new_stat)
                db.add(new_stat)
                stats_created += 1

            stats_synced += 1

        db.commit()

        return {
            "season": season,
            "total_synced": stats_synced,
            "created": stats_created,
            "updated": stats_updated
        }

    @staticmethod
    def sync_qb_wins(db: Session, season: int) -> Dict:
        """
        Sync QB wins from NFL schedule/game results.
        Only credits wins to the starting QB for each game.

        Awards:
        - 3 points for regular season win
        - 4 points for prime time win (games starting at 5 PM or later)

        Args:
            db: Database session
            season: Season year

        Returns:
            Summary of synced wins
        """
        # Load schedule data for the season
        schedules = nfl.load_schedules(seasons=[season])
        schedules_df = schedules.to_pandas()

        # Filter to completed games only (regular season)
        completed_games = schedules_df[
            (schedules_df['home_score'].notna()) &
            (schedules_df['game_type'] == 'REG')
        ]

        # Get all our rostered QBs
        rostered_qbs = db.query(Quarterback).filter(Quarterback.season == season).all()
        qb_map = {qb.name: qb for qb in rostered_qbs}

        wins_synced = 0
        wins_created = 0
        wins_updated = 0

        for _, game in completed_games.iterrows():
            week = int(game['week'])

            # Determine winner and starting QB
            home_score = game['home_score']
            away_score = game['away_score']

            if home_score > away_score:
                winning_qb_name = game['home_qb_name']
                winning_team = game['home_team']
            elif away_score > home_score:
                winning_qb_name = game['away_qb_name']
                winning_team = game['away_team']
            else:
                # Tie game, no winner
                continue

            # Check if winning QB is on our roster
            if not winning_qb_name or winning_qb_name not in qb_map:
                continue

            qb = qb_map[winning_qb_name]

            # Determine if prime time (games starting at 5 PM or later)
            is_prime_time = False
            if game['gametime']:
                try:
                    hour = int(str(game['gametime']).split(':')[0])
                    is_prime_time = hour >= 17  # 5 PM or later
                except:
                    pass

            # Check if we already have a stat for this week
            existing_stat = db.query(WeeklyStat).filter(
                WeeklyStat.qb_id == qb.id,
                WeeklyStat.week == week,
                WeeklyStat.season == season
            ).first()

            if existing_stat:
                # Update existing stat with win
                if not existing_stat.game_won:
                    existing_stat.game_won = True
                    existing_stat.prime_time_win = is_prime_time
                    existing_stat.points = ScoringEngine.calculate_weekly_points(existing_stat)
                    wins_updated += 1
                    wins_synced += 1
            else:
                # Create new stat entry for this win
                new_stat = WeeklyStat(
                    qb_id=qb.id,
                    week=week,
                    season=season,
                    passing_yards=0,
                    rushing_yards=0,
                    passing_tds=0,
                    rushing_tds=0,
                    interceptions=0,
                    fumbles=0,
                    game_won=True,
                    prime_time_win=is_prime_time
                )
                new_stat.points = ScoringEngine.calculate_weekly_points(new_stat)
                db.add(new_stat)
                wins_created += 1
                wins_synced += 1

        db.commit()

        return {
            "season": season,
            "total_wins_synced": wins_synced,
            "created": wins_created,
            "updated": wins_updated,
            "games_checked": len(completed_games)
        }

    @staticmethod
    def sync_playoff_appearances(db: Session, season: int) -> Dict:
        """
        Sync playoff appearances from NFL schedule/game results.
        Creates PlayoffAppearance entries for QBs who played in each round.

        Points are cumulative per round:
        - Wild Card: 3 points
        - Divisional: 6 points
        - Conference Championship: 10 points
        - Super Bowl: 15 points (+25 if won)

        Args:
            db: Database session
            season: Season year

        Returns:
            Summary of synced playoff appearances
        """
        # Load schedule data for the season
        schedules = nfl.load_schedules(seasons=[season])
        schedules_df = schedules.to_pandas()

        # Map NFL game_type to our PlayoffRound enum
        game_type_map = {
            'WC': PlayoffRound.WILD_CARD,
            'DIV': PlayoffRound.DIVISIONAL,
            'CON': PlayoffRound.CONF_CHAMPIONSHIP,
            'SB': PlayoffRound.SUPER_BOWL,
        }

        # Filter to completed playoff games only
        playoff_games = schedules_df[
            (schedules_df['home_score'].notna()) &
            (schedules_df['game_type'].isin(['WC', 'DIV', 'CON', 'SB']))
        ]

        # Get all our rostered QBs
        rostered_qbs = db.query(Quarterback).filter(Quarterback.season == season).all()
        qb_map = {qb.name: qb for qb in rostered_qbs}

        appearances_synced = 0
        appearances_created = 0
        appearances_skipped = 0

        for _, game in playoff_games.iterrows():
            game_type = game['game_type']
            playoff_round = game_type_map.get(game_type)

            if not playoff_round:
                continue

            home_score = game['home_score']
            away_score = game['away_score']
            home_qb = game['home_qb_name']
            away_qb = game['away_qb_name']

            # Determine Super Bowl winner if applicable
            home_won_sb = (game_type == 'SB' and home_score > away_score)
            away_won_sb = (game_type == 'SB' and away_score > home_score)

            # Process both QBs in the game (both teams appeared in this round)
            for qb_name, won_super_bowl in [(home_qb, home_won_sb), (away_qb, away_won_sb)]:
                if not qb_name or qb_name not in qb_map:
                    continue

                qb = qb_map[qb_name]

                # Check if playoff appearance already exists
                existing = db.query(PlayoffAppearance).filter(
                    PlayoffAppearance.qb_id == qb.id,
                    PlayoffAppearance.season == season,
                    PlayoffAppearance.round == playoff_round
                ).first()

                if existing:
                    # Update Super Bowl win status if needed
                    if playoff_round == PlayoffRound.SUPER_BOWL and won_super_bowl and not existing.won_super_bowl:
                        existing.won_super_bowl = True
                        existing.points = ScoringEngine.get_playoff_points(playoff_round, True)
                        appearances_synced += 1
                    else:
                        appearances_skipped += 1
                    continue

                # Create new playoff appearance
                points = ScoringEngine.get_playoff_points(playoff_round, won_super_bowl)
                appearance = PlayoffAppearance(
                    qb_id=qb.id,
                    season=season,
                    round=playoff_round,
                    won_super_bowl=won_super_bowl,
                    points=points
                )
                db.add(appearance)
                appearances_created += 1
                appearances_synced += 1

        db.commit()

        return {
            "season": season,
            "total_appearances_synced": appearances_synced,
            "created": appearances_created,
            "skipped_existing": appearances_skipped,
            "playoff_games_checked": len(playoff_games)
        }
