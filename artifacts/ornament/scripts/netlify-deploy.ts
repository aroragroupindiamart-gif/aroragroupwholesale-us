/**
 * Netlify incremental deploy — no CLI needed.
 *
 * Uses Netlify's file-digest API:
 *  1. Compute SHA1 for every file in dist/public/
 *  2. POST manifest → Netlify returns only the digests it's missing
 *  3. Upload only those files (delta, not full re-upload)
 *  4. Deploy goes live atomically once all required files are received
 *
 * Run:  tsx scripts/netlify-deploy.ts
 * Env:  NETLIFY_AUTH_TOKEN, NETLIFY_SITE_ID
 */

import { createHash } from 'crypto';
import { readFileSync, readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR   = path.join(__dirname, '..', 'dist', 'public');
const API        = 'https://api.netlify.com/api/v1';
const SITE_ID    = process.env.NETLIFY_SITE_ID!;
const TOKEN      = process.env.NETLIFY_AUTH_TOKEN!;
const CONCURRENCY = 20;

if (!TOKEN)   { console.error('❌ NETLIFY_AUTH_TOKEN not set'); process.exit(1); }
if (!SITE_ID) { console.error('❌ NETLIFY_SITE_ID not set');    process.exit(1); }

// ── helpers ────────────────────────────────────────────────────────────────

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function sha1(filepath: string): string {
  return createHash('sha1').update(readFileSync(filepath)).digest('hex');
}

async function netlify(method: string, endpoint: string, body?: unknown, binary?: Buffer, retries = 4): Promise<unknown> {
  const headers: Record<string, string> = { Authorization: `Bearer ${TOKEN}` };
  if (binary) headers['Content-Type'] = 'application/octet-stream';
  else if (body) headers['Content-Type'] = 'application/json';

  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(`${API}${endpoint}`, {
      method,
      headers,
      body: binary ?? (body ? JSON.stringify(body) : undefined),
    });
    if (res.ok) return res.json();
    if (res.status === 429 && attempt < retries) {
      const wait = 1500 * Math.pow(2, attempt); // 1.5s, 3s, 6s, 12s
      await new Promise(r => setTimeout(r, wait));
      continue;
    }
    const text = await res.text();
    throw new Error(`Netlify ${method} ${endpoint} → ${res.status}: ${text.slice(0, 200)}`);
  }
  throw new Error('Unreachable');
}

async function pool<T>(items: T[], limit: number, fn: (item: T, i: number) => Promise<void>): Promise<void> {
  let i = 0;
  async function next(): Promise<void> {
    if (i >= items.length) return;
    const idx = i++;
    await fn(items[idx], idx);
    return next();
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, next));
}

// ── main ───────────────────────────────────────────────────────────────────

console.log('📦 Computing file digests…');
const allFiles = walk(DIST_DIR);
const fileMap: Record<string, string> = {};   // "/url-path" → sha1
const sha1ToFile: Record<string, string> = {}; // sha1 → absolute filepath

for (const filepath of allFiles) {
  const relPath = '/' + path.relative(DIST_DIR, filepath).replace(/\\/g, '/');
  const digest  = sha1(filepath);
  fileMap[relPath]     = digest;
  sha1ToFile[digest]   = filepath;
}

const total = Object.keys(fileMap).length;
console.log(`   ${total} files indexed`);

// ── create deploy ──────────────────────────────────────────────────────────

console.log('📡 Creating deploy…');
const deploy = await netlify('POST', `/sites/${SITE_ID}/deploys`, { files: fileMap }) as {
  id: string;
  required: string[];
  deploy_ssl_url: string;
  state: string;
};

if (!deploy.id) { console.error('❌ Deploy creation failed', deploy); process.exit(1); }

const required = deploy.required ?? [];
console.log(`🔑 Deploy ID : ${deploy.id}`);
console.log(`📤 To upload : ${required.length} / ${total} files (${total - required.length} already cached)`);

// ── upload required files ──────────────────────────────────────────────────

let uploaded = 0;
const failed: string[] = [];

await pool(required, CONCURRENCY, async (digest, i) => {
  const filepath = sha1ToFile[digest];
  if (!filepath) { failed.push(digest); return; }

  const relPath = '/' + path.relative(DIST_DIR, filepath).replace(/\\/g, '/');
  const content = readFileSync(filepath);

  try {
    await netlify('PUT', `/deploys/${deploy.id}/files${relPath}`, undefined, content);
    uploaded++;
    if (uploaded % 200 === 0 || uploaded === required.length) {
      process.stdout.write(`\r   ↑ ${uploaded} / ${required.length}`);
    }
  } catch (err) {
    failed.push(relPath);
    console.warn(`\n⚠️  Failed: ${relPath}`, (err as Error).message);
  }
});

if (uploaded > 0) process.stdout.write('\n');

// ── result ─────────────────────────────────────────────────────────────────

if (failed.length) {
  console.warn(`⚠️  ${failed.length} files failed to upload`);
}

console.log(`✅ Uploaded ${uploaded} files`);

// ── wait for processing then publish ──────────────────────────────────────

console.log('⏳ Waiting for deploy to finish processing…');
let deployState = '';
for (let i = 0; i < 60; i++) {
  await new Promise(r => setTimeout(r, 5000));
  const status = await netlify('GET', `/deploys/${deploy.id}`) as { state: string };
  deployState = status.state;
  process.stdout.write(`\r   state: ${deployState}   `);
  if (deployState === 'ready' || deployState === 'error') break;
}
process.stdout.write('\n');

if (deployState !== 'ready') {
  console.error(`❌ Deploy ended in state: ${deployState}`);
  process.exit(1);
}

console.log('🚀 Publishing to production…');
const published = await netlify('POST', `/sites/${SITE_ID}/deploys/${deploy.id}/restore`) as {
  state: string;
  ssl_url: string;
};
console.log(`\n🎉 Live at: ${published.ssl_url}  (state: ${published.state})`);
