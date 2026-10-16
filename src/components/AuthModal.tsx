import React, { useState } from 'react';
import { UserAccount, UserRole } from '../types/qartinia';
import { X, Lock, UserPlus, LogIn } from 'lucide-react';
import { QartiniaLogo } from './QartiniaLogo';
import { CarthageHarborPanorama, CarthageCornerMotif, ColumnsWatermark } from './CarthageArtwork';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onLogin: (payload: {
    email: string;
    password: string;
  }) => Promise<void>;
  onRegister: (payload: {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    organizationName: string;
    department: string;
    title: string;
    taxId?: string;
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
  const [role, setRole] = useState<UserRole>('company');
  const [organizationName, setOrganizationName] = useState('');
  const [department, setDepartment] = useState('');
  const [title, setTitle] = useState('');
  const [taxId, setTaxId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await onLogin({
          email: email.trim(),
          password: password.trim(),
        });
        setEmail('');
        setPassword('');
        onClose();
      } else {
        await onRegister({
          email: email.trim(),
          password: password.trim(),
          fullName: fullName.trim(),
          role,
          organizationName: organizationName.trim(),
          department: department.trim(),
          title: title.trim(),
          taxId: taxId.trim() || undefined,
        });
        setEmail('');
        setPassword('');
        setFullName('');
        setOrganizationName('');
        setDepartment('');
        setTitle('');
        setTaxId('');
        setSuccessMsg('Registration completed successfully! Please log in with your credentials.');
        setMode('login');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F2038]/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white border border-[#D5C8B5] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl my-8 space-y-4 relative overflow-hidden">
        <CarthageCornerMotif className="w-8 h-8 absolute top-2 right-2 pointer-events-none opacity-40 text-[#8C6527]" />
        <ColumnsWatermark className="w-40 h-40 absolute -right-8 -bottom-8 pointer-events-none opacity-[0.08] text-[#0F2038]" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#EBE3D7] relative z-10">
          <div className="space-y-1">
            <QartiniaLogo height={28} />
            <div className="text-xs text-[#5A6E85] font-serif">
              {mode === 'login'
                ? 'Verified Session Sign-In & Workspace Access'
                : 'Provision Enterprise or Research Account'}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#5A6E85] hover:text-[#0F2038] hover:bg-[#FAF8F5] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#FAF8F5] border border-[#E5DDD0] rounded-xl my-4">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
              setSuccessMsg(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'login'
                ? 'bg-[#0F2038] text-white shadow-2xs font-bold'
                : 'text-[#5A6E85] hover:text-[#0F2038]'
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
              setSuccessMsg(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'register'
                ? 'bg-[#0F2038] text-white shadow-2xs font-bold'
                : 'text-[#5A6E85] hover:text-[#0F2038]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-[#0F2038] mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Marie Laurent"
                className="w-full px-3 py-2 text-xs bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#0F2038] mb-1">
              Work / Institutional Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@organization.com"
              className="w-full px-3 py-2 text-xs bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F2038] mb-1">
              Password *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3 py-2 text-xs bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
            />
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#0F2038] mb-1">
                  Account Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                >
                  <option value="company">
                    Company — Enterprise Organization / Deep-Tech Partner
                  </option>
                  <option value="employee">
                    Employee — Enterprise R&amp;D Seat
                  </option>
                  <option value="user">
                    User — University Researcher / Lab Principal Investigator
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-[#0F2038] mb-1">
                    Organization / Lab
                  </label>
                  <input
                    type="text"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder="e.g. ETH Zurich / Enterprise Lab"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F2038] mb-1">
                    Department / Focus Area
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Power Electronics R&D"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-[#0F2038] mb-1">
                    Engineering Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="VP R&D / Principal Investigator"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F2038] mb-1">
                    Corporate Tax / VAT ID
                  </label>
                  <input
                    type="text"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    placeholder="Optional (e.g. FR-882910)"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#0F2038] rounded-xl hover:bg-[#1A365D] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
          >
            <Lock className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>
              {submitting
                ? 'Processing...'
                : mode === 'login'
                ? 'Authenticate & Load Session'
                : 'Create Account'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};
