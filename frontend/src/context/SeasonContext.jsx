import { createContext, useContext, useEffect, useMemo, useState } from 'react';

// Seasons available in the season switcher, newest first.
export const AVAILABLE_SEASONS = [2026, 2025];
export const DEFAULT_SEASON = 2026;

// League dues per season (Section 2 of league_rules.md).
// Dues rise 10% each season, rounded to the nearest $5.
export const DUES_BY_SEASON = {
  2021: 50,
  2022: 55,
  2023: 60,
  2024: 65,
  2025: 70,
  2026: 75,
};

export const getDues = (season) =>
  DUES_BY_SEASON[season] ?? DUES_BY_SEASON[Math.max(...Object.keys(DUES_BY_SEASON).map(Number))];

const STORAGE_KEY = 'selectedSeason';

const SeasonContext = createContext(null);

export function SeasonProvider({ children }) {
  const [season, setSeasonState] = useState(() => {
    const stored = parseInt(localStorage.getItem(STORAGE_KEY), 10);
    return AVAILABLE_SEASONS.includes(stored) ? stored : DEFAULT_SEASON;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(season));
  }, [season]);

  const setSeason = (value) => {
    const next = parseInt(value, 10);
    if (AVAILABLE_SEASONS.includes(next)) {
      setSeasonState(next);
    }
  };

  const value = useMemo(() => {
    const dues = getDues(season);
    return {
      season,
      setSeason,
      seasons: AVAILABLE_SEASONS,
      dues,
      // 1st place collects all dues from losers: 3rd/4th/5th (3x) + 6th (3x) = 6x dues
      prizePool: dues * 6,
      // Last place pays triple dues
      lastPlacePenalty: dues * 3,
    };
  }, [season]);

  return <SeasonContext.Provider value={value}>{children}</SeasonContext.Provider>;
}

export function useSeason() {
  const ctx = useContext(SeasonContext);
  if (!ctx) {
    throw new Error('useSeason must be used within a SeasonProvider');
  }
  return ctx;
}
