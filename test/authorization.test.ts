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

    // Participant Alice receives the notification when accessibleProjects contains sampleProject
    const participantNotifs = filterNotificationsForActor(notifs, userOrgA_Participant, [sampleProject]);
    assert.equal(participantNotifs.length, 1);

    // Non-participant Bob from same org is filtered out
    const nonParticipantNotifs = filterNotificationsForActor(notifs, userOrgA_NonParticipant, []);
    assert.equal(nonParticipantNotifs.length, 0);

    // External Org B user is filtered out
    const externalNotifs = filterNotificationsForActor(notifs, userOrgB, []);
    assert.equal(externalNotifs.length, 0);

    // Admin receives notification even without accessibleProjects
    const adminNotifs = filterNotificationsForActor(notifs, adminUser, undefined);
    assert.equal(adminNotifs.length, 1);
  });

  it('strictly denies project-related notifications to non-admins when accessibleProjects is undefined or missing the project ID, even if addressed to recipient ID or email', () => {
    const directRecipientProjectNotif: NotificationItem = {
      id: 'notif-direct-01',
      type: 'project_added',
      title: 'Direct Project Update',
      message: 'Confidential project update',
      linkSection: 'projects',
      linkId: 'prj-test-01',
      recipientUserId: userOrgA_Participant.id,
      recipientEmail: userOrgA_Participant.email,
      read: false,
      timestamp: 'Just now',
      createdAt: new Date().toISOString(),
      metadata: { projectId: 'prj-test-01' },
    };

    const notifs = [directRecipientProjectNotif];

    // 1. When accessibleProjects is undefined, non-admin recipient is denied access
    const undefinedProjectsNotifs = filterNotificationsForActor(notifs, userOrgA_Participant, undefined);
    assert.equal(undefinedProjectsNotifs.length, 0, 'Must deny access when accessibleProjects is undefined');

    // 2. When accessibleProjects does not contain the project ID, non-admin recipient is denied access
    const wrongProjectNotifs = filterNotificationsForActor(notifs, userOrgA_Participant, []);
    assert.equal(wrongProjectNotifs.length, 0, 'Must deny access when accessibleProjects does not contain the project');

    // 3. When accessibleProjects contains the project ID, non-admin recipient receives the notification
    const authorizedNotifs = filterNotificationsForActor(notifs, userOrgA_Participant, [sampleProject]);
    assert.equal(authorizedNotifs.length, 1, 'Must grant access when actor is authorized for the project and recipient matches');

    // 4. Admin receives direct project notification addressed to admin even when accessibleProjects is undefined
    const adminDirectNotif: NotificationItem = {
      ...directRecipientProjectNotif,
      recipientUserId: adminUser.id,
      recipientEmail: adminUser.email,
    };
    const adminDirectNotifs = filterNotificationsForActor([adminDirectNotif], adminUser, undefined);
    assert.equal(adminDirectNotifs.length, 1, 'Admin receives direct project notification addressed to admin even when accessibleProjects is undefined');

    // 5. Admin receives broadcast project notification even when accessibleProjects is undefined
    const adminBroadcastNotif: NotificationItem = {
      id: 'notif-admin-bc',
      type: 'project_added',
      title: 'Broadcast Project Update',
      message: 'Broadcasting project update',
      linkSection: 'projects',
      linkId: 'prj-test-01',
      read: false,
      timestamp: 'Just now',
      createdAt: new Date().toISOString(),
      metadata: { projectId: 'prj-test-01' },
    };
    const adminBroadcastResult = filterNotificationsForActor([adminBroadcastNotif], adminUser, undefined);
    assert.equal(adminBroadcastResult.length, 1, 'Admin receives broadcast project notification even when accessibleProjects is undefined');
  });

  it('preserves existing direct recipient behavior for non-project notifications when accessibleProjects is undefined', () => {
    const nonProjectNotif: NotificationItem = {
      id: 'notif-general-01',
      type: 'general',
      title: 'System Maintenance',
      message: 'Maintenance scheduled',
      linkSection: 'dashboard',
      linkId: 'maint-1',
      recipientUserId: userOrgA_Participant.id,
      recipientEmail: userOrgA_Participant.email,
      read: false,
      timestamp: 'Just now',
      createdAt: new Date().toISOString(),
    };

    const notifs = [nonProjectNotif];

    // Direct recipient receives non-project notification when accessibleProjects is undefined
    const result = filterNotificationsForActor(notifs, userOrgA_Participant, undefined);
    assert.equal(result.length, 1, 'Non-project notifications must work for direct recipients even when accessibleProjects is undefined');

    // Unrelated user does not receive direct non-project notification
    const wrongUserResult = filterNotificationsForActor(notifs, userOrgA_NonParticipant, undefined);
    assert.equal(wrongUserResult.length, 0, 'Unrelated user must not receive direct non-project notification');
  });

  it('denies organization management to ordinary non-owner/non-admin users without stored permissions', async () => {
    const isLeader = await isAuthorizedOrgLeaderOrAdmin(userOrgA_Participant, 'org-a-id');
    assert.equal(isLeader, false);
  });

  it('enforces organization isolation: notifications targeted at Org A are filtered out for Org B users', () => {
    const orgANotif: NotificationItem = {
      id: 'notif-org-a',
      type: 'general',
      title: 'Org A Policy Notice',
      message: 'Confidential internal update for Org A',
      recipientOrg: 'Org A',
      read: false,
      timestamp: 'Just now',
      createdAt: new Date().toISOString(),
    };

    // User in Org A receives Org A notification
    const orgAResult = filterNotificationsForActor([orgANotif], userOrgA_Participant, undefined);
    assert.equal(orgAResult.length, 1, 'Member of Org A must receive Org A notification');

    // User in Org B does NOT receive Org A notification
    const orgBResult = filterNotificationsForActor([orgANotif], userOrgB, undefined);
    assert.equal(orgBResult.length, 0, 'Member of Org B must NOT receive Org A notification');
  });

  it('enforces cross-user read protection: User A cannot see User B private notifications', () => {
    const userBNotif: NotificationItem = {
      id: 'notif-user-b-private',
      type: 'general',
      title: 'Private Security Alert for User B',
      message: 'Your password was updated',
      recipientUserId: userOrgB.id,
      read: false,
      timestamp: 'Just now',
      createdAt: new Date().toISOString(),
    };

    // User B receives their own private notification
    const userBResult = filterNotificationsForActor([userBNotif], userOrgB, undefined);
    assert.equal(userBResult.length, 1, 'User B must receive their own private notification');

    // User A does NOT receive User B private notification
    const userAResult = filterNotificationsForActor([userBNotif], userOrgA_Participant, undefined);
    assert.equal(userAResult.length, 0, 'User A must NOT receive User B private notification');
  });
});
