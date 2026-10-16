import React from 'react';
import { QartiniaSection, UserAccount } from '../types/qartinia';
import { QartiniaLogo, QartiniaCrestSvg } from './QartiniaLogo';
import {
  CarthageCornerMotif,
  ColumnsWatermark,
  AstrolabeWatermark,
  ShipWatermark,
  LivePulseBeacon,
  PunicFiligreeDivider,
} from './CarthageArtwork';
import {
  X,
  Search,
  Compass,
  FolderGit2,
  GitBranch,
  Factory,
  Building2,
  Users2,
  Cpu,
  Lightbulb,
  Layers,
  LayoutDashboard,
  FileText,
  User as UserIcon,
  LogOut,
  Settings,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Command,
} from 'lucide-react';

interface AweInspiringMobileMenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: QartiniaSection;
  onSelectSection: (section: QartiniaSection) => void;
  currentUser: UserAccount | null;
  frontiersCount?: number;
  projectsCount?: number;
  evidenceCount?: number;
  suppliersCount?: number;
  labsCount?: number;
  expertsCount?: number;
  simulationsCount?: number;
  brainstormCount?: number;
  onOpenAuthModal?: () => void;
  onOpenProfileModal?: () => void;
  onOpenCommandPalette?: () => void;
  onOpenExecutiveDossier?: () => void;
  onLogout?: () => void;
}

export const AweInspiringMobileMenuOverlay: React.FC<AweInspiringMobileMenuOverlayProps> = ({
  isOpen,
  onClose,
  activeSection,
  onSelectSection,
  currentUser,
  frontiersCount = 0,
  projectsCount = 0,
  evidenceCount = 0,
  suppliersCount = 0,
  labsCount = 0,
  expertsCount = 0,
  simulationsCount = 0,
  brainstormCount = 0,
  onOpenAuthModal,
  onOpenProfileModal,
  onOpenCommandPalette,
  onOpenExecutiveDossier,
  onLogout,
}) => {
  if (!isOpen) return null;

  const coreEngines = [
    {
      id: 'dashboard' as QartiniaSection,
      label: 'Intelligence Workspace',
      sublabel: 'Executive Command Center',
      icon: LayoutDashboard,
    },
    {
      id: 'frontier' as QartiniaSection,
      label: 'Frontier Engine',
      sublabel: 'TRL 1-6 Benchmark Solvers',
      icon: Compass,
      count: frontiersCount,
    },
    {
      id: 'projects' as QartiniaSection,
      label: 'Protected Projects',
      sublabel: 'IP Escrow & Joint R&D',
      icon: FolderGit2,
      count: projectsCount,
    },
    {
      id: 'evidence' as QartiniaSection,
      label: 'Evidence Graph',
      sublabel: 'Condition-Aware Provenance',
      icon: GitBranch,
      count: evidenceCount,
    },
  ];

  const empiricalHubs = [
    {
      id: 'suppliers' as QartiniaSection,
      label: 'Suppliers & Foundries',
      sublabel: '8-inch SiC / GaN Wafer Fabs',
      icon: Factory,
      count: suppliersCount,
    },
    {
      id: 'laboratories' as QartiniaSection,
      label: 'Laboratories',
      sublabel: 'ISO 17025 Test Benches & Dynos',
      icon: Building2,
      count: labsCount,
    },
    {
      id: 'experts' as QartiniaSection,
      label: 'Domain Experts',
      sublabel: 'Peer-reviewed Academic Advisors',
      icon: Users2,
      count: expertsCount,
    },
    {
      id: 'simulations' as QartiniaSection,
      label: 'Simulation Studio',
      sublabel: '2D TCAD & Thermal Solvers',
      icon: Cpu,
      count: simulationsCount,
    },
    {
      id: 'brainstorming' as QartiniaSection,
      label: 'Brainstorming Hub',
      sublabel: 'Prior Art & Idea Whiteboards',
      icon: Lightbulb,
      count: brainstormCount,
    },
    {
      id: 'architecture' as QartiniaSection,
      label: 'Platform Architecture',
      sublabel: 'Punic Security & Escrow',
      icon: Layers,
    },
  ];

  const handleItemClick = (section: QartiniaSection) => {
    onSelectSection(section);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex overflow-hidden animate-in fade-in duration-200">
      {/* Dynamic Multi-Layer Glassmorphic Backdrop */}
      <div
        className="fixed inset-0 bg-[#0F2038]/80 backdrop-blur-2xl transition-all"
        onClick={onClose}
      />

      {/* Main Drawer Shell */}
      <div className="relative flex-1 flex flex-col max-w-sm w-full bg-[#0F2038] text-white shadow-2xl z-10 border-r border-[#C5A880]/40 overflow-y-auto animate-in slide-in-from-left duration-300">
        {/* Background Engraving Watermarks */}
        <CarthageCornerMotif className="w-10 h-10 absolute top-3 right-3 text-[#C5A880] opacity-40 pointer-events-none z-20" />
        <AstrolabeWatermark className="w-64 h-64 absolute -right-16 top-20 text-[#C5A880] opacity-[0.08] pointer-events-none animate-spin-slow" />
        <ColumnsWatermark className="w-56 h-56 absolute -left-12 bottom-12 text-[#C5A880] opacity-[0.06] pointer-events-none" />

        {/* Drawer Header */}
        <div className="p-5 border-b border-[#284873] relative z-10 bg-[#091424]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#8C6527] text-white flex items-center justify-center shadow-lg border border-[#C5A880]">
                <QartiniaCrestSvg className="w-5 h-5 text-[#FFF8EB]" />
              </div>
              <div>
                <QartiniaLogo height={22} textColor="#FFFFFF" />
                <span className="text-[9px] font-mono text-[#C5A880] uppercase tracking-widest block font-bold">
                  Engineering Intelligence
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-[#1A3254] text-slate-200 hover:text-white hover:bg-[#284873] transition-colors cursor-pointer border border-[#284873]"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Search & Command Trigger Bar */}
          {onOpenCommandPalette && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCommandPalette();
              }}
              className="w-full mt-2 px-3.5 py-2.5 rounded-xl bg-[#13243B] border border-[#284873] hover:border-[#C5A880] text-xs text-slate-300 flex items-center justify-between transition-all cursor-pointer shadow-inner group"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#C5A880]" />
                <span className="font-medium text-slate-200">Search &amp; Jump to Section...</span>
              </div>
              <span className="px-1.5 py-0.5 rounded font-mono text-[9px] bg-[#1A3254] text-[#C5A880] border border-[#284873]">
                ⌘K
              </span>
            </button>
          )}
        </div>

        {/* Navigation Body */}
        <div className="p-4 space-y-6 relative z-10 flex-1">
          {/* Section 1: Core Engineering Intelligence */}
          <div className="space-y-2">
            <div className="px-2 flex items-center justify-between text-[10px] font-mono font-bold text-[#C5A880] uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <LivePulseBeacon color="gold" />
                <span>Core Intelligence Engines</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {coreEngines.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all select-none cursor-pointer active:scale-[0.98] ${
                      isActive
                        ? 'bg-gradient-to-r from-[#8C6527]/40 to-[#1A3254] border-[#C5A880] text-white shadow-xl shadow-[#8C6527]/10'
                        : 'bg-[#13243B]/80 border-[#284873] text-slate-200 hover:border-[#C5A880]/50 hover:bg-[#1A3254]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-xl shrink-0 ${
                          isActive
                            ? 'bg-[#C5A880] text-[#0F2038] font-bold shadow-md'
                            : 'bg-[#1A3254] text-[#C5A880] border border-[#284873]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold tracking-wide flex items-center gap-2">
                          <span>{item.label}</span>
                          {isActive && (
                            <span className="w-2 h-2 rounded-full bg-[#C5A880] shadow-[0_0_8px_#C5A880]" />
                          )}
                        </div>
                        <div className={`text-[10px] mt-0.5 ${isActive ? 'text-slate-200' : 'text-slate-400'}`}>
                          {item.sublabel}
                        </div>
                      </div>
                    </div>

                    {item.count !== undefined && item.count > 0 && (
                      <span
                        className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                          isActive
                            ? 'bg-[#C5A880] text-[#0F2038]'
                            : 'bg-[#1A3254] text-[#C5A880] border border-[#284873]'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="my-2 border-t border-[#284873]/60" />

          {/* Section 2: Empirical Network & Hubs */}
          <div className="space-y-2">
            <div className="px-2 text-[10px] font-mono font-bold text-[#C5A880] uppercase tracking-wider">
              Empirical Ecosystem Hubs
            </div>

            <div className="grid grid-cols-1 gap-2">
              {empiricalHubs.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all select-none cursor-pointer active:scale-[0.98] ${
                      isActive
                        ? 'bg-gradient-to-r from-[#8C6527]/30 to-[#1A3254] border-[#C5A880] text-white shadow-lg'
                        : 'bg-[#13243B]/60 border-[#284873] text-slate-300 hover:border-[#C5A880]/40 hover:bg-[#1A3254]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`p-1.5 rounded-lg shrink-0 ${
                          isActive ? 'bg-[#C5A880] text-[#0F2038]' : 'bg-[#1A3254] text-[#C5A880]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold">{item.label}</div>
                        <div className="text-[9px] text-slate-400 font-mono">{item.sublabel}</div>
                      </div>
                    </div>

                    {item.count !== undefined && item.count > 0 && (
                      <span className="font-mono text-[10px] text-[#C5A880] bg-[#1A3254] px-1.5 py-0.2 rounded border border-[#284873]">
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Executive Actions */}
          {onOpenExecutiveDossier && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenExecutiveDossier();
                }}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#8C6527] to-[#B89547] text-white font-serif font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-xl border border-[#FFF8EB]/30 cursor-pointer active:scale-95 transition-transform"
              >
                <FileText className="w-4 h-4 text-[#FFF8EB]" />
                <span>Executive Dossier Briefing</span>
                <Sparkles className="w-3.5 h-3.5 text-[#FFF8EB]" />
              </button>
            </div>
          )}
        </div>

        {/* User Profile & Account Footer */}
        <div className="p-4 border-t border-[#284873] bg-[#091424] relative z-10 space-y-3">
          {currentUser ? (
            <div className="p-3 rounded-2xl bg-[#13243B] border border-[#284873] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#8C6527] text-white font-serif font-bold text-sm flex items-center justify-center shrink-0 border border-[#C5A880]">
                  {currentUser.fullName ? currentUser.fullName.slice(0, 2).toUpperCase() : 'US'}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">{currentUser.fullName}</div>
                  <div className="text-[10px] font-mono text-[#C5A880] truncate">
                    {currentUser.organizationName || 'Enterprise Seat'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {onOpenProfileModal && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenProfileModal();
                    }}
                    className="p-1.5 rounded-lg bg-[#1A3254] text-slate-200 hover:text-white hover:bg-[#284873] transition-colors cursor-pointer"
                    title="Profile Settings"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                )}
                {onLogout && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onLogout();
                    }}
                    className="p-1.5 rounded-lg bg-[#1A3254] text-rose-300 hover:text-rose-100 hover:bg-rose-900/40 transition-colors cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenAuthModal) onOpenAuthModal();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#13243B] border border-[#C5A880]/50 text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#1A3254] transition-colors cursor-pointer"
            >
              <UserIcon className="w-4 h-4 text-[#C5A880]" />
              <span>Sign In / Provision Account</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
