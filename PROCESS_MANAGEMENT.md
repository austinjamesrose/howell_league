# Process Management Guide

This guide explains how to start, stop, and manage the Howell League application on your local machine.

## Overview

The application has two separate processes that must both be running:
1. **Backend** (Python/FastAPI) - Runs on `http://localhost:8000`
2. **Frontend** (React/Vite) - Runs on `http://localhost:5173`

## Starting the Application

### First Time Setup

#### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment (one time only)
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # Mac/Linux
# OR
venv\Scripts\activate  # Windows

# Install dependencies (one time only)
pip install -r requirements.txt

# Seed the database with sample data (one time only)
python seed_data.py
```

#### Frontend Setup
```bash
# Navigate to frontend directory (open a new terminal window)
cd frontend

# Install dependencies (one time only)
npm install
```

### Starting the Processes (Every Time)

You'll need **two terminal windows/tabs** open:

#### Terminal 1: Start Backend
```bash
cd backend
source venv/bin/activate  # Mac/Linux
# OR
venv\Scripts\activate  # Windows

uvicorn app.main:app --reload
```

**You'll see:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
```

**Backend is ready when you see:** `Application startup complete.`

#### Terminal 2: Start Frontend
```bash
cd frontend
npm run dev
```

**You'll see:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Frontend is ready!** Open `http://localhost:5173` in your browser.

## Stopping the Application

### Graceful Shutdown

In each terminal window, press:
```
Ctrl + C
```

This will:
- ✅ Save any pending database changes
- ✅ Close connections properly
- ✅ Free up the ports (8000 and 5173)

### What Happens When You Stop
- The web app becomes inaccessible
- Your data is **safe** - the SQLite database file persists
- You can restart anytime and pick up where you left off

## Process States

### Running Normally
- Backend terminal shows: `INFO:     127.0.0.1:xxxxx - "GET /api/..."`
- Frontend terminal shows: No output (quiet unless there are errors)
- Browser: App loads and works

### Stopped
- Terminals show: Command prompt is ready
- Browser: "Cannot connect" or "Connection refused" errors

### Crashed (Error State)
- Terminal shows: Error messages in red
- Browser: May show error or fail to load
- Fix: Check error message, fix issue, restart process

## Common Workflows

### Starting Fresh Each Day
```bash
# Terminal 1
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

# Terminal 2 (new window)
cd frontend
npm run dev

# Open browser to http://localhost:5173
```

### Stopping at End of Day
```bash
# In each terminal window:
Ctrl + C

# Optional: Deactivate Python virtual environment
deactivate
```

### Quick Restart (After Code Changes)
Both processes auto-reload when files change:
- **Backend**: Auto-reloads on `.py` file changes (thanks to `--reload` flag)
- **Frontend**: Auto-reloads on `.jsx`, `.js`, `.css` file changes

If auto-reload doesn't work:
```bash
# Stop with Ctrl+C
# Restart with same commands as above
```

## Troubleshooting

### "Address already in use" Error

**Backend (Port 8000)**
```bash
# Find what's using port 8000
lsof -ti:8000  # Mac/Linux
netstat -ano | findstr :8000  # Windows

# Kill the process
kill -9 <PID>  # Mac/Linux (use PID from above)
taskkill /PID <PID> /F  # Windows
```

**Frontend (Port 5173)**
```bash
# Find what's using port 5173
lsof -ti:5173  # Mac/Linux
netstat -ano | findstr :5173  # Windows

# Kill the process
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows
```

### Backend Won't Start

**Check Python virtual environment is activated:**
```bash
which python  # Mac/Linux - should show path with 'venv'
where python  # Windows - should show path with 'venv'
```

**Reinstall dependencies:**
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### Frontend Won't Start

**Clear node_modules and reinstall:**
```bash
cd frontend
rm -rf node_modules  # Mac/Linux
rmdir /s node_modules  # Windows
npm install
```

### Database Issues

**Reset database with fresh data:**
```bash
cd backend
source venv/bin/activate
rm howell_league.db  # Delete existing database
python seed_data.py  # Create fresh database
```

### Frontend Can't Connect to Backend

**Check backend is running:**
- Look for `http://127.0.0.1:8000` in backend terminal
- Visit `http://localhost:8000/docs` in browser
- Should see FastAPI documentation page

**Check CORS settings:**
- Backend is configured to allow `http://localhost:5173`
- If you change frontend port, update CORS in `backend/app/main.py`

## Keeping Processes Running

### Run in Background (Optional)

**Mac/Linux:**
```bash
# Backend
cd backend
source venv/bin/activate
nohup uvicorn app.main:app --reload > backend.log 2>&1 &

# Frontend
cd frontend
nohup npm run dev > frontend.log 2>&1 &

# Stop background processes later
pkill -f uvicorn
pkill -f vite
```

**Not recommended for development** - harder to see errors and debug.

### Leave Terminal Windows Open
**Best practice:**
- Keep two terminal windows visible
- See errors immediately
- Easy to stop with Ctrl+C
- Good for development

## Daily Usage Checklist

### Starting Up
- [ ] Open two terminal windows
- [ ] Start backend (Terminal 1)
- [ ] Wait for "Application startup complete"
- [ ] Start frontend (Terminal 2)
- [ ] Wait for "ready in" message
- [ ] Open `http://localhost:5173` in browser

### Working
- [ ] Leave both terminals running
- [ ] Make changes to code (auto-reloads)
- [ ] Check terminals for errors

### Shutting Down
- [ ] Save any work in progress
- [ ] Press Ctrl+C in backend terminal
- [ ] Press Ctrl+C in frontend terminal
- [ ] Close browser tab (optional)
- [ ] Data is automatically saved

## Quick Reference

| Task | Command |
|------|---------|
| Start backend | `cd backend && source venv/bin/activate && uvicorn app.main:app --reload` |
| Start frontend | `cd frontend && npm run dev` |
| Stop either | `Ctrl + C` |
| Backend URL | http://localhost:8000 |
| Frontend URL | http://localhost:5173 |
| API Docs | http://localhost:8000/docs |
| Reset database | `rm howell_league.db && python seed_data.py` |

## Need Help?

Common issues:
1. **Ports in use**: Kill existing processes (see Troubleshooting)
2. **Module not found**: Reinstall dependencies
3. **Database locked**: Close all processes, restart
4. **Connection refused**: Make sure both processes are running

Still stuck? Check the error message in the terminal - it usually tells you what's wrong!
