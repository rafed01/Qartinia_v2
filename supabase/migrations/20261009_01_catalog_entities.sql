-- Migration: 20261009_01_catalog_entities.sql
-- Description: Core Catalog Table Schema for Frontiers, Evidence, Suppliers, Labs, and Experts

CREATE TABLE IF NOT EXISTS public.catalog (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL, -- 'frontier', 'evidence', 'supplier', 'lab', 'expert', etc.
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

-- Indexes for performance & quick lookup
CREATE INDEX IF NOT EXISTS idx_catalog_type ON public.catalog(type);
CREATE INDEX IF NOT EXISTS idx_catalog_org_id ON public.catalog(organization_id);
CREATE INDEX IF NOT EXISTS idx_catalog_created_by ON public.catalog(created_by);
CREATE INDEX IF NOT EXISTS idx_catalog_pub_state ON public.catalog(publication_state);
CREATE INDEX IF NOT EXISTS idx_catalog_updated_at ON public.catalog(updated_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.catalog ENABLE ROW LEVEL SECURITY;

-- RLS Policy 1: Anyone can read published catalog items
CREATE POLICY "Public published catalog items are readable by all"
  ON public.catalog
  FOR SELECT
  USING (
    publication_state = 'published' OR
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'platform_admin')
    )
  );

-- RLS Policy 2: Authenticated users can insert catalog entries
CREATE POLICY "Authenticated users can insert catalog items"
  ON public.catalog
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- RLS Policy 3: Creators or Admins can update catalog entries
CREATE POLICY "Creators or Admins can update catalog items"
  ON public.catalog
  FOR UPDATE
  USING (
    created_by = auth.uid() OR
    organization_id IN (
      SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'platform_admin')
    )
  );

-- RLS Policy 4: Creators or Admins can delete catalog entries
CREATE POLICY "Creators or Admins can delete catalog items"
  ON public.catalog
  FOR DELETE
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'platform_admin')
    )
  );

-- Trigger to automatically update updated_at timestamp
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
