import { UserAccount } from '../types/qartinia';

export interface UserPermissions {
  // Request approvals
  canApproveRequests: boolean;
  canRejectRequests: boolean;
  canPutRequestsInReview: boolean;

  // Projects
  canCreateProjects: boolean;
  canDeleteProjects: boolean;
  canEditProjectGovernance: boolean;
  canAddMilestones: boolean;
  canAddParticipants: boolean;
  canUploadDocuments: boolean;

  // Frontiers
  canRunFrontierAnalysis: boolean;
  canReevaluateFrontier: boolean;
  canEditFrontier: boolean;
  canDeleteFrontier: boolean;

  // Evidence
  canCreateEvidence: boolean;
  canDeleteEvidence: boolean;

  // Organization & Team Management
  canManageOrganization: boolean;
  canInviteMembers: boolean;
  canModifyPermissions: boolean;

  // Role metadata
  isOwner: boolean;
  isAdmin: boolean;
  isCompany: boolean;
  isEmployee: boolean;
  isGuest: boolean;
  roleLabel: string;
}

export function getUserPermissions(user: UserAccount | null): UserPermissions {
  if (!user) {
    return {
      canApproveRequests: false,
      canRejectRequests: false,
      canPutRequestsInReview: false,
      canCreateProjects: false,
      canDeleteProjects: false,
      canEditProjectGovernance: false,
      canAddMilestones: false,
      canAddParticipants: false,
      canUploadDocuments: false,
      canRunFrontierAnalysis: true,
      canReevaluateFrontier: false,
      canEditFrontier: false,
      canDeleteFrontier: false,
      canCreateEvidence: false,
      canDeleteEvidence: false,
      canManageOrganization: false,
      canInviteMembers: false,
      canModifyPermissions: false,
      isOwner: false,
      isAdmin: false,
      isCompany: false,
      isEmployee: false,
      isGuest: true,
      roleLabel: 'Guest Observer',
    };
  }

  const role = (user.role || '').toLowerCase();
  const isOwner = role === 'owner';
  const isAdmin = role === 'admin' || role === 'platform_admin' || isOwner;
  const isCompany = role === 'company' || role === 'enterprise_admin' || role === 'startup_founder';
  const isEmployee = !isAdmin && !isCompany;

  return {
    // Request approvals: Only Admins and Organization Leaders can approve/decline requests
    canApproveRequests: isAdmin || isCompany,
    canRejectRequests: isAdmin || isCompany,
    canPutRequestsInReview: isAdmin || isCompany,

    // Projects:
    canCreateProjects: true,
    // Only admins can delete protected project rooms
    canDeleteProjects: isAdmin,
    // Only admins and organization leads can advance legal stages and IP governance
    canEditProjectGovernance: isAdmin || isCompany,
    canAddMilestones: true,
    canAddParticipants: true,
    canUploadDocuments: true,

    // Frontiers:
    canRunFrontierAnalysis: true,
    canReevaluateFrontier: isAdmin || isCompany,
    // Only admins can edit or delete benchmark standards
    canEditFrontier: isAdmin,
    canDeleteFrontier: isAdmin,

    // Evidence:
    canCreateEvidence: true,
    // Only admins can delete evidence nodes
    canDeleteEvidence: isAdmin,

    // Organization & Role Management:
    canManageOrganization: isAdmin || isCompany,
    canInviteMembers: isAdmin || isCompany,
    canModifyPermissions: isAdmin || isCompany,

    // Role flags:
    isOwner,
    isAdmin,
    isCompany,
    isEmployee,
    isGuest: false,
    roleLabel: isOwner
      ? 'Organization Owner'
      : isAdmin
      ? 'Platform Administrator'
      : isCompany
      ? 'Enterprise Lead'
      : 'Technical Staff / Employee',
  };
}
