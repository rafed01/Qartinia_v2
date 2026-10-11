import type { IncomingMessage, ServerResponse } from 'http';
import { app, initializeServer } from '../server.ts';

export async function handleVercelApiRequest(req: IncomingMessage, res: ServerResponse) {
  try {
    await initializeServer();
  } catch (err) {
    console.warn('[Vercel Server Initialization Warning]', err);
  }

  // Ensure req.url starts with /api for Express route matching
  if (req.url) {
    if (
      !req.url.startsWith('/api/') &&
      !req.url.startsWith('/api?') &&
      !req.url.startsWith('/api#') &&
      req.url !== '/api'
    ) {
      const pathWithLeadingSlash = req.url.startsWith('/') ? req.url : '/' + req.url;
      req.url = '/api' + pathWithLeadingSlash;
    }
  }

  return app(req, res);
}

