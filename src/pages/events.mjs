// Events calendar 2026–2027 (events.html). ORDER-114 O.92 (calendar of events), B.19 (home "events" block source).
// Every date below comes from an official source that was read (see SOURCES); school events are pending until the
// school approves its plan. Month grid + list view switch without JavaScript (radio + CSS :has()).
const X = (kz, ru, en) => ({ kz, ru, en });

// ------------------------------------------------------------------ official sources (read 25.09.2026)
const SOURCES = {
  order: {
    url: 'https://adilet.zan.kz/rus/docs/G26HP000213',
    title: X(
      'ҚР Оқу-ағарту министрінің м.а. 2026 жылғы 29 шілдедегі № 213-НҚ бұйрығы «Орта білім беру ұйымдарында 2026-2027 оқу жылының басталу және аяқталу мерзімдерін, сондай-ақ білім алушыларды қорытынды аттестаттаудан өткізу мерзімдерін айқындау туралы»',
      'Приказ и.о. Министра просвещения РК от 29 июля 2026 года № 213-НҚ «Об определении сроков начала и завершения 2026-2027 учебного года, а также сроков проведения итоговой аттестации обучающихся в организациях среднего образования»',
      'Order No. 213-NK of the Acting Minister of Education of Kazakhstan, 29 July 2026, on the start and end dates of the 2026–2027 school year and the final attestation dates',
    ),
    number: '213-НҚ', numberEn: '213-NK', date: '2026-07-29',
  },
  law: {
    url: 'https://adilet.zan.kz/rus/docs/Z010000267_',
    title: X(
      '«Қазақстан Республикасындағы мерекелер туралы» 2001 жылғы 13 желтоқсандағы № 267 ҚР Заңы (2026 жылғы 11 маусымдағы № 306-VIII Заңмен енгізілген өзгерістермен, 01.07.2026 бастап)',
      'Закон РК от 13 декабря 2001 года № 267 «О праздниках в Республике Казахстан» (с изменениями, внесёнными Законом от 11 июня 2026 года № 306-VIII, действуют с 01.07.2026)',
      'Law of Kazakhstan No. 267 of 13 December 2001 “On holidays in the Republic of Kazakhstan” (as amended by Law No. 306-VIII of 11 June 2026, in force from 1 July 2026)',
    ),
    number: '267', date: '2001-12-13',
  },
  prof: {
    url: 'https://adilet.zan.kz/rus/docs/V2300032924',
    title: X(
      'ҚР Премьер-Министрінің орынбасары – Еңбек және халықты әлеуметтік қорғау министрінің 2023 жылғы 29 маусымдағы № 258 бұйрығы «Кәсіби мерекелер тізбесін бекіту туралы»',
      'Приказ Заместителя Премьер-Министра – Министра труда и социальной защиты населения РК от 29 июня 2023 года № 258 «Об утверждении перечня профессиональных праздников»',
      'Order No. 258 of 29 June 2023 of the Deputy Prime Minister – Minister of Labour and Social Protection “On approving the list of professional holidays”',
    ),
    number: '258', date: '2023-06-29',
  },
};

// ------------------------------------------------------------------ event types
export const TYPES = {
  school: { label: X('Оқу жылы', 'Учебный год', 'School year'), icon: 'graduation' },
  break: { label: X('Демалыс', 'Каникулы', 'School break'), icon: 'sun' },
  break1: { label: X('1-сыныптарға демалыс', 'Каникулы 1 класса', 'Grade 1 break'), icon: 'star' },
  national: { label: X('Ұлттық мереке', 'Национальный праздник', 'National holiday'), icon: 'flag' },
  state: { label: X('Мемлекеттік мереке', 'Государственный праздник', 'State holiday'), icon: 'flag' },
  prof: { label: X('Кәсіби мереке', 'Профессиональный праздник', 'Professional day'), icon: 'heart' },
  exam: { label: X('Қорытынды аттестаттау', 'Итоговая аттестация', 'Final exams'), icon: 'doc' },
};

// ------------------------------------------------------------------ events (Sep 2026 – Aug 2027)
export const EVENTS = [
  { date: '2026-09-01', type: 'school', src: 'order', title: X('2026–2027 оқу жылының басталуы', 'Начало 2026–2027 учебного года', 'The 2026–2027 school year begins'), text: X('1-тоқсан басталады (8 оқу аптасы). Дәстүр бойынша бұл күн Білім күні ретінде аталып өтеді.', 'Начинается 1-я четверть (8 учебных недель). По традиции этот день отмечается как День знаний.', 'Term 1 begins (8 teaching weeks). By tradition the day is celebrated as Knowledge Day.') },
  { date: '2026-10-05', type: 'prof', src: 'prof', title: X('Мұғалім күні', 'День учителя', 'Teachers’ Day'), text: X('Педагогтердің кәсіби мерекесі.', 'Профессиональный праздник педагогов.', 'The professional day of teachers.') },
  { date: '2026-10-25', type: 'national', src: 'law', title: X('Қазақстан Республикасы күні', 'День Республики Казахстан', 'Republic Day of Kazakhstan'), text: X('Ұлттық мереке.', 'Национальный праздник.', 'The national holiday.') },
  { date: '2026-10-26', end: '2026-11-01', type: 'break', src: 'order', title: X('Күзгі демалыс', 'Осенние каникулы', 'Autumn break'), text: X('7 күнтізбелік күн.', '7 календарных дней.', '7 calendar days.') },
  { date: '2026-11-02', type: 'school', src: 'order', derived: true, title: X('2-тоқсанның басталуы', 'Начало 2-й четверти', 'Term 2 begins'), text: X('8 оқу аптасы.', '8 учебных недель.', '8 teaching weeks.') },
  { date: '2026-12-16', type: 'state', src: 'law', title: X('Тәуелсіздік күні', 'День Независимости', 'Independence Day'), text: X('Мемлекеттік мереке.', 'Государственный праздник.', 'State holiday.') },
  { date: '2026-12-28', end: '2027-01-10', type: 'break', src: 'order', title: X('Қысқы демалыс', 'Зимние каникулы', 'Winter break'), text: X('14 күнтізбелік күн.', '14 календарных дней.', '14 calendar days.') },
  { date: '2027-01-01', end: '2027-01-02', type: 'state', src: 'law', title: X('Жаңа жыл', 'Новый год', 'New Year'), text: X('Мемлекеттік мереке.', 'Государственный праздник.', 'State holiday.') },
  { date: '2027-01-11', type: 'school', src: 'order', derived: true, title: X('3-тоқсанның басталуы', 'Начало 3-й четверти', 'Term 3 begins'), text: X('10 оқу аптасы.', '10 учебных недель.', '10 teaching weeks.') },
  { date: '2027-02-08', end: '2027-02-14', type: 'break1', src: 'order', title: X('1-сынып оқушыларына қосымша демалыс', 'Дополнительные каникулы для 1 класса', 'Extra break for Grade 1'), text: X('7 күнтізбелік күн, тек 1-сыныптарға.', '7 календарных дней, только для первоклассников.', '7 calendar days, first-graders only.') },
  { date: '2027-03-08', type: 'state', src: 'law', title: X('Халықаралық әйелдер күні', 'Международный женский день', 'International Women’s Day'), text: X('Мемлекеттік мереке.', 'Государственный праздник.', 'State holiday.') },
  { date: '2027-03-15', type: 'state', src: 'law', title: X('Қазақстан Республикасының Конституциясы күні', 'День Конституции Республики Казахстан', 'Constitution Day'), text: X('Мемлекеттік мереке; 2026 жылдан бастап 15 наурызда аталып өтеді (бұрын — 30 тамыз).', 'Государственный праздник; с 2026 года отмечается 15 марта (ранее — 30 августа).', 'State holiday; since 2026 it is marked on 15 March (formerly 30 August).') },
  { date: '2027-03-21', end: '2027-03-23', type: 'state', src: 'law', title: X('Наурыз мейрамы', 'Наурыз мейрамы', 'Nauryz'), text: X('Мемлекеттік мереке.', 'Государственный праздник.', 'State holiday.') },
  { date: '2027-03-22', end: '2027-03-28', type: 'break', src: 'order', title: X('Көктемгі демалыс', 'Весенние каникулы', 'Spring break'), text: X('7 күнтізбелік күн.', '7 календарных дней.', '7 calendar days.') },
  { date: '2027-03-29', type: 'school', src: 'order', derived: true, title: X('4-тоқсанның басталуы', 'Начало 4-й четверти', 'Term 4 begins'), text: X('8 оқу аптасы.', '8 учебных недель.', '8 teaching weeks.') },
  { date: '2027-05-01', type: 'state', src: 'law', title: X('Қазақстан халқының бірлігі мерекесі', 'Праздник единства народа Казахстана', 'Kazakhstan People’s Unity Day'), text: X('Мемлекеттік мереке.', 'Государственный праздник.', 'State holiday.') },
  { date: '2027-05-07', type: 'state', src: 'law', title: X('Отан қорғаушы күні', 'День защитника Отечества', 'Defender of the Fatherland Day'), text: X('Мемлекеттік мереке.', 'Государственный праздник.', 'State holiday.') },
  { date: '2027-05-09', type: 'state', src: 'law', title: X('Жеңіс күні', 'День Победы', 'Victory Day'), text: X('Мемлекеттік мереке.', 'Государственный праздник.', 'State holiday.') },
  { date: '2027-05-25', type: 'school', src: 'order', title: X('2026–2027 оқу жылының аяқталуы', 'Завершение 2026–2027 учебного года', 'The 2026–2027 school year ends'), text: X('Оқу жылының соңғы күні.', 'Последний день учебного года.', 'The last day of the school year.') },
  { date: '2027-05-31', end: '2027-06-11', type: 'exam', src: 'order', title: X('9 (10)-сыныптардың қорытынды емтихандары', 'Итоговые экзамены 9 (10) классов', 'Final exams, grades 9 (10)'), text: X('Анықтама үшін: біздің мектептің бастауыш сыныптарына қатысты емес.', 'Для справки: не касается начальных классов нашей школы.', 'For reference: does not apply to our primary grades.') },
  { date: '2027-06-01', end: '2027-06-17', type: 'exam', src: 'order', title: X('11 (12)-сыныптардың мемлекеттік емтихандары', 'Государственные выпускные экзамены 11 (12) классов', 'State final exams, grades 11 (12)'), text: X('Анықтама үшін: біздің мектептің бастауыш сыныптарына қатысты емес.', 'Для справки: не касается начальных классов нашей школы.', 'For reference: does not apply to our primary grades.') },
  { date: '2027-07-06', type: 'state', src: 'law', title: X('Астана күні', 'День Столицы', 'Capital City Day'), text: X('Мемлекеттік мереке.', 'Государственный праздник.', 'State holiday.') },
];

// ------------------------------------------------------------------ year structure (order №213-НҚ; term edges derived from the break dates)
const PERIODS = [
  { kind: 'term', n: 1, from: '2026-09-01', to: '2026-10-25', dur: X('8 оқу аптасы', '8 учебных недель', '8 teaching weeks') },
  { kind: 'break', from: '2026-10-26', to: '2026-11-01', label: X('Күзгі демалыс', 'Осенние каникулы', 'Autumn break'), dur: X('7 күн', '7 дней', '7 days') },
  { kind: 'term', n: 2, from: '2026-11-02', to: '2026-12-27', dur: X('8 оқу аптасы', '8 учебных недель', '8 teaching weeks') },
  { kind: 'break', from: '2026-12-28', to: '2027-01-10', label: X('Қысқы демалыс', 'Зимние каникулы', 'Winter break'), dur: X('14 күн', '14 дней', '14 days') },
  { kind: 'term', n: 3, from: '2027-01-11', to: '2027-03-21', dur: X('10 оқу аптасы', '10 учебных недель', '10 teaching weeks') },
  { kind: 'break', from: '2027-03-22', to: '2027-03-28', label: X('Көктемгі демалыс', 'Весенние каникулы', 'Spring break'), dur: X('7 күн', '7 дней', '7 days') },
  { kind: 'term', n: 4, from: '2027-03-29', to: '2027-05-25', dur: X('8 оқу аптасы', '8 учебных недель', '8 teaching weeks') },
  { kind: 'summer', from: '2027-05-26', to: '2027-08-31', label: X('Жазғы демалыс', 'Летние каникулы', 'Summer holidays'), dur: X('оқу жылы аяқталғаннан кейін', 'после окончания учебного года', 'after the school year ends') },
];

const MONTHS = {
  kz: ['Қаңтар', 'Ақпан', 'Наурыз', 'Сәуір', 'Мамыр', 'Маусым', 'Шілде', 'Тамыз', 'Қыркүйек', 'Қазан', 'Қараша', 'Желтоқсан'],
  ru: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};
const MONTH_SHORT = {
  kz: ['қаң', 'ақп', 'нау', 'сәу', 'мам', 'мау', 'шіл', 'там', 'қыр', 'қаз', 'қар', 'жел'],
  ru: ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};
const WD = {
  kz: [['Дс', 'Дүйсенбі'], ['Сс', 'Сейсенбі'], ['Ср', 'Сәрсенбі'], ['Бс', 'Бейсенбі'], ['Жм', 'Жұма'], ['Сн', 'Сенбі'], ['Жс', 'Жексенбі']],
  ru: [['Пн', 'Понедельник'], ['Вт', 'Вторник'], ['Ср', 'Среда'], ['Чт', 'Четверг'], ['Пт', 'Пятница'], ['Сб', 'Суббота'], ['Вс', 'Воскресенье']],
  en: [['Mo', 'Monday'], ['Tu', 'Tuesday'], ['We', 'Wednesday'], ['Th', 'Thursday'], ['Fr', 'Friday'], ['Sa', 'Saturday'], ['Su', 'Sunday']],
};

// ------------------------------------------------------------------ date helpers (UTC, no time zones involved)
const D = (s) => new Date(`${s}T00:00:00Z`);
const key = (d) => d.toISOString().slice(0, 10);
const addDays = (s, n) => { const d = D(s); d.setUTCDate(d.getUTCDate() + n); return key(d); };
const daysBetween = (a, b) => Math.round((D(b) - D(a)) / 864e5) + 1;
const inRange = (day, e) => day >= e.date && day <= (e.end || e.date);
const dm = (s) => `${s.slice(8, 10)}.${s.slice(5, 7)}`;

export default {
  slug: 'events',
  group: 'news',
  order: 20,
  title: { kz: 'Іс-шаралар күнтізбесі', ru: 'Календарь событий', en: 'Events calendar' },
  description: {
    kz: '2026–2027 оқу жылының күнтізбесі: тоқсандар, демалыс күндері, мемлекеттік мерекелер және мектеп іс-шаралары — ай торы мен тізім түрінде.',
    ru: 'Календарь 2026–2027 учебного года: четверти, каникулы, государственные праздники и школьные события — сеткой по месяцам и списком.',
    en: 'The 2026–2027 school-year calendar: terms, breaks, public holidays and school events — as a month grid and as a list.',
  },
  lead: {
    kz: '2026–2027 оқу жылы: тоқсандар мен демалыстар, ұлттық және мемлекеттік мерекелер. Барлық күндер ресми құжаттар бойынша көрсетілген.',
    ru: '2026–2027 учебный год: четверти и каникулы, национальные и государственные праздники. Все даты — по официальным документам.',
    en: 'The 2026–2027 school year: terms and breaks, national and state holidays. Every date is taken from official documents.',
  },
  styles: ['news'],
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, { ui, L, href, fmt, docById }) {
    const src = (id) => SOURCES[id];
    const range = (e) => (e.end ? `${fmt.date(e.date)} – ${fmt.date(e.end)}` : fmt.date(e.date));
    const typeLabel = (t) => L(TYPES[t].label);
    const holidays = EVENTS.filter((e) => e.type === 'state' || e.type === 'national');

    // ---------------------------------------------------------------- stats
    const stats = ui.stats([
      { icon: 'calendar', art: true, value: '01.09 → 25.05', label: X('2026–2027 оқу жылы', '2026–2027 учебный год', 'The 2026–2027 school year'), note: X('№ 213-НҚ бұйрық бойынша', 'по приказу № 213-НҚ', 'under order No. 213-NK'),
        extra: ui.chips([{ icon: 'graduation', label: X('1-тоқсан · 1 қыркүйек', '1-я четверть · 1 сентября', 'Term 1 · 1 September') }, { icon: 'sun', label: X('Жаз · 26 мамырдан', 'Лето · с 26 мая', 'Summer · from 26 May') }]) },
      { icon: 'book', value: '34', label: X('оқу аптасы', 'учебные недели', 'teaching weeks'), note: '8 + 8 + 10 + 8' },
      { icon: 'sun', value: '28', label: X('күн демалыс', 'дней каникул', 'days of breaks'), note: X('+7 күн 1-сыныптарға', '+7 дней для 1 класса', '+7 days for Grade 1') },
      { icon: 'grid', value: '4', label: X('тоқсан', 'четверти', 'terms'), note: X('күз · қыс · көктем', 'осень · зима · весна', 'autumn · winter · spring') },
      { icon: 'flag', value: String(holidays.length), label: X('ресми мереке', 'официальных праздников', 'public holidays'), note: X('оқу жылы мен жаз ішінде', 'за учебный год и лето', 'during the year and summer') },
    ], { cls: 'stats--bento' });

    // ---------------------------------------------------------------- year ribbon (visual) + table (accessible)
    const total = daysBetween(PERIODS[0].from, PERIODS[PERIODS.length - 1].to);
    const segLabel = (p) => (p.kind === 'term' ? L(X(`${p.n}-тоқсан`, `${p.n}-я четверть`, `Term ${p.n}`)) : L(p.label));
    const ribbon = `<div class="ev-ribbon" aria-hidden="true"><div class="ev-ribbon__bar">${PERIODS.map((p) => `<span class="ev-seg ev-seg--${p.kind}" style="flex-grow:${daysBetween(p.from, p.to)}"><b>${p.kind === 'term' ? p.n : ''}</b><em>${segLabel(p)}</em></span>`).join('')}</div>
<div class="ev-ribbon__first" style="left:${((daysBetween(PERIODS[0].from, '2027-02-08') - 1) / total * 100).toFixed(2)}%;width:${(7 / total * 100).toFixed(2)}%"><span>${L(X('1-сынып', '1 кл.', 'Gr. 1'))}</span></div>
<div class="ev-ribbon__axis">${Array.from({ length: 12 }, (_, i) => { const m = (8 + i) % 12; const y = m >= 8 ? 2026 : 2027; const first = `${y}-${String(m + 1).padStart(2, '0')}-01`; return `<span style="left:${((daysBetween(PERIODS[0].from, first) - 1) / total * 100).toFixed(2)}%">${MONTH_SHORT[lang][m]}</span>`; }).join('')}</div></div>`;
    const periodTable = ui.table({
      cls: 'ev-ptable',
      caption: X('2026–2027 оқу жылының құрылымы', 'Структура 2026–2027 учебного года', 'Structure of the 2026–2027 school year'),
      head: [X('Кезең', 'Период', 'Period'), X('Мерзімі', 'Сроки', 'Dates'), X('Ұзақтығы', 'Продолжительность', 'Length')],
      rows: [
        ...PERIODS.filter((p) => p.kind !== 'summer').map((p) => [`<span class="ev-dot ev-dot--${p.kind}" aria-hidden="true"></span>${segLabel(p)}`, `${fmt.date(p.from)} – ${fmt.date(p.to)}`, L(p.dur)]),
        [`<span class="ev-dot ev-dot--break1" aria-hidden="true"></span>${L(X('1-сыныптарға қосымша демалыс', 'Доп. каникулы для 1 класса', 'Extra Grade 1 break'))}`, `${fmt.date('2027-02-08')} – ${fmt.date('2027-02-14')}`, L(X('7 күн', '7 дней', '7 days'))],
      ],
    });
    const derivedText = X(
      'Демалыс мерзімдері мен оқу жылының басталуы/аяқталуы — № 213-НҚ бұйрықтан. Тоқсандардың бірінші және соңғы күндері демалыс мерзімдеріне сәйкес көрсетілген; мектептің бекітілген академиялық күнтізбесі жарияланғаннан кейін нақтыланады.',
      'Сроки каникул и начала/окончания учебного года — из приказа № 213-НҚ. Первые и последние дни четвертей показаны по срокам каникул; уточняются после публикации утверждённого академического календаря школы.',
      'Break dates and the start/end of the year come from order No. 213-NK. The first and last days of each term follow from the break dates and will be confirmed when the school publishes its approved academic calendar.',
    );
    // Layer 2: where the dates come from (the order + how term edges were derived) → one "⚖ Legal basis" chip.
    const srcItem = (id, note) => { const s = src(id); return { title: s.title, number: lang === 'en' ? (s.numberEn || s.number) : s.number, date: s.date, href: s.url, note }; };
    const derivedNote = ui.legal([srcItem('order')], { note: derivedText });

    // ---------------------------------------------------------------- toolbar: view switch + legend
    const legend = `<ul class="ev-legend" role="list" aria-label="${L(X('Шартты белгілер', 'Условные обозначения', 'Legend'))}">${['school', 'break', 'break1', 'state', 'prof', 'exam'].map((t) => `<li><span class="ev-sw ev-sw--${t}" aria-hidden="true"></span>${t === 'state' ? L(X('Ұлттық / мемлекеттік мереке', 'Национальный / государственный праздник', 'National / state holiday')) : typeLabel(t)}</li>`).join('')}<li><span class="ev-sw ev-sw--we" aria-hidden="true"></span>${L(X('Демалыс күні (сб, жс)', 'Выходной (сб, вс)', 'Weekend (Sat, Sun)'))}</li></ul>`;
    const viewSwitch = `<fieldset class="ev-view"><legend class="nw-filter__legend">${L(X('Көрініс', 'Вид', 'View'))}</legend><div class="nw-filter__opts">
<input class="nw-radio" type="radio" name="ev-view" id="ev-v-grid" value="grid"><label class="nw-chip" for="ev-v-grid">${ui.icon('grid', { size: 16 })}${L(X('Ай торы', 'Сетка месяцев', 'Month grid'))}</label>
<input class="nw-radio" type="radio" name="ev-view" id="ev-v-list" value="list"><label class="nw-chip" for="ev-v-list">${ui.icon('menu', { size: 16 })}${L(X('Тізім', 'Список', 'List'))}</label></div></fieldset>`;

    // ---------------------------------------------------------------- month grids
    const months = Array.from({ length: 12 }, (_, i) => { const m = (8 + i) % 12; return { y: m >= 8 ? 2026 : 2027, m }; });
    const dayInfo = (day) => {
      const hits = EVENTS.filter((e) => inRange(day, e));
      return hits;
    };
    const monthCard = ({ y, m }) => {
      const first = `${y}-${String(m + 1).padStart(2, '0')}-01`;
      const dim = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
      const lead = (D(first).getUTCDay() + 6) % 7; // Monday-first
      const cells = [];
      for (let i = 0; i < lead; i++) cells.push('<td class="ev-d ev-d--pad"></td>');
      for (let d = 1; d <= dim; d++) {
        const day = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const wd = (lead + d - 1) % 7;
        const hits = dayInfo(day);
        const inSummer = day >= '2027-05-26';
        const cls = ['ev-d', wd >= 5 ? 'is-we' : '', ...new Set(hits.map((h) => `is-${h.type === 'national' ? 'state' : h.type}`)), inSummer ? 'is-summer' : '', hits.some((h) => h.date === day && h.type === 'school') ? 'is-start' : ''].filter(Boolean).join(' ');
        const sr = hits.length ? `<span class="sr-only"> — ${hits.map((h) => L(h.title)).join('; ')}</span>` : '';
        cells.push(`<td class="${cls}"${hits.length ? ` title="${ui.esc(hits.map((h) => L(h.title)).join(' · '))}"` : ''}><span class="ev-d__n">${d}</span>${sr}</td>`);
      }
      while (cells.length % 7) cells.push('<td class="ev-d ev-d--pad"></td>');
      const rows = [];
      for (let i = 0; i < cells.length; i += 7) rows.push(`<tr>${cells.slice(i, i + 7).join('')}</tr>`);
      const monthEvents = EVENTS.filter((e) => e.date.slice(0, 7) === first.slice(0, 7) || (e.end && e.date < first && e.end >= first));
      const id = `m-${first.slice(0, 7)}`;
      return `<article class="ev-month" id="${id}" aria-labelledby="${id}-t"><h3 class="ev-month__title" id="${id}-t"><span>${MONTHS[lang][m]}</span><span class="sr-only">&nbsp;</span><small>${y}</small></h3>
<table class="ev-cal"><caption class="sr-only">${MONTHS[lang][m]} ${y}</caption><thead><tr>${WD[lang].map(([s, f]) => `<th scope="col"><abbr title="${f}">${s}</abbr></th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table>
${monthEvents.length ? `<ul class="ev-month__list" role="list">${monthEvents.map((e) => `<li class="ev-mi ev-mi--${e.type === 'national' ? 'state' : e.type}"><span class="ev-mi__d">${e.end ? `${dm(e.date)}–${dm(e.end)}` : dm(e.date)}</span><span>${L(e.title)}</span></li>`).join('')}</ul>` : `<p class="ev-month__none">${L(X('Ресми күндер жоқ · мектеп іс-шаралары жоспарланады', 'Официальных дат нет · школьные события планируются', 'No official dates · school events to be planned'))}</p>`}</article>`;
    };
    const gridHint = `<p class="ev-grid__hint">${ui.icon('info', { size: 16 })}<span>${L(X('Телефонда күндердің сипаттамасы «Тізім» көрінісінде берілген.', 'На телефоне расшифровка дат — в режиме «Список».', 'On a phone, the dates are explained in the “List” view.'))}</span></p>`;
    // Layer 1: one season (3 month grids) at a time — tabs Autumn / Winter / Spring / Summer; the season of the build date
    // is selected. Every other month stays in the HTML (hidden="until-found": Ctrl+F, "Expand all" and print show them).
    const SEASONS = [
      { label: X('Күз', 'Осень', 'Autumn'), icon: 'leaf' },
      { label: X('Қыс', 'Зима', 'Winter'), icon: 'star' },
      { label: X('Көктем', 'Весна', 'Spring'), icon: 'sparkles' },
      { label: X('Жаз', 'Лето', 'Summer'), icon: 'sun' },
    ];
    const mKey = ({ y, m }) => `${y}-${String(m + 1).padStart(2, '0')}`;
    const nowKey = new Date().toISOString().slice(0, 7);
    const nowIdx = months.findIndex((x) => mKey(x) === nowKey);
    const season = nowIdx >= 0 ? Math.floor(nowIdx / 3) : nowKey < mKey(months[0]) ? 0 : 3;
    const gridTabs = ui.tabs(SEASONS.map((sn, si) => {
      const ms = months.slice(si * 3, si * 3 + 3);
      const n = EVENTS.filter((e) => ms.some((x) => e.date.slice(0, 7) === mKey(x))).length;
      return {
        label: `${L(sn.label)} <small class="ev-tab__m">${MONTH_SHORT[lang][ms[0].m]}–${MONTH_SHORT[lang][ms[2].m]}</small>`,
        icon: sn.icon, count: n,
        body: `<div class="ev-months">${ms.map(monthCard).join('')}</div>`,
      };
    }), { label: X('Маусым', 'Сезон', 'Season'), selected: season, cls: 'ev-tabs' });
    const gridView = `<div class="ev-grid" id="ev-grid">${gridHint}${gridTabs}</div>`;

    // ---------------------------------------------------------------- list view
    // The source of every date (was a link under each row) → one "⚖ Legal basis" chip per month: each act with the events
    // of that month it sets (and which term edges are derived from the break dates).
    const SHORT = {
      order: X('Оқу жылының мерзімдері туралы бұйрық', 'Приказ о сроках учебного года', 'Order on the school-year dates'),
      law: X('«Мерекелер туралы» Заң', 'Закон «О праздниках»', 'Law on Holidays'),
      prof: X('Кәсіби мерекелер тізбесі', 'Перечень профессиональных праздников', 'List of professional holidays'),
    };
    const derivedTxt = X('демалыс мерзімдерінен есептелген', 'рассчитано по срокам каникул', 'derived from the break dates');
    const monthLegal = (list) => {
      const ids = [...new Set(list.map((e) => e.src))];
      return `<div class="ev-lm__legal">${ui.legal(ids.map((id) => ({
        title: SHORT[id],
        number: lang === 'en' ? (src(id).numberEn || src(id).number) : src(id).number, date: src(id).date, href: src(id).url,
        note: list.filter((e) => e.src === id).map((e) => `${L(e.title)}${e.derived ? ` (${L(derivedTxt)})` : ''}`).join('; '),
      })), { title: X('Күндердің дереккөзі', 'Источник дат', 'Source of the dates') })}</div>`;
    };
    const byMonth = months.map(({ y, m }) => ({ y, m, list: EVENTS.filter((e) => e.date.slice(0, 7) === `${y}-${String(m + 1).padStart(2, '0')}`) })).filter((g) => g.list.length);
    // list view: every month is a <details>; the current month (at build time) and the next two are open
    let firstOpen = byMonth.findIndex((g) => `${g.y}-${String(g.m + 1).padStart(2, '0')}` >= nowKey);
    if (firstOpen < 0) firstOpen = 0;
    const listHint = `<p class="ev-list__hint">${ui.icon('info', { size: 16 })}<span>${L(X('Ағымдағы және келесі екі ай ашық. Басқа айды ашу үшін оның атауын басыңыз.', 'Открыты текущий и два следующих месяца. Чтобы открыть другой месяц, нажмите на его название.', 'The current month and the next two are open. Tap a month name to open it.'))}</span></p>`;
    const listView = `<div class="ev-list" id="ev-list">${listHint}${byMonth.map((g, gi) => `<details class="ev-lm"${gi >= firstOpen && gi < firstOpen + 3 ? ' open' : ''}><summary class="ev-lm__sum"><h3 class="ev-lm__title" id="lm-${g.y}-${g.m}">${MONTHS[lang][g.m]} ${g.y}</h3><span class="ev-lm__n">${g.list.length}</span></summary><ol class="ev-rows" role="list">${g.list.map((e) => {
      const d = D(e.date);
      return `<li class="ev-row ev-row--${e.type === 'national' ? 'state' : e.type}"><time class="ev-row__date" datetime="${e.date}"><b>${d.getUTCDate()}</b><span>${MONTH_SHORT[lang][d.getUTCMonth()]}</span></time><div class="ev-row__body"><p class="ev-row__meta"><span class="ev-type">${ui.icon(TYPES[e.type].icon, { size: 14 })}${typeLabel(e.type)}</span><span class="ev-row__range">${range(e)}${e.end ? ` · ${L(X(`${daysBetween(e.date, e.end)} күн`, `${daysBetween(e.date, e.end)} дн.`, `${daysBetween(e.date, e.end)} days`))}` : ''}</span></p><p class="ev-row__title">${L(e.title)}</p>${e.text ? `<p class="ev-row__text">${L(e.text)}</p>` : ''}</div></li>`;
    }).join('')}</ol>${monthLegal(g.list)}</details>`).join('')}</div>`;

    const calendar = `<div class="ev" id="calendar-box"><div class="nw-tools ev-tools">${viewSwitch}${legend}</div>${gridView}${listView}</div>`;

    // ---------------------------------------------------------------- school events (pending)
    // Layer 1: one card — what kinds of events are coming (chips); layer 2: the full note + the 3 pending plan documents.
    const schoolNote = X(
      'Мектептің 2026–2027 оқу жылына арналған іс-шаралары (ата-аналар жиналыстары, мерекелік кештер, олимпиадалар мен байқаулар, ашық есік күндері, спорт жарыстары) тәрбие жұмысының жылдық жоспары бекітілгеннен кейін осы күнтізбеге енгізіледі. Әр іс-шараның күні, уақыты, өтетін орны және жауаптысы көрсетіледі.',
      'Школьные мероприятия 2026–2027 учебного года (родительские собрания, праздники, олимпиады и конкурсы, дни открытых дверей, спортивные соревнования) будут внесены в календарь после утверждения годового плана воспитательной работы. Для каждого мероприятия будут указаны дата, время, место и ответственный.',
      'The school’s own events for 2026–2027 (parent meetings, celebrations, olympiads and contests, open days, sports competitions) will be added once the annual upbringing plan is approved. Each entry will show the date, time, place and person in charge.',
    );
    const school = `<div class="ev-soon pattern" data-theme="arts">
<div class="ev-soon__head"><span class="ev-soon__ico" aria-hidden="true">${ui.icon('hourglass', { size: 24 })}</span><div><p class="ev-soon__k">${L(X('Мектеп іс-шараларының жоспары', 'План школьных мероприятий', 'School events plan'))}</p><p class="ev-soon__t">${L(X('Жоспар бекітілгеннен кейін күнтізбеге қосылады', 'Появится в календаре после утверждения плана', 'Will appear in the calendar once the plan is approved'))}</p></div></div>
${ui.chips([
      { icon: 'users', label: X('Ата-аналар жиналыстары', 'Родительские собрания', 'Parent meetings') },
      { icon: 'trophy', label: X('Олимпиадалар мен байқаулар', 'Олимпиады и конкурсы', 'Olympiads and contests') },
      { icon: 'sparkles', label: X('Мерекелік кештер', 'Праздничные мероприятия', 'Celebrations') },
      { icon: 'school', label: X('Ашық есік күндері', 'Дни открытых дверей', 'Open days') },
      { icon: 'ball', label: X('Спорт жарыстары', 'Спортивные соревнования', 'Sports events') },
    ])}
<div class="dz-row">${ui.more({ body: `<p>${L(schoolNote)}</p>` })}${ui.docList([docById('academic-calendar'), docById('upbringing-plan'), docById('timetable')].filter(Boolean), { groupPending: true }).replace(/^<div class="docs-group">([\s\S]*)<\/div>$/, '$1')}</div>
</div>`;

    // ---------------------------------------------------------------- sources
    // The three acts (full titles, adilet links) → one legal chip; the note on days off → "More".
    const SETS = {
      order: X('Оқу жылының басталуы мен аяқталуы, демалыстар, қорытынды аттестаттау', 'Начало и конец учебного года, каникулы, итоговая аттестация', 'Start and end of the school year, breaks, final exams'),
      law: X('Ұлттық және мемлекеттік мерекелер', 'Национальные и государственные праздники', 'National and state holidays'),
      prof: X('Мұғалім күні', 'День учителя', 'Teachers’ Day'),
    };
    const sources = ui.legal(Object.keys(SOURCES).map((id) => srcItem(id, SETS[id])), { title: X('Ресми құжаттар', 'Официальные документы', 'Official documents') });
    const holidayNote = ui.more({
      icon: 'info',
      label: X('Демалыс күндері туралы', 'О выходных днях', 'About days off'),
      body: X(
        'Мерекелердің қайсысы демалыс күні болатыны және демалыс күндерінің ауыстырылуы ҚР Еңбек кодексімен және Үкімет қаулыларымен белгіленеді. Діни мерекелердің ішінде православиелік Рождество күні тұрақты — 7 қаңтар (2027 жылы қысқы демалыс кезеңіне келеді), ал Құрбан айттың бірінші күні жыл сайын жеке айқындалады, сондықтан ол ресми жарияланғаннан кейін күнтізбеге қосылады.',
        'Какие праздники являются выходными днями и переносы выходных определяются Трудовым кодексом РК и постановлениями Правительства. Из религиозных праздников дата Православного Рождества постоянна — 7 января (в 2027 году приходится на зимние каникулы), а первый день Курбан айта определяется ежегодно отдельно, поэтому он будет добавлен в календарь после официального объявления.',
        'Which holidays are days off, and any moved days off, are set by the Labour Code and Government resolutions. Among the religious holidays, Orthodox Christmas has a fixed date, 7 January (in 2027 it falls in the winter break), while the first day of Kurban Ait is set each year and will be added once officially announced.',
      ),
    });

    const related = ui.linkList([
      { href: href('schedule'), icon: 'clock', label: X('Сабақ кестесі және академиялық күнтізбе', 'Расписание и академический календарь', 'Timetable and academic calendar') },
      { href: href('news'), icon: 'grid', label: X('Жаңалықтар', 'Новости', 'News'), note: X('Өткен іс-шаралардың нәтижелері', 'Итоги прошедших событий', 'Outcomes of past events') },
      { href: href('projects'), icon: 'bulb', label: X('Мектеп жобалары', 'Проекты школы', 'School projects') },
      { href: href('upbringing'), icon: 'heart', label: X('Тәрбие жұмысы', 'Воспитательная работа', 'Upbringing'), note: X('«Адал азамат» жоспары', 'План «Адал азамат»', 'The “Adal azamat” plan') },
      { href: 'https://www.gov.kz/memleket/entities/edu', icon: 'globe', label: X('ҚР Оқу-ағарту министрлігі', 'Министерство просвещения РК', 'Ministry of Education'), note: 'gov.kz' },
    ]);

    const toc = ui.toc([
      { id: 'year', label: X('Оқу жылының құрылымы', 'Структура учебного года', 'Year structure') },
      { id: 'calendar', label: X('Күнтізбе', 'Календарь', 'Calendar') },
      { id: 'school-events', label: X('Мектеп іс-шаралары', 'Школьные мероприятия', 'School events') },
      { id: 'sources', label: X('Ресми дереккөздер', 'Официальные источники', 'Official sources') },
    ]);

    return [
      stats,
      `<div class="nw-tocrow">${toc}</div>`,
      ui.section({ id: 'year', eyebrow: X('Тоқсандар мен демалыстар', 'Четверти и каникулы', 'Terms and breaks'), title: X('Оқу жылының құрылымы', 'Структура учебного года', 'How the year is structured'), body: ribbon + `<div class="ev-year-grid">${periodTable}<div class="ev-year-law">${derivedNote}</div></div>` }),
      ui.section({ id: 'calendar', eyebrow: X('Қыркүйек 2026 — тамыз 2027', 'Сентябрь 2026 — август 2027', 'September 2026 — August 2027'), title: X('Күнтізбе', 'Календарь', 'Calendar'), lead: X('Ай торы немесе тізім — ыңғайлы көріністі таңдаңыз. Ай торында күндердің сипаттамасы әр айдың астында.', 'Сетка месяцев или список — выберите удобный вид. В сетке расшифровка дат — под каждым месяцем.', 'Month grid or list — pick the view you prefer. In the grid, dates are explained under each month.'), body: calendar }),
      ui.section({ id: 'school-events', eyebrow: X('Мектепте', 'В школе', 'At school'), title: X('Мектеп іс-шаралары', 'Школьные мероприятия', 'School events'), body: school }),
      ui.section({ id: 'sources', tone: 'tint', eyebrow: X('Құқықтық негіз', 'Правовая основа', 'Legal basis'), title: X('Ресми дереккөздер', 'Официальные источники', 'Official sources'), lead: X('Күнтізбедегі барлық күндер үш ресми құжаттан алынған.', 'Все даты календаря взяты из трёх официальных документов.', 'Every date in the calendar comes from three official documents.'), body: `<div class="dz-row">${sources}${holidayNote}</div>` }),
      ui.section({ title: X('Осы бөлімде', 'В этом разделе', 'In this section'), body: related }),
    ].join('\n');
  },
};
