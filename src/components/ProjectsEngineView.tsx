import React, { useState, useEffect } from 'react';
import {
  ProtectedProjectRoom,
  LegalStage,
  ProjectParticipant,
  ProjectDocument,
} from '../types/qartinia';
import { Lock, ShieldCheck, Plus, Send, Check, FileText, Users, Flag, X, Trash2 } from 'lucide-react';

interface ProjectsEngineViewProps {
  projects: ProtectedProjectRoom[];
  activeProjectId: string | null;
  onSelectProject: (id: string) => void;
  onCreateProject: (payload: {
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
  }) => Promise<ProtectedProjectRoom>;
  onUpdateProjectStageOrGovernance: (
    projectId: string,
    updates: Partial<Pick<ProtectedProjectRoom, 'legalStage' | 'ndaStatus' | 'ipFramework' | 'publicationPolicy'>>
  ) => Promise<void>;
  onAddParticipant: (
    projectId: string,
    participant: Omit<ProjectParticipant, 'id'>
  ) => Promise<void>;
  onAddMilestone: (
    projectId: string,
    milestone: { title: string; dueDate: string; deliverable: string }
  ) => Promise<void>;
  onToggleMilestoneStatus: (
    projectId: string,
    milestoneId: string,
    nextStatus: 'Pending' | 'In Progress' | 'Verified'
  ) => Promise<void>;
  onAddDocument: (
    projectId: string,
    doc: Omit<ProjectDocument, 'id' | 'timestamp'>
  ) => Promise<void>;
  onSendMessage: (
    projectId: string,
    message: { senderName: string; senderOrg: string; senderRole: string; content: string }
  ) => Promise<void>;
  onDeleteProject: (projectId: string) => Promise<void>;
  pendingDraftFromFrontier?: {
    title: string;
    domain: string;
    problemStatement: string;
    targetSpec: string;
    originatingFrontierId: string;
    initialPartnerName?: string;
    initialPartnerOrg?: string;
  } | null;
  onClearPendingDraft?: () => void;
}

const LEGAL_STAGES: LegalStage[] = [
  'Scoping & Mutual NDA',
  'IP Ownership & Publication Rights',
  'Protected Technical Execution',
  'Industrial Handover & Licensing',
];

export const ProjectsEngineView: React.FC<ProjectsEngineViewProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProject,
  onUpdateProjectStageOrGovernance,
  onAddParticipant,
  onAddMilestone,
  onToggleMilestoneStatus,
  onAddDocument,
  onSendMessage,
  onDeleteProject,
  pendingDraftFromFrontier,
  onClearPendingDraft,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Create Room Form State
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [targetSpec, setTargetSpec] = useState('');
  const [legalStage, setLegalStage] = useState<LegalStage>('Scoping & Mutual NDA');
  const [ipFramework, setIpFramework] = useState<ProtectedProjectRoom['ipFramework']>('Background IP Segregated');
  const [publicationPolicy, setPublicationPolicy] =
    useState<ProtectedProjectRoom['publicationPolicy']>('30-Day Pre-Publication Patent Review');
  const [partnerName, setPartnerName] = useState('');
  const [partnerOrg, setPartnerOrg] = useState('');
  const [originatingFrontierId, setOriginatingFrontierId] = useState<string | undefined>(undefined);

  // Sub-forms inside active project room
  const [partName, setPartName] = useState('');
  const [partOrg, setPartOrg] = useState('');
  const [partRole, setPartRole] = useState<ProjectParticipant['role']>('University / Lab PI');
  const [partScope, setPartScope] = useState('Full Technical & Milestone Boundary');

  const [msTitle, setMsTitle] = useState('');
  const [msDue, setMsDue] = useState('');
  const [msDeliverable, setMsDeliverable] = useState('');

  const [docTitle, setDocTitle] = useState('');
  const [docClass, setDocClass] = useState<ProjectDocument['classification']>('Mutual NDA');
  const [docAuthor, setDocAuthor] = useState('');

  const [chatSenderName, setChatSenderName] = useState('');
  const [chatSenderOrg, setChatSenderOrg] = useState('');
  const [chatContent, setChatContent] = useState('');

  useEffect(() => {
    if (pendingDraftFromFrontier) {
      setTitle(pendingDraftFromFrontier.title);
      setDomain(pendingDraftFromFrontier.domain);
      setProblemStatement(pendingDraftFromFrontier.problemStatement);
      setTargetSpec(pendingDraftFromFrontier.targetSpec);
      setOriginatingFrontierId(pendingDraftFromFrontier.originatingFrontierId);
      setPartnerName(pendingDraftFromFrontier.initialPartnerName || '');
      setPartnerOrg(pendingDraftFromFrontier.initialPartnerOrg || '');
      setShowCreateModal(true);
    }
  }, [pendingDraftFromFrontier]);

  const selectedProject =
    projects.find((p) => p.id === activeProjectId) || projects[0] || null;

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !problemStatement.trim()) return;
    const created = await onCreateProject({
      title: title.trim(),
      domain: domain.trim() || 'Deep-Tech Engineering',
      problemStatement: problemStatement.trim(),
      targetSpec: targetSpec.trim(),
      legalStage,
      ipFramework,
      publicationPolicy,
      originatingFrontierId,
      initialPartnerName: partnerName.trim() || undefined,
      initialPartnerOrg: partnerOrg.trim() || undefined,
    });
    onSelectProject(created.id);
    setShowCreateModal(false);
    setTitle('');
    setDomain('');
    setProblemStatement('');
    setTargetSpec('');
    setPartnerName('');
    setPartnerOrg('');
    setOriginatingFrontierId(undefined);
    if (onClearPendingDraft) onClearPendingDraft();
  };

  const handleAddParticipantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !partName.trim() || !partOrg.trim()) return;
    await onAddParticipant(selectedProject.id, {
      name: partName.trim(),
      organization: partOrg.trim(),
      role: partRole,
      accessScope: partScope.trim() || 'Project Room Member',
    });
    setPartName('');
    setPartOrg('');
  };

  const handleAddMilestoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !msTitle.trim()) return;
    await onAddMilestone(selectedProject.id, {
      title: msTitle.trim(),
      dueDate: msDue.trim() || 'TBD',
      deliverable: msDeliverable.trim() || 'Technical validation package',
    });
    setMsTitle('');
    setMsDue('');
    setMsDeliverable('');
  };

  const handleAddDocumentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !docTitle.trim()) return;
    await onAddDocument(selectedProject.id, {
      title: docTitle.trim(),
      classification: docClass,
      uploadedBy: docAuthor.trim() || 'Project Lead',
    });
    setDocTitle('');
    setDocAuthor('');
  };

  const handleSendChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !chatContent.trim()) return;
    await onSendMessage(selectedProject.id, {
      senderName: chatSenderName.trim() || 'Engineering Lead',
      senderOrg: chatSenderOrg.trim() || 'Project Participant',
      senderRole: 'Protected Room Member',
      content: chatContent.trim(),
    });
    setChatContent('');
  };

  const nextMilestoneStatus = (current: 'Pending' | 'In Progress' | 'Verified'): 'Pending' | 'In Progress' | 'Verified' => {
    if (current === 'Pending') return 'In Progress';
    if (current === 'In Progress') return 'Verified';
    return 'Verified';
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <div className="pb-8 border-b border-slate-200 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold tracking-wider text-[#108548] mb-1.5">
            QARTINIA PROJECTS · PROTECTED COLLABORATION INFRASTRUCTURE
          </div>
          <h1 className="text-3xl font-bold text-[#0F2537] tracking-tight">
            Move from discovery to a protected project with the right people.
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Companies, universities, labs and experts collaborate inside structured project rooms. Permissions, documents, milestones and technical exchanges remain strictly inside the project boundary.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-[#0F2537] rounded-lg hover:bg-[#16344D] transition-colors flex items-center gap-2 self-start cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4 text-[#C59B47]" />
          <span>New Protected Project Room</span>
        </button>
      </div>

      {/* Deliberate Trust Architecture Segregation Banner */}
      <div className="mt-6 p-4 rounded-xl bg-[#FBF5EC] border border-[#E8D8C3] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs sm:text-sm text-[#0F2537]">
          <ShieldCheck className="w-5 h-5 text-[#108548] shrink-0" />
          <span>
            <strong>Deliberate Trust Architecture:</strong> Private project-room messages, discussions and files are segregated from Qartinia&apos;s shared intelligence corpus and are never used to train or improve the shared model.
          </span>
        </div>
        <span className="text-xs font-mono font-semibold text-[#108548] whitespace-nowrap">
          Corpus Isolation: Active
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        {/* Left Column: Project Rooms List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="text-xs font-bold text-[#0F2537] tracking-wide">
            PROTECTED PROJECT ROOMS ({projects.length})
          </div>

          {projects.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 text-center space-y-3">
              <Lock className="w-6 h-6 text-[#0F2537] mx-auto" />
              <div className="text-sm font-bold text-[#0F2537]">No Active Project Rooms</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Open a Protected Project Room directly or launch one from any Qartinia Frontier gap analysis to structure NDA, IP, milestones, and technical exchanges.
              </p>
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#0F2537] rounded-lg hover:bg-[#16344D] cursor-pointer"
              >
                Create First Project Room
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((room) => {
                const isSelected = selectedProject?.id === room.id;
                return (
                  <div
                    key={room.id}
                    onClick={() => onSelectProject(room.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') onSelectProject(room.id);
                    }}
                    className={`p-4 rounded-xl border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#0F2537] shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-mono font-semibold text-[#0F2537]">{room.code}</span>
                      <span>{room.legalStage}</span>
                    </div>
                    <h2 className="text-base font-bold text-[#0F2537] mb-1">{room.title}</h2>
                    <p className="text-xs text-slate-600 line-clamp-2 mb-3">{room.problemStatement}</p>
                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span>{room.participants.length} Participants</span>
                      <span>NDA: {room.ndaStatus}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Active Project Room Workspace */}
        <div className="lg:col-span-8">
          {selectedProject ? (
            <div className="space-y-6">
              {/* Room Header & Legal Stage Gate Controller */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">
                      <span className="font-mono font-semibold text-[#0F2537]">{selectedProject.code}</span>
                      <span> · {selectedProject.domain} · Created {selectedProject.createdAt}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-[#0F2537]">{selectedProject.title}</h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateProjectStageOrGovernance(selectedProject.id, {
                          ndaStatus:
                            selectedProject.ndaStatus === 'Executed' ? 'Pending Signature' : 'Executed',
                        })
                      }
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border cursor-pointer ${
                        selectedProject.ndaStatus === 'Executed'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-amber-50 border-amber-200 text-amber-800'
                      }`}
                    >
                      NDA: {selectedProject.ndaStatus}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteProject(selectedProject.id)}
                      aria-label="Delete Project Room"
                      className="p-2 text-slate-400 hover:text-red-600 border border-slate-200 rounded-lg hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Structured Legal Stages Selector (Reduces friction around NDA, IP, publication rights & handover) */}
                <div>
                  <div className="text-xs font-bold text-[#108548] mb-2">
                    STRUCTURED LEGAL & HANDOVER STAGE
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    {LEGAL_STAGES.map((stage, idx) => {
                      const isCurrent = selectedProject.legalStage === stage;
                      return (
                        <button
                          key={stage}
                          type="button"
                          onClick={() =>
                            onUpdateProjectStageOrGovernance(selectedProject.id, { legalStage: stage })
                          }
                          className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                            isCurrent
                              ? 'bg-[#0F2537] text-white border-[#0F2537]'
                              : 'bg-[#FAF9F6] text-slate-700 border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          <div className="text-[10px] font-mono opacity-75">Stage 0{idx + 1}</div>
                          <div className="text-xs font-semibold mt-0.5 leading-snug">{stage}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Governance Summary Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                  <div className="p-3 rounded-lg bg-[#FAF9F6] border border-slate-200">
                    <span className="text-slate-500 block">IP Ownership Framework</span>
                    <strong className="text-[#0F2537]">{selectedProject.ipFramework}</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-[#FAF9F6] border border-slate-200">
                    <span className="text-slate-500 block">Publication Rights Policy</span>
                    <strong className="text-[#0F2537]">{selectedProject.publicationPolicy}</strong>
                  </div>
                  <div className="p-3 rounded-lg bg-[#FAF9F6] border border-slate-200">
                    <span className="text-slate-500 block">Target Engineering Spec</span>
                    <strong className="text-[#0F2537] font-mono">
                      {selectedProject.targetSpec || 'Defined in Room Scope'}
                    </strong>
                  </div>
                </div>

                <div className="text-sm text-slate-700 leading-relaxed pt-2 border-t border-slate-100">
                  <strong className="text-[#0F2537]">Engineering Scope: </strong>
                  {selectedProject.problemStatement}
                </div>
              </div>

              {/* Participants & Milestones Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Boundary Participants */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#0F2537]">
                    <Users className="w-4 h-4 text-[#108548]" />
                    <span>Project Boundary Participants ({selectedProject.participants.length})</span>
                  </div>

                  {selectedProject.participants.length === 0 ? (
                    <p className="text-xs text-slate-500">
                      Add industry engineers, university PIs, or legal counsel to grant room permissions.
                    </p>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {selectedProject.participants.map((p) => (
                        <div key={p.id} className="py-2.5 first:pt-0 last:pb-0 text-xs">
                          <div className="font-bold text-[#0F2537]">{p.name}</div>
                          <div className="text-slate-600">
                            {p.organization} · {p.role}
                          </div>
                          <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                            Access: {p.accessScope}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <form onSubmit={handleAddParticipantSubmit} className="pt-3 border-t border-slate-200 space-y-2.5">
                    <div className="text-xs font-semibold text-slate-700">Add Collaborator to Boundary</div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        value={partName}
                        onChange={(e) => setPartName(e.target.value)}
                        placeholder="Full name"
                        className="px-2.5 py-1.5 text-xs border border-slate-200 rounded"
                      />
                      <input
                        type="text"
                        required
                        value={partOrg}
                        onChange={(e) => setPartOrg(e.target.value)}
                        placeholder="Organization / Lab"
                        className="px-2.5 py-1.5 text-xs border border-slate-200 rounded"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={partRole}
                        onChange={(e) => setPartRole(e.target.value as ProjectParticipant['role'])}
                        className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded"
                      >
                        <option value="Industry Lead">Industry Lead</option>
                        <option value="University / Lab PI">University / Lab PI</option>
                        <option value="Domain Specialist">Domain Specialist</option>
                        <option value="IP & Legal Counsel">IP & Legal Counsel</option>
                      </select>
                      <button
                        type="submit"
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0F2537] rounded hover:bg-[#16344D] cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </form>
                </div>

                {/* Technical Milestones */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#0F2537]">
                    <Flag className="w-4 h-4 text-[#108548]" />
                    <span>Technical Milestones & Handover Gates ({selectedProject.milestones.length})</span>
                  </div>

                  {selectedProject.milestones.length === 0 ? (
                    <p className="text-xs text-slate-500">
                      No milestones defined yet. Add verification gates below.
                    </p>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {selectedProject.milestones.map((ms) => (
                        <div key={ms.id} className="py-2.5 first:pt-0 last:pb-0 flex items-start justify-between gap-2 text-xs">
                          <div>
                            <div className="font-bold text-[#0F2537]">{ms.title}</div>
                            <div className="text-slate-600">{ms.deliverable}</div>
                            <div className="text-[11px] font-mono text-slate-400">Due: {ms.dueDate}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              onToggleMilestoneStatus(
                                selectedProject.id,
                                ms.id,
                                nextMilestoneStatus(ms.status)
                              )
                            }
                            className={`px-2.5 py-1 text-[11px] font-semibold rounded border shrink-0 cursor-pointer ${
                              ms.status === 'Verified'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            {ms.status}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <form onSubmit={handleAddMilestoneSubmit} className="pt-3 border-t border-slate-200 space-y-2.5">
                    <div className="text-xs font-semibold text-slate-700">Add Technical Milestone</div>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        required
                        value={msTitle}
                        onChange={(e) => setMsTitle(e.target.value)}
                        placeholder="Milestone title"
                        className="col-span-2 px-2.5 py-1.5 text-xs border border-slate-200 rounded"
                      />
                      <input
                        type="text"
                        value={msDue}
                        onChange={(e) => setMsDue(e.target.value)}
                        placeholder="Target date"
                        className="col-span-1 px-2.5 py-1.5 text-xs font-mono border border-slate-200 rounded"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={msDeliverable}
                        onChange={(e) => setMsDeliverable(e.target.value)}
                        placeholder="Required experimental deliverable"
                        className="flex-1 px-2.5 py-1.5 text-xs border border-slate-200 rounded"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0F2537] rounded hover:bg-[#16344D] cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Protected Document Vault & Segregated Collaboration Chat */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Segregated Document Vault */}
                <div className="md:col-span-5 bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#0F2537]">
                    <FileText className="w-4 h-4 text-[#108548]" />
                    <span>Protected Room Documents ({selectedProject.documents.length})</span>
                  </div>

                  {selectedProject.documents.length === 0 ? (
                    <p className="text-xs text-slate-500">
                      No documents logged in this project room yet.
                    </p>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {selectedProject.documents.map((d) => (
                        <div key={d.id} className="py-2.5 first:pt-0 last:pb-0 text-xs">
                          <div className="font-semibold text-[#0F2537]">{d.title}</div>
                          <div className="text-slate-500">
                            {d.classification} · {d.uploadedBy} · <span className="font-mono">{d.timestamp}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <form onSubmit={handleAddDocumentSubmit} className="pt-3 border-t border-slate-200 space-y-2">
                    <div className="text-xs font-semibold text-slate-700">Register Room Document</div>
                    <input
                      type="text"
                      required
                      value={docTitle}
                      onChange={(e) => setDocTitle(e.target.value)}
                      placeholder="Document or dataset title"
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded"
                    />
                    <div className="flex items-center gap-2">
                      <select
                        value={docClass}
                        onChange={(e) => setDocClass(e.target.value as ProjectDocument['classification'])}
                        className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded"
                      >
                        <option value="Mutual NDA">Mutual NDA</option>
                        <option value="IP Term Sheet">IP Term Sheet</option>
                        <option value="Simulation / Test Data">Simulation / Test Data</option>
                        <option value="Datasheet / Spec">Datasheet / Spec</option>
                      </select>
                      <button
                        type="submit"
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0F2537] rounded hover:bg-[#16344D] cursor-pointer"
                      >
                        Log File
                      </button>
                    </div>
                  </form>
                </div>

                {/* Protected Technical Exchange Chat (Segregated from Shared Model Training) */}
                <div className="md:col-span-7 bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div>
                        <h3 className="text-sm font-bold text-[#0F2537]">
                          Protected Technical Exchanges
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          Collaboration infrastructure only — strictly excluded from shared-model training data.
                        </p>
                      </div>
                      <span className="text-[11px] font-mono text-[#108548] font-semibold">
                        Zero-Training Vault
                      </span>
                    </div>

                    <div className="py-4 space-y-3 max-h-64 overflow-y-auto">
                      {selectedProject.messages.length === 0 ? (
                        <p className="text-xs text-slate-500 text-center py-6">
                          No technical messages in this project room yet. Start the protected exchange below.
                        </p>
                      ) : (
                        selectedProject.messages.map((msg) => (
                          <div key={msg.id} className="p-3 rounded-lg bg-[#FAF9F6] border border-slate-200 text-xs">
                            <div className="flex items-center justify-between text-slate-500 mb-1">
                              <span>
                                <strong className="text-[#0F2537]">{msg.senderName}</strong> ({msg.senderOrg})
                              </span>
                              <span className="font-mono">{msg.timestamp}</span>
                            </div>
                            <p className="text-slate-800 leading-relaxed">{msg.content}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <form onSubmit={handleSendChatSubmit} className="pt-3 border-t border-slate-200 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={chatSenderName}
                        onChange={(e) => setChatSenderName(e.target.value)}
                        placeholder="Your name"
                        className="px-2.5 py-1.5 text-xs border border-slate-200 rounded"
                      />
                      <input
                        type="text"
                        value={chatSenderOrg}
                        onChange={(e) => setChatSenderOrg(e.target.value)}
                        placeholder="Your organization / lab"
                        className="px-2.5 py-1.5 text-xs border border-slate-200 rounded"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        required
                        value={chatContent}
                        onChange={(e) => setChatContent(e.target.value)}
                        placeholder="Transmit technical exchange inside the protected project boundary..."
                        className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg"
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-2 text-xs font-semibold text-white bg-[#0F2537] rounded-lg hover:bg-[#16344D] flex items-center gap-1 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FBF5EC] border border-[#E8D8C3] flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6 text-[#0F2537]" />
              </div>
              <h2 className="text-xl font-bold text-[#0F2537]">
                Protected Project Infrastructure
              </h2>
              <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                Select an existing project room on the left or create a new Protected Project Room to structure NDA, IP ownership, publication rights, milestones, and segregated technical communication.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Protected Project Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateSubmit}
            className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 max-h-[92vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <div className="text-xs font-bold text-[#108548]">QARTINIA PROJECTS</div>
                <h2 className="text-lg font-bold text-[#0F2537]">
                  Open Protected Project Room
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  if (onClearPendingDraft) onClearPendingDraft();
                }}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                  Project Room Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter project room title"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                    Engineering Domain
                  </label>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="Domain"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                    Target Performance Spec
                  </label>
                  <input
                    type="text"
                    value={targetSpec}
                    onChange={(e) => setTargetSpec(e.target.value)}
                    placeholder="Target metric & envelope"
                    className="w-full px-3 py-2 text-sm font-mono border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                  Engineering Problem & Collaboration Scope *
                </label>
                <textarea
                  rows={3}
                  required
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  placeholder="Define the technical gap, experimental plan, and handover criteria"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                    Invited Lab / Researcher Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="PI or specialist name"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                    Partner Institution / Company
                  </label>
                  <input
                    type="text"
                    value={partnerOrg}
                    onChange={(e) => setPartnerOrg(e.target.value)}
                    placeholder="University, lab, or supplier"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                    IP Ownership Framework
                  </label>
                  <select
                    value={ipFramework}
                    onChange={(e) => setIpFramework(e.target.value as ProtectedProjectRoom['ipFramework'])}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                  >
                    <option value="Background IP Segregated">Background IP Segregated</option>
                    <option value="Joint Foreground IP">Joint Foreground IP</option>
                    <option value="Exclusive Commercial Option">Exclusive Commercial Option</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F2537] mb-1">
                    Publication Rights Policy
                  </label>
                  <select
                    value={publicationPolicy}
                    onChange={(e) =>
                      setPublicationPolicy(e.target.value as ProtectedProjectRoom['publicationPolicy'])
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                  >
                    <option value="30-Day Pre-Publication Patent Review">
                      30-Day Pre-Publication Patent Review
                    </option>
                    <option value="90-Day Embargo">90-Day Embargo</option>
                    <option value="Confidential Industrial Only">Confidential Industrial Only</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  if (onClearPendingDraft) onClearPendingDraft();
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#0F2537] rounded-lg hover:bg-[#16344D] cursor-pointer"
              >
                Initialize Protected Room
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
