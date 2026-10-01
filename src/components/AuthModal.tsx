import React, { useState } from 'react';
import { UserAccount, UserRole } from '../types/qartinia';
import { X, Lock, UserPlus, LogIn, Database, CheckCircle2 } from 'lucide-react';
import { QartiniaCrestSvg } from './QartiniaLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: UserAccount[];
  currentUser: UserAccount | null;
  onLogin: (payload: {
    email?: string;
    password?: string;
    fullName?: string;
    profileId?: string;
  }) => Promise<void>;
  onRegister: (payload: {
    email: string;
    password?: string;
    fullName: string;
    role: UserRole;
    organizationName: string;
    department: string;
    title: string;
    taxId?: string;
    requireApproval: boolean;
  }) => Promise<void>;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  accounts,
  currentUser,
  onLogin,
  onRegister,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('company');
  const [organizationName, setOrganizationName] = useState('');
  const [department, setDepartment] = useState('');
  const [title, setTitle] = useState('');
  const [taxId, setTaxId] = useState('');
  const [requireApproval, setRequireApproval] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await onLogin({
          email: email.trim(),
          password: password || undefined,
          fullName: fullName.trim() || undefined,
        });
      } else {
        await onRegister({
          email: email.trim(),
          password: password || undefined,
          fullName: fullName.trim(),
          role,
          organizationName: organizationName.trim(),
          department: department.trim(),
          title: title.trim(),
          taxId: taxId.trim() || undefined,
          requireApproval,
        });
      }
      setEmail('');
      setPassword('');
      setFullName('');
      setOrganizationName('');
      setDepartment('');
      setTitle('');
      setTaxId('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickSwitch = async (account: UserAccount) => {
    setError(null);
    setSubmitting(true);
    try {
      await onLogin({ profileId: account.id, email: account.email });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to switch session.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 shadow-xl my-8">
        <div className="flex items-start justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <QartiniaCrestSvg className="w-8 h-8" />
            <div>
              <div className="font-brand text-base font-bold text-[#0F2537] tracking-widest">
                QARTINIΛ
              </div>
              <div className="text-xs text-slate-500">
                {mode === 'login'
                  ? 'Supabase Auth & Profile Session Sign-In'
                  : 'Provision New Account in public.profiles'}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg my-4">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'login' ? 'bg-white text-[#0F2537] shadow-xs' : 'text-slate-600'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'register' ? 'bg-white text-[#0F2537] shadow-xs' : 'text-slate-600'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
            {error}
          </div>
        )}

        {/* Quick Live Supabase Account Selector (in Sign In mode) */}
        {mode === 'login' && accounts.length > 0 && (
          <div className="mb-4 p-3 bg-[#FAF9F6] border border-slate-200 rounded-lg space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span className="flex items-center gap-1.5 font-semibold text-[#0F2537]">
                <Database className="w-3.5 h-3.5 text-[#108548]" />
                <span>LIVE SUPABASE ACCOUNTS (public.profiles)</span>
              </span>
              <span>1-Click Sign In</span>
            </div>
            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
              {accounts.map((acc) => {
                const isCurrent = currentUser?.id === acc.id;
                return (
                  <button
                    key={acc.id}
                    type="button"
                    disabled={submitting}
                    onClick={() => handleQuickSwitch(acc)}
                    className={`w-full text-left px-2.5 py-1.5 rounded border text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      isCurrent
                        ? 'bg-emerald-50/80 border-emerald-300 text-[#0F2537]'
                        : 'bg-white border-slate-200 hover:border-[#0F2537]'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <span className="font-semibold text-[#0F2537]">{acc.fullName}</span>
                      <span className="text-slate-500 font-mono ml-1.5">({acc.email})</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 font-mono text-[11px]">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[#0F2537] font-semibold">
                        {acc.role}
                      </span>
                      <span
                        className={
                          acc.status === 'approved'
                            ? 'text-[#108548]'
                            : acc.status === 'pending'
                            ? 'text-amber-600'
                            : 'text-red-600'
                        }
                      >
                        {acc.status}
                      </span>
                      {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-[#108548]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Marie Laurent"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#0F2537] mb-1">
              Work / Institutional Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rafedriahi.rr@gmail.com or corporate email"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F2537] mb-1">
              Password {mode === 'login' ? '(Optional for existing Supabase profile)' : '*'}
            </label>
            <input
              type="password"
              required={mode === 'register'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                  PostgreSQL Account Role (public.user_role enum)
                </label>
                <select
                  value={role}
                  onChange={(e) => {
                    const nextRole = e.target.value as UserRole;
                    setRole(nextRole);
                    setRequireApproval(nextRole === 'employee');
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                >
                  <option value="company">
                    company — Enterprise Organization / Deep-Tech Partner
                  </option>
                  <option value="employee">
                    employee — Enterprise R&amp;D Seat (Triggers 004 Seat Approval RPC)
                  </option>
                  <option value="user">
                    user — University Researcher / Lab Principal Investigator
                  </option>
                  <option value="admin">
                    admin — Qartinia Platform Governance Admin
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                    Organization / Lab
                  </label>
                  <input
                    type="text"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder="e.g. rana org / ETH Zurich"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                    Department / Focus Area
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Power Electronics R&D"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                    Engineering Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="VP R&D / Principal Investigator"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                    Corporate Tax / VAT ID
                  </label>
                  <input
                    type="text"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    placeholder="Optional (e.g. FR-882910)"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-700 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requireApproval}
                  onChange={(e) => setRequireApproval(e.target.checked)}
                  className="rounded border-slate-300"
                />
                <span>
                  Set initial PostgreSQL status to <code className="font-mono">pending</code> (routes to Atomic Approval RPC)
                </span>
              </label>
            </>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#0F2537] rounded-lg hover:bg-[#16344D] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-[#C59B47]" />
            <span>
              {submitting
                ? 'Syncing with Supabase...'
                : mode === 'login'
                ? 'Authenticate & Load Supabase Session'
                : 'Create Account in Supabase & Sign In'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};
