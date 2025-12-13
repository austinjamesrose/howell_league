# Howell League - Fantasy Football Web Application

A web application for managing the Howell League, a unique QB-only fantasy football league with custom scoring rules.

## Features

- **League Standings** - View real-time standings with only the top 5 QBs per squad counting
- **Worst QB Callout** - Prominently displays the worst performing QB (for league naming tradition)
- **Squad Rosters** - View all 8 QBs rostered by each squad with top 5 indicators
- **QB Details** - Detailed scoring breakdown for each quarterback including:
  - Weekly stats (yards, TDs, INTs, fumbles, wins)
  - Season bonuses (MVP, Rookie of Year, etc.)
  - Playoff appearances (cumulative points)
- **Admin Panel** - Manual data entry for stats, bonuses, and playoff appearances

## League Rules

This league follows unique scoring rules documented in `league_rules.md`:
- 6 squads with 8 QBs each
- Only top 5 QBs count toward final standings
- Custom scoring for stats, bonuses, and playoff performance
- League is renamed after the worst rostered QB each season

## Tech Stack

### Backend
- Python 3.x
- FastAPI - Modern web framework
- SQLAlchemy - ORM for database
- SQLite - Lightweight database
- Custom scoring engine based on league rules

### Frontend
- React - UI library
- Vite - Build tool
- React Router - Navigation
- Tailwind CSS - Styling

## Project Structure

```
howell_league/
├── backend/
│   ├── app/
│   │   ├── database/      # Database configuration
│   │   ├── models/        # SQLAlchemy models
│   │   ├── routers/       # API endpoints
│   │   ├── services/      # Business logic (scoring, standings)
│   │   └── main.py        # FastAPI application
│   ├── requirements.txt   # Python dependencies
│   └── seed_data.py       # Database seeding script
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API client
│   │   └── App.jsx        # Main app component
│   └── package.json       # Node dependencies
├── league_rules.md        # Official league constitution
└── PROJECT_PLAN.md        # Development plan

```

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Seed the database with sample data:
```bash
python seed_data.py
```

5. Start the backend server:
```bash
uvicorn app.main:app --reload
```

The backend API will be available at `http://localhost:8000`

API documentation is available at `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Usage

### Viewing Standings

1. Navigate to the homepage to see:
   - League standings ranked by total points
   - The worst QB callout
   - Top 5 QBs for each squad

### Viewing Rosters

1. Click "Rosters" in the navigation
2. Select a squad to view their 8 QBs
3. Top 5 QBs are highlighted in green
4. Click any QB to see detailed scoring breakdown

### Adding Data (Admin)

1. Click "Admin" in the navigation
2. Choose the data type to add:
   - **Weekly Stats** - Enter yards, TDs, INTs, fumbles, wins
   - **Bonuses** - Assign MVP awards, Rookie of Year, etc.
   - **Playoffs** - Record playoff appearances and Super Bowl wins

Points are automatically calculated based on league rules.

## Database Schema

### Squads
- Squad name, owner, season
- Relationship to quarterbacks

### Quarterbacks
- Name, NFL team, squad assignment
- Relationships to stats, bonuses, playoffs

### Weekly Stats
- Individual game stats with auto-calculated points
- Tracks passing/rushing yards, TDs, turnovers, wins

### Season Bonuses
- MVP awards (1st through 5th place)
- Rookie of the Year
- Conference Player of Week/Month

### Playoff Appearances
- Cumulative points through playoff rounds
- Super Bowl wins tracked separately

## Scoring System

Based on league_rules.md Section 6.2:

| Category | Points |
|----------|--------|
| 25 passing yards | 1 |
| 10 rushing yards | 1 |
| Touchdown (any) | 6 |
| Interception | -3 |
| Fumble | -3 |
| Regular season win | 3 (+1 for prime time) |
| MVP | 50 |
| MVP Runner-Up | 40 |
| MVP 3rd-5th | 30, 20, 10 |
| Rookie of Year | 30 |
| Wild Card appearance | 3 |
| Divisional appearance | 6 |
| Conference Championship | 10 |
| Super Bowl appearance | 15 |
| Super Bowl win | +25 |

## API Endpoints

### Standings
- `GET /api/standings/?season=2024` - Get league standings
- `GET /api/standings/worst-qb?season=2024` - Get worst QB

### Squads
- `GET /api/squads/?season=2024` - Get all squads
- `GET /api/squads/{id}/roster` - Get squad roster

### Quarterbacks
- `GET /api/quarterbacks/?season=2024` - Get all QBs
- `GET /api/quarterbacks/{id}` - Get QB details

### Admin
- `POST /api/admin/weekly-stats` - Add weekly stats
- `POST /api/admin/bonuses` - Add season bonus
- `POST /api/admin/playoffs` - Add playoff appearance

## Future Enhancements

- NFL stats API integration for automatic data sync
- Historical season tracking
- Draft management
- Trade processing
- Mobile responsive improvements
- User authentication
- Real-time updates

## License

Private league application - not for public distribution.
