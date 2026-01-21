export default function LeagueRules() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="font-oswald text-4xl md:text-5xl font-bold text-white tracking-wide uppercase mb-2">
          League Constitution
        </h1>
        <p className="text-text-secondary font-mono text-sm">
          Official rules of the Howell League
        </p>
      </div>

      {/* Rules Container */}
      <div className="bg-dark-surface rounded-lg border border-border-subtle overflow-hidden">
        {/* Header */}
        <div className="bg-gold/10 border-b border-gold/20 px-6 py-4">
          <h2 className="font-oswald text-2xl font-bold text-gold uppercase tracking-wide">
            Official Rules
          </h2>
        </div>

        <div className="p-6 space-y-8">
          {/* Section 1: League Name */}
          <section>
            <h3 className="font-oswald text-xl font-bold text-white uppercase tracking-wide mb-3 pb-2 border-b border-border-subtle">
              1. League Name
            </h3>
            <p className="text-text-secondary">
              The League shall be renamed after the previous season's worst rostered QB (who scored &gt; 0 points) following each Super Bowl.
            </p>
          </section>

          {/* Section 2: League Dues */}
          <section>
            <h3 className="font-oswald text-xl font-bold text-white uppercase tracking-wide mb-3 pb-2 border-b border-border-subtle">
              2. League Dues
            </h3>
            <ul className="space-y-3 text-text-secondary">
              <li>1. League Dues are payable to the League Winner following each Super Bowl.</li>
              <li>2. League Runner-Up need not pay League Dues.</li>
              <li>3. Last Place Finisher must pay <span className="text-danger font-semibold">triple (3x)</span> League Dues.</li>
              <li className="ml-4">
                4. League Dues shall increase 10% each season, rounded to the nearest $5 interval.
                <ul className="ml-6 mt-2 space-y-1 text-sm text-text-muted font-mono">
                  <li>2021/22: $50/Squad</li>
                  <li>2022/23: $55/Squad</li>
                  <li>2023/24: $60/Squad</li>
                  <li>2024/25: $65/Squad</li>
                  <li className="text-gold font-semibold">2025/26: $70/Squad</li>
                </ul>
              </li>
              <li>5. Failure to pay League Dues prior to the NFL Draft will result in a vote for indefinite removal from the League (<span className="text-danger">"Banishment"</span>). A non-paying Owner will be Banished if at least 75% of the paying Owners vote to Banish.</li>
            </ul>
          </section>

          {/* Section 3: Roster Construction */}
          <section>
            <h3 className="font-oswald text-xl font-bold text-white uppercase tracking-wide mb-3 pb-2 border-b border-border-subtle">
              3. Roster Construction
            </h3>
            <ul className="space-y-3 text-text-secondary">
              <li>1. Each Squad is obligated to roster <span className="text-gold font-semibold">8 QBs</span> between the end of the Rookie/FA Draft and the following season's Release Window.</li>
              <li className="ml-4">
                2. Trades:
                <ul className="ml-6 mt-2 space-y-1 text-sm text-text-muted">
                  <li>• Asset for Asset trades allowed between Super Bowl and end of Rookie/FA Draft</li>
                  <li>• QB for QB trades allowed between end of Rookie/FA Draft and beginning of NFL Regular Season</li>
                  <li>• Asset trades must have equal number of Assets on each side</li>
                  <li>• QB trades must have equal number of QBs on each side</li>
                  <li>• Trades may be vetoed by unanimous agreement of all non-trading Owners</li>
                </ul>
              </li>
            </ul>
          </section>

          {/* Section 4: Release Window */}
          <section>
            <h3 className="font-oswald text-xl font-bold text-white uppercase tracking-wide mb-3 pb-2 border-b border-border-subtle">
              4. Release Window
            </h3>
            <ul className="space-y-3 text-text-secondary">
              <li>1. Each Squad must release at least <span className="text-gold font-semibold">2 QBs</span> (Mandatory Release Amount) during the Saturday/Sunday/Monday following Day 2 of the NFL Draft.</li>
              <li>2. Squads may drop more than the Mandatory Release Amount (no maximum).</li>
              <li>3. Failure to comply results in automatic release of lowest scoring QB(s) from previous season.</li>
            </ul>
          </section>

          {/* Section 5: Rookie/FA Draft */}
          <section>
            <h3 className="font-oswald text-xl font-bold text-white uppercase tracking-wide mb-3 pb-2 border-b border-border-subtle">
              5. Rookie/FA Draft
            </h3>
            <ul className="space-y-3 text-text-secondary">
              <li>1. Commences at <span className="text-gold font-semibold">10:00 AM ET</span> on the Monday following the NFL Draft.</li>
              <li>2. Owners have <span className="text-gold font-semibold">8 hours</span> per selection.</li>
              <li>3. Any QB who has declared for the NFL Draft is eligible (including released QBs).</li>
              <li className="ml-4">
                4. Opening Rounds:
                <ul className="ml-6 mt-2 space-y-1 text-sm text-text-muted">
                  <li>• Draft order is reverse of previous season's standings</li>
                  <li>• NOT a snake-style draft</li>
                </ul>
              </li>
              <li className="ml-4">
                5. Additional Round:
                <ul className="ml-6 mt-2 space-y-1 text-sm text-text-muted">
                  <li>• Squads releasing more than 2 QBs get additional picks</li>
                  <li>• Order determined by points of released QBs</li>
                </ul>
              </li>
            </ul>
          </section>

          {/* Section 6: Scoring System */}
          <section>
            <h3 className="font-oswald text-xl font-bold text-white uppercase tracking-wide mb-3 pb-2 border-b border-border-subtle">
              6. Scoring System
            </h3>
            <p className="text-text-secondary mb-4">
              Scoring is tallied on a <span className="text-gold">season-long, aggregate basis</span>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Stat-Based Points */}
              <div className="bg-dark-primary p-4 rounded-lg border border-border-subtle">
                <h4 className="font-oswald font-semibold text-white uppercase tracking-wide mb-3">
                  Stat-Based Points
                </h4>
                <ul className="text-sm space-y-2 text-text-secondary font-mono">
                  <li className="flex justify-between">
                    <span>25 Passing Yards</span>
                    <span className="text-white font-bold">1 pt</span>
                  </li>
                  <li className="flex justify-between">
                    <span>10 Rushing Yards</span>
                    <span className="text-white font-bold">1 pt</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Touchdown (pass/rush/rec)</span>
                    <span className="text-success font-bold">6 pts</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Interception</span>
                    <span className="text-danger font-bold">-3 pts</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Fumble</span>
                    <span className="text-danger font-bold">-3 pts</span>
                  </li>
                </ul>
              </div>

              {/* Win Points */}
              <div className="bg-dark-primary p-4 rounded-lg border border-gold/20">
                <h4 className="font-oswald font-semibold text-gold uppercase tracking-wide mb-3">
                  Win Points
                </h4>
                <ul className="text-sm space-y-2 text-text-secondary font-mono">
                  <li className="flex justify-between">
                    <span>Regular Season Win</span>
                    <span className="text-white font-bold">3 pts</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Prime Time Win</span>
                    <span className="text-gold font-bold">4 pts</span>
                  </li>
                </ul>
              </div>

              {/* Awards */}
              <div className="bg-dark-primary p-4 rounded-lg border border-gold/20">
                <h4 className="font-oswald font-semibold text-gold uppercase tracking-wide mb-3">
                  Awards
                </h4>
                <ul className="text-sm space-y-2 text-text-secondary font-mono">
                  <li className="flex justify-between">
                    <span>MVP (1st)</span>
                    <span className="text-gold font-bold">50 pts</span>
                  </li>
                  <li className="flex justify-between">
                    <span>MVP (2nd-5th)</span>
                    <span className="text-white font-bold">40/30/20/10</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Rookie of the Year</span>
                    <span className="text-gold font-bold">30 pts</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Conference POW</span>
                    <span className="text-white font-bold">10 pts</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Conference POM</span>
                    <span className="text-white font-bold">20 pts</span>
                  </li>
                </ul>
              </div>

              {/* Playoffs */}
              <div className="bg-dark-primary p-4 rounded-lg border border-success/20">
                <h4 className="font-oswald font-semibold text-success uppercase tracking-wide mb-3">
                  Playoffs (Cumulative)
                </h4>
                <ul className="text-sm space-y-2 text-text-secondary font-mono">
                  <li className="flex justify-between">
                    <span>Wild Card</span>
                    <span className="text-white font-bold">3 pts</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Divisional Round</span>
                    <span className="text-white font-bold">6 pts</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Conference Championship</span>
                    <span className="text-white font-bold">10 pts</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Super Bowl</span>
                    <span className="text-white font-bold">15 pts</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Super Bowl Win</span>
                    <span className="text-gold font-bold">+25 pts</span>
                  </li>
                </ul>
              </div>
            </div>

            <p className="text-xs text-text-muted mt-4 italic">
              * Win/playoff points awarded to the starting QB only
            </p>
          </section>

          {/* Section 7: Final Standings */}
          <section>
            <h3 className="font-oswald text-xl font-bold text-white uppercase tracking-wide mb-3 pb-2 border-b border-border-subtle">
              7. Final Standings
            </h3>
            <ul className="space-y-3 text-text-secondary">
              <li>1. Final standings tallied after the Super Bowl.</li>
              <li>2. Standings are cumulative (season-long basis).</li>
              <li>3. Only the <span className="text-gold font-semibold">top 5 scoring QBs</span> per Squad count toward final standings.</li>
            </ul>
          </section>

          {/* Section 8: Rule Changes */}
          <section>
            <h3 className="font-oswald text-xl font-bold text-white uppercase tracking-wide mb-3 pb-2 border-b border-border-subtle">
              8. Rule Changes
            </h3>
            <ul className="space-y-3 text-text-secondary">
              <li>1. Rule changes may be proposed between end of Super Bowl and beginning of NFL season.</li>
              <li>2. Rule changes require <span className="text-gold font-semibold">80% approval</span> of non-proposing Owners.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
