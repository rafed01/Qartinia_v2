# Qartinia — Frontier Technology & Enterprise R&D Intelligence Platform

Qartinia is an enterprise-grade platform for frontier technology scouting, protected project rooms, accredited laboratory networks, verified supplier benchmarks, and automated TCAD/SPICE simulation workflows.

## Persistence Architecture

- **Single Source of Truth**: All application data, enterprise profiles, protected project rooms, evidence nodes, suppliers, labs, and brainstorm rooms reside authoritatively in **Supabase** (`public.catalog`, `public.profiles`, `public.organizations`, `public.requests`, and `public.user_activity`).
- **No Local Disk Persistence**: Browser storage (`localStorage`, `sessionStorage`) and local JSON files (`.qartinia-store.json`) have been removed from data and authentication flows.
- **Empty Workspace Isolation**: An empty workspace remains strictly empty unless explicitly seeded with demo data by an authorized user or administrator.
- **Explicit Seed Tool**: Demo records are stored in Supabase and can be loaded on demand using the explicit, idempotent seed command:
  ```bash
  npm run seed
  ```
  All seeded records are clearly tagged with `isDemo: true` in metadata.

## Setup Instructions

1. **Environment Configuration**:
   Copy `.env.example` to `.env` and supply your Supabase credentials and Gemini API key:
   ```env
   VITE_SUPABASE_URL="https://fxenqxxskviftgyptqnr.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-public-key"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-secret-key"
   GEMINI_API_KEY="your-gemini-api-key"
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Seed Demo Data (Optional)**:
   ```bash
   npm run seed
   ```

4. **Lint & Test**:
   ```bash
   npm run lint
   npm test
   ```
