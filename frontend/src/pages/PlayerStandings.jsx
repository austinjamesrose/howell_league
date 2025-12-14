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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Player Standings
        </h1>
        <p className="text-gray-600">All quarterbacks with points ranked by total (rostered & free agents)</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Player
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NFL Team
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fantasy Team
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Points
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {players.map((player, index) => {
                const isFreeAgent = player.squad_name === 'Free Agent';
                const rowBgClass = isFreeAgent
                  ? 'bg-blue-50 hover:bg-blue-100'
                  : index < 3
                    ? 'bg-yellow-50'
                    : 'hover:bg-gray-50';

                return (
                <tr
                  key={player.id}
                  className={rowBgClass}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">
                      {index === 0 && '🥇 '}
                      {index === 1 && '🥈 '}
                      {index === 2 && '🥉 '}
                      #{index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/qb/${player.id}`}
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      {player.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{player.nfl_team}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">
                      {player.squad_name === 'Free Agent' ? 'FA' : player.squad_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-lg font-bold text-blue-600">
                      {player.total_points.toFixed(2)}
                    </div>
                  </td>
                </tr>
              );
              })}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-50 px-6 py-4 text-sm text-gray-600">
          Showing {players.length} quarterbacks with points ({players.filter(p => p.squad_name === 'Free Agent').length} free agents)
        </div>
      </div>
    </div>
  );
}
