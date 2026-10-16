import React, { useState } from 'react';
import { QartiniaSection } from '../types/qartinia';
import { QartiniaCrestSvg, QartiniaLogo } from './QartiniaLogo';
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
      name: 'Qartinia Frontier',
      subtitle: 'Condition-Aware Benchmarking',
      description:
        'Analyzes where your system stands against the condition-normalized commercial frontier and academic research frontier.',
      icon: Compass,
      count: `${frontiersCount} Frontiers`,
    },
    {
      id: 'projects' as QartiniaSection,
      name: 'Qartinia Projects',
      subtitle: 'Protected Collaboration Rooms',
      description:
        'Protected digital project rooms with pre-aligned mutual NDAs, IP ownership governance, and confidential engineering workspaces.',
      icon: Lock,
      count: `${projectsCount} Active Rooms`,
    },
    {
      id: 'evidence' as QartiniaSection,
      name: 'Evidence Graph',
      subtitle: 'Structured Engineering Records',
      description:
        'Normalized scientific publications, patent claims, standards, and empirical datasheets indexed by operating conditions.',
      icon: Network,
      count: `${evidenceCount} Records`,
    },
    {
      id: 'suppliers' as QartiniaSection,
      name: 'Suppliers & Fabs Hub',
      subtitle: 'Component Procurement',
      description:
        'Direct connection to qualified wide-bandgap semiconductor fabricators, substrates, and packaging houses.',
      icon: Cpu,
      count: `${suppliersCount} Fabs`,
    },
    {
      id: 'laboratories' as QartiniaSection,
      name: 'Laboratories Hub',
      subtitle: 'Accredited Test Benches',
      description:
        'Book dedicated test slots on high-bandwidth dynamometers, acoustic microscopes, and environmental test chambers.',
      icon: FlaskConical,
      count: `${labsCount} Facilities`,
    },
    {
      id: 'experts' as QartiniaSection,
      name: 'Experts Network',
      subtitle: 'Domain Advisory & Reviews',
      description:
        'Contract verified academic PIs and industrial specialists for technical advisory, simulation review, and design audits.',
      icon: GraduationCap,
      count: `${expertsCount} Specialists`,
    },
    {
      id: 'simulations' as QartiniaSection,
      name: 'Simulation Studio',
      subtitle: 'Physics & Circuit Solvers',
      description:
        'Execute SPICE double-pulse switching sweeps, TCAD semiconductor models, and thermal dissipation analyses.',
      icon: Activity,
      count: `${simulationsCount} Runs Logged`,
    },
    {
      id: 'brainstorming' as QartiniaSection,
      name: 'Brainstorming Hub',
      subtitle: 'Technical Ideation Rooms',
      description:
        'Collaborative rooms pairing industry engineers with academic researchers and an AI research assistant.',
      icon: MessageSquare,
      count: `${brainstormCount} Rooms`,
    },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-10 sm:space-y-12 animate-in fade-in duration-200">
      {/* 1. Header Hero: Architecture Blueprint & Strategic Mission */}
      <section className="bg-white border border-[#E5DDD0] rounded-2xl p-6 sm:p-8 lg:p-12 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="text-xs font-bold tracking-widest text-[#8C6527] uppercase font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8C6527] animate-pulse" />
              <span>Production Architecture Blueprint</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F2038] tracking-tight">
              QARTINIΛ PLATFORM ARCHITECTURE
            </h1>
            <p className="text-sm sm:text-base text-[#5A6E85] leading-relaxed max-w-3xl">
              Turning fragmented deep-tech knowledge into a clear path from engineering problem to verified evidence, protected collaboration, and physical industrial deployment.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-[#5A6E85] font-mono">
              <span className="font-serif font-bold text-[#0F2038]">Core Invariants:</span>
              <span>Condition-Aware Evidence</span>
              <span aria-hidden="true">·</span>
              <span>Deliberate Trust Segregation</span>
              <span aria-hidden="true">·</span>
              <span>Multi-Tenant PostgreSQL Backend</span>
              <span aria-hidden="true">·</span>
              <span>Direct Supply Chain</span>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-[#FAF8F5] border border-[#D5C8B5] rounded-2xl shadow-2xs">
            <div className="w-16 h-16 rounded-xl bg-white border border-[#D5C8B5] flex items-center justify-center p-2 mb-3 shadow-xs">
              <QartiniaCrestSvg className="w-11 h-11" textColor="#0F2038" goldColor="#B89547" />
            </div>
            <QartiniaLogo height={26} />
            <div className="text-[10px] font-mono text-[#8C6527] uppercase tracking-widest mt-2">
              System Constitution
            </div>
            <div className="text-xs text-[#5A6E85] text-center mt-2 leading-relaxed">
              One coherent deep-tech platform unifying scientific research, engineering benchmarking, and protected commercial execution.
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive 6-Layer Architecture Flowchart */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#8C6527] font-mono">
            Interactive Flowchart
          </h2>
          <h3 className="font-serif text-2xl font-bold text-[#0F2038] mt-1">
            The Six Core Architecture Layers
          </h3>
          <p className="text-xs sm:text-sm text-[#5A6E85] mt-1 max-w-3xl leading-relaxed">
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
                      ? 'bg-[#FFFDF7] border-[#8C6527] shadow-xs'
                      : 'bg-white border-[#E5DDD0] hover:bg-[#FAF8F5] hover:border-[#D5C8B5]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded-lg ${
                          isSelected ? 'bg-[#0F2038] text-white' : 'bg-[#FAF8F5] text-[#8C6527] border border-[#E5DDD0]'
                        }`}
                      >
                        {layer.number}
                      </span>
                      <span className="font-serif text-sm font-bold text-[#0F2038]">{layer.name}</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#8C6527] hidden sm:inline">
                      {layer.flowDirection.split('→')[0].trim()}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Layer Deep-Dive Card (Right 6 cols) */}
          <div className="lg:col-span-6 bg-white border border-[#E5DDD0] rounded-2xl p-6 lg:p-8 space-y-6 shadow-xs">
            <div>
              <div className="text-xs font-mono font-bold text-[#8C6527] uppercase tracking-wider mb-1">
                {selectedLayer.flowDirection}
              </div>
              <h4 className="font-serif text-xl font-bold text-[#0F2038]">
                {selectedLayer.number}. {selectedLayer.name}
              </h4>
              <p className="text-xs sm:text-sm text-[#5A6E85] leading-relaxed mt-2">
                {selectedLayer.coreFunction}
              </p>
            </div>

            <div>
              <div className="text-xs font-serif font-bold text-[#0F2038] uppercase tracking-wider mb-2">
                Operational Implementation
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-[#5A6E85]">
                {selectedLayer.operationalDetails.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-[#EBE3D7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#8C6527] font-mono block">
                  Primary Deliverable
                </span>
                <span className="text-xs font-medium text-[#0F2038]">
                  {selectedLayer.keyOutputs}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onNavigate(selectedLayer.targetSection)}
                className="px-4 py-2 text-xs font-serif font-bold text-white bg-[#0F2038] hover:bg-[#1A365D] rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap self-start sm:self-center shadow-xs"
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
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#8C6527] font-mono">
            Platform Infrastructure
          </h2>
          <h3 className="font-serif text-2xl font-bold text-[#0F2038] mt-1">
            Production Engines &amp; Specialized Hubs
          </h3>
          <p className="text-xs sm:text-sm text-[#5A6E85] mt-1 max-w-3xl leading-relaxed">
            Access any of the live functional modules comprising the Qartinia production ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {platformEngines.map((engine) => {
            const Icon = engine.icon;
            return (
              <div
                key={engine.id}
                className="bg-white border border-[#E5DDD0] rounded-2xl p-5 flex flex-col justify-between hover:border-[#D5C8B5] shadow-xs transition-all duration-200 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-[#FAF4EB] border border-[#D5C8B5] flex items-center justify-center text-[#8C6527]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-medium text-[#8C6527]">
                      {engine.count}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-serif text-sm font-bold text-[#0F2038] group-hover:text-[#8C6527] transition-colors">
                      {engine.name}
                    </h4>
                    <p className="text-xs text-[#8C6527] mt-0.5 font-mono">{engine.subtitle}</p>
                  </div>

                  <p className="text-xs text-[#5A6E85] leading-relaxed line-clamp-3">{engine.description}</p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#EBE3D7]">
                  <button
                    type="button"
                    onClick={() => onNavigate(engine.id)}
                    className="w-full py-2 px-3 text-xs font-semibold text-[#0F2038] bg-[#FAF8F5] hover:bg-[#0F2038] hover:text-white border border-[#E5DDD0] rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
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
      <section className="bg-white border border-[#E5DDD0] rounded-2xl p-6 sm:p-8 lg:p-10 space-y-6 shadow-xs">
        <div className="max-w-4xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#8C6527] uppercase tracking-wider font-mono">
            <ShieldCheck className="w-4 h-4 text-[#8C6527]" />
            <span>Deliberate Trust Architecture &amp; Data Isolation</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0F2038]">
            How Qartinia Protects Enterprise Intellectual Property
          </h3>
          <p className="text-xs sm:text-sm text-[#5A6E85] leading-relaxed">
            Qartinia&apos;s shared intelligence model operates exclusively on public and approved technical datasets: peer-reviewed research papers, verified patent disclosures, industrial component datasheets, and published standards. Private project-room communications, CAD step files, SPICE netlists, and bilateral discussions are cryptographically isolated within multi-tenant boundaries and are never used to train or improve the shared intelligence model.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-[#FAF8F5] border border-[#E5DDD0] rounded-xl p-4.5 space-y-1 shadow-2xs">
            <div className="font-serif text-xs font-bold text-[#0F2038]">
              Zero Model Training on Private Data
            </div>
            <p className="text-xs text-[#5A6E85] leading-relaxed">
              Customer parameters and confidential project room files are strictly partitioned and discarded from all model ingestion pipelines.
            </p>
          </div>

          <div className="bg-[#FAF8F5] border border-[#E5DDD0] rounded-xl p-4.5 space-y-1 shadow-2xs">
            <div className="font-serif text-xs font-bold text-[#0F2038]">
              Four-Phase Legal State Machine
            </div>
            <p className="text-xs text-[#5A6E85] leading-relaxed">
              Formal progression through Mutual NDA, IP Ownership schedules, Technical Execution, and Handover before sensitive IP is revealed.
            </p>
          </div>

          <div className="bg-[#FAF8F5] border border-[#E5DDD0] rounded-xl p-4.5 space-y-1 shadow-2xs">
            <div className="font-serif text-xs font-bold text-[#0F2038]">
              Live Audited Activity Ledger
            </div>
            <p className="text-xs text-[#5A6E85] leading-relaxed">
              All member invitations, data access requests, and atomic approval decisions are logged in multi-tenant PostgreSQL tables.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
