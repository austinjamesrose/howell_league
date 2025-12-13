import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function Rosters() {
  const [squads, setSquads] = useState([]);
  const [selectedSquad, setSelectedSquad] = useState(null);
  const [roster, setRoster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSquads();
  }, []);

  const loadSquads = async () => {
    try {
      setLoading(true);
      const data = await api.getSquads();
      setSquads(data.squads);
      if (data.squads.length > 0) {
        loadRoster(data.squads[0].id);
      }
    } catch (err) {
      setError('Failed to load squads');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadRoster = async (squadId) => {
    try {
      const data = await api.getSquadRoster(squadId);
      setRoster(data);
      setSelectedSquad(squadId);
    } catch (err) {
      console.error('Failed to load roster:', err);
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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Squad Rosters</h1>
        <p className="text-gray-600">View all quarterbacks rostered by each squad</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {squads.map((squad) => (
          <button
            key={squad.id}
            onClick={() => loadRoster(squad.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedSquad === squad.id
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            {squad.name}
          </button>
        ))}
      </div>

      {roster && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 text-white px-6 py-4">
            <h2 className="text-2xl font-bold">{roster.squad_name}</h2>
            <p className="text-sm opacity-90">Owner: {roster.owner}</p>
            <p className="text-sm opacity-90">
              {roster.roster.filter((qb) => qb.is_top_5).length} of 8 QBs counting
              toward standings
            </p>
          </div>

          <div className="p-6">
            <div className="grid gap-4">
              {roster.roster.map((qb) => (
                <Link
                  key={qb.qb_id}
                  to={`/qb/${qb.qb_id}`}
                  className={`block p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                    qb.is_top_5
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl font-bold text-gray-400">
                        #{qb.rank}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            {qb.name}
                          </h3>
                          {qb.is_top_5 && (
                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                              TOP 5
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{qb.nfl_team}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {qb.total_points.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">total points</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
