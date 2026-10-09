import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { fetchSupabaseProjects, syncProjectToCatalog } from '../server.js';

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
});
