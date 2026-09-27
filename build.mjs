#!/usr/bin/env node
// =====================================================================================
//  build.mjs — Keremet static site generator (zero dependencies).
//  Usage:  node build.mjs [--out dist] [--only about,license] [--langs kz,ru] [--quiet] [--force]
//  --out must be empty, or a folder made by an earlier build (marker file .keremet-build) — see guardOut().
//  src/pages/*.mjs (default export = page object | array of page objects) × langs
//    → <out>/{lang}/{slug}.html ; copies public/ → <out>/ ; emits root index.html (language
//    router), 404.html, sitemap.xml, robots.txt, assets/search/{lang}.json, {lang}/rss.xml.
// =====================================================================================
import { readdirSync, mkdirSync, writeFileSync, readFileSync, cpSync, rmSync, existsSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, resolve, dirname, relative, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const t0 = performance.now();

// ------------------------------------------------------------------ args
const args = process.argv.slice(2);
const arg = (name, def) => { const i = args.indexOf(`--${name}`); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : def; };
const OUT = resolve(ROOT, arg('out', 'dist'));
const ONLY = arg('only', '') ? new Set(arg('only').split(',').map((s) => s.trim()).filter(Boolean)) : null;
const QUIET = args.includes('--quiet');

const { t, L, LANGS: ALL_LANGS, HTML_LANG, fmtDate, fmtDateTime, fmtDateLong, fmtSize, missingKeys, _setFallbackSink } = await import('./src/i18n.mjs');
const LANGS = arg('langs', '') ? arg('langs').split(',').map((s) => s.trim()).filter((l) => ALL_LANGS.includes(l)) : ALL_LANGS;
const nav = await import('./src/nav.mjs');
const schoolMod = await import('./src/data/school.mjs');
const { school, SITE_URL } = schoolMod;
const newsMod = await import('./src/data/news.mjs');
const docsMod = await import('./src/data/documents.mjs');
const uiMod = await import('./src/ui.mjs');
const { renderPage, absUrl } = await import('./src/layout.mjs');
const ui = uiMod.ui;

const warnings = [];
const errors = [];
const warn = (m) => warnings.push(m);

// ------------------------------------------------------------------ output-folder guard
// The build wipes OUT. Only wipe a folder that is empty, or that a previous build made (marker file
// MARKER, or only the entries a build writes). Never the project, a parent of it, a drive root or a
// folder holding node_modules / libs / package.json / .git (e.g. a shared scratchpad).
const MARKER = '.keremet-build';
const BUILD_ENTRIES = new Set(['kz', 'ru', 'en', 'assets', 'api', 'index.html', '404.html', 'sitemap.xml', 'robots.txt', '.htaccess', MARKER]);
const HARD_NO = ['node_modules', 'libs', 'package.json', '.git', 'src', 'build.mjs'];
function guardOut() {
  const refuse = (why) => { console.error(`✖ refusing to build into ${OUT}\n  ${why}\n  Use an empty folder or one made by a previous build (it contains ${MARKER}).`); process.exit(2); };
  const forbidden = [ROOT, join(ROOT, 'src'), join(ROOT, 'public'), join(ROOT, 'docs')].map((p) => resolve(p));
  if (forbidden.includes(OUT) || (ROOT + sep).startsWith(OUT + sep)) refuse('it is the project itself or one of its parent folders.');
  if (resolve(OUT, '..') === OUT) refuse('it is a drive / filesystem root.');
  const home = process.env.USERPROFILE || process.env.HOME;
  if (home && resolve(home) === OUT) refuse('it is the home folder.');
  if (!existsSync(OUT)) return;
  if (!statSync(OUT).isDirectory()) refuse('it is a file.');
  const entries = readdirSync(OUT);
  const hard = entries.filter((e) => HARD_NO.includes(e));
  if (hard.length) refuse(`it contains ${hard.join(', ')} — that is not a build folder.`);
  if (!entries.length || entries.includes(MARKER)) return;
  const foreign = entries.filter((e) => !BUILD_ENTRIES.has(e));
  if (foreign.length && !args.includes('--force')) refuse(`it is not empty and has no ${MARKER} marker; unexpected entries: ${foreign.slice(0, 8).join(', ')}${foreign.length > 8 ? ' …' : ''} (pass --force if you are sure).`);
}
guardOut();

// ------------------------------------------------------------------ load pages
const pagesDir = join(ROOT, 'src', 'pages');
const files = existsSync(pagesDir) ? readdirSync(pagesDir).filter((f) => f.endsWith('.mjs')).sort() : [];
const pages = [];
// With --only, a broken module that was NOT requested (another agent's half-written file) must not fail
// this private build: its import error becomes a warning. A module "relates" to the request when its
// basename equals a requested slug or one is a dash-prefix of the other (self ↔ self-3, news ↔ news-12).
const related = (f) => {
  if (!ONLY) return true;
  const base = f.replace(/\.mjs$/, '');
  return [...ONLY].some((s) => s === base || s.startsWith(`${base}-`) || base.startsWith(`${s}-`) || (base === '404' && s === '404'));
};
const brokenFiles = [];
for (const f of files) {
  try {
    const mod = await import(pathToFileURL(join(pagesDir, f)).href);
    const exp = mod.default;
    const list = Array.isArray(exp) ? exp : [exp];
    for (const p of list) {
      if (!p || typeof p !== 'object') { (related(f) ? errors : warnings).push(`${f}: default export is not a page object`); continue; }
      p.__file = f;
      pages.push(p);
    }
  } catch (e) {
    brokenFiles.push(f);
    if (related(f)) errors.push(`${f}: failed to import — ${e.stack || e}`);
    else warn(`${f}: failed to import (not requested by --only, ignored) — ${String(e.message || e).split(/\r?\n/)[0]}`);
  }
}
const requested = (p) => !ONLY || ONLY.has(p.slug) || (p.root && ONLY.has('404'));

// ------------------------------------------------------------------ validate
const bySlug = new Map();
for (const p of pages) {
  const err = (m) => (requested(p) ? errors : warnings).push(m);
  if (!p.slug || typeof p.slug !== 'string') { err(`${p.__file}: page without slug`); continue; }
  if (bySlug.has(p.slug)) err(`duplicate slug "${p.slug}" (${bySlug.get(p.slug).__file} and ${p.__file})`);
  bySlug.set(p.slug, p);
  if (typeof p.render !== 'function') err(`${p.__file} [${p.slug}]: missing render(lang, ctx)`);
  if (!p.group && !p.home) warn(`${p.slug}: no group`);
  else if (p.group && !nav.GROUPS[p.group]) warn(`${p.slug}: unknown group "${p.group}"`);
  for (const k of ['title', 'description']) {
    const v = p[k];
    for (const l of ALL_LANGS) {
      if (!v || (typeof v === 'object' && !v[l])) warn(`${p.slug}: ${k}.${l} missing`);
    }
    if (k === 'description' && v && typeof v === 'object') for (const l of ALL_LANGS) if (v[l] && v[l].length > 160) warn(`${p.slug}: description.${l} is ${v[l].length} chars (>160)`);
  }
  if (!p.updated && !p.home && !p.root) warn(`${p.slug}: no "updated" date`);
  for (const k of ['published', 'updated']) if (p[k] && !p.root && !p.noMeta && !/T\d{2}:\d{2}/.test(p[k])) warn(`${p.slug}: ${k} "${p[k]}" has no time — add "T10:00" style time (ORDER A.11); shown as date only`);
  for (const s of p.styles || []) if (!existsSync(join(ROOT, 'public', 'assets', 'css', 'pages', `${s.replace(/\.css$/, '')}.css`))) warn(`${p.slug}: style "${s}" not found in public/assets/css/pages/`);
}
// documents: a published file needs its placement stamp (ORDER S.11/S.73) and, for scans, a small preview
for (const d of docsMod.documents) {
  if (d.file && !d.posted) warn(`documents.mjs "${d.id}": has a file but no posted:'YYYY-MM-DDTHH:MM' (when it was placed on the site)`);
  if (d.file && /\.(jpe?g|png)$/i.test(d.file) && !d.thumb) warn(`documents.mjs "${d.id}": no preview for ${d.file} — run: python tools/make-thumbs.py`);
  if (d.file && !d.size) warn(`documents.mjs "${d.id}": file ${d.file} not found in public/assets/`);
}
const navSet = new Set(nav.navSlugs());
const missingNav = [...navSet].filter((s) => !bySlug.has(s));
if (missingNav.length) warn(`nav slugs without a page module (${missingNav.length}): ${missingNav.join(', ')}`);
const notInNav = pages.filter((p) => !navSet.has(p.slug) && !p.home && !p.hidden && !p.root).map((p) => p.slug);
if (notInNav.length) warn(`pages not in nav (set hidden:true if intended): ${notInNav.join(', ')}`);

// ------------------------------------------------------------------ prepare output
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync(join(ROOT, 'public'), OUT, { recursive: true });
const hasFile = (rel) => existsSync(join(ROOT, 'public', rel));
const stamp = new Date();
// Asset version: hash of every CSS/JS file → appended as ?v=<hash> to the stylesheet/script URLs the
// layout emits, so a redeploy never serves last week's cached base.css/main.js against new HTML.
function assetVersion() {
  const h = createHash('sha1');
  const walk = (dir) => {
    if (!existsSync(dir)) return;
    for (const e of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(css|m?js)$/.test(e.name)) { h.update(relative(ROOT, p)); h.update(readFileSync(p)); }
    }
  };
  walk(join(ROOT, 'public', 'assets', 'css'));
  walk(join(ROOT, 'public', 'assets', 'js'));
  return h.digest('hex').slice(0, 10);
}
const VERSION = assetVersion();
const buildInfo = `Keremet build ${stamp.toISOString()} · assets v=${VERSION} · node ${process.version}`;
writeFileSync(join(OUT, MARKER), `${buildInfo}\nThis folder is generated by build.mjs and is wiped on every build.\n`);

function makeCtx(lang, page, prefix) {
  const rel = prefix === '../';
  const href = (slug, l = lang) => {
    const file = `${slug}.html`;
    if (!rel) return `/${l}/${file}`;
    return l === lang ? file : `../${l}/${file}`;
  };
  const asset = (p) => `${prefix}assets/${String(p).replace(/^\/+/, '')}`;
  return {
    lang, prefix, page, pages, nav, ui, href, asset,
    t: (key, vars) => t(lang, key, vars),
    L: (v) => L(lang, v),
    S: school, school,
    news: newsMod.sortedNews(), newsById: newsMod.newsById,
    docs: docsMod.documents, docsByGroup: docsMod.docsByGroup, docById: docsMod.docById, latestDocuments: docsMod.latestDocuments,
    fmt: { date: (d) => fmtDate(lang, d), dateTime: (d, tm) => fmtDateTime(lang, d, tm), dateLong: (d) => fmtDateLong(lang, d), size: (b) => fmtSize(lang, b) },
    pageBySlug: (s) => bySlug.get(s) || null,
    hasPage: (s) => bySlug.has(s),
  };
}

const strip = (html) => String(html || '')
  .replace(/<(script|style|svg|noscript|form)[\s\S]*?<\/\1>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/\s+/g, ' ').trim();

// ------------------------------------------------------------------ effective "last updated"
// A page changes when a document or news item it shows is placed or replaced — not only when its own text is edited.
// While a page renders we collect the documents it touches (docById / docsByGroup / latestDocuments / ui.docList) and
// the news items it links to; its effective updated time = max(page.updated, their posted/changed stamps). That value
// drives the footer "Last updated" line, the search index and sitemap <lastmod>.
const stampOfDoc = docsMod.stampOf || ((d) => d?.changed || d?.posted || '');
const newsStampOf = (n) => [newsMod.postedOf ? newsMod.postedOf(n) : n.posted, newsMod.updatedOf ? newsMod.updatedOf(n) : n.updated].filter(Boolean).sort().pop() || '';
const newsIndex = new Map(newsMod.sortedNews().map((n) => [String(n.id), n]));
let touched = null;
docsMod._setAccessSink?.((d) => { if (touched) touched.add(d); });
const effBySlug = new Map();
function effectiveUpdated(page, content) {
  const own = page.updated || page.published || '';
  if (!own) return own;
  const stamps = [own];
  for (const d of touched || []) { const st = stampOfDoc(d); if (st) stamps.push(st); }
  if (!String(page.slug).startsWith('news-')) { // an article linking to other news did not change because of them
    for (const m of content.matchAll(/href="(?:[^"]*\/)?news-([\w-]+)\.html"/g)) { const n = newsIndex.get(m[1]); if (n) stamps.push(newsStampOf(n)); }
  }
  return stamps.filter((x) => /^\d{4}-\d{2}-\d{2}/.test(x)).sort().pop() || own;
}
// Leaked JS values ("null", "undefined", "NaN") in the visible text or a mailto: link — a slot read without a guard.
function leakCheck(page, lang, content) {
  const text = strip(content);
  const m = text.match(/(?:^|[\s(«"'])(null|undefined|NaN)(?=[\s.,;:)»"'!?]|$)/) || content.match(/href="mailto:(null|undefined|)"/);
  if (m) { const at = Math.max(0, (m.index || 0) - 40); warn(`${page.slug} [${lang}]: "${m[1] || 'mailto:'}" printed on the page — …${(m.input || '').slice(at, at + 90).replace(/\s+/g, ' ')}…`); }
}

// ------------------------------------------------------------------ render
const search = Object.fromEntries(LANGS.map((l) => [l, []]));
schoolMod._resetReads?.();
let count = 0;
const renderList = pages.filter((p) => p.slug && typeof p.render === 'function' && requested(p));
if (ONLY) for (const s of ONLY) if (!bySlug.has(s)) errors.push(`--only: page "${s}" not found${brokenFiles.length ? ` (modules that failed to import: ${brokenFiles.join(', ')})` : ''}`);
// Language-completeness check: L()/t() report every fallback to another language while a page renders.
let fallbacks = null;
_setFallbackSink((l, text) => { if (fallbacks) fallbacks.add(String(text).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 60)); });
const reportFallbacks = (page, lang) => {
  if (fallbacks && fallbacks.size) warn(`${page.slug} [${lang}]: ${fallbacks.size} text(s) missing in "${lang}", fell back to another language: ${[...fallbacks].slice(0, 4).map((x) => `"${x}"`).join(', ')}${fallbacks.size > 4 ? ' …' : ''}`);
  fallbacks = null;
};
for (const lang of LANGS) {
  mkdirSync(join(OUT, lang), { recursive: true });
  for (const page of renderList) {
    if (page.root) continue;
    const ctx = makeCtx(lang, page, '../');
    uiMod._setContext({ lang, href: ctx.href, asset: ctx.asset, api: '../api/feedback.php', onDoc: (d) => { if (touched) touched.add(d); } });
    try {
      fallbacks = new Set();
      touched = new Set();
      const content = page.render(lang, ctx);
      if (typeof content !== 'string') throw new Error('render() must return a string');
      const eff = effectiveUpdated(page, content);
      touched = null;
      const shown = eff && eff > (page.updated || page.published || '') ? { ...page, updated: eff } : page;
      if (eff && (!effBySlug.has(page.slug) || eff > effBySlug.get(page.slug))) effBySlug.set(page.slug, eff);
      const html = renderPage(shown, lang, ctx, content, { buildInfo, hasFile, version: VERSION });
      reportFallbacks(page, lang);
      leakCheck(page, lang, content);
      writeFileSync(join(OUT, lang, `${page.slug}.html`), html);
      count++;
      if (!page.noSearch) {
        const g = nav.GROUPS[page.group] || nav.groupOf(page.slug);
        search[lang].push({
          url: `${page.slug}.html`,
          title: String(L(lang, page.title)).replace(/<[^>]*>/g, ''),
          group: g?.id || '',
          groupLabel: g ? L(lang, g.label) : '',
          text: `${strip(L(lang, page.description))} ${strip(content)}`.slice(0, 40000),
          updated: eff || page.updated || page.published || '',
        });
      }
    } catch (e) {
      fallbacks = null; touched = null;
      errors.push(`render failed: page "${page.slug}" [${lang}] (${page.__file}) — ${e.stack || e}`);
    }
  }
}

// 404 (root, Kazakh + links to all languages)
for (const page of renderList.filter((p) => p.root)) {
  const lang = 'kz';
  const ctx = makeCtx(lang, page, '/');
  uiMod._setContext({ lang, href: ctx.href, asset: ctx.asset, api: '/api/feedback.php' });
  try {
    let html = renderPage(page, lang, ctx, page.render(lang, ctx), { buildInfo, hasFile, version: VERSION });
    // The root 404 is served for a missing URL at ANY depth, and the site may live in a sub-folder
    // (GitHub Pages: /keremet-school-website/). Make its root-absolute URLs relative and set <base> at runtime.
    html = html.replace(/(\s(?:href|src|action)=")\/(?!\/)/g, '$1');
    // Chrome's preload scanner would fetch styles/scripts/fonts before <base> exists (wrong folder → 404s),
    // so the 404 page writes them together with <base> from one inline script. Font preloads are dropped.
    const moved = [];
    html = html.replace(/<link rel="preload"[^>]*>\n?/g, '')
      .replace(/<link rel="stylesheet"[^>]*>\n?/g, (m) => { moved.push(m.trim()); return ''; })
      .replace(/<script[^>]*\ssrc="[^"]*"[^>]*><\/script>\n?/g, (m) => { moved.push(m.trim()); return ''; });
    const movedJs = JSON.stringify(moved.join('')).replace(/<\//g, '<\\/');
    const BASE_SCRIPT = `<script>(function(){var b="/";if(/\\.github\\.io$/.test(location.hostname)){var s=location.pathname.split("/")[1];if(s)b="/"+s+"/";}document.write('<base href="'+b+'">'+${movedJs});})();</script>`;
    html = html.replace('<meta charset="utf-8">', `<meta charset="utf-8">\n${BASE_SCRIPT}`);
    writeFileSync(join(OUT, `${page.slug}.html`), html);
    count++;
  } catch (e) { errors.push(`render failed: page "${page.slug}" [root] — ${e.stack || e}`); }
}

// ------------------------------------------------------------------ search index
mkdirSync(join(OUT, 'assets', 'search'), { recursive: true });
for (const lang of LANGS) writeFileSync(join(OUT, 'assets', 'search', `${lang}.json`), JSON.stringify(search[lang]));

// ------------------------------------------------------------------ root language router
const langLinks = ALL_LANGS.map((l) => `<a href="${l}/index.html" hreflang="${HTML_LANG[l]}" lang="${HTML_LANG[l]}">${{ kz: 'Қазақша', ru: 'Русский', en: 'English' }[l]}</a>`).join('');
writeFileSync(join(OUT, 'index.html'), `<!DOCTYPE html>
<html lang="kk">
<!-- ${buildInfo} · language router -->
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${school.name.kz} · ${school.name.ru} · ${school.name.en}</title>
<meta name="description" content="${school.name.kz} — ${school.name.ru}, ${t('ru', 'hdr.orgType')}, Шымкент.">
<link rel="canonical" href="${SITE_URL}/kz/">
${ALL_LANGS.map((l) => `<link rel="alternate" hreflang="${HTML_LANG[l]}" href="${SITE_URL}/${l}/">`).join('\n')}
<link rel="alternate" hreflang="x-default" href="${SITE_URL}/kz/">
<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
<meta name="theme-color" content="#0B0F2B">
<script>(function(){var l='kz';try{var s=localStorage.getItem('keremet-lang');if(s==='ru'||s==='en'||s==='kz')l=s;}catch(e){}location.replace(l+'/index.html'+location.hash);})();</script>
<noscript><meta http-equiv="refresh" content="0; url=kz/index.html"></noscript>
<style>html{background:#070A1F;color:#EEF1FF;font:18px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif}body{min-height:100vh;margin:0;display:grid;place-items:center;text-align:center;padding:24px}svg{width:88px;height:88px}h1{font-size:1.4rem;margin:.8em 0 .2em}nav{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:1.2em}a{color:#0B0F2B;background:#FFB627;padding:.7em 1.2em;border-radius:999px;text-decoration:none;font-weight:600}a:focus-visible{outline:3px solid #fff;outline-offset:3px}</style>
</head>
<body>
<main>
<svg viewBox="0 0 64 64" fill="none" stroke="#FFB627" stroke-linecap="round" aria-hidden="true"><path d="${uiMod.SHANYRAK_PATHS.rays}" stroke-width="${uiMod.SHANYRAK_PATHS.widths.rays}"/><circle cx="32" cy="32" r="20" stroke-width="${uiMod.SHANYRAK_PATHS.widths.ring}"/><path d="${uiMod.SHANYRAK_PATHS.bars}" stroke-width="${uiMod.SHANYRAK_PATHS.widths.bars}"/></svg>
<h1>${school.name.kz}</h1>
<p>${school.name.ru} · ${school.name.en}</p>
<nav aria-label="Тіл / Язык / Language">${langLinks}</nav>
</main>
</body>
</html>
`);

// ------------------------------------------------------------------ sitemap.xml & robots.txt
const lastmod = (p) => (effBySlug.get(p.slug) || p.updated || p.published || stamp.toISOString()).slice(0, 10);
const smPages = pages.filter((p) => p.slug && !p.root && !p.noindex);
writeFileSync(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${smPages.flatMap((p) => ALL_LANGS.map((l) => `<url><loc>${absUrl(p.slug, l)}</loc><lastmod>${lastmod(p)}</lastmod>${ALL_LANGS.map((a) => `<xhtml:link rel="alternate" hreflang="${HTML_LANG[a]}" href="${absUrl(p.slug, a)}"/>`).join('')}<priority>${p.home ? '1.0' : '0.7'}</priority></url>`)).join('\n')}
</urlset>
`);
writeFileSync(join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

// ------------------------------------------------------------------ RSS per language
const xml = (s) => String(s ?? '').replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]);
// pubDate = when the item was published on this website (news.mjs postedOf: 'YYYY-MM-DDTHH:MM', Shymkent time UTC+5)
const rfc822 = (stamp) => {
  const [d, tm = '00:00'] = String(stamp).split('T');
  return new Date(`${d}T${tm.slice(0, 5)}:00+05:00`).toUTCString().replace('GMT', '+0000');
};
const postedOf = newsMod.postedOf || ((n) => n.posted || `${n.date}T${n.time || '00:00'}`);
const tagLabel = (lang, id) => (newsMod.NEWS_TAGS && newsMod.NEWS_TAGS[id] ? L(lang, newsMod.NEWS_TAGS[id]) : id);
for (const lang of LANGS) {
  const items = newsMod.sortedNews();
  writeFileSync(join(OUT, lang, 'rss.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${xml(L(lang, school.name))} — ${xml(t(lang, 'news.all'))}</title>
<link>${SITE_URL}/${lang}/news.html</link>
<atom:link href="${SITE_URL}/${lang}/rss.xml" rel="self" type="application/rss+xml"/>
<description>${xml(t(lang, 'site.slogan'))}</description>
<language>${HTML_LANG[lang]}</language>
<lastBuildDate>${stamp.toUTCString().replace('GMT', '+0000')}</lastBuildDate>
${items.map((n) => `<item><title>${xml(L(lang, n.title))}</title><link>${SITE_URL}/${lang}/news-${n.id}.html</link><guid isPermaLink="true">${SITE_URL}/${lang}/news-${n.id}.html</guid><pubDate>${rfc822(postedOf(n))}</pubDate><description>${xml(L(lang, n.lead))}</description>${(n.tags || []).map((tg) => `<category>${xml(tagLabel(lang, tg))}</category>`).join('')}</item>`).join('\n')}
</channel>
</rss>
`);
}

// ------------------------------------------------------------------ school.mjs slots nobody reads
// A TODO(school) slot the school has filled but no page (or the layout) read: the data would never reach the site.
if (!ONLY && schoolMod.TODO_SLOTS && schoolMod._reads) {
  const reads = [...schoolMod._reads()];
  const filled = (v) => v != null && v !== '' && !(Array.isArray(v) && !v.length) && !(typeof v === 'object' && !Array.isArray(v) && !Object.keys(v).length);
  for (const slot of schoolMod.TODO_SLOTS) {
    if (!filled(schoolMod._peek(slot))) continue;
    if (!reads.some((r) => r === slot || r.startsWith(`${slot}.`))) warn(`school.mjs: "${slot}" is filled but no page reads it — wire it with ui.slot() in its page (see the DATA CONTRACT in school.mjs)`);
  }
}

// ------------------------------------------------------------------ report
for (const k of missingKeys()) warn(`i18n: missing UI string key "${k}"`);
const ms = Math.round(performance.now() - t0);
if (!QUIET || errors.length) {
  if (warnings.length) {
    console.log(`\n⚠ ${warnings.length} warning(s):`);
    for (const w of warnings) console.log(`  · ${w}`);
  }
  if (errors.length) {
    console.log(`\n✖ ${errors.length} error(s):`);
    for (const e of errors) console.log(`  · ${e}`);
  }
}
// count = per-language pages × LANGS + root pages (404.html, Kazakh with links to every language); the root language
// router index.html is written separately and not counted.
const rootPages = renderList.filter((p) => p.root);
const langPageN = renderList.length - rootPages.length;
console.log(`\n${errors.length ? '✖' : '✔'} ${count} HTML file(s) = ${langPageN} page(s) × ${LANGS.join('/')}${rootPages.length ? ` + root ${rootPages.map((p) => `${p.slug}.html`).join(', ')}` : ''} (+ language router index.html) → ${relative(process.cwd(), OUT) || OUT} in ${ms} ms`);
if (errors.length) process.exit(1);
