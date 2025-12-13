import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';

export default function QBDetails() {
  const { qbId } = useParams();
  const [qb, setQB] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadQBDetails();
  }, [qbId]);

  const loadQBDetails = async () => {
    try {
      setLoading(true);
      const data = await api.getQuarterbackDetails(qbId);
      setQB(data);
    } catch (err) {
      setError('Failed to load quarterback details');
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

  if (!qb) return null;

  return (
    <div className="space-y-6">
      <Link to="/rosters" className="text-blue-600 hover:underline">
        ← Back to Rosters
      </Link>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{qb.name}</h1>
            <p className="text-lg text-gray-600">
              {qb.nfl_team} • {qb.squad_name}
            </p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold text-blue-600">
              {qb.total_points.toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">Total Points</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Weekly Stats</div>
            <div className="text-2xl font-bold text-blue-600">
              {qb.breakdown.weekly_stats.total.toFixed(2)}
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Bonuses</div>
            <div className="text-2xl font-bold text-green-600">
              {qb.breakdown.bonuses.total.toFixed(2)}
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Playoffs</div>
            <div className="text-2xl font-bold text-purple-600">
              {qb.breakdown.playoffs.total.toFixed(2)}
            </div>
          </div>
        </div>

        {qb.breakdown.weekly_stats.stats.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Weekly Stats</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Week
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Pass Yds
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Rush Yds
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Pass TD
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Rush TD
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      INT
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      FUM
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Win
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {qb.breakdown.weekly_stats.stats.map((stat) => (
                    <tr key={stat.week} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        Week {stat.week}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-700">
                        {stat.passing_yards}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-700">
                        {stat.rushing_yards}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-700">
                        {stat.passing_tds}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-700">
                        {stat.rushing_tds}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-red-600">
                        {stat.interceptions}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-red-600">
                        {stat.fumbles}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        {stat.game_won ? (
                          stat.prime_time_win ? (
                            <span className="text-yellow-500">★ W</span>
                          ) : (
                            <span className="text-green-600">W</span>
                          )
                        ) : (
                          <span className="text-gray-400">L</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-bold text-blue-600">
                        {stat.points.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {qb.breakdown.bonuses.awards.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Season Bonuses</h2>
            <div className="space-y-2">
              {qb.breakdown.bonuses.awards.map((bonus, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center bg-green-50 p-4 rounded"
                >
                  <span className="font-medium text-gray-900">
                    {bonus.type.replace(/_/g, ' ')}
                  </span>
                  <span className="font-bold text-green-600">
                    +{bonus.points.toFixed(2)} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {qb.breakdown.playoffs.appearances.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Playoff Appearances
            </h2>
            <div className="space-y-2">
              {qb.breakdown.playoffs.appearances.map((playoff, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center bg-purple-50 p-4 rounded"
                >
                  <div>
                    <span className="font-medium text-gray-900">
                      {playoff.round.replace(/_/g, ' ')}
                    </span>
                    {playoff.won_super_bowl && (
                      <span className="ml-2 text-yellow-500 font-bold">
                        🏆 CHAMPION
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-purple-600">
                    +{playoff.points.toFixed(2)} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
