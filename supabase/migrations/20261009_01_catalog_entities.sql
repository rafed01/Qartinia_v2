-- Migration: 20261009_01_catalog_entities.sql
-- Description: Core Catalog Table Schema & Tightened RLS Policies for Catalog Entities (Safely Repeatable)

CREATE TABLE IF NOT EXISTS public.catalog (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL, -- 'frontier', 'evidence', 'supplier', 'lab', 'expert', 'knowledge', 'project_room', etc.
  title TEXT NOT NULL,
  category TEXT,
  organization TEXT,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  trl INTEGER DEFAULT 1,
  trl_stage TEXT,
  status TEXT,
  description TEXT,
  location TEXT,
  verified_by TEXT,
  publication_state TEXT DEFAULT 'published', -- 'published', 'draft', 'private', 'confidential'
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Preserve existing table structures by ensuring missing columns are safely added if table pre-existed
ALTER TABLE public.catalog ADD COLUMN IF NOT EXISTS type TEXT;
ALTER TABLE public.catalog ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.catalog ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.catalog ADD COLUMN IF NOT EXISTS organization TEXT;
ALTER TABLE public.catalog ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL;
ALTER TABLE public.catalog ADD COLUMN IF NOT EXISTS trl INTEGER DEFAULT 1;
ALTER TABLE public.catalog ADD COLUMN IF NOT EXISTS trl_stage TEXT;
ALTER TABLE public.catalog ADD COLUMN IF NOT EXISTS status TEXT;
ALTER TABLE public.catalog ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.catalog ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.catalog ADD COLUMN IF NOT EXISTS verified_by TEXT;
ALTER TABLE public.catalog ADD COLUMN IF NOT EXISTS publication_state TEXT DEFAULT 'published';
ALTER TABLE public.catalog ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.catalog ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.catalog ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.catalog ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Performance Indexes (Safely Repeatable)
CREATE INDEX IF NOT EXISTS idx_catalog_type ON public.catalog(type);
CREATE INDEX IF NOT EXISTS idx_catalog_org_id ON public.catalog(organization_id);
CREATE INDEX IF NOT EXISTS idx_catalog_created_by ON public.catalog(created_by);
CREATE INDEX IF NOT EXISTS idx_catalog_pub_state ON public.catalog(publication_state);
CREATE INDEX IF NOT EXISTS idx_catalog_updated_at ON public.catalog(updated_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.catalog ENABLE ROW LEVEL SECURITY;

-- RLS Policy Preservation & Controlled Replacement Rationale:
-- Existing permissive or legacy catalog policies are selectively replaced to harden security:
-- 1. "Public published catalog items are readable by all":
--    REPLACED BY: "Catalog select policy"
--    WHY: Legacy policy allowed reading any published catalog row without type filtering. Private project-room metadata and direct messages must never be exposed in public catalog reads even if marked published.
-- 2. "Authenticated users can insert catalog items":
--    REPLACED BY: "Catalog insert policy"
--    WHY: Legacy policy allowed authenticated users to set created_by = NULL or assign records to arbitrary users. Replacement requires created_by = auth.uid() for ordinary users.
-- 3. "Creators or Admins can update catalog items":
--    REPLACED BY: "Catalog update policy"
--    WHY: Legacy policy lacked organization membership role checks. Replacement verifies org membership ('owner', 'admin') or platform_admin role.
-- 4. "Creators or Admins can delete catalog items":
--    REPLACED BY: "Catalog delete policy"
--    WHY: Legacy policy lacked org role checks. Replacement restricts deletes to record creator, org owner/admin, or platform_admin.

DROP POLICY IF EXISTS "Public published catalog items are readable by all" ON public.catalog;
DROP POLICY IF EXISTS "Catalog select policy" ON public.catalog;
DROP POLICY IF EXISTS "Authenticated users can insert catalog items" ON public.catalog;
DROP POLICY IF EXISTS "Catalog insert policy" ON public.catalog;
DROP POLICY IF EXISTS "Creators or Admins can update catalog items" ON public.catalog;
DROP POLICY IF EXISTS "Catalog update policy" ON public.catalog;
DROP POLICY IF EXISTS "Creators or Admins can delete catalog items" ON public.catalog;
DROP POLICY IF EXISTS "Catalog delete policy" ON public.catalog;

-- 1. SELECT Policy:
-- Published entries (excluding private project rooms and direct messages) are readable by all.
-- Private project rooms, drafts, and private entries are readable only by record creator, organization members, or platform admins.
CREATE POLICY "Catalog select policy"
  ON public.catalog
  FOR SELECT
  USING (
    (publication_state = 'published' AND type NOT IN ('project_room', 'direct_message')) OR
    (auth.uid() IS NOT NULL AND (
      created_by = auth.uid() OR
      (organization_id IS NOT NULL AND organization_id IN (
        SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
      )) OR
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'platform_admin')
      )
    ))
  );

-- 2. INSERT Policy:
-- Ordinary authenticated users must set created_by to themselves (created_by = auth.uid()).
-- They cannot set created_by to NULL or assign records to other users.
-- Explicitly authorized administrators (profiles.role in 'admin', 'platform_admin') can set created_by to NULL or assign to other users.
CREATE POLICY "Catalog insert policy"
  ON public.catalog
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    (
      created_by = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'platform_admin')
      )
    ) AND
    (
      organization_id IS NULL OR
      organization_id IN (
        SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
      ) OR
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'platform_admin')
      )
    )
  );

-- 3. UPDATE Policy:
-- Restrict updates to record creator, explicit organization owner/admin, or platform admin.
CREATE POLICY "Catalog update policy"
  ON public.catalog
  FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND (
      created_by = auth.uid() OR
      (organization_id IS NOT NULL AND organization_id IN (
        SELECT organization_id FROM public.organization_members
        WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
      )) OR
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'platform_admin')
      )
    )
  );

-- 4. DELETE Policy:
-- Restrict deletions to record creator, explicit organization owner/admin, or platform admin.
CREATE POLICY "Catalog delete policy"
  ON public.catalog
  FOR DELETE
  USING (
    auth.uid() IS NOT NULL AND (
      created_by = auth.uid() OR
      (organization_id IS NOT NULL AND organization_id IN (
        SELECT organization_id FROM public.organization_members
        WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
      )) OR
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'platform_admin')
      )
    )
  );

-- Safely Repeatable Timestamp Trigger
CREATE OR REPLACE FUNCTION update_catalog_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_catalog_updated_at ON public.catalog;
CREATE TRIGGER trigger_catalog_updated_at
  BEFORE UPDATE ON public.catalog
  FOR EACH ROW
  EXECUTE FUNCTION update_catalog_timestamp();

