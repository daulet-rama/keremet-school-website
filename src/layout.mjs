// =====================================================================================
//  src/layout.mjs — full HTML document for one page × language.
//  renderPage(page, lang, ctx, content, opts) → string
//    page    : page module object (SPEC §5)
//    ctx     : { lang, t, L, S, href, asset, ui, nav, page, pages, prefix }
//    content : HTML returned by page.render(lang, ctx)
//    opts    : { buildInfo, hasFile(relPath), version } — version = asset hash → ?v= on our css/js URLs
//  Home (page.home) → transparent overlay header, no page hero/breadcrumbs, importmap + home assets.
// =====================================================================================
import { t as tt, L as LL, HTML_LANG, OG_LOCALE, LANGS, LANG_NAMES, fmtDateTime } from './i18n.mjs';
import { TOP, GROUPS, PAGE_LABELS, groupOf, topOf, firstPage, themeOf } from './nav.mjs';
import { school, SITE_URL } from './data/school.mjs';
import { esc, icon, logo, shanyrakArt, pageHero, extLink, pageMeta, schoolEmail, ornament, SHANYRAK_PATHS } from './ui.mjs';

// Fonts are self-hosted (public/assets/fonts, @font-face at the top of base.css): no request leaves the site's own
// server (hosting and data in Kazakhstan, ORDER item 3). Chosen for full Kazakh coverage (Ә Ғ Қ Ң Ө Ұ Ү Һ І, checked in
// each woff2 cmap): Montserrat (display), Onest (body), Lora (serif), IBM Plex Mono (mono), Caveat (hand).
// Preloaded: the body face's subsets of the page language (the first paint uses them).
const PRELOAD_FONTS = { kz: ['onest-400-700-cyrillic.woff2', 'onest-400-700-cyrillic-ext.woff2'], ru: ['onest-400-700-cyrillic.woff2'], en: ['onest-400-700-latin.woff2'] };

const attr = (s) => esc(String(s ?? '').replace(/<[^>]*>/g, ''));
const strip = (s) => String(s ?? '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

/** Absolute canonical URL of slug in lang. */
export function absUrl(slug, lang) {
  return slug === 'index' ? `${SITE_URL}/${lang}/` : `${SITE_URL}/${lang}/${slug}.html`;
}

// Strings needed by main.js (search, forms, copy, motion, a11y)
const JS_KEYS = ['extNewTab', 'copy', 'copied', 'motion.pause', 'motion.play', 'motion.pauseShort', 'motion.playShort', 'search.found', 'search.none', 'search.empty', 'search.loading', 'search.error', 'search.updated',
  'form.errSummary', 'form.err.required', 'form.err.email', 'form.err.phone', 'form.err.short', 'form.err.consent', 'form.err.contact', 'form.sending', 'form.ok', 'form.fail',
  'nav.openMenu', 'nav.closeMenu', 'a11y.imgAlt', 'a11y.exit', 'disc.expandAll', 'disc.collapseAll'];

// ------------------------------------------------------------------ theme accents for page heroes
// The themes are colour schemes of the site's sections, not school subjects, so literal subject glyphs (a² + b² = c²,
// E = mc², a periodic-table cell, a shell prompt) were replaced by neutral brand ornaments; each theme keeps its
// colours and background pattern. Geography (Shymkent's coordinates), languages (the Kazakh letters), biology
// (Tulipa greigii, the region's tulip) and arts (a brush stroke) are about the school or neutral and stay.
const ORN_SHANYRAK = `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="${SHANYRAK_PATHS.rays}" stroke-width="1.4"/><circle cx="32" cy="32" r="20" stroke-width="1.6"/><circle cx="32" cy="32" r="16.5" stroke-width=".8" opacity=".6"/><path d="${SHANYRAK_PATHS.bars}" stroke-width="1.4"/></svg>`;
function heroAccent(theme, lang) {
  const stars = `<span class="phero-acc phero-acc--hero" aria-hidden="true">${'<i></i>'.repeat(7)}</span>`;
  switch (theme) {
    case 'math': return `<span class="phero-acc phero-acc--orn phero-acc--horn" aria-hidden="true">${ornament()}${ornament()}</span>`;
    case 'physics': return `<span class="phero-acc phero-acc--orn phero-acc--shanyrak" aria-hidden="true">${ORN_SHANYRAK}</span>`;
    case 'chemistry': return stars;
    case 'biology': return `<span class="phero-acc phero-acc--bio" aria-hidden="true"><i>Tulipa greigii</i><small>Regel, 1873</small></span>`;
    case 'geography': return `<span class="phero-acc phero-acc--geo" aria-hidden="true">42°24′30″ N<br>69°36′48″ E<small>${esc(LL(lang, { kz: 'Шымкент', ru: 'Шымкент', en: 'Shymkent' }))}</small></span>`;
    case 'languages': return `<span class="phero-acc phero-acc--lang" aria-hidden="true">Ә Ғ Қ Ң Ө Ұ Ү Һ І</span>`;
    case 'informatics': return `<span class="phero-acc phero-acc--orn phero-acc--shanyrak phero-acc--shanyrak-s" aria-hidden="true">${ORN_SHANYRAK}</span>${stars}`;
    case 'arts': return `<span class="phero-acc phero-acc--arts" aria-hidden="true"><svg viewBox="0 0 300 60" aria-hidden="true"><path d="M8 40c40-26 80-30 120-14s84 20 164-10" fill="none" stroke="currentColor" stroke-width="14" stroke-linecap="round"/></svg><small>♪ ♫ ♪</small></span>`;
    case 'hero': return stars;
    default: return ''; // paper: the hero's ornament band + violet crown are the accent
  }
}

/** Working hours + "(to be confirmed)" marker while school.contacts.hoursConfirmed is false. */
const hoursText = (lang) => `${esc(LL(lang, school.contacts.hours))}${school.contacts.hoursConfirmed ? '' : ` <small class="unconf">(${tt(lang, 'unconfirmed')})</small>`}`;

// ------------------------------------------------------------------ header pieces
/** Label spans of an a11y toggle. main.js swaps each [data-a11y-label] between data-off / data-on
 *  (a11y mode on → "back to the standard version"). full = accessible name; short = visible on phones
 *  (aria-hidden; always a substring of the full label, so "label in name" holds). */
function a11yLabels(lang) {
  const full = `<span class="a11y-btn__txt" data-a11y-label data-off="${attr(tt(lang, 'a11y.button'))}" data-on="${attr(tt(lang, 'a11y.exit'))}">${tt(lang, 'a11y.button')}</span>`;
  const short = `<span class="a11y-btn__short" aria-hidden="true" data-a11y-label data-off="${attr(tt(lang, 'a11y.short'))}" data-on="${attr(tt(lang, 'a11y.exitShort'))}">${tt(lang, 'a11y.short')}</span>`;
  return full + short;
}
function langSwitch(page, lang, ctx, cls = '') {
  return `<nav class="langs${cls ? ' ' + cls : ''}" aria-label="${attr(tt(lang, 'lang'))}"><ul role="list">${LANGS.map((l) => {
    const cur = l === lang;
    return `<li><a href="${attr(ctx.href(page.root ? 'index' : page.slug, l))}" hreflang="${HTML_LANG[l]}" lang="${HTML_LANG[l]}" data-lang-link="${l}"${cur ? ' aria-current="true"' : ''} title="${attr(LANG_NAMES[l].name)}"><span aria-hidden="true">${LANG_NAMES[l].short}</span><span class="sr-only">${LANG_NAMES[l].name}</span></a></li>`;
  }).join('')}</ul></nav>`;
}

function searchForm(lang, ctx, id, cls) {
  return `<form class="${cls}" role="search" action="${attr(ctx.href('search'))}" method="get"><label class="sr-only" for="${id}">${tt(lang, 'search.label')}</label><input id="${id}" name="q" type="search" maxlength="200" placeholder="${attr(tt(lang, 'search.placeholder'))}" autocomplete="off" data-search-input><button type="submit" aria-label="${attr(tt(lang, 'search.submit'))}">${icon('search', { size: 18 })}</button></form>`;
}

function megaPanels(page, lang, ctx) {
  return TOP.map((top, ti) => {
    const theme = GROUPS[top.groups[0]].theme;
    const single = top.groups.length === 1;
    const groups = top.groups.map((gid) => {
      const g = GROUPS[gid];
      return `<div class="mega__group" data-accent="${g.theme}"><p class="mega__gtitle"><span class="mega__swatch" aria-hidden="true"></span>${esc(LL(lang, g.label))}</p><ul role="list"${single && g.pages.length > 4 ? ' class="mega__cols"' : ''}>${g.pages.map((s) => `<li><a href="${attr(ctx.href(s))}"${s === page.slug ? ' aria-current="page"' : ''}><span>${esc(LL(lang, PAGE_LABELS[s]))}</span>${icon('arrow-right', { size: 16 })}</a></li>`).join('')}</ul></div>`;
    }).join('');
    return `<li class="nav__item${page.group && top.groups.includes(page.group) ? ' is-current' : ''}"><button type="button" class="nav__trigger" aria-expanded="false" aria-controls="mega-${top.id}" data-mega><span>${esc(LL(lang, top.label))}</span>${icon('chevron-down', { size: 16 })}</button>
<div class="mega" id="mega-${top.id}" hidden><div class="mega__in mega__in--aside${single ? ' mega__in--single' : ''}">
<div class="mega__intro pattern" data-theme="${theme}"><p class="mega__num" aria-hidden="true">0${ti + 1}</p><p class="mega__title">${esc(LL(lang, top.label))}</p><p class="mega__text">${esc(LL(lang, top.intro))}</p><a class="mega__cta" href="${attr(ctx.href(firstPage(top.groups[0])))}"><span>${tt(lang, 'nav.goto')}</span>${icon('arrow-right', { size: 18 })}</a><div class="orn-band" aria-hidden="true"></div></div>
<div class="mega__groups">${groups}</div>
<aside class="mega__aside" aria-label="${attr(tt(lang, 'ftr.contacts'))}">${shanyrakArt()}<p class="mega__aside-k">${tt(lang, 'ftr.question')}</p><a class="mega__aside-phone" href="tel:${school.contacts.phone.tel}">${school.contacts.phone.display}</a><p>${hoursText(lang)}</p><p class="mega__aside-links"><a href="${attr(ctx.href('feedback'))}">${tt(lang, 'cta.write')}</a><a href="${attr(ctx.href('contacts'))}">${esc(LL(lang, PAGE_LABELS.contacts))}</a></p></aside></div></div></li>`;
  }).join('');
}

function mobileNav(page, lang, ctx) {
  const items = TOP.map((top) => {
    const links = top.groups.map((gid) => {
      const g = GROUPS[gid];
      return `<div class="mnav__group" data-accent="${g.theme}">${top.groups.length > 1 ? `<p class="mnav__gtitle">${esc(LL(lang, g.label))}</p>` : ''}<ul role="list">${g.pages.map((s) => `<li><a href="${attr(ctx.href(s))}"${s === page.slug ? ' aria-current="page"' : ''}>${esc(LL(lang, PAGE_LABELS[s]))}</a></li>`).join('')}</ul></div>`;
    }).join('');
    return `<li class="mnav__item"><button type="button" class="mnav__btn" aria-expanded="false" aria-controls="mnav-${top.id}"><span>${esc(LL(lang, top.label))}</span><span class="mnav__plus" aria-hidden="true"></span></button><div class="mnav__panel" id="mnav-${top.id}" hidden>${links}</div></li>`;
  }).join('');
  return `<div class="mnav pattern" data-theme="hero" id="mnav" role="dialog" aria-modal="true" aria-label="${attr(tt(lang, 'nav.menu'))}" hidden>
<div class="mnav__in">
<div class="mnav__top"><a class="mnav__logo" href="${attr(ctx.href('index'))}">${logo({ withText: true, size: 40 })}</a><button type="button" class="mnav__close" data-mnav-close aria-label="${attr(tt(lang, 'nav.closeMenu'))}">${icon('close', { size: 24 })}</button></div>
${searchForm(lang, ctx, 'mnav-q', 'mnav__search')}
<nav aria-label="${attr(tt(lang, 'nav.main'))}"><ul class="mnav__list" role="list">${items}</ul></nav>
<div class="mnav__foot">${langSwitch(page, lang, ctx, 'langs--mnav')}
<button type="button" class="a11y-btn a11y-btn--mnav" data-a11y-toggle aria-controls="a11y-panel" aria-expanded="false">${icon('eye', { size: 20 })}<span data-a11y-label data-off="${attr(tt(lang, 'a11y.title'))}" data-on="${attr(tt(lang, 'a11y.exit'))}">${tt(lang, 'a11y.title')}</span></button>
<a class="mnav__phone" href="tel:${school.contacts.phone.tel}">${icon('phone', { size: 20 })}<span>${school.contacts.phone.display}</span></a>
<a class="btn btn--gold btn--l mnav__cta" href="${attr(ctx.href('admission'))}"><span>${tt(lang, 'cta.admission')}</span>${icon('arrow-right')}</a></div>
</div></div>`;
}

function a11yPanel(lang, ctx) {
  const grp = (key, label, opts) => `<div class="a11y-grp" role="group" aria-labelledby="a11y-l-${key}"><span class="a11y-grp__label" id="a11y-l-${key}">${label}</span><div class="a11y-grp__opts">${opts.map((o) => `<button type="button" class="a11y-opt${o.cls ? ' ' + o.cls : ''}" data-a11y-set="${key}" data-v="${o.v}" aria-pressed="false"${o.title ? ` title="${attr(o.title)}"` : ''}>${o.html}</button>`).join('')}</div></div>`;
  // Phones (< 640px): a one-row bar (Settings toggle + exit); the groups open right after the mode is switched on or
  // when the toggle is pressed, and the viewer's choice is remembered (main.js, localStorage 'keremet-a11y-panel').
  return `<section class="a11y-panel" id="a11y-panel" aria-label="${attr(tt(lang, 'a11y.title'))}" hidden>
<div class="a11y-panel__in wrap-wide">
<div class="a11y-panel__bar"><button type="button" class="a11y-act a11y-panel__toggle" data-a11y-panel-toggle aria-expanded="true" aria-controls="a11y-body">${icon('sliders', { size: 18 })}<span>${tt(lang, 'a11y.settings')}</span><span class="sr-only"> — ${tt(lang, 'a11y.settingsFull')}</span>${icon('chevron-down', { size: 18, cls: 'a11y-panel__chev' })}</button><button type="button" class="a11y-act a11y-act--exit" data-a11y-exit>${icon('eye', { size: 18 })}<span>${tt(lang, 'a11y.exitShort')}</span><span class="sr-only"> — ${tt(lang, 'a11y.exit')}</span></button></div>
<div class="a11y-panel__body" id="a11y-body">
${grp('font', tt(lang, 'a11y.font'), [{ v: '1', html: 'A', cls: 'a11y-opt--f1', title: '100%' }, { v: '2', html: 'A+', cls: 'a11y-opt--f2', title: '130%' }, { v: '3', html: 'A++', cls: 'a11y-opt--f3', title: '160%' }])}
${grp('scheme', tt(lang, 'a11y.scheme'), ['wb', 'bw', 'blue', 'beige'].map((v) => ({ v, cls: `a11y-opt--sw a11y-sw--${v}`, html: `<span aria-hidden="true">Aa</span><span class="sr-only">${tt(lang, `a11y.scheme.${v}`)}</span>`, title: tt(lang, `a11y.scheme.${v}`) })))}
${grp('img', tt(lang, 'a11y.images'), [{ v: 'on', html: tt(lang, 'a11y.on') }, { v: 'off', html: tt(lang, 'a11y.off') }])}
${grp('space', tt(lang, 'a11y.spacing'), [{ v: '1', html: tt(lang, 'a11y.normal') }, { v: '2', html: tt(lang, 'a11y.wide') }])}
${grp('lh', tt(lang, 'a11y.lh'), [{ v: '1', html: tt(lang, 'a11y.normal') }, { v: '2', html: tt(lang, 'a11y.wide') }])}
<div class="a11y-actions"><button type="button" class="a11y-act" data-a11y-reset>${icon('arrow-left', { size: 18 })}<span>${tt(lang, 'a11y.reset')}</span></button><button type="button" class="a11y-act a11y-act--exit" data-a11y-exit>${icon('eye', { size: 18 })}<span>${tt(lang, 'a11y.exit')}</span></button><a class="a11y-act" href="${attr(ctx.href('accessibility'))}">${icon('info', { size: 18 })}<span>${tt(lang, 'a11y.help')}</span></a></div>
</div></div></section>`;
}

function header(page, lang, ctx) {
  const S = school;
  const home = !!page.home;
  return `<header class="site-header${home ? ' site-header--overlay' : ''}" id="top" data-header>
<div class="util"><div class="util__in wrap-wide">
<div class="util__org"><p class="util__name"><strong>${esc(LL(lang, S.name))}</strong><span class="util__sep" aria-hidden="true">·</span><span class="util__legal">${esc(LL(lang, S.legal.name))}</span><span class="util__sep util__hide-s" aria-hidden="true">·</span><span class="util__hide-s">${tt(lang, 'hdr.orgType')}</span></p><p class="util__licensor">${tt(lang, 'hdr.licensor')}: ${esc(LL(lang, S.licensorShort))}</p></div>
<a class="util__phone" href="tel:${S.contacts.phone.tel}">${icon('phone', { size: 16 })}<span>${S.contacts.phone.display}</span></a>
${searchForm(lang, ctx, 'hdr-q', 'util__search')}
${langSwitch(page, lang, ctx)}
<button type="button" class="a11y-btn a11y-btn--util" data-a11y-toggle aria-controls="a11y-panel" aria-expanded="false" title="${attr(tt(lang, 'a11y.title'))}">${icon('eye', { size: 18 })}${a11yLabels(lang)}</button>
</div></div>
<div class="bar"><div class="bar__in wrap-wide">
<a class="bar__logo" href="${attr(ctx.href('index'))}" aria-label="${attr(`${tt(lang, 'home')}: ${LL(lang, S.name)}`)}">${logo({ withText: true, size: 46 })}</a>
<nav class="nav" aria-label="${attr(tt(lang, 'nav.main'))}"><ul class="nav__list" role="list">${megaPanels(page, lang, ctx)}</ul></nav>
<div class="bar__actions">
<button type="button" class="a11y-btn bar__a11y" data-a11y-toggle aria-controls="a11y-panel" aria-expanded="false" title="${attr(tt(lang, 'a11y.title'))}">${icon('eye', { size: 18 })}${a11yLabels(lang)}</button>
<a class="bar__search-btn" href="${attr(ctx.href('search'))}" aria-label="${attr(tt(lang, 'search.label'))}">${icon('search', { size: 20 })}</a>
<a class="btn btn--primary btn--s bar__cta" href="${attr(ctx.href('admission'))}"><span>${tt(lang, 'cta.admission')}</span>${icon('arrow-right', { size: 18 })}</a>
<button type="button" class="burger" data-mnav-open aria-controls="mnav" aria-expanded="false"><span class="burger__box" aria-hidden="true"><i></i><i></i><i></i></span><span class="burger__txt">${tt(lang, 'nav.menu')}</span></button>
</div></div></div>
</header>`;
}

// ------------------------------------------------------------------ breadcrumbs & hero
function crumbTrail(page, lang, ctx) {
  const g = GROUPS[page.group] || groupOf(page.slug);
  const items = [{ label: tt(lang, 'home'), href: ctx.href('index') }];
  if (g) {
    const top = topOf(g.id);
    const topFirst = top ? firstPage(top.groups[0]) : null;
    if (top && g.id !== 'util') items.push({ label: LL(lang, top.label), href: topFirst !== page.slug ? ctx.href(topFirst) : null });
    const gFirst = firstPage(g.id);
    if (g.id !== 'util' && gFirst !== page.slug && gFirst !== topFirst) items.push({ label: LL(lang, PAGE_LABELS[gFirst] || g.label), href: ctx.href(gFirst) });
  }
  const own = LL(lang, page.crumb || page.title);
  const prev = items[items.length - 1];
  if (items.length > 1 && String(prev.label).trim().toLowerCase() === String(own).trim().toLowerCase()) items[items.length - 1] = { label: own };
  else items.push({ label: own });
  return items;
}
function subNav(page, lang, ctx) {
  const g = GROUPS[page.group] || groupOf(page.slug);
  if (!g || g.pages.length < 2 || g.id === 'util') return '';
  const cur = g.pages.includes(page.slug) ? page.slug : g.pages[0];
  return `<nav class="phero__sub" aria-label="${attr(tt(lang, 'nav.inSection'))}"><ul role="list">${g.pages.map((s) => `<li><a href="${attr(ctx.href(s))}"${s === page.slug ? ' aria-current="page"' : s === cur && page.slug !== cur ? ' class="is-parent"' : ''}>${esc(LL(lang, PAGE_LABELS[s]))}</a></li>`).join('')}</ul></nav>`;
}

// ------------------------------------------------------------------ footer
function footer(page, lang, ctx) {
  const S = school;
  const year = new Date().getFullYear();
  const cols = TOP.map((top) => `<details class="ftr__col" open data-ftr-col><summary class="ftr__sum"><span class="ftr__h">${esc(LL(lang, top.label))}</span><span class="ftr__plus" aria-hidden="true"></span></summary><ul role="list">${top.groups.flatMap((gid) => GROUPS[gid].pages).map((s) => `<li><a href="${attr(ctx.href(s))}">${esc(LL(lang, PAGE_LABELS[s]))}</a></li>`).join('')}</ul></details>`).join('');
  const gov = ['ministry', 'department', 'cityEducation', 'eduPortal', 'egov', 'elicense'].filter((k) => S.gov[k]).map((k) => `<li>${extLink(S.gov[k].url, LL(lang, S.gov[k].label), { cls: 'ftr__gov-a' })}</li>`).join('');
  return `<footer class="site-footer pattern" data-theme="hero">
<div class="ftr__cta wrap-wide"><div class="ftr__cta-in"><div><p class="ftr__cta-title">${tt(lang, 'ftr.question')}</p><p class="ftr__cta-text">${tt(lang, 'ftr.questionText')}</p></div><div class="ftr__cta-btns"><a class="btn btn--gold" href="${attr(ctx.href('feedback'))}"><span>${tt(lang, 'cta.write')}</span>${icon('arrow-right')}</a><a class="btn btn--light" href="tel:${S.contacts.phone.tel}">${icon('phone')}<span>${S.contacts.phone.display}</span></a></div></div></div>
<div class="orn-band ftr__band" aria-hidden="true"></div>
<div class="ftr__main wrap-wide">
<div class="ftr__brand">
<a class="ftr__logo" href="${attr(ctx.href('index'))}" aria-label="${attr(`${tt(lang, 'home')}: ${LL(lang, S.name)}`)}">${logo({ withText: true, size: 52 })}</a>
<p class="ftr__name">${esc(LL(lang, S.name))}</p>
<p class="ftr__legal">${esc(LL(lang, S.legal.name))} · ${tt(lang, 'hdr.orgType')}</p>
<ul class="ftr__contacts" role="list">
<li>${icon('pin', { size: 18 })}<span>${S.addresses.actual.postcode}, ${esc(LL(lang, S.addresses.actual.text))}</span></li>
<li>${icon('phone', { size: 18 })}<a href="tel:${S.contacts.phone.tel}">${S.contacts.phone.display}</a></li>
<li>${icon('mail', { size: 18 })}<span>${schoolEmail()}</span></li>
<li>${icon('clock', { size: 18 })}<span>${hoursText(lang)}</span></li>
</ul>
<ul class="ftr__social" role="list"><li>${extLink(S.contacts.instagram.url, `${icon('instagram', { size: 18 })}<span>Instagram</span>`, { cls: 'ftr__soc' })}</li><li>${extLink(`https://wa.me/${S.contacts.phone.whatsapp}`, `${icon('whatsapp', { size: 18 })}<span>WhatsApp</span>`, { cls: 'ftr__soc' })}</li><li>${extLink(S.contacts.twoGis.url, `${icon('pin', { size: 18 })}<span>2GIS</span>`, { cls: 'ftr__soc' })}</li></ul>
</div>
<nav class="ftr__nav" aria-label="${attr(tt(lang, 'ftr.menu'))}">${cols}</nav>
</div>
<div class="ftr__req wrap-wide">
<div class="ftr__req-block"><p class="ftr__h">${tt(lang, 'ftr.requisites')}</p><dl class="ftr__dl">
<div><dt>${tt(lang, 'bin')}</dt><dd>${S.legal.bin} <button type="button" class="copy-btn copy-btn--mini" data-copy="${S.legal.bin}" aria-label="${attr(tt(lang, 'copy') + ': ' + tt(lang, 'bin'))}">${icon('copy', { size: 14 })}</button></dd></div>
<div><dt>${tt(lang, 'licence')}</dt><dd><a href="${attr(ctx.href('license'))}">№ ${S.licence.current.number}</a> (${S.licence.current.date.split('-').reverse().join('.')}, ${esc(LL(lang, S.licence.current.term))})</dd></div>
<div><dt>${tt(lang, 'hdr.licensor')}</dt><dd>${esc(LL(lang, S.licensorShort))}</dd></div>
<div><dt>${tt(lang, 'legalAddress')}</dt><dd>${S.addresses.legal.postcode}, ${esc(LL(lang, S.addresses.legal.text))}</dd></div>
</dl></div>
<div class="ftr__req-block"><p class="ftr__h">${tt(lang, 'ftr.gov')}</p><ul class="ftr__gov" role="list">${gov}</ul></div>
</div>
<div class="ftr__bottom wrap-wide">
<p>© ${year} ${esc(LL(lang, S.legal.name))}. ${tt(lang, 'ftr.rights')}</p>
<ul class="ftr__links" role="list">
<li><a href="${attr(ctx.href('sitemap'))}">${esc(LL(lang, PAGE_LABELS.sitemap))}</a></li>
<li><a href="${attr(ctx.href('accessibility'))}">${tt(lang, 'a11y.title')}</a></li>
<li><a href="${attr(ctx.href('privacy'))}">${esc(LL(lang, PAGE_LABELS.privacy))}</a></li>
<li><a href="${attr(ctx.href('contacts'))}">${esc(LL(lang, PAGE_LABELS.contacts))}</a></li>
<li><a href="${attr(ctx.href('feedback'))}">${tt(lang, 'ftr.feedback')}</a></li>
<li><a href="${ctx.prefix === '../' ? 'rss.xml' : `/${lang}/rss.xml`}" data-rss>${icon('rss', { size: 14 })} ${tt(lang, 'ftr.rss')}</a></li>
</ul>
</div>
<p class="ftr__giant" aria-hidden="true">KEREMET</p>
</footer>`;
}

// ------------------------------------------------------------------ head
function head(page, lang, ctx, opts) {
  const V = (u) => (opts.version ? `${u}?v=${opts.version}` : u); // cache-busting for our own css/js (build hash)
  const title = strip(LL(lang, page.title));
  const siteName = tt(lang, 'site.name');
  // ≤ ~70 characters for search results (ORDER A.15): a long page title gets the short school name as its suffix
  const fullTitle = page.home ? `${siteName} — ${tt(lang, 'site.slogan')}` : `${title} — ${title.length > 40 ? tt(lang, 'site.titleShort') : siteName}`;
  const desc = strip(LL(lang, page.description)).slice(0, 300);
  const canonical = page.root ? '' : absUrl(page.slug, lang);
  const alternates = page.root || page.noindex ? '' : LANGS.map((l) => `<link rel="alternate" hreflang="${HTML_LANG[l]}" href="${absUrl(page.slug, l)}">`).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="${absUrl(page.slug, 'kz')}">`;
  const ogImage = `${SITE_URL}/assets/img/og-image.png`;
  const styles = (page.styles || []).map((s) => `<link rel="stylesheet" href="${V(ctx.asset(`css/pages/${s.replace(/\.css$/, '')}.css`))}">`).join('\n');
  const home = !!page.home;
  const has = opts.hasFile || (() => true);
  const early = `(function(){var d=document.documentElement;d.classList.add('js');try{var a=JSON.parse(localStorage.getItem('keremet-a11y')||'null');if(a&&a.on){d.setAttribute('data-a11y','on');['font','scheme','img','space','lh'].forEach(function(k){if(a[k])d.setAttribute('data-a11y-'+k,a[k])})}if(localStorage.getItem('keremet-motion')==='paused')d.setAttribute('data-motion','paused')}catch(e){}})();`;
  const jsonLd = (home || page.slug === 'about' || page.slug === 'contacts') ? `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'School', name: LL(lang, school.name), alternateName: [school.name.kz, school.name.ru, school.name.en, 'Keremet'],
    url: `${SITE_URL}/`, logo: `${SITE_URL}/assets/img/logo.svg`, telephone: school.contacts.phone.tel,
    address: { '@type': 'PostalAddress', postalCode: school.addresses.actual.postcode, addressLocality: 'Shymkent', streetAddress: LL(lang, school.addresses.actual.text), addressCountry: 'KZ' },
    geo: { '@type': 'GeoCoordinates', latitude: school.addresses.actual.lat, longitude: school.addresses.actual.lng },
    sameAs: [school.contacts.instagram.url, school.contacts.twoGis.url],
  }).replace(/</g, '\\u003c')}</script>` : '';
  const homeHead = home ? `
<script type="importmap">{"imports":{"three":"${ctx.asset('vendor/three.module.min.js')}","three/addons/":"${ctx.asset('vendor/three-addons/')}"}}</script>
<link rel="stylesheet" href="${ctx.asset('vendor/lenis.css')}">
${has('assets/css/home.css') ? `<link rel="stylesheet" href="${V(ctx.asset('css/home.css'))}">` : ''}
<script defer src="${ctx.asset('vendor/gsap.min.js')}"></script>
<script defer src="${ctx.asset('vendor/ScrollTrigger.min.js')}"></script>
<script defer src="${ctx.asset('vendor/lenis.min.js')}"></script>
${has('assets/js/home.js') ? `<script type="module" src="${V(ctx.asset('js/home.js'))}"></script>` : ''}` : '';
  return `<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${attr(desc)}">
${page.noindex ? '<meta name="robots" content="noindex, follow">\n' : ''}${canonical ? `<link rel="canonical" href="${canonical}">\n` : ''}${alternates}
<meta name="theme-color" content="#0B0F2B">
<meta name="color-scheme" content="light">
<meta name="format-detection" content="telephone=no">
<meta property="og:type" content="${page.ogType || (String(page.slug).startsWith('news-') ? 'article' : 'website')}">
<meta property="og:site_name" content="${attr(siteName)}">
<meta property="og:title" content="${attr(page.home ? siteName : title)}">
<meta property="og:description" content="${attr(desc)}">
${canonical ? `<meta property="og:url" content="${canonical}">\n` : ''}<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:locale" content="${OG_LOCALE[lang]}">
${LANGS.filter((l) => l !== lang).map((l) => `<meta property="og:locale:alternate" content="${OG_LOCALE[l]}">`).join('')}
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${ctx.asset('img/favicon.svg')}" type="image/svg+xml">
<link rel="apple-touch-icon" href="${ctx.asset('img/apple-touch-icon.png')}">
<link rel="alternate" type="application/rss+xml" title="${attr(`${siteName} — RSS`)}" href="${ctx.prefix === '../' ? 'rss.xml' : `/${lang}/rss.xml`}">
<script>${early}</script>
${(PRELOAD_FONTS[lang] || []).map((f) => `<link rel="preload" href="${ctx.asset(`fonts/${f}`)}" as="font" type="font/woff2" crossorigin>`).join('\n')}
<link rel="stylesheet" href="${V(ctx.asset('css/base.css'))}">
${styles}${homeHead}
<script type="module" src="${V(ctx.asset('js/main.js'))}"></script>
${jsonLd}
</head>`;
}

// ------------------------------------------------------------------ unconfirmed e-mail guard
/** While school.contacts.emailConfirmed is false, no page may carry a live mailto: link to the placeholder mailbox:
 *  any `<a href="mailto:…">` to it becomes plain text, followed by the "to be confirmed" badge unless one follows. */
function unlinkUnconfirmedEmail(html, lang) {
  // safety net: a page that printed S.contacts.email while it is null gets the pending text, never "null"/mailto:null
  // (the build still warns about it — the page should use ui.schoolEmail())
  html = html.replace(/<a\b[^>]*href="mailto:(?:null|undefined)?"[^>]*>[^<]*<\/a>(\s*<span class="(?:badge[^"]*|unconf[^"]*)"[^>]*>[^<]*<\/span>)?/g,
    `<span class="mail-unconf">${tt(lang, 'email.pending')}</span>`);
  const e = school.contacts.email;
  if (!e || school.contacts.emailConfirmed) return html;
  const safe = e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`<a\\b[^>]*href="mailto:${safe}[^"]*"[^>]*>([\\s\\S]*?)<\\/a>`, 'g');
  const badge = `<span class="badge badge--warn">${tt(lang, 'unconfirmed')}</span>`;
  return html.replace(re, (m, inner, at, all) => {
    const next = all.slice(at + m.length, at + m.length + 160);
    const hasBadge = /badge--warn|unconf/.test(next.slice(0, 80)) || next.includes(tt(lang, 'unconfirmed'));
    return `<span class="mail-unconf">${inner}</span>${hasBadge ? '' : ` ${badge}`}`;
  });
}

// ------------------------------------------------------------------ document
export function renderPage(page, lang, ctx, content, opts = {}) {
  const home = !!page.home;
  const theme = themeOf(page);
  const g = GROUPS[page.group] || groupOf(page.slug);
  const jsI18n = Object.fromEntries(JS_KEYS.map((k) => [k, tt(lang, k)]));
  const metaLine = pageMeta(page, { cls: home ? 'page-meta--home' : '' });
  const groupLabel = g && g.id !== 'util' ? LL(lang, g.label) : '';
  const heroTitle = LL(lang, page.heroTitle || page.title);
  const same = (a, b) => strip(a).toLocaleLowerCase() === strip(b).toLocaleLowerCase();

  const hero = home || page.noHero ? '' : pageHero({
    title: heroTitle,
    lead: LL(lang, page.lead ?? page.description),
    crumbs: crumbTrail(page, lang, ctx),
    eyebrow: groupLabel && !same(groupLabel, heroTitle) ? groupLabel : '',
    theme,
    accent: heroAccent(theme, lang),
    sub: subNav(page, lang, ctx),
  });

  content = unlinkUnconfirmedEmail(content, lang);
  const main = home
    ? `<main id="main" class="main main--home" tabindex="-1">${content.includes('<!--page-meta-->') ? content.replace('<!--page-meta-->', metaLine) : content + metaLine}</main>`
    : `<main id="main" class="main" tabindex="-1">${hero}<div class="page-body wrap">${content}</div>${metaLine}</main>`;

  return `<!DOCTYPE html>
<html lang="${HTML_LANG[lang]}" data-lang="${lang}" data-page="${attr(page.slug)}"${home ? ' class="is-home has-motion"' : page.motion ? ' class="has-motion"' : ''}>
<!-- ${esc(opts.buildInfo || 'Keremet build')} · page: ${esc(page.slug)} · lang: ${lang} -->
${head(page, lang, ctx, opts)}
<body class="page ${home ? 'page--home' : 'page--inner'}" data-accent="${theme}"${g ? ` data-group="${g.id}"` : ''}${home ? ' data-tone="dark"' : ''}>
<a class="skip-link" href="#main">${tt(lang, 'skip')}</a>
${a11yPanel(lang, ctx)}
${header(page, lang, ctx)}
${mobileNav(page, lang, ctx)}
${main}
${footer(page, lang, ctx)}
<button type="button" class="motion-toggle" data-motion-toggle aria-pressed="false">${icon('pause', { size: 18, cls: 'motion-toggle__pause' })}${icon('play', { size: 18, cls: 'motion-toggle__play' })}<span class="motion-toggle__txt">${tt(lang, 'motion.pause')}</span><span class="motion-toggle__short" aria-hidden="true">${tt(lang, 'motion.pauseShort')}</span></button>
<a class="to-top" href="#top" data-to-top aria-label="${attr(tt(lang, 'toTop'))}">${icon('arrow-up', { size: 22 })}</a>
<div class="sr-only" aria-live="polite" id="live"></div>
<script type="application/json" id="i18n">${JSON.stringify(jsI18n).replace(/</g, '\\u003c')}</script>
</body>
</html>
`;
}

export default renderPage;
