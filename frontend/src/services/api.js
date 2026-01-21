const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = {
  // Standings
  getStandings: async (season = 2025) => {
    const response = await fetch(`${API_BASE_URL}/api/standings/?season=${season}`);
    return response.json();
  },

  getWorstQB: async (season = 2025) => {
    const response = await fetch(`${API_BASE_URL}/api/standings/worst-qb/?season=${season}`);
    return response.json();
  },

  // Squads
  getSquads: async (season = 2025) => {
    const response = await fetch(`${API_BASE_URL}/api/squads/?season=${season}`);
    return response.json();
  },

  getSquadRoster: async (squadId) => {
    const response = await fetch(`${API_BASE_URL}/api/squads/${squadId}/roster/`);
    return response.json();
  },

  // Quarterbacks
  getQuarterbacks: async (season = 2025) => {
    const response = await fetch(`${API_BASE_URL}/api/quarterbacks/?season=${season}`);
    return response.json();
  },

  getQuarterbackDetails: async (qbId) => {
    const response = await fetch(`${API_BASE_URL}/api/quarterbacks/${qbId}/`);
    return response.json();
  },

  // Admin
  addWeeklyStat: async (statData) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/weekly-stats/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(statData),
    });
    return response.json();
  },

  addBonus: async (bonusData) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/bonuses/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bonusData),
    });
    return response.json();
  },

  addPlayoffAppearance: async (playoffData) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/playoffs/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playoffData),
    });
    return response.json();
  },

  syncNFLStats: async (season = 2025) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/sync-stats/?season=${season}`, {
      method: 'POST',
    });
    return response.json();
  },

  syncQBWins: async (season = 2025) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/sync-wins/?season=${season}`, {
      method: 'POST',
    });
    return response.json();
  },

  syncPlayoffs: async (season = 2025) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/sync-playoffs/?season=${season}`, {
      method: 'POST',
    });
    return response.json();
  },

  seedAwards: async (season = 2025) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/seed-awards/?season=${season}`, {
      method: 'POST',
    });
    return response.json();
  },
};
