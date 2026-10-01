export type EvidenceCategory =
  | 'Publication'
  | 'Patent'
  | 'Product Datasheet'
  | 'Standard'
  | 'Research Laboratory'
  | 'Domain Expert';

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
  | 'startup_founder';

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
  onboardingCompleted: boolean;
  createdAt: string;
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
