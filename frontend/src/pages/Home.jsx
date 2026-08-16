import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useSeason } from '../context/SeasonContext';

export default function Home() {
  const { season, dues, prizePool, lastPlacePenalty } = useSeason();
  const [standings, setStandings] = useState([]);
  const [worstQB, setWorstQB] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [season]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [standingsData, worstQBData] = await Promise.all([
        api.getStandings(season),
        api.getWorstQB(season),
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

  // Generate ticker items from data
  const getTickerItems = () => {
    const items = [];

    if (standings.length > 0) {
      // Leader
      const leader = standings[0];
      items.push({ label: '1ST PLACE', value: leader.squad_name, points: leader.total_points.toFixed(2), type: 'gold' });

      // Top QB overall
      const topQB = standings.flatMap(s => s.top_qbs).sort((a, b) => b.total_points - a.total_points)[0];
      if (topQB) {
        items.push({ label: 'TOP QB', value: topQB.name, points: topQB.total_points.toFixed(2), type: 'white' });
      }

      // All standings
      standings.forEach((squad) => {
        items.push({
          label: squad.squad_name.replace('Team ', '').toUpperCase(),
          value: `${squad.total_points.toFixed(2)} PTS`,
          type: squad.rank === 1 ? 'gold' : squad.rank === standings.length ? 'danger' : 'white'
        });
      });

      // Last place
      const lastPlace = standings[standings.length - 1];
      items.push({ label: 'LAST PLACE', value: lastPlace.squad_name, points: `-$${lastPlacePenalty}`, type: 'danger' });
    }

    // Worst QB
    if (worstQB) {
      items.push({ label: 'HALL OF SHAME', value: worstQB.name, points: worstQB.total_points.toFixed(2), type: 'danger' });
    }

    // League info
    items.push({ label: `${season} DUES`, value: `$${dues}/team`, type: 'white' });
    items.push({ label: 'PRIZE POOL', value: `$${prizePool}`, type: 'gold' });

    return items;
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

  const getAccentColor = (rank, totalTeams) =>
    rank === 1 ? 'text-gold' : rank === totalTeams ? 'text-danger' : 'text-white';

  const getPayoutColor = (payout) =>
    payout > 0 ? 'text-success' : payout < 0 ? 'text-danger' : 'text-text-secondary';

  const formatPayout = (payout) => `${payout > 0 ? '+' : ''}$${payout}`;

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

  const tickerItems = getTickerItems();

  return (
    <div className="space-y-8">
      {/* ESPN-Style Ticker */}
      {tickerItems.length > 0 && (
        <div className="ticker-wrap rounded-lg overflow-hidden -mt-4 mb-4">
          <div className="ticker py-3">
            {/* Duplicate items for seamless loop */}
            {[...tickerItems, ...tickerItems].map((item, idx) => (
              <div key={idx} className="ticker-item">
                <span className="font-oswald text-xs font-bold text-gold uppercase tracking-wider">
                  {item.label}
                </span>
                <span className={`font-oswald font-semibold ${
                  item.type === 'gold' ? 'text-gold' :
                  item.type === 'danger' ? 'text-danger' : 'text-white'
                }`}>
                  {item.value}
                </span>
                {item.points && (
                  <span className="font-mono text-sm text-text-muted">
                    {item.points}
                  </span>
                )}
                <span className="ticker-divider ml-4">◆</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="text-center">
        <h1 className="font-oswald text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-wide uppercase mb-2">
          League Standings
        </h1>
        <p className="text-text-secondary font-mono text-xs sm:text-sm">
          {season} Season • AR15 League • Top 5 QBs Count
        </p>
      </div>

      {/* Standings Table */}
      <div className="bg-dark-surface rounded-lg border border-border-subtle overflow-hidden">
        {/* Table Header */}
        <div className="bg-dark-elevated px-3 sm:px-6 py-4 border-b border-border-subtle">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-oswald text-lg font-semibold text-white uppercase tracking-wide">
              Current Standings
            </h2>
            <span className="hidden sm:inline text-text-muted text-xs font-mono">
              Based on top 5 QBs per squad
            </span>
          </div>
        </div>

        {/* Mobile: stacked cards (no horizontal scrolling) */}
        <div className="sm:hidden divide-y divide-border-subtle">
          {standings.map((squad) => {
            const rankDisplay = getRankDisplay(squad.rank);
            const accent = getAccentColor(squad.rank, standings.length);

            return (
              <div
                key={squad.squad_id}
                className={`flex items-center gap-3 px-3 py-3 ${getRowStyles(squad.rank, standings.length)}`}
              >
                <span className={`font-oswald text-lg font-bold w-8 shrink-0 text-center ${rankDisplay.color}`}>
                  {rankDisplay.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className={`font-oswald font-semibold uppercase tracking-wide truncate ${accent}`}>
                    {squad.squad_name}
                  </div>
                  <div className="text-text-secondary text-xs truncate">{squad.owner}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`font-mono text-lg font-bold leading-tight ${accent}`}>
                    {squad.total_points.toFixed(2)}
                  </div>
                  <div className={`font-mono text-xs font-semibold ${getPayoutColor(squad.projected_payout)}`}>
                    {formatPayout(squad.projected_payout)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-oswald font-medium text-text-muted uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-oswald font-medium text-text-muted uppercase tracking-wider">
                  Team
                </th>
                <th className="px-3 lg:px-6 py-3 text-left text-xs font-oswald font-medium text-text-muted uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-3 lg:px-6 py-3 text-right text-xs font-oswald font-medium text-text-muted uppercase tracking-wider">
                  Payout
                </th>
                <th className="px-3 lg:px-6 py-3 text-right text-xs font-oswald font-medium text-text-muted uppercase tracking-wider">
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
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                      <span className={`font-oswald text-lg font-bold ${rankDisplay.color}`}>
                        {rankDisplay.icon}
                      </span>
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                      <span className={`font-oswald font-semibold uppercase tracking-wide ${getAccentColor(squad.rank, standings.length)}`}>
                        {squad.squad_name}
                      </span>
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                      <span className="text-text-secondary text-sm lg:text-base">{squad.owner}</span>
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-right">
                      <span className={`font-mono font-semibold ${getPayoutColor(squad.projected_payout)}`}>
                        {formatPayout(squad.projected_payout)}
                      </span>
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-right">
                      <span className={`font-mono text-lg lg:text-xl font-bold ${getAccentColor(squad.rank, standings.length)}`}>
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
          <div className="bg-dark-elevated px-3 sm:px-6 py-4 border-b border-border-subtle">
            <h3 className="font-oswald text-lg font-semibold text-white uppercase tracking-wide">
              Top 5 QBs Per Team
            </h3>
          </div>
          <div className="p-3 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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
                      <div key={qb.qb_id} className="flex justify-between items-baseline gap-2 text-sm">
                        <span className="text-text-secondary min-w-0 truncate">
                          <span className="text-gold mr-2">★</span>
                          {idx + 1}. {qb.name}
                          <span className="text-text-muted ml-1">({qb.nfl_team})</span>
                        </span>
                        <span className="font-mono font-semibold text-white shrink-0">
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
          <div className="relative p-5 sm:p-8 text-center">
            <div className="mb-4">
              <span className="inline-block px-4 py-1 bg-danger/30 rounded-full text-danger text-xs font-oswald uppercase tracking-widest">
                Hall of Shame
              </span>
            </div>

            <h2 className="font-oswald text-xl sm:text-2xl md:text-3xl font-bold text-danger uppercase tracking-wide mb-2">
              Worst QB of {season}
            </h2>

            <p className="font-oswald text-3xl sm:text-4xl md:text-5xl font-bold text-white uppercase tracking-wide mb-2">
              {worstQB.name}
            </p>

            <p className="text-text-secondary text-sm sm:text-base mb-4">
              {worstQB.nfl_team} • {worstQB.squad_name}
            </p>

            <p className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold text-danger mb-4">
              {worstQB.total_points.toFixed(2)}
              <span className="text-xl sm:text-2xl ml-2">pts</span>
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
