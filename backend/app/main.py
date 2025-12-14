from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.config import engine, Base
from app.routers import standings, squads, quarterbacks, admin
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Howell League API",
    description="Fantasy Football League API for QB-only league",
    version="1.0.0"
)

# Configure CORS for frontend
# Allow Railway frontend URL from environment variable
allowed_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://dill-qb-league.up.railway.app"
]
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url and frontend_url not in allowed_origins:
    allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(standings.router)
app.include_router(squads.router)
app.include_router(quarterbacks.router)
app.include_router(admin.router)

@app.get("/")
def root():
    return {
        "message": "Welcome to the Howell League API",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
