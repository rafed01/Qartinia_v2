import React, { useState, useEffect } from 'react';
import { EnterpriseMember, UserAccount } from '../types/qartinia';
import { apiFetch } from '../api/client';
import {
  Building,
  CheckCircle2,
  XCircle,
  Clock,
  Check,
  X,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  Shield,
  Briefcase,
  Users,
} from 'lucide-react';

interface InvitationsTableProps {
  currentUser: UserAccount | null;
  // Fallbacks in case state is managed higher up
  enterpriseMembers?: EnterpriseMember[];
  onStateUpdate?: () => void;
}

export const InvitationsTable: React.FC<InvitationsTableProps> = ({
  currentUser,
  enterpriseMembers: initialMembers,
  onStateUpdate,
}) => {
  const [members, setMembers] = useState<EnterpriseMember[]>(initialMembers || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actioningId, setActioningId] = useState<string | null>(null);

  // Fetch invitations for the current user
  const fetchInvitations = async () => {
    if (!currentUser) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch('/api/enterprise/members');
      if (res.ok) {
        const data = await res.json();
        if (data.members) {
          setMembers(data.members);
        }
      } else {
        setError('Failed to load invitations.');
      }
    } catch (err) {
      setError('Error connecting to the server.');
    } finally {
      setLoading(false);
    }
  };

  // Synchronize initialMembers prop if provided
  useEffect(() => {
    if (initialMembers) {
      setMembers(initialMembers);
    } else {
      fetchInvitations();
    }
  }, [initialMembers, currentUser]);

  const handleAction = async (id: string, newStatus: 'active' | 'declined') => {
    setActioningId(id);
    setError(null);
    try {
      const res = await apiFetch(`/api/enterprise/members/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update local status
        setMembers((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
        );
        if (onStateUpdate) {
          onStateUpdate();
        } else {
          await fetchInvitations();
        }
      } else {
        const errData = await res.json();
        setError(errData.error || 'Failed to update invitation status.');
      }
    } catch (err) {
      setError('Failed to dispatch request.');
    } finally {
      setActioningId(null);
    }
  };

  const myInvitations = React.useMemo(() => {
    if (!currentUser) return [];
    const email = currentUser.email.toLowerCase();
    return members.filter(
      (m) => m.email.toLowerCase() === email && (m.status === 'invited' || m.status === 'active')
    );
  }, [members, currentUser]);

  if (!currentUser) {
    return (
      <div className="p-4 text-center text-[#5A6E85] font-mono text-xs">
        Please sign in to view your invitations.
      </div>
    );
  }

  return (
    <div className="space-y-4 text-xs">
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && myInvitations.length === 0 ? (
        <div className="flex items-center justify-center py-8 gap-2 text-[#5A6E85] font-mono">
          <RefreshCw className="w-4 h-4 animate-spin text-[#8C6527]" />
          <span>Synchronizing corporate seats...</span>
        </div>
      ) : myInvitations.length === 0 ? (
        <div className="p-8 text-center bg-[#FAF8F5] border border-[#E5DDD0] rounded-xl space-y-2">
          <Users className="w-6 h-6 text-[#8C6527] mx-auto" />
          <p className="text-[#0F2038] font-serif font-bold text-sm">No Corporate Invitations</p>
          <p className="text-[#5A6E85] text-[11px] leading-relaxed">
            Your email {currentUser.email} is not linked to any pending or active corporate seat allocations.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#E5DDD0] bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F4EE] border-b border-[#E5DDD0] text-[#0F2038] font-mono text-[10px] uppercase font-bold tracking-wider">
                <th className="px-4 py-3">Organization</th>
                <th className="px-4 py-3">Role &amp; Department</th>
                <th className="px-4 py-3">Received / Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE3D7]">
              {myInvitations.map((inv) => {
                const isPending = inv.status === 'invited';
                const isActive = inv.status === 'active';
                const isWorking = actioningId === inv.id;

                return (
                  <tr
                    key={inv.id}
                    className={`transition-colors hover:bg-[#FAF8F5] ${
                      isPending ? 'bg-[#FFFDF7]' : ''
                    }`}
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#D5C8B5] text-[#8C6527] flex items-center justify-center font-bold text-xs shrink-0 font-serif">
                          {inv.organizationName[0].toUpperCase()}
                        </div>
                        <div>
                          <strong className="text-[#0F2038] block font-bold text-xs">
                            {inv.organizationName}
                          </strong>
                          <span className="text-[10px] text-[#5A6E85] font-mono block mt-0.5">
                            Invited by {inv.invitedBy || 'Administrator'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div>
                        <span className="font-semibold text-[#0F2038] block">{inv.title}</span>
                        <span className="text-[10px] text-[#5A6E85] font-mono block mt-0.5">
                          {inv.department}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="space-y-1">
                        <span className="text-[10px] text-[#5A6E85] font-mono block">
                          {inv.joinedAt}
                        </span>
                        
                        {isPending ? (
                          <span className="text-[10px] text-[#B45309] font-bold font-mono flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#B45309]" />
                            <span>Pending Invite</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-700 font-bold font-mono flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Active Member</span>
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      {isPending ? (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={isWorking}
                            onClick={() => handleAction(inv.id, 'active')}
                            className="p-1 px-2.5 bg-[#0F2038] text-white font-bold rounded-lg hover:bg-[#1A365D] transition-colors flex items-center gap-1 text-[11px] shadow-2xs cursor-pointer disabled:opacity-50"
                          >
                            {isWorking ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )}
                            <span>Accept</span>
                          </button>
                          
                          <button
                            type="button"
                            disabled={isWorking}
                            onClick={() => handleAction(inv.id, 'declined')}
                            className="p-1 px-2.5 bg-white text-rose-700 hover:text-rose-900 border border-[#E5DDD0] hover:border-rose-300 font-bold rounded-lg transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                            <span>Decline</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={isWorking}
                          onClick={() => {
                            if (
                              window.confirm(
                                `Are you sure you want to leave and unaccept your corporate seat at ${inv.organizationName}?`
                              )
                            ) {
                              handleAction(inv.id, 'declined');
                            }
                          }}
                          className="p-1 px-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-semibold rounded-lg transition-colors text-[10px] cursor-pointer"
                        >
                          Resign Seat
                        </button>
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
  );
};
