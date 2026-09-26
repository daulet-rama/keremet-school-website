// News feed (news.html) + one page per item (news-<id>.html).
// ORDER-114: O.91 (date, place, content, result in every item), O.92 (archive ≥ 3 years), B.16 (date, title,
// illustration, lead), M.89 (RSS — the build emits /{lang}/rss.xml from src/data/news.mjs), A.11 (published/updated).
// Only factual items live in src/data/news.mjs. Two dates per item: n.date = when the EVENT happened (feed order,
// archive year, stamp), n.posted = when the item appeared on this website (page published date, JSON-LD).
// Tag filter and year archive work without JavaScript (CSS :has()); ?tag=<id> preselects a category (tiny script).
import { news as RAW, sortedNews, NEWS_TAGS, postedOf, updatedOf } from '../data/news.mjs';
import { SITE_URL } from '../data/school.mjs';

const X = (kz, ru, en) => ({ kz, ru, en });
const PUBLISHED = '2026-09-24T10:00';
const UPDATED = '2026-09-24T10:00';
const ARCHIVE_YEARS = 3; // O.92: archive of at least 3 years

const MONTH_SHORT = {
  kz: ['қаң', 'ақп', 'нау', 'сәу', 'мам', 'мау', 'шіл', 'там', 'қыр', 'қаз', 'қар', 'жел'],
  ru: ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};
const iso = (n) => (n.time ? `${n.date}T${n.time}` : n.date); // event date (+ time only when really known)
const day = (stampIso) => String(stampIso).slice(0, 10);
const year = (n) => Number(n.date.slice(0, 4));
const plural = (lang, n, kz, ru1, ru2, ru5, en1, enN) => {
  if (lang === 'kz') return `${n} ${kz}`;
  if (lang === 'en') return `${n} ${n === 1 ? en1 : enN}`;
  const m10 = n % 10, m100 = n % 100;
  return `${n} ${m10 === 1 && m100 !== 11 ? ru1 : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? ru2 : ru5}`;
};
const cut = (s, max = 158) => { const t = String(s).replace(/<[^>]*>/g, ''); return t.length <= max ? t : `${t.slice(0, max - 1).replace(/\s+\S*$/, '')}…`; };

/** Date stamp (big day number + short month + year) shown over the illustration. Decorative. */
function stamp(lang, n) {
  const [y, m, d] = n.date.split('-');
  return `<span class="nw-stamp" aria-hidden="true"><b>${+d}</b><span>${MONTH_SHORT[lang][+m - 1]}</span><span>${y}</span></span>`;
}
function tagBadges(lang, n, { L }) {
  return (n.tags || []).map((tg) => `<li><span class="nw-tag nw-tag--${tg}">${L(NEWS_TAGS[tg] || tg)}</span></li>`).join('');
}

/** One feed item (card). lead=true → the big newest card. */
function item(lang, n, ctx, { lead = false } = {}) {
  const { ui, L, href, asset, fmt } = ctx;
  const url = href(`news-${n.id}`);
  const hid = `nw-h-${n.id}`;
  return `<article class="nw-item${lead ? ' nw-item--lead' : ''}" data-tags="${(n.tags || []).join(' ')}" aria-labelledby="${hid}">
<a class="nw-item__media pattern" data-theme="informatics" href="${url}" tabindex="-1" aria-hidden="true"${n.image ? ` style="--nw-bg:${n.image.bg || '#04060A'}"` : ''}>${n.image ? `<span class="nw-item__blur" style="background-image:url('${asset(n.image.src)}')"></span><img src="${asset(n.image.src)}" alt="" loading="${lead ? 'eager' : 'lazy'}" width="640" height="400">` : ''}${stamp(lang, n)}</a>
<div class="nw-item__body">
${lead ? `<p class="nw-item__kicker">${ui.icon('sparkles', { size: 16 })}<span>${L(X('Соңғы жаңалық', 'Последняя новость', 'Latest news'))}</span></p>` : ''}
<p class="nw-item__meta"><span>${ui.icon('calendar', { size: 16 })}<span class="sr-only">${L(X('Оқиға күні', 'Дата события', 'Event date'))}: </span><time datetime="${iso(n)}">${fmt.dateLong(n.date)}</time></span>${n.time ? `<span>${ui.icon('clock', { size: 16 })}<span>${n.time}</span></span>` : ''}${day(postedOf(n)) !== n.date ? `<span class="nw-item__posted">${L(X('сайтта', 'на сайте', 'posted'))} <time datetime="${postedOf(n)}">${fmt.date(postedOf(n))}</time></span>` : ''}</p>
<h3 class="nw-item__title" id="${hid}"><a href="${url}">${L(n.title)}</a></h3>
<p class="nw-item__lead">${L(n.lead)}</p>
${n.place ? `<p class="nw-item__place">${ui.icon('pin', { size: 16 })}<span><span class="sr-only">${L(X('Өткен орны', 'Место', 'Place'))}: </span>${L(n.place)}</span></p>` : ''}
<div class="nw-item__foot"><ul class="nw-tags" role="list" aria-label="${L(X('Санаттар', 'Рубрики', 'Categories'))}">${tagBadges(lang, n, ctx)}</ul><a class="nw-item__more" href="${url}" aria-hidden="true" tabindex="-1">${L(X('Толығырақ', 'Подробнее', 'Read more'))}${ui.icon('arrow-right', { size: 18 })}</a></div>
</div>
</article>`;
}

// =====================================================================================
//  news.html
// =====================================================================================
const feedPage = {
  slug: 'news',
  group: 'news',
  order: 10,
  title: { kz: 'Жаңалықтар', ru: 'Новости', en: 'News' },
  description: {
    kz: '«Керемет» мектебінің жаңалықтары: күні, өткен орны, мазмұны және нәтижесі. Жылдар бойынша мұрағат, санаттар сүзгісі және RSS-арна.',
    ru: 'Новости школы «Керемет»: дата, место, содержание и итог события. Архив по годам, фильтр по рубрикам и RSS-лента.',
    en: 'Keremet school news: date, place, content and outcome of every event. Archive by year, category filter and RSS feed.',
  },
  lead: {
    kz: 'Мектеп өмірі мен білім саласындағы маңызды оқиғалар: әр жаңалықта оқиға күні, өткен орны, мазмұны, нәтижесі және сайтта жарияланған күні көрсетіледі.',
    ru: 'События школы и важные новости образования: в каждой новости — дата события, место, содержание, итог и дата публикации на сайте.',
    en: 'School events and important education news: every item shows the event date, place, content, outcome and the date it was posted here.',
  },
  styles: ['news'],
  published: PUBLISHED,
  updated: UPDATED,

  render(lang, ctx) {
    const { ui, L, href, t } = ctx;
    const items = sortedNews();
    const newest = items[0];
    const latestYear = Math.max(new Date(UPDATED).getFullYear(), ...items.map(year));
    const years = [...new Set([...items.map(year), ...Array.from({ length: ARCHIVE_YEARS }, (_, i) => latestYear - i)])].sort((a, b) => b - a);
    const usedTags = Object.keys(NEWS_TAGS).filter((tg) => items.some((n) => (n.tags || []).includes(tg)));
    const count = (tg) => items.filter((n) => !tg || (n.tags || []).includes(tg)).length;
    const newsWord = (n) => plural(lang, n, 'жаңалық', 'новость', 'новости', 'новостей', 'item', 'items');

    // ---------------------------------------------------------------- toolbar: filter + years + RSS
    const filter = `<fieldset class="nw-filter"><legend class="nw-filter__legend">${L(X('Санат бойынша сүзу', 'Фильтр по рубрикам', 'Filter by category'))}</legend>
<div class="nw-filter__opts">
<input class="nw-radio" type="radio" name="nw-tag" id="nw-t-all" value="all" checked><label class="nw-chip" for="nw-t-all">${L(X('Барлығы', 'Все', 'All'))}<span class="nw-chip__n">${count()}</span></label>
${usedTags.map((tg) => `<input class="nw-radio" type="radio" name="nw-tag" id="nw-t-${tg}" value="${tg}"><label class="nw-chip nw-chip--${tg}" for="nw-t-${tg}">${L(NEWS_TAGS[tg])}<span class="nw-chip__n">${count(tg)}</span></label>`).join('\n')}
</div></fieldset>`;
    const yearNav = `<nav class="nw-years" aria-label="${L(X('Жылдар бойынша мұрағат', 'Архив по годам', 'Archive by year'))}"><p class="nw-years__k">${ui.icon('calendar', { size: 16 })}<span>${L(X('Мұрағат', 'Архив', 'Archive'))}</span></p><ul role="list">${years.map((y) => `<li><a href="#y-${y}">${y}</a></li>`).join('')}</ul></nav>`;
    const rssBtn = ui.button({ href: 'rss.xml', label: 'RSS', kind: 'ghost', size: 's', iconLeft: 'rss', cls: 'nw-rss-btn', attrs: { type: 'application/rss+xml', title: t('ftr.rss') } });
    const toolbar = `<div class="nw-tools">${filter}<div class="nw-tools__side">${yearNav}${rssBtn}</div></div>`;

    // ---------------------------------------------------------------- feed by year
    const yearBlocks = years.map((y) => {
      const list = items.filter((n) => year(n) === y);
      const head = `<header class="nw-year__head"><h2 class="nw-year__title" id="y-${y}-title">${y}</h2><p class="nw-year__count">${list.length ? newsWord(list.length) : L(X('жарияланым жоқ', 'нет публикаций', 'no items'))}</p></header>`;
      const body = list.length
        ? `<div class="nw-year__list">${list.map((n) => item(lang, n, ctx, { lead: n === newest })).join('')}</div>`
        : `<div class="nw-year__empty">${ui.pending(lang, X(
          `${y} жылғы жаңалықтар мұрағаты толықтырылуда.`,
          `Архив новостей за ${y} год пополняется.`,
          `The news archive for ${y} is being filled.`,
        ))}</div>`;
      return `<section class="nw-year${list.length ? '' : ' nw-year--empty'}" id="y-${y}" aria-labelledby="y-${y}-title">${head}${body}</section>`;
    }).join('');
    const empty = `<div class="nw-nomatch" role="note">${ui.icon('search', { size: 20 })}<span>${L(X('Бұл санатта жаңалық әзірге жоқ.', 'В этой рубрике пока нет новостей.', 'No news in this category yet.'))}</span></div>`;
    const feed = `<div class="nw" id="feed">${toolbar}<div class="nw-feed">${yearBlocks}${empty}</div></div>`;

    // ---------------------------------------------------------------- what every item contains (O.91)
    const anatomy = ui.cards([
      { icon: 'calendar', title: X('Оқиға күні', 'Дата события', 'Event date'), text: X('Оқиға болған күн. Сайтта жарияланған және соңғы өзгертілген күні мен уақыты бөлек көрсетіледі.', 'Когда произошло событие. Дата и время публикации на сайте и последнего изменения указываются отдельно.', 'When the event happened. The date and time it was posted here and last edited are shown separately.') },
      { icon: 'pin', title: X('Өткен орны', 'Место', 'Place'), text: X('Мекенжай, мекеме немесе онлайн-алаң.', 'Адрес, организация или онлайн-площадка.', 'Address, institution or online venue.') },
      { icon: 'doc', title: X('Мазмұны', 'Содержание', 'Content'), text: X('Не болды, кім қатысты, суреттер.', 'Что произошло, кто участвовал, фото.', 'What happened, who took part, photos.') },
      { icon: 'check', title: X('Нәтижесі', 'Итог', 'Outcome'), text: X('Іс-шараның нақты нәтижесі немесе шешімі.', 'Конкретный результат события или принятое решение.', 'The concrete outcome of the event or the decision taken.') },
    ], { cols: 4, variant: 'feature' });

    // ---------------------------------------------------------------- note for the school (NOT published)
    // ORDER-114 O.91 / п.109: the news feed must be updated DAILY, other sections within 3 working days
    // (Order No. 124-NK of the Minister of Culture and Information, 31.03.2025, Annex 1 item 7;
    //  Law "On access to information" art. 16(13), https://adilet.zan.kz/rus/docs/Z1500000401).
    // School to-do: every item needs event date, place, content, outcome and at least one photo
    // (children only with parental consent); add 2024 and 2025 items with exact dates (the archive
    // must cover at least 3 years); appoint a staff member to post news in kz/ru/en.
    // progressive enhancement: news.html?tag=admission preselects a category; the choice is kept in the URL
    const tagScript = `<script>(function(){var f=document.querySelector('.nw');if(!f)return;try{var q=new URLSearchParams(location.search).get('tag');if(q){var r=document.getElementById('nw-t-'+q.replace(/[^a-z-]/g,''));if(r)r.checked=true;}}catch(e){}f.addEventListener('change',function(e){var r=e.target;if(!r||r.name!=='nw-tag')return;try{var u=new URL(location.href);if(r.value==='all')u.searchParams.delete('tag');else u.searchParams.set('tag',r.value);history.replaceState(null,'',u.pathname+u.search+u.hash);}catch(x){}});})();</script>`;

    // ---------------------------------------------------------------- RSS panel (M.89)
    const rssAbs = `${SITE_URL}/${lang}/rss.xml`;
    const rss = ui.split({
      ratio: '3:2', align: 'center',
      left: `<div class="flow">${ui.eyebrow('RSS 2.0')}
<h2 class="sec__title" id="rss-title">${L(X('Жаңалықтарға RSS арқылы жазылыңыз', 'Подпишитесь на новости через RSS', 'Subscribe to the news via RSS'))}</h2>
${ui.more({ cls: 'nw-rss-more', label: X('Қалай жазылуға болады', 'Как подписаться', 'How to subscribe'), summary: X('RSS — жаңалықтарды сайтқа кірмей-ақ алу тәсілі.', 'RSS — способ получать новости, не заходя на сайт.', 'RSS lets you get the news without visiting the site.'), body: X(
        '<p>Арна мекенжайын кез келген RSS-оқырманға (мысалы, Feedly, Inoreader, пошта бағдарламасы немесе браузер кеңейтімі) қосыңыз: жаңа жарияланым шыққанда ол бірден көрсетіледі. Әр тілдің өз арнасы бар.</p>',
        '<p>Добавьте адрес ленты в любую программу для чтения RSS (например, Feedly, Inoreader, почтовый клиент или расширение браузера): новые публикации появятся там сразу. У каждого языка своя лента.</p>',
        '<p>Add the feed address to any RSS reader (Feedly, Inoreader, a mail client or a browser extension) and new posts appear there straight away. Each language has its own feed.</p>',
      ) })}
<ul class="nw-feeds" role="list">${['kz', 'ru', 'en'].map((l) => `<li><a href="${l === lang ? 'rss.xml' : `../${l}/rss.xml`}" type="application/rss+xml" hreflang="${{ kz: 'kk', ru: 'ru', en: 'en' }[l]}">${ui.icon('rss', { size: 16 })}<span>${{ kz: 'Қазақша', ru: 'Русский', en: 'English' }[l]}</span></a></li>`).join('')}</ul></div>`,
      right: `<div class="nw-term" role="group" aria-label="${L(X('Арна мекенжайы', 'Адрес ленты', 'Feed address'))}"><div class="nw-term__bar" aria-hidden="true"><i></i><i></i><i></i><span>rss.xml</span></div>
<p class="nw-term__line"><span aria-hidden="true">&gt; </span>${L(X('жазылу', 'подписаться', 'subscribe'))}</p><p class="nw-term__url"><code>${rssAbs}</code></p>
<div class="nw-term__actions"><button type="button" class="btn btn--gold btn--s" data-copy="${rssAbs}">${ui.icon('copy', { size: 18 })}<span>${L(X('Мекенжайды көшіру', 'Скопировать адрес', 'Copy address'))}</span></button><a class="btn btn--light btn--s" href="rss.xml" type="application/rss+xml">${ui.icon('rss', { size: 18 })}<span>${L(X('Арнаны ашу', 'Открыть ленту', 'Open feed'))}</span></a></div></div>`,
    });

    // ---------------------------------------------------------------- send us news + related
    const tip = ui.callout({
      type: 'info', icon: 'chat',
      title: X('Жаңалық ұсыныңыз', 'Предложите новость', 'Suggest a story'),
      text: X(
        `Мектеп өміріндегі маңызды оқиға туралы айтқыңыз келе ме? <a href="${href('feedback')}">Өтініш формасы</a> арқылы жазыңыз. Жаңалықтар мектептің ресми ${ui.extLink(ctx.S.contacts.instagram.url, 'Instagram')} парақшасында да жарияланады.`,
        `Хотите рассказать о важном событии в жизни школы? Напишите через <a href="${href('feedback')}">форму обращения</a>. Новости также публикуются на официальной странице школы в ${ui.extLink(ctx.S.contacts.instagram.url, 'Instagram')}.`,
        `Want to share an important school event? Write to us via the <a href="${href('feedback')}">feedback form</a>. News is also posted on the school’s official ${ui.extLink(ctx.S.contacts.instagram.url, 'Instagram')} page.`,
      ),
    });
    const related = ui.linkList([
      { href: href('events'), icon: 'calendar', label: X('Іс-шаралар күнтізбесі', 'Календарь событий', 'Events calendar'), note: X('2026–2027 оқу жылы: мерекелер мен демалыстар', '2026–2027 учебный год: праздники и каникулы', '2026–2027: holidays and school breaks') },
      { href: href('projects'), icon: 'bulb', label: X('Мектеп жобалары', 'Проекты школы', 'School projects'), note: X('Робототехника, олимпиадалық математика және т.б.', 'Робототехника, олимпиадная математика и др.', 'Robotics, olympiad maths and more') },
      { href: href('documents'), icon: 'doc', label: X('Құжаттар', 'Документы', 'Documents'), note: X('Мектептің ішкі құжаттары', 'Внутренние документы школы', 'The school’s internal documents') },
      { href: ctx.S.contacts.instagram.url, icon: 'instagram', label: X('Мектептің Instagram парақшасы', 'Страница школы в Instagram', 'The school on Instagram'), note: ctx.S.contacts.instagram.handle },
    ]);

    return [
      feed,
      tagScript,
      ui.section({ id: 'anatomy', eyebrow: X('Жаңалық стандарты', 'Стандарт новости', 'News standard'), title: X('Әр жаңалықта не бар', 'Что есть в каждой новости', 'What every item includes'), lead: X('Әр жарияланымда — төрт міндетті элемент.', 'В каждой публикации — четыре обязательных элемента.', 'Every post has four mandatory elements.'), body: anatomy + `<div class="nw-anat-law">${ui.legal(X('Білім беру ұйымдарының сайттарына қойылатын талаптарға сәйкес әр жарияланымда төрт міндетті элемент болады.', 'В соответствии с требованиями к сайтам организаций образования в каждой публикации есть четыре обязательных элемента.', 'In line with the requirements for education websites, every post has four mandatory elements.'))}</div>` }),
      `<section class="sec sec--themed nw-rss" id="rss" data-theme="informatics" aria-labelledby="rss-title" data-reveal><div class="sec__panel pattern">${rss}</div></section>`,
      tip,
      ui.section({ title: X('Осы бөлімде', 'В этом разделе', 'In this section'), body: related }),
    ].join('\n');
  },
};

// =====================================================================================
//  news-<id>.html — one page per item
// =====================================================================================
const GLYPH = {
  telegram: '<path d="M21.5 4.5 2.8 11.7c-.8.3-.8 1.4 0 1.7l4.6 1.6 1.8 5.6c.2.7 1.1.9 1.6.4l2.6-2.5 4.8 3.5c.6.4 1.4.1 1.6-.6l3.1-15.6c.2-.8-.6-1.4-1.4-1.1Z"/><path d="m7.4 15 10.1-7.6-7.8 8.9"/>',
  facebook: '<path d="M14.5 21v-7.5h2.8l.5-3.3h-3.3V8.1c0-.9.4-1.7 1.8-1.7H18V3.5c-.5-.1-1.5-.2-2.6-.2-2.7 0-4.3 1.6-4.3 4.5v2.4H8.3v3.3h2.8V21"/>',
};
const glyph = (id, ui) => (GLYPH[id]
  ? `<svg class="ico" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${GLYPH[id]}</svg>`
  : ui.icon(id, { size: 18 }));
const SHARE = [
  { id: 'whatsapp', label: 'WhatsApp', url: (u, tt) => `https://wa.me/?text=${encodeURIComponent(`${tt} ${u}`)}` },
  { id: 'telegram', label: 'Telegram', url: (u, tt) => `https://t.me/share/url?url=${encodeURIComponent(u)}&text=${encodeURIComponent(tt)}` },
  { id: 'facebook', label: 'Facebook', url: (u) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}` },
];

function itemPage(n) {
  return {
    slug: `news-${n.id}`,
    group: 'news',
    hidden: true,
    order: 100,
    title: n.title,
    description: { kz: cut(n.lead.kz), ru: cut(n.lead.ru), en: cut(n.lead.en) },
    lead: n.lead,
    styles: ['news'],
    ogType: 'article',
    published: postedOf(n), // when the item appeared on this website — never the (earlier) event date
    updated: updatedOf(n),

    render(lang, ctx) {
      const { ui, L, href, asset, fmt, docById } = ctx;
      const all = sortedNews();
      const i = all.findIndex((x) => x.id === n.id);
      const newer = i > 0 ? all[i - 1] : null;
      const older = i < all.length - 1 ? all[i + 1] : null;
      const abs = `${SITE_URL}/${lang}/news-${n.id}.html`;
      const title = String(L(n.title));

      const metaCell = (ic, k, v) => `<div class="nw-fact"><span class="nw-fact__icon">${ui.icon(ic, { size: 20 })}</span><dt>${L(k)}</dt><dd>${v}</dd></div>`;
      const doc = n.doc && docById ? docById(n.doc) : null;
      const sources = n.sources || [];
      const sourceCell = doc
        ? `<a href="${href('license')}">${L(doc.title)}</a>${doc.file ? ` · <a href="${asset(doc.file)}">${(doc.type || 'file').toUpperCase()}</a>` : ''}`
        : sources.length ? ui.extLink(sources[0].url, sources[0].label)
          : L(X('Мектептің ресми сайты', 'Официальный сайт школы', 'The school’s official website'));
      const posted = postedOf(n);
      const facts = `<dl class="nw-facts">
${metaCell('calendar', X('Оқиға күні', 'Дата события', 'Event date'), `<time datetime="${iso(n)}">${fmt.dateLong(n.date)}${n.time ? `, ${n.time}` : ''}</time>`)}
${metaCell('pin', X('Өткен орны', 'Место', 'Place'), n.place ? L(n.place) : L(X('Нақтылануда', 'Уточняется', 'To be confirmed')))}
${metaCell('grid', X('Санаты', 'Рубрика', 'Category'), `<ul class="nw-tags" role="list">${tagBadges(lang, n, ctx)}</ul>`)}
${metaCell('info', X('Дереккөз', 'Источник', 'Source'), sourceCell)}
${metaCell('clock', X('Сайтта жарияланды', 'Опубликовано на сайте', 'Posted on this site'), `<time datetime="${posted}">${fmt.dateTime(posted)}</time>${updatedOf(n) !== posted ? `<span class="nw-fact__sub">${L(X('Өзгертілді', 'Изменено', 'Edited'))}: <time datetime="${updatedOf(n)}">${fmt.dateTime(updatedOf(n))}</time></span>` : ''}`)}
</dl>`;
      const sourceList = sources.length > 1
        ? `<div class="nw-article__sec nw-article__src">${ui.legal(sources.map((x) => ({ title: x.label, href: x.url })), { title: X('Ресми дереккөздер', 'Официальные источники', 'Official sources') })}</div>`
        : '';

      const figure = n.image ? `<figure class="nw-figure" style="--nw-bg:${n.image.bg || '#04060A'}"><img src="${asset(n.image.src)}" alt="${ui.esc(L(n.image.alt))}" width="1280" height="800"><figcaption>${ui.icon('image', { size: 16 })}<span>${L(n.image.alt)} · ${L(X('иллюстрация', 'иллюстрация', 'illustration'))}</span></figcaption></figure>` : '';

      const result = n.result
        ? ui.callout({ type: 'ok', icon: 'check', text: L(n.result) })
        : ui.pending(lang, X('Іс-шараның нәтижесі толықтырылуда.', 'Итог события уточняется.', 'The outcome is being confirmed.'));

      const share = `<div class="nw-share" role="group" aria-labelledby="share-title"><p class="nw-share__title" id="share-title">${ui.icon('arrow-up', { size: 18 })}<span>${L(X('Жаңалықпен бөлісу', 'Поделиться новостью', 'Share this story'))}</span></p>
<ul role="list">${SHARE.map((s) => `<li>${ui.extLink(s.url(abs, title), `${glyph(s.id, ui)}<span>${s.label}</span>`, { cls: `nw-share__a nw-share__a--${s.id}` })}</li>`).join('')}
<li><button type="button" class="nw-share__a nw-share__a--copy" data-copy="${abs}">${ui.icon('copy', { size: 18 })}<span>${L(X('Сілтемені көшіру', 'Копировать ссылку', 'Copy link'))}</span></button></li></ul></div>`;

      const pagerCard = (x, dir) => x
        ? `<a class="nw-pager__a nw-pager__a--${dir}" href="${href(`news-${x.id}`)}" rel="${dir === 'older' ? 'prev' : 'next'}"><span class="nw-pager__dir">${ui.icon(dir === 'older' ? 'arrow-left' : 'arrow-right', { size: 18 })}<span>${L(dir === 'older' ? X('Алдыңғы жаңалық', 'Предыдущая новость', 'Previous story') : X('Келесі жаңалық', 'Следующая новость', 'Next story'))}</span></span><span class="nw-pager__title">${L(x.title)}</span><time class="nw-pager__date" datetime="${iso(x)}">${fmt.date(x.date)}</time></a>`
        : `<span class="nw-pager__a nw-pager__a--none nw-pager__a--${dir}" aria-hidden="true"><span class="nw-pager__dir">${L(dir === 'older' ? X('Бұл — ең алғашқы жаңалық', 'Это самая ранняя новость', 'This is the earliest story') : X('Бұл — ең соңғы жаңалық', 'Это самая свежая новость', 'This is the latest story'))}</span></span>`;
      const pager = `<nav class="nw-pager" aria-label="${L(X('Басқа жаңалықтар', 'Другие новости', 'More stories'))}">${pagerCard(older, 'older')}<a class="nw-pager__all" href="${href('news')}">${ui.icon('grid', { size: 20 })}<span>${L(X('Барлық жаңалықтар', 'Все новости', 'All news'))}</span></a>${pagerCard(newer, 'newer')}</nav>`;

      const ld = {
        '@context': 'https://schema.org', '@type': 'NewsArticle', headline: title.slice(0, 110), description: String(L(n.lead)),
        datePublished: `${posted}:00+05:00`, dateModified: `${updatedOf(n)}:00+05:00`, inLanguage: { kz: 'kk', ru: 'ru', en: 'en' }[lang],
        image: n.image ? [`${SITE_URL}/assets/${n.image.src}`] : undefined, mainEntityOfPage: abs,
        publisher: { '@type': 'EducationalOrganization', name: String(L(ctx.S.name)), logo: { '@type': 'ImageObject', url: `${SITE_URL}/assets/img/logo.svg` } },
        ...(n.place ? { contentLocation: { '@type': 'Place', name: String(L(n.place)) } } : {}),
      };

      // a long unbreakable token in the title (e.g. "№ KZ29LAM00002781") must fit a 360px phone without breaking mid-token
      const longest = Math.max(...title.split(/[ \t]+/).map((w) => w.length));
      const fit = longest >= 13 ? `<style>@media (max-width:559px){html[data-page="news-${n.id}"] .phero__title{font-size:min(${(100 / (longest * 1.02)).toFixed(2)}vw,2.1rem)}}</style>` : '';

      return [
        fit,
        `<article class="nw-article" aria-labelledby="page-title">
${facts}
${figure}
<section class="nw-article__sec" aria-labelledby="content-title"><h2 class="nw-article__h" id="content-title">${L(X('Мазмұны', 'Содержание', 'Details'))}</h2><div class="prose nw-prose">${L(n.body)}</div></section>
<section class="nw-article__sec" aria-labelledby="result-title"><h2 class="nw-article__h" id="result-title">${L(X('Нәтижесі', 'Итог', 'Outcome'))}</h2>${result}</section>
${sourceList}
${share}
</article>`,
        pager,
        ui.section({ title: X('Осы бөлімде', 'В этом разделе', 'In this section'), body: ui.linkList([
          { href: href('news'), icon: 'grid', label: X('Жаңалықтар мұрағаты', 'Архив новостей', 'News archive'), note: X('Жылдар және санаттар бойынша', 'По годам и рубрикам', 'By year and category') },
          { href: href('events'), icon: 'calendar', label: X('Іс-шаралар күнтізбесі', 'Календарь событий', 'Events calendar') },
          { href: href('projects'), icon: 'bulb', label: X('Мектеп жобалары', 'Проекты школы', 'School projects') },
          { href: 'rss.xml', icon: 'rss', label: X('RSS-арна', 'RSS-лента', 'RSS feed'), note: X('Жаңалықтарға жазылу', 'Подписка на новости', 'Subscribe to the news') },
        ]) }),
        `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`,
      ].join('\n');
    },
  };
}

export default [feedPage, ...RAW.map(itemPage)];
