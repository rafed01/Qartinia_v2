import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, QartiniaSection } from './components/Navbar';
import { OverviewSolutionView } from './components/OverviewSolutionView';
import { FrontierEngineView } from './components/FrontierEngineView';
import { ProjectsEngineView } from './components/ProjectsEngineView';
import { EvidenceGraphView } from './components/EvidenceGraphView';
import { InvestorBlueprintView } from './components/InvestorBlueprintView';
import { DevModeConsoleView } from './components/DevModeConsoleView';
import { AuthModal } from './components/AuthModal';
import {
  FrontierBenchmark,
  ProtectedProjectRoom,
  EvidenceNode,
  LegalStage,
  ProjectParticipant,
  ProjectDocument,
  UserAccount,
  UserRole,
  EnterpriseMember,
  AtomicApprovalItem,
  AuditActivityItem,
} from './types/qartinia';
import { QartiniaCrestSvg } from './components/QartiniaLogo';
import { LogIn, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState<QartiniaSection>('overview');
  const [devModeEnabled, setDevModeEnabled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [frontiers, setFrontiers] = useState<FrontierBenchmark[]>([]);
  const [projects, setProjects] = useState<ProtectedProjectRoom[]>([]);
  const [evidenceNodes, setEvidenceNodes] = useState<EvidenceNode[]>([]);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [enterpriseMembers, setEnterpriseMembers] = useState<EnterpriseMember[]>([]);
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

  const applyServerState = (data: any) => {
    setFrontiers(data.frontiers || []);
    setProjects(data.projects || []);
    setEvidenceNodes(data.evidenceNodes || []);
    setCurrentUser(data.currentUser || null);
    setAccounts(data.accounts || []);
    setEnterpriseMembers(data.enterpriseMembers || []);
    setApprovals(data.approvals || []);
    setActivityLog(data.activityLog || []);
  };

  const fetchState = useCallback(async () => {
    try {
      const res = await fetch('/api/state');
      if (res.ok) {
        const data = await res.json();
        applyServerState(data);
      }
    } catch {
      // Initial empty state
    }
  }, []);

  useEffect(() => {
    fetchState();
  }, [fetchState]);

  const handleToggleDevMode = () => {
    const next = !devModeEnabled;
    setDevModeEnabled(next);
    if (next) {
      setActiveSection('dev-console');
    } else if (activeSection === 'dev-console') {
      setActiveSection('overview');
    }
  };

  const handleLogin = async (payload: { email: string; fullName?: string }) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    applyServerState(data.state);
  };

  const handleRegister = async (payload: {
    email: string;
    fullName: string;
    role: UserRole;
    organizationName: string;
    department: string;
    title: string;
    requireApproval: boolean;
  }) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    applyServerState(data.state);
  };

  const handleLogout = async () => {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      applyServerState(data.state);
    }
  };

  const handleUpdateProfile = async (updates: Partial<UserAccount>) => {
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const data = await res.json();
      applyServerState(data.state);
    }
  };

  const handleManageOrganization = async (payload: {
    action: 'invite' | 'approve_member' | 'suspend_member' | 'remove_member';
    memberId?: string;
    fullName?: string;
    email?: string;
    organizationName?: string;
    role?: EnterpriseMember['role'];
    department?: string;
    requireApproval?: boolean;
  }) => {
    const res = await fetch('/api/organizations/manage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      applyServerState(data.state);
    }
  };

  const handleApproval = async (payload: {
    action?: 'create' | 'decide';
    approvalId?: string;
    decision?: 'Approved' | 'Rejected';
    workflowType?: AtomicApprovalItem['workflowType'];
    subjectName?: string;
    subjectEmail?: string;
    organizationName?: string;
    requestedRoleOrTier?: string;
    notes?: string;
  }) => {
    const res = await fetch('/api/admin/approvals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      applyServerState(data.state);
    }
  };

  const handleResetWorkspace = async () => {
    const res = await fetch('/api/dev/reset', { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      applyServerState(data.state);
      setActiveFrontierId(null);
      setActiveProjectId(null);
    }
  };

  const handleRunFrontierAnalysis = async (payload: {
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
    const res = await fetch('/api/frontier/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to compute frontier benchmark.');
    }
    await fetchState();
    return data.frontier;
  };

  const handleReevaluateFrontier = async (frontierId: string) => {
    const res = await fetch(`/api/frontier/${frontierId}/reevaluate`, {
      method: 'POST',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to re-evaluate frontier.');
    }
    await fetchState();
  };

  const handleDeleteFrontier = async (frontierId: string) => {
    const res = await fetch(`/api/frontier/${frontierId}`, { method: 'DELETE' });
    if (res.ok) {
      await fetchState();
      if (activeFrontierId === frontierId) {
        setActiveFrontierId(null);
      }
    }
  };

  const handleSaveEvidenceNode = async (node: EvidenceNode) => {
    const res = await fetch('/api/evidence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(node),
    });
    if (res.ok) {
      await fetchState();
    }
  };

  const handleCreateEvidenceNode = async (node: Omit<EvidenceNode, 'id' | 'createdAt'>) => {
    const res = await fetch('/api/evidence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(node),
    });
    if (res.ok) {
      await fetchState();
    }
  };

  const handleDeleteEvidenceNode = async (id: string) => {
    const res = await fetch(`/api/evidence/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await fetchState();
    }
  };

  const handleLaunchProjectFromFrontier = (
    frontier: FrontierBenchmark,
    selectedEvidence?: EvidenceNode
  ) => {
    const targetPos =
      frontier.positions.find((p) => p.position === 'Target')?.valueDisplay || '';
    setPendingDraftFromFrontier({
      title: selectedEvidence
        ? `${frontier.technologySystem} × ${selectedEvidence.institutionOrCompany}`
        : `${frontier.title} — Protected Execution Room`,
      domain: frontier.domain,
      problemStatement: selectedEvidence
        ? `Closing the frontier gap on ${frontier.technologySystem} (${frontier.operatingEnvelope}) via ${selectedEvidence.title}. ${selectedEvidence.relevanceToGap}`
        : frontier.gapRootCauseAnalysis,
      targetSpec: `${frontier.metricName}: ${targetPos} (${frontier.operatingEnvelope})`,
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
    const res = await fetch('/api/projects', {
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
    const res = await fetch(`/api/projects/${projectId}`, {
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
    const res = await fetch(`/api/projects/${projectId}/participants`, {
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
    const res = await fetch(`/api/projects/${projectId}/milestones`, {
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
    const res = await fetch(`/api/projects/${projectId}/milestones/${milestoneId}`, {
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
    const res = await fetch(`/api/projects/${projectId}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doc),
    });
    if (res.ok) {
      await fetchState();
    }
  };

  const handleSendMessage = async (
    projectId: string,
    message: { senderName: string; senderOrg: string; senderRole: string; content: string }
  ) => {
    const res = await fetch(`/api/projects/${projectId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
    if (res.ok) {
      await fetchState();
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    const res = await fetch(`/api/projects/${projectId}`, { method: 'DELETE' });
    if (res.ok) {
      await fetchState();
      if (activeProjectId === projectId) {
        setActiveProjectId(null);
      }
    }
  };

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'Pending').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#0F2537]">
      <Navbar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        frontiersCount={frontiers.length}
        projectsCount={projects.length}
        evidenceCount={evidenceNodes.length}
        devModeEnabled={devModeEnabled}
        onToggleDevMode={handleToggleDevMode}
        pendingApprovalsCount={pendingApprovalsCount}
      />

      {/* Dev Mode Toolbar Strip (Only visible when Dev Mode is toggled ON) */}
      {devModeEnabled && (
        <div className="bg-[#0F2537] text-white border-b border-slate-700">
          <div className="max-w-[1400px] mx-auto px-6 py-2 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[#C59B47] font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>DEV MODE ACTIVE</span>
              </span>
              <span className="text-slate-300">
                Session:{' '}
                <strong className="text-white">
                  {currentUser
                    ? `${currentUser.fullName} (${currentUser.role} · ${currentUser.status})`
                    : 'Guest (Unauthenticated)'}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveSection('dev-console')}
                className={`px-2.5 py-1 rounded font-semibold cursor-pointer ${
                  activeSection === 'dev-console'
                    ? 'bg-[#C59B47] text-[#0F2537]'
                    : 'text-slate-200 hover:bg-slate-800'
                }`}
              >
                Auth, Enterprise &amp; Admin Console
              </button>
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-1 cursor-pointer"
              >
                <LogIn className="w-3 h-3 text-[#C59B47]" />
                <span>Login / Register Modal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1">
        {activeSection === 'overview' && (
          <OverviewSolutionView
            onNavigate={setActiveSection}
            frontiersCount={frontiers.length}
            projectsCount={projects.length}
            evidenceCount={evidenceNodes.length}
          />
        )}

        {activeSection === 'frontier' && (
          <FrontierEngineView
            frontiers={frontiers}
            activeFrontierId={activeFrontierId}
            onSelectFrontier={setActiveFrontierId}
            onRunFrontierAnalysis={handleRunFrontierAnalysis}
            onReevaluateFrontier={handleReevaluateFrontier}
            onDeleteFrontier={handleDeleteFrontier}
            onSaveEvidenceNode={handleSaveEvidenceNode}
            onLaunchProjectFromFrontier={handleLaunchProjectFromFrontier}
          />
        )}

        {activeSection === 'projects' && (
          <ProjectsEngineView
            projects={projects}
            activeProjectId={activeProjectId}
            onSelectProject={setActiveProjectId}
            onCreateProject={handleCreateProject}
            onUpdateProjectStageOrGovernance={handleUpdateProjectStageOrGovernance}
            onAddParticipant={handleAddParticipant}
            onAddMilestone={handleAddMilestone}
            onToggleMilestoneStatus={handleToggleMilestoneStatus}
            onAddDocument={handleAddDocument}
            onSendMessage={handleSendMessage}
            onDeleteProject={handleDeleteProject}
            pendingDraftFromFrontier={pendingDraftFromFrontier}
            onClearPendingDraft={() => setPendingDraftFromFrontier(null)}
          />
        )}

        {activeSection === 'evidence' && (
          <EvidenceGraphView
            evidenceNodes={evidenceNodes}
            onCreateEvidenceNode={handleCreateEvidenceNode}
            onDeleteEvidenceNode={handleDeleteEvidenceNode}
            onLaunchProjectFromEvidence={handleLaunchProjectFromEvidence}
          />
        )}

        {activeSection === 'investor-bp' && (
          <InvestorBlueprintView onNavigate={setActiveSection} />
        )}

        {activeSection === 'dev-console' && (
          <DevModeConsoleView
            currentUser={currentUser}
            accounts={accounts}
            enterpriseMembers={enterpriseMembers}
            approvals={approvals}
            activityLog={activityLog}
            onOpenAuthModal={() => setAuthModalOpen(true)}
            onLogout={handleLogout}
            onUpdateProfile={handleUpdateProfile}
            onManageOrganization={handleManageOrganization}
            onHandleApproval={handleApproval}
            onResetWorkspace={handleResetWorkspace}
          />
        )}
      </main>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />

      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-[1400px] mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <QartiniaCrestSvg className="w-6 h-6" />
            <span className="font-brand font-bold text-[#0F2537] tracking-widest">QARTINIΛ</span>
            <span>·</span>
            <span>FROM RESEARCH TO INDUSTRY</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => setActiveSection('overview')}
              className="hover:text-[#0F2537] cursor-pointer"
            >
              The Qartinia Solution
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('frontier')}
              className="hover:text-[#0F2537] cursor-pointer"
            >
              Qartinia Frontier
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('projects')}
              className="hover:text-[#0F2537] cursor-pointer"
            >
              Qartinia Projects
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
              onClick={() => setActiveSection('investor-bp')}
              className="hover:text-[#0F2537] cursor-pointer"
            >
              Business Model &amp; 10-Yr Plan
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
