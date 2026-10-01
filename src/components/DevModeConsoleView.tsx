import React, { useState } from 'react';
import {
  UserAccount,
  UserRole,
  AccountStatus,
  EnterpriseMember,
  AtomicApprovalItem,
  AuditActivityItem,
} from '../types/qartinia';
import {
  ShieldCheck,
  UserPlus,
  LogIn,
  LogOut,
  Check,
  X,
  RefreshCw,
  Users,
  Settings,
  AlertTriangle,
  Clock,
  Activity,
} from 'lucide-react';

interface DevModeConsoleViewProps {
  currentUser: UserAccount | null;
  accounts: UserAccount[];
  enterpriseMembers: EnterpriseMember[];
  approvals: AtomicApprovalItem[];
  activityLog: AuditActivityItem[];
  onOpenAuthModal: () => void;
  onLogout: () => Promise<void>;
  onUpdateProfile: (updates: Partial<UserAccount>) => Promise<void>;
  onManageOrganization: (payload: {
    action: 'invite' | 'approve_member' | 'suspend_member' | 'remove_member';
    memberId?: string;
    fullName?: string;
    email?: string;
    organizationName?: string;
    role?: EnterpriseMember['role'];
    department?: string;
    requireApproval?: boolean;
  }) => Promise<void>;
  onHandleApproval: (payload: {
    action?: 'create' | 'decide';
    approvalId?: string;
    decision?: 'Approved' | 'Rejected';
    workflowType?: AtomicApprovalItem['workflowType'];
    subjectName?: string;
    subjectEmail?: string;
    organizationName?: string;
    requestedRoleOrTier?: string;
    notes?: string;
  }) => Promise<void>;
  onResetWorkspace: () => Promise<void>;
}

type DevTab =
  | 'auth-rbac'
  | 'enterprise-seats'
  | 'atomic-approvals'
  | 'onboarding-gates'
  | 'settings-audit';

export const DevModeConsoleView: React.FC<DevModeConsoleViewProps> = ({
  currentUser,
  accounts,
  enterpriseMembers,
  approvals,
  activityLog,
  onOpenAuthModal,
  onLogout,
  onUpdateProfile,
  onManageOrganization,
  onHandleApproval,
  onResetWorkspace,
}) => {
  const [activeTab, setActiveTab] = useState<DevTab>('auth-rbac');

  // Enterprise Member Invite Form State
  const [memName, setMemName] = useState('');
  const [memEmail, setMemEmail] = useState('');
  const [memOrg, setMemOrg] = useState('');
  const [memDept, setMemDept] = useState('');
  const [memRole, setMemRole] = useState<EnterpriseMember['role']>('R&D Lead');
  const [memRequireApproval, setMemRequireApproval] = useState(true);

  // New Approval Queue Item Form State
  const [aprType, setAprType] = useState<AtomicApprovalItem['workflowType']>('organization_verification');
  const [aprSubject, setAprSubject] = useState('');
  const [aprEmail, setAprEmail] = useState('');
  const [aprOrg, setAprOrg] = useState('');
  const [aprRoleTier, setAprRoleTier] = useState('');
  const [aprNotes, setAprNotes] = useState('');

  // Settings Form State
  const [settingsName, setSettingsName] = useState('');
  const [settingsOrg, setSettingsOrg] = useState('');
  const [settingsDept, setSettingsDept] = useState('');
  const [settingsTitle, setSettingsTitle] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'Pending').length;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memName.trim() || !memEmail.trim()) return;
    await onManageOrganization({
      action: 'invite',
      fullName: memName.trim(),
      email: memEmail.trim(),
      organizationName: memOrg.trim() || currentUser?.organizationName || 'Enterprise Workspace',
      role: memRole,
      department: memDept.trim() || 'Advanced Engineering',
      requireApproval: memRequireApproval,
    });
    setMemName('');
    setMemEmail('');
    setMemOrg('');
    setMemDept('');
    showToast(
      memRequireApproval
        ? 'Seat request created and routed to Atomic Approvals queue.'
        : 'Enterprise seat provisioned as Active.'
    );
  };

  const handleCreateApprovalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aprSubject.trim()) return;
    await onHandleApproval({
      action: 'create',
      workflowType: aprType,
      subjectName: aprSubject.trim(),
      subjectEmail: aprEmail.trim(),
      organizationName: aprOrg.trim() || aprSubject.trim(),
      requestedRoleOrTier: aprRoleTier.trim() || 'Enterprise Partner',
      notes: aprNotes.trim(),
    });
    setAprSubject('');
    setAprEmail('');
    setAprOrg('');
    setAprRoleTier('');
    setAprNotes('');
    showToast('Queued item in Atomic Approvals console.');
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateProfile({
      fullName: settingsName.trim() || currentUser?.fullName || 'Operator',
      organizationName: settingsOrg.trim() || currentUser?.organizationName || 'Qartinia',
      department: settingsDept.trim() || currentUser?.department || 'R&D',
      title: settingsTitle.trim() || currentUser?.title || 'Director',
    });
    setSettingsName('');
    setSettingsOrg('');
    setSettingsDept('');
    setSettingsTitle('');
    showToast('Account and organization profile updated.');
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">
      {/* Dev Mode Header Banner */}
      <div className="bg-[#0F2537] text-white rounded-xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border border-[#C59B47]/40">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[#C59B47]">
            <ShieldCheck className="w-4 h-4" />
            <span>DEV MODE &amp; ENTERPRISE GOVERNANCE INFRASTRUCTURE</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Authentication, RBAC Onboarding, Enterprise Seats &amp; Atomic Approvals
          </h1>
          <p className="text-xs text-slate-300 max-w-3xl">
            Full operational backend from your original codebase (`AuthModal`, `/login`, `/register`, `/onboarding`, `/pending-approval`, `/rejected`, `/dashboard/enterprise`, `/admin`, and `/settings`).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenAuthModal}
            className="px-4 py-2 text-xs font-semibold text-[#0F2537] bg-[#C59B47] hover:bg-[#d4ab55] rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{currentUser ? 'Switch / Register Account' : 'Open Login / Register Modal'}</span>
          </button>

          {currentUser && (
            <button
              type="button"
              onClick={onLogout}
              className="px-3.5 py-2 text-xs font-semibold text-white border border-slate-600 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          )}

          <button
            type="button"
            onClick={async () => {
              await onResetWorkspace();
              showToast('All Dev Mode and workspace stores reset to clean state.');
            }}
            className="px-3.5 py-2 text-xs font-semibold text-slate-300 border border-slate-700 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Clean State</span>
          </button>
        </div>
      </div>

      {toast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-sm text-emerald-900">
          <div className="flex items-center gap-2 font-medium">
            <Check className="w-4 h-4 text-[#108548]" />
            <span>{toast}</span>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-xs text-emerald-800 hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/80 rounded-lg w-fit">
        {(
          [
            { id: 'auth-rbac', label: `1. Auth & RBAC Session (${accounts.length})` },
            { id: 'enterprise-seats', label: `2. Enterprise Seats (${enterpriseMembers.length})` },
            { id: 'atomic-approvals', label: `3. Admin Atomic Approvals (${pendingApprovalsCount})` },
            { id: 'onboarding-gates', label: '4. Onboarding & Approval Gates' },
            { id: 'settings-audit', label: `5. Settings & Audit Log (${activityLog.length})` },
          ] as { id: DevTab; label: string }[]
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white text-[#0F2537] shadow-xs'
                : 'text-slate-600 hover:text-[#0F2537]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: AUTH & RBAC SESSION INSPECTOR */}
      {activeTab === 'auth-rbac' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-[#0F2537]">
                Active Session &amp; Role Context
              </h2>
              <span className="text-xs font-mono text-[#108548]">
                {currentUser ? `Authenticated (${currentUser.status})` : 'Unauthenticated Guest'}
              </span>
            </div>

            {currentUser ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 p-4 rounded-lg bg-[#FAF9F6] border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-500 block">Full Name</span>
                    <strong className="text-[#0F2537]">{currentUser.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Email</span>
                    <strong className="text-[#0F2537] font-mono">{currentUser.email}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Organization</span>
                    <strong className="text-[#0F2537]">{currentUser.organizationName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Department / Title</span>
                    <strong className="text-[#0F2537]">
                      {currentUser.department} · {currentUser.title}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">RBAC Role</span>
                    <strong className="text-[#108548] font-mono">{currentUser.role}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Gate Status</span>
                    <strong className="text-[#0F2537] font-mono">{currentUser.status}</strong>
                  </div>
                </div>

                {/* Instant Role & Status Simulator */}
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-semibold text-[#0F2537]">
                    Switch Active Session Role or Gate State
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      value={currentUser.role}
                      onChange={(e) => onUpdateProfile({ role: e.target.value as UserRole })}
                      className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                    >
                      <option value="platform_admin">Role: Platform Admin</option>
                      <option value="enterprise_admin">Role: Enterprise Org Admin</option>
                      <option value="enterprise_employee">Role: Enterprise Employee</option>
                      <option value="researcher">Role: Researcher / Lab PI</option>
                      <option value="startup_founder">Role: Startup Founder</option>
                    </select>
                    <select
                      value={currentUser.status}
                      onChange={(e) =>
                        onUpdateProfile({ status: e.target.value as AccountStatus })
                      }
                      className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                    >
                      <option value="approved">State: Approved</option>
                      <option value="onboarding">State: Onboarding (/onboarding)</option>
                      <option value="pending_approval">
                        State: Pending Approval (/pending-approval)
                      </option>
                      <option value="rejected">State: Rejected (/rejected)</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-3">
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  No active user session. Click below to open the Login / Registration modal and create or authenticate an account.
                </p>
                <button
                  type="button"
                  onClick={onOpenAuthModal}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0F2537] rounded-lg hover:bg-[#16344D] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#C59B47]" />
                  <span>Sign In or Register Account</span>
                </button>
              </div>
            )}
          </div>

          {/* Registered Accounts List */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-base font-bold text-[#0F2537]">
              Registered Accounts Directory ({accounts.length})
            </h2>
            {accounts.length === 0 ? (
              <p className="text-xs text-slate-500">
                No accounts registered yet. Accounts created via the Auth Modal appear here.
              </p>
            ) : (
              <div className="divide-y divide-slate-200">
                {accounts.map((acc) => (
                  <div
                    key={acc.id}
                    className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="font-bold text-[#0F2537]">{acc.fullName}</div>
                      <div className="text-slate-500">
                        {acc.email} · {acc.organizationName}
                      </div>
                      <div className="font-mono text-[11px] text-[#108548] mt-0.5">
                        {acc.role} · status: {acc.status}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onUpdateProfile(acc)}
                      className="px-3 py-1.5 text-xs font-semibold text-[#0F2537] border border-slate-200 rounded hover:bg-slate-50 cursor-pointer"
                    >
                      Impersonate
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ENTERPRISE WORKSPACE SEAT MANAGEMENT (`/dashboard/enterprise`) */}
      {activeTab === 'enterprise-seats' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#108548]" />
                <h2 className="text-base font-bold text-[#0F2537]">
                  Enterprise Organization Seat Roster (`004_enterprise_employee_approval.sql`)
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-500">
                {enterpriseMembers.length} Total Seats
              </span>
            </div>

            {enterpriseMembers.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                No enterprise seats provisioned yet. Use the form on the right or register an Enterprise Employee account to populate the roster.
              </p>
            ) : (
              <div className="divide-y divide-slate-200">
                {enterpriseMembers.map((mem) => (
                  <div
                    key={mem.id}
                    className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-[#0F2537] text-sm">{mem.fullName}</div>
                      <div className="text-slate-600">
                        {mem.email} · {mem.organizationName} · {mem.role} ({mem.department})
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`font-mono font-semibold ${
                          mem.status === 'Active'
                            ? 'text-emerald-700'
                            : mem.status === 'Pending Approval'
                            ? 'text-amber-700'
                            : 'text-red-700'
                        }`}
                      >
                        {mem.status}
                      </span>

                      {mem.status !== 'Active' ? (
                        <button
                          type="button"
                          onClick={() =>
                            onManageOrganization({ action: 'approve_member', memberId: mem.id })
                          }
                          className="px-2.5 py-1 text-xs font-semibold text-white bg-[#0F2537] rounded hover:bg-[#16344D] cursor-pointer"
                        >
                          Approve Seat
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            onManageOrganization({ action: 'suspend_member', memberId: mem.id })
                          }
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200 rounded hover:bg-slate-50 cursor-pointer"
                        >
                          Suspend
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <form
              onSubmit={handleInviteSubmit}
              className="bg-white border border-slate-200 rounded-xl p-6 space-y-3.5"
            >
              <h3 className="text-base font-bold text-[#0F2537]">
                Invite / Provision Enterprise Employee Seat
              </h3>
              <div>
                <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                  Employee Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={memName}
                  onChange={(e) => setMemName(e.target.value)}
                  placeholder="Enter employee name"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                  Corporate Email *
                </label>
                <input
                  type="email"
                  required
                  value={memEmail}
                  onChange={(e) => setMemEmail(e.target.value)}
                  placeholder="Enter corporate email"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                    Organization
                  </label>
                  <input
                    type="text"
                    value={memOrg}
                    onChange={(e) => setMemOrg(e.target.value)}
                    placeholder="Organization name"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={memDept}
                    onChange={(e) => setMemDept(e.target.value)}
                    placeholder="Department"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                  Workspace Role
                </label>
                <select
                  value={memRole}
                  onChange={(e) => setMemRole(e.target.value as EnterpriseMember['role'])}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                >
                  <option value="R&D Lead">R&amp;D Lead</option>
                  <option value="Technology Scout">Technology Scout</option>
                  <option value="IP & Legal Counsel">IP &amp; Legal Counsel</option>
                  <option value="Organization Admin">Organization Admin</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={memRequireApproval}
                  onChange={(e) => setMemRequireApproval(e.target.checked)}
                />
                <span>Require Atomic Admin Approval before activating seat</span>
              </label>
              <button
                type="submit"
                className="w-full py-2.5 text-xs font-semibold text-white bg-[#0F2537] rounded-lg hover:bg-[#16344D] cursor-pointer"
              >
                Provision Seat
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: ADMIN ATOMIC APPROVAL WORKFLOWS (`/admin` & `005_atomic_approval_workflows.sql`) */}
      {activeTab === 'atomic-approvals' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-base font-bold text-[#0F2537]">
                Atomic Approval Queue (`005_atomic_approval_workflows.sql`)
              </h2>
              <span className="text-xs font-mono text-[#108548]">
                {pendingApprovalsCount} Pending
              </span>
            </div>

            {approvals.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                No approval items queued yet. Register an account with approval required or submit a verification item on the right.
              </p>
            ) : (
              <div className="divide-y divide-slate-200">
                {approvals.map((item) => (
                  <div
                    key={item.id}
                    className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="text-xs text-slate-500">
                        <span className="font-mono font-semibold text-[#0F2537]">
                          {item.workflowType}
                        </span>
                        <span> · {item.organizationName} · {item.submittedAt} · </span>
                        <span
                          className={`font-semibold ${
                            item.status === 'Approved'
                              ? 'text-emerald-700'
                              : item.status === 'Rejected'
                              ? 'text-red-700'
                              : 'text-amber-700'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-[#0F2537]">
                        {item.subjectName}{' '}
                        <span className="font-normal text-slate-600">
                          — {item.requestedRoleOrTier}
                        </span>
                      </div>
                      {item.notes && <p className="text-xs text-slate-600">{item.notes}</p>}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        disabled={item.status === 'Approved'}
                        onClick={() =>
                          onHandleApproval({ approvalId: item.id, decision: 'Approved' })
                        }
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0F2537] rounded-md hover:bg-[#16344D] disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        type="button"
                        disabled={item.status === 'Rejected'}
                        onClick={() =>
                          onHandleApproval({ approvalId: item.id, decision: 'Rejected' })
                        }
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <form
              onSubmit={handleCreateApprovalSubmit}
              className="bg-white border border-slate-200 rounded-xl p-6 space-y-3.5"
            >
              <h3 className="text-base font-bold text-[#0F2537]">
                Enqueue Governance Verification Request
              </h3>
              <div>
                <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                  Workflow Type
                </label>
                <select
                  value={aprType}
                  onChange={(e) =>
                    setAprType(e.target.value as AtomicApprovalItem['workflowType'])
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                >
                  <option value="organization_verification">Organization Verification</option>
                  <option value="enterprise_employee_seat">Enterprise Employee Seat</option>
                  <option value="evidence_submission">Technical Evidence Submission</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                  Subject / Entity Name *
                </label>
                <input
                  type="text"
                  required
                  value={aprSubject}
                  onChange={(e) => setAprSubject(e.target.value)}
                  placeholder="Applicant, organization, or submission title"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={aprEmail}
                    onChange={(e) => setAprEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                    Organization
                  </label>
                  <input
                    type="text"
                    value={aprOrg}
                    onChange={(e) => setAprOrg(e.target.value)}
                    placeholder="Organization"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                  Requested Role / Tier
                </label>
                <input
                  type="text"
                  value={aprRoleTier}
                  onChange={(e) => setAprRoleTier(e.target.value)}
                  placeholder="Requested role or subscription tier"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                  Verification Justification
                </label>
                <textarea
                  rows={2}
                  value={aprNotes}
                  onChange={(e) => setAprNotes(e.target.value)}
                  placeholder="Context for admin decision"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 text-xs font-semibold text-white bg-[#0F2537] rounded-lg hover:bg-[#16344D] cursor-pointer"
              >
                Submit to Atomic Approval Queue
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: ONBOARDING, PENDING APPROVAL & REJECTED GATES (`/onboarding`, `/pending-approval`, `/rejected`) */}
      {activeTab === 'onboarding-gates' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 1. Onboarding Track Selector (`/onboarding`) */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="text-xs font-mono text-[#108548]">Route: /onboarding</div>
            <h3 className="text-base font-bold text-[#0F2537]">
              Role &amp; Organization Onboarding
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Select an operational role track to bind the current session and complete onboarding.
            </p>
            <div className="space-y-2.5">
              {(
                [
                  {
                    role: 'enterprise_admin',
                    label: 'Enterprise R&D Organization Lead',
                    desc: 'Full Frontier benchmarking, Protected Project Rooms, and team seat governance.',
                  },
                  {
                    role: 'researcher',
                    label: 'University / Laboratory PI',
                    desc: 'Contribute condition-aware evidence and join Protected Project Rooms.',
                  },
                  {
                    role: 'startup_founder',
                    label: 'Deep-Tech Technology Provider',
                    desc: 'Position commercial hardware/process performance on the Qartinia Frontier.',
                  },
                ] as const
              ).map((track) => (
                <button
                  key={track.role}
                  type="button"
                  onClick={() => {
                    onUpdateProfile({ role: track.role, status: 'approved' });
                    showToast(`Completed onboarding as ${track.label}.`);
                  }}
                  className="w-full text-left p-3.5 rounded-lg border border-slate-200 hover:border-[#0F2537] bg-[#FAF9F6] transition-colors cursor-pointer"
                >
                  <div className="text-xs font-bold text-[#0F2537]">{track.label}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">{track.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Pending Approval Gate (`/pending-approval`) */}
          <div className="bg-[#FBF5EC] border border-[#E8D8C3] rounded-xl p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#C59B47] font-semibold">
                  Route: /pending-approval
                </span>
                <Clock className="w-4 h-4 text-[#C59B47]" />
              </div>
              <h3 className="text-base font-bold text-[#0F2537]">
                Enterprise Seat Verification Pending
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                When an employee joins an existing enterprise workspace domain, middleware holds their session at this gate until the Organization Admin or Platform Admin executes the atomic approval workflow.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onUpdateProfile({ status: 'approved' });
                showToast('Session approved and unlocked.');
              }}
              className="w-full py-2.5 text-xs font-semibold text-white bg-[#0F2537] rounded-lg hover:bg-[#16344D] cursor-pointer"
            >
              Simulate Admin Approval Unlock
            </button>
          </div>

          {/* 3. Rejected / Suspended Gate (`/rejected`) */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-red-700 font-semibold">
                  Route: /rejected
                </span>
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <h3 className="text-base font-bold text-[#0F2537]">
                Access Request Declined or Revoked
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Displayed when an organization administrator declines a seat request or revokes workspace permissions. Users can submit updated institutional credentials for re-evaluation.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onUpdateProfile({ status: 'pending_approval' });
                showToast('Re-submitted account for verification.');
              }}
              className="w-full py-2.5 text-xs font-semibold text-[#0F2537] border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Re-Submit for Seat Verification
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: ACCOUNT SETTINGS & AUDIT ACTIVITY STREAM (`/settings` & `/api/activity`) */}
      {activeTab === 'settings-audit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <form
              onSubmit={handleSaveSettings}
              className="bg-white border border-slate-200 rounded-xl p-6 space-y-4"
            >
              <div className="flex items-center gap-2 text-base font-bold text-[#0F2537]">
                <Settings className="w-4 h-4 text-[#108548]" />
                <span>Account &amp; Workspace Settings (/settings)</span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={settingsName}
                  onChange={(e) => setSettingsName(e.target.value)}
                  placeholder={currentUser?.fullName || 'Enter full name'}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                  Organization Name
                </label>
                <input
                  type="text"
                  value={settingsOrg}
                  onChange={(e) => setSettingsOrg(e.target.value)}
                  placeholder={currentUser?.organizationName || 'Enter organization name'}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={settingsDept}
                    onChange={(e) => setSettingsDept(e.target.value)}
                    placeholder={currentUser?.department || 'Department'}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={settingsTitle}
                    onChange={(e) => setSettingsTitle(e.target.value)}
                    placeholder={currentUser?.title || 'Title'}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 text-xs font-semibold text-white bg-[#0F2537] rounded-lg hover:bg-[#16344D] cursor-pointer"
              >
                Save Profile Settings
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 text-base font-bold text-[#0F2537]">
                <Activity className="w-4 h-4 text-[#108548]" />
                <span>Security &amp; Governance Audit Log (/api/activity)</span>
              </div>
              <span className="text-xs font-mono text-slate-500">
                {activityLog.length} Recorded Events
              </span>
            </div>

            {activityLog.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                No audit events recorded yet. Actions in Auth, Enterprise Seats, and Approvals are logged here in real time.
              </p>
            ) : (
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {activityLog.map((ev) => (
                  <div key={ev.id} className="py-2.5 first:pt-0 last:pb-0 text-xs flex items-start justify-between gap-4">
                    <div>
                      <strong className="text-[#0F2537]">{ev.actor}</strong>{' '}
                      <span className="text-slate-600">{ev.action}</span>{' '}
                      <strong className="text-[#108548]">{ev.target}</strong>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400 shrink-0">
                      {ev.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
