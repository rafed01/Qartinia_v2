import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  userHasProjectAccess,
  userCanModifyProject,
  userCanDeleteProject,
  isAuthorizedOrgLeaderOrAdmin,
  filterNotificationsForActor,
  AuthenticatedUser,
  ProtectedProjectRoom,
  NotificationItem,
} from '../server.js';

describe('Qartinia Authorization & Cross-Organization Security Tests', () => {
  const userCreator: AuthenticatedUser = {
    id: 'user-100',
    email: 'creator@orga.com',
    fullName: 'Project Creator',
    role: 'engineer',
    status: 'approved',
    approvalStatus: 'approved',
    organizationName: 'Org A',
    organizationId: 'org-a-id',
  };

  const userOrgA_Participant: AuthenticatedUser = {
    id: 'user-101',
    email: 'alice@orga.com',
    fullName: 'Alice Smith',
    role: 'engineer',
    status: 'approved',
    approvalStatus: 'approved',
    organizationName: 'Org A',
    organizationId: 'org-a-id',
  };

  const userOrgA_NonParticipant: AuthenticatedUser = {
    id: 'user-102',
    email: 'bob@orga.com',
    fullName: 'Bob Smith',
    role: 'engineer',
    status: 'approved',
    approvalStatus: 'approved',
    organizationName: 'Org A',
    organizationId: 'org-a-id',
  };

  const userOrgB: AuthenticatedUser = {
    id: 'user-201',
    email: 'charlie@orgb.com',
    fullName: 'Charlie Davis',
    role: 'engineer',
    status: 'approved',
    approvalStatus: 'approved',
    organizationName: 'Org B',
    organizationId: 'org-b-id',
  };

  const adminUser: AuthenticatedUser = {
    id: 'admin-001',
    email: 'admin@qartinia.com',
    fullName: 'Platform Administrator',
    role: 'admin',
    status: 'approved',
    approvalStatus: 'approved',
    organizationName: 'Qartinia Admin',
    organizationId: 'admin-org-id',
  };

  const sampleProject: ProtectedProjectRoom = {
    id: 'prj-test-01',
    code: 'QRT-RM-9999',
    title: '800V SiC Power Inverter Development',
    domain: 'Power Electronics',
    problemStatement: 'High thermal stress on ceramic substrate',
    targetSpec: '1200V / 400A continuous rating',
    legalStage: 'Scoping & Mutual NDA',
    ndaStatus: 'Executed',
    ipFramework: 'Background IP Segregated',
    publicationPolicy: '30-Day Pre-Publication Patent Review',
    trainingIsolationVerified: true,
    createdById: 'user-100',
    createdByEmail: 'creator@orga.com',
    createdByOrg: 'Org A',
    participants: [
      {
        id: 'user-101',
        name: 'Alice Smith',
        organization: 'Org A',
        role: 'Industry Lead',
        accessScope: 'Full Access',
      },
    ],
    milestones: [],
    documents: [
      {
        id: 'doc-1',
        title: 'Mutual_NDA.pdf',
        classification: 'Mutual NDA',
        uploadedBy: 'Alice Smith',
        uploadedById: 'user-101',
        timestamp: '2026-10-09',
        storagePath: 'prj-test-01/doc-1_Mutual_NDA.pdf',
      },
    ],
    messages: [],
    createdAt: '2026-10-09',
  };

  it('denies access to unauthenticated user (null/undefined actor)', () => {
    assert.equal(userHasProjectAccess(sampleProject, null), false);
    assert.equal(userHasProjectAccess(sampleProject, undefined), false);
  });

  it('grants full read, modify, and delete access to project creator', () => {
    assert.equal(userHasProjectAccess(sampleProject, userCreator), true);
    assert.equal(userCanModifyProject(sampleProject, userCreator), true);
    assert.equal(userCanDeleteProject(sampleProject, userCreator), true);
  });

  it('grants access to authorized participant matching user ID or email', () => {
    assert.equal(userHasProjectAccess(sampleProject, userOrgA_Participant), true);
    assert.equal(userCanModifyProject(sampleProject, userOrgA_Participant), true);
  });

  it('grants full access to platform administrators', () => {
    assert.equal(userHasProjectAccess(sampleProject, adminUser), true);
    assert.equal(userCanModifyProject(sampleProject, adminUser), true);
    assert.equal(userCanDeleteProject(sampleProject, adminUser), true);
  });

  it('enforces cross-organization isolation: user from Org B is denied access', () => {
    assert.equal(userHasProjectAccess(sampleProject, userOrgB), false);
    assert.equal(userCanModifyProject(sampleProject, userOrgB), false);
    assert.equal(userCanDeleteProject(sampleProject, userOrgB), false);
  });

  it('enforces strict explicit project membership: user from Org A NOT in participants is denied access', () => {
    // Org A match alone MUST NOT grant access
    assert.equal(userHasProjectAccess(sampleProject, userOrgA_NonParticipant), false);
    assert.equal(userCanModifyProject(sampleProject, userOrgA_NonParticipant), false);
    assert.equal(userCanDeleteProject(sampleProject, userOrgA_NonParticipant), false);
  });

  it('denies project deletion to non-creator participants', () => {
    // Participant Alice can view & modify, but CANNOT delete if not creator or admin
    assert.equal(userCanDeleteProject(sampleProject, userOrgA_Participant), false);
  });

  it('filters project notifications so non-participants cannot receive private milestone/project alerts', () => {
    const projectNotification: NotificationItem = {
      id: 'notif-001',
      type: 'milestone_created',
      title: 'New Milestone in QRT-RM-9999',
      message: 'Secret milestone posted',
      linkSection: 'projects',
      linkId: 'prj-test-01',
      read: false,
      timestamp: 'Just now',
      createdAt: new Date().toISOString(),
      metadata: { projectId: 'prj-test-01' },
    };

    const notifs = [projectNotification];

    // Participant Alice receives the notification
    const participantNotifs = filterNotificationsForActor(notifs, userOrgA_Participant, [sampleProject]);
    assert.equal(participantNotifs.length, 1);

    // Non-participant Bob from same org is filtered out
    const nonParticipantNotifs = filterNotificationsForActor(notifs, userOrgA_NonParticipant, []);
    assert.equal(nonParticipantNotifs.length, 0);

    // External Org B user is filtered out
    const externalNotifs = filterNotificationsForActor(notifs, userOrgB, []);
    assert.equal(externalNotifs.length, 0);

    // Admin receives notification
    const adminNotifs = filterNotificationsForActor(notifs, adminUser, [sampleProject]);
    assert.equal(adminNotifs.length, 1);
  });

  it('denies organization management to ordinary non-owner/non-admin users without stored permissions', async () => {
    const isLeader = await isAuthorizedOrgLeaderOrAdmin(userOrgA_Participant, 'org-a-id');
    assert.equal(isLeader, false);
  });
});
