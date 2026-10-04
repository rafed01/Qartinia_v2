import React, { useState, useRef, useEffect } from 'react';
import { NotificationItem, QartiniaSection } from '../types/qartinia';
import {
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle,
  Lock,
  Flag,
  X,
  Check,
  CheckCheck,
  ChevronRight,
  Filter,
  Sparkles,
  Inbox,
  Trash2,
} from 'lucide-react';

interface NotificationCenterProps {
  notifications: NotificationItem[];
  unreadCount: number;
  onMarkAsRead: (id: string) => Promise<void>;
  onMarkAllAsRead: () => Promise<void>;
  onDeleteNotification: (id: string) => Promise<void>;
  onNavigateToNotification: (section: QartiniaSection, linkId?: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onNavigateToNotification,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'requests' | 'projects' | 'milestones'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const filteredNotifications = notifications.filter((notif) => {
    if (activeFilter === 'requests') {
      return notif.type === 'request_status_updated';
    }
    if (activeFilter === 'projects') {
      return notif.type === 'project_added';
    }
    if (activeFilter === 'milestones') {
      return notif.type === 'milestone_created' || notif.type === 'milestone_updated';
    }
    return true;
  });

  const getNotificationIcon = (notif: NotificationItem) => {
    switch (notif.type) {
      case 'request_status_updated':
        if (notif.metadata?.newStatus === 'approved') {
          return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
        }
        if (notif.metadata?.newStatus === 'rejected') {
          return <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />;
        }
        return <Clock className="w-4 h-4 text-amber-600 shrink-0" />;
      case 'project_added':
        return <Lock className="w-4 h-4 text-[#0F2537] shrink-0" />;
      case 'milestone_created':
      case 'milestone_updated':
        return <Flag className="w-4 h-4 text-[#108548] shrink-0" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500 shrink-0" />;
    }
  };

  const handleNotificationClick = async (notif: NotificationItem) => {
    if (!notif.read) {
      await onMarkAsRead(notif.id);
    }
    if (notif.linkSection) {
      onNavigateToNotification(notif.linkSection, notif.linkId);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-colors cursor-pointer text-slate-700"
        title="Real-Time Alerts & Notifications"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#108548] px-1 text-[9px] font-bold text-white shadow-2xs animate-pulse font-mono">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col text-xs max-h-[560px] animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-4 bg-[#FAF9F6] border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#0F2537] text-sm">Notifications</span>
              {unreadCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {unreadCount} unread
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 font-mono">All caught up</span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={async () => {
                  await onMarkAllAsRead();
                }}
                className="text-[11px] text-[#108548] hover:text-[#0c6b39] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Filter Bar */}
          <div className="px-3 py-2 bg-white border-b border-slate-100 flex items-center gap-1 text-[11px] overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-md font-medium cursor-pointer transition-colors whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-[#0F2537] text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('requests')}
              className={`px-2.5 py-1 rounded-md font-medium cursor-pointer transition-colors whitespace-nowrap ${
                activeFilter === 'requests'
                  ? 'bg-[#0F2537] text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Requests ({notifications.filter((n) => n.type === 'request_status_updated').length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('projects')}
              className={`px-2.5 py-1 rounded-md font-medium cursor-pointer transition-colors whitespace-nowrap ${
                activeFilter === 'projects'
                  ? 'bg-[#0F2537] text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Projects ({notifications.filter((n) => n.type === 'project_added').length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('milestones')}
              className={`px-2.5 py-1 rounded-md font-medium cursor-pointer transition-colors whitespace-nowrap ${
                activeFilter === 'milestones'
                  ? 'bg-[#0F2537] text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Milestones ({notifications.filter((n) => n.type === 'milestone_created' || n.type === 'milestone_updated').length})
            </button>
          </div>

          {/* Notifications List */}
          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[380px]">
            {filteredNotifications.length === 0 ? (
              <div className="py-12 px-4 text-center space-y-2 text-slate-500">
                <Inbox className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs">No notifications in this category.</p>
              </div>
            ) : (
              filteredNotifications.map((notif) => {
                return (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3 relative group ${
                      !notif.read ? 'bg-[#FAF9F6]/80' : 'bg-white'
                    }`}
                  >
                    {/* Unread indicator dot */}
                    {!notif.read && (
                      <span
                        className="w-2 h-2 rounded-full bg-[#108548] shrink-0 mt-1.5"
                        title="Unread notification"
                      />
                    )}

                    <div className="p-1.5 rounded-lg bg-white border border-slate-200 shrink-0 mt-0.5">
                      {getNotificationIcon(notif)}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-[#0F2537] truncate block text-xs">
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {notif.timestamp}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {notif.message}
                      </p>

                      {notif.metadata?.decisionNotes && (
                        <div className="p-1.5 rounded bg-emerald-50 text-[10px] text-emerald-900 font-mono">
                          <strong>Note:</strong> {notif.metadata.decisionNotes}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-[#108548] font-semibold flex items-center gap-0.5">
                          <span>View Details</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>

                        <button
                          type="button"
                          onClick={async (e) => {
                            e.stopPropagation();
                            await onDeleteNotification(notif.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-1 rounded transition-opacity cursor-pointer"
                          title="Dismiss notification"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-[#FAF9F6] border-t border-slate-200 text-center text-[10px] text-slate-500 font-mono">
            Real-time multi-user event bus connected
          </div>
        </div>
      )}
    </div>
  );
};
