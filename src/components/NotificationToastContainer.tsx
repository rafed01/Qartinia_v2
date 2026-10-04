import React, { useEffect } from 'react';
import { NotificationItem, QartiniaSection } from '../types/qartinia';
import {
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle,
  Lock,
  Flag,
  X,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export interface ToastNotification extends NotificationItem {
  toastId: string;
}

interface NotificationToastContainerProps {
  toasts: ToastNotification[];
  onDismissToast: (toastId: string) => void;
  onNavigateToNotification: (section: QartiniaSection, linkId?: string) => void;
}

export const NotificationToastContainer: React.FC<NotificationToastContainerProps> = ({
  toasts,
  onDismissToast,
  onNavigateToNotification,
}) => {
  if (toasts.length === 0) return null;

  return (
    <aside
      aria-label="Real-time notifications"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => (
        <ToastCard
          key={toast.toastId}
          toast={toast}
          onDismiss={() => onDismissToast(toast.toastId)}
          onAction={() => {
            if (toast.linkSection) {
              onNavigateToNotification(toast.linkSection, toast.linkId);
            }
            onDismissToast(toast.toastId);
          }}
        />
      ))}
    </aside>
  );
};

const ToastCard: React.FC<{
  toast: ToastNotification;
  onDismiss: () => void;
  onAction: () => void;
}> = ({ toast, onDismiss, onAction }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 7000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'request_status_updated':
        if (toast.metadata?.newStatus === 'approved') {
          return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
        }
        if (toast.metadata?.newStatus === 'rejected') {
          return <AlertCircle className="w-4 h-4 text-rose-600" />;
        }
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'project_added':
        return <Lock className="w-4 h-4 text-[#0F2537]" />;
      case 'milestone_created':
      case 'milestone_updated':
        return <Flag className="w-4 h-4 text-[#108548]" />;
      default:
        return <Bell className="w-4 h-4 text-[#0F2537]" />;
    }
  };

  const getBadgeColor = () => {
    switch (toast.type) {
      case 'request_status_updated':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'project_added':
        return 'bg-slate-100 text-[#0F2537] border-slate-200';
      case 'milestone_created':
      case 'milestone_updated':
        return 'bg-emerald-50 text-emerald-900 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="pointer-events-auto bg-white border border-slate-200 shadow-xl rounded-xl p-4 transition-all duration-300 transform translate-y-0 opacity-100 animate-in fade-in slide-in-from-bottom-3 space-y-2.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#FAF9F6] border border-slate-200 shrink-0">
            {getIcon()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`px-1.5 py-0.2 rounded font-mono text-[9px] uppercase font-bold border ${getBadgeColor()}`}>
                {toast.type.replace(/_/g, ' ')}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">· Just now</span>
            </div>
            <h4 className="text-xs font-bold text-[#0F2537] mt-0.5 leading-snug">
              {toast.title}
            </h4>
          </div>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
          aria-label="Close notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pl-7">
        {toast.message}
      </p>

      {toast.linkSection && (
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 pl-7 text-xs">
          <button
            type="button"
            onClick={onAction}
            className="text-[11px] font-bold text-[#108548] hover:text-[#0c6b39] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>View in {toast.linkSection === 'dashboard' ? 'My Workspace' : toast.linkSection.toUpperCase()}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
          <span className="text-[10px] text-slate-400 font-mono">Live Push Alert</span>
        </div>
      )}
    </div>
  );
};
