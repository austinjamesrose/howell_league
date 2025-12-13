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
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Howell League Standings
        </h1>
        <p className="text-gray-600">2025 Season - QB Only League</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 text-white px-6 py-4">
          <h2 className="text-2xl font-bold">League Standings</h2>
          <p className="text-sm opacity-90">Based on top 5 QBs per squad</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Squad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Projected Payout
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Points
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {standings.map((squad) => (
                <tr
                  key={squad.squad_id}
                  className={squad.rank === 1 ? 'bg-yellow-50' : 'hover:bg-gray-50'}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">
                      {squad.rank === 1 && '👑 '}
                      #{squad.rank}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {squad.squad_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{squad.owner}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className={`text-sm font-semibold ${
                      squad.projected_payout > 0
                        ? 'text-green-600'
                        : squad.projected_payout < 0
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`}>
                      {squad.projected_payout > 0 ? '+' : ''}${squad.projected_payout}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-lg font-bold text-blue-600">
                      {squad.total_points.toFixed(2)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {standings.length > 0 && (
          <div className="bg-gray-50 px-6 py-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Top 5 QBs (Counting Toward Standings)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {standings.map((squad) => (
                <div key={squad.squad_id} className="bg-white p-3 rounded border">
                  <div className="font-semibold text-sm text-gray-900 mb-2">
                    {squad.squad_name}
                  </div>
                  <div className="space-y-1">
                    {squad.top_qbs.map((qb, idx) => (
                      <div key={qb.qb_id} className="flex justify-between text-xs">
                        <span className="text-gray-600">
                          {idx + 1}. {qb.name} ({qb.nfl_team})
                        </span>
                        <span className="font-semibold text-blue-600">
                          {qb.total_points.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {worstQB && (
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">
              Worst QB of the Season (So Far)
            </h2>
            <p className="text-3xl font-extrabold mb-1">{worstQB.name}</p>
            <p className="text-lg opacity-90">
              {worstQB.nfl_team} • {worstQB.squad_name}
            </p>
            <p className="text-4xl font-bold mt-3">
              {worstQB.total_points.toFixed(2)} pts
            </p>
            <p className="text-sm mt-2 opacity-75">
              The league shall be named after this QB following the Super Bowl
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
