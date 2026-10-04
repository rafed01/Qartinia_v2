import React, { useState } from 'react';
import { QartiniaSection, UserAccount, NotificationItem } from '../types/qartinia';
export type { QartiniaSection };
import {
  Compass,
  Lock,
  Network,
  Cpu,
  FlaskConical,
  GraduationCap,
  Activity,
  MessageSquare,
  User as UserIcon,
  ChevronDown,
  Sparkles,
  Layers,
  LayoutDashboard,
  LogOut,
  Settings,
  Search,
  Command,
} from 'lucide-react';
import { QartiniaCrestSvg } from './QartiniaLogo';
import { NotificationCenter } from './NotificationCenter';

interface NavbarProps {
  activeSection: QartiniaSection;
  onSelectSection: (section: QartiniaSection) => void;
  frontiersCount: number;
  projectsCount: number;
  evidenceCount: number;
  suppliersCount: number;
  labsCount: number;
  expertsCount: number;
  simulationsCount: number;
  brainstormCount: number;
  currentUser: UserAccount | null;
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  onMarkNotificationAsRead: (id: string) => Promise<void>;
  onMarkAllNotificationsAsRead: () => Promise<void>;
  onDeleteNotification: (id: string) => Promise<void>;
  onNavigateToNotification: (section: QartiniaSection, linkId?: string) => void;
  onOpenAuthModal: () => void;
  onOpenProfileModal?: () => void;
  onOpenCommandPalette?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onSelectSection,
  frontiersCount,
  projectsCount,
  evidenceCount,
  suppliersCount,
  labsCount,
  expertsCount,
  simulationsCount,
  brainstormCount,
  currentUser,
  notifications,
  unreadNotificationsCount,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
  onDeleteNotification,
  onNavigateToNotification,
  onOpenAuthModal,
  onOpenProfileModal,
  onOpenCommandPalette,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const primaryNavItems: {
    id: QartiniaSection;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
  }[] = [
    { id: 'dashboard', label: 'My Workspace', icon: LayoutDashboard },
    { id: 'frontier', label: 'Frontier Engine', icon: Compass, count: frontiersCount },
    { id: 'projects', label: 'Protected Projects', icon: Lock, count: projectsCount },
    { id: 'evidence', label: 'Evidence Graph', icon: Network, count: evidenceCount },
    { id: 'suppliers', label: 'Suppliers & Fabs', icon: Cpu, count: suppliersCount },
    { id: 'laboratories', label: 'Laboratories', icon: FlaskConical, count: labsCount },
    { id: 'experts', label: 'Domain Experts', icon: GraduationCap, count: expertsCount },
  ];

  const secondaryNavItems: {
    id: QartiniaSection;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
  }[] = [
    { id: 'simulations', label: 'Simulation Studio', icon: Activity, count: simulationsCount },
    { id: 'brainstorming', label: 'Brainstorming Rooms', icon: MessageSquare, count: brainstormCount },
    { id: 'architecture', label: 'Platform Architecture', icon: Layers },
  ];

  const isSecondaryActive = secondaryNavItems.some((item) => item.id === activeSection);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Wordmark & Tagline */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onSelectSection('dashboard')}
            className="flex items-center gap-2.5 group cursor-pointer text-left"
          >
            <QartiniaCrestSvg className="w-7 h-7 text-[#0F2537]" />
            <div>
              <span className="font-brand font-bold text-lg tracking-widest text-[#0F2537] group-hover:text-[#108548] transition-colors block leading-tight">
                QARTINIΛ
              </span>
              <span className="text-[10px] tracking-wider text-slate-500 font-medium block">
                FROM RESEARCH TO INDUSTRY
              </span>
            </div>
          </button>
        </div>

        {/* Primary Desktop Navigation Bar */}
        <nav className="hidden xl:flex items-center gap-1">
          {primaryNavItems.map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectSection(item.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-[#0F2537] bg-slate-100 font-bold border border-slate-300/80'
                    : 'text-slate-600 hover:text-[#0F2537] hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#108548]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {typeof item.count === 'number' && item.count > 0 && (
                  <span className="text-[10px] font-mono text-slate-400 ml-0.5">({item.count})</span>
                )}
              </button>
            );
          })}

          {/* More Tools Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                isSecondaryActive
                  ? 'text-[#0F2537] bg-slate-100 font-bold border border-slate-300/80'
                  : 'text-slate-600 hover:text-[#0F2537] hover:bg-slate-50'
              }`}
            >
              <span>More Hubs</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {moreDropdownOpen && (
              <div
                className="absolute left-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 z-50"
                onMouseLeave={() => setMoreDropdownOpen(false)}
              >
                {secondaryNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onSelectSection(item.id);
                        setMoreDropdownOpen(false);
                      }}
                      className={`w-full px-3.5 py-2 text-left text-xs font-medium flex items-center justify-between cursor-pointer ${
                        activeSection === item.id
                          ? 'bg-[#FAF9F6] text-[#0F2537] font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5 text-[#108548]" />
                        <span>{item.label}</span>
                      </div>
                      {typeof item.count === 'number' && item.count > 0 && (
                        <span className="text-[10px] font-mono text-slate-500">({item.count})</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Right User Action Cluster */}
        <div className="flex items-center gap-2.5">
          {/* Command Palette Trigger Button (Ctrl+K) */}
          {onOpenCommandPalette && (
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-100/90 hover:bg-slate-200/90 border border-slate-200 rounded-lg text-xs text-slate-600 hover:text-[#0F2537] transition-all cursor-pointer group shadow-2xs"
              title="Search or jump to projects, benchmarks, and actions (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#108548] transition-colors" />
              <span className="font-semibold text-[11px]">Search / Jump...</span>
              <kbd className="ml-1 font-mono text-[9px] font-bold bg-white text-slate-500 border border-slate-300 rounded px-1.5 py-0.2 shadow-2xs">
                Ctrl+K
              </kbd>
            </button>
          )}

          {/* Real-Time Notification Bell & Dropdown */}
          <NotificationCenter
            notifications={notifications}
            unreadCount={unreadNotificationsCount}
            onMarkAsRead={onMarkNotificationAsRead}
            onMarkAllAsRead={onMarkAllNotificationsAsRead}
            onDeleteNotification={onDeleteNotification}
            onNavigateToNotification={onNavigateToNotification}
          />

          {/* User Account Button with Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                if (!currentUser) {
                  onOpenAuthModal();
                } else {
                  setUserDropdownOpen(!userDropdownOpen);
                }
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white transition-colors cursor-pointer text-left"
            >
              <div className="w-6 h-6 rounded-full bg-[#0F2537] text-white flex items-center justify-center text-[11px] font-semibold">
                {currentUser?.fullName
                  ? currentUser.fullName.charAt(0).toUpperCase()
                  : currentUser?.email
                  ? currentUser.email.charAt(0).toUpperCase()
                  : <UserIcon className="w-3.5 h-3.5" />}
              </div>
              <div className="hidden md:block leading-tight">
                <span className="text-xs font-semibold text-[#0F2537] block max-w-[120px] truncate">
                  {currentUser?.fullName || currentUser?.email?.split('@')[0] || 'Sign In'}
                </span>
                <span className="text-[10px] text-slate-500 font-mono block">
                  {currentUser?.organizationName || 'Independent'}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {userDropdownOpen && currentUser && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 z-50 text-xs"
                onMouseLeave={() => setUserDropdownOpen(false)}
              >
                <div className="px-3.5 py-2 border-b border-slate-100">
                  <div className="font-bold text-[#0F2537]">{currentUser.fullName}</div>
                  <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                  <div className="text-[10px] font-mono text-[#108548] mt-0.5">
                    {currentUser.role} · {currentUser.organizationName}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSelectSection('dashboard');
                    setUserDropdownOpen(false);
                  }}
                  className="w-full px-3.5 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#108548]" />
                  <span>My Workspace</span>
                </button>

                {onOpenProfileModal && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        onOpenProfileModal();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-500" />
                      <span>Edit Profile &amp; Credentials</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onOpenProfileModal();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center justify-between cursor-pointer border-t border-slate-100"
                    >
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-3.5 h-3.5 text-[#108548]" />
                        <span>Corporate Invitations &amp; Seats</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        View
                      </span>
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => {
                    onOpenAuthModal();
                    setUserDropdownOpen(false);
                  }}
                  className="w-full px-3.5 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span>Switch Session / Account</span>
                </button>

                {onLogout && (
                  <button
                    type="button"
                    onClick={() => {
                      onLogout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full px-3.5 py-2 text-left text-rose-700 hover:bg-rose-50 flex items-center gap-2 cursor-pointer border-t border-slate-100"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Primary Action Button: Evaluate Frontier */}
          <button
            type="button"
            onClick={() => onSelectSection('frontier')}
            className="hidden sm:flex px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0F2537] rounded-lg hover:bg-[#16344D] transition-colors items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C59B47]" />
            <span>Evaluate Frontier</span>
          </button>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-[#FAF9F6] px-4 py-3 space-y-1">
          {[...primaryNavItems, ...secondaryNavItems].map((item) => {
            const isActive = activeSection === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectSection(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs font-medium rounded-md flex items-center justify-between cursor-pointer ${
                  isActive
                    ? 'bg-[#0F2537] text-white font-semibold'
                    : 'text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {typeof item.count === 'number' && item.count > 0 && (
                  <span className="text-[10px] font-mono opacity-80">({item.count})</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
