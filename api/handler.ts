import type { IncomingMessage, ServerResponse } from 'http';
import { app, ensureDatabaseCatalogSeeded } from '../server.ts';

let isSeeded = false;

export async function handleVercelApiRequest(req: IncomingMessage, res: ServerResponse) {
  if (!isSeeded) {
    try {
      await ensureDatabaseCatalogSeeded();
      isSeeded = true;
    } catch (err) {
      console.warn('[Vercel Catalog Seed Warning]', err);
    }
  }

  // Ensure req.url starts with /api for Express route matching
  if (req.url && !req.url.startsWith('/api/') && req.url !== '/api') {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }

  return app(req, res);
}
