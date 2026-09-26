// Site search results page: search.html?q=…&g=<group>&sort=relevance|date (logic in main.js)
export default {
  slug: 'search',
  group: 'util',
  order: 10,
  noSearch: true,
  title: { kz: 'Сайттан іздеу', ru: 'Поиск по сайту', en: 'Site search' },
  crumb: { kz: 'Іздеу', ru: 'Поиск', en: 'Search' },
  description: {
    kz: '«Керемет» мектебі сайтының барлық беттері бойынша толық мәтінді іздеу, бөлім және күн бойынша кеңейтілген сүзгілер.',
    ru: 'Полнотекстовый поиск по всем страницам сайта школы «Керемет» с расширенными фильтрами по разделу и дате.',
    en: 'Full-text search across every page of the Keremet School website, with advanced filters by section and date.',
  },
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',
  render(lang, { ui, t, L, nav, href }) {
    const groups = Object.values(nav.GROUPS).filter((g) => g.id !== 'util');
    return `<div class="search-wrap stack stack--l" data-search-page data-index="../assets/search/${lang}.json">
<form class="search-page" action="${href('search')}" method="get" role="search">
  <label class="field__label" for="sp-q">${t('search.query')}</label>
  <div class="search-page__row">
    <input class="field__input" id="sp-q" name="q" type="search" maxlength="200" autocomplete="off" placeholder="${t('search.placeholder')}">
    <button class="btn btn--primary btn--l" type="submit">${ui.icon('search')}<span>${t('search.submit')}</span></button>
  </div>
  <details>
    <summary>${t('search.advanced')}</summary>
    <div class="search-page__adv">
      <div class="field"><label class="field__label" for="sp-g">${t('search.section')}</label>
        <select class="field__input" id="sp-g" name="g"><option value="">${t('search.allSections')}</option>${groups.map((g) => `<option value="${g.id}">${ui.esc(L(g.label))}</option>`).join('')}</select></div>
      <div class="field"><label class="field__label" for="sp-sort">${t('search.sort')}</label>
        <select class="field__input" id="sp-sort" name="sort"><option value="relevance">${t('search.byRelevance')}</option><option value="date">${t('search.byDate')}</option></select></div>
    </div>
  </details>
</form>
<p class="search-count" data-search-count role="status" aria-live="polite"></p>
<noscript>${ui.callout({ type: 'info', text: `${t('search.noscript')} <a href="${href('sitemap')}">${L(nav.PAGE_LABELS.sitemap)}</a>` })}</noscript>
<ol class="search-results" data-search-results role="list"></ol>
</div>`;
  },
};
