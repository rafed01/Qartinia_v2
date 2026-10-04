import React, { useState } from 'react';
import { QartiniaSection } from '../types/qartinia';
import { QartiniaCrestSvg } from './QartiniaLogo';
import {
  Compass,
  Lock,
  Network,
  Cpu,
  FlaskConical,
  GraduationCap,
  Activity,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface PlatformArchitectureViewProps {
  onNavigate: (section: QartiniaSection) => void;
  frontiersCount: number;
  projectsCount: number;
  evidenceCount: number;
  suppliersCount: number;
  labsCount: number;
  expertsCount: number;
  simulationsCount: number;
  brainstormCount: number;
}

interface ArchitectureLayer {
  id: string;
  number: string;
  name: string;
  flowDirection: string;
  coreFunction: string;
  operationalDetails: string[];
  keyOutputs: string;
  targetSection: QartiniaSection;
}

const ARCHITECTURE_LAYERS: ArchitectureLayer[] = [
  {
    id: 'layer-intel',
    number: '01',
    name: 'Original Technical Intelligence',
    flowDirection: 'INGESTION & HARVESTING → KNOWLEDGE GRAPH',
    coreFunction:
      'Continuous ingestion, normalization, and condition-aware parsing of scientific publications, global patent filings, component datasheets, and international standards.',
    operationalDetails: [
      'Extracts operating parameters (voltage, temperature, frequency, substrate metallurgy) rather than generic text keywords',
      'Normalizes disparate metrics across academic literature, industrial datasheets, and patent disclosures',
      'Cites original sources (DOI, EPO/USPTO patent numbers, ECPE standard revisions) for complete auditability',
    ],
    keyOutputs: 'Condition-aware Evidence Nodes & Grounded Reference Baselines',
    targetSection: 'evidence',
  },
  {
    id: 'layer-community',
    number: '02',
    name: 'Verified Domain Community & PIs',
    flowDirection: 'HUMAN CONTEXT & VALIDATION → FRONTIER MODEL',
    coreFunction:
      'Direct engagement with academic principal investigators, laboratory directors, and specialized industry practitioners.',
    operationalDetails: [
      'Gathers manufacturability boundaries, practical failure modes, and unwritten laboratory experimental nuances',
      'Facilitates verified advisory consultations, design reviews, and freedom-to-operate IP term sheets',
      'Connects corporate R&D teams directly with leading European and global academic researchers',
    ],
    keyOutputs: 'Verified Expert Network & Scientific Advisory Board',
    targetSection: 'experts',
  },
  {
    id: 'layer-graph',
    number: '03',
    name: 'Condition-Aware Knowledge Graph',
    flowDirection: 'STRUCTURING & REASONING → PLATFORM CORE',
    coreFunction:
      'Relational knowledge graph mapping performance claims against specific boundary envelopes, test standards, and catalog dependencies.',
    operationalDetails: [
      'Links evidence nodes directly to frontier engineering gaps and active protected project rooms',
      'Enforces PostgreSQL foreign key relationships across publications, labs, patents, and suppliers',
      'Powers dynamic semantic search, gap comparison, and bookmark management',
    ],
    keyOutputs: 'Connected Relational Graph & Multi-Node Dependency Mapping',
    targetSection: 'evidence',
  },
  {
    id: 'layer-demand',
    number: '04',
    name: 'Enterprise Problems & Frontier Benchmarking',
    flowDirection: 'INDUSTRIAL DEMAND → TECHNICAL ACCELERATION',
    coreFunction:
      'Translates urgent industrial engineering challenges into standardized, condition-aware performance frontiers.',
    operationalDetails: [
      'Establishes four reference positions: Customer Technology, Commercial Frontier, Research Frontier, and Engineering Target',
      'Performs gap root-cause analysis identifying physics, materials, and packaging bottlenecks',
      'Recommends actionable next steps: simulation runs, lab verification, supplier sampling, or project room formation',
    ],
    keyOutputs: 'Frontier Benchmark Reports & Automated Gap Root-Cause Synthesis',
    targetSection: 'frontier',
  },
  {
    id: 'layer-projects',
    number: '05',
    name: 'Collaborative Execution & Protected Rooms',
    flowDirection: 'CRYPTOGRAPHIC TRUST & LEGAL INFRASTRUCTURE',
    coreFunction:
      'Protected digital project rooms providing legal stage progression, confidential document sharing, and isolated collaboration.',
    operationalDetails: [
      'Strict legal state machine: Scoping & Mutual NDA → IP Ownership → Protected Execution → Industrial Handover',
      'Cryptographic data isolation: project room messages and confidential files never train shared AI models',
      'Milestone tracking, participant role-based access control, and confidential message logs',
    ],
    keyOutputs: 'Protected Project Rooms with Verified Legal Governance',
    targetSection: 'projects',
  },
  {
    id: 'layer-physical',
    number: '06',
    name: 'Physical Infrastructure, Labs & Supply Chain',
    flowDirection: 'PHYSICAL TESTING & DIRECT FABRICATION',
    coreFunction:
      'Direct pipeline to certified test equipment (dynamometers, EMI chambers, acoustic microscopes) and Tier 1/2 component suppliers.',
    operationalDetails: [
      'Direct booking of accredited test benches at premier institutions like ETH Zurich and Fraunhofer IISB',
      'Component sample ordering directly from wide-bandgap fabricators and advanced substrate makers',
      'Seamless transition from theoretical simulation into physical hardware validation',
    ],
    keyOutputs: 'Engineering Samples, Test Benches & Validated Hardware Prototypes',
    targetSection: 'suppliers',
  },
];

export const PlatformArchitectureView: React.FC<PlatformArchitectureViewProps> = ({
  onNavigate,
  frontiersCount,
  projectsCount,
  evidenceCount,
  suppliersCount,
  labsCount,
  expertsCount,
  simulationsCount,
  brainstormCount,
}) => {
  const [selectedLayer, setSelectedLayer] = useState<ArchitectureLayer>(ARCHITECTURE_LAYERS[0]);

  const platformEngines = [
    {
      id: 'frontier' as QartiniaSection,
      name: 'Qartinia Frontier Engine',
      subtitle: 'Condition-Aware Benchmarking & Gap Analysis',
      description:
        'Frames industrial problems against the commercial and academic research frontiers. Pinpoints exact physical and material bottlenecks under your operating envelope.',
      count: `${frontiersCount} Monitored`,
      icon: Compass,
      accentColor: 'text-[#108548]',
    },
    {
      id: 'projects' as QartiniaSection,
      name: 'Protected Project Rooms',
      subtitle: 'Legal Stages & Cryptographically Isolated Execution',
      description:
        'Structured collaboration rooms with four legal phases: Mutual NDA, IP Ownership, Technical Execution, and Handover. Data is strictly segregated from shared models.',
      count: `${projectsCount} Active Rooms`,
      icon: Lock,
      accentColor: 'text-[#0F2537]',
    },
    {
      id: 'evidence' as QartiniaSection,
      name: 'Structured Evidence Graph',
      subtitle: 'Relational Deep-Tech Knowledge Network',
      description:
        'Interconnected graph linking peer-reviewed literature, global patents, product datasheets, and accredited laboratory test results in PostgreSQL.',
      count: `${evidenceCount} Records`,
      icon: Network,
      accentColor: 'text-[#108548]',
    },
    {
      id: 'suppliers' as QartiniaSection,
      name: 'Suppliers & Fabricators Hub',
      subtitle: 'Tier 1/2 Wide-Bandgap Semiconductor Sourcing',
      description:
        'Direct catalog access to power semiconductor bare dies, active metal brazed ceramic substrates, and gate drivers with engineering sample requests.',
      count: `${suppliersCount} Fabricators`,
      icon: Cpu,
      accentColor: 'text-[#0F2537]',
    },
    {
      id: 'laboratories' as QartiniaSection,
      name: 'Accredited Laboratories Hub',
      subtitle: 'High-Bandwidth Test Benches & Characterization Rigs',
      description:
        'Book dynamometer drive-cycle sweeps, scanning acoustic microscopy (C-SAM), and CISPR 25 Class 5 semi-anechoic EMI chambers at leading European test centers.',
      count: `${labsCount} Facilities`,
      icon: FlaskConical,
      accentColor: 'text-[#108548]',
    },
    {
      id: 'experts' as QartiniaSection,
      name: 'Domain Experts & Advisory Council',
      subtitle: 'Verified Scientific Leaders & Patent Strategists',
      description:
        'Consult with IEEE Fellows, laboratory directors, and European patent attorneys for freedom-to-operate opinions, design reviews, and technology transfer.',
      count: `${expertsCount} Specialists`,
      icon: GraduationCap,
      accentColor: 'text-[#0F2537]',
    },
    {
      id: 'simulations' as QartiniaSection,
      name: 'Simulation Studio',
      subtitle: 'Physics & Circuit Modeling Tools',
      description:
        'Execute half-bridge SPICE double-pulse switching transients, TCAD trench electric field breakdowns, and DFT ceramic bonding simulations with live waveform plots.',
      count: `${simulationsCount} Jobs`,
      icon: Activity,
      accentColor: 'text-[#108548]',
    },
    {
      id: 'brainstorming' as QartiniaSection,
      name: 'Technical Brainstorming Rooms',
      subtitle: 'Multi-Disciplinary Ideation & Consensus Synthesis',
      description:
        'Collaborative rooms for engineers and researchers with integrated task boards and an AI assistant grounded in verified technical literature.',
      count: `${brainstormCount} Rooms`,
      icon: MessageSquare,
      accentColor: 'text-[#0F2537]',
    },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-10 space-y-16">
      {/* 1. Header Hero: Architecture Blueprint & Strategic Mission */}
      <section className="bg-white border border-slate-200 rounded-xl p-8 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="text-xs font-bold tracking-widest text-[#108548] uppercase">
              Production Architecture Blueprint
            </div>
            <h1 className="font-brand text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F2537] tracking-tight">
              QARTINIΛ PLATFORM ARCHITECTURE
            </h1>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-3xl">
              Turning fragmented deep-tech knowledge into a clear path from engineering problem to verified evidence, protected collaboration, and physical industrial deployment.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600">
              <span className="font-semibold text-[#0F2537]">Core Operating Invariants:</span>
              <span>Condition-Aware Evidence</span>
              <span aria-hidden="true">·</span>
              <span>Deliberate Trust Segregation</span>
              <span aria-hidden="true">·</span>
              <span>Multi-Tenant Supabase Backend</span>
              <span aria-hidden="true">·</span>
              <span>Direct Hardware Supply Chain</span>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-[#FAF9F6] border border-slate-200 rounded-xl">
            <QartiniaCrestSvg className="w-16 h-16 text-[#0F2537] mb-3" />
            <div className="font-brand font-bold text-lg tracking-widest text-[#0F2537]">
              QARTINIΛ
            </div>
            <div className="text-[11px] font-mono text-[#108548] tracking-wider mt-0.5">
              SYSTEM CONSTITUTION
            </div>
            <div className="text-xs text-slate-500 text-center mt-2 leading-relaxed">
              One coherent deep-tech platform unifying scientific research, engineering benchmarking, and protected commercial execution.
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive 6-Layer Architecture Flowchart */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#108548]">
            Interactive Flowchart
          </h2>
          <h3 className="text-2xl font-bold text-[#0F2537] mt-1">
            The Six Core Architecture Layers
          </h3>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Select any architecture layer below to inspect its data flow, core function, and underlying system modules.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Layer Selector Stack (Left 6 cols) */}
          <div className="lg:col-span-6 space-y-2.5">
            {ARCHITECTURE_LAYERS.map((layer) => {
              const isSelected = selectedLayer.id === layer.id;
              return (
                <button
                  key={layer.id}
                  type="button"
                  onClick={() => setSelectedLayer(layer)}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#0F2537] shadow-sm ring-1 ring-[#0F2537]/10'
                      : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                          isSelected ? 'bg-[#0F2537] text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {layer.number}
                      </span>
                      <span className="text-sm font-bold text-[#0F2537]">{layer.name}</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#108548] hidden sm:inline">
                      {layer.flowDirection.split('→')[0].trim()}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Layer Deep-Dive Card (Right 6 cols) */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
            <div>
              <div className="text-xs font-mono font-semibold text-[#108548] mb-1">
                {selectedLayer.flowDirection}
              </div>
              <h4 className="text-xl font-bold text-[#0F2537]">
                {selectedLayer.number}. {selectedLayer.name}
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed mt-2">
                {selectedLayer.coreFunction}
              </p>
            </div>

            <div>
              <div className="text-xs font-semibold text-[#0F2537] uppercase tracking-wider mb-2">
                Operational Implementation
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                {selectedLayer.operationalDetails.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#108548] shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block">
                  Primary Deliverable
                </span>
                <span className="text-xs font-medium text-[#0F2537]">
                  {selectedLayer.keyOutputs}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onNavigate(selectedLayer.targetSection)}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#0F2537] rounded-lg hover:bg-[#16344D] transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap self-start sm:self-center"
              >
                <span>Launch {selectedLayer.name.split(' ')[0]} Module</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 8 Working Platform Engines & Hubs */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#108548]">
            Platform Infrastructure
          </h2>
          <h3 className="text-2xl font-bold text-[#0F2537] mt-1">
            Production Engines &amp; Specialized Hubs
          </h3>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Access any of the live functional modules comprising the Qartinia production ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {platformEngines.map((engine) => {
            const Icon = engine.icon;
            return (
              <div
                key={engine.id}
                className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between hover:border-slate-300 transition-colors group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-[#FAF9F6] border border-slate-200 flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${engine.accentColor}`} />
                    </div>
                    <span className="text-[11px] font-mono font-medium text-slate-500">
                      {engine.count}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-[#0F2537] group-hover:text-[#108548] transition-colors">
                      {engine.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">{engine.subtitle}</p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{engine.description}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onNavigate(engine.id)}
                    className="w-full py-2 px-3 text-xs font-semibold text-[#0F2537] bg-slate-50 hover:bg-[#0F2537] hover:text-white rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Open Module</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Deliberate Trust Architecture Banner */}
      <section className="bg-[#FAF9F6] border border-slate-200 rounded-xl p-8 lg:p-10 space-y-6">
        <div className="max-w-4xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#108548] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Deliberate Trust Architecture &amp; Data Isolation</span>
          </div>
          <h3 className="text-xl font-bold text-[#0F2537]">
            How Qartinia Protects Enterprise Intellectual Property
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            Qartinia&apos;s shared intelligence model operates exclusively on public and approved technical datasets: peer-reviewed research papers, verified patent disclosures, industrial component datasheets, and published standards. Private project-room communications, CAD step files, SPICE netlists, and bilateral discussions are cryptographically isolated within multi-tenant boundaries and are never used to train or improve the shared intelligence model.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="text-xs font-bold text-[#0F2537] mb-1">
              Zero Model Training on Private Data
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Customer parameters and confidential project room files are strictly partitioned and discarded from all model ingestion pipelines.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="text-xs font-bold text-[#0F2537] mb-1">
              Four-Phase Legal State Machine
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Formal progression through Mutual NDA, IP Ownership schedules, Technical Execution, and Handover before sensitive IP is revealed.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="text-xs font-bold text-[#0F2537] mb-1">
              Live Audited Activity Ledger
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              All member invitations, data access requests, and atomic approval decisions are logged in Supabase PostgreSQL tables.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
