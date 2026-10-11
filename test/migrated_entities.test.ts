import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  fetchSupabaseProjects,
  syncProjectToCatalog,
  createAndBroadcastNotification,
  fetchSupabaseNotifications,
  filterNotificationsForActor,
} from '../server.js';

describe('Migrated Supabase Entities Data Layer Test', () => {
  it('verifies SQL migration schema and tightened RLS policy constraints', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const migrationPath = path.join(process.cwd(), 'supabase/migrations/20261009_01_catalog_entities.sql');
    assert.equal(fs.existsSync(migrationPath), true);
    const sql = fs.readFileSync(migrationPath, 'utf-8');
    assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.catalog/);
    assert.match(sql, /idx_catalog_type/);
    assert.match(sql, /idx_catalog_pub_state/);
    assert.match(sql, /ENABLE ROW LEVEL SECURITY/);
    
    // Check tightened INSERT policy requiring created_by = auth.uid() for ordinary users
    assert.match(sql, /created_by = auth\.uid\(\)/);
    assert.match(sql, /profiles\.role IN \('admin', 'platform_admin'\)/);

    // Verify private project-room records are excluded from public catalog reads
    assert.match(sql, /type NOT IN \('project_room', 'direct_message'\)/);
  });

  it('fetchSupabaseProjects uses Supabase exclusively and returns an array when initialized or throws when uninitialized/query fails', async () => {
    const projects = await fetchSupabaseProjects();
    assert.equal(Array.isArray(projects), true);
  });

  it('syncProjectToCatalog throws explicit error on failure or uninitialized client', async () => {
    const sampleProject: any = {
      id: 'test-prj-001',
      title: 'Test Project',
      domain: 'Thermal',
      code: 'ORG-001',
      legalStage: 'Scoping & Mutual NDA',
      ndaStatus: 'Executed',
      problemStatement: 'Testing sync error',
      ipFramework: 'Background IP Segregated',
      publicationPolicy: '30-Day Pre-Publication Patent Review',
      trainingScope: 'Internal',
      leadOrganization: 'Test Corp',
      targetSpec: '100W',
      createdById: '00000000-0000-0000-0000-000000000001',
      participants: [],
      milestones: [],
      documents: [],
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await assert.rejects(
      async () => {
        await syncProjectToCatalog(sampleProject);
      },
      {
        name: 'Error',
      }
    );
  });

  it('createAndBroadcastNotification persists to Supabase or throws explicit error on insert failure', async () => {
    const notifData = {
      type: 'request_status_updated' as const,
      title: 'Test Notification',
      message: 'Testing notification persistence',
      recipientUserId: '00000000-0000-0000-0000-000000000002',
    };

    try {
      const result = await createAndBroadcastNotification(notifData);
      assert.equal(result.title, 'Test Notification');
      assert.equal(Boolean(result.id), true);
    } catch (err: any) {
      assert.match(err.message, /Failed to persist notification|Supabase/);
    }
  });

  it('fetchSupabaseNotifications queries Supabase authoritatively or throws explicit error on read failure', async () => {
    const mockActor: any = {
      id: '00000000-0000-0000-0000-000000000002',
      email: 'user@example.com',
      fullName: 'Test User',
      role: 'user',
    };

    try {
      const notifs = await fetchSupabaseNotifications(mockActor, []);
      assert.equal(Array.isArray(notifs), true);
    } catch (err: any) {
      assert.match(err.message, /Failed to fetch notifications|Supabase/);
    }
  });

  it('filterNotificationsForActor enforces direct-recipient and project-participant authorization', () => {
    const directNotif: any = {
      id: 'notif-1',
      recipientUserId: 'usr-123',
      title: 'Direct Alert',
      message: 'Direct notification message',
      createdAt: new Date().toISOString(),
    };

    const projectNotif: any = {
      id: 'notif-2',
      title: 'Project Milestone Alert',
      message: 'Milestone updated',
      linkSection: 'projects',
      linkId: 'prj-alpha',
      metadata: { projectId: 'prj-alpha' },
      createdAt: new Date().toISOString(),
    };

    const targetActor: any = {
      id: 'usr-123',
      email: 'alice@org-a.com',
      role: 'user',
    };

    const unrelatedActor: any = {
      id: 'usr-999',
      email: 'bob@org-b.com',
      role: 'user',
    };

    const sampleProject: any = { id: 'prj-alpha' };

    // 1. Direct recipient receives direct non-project notification
    const directRes = filterNotificationsForActor([directNotif], targetActor, undefined);
    assert.equal(directRes.length, 1);

    // 2. Unrelated user does NOT receive direct notification
    const directResUnrelated = filterNotificationsForActor([directNotif], unrelatedActor, undefined);
    assert.equal(directResUnrelated.length, 0);

    // 3. Project notification is DENIED when accessibleProjects is undefined or does not contain project
    const projResDenied = filterNotificationsForActor([projectNotif], targetActor, undefined);
    assert.equal(projResDenied.length, 0);

    // 4. Project notification is ALLOWED when accessibleProjects contains project ID
    const projResAllowed = filterNotificationsForActor([projectNotif], targetActor, [sampleProject]);
    assert.equal(projResAllowed.length, 1);
  });
});

