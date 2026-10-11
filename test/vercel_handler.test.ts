import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { handleVercelApiRequest } from '../api/handler.ts';

describe('Vercel API Handler Architecture Tests', () => {
  let server: http.Server;
  let baseUrl: string;

  before(async () => {
    server = http.createServer((req, res) => {
      handleVercelApiRequest(req, res);
    });
    await new Promise<void>((resolve) => {
      server.listen(0, '127.0.0.1', () => resolve());
    });
    const addr = server.address() as any;
    baseUrl = `http://127.0.0.1:${addr.port}`;
  });

  after(() => {
    server?.close();
  });

  test('routes /api/frontiers public request to Express and returns application/json', async () => {
    const res = await fetch(`${baseUrl}/api/frontiers`);
    assert.equal(res.status, 200);
    assert.match(res.headers.get('content-type') || '', /application\/json/);
    const body = await res.json();
    assert.equal(body.ok, true);
    assert.ok(Array.isArray(body.frontiers));
  });

  test('routes /api/events request without token and returns 401 application/json', async () => {
    const res = await fetch(`${baseUrl}/api/events`);
    assert.equal(res.status, 401);
    assert.match(res.headers.get('content-type') || '', /application\/json/);
    const body = await res.json();
    assert.equal(body.error, 'Authentication required for SSE stream.');
  });

  test('normalizes stripped paths like /frontiers to /api/frontiers', async () => {
    const res = await fetch(`${baseUrl}/frontiers`);
    assert.equal(res.status, 200);
    assert.match(res.headers.get('content-type') || '', /application\/json/);
    const body = await res.json();
    assert.equal(body.ok, true);
  });
});
