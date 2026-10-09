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

-- Performance Indexes (Safely Repeatable)
CREATE INDEX IF NOT EXISTS idx_catalog_type ON public.catalog(type);
CREATE INDEX IF NOT EXISTS idx_catalog_org_id ON public.catalog(organization_id);
CREATE INDEX IF NOT EXISTS idx_catalog_created_by ON public.catalog(created_by);
CREATE INDEX IF NOT EXISTS idx_catalog_pub_state ON public.catalog(publication_state);
CREATE INDEX IF NOT EXISTS idx_catalog_updated_at ON public.catalog(updated_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.catalog ENABLE ROW LEVEL SECURITY;

-- Safely Repeatable Policy Cleanup
DROP POLICY IF EXISTS "Public published catalog items are readable by all" ON public.catalog;
DROP POLICY IF EXISTS "Catalog select policy" ON public.catalog;
DROP POLICY IF EXISTS "Authenticated users can insert catalog items" ON public.catalog;
DROP POLICY IF EXISTS "Catalog insert policy" ON public.catalog;
DROP POLICY IF EXISTS "Creators or Admins can update catalog items" ON public.catalog;
DROP POLICY IF EXISTS "Catalog update policy" ON public.catalog;
DROP POLICY IF EXISTS "Creators or Admins can delete catalog items" ON public.catalog;
DROP POLICY IF EXISTS "Catalog delete policy" ON public.catalog;

-- 1. SELECT Policy:
-- Published entries are readable by all.
-- Drafts/private entries are readable only by record creator, organization members, or platform admins.
CREATE POLICY "Catalog select policy"
  ON public.catalog
  FOR SELECT
  USING (
    publication_state = 'published' OR
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
