import React, { useState, useRef, useEffect } from 'react';
import { UserAccount, NotificationItem, QartiniaSection } from '../types/qartinia';
import { Search, ChevronDown, User as UserIcon, LogOut, Settings, Bell, Menu, Shield } from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';
import { ShipWatermark, WavesWatermark, CarthageCornerMotif } from './CarthageArtwork';
import { QartiniaLogo } from './QartiniaLogo';

interface TopHeaderProps {
  currentUser: UserAccount | null;
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  onMarkNotificationAsRead: (id: string) => Promise<void>;
  onMarkAllNotificationsAsRead: () => Promise<void>;
  onDeleteNotification: (id: string) => Promise<void>;
  onNavigateToNotification: (section: QartiniaSection, linkId?: string) => void;
  onOpenAuthModal: () => void;
  onOpenProfileModal: () => void;
  onOpenCommandPalette: () => void;
  onLogout: () => Promise<void>;
  onToggleMobileMenu?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
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
  onToggleMobileMenu,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-[#FAF8F5] border-b border-[#EBE3D7] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 select-none">
      {/* Left: Mobile Menu Trigger + Search Palette Trigger */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {/* Mobile Hamburger Menu Toggle */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          aria-label="Open Navigation Menu"
          className="lg:hidden p-2 rounded-xl text-[#0F2038] hover:bg-[#EFE9DF] transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand mark visible on small screens when sidebar is hidden */}
        <div className="flex items-center lg:hidden">
          <QartiniaLogo height={26} />
        </div>

        {/* Global Search & Command Palette Bar (Desktop) */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="hidden sm:flex items-center justify-between w-full max-w-md px-3.5 py-1.5 rounded-xl bg-white border border-[#E5DDD0] text-xs text-[#718096] hover:border-[#D5C8B5] hover:text-[#0F2038] transition-all cursor-pointer shadow-2xs relative overflow-hidden group min-h-[38px]"
        >
          <ShipWatermark className="w-16 h-16 absolute -right-2 -bottom-2 pointer-events-none opacity-10 text-[#8C6527]" />
          <div className="flex items-center gap-2.5 relative z-10">
            <Search className="w-4 h-4 text-[#8C6527]" />
            <span>Search frontiers, research evidence, protected projects...</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[10px] text-[#A0AEC0] bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#EBE3D7] relative z-10">
            <span>⌘K</span>
          </div>
        </button>

        {/* Global Search Button (Mobile Icon Trigger) */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          aria-label="Search and Jump"
          className="sm:hidden p-2 rounded-xl bg-white border border-[#E5DDD0] text-[#8C6527] hover:bg-[#FAF8F5] transition-colors cursor-pointer shadow-2xs min-h-[38px] min-w-[38px] flex items-center justify-center"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Organization Badge + Notifications + User Menu */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Active Organization Stamp */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-white border border-[#E5DDD0] text-xs shadow-2xs relative overflow-hidden">
          <WavesWatermark className="w-12 h-12 absolute -right-1 -bottom-1 pointer-events-none opacity-10 text-[#8C6527]" />
          <span className="w-2 h-2 rounded-full bg-emerald-600 relative z-10" />
          <span className="font-serif font-bold text-[#0F2038] truncate max-w-[180px] relative z-10">
            {currentUser?.organizationName || 'Deep-Tech Consortium'}
          </span>
          <span className="text-[10px] font-mono text-[#8C6527] bg-[#FAF8F5] px-1.5 py-0.2 rounded border border-[#E5DDD0] relative z-10">
            Tier 1
          </span>
        </div>

        {/* Notification Center */}
        <NotificationCenter
          notifications={notifications}
          unreadCount={unreadNotificationsCount}
          onMarkAsRead={onMarkNotificationAsRead}
          onMarkAllAsRead={onMarkAllNotificationsAsRead}
          onDeleteNotification={onDeleteNotification}
          onNavigateToNotification={onNavigateToNotification}
        />

        {/* User Account / Auth Dropdown */}
        {currentUser ? (
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-white border border-[#E5DDD0] hover:border-[#D5C8B5] transition-all cursor-pointer shadow-2xs"
            >
              <div className="w-7 h-7 rounded-lg bg-[#0F2038] text-white flex items-center justify-center font-serif font-bold text-xs">
                {currentUser.fullName ? currentUser.fullName[0].toUpperCase() : 'U'}
              </div>
              <div className="hidden sm:block text-left min-w-0 max-w-[120px]">
                <div className="text-xs font-serif font-bold text-[#0F2038] truncate leading-tight">
                  {currentUser.fullName || currentUser.username}
                </div>
                <div className="text-[10px] font-mono text-[#718096] truncate">
                  {currentUser.role?.toUpperCase()}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#718096]" />
            </button>

            {/* Profile Menu Dropdown Popover */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-[#D5C8B5] shadow-xl p-2 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150 relative overflow-hidden">
                <CarthageCornerMotif className="w-6 h-6 absolute top-1 right-1 pointer-events-none opacity-40 text-[#8C6527]" />
                <ShipWatermark className="w-24 h-24 absolute -right-4 -bottom-4 pointer-events-none opacity-10 text-[#0F2038]" />
                
                <div className="p-3 border-b border-[#EBE3D7] bg-[#FAF8F5] rounded-xl mb-1.5 relative z-10">
                  <div className="font-serif font-bold text-[#0F2038] truncate">
                    {currentUser.fullName}
                  </div>
                  <div className="font-mono text-[11px] text-[#718096] truncate">
                    {currentUser.email}
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded font-mono text-[9px] font-bold bg-[#EFE9DF] text-[#8C6527] border border-[#D5C8B5]">
                      {currentUser.role?.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-[#718096] truncate">
                      {currentUser.organizationName}
                    </span>
                  </div>
                </div>

                <div className="space-y-0.5 relative z-10">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onOpenProfileModal();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-[#0F2038] hover:bg-[#FAF8F5] flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#8C6527]" />
                    <span>Account &amp; Security Settings</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-rose-700 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenAuthModal}
            className="px-4 py-2 bg-[#0F2038] text-white text-xs font-bold rounded-xl hover:bg-[#1A365D] transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <UserIcon className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
