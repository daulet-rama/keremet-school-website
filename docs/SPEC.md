# Keremet School website — build spec (single source of truth for all contributors)

Private general school **«Keremet»** (ТОО «Keremet-City»), Shymkent, Kazakhstan. Domain: **keremet.edu.kz**.
Goal: a unique, "wow" trilingual school website (Kazakh / Russian / English) that ALSO fully satisfies the
Kazakhstan requirements for education-organization websites (see `docs/ORDER-114.md`) to score the maximum (5 points),
and is excellent on phones.

---------------------------------------------------------------------------------------------------
## 1. Tech & repo layout (static site, zero runtime dependencies, no framework)

```
package.json          scripts: "build" (node build.mjs), "serve" (node serve.mjs), "dev" (build + serve)
build.mjs             static generator (no npm deps): src/pages/*.mjs × langs → dist/{lang}/{slug}.html; copies public/ → dist/
serve.mjs             tiny static server for dist/ on http://localhost:8080 (correct MIME for .mjs/.js/.css/.svg/.json/.woff2)
src/
  data/school.mjs     ALL school facts (single source of truth; research-backed; unknowns are `null` + TODO)
  i18n.mjs            UI strings {kz,ru,en}; export t(lang,key)
  nav.mjs             site map: groups → pages (drives header mega-menu, footer, sidebar, sitemap)
  ui.mjs              HTML component helpers used by pages (see §6)
  layout.mjs          renderPage(): <head>, header, a11y panel, footer, scripts
  pages/*.mjs         one module per page (contract §5). `index.mjs` = the 3D landing page.
public/               copied verbatim to dist/
  assets/css/base.css         tokens, reset, typography, header, footer, a11y modes, shared components (foundation)
  assets/css/home.css         landing page only
  assets/css/pages/*.css      optional per-group extras (declared by page.styles)
  assets/js/main.js           every page: nav/mega-menu, mobile menu, lang switch, a11y panel, search, reveals, forms
  assets/js/home.js           landing only: Lenis smooth scroll, GSAP ScrollTrigger (theme wipes, horizontal day, text reveals)
  assets/js/world/*.js        landing only: Three.js world (ES modules). Entry: world/world.js
  assets/vendor/              three.module.min.js (r186, ESM, single file), three-addons/**, gsap.min.js, ScrollTrigger.min.js, lenis.min.js, lenis.css
  assets/img/                 logo.svg, favicon.svg, og-image, illustrations
  assets/docs/                document scans / PDFs (licenses, certificates…)
  api/feedback.php            optional mail handler for forms (PHP hosting); JS falls back to mailto:
dist/                 GENERATED — deploy this folder. Never edit by hand.
```

Languages: `kz` (Kazakh, `<html lang="kk">`), `ru` (`lang="ru"`), `en` (`lang="en"`). URLs: `/kz/…`, `/ru/…`, `/en/…`.
`dist/index.html` = language router: uses saved choice (localStorage `keremet-lang`) else **Kazakh** (legal default, see §7);
has visible links to all 3 versions for no-JS (meta refresh to `kz/index.html` as fallback). Every page has `<link rel="alternate" hreflang>`.
Kazakh and Russian must be COMPLETE (legal requirement). English: complete for all pages too (may be slightly condensed on long legal pages).

Asset URLs from a page in `dist/{lang}/x.html` are `../assets/...`. Page links are relative `x.html`; other language `../ru/x.html`.

Import map (landing page only, emitted by layout when `page.home === true`):
```html
<script type="importmap">{"imports":{"three":"../assets/vendor/three.module.min.js","three/addons/":"../assets/vendor/three-addons/"}}</script>
```
More three addons can be copied from
`C:\Users\daulet\AppData\Local\Temp\claude\c--Users-daulet-Desktop-keremet-school-website\764f9a22-6334-4b28-ba09-dd67071739fb\scratchpad\libs\node_modules\three\examples\jsm\`
into `public/assets/vendor/three-addons/` (keep the same sub-folder). GSAP/ScrollTrigger/Lenis are classic scripts (globals `gsap`, `ScrollTrigger`, `Lenis`), loaded with `defer` only on the landing page.

Browser test tooling: `playwright-core` is installed at `…\scratchpad\libs\node_modules\playwright-core` (same scratchpad as above);
launch with `chromium.launch({ channel: 'chrome' })` (Chrome is installed). Put test scripts/screenshots in the scratchpad, not in the repo.

### Parallel-work rules (several agents work at once)
- `node build.mjs --out <dir> [--only slug1,slug2] [--langs kz,ru]` — build into a PRIVATE directory (your scratchpad), optionally only some pages.
  `node serve.mjs --dir <dir> --port <port>` — serve it. Never build into the shared `dist/` while others work; only the integrator does `npm run build`.
- File ownership: edit ONLY the files your task assigns. Shared files (`build.mjs`, `layout.mjs`, `ui.mjs`, `nav.mjs`, `i18n.mjs`, `base.css`, `main.js`,
  `school.mjs`) belong to the foundation; if you need something there, implement it locally (own module / own `assets/css/pages/<group>.css`)
  and mention it in your final report.
- Data: `src/data/school.mjs` (facts), `src/data/news.mjs` (news items), `src/data/documents.mjs` (document registry: id, title{kz,ru,en}, file|null, type, size, date, number, group).

---------------------------------------------------------------------------------------------------
## 2. Brand & design system

Name: **Keremet** (каз. «керемет» = wonderful/amazing). Brand idea: **"Білім әлемі — керемет саяхат" / "Учёба — удивительное путешествие" / "Learning is a wonderful journey"** — the site is a journey through the universe of knowledge.
Brand symbol: **Шаңырақ (shanyrak)** — the crown of the Kazakh yurt (home, unity, sky). Logo = stylised shanyrak (circle + 2×3 crossed arcs "күлдіреуіш") in sun-gold + wordmark "KEREMET" (Montserrat 800, tracking +0.08em; the outlined wordmark in logo.svg keeps its original drawing) + small line "мектебі · школа · school". Also a Kazakh ornament motif "қошқар мүйіз" (ram-horn) used sparingly as dividers / page-hero decoration (inline SVG).

### Fonts (Google Fonts; Kazakh letters Ә Ғ Қ Ң Ө Ұ Ү Һ І verified in each woff2 cmap, 2026-09)
- Display: **Montserrat** 500/600/700/800 — headings, big numbers (replaced Unbounded, which has no Ә Ғ Қ Ң Ө Ұ Ү Һ)
- Body/UI: **Onest** 400/500/600/700
- Serif accent: **Lora** 400/600 + italic — languages/literature, quotes
- Mono: **IBM Plex Mono** 400/600 — informatics, data, document meta (replaced JetBrains Mono, which has no Ә Ғ Қ Ң Ұ Һ)
- Hand: **Caveat** 500/700 — math/handwritten notes
One `<link>` with `display=swap` + `preconnect`. A11y mode switches everything to a plain sans (Arial/Verdana stack).

### Core tokens (`:root` in base.css)
```
--ink:#0B0F2B  --ink-2:#151B45  --paper:#F7F3EA  --white:#FFFFFF
--sun:#FFB627  --sky:#00B4D8  --coral:#FF5A5F  --mint:#21D19F  --violet:#6C5CE7
--text:#0B0F2B --muted:#5A6185 --line:rgba(11,15,43,.12)
--r-s:10px --r-m:18px --r-l:28px --r-xl:40px
--container:1240px  --gutter:clamp(16px,4vw,40px)
--fs-display:clamp(2.6rem,7vw,6.2rem) --fs-h1:clamp(2.1rem,5vw,4.2rem) --fs-h2:clamp(1.6rem,3.2vw,2.8rem) --fs-h3:clamp(1.2rem,2vw,1.6rem) --fs-body:clamp(1rem,.95rem+.25vw,1.125rem)
--ease-out:cubic-bezier(.16,1,.3,1)
```

### Subject themes — every block has its own world (used by landing bg-stack AND inner-page heroes)
Each theme = `[data-theme="<id>"]` sets `--t-bg --t-ink --t-accent --t-accent-2 --t-tone(light|dark)` + a CSS/SVG pattern.

| id | bg | ink | accent | accent-2 | tone | pattern / mood | 3D object (landing) |
|---|---|---|---|---|---|---|---|
| `hero` | #070A1F | #EEF1FF | #FFB627 | #00B4D8 | dark | night sky, stars, faint ornament | golden **Shanyrak** |
| `math` | #F5F1E6 | #1B2A6B | #3D5AFE | #FF5A5F | light | graph paper (24px minor/120px major grid in blue), handwritten formulas (Caveat) | wireframe Platonic solids + torus knot |
| `physics` | #0A2A5E | #E8F1FF | #5CD2FF | #FFB627 | dark | blueprint grid + circuit traces | **Atom** (nucleus + 3 electron orbits) |
| `chemistry` | #07231F | #E6FFF7 | #21D19F | #FF6FB5 | dark | hexagon lattice (benzene) | ball-and-stick **molecule** |
| `biology` | #0E3B26 | #F0FFE9 | #B6F36A | #FFD166 | dark | organic cells / leaf veins | **DNA double helix** |
| `geography` | #F2E6CC | #3B2A14 | #0A7BBF | #D1495B | light | topographic contour lines | dotted **globe**, Kazakhstan highlighted, pin on Shymkent (42.32°N, 69.59°E) |
| `languages` | #FBF6EC | #2A1A1F | #B0263E | #1D3557 | light | ruled notebook + red margin line, serif | floating letters Ә Ғ Қ Ң Ө Ұ Ү Һ І А Z Я + open book |
| `informatics` | #04060A | #D7FFE9 | #39FF88 | #00E5FF | dark | scanlines + dot matrix, terminal | voxel cube that assembles/explodes |
| `arts` | #1A0B2E | #FFF3F8 | #FF5A5F | #FFB627 | dark | paint blobs (violet/coral/sun), music staff | morphing noise **blob** + notes/ball |
| `day` | dawn→noon→dusk→night (animated) | — | #FFB627 | — | mixed | sky gradient + sun/moon arc | (camera drifts; stars fade in) |
| `paper` | #F7F3EA | #0B0F2B | #6C5CE7 | #FFB627 | light | subtle ornament — default inner pages | — |

Inner-page groups map to themes (so every section of the site has its own colour world): see `src/nav.mjs` (`group.theme`).

### Motion principles
- Easing `--ease-out`; reveals 600–900ms; stagger 60–90ms. Nothing blocks reading.
- `prefers-reduced-motion: reduce` OR a11y mode ⇒ no Lenis, no pinning/scrubbing, no camera flight (static poster or no 3D), no parallax; horizontal section becomes a native swipe row with scroll-snap.
- Performance budget: landing LCP text visible without waiting for JS/3D; 3D initialises after first paint (`requestIdleCallback`/`setTimeout`), pauses when tab hidden; DPR cap 1.75 desktop / 1.25 mobile; mobile: fewer particles, no bloom.

---------------------------------------------------------------------------------------------------
## 3. Landing page (`src/pages/index.mjs`, `home.css`, `home.js`, `world/*`) — THE WOW PAGE

### Layer stack (z-index)
```
z 0   #bg-stack  (position:fixed; inset:0)  one <div class="bg" data-theme="…"> per theme, in section order.
                  The active theme is revealed with a **circular clip-path "portal" wipe** that grows from the
                  3D object's screen position (CSS vars --wipe-x/--wipe-y/--wipe-r set by home.js; ScrollTrigger scrub).
z 1   #world     (position:fixed; inset:0; pointer-events:auto only on the canvas area NOT covered by text) <canvas>, alpha:true
z 2   <main>     sections with TRANSPARENT backgrounds; text lives in cards/panels ("blocks") styled per theme
z 50  header     colour follows current tone: body[data-tone="light|dark"] (set by home.js)
```

### Section contract (DOM order = journey order)
Every landing section: `<section class="st st--<kind>" id="<id>" data-station="<station>" data-theme="<theme>">`.
Stations (ids fixed — world.js relies on them): `hero, about, math, physics, chemistry, biology, geography, languages, informatics, arts, day, levels, admission, news, contacts, finale`.
- Stations with their own 3D object: hero, math, physics, chemistry, biology, geography, languages, informatics, arts.
- `about` → camera passes through the shanyrak ring (hero→math transition).
- `day` → horizontal pinned section; camera slowly orbits; world reads CSS var `--day-progress` (0..1) on `<html>` to tint lights/sky.
- `levels, admission, news` → camera floats back revealing the "constellation" of all stations (theme `paper` or `hero`).
- `contacts, finale` → wide shot of the whole Keremet universe with the shanyrak glowing; finale has giant wordmark + CTA.
Subject sections layout: 2 columns on desktop — text block (≈45%) on one side, the side where the 3D object is gets empty
space (`.st__stage`). Alternate sides per subject. Mobile: object occupies top ~45vh (`.st__stage`), text card below with
themed, slightly translucent background (backdrop-filter blur) so text stays legible over the canvas.
Each subject block contains: subject name (kz/ru/en), 1–2 sentence pitch, 3–4 bullet "what we do" chips, a themed
decorative detail (math: handwritten formula; physics: E=mc² blueprint label; chemistry: a mini periodic tile "C 6";
biology: Latin name label; geography: coordinates of Shymkent; languages: Kazakh proverb in Lora italic;
informatics: typed code line with blinking caret; arts: brush-stroke underline), and a small hint "↻ drag / tap the object".

### Horizontal scroll — "Бір күн Keremet-те / Один день в Keremet / A day at Keremet"
Pinned section, vertical scroll drives horizontal track (GSAP ScrollTrigger `pin` + `scrub`, `x: -(track - viewport)`).
Cards = time slots 08:00 … 18:00 (arrival & morning circle, lessons, break/sport, lunch, clubs, homework hour, pick-up).
Behind: sky gradient that changes dawn→noon→sunset→night with a sun/moon moving along an arc; progress bar with times.
Works on mobile too (pinned + scrub). Reduced motion / a11y: native horizontal swipe row with scroll-snap and visible scrollbar.
Content must not invent facts: use generic, clearly typical activities; exact schedule values come from `school.mjs` when known.

### Other landing effects
- `about`: big manifesto sentence; words light up one-by-one on scroll (scrub), + stat bento (founded, grades, languages, licence "бессрочная").
- Infinite marquee of subject names in 3 languages between sections.
- Magnetic buttons, custom cursor dot on desktop only (hidden on touch/a11y).
- Counters animate when visible.
- `news`: 3 latest items from `school.news` (if empty → "Жаңалықтар жақында / Новости скоро" block linking to news page).
- `contacts`: address, phones, email, hours, map (OpenStreetMap iframe, lazy) + buttons 2GIS / WhatsApp (only if known).
- Quick links bento "Ата-аналарға / Родителям": admission, documents, schedule, meals, safety, feedback — linking to inner pages.

### world.js contract
`import { initWorld } from './world/world.js'` is done by home.js ONLY if WebGL2/WebGL is available, not a11y mode and not reduced motion
(reduced motion ⇒ still render a static single frame of the hero station, no flight).
```
initWorld({ canvas, sections: NodeList<section[data-station]>, isMobile:boolean, quality:'high'|'low' }) → { destroy(), setStationFloat?(n) }
```
- world computes a continuous station index each frame from the sections' bounding rects (section whose centre is nearest the
  viewport centre + interpolation), damped (lerp) so the camera glides; camera follows a CatmullRom path through station anchors.
- It writes `--wipe-x`, `--wipe-y` (px, projected screen position of the current station's object) on `<html>` so the bg-stack
  wipe grows from the object.
- Interactivity: mouse parallax; raycast hover → glow/scale + `cursor:grab`; pointer-drag rotates the focused object with inertia;
  click/tap → object-specific "trick" (atom electrons burst, DNA unzips & re-zips, globe spins to Shymkent, solids morph, voxels
  explode & reassemble, blob splashes, letters scatter, shanyrak lights up). Touch: drag rotates, tap = trick. Never block page scroll
  (only capture horizontal-ish drags on touch; use `touch-action: pan-y` on canvas).
- Adds `html.webgl-on` when running; if init fails → `html.no-webgl` and CSS shows static SVG fallbacks in `.st__stage`.

### Screen placement of each station's 3D object (world uses `camera.setViewOffset`, landing CSS puts text on the other side)
| station | desktop (≥ 900px) object side | text card side |
|---|---|---|
| hero | right (≈ 68% x) | left |
| about | centre (camera passes through shanyrak) | centre, narrow |
| math | right | left |
| physics | left | right |
| chemistry | right | left |
| biology | left | right |
| geography | right | left |
| languages | left | right |
| informatics | right | left |
| arts | left | right |
| day / levels / admission / news / contacts / finale | centre, far/wide (object small, backdrop) | full width |
Mobile (< 900px): object at top-centre (≈ 30% of viewport height), text card below (`.st__stage` height ≈ 46svh on subject sections).

### Events & pointer contract between landing page and world
- Landing sections are `pointer-events:none`; interactive children (`.st__card, a, button, input, [data-interactive]`) are `pointer-events:auto`.
  So the empty `.st__stage` area lets pointer events reach the fixed canvas (hover/drag/click the 3D object). Canvas: `touch-action: pan-y`.
- Each subject card has an accessible button `<button class="st__trick" data-trick="<station>">` ("Тәжірибе жаса / Попробуй / Try it").
  home.js dispatches `window.dispatchEvent(new CustomEvent('keremet:trick', {detail:{station}}))`; world performs that station's trick.
- home.js sets `--day-progress` (0..1) on `<html>` during the horizontal "day" section; world reads it (sky/light tint, star fade).
- main.js dispatches `keremet:motion` `{detail:{paused:boolean}}`; `html[data-motion="paused"]` also readable. When paused or
  `prefers-reduced-motion`: no continuous rAF loop — render a single frame when scroll position changes (camera snapped, no idle
  animation). `initWorld` returns `{ destroy(), pause(), resume() }`.
- world dispatches `keremet:station` `{detail:{id, index, float}}` when the dominant station changes (home.js may use it for header tone / wipe).
- No postprocessing bloom (transparent canvas over CSS backgrounds breaks bloom alpha) — use fresnel/rim shaders, additive halo sprites, emissive.

---------------------------------------------------------------------------------------------------
## 4. Accessibility — "Версия для слабовидящих / Көру қабілеті нашар адамдарға арналған нұсқа"
Button in header on EVERY page (eye icon + text). Opens a sticky panel: font size (100/130/160%), colour scheme
(black-on-white, white-on-black, dark-blue-on-light-blue, brown-on-beige), images on/off, letter spacing (normal/wide),
line height, "reset", "exit". Persist in localStorage `keremet-a11y`. Implementation: attributes on `<html>`:
`data-a11y="on" data-a11y-font="1|2|3" data-a11y-scheme="wb|bw|blue|beige" data-a11y-img="off" data-a11y-space="1|2"`.
A11y mode: disables 3D/animations/custom cursor, uses plain sans font, underlines links, strong focus rings.
Always: semantic landmarks, skip-link, alt texts, visible focus, colour contrast ≥ 4.5:1 for body text, keyboard-operable menus.

---------------------------------------------------------------------------------------------------
## 5. Page module contract (`src/pages/<slug>.mjs`)
```js
export default {
  slug: 'about',                 // → dist/{lang}/about.html ; 'index' for landing
  group: 'about',                // id of a group in src/nav.mjs
  order: 10,                     // order inside group (menu/sidebar)
  title: { kz: '…', ru: '…', en: '…' },
  description: { kz: '…', ru: '…', en: '…' },   // meta description, ≤160 chars
  theme: 'paper',                // optional override of group theme for the page hero
  styles: [],                    // optional extra css under assets/css/pages/
  home: false,                   // true only for index
  updated: '2026-09-24',         // shown as "Last updated"
  render(lang, ctx) { return `…inner HTML of <main> content (no <main> tag)…` }
}
```
`ctx` = `{ lang, t, L, S, href, asset, ui, nav, page, pages }`:
- `t(key)` UI string, `L(obj)` picks `obj[lang]` (fallback ru→kz→en; also accepts plain strings), `S` = school data,
- `href(slug, lang?)` relative page URL, `asset(path)` → `../assets/<path>`, `ui` = components (§6).
Pages must NEVER invent facts (names, numbers, results, prices, dates). Unknown data → `ctx.ui.pending(...)` block
(visible, styled "Ақпарат толықтырылуда / Информация обновляется / Information is being updated") and a TODO in `school.mjs`.

## 6. `src/ui.mjs` components (all return HTML strings; all text passed already localised)
`pageHero({title, lead, crumbs})` (layout renders it automatically from page meta — pages normally don't call it),
`section({title, id, body, tone})`, `cards(items:[{title, text, icon?, href?, tag?}])`, `docList(items:[{title, file, type:'pdf'|'jpg'|'doc'|'link', date?, size?, note?}])`,
`table({head:[], rows:[[]], caption})` (responsive: stacks on mobile), `accordion(items:[{q, a}])`, `timeline(items:[{time|date, title, text}])`,
`people(items:[{name, role, photo?, text?, contacts?}])`, `facts(items:[{k, v}])` (definition list), `steps(items)`, `callout({type:'info'|'warn'|'ok', title, text})`,
`pending(lang, note?)` (slim one line), `pendingGroup(lang, items)`, `more`, `legal`, `tldr`, `tabs` (§6.1), `button({href, label, kind:'primary'|'ghost'})`, `form({kind:'feedback'|'blog'|'admission', lang})`, `icon(name)` (inline SVG set).
Escape user data with `esc()`.

---------------------------------------------------------------------------------------------------
### 6.1 Progressive disclosure: compact pages that still hold everything (2026-09 redesign)
The owner asked for less officialese on screen. **Nothing is deleted.** Every Order-114 item, document slot, legal reference
and pending placeholder stays in the HTML, where the search index, Ctrl+F, print and the commission still find it. Only the
presentation changes: **layer 1** is a short human summary that stays visible (2–3 lines, icons, cards, key numbers), and
**layer 2** holds the details, collapsed in native `<details>`.
- `tldr({points:[{icon,text}]})` is the "Қысқаша / Коротко / In short" strip for page tops.
- `more({summary?, body, label?, tone?, icon?, count?})` holds long explanations: a 1–2 sentence summary plus "Толығырақ / Подробнее / More ▾".
- `legal(items|html, {title?, note?})` holds legal bases, "согласно приказу №…", norm quotes and adilet links. It renders as the compact
  "⚖ Құқықтық негіз / Правовая основа / Legal basis N ▾" chip, usually at the end of the section or page.
- `docList(items, {collapse: 3, groupPending: true})` shows the first 3 documents. The rest go under "Барлығын көрсету (N) / Показать все (N)",
  and missing files become one "N документов будут загружены ▾" line.
- `pendingGroup(lang, items)` gives ONE line per section, "5 материал дайындалуда / 5 материалов готовятся / 5 items in preparation ▾".
  `pending()` itself is now a slim single line.
- `tabs([{label, body}])` renders accessible tabs. Without JS every panel shows. Hidden panels stay findable (`hidden="until-found"`).
- Wrap several closed chips in `<div class="dz-row">` to set them side by side.
- `main.js` shows "Барлығын ашу / Развернуть всё / Expand all" at the top of the page body when a page has ≥ 3 closed
  disclosures. It opens everything before printing and opens the ancestors of a `#hash` target. Low-vision mode shows the toggles large, underlined and without animation.
- Target on heavy pages: the visible text (`main` rendered text on load) drops by ≥ 50%, while the total text (`main.textContent`) stays ≥ 95%.
  `src/pages/license.mjs` is the reference implementation.
## 7. Order 114-НҚ constraints that override "wow" (read `docs/ORDER-114.md` — the full checklist)
- **Default language is Kazakh**: `dist/index.html` → `/kz/` unless the visitor previously chose another language
  (localStorage `keremet-lang`). Language switch keeps the same page.
- **No splash/preloader** before content. Landing text is visible immediately; 3D loads lazily after first paint.
- **"Pause animation" button** (`⏸ Анимацияны тоқтату / Остановить анимацию / Pause animation`) always visible on the landing
  page (fixed, bottom-left), toggles `html[data-motion="paused"]` (persisted in localStorage `keremet-motion`): stops 3D render loop,
  Lenis, marquees, auto-animations, and replaces the camera flight with static frames. Also exists (hidden when nothing animates) on inner pages.
- **Text over 3D/patterns sits on a dense backdrop** (card opacity ≥ .92 or solid) — contrast ≥ 4.5:1.
- **Header on every page**: top utility bar (full name «Керемет» зияткерлік мектебі · ТОО «Keremet-City» · private general
  school, licensor: Департамент по обеспечению качества в сфере образования г. Шымкент; phone; search; ҚАЗ/РУС/ENG; a11y button)
  + main bar (logo, mega-menu, CTA "Қабылдау / Приём"). Do NOT place the State Emblem in the logo/header (private organisation) —
  state symbols live on `symbols.html` and a home banner.
- **Breadcrumbs** on every inner page; every page ≤ 3 clicks from home (mega-menu covers all pages).
- **Published / updated date+time** visible at the bottom of every page's content (`page.published`, `page.updated`, format `24.09.2026 10:00`).
- **External links**: `target="_blank" rel="noopener"` + visually-hidden text "(жаңа бетте ашылады / откроется в новой вкладке / opens in a new tab)" + ↗ icon. main.js enforces this for any `a[href^="http"]` not on keremet.edu.kz.
- **Search**: header search field (maxlength ≥ 200) → `search.html?q=…&g=<group>&sort=date|relevance` results page, query kept in the field,
  "advanced search" (filter by section, sort). Build emits `assets/search/{lang}.json` (url, title, group, text, updated).
- **Site map** page `sitemap.html` + `sitemap.xml` + `robots.txt`; **RSS** `/{lang}/rss.xml` from news.
- **Footer on every page**: duplicate menu, site map, links to Министерство просвещения РК (https://www.gov.kz/memleket/entities/edu),
  Департамент по обеспечению качества в сфере образования г. Шымкент (gov.kz entity page), Управление образования г. Шымкент
  (https://www.gov.kz/memleket/entities/shymkent-bilim), egov.kz, a11y version, privacy policy, contacts, feedback form, requisites (БИН, licence).
- Documents are listed with **format + size** ("JPG, 180 КБ") and date/number; missing ones use `ui.docList` items with `file:null`
  → rendered as "Құжат жүктеледі / Документ будет загружен" (pending style).
- **Forms** (feedback / director blog / admission request): labelled fields with hints, text error messages, required consent checkbox
  for personal data (link to privacy.html), no captcha (honeypot field instead). POST to `../api/feedback.php`; on failure
  offer WhatsApp (+7 771 242 45 38) / mailto fallback.
- Keyboard: mega-menu, a11y panel, horizontal "day" section (Tab/arrow keys), 3D hint controls — all operable; `:focus-visible` rings.
- Zoom 200% without page-level horizontal scroll.

## 8. Site map (`src/nav.mjs`) — slugs are FIXED; every slug below must have a page module
Top menu item → groups (columns) → pages. Group theme in brackets.
1. **Мектеп / О школе / School**
   - `about` [hero]: `about` (general info, history, mission, advantages, international cooperation), `leadership` (director, deputies, reception hours),
     `structure` (management structure/organigram, pedagogical council, methodical council, ethics council), `license` (licence + appendices + registration certificate scans, elicense.kz link),
     `development-plan`, `board` (попечительский совет), `symbols` (state flag, emblem, anthem text)
   - `staff` [languages]: `teachers` (staff table + analytics), `vacancies`
2. **Өзін-өзі бағалау / Самооценка / Self-assessment**
   - `self` [math]: `self-assessment` (overview, period, evaluation sheet of 39 criteria), `self-1` … `self-8` (the 8 directions of п.16:
     1 общая характеристика, 2 кадры, 3 контингент, 4 учебно-методическая работа, 5 воспитательная работа, 6 МТБ, 7 учебно-методические и цифровые ресурсы, 8 компьютерное тестирование 4/9 классов)
3. **Білім беру / Обучение / Education**
   - `education` [physics]: `curriculum` (РУП, ТУП, programs, Keremet methods: Singapore maths, olympiad maths, НИШ/РФМШ methods, in-depth languages, ОБЖ/ПДД),
     `schedule` (bell schedule, timetable, academic calendar & holidays, weekly load), `assessment` (criteria-based assessment №125, results, КТ 4 class, olympiads),
     `methodical` (methodical work, internal quality control), `inclusive`, `distance`
   - `upbringing` [arts]: `upbringing` («Адал азамат» plan, values), `clubs` (free clubs: robotics & AI, programming, public speaking, financial literacy, sports…),
     `psychology` (psychological service, anti-bullying, helplines 111 / 150), `parents` (work with parents, meetings)
4. **Қабылдау / Приём / Admission**
   - `admission` [geography]: `admission` (rules per №564, documents, deadlines, egov.kz service links, places of service), `contingent`, `forms` (application templates), `tuition` (contract per №93, tuition info)
5. **Мектеп өмірі / Жизнь школы / School life**
   - `campus` [biology]: `facilities` (building, classrooms, accessibility environment), `meals` (school meals: menu, commission, supplier), `safety` (security, anti-terror, fire), `health` (medical service), `library` (library + digital resources, e-journal, НОБД)
   - `news` [informatics]: `news` (list + archive + RSS), `news-<id>` (one page per item from `src/data/news.mjs`), `events` (calendar of events), `projects`
6. **Құжаттар / Документы / Documents**
   - `documents` [paper]: `documents` (internal documents + archive), `legislation` (normative acts with adilet links), `finance` (financial & charity reports), `anticorruption`, `privacy`
7. **Байланыс / Контакты / Contacts**
   - `feedback` [chemistry]: `contacts`, `feedback` (appeal form + procedure + responsible person), `director-blog`, `faq`, `surveys`
Utility (footer / header only, group `util` [paper]): `search`, `sitemap`, `accessibility` (how to use the a11y version), and `404` (root `dist/404.html`).
A module may export an ARRAY of page objects (used for `self-1..8` and `news-<id>`).

## 9. Key facts (details & sources: `docs/SCHOOL-FACTS.md`; legal: `docs/ORDER-114.md`)
- Names: KZ «Керемет» зияткерлік мектебі; RU Интеллектуальная школа «Керемет»; EN Keremet Intellectual School. Wordmark KEREMET. Legal: ТОО «Keremet-City», БИН 210440038887, registered 28.04.2021.
- Actual address (where the school operates): 160000, г. Шымкент, Абайский район, мкр. Асар, 911/2 (2GIS; coords 42.408409, 69.613352; stop «проспект К. Жалаири», 250 m; a stop is named «школа Керемет»).
  Legal address: мкр. Асар, ул. Сейхун, здание 125. Licence object address (2022): Каратауский р-н, мкр. Нурсат, 173, н.п. 3. (Relationship unconfirmed → show legal + actual.)
- Phone / WhatsApp: +7 (771) 242-45-38 (verified). Second WhatsApp +7 (777) 315-29-39 (probable — show as "WhatsApp (қабылдау)" only on admission/contacts). E-mail: unknown → use `info@keremet.edu.kz` marked TODO.
- Instagram: https://www.instagram.com/keremet_mektep_asar/ ; 2GIS: https://2gis.kz/shymkent/firm/70000001065233723 (rating 4.8, 241 ratings).
- Hours: Mon–Fri 09:00–18:00 (probable, TODO confirm). Director: Караманова Диана Муратхановна. Founder: Бибазаров Муратхан.
- Grades: 0–6 (school's Instagram bio; TODO confirm). Languages of instruction: Kazakh, Russian. Licence (05.05.2025, № KZ29LAM00002781, бессрочная, first issued 07.11.2022) covers primary, basic secondary, general secondary, TVET, post-secondary, spiritual education, health-improving services for minors. Previous licence № KZ18LAA00032760 (07.11.2022, primary education, appendix 001, order №299).
- Advertised features: professional teachers, FREE clubs, extended day, hot meals (3 meals a day per review — don't claim), free tuition in Kazakh & Russian (admission post 12.08.2025 — TODO confirm wording), НИШ/РФМШ teaching methods, Singapore maths, in-depth & olympiad maths, in-depth language study, public speaking, financial literacy, sports clubs, programming, robotics & AI.
- Building: 2 storeys, ramp & accessible entrance, parking 7 places.
- Brand colours seen: gold logo on dark navy/teal (matches our `hero` theme); building white with orange stripes and blue roof.
- The domain keremet.edu.kz registration (EDU.KZ, 18.08.2022) was valid until 18.08.2023 and currently does not resolve — site must note nothing about this; it's for the owner.

---------------------------------------------------------------------------------------------------
## 10. Quality bar / definition of done
- `npm run build` succeeds; every page exists in kz/ru/en; no missing translation (build warns if a title/description lang is missing).
- No console errors on any page (desktop Chrome + mobile emulation 390×844). No horizontal overflow at 360px width.
- Lighthouse-ish sanity: every page has title, meta description, h1, lang, landmarks, alt texts; links valid (no 404 inside site).
- Landing: 60fps-ish on desktop, smooth on mid phones; still beautiful with 3D disabled.
- All requirements from `docs/ORDER-114.md` are present and discoverable from the main menu within 1–2 clicks.
