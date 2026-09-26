# Keremet School website — keremet.edu.kz

The official site of **«Керемет» зияткерлік мектебі / Интеллектуальная школа «Керемет» / Keremet Intellectual School** (ТОО «Keremet-City», Shymkent).
It is a static site in Kazakh, Russian and English. It needs no runtime dependencies and no framework, only Node ≥ 20 to build.
It follows the requirements of Order 114-НҚ: see `docs/SPEC.md` and `docs/ORDER-114.md`.

## Commands

```bash
npm run build          # node build.mjs  → dist/
npm run serve          # node serve.mjs  → http://localhost:8080 (serves dist/)
npm run dev            # build + serve

node build.mjs --out <dir> [--only about,license] [--langs kz,ru] [--quiet] [--force]
node serve.mjs --dir <dir> --port 8101      # a busy port gives a clear message — pick another --port
```

- **Build output.** One build takes about 0.2 s and produces:
  - `dist/{kz,ru,en}/<slug>.html`
  - the `public/` folder, copied as it is
  - the root `index.html`, a language router. It opens the language saved in `localStorage` `keremet-lang`, otherwise **Kazakh**.
  - `404.html`, `sitemap.xml` and `robots.txt`
  - `assets/search/{lang}.json`, the search index
  - `{lang}/rss.xml`
- **Build messages.**
  - The build warns about missing `title` or `description` translations, descriptions over 160 characters, nav slugs that have no page module, and pages that are not in the nav.
  - A render error names the page and the language.
- **Team rule.** When several people work at once, each one builds into a private `--out` directory. Only the integrator builds `dist/`.
- **`--out` safety.** The build wipes `--out` first, so it only builds into an empty folder or one an earlier build made (it holds the marker file `.keremet-build`, or only build output). It refuses the project, its parents, a drive root, the home folder and any folder containing `node_modules`, `libs`, `package.json`, `.git` or `src` (for example the shared scratchpad). `--force` overrides only the "unexpected files" check.
- **Cache busting.** The build hashes every file in `public/assets/css` and `public/assets/js` and the layout appends `?v=<hash>` to `base.css`, `main.js`, `home.css`, `home.js` and `pages/*.css`. `.htaccess` caches those versioned URLs for a year and makes everything else revalidate, so a redeploy is picked up at once.

## Deploy

1. Run `npm run build`.
2. Upload **the contents of `dist/`** to the web root of `keremet.edu.kz`. Order 114-НҚ requires hosting in Kazakhstan and HTTPS.
3. On Apache, `dist/.htaccess` redirects to HTTPS, sets `ErrorDocument 404 /404.html`, sets the charset and the caching rules (versioned CSS/JS: 1 year; HTML and unversioned CSS/JS: `no-cache`; images: 1 week) and hides `.keremet-build`.
4. The forms post to `api/feedback.php`, which needs PHP with `mail()`.
   - Set the mailbox in `$CONFIG['to']` at the top of that file.
   - If sending fails, the form offers WhatsApp first (the text is pre-filled). It offers e-mail only once `school.contacts.emailConfirmed` is true; until then it offers a phone call instead.
   - `serve.mjs` answers `POST /api/feedback.php` with a mock `{ok:true}` in development.

## Project layout

```
build.mjs  serve.mjs  package.json
src/
  data/school.mjs      ALL facts (single source of truth). Unknown → null + // TODO(school)
  data/news.mjs        news items → news.html, news-<id>.html, RSS
  data/documents.mjs   document registry (file:null = pending "Құжат жүктеледі")
  i18n.mjs             UI strings kz/ru/en + t(), L(), fmtDate(), fmtDateTime(), fmtDateLong(), fmtSize()
  nav.mjs              site map: TOP (7 menu items) → GROUPS (theme, pages) → PAGE_LABELS
  ui.mjs               HTML components (documented at the top of the file)
  layout.mjs           full document: head, a11y panel, header, mega-menu, mobile menu, hero, footer
  pages/*.mjs          one module per page (default export = page object or array)
public/
  assets/css/base.css  tokens, 11 themes + .pattern, all components, a11y modes, print
  assets/js/main.js    menus, a11y panel, motion pause, search, forms, reveals, copy, tables
  assets/img/          logo.svg, logo-mono.svg (currentColor), logo-ink.svg, favicon.svg, og-image.png,
                       apple-touch-icon.png, shanyrak.svg, patterns/*.svg, news/*.svg, symbols/*.svg
  assets/docs/         document scans (licences, registration certificate)
  api/feedback.php     mail handler (honeypot, validation, rate limit)
```

## Adding a page

Create `src/pages/<slug>.mjs`. The slug must match `src/nav.mjs`.

```js
export default {
  slug: 'meals', group: 'campus', order: 20,
  title: { kz: 'Мектептегі тамақтану', ru: 'Школьное питание', en: 'School meals' },
  description: { kz: '…', ru: '…', en: '…' },          // ≤160 chars, all 3 languages
  published: '2026-09-24T10:00', updated: '2026-09-24T10:00',
  // optional: theme:'biology', styles:['campus'], lead:{…}, crumb:{…}, hidden:true, noSearch:true, motion:true
  render(lang, { ui, S, L, t, href, asset, fmt, news, docs, docsByGroup, docById, latestDocuments, nav, pages }) {
    return [
      ui.section({ title: { kz: '…', ru: '…', en: '…' }, body: ui.pending(lang) }),
      ui.section({ title: '…', body: ui.docList(docsByGroup('meals')) }),
    ].join('');
  },
};
```

- **What the layout adds.** The layout adds the themed page hero with breadcrumbs, the pills for the other pages in the section, and the "published / updated" line. The page returns only the content.
- **Text arguments.** Every text argument of `ui.*` accepts a string or `{kz,ru,en}`. Strings are inserted as HTML, so wrap user data in `ui.esc()`.
- **Pages that need their own CSS.** Put the file in `public/assets/css/pages/<name>.css` and declare it with `styles: ['<name>']`.
- **Several pages in one module.** A module may export an array of pages. For example, `self-1…8`, or `news.map(n => ({ slug: 'news-' + n.id, group: 'news', hidden: true, … }))`.
- **Never invent facts.** If a fact is unknown, use `ui.pending(lang, note?)` and add a `// TODO(school)` in `school.mjs`.
- **Dates need a time.** Write `published`/`updated` as `'YYYY-MM-DDTHH:MM'`. A date without a time is shown as the date only, and the build warns.
- **Language completeness.** The build warns (`<slug> [kz]: … fell back to another language`) whenever `L()`/`t()` had to use another language. Fix every such warning for kz and ru.
- **Spacing.** Components stacked inside `section({body})`, `split` columns, `grid` items or any `.flow` wrapper get a consistent vertical gap automatically. Do not add margins to fight it.
- **Accordion.** Use `ui.accordion()`. The class `.acc` belongs to the accordion (the hero accents are `.phero-acc`), so do not restyle or work around it in page CSS.
- **Cards.** Cards with only a title (no text, meta or tag) are rendered as compact rows. Fixed-column grids (`cols: 2|3|4`) stretch the last row so no card is left alone.
- **Landing page meta.** The layout appends the published/updated line at the end of `<main>` on the landing too. To place it elsewhere (e.g. inside the finale), put the marker `<!--page-meta-->` there. `ui.pageMeta(page)` is also available.
- **Parallel builds.** With `--only`, a broken module that you did not request only produces a warning, and the build exits 0 when the requested pages rendered.

### Component cheat-sheet (`src/ui.mjs`)

| Category | Components |
|---|---|
| Layout | `section({title,id,body,tone,eyebrow,lead,actions,width})`, `grid({cols,items})`, `split({left,right,ratio,reverse,align})`, `toc(items)`, `panel({theme,body})` |
| Content | `cards`, `stats`/`stat`, `facts`, `table`, `accordion`, `timeline`, `steps`, `callout`, `quote`, `banner`, `linkList`, `people`/`personCard`, `gallery`, `chips`, `badge`, `lead`, `prose`, `note`, `divider` |
| Data blocks | `docList(items,{thumbs,collapse,groupPending})`, `pending(lang,note)`, `pendingGroup(lang,items)`, `slot(value,render,pending)` (a `school.mjs` TODO slot: the value, or the pending block while it is empty), `schoolEmail()`, `newsCard`/`newsList`, `contactList({admission})`, `requisites()`, `mapEmbed(lat,lng,{zoom,height})`, `form({kind:'feedback'\|'blog'\|'admission'})` |
| Atoms | `button({href,label,kind,icon,iconLeft,size})`, `extLink(href,label)`, `icon(name)` (see `ICON_NAMES`), `logo({size,mono,withText})`, `shanyrakArt()`, `ornament()`, `band()`, `eyebrow()`, `esc()` |

- **Ornament.** The ram-horn ornament is no longer tiled as wallpaper on dark surfaces. Use `ui.band()` (or `<div class="orn-band" aria-hidden="true">`): a textile-border strip that fades at both ends; its colour is `--band-color` (default: the theme accent) and its opacity `--band-o`. The page hero, mega-menu intro and footer already carry one.
- **Stats.** `stats([{…, art: true, extra: html}])` — `art` puts a faint shanyrak in the card corner, `extra` adds HTML (e.g. chips) under the note. Use both on the big first card of `.stats--bento` so it has no dead space.

`section({tone})` takes one of these values:

- `'plain'`
- `'card'`
- `'tint'`
- `'dark'`
- **any theme id**, which gives a patterned panel in that subject's colours.

### Compact pages: progressive disclosure

Keep every official item in the HTML, but show only a short human layer. Put the details behind native `<details>` toggles. The reference page is `src/pages/license.mjs`.

| Need | Component | Renders |
|---|---|---|
| Page-top summary | `ui.tldr({ points: [{ icon: 'shield', text: X(…) }, …] })` | "Қысқаша / Коротко / In short" strip with icons |
| Long explanation | `ui.more({ summary: X(…), body: X('<p>…</p>', …) })` | teaser + "Толығырақ / Подробнее / More ▾" (`label`, `icon`, `count`, `tone:'plain'\|'card'\|'tint'` optional) |
| Legal basis, norm quotes, adilet links | `ui.legal([{ title, number?, date?, href?, note? }], { note? })` or `ui.legal(X('<p>…</p>', …))` | chip "⚖ Құқықтық негіз / Правовая основа / Legal basis 3 ▾" |
| Long document list | `ui.docList(docs, { collapse: 3, groupPending: true })` | 3 rows + "Барлығын көрсету (N) / Показать все (N)"; missing files → one "N документов будут загружены ▾" line |
| Several "information is being updated" slots | `ui.pendingGroup(lang, [X(…), { title, note }])` | one line "5 материалов готовятся ▾" (1 item → one slim line) |
| Alternative views | `ui.tabs([{ label, body, icon?, count? }], { label })` | accessible tabs; without JS all panels show |

Some usage notes:

- **Side by side.** Wrap closed chips in `<div class="dz-row">…</div>`. An opened chip takes the full row.
- **Pending line.** `ui.pending(…)` keeps its signature. It now renders one slim line, "⌛ Ақпарат толықтырылуда · note".
- **Expand all.** `main.js` adds the "Барлығын ашу / Развернуть всё / Expand all" button once a page has 3 or more closed disclosures. It also opens everything for printing and opens the disclosure that contains a `#hash` target. Add `class="no-xall"` to a `<details>` to exclude it.
- **Measuring.** Check the result with the density script, which reports visible and total words per page against the baseline build.
### Themes

The theme ids are `hero`, `math`, `physics`, `chemistry`, `biology`, `geography`, `languages`, `informatics`, `arts`, `day` and `paper`.

- **On any element.** `[data-theme="<id>"]` sets `--t-bg`, `--t-ink`, `--t-muted`, `--t-accent`, `--t-accent-2`, `--t-accent-text`, `--t-link`, `--t-line`, `--t-card` and the pattern variables. Components inside it re-colour automatically.
- **Painting the background.** Add the class `.pattern` to paint the theme's background. It works full-bleed, including on `position:fixed` layers.
- **Relative URLs.** The `--t-pattern` value holds relative `url()`s. Use it only from stylesheets in `assets/css/`, or just use `.pattern`.
- **Page accent.** `body[data-accent]` gives the page's accent colour to content on paper: `--deco` is decorative and `--deco-ink` is safe for text.

### Runtime contract (`main.js`)

- **Global API.** `window.Keremet` exposes `{ lang, motionPaused(), a11yOn(), setMotion(bool), t(key), externalLinks(root) }`.
- **Events.** The script fires `keremet:motion {paused}` and `keremet:a11y {state}`.
- **Attributes it sets on `<html>`:**
  - `data-a11y`, `data-a11y-font`, `data-a11y-scheme`, `data-a11y-img`, `data-a11y-space`, `data-a11y-lh`, which it applies before paint
  - `data-motion="paused"`
  - the classes `.reveal-ready`, `.mnav-open` and `.has-motion`
- **Attributes pages can use:**

| Attribute | Effect |
|---|---|
| `data-reveal`, `data-reveal-stagger` | reveal the element on scroll |
| `data-copy="text"` | copy the text to the clipboard |
| `data-a11y-open` | open the a11y panel |
| `data-animated` | show the pause button on an inner page |
| `data-search-page` | turns the page into the search page |

### Header and fixed UI (foundation)

- **A11y button.** It is in the util bar on every page, with the full label from 720 px and a short visible label on phones (`a11y.short`, e.g. «Нашар көретіндерге» / «Для слабовидящих»). Once the util bar scrolls away, a copy appears in the sticky bar (`.bar__a11y`; icon-only between 1200 and 1499 px, but a labelled pill in a11y mode). On phones the wordmark collapses to the mark while scrolled to make room.
- **Pause button.** It is always visible (ORDER R.102). On phones it is a 44 px round icon button, and the full label stays its accessible name. While the visitor scrolls down it tucks back (`.is-tucked`: dimmed and smaller). If it or the to-top button would cover the focused element, main.js scrolls the page a little or lifts the button. The footer keeps safe bottom padding (`68px + env(safe-area-inset-bottom)`).
- **A11y mode header.** In low-vision mode the sticky `.bar__a11y` is always a pill with a visible label, including at 1200–1499 px. The label wraps only between words, so the bar stays one row high at A, A+ and A++ (two rows at most on narrow screens).
- **To-top button.** On phones it is 44 px and shows only while the visitor scrolls up.
- **Focus.** `scroll-padding-bottom: 84px` keeps keyboard focus from hiding under the fixed buttons. Landing sections should still leave about 72 px of space at the end of the page.
- **Fonts.** Montserrat (display), Onest (body), Lora (serif), IBM Plex Mono (mono) and Caveat (hand). Each one was checked for Ә Ғ Қ Ң Ө Ұ Ү Һ І in its woff2 cmap. Unbounded and JetBrains Mono lack most of these letters, so they were replaced. The tokens are `--font-*` in `base.css`, and the link is `FONTS` in `layout.mjs`.
- **Page-hero accents.** The section themes are colour schemes, not school subjects. The accents are neutral brand ornaments: a ram-horn pair, a thin shanyrak and stars. Subject glyphs such as E = mc² are not used.
- **Logo.** The shanyrak mark is 16 roof poles, the crown ring and two pairs of straight crossbars (`SHANYRAK_PATHS`), with no centre cross, so it does not read as a globe at 40–46 px. `logo.svg`, `favicon.svg`, `apple-touch-icon.png`, `og-image.png` and `shanyrak-line.svg` were regenerated from it.

## Adding news and documents

- **News.** Add an object to `src/data/news.mjs` with `id`, `date`, `time`, `title`, `lead`, `body` and `image`. Put the illustration in `public/assets/img/news/`. The RSS feed updates automatically.
- **Documents.** Every document shown anywhere on the site, published or pending, is one entry in `src/data/documents.mjs`. Pages must not define their own `{ title, file: null }` lists. To publish a document, put the file in `public/assets/docs/`, then fill in `file`, `type`, `date`, `number` **and `posted: 'YYYY-MM-DDTHH:MM'`** (when it was placed on the site, Shymkent time; add `changed` when a file is replaced) for its entry. `date` is the document's own date; `posted` / `changed` are shown as «Орналастырылды / Размещено / Posted» and raise the page's «Last updated» line, its search-index date and its sitemap `<lastmod>` (build.mjs takes the latest of `page.updated` and every document and news item the page shows). The build warns when a file has no `posted`. For a JPG/PNG scan, run `python tools/make-thumbs.py` so the list shows a small WebP preview instead of the full scan. The size is computed automatically. Pages show documents with `ui.docList(docsByGroup('<group>'))` or `docById('<id>')`, so the documents page, its counters, the home page's latest documents and this checklist always agree.
- **Tables.** On phones, `ui.table()` and every hand-written `<table>` in `.page-body` stack into label/value cards. Cell content is wrapped in `.tbl__v`, so mixed text stays in one cell. To opt out, use `ui.table({ stack: false })`, the class `tbl--static` or `data-stack="off"` on the table or an ancestor. The table then keeps a real grid that scrolls sideways. Calendars (`.ev-cal`) and subject-hours matrices (`.edu-tup`) are opted out automatically.
- **Reveal on scroll.** Content is hidden only after main.js runs (`html.reveal-ready`). The observer uses `threshold: 0`, so tall blocks reveal as soon as they enter the viewport. Content missed by the observer is revealed when scrolling stops, on focus, before printing and when the a11y mode or motion changes. Everything is shown at once when the observer is silent. With no JS, in a11y mode, with motion paused or with reduced motion, nothing is ever hidden.
- **RSS.** `<pubDate>` is the item's `posted` time (`postedOf`, Shymkent time). `<category>` is the localized `NEWS_TAGS` label.

## Maintenance calendar (Order 114 S.109–112)

The site is static: every change below is an edit to a data file, then `node build.mjs` and a redeploy. News and the
menu must be published **daily**; everything else within **3 working days** of the change; the start-of-year set by
**1 September**. Each item shows its own placement date (`posted` / `changed`), and the page's «Last updated» line
follows automatically.

| When | What | File and field |
|---|---|---|
| Every school day | News item (date, place, content, result, photo) | `src/data/news.mjs`: new object with `id`, `date`, `time`, `posted`, `title`, `lead`, `body`, `image`; photo in `public/assets/img/news/` |
| Every school day | Daily menu (approved by the director, portions) | `src/data/menu.mjs`: add one object to `days` (`date`, `meals[]`) |
| Within 3 working days | Any new or replaced document (orders, plans, reports, minutes) | `src/data/documents.mjs`: the entry's `file`, `type`, `date`, `number`, `posted` (+ `changed` on replacement); file in `public/assets/docs/` |
| Within 3 working days | Contacts, reception hours, person responsible for appeals | `src/data/school.mjs`: `contacts.*`, `legal.director.reception`, `contacts.responsibleForAppeals` |
| Within 3 working days | Leadership changes | `school.mjs`: `legal.director.*`, `deputies`; document `director-order` |
| Within 3 working days | Vacancies | `src/pages/vacancies.mjs` (staff-admission owner) |
| Within 3 working days | Meals supplier, commission | `school.mjs`: `meals.supplier`, `meals.commission`; documents group `meals` |
| By 1 September | Working curriculum, timetable, academic calendar, bells | documents `curriculum-rup`, `timetable`, `academic-calendar`; `school.mjs`: `schedule.bells`, `schedule.weekly`, `schedule.academicCalendar` |
| By 1 September | Upbringing plan, support-service and prevention plans, clubs timetable | documents group `upbringing` (`upbringing-plan`, `spps-plan`, `bullying-plan`, `offence-plan`, `clubs-timetable`) |
| By 1 September | Teaching staff (with consent) | `school.mjs`: `staff` |
| By 1 September | Contingent (pupils, classes, free places, graduates) | `school.mjs`: `contingent` (with `date`) |
| By 1 September | Tuition fees and contract | `school.mjs`: `tuition`; document `contract-template` |
| Before each Board of Trustees meeting | Announcement (date, time, place, agenda) | `src/data/board.mjs`: `announcement`, a new row in `meetings` |
| After each Board meeting | Decision / minutes | `board.mjs`: the meeting's `decision`; document `board-minutes` |
| Once a year | Board, budget and charity reports; development-plan report; survey results | documents groups `board`, `finance`, `plan`, `governance` (`survey-*`) |
| Every 5 years (attestation) | Self-assessment materials | `src/pages/self-*.mjs` (self owner) |

The build helps: it warns when a document has a file but no `posted`, when a filled `TODO(school)` slot in
`school.mjs` is read by no page (see the DATA CONTRACT at the top of that file; pages render slots with
`ui.slot(value, render, pending)`), and when a page prints `null` / `undefined`.

## Data the school must supply (checklist)

Taken from the `TODO(school)` markers in `src/data/school.mjs` and the pending entries in `src/data/documents.mjs`.

**Contacts and identity**

- [ ] An official e-mail. `school.contacts.email` is `null` until the school gives a mailbox that works (keremet.edu.kz does not resolve). Until then `ui.schoolEmail()` prints only «Ресми e-mail нақтылануда / Официальный e-mail уточняется / Official e-mail to be confirmed», with no address. Set the address **and** `emailConfirmed: true` together; `layout.mjs` also removes any stray `mailto:` link while it is unconfirmed.
- [ ] A city landline `+7 (7252) …`.
- [ ] The working hours. 09:00–18:00 is unconfirmed.
- [ ] The person responsible for appeals.
- [ ] Whether ул. Сейхун 125 (the legal address) and мкр. Асар 911/2 (the actual address) are the same site.
- [ ] The current grade range. The Instagram profile says 0–6.
- [ ] The official wording for "free tuition" and what it is based on.
- [ ] The official mission, vision and values.
- [ ] The year teaching started.
- [ ] International cooperation, or the statement «не осуществляется».

**Leadership and staff**

- [ ] The director: photo, education, experience, qualification category, appointment order and reception hours.
- [ ] The deputies: full names, areas, contacts and reception hours.
- [ ] The teachers, published with their consent: subject, education, category and courses from the last 3 years.
- [ ] Vacancies.

**Contingent and money**

- [ ] The contingent: pupils, classes, class sizes, free places and graduates.
- [ ] Tuition fees and the contract (order №93).

**Schedules and services**

- [ ] The bell schedule, the timetable and the academic calendar.
- [ ] The meals supplier, the menu and the commission.
- [ ] The medical service contract.

**Documents** (generated from `pendingDocuments()` in `src/data/documents.mjs`. Every entry is pending until its file is added. The ids are what pages pass to `docById`.)

- [ ] **Founding documents** (`founding`, 1): Charter of the partnership (`charter`)
- [ ] **Governance** (`governance`, 19): Order appointing the director (`director-order`) · Order approving the management structure (`structure-order`) · Regulations on the Pedagogical Council (`ped-council`) · Regulations on the Methodological Council (`method-council`) · Regulations on the Pedagogical Ethics Council (`ethics-council`) · Parent survey results — 2026–2027 school year (`survey-parents-2026-2027`) · Pupil survey results — 2026–2027 school year (`survey-pupils-2026-2027`) · Teacher survey results — 2026–2027 school year (`survey-teachers-2026-2027`) · Order appointing the person responsible for appeals (`appeals-officer-order`) · Regulation on the procedure for handling appeals (`appeals-regulation`) · Director’s diploma and qualification-category certificate (`director-diploma`) · Minutes of methodological council meetings (`method-council-minutes`) · Order on the membership of the Pedagogical Council (2026–2027) (`ped-council-order`) · Pedagogical Council work plan (2026–2027) (`ped-council-plan`) · Minutes and decisions of Pedagogical Council meetings (`ped-council-minutes`) · Membership of the methodological council and subject teams (`method-council-membership`) · Order on the membership of the Pedagogical Ethics Council (`ethics-council-order`) · Pedagogical Ethics Council work plan (`ethics-council-plan`) · Summary report on the Pedagogical Ethics Council’s work (`ethics-council-report`)
- [ ] **Development plan** (`plan`, 5): School development plan (`development-plan`) · Annual report on the development plan (`development-report`) · Development plan progress report: 2024–2025 (`development-report-2024-2025`) · Development plan progress report: 2025–2026 (`development-report-2025-2026`) · Interim monitoring for the current year (2026–2027) (`development-monitoring-2026-2027`)
- [ ] **Internal rules** (`rules`, 1): Internal regulations (`internal-rules`)
- [ ] **Teaching and learning** (`education`, 14): Working curriculum (2026–2027) (`curriculum-rup`) · Timetable (2026–2027) (`timetable`) · Academic calendar and holidays (`academic-calendar`) · Internal quality-control plan (`control-plan`) · Methodological work plan (`method-plan`) · Order on the organisation of distance learning (`distance-order`) · Life-safety course: topics and dates (2026–2027) (`life-safety-topics`) · Orders on distance learning in adverse weather (`distance-weather-orders`) · List of textbooks and teaching kits by grade (2026–2027) (`textbook-list`) · Statement on pupils’ textbook provision (`textbook-provision`) · Statement on the library collection (`library-collection`) · Subject teams’ work plans for 2026–2027 (`method-teams-plans`) · Analytical reports on internal control (2025–2026, 2026–2027) (`control-reports`) · Management decisions following reviews (orders, council decisions) (`control-decisions`)
- [ ] **Upbringing** (`upbringing`, 12): Annual upbringing plan “Adal azamat” (`upbringing-plan`) · Order on the membership of the psychological support service (`spps-order`) · Support service work plan (2026–2027) (`spps-plan`) · Bullying prevention plan (2026–2027) (`bullying-plan`) · Offence prevention plan (2026–2027) (`offence-plan`) · Order setting up the prevention council and its members (`prevention-council`) · Plan of work with parents (2026–2027) (`parents-plan`) · Timetable of clubs and sections (2026–2027) (`clubs-timetable`) · Statement on pupils’ club participation (`clubs-coverage`) · Parent committee members (`parent-committee`) · Minutes of the latest parent meeting (`parent-meeting-minutes`) · Report on the annual upbringing plan (2025–2026) (`upbringing-report-2025-2026`)
- [ ] **Admission** (`admission`, 7): Rules of admission, transfer and withdrawal (`admission-rules`) · Standard contract for educational services (`contract-template`) · Application form for admission (`application-template`) · Transfer application form (`transfer-application`) · Request for a certificate of enrolment (`certificate-request`) · Request for a duplicate education document (`duplicate-request`) · Withdrawal application form (`withdrawal-application`)
- [ ] **Building and services** (`campus`, 8): Basis for use of the building (ownership / lease) (`building-basis`) · Sanitary-epidemiological certificate (`sez`) · Medical services contract (`medical-contract`) · Design capacity statement (technical passport) (`design-capacity`) · Classroom equipment list under order No. 70 (`classroom-equipment`) · Sanitary certificate or licence for the medical room (`medical-room-certificate`) · Medical worker’s schedule (`medical-schedule`) · Vaccination plan for the school year (`vaccination-plan`)
- [ ] **Meals** (`meals`, 9): Catering contract (`meals-contract`) · Long-term menu (`meals-menu`) · Work plan for school meals (`meals-plan`) · Order setting up the meal-quality commission (`meals-commission-order`) · Monthly commission reports (`meals-commission-reports`) · Order setting up the brakerazh commission (`brakerazh-order`) · Food-tasting (brakerazh) commission records (`brakerazh-records`) · Order appointing the person responsible for drinking water (`drinking-water-order`) · Sanitary certificate of the catering facility (`meals-sez`)
- [ ] **Safety** (`safety`, 6): Fire-safety compliance report (`fire-safety`) · Class teachers’ road-safety plan: topics and dates (`road-safety-plan`) · Order on access control and on-site rules (`access-control-order`) · Anti-terror drills and exercises plan (`anti-terror-drills-plan`) · Safe route map “home — school — home” (`safe-route-map`) · Security services contract (or order on security) (`security-contract`)
- [ ] **Board of Trustees** (`board`, 8): Regulations on the Board of Trustees (`board-regulation`) · Order on the composition of the Board of Trustees (`board-composition`) · Board of Trustees work plan (`board-plan`) · Board of Trustees annual report, 2025 (`board-report-2025`) · Board of Trustees annual report, 2024 (`board-report-2024`) · Board of Trustees annual report, 2023 (`board-report-2023`) · Minutes of the parents’ meeting (nominations) (`board-nomination-minutes`) · Minutes and decisions of Board meetings (`board-minutes`)
- [ ] **Finance** (`finance`, 7): Report on the use of charitable aid, financial year 2025 (`charity-report`) · Statement on budget funding (`budget-statement`) · Report on the use of budget funds, 2025 (`budget-report-2025`) · Report on the use of charitable aid, financial year 2024 (`charity-report-2024`) · Report on the use of budget funds, 2024 (`budget-report-2024`) · Report on the use of charitable aid, financial year 2023 (`charity-report-2023`) · Report on the use of budget funds, 2023 (`budget-report-2023`)
- [ ] **Anti-corruption** (`anticorruption`, 3): Order appointing the ethics officer (`ethics-order`) · Anti-corruption policy (approved text) (`anticorruption-policy`) · Conflict-of-interest procedure (`conflict-of-interest`)
- [ ] **Personal data** (`privacy`, 1): Personal data protection policy (`personal-data`)

**Self-assessment and news**

- [ ] Self-assessment materials for all 39 criteria, covering the last 2 school years and the current one.
- [ ] Real photos of the school.
- [ ] Regular news.

**Domain**

- [ ] **The keremet.edu.kz domain must be renewed.** Its registration expired on 18.08.2023. Hosting must be in Kazakhstan with HTTPS.

## Testing

- **What to check.** Use Chrome with `playwright-core`. Every page should have no console errors, and nothing should scroll sideways at 360 px wide. Also check that the a11y panel, the mega-menu, the mobile menu, keeping the page when switching language, and search all work.
- **Where to put test files.** Keep test scripts and screenshots out of the repository.
