import type { IncomingMessage, ServerResponse } from 'http';
import { app, initializeServer } from '../server.ts';

export async function handleVercelApiRequest(req: IncomingMessage, res: ServerResponse) {
  try {
    await initializeServer();
  } catch (err) {
    console.warn('[Vercel Server Initialization Warning]', err);
  }

  // Ensure req.url starts with /api for Express route matching
  if (req.url && !req.url.startsWith('/api/') && req.url !== '/api') {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }

  return app(req, res);
}
