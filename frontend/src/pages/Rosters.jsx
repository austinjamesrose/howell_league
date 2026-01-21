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
          Squad Rosters
        </h1>
        <p className="text-text-secondary font-mono text-sm">
          View all quarterbacks rostered by each squad
        </p>
      </div>

      {/* Team Tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {squads.map((squad) => (
          <button
            key={squad.id}
            onClick={() => loadRoster(squad.id)}
            className={`
              px-5 py-2.5 rounded-lg font-oswald font-medium uppercase tracking-wide text-sm
              transition-all duration-200
              ${selectedSquad === squad.id
                ? 'bg-gold text-dark-primary shadow-glow-gold'
                : 'bg-dark-surface text-text-secondary hover:text-white hover:bg-dark-elevated border border-border-subtle'
              }
            `}
          >
            {squad.name}
          </button>
        ))}
      </div>

      {/* Roster Card */}
      {roster && (
        <div className="bg-dark-surface rounded-lg border border-border-subtle overflow-hidden">
          {/* Header */}
          <div className="bg-dark-elevated px-6 py-4 border-b border-border-subtle">
            <h2 className="font-oswald text-2xl font-bold text-white uppercase tracking-wide">
              {roster.squad_name}
            </h2>
            <p className="text-text-secondary text-sm mt-1">
              Owner: {roster.owner}
            </p>
            <p className="text-text-muted text-sm">
              <span className="text-gold">{roster.roster.filter((qb) => qb.is_top_5).length}</span> of 8 QBs counting toward standings
            </p>
          </div>

          {/* QB List */}
          <div className="p-6">
            <div className="space-y-3">
              {roster.roster.map((qb) => (
                <Link
                  key={qb.qb_id}
                  to={`/qb/${qb.qb_id}`}
                  className={`
                    block p-4 rounded-lg border transition-all duration-200 card-hover
                    ${qb.is_top_5
                      ? 'border-gold/30 bg-gold/5 hover:border-gold/50'
                      : 'border-border-subtle bg-dark-primary/50 opacity-60 hover:opacity-80'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Rank */}
                      <div className={`
                        font-oswald text-2xl font-bold
                        ${qb.is_top_5 ? 'text-gold' : 'text-text-muted'}
                      `}>
                        #{qb.rank}
                      </div>

                      {/* Player Info */}
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className={`
                            font-oswald text-lg font-semibold uppercase tracking-wide
                            ${qb.is_top_5 ? 'text-white' : 'text-text-secondary'}
                          `}>
                            {qb.name}
                          </h3>
                          {qb.is_top_5 && (
                            <span className="bg-gold/20 text-gold text-xs px-2 py-0.5 rounded font-oswald font-medium">
                              ★ TOP 5
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-text-muted font-mono">{qb.nfl_team}</p>
                      </div>
                    </div>

                    {/* Points */}
                    <div className="text-right">
                      <div className={`
                        font-mono text-2xl font-bold
                        ${qb.is_top_5 ? 'text-gold' : 'text-text-secondary'}
                      `}>
                        {qb.total_points.toFixed(2)}
                      </div>
                      <div className="text-xs text-text-muted">total points</div>
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
