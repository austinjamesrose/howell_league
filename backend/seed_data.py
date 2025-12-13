"""
Seed script to populate the database with actual 2024 season rosters.
"""
from app.database.config import SessionLocal, engine
from app.models.models import Base, Squad, Quarterback, WeeklyStat

# Create all tables
Base.metadata.create_all(bind=engine)

# Season
SEASON = 2025

# Actual league rosters from current_rosters.png
ROSTERS = {
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
            {"name": "Derek Carr", "nfl_team": "NO"},  # Retired May 2025
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
    }
}

def seed_database():
    db = SessionLocal()

    try:
        # Clear existing data
        print("Clearing existing data...")
        db.query(WeeklyStat).delete()
        db.query(Quarterback).delete()
        db.query(Squad).delete()
        db.commit()

        # Create squads and assign QBs
        print(f"Creating squads and rosters for {SEASON} season...")

        for team_name, team_data in ROSTERS.items():
            # Create squad
            squad = Squad(
                name=team_name,
                owner=team_data["owner"],
                season=SEASON
            )
            db.add(squad)
            db.flush()  # Get squad ID

            print(f"\n{team_name} ({team_data['owner']}):")

            # Add QBs to squad
            for qb_data in team_data["qbs"]:
                qb = Quarterback(
                    name=qb_data["name"],
                    nfl_team=qb_data["nfl_team"],
                    squad_id=squad.id,
                    season=SEASON
                )
                db.add(qb)
                print(f"  - {qb_data['name']} ({qb_data['nfl_team']})")

        db.commit()

        print("\n" + "="*60)
        print("✅ Database seeded successfully with 2024 rosters!")
        print("="*60)
        print(f"\nSquads: 6")
        print(f"Total QBs: {sum(len(team['qbs']) for team in ROSTERS.values())}")
        print("\n⚠️  Note: No stats have been added yet.")
        print("   Use the Admin panel to add weekly stats and bonuses.")

    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
