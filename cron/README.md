# Weekly score sync

Railway cron service `score-sync` (root directory `/cron`) runs
`python sync_scores.py` on schedule `0 12,13 * * 2` (Tuesdays, UTC). The script
only syncs at 8 AM America/New_York, so exactly one of the two runs does the
work whether daylight saving is in effect or not. It skips March through August.

It calls `/api/admin/sync-stats/` then `/api/admin/sync-wins/` for the current
season. Both are safe to repeat. Set `FORCE_SYNC=1` to run it outside the window,
and `API_URL` to point it at another backend.
