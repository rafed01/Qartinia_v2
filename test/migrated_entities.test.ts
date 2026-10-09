import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Migrated Supabase Entities Data Layer Test', () => {
  it('verifies SQL migration schema exists for catalog entities', async () => {
    const fs = await import('fs');
    const path = await import('path');
    const migrationPath = path.join(process.cwd(), 'supabase/migrations/20261009_01_catalog_entities.sql');
    assert.equal(fs.existsSync(migrationPath), true);
    const sql = fs.readFileSync(migrationPath, 'utf-8');
    assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.catalog/);
    assert.match(sql, /idx_catalog_type/);
    assert.match(sql, /idx_catalog_pub_state/);
    assert.match(sql, /ENABLE ROW LEVEL SECURITY/);
  });
});
