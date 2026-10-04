import React, { useState } from 'react';
import { QARTINIA_EMBLEM_SRC, QartiniaCrestSvg } from './QartiniaLogo';
import { QartiniaSection } from './Navbar';
import { ArrowRight, ShieldCheck, Layers, Compass, Lock } from 'lucide-react';

interface OverviewSolutionViewProps {
  onNavigate: (section: QartiniaSection) => void;
  frontiersCount: number;
  projectsCount: number;
  evidenceCount: number;
}

interface FlywheelNode {
  id: string;
  title: string;
  subtitle: string;
  directionLabel: string;
  detail: string;
}

const FLYWHEEL_NODES: FlywheelNode[] = [
  {
    id: 'original-intel',
    title: 'Original technical intelligence',
    subtitle: 'Patents, publications, market data and real-time signals',
    directionLabel: 'INFORMS → Qartinia Intelligence',
    detail:
      'Continuously ingests and normalizes scientific publications, global patent filings, product datasheets, industrial standards, and approved technical datasets into condition-aware engineering records.',
  },
  {
    id: 'experts',
    title: 'Experts + contributors',
    subtitle: 'Researchers, engineers, industry specialists',
    directionLabel: 'ENRICHES → Qartinia Intelligence',
    detail:
      'Principal investigators, laboratory directors, and domain engineers contribute experimental context, operating envelope boundaries, and manufacturability insights that raw papers omit.',
  },
  {
    id: 'knowledge-graph',
    title: 'Better AI + knowledge graph',
    subtitle: 'Structured, connected and validated intelligence',
    directionLabel: '← POWERED BY Qartinia Intelligence',
    detail:
      'Structures performance claims by comparable operating conditions (temperature, frequency, substrate, reliability, cost) rather than keyword similarity.',
  },
  {
    id: 'enterprise-problems',
    title: 'Enterprise problems',
    subtitle: 'Strategic, technical and market challenges',
    directionLabel: 'DRIVES DEMAND → Qartinia Intelligence',
    detail:
      'R&D leaders benchmark their current technology against the condition-aware commercial frontier and research frontier to make high-conviction engineering decisions.',
  },
  {
    id: 'events-signals',
    title: 'Events + people signals',
    subtitle: 'Conferences, partnerships, talent and market dynamics',
    directionLabel: '← CREATES OPPORTUNITIES',
    detail:
      'Tracks emerging laboratory breakthroughs, conference demonstrations, and researcher mobility to alert customers when a relevant technical frontier moves.',
  },
  {
    id: 'audience',
    title: 'Audience + organic discovery',
    subtitle: 'Companies, investors, researchers and innovators',
    directionLabel: '← AMPLIFIES Qartinia Intelligence',
    detail:
      'High-trust technical benchmarks and verified reference outcomes attract new industrial groups, universities, and sovereign innovation programs across Europe, the Gulf, Asia, and the US.',
  },
];

export const OverviewSolutionView: React.FC<OverviewSolutionViewProps> = ({
  onNavigate,
  frontiersCount,
  projectsCount,
  evidenceCount,
}) => {
  const [selectedNode, setSelectedNode] = useState<FlywheelNode>(FLYWHEEL_NODES[0]);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10 space-y-14">
      {/* SECTION 1: Founder Vision & The Gap (Page 1 of Business Plan) */}
      <section className="bg-white border border-slate-200 rounded-xl p-8 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="text-xs font-bold tracking-wider text-[#108548]">
              Founder-Led Deep-Tech Infrastructure
            </div>
            <h1 className="font-brand text-4xl sm:text-5xl font-bold text-[#0F2537] tracking-wide">
              QARTINIA
            </h1>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#108548] leading-snug">
              Turning fragmented deep-tech knowledge into a clear path from engineering problem to evidence, collaboration and industrial impact.
            </h2>

            <div className="space-y-3.5 text-sm sm:text-base text-slate-700 leading-relaxed">
              <p>
                Industry has urgent engineering problems, while researchers often already hold pieces of the answer. Yet the two worlds remain separated by fragmented information, slow discovery, legal friction, NDAs, IP concerns, publication rights and relationships that depend too heavily on who already knows whom.
              </p>
              <p className="font-semibold text-[#0F2537]">
                Qartinia is built to bridge that gap — connecting semiconductor physics, automotive and industrial innovation, scientific research, and protected execution.
              </p>
            </div>

            {/* Primary Actions to Launch Both Engines */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('frontier')}
                className="px-5 py-3 text-sm font-semibold text-white bg-[#0F2537] rounded-lg hover:bg-[#16344D] transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Compass className="w-4 h-4 text-[#C59B47]" />
                <span>Launch Qartinia Frontier</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('projects')}
                className="px-5 py-3 text-sm font-semibold text-[#0F2537] bg-[#FBF5EC] hover:bg-[#F5E8D6] border border-[#E6D5BE] rounded-lg transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Lock className="w-4 h-4 text-[#108548]" />
                <span>Open Qartinia Projects</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('evidence')}
                className="px-4 py-3 text-sm font-semibold text-slate-700 hover:text-[#0F2537] border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
              >
                Inspect Evidence Graph
              </button>
            </div>
          </div>

          {/* Right Column: Official Qartinia Heritage Emblem Artwork from Page 1 */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-md rounded-xl overflow-hidden border border-[#E6D5BE] bg-[#FBF5EC] shadow-xs">
              <img
                src={QARTINIA_EMBLEM_SRC}
                alt="Qartinia — Connecting Minds, Building Tomorrow"
                referrerPolicy="no-referrer"
                className="w-full aspect-square object-cover"
              />
              <div className="p-5 text-center bg-[#FBF5EC] border-t border-[#E6D5BE]">
                <div className="font-brand text-2xl font-bold text-[#0F2537] tracking-widest">
                  QARTINIΛ
                </div>
                <div className="text-[11px] font-semibold text-slate-600 tracking-widest mt-1">
                  Connecting Minds · Building Tomorrow
                </div>
                <div className="text-[11px] text-slate-500 mt-2">
                  Research · People · Technology · Impact
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Warm Sandstone Highlight Box from Page 1 */}
        <div className="mt-10 p-6 rounded-lg bg-[#FBF5EC] border border-[#E8D8C3] text-center">
          <p className="text-base sm:text-lg font-bold text-[#0F2537] max-w-4xl mx-auto">
            Qartinia is being built to turn fragmented deep-tech knowledge into a clear path from engineering problem to evidence, collaboration and industrial impact.
          </p>
        </div>

        {/* "The gap is bigger than search" 4 Pillars from Page 1 */}
        <div className="mt-10">
          <h3 className="text-lg font-bold text-[#108548] mb-4">The gap is bigger than search</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-lg bg-[#FAF9F6] border border-slate-200 text-sm text-slate-700 leading-relaxed">
              <strong className="text-[#0F2537] block mb-1">1. Fragmented Engineering Evidence</strong>
              Technical knowledge is scattered across papers, patents, product datasheets, standards, conferences, startups, laboratories, suppliers and private expert networks. Engineers spend time reconstructing the picture before they can make a decision.
            </div>
            <div className="p-5 rounded-lg bg-[#FAF9F6] border border-slate-200 text-sm text-slate-700 leading-relaxed">
              <strong className="text-[#0F2537] block mb-1">2. Legal, NDA & IP Collaboration Friction</strong>
              Industry often returns to the same trusted universities because opening a new collaboration can trigger weeks of NDA, IP-ownership, publication-right and legal negotiation.
            </div>
            <div className="p-5 rounded-lg bg-[#FAF9F6] border border-slate-200 text-sm text-slate-700 leading-relaxed">
              <strong className="text-[#0F2537] block mb-1">3. Lack of Condition-Aware Comparability</strong>
              Research is rarely packaged in the way industry needs: comparable operating conditions, maturity, manufacturability, reliability, cost and relevance to a specific commercial application.
            </div>
            <div className="p-5 rounded-lg bg-[#FAF9F6] border border-slate-200 text-sm text-slate-700 leading-relaxed">
              <strong className="text-[#0F2537] block mb-1">4. Missing Continuous Frontier Reference</strong>
              Companies understand their own technology but often lack a continuously updated external reference point showing the commercial frontier, the research frontier and what has changed since the last review.
            </div>
          </div>
        </div>

        {/* Cool Slate Callout Box from Bottom of Page 1 */}
        <div className="mt-8 p-6 rounded-lg bg-[#F2F4F8] border border-[#DCE2EC] text-center">
          <p className="text-base font-bold text-[#0F2537] max-w-4xl mx-auto">
            The real need is not more information. It is a trusted answer to: Where are we? What is possible now? What has research already demonstrated? What should we do next?
          </p>
        </div>
      </section>

      {/* SECTION 2: The Qartinia Solution — Two Connected Engines (Page 2 of Business Plan) */}
      <section className="space-y-8">
        <div>
          <div className="text-xs font-bold tracking-wider text-[#108548] mb-2">
            The Qartinia Solution
          </div>
          <h2 className="text-3xl font-bold text-[#0F2537] tracking-tight">
            One platform, two connected engines: intelligence and protected collaboration.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Engine 1: QARTINIA FRONTIER */}
          <div className="bg-[#FBF5EC] border border-[#E8D8C3] rounded-xl p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-sm font-bold text-[#108548] tracking-wide">
                  QARTINIA FRONTIER
                </span>
                <span className="text-xs font-mono tabular-nums text-slate-600">
                  {frontiersCount} Active Frontier Benchmarks
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#0F2537] mb-4">
                Know where your technology stands — and when the world moves.
              </h3>
              <ul className="space-y-3 text-sm text-slate-700 leading-relaxed list-disc pl-5 mb-6">
                <li>
                  Customer enters the current technology, operating envelope, constraints and target.
                </li>
                <li>
                  Qartinia structures external evidence and builds comparable commercial and research frontiers.
                </li>
                <li>
                  It identifies the gap, the technologies closest to closing it and the evidence behind each conclusion.
                </li>
                <li>
                  When new evidence moves a relevant frontier, affected customer analyses are re-evaluated.
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('frontier')}
              className="w-full py-3 px-4 text-xs font-semibold text-white bg-[#0F2537] rounded-lg hover:bg-[#16344D] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Open Qartinia Frontier Engine</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Engine 2: QARTINIA PROJECTS */}
          <div className="bg-[#FBF5EC] border border-[#E8D8C3] rounded-xl p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-sm font-bold text-[#108548] tracking-wide">
                  QARTINIA PROJECTS
                </span>
                <span className="text-xs font-mono tabular-nums text-slate-600">
                  {projectsCount} Protected Project Rooms
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#0F2537] mb-4">
                Move from discovery to a protected project with the right people.
              </h3>
              <ul className="space-y-3 text-sm text-slate-700 leading-relaxed list-disc pl-5 mb-6">
                <li>
                  Companies, universities, labs and experts collaborate inside structured project rooms.
                </li>
                <li>
                  Permissions, documents, milestones and technical exchanges remain inside the project boundary.
                </li>
                <li>
                  Structured legal stages can reduce friction around NDA, IP, publication rights and technical handover.
                </li>
                <li>
                  The chat is collaboration infrastructure, not shared-model training data.
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('projects')}
              className="w-full py-3 px-4 text-xs font-semibold text-white bg-[#0F2537] rounded-lg hover:bg-[#16344D] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Open Qartinia Projects Engine</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 3: Deliberate Trust Architecture & Interactive Intelligence Flywheel (Page 2 of Business Plan) */}
      <section className="bg-white border border-slate-200 rounded-xl p-8 lg:p-10 space-y-8">
        <div className="max-w-4xl">
          <h3 className="text-xl font-bold text-[#108548] mb-2">
            A deliberate trust architecture
          </h3>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Qartinia&apos;s shared intelligence model is designed around research and technical evidence: scientific publications, patents, product data, standards, public technical sources and other approved datasets. Private project-room messages, discussions and files are segregated from that shared intelligence corpus and are not used to train or improve the shared model.
          </p>
        </div>

        {/* Interactive 6-Node Qartinia Intelligence Architecture Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-[#FAF9F6] border border-slate-200 rounded-xl p-6 lg:p-8">
          {/* Left 3 Nodes */}
          <div className="lg:col-span-4 space-y-4">
            {[FLYWHEEL_NODES[0], FLYWHEEL_NODES[1], FLYWHEEL_NODES[2]].map((node) => {
              const active = selectedNode.id === node.id;
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setSelectedNode(node)}
                  className={`w-full text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                    active
                      ? 'bg-white border-[#0F2537] shadow-xs'
                      : 'bg-white/80 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <div className="text-[11px] font-mono text-[#108548] mb-1">
                    {node.directionLabel}
                  </div>
                  <div className="text-sm font-bold text-[#0F2537]">{node.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{node.subtitle}</div>
                </button>
              );
            })}
          </div>

          {/* Center Core: QARTINIA INTELLIGENCE */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center py-4">
            <div className="w-56 h-56 rounded-full bg-[#0F2537] text-white flex flex-col items-center justify-center p-6 text-center shadow-md border-4 border-[#C59B47]/40">
              <QartiniaCrestSvg className="w-12 h-12 mb-2" />
              <div className="font-brand text-lg font-bold tracking-widest text-white">
                QARTINIΛ
              </div>
              <div className="text-[10px] tracking-widest text-[#C59B47] font-semibold mt-0.5">
                INTELLIGENCE
              </div>
              <div className="text-[10px] text-slate-300 mt-2 leading-tight">
                Connecting Minds · Building Tomorrow
              </div>
            </div>
            <div className="mt-4 text-[11px] font-semibold tracking-widest text-slate-500 text-center">
              FROM KNOWLEDGE TO IMPACT. TOGETHER.
            </div>
          </div>

          {/* Right 3 Nodes */}
          <div className="lg:col-span-4 space-y-4">
            {[FLYWHEEL_NODES[5], FLYWHEEL_NODES[4], FLYWHEEL_NODES[3]].map((node) => {
              const active = selectedNode.id === node.id;
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setSelectedNode(node)}
                  className={`w-full text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                    active
                      ? 'bg-white border-[#0F2537] shadow-xs'
                      : 'bg-white/80 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <div className="text-[11px] font-mono text-[#108548] mb-1">
                    {node.directionLabel}
                  </div>
                  <div className="text-sm font-bold text-[#0F2537]">{node.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{node.subtitle}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Node Inspection Bar + Segregation Guarantee */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
          <div className="lg:col-span-7 p-5 rounded-lg bg-[#F2F4F8] border border-[#DCE2EC]">
            <div className="text-xs font-mono text-[#108548] mb-1">
              Selected Architecture Layer · {selectedNode.directionLabel}
            </div>
            <div className="text-base font-bold text-[#0F2537] mb-1">{selectedNode.title}</div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {selectedNode.detail}
            </p>
          </div>

          <div className="lg:col-span-5 p-5 rounded-lg bg-[#FBF5EC] border border-[#E8D8C3] flex items-start gap-3.5">
            <ShieldCheck className="w-5 h-5 text-[#108548] shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 leading-relaxed">
              <strong className="text-[#0F2537] block mb-1">
                Strict Project-Boundary Segregation
              </strong>
              Frontier intelligence creates the decision; protected project infrastructure creates the path to execution. Project-room files and chat never enter shared-model training.
            </div>
          </div>
        </div>

        {/* Live Workspace Telemetry Footer */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-4 font-mono tabular-nums">
            <span>Monitored Frontiers: {frontiersCount}</span>
            <span>·</span>
            <span>Protected Project Rooms: {projectsCount}</span>
            <span>·</span>
            <span>Structured Evidence Records: {evidenceCount}</span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('evidence')}
            className="font-semibold text-[#0F2537] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Inspect Structured Evidence Graph</span>
          </button>
        </div>
      </section>
    </div>
  );
};
