"""
Weekly score sync, run by the Railway cron service "score-sync".

Calls the backend's two sync endpoints in order: season stats, then QB wins.
Railway cron runs in UTC, so the service is scheduled at both 12:00 and 13:00
UTC on Tuesdays and this script only proceeds when it is 8 AM in New York.
That keeps the run at 8 AM Eastern through daylight saving changes.
"""
import json
import os
import sys
import urllib.request
from datetime import datetime
from zoneinfo import ZoneInfo

API_URL = os.getenv("API_URL", "https://howellleague-production.up.railway.app").rstrip("/")
LOCAL_HOUR = 8
EASTERN = ZoneInfo("America/New_York")


def current_season(now):
    """NFL season year: Jan/Feb games belong to the previous year's season."""
    return now.year if now.month >= 3 else now.year - 1


def post(path, season):
    url = f"{API_URL}{path}?season={season}"
    req = urllib.request.Request(url, method="POST", data=b"")
    with urllib.request.urlopen(req, timeout=300) as resp:
        return json.loads(resp.read())


def main():
    now = datetime.now(EASTERN)
    force = os.getenv("FORCE_SYNC") == "1"

    if not force and now.hour != LOCAL_HOUR:
        print(f"{now:%Y-%m-%d %H:%M %Z}: not {LOCAL_HOUR} AM Eastern, skipping")
        return 0
    if not force and 3 <= now.month <= 8:
        print(f"{now:%Y-%m-%d %H:%M %Z}: off-season, skipping")
        return 0

    season = current_season(now)
    print(f"{now:%Y-%m-%d %H:%M %Z}: syncing {season} season")
    try:
        print("stats:", post("/api/admin/sync-stats/", season))
        print("wins:", post("/api/admin/sync-wins/", season))
    except Exception as e:
        print(f"sync failed: {e}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
