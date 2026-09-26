/* =====================================================================================
   KEREMET — home.js (landing only, ES module; loaded after the deferred gsap / ScrollTrigger / Lenis
   classic scripts, so the globals exist — every use is still guarded).
   · always: trick buttons → window 'keremet:trick' (+ SVG fallback animation), header tone (body[data-tone]),
     journey rail state, day-section keyboard support
   · motion allowed (no a11y mode, no prefers-reduced-motion): html.home-fx → #bg-stack portal wipes, Lenis smooth
     scroll synced with ScrollTrigger, pinned horizontal "day" (--day-progress on the day section + sky layer, window.__keremetDay for the world), manifesto word
     reveal, counters, magnetic buttons, cursor dot, lazy 3D world (dynamic import after first paint)
   · 'keremet:motion' {paused} → Lenis off/on, world.pause()/resume() (marquees pause via CSS)
   · 'keremet:a11y' / reduced-motion change → full teardown to the plain vertical layout (or set-up again)
   ===================================================================================== */
const d = document;
const html = d.documentElement;
const $ = (s, r = d) => r.querySelector(s);
const $$ = (s, r = d) => Array.from(r.querySelectorAll(s));
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const reducedMQ = matchMedia('(prefers-reduced-motion: reduce)');
const fineMQ = matchMedia('(hover: hover) and (pointer: fine)');
const mobileMQ = matchMedia('(max-width: 899px)');
const a11yOn = () => html.getAttribute('data-a11y') === 'on';
const paused = () => html.getAttribute('data-motion') === 'paused';
const fxAllowed = () => !a11yOn() && !reducedMQ.matches;

const main = $('.main--home');
const sections = main ? $$('.st[data-station]', main) : [];
if (!main || !sections.length) throw new Error('[home] landing markup not found');

const TONE = { hero: 'dark', math: 'light', physics: 'dark', chemistry: 'dark', biology: 'dark', geography: 'light', languages: 'light', informatics: 'dark', arts: 'dark', day: 'light', paper: 'light' };
const themes = sections.map((s) => s.dataset.theme || 'hero');
const stack = $('#bg-stack');
const layers = {};
if (stack) $$('.bg', stack).forEach((l) => { layers[l.dataset.theme] = l; });
const railLinks = new Map($$('[data-rail]').map((a) => [a.dataset.rail, a]));
const RAIL_ALIAS = { finale: 'contacts' };

let fx = false;          // motion effects set up
let lenis = null;
let gctx = null;         // gsap.context (day pin etc.)
let dayST = null;
let world = null;
let worldQueued = false;
let dayP = 0;

/* ================================================================ always-on */
/* trick buttons */
d.addEventListener('click', (e) => {
  const b = e.target.closest('.st__trick');
  if (!b) return;
  const station = b.dataset.trick;
  window.dispatchEvent(new CustomEvent('keremet:trick', { detail: { station } }));
  if (!html.classList.contains('webgl-on')) {
    const stg = d.getElementById(station)?.querySelector('.st__stage');
    if (stg) { stg.classList.remove('is-trick'); void stg.offsetWidth; stg.classList.add('is-trick'); }
  }
});
d.addEventListener('animationend', (e) => { if (e.target.classList?.contains('st__fallback')) e.target.closest('.st__stage')?.classList.remove('is-trick'); });

/* ================================================================ geometry cache
   Every scroll frame used to call getBoundingClientRect() on 16 sections (+ manifesto, stages) right after other
   code had written styles → forced style/layout per frame. Document-space geometry is measured once and re-measured
   only when the layout changes (resize, main/body size change, pin refresh, fonts). A pinned section is measured
   through its GSAP pin-spacer (same top, height incl. the pin distance). */
let geo = null;
function box(el) { return el.parentElement && el.parentElement.classList.contains('pin-spacer') ? el.parentElement : el; }
function measureGeo() {
  const y = window.scrollY;
  const abs = (el) => { const r = el.getBoundingClientRect(); return { top: r.top + y, height: r.height, left: r.left, width: r.width }; };
  geo = {
    secs: sections.map((s) => abs(box(s))),
    stages: sections.map((s) => { const st = s.querySelector('.st__stage'); return st ? abs(st) : null; }),
    manifesto: manifesto ? abs(manifesto) : null,
  };
  return geo;
}
function invalidateGeo() {
  geo = null;
  window.dispatchEvent(new Event('keremet:layout'));
  requestUpdate();
}

/* ================================================================ per-frame page state (scroll-driven) */
let rafPending = false;
function requestUpdate() { if (!rafPending) { rafPending = true; requestAnimationFrame(update); } }
let lastTone = '', lastRail = '', lastBase = '', lastNext = '', lastRailOff = false;
function update() {
  rafPending = false;
  const vh = innerHeight, vw = innerWidth;
  const g = geo || measureGeo();
  const sy = window.scrollY;
  const rects = g.secs.map((r) => ({ top: r.top - sy, bottom: r.top - sy + r.height, height: r.height }));

  // ---- header tone: the section under the sticky bar
  const probe = 36;
  let toneIdx = 0;
  rects.forEach((r, i) => { if (r.top <= probe) toneIdx = i; });
  let tone = TONE[themes[toneIdx]] || 'dark';
  if (themes[toneIdx] === 'day' && dayP > 0.74) tone = 'dark';
  if (tone !== lastTone) { d.body.dataset.tone = tone; lastTone = tone; }

  // ---- rail: section at the viewport centre
  let railIdx = 0;
  rects.forEach((r, i) => { if (r.top <= vh * 0.5) railIdx = i; });
  const rid = RAIL_ALIAS[sections[railIdx].id] || sections[railIdx].id;
  // the dot rail would sit on top of the pinned day cards → hide it while that section fills the screen
  const railOff = !!dayST && sections[railIdx].id === 'day';
  if (railOff !== lastRailOff) { html.classList.toggle('rail-off', railOff); lastRailOff = railOff; }
  if (rid !== lastRail) {
    railLinks.forEach((a, id) => { if (id === rid) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    lastRail = rid;
  }

  if (!fx) return;

  // ---- portal wipes: base = last section well inside the viewport; next = the one entering
  let cur = 0;
  rects.forEach((r, i) => { if (r.top <= vh * 0.35) cur = i; });
  const nxt = cur + 1 < sections.length ? cur + 1 : -1;
  const baseTheme = themes[cur];
  let nextTheme = '', p = 0;
  if (nxt >= 0 && themes[nxt] !== baseTheme) {
    p = clamp((vh - rects[nxt].top) / (vh * 0.65));
    if (p > 0) nextTheme = themes[nxt];
  }
  if (baseTheme !== lastBase || nextTheme !== lastNext) {
    Object.entries(layers).forEach(([th, l]) => { l.classList.toggle('is-base', th === baseTheme); l.classList.toggle('is-next', th === nextTheme); });
    lastBase = baseTheme; lastNext = nextTheme;
  }
  if (nextTheme) {
    const layer = layers[nextTheme];
    let x, y;
    // world.js writes the settled screen position of the incoming 3D object on #bg-stack (once per station change)
    const wx = html.classList.contains('webgl-on') && stack ? parseFloat(stack.style.getPropertyValue('--wipe-x')) : NaN;
    const wy = html.classList.contains('webgl-on') && stack ? parseFloat(stack.style.getPropertyValue('--wipe-y')) : NaN;
    if (Number.isFinite(wx) && Number.isFinite(wy)) { x = wx; y = wy; } else {
      // no 3D: grow from the incoming stage (its un-stuck position = section top; x never changes with scroll)
      const sr = g.stages[nxt];
      if (sr && sr.width > 0) { x = sr.left + sr.width / 2; y = clamp(rects[nxt].top + Math.min(sr.height, vh) / 2, -vh, vh * 2); } else { x = vw / 2; y = clamp(rects[nxt].top + vh * 0.3, vh * 0.3, vh * 1.2); }
    }
    const maxR = Math.hypot(Math.max(x, vw - x), Math.max(y, vh - y)) + 80;
    const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    // only the incoming layer carries the clip vars; write only on a real (> 1px) change
    if (layer) setWipe(layer, Math.round(x), Math.round(y), Math.round(e * maxR));
  }

  // ---- manifesto: words light up with scroll
  if (manifesto && g.manifesto) {
    const r = { top: g.manifesto.top - sy, height: g.manifesto.height };
    const mp = clamp((vh * 0.82 - r.top) / (r.height + vh * 0.3));
    const lit = Math.round(mp * words.length);
    if (lit !== litCount) { words.forEach((w, i) => w.classList.toggle('is-lit', i < lit)); litCount = lit; }
  }
}
const wipeState = new WeakMap();
function setWipe(layer, x, y, r) {
  const o = wipeState.get(layer) || { x: NaN, y: NaN, r: NaN };
  const st = layer.style;
  if (!(Math.abs(o.x - x) <= 1)) { st.setProperty('--wx', `${x}px`); o.x = x; }
  if (!(Math.abs(o.y - y) <= 1)) { st.setProperty('--wy', `${y}px`); o.y = y; }
  if (!(Math.abs(o.r - r) <= 1) || (r === 0 && o.r !== 0)) { st.setProperty('--wipe-r', `${r}px`); o.r = r; }
  wipeState.set(layer, o);
}
const manifesto = $('[data-manifesto]');
const words = manifesto ? $$('.w', manifesto) : [];
let litCount = -1;

window.addEventListener('scroll', requestUpdate, { passive: true });
window.addEventListener('resize', invalidateGeo);
if ('ResizeObserver' in window) { const ro = new ResizeObserver(() => { geo = null; requestUpdate(); }); ro.observe(main); ro.observe(d.body); }
d.fonts?.ready.then(invalidateGeo);
requestUpdate();

/* ================================================================ day section: progress → sky + keyboard */
const daySec = d.getElementById('day');
const dayTrack = $('.day__track');
const dayVp = $('[data-day-viewport]');
const dayCards = dayTrack ? $$('.day-card', dayTrack) : [];
const dayTicks = $$('.day__progress li');
// The day vars live on the only elements that use them (the sky layer in #bg-stack and the day section's progress
// bar) — never on <html>: a root custom-property write restyles the whole document every frame. world.js reads the
// number from window.__keremetDay. Skipped when the value moved less than 1/2000.
const skyEl = stack ? stack.querySelector('.sky') : null;
const dayVarHosts = [skyEl, d.getElementById('day')].filter(Boolean);
const DAY_VARS = ['--day-progress', '--o-noon', '--o-dusk', '--o-night', '--o-stars', '--sun-x', '--sun-y', '--o-sun', '--moon-x', '--moon-y', '--o-moon'];
let lastDayP = -1;
const dayVars = {
  setProperty(k, v) { for (const h of dayVarHosts) h.style.setProperty(k, v); },
};
function setDay(p) {
  dayP = p;
  window.__keremetDay = p;
  if (Math.abs(p - lastDayP) < 0.0005 && p !== 0 && p !== 1) return;
  lastDayP = p;
  const s = dayVars;
  s.setProperty('--day-progress', p.toFixed(4));
  s.setProperty('--o-noon', smooth(0.06, 0.3, p).toFixed(3));
  s.setProperty('--o-dusk', smooth(0.5, 0.72, p).toFixed(3));
  s.setProperty('--o-night', smooth(0.76, 0.95, p).toFixed(3));
  s.setProperty('--o-stars', smooth(0.8, 1, p).toFixed(3));
  const t = clamp(p / 0.82);
  s.setProperty('--sun-x', `${(12 + 76 * t).toFixed(2)}%`);
  s.setProperty('--sun-y', `${(80 - 60 * Math.sin(Math.PI * t)).toFixed(2)}%`);
  s.setProperty('--o-sun', (1 - smooth(0.74, 0.86, p)).toFixed(3));
  const m = clamp((p - 0.72) / 0.28);
  s.setProperty('--moon-x', `${(18 + 42 * m).toFixed(2)}%`);
  s.setProperty('--moon-y', `${(72 - 48 * Math.sin((Math.PI / 2) * m)).toFixed(2)}%`);
  s.setProperty('--o-moon', smooth(0.74, 0.9, p).toFixed(3));
  const on = Math.round(p * (dayTicks.length - 1));
  dayTicks.forEach((li, i) => li.classList.toggle('is-on', i === on));
  requestUpdate();
}
function clearDay() { DAY_VARS.forEach((k) => dayVarHosts.forEach((h) => h.style.removeProperty(k))); dayP = 0; lastDayP = -1; delete window.__keremetDay; }

/** native (non-pinned) mode: progress follows the horizontal scroll of the row */
dayVp?.addEventListener('scroll', () => { if (!dayST) { const max = dayVp.scrollWidth - dayVp.clientWidth; setDay(max > 0 ? dayVp.scrollLeft / max : 0); } }, { passive: true });

function scrollToY(y) {
  if (lenis) lenis.scrollTo(y, { duration: 0.9 });
  else window.scrollTo({ top: y, behavior: reducedMQ.matches || a11yOn() ? 'auto' : 'smooth' });
}
function dayGoTo(idx) {
  if (!dayST) return;
  const n = dayCards.length;
  const p = clamp(idx / Math.max(1, n - 1));
  scrollToY(dayST.start + p * (dayST.end - dayST.start) + 1);
}
dayVp?.addEventListener('keydown', (e) => {
  if (!dayST) return; // native row: arrow keys scroll it natively
  const n = dayCards.length;
  // current card: the last keyboard target while its scroll is still running, otherwise the card we are at or just
  // past (+.25 tolerance) — Tab's own focus scroll leaves the pin slightly past card 0 and round() would skip card 1
  const pos = dayP * (n - 1);
  const cur = kbd.to !== null && performance.now() - kbd.at < 1000 ? kbd.to : Math.floor(pos + 0.25);
  let to = null;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') to = cur + 1;
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') to = cur - 1;
  else if (e.key === 'Home') to = 0;
  else if (e.key === 'End') to = n - 1;
  if (to === null) return;
  if ((to < 0 || to > n - 1) && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) return; // let the page continue scrolling
  e.preventDefault();
  kbd.to = clamp(to, 0, n - 1); kbd.at = performance.now();
  dayGoTo(kbd.to);
});
const kbd = { to: null, at: 0 };
dayTrack?.addEventListener('focusin', (e) => {
  if (!dayST) return;
  const card = e.target.closest('.day-card');
  // focus may have scrolled a clipping ancestor sideways (browsers without overflow:clip) — undo it, the pin drives x
  for (let el = dayTrack.parentElement; el && el !== daySec.parentElement; el = el.parentElement) if (el.scrollLeft) el.scrollLeft = 0;
  if (card) dayGoTo(dayCards.indexOf(card));
});

/* ================================================================ motion effects */
function startLenis() {
  if (lenis || !fx || paused() || typeof window.Lenis !== 'function') return;
  try {
    lenis = new window.Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
  } catch { lenis = null; return; }
  lenis.on('scroll', requestUpdate);
  if (window.ScrollTrigger) lenis.on('scroll', window.ScrollTrigger.update);
  if (window.gsap) window.gsap.ticker.add(lenisRaf);
  else { const loop = (t) => { if (!lenis) return; lenis.raf(t); requestAnimationFrame(loop); }; requestAnimationFrame(loop); }
}
function lenisRaf(time) { lenis?.raf(time * 1000); }
function stopLenis() {
  if (!lenis) return;
  window.gsap?.ticker.remove(lenisRaf);
  lenis.destroy(); lenis = null;
}

/* in-page anchors (rail, hero "start", scroll cue) through Lenis */
d.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a || !lenis || !main.contains(a)) return;
  const id = a.getAttribute('href').slice(1);
  const target = id && d.getElementById(id);
  if (!target || id === 'main') return;
  e.preventDefault();
  lenis.scrollTo(target, { duration: 1.4 });
  history.replaceState(null, '', `#${id}`);
});

let stRefreshHooked = false;
function setupDayPin() {
  const gsap = window.gsap, ST = window.ScrollTrigger;
  if (!gsap || !ST || !daySec || !dayTrack || !dayVp) return;
  gsap.registerPlugin(ST);
  ST.config({ ignoreMobileResize: true });
  if (!stRefreshHooked) { stRefreshHooked = true; ST.addEventListener('refresh', invalidateGeo); }
  html.classList.add('day-pin');
  dayVp.scrollLeft = 0;
  const dist = () => {
    const cs = getComputedStyle(dayVp);
    return Math.max(0, dayTrack.scrollWidth - dayVp.clientWidth + parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight) - 8);
  };
  gctx = gsap.context(() => {
    const tw = gsap.to(dayTrack, {
      x: () => -dist(),
      ease: 'none',
      scrollTrigger: {
        trigger: daySec, start: 'top top', end: () => `+=${Math.max(dist() * 1.15, innerHeight * 0.8)}`,
        pin: true, scrub: mobileMQ.matches ? true : 0.6, invalidateOnRefresh: true, anticipatePin: 1,
        snap: mobileMQ.matches && dayCards.length > 1 ? { snapTo: 1 / (dayCards.length - 1), inertia: false, duration: { min: 0.2, max: 0.5 }, delay: 0.12, ease: 'power1.inOut' } : undefined,
        onUpdate: (self) => setDay(self.progress),
        onRefresh: (self) => setDay(self.progress),
      },
    });
    dayST = tw.scrollTrigger;
  });
}

/* counters */
let countIO = null;
function setupCounters() {
  const els = $$('[data-count]');
  if (!els.length || !('IntersectionObserver' in window)) return;
  countIO = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    countIO.unobserve(en.target);
    if (paused()) return;
    const el = en.target, to = parseInt(el.dataset.count, 10), from = to - 24, t0 = performance.now(), dur = 1500;
    const step = (now) => {
      const k = clamp((now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = String(Math.round(from + (to - from) * e));
      if (k < 1 && fx) requestAnimationFrame(step); else el.textContent = String(to);
    };
    requestAnimationFrame(step);
  }), { threshold: 0.6 });
  els.forEach((el) => countIO.observe(el));
}

/* magnetic buttons + cursor dot (desktop, fine pointer) */
const magnets = $$('[data-magnetic]');
function onMagMove(e) {
  if (paused()) return;
  const el = e.currentTarget, r = el.getBoundingClientRect();
  const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
  el.style.transform = `translate(${(dx * 0.22).toFixed(1)}px, ${(dy * 0.32).toFixed(1)}px)`;
}
function onMagLeave(e) { e.currentTarget.style.transform = ''; }
function setupMagnets(on) {
  magnets.forEach((el) => {
    el.removeEventListener('pointermove', onMagMove); el.removeEventListener('pointerleave', onMagLeave); el.style.transform = '';
    if (on) { el.addEventListener('pointermove', onMagMove); el.addEventListener('pointerleave', onMagLeave); }
  });
}
const cursor = $('.cursor');
const cur = { x: -100, y: -100, rx: -100, ry: -100, raf: 0, on: false };
function cursorLoop() {
  cur.raf = 0;
  const k = paused() ? 1 : 0.2;
  cur.rx += (cur.x - cur.rx) * k; cur.ry += (cur.y - cur.ry) * k;
  cursor.style.setProperty('--cx', `${cur.x}px`); cursor.style.setProperty('--cy', `${cur.y}px`);
  cursor.style.setProperty('--rx', `${cur.rx.toFixed(1)}px`); cursor.style.setProperty('--ry', `${cur.ry.toFixed(1)}px`);
  if (Math.abs(cur.x - cur.rx) + Math.abs(cur.y - cur.ry) > 0.3) cur.raf = requestAnimationFrame(cursorLoop);
}
function onPointer(e) {
  if (e.pointerType !== 'mouse') return;
  cur.x = e.clientX; cur.y = e.clientY;
  const t = e.target;
  cursor.classList.toggle('is-hover', !!t.closest?.('a, button, [data-magnetic], summary, label, input, select, textarea'));
  cursor.classList.toggle('is-grab', t.id === 'world' && getComputedStyle(t).cursor === 'grab');
  if (!cur.raf) cur.raf = requestAnimationFrame(cursorLoop);
}
function setupCursor(on) {
  if (!cursor) return;
  if (on && !cur.on && fineMQ.matches) { cur.on = true; html.classList.add('has-cursor'); window.addEventListener('pointermove', onPointer, { passive: true }); }
  else if (!on && cur.on) { cur.on = false; html.classList.remove('has-cursor'); window.removeEventListener('pointermove', onPointer); }
}

/* 3D world — lazy, after first paint, only with WebGL and motion allowed */
function hasWebGL() {
  return 'WebGL2RenderingContext' in window || 'WebGLRenderingContext' in window;
}
function loadWorld() {
  worldQueued = false;
  if (!fx || world) return;
  const canvas = d.getElementById('world');
  if (!canvas || !hasWebGL()) { html.classList.add('no-webgl'); return; }
  html.classList.add('world-loading');
  const isMobile = mobileMQ.matches || matchMedia('(pointer: coarse)').matches;
  const mem = navigator.deviceMemory || 8;
  const quality = isMobile || mem < 4 ? 'low' : 'high';
  import('./world/world.js')
    .then((m) => {
      if (!fx || world) return;
      const init = m.initWorld || m.default;
      if (typeof init !== 'function') throw new Error('initWorld missing');
      world = init({ canvas, sections: $$('[data-station]', main), isMobile, quality }) || null;
      if (world && paused()) world.pause?.();
      requestAnimationFrame(() => window.ScrollTrigger?.refresh());
      requestUpdate();
    })
    .catch(() => { html.classList.add('no-webgl'); })
    .finally(() => { html.classList.remove('world-loading'); });
}
function queueWorld() {
  if (worldQueued || world) return;
  worldQueued = true;
  const go = () => { if ('requestIdleCallback' in window) requestIdleCallback(loadWorld, { timeout: 1800 }); else setTimeout(loadWorld, 400); };
  if (d.readyState === 'complete') go(); else window.addEventListener('load', go, { once: true });
}

/* ================================================================ fixed pause button: never rests on content
   The round pause button (layout/main.js, bottom-left) is fixed; when the page comes to rest with text, a link or a
   button under it, it moves to the first free spot: bottom-right (if the to-top button is hidden), the labelled pill
   folded into the 44px round icon button in the same corner, then one to three steps up on either side. Checked only when scrolling stops (and on resize / to-top toggling), via elementsFromPoint. */
const mBtn = d.querySelector('[data-motion-toggle]');
const topBtn = d.querySelector('[data-to-top]');
const DODGE_SKIP = '#world, #bg-stack, .st__stage, .cursor, .motion-toggle, .to-top, .rail';
function isContent(el) {
  if (!el || el === d.body || el === html || el.closest(DODGE_SKIP)) return false;
  if (el.closest('a, button, input, select, textarea, summary, label, iframe, [role="button"]')) return true;
  if (el.matches('img, video, svg')) return true;
  for (const n of el.childNodes) if (n.nodeType === 3 && n.textContent.trim()) return true;
  return false;
}
function spotBusy(x, y, w, h) {
  const vw = html.clientWidth, vh = innerHeight, pad = 6;
  for (const fx of [0, 0.5, 1]) for (const fy of [0, 0.5, 1]) {
    const px = x - pad + (w + 2 * pad) * fx, py = y - pad + (h + 2 * pad) * fy;
    if (px < 0 || py < 0 || px >= vw || py >= vh) continue;
    if (d.elementsFromPoint(px, py).some(isContent)) return true;
  }
  return false;
}
let dodgeTimer = 0;
function dodge() {
  dodgeTimer = 0;
  if (!mBtn) return;
  mBtn.classList.remove('is-folded'); // measure the unfolded button (same frame → no visible flash)
  const w = mBtn.offsetWidth, h = mBtn.offsetHeight;
  if (!w || !h) return;
  // offsetLeft/Top of a fixed element = its untransformed viewport position (ignores translate / tuck scale)
  const x = mBtn.offsetLeft, y = mBtn.offsetTop;
  const toRight = html.clientWidth - w - x - x;
  const rightFree = !(topBtn && topBtn.classList.contains('is-visible'));
  const step = h + 12;
  // the wide labelled pill (≥720px) may also fold into the 44px round icon button that phones use (same corner)
  const canFold = w > h + 8 && !a11yOn();
  const cw = canFold ? h : w, cx = canFold ? Math.min(x, 12) : x;
  const spots = [[0, 0, false]];
  if (rightFree) spots.push([toRight, 0, false]);
  if (canFold) { spots.push([cx - x, 0, true]); if (rightFree) spots.push([html.clientWidth - cw - cx - x, 0, true]); }
  for (let k = 1; k <= 3; k++) { spots.push([0, -k * step, false]); if (rightFree) spots.push([toRight, -k * step, false]); }
  const pick = spots.find(([dx, dy, fold]) => !spotBusy(x + dx, y + dy, fold ? cw : w, h)) || [0, 0, false];
  mBtn.classList.toggle('is-folded', pick[2]);
  mBtn.style.setProperty('--dodge-x', `${pick[0]}px`);
  mBtn.style.setProperty('--dodge-y', `${pick[1]}px`);
}
function queueDodge(delay = 180) { clearTimeout(dodgeTimer); dodgeTimer = setTimeout(dodge, delay); }
if (mBtn && 'elementsFromPoint' in d) {
  window.addEventListener('scroll', () => queueDodge(), { passive: true });
  window.addEventListener('resize', () => queueDodge(250));
  window.addEventListener('keremet:layout', () => queueDodge(250));
  window.addEventListener('keremet:a11y', () => queueDodge(300));
  if (topBtn && 'MutationObserver' in window) new MutationObserver(() => queueDodge(60)).observe(topBtn, { attributes: true, attributeFilter: ['class'] });
  if (d.readyState === 'complete') queueDodge(300); else window.addEventListener('load', () => queueDodge(300), { once: true });
  d.fonts?.ready.then(() => queueDodge(300));
}

/* ================================================================ set-up / teardown */
function setup() {
  if (fx || !fxAllowed()) return;
  fx = true;
  html.classList.add('home-fx');
  if (manifesto) manifesto.classList.add('is-armed');
  startLenis();
  setupDayPin();
  setupCounters();
  setupMagnets(fineMQ.matches);
  setupCursor(true);
  queueWorld();
  lastBase = lastNext = '';
  requestUpdate();
  // layout settles once web fonts arrive; any later height change (fonts, 3D hints, embeds) re-measures the pin
  d.fonts?.ready.then(() => window.ScrollTrigger?.refresh());
  if (!mainRO && 'ResizeObserver' in window) {
    let lastH = main.offsetHeight, timer = 0;
    mainRO = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(() => { const h = main.offsetHeight; if (fx && Math.abs(h - lastH) > 2) { lastH = h; window.ScrollTrigger?.refresh(); lastH = main.offsetHeight; } }, 180);
    });
    mainRO.observe(main);
  }
}
let mainRO = null;
function teardown() {
  if (!fx) return;
  fx = false;
  stopLenis();
  if (gctx) { gctx.revert(); gctx = null; }
  dayST = null;
  html.classList.remove('home-fx', 'day-pin', 'world-loading');
  if (world) { try { world.destroy(); } catch { /* ignore */ } world = null; }
  countIO?.disconnect(); countIO = null;
  $$('[data-count]').forEach((el) => { el.textContent = el.dataset.count; });
  setupMagnets(false);
  setupCursor(false);
  if (manifesto) { manifesto.classList.remove('is-armed'); words.forEach((w) => w.classList.remove('is-lit')); litCount = -1; }
  Object.values(layers).forEach((l) => { l.classList.remove('is-base', 'is-next'); });
  clearDay();
  window.ScrollTrigger?.refresh();
  requestUpdate();
}
function sync() { if (fxAllowed()) setup(); else teardown(); }

window.addEventListener('keremet:a11y', sync);
reducedMQ.addEventListener?.('change', sync);
window.addEventListener('keremet:motion', (e) => {
  const p = !!(e.detail && e.detail.paused);
  if (p) { stopLenis(); world?.pause?.(); setupMagnets(false); }
  else if (fx) { startLenis(); world?.resume?.(); setupMagnets(fineMQ.matches); }
});

sync();
