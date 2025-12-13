from app.models.models import WeeklyStat, BonusType, PlayoffRound

class ScoringEngine:
    """
    Scoring engine based on Howell League rules (league_rules.md Section 6.2)
    """

    @staticmethod
    def calculate_weekly_points(stat: WeeklyStat) -> float:
        """
        Calculate points for a weekly stat line.

        Scoring:
        - 25 passing yards = 1 point
        - 10 rushing yards = 1 point
        - Touchdowns (any type) = 6 points
        - Interceptions = -3 points
        - Fumbles = -3 points
        - Regular season wins = 3 points (+1 for prime time)
        """
        points = 0.0

        # Passing yards: 25 yards = 1 point
        points += (stat.passing_yards or 0) / 25.0

        # Rushing yards: 10 yards = 1 point
        points += (stat.rushing_yards or 0) / 10.0

        # Touchdowns: 6 points each
        passing_tds = stat.passing_tds or 0
        rushing_tds = stat.rushing_tds or 0
        receiving_tds = stat.receiving_tds or 0
        total_tds = passing_tds + rushing_tds + receiving_tds
        points += total_tds * 6

        # Interceptions: -3 points each
        points -= (stat.interceptions or 0) * 3

        # Fumbles: -3 points each
        points -= (stat.fumbles or 0) * 3

        # Game wins: 3 points (4 points if prime time)
        if stat.game_won:
            points += 4 if stat.prime_time_win else 3

        return round(points, 2)

    @staticmethod
    def get_bonus_points(bonus_type: BonusType) -> float:
        """
        Get points for season bonuses.

        Scoring:
        - MVP = 50 points
        - MVP Runner-Up = 40 points
        - MVP 3rd Place = 30 points
        - MVP 4th Place = 20 points
        - MVP 5th Place = 10 points
        - Rookie of the Year = 30 points
        - Conference POW = 10 points
        - Conference POM = 20 points
        """
        bonus_points = {
            BonusType.MVP: 50.0,
            BonusType.MVP_RUNNER_UP: 40.0,
            BonusType.MVP_3RD: 30.0,
            BonusType.MVP_4TH: 20.0,
            BonusType.MVP_5TH: 10.0,
            BonusType.ROOKIE_OF_YEAR: 30.0,
            BonusType.CONF_POW: 10.0,
            BonusType.CONF_POM: 20.0,
        }
        return bonus_points.get(bonus_type, 0.0)

    @staticmethod
    def get_playoff_points(round: PlayoffRound, won_super_bowl: bool = False) -> float:
        """
        Get points for playoff appearances (cumulative).

        Scoring:
        - Wild Card Appearance = 3 points
        - Divisional Round Appearance = 6 points
        - Conference Championship Appearance = 10 points
        - Super Bowl Appearance = 15 points
        - Super Bowl Win = 25 points (additional)
        """
        round_points = {
            PlayoffRound.WILD_CARD: 3.0,
            PlayoffRound.DIVISIONAL: 6.0,
            PlayoffRound.CONF_CHAMPIONSHIP: 10.0,
            PlayoffRound.SUPER_BOWL: 15.0,
        }

        points = round_points.get(round, 0.0)

        # Add Super Bowl win bonus
        if round == PlayoffRound.SUPER_BOWL and won_super_bowl:
            points += 25.0

        return points
