import React, { useState, useMemo } from 'react';
import {
  QartiniaSection,
  UserAccount,
  ProtectedProjectRoom,
  FrontierBenchmark,
  SupabaseAccessRequest,
  CatalogBookmark,
  SupplierItem,
  LabItem,
  ExpertItem,
  SimulationJob,
  EnterpriseMember,
} from '../types/qartinia';
import { getUserPermissions } from '../utils/permissions';
import {
  Compass,
  Lock,
  Cpu,
  FlaskConical,
  GraduationCap,
  Activity,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sparkles,
  ChevronRight,
  Building,
  User,
  Settings,
  Check,
  X,
  MessageSquare,
  ShieldCheck,
  Send,
  Users,
  ShieldAlert,
  UserPlus,
  Edit2,
  Trash2,
  KeyRound,
  Shield,
  Search,
  Filter,
  RefreshCw,
  Mail,
  Briefcase,
  Layers,
} from 'lucide-react';
import { QartiniaCrestSvg } from './QartiniaLogo';
import { ExecutiveInsightsView } from './ExecutiveInsightsView';
import { InviteMemberModal } from './InviteMemberModal';
import { InvitationsTable } from './InvitationsTable';
import { BarChart3, Inbox } from 'lucide-react';

const ALL_PERMISSION_KEYS = [
  {
    key: 'approve_requests',
    label: 'Approve & Decline Requests',
    desc: 'Authority to approve or decline fab samples, test benches, and expert reviews.',
  },
  {
    key: 'delete_projects',
    label: 'Delete Protected Projects',
    desc: 'Authority to permanently terminate project rooms and linked NDA agreements.',
  },
  {
    key: 'edit_frontier',
    label: 'Edit Frontier Benchmarks',
    desc: 'Authority to modify condition parameters, performance metrics, and target envelopes.',
  },
  {
    key: 'invite_members',
    label: 'Invite Organization Members',
    desc: 'Authority to invite new engineers and allocate enterprise seats.',
  },
  {
    key: 'manage_organization',
    label: 'Manage Organization & Roles',
    desc: 'Authority to change member roles (owner, admin, employee) and security policies.',
  },
  {
    key: 'manage_projects',
    label: 'Create & Manage Projects',
    desc: 'Authority to create project rooms, advance legal stages, and upload documents.',
  },
];

interface UserDashboardViewProps {
  currentUser: UserAccount | null;
  accounts: UserAccount[];
  projects: ProtectedProjectRoom[];
  frontiers: FrontierBenchmark[];
  requests: SupabaseAccessRequest[];
  bookmarks: CatalogBookmark[];
  suppliers: SupplierItem[];
  labs: LabItem[];
  experts: ExpertItem[];
  simulations: SimulationJob[];
  enterpriseMembers?: EnterpriseMember[];
  onNavigate: (section: QartiniaSection) => void;
  onSelectProject: (projectId: string) => void;
  onSelectFrontier: (frontierId: string) => void;
  onOpenAuthModal: () => void;
  onOpenProfileModal?: () => void;
  onQuickSwitchAccount?: (profileId: string) => Promise<void>;
  onUpdateRequestStatus?: (
    requestId: string,
    status: string,
    decisionNotes?: string
  ) => Promise<void>;
  onDeleteRequest?: (id: string) => Promise<void>;
  onInviteMember?: (payload: {
    organizationId?: string;
    organizationName?: string;
    fullName: string;
    email: string;
    role: string;
    title?: string;
    department?: string;
    permissions?: string[];
  }) => Promise<void>;
  onUpdateMember?: (id: string, updates: Partial<EnterpriseMember>) => Promise<void>;
  onDeleteMember?: (id: string) => Promise<void>;
}

export const UserDashboardView: React.FC<UserDashboardViewProps> = ({
  currentUser,
  accounts,
  projects,
  frontiers,
  requests,
  bookmarks: _bookmarks,
  suppliers: _suppliers,
  labs: _labs,
  experts,
  simulations,
  enterpriseMembers = [],
  onNavigate,
  onSelectProject,
  onSelectFrontier,
  onOpenAuthModal,
  onOpenProfileModal,
  onQuickSwitchAccount,
  onUpdateRequestStatus,
  onDeleteRequest,
  onInviteMember,
  onUpdateMember,
  onDeleteMember,
}) => {
  const [dashboardTab, setDashboardTab] = useState<'overview' | 'organization' | 'insights'>('overview');
  const [requestFilter, setRequestFilter] = useState<
    'all' | 'my' | 'pending' | 'approved' | 'rejected'
  >('all');
  const [activeDecisionNoteId, setActiveDecisionNoteId] = useState<string | null>(null);
  const [decisionNoteInput, setDecisionNoteInput] = useState('');
  const [updatingReqId, setUpdatingReqId] = useState<string | null>(null);
  const [projectScope, setProjectScope] = useState<'my' | 'all'>('my');

  // Organization Management State
  const [memberRoleFilter, setMemberRoleFilter] = useState<'all' | 'owner' | 'admin' | 'employee'>('all');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isEditMemberModalOpen, setIsEditMemberModalOpen] = useState(false);
  const [selectedMemberToEdit, setSelectedMemberToEdit] = useState<EnterpriseMember | null>(null);

  // Invite Form State
  const [inviteMode, setInviteMode] = useState<'search' | 'manual'>('search');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedUserForInvite, setSelectedUserForInvite] = useState<UserAccount | null>(null);
  const [inviteFullName, setInviteFullName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'owner' | 'admin' | 'employee'>('employee');
  const [inviteDepartment, setInviteDepartment] = useState('Power & Sensor Systems');
  const [inviteTitle, setInviteTitle] = useState('Member of Technical Staff');
  const [invitePermissions, setInvitePermissions] = useState<string[]>(['manage_projects']);
  const [isSubmittingInvite, setIsSubmittingInvite] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  // Edit Member Form State
  const [editMemberRole, setEditMemberRole] = useState<'owner' | 'admin' | 'employee'>('employee');
  const [editMemberTitle, setEditMemberTitle] = useState('');
  const [editMemberDepartment, setEditMemberDepartment] = useState('');
  const [editMemberPermissions, setEditMemberPermissions] = useState<string[]>([]);
  const [isSavingMemberEdit, setIsSavingMemberEdit] = useState(false);
  const [memberActionNotice, setMemberActionNotice] = useState<string | null>(null);

  const currentEmail = currentUser?.email?.toLowerCase() || '';
  const currentName = currentUser?.fullName?.toLowerCase() || '';
  const currentOrg = currentUser?.organizationName?.toLowerCase() || '';
  const permissions = getUserPermissions(currentUser);
  const isAdmin = permissions.isAdmin;

  // 1. User-specific Protected Projects filtering
  const userProjects = useMemo(() => {
    if (!currentUser) return projects;
    return projects.filter((p) => {
      if (p.createdById && p.createdById === currentUser.id) return true;
      if (p.createdByEmail && p.createdByEmail.toLowerCase() === currentEmail) return true;
      if (p.createdByOrg && p.createdByOrg.toLowerCase() === currentOrg && currentOrg !== 'independent') return true;

      return p.participants?.some(
        (part) =>
          part.name.toLowerCase().includes(currentName) ||
          (currentUser.fullName && part.name.toLowerCase().includes(currentUser.fullName.toLowerCase())) ||
          (part.organization && part.organization.toLowerCase() === currentOrg && currentOrg !== 'independent')
      );
    });
  }, [projects, currentUser, currentEmail, currentName, currentOrg]);

  const displayedProjects = isAdmin && projectScope === 'all' ? projects : userProjects.length > 0 ? userProjects : projects;

  // 2. User-specific Requests filtering
  const myRequests = useMemo(() => {
    if (!currentUser) return requests;
    return requests.filter(
      (r) =>
        r.email?.toLowerCase() === currentEmail ||
        r.name?.toLowerCase().includes(currentName) ||
        (r.organization && r.organization.toLowerCase() === currentOrg && currentOrg !== 'independent')
    );
  }, [requests, currentUser, currentEmail, currentName, currentOrg]);

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (requestFilter === 'my') {
        return (
          r.email?.toLowerCase() === currentEmail ||
          r.name?.toLowerCase().includes(currentName) ||
          (r.organization && r.organization.toLowerCase() === currentOrg && currentOrg !== 'independent')
        );
      }
      if (requestFilter === 'pending') {
        return String(r.status).toLowerCase() === 'pending' || String(r.status).toLowerCase() === 'in_review';
      }
      if (requestFilter === 'approved') {
        return String(r.status).toLowerCase() === 'approved';
      }
      if (requestFilter === 'rejected') {
        return String(r.status).toLowerCase() === 'rejected';
      }
      return true;
    });
  }, [requests, requestFilter, currentEmail, currentName, currentOrg]);

  // 3. Organization Members filtering
  const filteredMembers = useMemo(() => {
    return enterpriseMembers.filter((m) => {
      if (memberRoleFilter !== 'all' && m.role !== memberRoleFilter) return false;
      if (memberSearchQuery.trim()) {
        const query = memberSearchQuery.toLowerCase();
        const matchName = m.fullName.toLowerCase().includes(query);
        const matchEmail = m.email.toLowerCase().includes(query);
        const matchOrg = m.organizationName.toLowerCase().includes(query);
        const matchDept = m.department.toLowerCase().includes(query);
        const matchTitle = m.title.toLowerCase().includes(query);
        return matchName || matchEmail || matchOrg || matchDept || matchTitle;
      }
      return true;
    });
  }, [enterpriseMembers, memberRoleFilter, memberSearchQuery]);

  const membersByRoleCount = useMemo(() => {
    const counts = { owner: 0, admin: 0, employee: 0, total: enterpriseMembers.length };
    enterpriseMembers.forEach((m) => {
      if (m.role === 'owner') counts.owner++;
      else if (m.role === 'admin') counts.admin++;
      else counts.employee++;
    });
    return counts;
  }, [enterpriseMembers]);

  const userName = currentUser?.fullName || (currentUser?.email ? currentUser.email.split('@')[0] : 'Engineer');
  const userOrg = currentUser?.organizationName || 'Deep-Tech Engineering Group';
  const userTitle = currentUser?.title || (currentUser?.role ? `${currentUser.role.toUpperCase()} Member` : 'Technical Member');

  const myInvitations = useMemo(() => {
    if (!currentUser) return [];
    const email = currentUser.email.toLowerCase();
    return enterpriseMembers.filter(
      (m) => m.email.toLowerCase() === email && m.status === 'invited'
    );
  }, [enterpriseMembers, currentUser]);

  const myActiveMemberships = useMemo(() => {
    if (!currentUser) return [];
    const email = currentUser.email.toLowerCase();
    return enterpriseMembers.filter(
      (m) => m.email.toLowerCase() === email && m.status === 'active'
    );
  }, [enterpriseMembers, currentUser]);

  const pendingRequestsCount = requests.filter(
    (r) => String(r.status).toLowerCase() === 'pending' || String(r.status).toLowerCase() === 'in_review'
  ).length;

  const handleDecision = async (requestId: string, status: string, notes?: string) => {
    if (!onUpdateRequestStatus) return;
    setUpdatingReqId(requestId);
    try {
      await onUpdateRequestStatus(requestId, status, notes);
      setActiveDecisionNoteId(null);
      setDecisionNoteInput('');
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingReqId(null);
    }
  };

  // 4. Registered Platform Users search filtering for invitation
  const searchableUsers = useMemo(() => {
    if (!accounts || accounts.length === 0) return [];
    return accounts.filter((acc) => {
      if (userSearchQuery.trim()) {
        const q = userSearchQuery.toLowerCase().trim().replace(/^@/, '');
        const derivedUsername = (acc.username || acc.email.split('@')[0]).toLowerCase();
        const matchName = acc.fullName?.toLowerCase().includes(q);
        const matchEmail = acc.email?.toLowerCase().includes(q);
        const matchUsername = derivedUsername.includes(q);
        const matchOrg = acc.organizationName?.toLowerCase().includes(q);
        const matchRole = acc.role?.toLowerCase().includes(q);
        return matchName || matchEmail || matchUsername || matchOrg || matchRole;
      }
      return true;
    });
  }, [accounts, userSearchQuery]);

  const handleOpenInviteModal = () => {
    setInviteMode('search');
    setUserSearchQuery('');
    setSelectedUserForInvite(null);
    setInviteFullName('');
    setInviteEmail('');
    setInviteRole('employee');
    setInviteDepartment('Power Electronics & Inverter Systems');
    setInviteTitle('Senior Inverter Design Specialist');
    setInvitePermissions(['manage_projects']);
    setInviteError(null);
    setIsInviteModalOpen(true);
  };

  const handleSelectUserForInvite = (user: UserAccount) => {
    setSelectedUserForInvite(user);
    const fullName = user.fullName || user.email.split('@')[0];
    setInviteFullName(fullName);
    setInviteEmail(user.email);
    setInviteTitle(user.title || `${user.role ? user.role.toUpperCase() : 'Technical'} Specialist`);
    setInviteDepartment(user.department || user.organizationName || 'R&D Engineering');
  };

  const handleToggleInvitePermission = (key: string) => {
    setInvitePermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const handleSubmitInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteFullName.trim() || !inviteEmail.trim() || !onInviteMember) return;
    setIsSubmittingInvite(true);
    setInviteError(null);
    try {
      await onInviteMember({
        fullName: inviteFullName.trim(),
        email: inviteEmail.trim(),
        role: inviteRole,
        department: inviteDepartment.trim(),
        title: inviteTitle.trim(),
        permissions: invitePermissions,
        organizationName: currentUser?.organizationName || 'Qartinia Deep-Tech',
        organizationId: currentUser?.organizationId || 'org-qartinia-tech',
      });
      setIsInviteModalOpen(false);
      setMemberActionNotice(`Invitation successfully sent to ${inviteFullName.trim()} (${inviteRole.toUpperCase()}).`);
      setTimeout(() => setMemberActionNotice(null), 5000);
    } catch (err: any) {
      setInviteError(err.message || 'Failed to dispatch member invitation.');
    } finally {
      setIsSubmittingInvite(false);
    }
  };

  const handleOpenEditMemberModal = (member: EnterpriseMember) => {
    setSelectedMemberToEdit(member);
    setEditMemberRole((member.role as 'owner' | 'admin' | 'employee') || 'employee');
    setEditMemberTitle(member.title || '');
    setEditMemberDepartment(member.department || '');
    setEditMemberPermissions(
      member.permissions || (member.role === 'owner' || member.role === 'admin' ? ['manage_organization', 'invite_members', 'approve_requests', 'delete_projects', 'edit_frontier', 'manage_projects'] : ['manage_projects'])
    );
    setIsEditMemberModalOpen(true);
  };

  const handleToggleEditPermission = (key: string) => {
    setEditMemberPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const handleSaveMemberEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberToEdit || !onUpdateMember) return;
    setIsSavingMemberEdit(true);
    try {
      await onUpdateMember(selectedMemberToEdit.id, {
        role: editMemberRole,
        title: editMemberTitle.trim(),
        department: editMemberDepartment.trim(),
        permissions: editMemberPermissions,
      });
      setIsEditMemberModalOpen(false);
      setMemberActionNotice(`Permissions and role updated for ${selectedMemberToEdit.fullName}.`);
      setTimeout(() => setMemberActionNotice(null), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingMemberEdit(false);
    }
  };

  const handleRemoveMember = async (member: EnterpriseMember) => {
    if (!onDeleteMember) return;
    const confirm = window.confirm(
      `Are you sure you want to remove ${member.fullName} (${member.role.toUpperCase()}) from ${member.organizationName}?`
    );
    if (!confirm) return;
    try {
      await onDeleteMember(member.id);
      setMemberActionNotice(`${member.fullName} was removed from the organization.`);
      setTimeout(() => setMemberActionNotice(null), 5000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* 1. Welcome & Profile Summary Strip */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#108548]">
              <span className="w-2 h-2 rounded-full bg-[#108548] animate-pulse" />
              <span>Active Workspace Session</span>
              <span className="text-slate-400">·</span>
              <span className="px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold bg-[#FAF9F6] border border-slate-200 text-[#0F2537]">
                Role: {currentUser?.role || 'Guest'}
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500 font-medium">{permissions.roleLabel}</span>
            </div>
            <h1 className="font-brand text-2xl sm:text-3xl font-bold text-[#0F2537]">
              Welcome back, {userName}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1 text-[#0F2537] font-medium">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>{userOrg}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>{userTitle}</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-600 font-mono">
                {currentUser?.email || 'Unregistered Guest Session'}
              </span>
              {currentUser?.focusArea && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#108548] font-medium">Focus: {currentUser.focusArea}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {currentUser && onOpenProfileModal && (
              <button
                type="button"
                onClick={onOpenProfileModal}
                className="px-3.5 py-2 bg-white text-[#0F2537] border border-slate-200 hover:border-slate-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Settings className="w-3.5 h-3.5 text-slate-500" />
                <span>Edit Profile</span>
              </button>
            )}

            {!currentUser && (
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="px-4 py-2 bg-[#0F2537] text-white text-xs font-semibold rounded-lg hover:bg-[#16344D] transition-colors cursor-pointer"
              >
                Sign In / Register Account
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigate('frontier')}
              className="px-4 py-2 bg-[#0F2537] text-white text-xs font-semibold rounded-lg hover:bg-[#16344D] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C59B47]" />
              <span>Evaluate Frontier</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('projects')}
              className="px-4 py-2 bg-white text-[#0F2537] border border-slate-200 hover:border-slate-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-[#108548]" />
              <span>Protected Rooms</span>
            </button>
          </div>
        </div>

        {/* Multi-User Persona Switcher Strip */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <Users className="w-4 h-4 text-[#108548]" />
            <span className="font-semibold text-[#0F2537]">Switch Testing Persona:</span>
            <span className="text-slate-400 hidden sm:inline">(Simulate Admin vs Employee permissions in real time)</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {accounts.slice(0, 6).map((acc) => {
              const isSelected = acc.id === currentUser?.id || acc.email === currentUser?.email;
              const accIsAdmin = acc.role === 'admin' || acc.role === 'platform_admin' || acc.role === 'owner';
              return (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => onQuickSwitchAccount && onQuickSwitchAccount(acc.id)}
                  className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#0F2537] text-white font-bold shadow-xs'
                      : 'bg-[#FAF9F6] text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                  title={`${acc.fullName} (${acc.role}) · ${acc.organizationName}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[#108548]' : 'bg-slate-400'}`} />
                  <span className="truncate max-w-[110px]">{acc.fullName || acc.email.split('@')[0]}</span>
                  <span className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold ${accIsAdmin ? 'bg-amber-100/30 text-amber-300' : 'opacity-60'}`}>
                    {acc.role}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Workspace Quick Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div
            onClick={() => onNavigate('projects')}
            className="p-3.5 rounded-lg bg-[#FAF9F6] border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors"
          >
            <span className="text-[11px] font-mono text-slate-500 uppercase block">
              My Protected Rooms
            </span>
            <strong className="text-xl font-mono text-[#0F2537] block mt-0.5">
              {userProjects.length}
            </strong>
            <span className="text-[11px] text-[#108548] font-medium flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3" />
              <span>{isAdmin ? `Admin (${projects.length} Total)` : 'Authorized Access'}</span>
            </span>
          </div>

          <div
            onClick={() => onNavigate('frontier')}
            className="p-3.5 rounded-lg bg-[#FAF9F6] border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors"
          >
            <span className="text-[11px] font-mono text-slate-500 uppercase block">
              Monitored Frontiers
            </span>
            <strong className="text-xl font-mono text-[#0F2537] block mt-0.5">
              {frontiers.length}
            </strong>
            <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
              Condition Benchmarks
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#FAF9F6] border border-slate-200">
            <span className="text-[11px] font-mono text-slate-500 uppercase block">
              Active Requests
            </span>
            <strong className="text-xl font-mono text-[#0F2537] block mt-0.5">
              {requests.length}
            </strong>
            <span className="text-[11px] text-amber-700 font-medium mt-0.5 block">
              {pendingRequestsCount} Pending Action
            </span>
          </div>

          <div
            onClick={() => setDashboardTab('organization')}
            className="p-3.5 rounded-lg bg-[#FAF9F6] border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors"
          >
            <span className="text-[11px] font-mono text-slate-500 uppercase block">
              Organization Members
            </span>
            <strong className="text-xl font-mono text-[#0F2537] block mt-0.5">
              {enterpriseMembers.length}
            </strong>
            <span className="text-[11px] text-[#108548] font-medium flex items-center gap-1 mt-0.5">
              <Users className="w-3 h-3" />
              <span>{membersByRoleCount.admin + membersByRoleCount.owner} Admins / {membersByRoleCount.employee} Staff</span>
            </span>
          </div>
        </div>
      </section>

      {/* Notification / Action Notice Alert Banner */}
      {memberActionNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{memberActionNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setMemberActionNotice(null)}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Top-Level Dashboard Tabs: Workspace Overview vs Organization Management vs Executive Insights */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-0">
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
          <button
            type="button"
            onClick={() => setDashboardTab('overview')}
            className={`pb-3 px-1 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              dashboardTab === 'overview'
                ? 'border-[#108548] text-[#0F2537]'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Workspace Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setDashboardTab('organization')}
            className={`pb-3 px-1 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              dashboardTab === 'organization'
                ? 'border-[#108548] text-[#0F2537]'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Organization Management</span>
            <span className="px-1.5 py-0.2 rounded-full font-mono text-[10px] bg-slate-100 text-slate-700 border border-slate-200 font-bold">
              {enterpriseMembers.length}
            </span>
            {myInvitations.length > 0 && (
              <span className="px-2 py-0.5 rounded-full font-mono text-[9px] font-bold bg-amber-500 text-white animate-pulse">
                {myInvitations.length} INVITATION{myInvitations.length > 1 ? 'S' : ''}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setDashboardTab('insights')}
            className={`pb-3 px-1 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              dashboardTab === 'insights'
                ? 'border-[#108548] text-[#0F2537]'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-[#108548]" />
            <span>Executive Insights</span>
            <span className="px-1.5 py-0.2 rounded font-mono text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold uppercase">
              Recharts
            </span>
          </button>
        </div>

        {dashboardTab === 'organization' && permissions.canManageOrganization && onInviteMember && (
          <button
            type="button"
            onClick={handleOpenInviteModal}
            className="mb-2 px-3.5 py-1.5 bg-[#108548] text-white text-xs font-semibold rounded-lg hover:bg-[#0c6b39] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Invite New Member</span>
          </button>
        )}
      </div>

      {/* 3. TAB 1: WORKSPACE OVERVIEW */}
      {dashboardTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          {/* My Corporate Invitations & Seat Allocations Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#108548] flex items-center gap-1.5">
                <Building className="w-4 h-4 text-[#108548]" />
                <span>My Corporate Seats &amp; Invitations</span>
              </h2>
              {myInvitations.length > 0 && (
                <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                  {myInvitations.length} Pending Invitation{myInvitations.length > 1 ? 's' : ''}
                </span>
              )}
            </div>

            <InvitationsTable
              currentUser={currentUser}
              enterpriseMembers={enterpriseMembers}
              onStateUpdate={async () => {
                if (onUpdateMember) {
                  await onUpdateMember('refresh', {});
                }
              }}
            />
          </section>

          {/* Action Launchpad */}
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#108548]">
              Action Launchpad
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <button
                type="button"
                onClick={() => onNavigate('frontier')}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-left transition-colors flex flex-col justify-between group cursor-pointer"
              >
                <Compass className="w-5 h-5 text-[#108548] mb-2" />
                <div>
                  <span className="text-xs font-bold text-[#0F2537] block group-hover:text-[#108548] transition-colors">
                    Evaluate Frontier
                  </span>
                  <span className="text-[11px] text-slate-500">Benchmark tech gaps</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('projects')}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-left transition-colors flex flex-col justify-between group cursor-pointer"
              >
                <Lock className="w-5 h-5 text-[#0F2537] mb-2" />
                <div>
                  <span className="text-xs font-bold text-[#0F2537] block group-hover:text-[#108548] transition-colors">
                    Project Rooms
                  </span>
                  <span className="text-[11px] text-slate-500">NDA &amp; execution</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('suppliers')}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-left transition-colors flex flex-col justify-between group cursor-pointer"
              >
                <Cpu className="w-5 h-5 text-[#C59B47] mb-2" />
                <div>
                  <span className="text-xs font-bold text-[#0F2537] block group-hover:text-[#108548] transition-colors">
                    Order Samples
                  </span>
                  <span className="text-[11px] text-slate-500">Direct fab procurement</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('laboratories')}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-left transition-colors flex flex-col justify-between group cursor-pointer"
              >
                <FlaskConical className="w-5 h-5 text-[#108548] mb-2" />
                <div>
                  <span className="text-xs font-bold text-[#0F2537] block group-hover:text-[#108548] transition-colors">
                    Book Test Bench
                  </span>
                  <span className="text-[11px] text-slate-500">Dyno &amp; EMI chambers</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('experts')}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-left transition-colors flex flex-col justify-between group cursor-pointer"
              >
                <GraduationCap className="w-5 h-5 text-[#0F2537] mb-2" />
                <div>
                  <span className="text-xs font-bold text-[#0F2537] block group-hover:text-[#108548] transition-colors">
                    Consult Experts
                  </span>
                  <span className="text-[11px] text-slate-500">IEEE Fellows &amp; IP</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('simulations')}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-left transition-colors flex flex-col justify-between group cursor-pointer"
              >
                <Activity className="w-5 h-5 text-[#108548] mb-2" />
                <div>
                  <span className="text-xs font-bold text-[#0F2537] block group-hover:text-[#108548] transition-colors">
                    Run Simulation
                  </span>
                  <span className="text-[11px] text-slate-500">SPICE transient solver</span>
                </div>
              </button>
            </div>
          </section>

          {/* Two-Column Core: Active Requests & Active Projects */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Cols: My Requests & Procurement Pipeline with Live Decisions */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-[#0F2537]">
                    Procurement &amp; Collaboration Pipeline ({filteredRequests.length})
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time tracking and decision authority for fab samples, lab benches, and expert reviews.
                  </p>
                </div>

                {/* Filter buttons */}
                <div className="flex flex-wrap items-center gap-1 bg-[#FAF9F6] p-1 rounded-lg border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setRequestFilter('all')}
                    className={`px-2 py-1 rounded font-medium cursor-pointer ${
                      requestFilter === 'all'
                        ? 'bg-white text-[#0F2537] shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All ({requests.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setRequestFilter('my')}
                    className={`px-2 py-1 rounded font-medium cursor-pointer ${
                      requestFilter === 'my'
                        ? 'bg-white text-[#0F2537] shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    My Requests ({myRequests.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setRequestFilter('pending')}
                    className={`px-2 py-1 rounded font-medium cursor-pointer ${
                      requestFilter === 'pending'
                        ? 'bg-white text-[#0F2537] shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Pending ({pendingRequestsCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setRequestFilter('approved')}
                    className={`px-2 py-1 rounded font-medium cursor-pointer ${
                      requestFilter === 'approved'
                        ? 'bg-white text-[#0F2537] shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Approved
                  </button>
                </div>
              </div>

              {filteredRequests.length === 0 ? (
                <div className="py-12 text-center space-y-2 text-slate-500">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs">No requests matching this filter.</p>
                  <div className="flex justify-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => onNavigate('suppliers')}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-[#0F2537] hover:bg-slate-50 cursor-pointer"
                    >
                      Browse Suppliers
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('laboratories')}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-[#0F2537] hover:bg-slate-50 cursor-pointer"
                    >
                      Book Test Bench
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRequests.map((req) => {
                    const isApproved = String(req.status).toLowerCase() === 'approved';
                    const isPending = String(req.status).toLowerCase() === 'pending';
                    const isInReview = String(req.status).toLowerCase() === 'in_review';
                    const isRejected = String(req.status).toLowerCase() === 'rejected';

                    const isMyReq =
                      req.email?.toLowerCase() === currentEmail ||
                      req.name?.toLowerCase().includes(currentName) ||
                      (req.organization && req.organization.toLowerCase() === currentOrg && currentOrg !== 'independent');

                    return (
                      <div
                        key={req.id}
                        className="p-4 rounded-xl border border-slate-200 bg-[#FAF9F6] hover:bg-white hover:border-slate-300 transition-colors space-y-3 text-xs"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-[11px] font-semibold text-[#108548] uppercase">
                                {req.requestType?.replace(/_/g, ' ')}
                              </span>
                              <span className="text-slate-400 font-mono text-[10px]">· {req.createdAt}</span>
                              {isMyReq && (
                                <span className="px-1.5 py-0.2 rounded font-mono text-[9px] bg-slate-200 text-slate-700 font-semibold">
                                  Submitted by You
                                </span>
                              )}
                            </div>
                            <h3 className="text-sm font-bold text-[#0F2537] mt-1">
                              {req.proposalBrief.split('.')[0] || req.name}
                            </h3>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Requester: <strong className="text-slate-700">{req.name}</strong> ({req.organization}) · {req.email}
                            </div>
                          </div>

                          <span
                            className={`px-2 py-0.5 rounded font-mono text-[10px] font-semibold shrink-0 ${
                              isApproved
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : isPending
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : isInReview
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {req.status?.toUpperCase()}
                          </span>
                        </div>

                        <p className="text-slate-600 leading-relaxed">{req.proposalBrief}</p>

                        {req.decisionNotes && (
                          <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200/80 text-[11px] text-emerald-950 font-mono flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                            <div>
                              <strong>Official Fulfillment / Decision Note:</strong> {req.decisionNotes}
                            </div>
                          </div>
                        )}

                        {/* Interactive Decision & Approval Controls (Conditionally rendered for Admin / Org Leads; hidden for employees) */}
                        {onUpdateRequestStatus && permissions.canApproveRequests ? (
                          <div className="pt-2 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              {!isApproved && (
                                <button
                                  type="button"
                                  disabled={updatingReqId === req.id}
                                  onClick={() => {
                                    if (activeDecisionNoteId === req.id) {
                                      handleDecision(
                                        req.id,
                                        'approved',
                                        decisionNoteInput || 'Approved & scheduled in production pipeline.'
                                      );
                                    } else {
                                      setActiveDecisionNoteId(req.id);
                                      setDecisionNoteInput('Approved. Samples allocated and dispatched with PPAP certificate.');
                                    }
                                  }}
                                  className="px-2.5 py-1 bg-[#108548] text-white font-semibold rounded-md hover:bg-[#0c6b39] transition-colors cursor-pointer flex items-center gap-1 text-[11px] shadow-2xs disabled:opacity-50"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>{activeDecisionNoteId === req.id ? 'Confirm Approval' : 'Approve Request'}</span>
                                </button>
                              )}

                              {!isInReview && !isApproved && (
                                <button
                                  type="button"
                                  disabled={updatingReqId === req.id}
                                  onClick={() => handleDecision(req.id, 'in_review', 'Under engineering qualification review.')}
                                  className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 font-semibold rounded-md hover:bg-slate-100 transition-colors cursor-pointer text-[11px] disabled:opacity-50"
                                >
                                  Set In Review
                                </button>
                              )}

                              {!isRejected && (
                                <button
                                  type="button"
                                  disabled={updatingReqId === req.id}
                                  onClick={() => {
                                    handleDecision(req.id, 'rejected', 'Capacity exceeded for current test window or technical scope mismatch.');
                                  }}
                                  className="px-2 py-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-md transition-colors cursor-pointer text-[11px] font-medium disabled:opacity-50"
                                >
                                  Decline
                                </button>
                              )}

                              {onDeleteRequest && (isAdmin || isMyReq) && (
                                <button
                                  type="button"
                                  disabled={updatingReqId === req.id}
                                  onClick={async () => {
                                    if (confirm('Are you sure you want to delete this request record?')) {
                                      setUpdatingReqId(req.id);
                                      await onDeleteRequest(req.id);
                                      setUpdatingReqId(null);
                                    }
                                  }}
                                  className="px-2 py-1 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors cursor-pointer text-[11px] font-medium flex items-center gap-1 disabled:opacity-50"
                                  title="Delete request record permanently"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Delete</span>
                                </button>
                              )}
                            </div>

                            {activeDecisionNoteId === req.id && (
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveDecisionNoteId(null);
                                  setDecisionNoteInput('');
                                }}
                                className="text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer"
                              >
                                Cancel note
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                            <span>Requester Pipeline View</span>
                            <span className="flex items-center gap-1 text-slate-500">
                              <ShieldCheck className="w-3 h-3 text-slate-400" />
                              <span>Status: {String(req.status).toUpperCase()}</span>
                            </span>
                          </div>
                        )}

                        {/* Inline Decision Note Prompt */}
                        {activeDecisionNoteId === req.id && (
                          <div className="pt-1.5 flex items-center gap-2">
                            <input
                              type="text"
                              value={decisionNoteInput}
                              onChange={(e) => setDecisionNoteInput(e.target.value)}
                              placeholder="Add dispatch tracking # or approval comments..."
                              className="flex-1 px-2.5 py-1 text-[11px] bg-white border border-slate-300 rounded-md text-[#0F2537] focus:outline-none focus:border-[#108548]"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right 5 Cols: Active Protected Project Rooms */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-[#0F2537]">
                    Protected Project Rooms ({displayedProjects.length})
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Isolated collaboration under verified legal stages.
                  </p>
                </div>

                {isAdmin && (
                  <div className="flex items-center gap-1 bg-[#FAF9F6] p-0.5 rounded border border-slate-200 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setProjectScope('my')}
                      className={`px-2 py-0.5 rounded font-medium cursor-pointer ${
                        projectScope === 'my' ? 'bg-white text-[#0F2537] font-bold shadow-2xs' : 'text-slate-500'
                      }`}
                    >
                      My ({userProjects.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setProjectScope('all')}
                      className={`px-2 py-0.5 rounded font-medium cursor-pointer ${
                        projectScope === 'all' ? 'bg-white text-[#0F2537] font-bold shadow-2xs' : 'text-slate-500'
                      }`}
                    >
                      All ({projects.length})
                    </button>
                  </div>
                )}
              </div>

              {displayedProjects.length === 0 ? (
                <div className="py-12 text-center space-y-3 text-slate-500 text-xs">
                  <Lock className="w-8 h-8 text-slate-300 mx-auto" />
                  <p>No project rooms found for this profile.</p>
                  <button
                    type="button"
                    onClick={() => onNavigate('projects')}
                    className="px-3.5 py-1.5 bg-[#0F2537] text-white font-semibold rounded-lg hover:bg-[#16344D] cursor-pointer"
                  >
                    Create Protected Room
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {displayedProjects.map((proj) => {
                    const isMember = proj.participants?.some(
                      (part) =>
                        part.name.toLowerCase().includes(currentName) ||
                        (currentUser?.fullName && part.name.toLowerCase().includes(currentUser.fullName.toLowerCase()))
                    );

                    return (
                      <div
                        key={proj.id}
                        onClick={() => {
                          onSelectProject(proj.id);
                          onNavigate('projects');
                        }}
                        className="p-4 rounded-xl border border-slate-200 bg-[#FAF9F6] hover:bg-white hover:border-[#0F2537] transition-all cursor-pointer space-y-2.5 text-xs group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] font-bold text-[#0F2537]">
                              {proj.code}
                            </span>
                            {isMember && (
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                                You are Member
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-[#108548] font-semibold">
                            {proj.legalStage}
                          </span>
                        </div>

                        <h3 className="text-xs font-bold text-[#0F2537] group-hover:text-[#108548] transition-colors line-clamp-2">
                          {proj.title}
                        </h3>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                          <span>{proj.participants?.length || 1} Participants</span>
                          <span>{proj.milestones?.length || 0} Milestones</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Monitored Frontiers & Evidence Shortcuts */}
          <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-[#0F2537]">
                  Monitored Technology Frontiers ({frontiers.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Continuously benchmarked against commercial releases and academic research breakthroughs.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('frontier')}
                className="text-xs font-semibold text-[#0F2537] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Open Frontier Engine</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {frontiers.map((front) => {
                const customerPos =
                  front.positions.find((p) => p.position === 'Customer technology')?.valueDisplay || '0';
                const targetPos =
                  front.positions.find((p) => p.position === 'Target')?.valueDisplay || 'Target';
                const researchPos =
                  front.positions.find((p) => p.position === 'Research frontier')?.valueDisplay || '99%';

                return (
                  <div
                    key={front.id}
                    onClick={() => {
                      onSelectFrontier(front.id);
                      onNavigate('frontier');
                    }}
                    className="p-4 rounded-xl border border-slate-200 bg-[#FAF9F6] hover:bg-white hover:border-[#0F2537] transition-all cursor-pointer flex flex-col justify-between space-y-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-semibold text-[#108548]">
                          {front.domain}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Metric: {front.metricName} ({front.metricUnit})
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[#0F2537]">{front.title}</h3>
                      <p className="text-slate-600 line-clamp-2">{front.gapRootCauseAnalysis}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-center font-mono">
                      <div className="p-1.5 rounded bg-white border border-slate-100">
                        <span className="text-[10px] text-slate-400 block">Baseline</span>
                        <strong className="text-xs text-[#0F2537]">{customerPos}</strong>
                      </div>
                      <div className="p-1.5 rounded bg-white border border-slate-100">
                        <span className="text-[10px] text-slate-400 block">Target</span>
                        <strong className="text-xs text-[#108548]">{targetPos}</strong>
                      </div>
                      <div className="p-1.5 rounded bg-white border border-slate-100">
                        <span className="text-[10px] text-slate-400 block">Research</span>
                        <strong className="text-xs text-[#C59B47]">{researchPos}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* 4. TAB 2: ORGANIZATION MANAGEMENT (Role Management & Member Invitations) */}
      {dashboardTab === 'organization' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Organization Overview Header Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded font-mono text-[10px] uppercase font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Enterprise Tier 1 Certified
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-xs text-slate-500 font-mono">
                    Org ID: {currentUser?.organizationId || 'org-qartinia-tech'}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-[#0F2537]">
                  {currentUser?.organizationName || 'Qartinia Deep-Tech Engineering Ecosystem'}
                </h2>
                <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                  Manage organization access control, technical staff permissions, and executive roles.
                  Owners and Administrators have authority to approve requests, delete project rooms, edit frontier benchmarks, and invite new members.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-4 rounded-xl bg-[#FAF9F6] border border-slate-200 text-right">
                  <span className="text-[11px] font-mono text-slate-400 uppercase block">Active Seats</span>
                  <strong className="text-xl font-mono text-[#0F2537]">
                    {enterpriseMembers.length} <span className="text-xs text-slate-400 font-normal">/ 25</span>
                  </strong>
                </div>
                {permissions.canManageOrganization && onInviteMember && (
                  <button
                    type="button"
                    onClick={handleOpenInviteModal}
                    className="px-4 py-3 bg-[#108548] text-white text-xs font-semibold rounded-xl hover:bg-[#0c6b39] transition-colors flex items-center gap-2 cursor-pointer shadow-xs whitespace-nowrap"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Invite Member</span>
                  </button>
                )}
              </div>
            </div>

            {/* Role Breakdown Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#FAF9F6] border border-slate-200 space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-purple-900">
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-purple-600" />
                    <span>Owners</span>
                  </span>
                  <span className="font-mono text-base font-bold">{membersByRoleCount.owner}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Full security authority, role revocation, and platform architecture controls.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF9F6] border border-slate-200 space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-900">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Administrators</span>
                  </span>
                  <span className="font-mono text-base font-bold">{membersByRoleCount.admin}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Request approval authority, benchmark modifications, and collaborator invitations.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF9F6] border border-slate-200 space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-blue-900">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <span>Technical Staff (Employees)</span>
                  </span>
                  <span className="font-mono text-base font-bold">{membersByRoleCount.employee}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Project room execution, milestone deliveries, and technical simulations.
                </p>
              </div>
            </div>

            {/* Non-Admin Employee Informational Notice */}
            {!permissions.canManageOrganization && (
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-950 text-xs flex items-start gap-3">
                <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <strong className="block font-semibold">Employee / Read-Only Roster Access</strong>
                  <p className="text-blue-800 leading-relaxed">
                    You are viewing the Organization Roster as <strong>{currentUser?.fullName} ({permissions.roleLabel})</strong>.
                    Inviting new members, modifying permissions, and changing member roles are restricted to Organization Owners and Platform Administrators.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* User's Invitations & Seat Allocations Section */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#108548]" />
                <h3 className="text-base font-bold text-[#0F2537]">My Organization Invitations &amp; Seat Allocations</h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {currentUser?.email}
              </span>
            </div>

            <InvitationsTable
              currentUser={currentUser}
              enterpriseMembers={enterpriseMembers}
              onStateUpdate={async () => {
                if (onUpdateMember) {
                  await onUpdateMember('refresh', {});
                }
              }}
            />
          </div>

          {/* Members Directory Roster Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-[#0F2537]">
                  Organization Roster ({filteredMembers.length})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Live directory of verified engineers, domain specialists, and executive leads.
                </p>
              </div>

              {/* Search & Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={memberSearchQuery}
                    onChange={(e) => setMemberSearchQuery(e.target.value)}
                    placeholder="Search by name, email, department..."
                    className="pl-8 pr-3 py-1.5 bg-[#FAF9F6] border border-slate-200 rounded-lg text-xs text-[#0F2537] focus:outline-none focus:border-[#108548] w-56 sm:w-64"
                  />
                  {memberSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setMemberSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1 bg-[#FAF9F6] p-1 rounded-lg border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setMemberRoleFilter('all')}
                    className={`px-2.5 py-1 rounded font-medium cursor-pointer ${
                      memberRoleFilter === 'all'
                        ? 'bg-white text-[#0F2537] font-bold shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All ({enterpriseMembers.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setMemberRoleFilter('owner')}
                    className={`px-2.5 py-1 rounded font-medium cursor-pointer ${
                      memberRoleFilter === 'owner'
                        ? 'bg-white text-[#0F2537] font-bold shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Owners ({membersByRoleCount.owner})
                  </button>
                  <button
                    type="button"
                    onClick={() => setMemberRoleFilter('admin')}
                    className={`px-2.5 py-1 rounded font-medium cursor-pointer ${
                      memberRoleFilter === 'admin'
                        ? 'bg-white text-[#0F2537] font-bold shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Admins ({membersByRoleCount.admin})
                  </button>
                  <button
                    type="button"
                    onClick={() => setMemberRoleFilter('employee')}
                    className={`px-2.5 py-1 rounded font-medium cursor-pointer ${
                      memberRoleFilter === 'employee'
                        ? 'bg-white text-[#0F2537] font-bold shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Staff ({membersByRoleCount.employee})
                  </button>
                </div>
              </div>
            </div>

            {filteredMembers.length === 0 ? (
              <div className="py-12 text-center space-y-2 text-slate-500">
                <Users className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs">No organization members match the selected criteria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF9F6] border-b border-slate-200 text-[#0F2537]">
                      <th className="py-3 px-4 font-bold">Member &amp; Credentials</th>
                      <th className="py-3 px-4 font-bold">Organization &amp; Dept</th>
                      <th className="py-3 px-4 font-bold">Role &amp; Authority</th>
                      <th className="py-3 px-4 font-bold">Assigned Permissions</th>
                      <th className="py-3 px-4 font-bold">Status</th>
                      <th className="py-3 px-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredMembers.map((member) => {
                      const isOwner = member.role === 'owner';
                      const isMemberAdmin = member.role === 'admin';
                      const isStaff = !isOwner && !isMemberAdmin;
                      const memberPerms = member.permissions || (isOwner || isMemberAdmin ? ['approve_requests', 'delete_projects', 'edit_frontier', 'invite_members', 'manage_projects'] : ['manage_projects']);

                      return (
                        <tr key={member.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${
                                isOwner
                                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                  : isMemberAdmin
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-slate-200 text-slate-700'
                              }`}>
                                {member.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold text-[#0F2537] flex items-center gap-1.5">
                                  <span>{member.fullName}</span>
                                  {member.userId === currentUser?.id && (
                                    <span className="px-1.5 py-0.2 rounded font-mono text-[9px] bg-slate-200 text-slate-700 font-semibold">
                                      You
                                    </span>
                                  )}
                                </div>
                                <div className="text-slate-500 font-mono text-[11px]">{member.email}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="text-slate-800 font-medium">{member.department}</div>
                            <div className="text-slate-500 text-[11px]">{member.title}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded font-mono text-[10px] font-bold uppercase ${
                                isOwner
                                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                  : isMemberAdmin
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-blue-50 text-blue-700 border border-blue-200'
                              }`}
                            >
                              {isOwner && <Shield className="w-3 h-3 text-purple-600" />}
                              {isMemberAdmin && <ShieldCheck className="w-3 h-3 text-emerald-600" />}
                              {isStaff && <User className="w-3 h-3 text-blue-600" />}
                              <span>{member.role}</span>
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {memberPerms.slice(0, 3).map((perm) => (
                                <span
                                  key={perm}
                                  className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#FAF9F6] border border-slate-200 text-slate-700"
                                >
                                  {perm.replace(/_/g, ' ')}
                                </span>
                              ))}
                              {memberPerms.length > 3 && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-100 text-slate-500">
                                  +{memberPerms.length - 3} more
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-700 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span>{member.status || 'active'}</span>
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            {permissions.canManageOrganization ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditMemberModal(member)}
                                  title="Edit Role & Permissions (Admin Only)"
                                  className="px-2.5 py-1 bg-white border border-slate-200 hover:border-slate-300 text-[#0F2537] font-semibold rounded-md hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                                >
                                  <Edit2 className="w-3 h-3 text-[#108548]" />
                                  <span>Edit</span>
                                </button>
                                {member.userId !== currentUser?.id && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveMember(member)}
                                    title="Remove Member from Organization"
                                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-400 font-mono">View Only</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. TAB 3: EXECUTIVE INSIGHTS & STAKEHOLDER INTELLIGENCE */}
      {dashboardTab === 'insights' && (
        <ExecutiveInsightsView
          projects={projects}
          requests={requests}
          frontiers={frontiers}
          experts={experts}
          simulations={simulations}
          enterpriseMembers={enterpriseMembers}
          currentUser={currentUser}
        />
      )}

      {/* 6. DEDICATED MODAL: INVITE NEW MEMBER WITH LIVE USER SEARCH */}
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        currentUser={currentUser}
        accounts={accounts}
        enterpriseMembers={enterpriseMembers}
        onInviteMember={async (payload) => {
          if (!onInviteMember) return;
          await onInviteMember(payload);
          setMemberActionNotice(
            `Organization seat invitation successfully sent to ${payload.fullName} (${payload.email}).`
          );
          setTimeout(() => setMemberActionNotice(null), 5000);
        }}
      />

      {/* 6. MODAL: EDIT MEMBER ROLE & PERMISSIONS (Admin & Owner Only) */}
      {isEditMemberModalOpen && selectedMemberToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2537]/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-[#FAF9F6] border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[#108548]">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F2537]">Modify Member Role &amp; Permissions</h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {selectedMemberToEdit.fullName} ({selectedMemberToEdit.email})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditMemberModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMemberEdit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              <div>
                <label className="block font-semibold text-[#0F2537] mb-1">Assigned Role</label>
                <select
                  value={editMemberRole}
                  onChange={(e) => setEditMemberRole(e.target.value as 'owner' | 'admin' | 'employee')}
                  className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-300 rounded-lg text-[#0F2537] font-semibold focus:outline-none focus:border-[#108548]"
                >
                  <option value="owner">Organization Owner (Full Security Authority)</option>
                  <option value="admin">Administrator (Approvals, Invites &amp; Benchmark Edits)</option>
                  <option value="employee">Technical Staff / Employee (Execution &amp; Simulation)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#0F2537] mb-1">Department</label>
                  <input
                    type="text"
                    value={editMemberDepartment}
                    onChange={(e) => setEditMemberDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-300 rounded-lg text-[#0F2537] focus:outline-none focus:border-[#108548]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0F2537] mb-1">Job Title</label>
                  <input
                    type="text"
                    value={editMemberTitle}
                    onChange={(e) => setEditMemberTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-300 rounded-lg text-[#0F2537] focus:outline-none focus:border-[#108548]"
                  />
                </div>
              </div>

              {/* Granular Permission Toggles */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="block font-semibold text-[#0F2537]">
                  Granular Permission Grants ({editMemberPermissions.length} active)
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {ALL_PERMISSION_KEYS.map((perm) => {
                    const isChecked = editMemberPermissions.includes(perm.key);
                    return (
                      <label
                        key={perm.key}
                        className={`p-2.5 rounded-lg border flex items-start gap-2.5 cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-emerald-50/50 border-emerald-300'
                            : 'bg-[#FAF9F6] border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleEditPermission(perm.key)}
                          className="mt-0.5 rounded text-[#108548] focus:ring-[#108548]"
                        />
                        <div>
                          <strong className="block text-[#0F2537] text-xs">{perm.label}</strong>
                          <span className="text-[11px] text-slate-500 leading-snug block">{perm.desc}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditMemberModalOpen(false)}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingMemberEdit}
                  className="px-5 py-2 bg-[#108548] text-white font-semibold rounded-lg hover:bg-[#0c6b39] transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {isSavingMemberEdit ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>Save Role &amp; Permissions</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
