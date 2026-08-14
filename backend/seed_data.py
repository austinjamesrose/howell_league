"""
Seed script to populate the database with 2026 season rosters.

This is ADDITIVE and season-scoped: it only clears/reseeds the target SEASON,
so prior seasons (e.g. 2025) are preserved for historical browsing.
"""
from app.database.config import SessionLocal, engine
from app.models.models import Base, Squad, Quarterback, WeeklyStat

# Create all tables
Base.metadata.create_all(bind=engine)

# Season
SEASON = 2026

# 2026 league rosters (post Rookie/FA Draft).
# NOTE: nfl_team is display-only. NFL stat/win sync matches QBs by NAME, so
# these abbreviations do not affect scoring. Names use the spellings that
# match nflreadpy's player_display_name (e.g. "C.J. Stroud", "J.J. McCarthy",
# "Jaxson Dart") so the auto-sync can find them.
# "TBD" = 2026 rookie whose NFL team still needs confirmation.
ROSTERS = {
    "Team AP": {
        "owner": "Austin Poncelet",
        "qbs": [
            {"name": "Justin Herbert", "nfl_team": "LAC"},
            {"name": "Baker Mayfield", "nfl_team": "TB"},
            {"name": "Tua Tagovailoa", "nfl_team": "MIA"},
            {"name": "C.J. Stroud", "nfl_team": "HOU"},
            {"name": "Joe Flacco", "nfl_team": "CIN"},
            {"name": "Bo Nix", "nfl_team": "DEN"},
            {"name": "Malik Willis", "nfl_team": "GB"},
            {"name": "Mason Rudolph", "nfl_team": "PIT"},
        ]
    },
    "Team Jar-Jar": {
        "owner": "Brad Foster",
        "qbs": [
            {"name": "Patrick Mahomes", "nfl_team": "KC"},
            {"name": "Jalen Hurts", "nfl_team": "PHI"},
            {"name": "Trevor Lawrence", "nfl_team": "JAX"},
            {"name": "Brock Purdy", "nfl_team": "SF"},
            {"name": "Michael Penix Jr.", "nfl_team": "ATL"},
            {"name": "Jaxson Dart", "nfl_team": "NYG"},
            {"name": "Mac Jones", "nfl_team": "SF"},
            {"name": "Justin Fields", "nfl_team": "NYJ"},
        ]
    },
    "Team Mojo": {
        "owner": "Marc Orlando",
        "qbs": [
            {"name": "Josh Allen", "nfl_team": "BUF"},
            {"name": "Geno Smith", "nfl_team": "NYJ"},
            {"name": "Cam Ward", "nfl_team": "TEN"},
            {"name": "Drake Maye", "nfl_team": "NE"},
            {"name": "Shedeur Sanders", "nfl_team": "CLE"},
            {"name": "Deshaun Watson", "nfl_team": "CLE"},
            {"name": "Carson Beck", "nfl_team": "ARI"},
            {"name": "Jacoby Brissett", "nfl_team": "ARI"},
        ]
    },
    "Team BMOC": {
        "owner": "Sean McLaughlin",
        "qbs": [
            {"name": "Bryce Young", "nfl_team": "CAR"},
            {"name": "Matthew Stafford", "nfl_team": "LAR"},
            {"name": "Aaron Rodgers", "nfl_team": "PIT"},
            {"name": "Sam Darnold", "nfl_team": "SEA"},
            {"name": "Tyler Shough", "nfl_team": "NO"},
            {"name": "Caleb Williams", "nfl_team": "CHI"},
            {"name": "Drew Allar", "nfl_team": "PIT"},
            {"name": "Spencer Rattler", "nfl_team": "NO"},
        ]
    },
    "Team TK": {
        "owner": "Tyler Krieger",
        "qbs": [
            {"name": "Joe Burrow", "nfl_team": "CIN"},
            {"name": "Lamar Jackson", "nfl_team": "BAL"},
            {"name": "Jared Goff", "nfl_team": "DET"},
            {"name": "Daniel Jones", "nfl_team": "IND"},
            {"name": "Dillon Gabriel", "nfl_team": "CLE"},
            {"name": "J.J. McCarthy", "nfl_team": "MIN"},
            {"name": "Ty Simpson", "nfl_team": "LAR"},
            {"name": "Cade Klubnik", "nfl_team": "NYJ"},
        ]
    },
    "Team Rose": {
        "owner": "Austin Rose",
        "qbs": [
            {"name": "Dak Prescott", "nfl_team": "DAL"},
            {"name": "Kyler Murray", "nfl_team": "ARI"},
            {"name": "Jordan Love", "nfl_team": "GB"},
            {"name": "Jayden Daniels", "nfl_team": "WAS"},
            {"name": "Will Howard", "nfl_team": "PIT"},
            {"name": "Fernando Mendoza", "nfl_team": "LV"},
            {"name": "Kirk Cousins", "nfl_team": "LV"},
            {"name": "Davis Mills", "nfl_team": "HOU"},
        ]
    }
}

def seed_database():
    db = SessionLocal()

    try:
        # Clear existing data for THIS SEASON ONLY (preserve prior seasons)
        print(f"Clearing existing {SEASON} data (prior seasons preserved)...")
        season_qb_ids = [
            qb.id for qb in db.query(Quarterback).filter(Quarterback.season == SEASON).all()
        ]
        if season_qb_ids:
            db.query(WeeklyStat).filter(WeeklyStat.qb_id.in_(season_qb_ids)).delete(
                synchronize_session=False
            )
        db.query(Quarterback).filter(Quarterback.season == SEASON).delete(
            synchronize_session=False
        )
        db.query(Squad).filter(Squad.season == SEASON).delete(synchronize_session=False)
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
        print(f"✅ Database seeded successfully with {SEASON} rosters!")
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
