// Upbringing work — «Адал азамат» unified upbringing programme (ORDER-114 §G item 54).
// Legal facts verified 24.09.2026:
//  · Order of the Minister of Education of RK of 30.07.2024 No. 194 "On approval of the unified upbringing programme
//    «Адал азамат» in educational organisations" (amended 26.05.2025 No. 123 — the programme renamed from «Біртұтас тәрбие»;
//    amended 11.12.2025 No. 281) — prg.kz doc 36168083; Ministry news gov.kz/memleket/entities/edu/press/news/details/1035793
//    (17.07.2025: launched in ALL educational organisations from 1 September 2025, for the first time mandatory for private schools).
//  · Rename supported at the IV National Kurultai, 14.03.2025 (informburo.kz, 03.04.2025).
//  · Predecessor: Order of 19.09.2023 No. 294 "Единая программа воспитания" — repealed by Order No. 194 of 30.07.2024
//    (prg.kz doc 39916933, checked 25.09.2026). Text of Order No. 194: prg.kz doc 36168083.
//  · Six values — Kazakh wording as on mektep.edu.kz (edus.kz, 02.01.2026): тәуелсіздік пен отаншылдық, бірлік пен
//    ынтымақ, әділдік пен жауапкершілік, заң мен тәртіп, еңбекқорлық пен кәсібилік, жасампаздық пен жаңашылдық.
//  · Six projects: gov.kz news (above), topteachers.kz, bilimdinews.kz.
import { ubDoc } from './psychology.mjs';

// School-specific data (annual plan, report, school values) are NOT known → pending blocks / file:null documents.
const X = (kz, ru, en) => ({ kz, ru, en });

export default {
  slug: 'upbringing',
  group: 'upbringing',
  order: 10,
  styles: ['upbringing'],
  title: X('Тәрбие жұмысы', 'Воспитательная работа', 'Upbringing'),
  description: X(
    '«Адал азамат» біртұтас тәрбие бағдарламасы: құндылықтар, жобалар, мектептің тәрбие жұмысының жылдық жоспары.',
    'Единая программа воспитания «Адал азамат»: ценности, проекты, годовой план воспитательной работы школы.',
    'The “Adal Azamat” unified upbringing programme: values, projects and the school’s annual upbringing plan.',
  ),
  lead: X(
    'Мектептегі тәрбие жұмысы «Адал азамат» біртұтас тәрбие бағдарламасына негізделеді: адал, еңбекқор, жауапты және отаншыл азамат тәрбиелеу.',
    'Воспитательная работа школы строится на единой программе воспитания «Адал азамат»: воспитать честного, трудолюбивого, ответственного гражданина-патриота.',
    'Upbringing at the school follows the “Adal Azamat” unified programme: raising honest, hard-working, responsible and patriotic citizens.',
  ),
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, { ui, L, href, fmt, docById }) {
    const adilet = (id) => `https://adilet.zan.kz/${lang === 'kz' ? 'kaz' : 'rus'}/docs/${id}`;
    const GOV_NEWS = 'https://www.gov.kz/memleket/entities/edu/press/news/details/1035793';
    const ORDER_URL = 'https://prg.kz/Document/?doc_id=36168083';
    const ORDER_294_URL = 'https://prg.kz/document/?doc_id=39916933';
    const ORDER = X('ҚР Оқу-ағарту министрінің 2024 жылғы 30 шілдедегі № 194 бұйрығы', 'Приказ Министра просвещения РК от 30 июля 2024 года № 194', 'Order No. 194 of the Minister of Education of Kazakhstan, 30 July 2024');

    // ---------------------------------------------------------------- intro
    const intro = ui.split({
      ratio: '3:2', align: 'center',
      left: `${ui.eyebrow(X('Біртұтас тәрбие', 'Единое воспитание', 'Unified upbringing'))}
<h2 class="sec__title">${L(X('Адал азамат — мектептен басталады', 'Честный гражданин начинается со школы', 'An honest citizen starts at school'))}</h2>
<p class="lead" style="margin-top:18px">${L(X(
        'Мектептің тәрбие жұмысы — Қазақстанның барлық мектептеріне ортақ «Адал азамат» бағдарламасы бойынша.',
        'Воспитательная работа школы строится на «Адал азамат» — общей программе для всех школ Казахстана.',
        'Upbringing at the school follows “Adal Azamat”, the programme shared by every school in Kazakhstan.',
      ))}</p>
<div class="cluster" style="margin-top:26px">${ui.button({ href: '#plan', label: X('Жылдық жоспар', 'Годовой план', 'Annual plan'), icon: 'arrow-right' })}${ui.button({ href: href('clubs'), label: X('Тегін үйірмелер', 'Бесплатные кружки', 'Free clubs'), kind: 'ghost' })}</div>`,
      right: ui.panel({ theme: 'arts', cls: 'ub-emblem', body: `<p class="ub-emblem__k">${L(X('Біртұтас тәрбие бағдарламасы', 'Единая программа воспитания', 'Unified upbringing programme'))}</p>
<p class="ub-emblem__title">Адал<span>азамат</span></p>
<p class="ub-emblem__sub">${L(X('Адалдық, еңбекқорлық, жауапкершілік және отаншылдық — мектеп, отбасы және қоғам бірлесе тәрбиелейді.', 'Честность, трудолюбие, ответственность и патриотизм — школа, семья и общество воспитывают вместе.', 'Honesty, diligence, responsibility and patriotism — school, family and society raise children together.'))}</p>
<p class="ub-emblem__meta"><span>${ui.icon('doc', { size: 16 })}№ 194 · ${fmt.date('2024-07-30')}</span><span>${ui.icon('calendar', { size: 16 })}${L(X('01.09.2025 бастап барлық мектептерде', 'с 01.09.2025 во всех школах', 'in all schools since 01.09.2025'))}</span></p>` }),
    });

    const stats = ui.stats([
      { icon: 'heart', value: '6', label: X('негізгі құндылық', 'базовых ценностей', 'core values'), note: X('әр ай — бір құндылыққа арналған тақырып', 'каждый месяц посвящён одной из ценностей', 'each month is devoted to a value') },
      { icon: 'sparkles', value: '6', label: X('республикалық жоба', 'республиканских проектов', 'national projects'), note: X('«Қамқор», «Шабыт», «Smart Bala» және т.б.', '«Қамқор», «Шабыт», «Smart Bala» и др.', 'Qamqor, Shabyt, Smart Bala and more') },
      { icon: 'school', value: '2025', label: X('жылдан бастап жеке меншік мектептерге де міндетті', 'с этого года обязательна и для частных школ', 'mandatory for private schools too since then'), note: X('01.09.2025 бастап', 'с 01.09.2025', 'from 01.09.2025') },
      { icon: 'users', value: '3', label: X('тәрбие субъектісі', 'участника воспитания', 'partners in upbringing'), note: X('мектеп · отбасы · қоғам', 'школа · семья · общество', 'school · family · society') },
    ]);

    // ---------------------------------------------------------------- about the programme
    const timeline = ui.timeline([
      { date: '2023-09-19', title: X('Алғашқы біртұтас тәрбие бағдарламасы', 'Первая единая программа воспитания', 'The first unified upbringing programme'), text: X(`Оқу-ағарту министрінің № 294 бұйрығымен «Біртұтас тәрбие бағдарламасы» бекітілді; кейін ол № 194 бұйрықпен күшін жойды (${ui.extLink(ORDER_294_URL, 'prg.kz')}).`, `Приказом Министра просвещения № 294 утверждена «Единая программа воспитания»; позднее отменена приказом № 194 (${ui.extLink(ORDER_294_URL, 'prg.kz')}).`, `Order No. 294 of the Minister of Education approved a “Unified upbringing programme”; it was later repealed by Order No. 194 (${ui.extLink(ORDER_294_URL, 'prg.kz')}).`) },
      { date: '2024-07-30', title: X('Бағдарлама бұйрықпен бекітілді', 'Программа утверждена приказом', 'Programme approved by order'), text: X('ҚР Оқу-ағарту министрінің № 194 бұйрығы — білім беру ұйымдарындағы біртұтас тәрбие бағдарламасы.', 'Приказ Министра просвещения РК № 194 — единая программа воспитания в организациях образования.', 'Order No. 194 of the Minister of Education — the unified upbringing programme for educational organisations.') },
      { date: '2025-03-14', title: X('IV Ұлттық құрылтай', 'IV Национальный курултай', '4th National Kurultai'), text: X('Бағдарлама атауын «Адал азамат» деп өзгерту ұсынысы қолдау тапты.', 'Поддержано предложение переименовать программу в «Адал азамат».', 'The proposal to rename the programme “Adal Azamat” was supported.') },
      { date: '2025-05-26', title: X('Жаңа атау бекітілді', 'Новое название утверждено', 'New name approved'), text: X('№ 123 бұйрықпен бағдарламаның «Адал азамат» деген атауы бекітілді.', 'Приказом № 123 утверждено название программы «Адал азамат».', 'Order No. 123 confirmed the name “Adal Azamat”.') },
      { date: '2025-09-01', title: X('Барлық білім беру ұйымдарында', 'Во всех организациях образования', 'In every educational organisation'), text: X('Бағдарлама елдің барлық мектептерінде іске қосылды; алғаш рет жеке меншік мектептер үшін де міндетті.', 'Программа запущена во всех школах страны; впервые обязательна и для частных школ.', 'Launched in all schools nationwide; for the first time mandatory for private schools as well.'), tag: X('Керемет үшін де', 'В том числе для «Керемет»', 'Includes Keremet') },
    ]);
    const aboutFull = `${ui.prose(L(X(
      `<p>Бағдарламаның мақсаты — ұлттық және жалпыадамзаттық құндылықтар негізінде <strong>адал, еңбекқор, жауапты және отаншыл</strong> азамат тәрбиелеу, мектеп, ата-ана және қоғам арасындағы байланысты нығайту. Құқықтық негізі: ${L(ORDER)} (2025 жылғы 26 мамырдағы № 123 бұйрықпен енгізілген өзгерістерімен).</p>`,
      `<p>Цель программы — воспитать <strong>честного, трудолюбивого, ответственного гражданина-патриота</strong> на основе национальных и общечеловеческих ценностей, укрепить связь школы, родителей и общества. Правовая основа: ${L(ORDER)} (с изменениями, внесёнными приказом № 123 от 26 мая 2025 года).</p>`,
      `<p>The programme aims to raise <strong>honest, hard-working, responsible and patriotic</strong> citizens on the basis of national and universal values, and to strengthen ties between school, parents and society. Legal basis: ${L(ORDER)} (as amended by Order No. 123 of 26 May 2025).</p>`,
    )))}
<p class="ub-src"><strong>${L(X('Дереккөздер:', 'Источники:', 'Sources:'))}</strong>${ui.extLink(GOV_NEWS, X('ҚР Оқу-ағарту министрлігі, gov.kz (17.07.2025)', 'Министерство просвещения РК, gov.kz (17.07.2025)', 'Ministry of Education of Kazakhstan, gov.kz (17.07.2025)'))}${ui.extLink(ORDER_URL, X('№ 194 бұйрықтың мәтіні (өзгерістерімен), prg.kz', 'Текст приказа № 194 (с изменениями), prg.kz', 'Text of Order No. 194 (as amended), prg.kz'))}</p>`;
    const introFull = `<p>${L(X(
        '«Адал азамат» — Қазақстанның барлық білім беру ұйымдарында меншік нысанына қарамастан жүзеге асырылатын біртұтас тәрбие бағдарламасы. 2025–2026 оқу жылынан бастап ол алғаш рет жеке меншік мектептер үшін де міндетті болды — сондықтан «Керемет» мектебінің тәрбие жұмысы да осы бағдарламаға сүйенеді.',
        '«Адал азамат» — единая программа воспитания, которая реализуется во всех организациях образования Казахстана независимо от формы собственности. С 2025–2026 учебного года она впервые обязательна и для частных школ — поэтому воспитательная работа школы «Керемет» строится на этой программе.',
        '“Adal Azamat” (“Honest Citizen”) is the unified upbringing programme used in every educational organisation in Kazakhstan, whatever its form of ownership. From the 2025–2026 school year it is mandatory for private schools too, so Keremet’s upbringing work is built on it.',
      ))}</p>`;
    const about = `<div class="ub-goal"><span class="ub-tiles__ic" aria-hidden="true">${ui.icon('target', { size: 22 })}</span><p>${L(X('Мақсаты — <strong>адал, еңбекқор, жауапты және отаншыл</strong> азамат тәрбиелеу. Мектеп, отбасы және қоғам бірлесе жұмыс істейді.', 'Цель — воспитать <strong>честного, трудолюбивого, ответственного гражданина-патриота</strong>. Школа, семья и общество работают вместе.', 'The goal: raise <strong>honest, hard-working, responsible and patriotic</strong> citizens, with school, family and society working together.'))}</p></div>
<div class="dz-row ub-row">${ui.more({ tone: 'card', icon: 'calendar', count: 5, label: X('Бағдарлама тарихы', 'История программы', 'Programme history'), body: timeline })}${ui.legal(introFull + aboutFull)}</div>`;

    // ---------------------------------------------------------------- values
    const values = [
      ['ub-c-coral', X('Тәуелсіздік және отаншылдық', 'Независимость и патриотизм', 'Independence and patriotism'), X('Елін, тілін, тарихын құрметтейтін, Отанына қызмет етуге дайын ұрпақ.', 'Уважение к стране, языку и истории, готовность служить Родине.', 'Respect for the country, its language and history; readiness to serve it.')],
      ['ub-c-sun', X('Бірлік және ынтымақ', 'Единство и солидарность', 'Unity and solidarity'), X('Сыныптастар мен отбасы арасындағы достық, бір-біріне қолдау көрсету.', 'Дружба в классе и семье, взаимная поддержка.', 'Friendship in class and at home; supporting one another.')],
      ['ub-c-sky', X('Әділдік және жауапкершілік', 'Справедливость и ответственность', 'Justice and responsibility'), X('Өз сөзі мен ісіне жауап беру, әділ шешім қабылдай білу.', 'Отвечать за свои слова и поступки, поступать справедливо.', 'Owning one’s words and actions; acting fairly.')],
      ['ub-c-mint', X('Заң және тәртіп', 'Закон и порядок', 'Law and order'), X('Мектеп ережелері мен заңды құрметтеу, қауіпсіз мінез-құлық.', 'Уважение к правилам школы и закону, безопасное поведение.', 'Respect for school rules and the law; safe behaviour.')],
      ['ub-c-violet', X('Еңбекқорлық және кәсібилік', 'Трудолюбие и профессионализм', 'Diligence and professionalism'), X('Еңбекті бағалау, ісін сапалы әрі соңына дейін орындау.', 'Ценить труд, доводить дело до конца и делать его качественно.', 'Valuing work; finishing tasks and doing them well.')],
      ['ub-c-pink', X('Жасампаздық және жаңашылдық', 'Созидание и новаторство', 'Creativity and innovation'), X('Жаңа идеяларды іздеу, шығармашылық пен технологияға құштарлық.', 'Поиск новых идей, интерес к творчеству и технологиям.', 'Seeking new ideas; a passion for creativity and technology.')],
    ];
    const valuesHtml = `<ul class="ub-values" role="list" data-reveal-stagger>${values.map(([c, title, text]) => `<li class="ub-value ${c}"><h3 class="ub-value__title">${L(title)}</h3><p class="ub-value__text">${L(text)}</p><span class="ub-value__bar" aria-hidden="true"></span></li>`).join('')}</ul>
<div class="dz-row ub-row">${ui.more({ icon: 'info', label: X('Құндылықтар мен айлар туралы', 'О ценностях и календаре', 'About the values and the calendar'), body: X(
      'Құндылықтардың атаулары бағдарлама бойынша берілген; қысқа түсініктемелер — мектептің ата-аналар мен оқушыларға арналған түсіндірмесі. Бағдарлама бойынша оқу жылының айлары осы құндылықтарға арналады — нақты айлық күнтізбе мектептің жылдық жоспарында көрсетіледі.',
      'Названия ценностей даны по программе; короткие пояснения — разъяснение для родителей и учеников. По программе месяцы учебного года посвящаются этим ценностям — конкретный помесячный календарь приводится в годовом плане школы.',
      'Value names follow the programme; the short explanations are ours, for parents and pupils. Under the programme each month of the school year is devoted to one of these values — the exact monthly calendar is in the school’s annual plan.',
    ) })}</div>`;

    // ---------------------------------------------------------------- projects
    // One treatment for all six tiles; only the accent colour changes. EN shows Latin transliteration + gloss.
    const projectList = [
      ['ub-c-mint', 'leaf', X('«Қамқор»', '«Қамқор»', 'Qamqor'), X('Қамқорлық', '«Забота»', 'Care'), X('Экология, қамқорлық және волонтерлік: табиғатқа, жақындарға, айналадағыларға көмек.', 'Экология, забота и волонтёрство: помощь природе, близким и окружающим.', 'Ecology, care and volunteering: helping nature, family and others.')],
      ['ub-c-sun', 'handshake', X('«Еңбегі адал — жас өрен»', '«Еңбегі адал — жас өрен»', 'Engbegi Adal — Zhas Oren'), X('Еңбекке баулу', '«Честный труд — юное поколение»', 'Honest work, young generation'), X('Еңбекке баулу: адал еңбекті құрметтеу, алғашқы еңбек дағдылары.', 'Трудовое воспитание: уважение к честному труду, первые трудовые навыки.', 'Learning to work: respect for honest labour and first work skills.')],
      ['ub-c-sky', 'robot', X('«Smart Bala»', '«Smart Bala»', 'Smart Bala'), X('IT және инновация', '«Умный ребёнок»', 'Smart Kid'), X('IT және инновациялық ойлау: цифрлық сауаттылық, логика, жаңа технологиялар.', 'IT и инновационное мышление: цифровая грамотность, логика, новые технологии.', 'IT and innovative thinking: digital literacy, logic, new technologies.')],
      ['ub-c-pink', 'palette', X('«Шабыт»', '«Шабыт»', 'Shabyt'), X('Өнер және мәдениет', '«Вдохновение»', 'Inspiration'), X('Өнер және мәдениет: ұлттық музыка, домбыра, шығармашылық.', 'Искусство и культура: национальная музыка, домбра, творчество.', 'Arts and culture: national music, the dombyra, creativity.')],
      ['ub-c-violet', 'chat', X('«Ұшқыр ой алаңы»', '«Ұшқыр ой алаңы»', 'Ushqyr Oi Alany'), X('Пікірсайыс', '«Площадка острой мысли»', 'Quick-wit platform (debate)'), X('Пікірсайыс алаңы: өз ойын дәлелдеп айту, тыңдай білу.', 'Дебатная площадка: аргументировать своё мнение и слушать других.', 'A debate platform: arguing a view and listening to others.')],
      ['ub-c-coral', 'book', X('«Балалар кітапханасы»', '«Балалар кітапханасы»', 'Balalar Kitaphanasy'), X('Оқу сауаттылығы', '«Детская библиотека»', 'Children’s Library'), X('Оқу сауаттылығы: кітап оқуға деген қызығушылық, отбасылық оқу.', 'Читательская грамотность: интерес к чтению, семейное чтение.', 'Reading literacy: a love of books and family reading.')],
    ];
    const projects = `<ul class="ub-projects" role="list" data-reveal-stagger>${projectList.map(([c, ic, name, gloss, text]) => `<li class="ub-project ${c}"><span class="ub-project__ic" aria-hidden="true">${ui.icon(ic, { size: 28 })}</span><h3 class="ub-project__title"${lang === 'en' ? ' lang="en"' : ' lang="kk"'}>${L(name)}</h3><p class="ub-project__gloss">${L(gloss)}</p></li>`).join('')}</ul>`;
    const projectsNote = `<div class="dz-row ub-row">${ui.more({ tone: 'card', icon: 'sparkles', count: projectList.length, label: X('Жобалар не туралы', 'О чём каждый проект', 'What each project is about'), body: `<ul class="ub-rule-list">${projectList.map(([, , name, , text]) => `<li><strong>${L(name)}</strong> — ${L(text)}</li>`).join('')}</ul>` })}${ui.more({ icon: 'globe', label: X('Дереккөз', 'Источник', 'Source'), body: X(
      `Жобалардың тізімі мен бағыттары ${ui.extLink(GOV_NEWS, 'gov.kz')} жарияланған ресми ақпарат бойынша. Мектептің қай жобаларға қалай қатысатыны жылдық жоспарда көрсетіледі.`,
      `Перечень проектов и их направления — по официальной информации на ${ui.extLink(GOV_NEWS, 'gov.kz')}. В каких проектах и как участвует школа, указывается в годовом плане.`,
      `The list of projects follows official information on ${ui.extLink(GOV_NEWS, 'gov.kz')}. Which projects the school takes part in, and how, is set out in the annual plan.`,
    ) })}</div>`;

    // ---------------------------------------------------------------- how upbringing works at school
    const formCards = ([
      { icon: 'users', title: X('Сынып сағаттары', 'Классные часы', 'Class hours'), text: X('Бағдарлама бойынша әр ай бір құндылыққа арналады; сынып сағаттарының тақырыптары мектептің жылдық жоспарында бекітіледі.', 'По программе каждый месяц посвящён одной ценности; темы классных часов утверждаются в годовом плане школы.', 'Under the programme each month is devoted to one value; class-hour topics are set in the school’s annual plan.'), href: '#plan' },
      { icon: 'sparkles', title: X('Үйірмелер', 'Кружки', 'Clubs'), text: X('Мектептің тегін үйірмелері — қызығушылық пен таланттың алаңы.', 'Бесплатные кружки школы — пространство для интересов и талантов.', 'The school’s free clubs — room for interests and talents.'), href: href('clubs') },
      { icon: 'heart', title: X('Психологиялық қолдау', 'Психологическая поддержка', 'Psychological support'), text: X('Буллингтің, құқық бұзушылықтың алдын алу, киберқауіпсіздік.', 'Профилактика буллинга и правонарушений, кибербезопасность.', 'Preventing bullying and offences; cyber-safety.'), href: href('psychology') },
      { icon: 'handshake', title: X('Ата-аналармен жұмыс', 'Работа с родителями', 'Working with parents'), text: X('Ата-аналар жиналыстары, кеңестер, бірлескен іс-шаралар.', 'Родительские собрания, консультации, совместные мероприятия.', 'Parent meetings, consultations, joint events.'), href: href('parents') },
      { icon: 'book', title: X('Кітап оқу', 'Чтение', 'Reading'), text: X('Мектеп кітапханасы және цифрлық ресурстар.', 'Школьная библиотека и цифровые ресурсы.', 'The school library and digital resources.'), href: href('library') },
      { icon: 'calendar', title: X('Мектеп іс-шаралары', 'Школьные события', 'School events'), text: X('Мерекелер, акциялар, байқаулар — іс-шаралар күнтізбесінде.', 'Праздники, акции, конкурсы — в календаре событий.', 'Celebrations, campaigns and contests — in the events calendar.'), href: href('events') },
    ]);
    // Layer 1: six linked tiles; layer 2: one line about each area.
    const forms = ui.cards(formCards.map((c) => ({ icon: c.icon, title: c.title, href: c.href })), { cols: 3, cls: 'ub-cards-compact' })
      + `<div class="dz-row ub-row">${ui.more({ tone: 'card', icon: 'info', count: formCards.length, label: X('Әр бағыт туралы', 'О каждом направлении', 'About each area'), body: `<ul class="ub-rule-list">${formCards.map((c) => `<li><strong>${L(c.title)}</strong> — ${L(c.text)}</li>`).join('')}</ul>` })}</div>`;

    const schoolValues = ui.pendingGroup(lang, [{
      title: X('Мектептің өз құндылықтары', 'Собственные ценности школы', 'The school’s own values'),
      note: X(
        'Мектеп бекіткен құндылықтар (егер «Адал азамат» құндылықтарынан бөлек болса) және тәрбие жұмысына жауапты директор орынбасарының аты-жөні, байланыс деректері осы жерде жарияланады.',
        'Утверждённые школой ценности (если они дополняют ценности «Адал азамат»), а также ФИО и контакты заместителя директора по воспитательной работе будут опубликованы здесь.',
        'Values approved by the school (if any, beyond the “Adal Azamat” values) and the name and contacts of the deputy director for upbringing will be published here.',
      ),
    }], { title: X('Мектептің құндылықтары мен жауапты тұлғасы нақтылануда', 'Ценности школы и ответственный уточняются', 'The school’s values and lead person being confirmed') });

    // ---------------------------------------------------------------- annual plan & documents
    const planAll = [docById('upbringing-plan'), docById('upbringing-report-2025-2026'), ubDoc(docById, 'bullying-plan')].filter(Boolean);
    const planFacts = `<ul class="lf-facts" role="list">${[
      ['users', X('Сынып сағаттарының тақырыптары — жылдық жоспарда', 'Темы классных часов — в годовом плане', 'Class-hour topics are set in the annual plan')],
      ['doc', X('Бекітілген жоспар PDF түрінде жарияланады', 'Утверждённый план будет опубликован в PDF', 'The approved plan will be published as a PDF')],
    ].map(([ic, tx]) => `<li><span class="lf-facts__ic" aria-hidden="true">${ui.icon(ic, { size: 22 })}</span><span>${L(tx)}</span></li>`).join('')}</ul>`;
    const planDocs = planFacts + ui.docList(planAll.filter((d) => d.file || d.url));
    const planPending = ui.pendingGroup(lang, [...planAll.filter((d) => !d.file && !d.url).map((d) => ({ title: d.title, note: d.note || X('Құжат жүктеледі', 'Документ будет загружен', 'Document to be uploaded') })), { title: X('Жылдық жоспардың айлар бойынша кестесі', 'Помесячная таблица годового плана', 'Month-by-month plan summary'), note: X(
      'Жылдық жоспар бекітілгеннен кейін мұнда айлар бойынша қысқаша кесте (ай — құндылық — негізгі іс-шаралар) жарияланады. Бекітілген жоспардың толық мәтіні PDF түрінде жарияланады.',
      'После утверждения годового плана здесь появится краткая помесячная таблица (месяц — ценность — основные мероприятия). Полный текст утверждённого плана будет опубликован в PDF.',
      'Once the annual plan is approved, a month-by-month summary (month — value — key events) will appear here. The full approved plan will be published as a PDF.',
    ) }]);

    // ---------------------------------------------------------------- sources & related
    const sources = ui.legal([
      { href: GOV_NEWS, title: X('«Адал азамат» бағдарламасы 1 қыркүйектен бастап барлық білім беру ұйымдарында', '«Адал азамат» — с 1 сентября во всех организациях образования', '“Adal Azamat” in all educational organisations from 1 September'), note: X('ҚР Оқу-ағарту министрлігі, gov.kz', 'Министерство просвещения РК, gov.kz', 'Ministry of Education, gov.kz') },
      { href: adilet('Z070000319_'), title: X('«Білім туралы» ҚР Заңы', 'Закон РК «Об образовании»', 'Law of the Republic of Kazakhstan “On Education”'), note: 'adilet.zan.kz' },
      { href: adilet('V2200031180'), title: X('Баланы жәбірлеудің (буллингтің) профилактикасы қағидалары (№ 506)', 'Правила профилактики травли (буллинга) ребёнка (№ 506)', 'Rules on preventing bullying of a child (No. 506)'), note: 'adilet.zan.kz' },
    ], { id: 'sources', title: X('Құқықтық негіз', 'Правовая основа', 'Legal basis') });
    const related = ui.linkList([
      { href: href('clubs'), icon: 'sparkles', label: X('Үйірмелер', 'Кружки и секции', 'Clubs'), note: X('Тегін үйірмелер мен бағыттар', 'Бесплатные кружки и направления', 'Free clubs and programmes') },
      { href: href('psychology'), icon: 'heart', label: X('Психологиялық қызмет', 'Психологическая служба', 'Psychological service'), note: X('Буллинг, киберқауіпсіздік, сенім телефондары 111 және 150', 'Буллинг, кибербезопасность, телефоны доверия 111 и 150', 'Bullying, cyber-safety, helplines 111 and 150') },
      { href: href('parents'), icon: 'handshake', label: X('Ата-аналарға', 'Родителям', 'For parents'), note: X('Жиналыстар, ынтымақтастық түрлері, кеңестер', 'Собрания, формы сотрудничества, советы', 'Meetings, cooperation, advice') },
      { href: href('events'), icon: 'calendar', label: X('Іс-шаралар күнтізбесі', 'Календарь событий', 'Events calendar') },
      { href: href('self-5'), icon: 'target', label: X('Өзін-өзі бағалау: тәрбие жұмысы', 'Самооценка: воспитательная работа', 'Self-assessment: upbringing') },
    ]);

    const toc = ui.toc([
      { id: 'programme', label: X('Бағдарлама туралы', 'О программе', 'About the programme') },
      { id: 'values', label: X('Алты құндылық', 'Шесть ценностей', 'Six values') },
      { id: 'projects', label: X('Жобалар', 'Проекты', 'Projects') },
      { id: 'at-school', label: X('Мектептегі тәрбие', 'Воспитание в школе', 'Upbringing at school') },
      { id: 'plan', label: X('Жылдық жоспар', 'Годовой план', 'Annual plan') },
      { id: 'sources', label: X('Құқықтық негіз', 'Правовая основа', 'Legal basis') },
    ]);

    return [
      intro,
      stats,
      ui.split({ ratio: '1:2', left: toc, right: ui.section({ id: 'programme', eyebrow: X('Бағдарлама', 'Программа', 'Programme'), title: X('«Адал азамат» бағдарламасы туралы', 'О программе «Адал азамат»', 'About the “Adal Azamat” programme'), body: about }) }),
      ui.section({ id: 'values', tone: 'arts', eyebrow: X('Құндылықтар', 'Ценности', 'Values'), title: X('Тәрбиенің алты құндылығы', 'Шесть ценностей воспитания', 'Six values of upbringing'), lead: X('Оқушының адамгершілік таңдауын, мінез-құлқы мен іс-әрекетін айқындайтын негізгі құндылықтар.', 'Базовые ценности, которые определяют нравственный выбор, поведение и поступки ученика.', 'The core values that shape a pupil’s moral choices, behaviour and actions.'), body: valuesHtml }),
      ui.section({ id: 'projects', eyebrow: X('Республикалық жобалар', 'Республиканские проекты', 'National projects'), title: X('Бағдарламаның алты жобасы', 'Шесть проектов программы', 'Six projects of the programme'), body: projects + projectsNote }),
      ui.section({ id: 'at-school', eyebrow: X('Керемет мектебінде', 'В школе «Керемет»', 'At Keremet'), title: X('Тәрбие жұмысының бағыттары', 'Направления воспитательной работы', 'Areas of upbringing work'), lead: X('Тәрбие сабақтан тыс уақытта да жалғасады.', 'Воспитание продолжается и вне уроков.', 'Upbringing continues beyond lessons.'), body: forms + schoolValues }),
      ui.section({ id: 'plan', eyebrow: X('Құжаттар', 'Документы', 'Documents'), title: X('Тәрбие жұмысының жылдық жоспары', 'Годовой план воспитательной работы', 'Annual upbringing plan'), body: planDocs + planPending + `<div class="dz-row ub-row">${sources}</div>` }),
      ui.banner({ theme: 'arts', icon: 'sparkles', eyebrow: X('Сабақтан кейін', 'После уроков', 'After lessons'), title: X('Балаңызға ұнайтын үйірмені таңдаңыз', 'Выберите кружок, который понравится ребёнку', 'Pick a club your child will love'), text: X('Робототехника және ЖИ, бағдарламалау, шешендік өнер, қаржылық сауаттылық және спорт секциялары.', 'Робототехника и ИИ, программирование, ораторское мастерство, финансовая грамотность и спортивные секции.', 'Robotics and AI, programming, public speaking, financial literacy and sports clubs.'), href: href('clubs'), label: X('Үйірмелерге өту', 'Перейти к кружкам', 'See the clubs') }),
      ui.section({ title: X('Осы бөлімде', 'В этом разделе', 'In this section'), body: related }),
    ].join('\n');
  },
};
