// Site map — generated from src/nav.mjs (every page ≤ 2 clicks from here).
export default {
  slug: 'sitemap',
  group: 'util',
  order: 20,
  title: { kz: 'Сайт картасы', ru: 'Карта сайта', en: 'Site map' },
  description: {
    kz: '«Керемет» мектебі сайтының барлық бөлімдері мен беттерінің толық тізімі.',
    ru: 'Полный перечень всех разделов и страниц сайта школы «Керемет».',
    en: 'A complete list of all sections and pages of the Keremet School website.',
  },
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',
  render(lang, { ui, L, nav, href }) {
    const { TOP, GROUPS, PAGE_LABELS } = nav;
    const X = (kz, ru, en) => ({ kz, ru, en });
    const tops = TOP.map((top, i) => `<section class="sitemap__top" aria-labelledby="sm-${top.id}">
<p class="eyebrow"><span class="eyebrow__dot" aria-hidden="true"></span>0${i + 1}</p>
<h2 id="sm-${top.id}">${ui.esc(L(top.label))}</h2>
<p class="muted small" style="margin-top:6px">${ui.esc(L(top.intro))}</p>
${top.groups.map((gid) => { const g = GROUPS[gid]; return `<div class="sitemap__group" data-accent="${g.theme}"><p class="sitemap__gtitle"><span class="mega__swatch" aria-hidden="true"></span>${ui.esc(L(g.label))}</p><ul>${g.pages.map((s) => `<li><a href="${href(s)}">${ui.esc(L(PAGE_LABELS[s]))}</a></li>`).join('')}</ul></div>`; }).join('')}
</section>`).join('');
    const util = GROUPS.util;
    const utilBlock = `<section class="sitemap__top" aria-labelledby="sm-util"><h2 id="sm-util">${ui.esc(L(util.label))}</h2><div class="sitemap__group"><ul>
<li><a href="${href('index')}">${L(X('Басты бет', 'Главная', 'Home'))}</a></li>
${util.pages.map((s) => `<li><a href="${href(s)}">${ui.esc(L(PAGE_LABELS[s]))}</a></li>`).join('')}
<li><a href="rss.xml">${L(X('Жаңалықтардың RSS-арнасы', 'RSS-лента новостей', 'News RSS feed'))}</a></li>
<li><a href="../sitemap.xml">sitemap.xml</a></li>
</ul></div></section>`;
    return `<div class="sitemap">${tops}${utilBlock}</div>`;
  },
};
