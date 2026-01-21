import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function PlayerStandings() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      setLoading(true);
      const data = await api.getQuarterbacks();
      // Show all rostered QBs (even with 0 points) + free agents with >0 points
      const filteredPlayers = data.quarterbacks.filter(qb =>
        qb.squad_name !== 'Free Agent' || qb.total_points > 0
      );
      setPlayers(filteredPlayers);
    } catch (err) {
      setError('Failed to load player standings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRankDisplay = (index) => {
    switch (index) {
      case 0: return { icon: '🥇', color: 'text-gold' };
      case 1: return { icon: '🥈', color: 'text-silver' };
      case 2: return { icon: '🥉', color: 'text-bronze' };
      default: return { icon: `#${index + 1}`, color: 'text-text-secondary' };
    }
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="font-oswald text-4xl md:text-5xl font-bold text-white tracking-wide uppercase mb-2">
          Player Standings
        </h1>
        <p className="text-text-secondary font-mono text-sm">
          All quarterbacks ranked by total points
        </p>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-dark-surface rounded-lg border border-border-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle bg-dark-elevated">
                <th className="px-6 py-3 text-left text-xs font-oswald font-medium text-text-muted uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-oswald font-medium text-text-muted uppercase tracking-wider">
                  Player
                </th>
                <th className="px-6 py-3 text-left text-xs font-oswald font-medium text-text-muted uppercase tracking-wider">
                  NFL
                </th>
                <th className="px-6 py-3 text-left text-xs font-oswald font-medium text-text-muted uppercase tracking-wider">
                  Fantasy Team
                </th>
                <th className="px-6 py-3 text-right text-xs font-oswald font-medium text-text-muted uppercase tracking-wider">
                  Points
                </th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => {
                const isFreeAgent = player.squad_name === 'Free Agent';
                const rankDisplay = getRankDisplay(index);
                const isTopThree = index < 3;

                return (
                  <tr
                    key={player.id}
                    className={`
                      table-row-hover border-b border-border-subtle last:border-b-0
                      ${isTopThree ? 'bg-gold/5' : ''}
                      ${isFreeAgent ? 'opacity-60' : ''}
                    `}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-oswald text-lg font-bold ${rankDisplay.color}`}>
                        {rankDisplay.icon}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/qb/${player.id}`}
                        className={`
                          font-oswald font-semibold uppercase tracking-wide
                          hover:text-gold transition-colors
                          ${isTopThree ? 'text-gold' : 'text-white'}
                        `}
                      >
                        {player.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-text-secondary font-mono text-sm">
                        {player.nfl_team}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm ${isFreeAgent ? 'text-text-muted italic' : 'text-text-secondary'}`}>
                        {isFreeAgent ? 'Free Agent' : player.squad_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={`
                        font-mono text-xl font-bold
                        ${isTopThree ? 'text-gold' : 'text-white'}
                      `}>
                        {player.total_points.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-dark-elevated px-6 py-3 border-t border-border-subtle">
          <p className="text-text-muted text-sm font-mono">
            {players.length} quarterbacks • {players.filter(p => p.squad_name === 'Free Agent').length} free agents
          </p>
        </div>
      </div>
    </div>
  );
}
