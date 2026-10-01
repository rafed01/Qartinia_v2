import React, { useState } from 'react';
import { QartiniaCrestSvg } from './QartiniaLogo';
import { QartiniaSection } from './Navbar';
import { ArrowRight } from 'lucide-react';

interface InvestorBlueprintViewProps {
  onNavigate: (section: QartiniaSection) => void;
}

const YEARLY_SCENARIO = [
  { year: 0, revenueM: 0, investmentM: 0, milestone: 'Company formation and product build' },
  { year: 1, revenueM: 0.5, investmentM: 1.0, milestone: 'Paid pilots + first subscriptions (€1M Seed)' },
  { year: 2, revenueM: 1.8, investmentM: 1.0, milestone: 'Live monitoring + enterprise workspaces' },
  { year: 3, revenueM: 4.5, investmentM: 5.0, milestone: 'Recurring enterprise traction (€4M Series A)' },
  { year: 4, revenueM: 11.0, investmentM: 5.0, milestone: 'Gulf strategic scale + multi-domain frontier' },
  { year: 5, revenueM: 22.0, investmentM: 15.0, milestone: 'Multi-domain scale + project revenue (€10M Series B)' },
  { year: 6, revenueM: 48.0, investmentM: 15.0, milestone: 'Asia entry + commercialization workflows' },
  { year: 7, revenueM: 95.0, investmentM: 35.0, milestone: 'International expansion + API/data (€20M Growth)' },
  { year: 8, revenueM: 185.0, investmentM: 35.0, milestone: 'US enterprise scale + transaction network' },
  { year: 9, revenueM: 310.0, investmentM: 35.0, milestone: 'Global frontier graph compounding' },
  { year: 10, revenueM: 480.0, investmentM: 35.0, milestone: 'Global subscriptions + ecosystem layers' },
];

export const InvestorBlueprintView: React.FC<InvestorBlueprintViewProps> = ({ onNavigate }) => {
  const [payingOrgs, setPayingOrgs] = useState(4000);
  const [blendedAcvK, setBlendedAcvK] = useState(100);
  const [ecosystemUpsideM, setEcosystemUpsideM] = useState(80);

  const modeledRecurringSoftwareM = Math.round((payingOrgs * blendedAcvK) / 1000);
  const modeledTotalRevenueM = modeledRecurringSoftwareM + ecosystemUpsideM;

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10 space-y-14">
      {/* SECTION 1: Concrete Product Wedge Reference (Page 2 of Business Plan) */}
      <section className="bg-white border border-slate-200 rounded-xl p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold tracking-wider text-[#108548] mb-1.5">
              A CONCRETE PRODUCT WEDGE
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F2537]">
              How Qartinia places a customer&apos;s technology against comparable frontiers
            </h1>
            <p className="text-sm text-slate-600 mt-2 max-w-4xl leading-relaxed">
              Imagine an automotive engineer has an inverter at 98.2% efficiency and wants to reach 99.5%. Qartinia does not simply return documents. It places the customer&apos;s technology against a condition-aware commercial frontier and research frontier, then shows what appears to cause the gap and which technologies, researchers, labs or products are relevant.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('frontier')}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-[#0F2537] rounded-lg hover:bg-[#16344D] flex items-center gap-1.5 self-start shrink-0 cursor-pointer whitespace-nowrap"
          >
            <span>Test Live in Qartinia Frontier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-300 rounded-lg">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#F2F4F8] border-b border-slate-300 text-[#0F2537]">
                <th className="py-2.5 px-4 font-bold border-r border-slate-300">Position</th>
                <th className="py-2.5 px-4 font-bold border-r border-slate-300">Illustrative Metric</th>
                <th className="py-2.5 px-4 font-bold">Meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="py-2.5 px-4 font-bold text-[#0F2537] border-r border-slate-200">
                  Customer technology
                </td>
                <td className="py-2.5 px-4 font-mono tabular-nums border-r border-slate-200">98.2%</td>
                <td className="py-2.5 px-4 text-slate-700">Where the company stands today</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold text-[#0F2537] border-r border-slate-200">
                  Commercial frontier
                </td>
                <td className="py-2.5 px-4 font-mono tabular-nums border-r border-slate-200">98.6%</td>
                <td className="py-2.5 px-4 text-slate-700">
                  Best comparable industrially available performance
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold text-[#0F2537] border-r border-slate-200">
                  Research frontier
                </td>
                <td className="py-2.5 px-4 font-mono tabular-nums border-r border-slate-200">99.0%</td>
                <td className="py-2.5 px-4 text-slate-700">
                  Best comparable research-demonstrated performance
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold text-[#0F2537] border-r border-slate-200">
                  Target
                </td>
                <td className="py-2.5 px-4 font-mono tabular-nums border-r border-slate-200">99.5%</td>
                <td className="py-2.5 px-4 text-slate-700">The customer&apos;s ambition</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 2: Business Model & Go-To-Market (Page 3 of Business Plan) */}
      <section className="bg-white border border-slate-200 rounded-xl p-8 space-y-8">
        <div>
          <div className="text-xs font-bold tracking-wider text-[#108548] mb-1.5">
            BUSINESS MODEL AND GO-TO-MARKET
          </div>
          <h2 className="text-3xl font-bold text-[#0F2537] tracking-tight">
            Start with a paid engineering decision, then grow with the customer.
          </h2>
        </div>

        {/* Accessible Entry, Expanding Account Value Table */}
        <div>
          <h3 className="text-lg font-bold text-[#108548] mb-3">
            Accessible entry, expanding account value
          </h3>
          <div className="overflow-x-auto border border-slate-300 rounded-lg">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#F2F4F8] border-b border-slate-300 text-[#0F2537]">
                  <th className="py-2.5 px-4 font-bold border-r border-slate-300">Offer</th>
                  <th className="py-2.5 px-4 font-bold border-r border-slate-300">Illustrative price</th>
                  <th className="py-2.5 px-4 font-bold">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-3 px-4 font-bold text-[#0F2537] border-r border-slate-200">
                    Frontier pilot / benchmark
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums border-r border-slate-200">
                    €8k–€20k
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    Paid proof around one real technical question
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-[#0F2537] border-r border-slate-200">
                    Team subscription
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums border-r border-slate-200">
                    €15k–€35k / year
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    Continuous monitoring, intelligence and collaboration
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-[#0F2537] border-r border-slate-200">
                    Enterprise
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums border-r border-slate-200">
                    €40k–€90k / year
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    Multiple teams, private workspaces and governance
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-[#0F2537] border-r border-slate-200">
                    Strategic enterprise
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums border-r border-slate-200">
                    €100k–€200k+ / year
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    Business units, API/data and custom programs
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-[#0F2537] border-r border-slate-200">
                    Projects / labs / experts
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums border-r border-slate-200">
                    Project or transaction fee
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    Execution and commercialization layer
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* International Expansion 4-Region Grid from Page 3 */}
        <div>
          <h3 className="text-lg font-bold text-[#108548] mb-3">International expansion</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-6 rounded-xl bg-[#F2F4F8] border border-[#DCE2EC]">
              <div className="text-sm font-bold text-[#0F2537] mb-2">EUROPE — BEACHHEAD</div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Use existing semiconductor and automotive credibility to win early design partners in R&amp;D and advanced engineering. Europe supplies reference customers and university relationships.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-[#FBF5EC] border border-[#E8D8C3]">
              <div className="text-sm font-bold text-[#C59B47] mb-2">
                GULF — STRATEGIC GROWTH HUB
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Build around advanced industry, mobility, energy transition, semiconductors and research commercialization. Strategic investors, industrial groups and universities can make the Gulf both a market and a partnership hub.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-[#EEF6F0] border border-[#C9E2D0]">
              <div className="text-sm font-bold text-[#108548] mb-2">ASIA — TECHNOLOGY DENSITY</div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Enter selected semiconductor, electronics, battery and automotive ecosystems through partnerships and targeted enterprise accounts.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-[#F2F4F8] border border-[#DCE2EC]">
              <div className="text-sm font-bold text-[#0F2537] mb-2">
                UNITED STATES — ENTERPRISE SCALE
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                After proving enterprise value and defensible data, target major semiconductor, automotive, aerospace and advanced-technology organizations.
              </p>
            </div>
          </div>
        </div>

        {/* Strategic Sequence Banner */}
        <div className="p-5 rounded-lg bg-[#FBF5EC] border border-[#E8D8C3] text-center">
          <p className="text-sm sm:text-base font-bold text-[#0F2537]">
            Europe for proof → Gulf for strategic scale → Asia for technology density → United States for enterprise scale.
          </p>
        </div>
      </section>

      {/* SECTION 3: Investment & Financial Scaling (Page 4 of Business Plan) */}
      <section className="bg-white border border-slate-200 rounded-xl p-8 space-y-8">
        <div>
          <div className="text-xs font-bold tracking-wider text-[#108548] mb-1.5">
            INVESTMENT AND FINANCIAL SCALING
          </div>
          <h2 className="text-3xl font-bold text-[#0F2537] tracking-tight">
            €1M seed to prove the wedge — then raise only when the next milestone is visible.
          </h2>
          <p className="text-sm text-slate-600 mt-2 max-w-4xl">
            The first capital is deliberately focused. It funds one high-value workflow, the first trustworthy frontier dataset, protected project infrastructure and enough commercial capacity to win reference customers. Later rounds are tied to product and market proof rather than to a fixed calendar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Seed Use Table & 12-18 Month Proof Points */}
          <div className="lg:col-span-5 space-y-6">
            <div className="overflow-x-auto border border-slate-300 rounded-lg">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#F2F4F8] border-b border-slate-300 text-[#0F2537]">
                    <th className="py-2.5 px-4 font-bold border-r border-slate-300">Seed use</th>
                    <th className="py-2.5 px-4 font-bold">Budget</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-[#0F2537] border-r border-slate-200">
                      Engineering + AI — Tunisia
                    </td>
                    <td className="py-2.5 px-4 font-mono tabular-nums">€300k</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-[#0F2537] border-r border-slate-200">
                      Senior product / technical — Europe
                    </td>
                    <td className="py-2.5 px-4 font-mono tabular-nums">€170k</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-[#0F2537] border-r border-slate-200">
                      Data, APIs, cloud + models
                    </td>
                    <td className="py-2.5 px-4 font-mono tabular-nums">€160k</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-[#0F2537] border-r border-slate-200">
                      Sales, pilots + partnerships
                    </td>
                    <td className="py-2.5 px-4 font-mono tabular-nums">€150k</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-[#0F2537] border-r border-slate-200">
                      Legal, IP + security
                    </td>
                    <td className="py-2.5 px-4 font-mono tabular-nums">€90k</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-[#0F2537] border-r border-slate-200">
                      Contingency / working capital
                    </td>
                    <td className="py-2.5 px-4 font-mono tabular-nums">€130k</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-5 rounded-xl bg-[#FAF9F6] border border-slate-200">
              <h3 className="text-base font-bold text-[#108548] mb-3">12–18 month proof points</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 list-disc pl-5">
                <li>10–15 design partners</li>
                <li>5+ recurring customers</li>
                <li>Live Frontier MVP</li>
                <li>Protected project rooms</li>
                <li>Structured evidence dataset</li>
                <li>Repeatable founder-led sales motion</li>
              </ul>
            </div>
          </div>

          {/* Right: Qartinia Annual Investment vs Annual Revenue Scenario Chart (Page 4) */}
          <div className="lg:col-span-7 bg-[#FAF9F6] border border-slate-200 rounded-xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-[#0F2537]">
                Qartinia: Annual Investment vs Annual Revenue Scenario (€0–€520M Linear Scale)
              </h3>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-[#1B4B72]">
                  <span className="w-3 h-0.5 bg-[#1B4B72] inline-block" /> Annual Revenue (€M)
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-[#5B8DB8]">
                  <span className="w-3 h-2.5 bg-[#5B8DB8] inline-block rounded-xs" /> External Investment (€M)
                </span>
              </div>
            </div>

            {/* SVG Chart Replicating Page 4 Linear €0–€520M Scale + Years 0–3 Inset */}
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <svg viewBox="0 0 640 300" className="w-full h-auto" role="img" aria-label="Qartinia 10-Year Investment vs Revenue Chart">
                {/* Grid lines */}
                {[0, 100, 200, 300, 400, 500].map((val) => {
                  const y = 260 - (val / 500) * 230;
                  return (
                    <g key={val}>
                      <line x1="55" y1={y} x2="610" y2={y} stroke="#E2E8F0" strokeWidth="1" />
                      <text x="48" y={y + 4} textAnchor="end" fontSize="10" fill="#64748B" fontFamily="JetBrains Mono">
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* X-Axis Years 0..10 */}
                {YEARLY_SCENARIO.map((pt, idx) => {
                  const x = 70 + idx * 52;
                  const barHeight = (pt.investmentM / 500) * 230;
                  return (
                    <g key={pt.year}>
                      <text x={x} y="278" textAnchor="middle" fontSize="10" fill="#475569" fontFamily="JetBrains Mono">
                        {pt.year}
                      </text>
                      {/* Investment bar on same linear scale */}
                      {pt.investmentM > 0 && (
                        <rect
                          x={x - 9}
                          y={260 - barHeight}
                          width="18"
                          height={Math.max(barHeight, 2)}
                          fill="#5B8DB8"
                        />
                      )}
                    </g>
                  );
                })}

                {/* Revenue Line Path */}
                <polyline
                  fill="none"
                  stroke="#1B4B72"
                  strokeWidth="2.5"
                  points={YEARLY_SCENARIO.map((pt, idx) => {
                    const x = 70 + idx * 52;
                    const y = 260 - (pt.revenueM / 500) * 230;
                    return `${x},${y}`;
                  }).join(' ')}
                />

                {/* Key Milestone Callouts */}
                {YEARLY_SCENARIO.map((pt, idx) => {
                  const x = 70 + idx * 52;
                  const y = 260 - (pt.revenueM / 500) * 230;
                  return (
                    <g key={`dot-${pt.year}`}>
                      <circle cx={x} cy={y} r="3.5" fill="#0F2537" />
                      {[1, 3, 5, 7, 10].includes(pt.year) && (
                        <text
                          x={x}
                          y={y - 8}
                          textAnchor="middle"
                          fontSize="9"
                          fontWeight="bold"
                          fill="#0F2537"
                          fontFamily="JetBrains Mono"
                        >
                          €{pt.revenueM}M
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Years 0-3 Zoom Inset Box */}
                <g transform="translate(80, 22)">
                  <rect x="0" y="0" width="210" height="105" fill="#FAF9F6" stroke="#CBD5E1" rx="4" />
                  <text x="105" y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#0F2537">
                    Years 0–3 Zoom (€0–€5M Scale)
                  </text>
                  {[0, 1, 2, 3].map((yr, i) => {
                    const bx = 35 + i * 46;
                    const rev = YEARLY_SCENARIO[yr].revenueM;
                    const inv =
                      yr === 1 ? 1.0 : yr === 3 ? 4.0 : 0;
                    const invH = (inv / 5) * 65;
                    return (
                      <g key={`zoom-${yr}`}>
                        <text x={bx} y="98" textAnchor="middle" fontSize="8" fill="#64748B" fontFamily="JetBrains Mono">
                          Y{yr}
                        </text>
                        {inv > 0 && (
                          <rect x={bx - 8} y={85 - invH} width="16" height={invH} fill="#5B8DB8" />
                        )}
                        <circle cx={bx} cy={85 - (rev / 5) * 65} r="2.5" fill="#0F2537" />
                      </g>
                    );
                  })}
                  <polyline
                    fill="none"
                    stroke="#1B4B72"
                    strokeWidth="1.8"
                    points={[0, 1, 2, 3]
                      .map((yr, i) => `${35 + i * 46},${85 - (YEARLY_SCENARIO[yr].revenueM / 5) * 65}`)
                      .join(' ')}
                  />
                </g>
              </svg>
            </div>

            {/* Interactive Year-10 Operating Leverage Calculator */}
            <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F2537]">
                  Interactive Year-10 Operating Leverage Model
                </span>
                <span className="text-xs font-mono font-bold text-[#108548]">
                  Modeled Total: €{modeledTotalRevenueM}M / yr
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1">
                    Paying Organizations: <strong className="font-mono text-[#0F2537]">{payingOrgs.toLocaleString()}</strong>
                  </label>
                  <input
                    type="range"
                    min={500}
                    max={6000}
                    step={100}
                    value={payingOrgs}
                    onChange={(e) => setPayingOrgs(Number(e.target.value))}
                    className="w-full accent-[#0F2537]"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">
                    Blended Annual Subscription: <strong className="font-mono text-[#0F2537]">€{blendedAcvK}k</strong>
                  </label>
                  <input
                    type="range"
                    min={40}
                    max={180}
                    step={5}
                    value={blendedAcvK}
                    onChange={(e) => setBlendedAcvK(Number(e.target.value))}
                    className="w-full accent-[#0F2537]"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">
                    Projects, API &amp; Data Upside: <strong className="font-mono text-[#0F2537]">€{ecosystemUpsideM}M</strong>
                  </label>
                  <input
                    type="range"
                    min={20}
                    max={150}
                    step={5}
                    value={ecosystemUpsideM}
                    onChange={(e) => setEcosystemUpsideM(Number(e.target.value))}
                    className="w-full accent-[#0F2537]"
                  />
                </div>
              </div>
              <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                Recurring Software Revenue: €{modeledRecurringSoftwareM}M + Project/API/Transaction Layers: €{ecosystemUpsideM}M = €{modeledTotalRevenueM}M (vs. ~€35M cumulative modeled external capital through Year 7).
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-lg bg-[#F2F4F8] border border-[#DCE2EC] text-center">
          <p className="text-sm sm:text-base font-bold text-[#0F2537]">
            The intended story is operating leverage: modest capital compared with the potential size of recurring platform revenue.
          </p>
        </div>
      </section>

      {/* SECTION 4: 10-Year Roadmap & Compounding Network Effects (Page 5 of Business Plan) */}
      <section className="bg-white border border-slate-200 rounded-xl p-8 space-y-8">
        <div>
          <div className="text-xs font-bold tracking-wider text-[#108548] mb-1.5">
            10-YEAR ROADMAP
          </div>
          <h2 className="text-3xl font-bold text-[#0F2537] tracking-tight">
            From one trusted engineering workflow to global deep-tech infrastructure.
          </h2>
        </div>

        <div className="overflow-x-auto border border-slate-300 rounded-lg">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#F2F4F8] border-b border-slate-300 text-[#0F2537]">
                <th className="py-2.5 px-4 font-bold border-r border-slate-300">Phase</th>
                <th className="py-2.5 px-4 font-bold border-r border-slate-300">Product evolution</th>
                <th className="py-2.5 px-4 font-bold border-r border-slate-300">Commercial objective</th>
                <th className="py-2.5 px-4 font-bold">Geography</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="py-3 px-4 font-bold text-[#0F2537] border-r border-slate-200">
                  0–18 months
                </td>
                <td className="py-3 px-4 text-slate-700 border-r border-slate-200">
                  Frontier MVP + protected projects
                </td>
                <td className="py-3 px-4 text-slate-700 border-r border-slate-200">
                  Paid pilots; first recurring accounts
                </td>
                <td className="py-3 px-4 text-slate-700">Europe + Tunisia core team</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-[#0F2537] border-r border-slate-200">
                  Years 2–3
                </td>
                <td className="py-3 px-4 text-slate-700 border-r border-slate-200">
                  Live monitoring + enterprise workspaces
                </td>
                <td className="py-3 px-4 font-mono tabular-nums text-slate-700 border-r border-slate-200">
                  €3M–€5M annual revenue range
                </td>
                <td className="py-3 px-4 text-slate-700">Europe + Gulf partnerships</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-[#0F2537] border-r border-slate-200">
                  Years 3–5
                </td>
                <td className="py-3 px-4 text-slate-700 border-r border-slate-200">
                  Multi-domain frontier + labs / experts / projects
                </td>
                <td className="py-3 px-4 font-mono tabular-nums text-slate-700 border-r border-slate-200">
                  €15M–€30M annual revenue range
                </td>
                <td className="py-3 px-4 text-slate-700">Gulf hub + selected Asia entry</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-[#0F2537] border-r border-slate-200">
                  Years 5–7
                </td>
                <td className="py-3 px-4 text-slate-700 border-r border-slate-200">
                  API/data + commercialization workflows
                </td>
                <td className="py-3 px-4 font-mono tabular-nums text-slate-700 border-r border-slate-200">
                  €70M–€100M annual revenue range
                </td>
                <td className="py-3 px-4 text-slate-700">Asia scale + first US growth</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-[#0F2537] border-r border-slate-200">
                  Years 8–10
                </td>
                <td className="py-3 px-4 text-slate-700 border-r border-slate-200">
                  Global frontier graph + transaction network
                </td>
                <td className="py-3 px-4 font-mono tabular-nums text-slate-700 border-r border-slate-200">
                  €300M–€480M annual revenue ambition
                </td>
                <td className="py-3 px-4 text-slate-700">Europe / Gulf / Asia / US network</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Closing Callout & Emblem from Page 5 */}
        <div className="p-6 rounded-xl bg-[#FBF5EC] border border-[#E8D8C3] text-center space-y-4">
          <p className="text-base sm:text-lg font-bold text-[#0F2537]">
            Know the frontier. Understand the gap. Find the right people. Build the project. Move technology forward.
          </p>
          <div className="flex flex-col items-center pt-2">
            <QartiniaCrestSvg className="w-12 h-12 mb-2" />
            <div className="font-brand text-lg font-bold tracking-widest text-[#0F2537]">
              QARTINIΛ
            </div>
            <div className="text-xs font-bold tracking-widest text-[#0F2537] mt-2">
              FROM RESEARCH TO INDUSTRY.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
