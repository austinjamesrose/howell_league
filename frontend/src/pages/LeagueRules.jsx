export default function LeagueRules() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          League Constitution
        </h1>
        <p className="text-gray-600">Official rules of the Howell League</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-purple-600 text-white px-6 py-4">
          <h2 className="text-2xl font-bold">Official Rules</h2>
        </div>

        <div className="p-6 space-y-8">
          {/* Section 1: League Name */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-3 border-b pb-2">1. League Name</h3>
            <p className="text-gray-700">
              The League shall be renamed after the previous season's worst rostered QB (who scored &gt; 0 points) following each Super Bowl.
            </p>
          </section>

          {/* Section 2: League Dues */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-3 border-b pb-2">2. League Dues</h3>
            <ul className="space-y-2 text-gray-700">
              <li>1. League Dues are payable to the League Winner following each Super Bowl.</li>
              <li>2. League Runner-Up need not pay League Dues.</li>
              <li>3. Last Place Finisher must pay triple (3x) League Dues.</li>
              <li className="ml-4">
                4. League Dues shall increase 10% each season, rounded to the nearest $5 interval.
                <ul className="ml-6 mt-2 space-y-1 text-sm">
                  <li>2021/22: $50/Squad</li>
                  <li>2022/23: $55/Squad</li>
                  <li>2023/24: $60/Squad</li>
                  <li>2024/25: $65/Squad</li>
                  <li className="font-semibold">2025/26: $70/Squad</li>
                </ul>
              </li>
              <li>5. Failure to pay League Dues prior to the NFL Draft will result in a vote for indefinite removal from the League ("Banishment"). A non-paying Owner will be Banished if at least 75% of the paying Owners vote to Banish.</li>
            </ul>
          </section>

          {/* Section 3: Roster Construction */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-3 border-b pb-2">3. Roster Construction</h3>
            <ul className="space-y-2 text-gray-700">
              <li>1. Each Squad is obligated to roster <span className="font-semibold">8 QBs</span> between the end of the Rookie/FA Draft and the following season's Release Window.</li>
              <li className="ml-4">
                2. Trades:
                <ul className="ml-6 mt-2 space-y-1 text-sm">
                  <li>Asset for Asset trades allowed between Super Bowl and end of Rookie/FA Draft</li>
                  <li>QB for QB trades allowed between end of Rookie/FA Draft and beginning of NFL Regular Season</li>
                  <li>Asset trades must have equal number of Assets on each side</li>
                  <li>QB trades must have equal number of QBs on each side</li>
                  <li>Trades may be vetoed by unanimous agreement of all non-trading Owners</li>
                </ul>
              </li>
            </ul>
          </section>

          {/* Section 4: Release Window */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-3 border-b pb-2">4. Release Window</h3>
            <ul className="space-y-2 text-gray-700">
              <li>1. Each Squad must release at least <span className="font-semibold">2 QBs</span> (Mandatory Release Amount) during the Saturday/Sunday/Monday following Day 2 of the NFL Draft.</li>
              <li>2. Squads may drop more than the Mandatory Release Amount (no maximum).</li>
              <li>3. Failure to comply results in automatic release of lowest scoring QB(s) from previous season.</li>
            </ul>
          </section>

          {/* Section 5: Rookie/FA Draft */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-3 border-b pb-2">5. Rookie/FA Draft</h3>
            <ul className="space-y-2 text-gray-700">
              <li>1. Commences at <span className="font-semibold">10:00 AM ET</span> on the Monday following the NFL Draft.</li>
              <li>2. Owners have <span className="font-semibold">8 hours</span> per selection.</li>
              <li>3. Any QB who has declared for the NFL Draft is eligible (including released QBs).</li>
              <li className="ml-4">
                4. Opening Rounds:
                <ul className="ml-6 mt-2 space-y-1 text-sm">
                  <li>Draft order is reverse of previous season's standings</li>
                  <li>NOT a snake-style draft</li>
                </ul>
              </li>
              <li className="ml-4">
                5. Additional Round:
                <ul className="ml-6 mt-2 space-y-1 text-sm">
                  <li>Squads releasing more than 2 QBs get additional picks</li>
                  <li>Order determined by points of released QBs</li>
                </ul>
              </li>
            </ul>
          </section>

          {/* Section 6: Scoring System */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-3 border-b pb-2">6. Scoring System</h3>
            <p className="text-gray-700 mb-4">Scoring is tallied on a season-long, aggregate basis.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Stat-Based Points</h4>
                <ul className="text-sm space-y-1 text-blue-800">
                  <li>25 Passing Yards = <span className="font-bold">1 pt</span></li>
                  <li>10 Rushing Yards = <span className="font-bold">1 pt</span></li>
                  <li>Touchdown (pass/rush/rec) = <span className="font-bold">6 pts</span></li>
                  <li>Interception = <span className="font-bold text-red-600">-3 pts</span></li>
                  <li>Fumble = <span className="font-bold text-red-600">-3 pts</span></li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Win Points</h4>
                <ul className="text-sm space-y-1 text-green-800">
                  <li>Regular Season Win = <span className="font-bold">3 pts</span></li>
                  <li>Prime Time Win = <span className="font-bold">4 pts</span> (+1 bonus)</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">Awards</h4>
                <ul className="text-sm space-y-1 text-yellow-800">
                  <li>MVP = <span className="font-bold">50 pts</span></li>
                  <li>MVP 2nd = <span className="font-bold">40 pts</span></li>
                  <li>MVP 3rd = <span className="font-bold">30 pts</span></li>
                  <li>MVP 4th = <span className="font-bold">20 pts</span></li>
                  <li>MVP 5th = <span className="font-bold">10 pts</span></li>
                  <li>Rookie of the Year = <span className="font-bold">30 pts</span></li>
                  <li>Conference POW = <span className="font-bold">10 pts</span></li>
                  <li>Conference POM = <span className="font-bold">20 pts</span></li>
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">Playoffs (Cumulative)</h4>
                <ul className="text-sm space-y-1 text-purple-800">
                  <li>Wild Card = <span className="font-bold">3 pts</span></li>
                  <li>Divisional Round = <span className="font-bold">6 pts</span></li>
                  <li>Conference Championship = <span className="font-bold">10 pts</span></li>
                  <li>Super Bowl = <span className="font-bold">15 pts</span></li>
                  <li>Super Bowl Win = <span className="font-bold">+25 pts</span></li>
                </ul>
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-4 italic">
              * Win/playoff points awarded to the starting QB only
            </p>
          </section>

          {/* Section 7: Final Standings */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-3 border-b pb-2">7. Final Standings</h3>
            <ul className="space-y-2 text-gray-700">
              <li>1. Final standings tallied after the Super Bowl.</li>
              <li>2. Standings are cumulative (season-long basis).</li>
              <li>3. Only the <span className="font-semibold">top 5 scoring QBs</span> per Squad count toward final standings.</li>
            </ul>
          </section>

          {/* Section 8: Rule Changes */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-3 border-b pb-2">8. Rule Changes</h3>
            <ul className="space-y-2 text-gray-700">
              <li>1. Rule changes may be proposed between end of Super Bowl and beginning of NFL season.</li>
              <li>2. Rule changes require <span className="font-semibold">80% approval</span> of non-proposing Owners.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
