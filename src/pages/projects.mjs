// School projects (projects.html). ORDER-114 B.22 ("School projects" block).
// The five directions below are the programmes the school itself announced (Instagram post of 12.08.2025,
// see SCHOOL-FACTS). Descriptions explain what each approach IS in general terms; everything specific to
// Keremet (leader, grades, schedule, results, photos) is pending until the school supplies it.
const X = (kz, ru, en) => ({ kz, ru, en });
const SOURCE = 'https://www.instagram.com/p/DNR-UIYM5uW/';

const PROJECTS = [
  {
    id: 'robotics', icon: 'robot', theme: 'informatics', programme: 'robotics',
    title: X('Робототехника және жасанды интеллект', 'Робототехника и искусственный интеллект', 'Robotics and AI'),
    tagline: X('Құрастыр · бағдарламала · сына', 'Собери · запрограммируй · испытай', 'Build · code · test'),
    about: X(
      'Робототехникада балалар қарапайым механизмдер мен роботтарды құрастырып, оларды бағдарламалауды үйренеді: тапсырманы қадамдарға бөледі, алгоритм құрады, нәтижені тексеріп, қатені түзетеді. Жасанды интеллект тақырыбы бастауыш деңгейде машиналардың мысалдар арқылы қалай «үйренетінін», деректің не екенін және технологияны қауіпсіз әрі жауапты пайдалануды таныстырады.',
      'На занятиях робототехникой дети собирают простые механизмы и роботов и учатся их программировать: разбивают задачу на шаги, составляют алгоритм, проверяют результат и исправляют ошибки. Тема искусственного интеллекта на начальном уровне знакомит с тем, как машины «учатся» на примерах, что такое данные и как пользоваться технологиями безопасно и ответственно.',
      'In robotics, children build simple mechanisms and robots and learn to program them: they break a task into steps, write an algorithm, test the result and fix mistakes. At primary level, the AI topic introduces how machines “learn” from examples, what data is, and how to use technology safely and responsibly.',
    ),
    skills: [X('Алгоритмдік ойлау', 'Алгоритмическое мышление', 'Algorithmic thinking'), X('Инженерлік құрастыру', 'Инженерное конструирование', 'Engineering design'), X('Командалық жұмыс', 'Командная работа', 'Teamwork'), X('Цифрлық қауіпсіздік', 'Цифровая безопасность', 'Digital safety')],
  },
  {
    id: 'olympiad', icon: 'trophy', theme: 'math', programme: 'olympiad',
    title: X('Тереңдетілген және олимпиадалық математика', 'Углублённая и олимпиадная математика', 'Advanced and olympiad maths'),
    tagline: X('Логика · дәлел · шешім', 'Логика · доказательство · решение', 'Logic · proof · solution'),
    about: X(
      'Олимпиадалық математика стандарт емес есептерді шешуге үйретеді: логикалық және комбинаторикалық есептер, заңдылықтарды іздеу, бір есепті бірнеше тәсілмен шешу. Оқушы тек жауап табумен шектелмей, өз шешімін түсіндіріп, дәлелдеуге дағдыланады — бұл зерттеушілік ойлауды дамытады.',
      'Олимпиадная математика учит решать нестандартные задачи: логические и комбинаторные, на поиск закономерностей, одну задачу — несколькими способами. Ученик не просто находит ответ, а учится объяснять и доказывать своё решение — это развивает исследовательское мышление.',
      'Olympiad maths teaches pupils to solve non-standard problems: logic and combinatorics puzzles, spotting patterns, solving one problem in several ways. Pupils learn not only to find the answer but to explain and prove their solution, which builds research thinking.',
    ),
    skills: [X('Логикалық есептер', 'Логические задачи', 'Logic problems'), X('Комбинаторика', 'Комбинаторика', 'Combinatorics'), X('Шешімді дәлелдеу', 'Доказательство решения', 'Proving a solution'), X('Олимпиадаларға дайындық', 'Подготовка к олимпиадам', 'Olympiad preparation')],
  },
  {
    id: 'speaking', icon: 'mic', theme: 'arts', programme: 'speaking',
    title: X('Шешендік өнер', 'Ораторское мастерство', 'Public speaking'),
    tagline: X('Ойла · сөйле · сендір', 'Думай · говори · убеждай', 'Think · speak · persuade'),
    about: X(
      'Шешендік өнер өз ойын анық, сенімді және мәдениетті жеткізуге үйретеді. Бастауыш сыныптарда бұл — мәнерлеп оқу, қысқа баяндама мен презентация жасау, аудитория алдында сөйлеу, сұраққа жауап беру және сұхбаттасын тыңдай білу. Қазақ халқының шешендік дәстүрі бұл бағытқа ерекше мән береді.',
      'Ораторское мастерство учит ясно, уверенно и культурно выражать свои мысли. В начальной школе это выразительное чтение, короткие выступления и презентации, речь перед аудиторией, ответы на вопросы и умение слушать собеседника. Казахская традиция красноречия (шешендік өнер) придаёт этому направлению особое значение.',
      'Public speaking teaches children to express their ideas clearly, confidently and politely. In primary school this means expressive reading, short talks and presentations, speaking in front of an audience, answering questions and listening to others. The Kazakh tradition of oratory (sheshendik oner) gives this direction special weight.',
    ),
    skills: [X('Мәнерлеп оқу', 'Выразительное чтение', 'Expressive reading'), X('Презентация', 'Презентация', 'Presentations'), X('Пікірталас мәдениеті', 'Культура дискуссии', 'Debate etiquette'), X('Сахнадағы сенімділік', 'Уверенность на сцене', 'Stage confidence')],
  },
  {
    id: 'finance', icon: 'coins', theme: 'geography', programme: 'finance',
    title: X('Қаржылық сауаттылық', 'Финансовая грамотность', 'Financial literacy'),
    tagline: X('Жоспарла · жина · таңда', 'Планируй · копи · выбирай', 'Plan · save · choose'),
    about: X(
      'Қаржылық сауаттылық балаларға ақшаның қайдан келетінін, оны қалай жоспарлап, жинап және саналы жұмсауға болатынын жас ерекшелігіне сай ойындар мен практикалық тапсырмалар арқылы түсіндіреді: қажеттілік пен қалауды ажырату, мақсат қойып жинақтау, бағаны салыстыру, еңбек пен табыстың байланысы.',
      'Финансовая грамотность объясняет детям, откуда берутся деньги и как их планировать, копить и тратить осознанно, — через игры и практические задания по возрасту: отличать потребности от желаний, копить на цель, сравнивать цены, видеть связь между трудом и доходом.',
      'Financial literacy explains, through age-appropriate games and practical tasks, where money comes from and how to plan, save and spend it wisely: telling needs from wants, saving towards a goal, comparing prices, and seeing how work relates to income.',
    ),
    skills: [X('Бюджет негіздері', 'Основы бюджета', 'Budget basics'), X('Мақсатқа жинақтау', 'Накопление на цель', 'Saving for a goal'), X('Саналы тұтыну', 'Осознанное потребление', 'Mindful spending'), X('Кәсіпкерлік ойлау', 'Предпринимательское мышление', 'Entrepreneurial thinking')],
  },
  {
    id: 'singapore', icon: 'calculator', theme: 'physics', programme: 'singapore',
    title: X('Сингапур математикасы', 'Сингапурская математика', 'Singapore maths'),
    tagline: X('Зат → сурет → таңба', 'Предмет → рисунок → символ', 'Concrete → pictorial → abstract'),
    about: X(
      'Сингапур математикасы «нақты зат → сурет → абстракция» (Concrete–Pictorial–Abstract, CPA) тәсіліне негізделген: бала алдымен заттармен жұмыс істейді, содан кейін есепті сызба-модельмен (bar model — «жолақ модель») бейнелейді, тек осыдан кейін сандар мен таңбаларға көшеді. Әдістеме жаттауға емес, түсінуге, есепті көрнекі модельдеуге және ойша есептеу стратегияларына басымдық береді.',
      'Сингапурская математика строится на подходе «предмет → рисунок → абстракция» (Concrete–Pictorial–Abstract, CPA): ребёнок сначала работает с предметами, затем изображает задачу схемой-моделью (bar model — «модель отрезков») и только после этого переходит к числам и знакам. Методика делает упор не на заучивание, а на понимание, наглядное моделирование задачи и стратегии устного счёта.',
      'Singapore maths is built on the Concrete–Pictorial–Abstract (CPA) approach: children first work with objects, then draw the problem as a bar model, and only then move on to numbers and symbols. The method puts understanding, visual modelling of problems and mental-maths strategies ahead of rote learning.',
    ),
    skills: [X('CPA тәсілі', 'Подход CPA', 'CPA approach'), X('Жолақ модель', 'Ленточная модель (bar model)', 'Bar model'), X('Ойша есептеу', 'Устный счёт', 'Mental maths'), X('Есеп шығару стратегиялары', 'Стратегии решения задач', 'Problem-solving strategies')],
  },
];

// What the school must fill in for every project (shown as pending "passport" rows)
const PASSPORT = [
  { icon: 'user', k: X('Жетекшісі', 'Руководитель', 'Lead teacher') },
  { icon: 'graduation', k: X('Сыныптар және қатысушылар саны', 'Классы и число участников', 'Grades and number of pupils') },
  { icon: 'clock', k: X('Өткізу форматы және кестесі', 'Формат и расписание', 'Format and schedule') },
  { icon: 'target', k: X('Мақсаты және күтілетін нәтиже', 'Цель и ожидаемый результат', 'Goal and expected outcome') },
  { icon: 'trophy', k: X('Нәтижелері (байқаулар, олимпиадалар, өнімдер)', 'Результаты (конкурсы, олимпиады, продукты)', 'Results (contests, olympiads, products)') },
];

export default {
  slug: 'projects',
  group: 'news',
  order: 30,
  title: { kz: 'Мектеп жобалары', ru: 'Проекты школы', en: 'School projects' },
  description: {
    kz: '«Керемет» мектебінің жобалары мен бағыттары: робототехника және ЖИ, олимпиадалық математика, шешендік өнер, қаржылық сауаттылық, Сингапур математикасы.',
    ru: 'Проекты и направления школы «Керемет»: робототехника и ИИ, олимпиадная математика, ораторское мастерство, финансовая грамотность, сингапурская математика.',
    en: 'Keremet school projects: robotics and AI, olympiad maths, public speaking, financial literacy and Singapore maths.',
  },
  lead: {
    kz: 'Мектеп жариялаған бес бағыт — не туралы, неге маңызды және нәтижелері қалай жарияланады.',
    ru: 'Пять направлений, которые объявила школа: о чём они, чем полезны и как будут публиковаться результаты.',
    en: 'Five directions the school has announced: what they are, why they matter and how results will be reported.',
  },
  styles: ['news'],
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, { ui, L, href, S }) {
    const other = S.programmes.filter((p) => !PROJECTS.some((x) => x.programme === p.id));
    const pend = `<span class="pj-pend">${ui.icon('hourglass', { size: 14 })}${L(X('толықтырылуда', 'уточняется', 'to be added'))}</span>`;

    // ---------------------------------------------------------------- intro: text + constellation
    const orbit = `<div class="pj-orbit pattern" data-theme="informatics" data-animated aria-hidden="true">${ui.shanyrakArt({ cls: 'pj-orbit__art' })}<span class="pj-orbit__core">${ui.logo({ size: 64 })}</span>${PROJECTS.map((p, i) => `<span class="pj-orbit__node pj-orbit__node--${i + 1}" data-accent="${p.theme}">${ui.icon(p.icon, { size: 26 })}</span>`).join('')}<svg class="pj-orbit__ring" viewBox="0 0 400 400"><circle cx="200" cy="200" r="150"/><circle cx="200" cy="200" r="104"/></svg></div>`;
    const intro = ui.split({
      ratio: '3:2', align: 'center',
      left: `<div class="flow">${ui.eyebrow(X('Мектеп жобалары', 'Проекты школы', 'School projects'))}
<h2 class="sec__title">${L(X('Бес бағыт — бір мақсат: ойлай білетін бала', 'Пять направлений — одна цель: думающий ребёнок', 'Five directions, one goal: a child who thinks'))}</h2>
<p class="lead">${L(X(
        'Мектеп 2025–2026 оқу жылына қабылдау туралы хабарландыруда өзінің оқу бағыттарын атап өтті. Олардың бесеуі осы бетте жоба ретінде сипатталған: әр бағыттың мазмұны, дамытатын дағдылары және мектеп толтыратын «жоба паспорты».',
        'В объявлении о приёме на 2025–2026 учебный год школа назвала свои учебные направления. Пять из них описаны на этой странице как проекты: суть направления, какие навыки оно развивает и «паспорт проекта», который заполняет школа.',
        'In its admission announcement for 2025–2026 the school listed its programmes. Five of them are presented here as projects: what each one is about, which skills it builds, and a “project passport” the school will fill in.',
      ))}</p>
${ui.note(X(`Дереккөз: мектептің 12.08.2025 жарияланған хабарландыруы (${ui.extLink(SOURCE, 'Instagram')}).`, `Источник: объявление школы от 12.08.2025 (${ui.extLink(SOURCE, 'Instagram')}).`, `Source: the school’s announcement of 12.08.2025 (${ui.extLink(SOURCE, 'Instagram')}).`))}</div>`,
      right: orbit,
    });

    // ---------------------------------------------------------------- project panels
    const panels = PROJECTS.map((p, i) => `<article class="pj pattern" id="${p.id}" data-theme="${p.theme}" aria-labelledby="${p.id}-t">
${ui.shanyrakArt({ cls: 'pj__art' })}
<header class="pj__head"><span class="pj__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><span class="pj__icon">${ui.icon(p.icon, { size: 30 })}</span><div><p class="pj__tagline">${L(p.tagline)}</p><h3 class="pj__title" id="${p.id}-t">${L(p.title)}</h3></div></header>
<div class="pj__grid">
<div class="pj__main"><p class="pj__status"><span class="pj-badge pj-badge--ok">${ui.icon('check', { size: 14 })}${L(X('Мектеп жариялаған бағыт', 'Направление объявлено школой', 'Announced by the school'))}</span><span class="pj-badge pj-badge--wait">${ui.icon('hourglass', { size: 14 })}${L(X('Нәтижелері толықтырылуда', 'Результаты уточняются', 'Results to be added'))}</span></p>
<p class="pj__about">${L(p.about)}</p>
<p class="pj__k">${L(X('Қандай дағдыларды дамытады', 'Какие навыки развивает', 'Skills it builds'))}</p>
<ul class="pj__skills" role="list">${p.skills.map((s) => `<li>${L(s)}</li>`).join('')}</ul></div>
<aside class="pj__passport" aria-label="${ui.esc(L(X('Жоба паспорты', 'Паспорт проекта', 'Project passport')))}: ${ui.esc(L(p.title))}"><p class="pj__ptitle">${ui.icon('doc', { size: 18 })}${L(X('Жоба паспорты', 'Паспорт проекта', 'Project passport'))}</p>
<dl>${PASSPORT.map((r) => `<div><dt>${ui.icon(r.icon, { size: 16 })}${L(r.k)}</dt><dd>${pend}</dd></div>`).join('')}</dl></aside>
</div></article>`).join('');

    // ---------------------------------------------------------------- other programmes
    const otherCards = ui.cards(other.map((p) => ({
      icon: p.icon, title: p.label,
      href: href(['sport', 'coding'].includes(p.id) ? 'clubs' : 'curriculum'),
    })), { cols: 3 });

    // ---------------------------------------------------------------- how results are published
    const how = ui.steps([
      { title: X('Жоба паспорты бекітіледі', 'Утверждается паспорт проекта', 'The project passport is approved'), text: X('Жетекші, сыныптар, мақсат, кесте — осы беттегі паспортқа жазылады.', 'Руководитель, классы, цель, расписание — вносятся в паспорт на этой странице.', 'Lead teacher, grades, goal and schedule go into the passport on this page.') },
      { title: X('Іс-шаралар күнтізбеге енгізіледі', 'События вносятся в календарь', 'Events go into the calendar'), text: X(`Байқаулар мен жарыстар <a href="${href('events')}">іс-шаралар күнтізбесінде</a> көрсетіледі.`, `Конкурсы и соревнования появляются в <a href="${href('events')}">календаре событий</a>.`, `Contests and competitions appear in the <a href="${href('events')}">events calendar</a>.`) },
      { title: X('Әр оқиға — жаңалық', 'Каждое событие — новость', 'Each event becomes a news item'), text: X(`<a href="${href('news')}">Жаңалықтарда</a> күні, орны, мазмұны және нәтижесі жарияланады.`, `В <a href="${href('news')}">новостях</a> публикуются дата, место, содержание и итог.`, `The <a href="${href('news')}">news</a> gives the date, place, content and outcome.`) },
      { title: X('Жыл қорытындысы', 'Итоги года', 'End-of-year summary'), text: X('Жетістіктер, дипломдар мен фотосуреттер (ата-ана келісімімен) жоба бетіне қосылады.', 'Достижения, дипломы и фото (с согласия родителей) добавляются на страницу проекта.', 'Achievements, certificates and photos (with parental consent) are added to the project page.') },
    ]);
    // Note for the school (NOT published): to complete the project passports send, per project,
    // the lead teacher (name/position, with consent), grades, number of pupils, format and schedule,
    // results for 2025–2026 and 2026–2027 (olympiads, contests, project work), photos with parental consent.

    const toc = ui.toc([
      ...PROJECTS.map((p) => ({ id: p.id, label: p.title })),
      { id: 'other', label: X('Басқа бағыттар', 'Другие направления', 'Other programmes') },
      { id: 'reporting', label: X('Нәтижелер қалай жарияланады', 'Как публикуются результаты', 'How results are reported') },
    ]);

    const related = ui.linkList([
      { href: href('clubs'), icon: 'sparkles', label: X('Үйірмелер', 'Кружки и секции', 'Clubs'), note: X('Тегін үйірмелер', 'Бесплатные кружки', 'Free clubs') },
      { href: href('curriculum'), icon: 'book', label: X('Оқу бағдарламалары', 'Учебные программы', 'Curriculum') },
      { href: href('events'), icon: 'calendar', label: X('Іс-шаралар күнтізбесі', 'Календарь событий', 'Events calendar') },
      { href: href('news'), icon: 'grid', label: X('Жаңалықтар', 'Новости', 'News') },
    ]);

    return [
      intro,
      ui.section({ id: 'directions', cls: 'pj-directions', eyebrow: X('Бағыттар', 'Направления', 'Directions'), title: X('Жобалар', 'Проекты', 'Projects'), lead: X('Сипаттамалар әр әдістеменің жалпы мазмұнын түсіндіреді. Мектептегі нақты мәліметтер — жетекші, сыныптар, кесте, нәтижелер — «жоба паспортында» мектеп ұсынғаннан кейін жарияланады.', 'Описания объясняют общую суть каждой методики. Конкретные данные по школе — руководитель, классы, расписание, результаты — появятся в «паспорте проекта», когда школа их предоставит.', 'The descriptions explain what each approach is in general. School-specific details (lead teacher, grades, schedule, results) will appear in the “project passport” once the school provides them.'), body: `<div class="nw-tocrow">${toc}</div>` }),
      `<div class="pj-list">${panels}</div>`,
      ui.section({ id: 'other', eyebrow: X('Сонымен қатар', 'А также', 'Also'), title: X('Басқа бағыттар', 'Другие направления', 'Other programmes'), lead: X('Мектеп хабарландыруында аталған басқа бағдарламалар.', 'Другие программы, названные в объявлении школы.', 'Other programmes named in the school’s announcement.'), body: otherCards }),
      ui.section({ id: 'reporting', eyebrow: X('Ашықтық', 'Открытость', 'Transparency'), title: X('Нәтижелер қалай жарияланады', 'Как публикуются результаты', 'How results are reported'), body: how }),
      ui.banner({ theme: 'informatics', icon: 'bulb', eyebrow: X('Идея бар ма?', 'Есть идея?', 'Got an idea?'), title: X('Жаңа жоба ұсыныңыз', 'Предложите новый проект', 'Suggest a new project'), text: X('Оқушылар мен ата-аналардың ұсыныстарын өтініш формасы арқылы қабылдаймыз.', 'Предложения учеников и родителей принимаем через форму обращения.', 'Pupils and parents can send ideas through the feedback form.'), href: href('feedback'), label: X('Ұсыныс жіберу', 'Отправить предложение', 'Send a suggestion') }),
      ui.section({ title: X('Осы бөлімде', 'В этом разделе', 'In this section'), body: related }),
    ].join('\n');
  },
};
