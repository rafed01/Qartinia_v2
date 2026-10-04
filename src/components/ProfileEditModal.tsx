import React, { useState, useEffect } from 'react';
import { UserAccount, UserRole, EnterpriseMember } from '../types/qartinia';
import { X, User, Building, Briefcase, Layers, Sparkles, Check, AlertCircle, Inbox, Settings } from 'lucide-react';
import { InvitationsTable } from './InvitationsTable';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  enterpriseMembers?: EnterpriseMember[];
  onStateUpdate?: () => void;
  onUpdateProfile: (updates: {
    id?: string;
    fullName?: string;
    organizationName?: string;
    title?: string;
    department?: string;
    focusArea?: string;
    role?: UserRole | string;
    bio?: string;
  }) => Promise<void>;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  enterpriseMembers = [],
  onStateUpdate,
  onUpdateProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'invitations'>('profile');
  const [fullName, setFullName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [focusArea, setFocusArea] = useState('');
  const [role, setRole] = useState<string>('employee');
  const [bio, setBio] = useState('');

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab('profile');
    }
    if (currentUser) {
      setFullName(currentUser.fullName || '');
      setOrganizationName(currentUser.organizationName || '');
      setTitle(currentUser.title || '');
      setDepartment(currentUser.department || '');
      setFocusArea(currentUser.focusArea || '');
      setRole(currentUser.role || 'employee');
      setBio(currentUser.bio || '');
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onUpdateProfile({
        id: currentUser?.id,
        fullName: fullName.trim(),
        organizationName: organizationName.trim() || 'Independent R&D',
        title: title.trim() || 'Member of Technical Staff',
        department: department.trim() || 'Power Electronics & Semiconductors',
        focusArea: focusArea.trim() || undefined,
        role,
        bio: bio.trim() || undefined,
      });
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-[#FAF9F6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F2537] text-white flex items-center justify-center font-bold text-sm">
              {fullName ? fullName.slice(0, 2).toUpperCase() : 'ME'}
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F2537]">Edit Professional Profile</h2>
              <p className="text-xs text-slate-500">
                Update your verified engineering identity, affiliation, and access permissions.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-100 bg-[#FAF9F6] px-6 text-xs font-bold gap-4 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`py-3 flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'border-[#0F2537] text-[#0F2537]'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>1. Profile Settings</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('invitations')}
            className={`py-3 flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'invitations'
                ? 'border-[#0F2537] text-[#0F2537]'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>2. Corporate Invitations &amp; Seats</span>
          </button>
        </div>

        {error && activeTab === 'profile' && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {saveSuccess && activeTab === 'profile' && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Profile successfully updated and synced with live database.</span>
          </div>
        )}

        {/* Form Body - Profile Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Mohamed Rafed Riahi"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-lg text-[#0F2537] focus:outline-none focus:border-[#0F2537]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Organization / Company <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder="e.g. Qartinia Automotive / Tier 1 OEM"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-lg text-[#0F2537] focus:outline-none focus:border-[#0F2537]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Professional Title
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Lead Inverter Systems Architect"
                    className="w-full pl-9 pr-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-lg text-[#0F2537] focus:outline-none focus:border-[#0F2537]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Department / Group
                </label>
                <div className="relative">
                  <Layers className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. E-Mobility Drivetrain & Power Modules"
                    className="w-full pl-9 pr-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-lg text-[#0F2537] focus:outline-none focus:border-[#0F2537]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Platform Role &amp; Access Tier
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-lg text-[#0F2537] focus:outline-none focus:border-[#0F2537]"
                >
                  <option value="admin">Platform Administrator (Global Visibility)</option>
                  <option value="company">Enterprise R&amp;D Director (Organization Lead)</option>
                  <option value="employee">Member of Technical Staff / Lead Engineer</option>
                  <option value="researcher">University / Laboratory PI (Academic Research)</option>
                  <option value="supplier">Semiconductor Fab / Component Supplier</option>
                  <option value="lab_director">Accredited Testing Facility Director</option>
                  <option value="user">Registered Engineering Member</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Technical Focus / Specialization
                </label>
                <input
                  type="text"
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                  placeholder="e.g. 800V SiC Inverters, ZVS Gate Driving"
                  className="w-full px-3 py-2 bg-[#FAF9F6] border border-slate-200 rounded-lg text-[#0F2537] focus:outline-none focus:border-[#0F2537]"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Engineering Bio &amp; Research Track Record
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Summary of deep-tech engineering domain, publications, test rig experience, or project areas..."
                className="w-full p-3 bg-[#FAF9F6] border border-slate-200 rounded-lg text-[#0F2537] focus:outline-none focus:border-[#0F2537]"
              />
            </div>

            {/* Action Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-[#0F2537] text-white font-semibold rounded-lg hover:bg-[#16344D] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C59B47]" />
                <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Invitations Table Tab */}
        {activeTab === 'invitations' && (
          <div className="p-6 space-y-4 overflow-y-auto">
            <div className="flex items-center gap-2">
              <Inbox className="w-4 h-4 text-[#108548]" />
              <h3 className="text-sm font-bold text-[#0F2537]">Corporate Invitations &amp; Seats</h3>
            </div>
            <p className="text-slate-500 leading-relaxed text-[11px] mb-2">
              Manage organization memberships, accept invitations, or leave roles. All changes are synchronized with your active permissions immediately.
            </p>
            <InvitationsTable
              currentUser={currentUser}
              enterpriseMembers={enterpriseMembers}
              onStateUpdate={onStateUpdate}
            />
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-[#0F2537] text-white font-semibold rounded-lg hover:bg-[#16344D] transition-colors cursor-pointer text-xs"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
