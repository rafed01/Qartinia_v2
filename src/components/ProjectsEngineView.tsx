import React, { useState, useEffect, useRef } from 'react';
import {
  ProtectedProjectRoom,
  LegalStage,
  ProjectParticipant,
  ProjectDocument,
  UserAccount,
} from '../types/qartinia';
import { getUserPermissions } from '../utils/permissions';
import {
  Lock,
  ShieldCheck,
  Plus,
  Send,
  Check,
  FileText,
  Users,
  Flag,
  X,
  Trash2,
  Download,
  ShieldAlert,
  Upload,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { ShieldWatermark, TowerWatermark, CarthageCornerMotif } from './CarthageArtwork';

interface ProjectsEngineViewProps {
  projects: ProtectedProjectRoom[];
  activeProjectId: string | null;
  onSelectProject: (id: string) => void;
  currentUser?: UserAccount | null;
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
  onDownloadDocument?: (projectId: string, documentId: string) => Promise<void>;
  onDeleteDocument?: (projectId: string, documentId: string) => Promise<void>;
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
  onOpenExecutiveDossier?: () => void;
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
  currentUser,
  onCreateProject,
  onUpdateProjectStageOrGovernance,
  onAddParticipant,
  onAddMilestone,
  onToggleMilestoneStatus,
  onAddDocument,
  onDownloadDocument,
  onDeleteDocument,
  onSendMessage,
  onDeleteProject,
  pendingDraftFromFrontier,
  onClearPendingDraft,
}) => {
  const permissions = getUserPermissions(currentUser || null);

  const [showCreateModal, setShowCreateModal] = useState(false);

  // Create Room Form State
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [targetSpec, setTargetSpec] = useState('');
  const [legalStage, setLegalStage] = useState<LegalStage>('Scoping & Mutual NDA');
  const [ipFramework, setIpFramework] =
    useState<ProtectedProjectRoom['ipFramework']>('Background IP Segregated');
  const [publicationPolicy, setPublicationPolicy] =
    useState<ProtectedProjectRoom['publicationPolicy']>(
      '30-Day Pre-Publication Patent Review'
    );
  const [partnerName, setPartnerName] = useState('');
  const [partnerOrg, setPartnerOrg] = useState('');
  const [originatingFrontierId, setOriginatingFrontierId] = useState<string | undefined>();

  // In-Room Sub-forms
  const [partName, setPartName] = useState('');
  const [partOrg, setPartOrg] = useState('');
  const [partRole, setPartRole] = useState<ProjectParticipant['role']>('Industry Lead');
  const [partScope, setPartScope] = useState('');

  const [msTitle, setMsTitle] = useState('');
  const [msDue, setMsDue] = useState('');
  const [msDeliverable, setMsDeliverable] = useState('');

  const [docTitle, setDocTitle] = useState('');
  const [docClass, setDocClass] =
    useState<ProjectDocument['classification']>('Mutual NDA');
  const [docAuthor, setDocAuthor] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [docUploadError, setDocUploadError] = useState<string | null>(null);
  const [downloadingDocId, setDownloadingDocId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [chatContent, setChatContent] = useState('');
  const [chatSenderName, setChatSenderName] = useState('');
  const [chatSenderOrg, setChatSenderOrg] = useState('');
  const [ndaNotice, setNdaNotice] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      setFileBase64(null);
      return;
    }
    const MAX_FILE_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      setDocUploadError('File size exceeds 50MB limit.');
      return;
    }
    setDocUploadError(null);
    setSelectedFile(file);
    if (!docTitle.trim()) {
      setDocTitle(file.name);
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFileBase64(result);
    };
    reader.onerror = () => {
      setDocUploadError('Failed to read file.');
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadDoc = async (doc: ProjectDocument) => {
    if (!selectedProject) return;
    setDownloadingDocId(doc.id);
    try {
      if (onDownloadDocument && doc.storagePath) {
        await onDownloadDocument(selectedProject.id, doc.id);
      } else if (doc.fileBase64) {
        const link = document.createElement('a');
        link.href = doc.fileBase64;
        link.download = doc.fileName || `${doc.title}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert(`Document metadata: ${doc.title} (${doc.classification}). Encrypted vault record.`);
      }
    } catch (err: any) {
      alert(`Download failed: ${err.message || 'Unable to retrieve document.'}`);
    } finally {
      setDownloadingDocId(null);
    }
  };

  const handleDeleteDoc = async (docId: string) => {
    if (!selectedProject || !onDeleteDocument) return;
    if (!confirm('Are you sure you want to delete this document from the project vault?')) return;
    try {
      await onDeleteDocument(selectedProject.id, docId);
    } catch (err: any) {
      alert(`Failed to delete document: ${err.message || 'Unknown error'}`);
    }
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const handleNdaToggle = () => {
    if (!selectedProject) return;
    if (selectedProject.ndaStatus === 'Executed') {
      onUpdateProjectStageOrGovernance(selectedProject.id, {
        ndaStatus: 'Pending Signature',
      });
      setNdaNotice(null);
    } else {
      const hasMutualNda = selectedProject.documents?.some(
        (d) => d.classification === 'Mutual NDA' && (Boolean(d.storagePath) || d.title.toLowerCase().includes('nda') || d.title.toLowerCase().includes('executed'))
      );
      if (!hasMutualNda) {
        setNdaNotice('To execute NDA, upload a signed Mutual NDA document into the Protected Room Documents vault below. Unverified execution claims are disallowed.');
        return;
      }
      setNdaNotice(null);
      onUpdateProjectStageOrGovernance(selectedProject.id, {
        ndaStatus: 'Executed',
      });
    }
  };

  useEffect(() => {
    if (currentUser) {
      if (!chatSenderName) {
        setChatSenderName(currentUser.fullName || currentUser.email.split('@')[0]);
      }
      if (!chatSenderOrg || chatSenderOrg === 'Project Participant') {
        setChatSenderOrg(currentUser.organizationName || 'Project Participant');
      }
    }
  }, [currentUser]);

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
    if (!selectedProject) return;
    if (!selectedFile || !fileBase64) {
      setDocUploadError('Please select a file to upload. Simulated records without real storage are disallowed.');
      return;
    }
    setIsUploadingDoc(true);
    setDocUploadError(null);
    try {
      await onAddDocument(selectedProject.id, {
        title: docTitle.trim() || selectedFile.name,
        classification: docClass,
        uploadedBy: currentUser?.fullName || docAuthor.trim() || 'Project Member',
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        mimeType: selectedFile.type || 'application/octet-stream',
        fileBase64,
      });
      setDocTitle('');
      setDocAuthor('');
      setSelectedFile(null);
      setFileBase64(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setDocUploadError(err.message || 'Failed to upload document to secure vault');
    } finally {
      setIsUploadingDoc(false);
    }
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
    <div className="max-w-[1500px] mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <section className="bg-white border border-[#E5DDD0] rounded-2xl p-5 sm:p-6 lg:p-8 shadow-xs relative overflow-hidden">
        <CarthageCornerMotif className="w-8 h-8 absolute top-2 right-2 pointer-events-none opacity-40 text-[#8C6527]" />
        <ShieldWatermark className="w-64 h-64 absolute -right-12 -bottom-12 pointer-events-none opacity-[0.08] text-[#0F2038]" />
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="text-xs font-bold tracking-wider text-[#8C6527] uppercase font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8C6527] animate-pulse" />
              <span>Qartinia Projects · Protected Collaboration Infrastructure</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F2038] tracking-tight">
              Move from discovery to a protected project with the right people.
            </h1>
            <p className="text-xs sm:text-sm text-[#5A6E85] leading-relaxed">
              Companies, universities, labs and experts collaborate inside structured project rooms. Permissions, documents, milestones and technical exchanges remain strictly inside the project boundary.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 text-xs font-bold text-white bg-[#0F2038] hover:bg-[#1A365D] rounded-xl transition-all flex items-center gap-2 self-start cursor-pointer whitespace-nowrap shadow-xs"
          >
            <Plus className="w-4 h-4 text-[#C5A880]" />
            <span>New Protected Project Room</span>
          </button>
        </div>
      </section>

      {/* 2. Deliberate Trust Architecture Segregation Banner */}
      <div className="p-4 rounded-xl bg-white border border-[#E5DDD0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3 text-xs sm:text-sm text-[#0F2038]">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            <strong className="text-[#0F2038] font-serif">Deliberate Trust Architecture:</strong> Private project-room messages, discussions and files are segregated from Qartinia&apos;s shared intelligence corpus and are never used to train or improve the shared model.
          </span>
        </div>
        <span className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-lg shrink-0">
          Corpus Isolation: Active
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: Project Rooms List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="text-xs font-mono font-bold text-[#8C6527] uppercase tracking-wider">
            PROTECTED PROJECT ROOMS ({projects.length})
          </div>

          {projects.length === 0 ? (
            <div className="bg-white border border-[#E5DDD0] rounded-2xl p-6 text-center space-y-3 shadow-xs">
              <Lock className="w-6 h-6 text-[#8C6527] mx-auto" />
              <div className="font-serif text-base font-bold text-[#0F2038]">No Active Project Rooms</div>
              <p className="text-xs text-[#5A6E85] leading-relaxed">
                Open a Protected Project Room directly or launch one from any Qartinia Frontier gap analysis to structure NDA, IP, milestones, and technical exchanges.
              </p>
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#0F2038] rounded-xl hover:bg-[#1A365D] cursor-pointer shadow-xs"
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
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FAF4EB] border-[#8C6527] shadow-2xs ring-1 ring-[#8C6527]/30'
                        : 'bg-white border-[#E5DDD0] hover:border-[#D5C8B5] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-[#5A6E85] mb-1">
                      <span className="font-mono font-bold text-[#8C6527]">{room.code}</span>
                      <span className="text-[11px] text-[#5A6E85] font-medium">{room.legalStage}</span>
                    </div>
                    <h2 className="font-serif text-base font-bold text-[#0F2038] mb-1">{room.title}</h2>
                    <p className="text-xs text-[#5A6E85] line-clamp-2 mb-3">{room.problemStatement}</p>
                    <div className="pt-2.5 border-t border-[#EBE3D7] flex items-center justify-between text-[11px] font-mono text-[#5A6E85]">
                      <span>{room.participants.length} Participants</span>
                      <span className={room.ndaStatus === 'Executed' ? 'text-emerald-700 font-semibold' : 'text-amber-700'}>
                        NDA: {room.ndaStatus}
                      </span>
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
              <div className="bg-white border border-[#E5DDD0] rounded-2xl p-6 space-y-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#EBE3D7]">
                  <div>
                    <div className="text-xs text-[#5A6E85] mb-1 flex items-center gap-2">
                      <span className="font-mono font-bold text-[#8C6527]">{selectedProject.code}</span>
                      <span>· {selectedProject.domain} · Created {selectedProject.createdAt}</span>
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-[#0F2038]">{selectedProject.title}</h2>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={handleNdaToggle}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl border cursor-pointer transition-colors ${
                        selectedProject.ndaStatus === 'Executed'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-amber-50 border-amber-300 text-amber-800'
                      }`}
                      title={selectedProject.ndaStatus === 'Executed' ? 'NDA Executed (Verified by Executed Document in Vault)' : 'Click to execute NDA (Requires signed NDA document in vault)'}
                    >
                      NDA: {selectedProject.ndaStatus}
                    </button>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-3 py-1.5 text-xs font-semibold text-[#0F2038] bg-white hover:bg-[#FAF8F5] border border-[#E5DDD0] rounded-xl flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-2xs"
                      title="Export or print room charter and IP schedule"
                    >
                      <Download className="w-3.5 h-3.5 text-[#5A6E85]" />
                      <span>Export Charter</span>
                    </button>

                    {/* Delete Project Room button */}
                    {permissions.canDeleteProjects && (
                      <button
                        type="button"
                        onClick={() => onDeleteProject(selectedProject.id)}
                        aria-label="Delete Project Room"
                        title="Delete Project Room (Admin Only)"
                        className="p-2 text-[#5A6E85] hover:text-rose-600 border border-[#E5DDD0] rounded-xl hover:bg-rose-50 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {ndaNotice && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{ndaNotice}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNdaNotice(null)}
                      className="p-1 text-amber-700 hover:text-amber-900 rounded cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Structured Legal Stages Controller */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#8C6527] uppercase font-mono tracking-wider">
                      STRUCTURED LEGAL &amp; HANDOVER STAGE
                    </span>
                    {!permissions.canEditProjectGovernance && (
                      <span className="text-[10px] font-mono text-[#5A6E85]">
                        Read-Only (Admin / Lead Authorized)
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    {LEGAL_STAGES.map((stage, idx) => {
                      const isCurrent = selectedProject.legalStage === stage;
                      if (!permissions.canEditProjectGovernance) {
                        return (
                          <div
                            key={stage}
                            className={`p-2.5 rounded-xl border text-left ${
                              isCurrent
                                ? 'bg-[#0F2038] text-white border-[#0F2038] font-bold shadow-xs'
                                : 'bg-[#FAF8F5] text-[#5A6E85] border-[#E5DDD0]'
                            }`}
                          >
                            <div className="text-[10px] font-mono opacity-80">Stage 0{idx + 1}</div>
                            <div className="text-xs font-semibold mt-0.5 leading-snug">{stage}</div>
                          </div>
                        );
                      }
                      return (
                        <button
                          key={stage}
                          type="button"
                          onClick={() =>
                            onUpdateProjectStageOrGovernance(selectedProject.id, { legalStage: stage })
                          }
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-[#0F2038] text-white border-[#0F2038] font-bold shadow-xs'
                              : 'bg-[#FAF8F5] text-[#0F2038] border-[#E5DDD0] hover:border-[#D5C8B5]'
                          }`}
                        >
                          <div className="text-[10px] font-mono text-[#8C6527] font-semibold">Stage 0{idx + 1}</div>
                          <div className="text-xs font-semibold mt-0.5 leading-snug">{stage}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Governance Summary Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EBE3D7]">
                    <span className="text-[#5A6E85] block mb-0.5 font-medium">IP Ownership Framework</span>
                    <strong className="text-[#0F2038] font-serif">{selectedProject.ipFramework}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EBE3D7]">
                    <span className="text-[#5A6E85] block mb-0.5 font-medium">Publication Rights Policy</span>
                    <strong className="text-[#0F2038] font-serif">{selectedProject.publicationPolicy}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EBE3D7]">
                    <span className="text-[#5A6E85] block mb-0.5 font-medium">Target Engineering Spec</span>
                    <strong className="text-[#8C6527] font-mono">
                      {selectedProject.targetSpec || 'Defined in Room Scope'}
                    </strong>
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-[#5A6E85] leading-relaxed pt-2 border-t border-[#EBE3D7]">
                  <strong className="text-[#0F2038]">Engineering Scope: </strong>
                  {selectedProject.problemStatement}
                </div>
              </div>

              {/* Participants & Milestones Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Boundary Participants */}
                <div className="bg-white border border-[#E5DDD0] rounded-2xl p-5 space-y-4 shadow-xs">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#0F2038] font-serif">
                    <Users className="w-4 h-4 text-[#8C6527]" />
                    <span>Project Boundary Participants ({selectedProject.participants.length})</span>
                  </div>

                  {selectedProject.participants.length === 0 ? (
                    <p className="text-xs text-[#5A6E85]">
                      Add industry engineers, university PIs, or legal counsel to grant room permissions.
                    </p>
                  ) : (
                    <div className="divide-y divide-[#EBE3D7]">
                      {selectedProject.participants.map((p) => (
                        <div key={p.id} className="py-2.5 first:pt-0 last:pb-0 text-xs">
                          <div className="font-bold text-[#0F2038]">{p.name}</div>
                          <div className="text-[#5A6E85]">
                            {p.organization} · {p.role}
                          </div>
                          <div className="text-[11px] font-mono text-[#8C6527] mt-0.5">
                            Access: {p.accessScope}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <form onSubmit={handleAddParticipantSubmit} className="pt-3 border-t border-[#EBE3D7] space-y-2.5">
                    <div className="text-xs font-semibold text-[#0F2038]">Add Collaborator to Boundary</div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        value={partName}
                        onChange={(e) => setPartName(e.target.value)}
                        placeholder="Full name"
                        className="px-2.5 py-1.5 text-xs bg-white border border-[#E5DDD0] rounded-lg text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                      />
                      <input
                        type="text"
                        required
                        value={partOrg}
                        onChange={(e) => setPartOrg(e.target.value)}
                        placeholder="Organization / Lab"
                        className="px-2.5 py-1.5 text-xs bg-white border border-[#E5DDD0] rounded-lg text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={partRole}
                        onChange={(e) => setPartRole(e.target.value as ProjectParticipant['role'])}
                        className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-[#E5DDD0] rounded-lg text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                      >
                        <option value="Industry Lead">Industry Lead</option>
                        <option value="University / Lab PI">University / Lab PI</option>
                        <option value="Domain Specialist">Domain Specialist</option>
                        <option value="IP & Legal Counsel">IP &amp; Legal Counsel</option>
                      </select>
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#0F2038] hover:bg-[#1A365D] rounded-lg cursor-pointer transition-colors shadow-2xs"
                      >
                        Add
                      </button>
                    </div>
                  </form>
                </div>

                {/* Technical Milestones */}
                <div className="bg-white border border-[#E5DDD0] rounded-2xl p-5 space-y-4 shadow-xs">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#0F2038] font-serif">
                    <Flag className="w-4 h-4 text-[#8C6527]" />
                    <span>Technical Milestones &amp; Gates ({selectedProject.milestones.length})</span>
                  </div>

                  {selectedProject.milestones.length === 0 ? (
                    <p className="text-xs text-[#5A6E85]">
                      No milestones defined yet. Add verification gates below.
                    </p>
                  ) : (
                    <div className="divide-y divide-[#EBE3D7]">
                      {selectedProject.milestones.map((ms) => (
                        <div key={ms.id} className="py-2.5 first:pt-0 last:pb-0 flex items-start justify-between gap-2 text-xs">
                          <div>
                            <div className="font-bold text-[#0F2038]">{ms.title}</div>
                            <div className="text-[#5A6E85]">{ms.deliverable}</div>
                            <div className="text-[11px] font-mono text-[#8C6527]">Due: {ms.dueDate}</div>
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
                            className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border shrink-0 cursor-pointer transition-colors ${
                              ms.status === 'Verified'
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                : 'bg-[#FAF8F5] border-[#E5DDD0] text-[#0F2038] hover:bg-white'
                            }`}
                          >
                            {ms.status}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <form onSubmit={handleAddMilestoneSubmit} className="pt-3 border-t border-[#EBE3D7] space-y-2.5">
                    <div className="text-xs font-semibold text-[#0F2038]">Add Technical Milestone</div>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        required
                        value={msTitle}
                        onChange={(e) => setMsTitle(e.target.value)}
                        placeholder="Milestone title"
                        className="col-span-2 px-2.5 py-1.5 text-xs bg-white border border-[#E5DDD0] rounded-lg text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                      />
                      <input
                        type="text"
                        value={msDue}
                        onChange={(e) => setMsDue(e.target.value)}
                        placeholder="Target date"
                        className="col-span-1 px-2.5 py-1.5 text-xs font-mono bg-white border border-[#E5DDD0] rounded-lg text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={msDeliverable}
                        onChange={(e) => setMsDeliverable(e.target.value)}
                        placeholder="Required experimental deliverable"
                        className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-[#E5DDD0] rounded-lg text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#0F2038] hover:bg-[#1A365D] rounded-lg cursor-pointer transition-colors shadow-2xs"
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
                <div className="md:col-span-5 bg-white border border-[#E5DDD0] rounded-2xl p-5 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#0F2038] font-serif">
                      <FileText className="w-4 h-4 text-[#8C6527]" />
                      <span>Protected Vault Documents ({selectedProject.documents.length})</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-300">
                      Private Vault
                    </span>
                  </div>

                  {selectedProject.documents.length === 0 ? (
                    <p className="text-xs text-[#5A6E85] py-3 text-center border border-dashed border-[#E5DDD0] rounded-xl">
                      No documents logged in this project room yet.
                    </p>
                  ) : (
                    <div className="divide-y divide-[#EBE3D7] max-h-72 overflow-y-auto pr-1">
                      {selectedProject.documents.map((d) => (
                        <div key={d.id} className="py-2.5 first:pt-0 last:pb-0 text-xs flex items-center justify-between gap-2 group">
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-[#0F2038] truncate flex items-center gap-1.5">
                              <span className="truncate">{d.title}</span>
                              {d.fileSize ? (
                                <span className="text-[10px] text-[#718096] font-mono shrink-0">
                                  ({formatFileSize(d.fileSize)})
                                </span>
                              ) : null}
                            </div>
                            <div className="text-[11px] text-[#5A6E85] truncate flex items-center gap-1.5 mt-0.5">
                              <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-medium border ${
                                d.classification === 'Mutual NDA'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : d.classification === 'IP Term Sheet'
                                  ? 'bg-purple-50 text-purple-800 border-purple-300'
                                  : d.classification === 'Simulation / Test Data'
                                  ? 'bg-blue-50 text-blue-800 border-blue-300'
                                  : 'bg-amber-50 text-amber-800 border-amber-300'
                              }`}>
                                {d.classification}
                              </span>
                              <span>·</span>
                              <span className="truncate">{d.uploadedBy}</span>
                              <span>·</span>
                              <span className="font-mono text-[10px] shrink-0">{d.timestamp}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleDownloadDoc(d)}
                              disabled={downloadingDocId === d.id}
                              className="p-1.5 text-[#5A6E85] hover:text-[#0F2038] hover:bg-[#FAF8F5] rounded-lg cursor-pointer transition-colors"
                              title="Download via secure short-lived signed URL"
                            >
                              {downloadingDocId === d.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8C6527]" />
                              ) : (
                                <Download className="w-3.5 h-3.5" />
                              )}
                            </button>
                            {permissions.canEditProjectGovernance && (
                              <button
                                type="button"
                                onClick={() => handleDeleteDoc(d.id)}
                                className="p-1.5 text-[#5A6E85] hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                                title="Delete document from project vault"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <form onSubmit={handleAddDocumentSubmit} className="pt-3 border-t border-[#EBE3D7] space-y-3">
                    <div className="text-xs font-semibold text-[#0F2038] flex items-center justify-between">
                      <span>Secure File Upload</span>
                      <span className="text-[10px] text-[#5A6E85] font-normal">Encrypted &amp; Isolated</span>
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      id="project-room-file-input"
                    />

                    {selectedFile ? (
                      <div className="flex items-center justify-between p-2.5 bg-[#FAF8F5] border border-[#E5DDD0] rounded-xl text-xs">
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-4 h-4 text-[#8C6527] shrink-0" />
                          <div className="truncate font-medium text-[#0F2038]">{selectedFile.name}</div>
                          <span className="text-[#718096] font-mono text-[11px] shrink-0">
                            ({formatFileSize(selectedFile.size)})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setFileBase64(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="text-[#5A6E85] hover:text-rose-600 p-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="project-room-file-input"
                        className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-[#E5DDD0] bg-[#FAF8F5] rounded-xl hover:border-[#D5C8B5] hover:bg-white cursor-pointer transition-colors text-center"
                      >
                        <Upload className="w-4 h-4 text-[#8C6527] mb-1" />
                        <span className="text-xs font-semibold text-[#0F2038]">Choose file to upload</span>
                        <span className="text-[10px] text-[#5A6E85]">PDF, CSV, ZIP, JSON, PNG (up to 50MB)</span>
                      </label>
                    )}

                    <input
                      type="text"
                      value={docTitle}
                      onChange={(e) => setDocTitle(e.target.value)}
                      placeholder="Document title (optional, defaults to filename)"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                    />

                    <div className="flex items-center gap-2">
                      <select
                        value={docClass}
                        onChange={(e) => setDocClass(e.target.value as ProjectDocument['classification'])}
                        className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                      >
                        <option value="Mutual NDA">Mutual NDA</option>
                        <option value="IP Term Sheet">IP Term Sheet</option>
                        <option value="Simulation / Test Data">Simulation / Test Data</option>
                        <option value="Datasheet / Spec">Datasheet / Spec</option>
                      </select>
                      <button
                        type="submit"
                        disabled={isUploadingDoc || !selectedFile}
                        className="px-4 py-1.5 text-xs font-bold text-white bg-[#0F2038] hover:bg-[#1A365D] rounded-xl disabled:opacity-50 flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                      >
                        {isUploadingDoc ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload</span>
                          </>
                        )}
                      </button>
                    </div>

                    {docUploadError && (
                      <div className="p-2 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                        <span>{docUploadError}</span>
                      </div>
                    )}
                  </form>
                </div>

                {/* Protected Technical Exchange Chat */}
                <div className="md:col-span-7 bg-white border border-[#E5DDD0] rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xs">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-[#EBE3D7]">
                      <div>
                        <h3 className="font-serif text-base font-bold text-[#0F2038]">
                          Protected Technical Exchanges
                        </h3>
                        <p className="text-[11px] text-[#5A6E85]">
                          Collaboration infrastructure only — strictly excluded from shared-model training data.
                        </p>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-300">
                        Zero-Training Vault
                      </span>
                    </div>

                    <div className="py-4 space-y-3 max-h-64 overflow-y-auto">
                      {selectedProject.messages.length === 0 ? (
                        <p className="text-xs text-[#5A6E85] text-center py-6">
                          No technical messages in this project room yet. Start the protected exchange below.
                        </p>
                      ) : (
                        selectedProject.messages.map((msg) => (
                          <div key={msg.id} className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EBE3D7] text-xs space-y-1">
                            <div className="flex items-center justify-between text-[#5A6E85]">
                              <span>
                                <strong className="text-[#0F2038]">{msg.senderName}</strong> ({msg.senderOrg})
                              </span>
                              <span className="font-mono text-[10px]">{msg.timestamp}</span>
                            </div>
                            <p className="text-[#0F2038] leading-relaxed">{msg.content}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <form onSubmit={handleSendChatSubmit} className="pt-3 border-t border-[#EBE3D7] space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={chatSenderName}
                        onChange={(e) => setChatSenderName(e.target.value)}
                        placeholder="Your name"
                        className="px-2.5 py-1.5 text-xs bg-white border border-[#E5DDD0] rounded-lg text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                      />
                      <input
                        type="text"
                        value={chatSenderOrg}
                        onChange={(e) => setChatSenderOrg(e.target.value)}
                        placeholder="Your organization / lab"
                        className="px-2.5 py-1.5 text-xs bg-white border border-[#E5DDD0] rounded-lg text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        required
                        value={chatContent}
                        onChange={(e) => setChatContent(e.target.value)}
                        placeholder="Transmit technical exchange inside protected project boundary..."
                        className="flex-1 px-3 py-2 text-xs bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-2 text-xs font-bold text-white bg-[#0F2038] hover:bg-[#1A365D] rounded-xl flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                      >
                        <Send className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span>Send</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#E5DDD0] rounded-2xl p-10 text-center space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#E5DDD0] flex items-center justify-center mx-auto text-[#8C6527]">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-xl font-bold text-[#0F2038]">
                Protected Project Infrastructure
              </h2>
              <p className="text-sm text-[#5A6E85] max-w-lg mx-auto leading-relaxed">
                Select an existing project room on the left or create a new Protected Project Room to structure NDA, IP ownership, publication rights, milestones, and segregated technical communication.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Window: Create Protected Project Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-[#0F2038]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <form
            onSubmit={handleCreateSubmit}
            className="bg-white border border-[#E5DDD0] rounded-2xl max-w-lg w-full p-6 max-h-[92vh] overflow-y-auto shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#EBE3D7]">
              <div>
                <div className="text-xs font-mono font-bold text-[#8C6527] uppercase">Qartinia Projects</div>
                <h2 className="font-serif text-lg font-bold text-[#0F2038]">
                  Open Protected Project Room
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  if (onClearPendingDraft) onClearPendingDraft();
                }}
                className="p-1 text-[#5A6E85] hover:text-[#0F2038] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 py-2 text-xs">
              <div>
                <label className="block text-xs font-semibold text-[#0F2038] mb-1">
                  Project Room Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter project room title"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F2038] mb-1">
                    Engineering Domain
                  </label>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="Domain"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F2038] mb-1">
                    Target Performance Spec
                  </label>
                  <input
                    type="text"
                    value={targetSpec}
                    onChange={(e) => setTargetSpec(e.target.value)}
                    placeholder="Target metric &amp; envelope"
                    className="w-full px-3 py-2 text-xs font-mono bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F2038] mb-1">
                  Engineering Problem &amp; Collaboration Scope *
                </label>
                <textarea
                  rows={3}
                  required
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  placeholder="Define the technical gap, experimental plan, and handover criteria"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F2038] mb-1">
                    Invited Lab / Researcher Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="PI or specialist name"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F2038] mb-1">
                    Partner Institution / Company
                  </label>
                  <input
                    type="text"
                    value={partnerOrg}
                    onChange={(e) => setPartnerOrg(e.target.value)}
                    placeholder="University, lab, or supplier"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F2038] mb-1">
                    IP Ownership Framework
                  </label>
                  <select
                    value={ipFramework}
                    onChange={(e) => setIpFramework(e.target.value as ProtectedProjectRoom['ipFramework'])}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
                  >
                    <option value="Background IP Segregated">Background IP Segregated</option>
                    <option value="Joint Foreground IP">Joint Foreground IP</option>
                    <option value="Exclusive Commercial Option">Exclusive Commercial Option</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0F2038] mb-1">
                    Publication Rights Policy
                  </label>
                  <select
                    value={publicationPolicy}
                    onChange={(e) =>
                      setPublicationPolicy(e.target.value as ProtectedProjectRoom['publicationPolicy'])
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E5DDD0] rounded-xl text-[#0F2038] focus:outline-none focus:border-[#8C6527] focus:ring-1 focus:ring-[#8C6527]"
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

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EBE3D7]">
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  if (onClearPendingDraft) onClearPendingDraft();
                }}
                className="px-4 py-2 text-xs font-semibold text-[#5A6E85] border border-[#E5DDD0] rounded-xl hover:bg-[#FAF8F5] hover:text-[#0F2038] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-[#0F2038] hover:bg-[#1A365D] rounded-xl cursor-pointer font-serif shadow-xs"
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
