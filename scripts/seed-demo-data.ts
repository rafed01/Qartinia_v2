import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import {
  INITIAL_SUPPLIERS,
  INITIAL_LABS,
  INITIAL_EXPERTS,
  INITIAL_BRAINSTORM_ROOMS,
  INITIAL_SIMULATIONS,
  INITIAL_KNOWLEDGE_ITEMS,
} from '../src/data/platformData.js';

dotenv.config();

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('[Seed Error] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.');
  process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

export async function seedDemoDataToSupabase() {
  console.log('[Seed Demo Data] Connecting to Supabase...');

  const { data: existing, error: fetchErr } = await supabaseAdmin.from('catalog').select('id');
  if (fetchErr) {
    console.error('[Seed Demo Data Error] Failed to query catalog:', fetchErr.message);
    throw fetchErr;
  }

  const existingIds = new Set((existing || []).map((e) => e.id));
  let seededCount = 0;

  // 1. Seed Suppliers
  for (const sup of INITIAL_SUPPLIERS) {
    if (!existingIds.has(sup.id)) {
      const { error } = await supabaseAdmin.from('catalog').upsert({
        id: sup.id,
        type: 'supplier',
        title: sup.name,
        category: sup.domain,
        organization: sup.headquarters,
        trl: 9,
        trl_stage: sup.tier,
        status: sup.verified ? 'Verified' : 'Qualified',
        description: `[Demo Record] ${sup.description}`,
        location: sup.country,
        verified_by: 'Qartinia Demo Fabricator Audit',
        publication_state: 'published',
        metadata: {
          qartinia_kind: 'supplier',
          is_demo: true,
          isDemo: true,
          qartinia_payload: {
            ...sup,
            isDemo: true,
          },
        },
        updated_at: new Date().toISOString(),
      });
      if (error) {
        console.warn(`[Seed Supplier Failed ${sup.id}]`, error.message);
      } else {
        seededCount++;
      }
    }
  }

  // 2. Seed Labs
  for (const lab of INITIAL_LABS) {
    if (!existingIds.has(lab.id)) {
      const { error } = await supabaseAdmin.from('catalog').upsert({
        id: lab.id,
        type: 'lab',
        title: lab.name,
        category: lab.testingDomains[0] || 'Testing & Characterization',
        organization: lab.institution,
        trl: 8,
        trl_stage: lab.availabilityStatus,
        status: 'Accredited Lab [Demo]',
        description: `[Demo Record] ${lab.description}`,
        location: lab.location,
        verified_by: lab.leadScientist || 'Demo Lab Lead',
        publication_state: 'published',
        metadata: {
          qartinia_kind: 'lab',
          is_demo: true,
          isDemo: true,
          qartinia_payload: {
            ...lab,
            isDemo: true,
          },
        },
        updated_at: new Date().toISOString(),
      });
      if (error) {
        console.warn(`[Seed Lab Failed ${lab.id}]`, error.message);
      } else {
        seededCount++;
      }
    }
  }

  // 3. Seed Experts
  for (const exp of INITIAL_EXPERTS) {
    if (!existingIds.has(exp.id)) {
      const { error } = await supabaseAdmin.from('catalog').upsert({
        id: exp.id,
        type: 'expert',
        title: exp.name,
        category: exp.domainExpertise[0] || 'Domain Specialist',
        organization: exp.affiliation,
        trl: 9,
        trl_stage: exp.availability,
        status: 'Verified Fellow [Demo]',
        description: `[Demo Record] ${exp.bio}`,
        location: exp.location,
        verified_by: exp.title,
        publication_state: 'published',
        metadata: {
          qartinia_kind: 'expert',
          is_demo: true,
          isDemo: true,
          qartinia_payload: {
            ...exp,
            isDemo: true,
          },
        },
        updated_at: new Date().toISOString(),
      });
      if (error) {
        console.warn(`[Seed Expert Failed ${exp.id}]`, error.message);
      } else {
        seededCount++;
      }
    }
  }

  // 4. Seed Knowledge Items
  for (const ki of INITIAL_KNOWLEDGE_ITEMS) {
    if (!existingIds.has(ki.id)) {
      const { error } = await supabaseAdmin.from('catalog').upsert({
        id: ki.id,
        type: 'knowledge',
        title: ki.title,
        category: ki.type,
        organization: ki.authorsOrOrg,
        trl: 6,
        trl_stage: `${ki.year} Publication`,
        status: 'Indexed [Demo]',
        description: `[Demo Record] ${ki.abstract}`,
        location: ki.doiOrRef,
        verified_by: 'Qartinia Scientific Index (Demo)',
        publication_state: 'published',
        metadata: {
          qartinia_kind: 'knowledge',
          is_demo: true,
          isDemo: true,
          qartinia_payload: {
            ...ki,
            isDemo: true,
          },
        },
        updated_at: new Date().toISOString(),
      });
      if (error) {
        console.warn(`[Seed Knowledge Item Failed ${ki.id}]`, error.message);
      } else {
        seededCount++;
      }
    }
  }

  // 5. Seed Brainstorm Rooms
  for (const room of INITIAL_BRAINSTORM_ROOMS) {
    if (!existingIds.has(room.id)) {
      const { error } = await supabaseAdmin.from('catalog').upsert({
        id: room.id,
        type: 'project_room',
        title: room.title,
        category: room.domain,
        organization: room.createdBy,
        trl: 5,
        trl_stage: 'Technical Scoping & Ideation',
        status: room.isPrivate ? 'Confidential [Demo]' : 'Open Collaboration [Demo]',
        description: `[Demo Record] ${room.topic || room.summary || ''}`,
        location: room.tags.join(', '),
        verified_by: 'Qartinia Brainstorm Hub',
        publication_state: room.isPrivate ? 'draft' : 'published',
        metadata: {
          qartinia_kind: 'brainstorm_room',
          is_demo: true,
          isDemo: true,
          qartinia_payload: {
            ...room,
            isDemo: true,
          },
          isPrivate: room.isPrivate,
          createdBy: room.createdBy,
          participants: room.participants,
        },
        updated_at: new Date().toISOString(),
      });
      if (error) {
        console.warn(`[Seed Brainstorm Room Failed ${room.id}]`, error.message);
      } else {
        seededCount++;
      }
    }
  }

  // 6. Seed Simulations
  for (const sim of INITIAL_SIMULATIONS) {
    if (!existingIds.has(sim.id)) {
      const { error } = await supabaseAdmin.from('catalog').upsert({
        id: sim.id,
        type: 'frontier',
        title: sim.title,
        category: sim.domain,
        organization: `${sim.tool} Engine`,
        trl: 6,
        trl_stage: `${sim.tool} Transient Verification`,
        status: sim.status,
        description: `[Demo Record] ${sim.resultReport || 'Physics transient calculation and boundary analysis.'}`,
        location: sim.tool,
        verified_by: 'Qartinia Simulation Hub (Demo)',
        publication_state: 'draft',
        metadata: {
          qartinia_kind: 'simulation_job',
          is_demo: true,
          isDemo: true,
          qartinia_payload: {
            ...sim,
            isDemo: true,
          },
          tool: sim.tool,
        },
        updated_at: new Date().toISOString(),
      });
      if (error) {
        console.warn(`[Seed Simulation Failed ${sim.id}]`, error.message);
      } else {
        seededCount++;
      }
    }
  }

  console.log(`[Seed Demo Data] Complete. Seeded ${seededCount} demo records into Supabase.`);
  return { seededCount };
}

if (process.argv[1]?.includes('seed-demo-data')) {
  seedDemoDataToSupabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[Seed Error]', err);
      process.exit(1);
    });
}
