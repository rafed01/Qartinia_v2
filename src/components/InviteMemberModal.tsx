import React, { useState, useMemo, useEffect } from 'react';
import {
  UserAccount,
  EnterpriseMember,
  UserRole,
} from '../types/qartinia';
import {
  Search,
  UserPlus,
  Mail,
  X,
  CheckCircle2,
  AlertCircle,
  Send,
  RefreshCw,
  Shield,
  Building,
  Briefcase,
  Check,
  ChevronRight,
  UserCheck,
  Sparkles,
  ArrowLeft,
  Sliders,
} from 'lucide-react';
import { ColumnsWatermark, ShipWatermark, CarthageCornerMotif } from './CarthageArtwork';

export const ALL_PERMISSION_KEYS = [
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

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  accounts: UserAccount[];
  enterpriseMembers: EnterpriseMember[];
  onInviteMember: (payload: {
    organizationId?: string;
    organizationName?: string;
    fullName: string;
    email: string;
    role: string;
    title?: string;
    department?: string;
    permissions?: string[];
  }) => Promise<void>;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  accounts,
  enterpriseMembers,
  onInviteMember,
}) => {
  const [activeStep, setActiveStep] = useState<'search' | 'configure'>('search');
  const [inviteMode, setInviteMode] = useState<'search' | 'manual'>('search');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'independent' | 'company' | 'advisor'>('all');
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);

  // Seat configuration state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'owner' | 'admin' | 'employee'>('employee');
  const [department, setDepartment] = useState('Power Electronics & Systems');
  const [title, setTitle] = useState('Senior R&D Engineer');
  const [permissions, setPermissions] = useState<string[]>(['manage_projects']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Reset modal state on open
  useEffect(() => {
    if (isOpen) {
      setActiveStep('search');
      setInviteMode('search');
      setSearchQuery('');
      setFilterCategory('all');
      setSelectedUser(null);
      setFullName('');
      setEmail('');
      setRole('employee');
      setDepartment(currentUser?.department || 'R&D Power Electronics');
      setTitle('Senior R&D Specialist');
      setPermissions(['manage_projects']);
      setErrorNotice(null);
    }
  }, [isOpen, currentUser]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter existing registered users
  const filteredUsers = useMemo(() => {
    if (!accounts || accounts.length === 0) return [];
    
    return accounts.filter((acc) => {
      // Category filter
      if (filterCategory === 'independent') {
        const isInd = !acc.organizationName || acc.organizationName.toLowerCase().includes('independent');
        if (!isInd) return false;
      } else if (filterCategory === 'company') {
        const isCompany = acc.organizationName && !acc.organizationName.toLowerCase().includes('independent');
        if (!isCompany) return false;
      } else if (filterCategory === 'advisor') {
        const isAdvisor = acc.role === 'expert' || acc.role === 'lab_director';
        if (!isAdvisor) return false;
      }

      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim().replace(/^@/, '');
        const username = (acc.username || acc.email.split('@')[0]).toLowerCase();
        const matchUsername = username.includes(q);
        const matchName = acc.fullName?.toLowerCase().includes(q);
        const matchEmail = acc.email?.toLowerCase().includes(q);
        const matchOrg = acc.organizationName?.toLowerCase().includes(q);
        const matchRole = acc.role?.toLowerCase().includes(q);
        const matchTitle = acc.title?.toLowerCase().includes(q);
        const matchDept = acc.department?.toLowerCase().includes(q);
        return matchUsername || matchName || matchEmail || matchOrg || matchRole || matchTitle || matchDept;
      }

      return true;
    });
  }, [accounts, searchQuery, filterCategory]);

  const handleSelectUser = (user: UserAccount) => {
    setSelectedUser(user);
    const resolvedName = user.fullName || user.email.split('@')[0];
    setFullName(resolvedName);
    setEmail(user.email);
    setTitle(user.title || `${user.role ? user.role.toUpperCase() : 'Technical'} Specialist`);
    setDepartment(user.department || user.organizationName || 'R&D Power Systems');
    setActiveStep('configure');
  };

  const handleTogglePermission = (key: string) => {
    setPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const handleRoleChange = (newRole: 'owner' | 'admin' | 'employee') => {
    setRole(newRole);
    if (newRole === 'admin' || newRole === 'owner') {
      setPermissions([
        'manage_organization',
        'invite_members',
        'approve_requests',
        'delete_projects',
        'edit_frontier',
        'manage_projects',
      ]);
    } else {
      setPermissions(['manage_projects']);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      setErrorNotice('Full name and email are required.');
      return;
    }

    setIsSubmitting(true);
    setErrorNotice(null);

    try {
      await onInviteMember({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        role,
        department: department.trim(),
        title: title.trim(),
        permissions,
        organizationName: currentUser?.organizationName || 'Enterprise Consortium',
        organizationId: currentUser?.organizationId || 'org-qartinia-tech',
      });
      onClose();
    } catch (err: any) {
      setErrorNotice(err.message || 'Failed to dispatch organization seat invitation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2038]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#D5C8B5] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-all relative">
        <CarthageCornerMotif className="w-8 h-8 absolute top-2 right-2 pointer-events-none opacity-40 text-[#8C6527] z-20" />
        <ColumnsWatermark className="w-48 h-48 absolute -right-10 -bottom-10 pointer-events-none opacity-[0.08] text-[#0F2038]" />

        {/* Header Bar */}
        <div className="px-6 py-4 bg-[#F5EFEB] border-b border-[#EBE3D7] flex items-center justify-between shrink-0 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#D5C8B5] text-[#8C6527]">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#0F2038]">
                Invite Member to Organization
              </h3>
              <p className="text-xs text-[#5A6E85] font-mono flex items-center gap-1.5 mt-0.5">
                <Building className="w-3.5 h-3.5 text-[#8C6527]" />
                <span>{currentUser?.organizationName || 'Qartinia Deep-Tech Consortium'}</span>
                <span className="text-[#C5A880]">·</span>
                <span className="text-[#8C6527] font-bold">{enterpriseMembers.length} Active Seats</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#5A6E85] hover:text-[#0F2038] hover:bg-[#EBE3D7] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator & Search Mode Switcher */}
        <div className="px-6 py-3 bg-[#FAF8F5] border-b border-[#EBE3D7] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveStep('search');
                setInviteMode('search');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeStep === 'search' && inviteMode === 'search'
                  ? 'bg-[#0F2038] text-white font-bold shadow-2xs'
                  : 'bg-white text-[#5A6E85] hover:text-[#0F2038] border border-[#E5DDD0]'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>1. Search Existing Users</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setInviteMode('manual');
                setSelectedUser(null);
                setActiveStep('configure');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                inviteMode === 'manual'
                  ? 'bg-[#0F2038] text-white font-bold shadow-2xs'
                  : 'bg-white text-[#5A6E85] hover:text-[#0F2038] border border-[#E5DDD0]'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Manual Email Invite</span>
            </button>
          </div>

          {selectedUser && activeStep === 'configure' && inviteMode === 'search' && (
            <button
              type="button"
              onClick={() => setActiveStep('search')}
              className="text-xs font-semibold text-[#8C6527] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Search</span>
            </button>
          )}
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
          {errorNotice && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorNotice}</span>
            </div>
          )}

          {/* STEP 1: LIVE SEARCH PLATFORM USERS */}
          {activeStep === 'search' && inviteMode === 'search' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Search Bar Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-[#0F2038] text-xs">
                    Search Registered Users by Username, Name, or Email
                  </label>
                  <span className="text-[11px] font-mono text-[#5A6E85]">
                    {filteredUsers.length} Users Found
                  </span>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-[#5A6E85] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type username (e.g. markus.becker), full name, or email..."
                    className="w-full pl-10 pr-9 py-2.5 bg-[#FAF8F5] border border-[#E5DDD0] rounded-xl text-[#0F2038] font-semibold text-xs focus:outline-none focus:border-[#C5A880] placeholder-[#8A9BA8] shadow-2xs"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A6E85] hover:text-[#0F2038] cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setFilterCategory('all')}
                  className={`px-3 py-1 rounded-lg font-medium cursor-pointer transition-colors ${
                    filterCategory === 'all'
                      ? 'bg-[#0F2038] text-white font-bold shadow-2xs'
                      : 'bg-[#FAF8F5] text-[#5A6E85] hover:text-[#0F2038] border border-[#E5DDD0]'
                  }`}
                >
                  All Users ({accounts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterCategory('independent')}
                  className={`px-3 py-1 rounded-lg font-medium cursor-pointer transition-colors ${
                    filterCategory === 'independent'
                      ? 'bg-[#0F2038] text-white font-bold shadow-2xs'
                      : 'bg-[#FAF8F5] text-[#5A6E85] hover:text-[#0F2038] border border-[#E5DDD0]'
                  }`}
                >
                  Independent / Unassigned
                </button>
                <button
                  type="button"
                  onClick={() => setFilterCategory('company')}
                  className={`px-3 py-1 rounded-lg font-medium cursor-pointer transition-colors ${
                    filterCategory === 'company'
                      ? 'bg-[#0F2038] text-white font-bold shadow-2xs'
                      : 'bg-[#FAF8F5] text-[#5A6E85] hover:text-[#0F2038] border border-[#E5DDD0]'
                  }`}
                >
                  Corporate Partners
                </button>
                <button
                  type="button"
                  onClick={() => setFilterCategory('advisor')}
                  className={`px-3 py-1 rounded-lg font-medium cursor-pointer transition-colors ${
                    filterCategory === 'advisor'
                      ? 'bg-[#0F2038] text-white font-bold shadow-2xs'
                      : 'bg-[#FAF8F5] text-[#5A6E85] hover:text-[#0F2038] border border-[#E5DDD0]'
                  }`}
                >
                  Advisors &amp; PIs
                </button>
              </div>

              {/* Live Search Results Roster */}
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 pt-1">
                {filteredUsers.length === 0 ? (
                  <div className="p-8 text-center bg-[#FAF8F5] rounded-xl border border-[#E5DDD0] space-y-2">
                    <AlertCircle className="w-6 h-6 text-[#8C6527] mx-auto" />
                    <p className="text-[#0F2038] font-serif font-bold text-sm">
                      No registered users found matching "{searchQuery}"
                    </p>
                    <p className="text-[#5A6E85] text-[11px]">
                      The user may not have registered an account yet.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setInviteMode('manual');
                        setActiveStep('configure');
                      }}
                      className="mt-2 px-3 py-1.5 bg-[#0F2038] text-white font-bold rounded-lg hover:bg-[#1A365D] transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Switch to Manual Email Invite</span>
                    </button>
                  </div>
                ) : (
                  filteredUsers.map((acc) => {
                    const username = acc.username || acc.email.split('@')[0];
                    const isAlreadyMember = enterpriseMembers.some(
                      (m) => m.email.toLowerCase() === acc.email.toLowerCase()
                    );

                    return (
                      <div
                        key={acc.id}
                        className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                          selectedUser?.id === acc.id
                            ? 'bg-[#FFFDF7] border-[#8C6527] shadow-xs'
                            : 'bg-white border-[#E5DDD0] hover:bg-[#FAF8F5] hover:border-[#D5C8B5]'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#D5C8B5] text-[#0F2038] font-serif font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs">
                            {acc.fullName ? acc.fullName[0] : username[0].toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-[#0F2038] text-xs truncate flex items-center gap-2">
                              <span>{acc.fullName || username}</span>
                              <span className="font-mono text-[10px] text-[#8C6527] bg-[#FAF8F5] px-1.5 py-0.2 rounded border border-[#D5C8B5]">
                                @{username}
                              </span>
                            </div>
                            <div className="text-[11px] text-[#5A6E85] truncate font-mono mt-0.5">
                              {acc.email} · {acc.organizationName || 'Independent'}
                            </div>
                            <div className="text-[10px] text-[#5A6E85] truncate mt-0.5">
                              {acc.title || acc.role?.toUpperCase()} {acc.department ? `· ${acc.department}` : ''}
                            </div>
                          </div>
                        </div>

                        {isAlreadyMember ? (
                          <span className="px-2.5 py-1 rounded font-mono text-[10px] bg-[#FAF8F5] text-[#5A6E85] border border-[#E5DDD0] font-bold shrink-0 flex items-center gap-1">
                            <UserCheck className="w-3 h-3 text-[#5A6E85]" />
                            <span>Already Member</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSelectUser(acc)}
                            className="px-3.5 py-1.5 bg-[#0F2038] text-white font-bold rounded-lg hover:bg-[#1A365D] transition-all cursor-pointer text-xs shrink-0 flex items-center gap-1 shadow-xs"
                          >
                            <span>Select &amp; Assign</span>
                            <ChevronRight className="w-3.5 h-3.5 text-[#C5A880]" />
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* STEP 2: CONFIGURE SEAT ROLE, DEPARTMENT & PERMISSIONS */}
          {(activeStep === 'configure' || inviteMode === 'manual') && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Selected User Header Banner */}
              {selectedUser && inviteMode === 'search' && (
                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#D5C8B5] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white text-[#0F2038] font-serif font-bold text-xs flex items-center justify-center shrink-0 border border-[#D5C8B5]">
                      {selectedUser.fullName ? selectedUser.fullName[0] : selectedUser.email[0].toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0F2038] text-xs flex items-center gap-1.5">
                        <span>{selectedUser.fullName}</span>
                        <span className="font-mono text-[10px] text-[#8C6527]">
                          (@{selectedUser.username || selectedUser.email.split('@')[0]})
                        </span>
                      </h4>
                      <p className="text-[11px] text-[#5A6E85] font-mono">
                        {selectedUser.email} · {selectedUser.organizationName || 'Independent'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUser(null);
                      setActiveStep('search');
                    }}
                    className="text-xs text-[#8C6527] hover:underline font-semibold cursor-pointer shrink-0"
                  >
                    Change User
                  </button>
                </div>
              )}

              {/* Manual Email Fields */}
              {inviteMode === 'manual' && (
                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold text-[#0F2038] mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Dr. Thomas Weber"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5DDD0] rounded-lg text-[#0F2038] font-medium focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#0F2038] mb-1">
                      Corporate or Academic Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. thomas.weber@infineon.com"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5DDD0] rounded-lg text-[#0F2038] font-mono focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>
                </div>
              )}

              {/* Role & Department Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#0F2038] mb-1">
                    Assigned Organization Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => handleRoleChange(e.target.value as 'owner' | 'admin' | 'employee')}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5DDD0] rounded-lg text-[#0F2038] font-semibold focus:outline-none focus:border-[#C5A880]"
                  >
                    <option value="employee">Technical Staff / Employee</option>
                    <option value="admin">Administrator (Approvals &amp; Benchmarks)</option>
                    <option value="owner">Organization Owner (Full Authority)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#0F2038] mb-1">
                    Department / Business Unit
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. R&D Power Stage & Inverters"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5DDD0] rounded-lg text-[#0F2038] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0F2038] mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Principal SiC Application Engineer"
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5DDD0] rounded-lg text-[#0F2038] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              {/* Granular Permissions Checklist */}
              <div className="space-y-2 pt-2 border-t border-[#EBE3D7]">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-[#0F2038]">
                    Granular Permission Grants ({permissions.length} selected)
                  </label>
                  <span className="text-[10px] text-[#5A6E85] font-mono">
                    {role === 'admin' || role === 'owner' ? 'All Permissions Pre-selected' : 'Custom Grants'}
                  </span>
                </div>

                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {ALL_PERMISSION_KEYS.map((perm) => {
                    const isChecked = permissions.includes(perm.key);
                    return (
                      <label
                        key={perm.key}
                        className={`p-2.5 rounded-lg border flex items-start gap-2.5 cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-[#F5EFEB] border-[#D5C8B5] text-[#0F2038]'
                            : 'bg-[#FAF8F5] border-[#E5DDD0] hover:border-[#D5C8B5] text-[#5A6E85]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTogglePermission(perm.key)}
                          className="mt-0.5 rounded text-[#0F2038] focus:ring-[#0F2038]"
                        />
                        <div>
                          <strong className="block text-[#0F2038] text-xs">{perm.label}</strong>
                          <span className="text-[11px] text-[#5A6E85] leading-snug block">
                            {perm.desc}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Footer Action Buttons */}
          <div className="pt-4 border-t border-[#EBE3D7] flex items-center justify-between gap-3 shrink-0">
            <div className="text-[11px] text-[#5A6E85] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#8C6527]" />
              <span>Seat will be allocated immediately upon submission</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white border border-[#E5DDD0] text-[#5A6E85] font-semibold rounded-lg hover:bg-[#FAF8F5] hover:text-[#0F2038] transition-colors cursor-pointer"
              >
                Cancel
              </button>

              {(activeStep === 'configure' || inviteMode === 'manual') && (
                <button
                  type="submit"
                  disabled={isSubmitting || (!fullName && !selectedUser)}
                  className="px-5 py-2 bg-[#0F2038] text-white font-bold rounded-lg hover:bg-[#1A365D] transition-all cursor-pointer flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C5A880]" />
                  ) : (
                    <Send className="w-3.5 h-3.5 text-[#C5A880]" />
                  )}
                  <span>Send Seat Invitation</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
