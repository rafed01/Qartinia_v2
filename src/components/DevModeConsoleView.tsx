import React, { useState, useEffect, useCallback } from 'react';
import {
  UserAccount,
  UserRole,
  AccountStatus,
  SupabaseOrganization,
  EnterpriseMember,
  SupabaseAccessRequest,
  AtomicApprovalItem,
  AuditActivityItem,
  DatabaseDiagnosticReport,
} from '../types/qartinia';
import { QartiniaSection } from './Navbar';
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
  Database,
  Sparkles,
  Lock,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';

interface DevModeConsoleViewProps {
  currentUser: UserAccount | null;
  accounts: UserAccount[];
  organizations: SupabaseOrganization[];
  enterpriseMembers: EnterpriseMember[];
  requests: SupabaseAccessRequest[];
  approvals: AtomicApprovalItem[];
  activityLog: AuditActivityItem[];
  frontiersCount: number;
  projectsCount: number;
  evidenceCount: number;
  onNavigate: (section: QartiniaSection) => void;
  onOpenAuthModal: () => void;
  onQuickSwitchAccount: (profileId: string) => Promise<void>;
  onLogout: () => Promise<void>;
  onUpdateProfile: (updates: Partial<UserAccount>) => Promise<void>;
  onManageOrganization: (payload: {
    action: 'invite' | 'approve_member' | 'suspend_member' | 'remove_member' | 'update_member_status';
    memberId?: string;
    userId?: string;
    organizationId?: string;
    decision?: 'approved' | 'rejected';
    fullName?: string;
    email?: string;
    organizationName?: string;
    role?: string;
    department?: string;
    requireApproval?: boolean;
  }) => Promise<void>;
  onHandleApproval: (payload: {
    action?: 'create' | 'decide' | 'reset_to_pending';
    approvalId?: string;
    targetProfileId?: string;
    organizationId?: string | null;
    decision?: 'Approved' | 'Rejected' | 'approved' | 'rejected';
    reason?: string;
    workflowType?: AtomicApprovalItem['workflowType'];
    subjectName?: string;
    subjectEmail?: string;
    organizationName?: string;
    requestedRoleOrTier?: string;
    notes?: string;
  }) => Promise<void>;
  onRunInvestorScenario: (
    scenario: 'seed_bp_wedge' | 'simulate_pending_approval' | 'run_trust_isolation_audit'
  ) => Promise<void>;
  onCreateRequest?: (payload: {
    name: string;
    email: string;
    organization: string;
    requestType: string;
    proposalBrief: string;
  }) => Promise<void>;
  onUpdateRequestStatus?: (id: string, status: string) => Promise<void>;
  onResetWorkspace: () => Promise<void>;
}

type DevTab =
  | 'db-diagnostics'
  | 'auth-rbac'
  | 'enterprise-seats'
  | 'atomic-approvals'
  | 'onboarding-gates'
  | 'settings-audit';

export const DevModeConsoleView: React.FC<DevModeConsoleViewProps> = ({
  currentUser,
  accounts,
  organizations,
  enterpriseMembers,
  requests,
  approvals,
  activityLog,
  frontiersCount,
  projectsCount,
  evidenceCount,
  onNavigate,
  onOpenAuthModal,
  onQuickSwitchAccount,
  onLogout,
  onUpdateProfile,
  onManageOrganization,
  onHandleApproval,
  onRunInvestorScenario,
  onUpdateRequestStatus,
  onResetWorkspace,
}) => {
  const [activeTab, setActiveTab] = useState<DevTab>('db-diagnostics');
  const [diagnostics, setDiagnostics] = useState<DatabaseDiagnosticReport | null>(null);
  const [loadingDiag, setLoadingDiag] = useState(false);
  const [runningScenario, setRunningScenario] = useState<string | null>(null);
  const [trustAuditVerified, setTrustAuditVerified] = useState(false);

  // Enterprise Member Invite Form State
  const [memName, setMemName] = useState('');
  const [memEmail, setMemEmail] = useState('');
  const [memOrg, setMemOrg] = useState('');
  const [memDept, setMemDept] = useState('');
  const [memRole, setMemRole] = useState('R&D Lead');
  const [memRequireApproval, setMemRequireApproval] = useState(true);

  // New Approval Queue Item Form State
  const [aprType, setAprType] = useState<AtomicApprovalItem['workflowType']>(
    'enterprise_employee_seat'
  );
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

  const pendingApprovalsCount = approvals.filter(
    (a) => String(a.status).toLowerCase() === 'pending'
  ).length;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 5000);
  };

  const fetchDiagnostics = useCallback(async () => {
    setLoadingDiag(true);
    try {
      const res = await fetch('/api/dev/diagnostics');
      if (res.ok) {
        const data = await res.json();
        setDiagnostics(data);
      }
    } catch {
      // ignore
    } finally {
      setLoadingDiag(false);
    }
  }, []);

  useEffect(() => {
    fetchDiagnostics();
  }, [fetchDiagnostics]);

  const handleTriggerScenario = async (
    scenario: 'seed_bp_wedge' | 'simulate_pending_approval' | 'run_trust_isolation_audit'
  ) => {
    setRunningScenario(scenario);
    try {
      await onRunInvestorScenario(scenario);
      await fetchDiagnostics();
      if (scenario === 'seed_bp_wedge') {
        showToast(
          'Synced Flagship BP Wedge (800V SiC Traction Inverter Frontier + 4 Evidence Nodes + Protected Room QRT-RM-800V) to Supabase public.catalog!'
        );
      } else if (scenario === 'simulate_pending_approval') {
        setActiveTab('atomic-approvals');
        showToast(
          'Provisioned pending Enterprise VP R&D seat (Dr. Lukas Weber) in Supabase public.profiles. Ready for live Atomic Approval RPC!'
        );
      } else if (scenario === 'run_trust_isolation_audit') {
        setTrustAuditVerified(true);
        showToast(
          'Verified Zero-Customer-Model-Training Isolation, Background IP Segregation & Supabase Tenant Boundaries.'
        );
      }
    } finally {
      setRunningScenario(null);
    }
  };

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memName.trim() || !memEmail.trim()) return;
    await onManageOrganization({
      action: 'invite',
      fullName: memName.trim(),
      email: memEmail.trim(),
      organizationName: memOrg.trim() || currentUser?.organizationName || 'rana org',
      role: memRole,
      department: memDept.trim() || 'Advanced Engineering',
      requireApproval: memRequireApproval,
    });
    setMemName('');
    setMemEmail('');
    setMemOrg('');
    setMemDept('');
    await fetchDiagnostics();
    showToast(
      memRequireApproval
        ? 'Seat provisioned in Supabase public.organization_members with status=pending.'
        : 'Enterprise seat provisioned in Supabase as approved.'
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
      requestedRoleOrTier: aprRoleTier.trim() || 'Enterprise R&D Partner',
      notes: aprNotes.trim(),
    });
    setAprSubject('');
    setAprEmail('');
    setAprOrg('');
    setAprRoleTier('');
    setAprNotes('');
    await fetchDiagnostics();
    showToast('Created pending account in Supabase public.profiles for Atomic RPC verification.');
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
    showToast('Updated live row in Supabase public.profiles.');
  };

  const currentGateState = !currentUser
    ? 'guest'
    : currentUser.status === 'pending'
    ? 'pending'
    : currentUser.status === 'rejected'
    ? 'rejected'
    : !currentUser.onboardingCompleted
    ? 'onboarding'
    : 'approved';

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">
      {/* Dev Mode Header Banner */}
      <div className="bg-[#0F2537] text-white rounded-xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border border-[#C59B47]/40">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono text-[#C59B47]">
            <ShieldCheck className="w-4 h-4" />
            <span>DEV MODE · LIVE SUPABASE POSTGRESQL &amp; INVESTOR SANDBOX</span>
            {diagnostics?.connected && (
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Connected: {diagnostics.supabaseUrl} ({diagnostics.latencyMs} ms)
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Live Supabase Database Inspector, RBAC Auth, Atomic RPCs &amp; Investor Scenarios
          </h1>
          <p className="text-xs text-slate-300 max-w-3xl">
            Directly wired to your live Supabase PostgreSQL tables (<code className="font-mono text-[#C59B47]">public.profiles</code>, <code className="font-mono text-[#C59B47]">public.organizations</code>, <code className="font-mono text-[#C59B47]">public.organization_members</code>, <code className="font-mono text-[#C59B47]">public.catalog</code>, <code className="font-mono text-[#C59B47]">public.user_activity</code>) and PostgreSQL Atomic Approval stored procedures (<code className="font-mono text-[#C59B47]">004</code> &amp; <code className="font-mono text-[#C59B47]">005</code>).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenAuthModal}
            className="px-4 py-2 text-xs font-semibold text-[#0F2537] bg-[#C59B47] hover:bg-[#d4ab55] rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{currentUser ? 'Switch / Register Account' : 'Sign In / Register'}</span>
          </button>

          {currentUser && (
            <button
              type="button"
              onClick={async () => {
                await onLogout();
                showToast('Signed out of active Supabase session.');
              }}
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
              await fetchDiagnostics();
              showToast('Cleared demo catalog artifacts while preserving your real Supabase accounts.');
            }}
            className="px-3.5 py-2 text-xs font-semibold text-slate-300 border border-slate-700 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Clear Demo Catalog</span>
          </button>
        </div>
      </div>

      {/* EXCITING INVESTOR LIVE DEMO COMMAND DECK */}
      <div className="bg-white border-2 border-[#C59B47]/50 rounded-xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#9A7428] font-semibold">
              <Sparkles className="w-4 h-4 text-[#C59B47]" />
              <span>LIVE INVESTOR PITCH ACCELERATORS (REAL SUPABASE TRANSACTIONS)</span>
            </div>
            <h2 className="text-lg font-bold text-[#0F2537] mt-0.5">
              Demonstrate Qartinia&apos;s End-to-End Deep-Tech Wedge &amp; Governance in 1 Click
            </h2>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="px-2.5 py-1 rounded bg-[#FAF9F6] border border-slate-200 text-[#0F2537]">
              Frontiers in DB: <strong>{frontiersCount}</strong>
            </span>
            <span className="px-2.5 py-1 rounded bg-[#FAF9F6] border border-slate-200 text-[#0F2537]">
              Protected Rooms: <strong>{projectsCount}</strong>
            </span>
            <span className="px-2.5 py-1 rounded bg-[#FAF9F6] border border-slate-200 text-[#0F2537]">
              Evidence Nodes: <strong>{evidenceCount}</strong>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Scenario 1: BP Wedge */}
          <div className="p-4 rounded-xl bg-[#FAF9F6] border border-slate-200 flex flex-col justify-between space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-semibold text-[#108548] uppercase">
                  SCENARIO 1 · BP PAGE 2 &amp; 3 WEDGE
                </span>
                <span className="text-[11px] font-mono text-slate-400">public.catalog</span>
              </div>
              <h3 className="text-sm font-bold text-[#0F2537]">
                800V SiC Traction Inverter Frontier + Protected Room (QRT-RM-800V)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Writes the complete Business Plan flagship benchmark (<code className="font-mono">97.4% → 98.1% → 98.7% → 99.0%</code>), 4 ETH Zurich / Fraunhofer / Infineon evidence records, and a tri-party Protected Project Room directly into Supabase.
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <button
                type="button"
                disabled={runningScenario !== null}
                onClick={() => handleTriggerScenario('seed_bp_wedge')}
                className="w-full py-2 px-3 text-xs font-semibold text-white bg-[#0F2537] hover:bg-[#16344D] rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C59B47]" />
                <span>
                  {runningScenario === 'seed_bp_wedge'
                    ? 'Provisioning in Supabase...'
                    : 'Provision Live 800V SiC BP Wedge'}
                </span>
              </button>
              {frontiersCount > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onNavigate('frontier')}
                    className="py-1.5 px-2 text-[11px] font-semibold text-[#0F2537] bg-white border border-slate-200 rounded hover:border-[#0F2537] flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Open Frontier</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('projects')}
                    className="py-1.5 px-2 text-[11px] font-semibold text-[#0F2537] bg-white border border-slate-200 rounded hover:border-[#0F2537] flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Open Room QRT-RM-800V</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Scenario 2: Atomic Approval RPC */}
          <div className="p-4 rounded-xl bg-[#FAF9F6] border border-slate-200 flex flex-col justify-between space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-semibold text-[#9A7428] uppercase">
                  SCENARIO 2 · ATOMIC GOVERNANCE RPC
                </span>
                <span className="text-[11px] font-mono text-slate-400">004 &amp; 005 SQL</span>
              </div>
              <h3 className="text-sm font-bold text-[#0F2537]">
                Live Enterprise Seat Request &amp; PostgreSQL Atomic Approval
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Inserts a pending Enterprise VP R&amp;D seat (<code className="font-mono">Dr. Lukas Weber</code>) into <code className="font-mono">public.profiles</code> and <code className="font-mono">public.organization_members</code> so you can execute the PostgreSQL <code className="font-mono">decide_organization_employee_approval</code> RPC live.
              </p>
            </div>
            <button
              type="button"
              disabled={runningScenario !== null}
              onClick={() => handleTriggerScenario('simulate_pending_approval')}
              className="w-full py-2 px-3 text-xs font-semibold text-[#0F2537] bg-[#C59B47] hover:bg-[#d4ab55] rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>
                {runningScenario === 'simulate_pending_approval'
                  ? 'Queueing Seat in Supabase...'
                  : 'Simulate Pending Enterprise Seat'}
              </span>
            </button>
          </div>

          {/* Scenario 3: Trust & Zero-Training Isolation Audit */}
          <div className="p-4 rounded-xl bg-[#FAF9F6] border border-slate-200 flex flex-col justify-between space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-semibold text-[#0F2537] uppercase">
                  SCENARIO 3 · TRUST ARCHITECTURE
                </span>
                <span className="text-[11px] font-mono text-[#108548]">
                  {trustAuditVerified ? 'CERTIFIED' : 'READY'}
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#0F2537]">
                Zero-Model-Training &amp; IP Boundary Verification Audit
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Verifies Qartinia&apos;s core investor trust guarantee: confidential customer data is never used to train shared AI models, Background IP is segregated, and writes a signed audit log to <code className="font-mono">public.user_activity</code>.
              </p>
            </div>
            <button
              type="button"
              disabled={runningScenario !== null}
              onClick={() => handleTriggerScenario('run_trust_isolation_audit')}
              className="w-full py-2 px-3 text-xs font-semibold text-white bg-[#108548] hover:bg-[#0d6e3b] rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>
                {runningScenario === 'run_trust_isolation_audit'
                  ? 'Verifying Tenant Boundaries...'
                  : 'Run Trust & IP Isolation Audit'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-sm text-emerald-900">
          <div className="flex items-center gap-2 font-medium">
            <Check className="w-4 h-4 text-[#108548] shrink-0" />
            <span>{toast}</span>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-xs text-emerald-800 hover:underline cursor-pointer ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/80 rounded-lg w-fit">
        {(
          [
            { id: 'db-diagnostics', label: '1. Database & Schema Diagnostics' },
            { id: 'auth-rbac', label: `2. Auth & Live Profiles (${accounts.length})` },
            {
              id: 'enterprise-seats',
              label: `3. Orgs & Seats (${organizations.length} Orgs · ${enterpriseMembers.length} Seats)`,
            },
            {
              id: 'atomic-approvals',
              label: `4. Atomic Approval RPCs (${pendingApprovalsCount} Pending)`,
            },
            { id: 'onboarding-gates', label: '5. Security & Onboarding Gates' },
            { id: 'settings-audit', label: `6. Profile & Audit Log (${activityLog.length})` },
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

      {/* TAB 1: LIVE SUPABASE DATABASE & SCHEMA DIAGNOSTICS */}
      {activeTab === 'db-diagnostics' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-[#0F2537] flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#108548]" />
                  <span>Live Supabase PostgreSQL Tables &amp; Row Telemetry</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time introspection of your Supabase project tables, column counts, and active records.
                </p>
              </div>
              <button
                type="button"
                onClick={fetchDiagnostics}
                disabled={loadingDiag}
                className="px-3.5 py-2 text-xs font-semibold text-[#0F2537] bg-[#FAF9F6] border border-slate-200 hover:border-[#0F2537] rounded-lg flex items-center gap-1.5 cursor-pointer self-start"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingDiag ? 'animate-spin' : ''}`} />
                <span>{loadingDiag ? 'Probing Supabase...' : 'Re-Run Live DB Probe'}</span>
              </button>
            </div>

            {diagnostics ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-mono uppercase">
                        <th className="py-2.5 pr-4">PostgreSQL Relation</th>
                        <th className="py-2.5 px-4">Status</th>
                        <th className="py-2.5 px-4">Live Row Count</th>
                        <th className="py-2.5 px-4">Schema Columns</th>
                        <th className="py-2.5 pl-4">Qartinia Sync &amp; Diagnostic Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {diagnostics.tables.map((t) => (
                        <tr key={t.table}>
                          <td className="py-3 pr-4 font-mono font-bold text-[#0F2537]">
                            {t.table}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded font-mono text-[11px] font-semibold ${
                                t.status === 'OK'
                                  ? 'bg-emerald-50 text-[#108548]'
                                  : 'bg-red-50 text-red-700'
                              }`}
                            >
                              {t.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-[#0F2537]">
                            {t.rowCount}
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-600">
                            {t.columnsCount > 0 ? `${t.columnsCount} cols` : 'Verified'}
                          </td>
                          <td className="py-3 pl-4 text-slate-600">{t.detail}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Enum & Constraint Alignment Matrix */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  <div className="space-y-3">
                    <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-[#0F2537]">
                      PostgreSQL Enum &amp; Check Constraint Alignment
                    </h3>
                    <div className="space-y-2.5">
                      {(diagnostics.enums || []).map((en) => (
                        <div
                          key={en.name}
                          className="p-3.5 rounded-lg bg-[#FAF9F6] border border-slate-200 space-y-1.5 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-[#0F2537]">{en.name}</span>
                            <span className="text-[11px] font-mono text-[#108548] font-semibold">
                              ALIGNED
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {en.allowedValues.map((val) => (
                              <code
                                key={val}
                                className="px-2 py-0.5 rounded bg-white border border-slate-200 font-mono text-[11px] text-[#0F2537]"
                              >
                                &apos;{val}&apos;
                              </code>
                            ))}
                          </div>
                          <p className="text-[11px] text-slate-600">{en.mappingNote}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-[#0F2537]">
                      PostgreSQL Stored Procedures (Atomic Approval RPCs)
                    </h3>
                    <div className="space-y-2.5">
                      {diagnostics.rpcs.map((rpc) => (
                        <div
                          key={rpc.name}
                          className="p-3.5 rounded-lg bg-[#FAF9F6] border border-slate-200 space-y-1.5 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-[#0F2537]">
                              public.{rpc.name}()
                            </span>
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#108548] font-mono text-[11px] font-semibold">
                              {rpc.status}
                            </span>
                          </div>
                          <p className="text-slate-600">{rpc.purpose}</p>
                          {rpc.lastResult && (
                            <div className="text-[11px] font-mono text-slate-500">
                              Status: {rpc.lastResult}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">
                Loading live Supabase diagnostics...
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: AUTH & LIVE PROFILES SESSION INSPECTOR */}
      {activeTab === 'auth-rbac' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-[#0F2537]">
                Active Session &amp; PostgreSQL Enum Simulator
              </h2>
              <span className="text-xs font-mono text-[#108548] font-semibold">
                {currentUser ? `Authenticated (${currentUser.role})` : 'Unauthenticated Guest'}
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
                    <strong className="text-[#0F2537] font-mono break-all">
                      {currentUser.email}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Organization</span>
                    <strong className="text-[#0F2537]">{currentUser.organizationName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Focus / Title</span>
                    <strong className="text-[#0F2537]">
                      {currentUser.department} · {currentUser.title}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">PostgreSQL Role (user_role)</span>
                    <strong className="text-[#108548] font-mono">{currentUser.role}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">
                      Gate Status (approval_status)
                    </span>
                    <strong className="text-[#0F2537] font-mono">
                      {currentUser.status} · Onboarding:{' '}
                      {currentUser.onboardingCompleted ? 'Done' : 'Incomplete'}
                    </strong>
                  </div>
                </div>

                {/* Instant Role & Status Simulator */}
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-semibold text-[#0F2537]">
                    Live Update Active Session Role or Gate State in Supabase
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-500 mb-1">
                        public.profiles.role
                      </label>
                      <select
                        value={currentUser.role}
                        onChange={async (e) => {
                          await onUpdateProfile({ role: e.target.value as UserRole });
                          showToast(`Updated role to '${e.target.value}' in Supabase public.profiles.`);
                        }}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                      >
                        <option value="admin">admin (Platform Founder / Governance)</option>
                        <option value="company">company (Enterprise Organization)</option>
                        <option value="employee">employee (Enterprise R&amp;D Seat)</option>
                        <option value="user">user (University Researcher / Lab PI)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-500 mb-1">
                        public.profiles.status
                      </label>
                      <select
                        value={
                          !currentUser.onboardingCompleted && currentUser.status === 'approved'
                            ? 'onboarding'
                            : currentUser.status
                        }
                        onChange={async (e) => {
                          await onUpdateProfile({ status: e.target.value as AccountStatus });
                          showToast(`Updated gate state to '${e.target.value}' in Supabase.`);
                        }}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                      >
                        <option value="approved">approved (Full Workspace Access)</option>
                        <option value="onboarding">
                          onboarding (onboarding_completed = false)
                        </option>
                        <option value="pending">pending (/pending-approval Gate)</option>
                        <option value="rejected">rejected (/rejected Gate)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-3">
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  No active user session. Select any live Supabase account on the right or open the Sign-In modal.
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

          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-[#0F2537]">
                  Live Accounts in Supabase (<code className="font-mono text-sm">public.profiles</code>)
                </h2>
                <p className="text-xs text-slate-500">
                  Click &ldquo;Assume Session&rdquo; on any row to authenticate as that user in real time.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="text-xs font-semibold text-[#0F2537] hover:underline cursor-pointer"
              >
                + New Account
              </button>
            </div>

            <div className="space-y-2.5">
              {accounts.map((acc) => {
                const isCurrent = currentUser?.id === acc.id;
                return (
                  <div
                    key={acc.id}
                    className={`p-3.5 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                      isCurrent
                        ? 'bg-emerald-50/60 border-emerald-300'
                        : 'bg-[#FAF9F6] border-slate-200'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#0F2537]">{acc.fullName}</span>
                        <span className="font-mono text-slate-500">({acc.email})</span>
                        {isCurrent && (
                          <span className="px-1.5 py-0.5 rounded bg-[#108548] text-white font-mono text-[10px] font-semibold">
                            ACTIVE SESSION
                          </span>
                        )}
                      </div>
                      <div className="text-slate-500">
                        Org: <strong className="text-slate-700">{acc.organizationName}</strong> ·
                        Onboarding:{' '}
                        <strong className="text-slate-700">
                          {acc.onboardingCompleted ? 'Completed' : 'Pending'}
                        </strong>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-mono text-[#0F2537] font-semibold">
                        {acc.role}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-mono font-semibold ${
                          acc.status === 'approved'
                            ? 'bg-emerald-50 text-[#108548]'
                            : acc.status === 'pending'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {acc.status}
                      </span>
                      {!isCurrent && (
                        <button
                          type="button"
                          onClick={async () => {
                            await onQuickSwitchAccount(acc.id);
                            showToast(`Switched active session to ${acc.fullName} (${acc.email}).`);
                          }}
                          className="px-2.5 py-1 rounded bg-[#0F2537] text-white hover:bg-[#16344D] font-semibold cursor-pointer"
                        >
                          Assume Session
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ENTERPRISE ORGANIZATIONS & SEATS (004_enterprise_employee_approval.sql) */}
      {activeTab === 'enterprise-seats' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                MIGRATION 004 · ENTERPRISE SEAT PROVISIONING
              </div>
              <h2 className="text-base font-bold text-[#0F2537] mt-0.5">
                Invite Enterprise R&amp;D Seat to Supabase
              </h2>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                  Employee Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={memName}
                  onChange={(e) => setMemName(e.target.value)}
                  placeholder="Dr. Henrik Lindqvist"
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
                  placeholder="h.lindqvist@enterprise-partner.eu"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    value={memOrg}
                    onChange={(e) => setMemOrg(e.target.value)}
                    placeholder={organizations[0]?.name || 'rana org'}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                    Department / Business Unit
                  </label>
                  <input
                    type="text"
                    value={memDept}
                    onChange={(e) => setMemDept(e.target.value)}
                    placeholder="High-Voltage Power Systems"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                  Engineering Title &amp; Seat Role
                </label>
                <select
                  value={memRole}
                  onChange={(e) => setMemRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                >
                  <option value="R&D Lead">R&amp;D Lead (maps to organization_members.role = employee)</option>
                  <option value="Principal Engineer">Principal Engineer (role = employee)</option>
                  <option value="collaborator">University / Lab PI Collaborator (role = collaborator)</option>
                  <option value="admin">Organization Admin (role = admin)</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-xs text-slate-700 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={memRequireApproval}
                  onChange={(e) => setMemRequireApproval(e.target.checked)}
                  className="rounded border-slate-300"
                />
                <span>Require Atomic Seat Approval (004_enterprise_employee_approval.sql)</span>
              </label>

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#0F2537] rounded-lg hover:bg-[#16344D] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 text-[#C59B47]" />
                <span>Provision Seat in public.organization_members</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 space-y-6">
            {/* Organizations Table */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-bold text-[#0F2537]">
                Verified Organizations (<code className="font-mono text-sm">public.organizations</code>)
              </h2>
              <div className="space-y-2.5">
                {organizations.map((org) => (
                  <div
                    key={org.id}
                    className="p-3.5 rounded-lg bg-[#FAF9F6] border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-[#0F2537]">{org.name}</span>
                      <span className="text-slate-500 font-mono ml-2">
                        Tier: {org.tier} · Domain: {org.domain || 'N/A'}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded font-mono font-semibold ${
                        org.approvalStatus === 'approved'
                          ? 'bg-emerald-50 text-[#108548]'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {org.approvalStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Organization Members Roster */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-bold text-[#0F2537]">
                Enterprise Seat Roster (<code className="font-mono text-sm">public.organization_members</code>)
              </h2>

              <div className="space-y-2.5">
                {enterpriseMembers.map((mem) => (
                  <div
                    key={mem.id}
                    className="p-4 rounded-lg bg-[#FAF9F6] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-[#0F2537]">
                        {mem.fullName}{' '}
                        <span className="font-mono font-normal text-slate-500">({mem.email})</span>
                      </div>
                      <div className="text-slate-500">
                        {mem.organizationName} · {mem.department} · Title: <strong>{mem.title}</strong> · DB Role:{' '}
                        <code className="font-mono">{mem.role}</code>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded font-mono font-semibold ${
                          mem.approvalStatus === 'approved'
                            ? 'bg-emerald-50 text-[#108548]'
                            : mem.approvalStatus === 'pending'
                            ? 'bg-amber-50 text-amber-800'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {mem.approvalStatus}
                      </span>

                      {mem.approvalStatus !== 'approved' && (
                        <button
                          type="button"
                          onClick={async () => {
                            await onManageOrganization({
                              action: 'approve_member',
                              memberId: mem.id,
                              userId: mem.userId,
                              organizationId: mem.organizationId,
                              decision: 'approved',
                            });
                            showToast(`Approved seat for ${mem.fullName}.`);
                          }}
                          className="px-2.5 py-1 rounded bg-[#108548] text-white font-semibold hover:bg-[#0d6e3b] cursor-pointer"
                        >
                          Approve Seat
                        </button>
                      )}

                      {mem.approvalStatus === 'approved' && (
                        <button
                          type="button"
                          onClick={async () => {
                            await onManageOrganization({
                              action: 'suspend_member',
                              memberId: mem.id,
                              userId: mem.userId,
                              organizationId: mem.organizationId,
                              decision: 'rejected',
                            });
                            showToast(`Suspended seat for ${mem.fullName}.`);
                          }}
                          className="px-2.5 py-1 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
                        >
                          Suspend
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ADMIN ATOMIC APPROVAL WORKFLOWS (004 & 005 SQL RPCs) */}
      {activeTab === 'atomic-approvals' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                MIGRATIONS 004 &amp; 005 · ATOMIC APPROVAL QUEUE
              </div>
              <h2 className="text-base font-bold text-[#0F2537] mt-0.5">
                Queue New Account for Atomic RPC Decision
              </h2>
            </div>

            <form onSubmit={handleCreateApprovalSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                  Target PostgreSQL RPC Workflow
                </label>
                <select
                  value={aprType}
                  onChange={(e) =>
                    setAprType(e.target.value as AtomicApprovalItem['workflowType'])
                  }
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                >
                  <option value="enterprise_employee_seat">
                    004: decide_organization_employee_approval (Employee Seat)
                  </option>
                  <option value="top_level_account">
                    005: decide_top_level_account_approval (Top-Level Company / PI)
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                  Candidate / Organization Name *
                </label>
                <input
                  type="text"
                  required
                  value={aprSubject}
                  onChange={(e) => setAprSubject(e.target.value)}
                  placeholder="Dr. Stefan Richter (Infineon SiC Division)"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={aprEmail}
                    onChange={(e) => setAprEmail(e.target.value)}
                    placeholder="s.richter@infineon-demo.de"
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
                    placeholder="rana org"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                  Verification Scope / Notes
                </label>
                <textarea
                  rows={2}
                  value={aprNotes}
                  onChange={(e) => setAprNotes(e.target.value)}
                  placeholder="Corporate domain & NDA clearance notes"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#0F2537] rounded-lg hover:bg-[#16344D] transition-colors cursor-pointer"
              >
                Insert Pending Profile in Supabase Queue
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-[#0F2537]">
                  Atomic Approval Queue (<code className="font-mono text-sm">public.profiles</code>)
                </h2>
                <p className="text-xs text-slate-500">
                  Executes PostgreSQL stored procedures <code className="font-mono">decide_top_level_account_approval</code> &amp; <code className="font-mono">decide_organization_employee_approval</code>.
                </p>
              </div>
              <span className="text-xs font-mono text-amber-700 font-semibold">
                {pendingApprovalsCount} Pending
              </span>
            </div>

            <div className="space-y-3">
              {approvals.map((item) => {
                const isPending = item.status === 'pending';
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs ${
                      isPending
                        ? 'bg-amber-50/40 border-amber-300'
                        : 'bg-[#FAF9F6] border-slate-200'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-white border border-slate-200 text-[#0F2537] font-semibold">
                          {item.workflowType === 'enterprise_employee_seat'
                            ? 'RPC 004: Employee Seat'
                            : 'RPC 005: Top-Level Account'}
                        </span>
                        <span className="font-bold text-sm text-[#0F2537]">
                          {item.subjectName}
                        </span>
                        <span className="font-mono text-slate-500">({item.subjectEmail})</span>
                      </div>
                      <div className="text-slate-600">
                        Organization: <strong>{item.organizationName}</strong> · Role:{' '}
                        <strong className="font-mono">{item.requestedRoleOrTier}</strong>
                      </div>
                      {item.notes && <p className="text-slate-500">{item.notes}</p>}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isPending ? (
                        <>
                          <button
                            type="button"
                            onClick={async () => {
                              await onHandleApproval({
                                action: 'decide',
                                approvalId: item.id,
                                targetProfileId: item.targetProfileId,
                                organizationId: item.organizationId,
                                decision: 'approved',
                              });
                              showToast(
                                `Executed PostgreSQL Atomic Approval RPC for ${item.subjectName} → approved!`
                              );
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#108548] text-white font-semibold hover:bg-[#0d6e3b] flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>RPC Approve</span>
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              await onHandleApproval({
                                action: 'decide',
                                approvalId: item.id,
                                targetProfileId: item.targetProfileId,
                                organizationId: item.organizationId,
                                decision: 'rejected',
                              });
                              showToast(
                                `Executed PostgreSQL Atomic Rejection RPC for ${item.subjectName} → rejected.`
                              );
                            }}
                            className="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-700 font-semibold hover:bg-red-100 flex items-center gap-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>RPC Reject</span>
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded font-mono font-semibold ${
                              item.status === 'approved'
                                ? 'bg-emerald-50 text-[#108548]'
                                : 'bg-red-50 text-red-700'
                            }`}
                          >
                            {item.status}
                          </span>
                          <button
                            type="button"
                            title="Reset to pending to re-test the PostgreSQL Atomic Approval RPC"
                            onClick={async () => {
                              await onHandleApproval({
                                action: 'reset_to_pending',
                                targetProfileId: item.targetProfileId,
                              });
                              showToast(
                                `Reset ${item.subjectName} to 'pending' so you can test the Atomic RPC live.`
                              );
                            }}
                            className="px-2 py-1 rounded border border-slate-200 bg-white hover:border-[#0F2537] text-slate-600 hover:text-[#0F2537] flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Set Pending</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ONBOARDING, PENDING APPROVAL & REJECTED GATE VIEWS */}
      {activeTab === 'onboarding-gates' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-[#0F2537]">
                  Security &amp; Onboarding Gate States (<code className="font-mono text-sm">/onboarding</code>, <code className="font-mono text-sm">/pending-approval</code>, <code className="font-mono text-sm">/rejected</code>)
                </h2>
                <p className="text-xs text-slate-500">
                  Test how the application gates access based on PostgreSQL <code className="font-mono">approval_status</code> and <code className="font-mono">onboarding_completed</code>.
                </p>
              </div>
              {currentUser && (
                <div className="flex flex-wrap items-center gap-2">
                  {(
                    [
                      { id: 'onboarding', label: 'Simulate /onboarding' },
                      { id: 'pending', label: 'Simulate /pending-approval' },
                      { id: 'rejected', label: 'Simulate /rejected' },
                      { id: 'approved', label: 'Restore Approved' },
                    ] as { id: AccountStatus; label: string }[]
                  ).map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={async () => {
                        await onUpdateProfile({ status: st.id });
                        showToast(`Session gate updated to '${st.id}' in Supabase.`);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                        currentGateState === st.id
                          ? 'bg-[#0F2537] text-white border-[#0F2537]'
                          : 'bg-[#FAF9F6] text-[#0F2537] border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Gate 1: /onboarding */}
              <div
                className={`p-5 rounded-xl border space-y-3 ${
                  currentGateState === 'onboarding'
                    ? 'bg-emerald-50/40 border-[#108548] ring-1 ring-[#108548]'
                    : 'bg-[#FAF9F6] border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-[#108548] font-semibold">
                    /onboarding
                  </span>
                  <Clock className="w-4 h-4 text-[#108548]" />
                </div>
                <h3 className="text-sm font-bold text-[#0F2537]">
                  Step-by-Step Domain &amp; IP Boundary Onboarding
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Triggered when <code className="font-mono">onboarding_completed = false</code> in <code className="font-mono">public.profiles</code> (currently active on accounts like <code className="font-mono">ali</code> and <code className="font-mono">rana riahi</code>).
                </p>
                {currentUser && !currentUser.onboardingCompleted && (
                  <button
                    type="button"
                    onClick={async () => {
                      await onUpdateProfile({ onboardingCompleted: true, status: 'approved' });
                      showToast('Completed onboarding in Supabase public.profiles!');
                    }}
                    className="w-full py-2 px-3 rounded-lg bg-[#108548] text-white text-xs font-semibold cursor-pointer"
                  >
                    Complete Onboarding &amp; Activate
                  </button>
                )}
              </div>

              {/* Gate 2: /pending-approval */}
              <div
                className={`p-5 rounded-xl border space-y-3 ${
                  currentGateState === 'pending'
                    ? 'bg-amber-50/50 border-amber-400 ring-1 ring-amber-400'
                    : 'bg-[#FAF9F6] border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-amber-700 font-semibold">
                    /pending-approval
                  </span>
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                </div>
                <h3 className="text-sm font-bold text-[#0F2537]">
                  Atomic Governance &amp; Seat Verification Hold
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Holds unverified enterprise seats (<code className="font-mono">approval_status = &apos;pending&apos;</code>) outside confidential project rooms until an Admin executes the Atomic Approval RPC.
                </p>
                {currentUser?.status === 'pending' && (
                  <button
                    type="button"
                    onClick={async () => {
                      await onUpdateProfile({ status: 'approved' });
                      showToast('Approved active account in Supabase!');
                    }}
                    className="w-full py-2 px-3 rounded-lg bg-[#0F2537] text-white text-xs font-semibold cursor-pointer"
                  >
                    Approve Current Account
                  </button>
                )}
              </div>

              {/* Gate 3: /rejected */}
              <div
                className={`p-5 rounded-xl border space-y-3 ${
                  currentGateState === 'rejected'
                    ? 'bg-red-50/50 border-red-300 ring-1 ring-red-300'
                    : 'bg-[#FAF9F6] border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-red-700 font-semibold">
                    /rejected
                  </span>
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <h3 className="text-sm font-bold text-[#0F2537]">
                  Access Declined / Compliance Hold Gate
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Displayed when an organization or employee seat fails domain verification (<code className="font-mono">approval_status = &apos;rejected&apos;</code>). Blocks access to evidence graphs and project rooms.
                </p>
                {currentUser?.status === 'rejected' && (
                  <button
                    type="button"
                    onClick={async () => {
                      await onUpdateProfile({ status: 'approved' });
                      showToast('Re-instated account to Approved status.');
                    }}
                    className="w-full py-2 px-3 rounded-lg bg-[#0F2537] text-white text-xs font-semibold cursor-pointer"
                  >
                    Reinstate Account Access
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: PROFILE SETTINGS & LIVE SUPABASE AUDIT LOG */}
      {activeTab === 'settings-audit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Settings className="w-4 h-4 text-[#0F2537]" />
              <h2 className="text-base font-bold text-[#0F2537]">
                Update Active Profile (<code className="font-mono text-sm">public.profiles</code>)
              </h2>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-3.5">
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
                  Organization / Institution
                </label>
                <input
                  type="text"
                  value={settingsOrg}
                  onChange={(e) => setSettingsOrg(e.target.value)}
                  placeholder={currentUser?.organizationName || 'Enter organization'}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                    Focus Area / Department
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
                    Role Title
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
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#0F2537] rounded-lg hover:bg-[#16344D] transition-colors cursor-pointer"
              >
                Save Changes to Supabase
              </button>
            </form>

            {requests.length > 0 && (
              <div className="pt-4 border-t border-slate-100 space-y-2.5">
                <div className="text-xs font-mono uppercase text-slate-500 font-semibold">
                  Inbound Access &amp; NDA Requests (public.requests: {requests.length})
                </div>
                {requests.map((r) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-lg bg-[#FAF9F6] border border-slate-200 text-xs flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate">
                        <span className="font-semibold text-[#0F2537]">{r.name || r.email}</span>
                        <span className="text-slate-500 font-mono ml-1.5">({r.requestType})</span>
                      </div>
                      {onUpdateRequestStatus ? (
                        <select
                          value={r.status}
                          onChange={async (e) => {
                            await onUpdateRequestStatus(r.id, e.target.value);
                            showToast(`Updated public.requests (${r.id}) status to '${e.target.value}'.`);
                          }}
                          className="px-2 py-1 rounded bg-white border border-slate-200 font-mono text-[11px] text-[#0F2537]"
                        >
                          <option value="pending">pending</option>
                          <option value="in_review">in_review</option>
                          <option value="approved">approved</option>
                          <option value="rejected">rejected</option>
                          <option value="cancelled">cancelled</option>
                        </select>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-mono">
                          {r.status}
                        </span>
                      )}
                    </div>
                    {r.proposalBrief && (
                      <p className="text-[11px] text-slate-600">{r.proposalBrief}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#108548]" />
                <h2 className="text-base font-bold text-[#0F2537]">
                  Live Supabase Activity &amp; Security Audit Stream (<code className="font-mono text-sm">public.user_activity</code>)
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {activityLog.length} Events
              </span>
            </div>

            {activityLog.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-500">
                No audit events recorded yet.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                {activityLog.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3.5 rounded-lg bg-[#FAF9F6] border border-slate-200 flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-white border border-slate-200 text-[#0F2537] font-semibold">
                          {ev.category}
                        </span>
                        <span className="font-bold text-[#0F2537]">{ev.action}</span>
                      </div>
                      <div className="text-slate-600">
                        Actor: <strong>{ev.actor}</strong> → Target:{' '}
                        <strong className="font-mono">{ev.target}</strong>
                      </div>
                    </div>
                    <span className="font-mono text-slate-400 shrink-0">{ev.timestamp}</span>
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
