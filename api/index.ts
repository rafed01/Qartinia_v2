import type { IncomingMessage, ServerResponse } from 'http';
import { app, ensureDatabaseCatalogSeeded } from '../server.ts';

let isSeeded = false;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (!isSeeded) {
    try {
      await ensureDatabaseCatalogSeeded();
      isSeeded = true;
    } catch (err) {
      console.warn('[Vercel Catalog Seed Warning]', err);
    }
  }

  // Normalize URL to ensure Express receives /api/* path
  if (req.url && !req.url.startsWith('/api/') && req.url !== '/api') {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }

  return app(req, res);
}
