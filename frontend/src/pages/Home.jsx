import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function Home() {
  const [standings, setStandings] = useState([]);
  const [worstQB, setWorstQB] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [standingsData, worstQBData] = await Promise.all([
        api.getStandings(),
        api.getWorstQB(),
      ]);
      setStandings(standingsData.standings);
      setWorstQB(worstQBData.worst_qb);
    } catch (err) {
      setError('Failed to load standings. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRankDisplay = (rank) => {
    switch (rank) {
      case 1: return { icon: '👑', color: 'text-gold' };
      case 2: return { icon: '🥈', color: 'text-silver' };
      case 3: return { icon: '🥉', color: 'text-bronze' };
      case 6: return { icon: '💀', color: 'text-danger' };
      default: return { icon: `#${rank}`, color: 'text-text-secondary' };
    }
  };

  const getRowStyles = (rank, totalTeams) => {
    if (rank === 1) {
      return 'border-glow-gold bg-gold/5 animate-pulse-gold';
    }
    if (rank === totalTeams) {
      return 'border-glow-danger bg-danger/5';
    }
    return 'border-l-3 border-transparent hover:bg-dark-elevated';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-xl text-text-secondary font-mono">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-danger/20 border border-danger text-danger px-6 py-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="font-oswald text-4xl md:text-5xl font-bold text-white tracking-wide uppercase mb-2">
          League Standings
        </h1>
        <p className="text-text-secondary font-mono text-sm">
          2025 Season • QB Only League • Top 5 QBs Count
        </p>
      </div>

      {/* Standings Table */}
      <div className="bg-dark-surface rounded-lg border border-border-subtle overflow-hidden">
        {/* Table Header */}
        <div className="bg-dark-elevated px-6 py-4 border-b border-border-subtle">
          <div className="flex items-center justify-between">
            <h2 className="font-oswald text-lg font-semibold text-white uppercase tracking-wide">
              Current Standings
            </h2>
            <span className="text-text-muted text-xs font-mono">
              Based on top 5 QBs per squad
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="px-6 py-3 text-left text-xs font-oswald font-medium text-text-muted uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-oswald font-medium text-text-muted uppercase tracking-wider">
                  Team
                </th>
                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-oswald font-medium text-text-muted uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-right text-xs font-oswald font-medium text-text-muted uppercase tracking-wider">
                  Payout
                </th>
                <th className="px-6 py-3 text-right text-xs font-oswald font-medium text-text-muted uppercase tracking-wider">
                  Points
                </th>
              </tr>
            </thead>
            <tbody>
              {standings.map((squad) => {
                const rankDisplay = getRankDisplay(squad.rank);
                const rowStyles = getRowStyles(squad.rank, standings.length);

                return (
                  <tr
                    key={squad.squad_id}
                    className={`table-row-hover border-b border-border-subtle last:border-b-0 ${rowStyles}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-oswald text-lg font-bold ${rankDisplay.color}`}>
                        {rankDisplay.icon}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-oswald font-semibold uppercase tracking-wide ${
                        squad.rank === 1 ? 'text-gold' : squad.rank === standings.length ? 'text-danger' : 'text-white'
                      }`}>
                        {squad.squad_name}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                      <span className="text-text-secondary">{squad.owner}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={`font-mono font-semibold ${
                        squad.projected_payout > 0
                          ? 'text-success'
                          : squad.projected_payout < 0
                          ? 'text-danger'
                          : 'text-text-secondary'
                      }`}>
                        {squad.projected_payout > 0 ? '+' : ''}${squad.projected_payout}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={`font-mono text-xl font-bold ${
                        squad.rank === 1 ? 'text-gold' : squad.rank === standings.length ? 'text-danger' : 'text-white'
                      }`}>
                        {squad.total_points.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top 5 QBs Grid */}
      {standings.length > 0 && (
        <div className="bg-dark-surface rounded-lg border border-border-subtle overflow-hidden">
          <div className="bg-dark-elevated px-6 py-4 border-b border-border-subtle">
            <h3 className="font-oswald text-lg font-semibold text-white uppercase tracking-wide">
              Top 5 QBs Per Team
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {standings.map((squad) => (
                <div
                  key={squad.squad_id}
                  className="bg-dark-primary p-4 rounded-lg border border-border-subtle card-hover"
                >
                  <div className="font-oswald font-semibold text-white uppercase tracking-wide mb-3 flex items-center gap-2">
                    {squad.rank === 1 && <span className="text-gold">👑</span>}
                    {squad.rank === standings.length && <span className="text-danger">💀</span>}
                    {squad.squad_name}
                  </div>
                  <div className="space-y-2">
                    {squad.top_qbs.map((qb, idx) => (
                      <div key={qb.qb_id} className="flex justify-between text-sm">
                        <span className="text-text-secondary">
                          <span className="text-gold mr-2">★</span>
                          {idx + 1}. {qb.name}
                          <span className="text-text-muted ml-1">({qb.nfl_team})</span>
                        </span>
                        <span className="font-mono font-semibold text-white">
                          {qb.total_points.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hall of Shame - Worst QB */}
      {worstQB && (
        <div className="relative overflow-hidden rounded-lg border-2 border-danger animate-pulse-danger scanlines">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-danger/20 via-danger-dim/10 to-dark-primary" />

          {/* Content */}
          <div className="relative p-8 text-center">
            <div className="mb-4">
              <span className="inline-block px-4 py-1 bg-danger/30 rounded-full text-danger text-xs font-oswald uppercase tracking-widest">
                Hall of Shame
              </span>
            </div>

            <h2 className="font-oswald text-2xl md:text-3xl font-bold text-danger uppercase tracking-wide mb-2">
              Worst QB of 2025
            </h2>

            <p className="font-oswald text-4xl md:text-5xl font-bold text-white uppercase tracking-wide mb-2">
              {worstQB.name}
            </p>

            <p className="text-text-secondary mb-4">
              {worstQB.nfl_team} • {worstQB.squad_name}
            </p>

            <p className="font-mono text-5xl md:text-6xl font-bold text-danger mb-4">
              {worstQB.total_points.toFixed(2)}
              <span className="text-2xl ml-2">pts</span>
            </p>

            <p className="text-text-muted text-sm italic max-w-md mx-auto">
              "The league shall bear this name come February..."
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
