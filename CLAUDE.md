# Howell League - Development Log

## Project Overview
A web application for managing the Howell League - a QB-only fantasy football league with custom scoring rules.

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Python + FastAPI
- **Database**: SQLite
- **NFL Stats**: nflreadpy (replaces deprecated nfl-data-py)
- **Structure**: Monorepo

## League Details
- **6 Teams** (Squads)
- **8 QBs per team** (48 total)
- **Scoring**: Season aggregate (not weekly)
- **Standings**: Based on top 5 QBs per squad
- **Season**: 2025
- **League Dues**: $70 per team (2025 season)

### Teams
1. Team AP - Austin Poncelet
2. Team Jar-Jar - Brad Foster
3. Team Mojo - Marc Orlando
4. Team BMOC - Sean McLaughlin
5. Team TK - Tyler Krieger
6. Team Rose - Austin Rose

## Completed Features

### Backend (Python/FastAPI)
- ✅ Database models for Squads, Quarterbacks, WeeklyStats, SeasonBonuses, PlayoffAppearances
- ✅ Custom scoring engine based on league rules (league_rules.md)
- ✅ Standings service with projected payout calculations
- ✅ NFL stats integration using nflreadpy
- ✅ Automated win tracking from NFL game results
- ✅ API endpoints:
  - `/api/standings/` - League standings with projected payouts (top 5 QBs count)
  - `/api/standings/worst-qb/` - Worst QB callout (for league naming tradition)
  - `/api/squads/` - All squads with points
  - `/api/squads/{id}/roster/` - Squad roster (8 QBs, top 5 highlighted)
  - `/api/quarterbacks/` - All QBs with stats
  - `/api/quarterbacks/{id}/` - QB details with scoring breakdown
  - `/api/admin/weekly-stats/` - Manual stat entry
  - `/api/admin/bonuses/` - Manual bonus entry (MVP, Rookie of Year, etc.)
  - `/api/admin/playoffs/` - Manual playoff appearance entry
  - `/api/admin/sync-stats/` - Auto-sync season aggregate stats ✅ WORKING
  - `/api/admin/sync-wins/` - Auto-sync QB wins from game results ✅ WORKING
  - `/api/admin/debug-nfl-columns/` - Debug endpoint for NFL data

### Frontend (React)
- ✅ Homepage with league standings + "Worst QB" callout + Projected Payouts
- ✅ Rosters page - View all squad rosters with top 5 indicators
- ✅ Player Standings page - All QBs ranked by total points
- ✅ QB Details page - Full scoring breakdown
- ✅ Admin Panel with tabs:
  - **Sync Stats** - Auto-sync NFL season stats (yards, TDs, INTs, fumbles) ✅
  - **Sync Wins** - Auto-sync QB wins with prime time detection ✅
  - **Manual Entry** - Add weekly stats manually
  - **Bonuses** - Add season bonuses
  - **Playoffs** - Add playoff appearances

## Scoring System (from league_rules.md)

### Stats-Based Scoring
- 25 passing yards = 1 point
- 10 rushing yards = 1 point
- Touchdowns (any type) = 6 points
- Interceptions = -3 points ✅ VERIFIED WORKING
- Fumbles = -3 points ✅ VERIFIED WORKING
- Regular season wins = 3 points
- Prime time wins = 4 points (+1 bonus for games starting 5 PM or later)

### Bonuses
- MVP: 50, 40, 30, 20, 10 (1st through 5th)
- Rookie of the Year: 30
- Conference POW: 10
- Conference POM: 20

### Playoffs (Cumulative)
- Wild Card: 3
- Divisional: 6
- Conference Championship: 10
- Super Bowl: 15
- Super Bowl Win: +25

### Payout Structure (Section 2 of league_rules.md)
- **1st place**: Receives all dues = +$420
- **2nd place**: Doesn't pay = $0
- **3rd-5th place**: Pay dues = -$70 each
- **6th place**: Pays 3x dues = -$210

## Current Status - FULLY FUNCTIONAL ✅

### What's Working
- ✅ Database seeded with 6 teams and 48 QBs (2025 rosters with correct NFL teams)
- ✅ Backend API running on http://localhost:8000
- ✅ Frontend running on http://localhost:5173
- ✅ **NFL Stats Auto-Sync**: 43 out of 48 QBs synced with 2025 season data
- ✅ **Win Tracking Auto-Sync**: 190 wins synced from 209 completed games
- ✅ **Projected Payouts**: Displayed on standings page with color coding
- ✅ All views displaying correctly with real data
- ✅ Manual data entry fully functional
- ✅ Scoring calculations verified and working correctly

### 2025 Season Stats (Current)
- **Total QBs with stats**: 43 out of 48
- **Total wins synced**: 190 wins
- **Games checked**: 209 completed games
- **Prime time detection**: Working (games 5 PM or later = 4 pts)

**QBs without stats** (5 total):
- Kyle McCord (PHI) - Practice squad/limited play
- Deshaun Watson (CLE) - IR/PUP all season
- Will Levis (TEN) - Limited playing time
- Derek Carr (NO) - Retired May 2025
- Will Howard (PIT) - Rookie backup, minimal snaps

## NFL Data Integration - COMPLETE ✅

### Stats Sync (nflreadpy)
**Package**: `nflreadpy` (replaced deprecated `nfl-data-py`)

**What it does**:
1. Uses `load_player_stats(seasons=[2025], summary_level="reg")` for season totals
2. Filters to QB position only
3. Matches player names to our roster
4. Syncs: passing yards, rushing yards, passing TDs, rushing TDs, interceptions, fumbles
5. Stores as `week=0` in WeeklyStat table (season aggregate)
6. Auto-calculates points using scoring engine

**How to use**: Click "🔄 Sync Stats from NFL" in Admin panel

**Data source**: https://github.com/nflverse/nflverse-data

### Win Tracking (nflreadpy)
**Package**: `nflreadpy` via `load_schedules()`

**What it does**:
1. Loads NFL schedule/game results for the season
2. Filters to completed regular season games only
3. Identifies winning team and **starting QB only** (via `home_qb_name`/`away_qb_name`)
4. Determines if prime time (game time >= 17:00/5 PM)
5. Awards 3 points for regular wins, 4 points for prime time wins
6. Creates weekly stat entries with `game_won=True`
7. Avoids duplicates (safe to run multiple times)

**How to use**: Click "🏆 Sync QB Wins from Game Results" in Admin panel

**Prime time detection**: Games starting at 17:00 (5 PM) or later

**Example**: Jalen Hurts - 8 wins (5 day + 3 prime time) = 27 points

## Name Matching Issues - RESOLVED ✅

### Fixed Names
The following QBs had name mismatches between our database and NFL data:

1. **Jaxon Dart** → **Jaxson Dart** (NYG) - Added 's' to spelling
2. **JJ McCarthy** → **J.J. McCarthy** (MIN) - Added periods
3. **Joe Milton** → **Joe Milton III** (DAL) - Added III suffix and corrected team (was NE)

### Matching Strategy
- Primary match: `player_display_name` field from nflreadpy
- Fallback match: `player_name` field
- Only syncs QBs that are on our roster

## File Structure

```
howell_league/
├── backend/
│   ├── app/
│   │   ├── database/
│   │   │   └── config.py              # Database setup
│   │   ├── models/
│   │   │   └── models.py               # SQLAlchemy models
│   │   ├── routers/
│   │   │   ├── standings.py           # Standings endpoints (with payouts)
│   │   │   ├── squads.py              # Squad endpoints
│   │   │   ├── quarterbacks.py        # QB endpoints
│   │   │   └── admin.py               # Admin endpoints (sync-stats, sync-wins)
│   │   ├── services/
│   │   │   ├── scoring.py             # Scoring calculation engine
│   │   │   ├── standings.py           # Standings + payout calculations
│   │   │   └── nfl_stats.py           # NFL API integration (nflreadpy)
│   │   └── main.py                    # FastAPI app
│   ├── requirements.txt               # Python dependencies
│   ├── seed_data.py                   # Database seeding script (2025 rosters)
│   └── howell_league.db               # SQLite database
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.jsx             # Navigation layout
│   │   ├── pages/
│   │   │   ├── Home.jsx               # Standings + Worst QB + Payouts
│   │   │   ├── Rosters.jsx            # Squad rosters
│   │   │   ├── PlayerStandings.jsx    # All QBs ranked
│   │   │   ├── QBDetails.jsx          # QB scoring breakdown
│   │   │   └── Admin.jsx              # Admin panel (2 sync buttons)
│   │   ├── services/
│   │   │   └── api.js                 # API client
│   │   ├── App.jsx                    # Main app + routing
│   │   └── index.css                  # Tailwind styles
│   └── package.json                   # Node dependencies
├── league_rules.md                    # Official league rules
├── PROJECT_PLAN.md                    # Development plan
├── PROCESS_MANAGEMENT.md              # How to run the app
├── README.md                          # Project documentation
└── CLAUDE.md                          # This file
```

## How to Run

### Start Backend
```bash
cd /Users/austin/playground/howell_league/backend
source venv/bin/activate
uvicorn app.main:app --reload
```
Backend runs at http://localhost:8000
API Docs at http://localhost:8000/docs

### Start Frontend
```bash
cd /Users/austin/playground/howell_league/frontend
npm run dev
```
Frontend runs at http://localhost:5173

### Reseed Database (if needed)
```bash
cd /Users/austin/playground/howell_league/backend
source venv/bin/activate
python seed_data.py
```

### Sync 2025 Stats
1. Ensure both backend and frontend are running
2. Go to http://localhost:5173/admin
3. Click "🔄 Sync Stats from NFL" (for yards, TDs, etc.)
4. Click "🏆 Sync QB Wins from Game Results" (for win bonuses)
5. Check standings at http://localhost:5173

## Important Notes

### Database
- Uses `week=0` to represent season aggregate stats
- Individual game wins stored as separate weekly stat entries
- WeeklyStat table stores both game-by-game wins and season totals
- Only top 5 QBs per squad count toward standings
- Bonuses and playoff points stored in separate tables

### NFL Data (nflreadpy)
- 2025 season data is AVAILABLE and WORKING ✅
- Data updates automatically as games complete
- 24-48 hour delay typical for current season
- Season aggregate stats: `load_player_stats(summary_level="reg")`
- Game results: `load_schedules(seasons=[2025])`
- Starting QBs identified via `home_qb_name` and `away_qb_name` fields

### Scoring
- Points auto-calculate based on stats
- Interceptions: -3 points each (VERIFIED ✅)
- Fumbles: -3 points each (VERIFIED ✅)
- Win bonuses: 3 points regular, 4 points prime time (AUTO-SYNCED ✅)
- Season bonuses (MVP, etc.) require manual entry
- Playoff appearances require manual entry

### API Trailing Slashes
- All API endpoints require trailing slashes (FastAPI 307 redirects without them)
- Frontend API client updated to include trailing slashes on all calls

## Troubleshooting

### Backend won't start
- Check Python version (need 3.9+, not 3.14)
- Ensure venv is activated
- Install dependencies: `pip install -r requirements.txt`
- Required packages: fastapi, uvicorn, sqlalchemy, nflreadpy, pyarrow

### Frontend shows blank
- Check both backend AND frontend are running
- Verify database has 2025 data (not 2024): `python -c "from app.database.config import SessionLocal; from app.models.models import Squad; db = SessionLocal(); print(f'Squads: {db.query(Squad).filter(Squad.season == 2025).count()}'); db.close()"`
- Check browser console for errors
- Verify API is returning data: `curl http://localhost:8000/api/standings/`

### Stats sync fails
- Check backend terminal for Python errors
- Verify nflreadpy is installed: `pip show nflreadpy`
- Check `/api/admin/debug-nfl-columns/` for data structure
- 2025 data is working, but may have delays during live season

### Win sync issues
- Ensure stats are synced first (provides base stats for QBs)
- Check that QB names match NFL data (see Name Matching section)
- Verify game results are available for the season
- Safe to run multiple times (won't create duplicates)

### Port conflicts
- Backend uses 8000, frontend uses 5173
- Kill existing processes if "address already in use"
- See PROCESS_MANAGEMENT.md for details

## Dependencies

### Backend (requirements.txt)
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
pydantic>=2.4.2
python-dotenv==1.0.0
requests==2.31.0
nflreadpy
pyarrow
```

### Frontend (package.json)
- React 18
- Vite
- Tailwind CSS
- React Router

## Contact Points

- League Rules: `league_rules.md`
- Process Management: `PROCESS_MANAGEMENT.md`
- Project Plan: `PROJECT_PLAN.md`
- API Docs: http://localhost:8000/docs (when backend running)

## Recent Changes (Session End)

**Date**: December 12, 2025

### Completed This Session ✅

1. **Fixed Blank Displays**
   - Database had 2024 data but API was looking for 2025
   - Reseeded database with 2025 season data
   - Fixed trailing slash issues in all frontend API calls

2. **Updated NFL Team Mappings**
   - All 48 QBs updated to correct 2025 NFL teams
   - Fixed via web search for current rosters
   - Key changes: Russell Wilson (PIT→NYG), Justin Fields (PIT→NYJ), Sam Darnold (MIN→SEA), and many others

3. **Fixed Name Matching Issues**
   - Jaxon Dart → Jaxson Dart
   - JJ McCarthy → J.J. McCarthy
   - Joe Milton → Joe Milton III (also corrected team NE→DAL)

4. **Replaced nfl-data-py with nflreadpy**
   - Modern, actively maintained package
   - Better data structure with player names included
   - Season totals via `summary_level="reg"`
   - Successfully synced 43 out of 48 QBs

5. **Added Projected Payout Column**
   - Displays on standings page between Owner and Points
   - Color-coded: Green (+$420), Gray ($0), Red (-$70, -$210)
   - Based on league rules payout structure
   - Calculates automatically based on current rank

6. **Implemented Automated Win Tracking**
   - New `sync_qb_wins()` service method
   - Reads NFL game results from `load_schedules()`
   - Credits wins ONLY to starting QBs
   - Prime time detection (games 5 PM or later = 4 pts)
   - Successfully synced 190 wins from 209 games
   - New green "Sync Wins" button in Admin panel

7. **Verified Scoring Calculations**
   - Confirmed -3 points per interception ✅
   - Confirmed -3 points per fumble ✅
   - Tested with real data (Justin Herbert: 11 INTs = -33 pts)

### Current Stats (2025 Season)
- **43/48 QBs** have season aggregate stats
- **190 wins** synced from game results
- **Team BMOC** leading with 1,325.24 points (+$420 projected)
- **Team Jar-Jar** in 2nd with 1,233.00 points ($0 projected)

### What's Not Automated (Manual Entry Required)
- Season bonuses (MVP, Rookie of Year, Conference POW/POM)
- Playoff appearances (Wild Card through Super Bowl)
- Historical season data (currently only 2025)

### Next Session Recommendations
1. Consider adding a "Sync All" button that runs both stats and wins sync
2. Add historical season support (2024, 2023, etc.)
3. Consider adding a dashboard showing sync status and last sync time
4. Add draft management features
5. Add trade processing functionality