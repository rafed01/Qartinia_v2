import React from 'react';
import { Terminal } from 'lucide-react';

export type QartiniaSection =
  | 'overview'
  | 'frontier'
  | 'projects'
  | 'evidence'
  | 'investor-bp'
  | 'dev-console';

interface NavbarProps {
  activeSection: QartiniaSection;
  onSelectSection: (section: QartiniaSection) => void;
  frontiersCount: number;
  projectsCount: number;
  evidenceCount: number;
  devModeEnabled: boolean;
  onToggleDevMode: () => void;
  pendingApprovalsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onSelectSection,
  frontiersCount,
  projectsCount,
  evidenceCount,
  devModeEnabled,
  onToggleDevMode,
  pendingApprovalsCount,
}) => {
  const navItems: { id: QartiniaSection; label: string }[] = [
    { id: 'overview', label: 'The Qartinia Solution' },
    {
      id: 'frontier',
      label: frontiersCount > 0 ? `Qartinia Frontier (${frontiersCount})` : 'Qartinia Frontier',
    },
    {
      id: 'projects',
      label: projectsCount > 0 ? `Qartinia Projects (${projectsCount})` : 'Qartinia Projects',
    },
    {
      id: 'evidence',
      label: evidenceCount > 0 ? `Evidence Graph (${evidenceCount})` : 'Evidence Graph',
    },
    { id: 'investor-bp', label: 'Business Model & 10-Yr Plan' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => onSelectSection('overview')}
          className="font-brand text-xl font-bold tracking-widest text-[#0F2537] hover:opacity-80 transition-opacity cursor-pointer whitespace-nowrap"
        >
          QARTINIΛ
        </button>

        {/* Zone 2: 5 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectSection(item.id)}
                className={`py-1 transition-colors whitespace-nowrap cursor-pointer border-b-2 ${
                  isActive
                    ? 'text-[#0F2537] border-[#108548] font-semibold'
                    : 'text-slate-600 border-transparent hover:text-[#0F2537] hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary actions (Dev Mode Toggle + Evaluate Frontier) */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onToggleDevMode}
            className={`px-3 py-2 text-xs font-mono font-semibold rounded-lg border transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              devModeEnabled || activeSection === 'dev-console'
                ? 'bg-[#0F2537] text-[#C59B47] border-[#0F2537]'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/80'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>
              {devModeEnabled
                ? pendingApprovalsCount > 0
                  ? `Dev Mode: ON (${pendingApprovalsCount})`
                  : 'Dev Mode: ON'
                : 'Dev Mode'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectSection('frontier')}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#0F2537] rounded-lg hover:bg-[#16344D] transition-colors whitespace-nowrap cursor-pointer"
          >
            Evaluate Frontier
          </button>
        </div>
      </div>
    </header>
  );
};
