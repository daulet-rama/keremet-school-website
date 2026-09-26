// Root 404 page (dist/404.html). Rendered once, in Kazakh, with root-absolute links (/kz/…, /assets/…).
export default {
  slug: '404',
  group: 'util',
  root: true,
  hidden: true,
  noindex: true,
  noSearch: true,
  noMeta: true,
  title: { kz: 'Бет табылмады', ru: 'Страница не найдена', en: 'Page not found' },
  description: { kz: 'Сұралған бет табылмады.', ru: 'Запрошенная страница не найдена.', en: 'The requested page was not found.' },
  updated: '2026-09-24T10:00',
  render(lang, { ui }) {
    return `<div class="stack stack--l" style="max-width:820px">
<p class="display" style="font-size:clamp(4rem,14vw,9rem);line-height:1;color:var(--deco);letter-spacing:-.04em" aria-hidden="true">404</p>
${['kz', 'ru', 'en'].map((l) => ({ kz: ['Бет табылмады', 'Сұралған бет жоқ немесе басқа мекенжайға көшірілген.', 'Басты бетке оралу'], ru: ['Страница не найдена', 'Запрошенная страница не существует или перемещена.', 'На главную'], en: ['Page not found', 'The page you requested does not exist or has moved.', 'Go to the home page'] })[l]).map(([h, p, a], i) => {
      const l = ['kz', 'ru', 'en'][i];
      return `<div lang="${{ kz: 'kk', ru: 'ru', en: 'en' }[l]}"><h2 style="font-size:var(--fs-h3)">${h}</h2><p class="muted" style="margin-top:6px">${p}</p><p style="margin-top:10px"><a href="/${l}/index.html">${a}</a> · <a href="/${l}/sitemap.html">${{ kz: 'Сайт картасы', ru: 'Карта сайта', en: 'Site map' }[l]}</a> · <a href="/${l}/search.html">${{ kz: 'Іздеу', ru: 'Поиск', en: 'Search' }[l]}</a></p></div>`;
    }).join('')}
</div>`;
  },
};
