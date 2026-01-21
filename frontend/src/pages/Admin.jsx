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
        headers: { 'Content-Type': 'application/json' },
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
        text: 'Failed to sync stats. The 2025 season data may not be available yet.'
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
      setMessage({ type: 'error', text: 'Failed to sync wins.' });
    } finally {
      setSyncing(false);
    }
  };

  const handleSyncPlayoffs = async (e) => {
    e.preventDefault();
    try {
      setSyncing(true);
      setMessage({ type: 'info', text: `Syncing playoff wins for ${syncForm.season}...` });
      const result = await api.syncPlayoffs(syncForm.season);
      setMessage({
        type: 'success',
        text: `${result.message} - Wins synced: ${result.total_wins_synced}`
      });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to sync playoffs.' });
    } finally {
      setSyncing(false);
    }
  };

  const handleSeedAwards = async (e) => {
    e.preventDefault();
    try {
      setSyncing(true);
      setMessage({ type: 'info', text: `Seeding POW/POM awards for ${syncForm.season}...` });
      const result = await api.seedAwards(syncForm.season);
      setMessage({
        type: 'success',
        text: `${result.message} - POW: ${result.pow_awards}, POM: ${result.pom_awards}`
      });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to seed awards.' });
    } finally {
      setSyncing(false);
    }
  };

  const tabs = [
    { id: 'sync', label: 'Sync Stats' },
    { id: 'weekly', label: 'Manual Entry' },
    { id: 'bonus', label: 'Bonuses' },
    { id: 'playoff', label: 'Playoffs' },
  ];

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <div className="bg-dark-surface rounded-lg border border-border-subtle p-8">
          <div className="text-center mb-6">
            <h1 className="font-oswald text-3xl font-bold text-white uppercase tracking-wide mb-2">
              Admin Login
            </h1>
            <p className="text-text-secondary">Enter password to access admin panel</p>
          </div>

          {authError && (
            <div className="mb-4 p-4 bg-danger/20 text-danger rounded-lg border border-danger/30">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                placeholder="Enter admin password"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className={`btn w-full ${isAuthenticating ? 'bg-text-muted cursor-not-allowed' : 'btn-gold'}`}
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
      {/* Page Header */}
      <div className="text-center">
        <h1 className="font-oswald text-4xl md:text-5xl font-bold text-white tracking-wide uppercase mb-2">
          Admin Panel
        </h1>
        <p className="text-text-secondary font-mono text-sm">
          Manage stats, bonuses, and playoff data
        </p>
        <button
          onClick={handleLogout}
          className="mt-2 text-sm text-danger hover:text-danger/80 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg border ${
            message.type === 'success'
              ? 'bg-success/20 text-success border-success/30'
              : message.type === 'info'
              ? 'bg-gold/20 text-gold border-gold/30'
              : 'bg-danger/20 text-danger border-danger/30'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Admin Card */}
      <div className="bg-dark-surface rounded-lg border border-border-subtle overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-border-subtle">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 px-6 py-4 font-oswald font-medium uppercase tracking-wide text-sm transition-colors
                ${activeTab === tab.id
                  ? 'bg-gold text-dark-primary'
                  : 'bg-dark-elevated text-text-secondary hover:text-white hover:bg-dark-primary'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Sync Tab */}
          {activeTab === 'sync' && (
            <form onSubmit={handleSyncStats} className="space-y-4">
              <div className="bg-gold/10 border border-gold/20 rounded-lg p-4 mb-4">
                <h3 className="font-oswald font-semibold text-gold uppercase tracking-wide mb-2">
                  Auto-Sync Season Stats
                </h3>
                <p className="text-sm text-text-secondary">
                  Automatically pull season aggregate QB stats from NFL data.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Season
                </label>
                <input
                  type="number"
                  min="2020"
                  max="2025"
                  value={syncForm.season}
                  onChange={(e) => setSyncForm({ ...syncForm, season: parseInt(e.target.value) })}
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={syncing}
                  className={`btn w-full ${syncing ? 'bg-text-muted cursor-not-allowed' : 'btn-gold'}`}
                >
                  {syncing ? 'Syncing...' : 'Sync Stats from NFL'}
                </button>

                <button
                  type="button"
                  onClick={handleSyncWins}
                  disabled={syncing}
                  className={`w-full py-3 rounded-lg font-oswald font-medium uppercase tracking-wide transition-all ${
                    syncing ? 'bg-text-muted cursor-not-allowed text-dark-primary' : 'bg-success hover:bg-success-dim text-white'
                  }`}
                >
                  {syncing ? 'Syncing...' : 'Sync QB Wins'}
                </button>

                <button
                  type="button"
                  onClick={handleSyncPlayoffs}
                  disabled={syncing}
                  className={`w-full py-3 rounded-lg font-oswald font-medium uppercase tracking-wide transition-all ${
                    syncing ? 'bg-text-muted cursor-not-allowed text-dark-primary' : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {syncing ? 'Syncing...' : 'Sync Playoff Wins'}
                </button>

                <button
                  type="button"
                  onClick={handleSeedAwards}
                  disabled={syncing}
                  className={`w-full py-3 rounded-lg font-oswald font-medium uppercase tracking-wide transition-all ${
                    syncing ? 'bg-text-muted cursor-not-allowed text-dark-primary' : 'bg-gold-dim hover:bg-gold text-dark-primary'
                  }`}
                >
                  {syncing ? 'Seeding...' : 'Seed POW/POM Awards'}
                </button>
              </div>

              <div className="mt-4 p-4 bg-dark-primary rounded-lg border border-border-subtle">
                <h4 className="font-oswald font-semibold text-white uppercase tracking-wide mb-2">
                  How it works:
                </h4>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• <strong className="text-white">Sync Stats:</strong> Fetches yards, TDs, INTs, fumbles</li>
                  <li>• <strong className="text-white">Sync Wins:</strong> Credits wins to starting QBs</li>
                  <li>• <strong className="text-white">Sync Playoffs:</strong> Credits playoff wins</li>
                  <li>• <strong className="text-white">Seed Awards:</strong> Adds POW/POM bonuses</li>
                </ul>
              </div>
            </form>
          )}

          {/* Manual Entry Tab */}
          {activeTab === 'weekly' && (
            <form onSubmit={handleWeeklySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Quarterback
                </label>
                <select
                  value={weeklyForm.qb_id}
                  onChange={(e) => setWeeklyForm({ ...weeklyForm, qb_id: parseInt(e.target.value) })}
                  className="w-full"
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
                  <label className="block text-sm font-medium text-text-secondary mb-2">Week</label>
                  <input
                    type="number"
                    min="1"
                    max="18"
                    value={weeklyForm.week}
                    onChange={(e) => setWeeklyForm({ ...weeklyForm, week: parseInt(e.target.value) })}
                    className="w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Season</label>
                  <input
                    type="number"
                    value={weeklyForm.season}
                    onChange={(e) => setWeeklyForm({ ...weeklyForm, season: parseInt(e.target.value) })}
                    className="w-full"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Pass Yards', key: 'passing_yards' },
                  { label: 'Rush Yards', key: 'rushing_yards' },
                  { label: 'Pass TDs', key: 'passing_tds' },
                  { label: 'Rush TDs', key: 'rushing_tds' },
                  { label: 'INTs', key: 'interceptions' },
                  { label: 'Fumbles', key: 'fumbles' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-text-secondary mb-2">{field.label}</label>
                    <input
                      type="number"
                      value={weeklyForm[field.key]}
                      onChange={(e) => setWeeklyForm({ ...weeklyForm, [field.key]: parseInt(e.target.value) || 0 })}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={weeklyForm.game_won}
                    onChange={(e) => setWeeklyForm({ ...weeklyForm, game_won: e.target.checked })}
                    className="mr-2 w-4 h-4 accent-gold"
                  />
                  <span className="text-sm text-text-secondary">Game Won</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={weeklyForm.prime_time_win}
                    onChange={(e) => setWeeklyForm({ ...weeklyForm, prime_time_win: e.target.checked })}
                    className="mr-2 w-4 h-4 accent-gold"
                  />
                  <span className="text-sm text-text-secondary">Prime Time Win</span>
                </label>
              </div>

              <button type="submit" className="btn btn-gold w-full">
                Add Weekly Stats
              </button>
            </form>
          )}

          {/* Bonus Tab */}
          {activeTab === 'bonus' && (
            <form onSubmit={handleBonusSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Quarterback
                </label>
                <select
                  value={bonusForm.qb_id}
                  onChange={(e) => setBonusForm({ ...bonusForm, qb_id: parseInt(e.target.value) })}
                  className="w-full"
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
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Bonus Type
                </label>
                <select
                  value={bonusForm.bonus_type}
                  onChange={(e) => setBonusForm({ ...bonusForm, bonus_type: e.target.value })}
                  className="w-full"
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

              <button type="submit" className="btn w-full bg-success hover:bg-success-dim text-white font-oswald font-medium uppercase tracking-wide py-3 rounded-lg">
                Add Bonus
              </button>
            </form>
          )}

          {/* Playoff Tab */}
          {activeTab === 'playoff' && (
            <form onSubmit={handlePlayoffSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Quarterback
                </label>
                <select
                  value={playoffForm.qb_id}
                  onChange={(e) => setPlayoffForm({ ...playoffForm, qb_id: parseInt(e.target.value) })}
                  className="w-full"
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
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Playoff Round
                </label>
                <select
                  value={playoffForm.round}
                  onChange={(e) => setPlayoffForm({ ...playoffForm, round: e.target.value })}
                  className="w-full"
                  required
                >
                  <option value="WILD_CARD">Wild Card (3 pts)</option>
                  <option value="DIVISIONAL">Divisional (6 pts)</option>
                  <option value="CONF_CHAMPIONSHIP">Conference Championship (10 pts)</option>
                  <option value="SUPER_BOWL">Super Bowl (15 pts)</option>
                </select>
              </div>

              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={playoffForm.won_super_bowl}
                  onChange={(e) => setPlayoffForm({ ...playoffForm, won_super_bowl: e.target.checked })}
                  className="mr-2 w-4 h-4 accent-gold"
                />
                <span className="text-sm text-text-secondary">Won Super Bowl (+25 pts)</span>
              </label>

              <button type="submit" className="btn w-full bg-purple-600 hover:bg-purple-700 text-white font-oswald font-medium uppercase tracking-wide py-3 rounded-lg">
                Add Playoff Appearance
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
