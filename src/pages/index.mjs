// =====================================================================================
//  LANDING PAGE — "Білім әлемі — керемет саяхат" (SPEC §3 + §7, ORDER-114 B.16–23, A.5, R).
//  Contract kept for world.js: section order/ids, `class="st st--<kind>"`, data-station, data-theme,
//  #bg-stack (one .bg per theme), canvas#world. Text lives in `.st__card` blocks (dense backdrop ≥ .92);
//  `.st__stage` = empty area where the 3D object shows (aria-hidden) + a themed SVG fallback
//  (public/assets/img/stations/<id>.svg) shown while WebGL is off/unavailable (html:not(.webgl-on)).
//  Subject cards carry button.st__trick[data-trick] → home.js → window 'keremet:trick'.
//  Facts only from school.mjs / news.mjs / documents.mjs; unknowns → ui.pending(). Generic text (how
//  admission works under order №564) was checked against the current text of the order (03.03.2026).
//  Compact official part (SPEC §6.1): levels/admission/news/contacts show key numbers + tiles; the legal basis, full
//  admission rules, pending notes and the licensed-levels list sit in ui.more / ui.legal / ui.pendingGroup; documents,
//  egov services, events, vacancies and feedback channels are ONE "Official information" ui.tabs block (#official).
//  Styling: public/assets/css/home.css · behaviour: public/assets/js/home.js.
// =====================================================================================

// The events calendar data lives in events.mjs (news owner). Namespace import: if it does not export EVENTS/TYPES
// (yet), the home block falls back to a plain link instead of breaking the build.
import * as eventsPage from './events.mjs';

const X = (kz, ru, en) => ({ kz, ru, en });
const THEMES = ['hero', 'math', 'physics', 'chemistry', 'biology', 'geography', 'languages', 'informatics', 'arts', 'day', 'paper'];
const ORDER_564 = { kz: 'https://adilet.zan.kz/kaz/docs/V1800017553', ru: 'https://adilet.zan.kz/rus/docs/V1800017553', en: 'https://adilet.zan.kz/eng/docs/V1800017553' };
const EGOV = { kz: 'kk', ru: 'ru', en: 'en' };

// ---------------------------------------------------------------- the eight subject worlds
const SUBJECTS = [
  {
    id: 'math', side: 'right', icon: 'calculator', more: 'curriculum',
    kicker: X('Логика және сандар', 'Логика и числа', 'Logic & numbers'),
    name: X('Математика', 'Математика', 'Mathematics'),
    pitch: X(
      'Сингапур математикасы баланы заттан суретке, суреттен символға қарай жетелейді: ережені жаттамай, түсініп үйренеді. Математикаға қызығатын оқушыларға тереңдетілген және олимпиадалық есептер ұсынылады.',
      'Сингапурская математика ведёт ребёнка от предметов к рисункам, а от рисунков — к символам: не зубрить правила, а понимать их. Увлечённым математикой ученикам — углублённые и олимпиадные задачи.',
      'Singapore maths leads children from objects to pictures and from pictures to symbols — understanding rules instead of memorising them. Pupils who love maths get advanced and olympiad problems.'),
    chips: [X('Сингапур математикасы', 'Сингапурская математика', 'Singapore maths'), X('Тереңдетілген математика', 'Углублённая математика', 'Advanced maths'), X('Олимпиадалық есептер', 'Олимпиадные задачи', 'Olympiad problems'), X('НЗМ және РФММ әдістемесі', 'Методики НИШ и РФМШ', 'NIS & RPMS methods')],
    deco: () => `<div class="subj__deco deco-math" aria-hidden="true"><span class="deco-math__f">a² + b² = c²</span><span class="deco-math__s">π ≈ 3,14 · √2 · ∑</span></div>`,
  },
  {
    id: 'physics', side: 'left', icon: 'atom', more: 'curriculum',
    kicker: X('Жаратылыстану', 'Естествознание', 'Natural science'),
    name: X('Физика: неге және қалай?', 'Физика: почему и как?', 'Physics: why and how?'),
    pitch: X(
      'Бастауыш сыныпта физика «неге?» деген сұрақтан басталады: жарық қайдан келеді, магнит неге тартады, доп неге домалайды. Жаратылыстану сабақтарында бала бақылауға, салыстыруға және қорытынды жасауға үйренеді.',
      'В начальной школе физика начинается с вопроса «почему?»: откуда берётся свет, почему магнит притягивает, почему катится мяч. На уроках естествознания ребёнок учится наблюдать, сравнивать и делать выводы.',
      'In primary school, physics starts with “why?”: where light comes from, why a magnet pulls, why a ball rolls. In natural-science lessons children learn to observe, compare and draw conclusions.'),
    chips: [X('Бақылау', 'Наблюдение', 'Observing'), X('Салыстыру', 'Сравнение', 'Comparing'), X('Қорытынды жасау', 'Выводы', 'Drawing conclusions')],
    deco: () => `<div class="subj__deco deco-phys" aria-hidden="true"><span class="deco-phys__f">E = mc²</span><span class="deco-phys__l">FIG. 01 · ENERGY</span></div>`,
  },
  {
    id: 'chemistry', side: 'right', icon: 'flask', more: 'curriculum',
    kicker: X('Жаратылыстану', 'Естествознание', 'Natural science'),
    name: X('Химия: заттар әлемі', 'Химия: мир веществ', 'Chemistry: the world of matter'),
    pitch: X(
      'Су неге мұзға айналады? Қант суда қайда жоғалады? Заттармен және олардың қасиеттерімен танысу — химияға жасалған алғашқы қадам: сұрақ қою, болжам жасау, оны тексеру.',
      'Почему вода превращается в лёд? Куда исчезает сахар в воде? Знакомство с веществами и их свойствами — первый шаг к химии: задать вопрос, выдвинуть предположение, проверить его.',
      'Why does water turn into ice? Where does sugar go in water? Getting to know substances and their properties is the first step towards chemistry: ask a question, make a guess, check it.'),
    chips: [X('Заттар және қасиеттері', 'Вещества и свойства', 'Substances & properties'), X('Су · ауа · мұз', 'Вода · воздух · лёд', 'Water · air · ice'), X('Сұрақ → болжам → тексеру', 'Вопрос → гипотеза → проверка', 'Question → guess → check')],
    deco: (L) => `<div class="subj__deco deco-chem" aria-hidden="true"><span class="deco-chem__n">6</span><span class="deco-chem__s">C</span><span class="deco-chem__name">${L(X('Көміртек', 'Углерод', 'Carbon'))}</span><span class="deco-chem__m">12.011</span></div>`,
  },
  {
    id: 'biology', side: 'left', icon: 'leaf', more: 'curriculum',
    kicker: X('Жаратылыстану', 'Естествознание', 'Natural science'),
    name: X('Биология: тірі табиғат', 'Биология: живая природа', 'Biology: living nature'),
    pitch: X(
      'Өсімдіктер, жануарлар және адам ағзасы — тірі табиғатты танып, оны аялауды үйренеміз. Оңтүстік Қазақстанның табиғаты ерекше: осы өңірде Грейг қызғалдағы өседі.',
      'Растения, животные и организм человека — узнаём живую природу и учимся её беречь. Природа юга Казахстана особенная: здесь растёт тюльпан Грейга.',
      'Plants, animals and the human body — getting to know living nature and learning to care for it. Southern Kazakhstan has remarkable nature: Greig’s tulip grows here.'),
    chips: [X('Тірі табиғат', 'Живая природа', 'Living nature'), X('Адам ағзасы', 'Организм человека', 'Human body'), X('Денсаулық', 'Здоровье', 'Health'), X('Табиғатты қорғау', 'Охрана природы', 'Caring for nature')],
    deco: (L) => `<div class="subj__deco deco-bio" aria-hidden="true"><i>Tulipa greigii</i><span>Regel, 1873 · ${L(X('Грейг қызғалдағы', 'тюльпан Грейга', 'Greig’s tulip'))}</span></div>`,
  },
  {
    id: 'geography', side: 'right', icon: 'globe', more: 'curriculum',
    kicker: X('Бізді қоршаған әлем', 'Окружающий мир', 'The world around us'),
    name: X('География: Шымкенттен әлемге', 'География: от Шымкента к миру', 'Geography: from Shymkent to the world'),
    pitch: X(
      'Мектептен бастап — ауданға, қалаға, елге және бүкіл әлемге. Карта оқимыз, бағыт табамыз, туған өлкені танимыз: Шымкент — республикалық маңызы бар қала.',
      'От школы — к району, городу, стране и всему миру. Читаем карты, определяем стороны света, узнаём родной край: Шымкент — город республиканского значения.',
      'From the school to the district, the city, the country and the whole world. Reading maps, finding directions and discovering our home region: Shymkent is a city of republican significance.'),
    chips: [X('Карта және глобус', 'Карта и глобус', 'Maps & globes'), X('Туған өлке', 'Родной край', 'Home region'), X('Әлем елдері', 'Страны мира', 'Countries of the world')],
    deco: (L) => `<div class="subj__deco deco-geo" aria-hidden="true"><span class="deco-geo__c">42°24′30″ N<br>69°36′48″ E</span><span class="deco-geo__n">${L(X('Шымкент · Асар', 'Шымкент · Асар', 'Shymkent · Asar'))}</span></div>`,
  },
  {
    id: 'languages', side: 'left', icon: 'languages', more: 'curriculum',
    kicker: X('Тіл және сөз', 'Язык и слово', 'Language & word'),
    name: X('Тілдер', 'Языки', 'Languages'),
    pitch: X(
      'Оқыту қазақ және орыс тілдерінде жүргізіледі, мектеп тілдерді тереңдетіп оқытуды ұсынады. Оқу, мәнерлеп сөйлеу, ойын нақты жеткізу — шешендік өнер де осыдан басталады. Ағылшын тілін үйрену — әлемге ашылған тағы бір есік.',
      'Обучение ведётся на казахском и русском языках, школа предлагает углублённое изучение языков. Чтение, выразительная речь, умение ясно выразить мысль — отсюда начинается и ораторское мастерство. Изучение английского — ещё одна дверь в мир.',
      'Teaching is in Kazakh and Russian, and the school offers in-depth language study. Reading, expressive speech and putting thoughts clearly into words — public speaking starts here too. Learning English opens one more door to the world.'),
    chips: [X('Қазақ тілі', 'Казахский язык', 'Kazakh'), X('Орыс тілі', 'Русский язык', 'Russian'), X('Шешендік өнер', 'Ораторское мастерство', 'Public speaking'), X('Ағылшын тілін үйрену', 'Изучение английского', 'Learning English')],
    deco: (L) => `<figure class="subj__deco deco-lang" aria-hidden="true"><blockquote>«Өнер алды — қызыл тіл»</blockquote><figcaption>${L(X('— халық мақалы', '— казахская пословица: «Первое из искусств — красноречие»', '— Kazakh proverb: “Eloquence is the first of the arts”'))}</figcaption></figure>`,
  },
  {
    id: 'informatics', side: 'right', icon: 'code', more: 'clubs',
    kicker: X('Цифрлық сауат', 'Цифровая грамотность', 'Digital skills'),
    name: X('Информатика және робототехника', 'Информатика и робототехника', 'Computing & robotics'),
    pitch: X(
      'Бағдарламалау, робототехника және жасанды интеллект негіздері: балалар технологияны тек пайдаланып қана қоймай, оны өздері жасауды үйренеді. Бұлар — мектеп ұсынатын бағыттар.',
      'Программирование, робототехника и основы искусственного интеллекта: дети учатся не только пользоваться технологиями, но и создавать их. Это направления, которые предлагает школа.',
      'Programming, robotics and the basics of artificial intelligence: children learn to create technology, not just use it. These are among the programmes the school offers.'),
    chips: [X('Бағдарламалау', 'Программирование', 'Programming'), X('Робототехника', 'Робототехника', 'Robotics'), X('Жасанды интеллект', 'Искусственный интеллект', 'Artificial intelligence')],
    deco: () => `<div class="subj__deco deco-info" aria-hidden="true"><span class="deco-info__p">&gt;</span><span class="deco-info__t">keremet.learn("robotics")</span><span class="deco-info__c"></span></div>`,
  },
  {
    id: 'arts', side: 'left', icon: 'palette', more: 'clubs',
    // TODO(school): confirm which of these programmes are free clubs (the Instagram bio only says «Тегін үйірмелер» in general)
    kicker: X('Үйірмелер мен бағыттар', 'Кружки и направления', 'Clubs & programmes'),
    name: X('Шығармашылық және спорт', 'Творчество и спорт', 'Creativity & sport'),
    pitch: X(
      'Мектеп ұсынатын бағыттар: спорт үйірмелері, шешендік өнер және қаржылық сауаттылық. Мұнда бала өз қабілетін ашып, командада жұмыс істеуге және өз ойын еркін айтуға үйренеді.',
      'Направления, которые предлагает школа: спортивные кружки, ораторское мастерство и финансовая грамотность. Здесь ребёнок раскрывает свои способности, учится работать в команде и свободно выражать мысли.',
      'Programmes the school offers: sports clubs, public speaking and financial literacy. Here children discover their talents, learn to work in a team and to speak their mind.'),
    chips: [X('Спорт үйірмелері', 'Спортивные секции', 'Sports clubs'), X('Шешендік өнер', 'Ораторское мастерство', 'Public speaking'), X('Қаржылық сауаттылық', 'Финансовая грамотность', 'Financial literacy')],
    deco: () => `<div class="subj__deco deco-arts" aria-hidden="true"><svg viewBox="0 0 320 44" preserveAspectRatio="none"><path d="M6 30C52 8 104 6 152 18s94 18 162-8" fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="round"/><path d="M40 36c50-10 110-8 170 2" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" opacity=".5"/></svg></div>`,
  },
];

/** Performance: the landing repeats ~130 inline icons (ui.icon). Every icon used 2+ times becomes one <symbol>
 *  in a hidden sprite at the start of the page body, and each copy becomes a short <use> reference. */
const ICON_RX = /<svg class="(ico[^"]*)" width="(\d+)" height="(\d+)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1\.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">([\s\S]*?)<\/svg>/g;
const ICON_ATTRS = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
function spriteIcons(html) {
  const count = new Map();
  for (const m of html.matchAll(ICON_RX)) count.set(m[4], (count.get(m[4]) || 0) + 1);
  const ids = new Map();
  count.forEach((n, body) => { if (n > 1) ids.set(body, `hi-${ids.size}`); });
  if (!ids.size) return html;
  const out = html.replace(ICON_RX, (all, cls, w, h, body) => (ids.has(body) ? `<svg class="${cls}" width="${w}" height="${h}" aria-hidden="true" focusable="false"><use href="#${ids.get(body)}"/></svg>` : all));
  const symbols = [...ids].map(([body, id]) => `<symbol id="${id}" ${ICON_ATTRS}>${body}</symbol>`).join('');
  return `<svg class="icon-sprite" width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden">${symbols}</svg>\n${out}`;
}

const MARQUEE_SUBJECTS = ['Математика', 'Mathematics', 'Физика', 'Physics', 'Химия', 'Chemistry', 'Биология', 'Biology', 'География', 'Geography', 'Тілдер', 'Языки', 'Languages', 'Информатика', 'Computing', 'Шығармашылық', 'Творчество', 'Creativity'];

export default {
  slug: 'index',
  group: null,
  home: true,
  order: 0,
  title: { kz: 'Басты бет', ru: 'Главная', en: 'Home' },
  description: {
    kz: '«Керемет» зияткерлік мектебі, Шымкент: қазақ және орыс тілдерінде оқыту, тереңдетілген математика, тілдер, робототехника. Қабылдау, құжаттар, байланыс.',
    ru: 'Интеллектуальная школа «Керемет», Шымкент: обучение на казахском и русском, углублённая математика, языки, робототехника. Приём, документы, контакты.',
    en: 'Keremet Intellectual School, Shymkent: teaching in Kazakh and Russian, advanced maths, languages, robotics. Admission, documents, contacts.',
  },
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, { ui, S, L, t, href, asset, fmt, news, latestDocuments }) {
    const esc = ui.esc;
    const stage = (id, eager = false) => `<div class="st__stage" aria-hidden="true" data-stage="${id}"><img class="st__fallback" src="${asset(`img/stations/${id}.svg`)}" alt="" width="600" height="600"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"></div>`;
    const gradesTxt = `${S.grades.from}–${S.grades.to}`;
    const unconf = S.grades.confirmed ? '' : ` <span class="badge badge--warn">${t('unconfirmed')}</span>`;
    const lic = S.licence.current, licPrev = S.licence.previous;
    const eyebrow = (txt) => `<p class="st__eyebrow"><span class="st__eyebrow-dot" aria-hidden="true"></span>${L(txt)}</p>`;
    const a11yLink = (cls = '') => `<a class="a11y-text-link${cls ? ' ' + cls : ''}" href="${href('accessibility')}" data-a11y-open>${ui.icon('eye', { size: 18 })}<span>${t('a11y.title')}</span></a>`;
    const g2 = S.contacts.twoGis;

    // ------------------------------------------------------------ backdrop layers + 3D canvas + journey rail
    const sky = `<div class="sky"><i class="sky__l sky__l--dawn"></i><i class="sky__l sky__l--noon"></i><i class="sky__l sky__l--dusk"></i><i class="sky__l sky__l--night"></i><span class="sky__stars"></span><span class="sky__arc"></span><span class="sky__sun"></span><span class="sky__moon"></span></div>`;
    const bg = `<div id="bg-stack" aria-hidden="true">${THEMES.map((th) => `<div class="bg pattern" data-theme="${th}">${th === 'day' ? sky : ''}</div>`).join('')}</div>
<canvas id="world" class="world" aria-hidden="true" tabindex="-1"></canvas>
<div class="cursor" aria-hidden="true"><span class="cursor__dot"></span><span class="cursor__ring"></span></div>`;

    const railItems = [
      ['hero', X('Бастау', 'Старт', 'Start')], ['about', X('Біз туралы', 'О нас', 'About')],
      ...SUBJECTS.map((s) => [s.id, s.name]),
      ['day', X('Бір күн', 'Один день', 'A day')], ['levels', X('Бағыттар', 'Направления', 'Activities')], ['admission', X('Қабылдау', 'Приём', 'Admission')],
      ['news', X('Жаңалықтар', 'Новости', 'News')], ['contacts', X('Байланыс', 'Контакты', 'Contacts')],
    ];
    // the same anchors as a chip row below 1200px and in low-vision mode, where the dot rail is hidden (R.106)
    const jump = `<nav class="jump" aria-label="${esc(L(X('Беттегі бөлімдер', 'Разделы страницы', 'On this page')))}"><div class="jump__in"><p class="jump__t" aria-hidden="true">${ui.icon('grid', { size: 16 })}<span>${L(X('Беттегі бөлімдер', 'Разделы страницы', 'On this page'))}</span></p><ol class="jump__list" role="list">${railItems.slice(1).map(([id, lb]) => `<li><a href="#${id}">${L(lb)}</a></li>`).join('')}</ol></div></nav>`;
    const rail = `<nav class="rail" aria-label="${esc(L(X('Беттегі бөлімдер', 'Разделы страницы', 'On this page')))}"><ol role="list">${railItems.map(([id, lb]) => `<li><a href="#${id}" data-rail="${id}"><span class="rail__dot" aria-hidden="true"></span><span class="rail__label">${L(lb)}</span></a></li>`).join('')}</ol></nav>`;

    // ------------------------------------------------------------ HERO
    const hero = `<section class="st st--hero" id="hero" data-station="hero" data-theme="hero" aria-labelledby="hero-title">
<div class="st__inner">
<div class="st__card hero__card">
<p class="hero__kicker"><span class="hero__pulse" aria-hidden="true"></span>${L(X('Шымкент', 'Шымкент', 'Shymkent'))} · ${L(S.orgType)}</p>
<h1 class="hero__title" id="hero-title"><span class="hero__name">${L(S.name)}</span> <span class="hero__line">${L(X('Білім әлемі&nbsp;— <em>керемет</em> саяхат', 'Учёба&nbsp;— <em>удивительное</em> путешествие', 'Learning is a <em>wonderful</em> journey'))}</span></h1>
<p class="hero__lead">${L(X(
      'Шымкенттегі жеке меншік мектеп: оқыту қазақ және орыс тілдерінде, Сингапур математикасы, тілдерді тереңдетіп оқыту, бағдарламалау, робототехника және тегін үйірмелер.',
      'Частная школа в Шымкенте: обучение на казахском и русском языках, сингапурская математика, углублённое изучение языков, программирование, робототехника и бесплатные кружки.',
      'A private school in Shymkent: teaching in Kazakh and Russian, Singapore maths, in-depth language study, programming, robotics and free clubs.'))}</p>
<div class="hero__cta">${ui.button({ href: href('admission'), label: t('cta.admission'), kind: 'gold', size: 'l', icon: 'arrow-right', attrs: { 'data-magnetic': '' } })}${ui.button({ href: '#about', label: X('Саяхатты бастау', 'Начать путешествие', 'Start the journey'), kind: 'light', size: 'l', icon: 'chevron-down', attrs: { 'data-magnetic': '' } })}</div>
<p class="hero__meta">${ui.extLink(g2.url, `<span class="hero__star" aria-hidden="true">★</span> 2GIS ${String(g2.rating).replace('.', lang === 'en' ? '.' : ',')} <span class="hero__muted">· ${L(X(`${g2.ratings} баға`, `${g2.ratings} оценка`, `${g2.ratings} ratings`))} · ${L(X(`${fmt.date(g2.checked)} жағдай бойынша`, `по состоянию на ${fmt.date(g2.checked)}`, `as of ${fmt.date(g2.checked)}`))}</span>`, { cls: 'hero__rating' })}${a11yLink('hero__a11y')}</p>
</div>
${stage('hero', true)}
</div>
<a class="hero__scroll" href="#about" aria-label="${esc(L(X('Төмен айналдыру: Біз туралы', 'Прокрутить вниз: О нас', 'Scroll down: About us')))}"><span class="hero__scroll-line" aria-hidden="true"></span><span aria-hidden="true">${L(X('Айналдырыңыз', 'Листайте', 'Scroll'))}</span></a>
</section>`;

    // ------------------------------------------------------------ ABOUT — manifesto + stat bento
    const manifesto = X(
      '*«Керемет» — ең үздік, ең тамаша деген сөз. Біз үшін мектеп — бір *шаңырақ астындағы үлкен үй, ал білім — *саяхат: әр сабақ жаңа әлемге ашылатын есік. Сандардан жұлдыздарға, әріптерден кодқа дейін — әр бала *өз жолын табады.',
      '*«Керемет» по-казахски значит «самый лучший, превосходный». Для нас школа — большой дом под одним *шаныраком, а учёба — *путешествие: каждый урок — дверь в новый мир. От чисел до звёзд, от букв до кода — каждый ребёнок находит *свой путь.',
      '*“Keremet” is Kazakh for “the finest, wonderful”. For us a school is a big home under one *shanyrak, and learning is a *journey: every lesson is a door to a new world. From numbers to stars, from letters to code — every child finds *their own way.');
    const mText = L(manifesto);
    const words = mText.split(/\s+/).map((w) => (w.startsWith('*') ? `<span class="w w--acc">${w.slice(1)}</span>` : `<span class="w">${w}</span>`)).join(' ');
    const bento = `<div class="bento">
<div class="bento__cell bento__cell--big">${ui.shanyrakArt({ cls: 'bento__art' })}<span class="bento__icon">${ui.icon('calendar', { size: 22 })}</span><p class="bento__num"><span data-count="2021">2021</span></p><p class="bento__label">${L(X('«Keremet-City» ЖШС тіркелді', 'Зарегистрировано ТОО «Keremet-City»', 'Keremet-City LLP registered'))}</p><p class="bento__note">${fmt.date(S.legal.registered)} · ${t('bin')} ${S.legal.bin}</p></div>
<div class="bento__cell bento__cell--lic"><span class="bento__icon">${ui.icon('shield', { size: 22 })}</span><p class="bento__num"><span data-count="2022">2022</span></p><p class="bento__label">${L(X('Алғашқы білім беру лицензиясы', 'Первая лицензия на образование', 'First education licence'))}</p><p class="bento__note">№ ${licPrev.number}<br>${fmt.date(licPrev.date)}</p></div>
<div class="bento__cell bento__cell--gold bento__cell--lic"><span class="bento__icon">${ui.icon('star', { size: 22 })}</span><p class="bento__num"><span data-count="2025">2025</span></p><p class="bento__label">${L(X('Жаңа мерзімсіз лицензия', 'Новая бессрочная лицензия', 'New unlimited licence'))}</p><p class="bento__note">№ ${lic.number}<br>${fmt.date(lic.date)}</p></div>
<div class="bento__cell"><span class="bento__icon">${ui.icon('languages', { size: 22 })}</span><p class="bento__num bento__num--txt">KZ · RU</p><p class="bento__label">${L(X('Оқыту тілдері', 'Языки обучения', 'Languages of instruction'))}</p><p class="bento__note">${S.languages.map((l) => L(l.label)).join(', ')}</p></div>
<div class="bento__cell"><span class="bento__icon">${ui.icon('graduation', { size: 22 })}</span><p class="bento__num">${gradesTxt}</p><p class="bento__label">${L(X('Сыныптар', 'Классы', 'Grades'))}${unconf}</p><p class="bento__note">${L(X('мектептің Instagram парақшасы бойынша', 'по данным страницы школы в Instagram', 'per the school’s Instagram profile'))}</p></div>
</div>`;
    const about = `<section class="st st--about" id="about" data-station="about" data-theme="hero" aria-labelledby="about-title">
<div class="st__inner st__inner--narrow">
<div class="st__card about__card">
${eyebrow(X('Біз туралы', 'О нас', 'About us'))}
<h2 class="st__title" id="about-title">${L(X('Бір шаңырақ астындағы білім әлемі', 'Мир знаний под одним шаныраком', 'A world of knowledge under one shanyrak'))}</h2>
<p class="manifesto" data-manifesto><span class="sr-only">${mText.replace(/\*/g, '')}</span><span class="manifesto__words" aria-hidden="true">${words}</span></p>
<ul class="feats" role="list" aria-label="${esc(L(X('Мектептің ерекшеліктері', 'Особенности школы', 'What the school offers')))}">${S.features.map((f) => `<li>${ui.icon(f.icon, { size: 20 })}<span>${L(f.label)}</span></li>`).join('')}</ul>
${bento}
<div class="about__foot">${ui.button({ href: href('about'), label: X('Мектеп туралы толығырақ', 'Подробнее о школе', 'More about the school'), kind: 'light', icon: 'arrow-right' })}${ui.button({ href: href('license'), label: X('Лицензия және тіркеу', 'Лицензия и регистрация', 'Licence & registration'), kind: 'link' })}</div>
</div>
</div>
</section>`;

    const marquee = (items, cls = '') => `<div class="marquee${cls ? ' ' + cls : ''}" aria-hidden="true"><div class="marquee__track">${[0, 1].map(() => `<p class="marquee__run">${items.map((w) => `<span>${w}</span><i>✦</i>`).join('')}</p>`).join('')}</div></div>`;

    // ------------------------------------------------------------ SUBJECT STATIONS
    const tryLabel = X('Тәжірибе жасаңыз', 'Попробуйте', 'Try it');
    const hint = X('Нысанды айналдырыңыз немесе түртіңіз', 'Покрутите объект или коснитесь его', 'Drag or tap the object');
    const moreLabel = { curriculum: X('Оқу бағдарламасы', 'Учебная программа', 'Curriculum'), clubs: X('Үйірмелер', 'Кружки', 'Clubs') };
    const subjects = SUBJECTS.map((s, i) => `<section class="st st--subject" id="${s.id}" data-station="${s.id}" data-theme="${s.id}" data-side="${s.side}" aria-labelledby="${s.id}-title">
<div class="st__inner">
<div class="st__col">
<article class="st__card subj">
<p class="subj__kicker"><span class="subj__num">${String(i + 1).padStart(2, '0')}<small>/08</small></span><span class="subj__icon" aria-hidden="true">${ui.icon(s.icon, { size: 18 })}</span><span>${L(s.kicker)}</span></p>
<h2 class="st__title subj__title" id="${s.id}-title">${L(s.name)}</h2>
${s.deco(L)}
<p class="subj__pitch">${L(s.pitch)}</p>
${ui.chips(s.chips, { cls: 'subj__chips' })}
<div class="subj__foot"><button type="button" class="st__trick" data-trick="${s.id}" aria-label="${esc(`${L(tryLabel)}: ${L(s.name)}`)}"><span class="st__trick-ico" aria-hidden="true">${ui.icon('sparkles', { size: 18 })}</span><span>${L(tryLabel)}</span></button><a class="subj__more" href="${href(s.more)}"><span>${L(moreLabel[s.more])}</span>${ui.icon('arrow-right', { size: 18 })}</a></div>
<p class="st__hint" aria-hidden="true"><span class="st__hint-ico">↻</span>${L(hint)}</p>
</article>
</div>
${stage(s.id)}
</div>
</section>`).join('\n');

    // ------------------------------------------------------------ A DAY AT KEREMET (horizontal, pinned)
    const slots = [
      { tm: '09:00', ic: 'sun', title: X('Мектепке келу', 'Приход в школу', 'Arrival'), text: X('Сәлемдесу және күннің жоспары.', 'Приветствие и план на день.', 'Greetings and the plan for the day.') },
      { tm: '09:30', ic: 'book', title: X('Сабақтар', 'Уроки', 'Lessons'), text: X('Мемлекеттік жалпыға міндетті білім беру стандарты бойынша — қазақ немесе орыс тілінде.', 'По государственному общеобязательному стандарту образования — на казахском или русском языке.', 'Following the state compulsory education standard — in Kazakh or Russian.') },
      { tm: '11:00', ic: 'ball', title: X('Үзіліс және қозғалыс', 'Перемена и движение', 'Break & movement'), text: X('Ойын, жаттығу, таза ауа — келесі сабаққа күш жинау.', 'Игры, разминка, свежий воздух — силы для следующего урока.', 'Games, exercise and fresh air — energy for the next lesson.') },
      { tm: '12:30', ic: 'utensils', title: X('Түскі ас', 'Обед', 'Lunch'), text: X('Мектепте ыстық тамақ беріледі.', 'В школе — горячее питание.', 'The school provides hot meals.'), tag: X('Ыстық тамақ', 'Горячее питание', 'Hot meals'), href: 'meals' },
      { tm: '14:00', ic: 'sparkles', title: X('Үйірмелер', 'Кружки', 'Clubs'), text: X('Мектеп ұсынатын бағыттар: бағдарламалау, робототехника, спорт, шешендік өнер, қаржылық сауаттылық.', 'Направления, которые предлагает школа: программирование, робототехника, спорт, ораторское мастерство, финансовая грамотность.', 'Programmes the school offers: programming, robotics, sport, public speaking, financial literacy.'), tag: X('Үйірмелер', 'Кружки', 'Clubs'), href: 'clubs' },
      { tm: '16:00', ic: 'bulb', title: X('Үй тапсырмасы', 'Домашнее задание', 'Homework'), text: X('Ұзартылған күн: үй тапсырмасын мектепте орындау.', 'Продлённый день: домашнее задание выполняется в школе.', 'Extended day: homework is done at school.'), tag: X('Ұзартылған күн', 'Продлённый день', 'Extended day') },
      { tm: '18:00', ic: 'moon', title: X('Үйге қайту', 'Домой', 'Going home'), text: X('Күн қорытындысы, балалар үйге қайтады.', 'Итоги дня, дети отправляются домой.', 'Wrapping up the day; children head home.') },
    ];
    const day = `<section class="st st--day" id="day" data-station="day" data-theme="day" aria-labelledby="day-title">
<div class="day" data-day>
<div class="day__head st__card">
${eyebrow(X('Толық күн мектебі', 'Школа полного дня', 'Full-day school'))}
<h2 class="st__title" id="day-title">${L(X('Бір күн Keremet-те', 'Один день в Keremet', 'A day at Keremet'))}</h2>
<p class="day__lead">${L(X('Таңнан кешке дейін: сабақ, ойын, ыстық тамақ, үйірмелер және үй тапсырмасы — бәрі бір мектепте.', 'С утра до вечера: уроки, игры, горячий обед, кружки и домашнее задание — всё в одной школе.', 'From morning to evening: lessons, play, a hot lunch, clubs and homework — all in one school.'))}</p>
<p class="day__note">${ui.icon('info', { size: 16 })}<span>${L(X('Уақыт үлгі ретінде көрсетілген. Нақты қоңырау кестесі —', 'Время указано для примера. Точное расписание звонков —', 'Times are illustrative. The actual bell schedule is on the'))} <a href="${href('schedule')}">${L(X('«Сабақ кестесі» бетінде', 'на странице «Расписание»', '“Timetable” page'))}</a>.</span></p>
<p class="day__kbd" id="day-hint">${L(X('Карточкаларды <kbd>←</kbd> <kbd>→</kbd> пернелерімен немесе саусақпен сырғытыңыз.', 'Листайте карточки клавишами <kbd>←</kbd> <kbd>→</kbd> или пальцем.', 'Move through the cards with <kbd>←</kbd> <kbd>→</kbd> or swipe.'))}</p>
</div>
<div class="day__viewport" tabindex="0" role="region" aria-labelledby="day-title" aria-describedby="day-hint" data-day-viewport>
<ol class="day__track" role="list">${slots.map((s, i) => `<li class="day-card" data-slot="${i}"><p class="day-card__top"><time class="day-card__time">${s.tm}</time><span class="day-card__icon" aria-hidden="true">${ui.icon(s.ic, { size: 22 })}</span></p><h3 class="day-card__title">${L(s.title)}</h3><p class="day-card__text">${L(s.text)}</p>${s.tag ? `<p class="day-card__tag">${s.href ? `<a href="${href(s.href)}">${L(s.tag)}</a>` : `<span>${L(s.tag)}</span>`}</p>` : ''}</li>`).join('')}</ol>
</div>
<div class="day__progress" aria-hidden="true"><div class="day__bar"><i></i></div><ol role="list">${slots.map((s) => `<li>${s.tm}</li>`).join('')}</ol></div>
</div>
</section>`;

    // ------------------------------------------------------------ LEVELS / DIRECTIONS OF ACTIVITY + PROJECTS (B.17, B.22)
    const directions = [
      ['curriculum', 'book', X('Оқу жұмысы', 'Учебная работа', 'Teaching & learning'), X('Оқу жоспары, бағдарламалар, әдістемелер', 'Учебный план, программы, методики', 'Curriculum, programmes, methods')],
      ['upbringing', 'heart', X('Тәрбие жұмысы', 'Воспитательная работа', 'Upbringing'), X('«Адал азамат» бағдарламасы, құндылықтар', 'Программа «Адал азамат», ценности', '“Adal Azamat” programme, values')],
      ['methodical', 'target', X('Әдістемелік жұмыс', 'Методическая работа', 'Methodical work'), X('Әдістемелік кеңес, сапаны ішкі бақылау', 'Методсовет, внутренний контроль качества', 'Methodical council, internal quality control')],
      ['assessment', 'check', X('Бағалау', 'Оценивание', 'Assessment'), X('Критериалды бағалау, нәтижелер', 'Критериальное оценивание, результаты', 'Criteria-based assessment, results')],
      ['clubs', 'sparkles', X('Үйірмелер', 'Кружки', 'Clubs'), X('Үйірмелер, бағыттары мен кестесі', 'Кружки, направления и расписание', 'Clubs, programmes and schedule')],
      ['psychology', 'users', X('Психологиялық қолдау', 'Психологическая поддержка', 'Psychological support'), X('Буллингтің алдын алу, 111 және 150 сенім телефондары', 'Профилактика буллинга, телефоны доверия 111 и 150', 'Anti-bullying, helplines 111 and 150')],
      ['inclusive', 'accessible', X('Инклюзивті білім беру', 'Инклюзивное образование', 'Inclusive education'), X('Ерекше білім беру қажеттіліктері бар балаларды қолдау', 'Сопровождение детей с особыми образовательными потребностями', 'Support for children with special educational needs')],
      ['parents', 'handshake', X('Ата-аналармен жұмыс', 'Работа с родителями', 'Working with parents'), X('Жиналыстар және бірлескен іс-шаралар', 'Собрания и совместные мероприятия', 'Meetings and joint activities')],
      ['library', 'grid', X('Кітапхана және цифрлық ресурстар', 'Библиотека и цифровые ресурсы', 'Library & digital resources'), X('Оқулықтар, электрондық журнал', 'Учебники, электронный журнал', 'Textbooks, e-journal')],
    ];
    // Layer 1: the nine areas (visual navigation) + one licence key-number card + projects; layer 2: the full list of
    // licensed levels and the licence note (SPEC §6.1 — nothing removed, only folded). [data-xall-slot]: home.js moves
    // main.js's "Expand all" button here (the landing has no .page-body; the top of <main> is the 3D hero).
    // projects: compact tiles (label only); the note stays in the HTML (search, print, low-vision mode) + tooltip/description
    const projTiles = (items) => `<ul class="lvp" role="list">${items.map((it, i) => `<li><a class="lvp__a" href="${it.href}" title="${esc(L(it.note))}" aria-describedby="lvp-note-${i + 1}"><span class="lvp__icon" aria-hidden="true">${ui.icon(it.icon, { size: 20 })}</span><span class="lvp__t">${L(it.label)}</span><span class="lvp__note" id="lvp-note-${i + 1}">${L(it.note)}</span>${ui.icon('arrow-right', { size: 18, cls: 'lvp__arrow' })}</a></li>`).join('')}</ul>`;
    const levels = `<section class="st st--levels" id="levels" data-station="levels" data-theme="paper" aria-labelledby="levels-title">
<div class="st__inner st__inner--wide">
<div class="st__card st__card--flat">
<header class="blk__head blk__head--row"><div class="blk__head-main">${eyebrow(X('Қызмет бағыттары', 'Направления деятельности', 'What we do'))}
<h2 class="st__title" id="levels-title">${L(X('Мектеп қызметінің бағыттары', 'Направления деятельности школы', 'Areas of the school’s work'))}</h2>
<p class="blk__lead">${L(X('Оқу, тәрбие, әдістемелік жұмыс және қолдау — әр бөлімде толық ақпарат пен құжаттар жарияланады.', 'Учебная, воспитательная, методическая работа и поддержка — в каждом разделе публикуются подробности и документы.', 'Teaching, upbringing, methodical work and support — each section publishes details and documents.'))}</p></div>
<div class="hb-xall" data-xall-slot></div></header>
<ul class="dirs" role="list">${directions.map(([slug, ic, title, note], i) => `<li class="dir"><a class="dir__a" href="${href(slug)}" title="${esc(L(note))}" aria-describedby="dir-note-${i + 1}"><span class="dir__n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><span class="dir__icon" aria-hidden="true">${ui.icon(ic, { size: 24 })}</span><span class="dir__title">${L(title)}</span><span class="dir__note" id="dir-note-${i + 1}">${L(note)}</span><span class="dir__arrow" aria-hidden="true">${ui.icon('arrow-right', { size: 20 })}</span></a></li>`).join('')}</ul>
<div class="lv">
<div class="lv__levels lvk">
<div class="lvk__top"><span class="lvk__icon" aria-hidden="true">${ui.icon('shield', { size: 26 })}</span><p class="lvk__num">${S.licenceLevels.length}</p><div class="lvk__txt"><p class="lvk__label">${L(X('Лицензия бойынша қызмет түрлері', 'Видов деятельности по лицензии', 'Activities under the licence'))}</p><p class="lvk__meta"><a href="${href('license')}">№ ${lic.number}</a> · ${L(lic.term)}</p></div></div>
<ul class="lvk__tags" role="list">${S.licenceLevels.slice(0, 3).map((l) => `<li>${L(l.label)}</li>`).join('')}</ul>
${ui.more({
      label: X('Лицензия бойынша барлық қызмет түрлері', 'Все виды деятельности по лицензии', 'All activities under the licence'), icon: 'graduation', count: S.licenceLevels.length, tone: 'card', cls: 'lvk__more',
      body: `<ol class="lv__list" role="list">${S.licenceLevels.map((l, i) => `<li><span aria-hidden="true">${i + 1}</span>${L(l.label)}</li>`).join('')}</ol>
<p class="blk__note">${ui.icon('info', { size: 16 })}<span>${L(X(`Лицензия № ${lic.number}, ${fmt.date(lic.date)}. Мектеп бастауыш сыныптарға қабылдау жариялаған; сынып аралығы (${gradesTxt}) нақтылануда.`, `Лицензия № ${lic.number} от ${fmt.date(lic.date)}. Школа объявляет приём в начальные классы; диапазон классов (${gradesTxt}) уточняется.`, `Licence No. ${lic.number} of ${fmt.date(lic.date)}. The school announces admission to primary grades; the grade range (${gradesTxt}) is being confirmed.`))}</span></p>`,
    })}</div>
<div class="lv__projects"><h3 class="blk__h3">${L(X('Жобалар мен мектеп өмірі', 'Проекты и жизнь школы', 'Projects & school life'))}</h3>
${projTiles([
      { href: href('projects'), icon: 'target', label: X('Мектеп жобалары', 'Проекты школы', 'School projects'), note: X('Жобалар, байқаулар және олимпиадалар', 'Проекты, конкурсы и олимпиады', 'Projects, competitions and olympiads') },
      { href: href('clubs'), icon: 'sparkles', label: X('Үйірмелер', 'Кружки', 'Clubs'), note: X('Бағдарламалау, робототехника, спорт, шешендік өнер', 'Программирование, робототехника, спорт, ораторское мастерство', 'Programming, robotics, sport, public speaking') },
      { href: href('events'), icon: 'calendar', label: X('Іс-шаралар күнтізбесі', 'Календарь событий', 'Events calendar'), note: X('2026–2027 оқу жылы: тоқсандар, демалыс, мерекелер', '2026–2027 учебный год: четверти, каникулы, праздники', '2026–2027: terms, breaks, holidays') },
    ])}</div>
</div>
</div>
</div>
</section>`;

    // ------------------------------------------------------------ ADMISSION + equal banners (B.18) + egov services (B.20)
    const banners = [
      ['self-assessment', 'math', 'target', X('Өзін-өзі бағалау', 'Самооценка', 'Self-assessment'), X('Аттестаттауға арналған материалдар', 'Материалы для аттестации', 'Materials for state attestation')],
      ['admission', 'geography', 'graduation', X('1-сыныпқа қабылдау', 'Приём в 1 класс', 'Grade 1 admission'), X('Ережелер, құжаттар, мерзімдер', 'Правила, документы, сроки', 'Rules, documents, deadlines')],
      ['meals', 'biology', 'utensils', X('Мектептегі тамақтану', 'Школьное питание', 'School meals'), X('Мәзір, жеткізуші, комиссия', 'Меню, поставщик, комиссия', 'Menu, supplier, commission')],
      ['symbols', 'hero', 'flag', X('Мемлекеттік рәміздер', 'Государственные символы', 'State symbols'), X('Ту, Елтаңба, Әнұран', 'Флаг, Герб, Гимн', 'Flag, Emblem, Anthem')],
    ];
    // egov.kz service pages in their canonical /cms/{kk|ru|en}/services/<code> form (checked via web search 25.09.2026).
    // TODO(school): open all four links from a Kazakhstan connection before launch; if egov.kz retires the /cms paths,
    // switch to the new egov.kz/services/<code> URLs.
    const egov = (code) => `https://egov.kz/cms/${EGOV[lang]}/services/${code}`;
    const services = [
      { href: egov('pass_mp_203'), icon: 'graduation', label: X('1-сыныпқа қабылдау үшін құжаттар қабылдау', 'Приём документов для зачисления в 1 класс', 'Applying for grade 1'), note: 'egov.kz' },
      { href: egov('secondary_school/mon-197-205'), icon: 'book', label: X('Білім беру ұйымдарына құжаттар қабылдау және оқуға қабылдау', 'Приём документов и зачисление в организации образования', 'Applying to a school (all grades)'), note: 'egov.kz' },
      { href: egov('pass_30_17_mp'), icon: 'arrow-right', label: X('Балаларды мектептен мектепке ауыстыру', 'Перевод детей из школы в школу', 'Transfer to another school'), note: 'egov.kz' },
      { href: egov('pass-mon212-214'), icon: 'doc', label: X('Білім туралы құжаттардың телнұсқаларын беру', 'Выдача дубликатов документов об образовании', 'Duplicates of education certificates'), note: 'egov.kz' },
    ];
    const parents = [
      ['admission', 'graduation', X('Қабылдау ережелері', 'Правила приёма', 'Admission rules')],
      ['forms', 'doc', X('Өтініш үлгілері', 'Образцы заявлений', 'Application forms')],
      ['tuition', 'coins', X('Шарт және оқу ақысы', 'Договор и оплата', 'Contract & fees')],
      ['schedule', 'calendar', X('Сабақ кестесі', 'Расписание', 'Timetable')],
      ['safety', 'shield', X('Қауіпсіздік', 'Безопасность', 'Safety')],
      ['documents', 'book', X('Құжаттар', 'Документы', 'Documents')],
    ];
    // Layer 1: four key facts of the order (age · dates · how · documents) as number cards; layer 2: the full wording
    // with paragraph numbers ("Подробно"), the order itself ("Правовая основа") and the pending note (one slim line).
    const admKeys = [
      { ic: 'user', v: X('6 жас', '6 лет', 'Age 6'), k: X('Қабылдау жасы', 'Возраст приёма', 'Admission age') },
      { ic: 'calendar', v: '01.04 – 31.08', k: X('Құжат қабылдау', 'Приём документов', 'Documents accepted') },
      { ic: 'globe', v: 'egov.kz', k: X('немесе мектепте қағаз түрінде', 'или на бумаге в школе', 'or on paper at the school') },
      { ic: 'doc', v: X('Құжаттар', 'Документы', 'Documents'), k: X('өтініш, куәліктер, анықтамалар, фото', 'заявление, свидетельства, справки, фото', 'application, certificates, medical forms, photo') },
    ];
    const admStepsFull = ui.steps([
      { title: X('Жасы', 'Возраст', 'Age'), text: X('Алты жастағы және ағымдағы күнтізбелік жылы алты жасқа толатын балалар қабылданады (8-т.).', 'Принимаются дети шести лет и дети, которым в текущем календарном году исполняется шесть лет (п. 8).', 'Children aged six and those turning six in the current calendar year are admitted (para. 8).') },
      { title: X('Мерзімі', 'Сроки', 'Dates'), text: X('1-сыныпқа құжаттар ағымдағы жылдың 1 сәуірінен 31 тамызына дейін қабылданады (10-т.).', 'Документы в 1 класс принимаются с 1 апреля по 31 августа текущего года (п. 10).', 'Grade 1 documents are accepted from 1 April to 31 August of the current year (para. 10).') },
      { title: X('Қалай беріледі', 'Как подать', 'How to apply'), text: X('egov.kz порталы арқылы немесе қағаз түрінде тікелей мектепке (9-т.).', 'Через портал egov.kz или на бумаге непосредственно в школе (п. 9).', 'Via the egov.kz portal or on paper directly at the school (para. 9).') },
      { title: X('Құжаттар', 'Документы', 'Documents'), text: X('Өтініш, баланың туу туралы куәлігі, ата-ананың жеке куәлігі, № 065/е және № 052-2/е медициналық анықтамалары, 3×4 см фотосурет (11-т.).', 'Заявление, свидетельство о рождении ребёнка, удостоверение личности родителя, медсправки форм 065/у и 052-2/у, фото 3×4 см (п. 11).', 'Application, child’s birth certificate, parent’s ID, medical forms 065/u and 052-2/u, a 3×4 cm photo (para. 11).') },
    ], { cls: 'adm__steps' });
    const admPending = ui.pendingGroup(lang, [{
      title: X('Келесі оқу жылына қабылдау мерзімдері мен бос орындар', 'Сроки приёма на следующий учебный год и свободные места', 'Next year’s admission dates and free places'),
      note: `${L(X('Жоғарыда — № 564 бұйрықтағы жалпы ереже. Нақты қабылдау науқанының мерзімдерін жыл сайын Шымкент қаласының білім басқармасы жариялайды. Келесі оқу жылына қабылдау мерзімдері мен мектептегі бос орындар туралы ақпаратты мектеп', 'Выше — общее правило приказа № 564. Сроки конкретной приёмной кампании ежегодно объявляет управление образования г. Шымкента. Сроки приёма на следующий учебный год и сведения о свободных местах школа опубликует', 'Above is the general rule of order No. 564. The exact dates of each year’s admission campaign are announced by the Shymkent city education department. The school will publish next year’s admission dates and free places'))} <a href="${href('admission')}">${L(X('«Қабылдау» бетінде жариялайды', 'на странице «Приём»', 'on the Admission page'))}</a>.`,
    }], { title: X('Келесі қабылдау мерзімдері — дайындалуда', 'Сроки следующего приёма — готовятся', 'Next admission dates — in preparation') });
    const admLegal = ui.legal([{
      title: X('№ 564 бұйрық, adilet.zan.kz', 'приказ № 564, adilet.zan.kz', 'order No. 564, adilet.zan.kz'), href: ORDER_564[lang], number: '564', date: '2018-10-12',
      note: X('(03.03.2026 өзгерістерімен)', '(с изменениями от 03.03.2026)', '(as amended on 03.03.2026)'),
    }], { note: X('1-сыныпқа қабылдау ҚР Білім және ғылым министрінің 2018 жылғы 12 қазандағы № 564 бұйрығымен бекітілген Үлгілік қағидалар бойынша жүргізіледі.', 'Приём в 1 класс проводится по Типовым правилам, утверждённым приказом Министра образования и науки РК от 12 октября 2018 года № 564.', 'Grade 1 admission follows the Standard Rules approved by order No. 564 of the Minister of Education and Science of Kazakhstan of 12 October 2018.') });
    const admission = `<section class="st st--admission" id="admission" data-station="admission" data-theme="paper" aria-labelledby="admission-title">
<div class="st__inner st__inner--wide">
<div class="st__card st__card--flat">
<ul class="hb-banners" role="list">${banners.map(([slug, th, ic, title, text]) => `<li>${ui.banner({ theme: th, icon: ic, title, text, href: href(slug), label: t('more') })}</li>`).join('')}</ul>
<div class="adm__top">
<header class="blk__head">${eyebrow(X('Қабылдау · 1-сынып', 'Приём · 1 класс', 'Admission · grade 1'))}
<h2 class="st__title" id="admission-title">${L(X('Мектепке қалай түсуге болады', 'Как поступить в школу', 'How to join the school'))}</h2></header>
</div>
<div class="adm">
<div class="adm__main">
<ul class="akeys" role="list">${admKeys.map((k, i) => `<li class="akey akey--${i + 1}"><span class="akey__ic" aria-hidden="true">${ui.icon(k.ic, { size: 20 })}</span><p class="akey__v">${L(k.v)}</p><p class="akey__k">${L(k.k)}</p></li>`).join('')}</ul>
<div class="dz-row adm__dz">${ui.more({ label: X('Толық ереже: 4 қадам', 'Подробно: 4 шага', 'Full rules: 4 steps'), icon: 'book', tone: 'card', body: admStepsFull })}${admLegal}</div>
${admPending}
<div class="adm__cta">${ui.button({ href: href('admission'), label: X('Қабылдау туралы толығырақ', 'Подробнее о приёме', 'Admission details'), kind: 'primary', icon: 'arrow-right', attrs: { 'data-magnetic': '' } })}${ui.button({ href: href('forms'), label: X('Өтініш үлгілері', 'Образцы заявлений', 'Application forms'), kind: 'ghost' })}</div>
</div>
<aside class="adm__side" aria-labelledby="parents-title">
<h3 class="blk__h3" id="parents-title">${L(X('Ата-аналарға', 'Родителям', 'For parents'))}</h3>
<ul class="quick" role="list">${parents.map(([slug, ic, lb]) => `<li><a href="${href(slug)}">${ui.icon(ic, { size: 20 })}<span>${L(lb)}</span></a></li>`).join('')}</ul>
<a class="adm__egov" href="#official-egov"><span class="adm__egov-n" aria-hidden="true">${services.length}</span><span class="adm__egov-t">${L(X('Танымал мемлекеттік қызметтер', 'Популярные госуслуги', 'Popular public services'))}<small>egov.kz</small></span>${ui.icon('arrow-right', { size: 20 })}</a>
</aside>
</div>
</div>
</div>
</section>`;

    // ------------------------------------------------------------ NEWS + latest documents + vacancies + events (B.16, B.19)
    // B.16: compact document rows for the narrow column (title ≤ 2 lines, date, format, download) — the full
    // metadata (issuer, notes) lives on the documents page
    const TYPE_LABEL = { pdf: 'PDF', jpg: 'JPG', jpeg: 'JPG', png: 'PNG', doc: 'DOC', docx: 'DOCX', xls: 'XLS', xlsx: 'XLSX' };
    const docsCompact = (items) => {
      if (!items.length) return `<p class="trio__text">${L(X('Құжаттар «Құжаттар» бөлімінде жарияланады.', 'Документы публикуются в разделе «Документы».', 'Documents are published in the Documents section.'))}</p>`;
      return `<ul class="hdocs" role="list">${items.map((d) => {
        const type = String(d.type || String(d.file).split('.').pop()).toLowerCase();
        const lab = TYPE_LABEL[type] || type.toUpperCase();
        const fmtTxt = `${lab}${d.size ? `, ${fmt.size(d.size)}` : ''}`;
        const title = L(d.title);
        const url = asset(d.file);
        return `<li class="hdoc"><span class="hdoc__type" aria-hidden="true">${ui.icon('doc', { size: 18 })}<b>${lab}</b></span><div class="hdoc__body"><a class="hdoc__t" href="${url}">${title}<span class="sr-only"> (${fmtTxt})</span></a><p class="hdoc__meta">${d.date ? `<time datetime="${d.date}">${fmt.date(d.date)}</time> · ` : ''}${fmtTxt}</p></div><a class="hdoc__dl" href="${url}" download aria-label="${esc(`${t('doc.download')}: ${String(title).replace(/<[^>]*>/g, '')} (${fmtTxt})`)}">${ui.icon('download', { size: 18 })}</a></li>`;
      }).join('')}</ul>`;
    };
    // B.19: the next three dated entries of the events calendar (official dates only; school events stay on events.html)
    const EVENTS = Array.isArray(eventsPage.EVENTS) ? eventsPage.EVENTS : null;
    const EV_TYPES = eventsPage.TYPES || {};
    const today = new Date().toISOString().slice(0, 10);
    const upcoming = EVENTS ? EVENTS.filter((e) => e && e.date && (e.end || e.date) >= today).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3) : [];
    const dm = (s) => `${s.slice(8, 10)}.${s.slice(5, 7)}`;
    const eventsBlock = upcoming.length
      ? `<ul class="hev" role="list">${upcoming.map((e) => `<li class="hev__i"><time class="hev__d" datetime="${e.date}">${dm(e.date)}${e.end ? `<span>–${dm(e.end)}</span>` : ''}</time><div><p class="hev__t">${L(e.title)}</p>${EV_TYPES[e.type] ? `<p class="hev__k">${L(EV_TYPES[e.type].label)}</p>` : ''}</div></li>`).join('')}</ul>`
      : `<p class="trio__text">${L(X('2026–2027 оқу жылының күнтізбесі: тоқсандар, демалыс күндері және мемлекеттік мерекелер.', 'Календарь 2026–2027 учебного года: четверти, каникулы и государственные праздники.', 'The 2026–2027 school-year calendar: terms, breaks and public holidays.'))}</p>`;
    // feedback channels (B.21) — shown in the "Official information" tabs
    const channels = [
      ['feedback', 'chat', X('Өтініш жолдау', 'Направить обращение', 'Send an appeal'), X('Сұрақ, ұсыныс немесе шағым — жауап береміз', 'Вопрос, предложение или жалоба — мы ответим', 'A question, suggestion or complaint — we will reply')],
      ['faq', 'info', X('Сұрақ–жауап', 'Вопрос–ответ', 'FAQ'), X('Ата-аналардың жиі қоятын сұрақтары', 'Частые вопросы родителей', 'Questions parents often ask')],
      ['director-blog', 'user', X('Директор блогы', 'Блог директора', 'Director’s blog'), X('Директорға сұрақ қойыңыз', 'Задайте вопрос директору', 'Ask the director a question')],
    ];
    // ONE compact "Ресми ақпарат / Официальная информация / Official information" block (SPEC §6.1): latest documents
    // (B.16), egov services (B.20), events (B.19), vacancies and feedback channels (B.21) as accessible tabs — every
    // panel stays in the HTML (hidden="until-found" → Ctrl+F / search / print / "Expand all" still reach it).
    const offTabs = ui.tabs([
      { id: 'official-docs', icon: 'doc', label: X('Құжаттар', 'Документы', 'Documents'), count: null,
        body: `<h4 class="off__h">${L(X('Соңғы құжаттар', 'Последние документы', 'Latest documents'))}</h4>${docsCompact(latestDocuments(3))}<p class="blk__links"><a href="${href('documents')}">${L(X('Барлық құжаттар', 'Все документы', 'All documents'))} →</a></p>` },
      { id: 'official-egov', icon: 'globe', label: X('Мемқызметтер', 'Госуслуги', 'e-Gov services'), count: services.length,
        body: `<h4 class="off__h">${L(X('Танымал мемлекеттік қызметтер', 'Популярные госуслуги', 'Popular public services'))}</h4>${ui.linkList(services, { cls: 'off__egov' })}` },
      { id: 'official-events', icon: 'calendar', label: X('Іс-шаралар', 'События', 'Events'), count: upcoming.length || null,
        body: `<h4 class="off__h">${L(X('Іс-шаралар күнтізбесі', 'Календарь событий', 'Events calendar'))}</h4>${eventsBlock}<p class="blk__links"><a href="${href('events')}">${L(X('Барлық іс-шаралар', 'Все события', 'All events'))} →</a><a href="${href('schedule')}">${L(X('Оқу жылы күнтізбесі', 'Академический календарь', 'Academic calendar'))} →</a></p>` },
      { id: 'official-jobs', icon: 'users', label: X('Бос орындар', 'Вакансии', 'Vacancies'),
        body: `<h4 class="off__h">${L(X('Бос жұмыс орындары', 'Вакансии', 'Vacancies'))}</h4><p class="trio__text">${L(X('Лауазымдар, біліктілік талаптары және анықтама телефоны «Бос жұмыс орындары» бөлімінде жарияланады.', 'Должности, квалификационные требования и телефон для справок публикуются в разделе «Вакансии».', 'Positions, qualification requirements and an enquiry phone number are published on the Vacancies page.'))}</p><p class="blk__links"><a href="${href('vacancies')}">${L(X('Бос жұмыс орындары бөлімі', 'Раздел «Вакансии»', 'Vacancies page'))} →</a><a href="tel:${S.contacts.phone.tel}">${ui.icon('phone', { size: 16 })}${S.contacts.phone.display}</a></p>` },
      { id: 'official-feedback', icon: 'chat', label: X('Кері байланыс', 'Обратная связь', 'Feedback'), count: channels.length,
        body: `<h4 class="off__h">${L(X('Кері байланыс арналары', 'Каналы обратной связи', 'Feedback channels'))}</h4><ul class="chan off__chan" role="list">${channels.map(([slug, ic, title, note]) => `<li><a class="chan__a" href="${href(slug)}"><span class="chan__icon" aria-hidden="true">${ui.icon(ic, { size: 22 })}</span><span class="chan__t">${L(title)}</span><span class="chan__n">${L(note)}</span><span class="chan__arrow" aria-hidden="true">${ui.icon('arrow-right', { size: 20 })}</span></a></li>`).join('')}</ul>` },
    ], { label: X('Ресми ақпарат', 'Официальная информация', 'Official information'), cls: 'off__tabs' });
    const newsSec = `<section class="st st--news" id="news" data-station="news" data-theme="paper" aria-labelledby="news-title">
<div class="st__inner st__inner--wide">
<div class="st__card st__card--flat">
<header class="blk__head blk__head--row"><div>${eyebrow(X('Мектеп өмірі', 'Жизнь школы', 'School life'))}
<h2 class="st__title" id="news-title">${L(X('Жаңалықтар', 'Новости', 'News'))}</h2></div>
<p class="blk__links"><a href="${href('news')}">${t('news.all')} →</a><a href="rss.xml">${ui.icon('rss', { size: 16 })} RSS</a></p></header>
${ui.newsList(news, { limit: 3 })}
<div class="off" id="official" role="region" aria-labelledby="official-title">
<header class="off__head"><span class="off__icon" aria-hidden="true">${ui.icon('shield', { size: 22 })}</span><h3 class="off__title" id="official-title">${L(X('Ресми ақпарат', 'Официальная информация', 'Official information'))}</h3></header>
${offTabs}
</div>
</div>
</div>
</section>`;

    // ------------------------------------------------------------ CONTACTS (B.23; feedback channels B.21 → the official block above)
    // B.21: the official mailbox is not confirmed yet (keremet.edu.kz does not resolve). ui.contactList shows that row as
    // «e-mail уточняется» without an address (the filter only drops a row that would carry the raw address). The pending
    // line under the list names the city landline only, so the e-mail is not announced twice at the same level.
    let contactList = ui.contactList({ admission: true });
    if (!S.contacts.emailConfirmed && S.contacts.email) {
      const mail = esc(S.contacts.email);
      contactList = contactList.split('</li>').filter((row) => !row.includes(mail)).join('</li>');
    }
    const contacts = `<section class="st st--contacts" id="contacts" data-station="contacts" data-theme="hero" aria-labelledby="contacts-title">
<div class="st__inner st__inner--wide">
<div class="st__card contacts__card">
<header class="blk__head">${eyebrow(X('Бізге келіңіз', 'Приходите к нам', 'Visit us'))}
<h2 class="st__title" id="contacts-title">${L(X('Байланыс', 'Контакты', 'Contacts'))}</h2></header>
<div class="ct">
<div class="ct__info">
${contactList}
<div class="dz-row ct__dz">${ui.more({ label: X('Қалай жетуге болады · қолжетімділік', 'Как добраться · доступность', 'Getting here · accessibility'), icon: 'bus', tone: 'card', body: `<p class="blk__note">${ui.icon('bus', { size: 16 })}<span>${L(S.addresses.actual.transit)}</span></p>
<p class="blk__note">${ui.icon('accessible', { size: 16 })}<span>${L(S.addresses.actual.building)}</span></p>` })}
${S.contacts.cityPhone ? '' : ui.pendingGroup(lang, [{ title: X('Қалалық телефон (+7 7252 …)', 'Городской телефон (+7 7252 …)', 'City landline (+7 7252 …)'), note: X('Ресми электрондық пошта да нақтылануда — жоғарыдағы тізімде белгіленген.', 'Официальная электронная почта также уточняется — отмечено в списке выше.', 'The official e-mail is also being confirmed — marked in the list above.') }], { title: X('Қалалық телефон нақтылануда', 'Городской телефон уточняется', 'City landline being confirmed'), note: X('Қалалық телефон (+7 7252 …) және ресми электрондық пошта нақтылануда.', 'Городской телефон (+7 7252 …) и официальная электронная почта уточняются.', 'A city landline (+7 7252 …) and the official e-mail are being confirmed.'), cls: 'ct__pend' })}</div>
<div class="ct__btns">${ui.button({ href: `tel:${S.contacts.phone.tel}`, label: t('cta.call'), kind: 'gold', iconLeft: 'phone', ext: false })}${ui.button({ href: `https://wa.me/${S.contacts.phone.whatsapp}`, label: 'WhatsApp', kind: 'light', iconLeft: 'whatsapp' })}${ui.button({ href: g2.url, label: '2GIS', kind: 'light', iconLeft: 'pin' })}${ui.button({ href: S.contacts.instagram.url, label: 'Instagram', kind: 'light', iconLeft: 'instagram' })}</div>
</div>
<div class="ct__side">
<div class="ct__map">${ui.mapEmbed(S.addresses.actual.lat, S.addresses.actual.lng, { zoom: 16, height: 460 })}</div>
</div>
</div>
<p class="ct__a11y">${a11yLink()}<a href="#official-feedback">${ui.icon('chat', { size: 18 })}${L(X('Кері байланыс арналары', 'Каналы обратной связи', 'Feedback channels'))}</a><a href="${href('contacts')}">${L(X('Барлық байланыс деректері', 'Все контакты', 'All contact details'))} →</a></p>
</div>
</div>
</section>`;

    // ------------------------------------------------------------ FINALE
    const finale = `<section class="st st--finale" id="finale" data-station="finale" data-theme="hero" aria-labelledby="finale-title">
<div class="st__inner st__inner--narrow finale">
<p class="finale__word" aria-hidden="true">KEREMET</p>
<div class="st__card finale__card">
<h2 class="st__title" id="finale-title">${L(X('Саяхатты бірге бастайық', 'Начнём путешествие вместе', 'Let’s start the journey together'))}</h2>
<p class="finale__lead">${L(S.slogan)}. ${L(X('Мектепке келіп, танысыңыз немесе өтінім қалдырыңыз.', 'Приходите познакомиться со школой или оставьте заявку.', 'Come and meet the school, or leave a request.'))}</p>
<div class="finale__cta">${ui.button({ href: href('admission'), label: t('cta.apply'), kind: 'gold', size: 'l', icon: 'arrow-right', attrs: { 'data-magnetic': '' } })}${ui.button({ href: `tel:${S.contacts.phone.tel}`, label: S.contacts.phone.display, kind: 'light', size: 'l', iconLeft: 'phone', ext: false })}</div>
</div>
<!--page-meta-->
</div>
</section>`;

    return spriteIcons([bg, rail, hero, jump, about, marquee(MARQUEE_SUBJECTS), subjects, marquee([L(S.slogan), S.slogan.kz === L(S.slogan) ? S.slogan.ru : S.slogan.kz, S.slogan.en === L(S.slogan) ? S.slogan.ru : S.slogan.en], 'marquee--gold'), day, levels, admission, newsSec, contacts, finale].join('\n'));
  },
};
