# Fantasy Football League Web Application - Project Plan

## Overview
Building a web application for the Howell League (QB-only fantasy football league) with the following features:
- Check league standings (top 5 QBs per squad count)
- View current rosters (8 QBs per squad)
- See individual QB scores with detailed stat breakdowns

## League Details
- **League Size**: 6 squads
- **Roster Size**: 8 QBs per squad
- **Scoring**: Only top 5 QBs count toward final standings
- **Data Entry**: API integration to pull NFL stats and calculate points
- **History**: Track current season, preserve data for future seasons

## Tech Stack
- **Frontend**: React + Tailwind CSS
- **Backend**: Python + FastAPI
- **Database**: SQLite
- **Structure**: Monorepo (frontend + backend in one project)

## Project Structure
```
howell_league/
├── backend/          # Python FastAPI application
├── frontend/         # React application
└── README.md         # Project documentation
```

## Tasks

### Backend Setup
- [ ] Initialize Python project with FastAPI
- [ ] Set up SQLite database with proper schema
- [ ] Create database models (Squads, QBs, WeeklyStats, Bonuses, Playoffs)
- [ ] Implement NFL stats API integration
  - [ ] Use free NFL stats API for core stats (yards, TDs, INTs, fumbles, wins)
  - [ ] Create service to fetch and sync QB stats weekly
  - [ ] Implement scoring calculation engine
  - [ ] Manual entry endpoints for bonuses (MVP, POW, POM, playoff appearances)
- [ ] Build API endpoints:
  - [ ] GET /api/standings - Get league standings (top 5 QBs per squad)
  - [ ] GET /api/squads - Get all squads with total points
  - [ ] GET /api/squads/{id}/roster - Get squad roster (8 QBs)
  - [ ] GET /api/quarterbacks - Get all QBs with stats
  - [ ] GET /api/quarterbacks/{id} - Get QB details with full scoring breakdown
  - [ ] POST /api/admin/sync-stats - Trigger NFL stats sync (manual trigger)
  - [ ] POST /api/admin/assign-bonuses - Manually assign MVP/awards

### Frontend Setup
- [ ] Initialize React project with Vite
- [ ] Configure Tailwind CSS
- [ ] Set up React Router for navigation
- [ ] Build layout components:
  - [ ] Navigation header
  - [ ] Page layout wrapper
- [ ] Build feature components:
  - [ ] Homepage - Standings with "Worst QB" callout (lowest scoring QB with >0 points)
  - [ ] Rosters view - Shows all squads with their 8 QBs, highlight top 5
  - [ ] QB details view - Full scoring breakdown per QB
  - [ ] Admin panel - Sync stats, assign bonuses (simple forms)

### Data & Testing
- [ ] Create seed data:
  - [ ] 6 squads with owners
  - [ ] Sample QBs rostered across squads
  - [ ] Mock weekly stats for testing
  - [ ] Sample bonuses and playoff appearances
- [ ] Test scoring calculations
- [ ] Verify top 5 QB selection logic

## Database Schema

### Squads (Teams)
- id (primary key)
- name (squad name)
- owner (owner name)
- season (year)
- total_points (calculated from top 5 QBs)

### Quarterbacks
- id (primary key)
- name
- nfl_team
- squad_id (foreign key, nullable - QBs can be unrostered)
- season

### Weekly Stats
- id (primary key)
- qb_id (foreign key)
- week
- season
- passing_yards
- rushing_yards
- passing_tds
- rushing_tds
- receiving_tds
- interceptions
- fumbles
- game_won (boolean)
- prime_time_win (boolean)
- points (calculated)

### Season Bonuses
- id (primary key)
- qb_id (foreign key)
- season
- bonus_type (MVP, MVP_RUNNER_UP, ROOKIE_OF_YEAR, etc.)
- points

### Playoff Appearances
- id (primary key)
- qb_id (foreign key)
- season
- round (WILD_CARD, DIVISIONAL, CONF_CHAMPIONSHIP, SUPER_BOWL)
- won_super_bowl (boolean)
- points (calculated)

## Scoring System
Based on league_rules.md Section 6.2:
- 25 passing yards = 1 point
- 10 rushing yards = 1 point
- Touchdowns (any type) = 6 points
- Interceptions = -3 points
- Fumbles = -3 points
- Regular season wins = 3 points (+1 for prime time)
- MVP awards (50, 40, 30, 20, 10 for 1st-5th)
- Rookie of the Year = 30 points
- Playoff rounds (cumulative): 3, 6, 10, 15, 25 points
