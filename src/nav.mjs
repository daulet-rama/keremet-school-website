// =====================================================================================
//  src/nav.mjs — the site map (SPEC §8). Drives header mega-menu, mobile menu, footer,
//  breadcrumbs, the in-section pills under each page hero, sitemap.html and build checks.
//  Slugs are FIXED. Every slug listed here must have a page module in src/pages/.
//
//  Exports:
//    TOP            [{ id, label{kz,ru,en}, intro{…}, groups:[groupId…] }]      7 top menu items
//    GROUPS         { [groupId]: { id, theme, top, label{…}, pages:[slug…] } }
//    PAGE_LABELS    { [slug]: { kz, ru, en } }   short menu labels for every nav page
//    THEMES         list of theme ids
//    groupOf(slug)  → group object | null        topOf(groupId) → top item | null
//    navSlugs()     → all slugs in the menu (incl. util)
//    firstPage(groupId) → slug
//    themeOf(page)  → page.theme || group.theme || 'paper'
// =====================================================================================

export const THEMES = ['hero', 'math', 'physics', 'chemistry', 'biology', 'geography', 'languages', 'informatics', 'arts', 'day', 'paper'];

export const TOP = [
  {
    id: 'school',
    label: { kz: 'Мектеп', ru: 'О школе', en: 'School' },
    intro: {
      kz: 'Мектеп туралы жалпы мәлімет, басшылық, лицензия, құрылым және педагогтер.',
      ru: 'Общие сведения, руководство, лицензия, структура и педагоги школы.',
      en: 'General information, leadership, licence, governance and teachers.',
    },
    groups: ['about', 'staff'],
  },
  {
    id: 'self',
    label: { kz: 'Өзін-өзі бағалау', ru: 'Самооценка', en: 'Self-assessment' },
    intro: {
      kz: 'Мемлекеттік аттестаттауға арналған өзін-өзі бағалау материалдары: 8 бағыт, 39 өлшемшарт.',
      ru: 'Материалы самооценки для государственной аттестации: 8 направлений, 39 критериев.',
      en: 'Self-assessment materials for the state attestation: 8 areas, 39 criteria.',
    },
    groups: ['self'],
  },
  {
    id: 'education',
    label: { kz: 'Білім беру', ru: 'Обучение', en: 'Education' },
    intro: {
      kz: 'Оқу жоспары, сабақ кестесі, бағалау, тәрбие жұмысы, үйірмелер және психологиялық қолдау.',
      ru: 'Учебный план, расписание, оценивание, воспитательная работа, кружки и психологическая поддержка.',
      en: 'Curriculum, timetable, assessment, upbringing, clubs and psychological support.',
    },
    groups: ['education', 'upbringing'],
  },
  {
    id: 'admission',
    label: { kz: 'Қабылдау', ru: 'Приём', en: 'Admission' },
    intro: {
      kz: 'Мектепке қалай түсуге болады: ережелер, құжаттар, өтініш үлгілері және шарт.',
      ru: 'Как поступить в школу: правила, документы, образцы заявлений и договор.',
      en: 'How to join the school: rules, documents, application forms and contract.',
    },
    groups: ['admission'],
  },
  {
    id: 'life',
    label: { kz: 'Мектеп өмірі', ru: 'Жизнь школы', en: 'School life' },
    intro: {
      kz: 'Ғимарат, тамақтану, қауіпсіздік, денсаулық, кітапхана, жаңалықтар мен іс-шаралар.',
      ru: 'Здание, питание, безопасность, здоровье, библиотека, новости и события.',
      en: 'Building, meals, safety, health, library, news and events.',
    },
    groups: ['campus', 'news'],
  },
  {
    id: 'documents',
    label: { kz: 'Құжаттар', ru: 'Документы', en: 'Documents' },
    intro: {
      kz: 'Мектептің ішкі құжаттары, нормативтік актілер, есептер және құпиялылық саясаты.',
      ru: 'Внутренние документы школы, нормативные акты, отчёты и политика конфиденциальности.',
      en: 'School documents, legislation, reports and the privacy policy.',
    },
    groups: ['documents'],
  },
  {
    id: 'contacts',
    label: { kz: 'Байланыс', ru: 'Контакты', en: 'Contacts' },
    intro: {
      kz: 'Мекенжай, телефондар, өтініш жолдау, директор блогы және сұрақ–жауап.',
      ru: 'Адрес, телефоны, обращения, блог директора и вопрос–ответ.',
      en: 'Address, phones, appeals, the director’s blog and FAQ.',
    },
    groups: ['feedback'],
  },
];

export const GROUPS = {
  about: {
    theme: 'hero',
    label: { kz: 'Мектеп туралы', ru: 'О школе', en: 'About the school' },
    pages: ['about', 'leadership', 'structure', 'license', 'development-plan', 'board', 'symbols'],
  },
  staff: {
    theme: 'languages',
    label: { kz: 'Кадрлар', ru: 'Кадры', en: 'Staff' },
    pages: ['teachers', 'vacancies'],
  },
  self: {
    theme: 'math',
    label: { kz: 'Өзін-өзі бағалау', ru: 'Самооценка', en: 'Self-assessment' },
    pages: ['self-assessment', 'self-1', 'self-2', 'self-3', 'self-4', 'self-5', 'self-6', 'self-7', 'self-8'],
  },
  education: {
    theme: 'physics',
    label: { kz: 'Оқу процесі', ru: 'Учебный процесс', en: 'Learning' },
    pages: ['curriculum', 'schedule', 'assessment', 'methodical', 'inclusive', 'distance'],
  },
  upbringing: {
    theme: 'arts',
    label: { kz: 'Тәрбие және қолдау', ru: 'Воспитание и поддержка', en: 'Upbringing & care' },
    pages: ['upbringing', 'clubs', 'psychology', 'parents'],
  },
  admission: {
    theme: 'geography',
    label: { kz: 'Қабылдау', ru: 'Приём', en: 'Admission' },
    pages: ['admission', 'contingent', 'forms', 'tuition'],
  },
  campus: {
    theme: 'biology',
    label: { kz: 'Мектеп ортасы', ru: 'Школьная среда', en: 'Campus' },
    pages: ['facilities', 'meals', 'safety', 'health', 'library'],
  },
  news: {
    theme: 'informatics',
    label: { kz: 'Жаңалықтар мен оқиғалар', ru: 'Новости и события', en: 'News & events' },
    pages: ['news', 'events', 'projects'],
  },
  documents: {
    theme: 'paper',
    label: { kz: 'Құжаттар', ru: 'Документы', en: 'Documents' },
    pages: ['documents', 'legislation', 'finance', 'anticorruption', 'privacy'],
  },
  feedback: {
    theme: 'chemistry',
    label: { kz: 'Кері байланыс', ru: 'Обратная связь', en: 'Get in touch' },
    pages: ['contacts', 'feedback', 'director-blog', 'faq', 'surveys'],
  },
  util: {
    theme: 'paper',
    label: { kz: 'Қызметтік беттер', ru: 'Служебные страницы', en: 'Utility pages' },
    pages: ['search', 'sitemap', 'accessibility'],
  },
};
for (const [id, g] of Object.entries(GROUPS)) g.id = id;
for (const top of TOP) for (const gid of top.groups) GROUPS[gid].top = top.id;

export const PAGE_LABELS = {
  // about
  about: { kz: 'Мектеп туралы', ru: 'О школе', en: 'About the school' },
  leadership: { kz: 'Басшылық', ru: 'Руководство', en: 'Leadership' },
  structure: { kz: 'Басқару құрылымы', ru: 'Структура управления', en: 'Governance' },
  license: { kz: 'Лицензия және тіркеу', ru: 'Лицензия и регистрация', en: 'Licence & registration' },
  'development-plan': { kz: 'Даму жоспары', ru: 'План развития', en: 'Development plan' },
  board: { kz: 'Қамқоршылық кеңес', ru: 'Попечительский совет', en: 'Board of trustees' },
  symbols: { kz: 'Мемлекеттік рәміздер', ru: 'Государственные символы', en: 'State symbols' },
  // staff
  teachers: { kz: 'Педагогтер құрамы', ru: 'Педагогический состав', en: 'Teaching staff' },
  vacancies: { kz: 'Бос жұмыс орындары', ru: 'Вакансии', en: 'Vacancies' },
  // self
  'self-assessment': { kz: 'Өзін-өзі бағалау: шолу', ru: 'Самооценка: обзор', en: 'Overview' },
  'self-1': { kz: '1. Жалпы сипаттама', ru: '1. Общая характеристика', en: '1. General profile' },
  'self-2': { kz: '2. Кадрлық әлеует', ru: '2. Кадровый потенциал', en: '2. Staffing' },
  'self-3': { kz: '3. Білім алушылар контингенті', ru: '3. Контингент обучающихся', en: '3. Student body' },
  'self-4': { kz: '4. Оқу-әдістемелік жұмыс', ru: '4. Учебно-методическая работа', en: '4. Teaching & methodology' },
  'self-5': { kz: '5. Тәрбие жұмысы', ru: '5. Воспитательная работа', en: '5. Upbringing' },
  'self-6': { kz: '6. Материалдық-техникалық база', ru: '6. Материально-техническая база', en: '6. Facilities & equipment' },
  'self-7': { kz: '7. Оқу-әдістемелік және цифрлық ресурстар', ru: '7. Учебно-методические и цифровые ресурсы', en: '7. Learning & digital resources' },
  'self-8': { kz: '8. 4 және 9-сыныптарда компьютерлік тестілеу', ru: '8. Компьютерное тестирование 4 и 9 классов', en: '8. Computer testing, grades 4 & 9' },
  // education
  curriculum: { kz: 'Оқу жоспары мен бағдарламалар', ru: 'Учебный план и программы', en: 'Curriculum & programmes' },
  schedule: { kz: 'Сабақ кестесі', ru: 'Расписание', en: 'Timetable' },
  assessment: { kz: 'Бағалау және нәтижелер', ru: 'Оценивание и результаты', en: 'Assessment & results' },
  methodical: { kz: 'Әдістемелік жұмыс', ru: 'Методическая работа', en: 'Methodological work' },
  inclusive: { kz: 'Инклюзивті білім беру', ru: 'Инклюзивное образование', en: 'Inclusive education' },
  distance: { kz: 'Қашықтан оқыту', ru: 'Дистанционное обучение', en: 'Distance learning' },
  // upbringing
  upbringing: { kz: 'Тәрбие жұмысы', ru: 'Воспитательная работа', en: 'Values & upbringing' },
  clubs: { kz: 'Үйірмелер мен секциялар', ru: 'Кружки и секции', en: 'Clubs' },
  psychology: { kz: 'Психологиялық қызмет', ru: 'Психологическая служба', en: 'Psychological support' },
  parents: { kz: 'Ата-аналармен жұмыс', ru: 'Работа с родителями', en: 'For parents' },
  // admission
  admission: { kz: 'Қабылдау қағидалары', ru: 'Правила приёма', en: 'Admission rules' },
  contingent: { kz: 'Контингент', ru: 'Контингент', en: 'Student numbers' },
  forms: { kz: 'Өтініш үлгілері', ru: 'Образцы заявлений', en: 'Application forms' },
  tuition: { kz: 'Оқу ақысы және шарт', ru: 'Оплата и договор', en: 'Tuition & contract' },
  // campus
  facilities: { kz: 'Ғимарат және кабинеттер', ru: 'Здание и кабинеты', en: 'Building & classrooms' },
  meals: { kz: 'Мектептегі тамақтану', ru: 'Школьное питание', en: 'School meals' },
  safety: { kz: 'Қауіпсіздік', ru: 'Безопасность', en: 'Safety & security' },
  health: { kz: 'Медициналық қызмет', ru: 'Медицинское обслуживание', en: 'Health care' },
  library: { kz: 'Кітапхана және цифрлық ресурстар', ru: 'Библиотека и цифровые ресурсы', en: 'Library & digital resources' },
  // news
  news: { kz: 'Жаңалықтар', ru: 'Новости', en: 'News' },
  events: { kz: 'Іс-шаралар күнтізбесі', ru: 'Календарь событий', en: 'Events calendar' },
  projects: { kz: 'Мектеп жобалары', ru: 'Проекты школы', en: 'School projects' },
  // documents
  documents: { kz: 'Ішкі құжаттар', ru: 'Внутренние документы', en: 'School documents' },
  legislation: { kz: 'Нормативтік құқықтық актілер', ru: 'Нормативные правовые акты', en: 'Legislation' },
  finance: { kz: 'Қаржылық есептер', ru: 'Финансовые отчёты', en: 'Financial reports' },
  anticorruption: { kz: 'Сыбайлас жемқорлыққа қарсы іс-қимыл', ru: 'Противодействие коррупции', en: 'Anti-corruption' },
  privacy: { kz: 'Құпиялылық саясаты', ru: 'Политика конфиденциальности', en: 'Privacy policy' },
  // feedback
  contacts: { kz: 'Байланыс', ru: 'Контакты', en: 'Contacts' },
  feedback: { kz: 'Өтініш жолдау', ru: 'Обращения', en: 'Appeals & feedback' },
  'director-blog': { kz: 'Директор блогы', ru: 'Блог директора', en: 'Director’s blog' },
  faq: { kz: 'Сұрақ–жауап', ru: 'Вопрос–ответ', en: 'FAQ' },
  surveys: { kz: 'Сауалнамалар', ru: 'Анкетирование', en: 'Surveys' },
  // util
  search: { kz: 'Іздеу', ru: 'Поиск', en: 'Search' },
  sitemap: { kz: 'Сайт картасы', ru: 'Карта сайта', en: 'Site map' },
  accessibility: { kz: 'Сайттың қолжетімділігі', ru: 'Доступность сайта', en: 'Accessibility' },
};

/** Group containing `slug` (via nav), or null. */
export function groupOf(slug) {
  for (const g of Object.values(GROUPS)) if (g.pages.includes(slug)) return g;
  return null;
}
/** Top item containing group `gid`, or null. */
export function topOf(gid) { return TOP.find((t) => t.groups.includes(gid)) || null; }
/** First page slug of a group. */
export function firstPage(gid) { return GROUPS[gid]?.pages[0] || 'index'; }
/** All slugs mentioned in the menu (including util pages). */
export function navSlugs() { return Object.values(GROUPS).flatMap((g) => g.pages); }
/** Theme of a page object: page.theme → group theme → 'paper'. */
export function themeOf(page) {
  if (page?.theme) return page.theme;
  const g = GROUPS[page?.group] || groupOf(page?.slug);
  return g?.theme || 'paper';
}

export const nav = { TOP, GROUPS, PAGE_LABELS, THEMES, groupOf, topOf, firstPage, navSlugs, themeOf };
export default nav;
