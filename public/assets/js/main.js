/* =====================================================================================
   KEREMET — main.js (every page). Plain ES module, no dependencies.
   Features: util-bar height · header shrink · mega-menu (hover/click/keyboard/Esc) · mobile menu
   (animated, focus trap) · language switch memory · a11y panel (persisted) · motion pause
   (dispatches window 'keremet:motion' {paused}) · reveal-on-scroll · external links · search page ·
   forms (validation, honeypot, POST, WhatsApp/mailto fallback) · back-to-top · responsive tables ·
   copy-to-clipboard.
   Public API: window.Keremet = { lang, motionPaused(), a11yOn(), setMotion(paused), t(key) }
   Events: 'keremet:motion' {paused} · 'keremet:a11y' {state}
   ===================================================================================== */
const d = document;
const html = d.documentElement;
const LANG = html.dataset.lang || 'kz';
let I18N = {};
try { I18N = JSON.parse(d.getElementById('i18n')?.textContent || '{}'); } catch { /* ignore */ }
const tr = (k, vars) => { let s = I18N[k] || k; if (vars) s = s.replace(/\{(\w+)\}/g, (m, x) => (vars[x] ?? m)); return s; };
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
  del(k) { try { localStorage.removeItem(k); } catch { /* ignore */ } },
};
const reducedMQ = matchMedia('(prefers-reduced-motion: reduce)');
const hoverMQ = matchMedia('(hover: hover) and (pointer: fine)');
const a11yOn = () => html.dataset.a11y === 'on';
const motionPaused = () => html.dataset.motion === 'paused';
const smooth = () => (reducedMQ.matches || a11yOn() ? 'auto' : 'smooth');
const $$ = (sel, root = d) => Array.from(root.querySelectorAll(sel));
const live = (msg) => { const el = d.getElementById('live'); if (el) { el.textContent = ''; setTimeout(() => { el.textContent = msg; }, 30); } };
const escHtml = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])';

/* ---------------------------------------------------------------- header metrics & scroll */
const header = d.querySelector('[data-header]');
const util = header?.querySelector('.util');
function measure() { if (util) html.style.setProperty('--util-h', `${util.offsetHeight}px`); }
measure();
if (util && 'ResizeObserver' in window) new ResizeObserver(measure).observe(util);
const toTop = d.querySelector('[data-to-top]');
// phones: the "to top" button only shows while the visitor scrolls UP (it would cover text while reading)
const phoneMQ = matchMedia('(max-width: 719px)');
// "up" = at least 48px above the lowest point of the current downward run (ignores scroll-anchoring nudges)
let ticking = false, lastY = window.scrollY, peakY = lastY, upward = false;
function onScroll() {
  ticking = false;
  const y = window.scrollY;
  if (y > lastY) { peakY = y; upward = false; } else if (peakY - y > 48) upward = true;
  lastY = y;
  header?.classList.toggle('is-scrolled', y > 24);
  toTop?.classList.toggle('is-visible', y > 700 && (!phoneMQ.matches || upward));
  // phones: the pause button stays visible (ORDER R.102) but tucks back (dimmed, smaller) while reading downwards
  const mt = d.querySelector('[data-motion-toggle]'); mt?.classList.toggle('is-tucked', phoneMQ.matches && y > 160 && !upward && !mt.classList.contains('is-docked'));
}
window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

/* ---------------------------------------------------------------- mega-menu */
const triggers = $$('[data-mega]');
let openTrigger = null, hoverTimer = 0, hoverOpenedAt = 0;
function megaOf(tr) { return d.getElementById(tr.getAttribute('aria-controls')); }
function openMega(t, { focusFirst = false } = {}) {
  if (openTrigger && openTrigger !== t) closeMega(openTrigger);
  const panel = megaOf(t); if (!panel) return;
  panel.hidden = false; t.setAttribute('aria-expanded', 'true'); openTrigger = t;
  if (focusFirst) panel.querySelector('a')?.focus();
}
function closeMega(t = openTrigger, { focus = false } = {}) {
  if (!t) return;
  const panel = megaOf(t); if (panel) panel.hidden = true;
  t.setAttribute('aria-expanded', 'false');
  if (openTrigger === t) openTrigger = null;
  if (focus) t.focus();
}
triggers.forEach((t, i) => {
  const item = t.closest('.nav__item');
  t.addEventListener('click', () => {
    if (t.getAttribute('aria-expanded') === 'true') { if (Date.now() - hoverOpenedAt > 450) closeMega(t); }
    else openMega(t);
  });
  t.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); openMega(t, { focusFirst: true }); }
    else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const n = triggers[(i + (e.key === 'ArrowRight' ? 1 : -1) + triggers.length) % triggers.length];
      if (openTrigger) openMega(n); n.focus();
    } else if (e.key === 'Home') { e.preventDefault(); triggers[0].focus(); }
    else if (e.key === 'End') { e.preventDefault(); triggers[triggers.length - 1].focus(); }
  });
  item?.addEventListener('pointerenter', (e) => {
    if (e.pointerType !== 'mouse' || !hoverMQ.matches) return;
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => { if (openTrigger !== t) { openMega(t); hoverOpenedAt = Date.now(); } }, openTrigger ? 0 : 90);
  });
  item?.addEventListener('pointerleave', (e) => {
    if (e.pointerType !== 'mouse' || !hoverMQ.matches) return;
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => { if (openTrigger === t) closeMega(t); }, 260);
  });
  const panel = megaOf(t);
  panel?.addEventListener('keydown', (e) => {
    const links = $$('a', panel); const idx = links.indexOf(d.activeElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); links[Math.min(links.length - 1, idx + 1)]?.focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (idx <= 0) t.focus(); else links[idx - 1].focus(); }
  });
  item?.addEventListener('focusout', () => {
    setTimeout(() => { if (openTrigger === t && !item.contains(d.activeElement)) closeMega(t); }, 0);
  });
});
d.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (openTrigger) { closeMega(openTrigger, { focus: true }); }
});
d.addEventListener('click', (e) => { if (openTrigger && !e.target.closest('.nav__item')) closeMega(); });

/* ---------------------------------------------------------------- mobile menu */
const mnav = d.getElementById('mnav');
const burger = d.querySelector('[data-mnav-open]');
let mnavCloseTimer = 0;
function openMnav() {
  if (!mnav) return;
  clearTimeout(mnavCloseTimer);
  const r = burger?.getBoundingClientRect();
  if (r) { mnav.style.setProperty('--mx', `${r.left + r.width / 2}px`); mnav.style.setProperty('--my', `${r.top + r.height / 2}px`); }
  mnav.hidden = false;
  void mnav.offsetWidth;
  requestAnimationFrame(() => mnav.classList.add('is-open'));
  html.classList.add('mnav-open');
  burger?.setAttribute('aria-expanded', 'true');
  setTimeout(() => mnav.querySelector('[data-mnav-close]')?.focus(), 60);
}
function closeMnav() {
  if (!mnav || mnav.hidden) return;
  mnav.classList.remove('is-open');
  html.classList.remove('mnav-open');
  burger?.setAttribute('aria-expanded', 'false');
  mnavCloseTimer = setTimeout(() => { mnav.hidden = true; }, reducedMQ.matches || a11yOn() ? 0 : 650);
  burger?.focus();
}
burger?.addEventListener('click', openMnav);
mnav?.querySelector('[data-mnav-close]')?.addEventListener('click', closeMnav);
mnav?.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { e.preventDefault(); closeMnav(); return; }
  if (e.key !== 'Tab') return;
  const f = $$(FOCUSABLE, mnav).filter((el) => el.offsetParent !== null);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
});
$$('.mnav__btn').forEach((b) => {
  const panel = d.getElementById(b.getAttribute('aria-controls'));
  if (panel?.querySelector('[aria-current="page"]')) { b.setAttribute('aria-expanded', 'true'); panel.hidden = false; }
  b.addEventListener('click', () => {
    const open = b.getAttribute('aria-expanded') === 'true';
    b.setAttribute('aria-expanded', String(!open)); if (panel) panel.hidden = open;
  });
});
matchMedia('(min-width: 1200px)').addEventListener?.('change', (e) => { if (e.matches) closeMnav(); });

/* ---------------------------------------------------------------- language switch */
$$('[data-lang-link]').forEach((a) => {
  a.addEventListener('click', () => {
    store.set('keremet-lang', a.dataset.langLink);
    const base = a.getAttribute('href').split(/[?#]/)[0];
    a.setAttribute('href', base + location.search + location.hash);
  });
});

/* ---------------------------------------------------------------- page-hero chip row (sub-pages of the section) */
$$('.phero__sub ul').forEach((ul) => {
  const cur = ul.querySelector('[aria-current="page"]')?.closest('li');
  if (cur && ul.scrollWidth > ul.clientWidth) { const x = cur.getBoundingClientRect().left - ul.getBoundingClientRect().left + ul.scrollLeft; ul.scrollLeft = Math.max(0, x - (ul.clientWidth - cur.offsetWidth) / 2); }
  const edge = () => ul.classList.toggle('is-end', ul.scrollLeft + ul.clientWidth >= ul.scrollWidth - 4);
  edge();
  ul.addEventListener('scroll', edge, { passive: true });
});

/* ---------------------------------------------------------------- a11y panel */
const panel = d.getElementById('a11y-panel');
const A11Y_KEYS = ['font', 'scheme', 'img', 'space', 'lh'];
const A11Y_DEFAULT = { on: true, font: '2', scheme: 'wb', img: 'on', space: '1', lh: '1' };
function readA11y() { try { return JSON.parse(store.get('keremet-a11y') || 'null') || { on: false }; } catch { return { on: false }; } }
let a11y = readA11y();
function applyA11y(state, { save = true } = {}) {
  a11y = state;
  if (state.on) {
    html.setAttribute('data-a11y', 'on');
    A11Y_KEYS.forEach((k) => { if (state[k]) html.setAttribute(`data-a11y-${k}`, state[k]); else html.removeAttribute(`data-a11y-${k}`); });
  } else {
    html.removeAttribute('data-a11y'); A11Y_KEYS.forEach((k) => html.removeAttribute(`data-a11y-${k}`));
  }
  if (panel) panel.hidden = !state.on;
  $$('[data-a11y-toggle]').forEach((b) => {
    b.setAttribute('aria-expanded', String(!!state.on));
    const labels = $$('[data-a11y-label]', b);
    if (labels.length) { labels.forEach((s) => { s.textContent = state.on ? s.dataset.on : s.dataset.off; }); return; }
    const s = b.querySelector('span'); if (!s) return; // legacy markup: first span holds the label
    if (!b.dataset.label) b.dataset.label = s.textContent;
    s.textContent = state.on ? tr('a11y.exit') : b.dataset.label;
  });
  $$('[data-a11y-set]').forEach((b) => b.setAttribute('aria-pressed', String(state.on && String(state[b.dataset.a11ySet] ?? A11Y_DEFAULT[b.dataset.a11ySet]) === b.dataset.v)));
  if (state.on && state.img === 'off') altTexts();
  if (save) { if (state.on) store.set('keremet-a11y', JSON.stringify(state)); else store.del('keremet-a11y'); }
  measure();
  window.dispatchEvent(new CustomEvent('keremet:a11y', { detail: { state: { ...state } } }));
}
function altTexts() {
  $$('img').forEach((img) => {
    if (img.dataset.altDone || !img.alt) return;
    img.dataset.altDone = '1';
    const s = d.createElement('span'); s.className = 'img-alt'; s.textContent = `${tr('a11y.imgAlt')}: ${img.alt}`;
    img.after(s);
  });
}
// Phones (< 640px, CSS): the settings groups fold under a one-row bar (Settings + exit). They are open right after
// the mode is switched on and when "Settings" is pressed; on every other page load the viewer's last choice
// (localStorage 'keremet-a11y-panel', default: folded) applies, so the page's h1 is not pushed 1–2 screens down.
const panelToggle = panel?.querySelector('[data-a11y-panel-toggle]');
function setPanelOpen(open, { save = false } = {}) {
  if (!panel) return;
  panel.classList.toggle('is-collapsed', !open);
  panelToggle?.setAttribute('aria-expanded', String(open));
  if (save) store.set('keremet-a11y-panel', open ? 'open' : 'closed');
  measure();
}
setPanelOpen(store.get('keremet-a11y-panel') === 'open');
panelToggle?.addEventListener('click', () => setPanelOpen(panel.classList.contains('is-collapsed'), { save: true }));
$$('[data-a11y-toggle]').forEach((b) => b.addEventListener('click', () => {
  if (a11yOn()) { applyA11y({ on: false }); b.focus(); return; }
  closeMnav();
  applyA11y({ ...A11Y_DEFAULT, ...(readA11y().on ? readA11y() : {}), on: true });
  setPanelOpen(true);
  window.scrollTo({ top: 0, behavior: 'auto' });
  panel?.querySelector('[data-a11y-set][aria-pressed="true"]')?.focus();
}));
$$('[data-a11y-set]').forEach((b) => b.addEventListener('click', () => {
  applyA11y({ ...A11Y_DEFAULT, ...a11y, on: true, [b.dataset.a11ySet]: b.dataset.v });
}));
d.querySelector('[data-a11y-reset]')?.addEventListener('click', () => applyA11y({ ...A11Y_DEFAULT, font: '1' }));
$$('[data-a11y-exit]').forEach((x) => x.addEventListener('click', () => { applyA11y({ on: false }); visibleToggle()?.focus(); }));
/** the a11y toggle the visitor can currently see (util bar at the top, sticky-bar copy once scrolled) */
function visibleToggle() { return $$('.site-header [data-a11y-toggle]').find((b) => b.offsetParent !== null && b.getBoundingClientRect().bottom > 0) || d.querySelector('.util [data-a11y-toggle]'); }
$$('[data-a11y-open]').forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); if (!a11yOn()) d.querySelector('.util [data-a11y-toggle]')?.click(); else { setPanelOpen(true); window.scrollTo({ top: 0, behavior: 'auto' }); panel?.querySelector('[data-a11y-set]')?.focus(); } }));
applyA11y(a11y.on ? { ...A11Y_DEFAULT, ...a11y } : { on: false }, { save: false });

/* ---------------------------------------------------------------- motion pause */
const motionBtn = d.querySelector('[data-motion-toggle]');
if (d.querySelector('[data-animated], [data-motion-src]')) html.classList.add('has-motion');
function setMotion(paused, { save = true } = {}) {
  if (paused) html.setAttribute('data-motion', 'paused'); else html.removeAttribute('data-motion');
  if (motionBtn) {
    motionBtn.setAttribute('aria-pressed', String(paused));
    const txt = motionBtn.querySelector('.motion-toggle__txt'); if (txt) txt.textContent = tr(paused ? 'motion.play' : 'motion.pause');
    const short = motionBtn.querySelector('.motion-toggle__short'); if (short) short.textContent = tr(paused ? 'motion.playShort' : 'motion.pauseShort');
  }
  if (save) store.set('keremet-motion', paused ? 'paused' : 'running');
  window.dispatchEvent(new CustomEvent('keremet:motion', { detail: { paused } }));
}
motionBtn?.addEventListener('click', () => setMotion(!motionPaused()));
setMotion(motionPaused(), { save: false });
// Inner pages on phones: the fixed bottom-left button would sit over running text, so it is docked in the flow
// right after the first animated element (focus order follows); on wider screens it goes back to the fixed corner.
const motionHome = motionBtn ? { parent: motionBtn.parentNode, next: motionBtn.nextSibling } : null;
const animatedEl = !html.classList.contains('is-home') ? d.querySelector('.main [data-animated]') : null;
function dockMotion() {
  if (!motionBtn || !animatedEl) return;
  const dock = phoneMQ.matches;
  if (dock && !motionBtn.classList.contains('is-docked')) { animatedEl.after(motionBtn); motionBtn.classList.add('is-docked'); }
  else if (!dock && motionBtn.classList.contains('is-docked')) { motionHome.parent.insertBefore(motionBtn, motionHome.next); motionBtn.classList.remove('is-docked'); }
}
dockMotion();
phoneMQ.addEventListener?.('change', dockMotion);
// The fixed pause / to-top buttons must never cover the element that has keyboard focus: if they overlap, scroll
// the page a little; at the very end of the page (nothing left to scroll) lift the button above the element.
const FIXED_BTNS = [motionBtn, toTop].filter(Boolean);
const overlap = (a, b) => a.right > b.left && a.left < b.right && a.bottom > b.top && a.top < b.bottom;
d.addEventListener('focusin', (e) => {
  const el = e.target;
  FIXED_BTNS.forEach((b) => b.style.removeProperty('transform'));
  if (!(el instanceof Element) || FIXED_BTNS.includes(el) || el.closest('.mnav, .a11y-panel, .site-header')) return;
  requestAnimationFrame(() => {
    for (const b of FIXED_BTNS) {
      const br = b.getBoundingClientRect();
      if (!br.width || getComputedStyle(b).visibility === 'hidden' || b.classList.contains('is-docked')) continue;
      let r = el.getBoundingClientRect();
      if (!overlap(r, br)) continue;
      const before = window.scrollY;
      window.scrollBy({ top: r.bottom - br.top + 16, behavior: 'auto' });
      r = el.getBoundingClientRect();
      if (window.scrollY === before || overlap(r, b.getBoundingClientRect())) b.style.transform = `translateY(${-Math.ceil(br.bottom - r.top + 12)}px)`;
    }
  });
});

/* ---------------------------------------------------------------- reveal on scroll */
// Content is only ever hidden after this code has run (html.reveal-ready), so no-JS / failed JS = visible.
// a11y mode, paused motion and reduced motion reveal everything at once. threshold 0 (+ a small margin) so an
// element taller than the viewport (long tables, self-assessment sheets) still reveals as soon as it enters.
function initReveal() {
  const els = $$('[data-reveal], [data-reveal-stagger]');
  const showAll = () => els.forEach((e) => e.classList.add('is-in'));
  if (!els.length || !('IntersectionObserver' in window) || a11yOn() || motionPaused() || reducedMQ.matches) { showAll(); return; }
  $$('[data-reveal-stagger]').forEach((g) => Array.from(g.children).forEach((c, i) => c.style.setProperty('--i', String(Math.min(i, 10)))));
  const inView = (el) => { const r = el.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; };
  const rest = new Set();
  els.forEach((el) => { if (inView(el)) el.classList.add('is-in'); else rest.add(el); });
  if (!rest.size) return;
  html.classList.add('reveal-ready');
  const reveal = (el) => { el.classList.add('is-in'); rest.delete(el); io.unobserve(el); };
  let ioAlive = false; // IO reports every observed element once right after observe() — silence means it is broken
  const io = new IntersectionObserver((entries) => { ioAlive = true; entries.forEach((en) => { if (en.isIntersecting) reveal(en.target); }); }, { rootMargin: '0px 0px -24px 0px', threshold: 0 });
  rest.forEach((el) => io.observe(el));
  // belt and braces: whatever IO misses (fast jumps, anchors, zoom) is revealed on scroll end, on focus, before
  // printing, when the visitor switches a11y / motion, and at once if IO has not reported within 2.5 s.
  let t = 0;
  const sweep = () => rest.forEach((el) => { if (inView(el)) reveal(el); });
  window.addEventListener('scroll', () => { clearTimeout(t); t = setTimeout(sweep, 120); }, { passive: true });
  window.addEventListener('hashchange', () => setTimeout(sweep, 50));
  d.addEventListener('focusin', (e) => { const el = e.target instanceof Element && e.target.closest('[data-reveal], [data-reveal-stagger]'); if (el && rest.has(el)) reveal(el); });
  window.addEventListener('beforeprint', showAll);
  window.addEventListener('keremet:a11y', showAll);
  window.addEventListener('keremet:motion', showAll);
  setTimeout(() => { if (!ioAlive) { showAll(); rest.clear(); io.disconnect(); } else sweep(); }, 2500);
}
initReveal();

/* ---------------------------------------------------------------- external links */
const EXT_ICON = '<svg class="ico ico--ext" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M7 17 17 7M9 7h8v8"/></svg>';
function externalLinks(root = d) {
  $$('a[href^="http"]', root).forEach((a) => {
    let host = '';
    try { host = new URL(a.href).hostname; } catch { return; }
    if (/(^|\.)keremet\.edu\.kz$/i.test(host) || host === location.hostname) return;
    a.target = '_blank';
    const rel = new Set((a.rel || '').split(/\s+/).filter(Boolean)); rel.add('noopener'); a.rel = [...rel].join(' ');
    if (a.hasAttribute('data-ext') || a.querySelector('.sr-only')) return;
    a.setAttribute('data-ext', '');
    a.insertAdjacentHTML('beforeend', `<span class="sr-only"> ${escHtml(tr('extNewTab'))}</span>${a.closest('.btn, .ftr__soc') ? '' : EXT_ICON}`);
    a.classList.add('ext');
  });
}
externalLinks();

/* ---------------------------------------------------------------- responsive tables */
// Every table in .page-body becomes a .tbl in a scrollable .tbl-wrap. On phones it stacks into label/value cards
// (base.css) unless it opts out: class "tbl--static", data-stack="off" (on the table or an ancestor), or it is a
// known grid — calendar / month grids (.ev-cal) and subject-hours matrices (.edu-tup).
const STATIC_TABLE = '.tbl--static, [data-stack="off"], [data-stack="off"] table, .ev-cal, .edu-tup';
$$('.page-body table').forEach((tb) => {
  tb.classList.add('tbl');
  const isStatic = tb.matches(STATIC_TABLE);
  if (isStatic) tb.classList.add('tbl--static');
  if (!tb.parentElement.classList.contains('tbl-wrap')) { const w = d.createElement('div'); w.className = 'tbl-wrap'; tb.before(w); w.append(tb); }
  if (isStatic) { tb.parentElement.classList.add('tbl-wrap--static'); return; }
  const heads = $$('thead th', tb).map((th) => th.textContent.trim());
  $$('tbody tr', tb).forEach((tr_) => Array.from(tr_.children).forEach((cell, i) => {
    if (heads.length && !cell.hasAttribute('data-label')) cell.setAttribute('data-label', heads[i] || '');
    // one grid item per cell: wrap mixed content (text + inline elements) that is not wrapped yet
    const kids = Array.from(cell.childNodes).filter((n) => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
    if (kids.length > 1) {
      const v = d.createElement('div'); v.className = 'tbl__v'; v.append(...cell.childNodes); cell.append(v);
    }
  }));
});

/* ---------------------------------------------------------------- copy to clipboard */
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch {
    const ta = d.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0'; d.body.append(ta); ta.select();
    let ok = false; try { ok = d.execCommand('copy'); } catch { /* ignore */ } ta.remove(); return ok;
  }
}
d.addEventListener('click', async (e) => {
  const b = e.target.closest('[data-copy]'); if (!b) return;
  const target = b.dataset.copyTarget ? d.querySelector(b.dataset.copyTarget)?.textContent : b.dataset.copy;
  if (!target) return;
  if (await copyText(target.trim())) {
    b.classList.add('is-copied');
    const txt = b.querySelector('.copy-btn__txt'); const old = txt?.textContent;
    if (txt) txt.textContent = tr('copied');
    live(`${tr('copied')}: ${target.trim()}`);
    setTimeout(() => { b.classList.remove('is-copied'); if (txt) txt.textContent = old; }, 2000);
  }
});

/* ---------------------------------------------------------------- search */
const params = new URLSearchParams(location.search);
const qParam = (params.get('q') || '').slice(0, 200);
if (html.dataset.page === 'search') $$('[data-search-input]').forEach((i) => { i.value = qParam; });
const searchRoot = d.querySelector('[data-search-page]');
if (searchRoot) initSearch(searchRoot);

function norm(s) { return String(s || '').toLowerCase().normalize('NFC').replace(/ё/g, 'е'); }
function fmtD(iso) { const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? `${m[3]}.${m[2]}.${m[1]}` : ''; }
function reEsc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
async function initSearch(root) {
  const form = root.querySelector('form');
  const qI = form.querySelector('[name="q"]'), gI = form.querySelector('[name="g"]'), sI = form.querySelector('[name="sort"]');
  const out = root.querySelector('[data-search-results]'), count = root.querySelector('[data-search-count]');
  qI.value = qParam;
  if (gI && params.get('g')) gI.value = params.get('g');
  if (sI && params.get('sort')) sI.value = params.get('sort');
  if ((params.get('g') || params.get('sort')) && root.querySelector('details')) root.querySelector('details').open = true;
  const q = qParam.trim();
  if (q.length < 2) { count.textContent = tr('search.empty'); return; }
  count.textContent = tr('search.loading');
  let index;
  try {
    const res = await fetch(root.dataset.index || `../assets/search/${LANG}.json`);
    if (!res.ok) throw new Error(res.status);
    index = await res.json();
  } catch { count.textContent = tr('search.error'); return; }
  const terms = norm(q).split(/[\s,.;:!?«»"()]+/).filter((w) => w.length >= 2 || /\d/.test(w));
  const phrase = norm(q);
  const g = gI?.value || '';
  const results = [];
  for (const it of index) {
    if (g && it.group !== g) continue;
    const T = norm(it.title), X = norm(it.text);
    let score = 0, ok = true;
    for (const w of terms) {
      const inT = T.includes(w);
      let c = 0, p = X.indexOf(w);
      while (p !== -1 && c < 12) { c++; p = X.indexOf(w, p + w.length); }
      if (!inT && !c) { ok = false; break; }
      score += (inT ? 12 : 0) + c;
    }
    if (!ok) continue;
    if (T.includes(phrase)) score += 20; else if (X.includes(phrase)) score += 6;
    results.push({ ...it, score });
  }
  if ((sI?.value || 'relevance') === 'date') results.sort((a, b) => String(b.updated).localeCompare(String(a.updated)) || b.score - a.score);
  else results.sort((a, b) => b.score - a.score);
  const hl = (text) => { let h = escHtml(text); for (const w of terms.sort((a, b) => b.length - a.length)) h = h.replace(new RegExp(`(${reEsc(escHtml(w))})`, 'giu'), '<mark>$1</mark>'); return h; };
  const snippet = (text) => {
    const X = norm(text); let pos = -1;
    for (const w of terms) { const p = X.indexOf(w); if (p !== -1 && (pos === -1 || p < pos)) pos = p; }
    const start = Math.max(0, pos - 90), end = Math.min(text.length, (pos < 0 ? 0 : pos) + 170);
    return `${start > 0 ? '… ' : ''}${hl(text.slice(start, end))}${end < text.length ? ' …' : ''}`;
  };
  count.textContent = results.length ? tr('search.found', { n: results.length }) : tr('search.none', { q });
  out.innerHTML = results.slice(0, 60).map((r) => `<li class="sr-item"><p class="sr-item__group">${escHtml(r.groupLabel || '')}</p><h2 class="sr-item__title"><a href="${escHtml(r.url)}">${hl(r.title)}</a></h2><p class="sr-item__snip">${snippet(r.text)}</p>${r.updated ? `<p class="sr-item__meta">${escHtml(tr('search.updated'))}: ${fmtD(r.updated)}</p>` : ''}</li>`).join('');
  d.title = `${q} — ${d.title}`;
  live(count.textContent);
}

/* ---------------------------------------------------------------- forms */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function fieldError(el) {
  const v = (el.type === 'checkbox' ? (el.checked ? '1' : '') : el.value).trim();
  if (el.required && !v) return el.type === 'checkbox' ? tr('form.err.consent') : tr('form.err.required');
  if (!v) return '';
  if (el.type === 'email' && !EMAIL_RE.test(v)) return tr('form.err.email');
  if (el.type === 'tel' && v.replace(/\D/g, '').length < 10) return tr('form.err.phone');
  if (el.tagName === 'TEXTAREA' && el.required && v.length < 10) return tr('form.err.short');
  return '';
}
function showError(el, msg) {
  const err = d.getElementById(`${el.id}-err`);
  if (msg) { el.setAttribute('aria-invalid', 'true'); if (err) { err.textContent = msg; err.hidden = false; } }
  else { el.removeAttribute('aria-invalid'); if (err) { err.textContent = ''; err.hidden = true; } }
}
function labelOf(el) { return (d.querySelector(`label[for="${el.id}"]`)?.textContent || el.name).replace(/\*|\(.*?\)/g, '').trim(); }
function composeText(form) {
  const lines = [];
  $$('input, select, textarea', form).forEach((el) => {
    if (['hidden', 'checkbox'].includes(el.type) || el.name === 'website' || !el.value.trim()) return;
    const v = el.tagName === 'SELECT' ? el.options[el.selectedIndex].text : el.value.trim();
    lines.push(`${labelOf(el)}: ${v}`);
  });
  return lines.join('\n');
}
$$('form[data-form]').forEach((form) => {
  const fields = $$('input:not([type="hidden"]):not([name="website"]), select, textarea', form);
  const summary = form.querySelector('.form__summary'), status = form.querySelector('.form__status'), fallback = form.querySelector('.form__fallback');
  fields.forEach((el) => {
    el.addEventListener('blur', () => { if (el.getAttribute('aria-invalid') === 'true' || el.value) showError(el, fieldError(el)); });
    el.addEventListener('input', () => { if (el.getAttribute('aria-invalid') === 'true' && !fieldError(el)) showError(el, ''); });
    el.addEventListener('change', () => { if (el.type === 'checkbox') showError(el, fieldError(el)); });
  });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errors = [];
    fields.forEach((el) => { const m = fieldError(el); showError(el, m); if (m) errors.push([el, m]); });
    if (form.dataset.form === 'feedback') { /* email required by markup */ }
    if (errors.length) {
      summary.innerHTML = `<p><strong>${escHtml(tr('form.errSummary'))}</strong></p><ul>${errors.map(([el, m]) => `<li><a href="#${el.id}">${escHtml(labelOf(el))}</a> — ${escHtml(m)}</li>`).join('')}</ul>`;
      summary.hidden = false; summary.focus();
      $$('a', summary).forEach((a) => a.addEventListener('click', (ev) => { ev.preventDefault(); d.getElementById(a.hash.slice(1))?.focus(); }));
      return;
    }
    summary.hidden = true; fallback.hidden = true;
    const hp = form.querySelector('[name="website"]');
    if (hp && hp.value) { form.classList.add('is-sent'); status.textContent = tr('form.ok'); return; }
    const pageI = form.querySelector('[name="page"]'); if (pageI) pageI.value = location.pathname;
    const elI = form.querySelector('[name="elapsed"]'); if (elI) elI.value = String(Math.round(performance.now() / 1000));
    const btn = form.querySelector('[type="submit"]'); btn.disabled = true;
    status.classList.add('is-busy'); status.textContent = tr('form.sending');
    const ctrl = new AbortController(); const timer = setTimeout(() => ctrl.abort(), 12000);
    let ok = false;
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }, signal: ctrl.signal });
      const j = await res.json().catch(() => ({}));
      ok = res.ok && j.ok === true;
    } catch { ok = false; }
    clearTimeout(timer); btn.disabled = false; status.classList.remove('is-busy');
    if (ok) {
      form.classList.add('is-sent'); status.textContent = tr('form.ok'); status.setAttribute('tabindex', '-1'); status.focus();
    } else {
      status.textContent = '';
      const text = composeText(form);
      const subject = `${d.title.split(' — ').pop()} — ${form.dataset.form}`;
      const wa = fallback.querySelector('[data-fallback="wa"]'), mail = fallback.querySelector('[data-fallback="mail"]');
      if (wa) wa.href = `https://wa.me/${form.dataset.wa}?text=${encodeURIComponent(text)}`;
      if (mail) mail.href = `mailto:${form.dataset.mail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
      fallback.hidden = false; fallback.setAttribute('tabindex', '-1'); fallback.focus();
    }
  });
});

/* ---------------------------------------------------------------- footer menu: accordion on phones */
{
  const cols = $$('[data-ftr-col]');
  const ftrMQ = matchMedia('(max-width: 699px)');
  const sync = () => cols.forEach((c) => { c.open = !ftrMQ.matches; });
  if (cols.length) {
    sync();
    ftrMQ.addEventListener?.('change', sync);
    // wider screens: the group headings are plain headings, not toggles
    cols.forEach((c) => c.querySelector('summary')?.addEventListener('click', (e) => { if (!ftrMQ.matches) e.preventDefault(); }));
  }
}

/* ---------------------------------------------------------------- public API */
window.Keremet = Object.freeze({ lang: LANG, motionPaused, a11yOn, setMotion: (p) => setMotion(!!p), t: tr, externalLinks });
