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
  | 'platform_admin'
  | 'enterprise_admin'
  | 'enterprise_employee'
  | 'researcher'
  | 'startup_founder';

export type AccountStatus = 'approved' | 'onboarding' | 'pending_approval' | 'rejected';

export interface UserAccount {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: AccountStatus;
  organizationName: string;
  organizationDomain: string;
  department: string;
  title: string;
  createdAt: string;
}

export interface EnterpriseMember {
  id: string;
  fullName: string;
  email: string;
  organizationName: string;
  role: 'Organization Admin' | 'R&D Lead' | 'Technology Scout' | 'IP & Legal Counsel';
  department: string;
  status: 'Active' | 'Pending Approval' | 'Suspended';
  joinedAt: string;
}

export interface AtomicApprovalItem {
  id: string;
  workflowType: 'enterprise_employee_seat' | 'organization_verification' | 'evidence_submission';
  subjectName: string;
  subjectEmail: string;
  organizationName: string;
  requestedRoleOrTier: string;
  notes: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
}

export interface AuditActivityItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  category: 'auth' | 'frontier' | 'project' | 'governance';
  timestamp: string;
}

