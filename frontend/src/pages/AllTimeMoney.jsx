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
    if (amount > 0) return 'text-green-600';
    if (amount < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          All-Time Money Standings
        </h1>
        <p className="text-gray-600">Historical payouts since 2021</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-green-600 text-white px-6 py-4">
          <h2 className="text-2xl font-bold">Lifetime Earnings</h2>
          <p className="text-sm opacity-90">Sorted by all-time winnings</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team
                </th>
                {years.map((year) => (
                  <th
                    key={year}
                    className="hidden sm:table-cell px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {year}
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  All Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {moneyData.map((row, idx) => (
                <tr
                  key={row.team}
                  className={idx === 0 ? 'bg-yellow-50' : 'hover:bg-gray-50'}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">
                      {idx === 0 && '🏆 '}
                      #{idx + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {row.team}
                    </div>
                  </td>
                  {years.map((year) => (
                    <td
                      key={year}
                      className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-right"
                    >
                      <div className={`text-sm font-medium ${getMoneyColor(row[year])}`}>
                        {formatMoney(row[year])}
                      </div>
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className={`text-lg font-bold ${getMoneyColor(row.allTime)}`}>
                      {formatMoney(row.allTime)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
