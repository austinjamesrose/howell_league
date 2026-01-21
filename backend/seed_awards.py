"""
Seed script to add 2025 NFL season awards (Player of Week/Month) to the database.
Data sourced from Pro-Football-Reference.com on January 20, 2026.
"""
from app.database.config import SessionLocal
from app.models.models import Quarterback, SeasonBonus, BonusType

SEASON = 2025

# Players of the Week - 10 points each (CONF_POW)
# Only includes QBs that are on league rosters
PLAYERS_OF_WEEK = [
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
# Only includes QBs that are on league rosters
PLAYERS_OF_MONTH = [
    {"name": "Trevor Lawrence", "month": "December"},
    {"name": "Matthew Stafford", "month": "November"},
    {"name": "Matthew Stafford", "month": "December"},
]


def seed_awards():
    db = SessionLocal()

    try:
        # Clear existing POW/POM bonuses for the season
        print("Clearing existing POW/POM bonuses...")
        db.query(SeasonBonus).filter(
            SeasonBonus.season == SEASON,
            SeasonBonus.bonus_type.in_([BonusType.CONF_POW, BonusType.CONF_POM])
        ).delete(synchronize_session=False)
        db.commit()

        pow_count = 0
        pom_count = 0
        pow_points = 0
        pom_points = 0

        # Add Players of the Week
        print("\nAdding Players of the Week (10 pts each)...")
        for award in PLAYERS_OF_WEEK:
            qb = db.query(Quarterback).filter(
                Quarterback.name == award["name"],
                Quarterback.season == SEASON
            ).first()

            if qb:
                bonus = SeasonBonus(
                    qb_id=qb.id,
                    season=SEASON,
                    bonus_type=BonusType.CONF_POW,
                    points=10.0
                )
                db.add(bonus)
                pow_count += 1
                pow_points += 10
                print(f"  + {award['name']} (Week {award['week']}) - 10 pts")
            else:
                print(f"  ! {award['name']} not found in database")

        # Add Players of the Month
        print("\nAdding Players of the Month (20 pts each)...")
        for award in PLAYERS_OF_MONTH:
            qb = db.query(Quarterback).filter(
                Quarterback.name == award["name"],
                Quarterback.season == SEASON
            ).first()

            if qb:
                bonus = SeasonBonus(
                    qb_id=qb.id,
                    season=SEASON,
                    bonus_type=BonusType.CONF_POM,
                    points=20.0
                )
                db.add(bonus)
                pom_count += 1
                pom_points += 20
                print(f"  + {award['name']} ({award['month']}) - 20 pts")
            else:
                print(f"  ! {award['name']} not found in database")

        db.commit()

        print("\n" + "=" * 60)
        print("Awards seeded successfully!")
        print("=" * 60)
        print(f"Players of the Week: {pow_count} awards = {pow_points} total points")
        print(f"Players of the Month: {pom_count} awards = {pom_points} total points")
        print(f"Grand Total: {pow_count + pom_count} awards = {pow_points + pom_points} points")

        # Show breakdown by team
        print("\nPoints by Team:")
        team_points = {}
        for award in PLAYERS_OF_WEEK:
            qb = db.query(Quarterback).filter(
                Quarterback.name == award["name"],
                Quarterback.season == SEASON
            ).first()
            if qb and qb.squad:
                team_points[qb.squad.name] = team_points.get(qb.squad.name, 0) + 10

        for award in PLAYERS_OF_MONTH:
            qb = db.query(Quarterback).filter(
                Quarterback.name == award["name"],
                Quarterback.season == SEASON
            ).first()
            if qb and qb.squad:
                team_points[qb.squad.name] = team_points.get(qb.squad.name, 0) + 20

        for team, points in sorted(team_points.items(), key=lambda x: -x[1]):
            print(f"  {team}: +{points} pts")

    except Exception as e:
        print(f"Error seeding awards: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_awards()
