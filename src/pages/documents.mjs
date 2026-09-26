// School documents — every internal document from src/data/documents.mjs, grouped, with format & size,
// date & number, client-side filters (progressive enhancement) and an archive by school year (ORDER-114 §K 75–77).
const X = (kz, ru, en) => ({ kz, ru, en });

/** Document groups of src/data/documents.mjs → label, icon, related page. */
export const DOC_GROUPS = [
  { id: 'founding', icon: 'building', page: 'about', label: X('Құрылтай құжаттары', 'Учредительные документы', 'Founding documents') },
  { id: 'license', icon: 'shield', page: 'license', label: X('Лицензия', 'Лицензия', 'Licence') },
  { id: 'governance', icon: 'sitemap', page: 'structure', label: X('Басқару', 'Управление', 'Governance') },
  { id: 'plan', icon: 'target', page: 'development-plan', label: X('Даму жоспары', 'План развития', 'Development plan') },
  { id: 'rules', icon: 'book', page: null, label: X('Ішкі тәртіп', 'Внутренний распорядок', 'Internal rules') },
  { id: 'education', icon: 'graduation', page: 'curriculum', label: X('Оқу процесі', 'Учебный процесс', 'Teaching and learning') },
  { id: 'upbringing', icon: 'heart', page: 'upbringing', label: X('Тәрбие жұмысы', 'Воспитательная работа', 'Upbringing') },
  { id: 'admission', icon: 'users', page: 'admission', label: X('Қабылдау', 'Приём', 'Admission') },
  { id: 'campus', icon: 'school', page: 'facilities', label: X('Ғимарат және қызметтер', 'Здание и службы', 'Building and services') },
  { id: 'meals', icon: 'utensils', page: 'meals', label: X('Тамақтану', 'Питание', 'Meals') },
  { id: 'safety', icon: 'warn', page: 'safety', label: X('Қауіпсіздік', 'Безопасность', 'Safety') },
  { id: 'board', icon: 'handshake', page: 'board', label: X('Қамқоршылық кеңес', 'Попечительский совет', 'Board of Trustees') },
  { id: 'finance', icon: 'coins', page: 'finance', label: X('Қаржы', 'Финансы', 'Finance') },
  { id: 'anticorruption', icon: 'scale', page: 'anticorruption', label: X('Сыбайлас жемқорлыққа қарсы іс-қимыл', 'Противодействие коррупции', 'Anti-corruption') },
  { id: 'privacy', icon: 'lock', page: 'privacy', label: X('Дербес деректер', 'Персональные данные', 'Personal data') },
];

/** Every document now lives in src/data/documents.mjs (the former page-level extras were moved there). EXTRA_DOCS
 *  stays as an empty hook for registryOf(). */
export const EXTRA_DOCS = [];

/** Registry helpers that include EXTRA_DOCS (ctx = page render context). For an id already in the data file
 *  the data entry wins (file, date, number…); only its title is made more specific. */
export function registryOf(ctx) {
  const extra = new Map(EXTRA_DOCS.map((d) => [d.id, d]));
  const have = new Set(ctx.docs.map((d) => d.id));
  const all = [...ctx.docs.map((d) => (extra.has(d.id) ? { ...d, title: extra.get(d.id).title } : d)), ...EXTRA_DOCS.filter((d) => !have.has(d.id))];
  const byGroup = (g) => all.filter((d) => d.group === g).sort((a, b) => (a.file || a.url ? 0 : 1) - (b.file || b.url ? 0 : 1));
  const byId = (id) => all.find((d) => d.id === id) || null;
  return { all, byGroup, byId };
}

/** School year ("2025–2026") a date belongs to: September–August. */
export function schoolYearOf(iso) {
  if (!iso) return null;
  const [y, m] = iso.split('-').map(Number);
  const start = m >= 9 ? y : y - 1;
  return `${start}–${start + 1}`;
}

/** Tiny progressive-enhancement filter used by the documents group pages (no dependencies).
 *  Markup: [data-dx-filter] root › [data-dx-toolbar hidden] with [data-dx-q], [data-dx-cat] / [data-dx-st] buttons,
 *  [data-dx-count], [data-dx-empty]; items = [data-dx-item] or `.doc` inside [data-dx-group data-cat].
 *  Pending = `.doc--pending` or [data-pending]; <details data-dx-pend> folds open while a search / «pending» filter
 *  matches rows inside it, its [data-dx-pend-n] shows the visible count, and it hides when nothing inside matches. */
export function dxFilterScript() {
  return `<script>(function(){var R=document.querySelectorAll('[data-dx-filter]');[].forEach.call(R,function(root){var bar=root.querySelector('[data-dx-toolbar]');if(!bar)return;bar.hidden=false;var q=root.querySelector('[data-dx-q]'),cats=[].slice.call(root.querySelectorAll('[data-dx-cat]')),sts=[].slice.call(root.querySelectorAll('[data-dx-st]')),items=[].slice.call(root.querySelectorAll('[data-dx-item],[data-dx-group] .doc')),groups=[].slice.call(root.querySelectorAll('[data-dx-group]')),cnt=root.querySelector('[data-dx-count]'),empty=root.querySelector('[data-dx-empty]'),pends=[].slice.call(root.querySelectorAll('[data-dx-pend]')),cat='*',st='*';function n(s){return String(s||'').toLocaleLowerCase().replace(/\\s+/g,' ').trim();}items.forEach(function(it){it._t=n(it.textContent);if(!it.getAttribute('data-cat')){var g=it.closest('[data-dx-group]');it.setAttribute('data-cat',g&&g.getAttribute('data-cat')||'');}});function apply(){var term=n(q&&q.value),c=0;items.forEach(function(it){var p=it.classList.contains('doc--pending')||it.hasAttribute('data-pending');var ok=(cat==='*'||it.getAttribute('data-cat')===cat)&&(st==='*'||(st==='pending')===p)&&(!term||it._t.indexOf(term)>-1);it.hidden=!ok;if(ok)c++;});var act=!!term||st==='pending';pends.forEach(function(d){var v=d.querySelectorAll('[data-dx-item]:not([hidden])').length,k=d.querySelector('[data-dx-pend-n]');d.hidden=!v;if(k)k.textContent=v;if(act&&v){d.open=true;d._auto=true;}else if(!act&&d._auto){d.open=false;d._auto=false;}});groups.forEach(function(g){g.hidden=!g.querySelector('[data-dx-item]:not([hidden]),.doc:not([hidden])');});if(cnt)cnt.textContent=c;if(empty)empty.hidden=c>0;}function bind(list,attr,set){list.forEach(function(b){b.addEventListener('click',function(){list.forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false');});set(b.getAttribute(attr));apply();});});}bind(cats,'data-dx-cat',function(v){cat=v;});bind(sts,'data-dx-st',function(v){st=v;});if(q){q.addEventListener('input',apply);q.addEventListener('search',apply);}});})();</script>`;
}

export default {
  slug: 'documents',
  group: 'documents',
  order: 10,
  title: { kz: 'Ішкі құжаттар', ru: 'Внутренние документы', en: 'School documents' },
  description: {
    kz: 'Мектептің ішкі құжаттары: лицензия, тіркеу, ережелер, бұйрықтар, жоспарлар — күні, нөмірі, форматы мен көлемі және 3 жылдық мұрағат.',
    ru: 'Внутренние документы школы: лицензия, регистрация, положения, приказы, планы — с датой, номером, форматом, размером и архивом за 3 года.',
    en: 'School documents: licence, registration, regulations, orders and plans — with date, number, format, size and a 3-year archive.',
  },
  styles: ['documents'],
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, ctx) {
    const { ui, L, href, asset, fmt, latestDocuments } = ctx;
    const R = registryOf(ctx);
    const all = R.all;
    const docsByGroup = R.byGroup;
    // ui.section() always marks sections for reveal-on-scroll; very tall sections (the registry is ~7,500 px on a
    // phone) never reach main.js's 8 % visibility threshold, so they are rendered without it.
    const noReveal = (html) => html.replace(/ data-reveal(="")?(?=[\s>])/, '');
    const published = all.filter((d) => d.file || d.url);
    const pendingN = all.length - published.length;
    const currentYear = schoolYearOf('2026-09-24');
    const startY = Number(currentYear.slice(0, 4));
    const years = [0, 1, 2, 3].map((i) => `${startY - i}–${startY - i + 1}`);

    // ------------------------------------------------------------ intro + stats
    const isPub = (d) => Boolean(d.file || d.url);
    const pct = all.length ? Math.round((published.length / all.length) * 100) : 0;
    const latest = latestDocuments(3);
    const latestRows = latest.map((d) => `<li class="dx-mini__row"><a class="dx-mini__a" href="${ui.esc(asset(d.file))}">${L(d.title)}</a>${d.date ? `<time class="dx-mini__d" datetime="${d.date}">${fmt.date(d.date)}</time>` : ''}</li>`).join('');
    const panel = `<div class="dx-latest">
<p class="dx-progress"><span class="dx-progress__k">${L(X('Жарияланды', 'Опубликовано', 'Published'))}</span> <b class="dx-progress__v">${published.length}</b> <span class="dx-progress__of">/ ${all.length}</span></p>
<div class="dx-progress__bar" aria-hidden="true"><span style="width:${Math.max(pct, 2)}%"></span></div>
<p class="dx-progress__note">${L(X(`Тізілімде ${DOC_GROUPS.length} бөлім бойынша ${all.length} құжат бар. Қалғандарын мектеп дайындап жатыр — олар әр бөлімде жеке тізіммен көрсетілген.`, `В реестре ${all.length} документов по ${DOC_GROUPS.length} разделам. Остальные школа готовит — они показаны отдельным списком в каждом разделе.`, `The registry lists ${all.length} documents in ${DOC_GROUPS.length} sections. The rest are being prepared by the school and are listed separately in each section.`))}</p>
${latest.length ? `<p class="dx-mini__h">${L(X('Соңғы жарияланғандар', 'Последние опубликованные', 'Latest published'))}</p><ul class="dx-mini" role="list">${latestRows}</ul>` : ''}</div>`;
    const intro = ui.split({
      ratio: '3:2', align: 'start',
      left: `${ui.eyebrow(X('Ашықтық', 'Открытость', 'Transparency'))}
<h2 class="sec__title">${L(X('Мектептің барлық құжаттары бір жерде', 'Все документы школы в одном месте', 'All school documents in one place'))}</h2>
${ui.lead(X(
        'Мұнда мектептің құрылтай және лицензиялық құжаттары, ішкі ережелері, бұйрықтары мен жоспарлары жарияланады. Әр құжаттың қасында күні, нөмірі, файл форматы мен көлемі көрсетіледі. Әзірге жүктелмеген құжаттар әр бөлімнің соңында «Дайындалып жатқан құжаттар» тізімінде берілген.',
        'Здесь публикуются учредительные и лицензионные документы школы, внутренние положения, приказы и планы. Рядом с каждым документом указаны дата, номер, формат и размер файла. Документы, которые ещё не загружены, собраны в конце каждого раздела в списке «Документы в подготовке».',
        'This page publishes the school’s founding and licence documents, internal regulations, orders and plans. Each document shows its date, number, file format and size. Documents not yet uploaded are listed at the end of each section under “Documents being prepared”.',
      ))}
<div class="cluster">${ui.button({ href: '#registry', label: X('Құжаттар тізіліміне өту', 'К реестру документов', 'Go to the registry'), icon: 'arrow-right' })}${ui.button({ href: href('legislation'), label: X('Нормативтік актілер', 'Нормативные акты', 'Legislation'), kind: 'ghost' })}</div>`,
      right: panel,
    });

    // ------------------------------------------------------------ registry with filters
    const groupsUsed = DOC_GROUPS.filter((g) => docsByGroup(g.id).length);
    const toolbar = `<div class="dx-toolbar" data-dx-toolbar hidden>
<div class="dx-toolbar__search"><label class="sr-only" for="dx-q-docs">${L(X('Құжаттардан іздеу', 'Поиск по документам', 'Search documents'))}</label>${ui.icon('search', { size: 18 })}<input id="dx-q-docs" type="search" maxlength="200" autocomplete="off" data-dx-q placeholder="${ui.esc(L(X('Құжат атауы немесе нөмірі…', 'Название или номер документа…', 'Document title or number…')))}"></div>
<div class="dx-toolbar__row"><div class="dx-toolbar__chips" role="group" aria-label="${ui.esc(L(X('Мәртебесі бойынша сүзу', 'Фильтр по статусу', 'Filter by status')))}"><button type="button" class="dx-chip" data-dx-st="*" aria-pressed="true">${L(X('Барлығы', 'Все', 'All'))} <b>${all.length}</b></button><button type="button" class="dx-chip" data-dx-st="published" aria-pressed="false">${ui.icon('check', { size: 16 })}<span>${L(X('Жарияланған', 'Опубликованные', 'Published'))}</span> <b>${published.length}</b></button><button type="button" class="dx-chip" data-dx-st="pending" aria-pressed="false">${ui.icon('hourglass', { size: 16 })}<span>${L(X('Жүктеледі', 'Ожидаются', 'Pending'))}</span> <b>${pendingN}</b></button></div>
<label class="dx-select"><span class="sr-only">${L(X('Бөлім', 'Раздел', 'Section'))}</span><select data-dx-catsel><option value="*">${L(X('Барлық бөлімдер', 'Все разделы', 'All sections'))}</option>${groupsUsed.map((g) => `<option value="${g.id}">${L(g.label)} (${docsByGroup(g.id).length})</option>`).join('')}</select></label></div>
<p class="dx-toolbar__count" aria-live="polite">${L(X('Көрсетілді', 'Показано', 'Showing'))}: <b data-dx-count>${all.length}</b> / ${all.length}</p>
<div hidden>${groupsUsed.map((g) => `<button type="button" data-dx-cat="${g.id}" aria-pressed="false" tabindex="-1">${g.id}</button>`).join('')}<button type="button" data-dx-cat="*" aria-pressed="true" tabindex="-1">*</button></div></div>`;
    // Pending documents: one compact, collapsed list per section (published ones stay first, as full cards).
    const pendBlock = (items) => (items.length ? `<details class="dx-pend" data-dx-pend><summary class="dx-pend__sum">${ui.icon('hourglass', { size: 18 })}<span>${L(X('Дайындалып жатқан құжаттар', 'Документы в подготовке', 'Documents being prepared'))}</span> <b class="dx-pend__n" data-dx-pend-n>${items.length}</b></summary><ul class="dx-pend__list" role="list">${items.map((d) => `<li class="dx-pend__row" data-dx-item data-pending><span class="dx-pend__t">${L(d.title)}${d.note ? `<span class="dx-pend__note">${L(d.note)}</span>` : ''}</span><span class="dx-pend__chip">${L(X('Жүктеледі', 'Ожидается', 'Pending'))}</span></li>`).join('')}</ul></details>` : '');
    const groupBlocks = groupsUsed.map((g) => {
      const list = docsByGroup(g.id);
      const pubList = list.filter(isPub);
      const penList = list.filter((d) => !isPub(d));
      const pub = pubList.length;
      const pen = penList.length;
      const counts = [pub ? ui.badge(X(`${pub} жарияланды`, `опубликовано: ${pub}`, `${pub} published`), 'ok') : '', pen ? ui.badge(X(`${pen} күтілуде`, `ожидается: ${pen}`, `${pen} pending`), 'warn') : ''].join(' ');
      const more = g.page ? `<a class="dx-group__link" href="${href(g.page)}"><span>${L(X('Бөлімге өту', 'Перейти в раздел', 'Open section'))}</span>${ui.icon('arrow-right', { size: 16 })}</a>` : '';
      return `<section class="dx-group" id="g-${g.id}" data-dx-group data-cat="${g.id}" aria-labelledby="g-${g.id}-t"><header class="dx-group__head"><span class="dx-group__icon">${ui.icon(g.icon, { size: 22 })}</span><div class="dx-group__titles"><h3 class="dx-group__title" id="g-${g.id}-t">${L(g.label)}</h3><p class="dx-group__counts">${counts}</p></div>${more}</header>${pubList.length ? ui.docList(pubList) : ''}${pendBlock(penList)}</section>`;
    }).join('');
    const empty = `<p class="dx-empty" data-dx-empty hidden>${ui.icon('info', { size: 18 })}<span>${L(X('Сұрау бойынша құжат табылмады.', 'По запросу документов не найдено.', 'No documents match your search.'))}</span></p>`;
    // the <select> drives the hidden category buttons, so one script serves every page
    const selectGlue = `<script>(function(){var s=document.querySelector('[data-dx-catsel]');if(!s)return;s.addEventListener('change',function(){var b=document.querySelector('[data-dx-cat="'+s.value+'"]');if(b)b.click();});})();</script>`;
    const registry = `<div class="dx-filter" data-dx-filter>${toolbar}<div class="dx-groups">${groupBlocks}</div>${empty}</div>`;

    // ------------------------------------------------------------ archive by school year
    const expected = [
      X('Жұмыс оқу жоспары', 'Рабочий учебный план', 'Working curriculum'),
      X('Сабақ кестесі', 'Расписание уроков', 'Timetable'),
      X('Академиялық күнтізбе', 'Академический календарь', 'Academic calendar'),
      X('Тәрбие жұмысының жоспары', 'План воспитательной работы', 'Upbringing plan'),
      X('Мектепішілік бақылау жоспары', 'План внутришкольного контроля', 'Internal control plan'),
      X('Даму жоспарының орындалуы туралы есеп', 'Отчёт о выполнении плана развития', 'Development plan report'),
      X('Қамқоршылық кеңестің есебі', 'Отчёт попечительского совета', 'Board of Trustees report'),
      X('Қайырымдылық көмек туралы есеп', 'Отчёт о благотворительной помощи', 'Charitable aid report'),
    ];
    // Founding & licence documents are not year-bound: valid ones and superseded ones get their own blocks,
    // so the current licence is never shown inside an older school year.
    const PERMANENT = ['founding', 'license'];
    const yearBound = published.filter((d) => !PERMANENT.includes(d.group) && !d.archived);
    const permanent = published.filter((d) => PERMANENT.includes(d.group) && !d.archived);
    const superseded = published.filter((d) => d.archived);
    const byYear = (y) => yearBound.filter((d) => schoolYearOf(d.date) === y);
    const archiveItems = years.map((y, i) => {
      const list = byYear(y);
      const label = i === 0 ? X(`${y} оқу жылы (ағымдағы)`, `${y} учебный год (текущий)`, `${y} school year (current)`) : X(`${y} оқу жылы`, `${y} учебный год`, `${y} school year`);
      const body = `${list.length ? ui.docList(list) : ''}${ui.pending({ title: list.length ? X('Осы жылдың басқа құжаттары', 'Другие документы этого года', 'Other documents of this year') : X('Құжаттар жүктеледі', 'Документы будут загружены', 'Documents will be uploaded'), note: X(`${y} оқу жылына арналған құжаттар мұрағатқа жүктеледі:`, `В архив будут загружены документы за ${y} учебный год:`, `Documents for ${y} will be added to the archive:`) })}${ui.chips(expected)}`;
      return { q: `${L(label)} <span class="dx-yr__n${list.length ? '' : ' dx-yr__n--wait'}">${list.length ? L(X(`${list.length} құжат`, `документов: ${list.length}`, `${list.length} document${list.length > 1 ? 's' : ''}`)) : L(X('күтілуде', 'ожидается', 'pending'))}</span>`, a: body, open: i === 0, id: `y-${y.slice(0, 4)}` };
    });
    const block = (cls, icon, title, text, list) => (list.length ? `<div class="dx-older ${cls}"><h3>${ui.icon(icon, { size: 22 })}<span>${L(title)}</span></h3><p class="muted">${L(text)}</p>${ui.docList(list)}</div>` : '');
    const archive = ui.accordion(archiveItems) + `<div class="dx-perm">${block('dx-older--valid', 'check',
      X('Қолданыстағы мерзімсіз құжаттар', 'Действующие бессрочные документы', 'Current documents with no expiry date'),
      X('Лицензия және тіркеу туралы анықтама оқу жылына байланысты емес — олар мұрағатқа жатпайды және күшін жойғанға дейін қолданылады.', 'Лицензия и справка о регистрации не привязаны к учебному году — они не архивируются и действуют до их замены.', 'The licence and the registration certificate are not tied to a school year: they are not archived and remain valid until replaced.'),
      permanent)}${block('dx-older--old', 'hourglass',
      X('Күшін жойған құжаттар (мұрағат)', 'Утратившие силу документы (архив)', 'Superseded documents (archive)'),
      X('Ауыстырылған құжаттар ақпарат үшін «Мұрағат» белгісімен сақталады.', 'Заменённые документы хранятся для справки с пометкой «Архив».', 'Replaced documents are kept for reference, marked “Archive”.'),
      superseded)}</div>`;

    // ------------------------------------------------------------ publishing standard
    const standard = ui.cards([
      { icon: 'doc', title: X('Мәтін және файл', 'Текст и файл', 'Text and file'), text: X('Құжат файлмен (PDF немесе JPG скан) жарияланады, ал оның негізгі деректемелері (нөмірі, күні, кім берді, мерзімі) сайтта мәтінмен қайталанады (UTF-8). Сканерленген құжаттардың PDF нұсқасы мен толық мәтіні дайындалуда.', 'Документ публикуется файлом (PDF или скан JPG), а его ключевые реквизиты (номер, дата, кем выдан, срок) дублируются текстом на сайте (UTF-8). PDF-версии и полный текст сканов готовятся.', 'Each document is published as a file (PDF or a JPG scan) and its key requisites (number, date, issuer, term) are repeated as text on the site (UTF-8). PDF versions and full-text transcripts of the scans are being prepared.') },
      { icon: 'info', title: X('Формат пен көлемі', 'Формат и размер', 'Format and size'), text: X('Сілтеменің қасында файл түрі мен көлемі көрсетіледі, мысалы: «PDF, 350 КБ».', 'Рядом со ссылкой указан тип и размер файла, например «PDF, 350 КБ».', 'The file type and size appear next to each link, e.g. “PDF, 350 KB”.') },
      { icon: 'calendar', title: X('Күні мен нөмірі', 'Дата и номер', 'Date and number'), text: X('Бұйрықтар мен ережелер бекітілген күні және тіркеу нөмірімен беріледі.', 'Приказы и положения — с датой утверждения и регистрационным номером.', 'Orders and regulations show their approval date and registration number.') },
      { icon: 'clock', title: X('3 жұмыс күні ішінде', 'В течение 3 рабочих дней', 'Within 3 working days'), text: X('Жаңа немесе өзгертілген құжат бекітілгеннен кейін 3 жұмыс күнінен кешіктірілмей жарияланады.', 'Новый или изменённый документ публикуется не позднее 3 рабочих дней после утверждения.', 'A new or amended document is published within 3 working days of approval.') },
      { icon: 'hourglass', title: X('3 жылдық мұрағат', 'Архив за 3 года', '3-year archive'), text: X('Күшін жойған құжаттар жойылмайды — «Мұрағат» белгісімен кемінде 3 жыл сақталады.', 'Утратившие силу документы не удаляются — хранятся с пометкой «Архив» не менее 3 лет.', 'Superseded documents are not deleted — they stay, marked “Archive”, for at least 3 years.') },
      { icon: 'eye', title: X('Қолжетімді нұсқа', 'Доступная версия', 'Accessible version'), text: X('Сканерленген құжаттардың мәтіні сипаттамада қайталанады; нашар көретіндерге арналған нұсқада да оқылады.', 'Текст сканов дублируется в описании; всё читается и в версии для слабовидящих.', 'Key text of scans is repeated in the description and readable in the low-vision version.') },
    ], { cols: 3 });

    const related = ui.linkList([
      { href: href('legislation'), icon: 'scale', label: X('Нормативтік құқықтық актілер', 'Нормативные правовые акты', 'Legislation'), note: X('Заңдар мен бұйрықтар — adilet.zan.kz сілтемелерімен', 'Законы и приказы со ссылками на adilet.zan.kz', 'Laws and orders with adilet.zan.kz links') },
      { href: href('license'), icon: 'shield', label: X('Лицензия және тіркеу', 'Лицензия и регистрация', 'Licence and registration') },
      { href: href('finance'), icon: 'coins', label: X('Қаржылық есептер', 'Финансовые отчёты', 'Financial reports') },
      { href: href('anticorruption'), icon: 'scale', label: X('Сыбайлас жемқорлыққа қарсы іс-қимыл', 'Противодействие коррупции', 'Anti-corruption') },
      { href: href('privacy'), icon: 'lock', label: X('Құпиялылық саясаты', 'Политика конфиденциальности', 'Privacy policy') },
      { href: href('board'), icon: 'handshake', label: X('Қамқоршылық кеңес', 'Попечительский совет', 'Board of Trustees') },
    ]);

    const toc = ui.toc([
      { id: 'registry', label: X('Құжаттар тізілімі', 'Реестр документов', 'Document registry') },
      { id: 'archive', label: X('Оқу жылдары бойынша мұрағат', 'Архив по учебным годам', 'Archive by school year') },
      { id: 'standard', label: X('Жариялау тәртібі', 'Порядок публикации', 'How we publish') },
    ]);
    const groupNav = `<nav class="dx-gnav" aria-label="${ui.esc(L(X('Құжат бөлімдері', 'Разделы документов', 'Document sections')))}"><p class="toc__title">${L(X('Бөлімдер', 'Разделы', 'Sections'))}</p><ul role="list">${groupsUsed.map((g) => `<li><a href="#g-${g.id}">${ui.icon(g.icon, { size: 16 })}<span>${L(g.label)}</span><b>${docsByGroup(g.id).length}</b></a></li>`).join('')}</ul></nav>`;

    return [
      intro,
      ui.split({ ratio: '1:2', left: `<div class="dx-sticky">${toc}${groupNav}</div>`, right: noReveal(ui.section({ id: 'registry', eyebrow: X('Тізілім', 'Реестр', 'Registry'), title: X('Құжаттар тізілімі', 'Реестр документов', 'Document registry'), lead: X('Іздеу жолағы мен сүзгілер арқылы қажетті құжатты тез табыңыз.', 'Быстро найдите нужный документ с помощью поиска и фильтров.', 'Use the search box and filters to find a document quickly.'), body: registry })) }),
      noReveal(ui.section({ id: 'archive', tone: 'tint', eyebrow: X('Мұрағат', 'Архив', 'Archive'), title: X('Оқу жылдары бойынша мұрағат', 'Архив по учебным годам', 'Archive by school year'), lead: X('Оқу жылына арналған құжаттар (жоспарлар, кестелер, есептер) — ағымдағы және алдыңғы үш оқу жылы бойынша (қыркүйек–тамыз). Лицензия мен тіркеу құжаттары төменде бөлек көрсетілген.', 'Документы на учебный год (планы, расписания, отчёты) — за текущий и три предыдущих учебных года (сентябрь–август). Лицензия и регистрационные документы показаны ниже отдельно.', 'Year-bound documents (plans, timetables, reports) for the current and three previous school years (September–August). The licence and registration documents are shown separately below.'), body: archive })),
      ui.section({ id: 'standard', eyebrow: X('Стандарт', 'Стандарт', 'Standard'), title: X('Құжаттарды жариялау тәртібі', 'Как мы публикуем документы', 'How we publish documents'), body: standard }),
      ui.banner({ theme: 'hero', icon: 'scale', eyebrow: X('Құқықтық негіз', 'Правовая основа', 'Legal basis'), title: X('Мектеп жұмысын реттейтін заңдар мен бұйрықтар', 'Законы и приказы, по которым работает школа', 'The laws and orders the school works by'), text: X('Толық деректемелер және adilet.zan.kz ресми мәтіндеріне сілтемелер.', 'Полные реквизиты и ссылки на официальные тексты на adilet.zan.kz.', 'Full requisites and links to the official texts on adilet.zan.kz.'), href: href('legislation'), label: X('Актілер тізбесі', 'Перечень актов', 'List of acts') }),
      ui.section({ title: X('Осы бөлімде', 'В этом разделе', 'In this section'), body: related }),
      dxFilterScript() + selectGlue,
    ].join('\n');
  },
};
