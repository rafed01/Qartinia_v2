export type QartiniaSection =
  | 'dashboard'
  | 'frontier'
  | 'projects'
  | 'evidence'
  | 'suppliers'
  | 'laboratories'
  | 'experts'
  | 'simulations'
  | 'brainstorming'
  | 'community'
  | 'architecture';

export type EvidenceCategory =
  | 'Publication'
  | 'Patent'
  | 'Product Datasheet'
  | 'Standard'
  | 'Research Laboratory'
  | 'Domain Expert';

export type EvidenceProvenanceType =
  | 'verified_empirical'
  | 'peer_reviewed_literature'
  | 'patent_specification'
  | 'ai_synthesis'
  | 'model_estimate';

export interface EvidenceNode {
  id: string;
  title: string;
  category: EvidenceCategory;
  sourceIdentifier: string;
  institutionOrCompany: string;
  leadContributor: string;
  operatingConditions: string;
  demonstratedPerformance: string;
  maturityTrl: string;
  manufacturabilityAndReliability: string;
  relevanceToGap: string;
  linkedFrontierId?: string;
  publicationState?: 'draft' | 'published' | 'archived' | 'in_review';
  provenanceType?: EvidenceProvenanceType;
  verificationStatus?: 'verified' | 'in_review' | 'synthetic_hypothesis' | 'model_estimate';
  confidenceLevel?: 'High' | 'Medium' | 'Analytical';
  doiOrPatentRef?: string;
  conditionAwareMetrics?: Record<string, string | number>;
  createdAt: string;
}

export interface CatalogRelationshipEdge {
  id: string;
  sourceId: string;
  sourceTitle?: string;
  targetId: string;
  targetTitle?: string;
  relationshipType: string;
  description: string;
  createdAt: string;
}

export interface CatalogBookmark {
  id: string;
  userId: string;
  catalogId: string;
  folder: string;
  notes: string;
  createdAt: string;
}

export interface FrontierPositionRow {
  position: 'Customer technology' | 'Commercial frontier' | 'Research frontier' | 'Target';
  valueDisplay: string;
  numericValue?: number;
  meaning: string;
  referenceSource: string;
}

export interface FrontierBenchmark {
  id: string;
  title: string;
  domain: string;
  technologySystem: string;
  metricName: string;
  metricUnit: string;
  operatingEnvelope: string;
  constraints: string;
  positions: FrontierPositionRow[];
  gapRootCauseAnalysis: string;
  whatChangedRecently: string;
  evidenceRecords: EvidenceNode[];
  recommendedNextActions: string[];
  monitored: boolean;
  maturityTrl?: string;
  updatedAt?: string;
  createdAt: string;
  lastEvaluatedAt: string;
}

export type LegalStage =
  | 'Scoping & Mutual NDA'
  | 'IP Ownership & Publication Rights'
  | 'Protected Technical Execution'
  | 'Industrial Handover & Licensing';

export interface ProjectParticipant {
  id: string;
  name: string;
  organization: string;
  role: 'Industry Lead' | 'University / Lab PI' | 'Domain Specialist' | 'IP & Legal Counsel';
  accessScope: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  dueDate: string;
  deliverable: string;
  status: 'Pending' | 'In Progress' | 'Verified';
}

export interface ProjectDocument {
  id: string;
  title: string;
  classification: 'Mutual NDA' | 'IP Term Sheet' | 'Simulation / Test Data' | 'Datasheet / Spec';
  uploadedBy: string;
  timestamp: string;
}

export interface ProjectMessage {
  id: string;
  senderName: string;
  senderOrg: string;
  senderRole: string;
  content: string;
  timestamp: string;
}

export interface ProtectedProjectRoom {
  id: string;
  code: string;
  title: string;
  domain: string;
  originatingFrontierId?: string;
  problemStatement: string;
  targetSpec: string;
  legalStage: LegalStage;
  ndaStatus: 'Pending Signature' | 'Executed';
  ipFramework: 'Background IP Segregated' | 'Joint Foreground IP' | 'Exclusive Commercial Option';
  publicationPolicy: '30-Day Pre-Publication Patent Review' | '90-Day Embargo' | 'Confidential Industrial Only';
  trainingIsolationVerified: boolean;
  participants: ProjectParticipant[];
  milestones: ProjectMilestone[];
  documents: ProjectDocument[];
  messages: ProjectMessage[];
  createdAt: string;
  createdById?: string;
  createdByEmail?: string;
  createdByOrg?: string;
}

// ----------------------------------------------------
// ARCHITECTURE BLUEPRINT ENTITIES
// ----------------------------------------------------

export interface SupplierComponent {
  id: string;
  name: string;
  partNumber: string;
  category: string;
  specSummary: string;
  keyMetrics: Record<string, string>;
  leadTimeWeeks: number;
  sampleAvailable: boolean;
  datasheetUrl?: string;
}

export interface SupplierItem {
  id: string;
  name: string;
  country: string;
  headquarters: string;
  domain: string;
  tier: 'Tier 1 Certified' | 'Tier 2 Qualified' | 'Specialist Fabricator';
  description: string;
  certifications: string[];
  capabilities: string[];
  components: SupplierComponent[];
  contactEmail: string;
  minOrderQuantity: string;
  verified: boolean;
}

export interface LabEquipment {
  id: string;
  name: string;
  model: string;
  manufacturer: string;
  operatingRange: string;
  standardsCompliant: string[];
  sampleThroughput: string;
  hourlyRateEst: string;
}

export interface LabItem {
  id: string;
  name: string;
  institution: string;
  location: string;
  accreditations: string[];
  testingDomains: string[];
  equipmentList: LabEquipment[];
  leadScientist: string;
  availabilityStatus: 'Available' | 'Booking 2-3 Weeks Out' | 'Restricted Access';
  description: string;
  verified: boolean;
}

export interface ExpertItem {
  id: string;
  name: string;
  title: string;
  affiliation: string;
  location: string;
  domainExpertise: string[];
  yearsExperience: number;
  publicationsCount: number;
  patentsCount: number;
  advisoryFee: string;
  availability: 'Open for Consultations' | 'Project Advisory Only' | 'Waitlist';
  bio: string;
  rating: number;
  verified: boolean;
}

export interface BrainstormTask {
  id: string;
  title: string;
  assignee: string;
  status: 'Todo' | 'In Progress' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
}

export interface BrainstormMessage {
  id: string;
  senderName: string;
  senderRole: string;
  content: string;
  isAi?: boolean;
  timestamp: string;
  attachments?: string[];
}

export interface BrainstormRoom {
  id: string;
  title: string;
  topic: string;
  domain: string;
  isPrivate: boolean;
  createdBy: string;
  membersCount: number;
  participants: string[];
  tags: string[];
  summary?: string;
  tasks: BrainstormTask[];
  messages: BrainstormMessage[];
  createdAt: string;
}

export type SimulationToolType = 'SPICE' | 'TCAD' | 'DFT/CASTEP' | 'Multiphysics FEA';

export interface SimulationJob {
  id: string;
  title: string;
  tool: SimulationToolType;
  domain: string;
  status: 'Queued' | 'Running' | 'Completed' | 'Failed';
  parameters: Record<string, string | number>;
  runtimeSeconds: number;
  submittedAt: string;
  completedAt?: string;
  summaryMetrics?: Record<string, string>;
  outputWaveformData?: { time: number; value: number }[];
  resultReport?: string;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  type: 'Paper' | 'Standard' | 'Technical Tutorial' | 'Datasheet' | 'Patent';
  authorsOrOrg: string;
  doiOrRef: string;
  domain: string;
  abstract: string;
  keyFindings: string[];
  tags: string[];
  citationsCount: number;
  year: number;
  downloadUrl?: string;
}

export type UserRole =
  | 'admin'
  | 'company'
  | 'employee'
  | 'user'
  | 'platform_admin'
  | 'enterprise_admin'
  | 'enterprise_employee'
  | 'researcher'
  | 'startup_founder'
  | 'supplier'
  | 'expert'
  | 'lab_director';

export type AccountStatus =
  | 'approved'
  | 'pending'
  | 'rejected'
  | 'onboarding'
  | 'pending_approval';

export interface UserAccount {
  id: string;
  email: string;
  fullName: string;
  username?: string;
  role: string;
  status: string;
  approvalStatus: string;
  organizationName: string;
  organizationId: string | null;
  focusArea: string | null;
  department: string;
  title: string;
  taxId: string | null;
  techStack: string[];
  bio: string | null;
  avatarUrl?: string | null;
  domainExpertise?: string[];
  credentials?: string | null;
  advisoryHistory?: string | null;
  linkedinUrl?: string | null;
  timezone?: string | null;
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface SocialPost {
  id: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  authorRole: string;
  authorOrg: string;
  authorAvatarUrl?: string;
  content: string;
  imageUrl?: string;
  likesCount: number;
  likedBy?: string[];
  tags?: string[];
  createdAt: string;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface UserConnection {
  id: string;
  requesterId: string;
  targetId: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  user?: UserAccount;
}

export interface SupabaseOrganization {
  id: string;
  name: string;
  tier: string;
  approvalStatus: string;
  ownerId: string | null;
  domain: string | null;
  industry: string | null;
  description: string | null;
  createdAt: string;
}

export interface EnterpriseMember {
  id: string;
  organizationId: string;
  organizationName: string;
  userId: string;
  fullName: string;
  email: string;
  role: 'owner' | 'admin' | 'employee' | 'collaborator' | string;
  title: string;
  department: string;
  approvalStatus: string;
  joinedAt: string;
  permissions?: string[];
  status?: 'active' | 'pending' | 'invited' | 'suspended' | 'declined';
  invitedBy?: string;
  lastActive?: string;
}

export type SupabaseRequestType =
  | 'access_briefing'
  | 'nda'
  | 'collaboration_proposal'
  | 'due_diligence'
  | 'report_download'
  | 'challenge_application'
  | 'expert_consultation';

export type SupabaseRequestStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'in_review'
  | 'cancelled';

export interface SupabaseAccessRequest {
  id: string;
  userId?: string;
  name: string;
  email: string;
  organization: string;
  requestType: SupabaseRequestType | string;
  status: SupabaseRequestStatus | string;
  catalogId?: string | null;
  proposalBrief: string;
  decisionNotes?: string | null;
  createdAt: string;
}

export interface AtomicApprovalItem {
  id: string;
  targetProfileId: string;
  organizationId: string | null;
  workflowType: 'top_level_account' | 'enterprise_employee_seat' | 'organization_verification';
  subjectName: string;
  subjectEmail: string;
  organizationName: string;
  requestedRoleOrTier: string;
  notes: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface AuditActivityItem {
  id: string;
  userId?: string | null;
  actor: string;
  action: string;
  target: string;
  category: 'auth' | 'frontier' | 'project' | 'governance' | 'scout_query';
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface DatabaseDiagnosticReport {
  connected: boolean;
  supabaseUrl: string;
  latencyMs: number;
  tables: {
    table: string;
    status: 'OK' | 'ERROR';
    rowCount: number;
    columnsCount: number;
    detail: string;
  }[];
  enums: {
    name: string;
    allowedValues: string[];
    mappingNote: string;
  }[];
  rpcs: {
    name: string;
    status: 'VERIFIED' | 'MISSING';
    purpose: string;
    lastResult?: string;
  }[];
  checkedAt: string;
}

export type NotificationType =
  | 'request_status_updated'
  | 'project_added'
  | 'milestone_created'
  | 'milestone_updated'
  | 'document_uploaded'
  | 'message_received'
  | 'general';

export interface NotificationItem {
  id: string;
  recipientUserId?: string | null;
  recipientEmail?: string | null;
  recipientOrg?: string | null;
  type: NotificationType;
  title: string;
  message: string;
  linkSection?: QartiniaSection;
  linkId?: string;
  read: boolean;
  timestamp: string;
  createdAt: string;
  metadata?: {
    requestId?: string;
    requestType?: string;
    newStatus?: string;
    decisionNotes?: string;
    projectId?: string;
    projectTitle?: string;
    projectCode?: string;
    milestoneId?: string;
    milestoneTitle?: string;
    milestoneStatus?: string;
    actorName?: string;
    actorOrg?: string;
    frontierId?: string;
    memberId?: string;
    email?: string;
    role?: string;
    organizationName?: string;
    [key: string]: any;
  };
}
