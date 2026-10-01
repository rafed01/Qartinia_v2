import React, { useState } from 'react';
import { UserRole } from '../types/qartinia';
import { X, Lock, UserPlus, LogIn } from 'lucide-react';
import { QartiniaCrestSvg } from './QartiniaLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (payload: { email: string; fullName?: string }) => Promise<void>;
  onRegister: (payload: {
    email: string;
    fullName: string;
    role: UserRole;
    organizationName: string;
    department: string;
    title: string;
    requireApproval: boolean;
  }) => Promise<void>;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('enterprise_admin');
  const [organizationName, setOrganizationName] = useState('');
  const [department, setDepartment] = useState('');
  const [title, setTitle] = useState('');
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
        await onLogin({ email: email.trim(), fullName: fullName.trim() || undefined });
      } else {
        await onRegister({
          email: email.trim(),
          fullName: fullName.trim(),
          role,
          organizationName: organizationName.trim(),
          department: department.trim(),
          title: title.trim(),
          requireApproval,
        });
      }
      setEmail('');
      setPassword('');
      setFullName('');
      setOrganizationName('');
      setDepartment('');
      setTitle('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-lg">
        <div className="flex items-start justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <QartiniaCrestSvg className="w-8 h-8" />
            <div>
              <div className="font-brand text-base font-bold text-[#0F2537] tracking-widest">
                QARTINIΛ
              </div>
              <div className="text-xs text-slate-500">
                {mode === 'login'
                  ? 'Sign in to Protected Workspace'
                  : 'Register Enterprise or Research Account'}
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
            onClick={() => setMode('login')}
            className={`py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'login' ? 'bg-white text-[#0F2537] shadow-xs' : 'text-slate-600'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
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

        <form onSubmit={handleSubmit} className="space-y-3.5">
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
                placeholder="Enter full name"
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
              placeholder="Enter institutional or corporate email"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F2537] mb-1">
              Password *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
            />
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                  Account Track & Role
                </label>
                <select
                  value={role}
                  onChange={(e) => {
                    const nextRole = e.target.value as UserRole;
                    setRole(nextRole);
                    setRequireApproval(nextRole === 'enterprise_employee');
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                >
                  <option value="enterprise_admin">Enterprise Organization Admin</option>
                  <option value="enterprise_employee">
                    Enterprise Employee (Triggers Seat Approval Gate)
                  </option>
                  <option value="researcher">University / Lab Researcher (PI)</option>
                  <option value="startup_founder">Deep-Tech Founder / Provider</option>
                  <option value="platform_admin">Qartinia Platform Governance Admin</option>
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
                    placeholder="Organization name"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                    Department / Unit
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Department"
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
                <span>Route account through Atomic Approval Gate (/pending-approval)</span>
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
                ? 'Processing...'
                : mode === 'login'
                ? 'Sign In to Qartinia'
                : 'Register & Initialize Session'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};
