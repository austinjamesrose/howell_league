const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Helper to handle API responses with proper error checking
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API Error ${response.status}: ${error || response.statusText}`);
  }
  return response.json();
};

export const api = {
  // Standings
  getStandings: async (season = 2025) => {
    const response = await fetch(`${API_BASE_URL}/api/standings/?season=${season}`);
    return handleResponse(response);
  },

  getWorstQB: async (season = 2025) => {
    const response = await fetch(`${API_BASE_URL}/api/standings/worst-qb/?season=${season}`);
    return handleResponse(response);
  },

  // Squads
  getSquads: async (season = 2025) => {
    const response = await fetch(`${API_BASE_URL}/api/squads/?season=${season}`);
    return handleResponse(response);
  },

  getSquadRoster: async (squadId) => {
    const response = await fetch(`${API_BASE_URL}/api/squads/${squadId}/roster/`);
    return handleResponse(response);
  },

  // Quarterbacks
  getQuarterbacks: async (season = 2025) => {
    const response = await fetch(`${API_BASE_URL}/api/quarterbacks/?season=${season}`);
    return handleResponse(response);
  },

  getQuarterbackDetails: async (qbId) => {
    const response = await fetch(`${API_BASE_URL}/api/quarterbacks/${qbId}/`);
    return handleResponse(response);
  },

  // Admin
  addWeeklyStat: async (statData) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/weekly-stats/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(statData),
    });
    return handleResponse(response);
  },

  addBonus: async (bonusData) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/bonuses/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bonusData),
    });
    return handleResponse(response);
  },

  addPlayoffAppearance: async (playoffData) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/playoffs/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(playoffData),
    });
    return handleResponse(response);
  },

  syncNFLStats: async (season = 2025) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/sync-stats/?season=${season}`, {
      method: 'POST',
    });
    return handleResponse(response);
  },

  syncQBWins: async (season = 2025) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/sync-wins/?season=${season}`, {
      method: 'POST',
    });
    return handleResponse(response);
  },

  syncPlayoffs: async (season = 2025) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/sync-playoffs/?season=${season}`, {
      method: 'POST',
    });
    return handleResponse(response);
  },

  seedAwards: async (season = 2025) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/seed-awards/?season=${season}`, {
      method: 'POST',
    });
    return handleResponse(response);
  },
};
