// Keremet landing — "camera flight through the universe of knowledge".
// Entry: initWorld({ canvas, sections, isMobile, quality }) → { destroy(), pause(), resume() }   (SPEC §3 world.js contract)
import {
  Scene, PerspectiveCamera, HemisphereLight, DirectionalLight, Color, Vector3, Vector2, Raycaster, CatmullRomCurve3, Matrix4,
} from 'three';
import { createRenderer, createEnvironment, Quality } from './core/renderer.js';
import { CameraRig } from './core/rig.js';
import { Input } from './core/input.js';
import { StationManager } from './core/stations.js';
import { ANCHORS, ORDER, OBJECT_STATIONS, UNIVERSE } from './core/layout.js';
import { createParticles } from './fx/particles.js';
import { createConstellation } from './fx/constellation.js';
import { themeTone, dayTint } from './fx/palette.js';
import { disposeSharedTextures } from './fx/materials.js';
import { clamp, lerp, smoothstep } from './fx/ease.js';

const html = document.documentElement;
const NOOP = { destroy() {}, pause() {}, resume() {} };

/**
 * @param {object} opts
 * @param {HTMLCanvasElement} opts.canvas
 * @param {NodeListOf<HTMLElement>|HTMLElement[]} opts.sections  landing sections with [data-station]
 * @param {boolean} [opts.isMobile]
 * @param {'high'|'low'} [opts.quality]
 */
export function initWorld({ canvas, sections, isMobile = false, quality = 'high' } = {}) {
  if (!canvas) { html.classList.add('no-webgl'); return NOOP; }
  // no throwaway probe context (each one counts against the browser's live-context limit): creating the renderer IS the test
  let renderer;
  try {
    renderer = createRenderer(canvas, { isMobile, quality });
  } catch (err) {
    console.warn('[world] WebGL init failed', err);
    html.classList.add('no-webgl');
    return NOOP;
  }
  html.classList.remove('no-webgl');

  // ---------------------------------------------------------------- sections → station ids
  let secs = Array.from(sections || []).filter((s) => s.dataset && s.dataset.station);
  if (!secs.length) secs = Array.from(document.querySelectorAll('[data-station]'));
  const ids = secs.map((s) => s.dataset.station);
  const themes = secs.map((s) => s.dataset.theme || (ORDER.includes(s.dataset.station) ? s.dataset.station : 'hero'));
  if (!ids.length) { renderer.dispose(); return NOOP; }

  canvas.setAttribute('aria-hidden', 'true');
  canvas.setAttribute('tabindex', '-1');
  if (!canvas.style.touchAction) canvas.style.touchAction = 'pan-y';

  // ---------------------------------------------------------------- scene
  const scene = new Scene();
  const camera = new PerspectiveCamera(40, 1, 0.1, 2400);
  camera.layers.enable(1); // DETAIL_LAYER (stations/_base.js): decorative parts, skipped in low-quality wide shots
  const envRT = createEnvironment(renderer);
  scene.environment = envRT.texture;
  scene.environmentIntensity = 0.85;

  const hemi = new HemisphereLight('#E6EEFF', '#2A1E3A', 0.9);
  const key = new DirectionalLight('#FFF1DC', 2.4);
  key.position.set(6, 10, 8);
  const back = new DirectionalLight('#9FD8FF', 1.3);
  back.position.set(-8, 4, -10);
  scene.add(hemi, key, back);
  const baseHemi = hemi.color.clone(), baseKey = key.color.clone();

  const q = new Quality({
    isMobile, quality,
    onChange: () => { applySize(true); particles.setDensity(q.particleDensity); },
  });

  // particles along the journey
  const pathPts = OBJECT_STATIONS.map((id) => ANCHORS[id]);
  const path = new CatmullRomCurve3(pathPts, false, 'centripetal');
  const low = quality === 'low';
  const particles = createParticles({
    center: UNIVERSE.center, path,
    stars: low ? 900 : 2200, dust: low ? 700 : 1800,
  });
  particles.setDensity(q.particleDensity);
  particles.objects.forEach((o) => scene.add(o));

  const constellation = createConstellation(ANCHORS, OBJECT_STATIONS, { low, mobile: isMobile });
  scene.add(constellation.group);

  const rig = new CameraRig(camera, secs, ids);

  // ---------------------------------------------------------------- motion state
  const rmq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  const state = {
    externalPause: false,
    attrPaused: html.getAttribute('data-motion') === 'paused',
    eventPaused: false,
    reduced: !!(rmq && rmq.matches),
    hidden: document.hidden,
    raf: 0,
    burstUntil: 0,     // allow a short animation burst (trick) while paused
    time: 0,
    last: 0,
    dirty: true,
    destroyed: false,
    station: -1,
    wipeIdx: -1, wipeDirty: true,
    lastScroll: 0,
    burstId: null,
    heroIdx: Math.max(0, ids.indexOf('hero')),
    heroVisible: true,
  };
  // pause is ON when either signal says so (attribute or the last keremet:motion event)
  const motionPaused = () => state.attrPaused || state.eventPaused;
  const animating = () => !state.externalPause && !motionPaused() && !state.reduced;

  const stations = new StationManager({
    scene, ids,
    ctx: { isMobile, quality, env: envRT.texture, renderer, camera },
    onReady: () => requestRender(),
  });

  // ---------------------------------------------------------------- sizing
  let W = 1, H = 1;
  let pendingSingle = 0;
  const touchUI = isMobile || !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
  function applySize(force) {
    const w = Math.max(1, Math.round(canvas.clientWidth || window.innerWidth));
    const h = Math.max(1, Math.round(canvas.clientHeight || window.innerHeight));
    if (!force && w === W && h === H) return;
    // touch devices: the URL bar collapsing/expanding only changes the height a little → keep the framing keys
    const barOnly = touchUI && !force && rig.keys && w === W && Math.abs(h - H) / H < 0.2;
    W = w; H = h;
    rig.invalidate();
    renderer.setPixelRatio(q.dpr);
    renderer.setSize(W, H, false);
    if (barOnly) rig.setViewport(W, H);
    else rig.resize(W, H);
    state.wipeDirty = true;
    requestRender();
  }
  const ro = window.ResizeObserver ? new ResizeObserver(() => applySize(false)) : null;
  if (ro) ro.observe(canvas);
  // section geometry is cached by the rig (no layout reads per frame) → re-measure when the page's layout changes
  const onLayout = () => {
    rig.invalidate();
    // phones: the hero framing depends on the header height (fonts, util bar wrapping) → rebuild the keys
    if (W < 900 && rig.keys) { const h = rig.heroStage(H); if (h && (rig.heroCy == null || Math.abs(h.cy - rig.heroCy) > 0.004)) rig.resize(W, H); }
    requestRender();
  };
  const layoutRO = window.ResizeObserver ? new ResizeObserver(onLayout) : null;
  if (layoutRO) { layoutRO.observe(document.body); const m = secs[0].closest('main'); if (m) layoutRO.observe(m); }
  window.addEventListener('keremet:layout', onLayout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(onLayout);
  const onWinResize = () => { rig.invalidate(); applySize(false); };
  window.addEventListener('resize', onWinResize);
  applySize(true);

  // ---------------------------------------------------------------- input
  const raycaster = new Raycaster();
  const input = new Input(canvas, {
    hitTest: (ndc) => {
      if (Math.abs(ndc.x) > 1.5) return false;
      raycaster.setFromCamera(ndc, camera);
      return stations.hitTest(raycaster.ray, rig.float);
    },
    onTap: () => { const f = stations.focused(rig.float); if (f) { stations.trick(f.id); startBurst(3.4, f.id); } },
    onDrag: (dx, dy) => { const f = stations.focused(rig.float); if (f) { stations.drag(f.id, dx, dy); state.burstId = f.id; } requestRender(); },
    onDragEnd: () => { const f = stations.focused(rig.float); startBurst(1.2, f ? f.id : null); },
    onChange: () => requestRender(),
  });

  // ---------------------------------------------------------------- events
  const onTrick = (e) => {
    const id = e && e.detail && e.detail.station;
    if (id && stations.trick(id)) startBurst(3.4, id);
  };
  // pausing stops everything at once — also a trick burst / drag inertia that is still running
  const stopBursts = () => { state.burstUntil = 0; state.burstId = null; input.velocity.x = input.velocity.y = 0; };
  const onMotion = (e) => {
    state.eventPaused = !!(e && e.detail && e.detail.paused);
    if (state.eventPaused) stopBursts();
    syncLoop();
  };
  const mo = new MutationObserver(() => {
    // the attribute is the newer signal: it also overrides a stale event state
    const p = html.getAttribute('data-motion') === 'paused';
    if (p !== state.attrPaused || p !== state.eventPaused) { state.attrPaused = p; state.eventPaused = p; if (p) stopBursts(); syncLoop(); }
  });
  mo.observe(html, { attributes: true, attributeFilter: ['data-motion'] });
  const onRm = () => { state.reduced = !!(rmq && rmq.matches); applyReducedVisibility(); syncLoop(); requestRender(); };
  const onVis = () => { state.hidden = document.hidden; syncLoop(); };
  const onScroll = () => {
    state.lastScroll = performance.now();
    if (state.reduced) reducedStation();
    else if (!state.raf) requestRender();
  };

  // ---------------------------------------------------------------- reduced motion: a still hero poster, page theming kept
  // The camera never flies. The canvas fades out once the hero section has left the viewport (no shanyrak frozen behind
  // later sections), and `keremet:station` keeps following the sections so header tone / backgrounds still work.
  const heroSec = secs[state.heroIdx];
  const io = window.IntersectionObserver ? new IntersectionObserver((entries) => {
    for (const e of entries) state.heroVisible = e.isIntersecting && e.intersectionRatio > 0.02;
    applyReducedVisibility();
    if (state.reduced && state.heroVisible) requestRender();
  }, { threshold: [0, 0.02, 0.2] }) : null;
  if (io && heroSec) io.observe(heroSec);
  const canvasOpacity = canvas.style.opacity, canvasTransition = canvas.style.transition;
  function applyReducedVisibility() {
    if (state.destroyed) return;
    if (state.reduced) {
      canvas.style.transition = 'opacity .35s linear';
      canvas.style.opacity = state.heroVisible ? canvasOpacity : '0';
    } else {
      canvas.style.opacity = canvasOpacity;
      canvas.style.transition = canvasTransition;
    }
  }
  function dispatchStation(dom, f) {
    if (dom === state.station) return;
    state.station = dom;
    const p = rig.screenPos(dom);
    window.dispatchEvent(new CustomEvent('keremet:station', { detail: { id: ids[dom], index: dom, float: f, x: p.x, y: p.y } }));
  }
  function reducedStation() {
    const t = rig.measure();
    dispatchStation(clamp(Math.round(t), 0, ids.length - 1), t);
  }
  applyReducedVisibility();
  window.addEventListener('keremet:trick', onTrick);
  window.addEventListener('keremet:motion', onMotion);
  document.addEventListener('visibilitychange', onVis);
  window.addEventListener('scroll', onScroll, { passive: true });
  if (rmq) (rmq.addEventListener ? rmq.addEventListener('change', onRm) : rmq.addListener(onRm));

  // ---------------------------------------------------------------- loop
  function syncLoop() {
    if (state.destroyed) return;
    const shouldRun = !state.hidden && (animating() || performance.now() < state.burstUntil || input.velocity.x || input.velocity.y);
    if (shouldRun && !state.raf) {
      state.last = performance.now();
      q.reset();
      state.raf = requestAnimationFrame(tick);
    } else if (!shouldRun && state.raf) {
      cancelAnimationFrame(state.raf);
      state.raf = 0;
      requestRender();
    }
  }
  function startBurst(sec = 3.4, id = null) {
    state.burstUntil = Math.max(state.burstUntil, performance.now() + sec * 1000);
    if (id) state.burstId = id;
    syncLoop();
  }
  function requestRender() {
    if (state.destroyed || state.raf || pendingSingle) return;
    pendingSingle = requestAnimationFrame(() => { pendingSingle = 0; if (!state.raf) frame(performance.now(), !!state.burstId); });
  }
  function tick(now) {
    state.raf = 0;
    if (state.destroyed) return;
    const burst = now < state.burstUntil || input.dragging;
    frame(now, burst);
    if (!burst && !input.velocity.x && !input.velocity.y) state.burstId = null;
    if (!state.hidden && (animating() || burst || input.velocity.x || input.velocity.y)) state.raf = requestAnimationFrame(tick);
    else requestRender();
  }

  // ---------------------------------------------------------------- per-frame
  const ndcNone = new Vector2(9, 9);
  const prevVP = new Matrix4(), curVP = new Matrix4();
  let hasPrev = false;
  const proj = new Vector3();
  const tint = new Color();
  const dayIdx = ids.indexOf('day');

  // day progress: home.js publishes it as a number (window.__keremetDay) and as the CSS var --day-progress on the day
  // section + sky layer (not on <html>: a root custom-property write restyles the whole document on every frame).
  // Fallback for other hosts (QA harness): the var on <html>.
  function readDay() {
    const g = window.__keremetDay;
    if (typeof g === 'number' && Number.isFinite(g)) return clamp(g);
    const n = parseFloat(html.style.getPropertyValue('--day-progress'));
    return Number.isFinite(n) ? clamp(n) : 0;
  }
  // wipe origin vars go on the background stack (the only consumer) → a write restyles that subtree, not the page
  const wipeHost = document.getElementById('bg-stack') || html;

  function toneAt(f, dayP) {
    const i = Math.floor(f), fr = f - i;
    const a = themeTone(themes[clamp(i, 0, ids.length - 1)], dayP);
    const b = themeTone(themes[clamp(i + 1, 0, ids.length - 1)], dayP);
    return lerp(a, b, smoothstep(0.25, 0.75, fr));
  }

  function frame(now, burst) {
    const dtRaw = state.last ? (now - state.last) / 1000 : 0.016;
    state.last = now;
    const dt = Math.min(0.05, Math.max(0, dtRaw));
    const running = animating();          // full motion: camera glide, idle animation, particles
    if (running) state.time += dt;
    const time = state.time;
    // paused / reduced motion: only the object being played with (trick / drag) advances its own clock
    const objDt = running || burst || input.velocity.x || input.velocity.y ? dt : 0;

    let measured = 0;
    if (state.reduced) {
      // reduced motion: one static frame of the hero station — no flight (events still follow the sections)
      measured = rig.measure();
      rig.target = state.heroIdx;
    } else measured = rig.measure();
    rig.dayProgress = readDay();
    const snap = !running;
    const f = rig.step(dt, snap);
    rig.parallax.tx = isMobile ? 0 : input.parallax.x;
    rig.parallax.ty = isMobile ? 0 : input.parallax.y;
    const { wide, solo } = rig.apply(time, dt, { animate: running });
    // phones / low quality: wide shots skip decorative sub-parts to keep the whole universe within ~80 draw calls
    if ((isMobile || q.low) && wide > 0.6) camera.layers.disable(1); else camera.layers.enable(1);

    // global light / tone
    const dayP = rig.dayProgress;
    const tone = toneAt(f, dayP);
    const wd = dayIdx >= 0 ? clamp(1.3 - Math.abs(f - dayIdx) * 1.3) : 0;
    dayTint(dayP, tint);
    hemi.color.copy(baseHemi).lerp(tint, wd * 0.8);
    key.color.copy(baseKey).lerp(tint, wd * 0.6);
    const starFade = lerp(1, lerp(0.35, 1, smoothstep(0.55, 0.85, dayP)), wd);

    // interaction
    const focused = stations.focused(f);
    if (focused) {
      const inr = input.inertia(objDt);
      if (inr) stations.drag(focused.id, inr.x, inr.y);
    } else { input.velocity.x = input.velocity.y = 0; }
    input.refresh();
    const hoverId = input.hover && focused ? focused.id : null;
    if (input.inside && focused) {
      raycaster.setFromCamera(input.ndc, camera);
      stations.pointer(focused.id, raycaster.ray);
    } else {
      raycaster.setFromCamera(ndcNone, camera);
      stations.pointer(null, null);
    }

    stations.update(objDt, f, {
      wide, solo, animate: running, hoverId, low: q.low, ring: rig.ring, ringTime: time, tone,
      burstId: running ? null : (state.burstId || (focused && focused.id)),
    });

    const dpr = renderer.getPixelRatio();
    const pxScale = dpr * clamp(H / 900, 0.75, 1.25);
    camera.updateMatrixWorld();
    curVP.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    // warp streaks only while the camera really travels between stations (normalised to a 60 fps frame)
    const flight = smoothstep(0.08, 0.2, Math.abs(f - Math.round(f)));
    const warp = running && hasPrev ? 1.6 * flight * clamp(0.0167 / Math.max(dt, 0.004), 0.4, 1.5) : 0;
    particles.update(time, { pxScale, tone, starFade, prevVP: warp > 0 ? prevVP : null, width: W, height: H, dpr, warp });
    prevVP.copy(curVP); hasPrev = true;
    constellation.update(time, {
      wide, solo, tone, pxScale, camera, height: H, pulse: ids[Math.round(f)] === 'finale' ? 1 : 0,
      locate: (id, out) => stations.worldPosition(id, out),
    });

    if (state.reduced && !state.heroVisible) return dispatchStation(clamp(Math.round(measured), 0, ids.length - 1), measured);
    renderer.render(scene, camera);
    if (running) {
      // judge the world only while the page is quiet (no scroll, camera arrived) — page-side work is not ours
      const settled = Math.abs(rig.target - rig.float) < 0.01 && now - state.lastScroll > 300 && !input.dragging;
      q.sample(dtRaw, settled);
    }

    // wipe origin: settled on-screen position of the incoming station's focus (known from the camera keys).
    // Written once per incoming-station change (never per frame) — each write restyles the document.
    const wi = clamp(Math.ceil(f - 0.02), 0, ids.length - 1);
    if (wi !== state.wipeIdx || state.wipeDirty) {
      state.wipeIdx = wi; state.wipeDirty = false;
      const p = rig.screenPos(wi);
      wipeHost.style.setProperty('--wipe-x', p.x + 'px');
      wipeHost.style.setProperty('--wipe-y', p.y + 'px');
    }

    // dominant station event (+ its settled screen position for the wipe)
    if (state.reduced) dispatchStation(clamp(Math.round(measured), 0, ids.length - 1), measured);
    else dispatchStation(clamp(Math.round(f), 0, ids.length - 1), f);
  }

  // ---------------------------------------------------------------- boot
  stations.ensure(ids.includes('hero') ? 'hero' : ids.find((id) => OBJECT_STATIONS.includes(id))).then(() => {
    if (state.destroyed) return;
    requestRender();
    stations.preloadIdle(OBJECT_STATIONS);
  });
  html.classList.add('webgl-on');
  syncLoop();
  requestRender();

  // debugging / QA hook (harmless): window.__keremetWorld
  const api = {
    destroy() {
      if (state.destroyed) return;
      state.destroyed = true;
      if (state.raf) cancelAnimationFrame(state.raf);
      if (pendingSingle) cancelAnimationFrame(pendingSingle);
      state.raf = 0;
      window.removeEventListener('keremet:trick', onTrick);
      window.removeEventListener('keremet:motion', onMotion);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onWinResize);
      document.removeEventListener('visibilitychange', onVis);
      if (rmq) (rmq.removeEventListener ? rmq.removeEventListener('change', onRm) : rmq.removeListener(onRm));
      mo.disconnect();
      if (ro) ro.disconnect();
      if (layoutRO) layoutRO.disconnect();
      window.removeEventListener('keremet:layout', onLayout);
      if (io) io.disconnect();
      canvas.style.opacity = canvasOpacity;
      canvas.style.transition = canvasTransition;
      input.dispose();
      stations.dispose();
      particles.dispose();
      constellation.dispose();
      envRT.dispose();
      disposeSharedTextures();
      scene.clear();
      renderer.renderLists.dispose();
      try {
        const gl = renderer.getContext();
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      } catch (_) { /* context lost */ }
      renderer.dispose();
      html.classList.remove('webgl-on');
      wipeHost.style.removeProperty('--wipe-x');
      wipeHost.style.removeProperty('--wipe-y');
      if (window.__keremetWorld === api) delete window.__keremetWorld;
    },
    pause() { state.externalPause = true; stopBursts(); syncLoop(); },
    resume() { state.externalPause = false; syncLoop(); },
    /** QA: projected screen circle (css px) of the focused object's bounding sphere, or null */
    bounds() {
      const s = stations.focused(rig.float);
      if (!s || !s.inst) return null;
      const c = s.inst.focus.clone().project(camera);
      const dist = camera.position.distanceTo(s.inst.focus);
      const r = (s.inst.radius * s.holder.scale.x) / (dist * Math.tan((camera.fov * Math.PI) / 360)) * (H / 2);
      return { id: s.id, x: (c.x + 1) / 2 * W, y: (1 - c.y) / 2 * H, r };
    },
    /** QA: current state */
    get stats() {
      return {
        float: rig.float, target: rig.target, time: state.time, fps: q.fps, level: q.level, dpr: renderer.getPixelRatio(),
        running: !!state.raf, frame: renderer.info.render.frame, calls: renderer.info.render.calls, triangles: renderer.info.render.triangles,
        geometries: renderer.info.memory.geometries, textures: renderer.info.memory.textures,
      };
    },
  };
  window.__keremetWorld = api;
  return api;
}

export default initWorld;
