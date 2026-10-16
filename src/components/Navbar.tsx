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
  Menu,
} from 'lucide-react';
import { QartiniaLogo } from './QartiniaLogo';
import {
  WavesWatermark,
  ShipWatermark,
  CoinWatermark,
  CarthageCornerMotif,
  DropdownTranslucentWatermark,
  ButtonTranslucentMotif,
  PunicFiligreeDivider,
} from './CarthageArtwork';
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
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EBE3D7] relative overflow-hidden select-none">
      <WavesWatermark className="w-64 h-16 absolute top-0 right-10 pointer-events-none opacity-10 text-[#8C6527]" />
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 relative z-10">
        {/* Brand Wordmark & Tagline */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onSelectSection('dashboard')}
            className="flex items-center gap-2.5 group cursor-pointer text-left"
          >
            <QartiniaLogo height={28} />
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
                className={`relative px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap overflow-hidden group ${
                  isActive
                    ? 'text-[#0F2038] font-bold bg-white border border-[#D5C8B5] shadow-2xs'
                    : 'text-[#5A6E85] hover:text-[#0F2038] hover:bg-[#EFE9DF]/60'
                }`}
              >
                <CarthageCornerMotif className="w-3.5 h-3.5 absolute top-0.5 right-0.5 pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity text-[#8C6527]" />
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#8C6527]' : 'text-[#718096]'}`} />
                <span>{item.label}</span>
                {typeof item.count === 'number' && item.count > 0 && (
                  <span
                    className={`text-[10px] font-mono ml-0.5 px-1.5 py-0.2 rounded ${
                      isActive
                        ? 'bg-[#FAF8F5] text-[#8C6527] border border-[#E5DDD0]'
                        : 'text-[#718096]'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}

          {/* More Tools Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap border relative overflow-hidden group ${
                isSecondaryActive
                  ? 'text-[#0F2038] bg-white font-bold border-[#D5C8B5] shadow-2xs'
                  : 'text-[#5A6E85] border-transparent hover:text-[#0F2038] hover:bg-[#EFE9DF]/60'
              }`}
            >
              <CarthageCornerMotif className="w-3.5 h-3.5 absolute top-0.5 right-0.5 pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity text-[#8C6527]" />
              <span>More Hubs</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#718096]" />
            </button>

            {moreDropdownOpen && (
              <div
                className="absolute left-0 mt-2 w-56 bg-white border border-[#D5C8B5] rounded-xl shadow-xl p-1.5 z-50 relative overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150"
                onMouseLeave={() => setMoreDropdownOpen(false)}
              >
                <DropdownTranslucentWatermark />

                <div className="relative z-10 space-y-0.5">
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
                        className={`w-full px-3 py-2 text-left text-xs font-medium rounded-lg flex items-center justify-between cursor-pointer transition-colors relative overflow-hidden group/item ${
                          activeSection === item.id
                            ? 'bg-[#FAF8F5] text-[#0F2038] font-bold border border-[#E5DDD0]'
                            : 'text-[#5A6E85] hover:bg-[#FAF8F5] hover:text-[#0F2038]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5 text-[#8C6527]" />
                          <span>{item.label}</span>
                        </div>
                        {typeof item.count === 'number' && item.count > 0 && (
                          <span className="text-[10px] font-mono text-[#8C6527]">({item.count})</span>
                        )}
                      </button>
                    );
                  })}
                </div>
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
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-[#FAF8F5] border border-[#E5DDD0] hover:border-[#D5C8B5] rounded-xl text-xs text-[#718096] hover:text-[#0F2038] transition-all cursor-pointer shadow-2xs relative overflow-hidden group"
              title="Search or jump to projects, benchmarks, and actions (Ctrl+K)"
            >
              <ShipWatermark className="w-14 h-14 absolute -right-2 -bottom-2 pointer-events-none opacity-10 text-[#8C6527]" />
              <Search className="w-3.5 h-3.5 text-[#8C6527] relative z-10" />
              <span className="font-serif font-bold text-[11px] relative z-10">Search / Jump...</span>
              <kbd className="ml-1 font-mono text-[9px] font-bold bg-[#FAF8F5] text-[#A0AEC0] border border-[#EBE3D7] rounded px-1.5 py-0.5 relative z-10">
                ⌘K
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
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-[#E5DDD0] hover:border-[#D5C8B5] bg-white transition-all cursor-pointer shadow-2xs text-left relative overflow-hidden group"
            >
              <CoinWatermark className="w-12 h-12 absolute -right-1 -bottom-1 pointer-events-none opacity-10 text-[#8C6527]" />
              <div className="w-6 h-6 rounded-lg bg-[#0F2038] text-white flex items-center justify-center text-[11px] font-serif font-bold relative z-10">
                {currentUser?.fullName
                  ? currentUser.fullName.charAt(0).toUpperCase()
                  : currentUser?.email
                  ? currentUser.email.charAt(0).toUpperCase()
                  : <UserIcon className="w-3.5 h-3.5" />}
              </div>
              <div className="hidden md:block leading-tight relative z-10">
                <span className="text-xs font-serif font-bold text-[#0F2038] block max-w-[120px] truncate">
                  {currentUser?.fullName || currentUser?.email?.split('@')[0] || 'Sign In'}
                </span>
                <span className="text-[10px] text-[#718096] font-mono block">
                  {currentUser?.organizationName || 'Independent'}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-[#718096] relative z-10" />
            </button>

            {userDropdownOpen && currentUser && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white border border-[#D5C8B5] rounded-2xl shadow-xl p-2 z-50 text-xs relative overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150"
                onMouseLeave={() => setUserDropdownOpen(false)}
              >
                <DropdownTranslucentWatermark />

                <div className="p-3 border-b border-[#EBE3D7] bg-[#FAF8F5] rounded-xl mb-1.5 relative z-10">
                  <div className="font-serif font-bold text-[#0F2038] truncate">{currentUser.fullName}</div>
                  <div className="text-[11px] font-mono text-[#718096] truncate">{currentUser.email}</div>
                  <div className="text-[10px] font-mono text-[#8C6527] mt-1 flex items-center gap-1">
                    <span className="px-1.5 py-0.2 rounded font-bold bg-[#EFE9DF] border border-[#D5C8B5]">
                      {currentUser.role}
                    </span>
                    <span className="truncate">· {currentUser.organizationName}</span>
                  </div>
                </div>

                <div className="space-y-0.5 relative z-10">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectSection('dashboard');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-[#0F2038] hover:bg-[#FAF8F5] flex items-center gap-2 rounded-lg cursor-pointer transition-colors"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#8C6527]" />
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
                        className="w-full px-3 py-2 text-left text-[#0F2038] hover:bg-[#FAF8F5] flex items-center gap-2 rounded-lg cursor-pointer transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5 text-[#718096]" />
                        <span>Edit Profile &amp; Credentials</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onOpenProfileModal();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left text-[#0F2038] hover:bg-[#FAF8F5] flex items-center justify-between rounded-lg cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <UserIcon className="w-3.5 h-3.5 text-[#8C6527]" />
                          <span>Corporate Invitations &amp; Seats</span>
                        </div>
                        <span className="text-[9px] font-mono font-bold text-[#8C6527] bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#E5DDD0]">
                          View
                        </span>
                      </button>
                    </>
                  )}

                  <PunicFiligreeDivider />

                  <button
                    type="button"
                    onClick={() => {
                      onOpenAuthModal();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-[#5A6E85] hover:bg-[#FAF8F5] flex items-center gap-2 rounded-lg cursor-pointer transition-colors"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-[#718096]" />
                    <span>Switch Session / Account</span>
                  </button>

                  {onLogout && (
                    <button
                      type="button"
                      onClick={() => {
                        onLogout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-rose-700 hover:bg-rose-50 flex items-center gap-2 rounded-lg cursor-pointer transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Primary Action Button: Evaluate Frontier */}
          <button
            type="button"
            onClick={() => onSelectSection('frontier')}
            className="hidden sm:flex px-3.5 py-1.5 text-xs font-serif font-bold text-white bg-[#0F2038] hover:bg-[#1A3254] rounded-xl transition-all items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-md active:scale-95 border border-[#1A3254] relative overflow-hidden group"
          >
            <ButtonTranslucentMotif className="w-4 h-4 text-[#C5A880] relative z-10" />
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880] relative z-10" />
            <span className="relative z-10">Evaluate Frontier</span>
          </button>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl border border-[#E5DDD0] text-[#0F2038] hover:bg-[#FAF8F5] cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[#EBE3D7] bg-[#FAF8F5] px-4 py-3 space-y-1 relative overflow-hidden">
          <DropdownTranslucentWatermark />
          <div className="relative z-10 space-y-1">
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
                  className={`w-full px-3 py-2 text-left text-xs font-medium rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-white text-[#0F2038] font-bold border border-[#D5C8B5] shadow-2xs'
                      : 'text-[#5A6E85] hover:bg-white/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-[#8C6527]" />
                    <span>{item.label}</span>
                  </div>
                  {typeof item.count === 'number' && item.count > 0 && (
                    <span className="text-[10px] font-mono text-[#8C6527]">({item.count})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
