import { apiFetch, getSessionToken, setSessionToken } from './api/client';
import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { UserDashboardView } from './components/UserDashboardView';
import { PlatformArchitectureView } from './components/PlatformArchitectureView';
import { FrontierEngineView } from './components/FrontierEngineView';
import { ProjectsEngineView } from './components/ProjectsEngineView';
import { EvidenceGraphView } from './components/EvidenceGraphView';
import { SuppliersHubView } from './components/SuppliersHubView';
import { LaboratoriesHubView } from './components/LaboratoriesHubView';
import { ExpertsHubView } from './components/ExpertsHubView';
import { SimulationHubView } from './components/SimulationHubView';
import { BrainstormingHubView } from './components/BrainstormingHubView';
import { AuthModal } from './components/AuthModal';
import { ProfileEditModal } from './components/ProfileEditModal';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { NotificationToastContainer, ToastNotification } from './components/NotificationToastContainer';
import {
  QartiniaSection,
  FrontierBenchmark,
  ProtectedProjectRoom,
  EvidenceNode,
  LegalStage,
  ProjectParticipant,
  ProjectDocument,
  UserAccount,
  UserRole,
  SupabaseOrganization,
  EnterpriseMember,
  SupabaseAccessRequest,
  CatalogRelationshipEdge,
  CatalogBookmark,
  AtomicApprovalItem,
  AuditActivityItem,
  SupplierItem,
  LabItem,
  ExpertItem,
  SimulationJob,
  BrainstormRoom,
  BrainstormTask,
  NotificationItem,
} from './types/qartinia';
import { QartiniaCrestSvg } from './components/QartiniaLogo';

export default function App() {
  const [activeSection, setActiveSection] = useState<QartiniaSection>('dashboard');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [autoOpenEvidenceModal, setAutoOpenEvidenceModal] = useState(false);

  // Global Command Palette Shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const [frontiers, setFrontiers] = useState<FrontierBenchmark[]>([]);
  const [projects, setProjects] = useState<ProtectedProjectRoom[]>([]);
  const [evidenceNodes, setEvidenceNodes] = useState<EvidenceNode[]>([]);
  const [catalogRelationships, setCatalogRelationships] = useState<CatalogRelationshipEdge[]>([]);
  const [bookmarks, setBookmarks] = useState<CatalogBookmark[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierItem[]>([]);
  const [labs, setLabs] = useState<LabItem[]>([]);
  const [experts, setExperts] = useState<ExpertItem[]>([]);
  const [simulations, setSimulations] = useState<SimulationJob[]>([]);
  const [brainstormRooms, setBrainstormRooms] = useState<BrainstormRoom[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [organizations, setOrganizations] = useState<SupabaseOrganization[]>([]);
  const [enterpriseMembers, setEnterpriseMembers] = useState<EnterpriseMember[]>([]);
  const [requests, setRequests] = useState<SupabaseAccessRequest[]>([]);
  const [approvals, setApprovals] = useState<AtomicApprovalItem[]>([]);
  const [activityLog, setActivityLog] = useState<AuditActivityItem[]>([]);

  const [activeFrontierId, setActiveFrontierId] = useState<string | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const [pendingDraftFromFrontier, setPendingDraftFromFrontier] = useState<{
    title: string;
    domain: string;
    problemStatement: string;
    targetSpec: string;
    originatingFrontierId: string;
    initialPartnerName?: string;
    initialPartnerOrg?: string;
  } | null>(null);

  const applyServerState = useCallback((data: any) => {
    if (!data) return;
    setFrontiers(data.frontiers || []);
    setProjects(data.projects || []);
    setEvidenceNodes(data.evidenceNodes || []);
    setCatalogRelationships(data.catalogRelationships || []);
    setBookmarks(data.bookmarks || []);
    setSuppliers(data.suppliers || []);
    setLabs(data.labs || []);
    setExperts(data.experts || []);
    setSimulations(data.simulations || []);
    setBrainstormRooms(data.brainstormRooms || []);
    if (Array.isArray(data.notifications)) {
      setNotifications(data.notifications);
    }
    setCurrentUser(data.currentUser || null);
    setAccounts(data.accounts || []);
    setOrganizations(data.organizations || []);
    setEnterpriseMembers(data.enterpriseMembers || []);
    setRequests(data.requests || []);
    setApprovals(data.approvals || []);
    setActivityLog(data.activityLog || []);
  }, []);

  const fetchState = useCallback(async () => {
    try {
      const res = await apiFetch('/api/state');
      if (res.ok) {
        const data = await res.json();
        applyServerState(data);
      }
    } catch {
      // initial load
    }
  }, [applyServerState]);

  useEffect(() => {
    fetchState();
  }, [fetchState]);

  // Real-time Server-Sent Events (SSE) stream listener for live notifications
  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectTimer: any = null;

    const connectSSE = () => {
      try {
        const token = getSessionToken();
        const sseUrl = token ? `/api/events?token=${encodeURIComponent(token)}` : '/api/events';
        eventSource = new EventSource(sseUrl);

        eventSource.addEventListener('notification', (e) => {
          try {
            const parsed = JSON.parse(e.data);
            if (parsed.notification) {
              const newNotif: NotificationItem = parsed.notification;

              setNotifications((prev) => {
                if (prev.some((n) => n.id === newNotif.id)) return prev;
                return [newNotif, ...prev];
              });

              // Trigger interactive floating toast
              setToasts((prev) => [
                ...prev,
                {
                  ...newNotif,
                  toastId: `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                },
              ]);

              // Live background sync of workspace state
              fetchState();
            }
          } catch (err) {
            console.error('[SSE Notification Parse Error]', err);
          }
        });

        eventSource.addEventListener('workspace_state_updated', (e) => {
          try {
            const parsed = JSON.parse(e.data);
            if (parsed.state) {
              applyServerState(parsed.state);
            } else {
              fetchState();
            }
          } catch {}
        });

        eventSource.addEventListener('notification_read', (e) => {
          try {
            const parsed = JSON.parse(e.data);
            if (parsed.id) {
              setNotifications((prev) =>
                prev.map((n) => (n.id === parsed.id ? { ...n, read: true } : n))
              );
            }
          } catch {}
        });

        eventSource.addEventListener('notification_mark_all_read', () => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        });

        eventSource.onerror = () => {
          eventSource?.close();
          reconnectTimer = setTimeout(connectSSE, 4000);
        };
      } catch (err) {
        console.warn('SSE subscription fallback:', err);
      }
    };

    connectSSE();

    return () => {
      if (eventSource) eventSource.close();
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, [fetchState, currentUser?.id]);

  const handleLogin = async (payload: {
    email?: string;
    password?: string;
    fullName?: string;
    profileId?: string;
  }) => {
    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    if (data.token) {
      setSessionToken(data.token);
    }
    applyServerState(data.state);
  };

  const handleQuickSwitchAccount = async (profileId: string) => {
    await handleLogin({ profileId });
  };

  const handleRegister = async (payload: {
    email: string;
    fullName: string;
    password?: string;
    role: UserRole;
    organizationName?: string;
    department?: string;
    title?: string;
    taxId?: string;
    requireApproval?: boolean;
  }) => {
    const res = await apiFetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    if (data.token) {
      setSessionToken(data.token);
    }
    applyServerState(data.state);
  };

  const handleLogout = async () => {
    const res = await apiFetch('/api/auth/logout', { method: 'POST' });
    const data = await res.json();
    setSessionToken(null);
    applyServerState(data.state);
  };

  const handleUpdateProfile = async (updates: Partial<UserAccount>) => {
    const res = await apiFetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      await fetchState();
    }
  };

  const handleUpdateRequestStatus = async (
    requestId: string,
    status: string,
    decisionNotes?: string
  ) => {
    try {
      const res = await apiFetch(`/api/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, decisionNotes }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.state) {
          applyServerState(data.state);
        } else {
          await fetchState();
        }
      }
    } catch (err) {
      console.error('Request status update failed:', err);
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    try {
      const res = await apiFetch(`/api/requests/${requestId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.state) {
          applyServerState(data.state);
        } else {
          await fetchState();
        }
      }
    } catch (err) {
      console.error('Request deletion failed:', err);
    }
  };

  // Real-Time Notification Actions
  const handleMarkNotificationAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await apiFetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  };

  const handleMarkAllNotificationsAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await apiFetch('/api/notifications/mark-all-read', { method: 'POST' });
    } catch (err) {
      console.error('Failed to mark all notifications read:', err);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      await apiFetch(`/api/notifications/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const handleDismissToast = (toastId: string) => {
    setToasts((prev) => prev.filter((t) => t.toastId !== toastId));
  };

  const handleNavigateToNotification = (section: QartiniaSection, linkId?: string) => {
    setActiveSection(section);
    if (section === 'projects' && linkId) {
      setActiveProjectId(linkId);
    }
    if (section === 'frontier' && linkId) {
      setActiveFrontierId(linkId);
    }
  };

  // Frontier Handlers
  const handleRunFrontierAnalysis = async (params: {
    title: string;
    domain: string;
    technologySystem: string;
    metricName: string;
    metricUnit: string;
    customerValue: string;
    targetValue: string;
    operatingEnvelope: string;
    constraints: string;
  }): Promise<FrontierBenchmark> => {
    const res = await apiFetch('/api/frontier/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    await fetchState();
    return data.frontier;
  };

  const handleReevaluateFrontier = async (frontierId: string) => {
    const frontier = frontiers.find((f) => f.id === frontierId);
    if (!frontier) return;
    const customerPos =
      frontier.positions.find((p) => p.position === 'Customer technology')?.valueDisplay || '0';
    const targetPos =
      frontier.positions.find((p) => p.position === 'Target')?.valueDisplay || '0';
    const res = await apiFetch(`/api/frontier/${frontierId}/reevaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerValue: customerPos,
        targetValue: targetPos,
        operatingEnvelope: frontier.operatingEnvelope,
        constraints: frontier.constraints,
      }),
    });
    if (res.ok) {
      await fetchState();
    }
  };

  const handleDeleteFrontier = async (frontierId: string) => {
    const res = await apiFetch(`/api/frontier/${frontierId}`, { method: 'DELETE' });
    if (res.ok) {
      await fetchState();
      if (activeFrontierId === frontierId) {
        setActiveFrontierId(null);
      }
    }
  };

  const handleUpdateFrontier = async (frontierId: string, updates: Partial<FrontierBenchmark>) => {
    const res = await apiFetch(`/api/frontiers/${frontierId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.state) {
        applyServerState(data.state);
      } else {
        await fetchState();
      }
    }
  };

  const handleInviteMember = async (payload: {
    organizationId?: string;
    organizationName?: string;
    fullName: string;
    email: string;
    role: string;
    title?: string;
    department?: string;
    permissions?: string[];
  }) => {
    const res = await apiFetch('/api/enterprise/members/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.state) {
        applyServerState(data.state);
      } else {
        await fetchState();
      }
    }
  };

  const handleUpdateMember = async (id: string, updates: Partial<EnterpriseMember>) => {
    const res = await apiFetch(`/api/enterprise/members/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.state) {
        applyServerState(data.state);
      } else {
        await fetchState();
      }

      if (
        data.member &&
        currentUser &&
        data.member.email &&
        data.member.email.toLowerCase() === currentUser.email.toLowerCase() &&
        updates.status === 'active'
      ) {
        setCurrentUser((prev) =>
          prev
            ? {
                ...prev,
                organizationName: data.member.organizationName,
                organizationId: data.member.organizationId,
                role: data.member.role,
                title: data.member.title || prev.title,
                department: data.member.department || prev.department,
              }
            : null
        );
      }
    }
  };

  const handleDeleteMember = async (id: string) => {
    const res = await apiFetch(`/api/enterprise/members/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      const data = await res.json();
      if (data.state) {
        applyServerState(data.state);
      } else {
        await fetchState();
      }
    }
  };

  const handleSaveEvidenceNode = async (node: EvidenceNode) => {
    const targetFrontierId = node.linkedFrontierId || activeFrontierId || frontiers[0]?.id;
    if (targetFrontierId) {
      const res = await apiFetch(`/api/frontier/${targetFrontierId}/evidence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(node),
      });
      if (res.ok) {
        await fetchState();
      }
    }
  };

  // Evidence Graph Handlers
  const handleCreateEvidenceNode = async (
    node: Omit<EvidenceNode, 'id' | 'createdAt'>
  ): Promise<void> => {
    const res = await apiFetch('/api/evidence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(node),
    });
    if (res.ok) {
      await fetchState();
    }
  };

  const handleDeleteEvidenceNode = async (nodeId: string) => {
    const res = await apiFetch(`/api/evidence/${nodeId}`, { method: 'DELETE' });
    if (res.ok) {
      await fetchState();
    }
  };

  const handleToggleBookmark = async (catalogId: string, notes?: string) => {
    const res = await apiFetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ catalogId, notes }),
    });
    if (res.ok) {
      await fetchState();
    }
  };

  const handleCreateRelationship = async (payload: {
    sourceId: string;
    targetId: string;
    relationshipType: string;
    description: string;
  }) => {
    const res = await apiFetch('/api/catalog/relationships', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      await fetchState();
    }
  };

  const handleDeleteRelationship = async (relationshipId: string) => {
    const res = await apiFetch(`/api/catalog/relationships/${relationshipId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      await fetchState();
    }
  };

  // Projects Handlers
  const handleLaunchProjectFromFrontier = (
    frontier: FrontierBenchmark,
    selectedEvidence?: EvidenceNode
  ) => {
    const targetPos =
      frontier.positions.find((p) => p.position === 'Target')?.valueDisplay || 'Target';
    setPendingDraftFromFrontier({
      title: `Protected Project: ${frontier.title}`,
      domain: frontier.domain,
      problemStatement: `${frontier.gapRootCauseAnalysis} (Operating Envelope: ${frontier.operatingEnvelope})`,
      targetSpec: `${frontier.metricName}: ${targetPos} ${frontier.metricUnit}`,
      originatingFrontierId: frontier.id,
      initialPartnerName: selectedEvidence?.leadContributor,
      initialPartnerOrg: selectedEvidence?.institutionOrCompany,
    });
    setActiveSection('projects');
  };

  const handleLaunchProjectFromEvidence = (node: EvidenceNode) => {
    setPendingDraftFromFrontier({
      title: `Protected Project: ${node.title}`,
      domain: node.category,
      problemStatement: `${node.relevanceToGap} (Operating Conditions: ${node.operatingConditions})`,
      targetSpec: node.demonstratedPerformance,
      originatingFrontierId: node.linkedFrontierId || '',
      initialPartnerName: node.leadContributor,
      initialPartnerOrg: node.institutionOrCompany,
    });
    setActiveSection('projects');
  };

  const handleCreateProject = async (payload: {
    title: string;
    domain: string;
    problemStatement: string;
    targetSpec: string;
    legalStage: LegalStage;
    ipFramework: ProtectedProjectRoom['ipFramework'];
    publicationPolicy: ProtectedProjectRoom['publicationPolicy'];
    originatingFrontierId?: string;
    initialPartnerName?: string;
    initialPartnerOrg?: string;
  }): Promise<ProtectedProjectRoom> => {
    const res = await apiFetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    await fetchState();
    return data.project;
  };

  const handleUpdateProjectStageOrGovernance = async (
    projectId: string,
    updates: Partial<
      Pick<
        ProtectedProjectRoom,
        'legalStage' | 'ndaStatus' | 'ipFramework' | 'publicationPolicy'
      >
    >
  ) => {
    const res = await apiFetch(`/api/projects/${projectId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      await fetchState();
    }
  };

  const handleAddParticipant = async (
    projectId: string,
    participant: Omit<ProjectParticipant, 'id'>
  ) => {
    const res = await apiFetch(`/api/projects/${projectId}/participants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(participant),
    });
    if (res.ok) {
      await fetchState();
    }
  };

  const handleAddMilestone = async (
    projectId: string,
    milestone: { title: string; dueDate: string; deliverable: string }
  ) => {
    const res = await apiFetch(`/api/projects/${projectId}/milestones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(milestone),
    });
    if (res.ok) {
      await fetchState();
    }
  };

  const handleToggleMilestoneStatus = async (
    projectId: string,
    milestoneId: string,
    nextStatus: 'Pending' | 'In Progress' | 'Verified'
  ) => {
    const res = await apiFetch(`/api/projects/${projectId}/milestones/${milestoneId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    });
    if (res.ok) {
      await fetchState();
    }
  };

  const handleAddDocument = async (
    projectId: string,
    doc: Omit<ProjectDocument, 'id' | 'timestamp'>
  ) => {
    const res = await apiFetch(`/api/projects/${projectId}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doc),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to upload document');
    }
    await fetchState();
  };

  const handleDownloadDocument = async (projectId: string, documentId: string) => {
    const res = await apiFetch(`/api/projects/${projectId}/documents/${documentId}/download`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to download document');
    }
    if (data.downloadUrl) {
      const link = document.createElement('a');
      link.href = data.downloadUrl;
      link.download = data.document?.fileName || data.document?.title || 'document';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(data.message || 'Document metadata registered in ledger.');
    }
  };

  const handleDeleteDocument = async (projectId: string, documentId: string) => {
    const res = await apiFetch(`/api/projects/${projectId}/documents/${documentId}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to delete document');
    }
    await fetchState();
  };

  const handleSendMessage = async (
    projectId: string,
    message: { senderName: string; senderOrg: string; senderRole: string; content: string }
  ) => {
    const res = await apiFetch(`/api/projects/${projectId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
    if (res.ok) {
      await fetchState();
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    const res = await apiFetch(`/api/projects/${projectId}`, { method: 'DELETE' });
    if (res.ok) {
      await fetchState();
      if (activeProjectId === projectId) {
        setActiveProjectId(null);
      }
    }
  };

  // Platform Architecture Hub Actions (Suppliers, Labs, Experts, Simulations, Brainstorm)
  const handleRequestSample = async (payload: {
    supplierId: string;
    componentId: string;
    componentName: string;
    quantity: string;
    targetApplication: string;
    notes: string;
  }) => {
    const res = await apiFetch('/api/requests/sample', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        requesterId: currentUser?.id,
        requesterName:
          currentUser?.fullName ||
          (currentUser?.email ? currentUser.email.split('@')[0] : ''),
        requesterEmail: currentUser?.email || '',
        requesterOrg: currentUser?.organizationName || '',
      }),
    });
    if (res.ok) {
      await fetchState();
    }
  };

  const handleBookLab = async (payload: {
    labId: string;
    labName: string;
    equipmentId: string;
    equipmentName: string;
    testingDomain: string;
    testRequirements: string;
    requestedDates: string;
  }) => {
    const res = await apiFetch('/api/requests/lab', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        requesterId: currentUser?.id,
        requesterName:
          currentUser?.fullName ||
          (currentUser?.email ? currentUser.email.split('@')[0] : ''),
        requesterEmail: currentUser?.email || '',
        requesterOrg: currentUser?.organizationName || '',
      }),
    });
    if (res.ok) {
      await fetchState();
    }
  };

  const handleBookExpert = async (payload: {
    expertId: string;
    expertName: string;
    topic: string;
    projectContext: string;
    preferredFormat: string;
    hours: number;
  }) => {
    const res = await apiFetch('/api/requests/expert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        requesterId: currentUser?.id,
        requesterName:
          currentUser?.fullName ||
          (currentUser?.email ? currentUser.email.split('@')[0] : ''),
        requesterEmail: currentUser?.email || '',
        requesterOrg: currentUser?.organizationName || '',
      }),
    });
    if (res.ok) {
      await fetchState();
    }
  };

  const handleUpdateSupplier = async (id: string, updates: Partial<SupplierItem>) => {
    const res = await apiFetch(`/api/suppliers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      await fetchState();
    }
  };

  const handleUpdateLab = async (id: string, updates: Partial<LabItem>) => {
    const res = await apiFetch(`/api/labs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      await fetchState();
    }
  };

  const handleUpdateExpert = async (id: string, updates: Partial<ExpertItem>) => {
    const res = await apiFetch(`/api/experts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      await fetchState();
    }
  };

  const handleRunSimulation = async (payload: {
    title: string;
    tool: any;
    domain: string;
    parameters: Record<string, string | number>;
  }) => {
    const res = await apiFetch('/api/simulations/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      await fetchState();
    }
  };

  const handleCreateBrainstormRoom = async (payload: {
    title: string;
    topic: string;
    domain: string;
    isPrivate: boolean;
    tags: string[];
    participants: string[];
  }) => {
    const res = await apiFetch('/api/brainstorm/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      await fetchState();
    }
  };

  const handleSendBrainstormMessage = async (roomId: string, content: string) => {
    const res = await apiFetch(`/api/brainstorm/${roomId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderName: currentUser?.fullName || 'Engineering Lead',
        senderRole: currentUser?.role || 'Collaborator',
        content,
      }),
    });
    if (res.ok) {
      await fetchState();
    }
  };

  const handleToggleBrainstormTask = async (
    roomId: string,
    taskId: string,
    nextStatus: BrainstormTask['status']
  ) => {
    const res = await apiFetch(`/api/brainstorm/${roomId}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, status: nextStatus }),
    });
    if (res.ok) {
      await fetchState();
    }
  };

  const handleAddBrainstormTask = async (
    roomId: string,
    task: { title: string; assignee: string; priority: BrainstormTask['priority'] }
  ) => {
    const res = await apiFetch(`/api/brainstorm/${roomId}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (res.ok) {
      await fetchState();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#0F2537]">
      <Navbar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        frontiersCount={frontiers.length}
        projectsCount={projects.length}
        evidenceCount={evidenceNodes.length}
        suppliersCount={suppliers.length}
        labsCount={labs.length}
        expertsCount={experts.length}
        simulationsCount={simulations.length}
        brainstormCount={brainstormRooms.length}
        currentUser={currentUser}
        notifications={notifications}
        unreadNotificationsCount={notifications.filter((n) => !n.read).length}
        onMarkNotificationAsRead={handleMarkNotificationAsRead}
        onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
        onDeleteNotification={handleDeleteNotification}
        onNavigateToNotification={handleNavigateToNotification}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onOpenProfileModal={() => setProfileModalOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {activeSection === 'dashboard' && (
          <UserDashboardView
            currentUser={currentUser}
            accounts={accounts}
            projects={projects}
            frontiers={frontiers}
            requests={requests}
            bookmarks={bookmarks}
            suppliers={suppliers}
            labs={labs}
            experts={experts}
            simulations={simulations}
            enterpriseMembers={enterpriseMembers}
            onNavigate={setActiveSection}
            onSelectProject={setActiveProjectId}
            onSelectFrontier={setActiveFrontierId}
            onOpenAuthModal={() => setAuthModalOpen(true)}
            onOpenProfileModal={() => setProfileModalOpen(true)}
            onQuickSwitchAccount={handleQuickSwitchAccount}
            onUpdateRequestStatus={handleUpdateRequestStatus}
            onDeleteRequest={handleDeleteRequest}
            onInviteMember={handleInviteMember}
            onUpdateMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
          />
        )}

        {activeSection === 'architecture' && (
          <PlatformArchitectureView
            onNavigate={setActiveSection}
            frontiersCount={frontiers.length}
            projectsCount={projects.length}
            evidenceCount={evidenceNodes.length}
            suppliersCount={suppliers.length}
            labsCount={labs.length}
            expertsCount={experts.length}
            simulationsCount={simulations.length}
            brainstormCount={brainstormRooms.length}
          />
        )}

        {activeSection === 'frontier' && (
          <FrontierEngineView
            frontiers={frontiers}
            activeFrontierId={activeFrontierId}
            currentUser={currentUser}
            onSelectFrontier={setActiveFrontierId}
            onRunFrontierAnalysis={handleRunFrontierAnalysis}
            onReevaluateFrontier={handleReevaluateFrontier}
            onDeleteFrontier={handleDeleteFrontier}
            onUpdateFrontier={handleUpdateFrontier}
            onSaveEvidenceNode={handleSaveEvidenceNode}
            onLaunchProjectFromFrontier={handleLaunchProjectFromFrontier}
          />
        )}

        {activeSection === 'projects' && (
          <ProjectsEngineView
            projects={projects}
            activeProjectId={activeProjectId}
            onSelectProject={setActiveProjectId}
            currentUser={currentUser}
            onCreateProject={handleCreateProject}
            onUpdateProjectStageOrGovernance={handleUpdateProjectStageOrGovernance}
            onAddParticipant={handleAddParticipant}
            onAddMilestone={handleAddMilestone}
            onToggleMilestoneStatus={handleToggleMilestoneStatus}
            onAddDocument={handleAddDocument}
            onDownloadDocument={handleDownloadDocument}
            onDeleteDocument={handleDeleteDocument}
            onSendMessage={handleSendMessage}
            onDeleteProject={handleDeleteProject}
            pendingDraftFromFrontier={pendingDraftFromFrontier}
            onClearPendingDraft={() => setPendingDraftFromFrontier(null)}
          />
        )}

        {activeSection === 'evidence' && (
          <EvidenceGraphView
            evidenceNodes={evidenceNodes}
            frontiers={frontiers}
            projects={projects}
            catalogRelationships={catalogRelationships}
            bookmarks={bookmarks}
            currentUser={currentUser}
            autoOpenCreateModal={autoOpenEvidenceModal}
            onResetAutoOpen={() => setAutoOpenEvidenceModal(false)}
            onCreateEvidenceNode={handleCreateEvidenceNode}
            onDeleteEvidenceNode={handleDeleteEvidenceNode}
            onToggleBookmark={handleToggleBookmark}
            onCreateRelationship={handleCreateRelationship}
            onDeleteRelationship={handleDeleteRelationship}
            onLaunchProjectFromEvidence={handleLaunchProjectFromEvidence}
          />
        )}

        {activeSection === 'suppliers' && (
          <SuppliersHubView
            suppliers={suppliers}
            onRequestSample={handleRequestSample}
            onUpdateSupplier={handleUpdateSupplier}
            currentUser={currentUser}
          />
        )}

        {activeSection === 'laboratories' && (
          <LaboratoriesHubView
            labs={labs}
            onBookLab={handleBookLab}
            onUpdateLab={handleUpdateLab}
            currentUser={currentUser}
          />
        )}

        {activeSection === 'experts' && (
          <ExpertsHubView
            experts={experts}
            onBookExpert={handleBookExpert}
            onUpdateExpert={handleUpdateExpert}
            currentUser={currentUser}
          />
        )}

        {activeSection === 'simulations' && (
          <SimulationHubView
            simulations={simulations}
            onRunSimulation={handleRunSimulation}
          />
        )}

        {activeSection === 'brainstorming' && (
          <BrainstormingHubView
            rooms={brainstormRooms}
            onCreateRoom={handleCreateBrainstormRoom}
            onSendMessage={handleSendBrainstormMessage}
            onToggleTaskStatus={handleToggleBrainstormTask}
            onAddTask={handleAddBrainstormTask}
          />
        )}
      </main>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        accounts={accounts}
        currentUser={currentUser}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />

      <ProfileEditModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        currentUser={currentUser}
        enterpriseMembers={enterpriseMembers}
        onStateUpdate={fetchState}
        onUpdateProfile={handleUpdateProfile}
      />

      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        currentUser={currentUser}
        projects={projects}
        frontiers={frontiers}
        onNavigate={(section) => setActiveSection(section)}
        onSelectProject={(id) => setActiveProjectId(id)}
        onSelectFrontier={(id) => setActiveFrontierId(id)}
        onInitiateEvidenceNode={() => setAutoOpenEvidenceModal(true)}
        onOpenInviteModal={() => setProfileModalOpen(true)}
      />

      <NotificationToastContainer
        toasts={toasts}
        onDismissToast={handleDismissToast}
        onNavigateToNotification={handleNavigateToNotification}
      />

      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-[1440px] mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <QartiniaCrestSvg className="w-6 h-6 text-[#0F2537]" />
            <span className="font-brand font-bold text-[#0F2537] tracking-widest">QARTINIΛ</span>
            <span>·</span>
            <span>FROM RESEARCH TO INDUSTRY</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <button
              type="button"
              onClick={() => setActiveSection('dashboard')}
              className="hover:text-[#0F2537] cursor-pointer"
            >
              My Workspace
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('frontier')}
              className="hover:text-[#0F2537] cursor-pointer"
            >
              Frontier Engine
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('projects')}
              className="hover:text-[#0F2537] cursor-pointer"
            >
              Protected Projects
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('evidence')}
              className="hover:text-[#0F2537] cursor-pointer"
            >
              Evidence Graph
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('suppliers')}
              className="hover:text-[#0F2537] cursor-pointer"
            >
              Suppliers &amp; Fabs
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('laboratories')}
              className="hover:text-[#0F2537] cursor-pointer"
            >
              Laboratories
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('experts')}
              className="hover:text-[#0F2537] cursor-pointer"
            >
              Domain Experts
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('simulations')}
              className="hover:text-[#0F2537] cursor-pointer"
            >
              Simulation Studio
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('brainstorming')}
              className="hover:text-[#0F2537] cursor-pointer"
            >
              Brainstorming
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('architecture')}
              className="hover:text-[#0F2537] cursor-pointer font-medium text-[#108548]"
            >
              Platform Architecture
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
