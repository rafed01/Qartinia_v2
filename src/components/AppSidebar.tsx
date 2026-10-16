import React from 'react';
import { QartiniaSection } from '../types/qartinia';
import { ColumnsWatermark, TowerWatermark, CarthageCornerMotif } from './CarthageArtwork';
import { QartiniaLogo } from './QartiniaLogo';
import {
  LayoutDashboard,
  Compass,
  FolderGit2,
  GitBranch,
  Factory,
  Building2,
  Users2,
  Cpu,
  Lightbulb,
  Layers,
  ChevronRight,
  Shield,
  ExternalLink,
} from 'lucide-react';

interface AppSidebarProps {
  activeSection: QartiniaSection;
  onSelectSection: (section: QartiniaSection) => void;
  frontiersCount?: number;
  projectsCount?: number;
  evidenceCount?: number;
  suppliersCount?: number;
  labsCount?: number;
  expertsCount?: number;
  simulationsCount?: number;
  brainstormCount?: number;
  className?: string;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeSection,
  onSelectSection,
  frontiersCount = 0,
  projectsCount = 0,
  evidenceCount = 0,
  suppliersCount = 0,
  labsCount = 0,
  expertsCount = 0,
  simulationsCount = 0,
  brainstormCount = 0,
  className = '',
}) => {
  const primaryNavItems: {
    id: QartiniaSection;
    label: string;
    sublabel: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
    badgeColor?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Intelligence Overview',
      sublabel: 'Executive Command Center',
      icon: LayoutDashboard,
    },
    {
      id: 'frontier',
      label: 'Frontier Engine',
      sublabel: 'TRL 1-6 Research Milestones',
      icon: Compass,
      count: frontiersCount,
    },
    {
      id: 'projects',
      label: 'Protected Projects',
      sublabel: 'Joint R&D Rooms & IP Escrow',
      icon: FolderGit2,
      count: projectsCount,
    },
    {
      id: 'evidence',
      label: 'Evidence Graph',
      sublabel: 'Condition-Aware Provenance',
      icon: GitBranch,
      count: evidenceCount,
    },
  ];

  const networkNavItems: {
    id: QartiniaSection;
    label: string;
    sublabel: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
  }[] = [
    {
      id: 'suppliers',
      label: 'Suppliers & Fabs',
      sublabel: 'Verified Wafer & Epi Foundries',
      icon: Factory,
      count: suppliersCount,
    },
    {
      id: 'laboratories',
      label: 'Testing Laboratories',
      sublabel: 'AQG-324 / ISO Certified Benches',
      icon: Building2,
      count: labsCount,
    },
    {
      id: 'experts',
      label: 'Domain Specialists',
      sublabel: 'IEEE Fellows & PIs',
      icon: Users2,
      count: expertsCount,
    },
    {
      id: 'simulations',
      label: 'Simulation Studio',
      sublabel: 'SPICE & TCAD Solvers',
      icon: Cpu,
      count: simulationsCount,
    },
    {
      id: 'brainstorming',
      label: 'Collaborative Sandbox',
      sublabel: 'Live Synthesis Sessions',
      icon: Lightbulb,
      count: brainstormCount,
    },
    {
      id: 'architecture',
      label: 'Platform Architecture',
      sublabel: 'System Topology & Schema',
      icon: Layers,
    },
  ];

  return (
    <aside
      className={`w-72 bg-[#FAF8F5] border-r border-[#EBE3D7] flex flex-col justify-between h-screen sticky top-0 z-30 select-none relative overflow-hidden ${className}`}
    >
      {/* Translucent Sidebar Background Watermarks */}
      <div className="absolute -bottom-10 -right-12 w-48 h-48 pointer-events-none select-none opacity-10">
        <ColumnsWatermark className="w-full h-full" />
      </div>
      <div className="absolute top-24 -left-12 w-40 h-40 pointer-events-none select-none opacity-10">
        <TowerWatermark className="w-full h-full" />
      </div>

      {/* 1. Header / Official Qartinia Brand Identity */}
      <div className="p-5 border-b border-[#EBE3D7]">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <QartiniaLogo height={32} />
            <span className="px-1.5 py-0.5 rounded font-mono text-[9px] font-bold bg-[#FAF4EB] text-[#8C6527] border border-[#E5DDD0]">
              v2.4
            </span>
          </div>
          <p className="text-[10px] text-[#5A6E85] font-mono tracking-wider uppercase pl-1">
            Deep-Tech Intelligence
          </p>
        </div>
      </div>

      {/* 2. Navigation Clusters */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Core R&D Intelligence */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C6527] flex items-center justify-between">
            <span>R&amp;D Engines</span>
            <span className="text-[9px] text-[#A0AEC0]">Core</span>
          </div>
          <nav className="space-y-1">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectSection(item.id)}
                  className={`w-full group text-left px-3 py-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer relative overflow-hidden ${
                    isActive
                      ? 'bg-white text-[#0F2038] font-bold shadow-xs border border-[#D5C8B5]'
                      : 'text-[#4A5568] hover:bg-[#EFE9DF]/70 hover:text-[#0F2038]'
                  }`}
                >
                  {isActive && (
                    <CarthageCornerMotif className="w-4 h-4 absolute top-1 right-1 pointer-events-none opacity-40 text-[#8C6527]" />
                  )}
                  <div className="flex items-center gap-3 min-w-0 relative z-10">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isActive
                          ? 'bg-[#0F2038] text-white shadow-2xs'
                          : 'bg-[#F2ECE3] text-[#5A6E85] group-hover:text-[#0F2038]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-xs font-serif font-semibold">{item.label}</div>
                      <div className="text-[10px] text-[#718096] truncate">{item.sublabel}</div>
                    </div>
                  </div>

                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-bold shrink-0 relative z-10 ${
                        isActive
                          ? 'bg-[#0F2038] text-white'
                          : 'bg-[#E5DDD0] text-[#4A5568]'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Verified Ecosystem & Network */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C6527] flex items-center justify-between">
            <span>Verified Network</span>
            <span className="text-[9px] text-[#A0AEC0]">Ecosystem</span>
          </div>
          <nav className="space-y-1">
            {networkNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectSection(item.id)}
                  className={`w-full group text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer relative overflow-hidden ${
                    isActive
                      ? 'bg-white text-[#0F2038] font-bold shadow-xs border border-[#D5C8B5]'
                      : 'text-[#4A5568] hover:bg-[#EFE9DF]/70 hover:text-[#0F2038]'
                  }`}
                >
                  {isActive && (
                    <CarthageCornerMotif className="w-4 h-4 absolute top-1 right-1 pointer-events-none opacity-40 text-[#8C6527]" />
                  )}
                  <div className="flex items-center gap-3 min-w-0 relative z-10">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isActive
                          ? 'bg-[#0F2038] text-white'
                          : 'bg-[#F2ECE3] text-[#5A6E85] group-hover:text-[#0F2038]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-xs font-serif font-medium">{item.label}</div>
                    </div>
                  </div>

                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded font-mono text-[9px] shrink-0 relative z-10 ${
                        isActive
                          ? 'bg-[#0F2038] text-white font-bold'
                          : 'bg-[#E5DDD0] text-[#718096]'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* 3. Footer / Enterprise Trust Stamp */}
      <div className="p-4 border-t border-[#EBE3D7] bg-[#F5EFEB]/60 space-y-3 relative">
        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="font-mono text-[10px] text-[#4A5568]">Supabase Persisted</span>
          </div>
          <span className="text-[10px] text-[#8C6527] font-serif font-bold">Encrypted R&amp;D</span>
        </div>
        <div className="p-2.5 rounded-xl bg-white border border-[#E5DDD0] text-[10px] space-y-1 relative overflow-hidden">
          <CarthageCornerMotif className="w-4 h-4 absolute top-1 right-1 opacity-30 text-[#8C6527]" />
          <div className="flex items-center justify-between text-[#0F2038] font-bold relative z-10">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-[#8C6527]" />
              <span>IP Escrow Guard</span>
            </span>
            <span className="text-emerald-700 font-mono">Active</span>
          </div>
          <p className="text-[#718096] leading-tight text-[9px] relative z-10">
            NDA protected project partitions &amp; audit trails active.
          </p>
        </div>
      </div>
    </aside>
  );
};
