// =====================================================================================
//  src/ui.mjs — HTML component helpers. Every function returns an HTML STRING.
//
//  TEXT ARGUMENTS: any text parameter accepts a plain string OR a localised object {kz,ru,en}
//  (picked automatically for the language being rendered). Strings are inserted AS HTML, so you
//  may use <strong>, <a>, <br>. Escape untrusted/user data yourself with esc().
//  The current language / URL prefix is set by build.mjs before each render (_setContext);
//  pages never need to pass `lang` to components (but pending(lang)/form({lang}) accept it).
//
//  ── Basics ─────────────────────────────────────────────────────────────────────────
//  esc(str)                                   HTML-escape (& < > " ')
//  icon(name, {size=20, cls, label})          inline SVG icon (see ICON_NAMES); aria-hidden unless label
//  logo({size, mono, withText, cls})          shanyrak mark (+ KEREMET wordmark) — currentColor when mono
//  ornament({cls})                            Kazakh "қошқар мүйіз" ram-horn ornament (decorative)
//  band({cls})                                ornament band — a strip of ram-horn motifs fading at both ends (decorative)
//  shanyrakArt({cls})                         large thin-line shanyrak artwork (currentColor) for heroes/backgrounds
//  panel({theme, body, cls})                  themed pattern panel (rounded, padded) for any content
//  divider()                                  ornament divider line
//  button({href, label, kind:'primary'|'ghost'|'light'|'gold'|'link', icon, iconLeft, size:'s'|'m'|'l', ext, attrs, type})
//  extLink(href, label, {cls})                external link: target=_blank rel=noopener + sr text + ↗
//  badge(text, kind:'default'|'ok'|'warn'|'info'|'accent')
//  chips(items:[string|{label, icon, href}])  pill list
//  eyebrow(text)                              small uppercase label with accent dot
//  lead(html)   prose(html)   note(html)      typography wrappers (.lead, .prose, .note)
//
//  ── Layout ─────────────────────────────────────────────────────────────────────────
//  section({title, id, body, tone, eyebrow, lead, actions, width, cls, level})
//        tone: 'plain' (default) | 'card' | 'tint' | 'dark' | any THEME id ('math','physics',…) → themed pattern panel
//        width: 'narrow' | 'wide' ; level: heading level (default 2)
//  grid({cols:2|3|4, items:[html]|body, gap:'s'|'m'|'l', cls})     responsive auto grid
//  split({left, right, ratio:'1:1'|'2:1'|'1:2'|'3:2', reverse, align:'start'|'center'})
//  toc(items:[{id, label}])                   "On this page" anchor list (long pages)
//
//  ── Content ────────────────────────────────────────────────────────────────────────
//  cards(items:[{title, text, icon, href, tag, meta, ext, theme}], {cols, variant:'default'|'plain'|'feature'})
//  stats(items:[{value, label, note, icon, extra, art}])  stat(item)   big numbers bento (extra: html under the note;
//        art:true → faint shanyrak artwork in the card corner — use on the big first card of .stats--bento)
//  facts(items:[{k, v, copy}], {cols:1|2})   definition list; copy:true adds copy-to-clipboard button
//  table({head:[], rows:[[]], caption, captionHidden, cls, compact, numeric:[colIdx], stack})  captionHidden: caption for screen readers only (when a heading right above already says it)  responsive: stacks into label/value
//        cards <640px; stack:false (= class tbl--static) keeps a real grid that scrolls sideways — use it for
//        calendars, subject-hours matrices and other grids. Cell content is wrapped in .tbl__v (one grid item).
//  accordion(items:[{q, a, open, id}], {exclusive})
//  timeline(items:[{date|time, title, text, tag}])     date = 'YYYY-MM-DD' (formatted) or any text
//  steps(items:[string | {title, text}])
//  callout({type:'info'|'warn'|'ok', title, text, icon})
//  quote({text, cite, role})
//  banner({title, text, href, label, theme, icon, eyebrow, ext})   themed pattern CTA banner
//  linkList(items:[{label, href, note, ext, icon}])
//  people(items:[person])  personCard(person)
//        person = {name, role, photo, alt, text, contacts:[{type:'phone'|'email'|'text'|'link', value, label, href}], reception}
//  gallery(items:[{src, alt, caption, href}], {cols})   src relative to assets/ (e.g. 'docs/x.jpg') or absolute URL
//  docList(items:[{title, file, type:'pdf'|'jpg'|'doc'|'link', date, size, number, note, url, archived, posted, changed, thumb}], {thumbs})
//        accepts entries of src/data/documents.mjs directly; file:null → "Құжат жүктеледі" pending row;
//        posted/changed ('YYYY-MM-DDTHH:MM') → "Орналастырылды / Размещено / Posted dd.mm.yyyy hh:mm";
//        thumbs:true shows the small preview d.thumb (docs/thumbs/*.webp) and links the full scan
//  pending(lang?, note?)  or pending({title, note})     "Ақпарат толықтырылуда" block (use for any unknown data)
//  slot(value, render, pendingArg)            school.mjs TODO slot: render(value) when filled, else pending(pendingArg)
//        e.g. ui.slot(S.schedule.bells, (b) => ui.table({…}), { note: X('…') })  — empty array / {} count as empty
//  newsCard(item) / newsList(items, {limit})            items from src/data/news.mjs → links to news-<id>.html
//  contactList({admission})                  phones, WhatsApp, e-mail, address, hours, Instagram (from school.mjs)
//  schoolEmail()                             the school mailbox as a mailto link — or, while none is confirmed, the text
//                                            «Ресми e-mail нақтылануда / Официальный e-mail уточняется» (no address)
//  requisites()                              legal requisites (facts with copy buttons)
//  mapEmbed(lat, lng, {zoom, title, height})  lazy OpenStreetMap iframe + "open larger map" link
//  form({kind:'feedback'|'blog'|'admission', lang, id})  accessible form (validation/POST by main.js)
//
//  ── Layout-level (used by layout.mjs; pages normally don't call) ──────────────────
//  pageHero({title, lead, crumbs, eyebrow, theme, sub, accent})   crumbs(items:[{label, href}])
//  pageMeta(page, {cls})   published/updated line (layout adds it; landing may place <!--page-meta--> marker)
// =====================================================================================
import { L, t, fmtDate, fmtDateTime, fmtSize, LANGS } from './i18n.mjs';
import { school } from './data/school.mjs';

// ------------------------------------------------------------------ render context
let C = {
  lang: 'kz',
  href: (slug) => `${slug}.html`,
  asset: (p) => `../assets/${p}`,
};
/** Called by build.mjs before rendering each page×lang. */
export function _setContext(ctx) { C = { ...C, ...ctx }; }
const tx = (v) => (v == null ? '' : L(C.lang, v));
const T = (key, vars) => t(C.lang, key, vars);
let uid = 0;
const nextId = (p = 'u') => `${p}-${(++uid).toString(36)}`;

// ------------------------------------------------------------------ basics
export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
const attr = (s) => esc(String(s ?? '').replace(/<[^>]*>/g, ''));
function attrs(o = {}) {
  return Object.entries(o).filter(([, v]) => v !== false && v != null).map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${attr(v)}"`)).join('');
}
const isExt = (href) => /^https?:\/\//i.test(href || '') && !/^https?:\/\/(www\.)?keremet\.edu\.kz/i.test(href);
const assetUrl = (p) => (!p ? '' : /^(https?:|\/|\.\.?\/|data:)/.test(p) ? p : C.asset(p));

// ------------------------------------------------------------------ icons
const I = {
  'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
  'arrow-left': '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  'arrow-up': '<path d="M12 19V5M6 11l6-6 6 6"/>',
  ext: '<path d="M7 17 17 7M9 7h8v8"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'chevron-right': '<path d="m9 6 6 6-6 6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
  whatsapp: '<path d="M3.5 20.5 4.8 16A8.5 8.5 0 1 1 8 19.3Z"/><path d="M9 8.5c-.3 3 2.9 6.6 6.3 6.6l.9-1.6-2-1-.9.8a4 4 0 0 1-2.2-2.2l.8-.9-1-2Z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".9" fill="currentColor" stroke="none"/>',
  doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>',
  download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/>',
  warn: '<path d="M12 3.5 2.5 20h19Z"/><path d="M12 10v4.5M12 17.2v.01"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  home: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 13.6a7 7 0 0 1 4 6.4"/>',
  book: '<path d="M2 5h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2Z"/><path d="M22 5h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7Z"/>',
  star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9Z"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6Z"/><path d="m9 12 2 2 4-4"/>',
  heart: '<path d="M12 20s-8-4.6-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.4 12 20 12 20Z"/>',
  school: '<path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-5h6v5"/><circle cx="12" cy="11" r="1.5"/>',
  utensils: '<path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M17 3c-2 0-3 2-3 6s1 5 3 5v7"/>',
  sparkles: '<path d="M11 3c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7Z"/><path d="M19 15v5M16.5 17.5h5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"/>',
  calculator: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>',
  trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0Z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M9.5 17h5l.5 4h-6Z"/>',
  languages: '<path d="M4 5h8M8 3v2M6 5c0 4 2 7 5 8M10 5c0 4-3 7-6 8"/><path d="m13 21 4-9 4 9M14.5 18h5"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  coins: '<ellipse cx="9" cy="7" rx="6" ry="3"/><path d="M3 7v4c0 1.7 2.7 3 6 3s6-1.3 6-3V7"/><path d="M9 14v3c0 1.7 2.7 3 6 3s6-1.3 6-3v-4c0-1.6-2.4-2.9-5.5-3"/>',
  ball: '<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6c3 3 3 9.8 0 12.8M18.4 5.6c-3 3-3 9.8 0 12.8"/>',
  code: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/>',
  robot: '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4.5V8M9 13v1M15 13v1M9.5 17h5"/><circle cx="12" cy="3.5" r="1"/>',
  atom: '<circle cx="12" cy="12" r="1.6"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>',
  flask: '<path d="M9 3h6M10 3v6L4.5 18.5A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-2.5L14 9V3"/><path d="M7 15h10"/>',
  leaf: '<path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15Z"/><path d="M5 19 13 11"/>',
  palette: '<path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2s-1-1.5-1-2.5 1-1.5 2-1.5h2a4 4 0 0 0 4-4c0-4.5-4-8-9-8Z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  print: '<path d="M7 9V3h10v6M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/><rect x="7" y="14" width="10" height="7"/>',
  rss: '<path d="M5 5a14 14 0 0 1 14 14M5 11a8 8 0 0 1 8 8"/><circle cx="6" cy="18" r="1.5"/>',
  pause: '<path d="M9 5v14M15 5v14"/>',
  play: '<path d="M7 4.5v15l12-7.5Z"/>',
  sitemap: '<rect x="9" y="3" width="6" height="5" rx="1"/><rect x="3" y="16" width="6" height="5" rx="1"/><rect x="15" y="16" width="6" height="5" rx="1"/><path d="M12 8v4M6 16v-4h12v4"/>',
  accessible: '<circle cx="10" cy="4.5" r="1.6"/><path d="M10 7.5V13h5.5l2 5M10 10h5"/><path d="M8 11.3A5 5 0 1 0 14.6 18"/>',
  parking: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M9.5 17V7h3.5a3 3 0 0 1 0 6H9.5"/>',
  bus: '<rect x="4" y="3" width="16" height="15" rx="3"/><path d="M4 11h16M8 21v-3M16 21v-3M8 14.5h.01M16 14.5h.01"/>',
  bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3Z"/>',
  hourglass: '<path d="M6 3h12M6 21h12M7 3c0 5 5 6 5 9s-5 4-5 9M17 3c0 5-5 6-5 9s5 4 5 9"/>',
  chat: '<path d="M4 5h16v11H9l-5 4Z"/><path d="M8 9h8M8 12h5"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  medical: '<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M9 6V4h6v2M12 10v6M9 13h6"/>',
  graduation: '<path d="m2 9 10-5 10 5-10 5Z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
  scale: '<path d="M12 4v17M7 21h10M5 7h14M5 7l-3 7a3 3 0 0 0 6 0Zm14 0-3 7a3 3 0 0 0 6 0Z"/>',
  building: '<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M9 7h.01M15 7h.01M9 11h.01M15 11h.01M9 15h.01M15 15h.01M10 21v-3h4v3"/>',
  handshake: '<path d="m11 17 2 2a1.4 1.4 0 0 0 2-2M13 15l2.5 2.5a1.4 1.4 0 0 0 2-2L14 12l-3 1.5a2 2 0 0 1-2.5-3L11 8h3l4.5 4.5M3 13l4 4M21 11l-3-5-4 2M3 8l4-2 2 1"/>',
  quote: '<path d="M10 7H6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3v1a3 3 0 0 1-3 3M20 7h-4a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3v1a3 3 0 0 1-3 3"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5Z"/>',
  sliders: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
  logo: '', // special-cased
};
export const ICON_NAMES = Object.keys(I);

export function icon(name, { size = 20, cls = '', label } = {}) {
  if (name === 'logo') return logo({ size, mono: true, cls });
  const body = I[name] || I.info;
  const a11y = label ? `role="img" aria-label="${attr(label)}"` : 'aria-hidden="true" focusable="false"';
  return `<svg class="ico${cls ? ' ' + cls : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ${a11y}>${body}</svg>`;
}

// ------------------------------------------------------------------ brand marks
/** Shanyrak mark geometry (viewBox 0 0 64 64): 16 roof poles (уық), the crown ring and two pairs of
 *  crossbars (күлдіреуіш) seen from below — straight "#", no centre cross, so it never reads as a globe. */
export const SHANYRAK_PATHS = (() => {
  const f = (n) => n.toFixed(2);
  const rays = [];
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + Math.PI / 16;
    const r1 = 24.5, r2 = i % 2 ? 29 : 31.5;
    rays.push(`M${f(32 + r1 * Math.cos(a))} ${f(32 + r1 * Math.sin(a))}L${f(32 + r2 * Math.cos(a))} ${f(32 + r2 * Math.sin(a))}`);
  }
  const R = 20, d = 7.5, h = Math.sqrt(R * R - d * d);
  const bars = [-d, d].flatMap((o) => [`M${f(32 + o)} ${f(32 - h)}V${f(32 + h)}`, `M${f(32 - h)} ${f(32 + o)}H${f(32 + h)}`]).join('');
  return { rays: rays.join(''), ring: '<circle cx="32" cy="32" r="20"/>', bars, widths: { rays: 2.8, ring: 4, bars: 3 } };
})();

/** Shanyrak mark (+ optional wordmark). mono → uses currentColor; else sun-gold. */
export function logo({ size = 44, mono = false, withText = false, cls = '', title } = {}) {
  const col = mono ? 'currentColor' : 'var(--sun, #FFB627)';
  const a11y = title ? `role="img" aria-label="${attr(title)}"` : 'aria-hidden="true" focusable="false"';
  const w = SHANYRAK_PATHS.widths;
  const mark = `<svg class="shanyrak${cls ? ' ' + cls : ''}" width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" stroke="${col}" stroke-linecap="round" ${a11y}><path d="${SHANYRAK_PATHS.rays}" stroke-width="${w.rays}"/><circle cx="32" cy="32" r="20" stroke-width="${w.ring}"/><path d="${SHANYRAK_PATHS.bars}" stroke-width="${w.bars}"/></svg>`;
  if (!withText) return mark;
  return `<span class="brand">${mark}<span class="brand__text"><span class="brand__word">KEREMET</span><span class="brand__sub">${esc(school.wordmarkSub)}</span></span></span>`;
}

/** Large thin-line shanyrak artwork (decorative, aria-hidden) for heroes/backgrounds. Colour = currentColor.
 *  Top view of the yurt crown: 48 roof poles, a double crown ring and two woven pairs of crossbar bands. */
export const SHANYRAK_ART = (() => {
  const c = 300, f = (n) => n.toFixed(1), rays = [];
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2 + Math.PI / 48, r1 = 206, r2 = i % 4 === 0 ? 268 : i % 2 ? 238 : 252;
    rays.push(`M${f(c + r1 * Math.cos(a))} ${f(c + r1 * Math.sin(a))}L${f(c + r2 * Math.cos(a))} ${f(c + r2 * Math.sin(a))}`);
  }
  // crossbars: 2 bands per direction (centre offset ±B, half-width W), woven over/under
  const Ri = 186, B = 64, W = 9, GAP = W + 6, bands = [-B, B];
  const seg = (fixed, from, to, vertical) => (vertical ? `M${f(fixed)} ${f(from)}V${f(to)}` : `M${f(from)} ${f(fixed)}H${f(to)}`);
  const lines = [];
  for (const vertical of [true, false]) {
    for (const bi of bands) {
      for (const side of [-W, W]) {
        const off = bi + side, half = Math.sqrt(Ri * Ri - off * off);
        // this band goes UNDER the crossing band when sign(bi*bj) says so → break the line there
        const breaks = bands.filter((bj) => (vertical ? bi * bj < 0 : bi * bj > 0)).map((bj) => [c + bj - GAP, c + bj + GAP]).sort((a, b) => a[0] - b[0]);
        let from = c - half;
        for (const [g0, g1] of breaks) { lines.push(seg(c + off, from, g0, vertical)); from = g1; }
        lines.push(seg(c + off, from, c + half, vertical));
      }
    }
  }
  return { rays: rays.join(''), bars: lines.join('') };
})();
export function shanyrakArt({ cls = '' } = {}) {
  const A = SHANYRAK_ART;
  const ns = 'vector-effect="non-scaling-stroke"';
  return `<svg class="shanyrak-art${cls ? ' ' + cls : ''}" viewBox="0 0 600 600" fill="none" stroke="currentColor" stroke-linecap="round" aria-hidden="true" focusable="false"><circle cx="300" cy="300" r="292" stroke-width="1" stroke-dasharray="2 10" ${ns}/><path d="${A.rays}" stroke-width="1.4" ${ns}/><circle cx="300" cy="300" r="200" stroke-width="2.6" ${ns}/><circle cx="300" cy="300" r="186" stroke-width="1" ${ns}/><path d="${A.bars}" stroke-width="1.5" ${ns}/><path d="M300 282l18 18-18 18-18-18z" stroke-width="1.2" ${ns}/><circle cx="300" cy="300" r="3" fill="currentColor" stroke="none"/></svg>`;
}

/** Ram-horn ornament ("қошқар мүйіз"), decorative. */
export function ornament({ cls = '' } = {}) {
  return `<svg class="ornament${cls ? ' ' + cls : ''}" viewBox="0 0 120 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M60 58V36c0-10 6-17 15-19 10-2 18 5 17 13-1 7-9 10-14 6-4-3-2-9 3-8"/><path d="M60 36c0-10-6-17-15-19-10-2-18 5-17 13 1 7 9 10 14 6 4-3 2-9-3-8"/><path d="M60 26c0-6 3-10 3-14M60 26c0-6-3-10-3-14" stroke-width="2.2"/><path d="M92 30c6 0 12 4 14 10M28 30c-6 0-12 4-14 10" stroke-width="2.2"/><circle cx="60" cy="8" r="2.4" fill="currentColor" stroke="none"/></svg>`;
}
/** Themed pattern panel for any content: panel({theme:'hero', body, cls, pad}) */
export function panel({ theme = 'hero', body = '', cls = '' } = {}) {
  return `<div class="panel pattern${cls ? ' ' + cls : ''}" data-theme="${attr(theme)}">${tx(body)}</div>`;
}
/** Ornament band (textile border of ram-horn motifs), decorative. Colour: --band-color (default theme accent). */
export function band({ cls = '' } = {}) { return `<div class="orn-band${cls ? ' ' + cls : ''}" aria-hidden="true"></div>`; }
export function divider() { return `<div class="divider" role="presentation">${ornament()}</div>`; }

// ------------------------------------------------------------------ small pieces
export function button({ href, label, kind = 'primary', icon: ic, iconLeft, size = 'm', ext, attrs: extra = {}, type = 'button', cls = '' } = {}) {
  const external = ext ?? isExt(href);
  const c = `btn btn--${kind}${size !== 'm' ? ' btn--' + size : ''}${cls ? ' ' + cls : ''}`;
  const inner = `${iconLeft ? icon(iconLeft) : ''}<span>${tx(label)}</span>${ic ? icon(ic) : external ? icon('ext', { cls: 'ico--ext' }) : ''}${external ? `<span class="sr-only"> ${T('extNewTab')}</span>` : ''}`;
  if (!href) return `<button type="${type}" class="${c}"${attrs(extra)}>${inner}</button>`;
  const ea = external ? { target: '_blank', rel: 'noopener', 'data-ext': '' } : {};
  return `<a class="${c}" href="${attr(href)}"${attrs({ ...ea, ...extra })}>${inner}</a>`;
}
export function extLink(href, label, { cls = '' } = {}) {
  return `<a class="ext${cls ? ' ' + cls : ''}" href="${attr(href)}" target="_blank" rel="noopener" data-ext>${tx(label) || esc(href)}<span class="sr-only"> ${T('extNewTab')}</span>${icon('ext', { size: 14, cls: 'ico--ext' })}</a>`;
}
/** Smart link: external → extLink, internal → plain <a>. */
function link(href, label, cls = '') {
  return isExt(href) ? extLink(href, label, { cls }) : `<a${cls ? ` class="${cls}"` : ''} href="${attr(href)}">${tx(label)}</a>`;
}
export function badge(text, kind = 'default') { return `<span class="badge badge--${kind}">${tx(text)}</span>`; }
export function chips(items = [], { cls = '' } = {}) {
  return `<ul class="chips${cls ? ' ' + cls : ''}" role="list">${items.map((it) => {
    const o = typeof it === 'object' && !('kz' in it || 'ru' in it) ? it : { label: it };
    const inner = `${o.icon ? icon(o.icon, { size: 16 }) : ''}<span>${tx(o.label)}</span>`;
    return `<li>${o.href ? `<a class="chip" href="${attr(o.href)}">${inner}</a>` : `<span class="chip">${inner}</span>`}</li>`;
  }).join('')}</ul>`;
}
export function eyebrow(text) { return `<p class="eyebrow"><span class="eyebrow__dot" aria-hidden="true"></span>${tx(text)}</p>`; }
export function lead(html) { return `<p class="lead">${tx(html)}</p>`; }
export function prose(html) { return `<div class="prose">${tx(html)}</div>`; }
export function note(html) { return `<p class="note">${icon('info', { size: 16 })}<span>${tx(html)}</span></p>`; }

// ------------------------------------------------------------------ layout
const THEMES = ['hero', 'math', 'physics', 'chemistry', 'biology', 'geography', 'languages', 'informatics', 'arts', 'day', 'paper'];
export function section({ title, id, body = '', tone = 'plain', eyebrow: eb, lead: ld, actions, width, cls = '', level = 2 } = {}) {
  const themed = THEMES.includes(tone);
  const c = ['sec', `sec--${themed ? 'themed' : tone}`, width ? `sec--${width}` : '', cls].filter(Boolean).join(' ');
  const hid = id ? `${id}-title` : null;
  const head = title || eb || ld ? `<header class="sec__head">${eb ? eyebrow(eb) : ''}${title ? `<h${level} class="sec__title"${hid ? ` id="${hid}"` : ''}>${tx(title)}</h${level}>` : ''}${ld ? `<p class="sec__lead">${tx(ld)}</p>` : ''}</header>` : '';
  const tail = actions ? `<div class="sec__actions">${actions}</div>` : '';
  const a = attrs({ id, class: c, 'data-theme': themed ? tone : null, 'aria-labelledby': title && hid ? hid : null, 'data-reveal': '' });
  const inner = `${head}<div class="sec__body">${tx(body)}</div>${tail}`;
  return `<section${a}>${themed ? `<div class="sec__panel pattern">${inner}</div>` : inner}</section>`;
}
export function grid({ cols = 3, items, body, gap = 'm', cls = '' } = {}) {
  const inner = items ? items.map((x) => `<div class="grid__item">${tx(x)}</div>`).join('') : tx(body);
  return `<div class="grid grid--${cols} grid--gap-${gap}${cls ? ' ' + cls : ''}">${inner}</div>`;
}
export function split({ left = '', right = '', ratio = '1:1', reverse = false, align = 'start', cls = '' } = {}) {
  return `<div class="split split--${ratio.replace(':', '-')}${reverse ? ' split--reverse' : ''} split--${align}${cls ? ' ' + cls : ''}"><div class="split__a">${tx(left)}</div><div class="split__b">${tx(right)}</div></div>`;
}
export function toc(items = []) {
  return `<nav class="toc" aria-label="${attr(T('onThisPage'))}"><p class="toc__title">${T('onThisPage')}</p><ol class="toc__list">${items.map((it) => `<li><a href="#${attr(it.id)}">${tx(it.label)}</a></li>`).join('')}</ol></nav>`;
}

// ------------------------------------------------------------------ content
export function cards(items = [], { cols, variant = 'default', cls = '' } = {}) {
  const g = cols ? ` cards--${cols}` : '';
  return `<ul class="cards cards--${variant}${g}${cls ? ' ' + cls : ''}" role="list" data-reveal-stagger>${items.map((it) => {
    const ext = it.ext ?? isExt(it.href);
    const titleHtml = it.href
      ? `<a class="card__link" href="${attr(it.href)}"${ext ? ' target="_blank" rel="noopener" data-ext' : ''}>${tx(it.title)}${ext ? `<span class="sr-only"> ${T('extNewTab')}</span>` : ''}</a>`
      : tx(it.title);
    const compact = !it.text && !it.meta && !it.tag;
    return `<li class="card${it.href ? ' card--link' : ''}${compact ? ' card--compact' : ''}"${it.theme ? ` data-theme="${attr(it.theme)}"` : ''}>
${it.icon ? `<span class="card__icon">${icon(it.icon, { size: 24 })}</span>` : ''}${it.tag ? `<span class="card__tag">${tx(it.tag)}</span>` : ''}
<h3 class="card__title">${titleHtml}</h3>${it.text ? `<div class="card__text">${tx(it.text)}</div>` : ''}${it.meta ? `<p class="card__meta">${tx(it.meta)}</p>` : ''}${it.href ? `<span class="card__arrow" aria-hidden="true">${icon(ext ? 'ext' : 'arrow-right')}</span>` : ''}</li>`;
  }).join('')}</ul>`;
}
export function stat({ value, label, note: n, icon: ic, extra, art } = {}) {
  const v = String(tx(value));
  const long = v.replace(/<[^>]*>/g, '').length > 5 && /[^\d\s.,–+%-]/.test(v);
  return `<div class="stat${art ? ' stat--art' : ''}">${art ? shanyrakArt({ cls: 'stat__art' }) : ''}${ic ? `<span class="stat__icon">${icon(ic, { size: 22 })}</span>` : ''}<p class="stat__value${long ? ' stat__value--text' : ''}">${v}</p><p class="stat__label">${tx(label)}</p>${n ? `<p class="stat__note">${tx(n)}</p>` : ''}${extra ? `<div class="stat__extra">${tx(extra)}</div>` : ''}</div>`;
}
export function stats(items = [], { cls = '' } = {}) {
  return `<div class="stats${cls ? ' ' + cls : ''}" data-reveal-stagger>${items.map(stat).join('')}</div>`;
}
export function facts(items = [], { cols = 1, cls = '' } = {}) {
  return `<dl class="facts facts--${cols}${cls ? ' ' + cls : ''}">${items.filter(Boolean).map((it) => {
    const v = tx(it.v);
    const copy = it.copy ? `<button type="button" class="copy-btn" data-copy="${attr(typeof it.copy === 'string' ? it.copy : v)}" aria-label="${attr(T('copy') + ': ' + String(tx(it.k)).replace(/<[^>]*>/g, ''))}">${icon('copy', { size: 16 })}<span class="copy-btn__txt">${T('copy')}</span></button>` : '';
    return `<div class="facts__row"><dt>${tx(it.k)}</dt><dd><span class="facts__v">${v || '—'}</span>${copy}</dd></div>`;
  }).join('')}</dl>`;
}
export function table({ head = [], rows = [], caption, captionHidden = false, cls = '', compact = false, numeric = [], stack = true } = {}) {
  const hs = head.map(tx);
  const plain = (h) => String(h).replace(/<[^>]*>/g, '');
  // .tbl__v keeps mixed content ("text <a>link</a> text", "<kbd>Tab</kbd> / <kbd>Shift</kbd>") in ONE grid cell
  // when the row stacks on phones; without it every text run / element became its own grid item.
  const v = (c) => (stack ? `<div class="tbl__v">${c}</div>` : c);
  return `<div class="tbl-wrap${stack ? '' : ' tbl-wrap--static'}"><table class="tbl${compact ? ' tbl--compact' : ''}${stack ? '' : ' tbl--static'}${cls ? ' ' + cls : ''}">${caption ? `<caption${captionHidden ? ' class="sr-only"' : ''}>${tx(caption)}</caption>` : ''}
${hs.length ? `<thead><tr>${hs.map((h, i) => `<th scope="col"${numeric.includes(i) ? ' class="num"' : ''}>${h}</th>`).join('')}</tr></thead>` : ''}
<tbody>${rows.map((r) => `<tr>${r.map((c, i) => {
    const cell = v(tx(c));
    return i === 0 && hs.length ? `<th scope="row" data-label="${attr(plain(hs[0] || ''))}">${cell}</th>` : `<td data-label="${attr(plain(hs[i] || ''))}"${numeric.includes(i) ? ' class="num"' : ''}>${cell}</td>`;
  }).join('')}</tr>`).join('')}</tbody></table></div>`;
}
export function accordion(items = [], { exclusive = false, cls = '' } = {}) {
  const name = exclusive ? nextId('acc') : null;
  return `<div class="accordion${cls ? ' ' + cls : ''}">${items.map((it) => `<details class="acc"${it.open ? ' open' : ''}${name ? ` name="${name}"` : ''}${it.id ? ` id="${attr(it.id)}"` : ''}><summary class="acc__q"><span>${tx(it.q)}</span><span class="acc__icon" aria-hidden="true"></span></summary><div class="acc__a">${tx(it.a)}</div></details>`).join('')}</div>`;
}
export function timeline(items = [], { cls = '' } = {}) {
  return `<ol class="timeline${cls ? ' ' + cls : ''}">${items.map((it) => {
    const when = it.date && /^\d{4}-\d{2}-\d{2}/.test(it.date) ? `<time datetime="${attr(it.date)}">${fmtDate(C.lang, it.date)}</time>` : `<span>${tx(it.date ?? it.time ?? '')}</span>`;
    return `<li class="timeline__item" data-reveal><p class="timeline__when">${when}</p><div class="timeline__body"><h3 class="timeline__title">${tx(it.title)}</h3>${it.text ? `<div class="timeline__text">${tx(it.text)}</div>` : ''}${it.tag ? `<p class="timeline__tag">${badge(it.tag)}</p>` : ''}</div></li>`;
  }).join('')}</ol>`;
}
export function steps(items = [], { cls = '' } = {}) {
  return `<ol class="steps${cls ? ' ' + cls : ''}" data-reveal-stagger>${items.map((it, i) => {
    const o = typeof it === 'object' && !('kz' in it || 'ru' in it) ? it : { title: it };
    return `<li class="step"><span class="step__n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><div><p class="step__title">${tx(o.title)}</p>${o.text ? `<div class="step__text">${tx(o.text)}</div>` : ''}</div></li>`;
  }).join('')}</ol>`;
}
export function callout({ type = 'info', title, text, icon: ic } = {}) {
  const icName = ic || { info: 'info', warn: 'warn', ok: 'check' }[type] || 'info';
  return `<aside class="callout callout--${type}"><span class="callout__icon">${icon(icName, { size: 22 })}</span><div>${title ? `<p class="callout__title">${tx(title)}</p>` : ''}${text ? `<div class="callout__text">${tx(text)}</div>` : ''}</div></aside>`;
}
export function quote({ text, cite, role } = {}) {
  return `<figure class="quote"><span class="quote__mark" aria-hidden="true">“</span><blockquote>${tx(text)}</blockquote>${cite ? `<figcaption><strong>${tx(cite)}</strong>${role ? `<span>${tx(role)}</span>` : ''}</figcaption>` : ''}</figure>`;
}
export function banner({ title, text, href, label, theme = 'hero', icon: ic, eyebrow: eb, ext } = {}) {
  const external = ext ?? isExt(href);
  return `<div class="banner pattern" data-theme="${attr(theme)}">${ic ? `<span class="banner__icon">${icon(ic, { size: 28 })}</span>` : ''}<div class="banner__body">${eb ? `<p class="banner__eyebrow">${tx(eb)}</p>` : ''}<p class="banner__title">${tx(title)}</p>${text ? `<p class="banner__text">${tx(text)}</p>` : ''}</div>${href ? button({ href, label: label || T('more'), kind: 'gold', icon: external ? null : 'arrow-right', ext: external, cls: 'banner__btn' }) : ''}</div>`;
}
export function linkList(items = [], { cls = '' } = {}) {
  return `<ul class="link-list${cls ? ' ' + cls : ''}" role="list">${items.map((it) => {
    const ext = it.ext ?? isExt(it.href);
    return `<li><a href="${attr(it.href)}"${ext ? ' target="_blank" rel="noopener" data-ext' : ''}>${it.icon ? `<span class="link-list__icon">${icon(it.icon)}</span>` : ''}<span class="link-list__text"><span class="link-list__label">${tx(it.label)}</span>${it.note ? `<span class="link-list__note">${tx(it.note)}</span>` : ''}</span>${ext ? `<span class="sr-only"> ${T('extNewTab')}</span>` : ''}${icon(ext ? 'ext' : 'arrow-right', { cls: 'link-list__arrow' })}</a></li>`;
  }).join('')}</ul>`;
}
function initials(name) {
  return String(tx(name)).split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}
export function personCard(p = {}) {
  const contacts = (p.contacts || []).map((c) => {
    const val = tx(c.value);
    if (c.type === 'phone') return `<li>${icon('phone', { size: 16 })}<a href="tel:${attr(String(val).replace(/[^\d+]/g, ''))}">${val}</a></li>`;
    if (c.type === 'email') return `<li>${icon('mail', { size: 16 })}${!val || val === school.contacts.email ? schoolEmail() : `<a href="mailto:${attr(val)}">${val}</a>`}</li>`;
    if (c.type === 'link') return `<li>${icon('ext', { size: 16 })}${link(c.href, c.label || val)}</li>`;
    return `<li>${icon('info', { size: 16 })}<span>${c.label ? `${tx(c.label)}: ` : ''}${val}</span></li>`;
  }).join('');
  const photo = p.photo
    ? `<img class="person__photo" src="${attr(assetUrl(p.photo))}" alt="${attr(tx(p.alt) || tx(p.name))}" loading="lazy" width="240" height="300">`
    : `<span class="person__avatar pattern" data-theme="${attr(p.theme || 'hero')}" aria-hidden="true">${esc(initials(p.name))}</span>`;
  return `<article class="person">${photo}<div class="person__body"><h3 class="person__name">${tx(p.name)}</h3>${p.role ? `<p class="person__role">${tx(p.role)}</p>` : ''}${p.text ? `<div class="person__text">${tx(p.text)}</div>` : ''}${p.reception ? `<p class="person__reception">${icon('clock', { size: 16 })}<span>${tx(p.reception)}</span></p>` : ''}${contacts ? `<ul class="person__contacts" role="list">${contacts}</ul>` : ''}</div></article>`;
}
export function people(items = [], { cls = '' } = {}) {
  return `<div class="people${cls ? ' ' + cls : ''}" data-reveal-stagger>${items.map(personCard).join('')}</div>`;
}
export function gallery(items = [], { cols = 3, cls = '' } = {}) {
  return `<ul class="gallery gallery--${cols}${cls ? ' ' + cls : ''}" role="list">${items.map((it) => {
    const src = assetUrl(it.src);
    const img = `<img src="${attr(src)}" alt="${attr(tx(it.alt))}" loading="lazy"${it.w ? ` width="${it.w}" height="${it.h}"` : ''}>`;
    return `<li><figure class="gallery__item">${it.href !== false ? `<a href="${attr(it.href ? assetUrl(it.href) : src)}" class="gallery__link">${img}</a>` : img}${it.caption ? `<figcaption>${tx(it.caption)}</figcaption>` : ''}</figure></li>`;
  }).join('')}</ul>`;
}

// ------------------------------------------------------------------ documents
const TYPE_LABEL = { pdf: 'PDF', jpg: 'JPG', jpeg: 'JPG', png: 'PNG', doc: 'DOC', docx: 'DOCX', xls: 'XLS', xlsx: 'XLSX', link: 'URL' };
export function docList(items = [], { thumbs = false, cls = '' } = {}) {
  return `<ul class="docs${thumbs ? ' docs--thumbs' : ''}${cls ? ' ' + cls : ''}" role="list">${items.map((d) => {
    if (C.onDoc) C.onDoc(d);
    const type = String(d.type || (d.file ? d.file.split('.').pop() : 'pdf')).toLowerCase();
    const title = tx(d.title);
    const dateTxt = d.date ? `<time datetime="${attr(d.date)}">${fmtDate(C.lang, d.date)}</time>` : '';
    const noTxt = d.number ? `${T('doc.no')} ${esc(d.number)}` : '';
    const noteTxt = d.note ? `<p class="doc__note">${tx(d.note)}</p>` : '';
    // placement on the site (not the document's own date): the later of changed / posted
    const placed = [d.changed, d.posted].filter(Boolean).sort().pop();
    const postedTxt = placed ? `<span class="doc__posted">${T(d.changed && placed === d.changed && d.changed !== d.posted ? 'doc.changed' : 'doc.posted')}: <time datetime="${attr(placed)}">${fmtDateTime(C.lang, placed)}</time></span>` : '';
    if (!d.file && !d.url) {
      return `<li class="doc doc--pending"><span class="doc__type" aria-hidden="true">${icon('hourglass', { size: 22 })}</span><div class="doc__body"><p class="doc__title">${title}</p><p class="doc__meta"><span class="doc__status">${T('doc.pending')}</span></p>${noteTxt}</div></li>`;
    }
    if (d.url && !d.file) {
      return `<li class="doc doc--link"><span class="doc__type doc__type--link" aria-hidden="true">${icon('globe', { size: 22 })}</span><div class="doc__body"><p class="doc__title">${link(d.url, title, 'doc__a')}</p><p class="doc__meta">${[T('doc.link'), noTxt, dateTxt].filter(Boolean).join(' · ')}${postedTxt ? ` · ${postedTxt}` : ''}</p>${noteTxt}</div></li>`;
    }
    const href = assetUrl(d.file);
    const size = d.size ? fmtSize(C.lang, d.size) : '';
    const fmt = `${TYPE_LABEL[type] || type.toUpperCase()}${size ? `, ${size}` : ''}`;
    const isImg = ['jpg', 'jpeg', 'png'].includes(type);
    const thumb = thumbs && isImg ? `<a class="doc__thumb" href="${attr(href)}" tabindex="-1" aria-hidden="true"><img src="${attr(d.thumb ? assetUrl(d.thumb) : href)}" alt="" loading="lazy" decoding="async" width="120" height="160"></a>` : `<span class="doc__type doc__type--${attr(type)}" aria-hidden="true">${icon(isImg ? 'image' : 'doc', { size: 20 })}<b>${esc(TYPE_LABEL[type] || type.toUpperCase())}</b></span>`;
    return `<li class="doc${d.archived ? ' doc--archived' : ''}">${thumb}<div class="doc__body"><p class="doc__title"><a class="doc__a" href="${attr(href)}">${title}<span class="sr-only"> (${fmt})</span></a>${d.archived ? ' ' + badge(T('doc.archive'), 'default') : ''}</p><p class="doc__meta"><span class="doc__fmt">${fmt}</span>${noTxt ? `<span>${noTxt}</span>` : ''}${dateTxt ? `<span>${dateTxt}</span>` : ''}${postedTxt}</p>${d.issuer ? `<p class="doc__issuer">${T('doc.issuer')}: ${tx(d.issuer)}</p>` : ''}${noteTxt}</div><div class="doc__actions"><a class="doc__btn" href="${attr(href)}" download aria-label="${attr(`${T('doc.download')}: ${String(title).replace(/<[^>]*>/g, '')} (${fmt})`)}">${icon('download', { size: 18 })}<span>${T('doc.download')}</span></a></div></li>`;
  }).join('')}</ul>`;
}

// ------------------------------------------------------------------ pending
export function pending(a, b) {
  let title = T('pending.title'), noteHtml = '';
  if (a && typeof a === 'object' && !('kz' in a || 'ru' in a || 'en' in a)) { if (a.title) title = tx(a.title); noteHtml = tx(a.note || ''); }
  else if (typeof a === 'string' && LANGS.includes(a)) { noteHtml = tx(b || ''); }
  else if (a) { noteHtml = tx(a); }
  return `<div class="pending" role="note"><span class="pending__icon" aria-hidden="true">${icon('hourglass', { size: 22 })}</span><div><p class="pending__title">${title}</p><p class="pending__text">${noteHtml || T('pending.text')}</p></div></div>`;
}

/** A school.mjs TODO(school) slot: render(value) once the school fills it, the pending block while it is empty.
 *  pendingArg is what pending() takes: nothing, a note ({kz,ru,en} / string) or { title, note }. */
export function slot(value, render, pendingArg) {
  const empty = value == null || value === '' || (Array.isArray(value) && !value.length)
    || (typeof value === 'object' && !Array.isArray(value) && !Object.keys(value).length);
  if (empty) return pendingArg === undefined ? pending() : pending(pendingArg);
  return typeof render === 'function' ? render(value) : tx(value);
}

// ------------------------------------------------------------------ news
export function newsCard(n) {
  if (C.onNews) C.onNews(n);
  const url = C.href(`news-${n.id}`);
  return `<article class="news-card" data-reveal><a class="news-card__media pattern" data-theme="informatics" href="${attr(url)}" tabindex="-1" aria-hidden="true">${n.image ? `<img src="${attr(assetUrl(n.image.src))}" alt="" loading="lazy" width="640" height="400">` : ''}</a><div class="news-card__body"><p class="news-card__date">${icon('calendar', { size: 16 })}<time datetime="${attr(n.time ? `${n.date}T${n.time}` : n.date)}">${fmtDate(C.lang, n.date)}</time></p><h3 class="news-card__title"><a href="${attr(url)}">${tx(n.title)}</a></h3><p class="news-card__lead">${tx(n.lead)}</p></div></article>`;
}
export function newsList(items = [], { limit } = {}) {
  const list = limit ? items.slice(0, limit) : items;
  if (!list.length) return pending({ title: T('news.soon'), note: '' });
  return `<div class="news-list">${list.map(newsCard).join('')}</div>`;
}

// ------------------------------------------------------------------ school-data blocks
/** The school e-mail. While school.contacts.emailConfirmed is false it is NOT a live mailto link: plain text + the
 *  "нақтылануда / уточняется / to be confirmed" badge (the mailbox does not exist yet — keremet.edu.kz does not resolve). */
export function schoolEmail() {
  const e = school.contacts.email;
  if (e && school.contacts.emailConfirmed) return `<a href="mailto:${attr(e)}">${esc(e)}</a>`;
  return `<span class="mail-unconf">${T('email.pending')}</span>`;
}
export function contactList({ admission = false, cls = '' } = {}) {
  const c = school.contacts, a = school.addresses;
  const rows = [
    `<li>${icon('pin')}<div><span class="cl__k">${T('actualAddress')}</span><span class="cl__v">${esc(a.actual.postcode)}, ${tx(a.actual.text)}</span></div></li>`,
    `<li>${icon('phone')}<div><span class="cl__k">${T('phone')} / WhatsApp</span><span class="cl__v"><a href="tel:${c.phone.tel}">${c.phone.display}</a> · ${extLink(`https://wa.me/${c.phone.whatsapp}`, 'WhatsApp')}</span></div></li>`,
    admission ? `<li>${icon('whatsapp')}<div><span class="cl__k">${T('whatsappAdmission')}</span><span class="cl__v">${extLink(`https://wa.me/${c.whatsappAdmission.whatsapp}`, c.whatsappAdmission.display)}</span></div></li>` : '',
    `<li>${icon('mail')}<div><span class="cl__k">${T('email')}</span><span class="cl__v">${schoolEmail()}</span></div></li>`,
    `<li>${icon('clock')}<div><span class="cl__k">${T('hours')}</span><span class="cl__v">${tx(c.hours)}${c.hoursConfirmed ? '' : ` <small>(${T('unconfirmed')})</small>`}</span></div></li>`,
    `<li>${icon('instagram')}<div><span class="cl__k">Instagram</span><span class="cl__v">${extLink(c.instagram.url, c.instagram.handle)}</span></div></li>`,
  ];
  return `<ul class="contact-list${cls ? ' ' + cls : ''}" role="list">${rows.join('')}</ul>`;
}
export function requisites() {
  const s = school;
  return facts([
    { k: { kz: 'Толық атауы', ru: 'Полное наименование', en: 'Full legal name' }, v: s.legal.fullName },
    { k: T('bin'), v: s.legal.bin, copy: s.legal.bin },
    { k: T('legalAddress'), v: `${s.addresses.legal.postcode}, ${tx(s.addresses.legal.text)}`, copy: true },
    { k: T('actualAddress'), v: `${s.addresses.actual.postcode}, ${tx(s.addresses.actual.text)}`, copy: true },
    { k: T('licence'), v: `№ ${s.licence.current.number} (${fmtDate(C.lang, s.licence.current.date)})`, copy: s.licence.current.number },
    { k: { kz: 'Директор', ru: 'Директор', en: 'Director' }, v: s.legal.director.name },
  ]);
}
export function mapEmbed(lat = school.addresses.actual.lat, lng = school.addresses.actual.lng, { zoom = 16, title, height = 380 } = {}) {
  const dx = 0.012 * Math.pow(2, 16 - zoom), dy = 0.006 * Math.pow(2, 16 - zoom);
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${(lng - dx).toFixed(5)}%2C${(lat - dy).toFixed(5)}%2C${(lng + dx).toFixed(5)}%2C${(lat + dy).toFixed(5)}&layer=mapnik&marker=${lat}%2C${lng}`;
  const big = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${zoom}/${lat}/${lng}`;
  return `<figure class="map"><div class="map__frame" style="--map-h:${Number(height)}px"><iframe src="${src}" title="${attr(tx(title) || T('map.frame'))}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div><figcaption class="map__links">${extLink(big, T('map.open'))}${extLink(school.contacts.twoGis.url, T('map.2gis'))}</figcaption></figure>`;
}

// ------------------------------------------------------------------ forms
function field({ id, name, label, type = 'text', required = false, hint, autocomplete, full = false, options, rows = 5, inputmode, extra = '' }) {
  const hintId = hint ? `${id}-hint` : null;
  const errId = `${id}-err`;
  const describedby = [hintId, errId].filter(Boolean).join(' ');
  const req = required ? `<span class="req" aria-hidden="true">*</span><span class="sr-only"> (${T('form.required')})</span>` : '';
  let control;
  const common = `id="${id}" name="${name}"${required ? ' required aria-required="true"' : ''} aria-describedby="${describedby}"${autocomplete ? ` autocomplete="${autocomplete}"` : ''}${inputmode ? ` inputmode="${inputmode}"` : ''}${extra}`;
  if (type === 'textarea') control = `<textarea class="field__input" ${common} rows="${rows}" maxlength="5000"></textarea>`;
  else if (type === 'select') control = `<select class="field__input" ${common}>${options.map((o) => `<option value="${attr(o.value)}">${tx(o.label)}</option>`).join('')}</select>`;
  else control = `<input class="field__input" type="${type}" ${common} maxlength="${type === 'date' ? 10 : 200}">`;
  return `<div class="field${full ? ' field--full' : ''}"><label class="field__label" for="${id}">${tx(label)}${req}</label>${control}${hint ? `<p class="field__hint" id="${hintId}">${tx(hint)}</p>` : ''}<p class="field__err" id="${errId}" hidden></p></div>`;
}
export function form({ kind = 'feedback', lang, id } = {}) {
  const prevLang = C.lang;
  if (lang && LANGS.includes(lang)) C.lang = lang;
  const fid = id || `f-${kind}`;
  const f = (o) => field({ ...o, id: `${fid}-${o.name}` });
  let fields = '';
  if (kind === 'admission') {
    fields = [
      f({ name: 'name', label: T('form.parent'), required: true, autocomplete: 'name', hint: T('form.name.hint') }),
      f({ name: 'phone', label: T('form.phone'), type: 'tel', required: true, autocomplete: 'tel', inputmode: 'tel', hint: T('form.phone.hint') }),
      f({ name: 'email', label: T('form.email'), type: 'email', autocomplete: 'email', hint: T('form.email.hint') }),
      f({ name: 'child', label: T('form.child'), required: true }),
      f({ name: 'birth', label: T('form.birth'), type: 'date' }),
      f({ name: 'grade', label: T('form.grade'), required: true, hint: T('form.grade.hint') }),
      f({ name: 'instr', label: T('form.langInstr'), type: 'select', options: school.languages.map((l) => ({ value: l.id, label: l.label })) }),
      f({ name: 'message', label: T('form.comment'), type: 'textarea', full: true, rows: 4 }),
    ].join('');
  } else if (kind === 'blog') {
    fields = [
      f({ name: 'name', label: T('form.name'), required: true, autocomplete: 'name', hint: T('form.name.hint') }),
      f({ name: 'email', label: T('form.email'), type: 'email', required: true, autocomplete: 'email', hint: T('form.email.hint') }),
      f({ name: 'message', label: T('form.question'), type: 'textarea', required: true, full: true, hint: T('form.message.hint') }),
    ].join('') + `<div class="field field--check field--full"><input type="checkbox" id="${fid}-publish" name="publish" value="1"><label for="${fid}-publish">${T('form.publishOk')}</label></div>`;
  } else {
    const topics = ['general', 'admission', 'learning', 'proposal', 'complaint'].map((k) => ({ value: k, label: T(`form.topic.${k}`) }));
    fields = [
      f({ name: 'name', label: T('form.name'), required: true, autocomplete: 'name', hint: T('form.name.hint') }),
      f({ name: 'email', label: T('form.email'), type: 'email', required: true, autocomplete: 'email', hint: T('form.email.hint') }),
      f({ name: 'phone', label: T('form.phone'), type: 'tel', autocomplete: 'tel', inputmode: 'tel', hint: T('form.phone.hint') }),
      f({ name: 'topic', label: T('form.topic'), type: 'select', options: topics }),
      f({ name: 'message', label: T('form.message'), type: 'textarea', required: true, full: true, hint: T('form.message.hint') }),
    ].join('');
  }
  const consentHref = C.href('privacy');
  // fallback when the POST fails: WhatsApp first (text pre-filled); e-mail only once the mailbox is confirmed, else a call
  const mailOk = !!(school.contacts.email && school.contacts.emailConfirmed);
  const html = `<form class="form" id="${fid}" data-form="${attr(kind)}" action="${attr(C.api || '../api/feedback.php')}" method="post" novalidate data-wa="${school.contacts.phone.whatsapp}"${mailOk ? ` data-mail="${attr(school.contacts.email)}"` : ''}>
<div class="form__summary" role="alert" tabindex="-1" hidden></div>
<input type="hidden" name="kind" value="${attr(kind)}"><input type="hidden" name="lang" value="${attr(C.lang)}"><input type="hidden" name="page" value=""><input type="hidden" name="elapsed" value="">
<div class="hp" aria-hidden="true"><label for="${fid}-website">${T('form.honeypot')}</label><input type="text" id="${fid}-website" name="website" tabindex="-1" autocomplete="off"></div>
<p class="form__req">${T('form.requiredNote')}</p>
<div class="form__grid">${fields}
<div class="field field--check field--full"><input type="checkbox" id="${fid}-consent" name="consent" value="1" required aria-required="true" aria-describedby="${fid}-consent-err"><label for="${fid}-consent">${T('form.consent', { href: consentHref })}<span class="req" aria-hidden="true">*</span></label><p class="field__err" id="${fid}-consent-err" hidden></p></div>
</div>
<div class="form__foot"><button type="submit" class="btn btn--primary btn--l"><span>${T(kind === 'admission' ? 'form.submitAdmission' : 'form.submit')}</span>${icon('arrow-right')}</button><p class="form__privacy">${icon('lock', { size: 16 })}<span>${T('form.privacyNote')}</span></p></div>
<div class="form__status" role="status" aria-live="polite"></div>
<div class="form__fallback" hidden><p>${T(mailOk ? 'form.fail' : 'form.failWa')}</p><div class="form__fallback-btns"><a class="btn btn--gold" data-fallback="wa" href="https://wa.me/${school.contacts.phone.whatsapp}" target="_blank" rel="noopener">${icon('whatsapp')}<span>${T('form.viaWhatsapp')}</span><span class="sr-only"> ${T('extNewTab')}</span></a>${mailOk ? `<a class="btn btn--ghost" data-fallback="mail" href="mailto:${attr(school.contacts.email)}">${icon('mail')}<span>${T('form.viaEmail')}</span></a>` : `<a class="btn btn--ghost" href="tel:${school.contacts.phone.tel}">${icon('phone')}<span>${T('form.viaPhone')} ${school.contacts.phone.display}</span></a>`}</div></div>
</form>`;
  C.lang = prevLang;
  return html;
}

// ------------------------------------------------------------------ page meta (published / updated)
/** "Published … · Last updated …" line (SPEC §7). Layout adds it to every page automatically
 *  (landing: at the end of <main>, or where index.mjs puts the marker <!--page-meta-->). */
export function pageMeta(page = {}, { cls = '' } = {}) {
  const published = page.published || page.updated;
  const updated = page.updated || page.published;
  if (page.noMeta || !published) return '';
  const tm = (iso) => `<time datetime="${attr(iso)}">${fmtDateTime(C.lang, iso)}</time>`;
  return `<footer class="page-meta wrap${cls ? ' ' + cls : ''}"><p>${icon('calendar', { size: 16 })}<span>${T('meta.published')}: ${tm(published)}</span></p><p>${icon('clock', { size: 16 })}<span>${T('meta.updated')}: ${tm(updated)}</span></p><p class="page-meta__report"><a href="${attr(C.href('feedback'))}">${T('meta.report')}</a></p></footer>`;
}

// ------------------------------------------------------------------ hero & crumbs (layout)
export function crumbs(items = []) {
  return `<nav class="crumbs" aria-label="${attr(T('nav.crumbs'))}"><ol>${items.map((c, i) => {
    const last = i === items.length - 1;
    const inner = i === 0 ? `${icon('home', { size: 16 })}<span>${tx(c.label)}</span>` : `<span>${tx(c.label)}</span>`;
    return `<li>${last ? `<span aria-current="page">${inner}</span>` : !c.href ? `<span>${inner}</span>` : `<a href="${attr(c.href)}">${inner}</a>`}</li>`;
  }).join('')}</ol></nav>`;
}
export function pageHero({ title, lead: ld, crumbs: cr = [], eyebrow: eb, theme = 'paper', sub = '', accent = '' } = {}) {
  return `<section class="phero pattern" data-theme="${attr(theme)}" aria-labelledby="page-title">
<div class="phero__deco" aria-hidden="true">${shanyrakArt({ cls: 'phero__shanyrak' })}${accent}</div><div class="orn-band" aria-hidden="true"></div>
<div class="phero__inner">${cr.length ? crumbs(cr) : ''}${eb ? `<p class="phero__eyebrow"><span class="phero__dot" aria-hidden="true"></span>${tx(eb)}</p>` : ''}<h1 class="phero__title" id="page-title">${tx(title)}</h1>${ld ? `<p class="phero__lead">${tx(ld)}</p>` : ''}${sub}</div>
</section>`;
}

export const ui = {
  esc, icon, logo, shanyrakArt, ornament, band, panel, divider, button, extLink, badge, chips, eyebrow, lead, prose, note,
  section, grid, split, toc, cards, stat, stats, facts, table, accordion, timeline, steps, callout, quote, banner,
  linkList, people, personCard, gallery, docList, pending, slot, newsCard, newsList, contactList, schoolEmail, requisites, mapEmbed,
  form, crumbs, pageHero, pageMeta, ICON_NAMES, SHANYRAK_PATHS, SHANYRAK_ART, _setContext,
};
export default ui;
