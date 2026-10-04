import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  QartiniaSection,
  ProtectedProjectRoom,
  FrontierBenchmark,
  UserAccount,
} from '../types/qartinia';
import {
  Search,
  Command,
  X,
  Compass,
  Lock,
  Network,
  Cpu,
  FlaskConical,
  GraduationCap,
  Activity,
  MessageSquare,
  BarChart3,
  UserPlus,
  PlusCircle,
  FilePlus,
  Sparkles,
  ArrowRight,
  CornerDownLeft,
  ChevronRight,
  Building,
} from 'lucide-react';

export interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  projects: ProtectedProjectRoom[];
  frontiers: FrontierBenchmark[];
  onNavigate: (section: QartiniaSection) => void;
  onSelectProject: (id: string) => void;
  onSelectFrontier: (id: string) => void;
  onInitiateEvidenceNode?: () => void;
  onOpenInviteModal?: () => void;
  onOpenCreateProjectModal?: () => void;
  onOpenCreateFrontierModal?: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Actions' | 'Projects' | 'Frontiers' | 'Navigation';
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
  action: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  projects,
  frontiers,
  onNavigate,
  onSelectProject,
  onSelectFrontier,
  onInitiateEvidenceNode,
  onOpenInviteModal,
  onOpenCreateProjectModal,
  onOpenCreateFrontierModal,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Construct all command items
  const commandItems = useMemo<CommandItem[]>(() => {
    const items: CommandItem[] = [];

    // 1. Quick Actions
    items.push({
      id: 'act-evidence',
      title: 'Initiate New Evidence Node',
      subtitle: 'Register a verified publication, patent, simulation, or laboratory record',
      category: 'Actions',
      icon: PlusCircle,
      badge: 'Quick Create',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      action: () => {
        onNavigate('evidence');
        if (onInitiateEvidenceNode) onInitiateEvidenceNode();
        onClose();
      },
    });

    items.push({
      id: 'act-project',
      title: 'Create Protected Project Room',
      subtitle: 'Establish an encrypted project workspace with NDA and milestone tracking',
      category: 'Actions',
      icon: FilePlus,
      badge: 'NDA Protected',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
      action: () => {
        onNavigate('projects');
        if (onOpenCreateProjectModal) onOpenCreateProjectModal();
        onClose();
      },
    });

    items.push({
      id: 'act-frontier',
      title: 'Evaluate New Frontier Benchmark',
      subtitle: 'Register target envelopes and operating parameters for power electronics',
      category: 'Actions',
      icon: Sparkles,
      badge: 'Benchmark',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      action: () => {
        onNavigate('frontier');
        if (onOpenCreateFrontierModal) onOpenCreateFrontierModal();
        onClose();
      },
    });

    if (onOpenInviteModal) {
      items.push({
        id: 'act-invite',
        title: 'Invite Organization Member',
        subtitle: 'Search platform users and allocate new corporate seat permissions',
        category: 'Actions',
        icon: UserPlus,
        badge: 'Organization',
        badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
        action: () => {
          onNavigate('dashboard');
          onOpenInviteModal();
          onClose();
        },
      });
    }

    // 2. Protected Projects Jump List
    projects.forEach((proj) => {
      items.push({
        id: `proj-${proj.id}`,
        title: proj.title,
        subtitle: `${proj.code || 'PRJ'} · ${proj.domain || 'Power Electronics'} · Legal: ${proj.legalStage || 'NDA Executed'}`,
        category: 'Projects',
        icon: Lock,
        badge: proj.legalStage || 'Protected',
        badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
        action: () => {
          onNavigate('projects');
          onSelectProject(proj.id);
          onClose();
        },
      });
    });

    // 3. Frontier Benchmarks Jump List
    frontiers.forEach((front) => {
      items.push({
        id: `front-${front.id}`,
        title: front.title,
        subtitle: `${front.domain || 'Semiconductors'} · System: ${front.technologySystem || 'SiC / GaN'} · Envelope: ${front.operatingEnvelope || 'High Voltage'}`,
        category: 'Frontiers',
        icon: Compass,
        badge: 'Frontier',
        badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        action: () => {
          onNavigate('frontier');
          onSelectFrontier(front.id);
          onClose();
        },
      });
    });

    // 4. Primary Workspace Navigation Sections
    const sections: { id: QartiniaSection; title: string; subtitle: string; icon: any }[] = [
      { id: 'dashboard', title: 'My Workspace Overview', subtitle: 'Executive dashboard, corporate seats, and active requests', icon: Building },
      { id: 'frontier', title: 'Frontier Engine', subtitle: 'Target condition envelopes and power semiconductor benchmarks', icon: Compass },
      { id: 'projects', title: 'Protected Projects', subtitle: 'Encrypted project rooms, milestones, and NDA execution', icon: Lock },
      { id: 'evidence', title: 'Evidence Graph', subtitle: 'Relational knowledge graph and structured evidence records', icon: Network },
      { id: 'suppliers', title: 'Suppliers & Fabs', subtitle: 'Silicon Carbide and GaN component directory and sample requests', icon: Cpu },
      { id: 'laboratories', title: 'Laboratories', subtitle: '350kW test dyno and characterization bench reservations', icon: FlaskConical },
      { id: 'experts', title: 'Domain Experts', subtitle: 'Advisory consultation with leading power electronics professors', icon: GraduationCap },
      { id: 'simulations', title: 'Simulation Studio', subtitle: 'LTspice, PLECS, and ANSYS thermal-transient simulation runs', icon: Activity },
      { id: 'brainstorming', title: 'Brainstorming Rooms', subtitle: 'Collaborative architectural rooms and peer discussions', icon: MessageSquare },
    ];

    sections.forEach((s) => {
      items.push({
        id: `nav-${s.id}`,
        title: s.title,
        subtitle: s.subtitle,
        category: 'Navigation',
        icon: s.icon,
        action: () => {
          onNavigate(s.id);
          onClose();
        },
      });
    });

    return items;
  }, [projects, frontiers, onNavigate, onSelectProject, onSelectFrontier, onInitiateEvidenceNode, onOpenInviteModal, onOpenCreateProjectModal, onOpenCreateFrontierModal, onClose]);

  // Filter items based on query
  const filteredItems = useMemo(() => {
    if (!query.trim()) return commandItems;
    const q = query.toLowerCase().trim();
    return commandItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q)
    );
  }, [commandItems, query]);

  // Ensure index stays in bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle keyboard events (Up/Down, Enter, Esc)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1 < filteredItems.length ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredItems.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  if (!isOpen) return null;

  // Group items by category for rendering
  const categories = ['Actions', 'Projects', 'Frontiers', 'Navigation'] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-[#0F2537]/75 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl w-full max-w-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-[#FAF9F6]">
          <Search className="w-5 h-5 text-[#108548] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, search project rooms, frontiers, or jump to section..."
            className="flex-1 bg-transparent text-sm font-semibold text-[#0F2537] placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded px-2 py-0.5 shadow-2xs font-bold">
            ESC
          </kbd>
        </div>

        {/* Command Items List */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-2 space-y-4 text-xs">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center space-y-2 text-slate-500">
              <Command className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-700">No matching commands or projects</p>
              <p className="text-[11px] text-slate-400 font-mono">
                Try searching for "Evidence", "SiC", "Brembo", "Frontier", or "Simulation".
              </p>
            </div>
          ) : (
            categories.map((cat) => {
              const catItems = filteredItems.filter((i) => i.category === cat);
              if (catItems.length === 0) return null;

              return (
                <div key={cat} className="space-y-1">
                  <div className="px-3 py-1 text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400">
                    {cat === 'Actions' && '⚡ Quick Actions & Creations'}
                    {cat === 'Projects' && '🔒 Protected Project Rooms'}
                    {cat === 'Frontiers' && '🧭 Frontier Benchmarks'}
                    {cat === 'Navigation' && '🗺️ Platform Sections'}
                  </div>

                  <div className="space-y-0.5">
                    {catItems.map((item) => {
                      const itemIndex = filteredItems.indexOf(item);
                      const isSelected = itemIndex === selectedIndex;
                      const Icon = item.icon;

                      return (
                        <div
                          key={item.id}
                          onClick={() => item.action()}
                          onMouseEnter={() => setSelectedIndex(itemIndex)}
                          className={`px-3 py-2.5 rounded-xl cursor-pointer transition-colors flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-[#0F2537] text-white font-medium shadow-xs'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-bold ${
                                isSelected
                                  ? 'bg-[#108548] text-white'
                                  : 'bg-slate-100 text-[#0F2537]'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`font-bold truncate text-xs ${isSelected ? 'text-white' : 'text-[#0F2537]'}`}>
                                  {item.title}
                                </span>
                                {item.badge && (
                                  <span
                                    className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold border ${
                                      isSelected
                                        ? 'bg-white/10 text-emerald-300 border-white/20'
                                        : item.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'
                                    }`}
                                  >
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              {item.subtitle && (
                                <p
                                  className={`text-[11px] truncate mt-0.5 ${
                                    isSelected ? 'text-slate-300 font-mono' : 'text-slate-500 font-mono'
                                  }`}
                                >
                                  {item.subtitle}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {isSelected && (
                              <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-emerald-300 bg-white/10 px-2 py-0.5 rounded border border-white/20 font-bold">
                                <span>Jump</span>
                                <CornerDownLeft className="w-3 h-3" />
                              </kbd>
                            )}
                            <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-300'}`} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="p-3 bg-[#FAF9F6] border-t border-slate-200 text-[10px] text-slate-500 font-mono flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="bg-white border border-slate-300 rounded px-1 font-bold">↑</kbd>
              <kbd className="bg-white border border-slate-300 rounded px-1 font-bold">↓</kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-white border border-slate-300 rounded px-1 font-bold">↵</kbd>
              <span>Execute</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-white border border-slate-300 rounded px-1 font-bold">ESC</kbd>
              <span>Close</span>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[#108548] font-bold">
            <Command className="w-3 h-3" />
            <span>QARTINIΛ Command Palette</span>
          </div>
        </div>
      </div>
    </div>
  );
};
