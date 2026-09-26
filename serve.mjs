#!/usr/bin/env node
// =====================================================================================
//  serve.mjs — tiny static server for the built site (zero dependencies).
//  Usage: node serve.mjs [--dir dist] [--port 8080]
//  · correct MIME types (.mjs/.js/.css/.svg/.json/.woff2/.xml…) · directory → index.html
//  · unknown path → /404.html with status 404 · POST /api/feedback.php → mock JSON {ok:true} (dev only)
// =====================================================================================
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { join, resolve, extname, normalize, sep, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const arg = (n, d) => { const i = args.indexOf(`--${n}`); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const DIR = resolve(ROOT, arg('dir', 'dist'));
const PORT = Number(arg('port', process.env.PORT || 8080));

const MIME = {
  '.html': 'text/html; charset=utf-8', '.htm': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.otf': 'font/otf',
  '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.pdf': 'application/pdf',
  '.glb': 'model/gltf-binary', '.gltf': 'model/gltf+json', '.hdr': 'application/octet-stream', '.ktx2': 'image/ktx2',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.vtt': 'text/vtt; charset=utf-8', '.php': 'text/plain; charset=utf-8',
};

if (!existsSync(DIR)) { console.error(`✖ ${DIR} does not exist — run "node build.mjs" first`); process.exit(1); }

const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let path = decodeURIComponent(url.pathname);
  if (req.method === 'POST' && path.endsWith('/api/feedback.php')) {
    // Development mock — the real handler is public/api/feedback.php on PHP hosting.
    let body = ''; req.on('data', (c) => { body += c; if (body.length > 1e6) req.destroy(); });
    req.on('end', () => { res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(JSON.stringify({ ok: true, mock: true })); });
    return;
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); res.end(); return; }
  let file = normalize(join(DIR, path));
  if (!file.startsWith(DIR)) { res.writeHead(403); res.end('Forbidden'); return; }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  let status = 200;
  if (!existsSync(file)) { status = 404; file = join(DIR, '404.html'); if (!existsSync(file)) { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('Not found'); return; } }
  const type = MIME[extname(file).toLowerCase()] || 'application/octet-stream';
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
  if (req.method === 'HEAD') { res.end(); return; }
  createReadStream(file).pipe(res);
});
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error(`✖ Port ${PORT} is already in use — probably another serve.mjs (maybe an old one still serving a different folder).\n` +
      `  Stop it, or pick another port:  node serve.mjs --dir ${arg('dir', 'dist')} --port ${PORT + 1}`);
  } else if (e.code === 'EACCES') {
    console.error(`✖ No permission to listen on port ${PORT}. Use a port above 1024, e.g. --port 8080.`);
  } else {
    console.error(`✖ Server error: ${e.message}`);
  }
  process.exit(1);
});
server.listen(PORT, () => console.log(`▶ Keremet: http://localhost:${PORT}/  (serving ${DIR})`));
