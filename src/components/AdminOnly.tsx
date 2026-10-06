import React from 'react';
import { UserAccount } from '../types/qartinia';

export interface AdminOnlyProps {
  currentUser: UserAccount | null;
  /**
   * Allowed roles. Defaults to ['admin', 'platform_admin', 'owner'].
   */
  allowedRoles?: string[];
  /**
   * Optional fallback when permission is denied.
   */
  fallback?: React.ReactNode;
  /**
   * If true, renders the children disabled rather than hiding them completely.
   */
  renderDisabled?: boolean;
  children: React.ReactNode;
}

/**
 * Clean permission-check utility that wraps UI elements.
 * Only allows users with an 'admin' or 'owner' role to see or interact with guarded actions.
 */
export const AdminOnly: React.FC<AdminOnlyProps> = ({
  currentUser,
  allowedRoles = ['admin', 'platform_admin', 'owner'],
  fallback = null,
  renderDisabled = false,
  children,
}) => {
  if (!currentUser) return <>{fallback}</>;

  const userRole = (currentUser.role || '').toLowerCase();
  const hasAccess = allowedRoles.some((r) => r.toLowerCase() === userRole);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (renderDisabled) {
    return (
      <div className="opacity-40 pointer-events-none cursor-not-allowed select-none" title="Admin privilege required">
        {children}
      </div>
    );
  }

  return <>{fallback}</>;
};

export default AdminOnly;
