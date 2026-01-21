import { useState, useEffect } from 'react';
import { api } from '../services/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function Admin() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [activeTab, setActiveTab] = useState('sync');
  const [qbs, setQBs] = useState([]);
  const [message, setMessage] = useState(null);
  const [syncing, setSyncing] = useState(false);

  // Weekly Stats Form State
  const [weeklyForm, setWeeklyForm] = useState({
    qb_id: '',
    week: 1,
    season: 2025,
    passing_yards: 0,
    rushing_yards: 0,
    passing_tds: 0,
    rushing_tds: 0,
    receiving_tds: 0,
    interceptions: 0,
    fumbles: 0,
    game_won: false,
    prime_time_win: false,
  });

  // Bonus Form State
  const [bonusForm, setBonusForm] = useState({
    qb_id: '',
    season: 2025,
    bonus_type: 'MVP',
  });

  // Playoff Form State
  const [playoffForm, setPlayoffForm] = useState({
    qb_id: '',
    season: 2025,
    round: 'WILD_CARD',
    won_super_bowl: false,
  });

  // Sync Form State
  const [syncForm, setSyncForm] = useState({
    season: 2025,
  });

  useEffect(() => {
    // Check if already authenticated in session
    const authStatus = sessionStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadQBs();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/verify-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        sessionStorage.setItem('adminAuthenticated', 'true');
        setIsAuthenticated(true);
        setPassword('');
      } else {
        setAuthError('Invalid password. Please try again.');
      }
    } catch (err) {
      setAuthError('Failed to authenticate. Please check the backend is running.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    setIsAuthenticated(false);
    setPassword('');
  };

  const loadQBs = async () => {
    try {
      const data = await api.getQuarterbacks();
      setQBs(data.quarterbacks);
    } catch (err) {
      console.error('Failed to load QBs:', err);
    }
  };

  const handleWeeklySubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await api.addWeeklyStat(weeklyForm);
      setMessage({ type: 'success', text: result.message });
      // Reset form
      setWeeklyForm({
        ...weeklyForm,
        passing_yards: 0,
        rushing_yards: 0,
        passing_tds: 0,
        rushing_tds: 0,
        receiving_tds: 0,
        interceptions: 0,
        fumbles: 0,
        game_won: false,
        prime_time_win: false,
      });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to add weekly stats' });
    }
  };

  const handleBonusSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await api.addBonus(bonusForm);
      setMessage({ type: 'success', text: result.message });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to add bonus' });
    }
  };

  const handlePlayoffSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await api.addPlayoffAppearance(playoffForm);
      setMessage({ type: 'success', text: result.message });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to add playoff appearance' });
    }
  };

  const handleSyncStats = async (e) => {
    e.preventDefault();
    try {
      setSyncing(true);
      setMessage({ type: 'info', text: `Syncing season stats for ${syncForm.season}...` });
      const result = await api.syncNFLStats(syncForm.season);
      setMessage({
        type: 'success',
        text: `${result.message} - Created: ${result.created}, Updated: ${result.updated}`
      });
    } catch (err) {
      setMessage({
        type: 'error',
        text: 'Failed to sync stats. The 2025 season data may not be available yet. Try using 2024 data for testing.'
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleSyncWins = async (e) => {
    e.preventDefault();
    try {
      setSyncing(true);
      setMessage({ type: 'info', text: `Syncing QB wins for ${syncForm.season}...` });
      const result = await api.syncQBWins(syncForm.season);
      setMessage({
        type: 'success',
        text: `${result.message} - Wins synced: ${result.total_wins_synced} (${result.games_checked} games checked)`
      });
    } catch (err) {
      setMessage({
        type: 'error',
        text: 'Failed to sync wins. Make sure the season data is available.'
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleSyncPlayoffs = async (e) => {
    e.preventDefault();
    try {
      setSyncing(true);
      setMessage({ type: 'info', text: `Syncing playoff appearances for ${syncForm.season}...` });
      const result = await api.syncPlayoffs(syncForm.season);
      setMessage({
        type: 'success',
        text: `${result.message} - Appearances synced: ${result.total_appearances_synced} (${result.playoff_games_checked} playoff games checked)`
      });
    } catch (err) {
      setMessage({
        type: 'error',
        text: 'Failed to sync playoffs. Make sure the season data is available.'
      });
    } finally {
      setSyncing(false);
    }
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
            <p className="text-gray-600">Enter password to access admin panel</p>
          </div>

          {authError && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded border border-red-400">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter admin password"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className={`w-full py-3 rounded-lg font-medium ${
                isAuthenticating
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isAuthenticating ? 'Authenticating...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Panel</h1>
        <p className="text-gray-600">Manually enter stats, bonuses, and playoff data</p>
        <button
          onClick={handleLogout}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Logout
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700 border border-green-400'
              : 'bg-red-100 text-red-700 border border-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('sync')}
            className={`flex-1 px-6 py-4 font-medium ${
              activeTab === 'sync'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Sync Stats
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`flex-1 px-6 py-4 font-medium ${
              activeTab === 'weekly'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Manual Entry
          </button>
          <button
            onClick={() => setActiveTab('bonus')}
            className={`flex-1 px-6 py-4 font-medium ${
              activeTab === 'bonus'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Bonuses
          </button>
          <button
            onClick={() => setActiveTab('playoff')}
            className={`flex-1 px-6 py-4 font-medium ${
              activeTab === 'playoff'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Playoffs
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'sync' && (
            <form onSubmit={handleSyncStats} className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-blue-900 mb-2">🏈 Auto-Sync Season Stats</h3>
                <p className="text-sm text-blue-700">
                  Automatically pull season aggregate QB stats from NFL data.
                  Stats include total passing/rushing yards, TDs, INTs, and fumbles for the entire season.
                </p>
                <p className="text-sm text-blue-600 mt-2">
                  ⚠️ Note: 2025 season data may have a delay. If sync fails, try 2024 data for testing.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Season
                </label>
                <input
                  type="number"
                  min="2020"
                  max="2025"
                  value={syncForm.season}
                  onChange={(e) =>
                    setSyncForm({ ...syncForm, season: parseInt(e.target.value) })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={syncing}
                className={`w-full py-3 rounded-lg font-medium ${
                  syncing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {syncing ? 'Syncing...' : '🔄 Sync Stats from NFL'}
              </button>

              <button
                type="button"
                onClick={handleSyncWins}
                disabled={syncing}
                className={`w-full py-3 rounded-lg font-medium ${
                  syncing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {syncing ? 'Syncing...' : '🏆 Sync QB Wins from Game Results'}
              </button>

              <button
                type="button"
                onClick={handleSyncPlayoffs}
                disabled={syncing}
                className={`w-full py-3 rounded-lg font-medium ${
                  syncing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                {syncing ? 'Syncing...' : '🏈 Sync Playoff Appearances'}
              </button>

              <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">How it works:</h4>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li><strong>Sync Stats:</strong> Fetches season aggregate stats (yards, TDs, INTs, fumbles)</li>
                  <li><strong>Sync Wins:</strong> Credits wins to starting QBs (3 pts regular, 4 pts prime time)</li>
                  <li><strong>Sync Playoffs:</strong> Credits playoff appearances (WC: 3, DIV: 6, CON: 10, SB: 15+25 if won)</li>
                  <li>All syncs update automatically as games complete</li>
                  <li>Only starting QBs receive credit</li>
                  <li>Safe to run multiple times (won't create duplicates)</li>
                  <li>Bonuses (MVP, ROY, etc.) still require manual entry</li>
                </ul>
              </div>
            </form>
          )}

          {activeTab === 'weekly' && (
            <form onSubmit={handleWeeklySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quarterback
                </label>
                <select
                  value={weeklyForm.qb_id}
                  onChange={(e) =>
                    setWeeklyForm({ ...weeklyForm, qb_id: parseInt(e.target.value) })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                >
                  <option value="">Select QB</option>
                  {qbs.map((qb) => (
                    <option key={qb.id} value={qb.id}>
                      {qb.name} ({qb.nfl_team})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Week
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="18"
                    value={weeklyForm.week}
                    onChange={(e) =>
                      setWeeklyForm({ ...weeklyForm, week: parseInt(e.target.value) })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Season
                  </label>
                  <input
                    type="number"
                    value={weeklyForm.season}
                    onChange={(e) =>
                      setWeeklyForm({ ...weeklyForm, season: parseInt(e.target.value) })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pass Yards
                  </label>
                  <input
                    type="number"
                    value={weeklyForm.passing_yards}
                    onChange={(e) =>
                      setWeeklyForm({
                        ...weeklyForm,
                        passing_yards: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rush Yards
                  </label>
                  <input
                    type="number"
                    value={weeklyForm.rushing_yards}
                    onChange={(e) =>
                      setWeeklyForm({
                        ...weeklyForm,
                        rushing_yards: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pass TDs
                  </label>
                  <input
                    type="number"
                    value={weeklyForm.passing_tds}
                    onChange={(e) =>
                      setWeeklyForm({
                        ...weeklyForm,
                        passing_tds: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rush TDs
                  </label>
                  <input
                    type="number"
                    value={weeklyForm.rushing_tds}
                    onChange={(e) =>
                      setWeeklyForm({
                        ...weeklyForm,
                        rushing_tds: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    INTs
                  </label>
                  <input
                    type="number"
                    value={weeklyForm.interceptions}
                    onChange={(e) =>
                      setWeeklyForm({
                        ...weeklyForm,
                        interceptions: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fumbles
                  </label>
                  <input
                    type="number"
                    value={weeklyForm.fumbles}
                    onChange={(e) =>
                      setWeeklyForm({
                        ...weeklyForm,
                        fumbles: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={weeklyForm.game_won}
                    onChange={(e) =>
                      setWeeklyForm({ ...weeklyForm, game_won: e.target.checked })
                    }
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Game Won</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={weeklyForm.prime_time_win}
                    onChange={(e) =>
                      setWeeklyForm({ ...weeklyForm, prime_time_win: e.target.checked })
                    }
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Prime Time Win
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
              >
                Add Weekly Stats
              </button>
            </form>
          )}

          {activeTab === 'bonus' && (
            <form onSubmit={handleBonusSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quarterback
                </label>
                <select
                  value={bonusForm.qb_id}
                  onChange={(e) =>
                    setBonusForm({ ...bonusForm, qb_id: parseInt(e.target.value) })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                >
                  <option value="">Select QB</option>
                  {qbs.map((qb) => (
                    <option key={qb.id} value={qb.id}>
                      {qb.name} ({qb.nfl_team})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bonus Type
                </label>
                <select
                  value={bonusForm.bonus_type}
                  onChange={(e) =>
                    setBonusForm({ ...bonusForm, bonus_type: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                >
                  <option value="MVP">MVP (50 pts)</option>
                  <option value="MVP_RUNNER_UP">MVP Runner-Up (40 pts)</option>
                  <option value="MVP_3RD">MVP 3rd Place (30 pts)</option>
                  <option value="MVP_4TH">MVP 4th Place (20 pts)</option>
                  <option value="MVP_5TH">MVP 5th Place (10 pts)</option>
                  <option value="ROOKIE_OF_YEAR">Rookie of the Year (30 pts)</option>
                  <option value="CONF_POW">Conference POW (10 pts)</option>
                  <option value="CONF_POM">Conference POM (20 pts)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700"
              >
                Add Bonus
              </button>
            </form>
          )}

          {activeTab === 'playoff' && (
            <form onSubmit={handlePlayoffSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quarterback
                </label>
                <select
                  value={playoffForm.qb_id}
                  onChange={(e) =>
                    setPlayoffForm({ ...playoffForm, qb_id: parseInt(e.target.value) })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                >
                  <option value="">Select QB</option>
                  {qbs.map((qb) => (
                    <option key={qb.id} value={qb.id}>
                      {qb.name} ({qb.nfl_team})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Playoff Round
                </label>
                <select
                  value={playoffForm.round}
                  onChange={(e) =>
                    setPlayoffForm({ ...playoffForm, round: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                >
                  <option value="WILD_CARD">Wild Card (3 pts)</option>
                  <option value="DIVISIONAL">Divisional (6 pts)</option>
                  <option value="CONF_CHAMPIONSHIP">Conference Championship (10 pts)</option>
                  <option value="SUPER_BOWL">Super Bowl (15 pts)</option>
                </select>
              </div>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={playoffForm.won_super_bowl}
                  onChange={(e) =>
                    setPlayoffForm({ ...playoffForm, won_super_bowl: e.target.checked })
                  }
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  Won Super Bowl (+25 pts)
                </span>
              </label>

              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700"
              >
                Add Playoff Appearance
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
