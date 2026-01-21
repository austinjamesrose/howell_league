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

  if (!qb) return null;

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        to="/rosters"
        className="inline-flex items-center text-text-secondary hover:text-gold transition-colors"
      >
        <span className="mr-2">←</span> Back to Rosters
      </Link>

      {/* Player Card */}
      <div className="bg-dark-surface rounded-lg border border-border-subtle overflow-hidden">
        {/* Header */}
        <div className="bg-dark-elevated p-6 border-b border-border-subtle">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-oswald text-4xl md:text-5xl font-bold text-white uppercase tracking-wide">
                {qb.name}
              </h1>
              <p className="text-text-secondary mt-1">
                <span className="font-mono">{qb.nfl_team}</span>
                <span className="mx-2">•</span>
                <span>{qb.squad_name}</span>
              </p>
            </div>
            <div className="text-right">
              <div className="font-mono text-5xl md:text-6xl font-bold text-gold">
                {qb.total_points.toFixed(2)}
              </div>
              <div className="text-text-muted text-sm uppercase tracking-wide">
                Total Points
              </div>
            </div>
          </div>
        </div>

        {/* Points Breakdown */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-dark-primary p-4 rounded-lg border border-border-subtle">
              <div className="text-text-muted text-sm uppercase tracking-wide mb-1">
                Weekly Stats
              </div>
              <div className="font-mono text-3xl font-bold text-white">
                {qb.breakdown.weekly_stats.total.toFixed(2)}
              </div>
            </div>
            <div className="bg-dark-primary p-4 rounded-lg border border-gold/20">
              <div className="text-text-muted text-sm uppercase tracking-wide mb-1">
                Bonuses
              </div>
              <div className="font-mono text-3xl font-bold text-gold">
                {qb.breakdown.bonuses.total.toFixed(2)}
              </div>
            </div>
            <div className="bg-dark-primary p-4 rounded-lg border border-success/20">
              <div className="text-text-muted text-sm uppercase tracking-wide mb-1">
                Playoffs
              </div>
              <div className="font-mono text-3xl font-bold text-success">
                {qb.breakdown.playoffs.total.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Season Aggregate Stats */}
          {qb.breakdown.aggregate_stats && (
            <div className="mb-8">
              <h2 className="font-oswald text-xl font-semibold text-white uppercase tracking-wide mb-4">
                Season Stats
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Passing */}
                <div className="bg-dark-primary p-4 rounded-lg border border-border-subtle">
                  <div className="text-text-muted text-xs uppercase tracking-wide mb-1">
                    Pass Yards
                  </div>
                  <div className="font-mono text-2xl font-bold text-white">
                    {qb.breakdown.aggregate_stats.passing_yards.toLocaleString()}
                  </div>
                </div>
                <div className="bg-dark-primary p-4 rounded-lg border border-border-subtle">
                  <div className="text-text-muted text-xs uppercase tracking-wide mb-1">
                    Rush Yards
                  </div>
                  <div className="font-mono text-2xl font-bold text-white">
                    {qb.breakdown.aggregate_stats.rushing_yards.toLocaleString()}
                  </div>
                </div>
                {/* TDs */}
                <div className="bg-dark-primary p-4 rounded-lg border border-success/30">
                  <div className="text-text-muted text-xs uppercase tracking-wide mb-1">
                    Pass TD
                  </div>
                  <div className="font-mono text-2xl font-bold text-success">
                    {qb.breakdown.aggregate_stats.passing_tds}
                  </div>
                </div>
                <div className="bg-dark-primary p-4 rounded-lg border border-success/30">
                  <div className="text-text-muted text-xs uppercase tracking-wide mb-1">
                    Rush TD
                  </div>
                  <div className="font-mono text-2xl font-bold text-success">
                    {qb.breakdown.aggregate_stats.rushing_tds}
                  </div>
                </div>
                {/* Turnovers */}
                <div className="bg-dark-primary p-4 rounded-lg border border-danger/30">
                  <div className="text-text-muted text-xs uppercase tracking-wide mb-1">
                    Interceptions
                  </div>
                  <div className="font-mono text-2xl font-bold text-danger">
                    {qb.breakdown.aggregate_stats.interceptions}
                  </div>
                </div>
                <div className="bg-dark-primary p-4 rounded-lg border border-danger/30">
                  <div className="text-text-muted text-xs uppercase tracking-wide mb-1">
                    Fumbles
                  </div>
                  <div className="font-mono text-2xl font-bold text-danger">
                    {qb.breakdown.aggregate_stats.fumbles}
                  </div>
                </div>
                {/* Wins */}
                <div className="bg-dark-primary p-4 rounded-lg border border-gold/30">
                  <div className="text-text-muted text-xs uppercase tracking-wide mb-1">
                    Regular Wins
                  </div>
                  <div className="font-mono text-xl font-bold text-gold">
                    {qb.breakdown.aggregate_stats.regular_wins}
                    <span className="text-text-muted text-sm ml-1">
                      ({qb.breakdown.aggregate_stats.regular_wins_points} pts)
                    </span>
                  </div>
                </div>
                <div className="bg-dark-primary p-4 rounded-lg border border-gold/30">
                  <div className="text-text-muted text-xs uppercase tracking-wide mb-1">
                    Prime Time Wins
                  </div>
                  <div className="font-mono text-xl font-bold text-gold">
                    {qb.breakdown.aggregate_stats.primetime_wins}
                    <span className="text-text-muted text-sm ml-1">
                      ({qb.breakdown.aggregate_stats.primetime_wins_points} pts)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bonuses */}
          {qb.breakdown.bonuses.awards.length > 0 && (
            <div className="mb-8">
              <h2 className="font-oswald text-xl font-semibold text-white uppercase tracking-wide mb-4">
                Season Bonuses
              </h2>
              <div className="space-y-2">
                {qb.breakdown.bonuses.awards.map((bonus, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-gold/10 border border-gold/20 p-4 rounded-lg"
                  >
                    <span className="font-oswald font-medium text-white uppercase tracking-wide">
                      {bonus.type.replace(/_/g, ' ')}
                    </span>
                    <span className="font-mono font-bold text-gold">
                      +{bonus.points.toFixed(2)} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Playoffs */}
          {qb.breakdown.playoffs.appearances.length > 0 && (
            <div>
              <h2 className="font-oswald text-xl font-semibold text-white uppercase tracking-wide mb-4">
                Playoff Wins
              </h2>
              <div className="space-y-2">
                {qb.breakdown.playoffs.appearances.map((playoff, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-success/10 border border-success/20 p-4 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-oswald font-medium text-white uppercase tracking-wide">
                        {playoff.round.replace(/_/g, ' ')}
                      </span>
                      {playoff.won_super_bowl && (
                        <span className="bg-gold/20 text-gold text-xs px-2 py-1 rounded font-oswald font-bold uppercase">
                          🏆 Champion
                        </span>
                      )}
                    </div>
                    <span className="font-mono font-bold text-success">
                      +{playoff.points.toFixed(2)} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
