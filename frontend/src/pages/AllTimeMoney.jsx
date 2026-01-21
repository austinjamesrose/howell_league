export default function AllTimeMoney() {
  const moneyData = [
    { team: 'Team Jar-Jar', 2024: -65, 2023: 360, 2022: 330, 2021: 0, allTime: 625 },
    { team: 'Team TK', 2024: 390, 2023: -60, 2022: 0, 2021: -50, allTime: 280 },
    { team: 'Team BMOC', 2024: -65, 2023: -180, 2022: -55, 2021: 300, allTime: 0 },
    { team: 'Team AP', 2024: 0, 2023: 0, 2022: -55, 2021: -150, allTime: -205 },
    { team: 'Team ROSE', 2024: -65, 2023: -60, 2022: -165, 2021: -50, allTime: -340 },
    { team: 'Team MOJO', 2024: -195, 2023: -60, 2022: -55, 2021: -50, allTime: -360 },
  ];

  const years = [2024, 2023, 2022, 2021];

  const formatMoney = (amount) => {
    if (amount > 0) return `+$${amount}`;
    if (amount < 0) return `-$${Math.abs(amount)}`;
    return '$0';
  };

  const getMoneyColor = (amount) => {
    if (amount > 0) return 'text-success';
    if (amount < 0) return 'text-danger';
    return 'text-text-secondary';
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="font-oswald text-4xl md:text-5xl font-bold text-white tracking-wide uppercase mb-2">
          All-Time Money
        </h1>
        <p className="text-text-secondary font-mono text-sm">
          Historical payouts since 2021
        </p>
      </div>

      {/* Money Table */}
      <div className="bg-dark-surface rounded-lg border border-border-subtle overflow-hidden">
        {/* Header */}
        <div className="bg-success/10 border-b border-success/20 px-6 py-4">
          <h2 className="font-oswald text-2xl font-bold text-success uppercase tracking-wide">
            Lifetime Earnings
          </h2>
          <p className="text-text-muted text-sm">Sorted by all-time winnings</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle bg-dark-elevated">
                <th className="px-6 py-3 text-left text-xs font-oswald font-medium text-text-muted uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-oswald font-medium text-text-muted uppercase tracking-wider">
                  Team
                </th>
                {years.map((year) => (
                  <th
                    key={year}
                    className="hidden sm:table-cell px-6 py-3 text-right text-xs font-oswald font-medium text-text-muted uppercase tracking-wider"
                  >
                    {year}
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-oswald font-medium text-text-muted uppercase tracking-wider">
                  All Time
                </th>
              </tr>
            </thead>
            <tbody>
              {moneyData.map((row, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === moneyData.length - 1;

                return (
                  <tr
                    key={row.team}
                    className={`
                      table-row-hover border-b border-border-subtle last:border-b-0
                      ${isFirst ? 'bg-success/5 border-glow-gold' : ''}
                      ${isLast ? 'bg-danger/5' : ''}
                    `}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-oswald text-lg font-bold ${isFirst ? 'text-gold' : isLast ? 'text-danger' : 'text-text-secondary'}`}>
                        {isFirst && '🏆 '}
                        {isLast && '💸 '}
                        #{idx + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-oswald font-semibold uppercase tracking-wide ${isFirst ? 'text-gold' : 'text-white'}`}>
                        {row.team}
                      </span>
                    </td>
                    {years.map((year) => (
                      <td
                        key={year}
                        className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-right"
                      >
                        <span className={`font-mono text-sm font-medium ${getMoneyColor(row[year])}`}>
                          {formatMoney(row[year])}
                        </span>
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={`font-mono text-xl font-bold ${getMoneyColor(row.allTime)}`}>
                        {formatMoney(row.allTime)}
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
            Net winnings across all seasons • Updated after Super Bowl
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-success"></span>
          <span className="text-text-secondary">Won money</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-danger"></span>
          <span className="text-text-secondary">Lost money</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-text-muted"></span>
          <span className="text-text-secondary">Break even</span>
        </div>
      </div>
    </div>
  );
}
