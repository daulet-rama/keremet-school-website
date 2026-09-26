// =====================================================================================
//  src/data/school.mjs — SINGLE SOURCE OF TRUTH for all facts about the school.
//  Sources: docs/SCHOOL-FACTS.md (verified 24.09.2026), scans in public/assets/docs/.
//  RULE: never invent facts. Unknown values are `null` and marked with `// TODO(school):`.
//  Values flagged `confirmed:false` are "probable" (single source) — show carefully or not at all.
//  Localised values are objects { kz, ru, en } — pick with ctx.L(obj) inside pages.
//
//  DATA CONTRACT — the TODO(school) slots (Order 114 S.109–112). Fill a slot with the shape below and the page named
//  in brackets shows it on the next build (pages render `ui.slot(value, render, pending)`: the value, or the pending
//  block while it is null). The build warns when a filled slot is read by no page. {L} = { kz, ru, en } text.
//    mission            {L} | { mission: {L}, vision: {L} }                                         [about]
//    values             {L} | [{L}, …]                                                              [about]
//    teachingStarted    2022 | 'YYYY'                                                               [about]
//    international      { statement: {L}, date: 'YYYY-MM-DD',
//                         partners: [{ name, country: {L}, agreement: {L}, period: 'YYYY–YYYY' | {L} }] }  [about]
//    legal.director.photo            'img/staff/director.jpg' (under public/assets/, with consent)  [leadership]
//    legal.director.education        {L} | { text, experience, category, compliance } (each {L})    [leadership]
//    legal.director.appointmentOrder { number: '…', date: 'YYYY-MM-DD' } | {L}                     [leadership]
//    legal.director.reception        {L} | { days, hours, room } (each string or {L})              [leadership, director-blog]
//    legal.director.email            'name@…' (a working mailbox only)                             [leadership]
//    deputies           [{ area: 'teaching'|'upbringing'|'admin', name: {L}, position: {L}, phone: { display, tel },
//                          email, reception: {L}, photo, text: {L} }]                                [leadership]
//    contacts.cityPhone { display: '+7 (7252) …', tel: '+77252…' } | '+7 (7252) …'                  [contacts, index]
//    contacts.email     'info@…' — ONLY a mailbox that exists; then set emailConfirmed: true         [footer, contacts…]
//    contacts.responsibleForAppeals { name: {L}, position: {L}, phone: { display, tel } | string, email, hours: {L} } [feedback]
//    tuition            [{ service: {L}, terms: {L}, price: '…', basis: {L} }] | { year: '2026–2027', items: [same] } [tuition]
//    contingent         { year: '2026–2027', date: 'YYYY-MM-DD', students, classes, freePlaces, graduates,
//                         byLevel: [{ grade: '1', classes, students, lang: 'kz'|'ru' }] }             [contingent]
//    staff              [{ name: {L}, subject: {L}, education: {L}, category: {L}, experience, courses: [{L}] }] [teachers]
//    schedule.bells     [{ n: 1, from: '08:30', to: '09:15', shift: 1 }]                             [schedule]
//    schedule.weekly    { posted: 'YYYY-MM-DDTHH:MM', docId: 'timetable' } — the timetable itself is the 'timetable'
//                       document in documents.mjs                                                     [schedule]
//    schedule.academicCalendar [{ kind: 'term'|'holiday', title: {L}, from: 'YYYY-MM-DD', to: 'YYYY-MM-DD' }] [schedule]
//    meals.supplier     { name: {L}, bin: '…', contract: { number, date: 'YYYY-MM-DD' }, phone }    [meals]
//    meals.commission   [{ name: {L}, role: {L} }]                                                  [meals]
//    (daily and long-term MENUS live in src/data/menu.mjs — updated every school day)
//    building.ownership 'own' | { kind: 'lease', until: 'YYYY-MM-DD' }; building.capacity 150        [facilities]
//  When to update what (who, how fast) — README «Maintenance calendar».
// =====================================================================================

export const SITE_URL = 'https://keremet.edu.kz';

const data = {
  // ---------------------------------------------------------------- names
  name: {
    kz: '«Керемет» зияткерлік мектебі',
    ru: 'Интеллектуальная школа «Керемет»',
    en: 'Keremet Intellectual School',
  },
  shortName: { kz: 'Керемет', ru: 'Керемет', en: 'Keremet' },
  wordmark: 'KEREMET',
  wordmarkSub: 'мектебі · школа · school',
  // Kind of organisation (by nomenclature). Private general education school.
  orgType: {
    kz: 'жеке меншік жалпы білім беретін мектеп',
    ru: 'частная общеобразовательная школа',
    en: 'private general education school',
  },
  // Meaning of the name — a BRAND statement (founder's explanation, Kapital.kz 2018), NOT an official mission.
  nameMeaning: {
    kz: '«Керемет» — ең үздік, ең тамаша деген мағынаны береді.',
    ru: '«Керемет» по-казахски означает «самый лучший, превосходный».',
    en: '“Keremet” is Kazakh for “the best, the finest — wonderful”.',
  },
  slogan: {
    kz: 'Білім әлемі — керемет саяхат',
    ru: 'Учёба — удивительное путешествие',
    en: 'Learning is a wonderful journey',
  },
  mission: null, // TODO(school): official mission & vision (approved text). Do not invent.
  values: null, // TODO(school): official values, if approved.

  // ---------------------------------------------------------------- legal entity
  legal: {
    name: { kz: '«Keremet-City» ЖШС', ru: 'ТОО «Keremet-City»', en: 'Keremet-City LLP' },
    fullName: {
      kz: '«Keremet-City» жауапкершілігі шектеулі серіктестігі',
      ru: 'Товарищество с ограниченной ответственностью «Keremet-City»',
      en: 'Keremet-City Limited Liability Partnership',
    },
    bin: '210440038887',
    registered: '2021-04-28', // registration certificate (справка от 25.01.2026)
    oked: {
      code: '85310',
      title: {
        kz: 'Негізгі және жалпы орта білім беру',
        ru: 'Основное и общее среднее образование',
        en: 'Lower and upper secondary education',
      },
    },
    director: {
      name: { kz: 'Караманова Диана Муратхановна', ru: 'Караманова Диана Муратхановна', en: 'Karamanova Diana Muratkhanovna' },
      role: { kz: 'Директор', ru: 'Директор', en: 'Director' },
      photo: null, // TODO(school): official photo (with consent)
      education: null, // TODO(school): education, experience, qualification category
      appointmentOrder: null, // TODO(school): order on appointment (number, date)
      reception: null, // TODO(school): personal reception schedule (days, hours)
      email: null, // TODO(school)
    },
    founder: { kz: 'Бибазаров Муратхан', ru: 'Бибазаров Муратхан', en: 'Muratkhan Bibazarov' },
  },

  // ---------------------------------------------------------------- licensor / governing bodies
  licensor: {
    kz: 'Қазақстан Республикасы Оқу-ағарту министрлігі Білім саласында сапаны қамтамасыз ету комитетінің Шымкент қаласының білім саласында сапаны қамтамасыз ету департаменті',
    ru: 'Департамент по обеспечению качества в сфере образования города Шымкент Комитета по обеспечению качества в сфере образования Министерства просвещения Республики Казахстан',
    en: 'Department for Quality Assurance in Education of Shymkent, Committee for Quality Assurance in Education, Ministry of Education of the Republic of Kazakhstan',
  },
  licensorShort: {
    kz: 'Шымкент қаласының білім саласында сапаны қамтамасыз ету департаменті',
    ru: 'Департамент по обеспечению качества в сфере образования г. Шымкент',
    en: 'Shymkent Department for Quality Assurance in Education',
  },

  // ---------------------------------------------------------------- addresses
  addresses: {
    // Where the school actually operates (2GIS, Instagram post 12.08.2025)
    actual: {
      postcode: '160000',
      text: {
        kz: 'Шымкент қ., Абай ауданы, Асар шағын ауданы, 911/2',
        ru: 'г. Шымкент, Абайский район, мкр. Асар, 911/2',
        en: '911/2 Asar microdistrict, Abay district, Shymkent',
      },
      lat: 42.408409,
      lng: 69.613352,
      transit: {
        kz: '«Қ. Жалайыри даңғылы» аялдамасынан 250 м (жаяу 3 минут)',
        ru: '250 м (3 минуты пешком) от остановки «проспект К. Жалаири»',
        en: '250 m (3-minute walk) from the “K. Zhalairi Avenue” bus stop',
      },
      building: {
        kz: '2 қабатты ғимарат, пандус және кедергісіз кіреберіс, 7 орындық автотұрақ',
        ru: '2-этажное здание, пандус и доступный вход, парковка на 7 мест',
        en: '2-storey building, ramp and step-free entrance, 7 parking spaces',
      },
    },
    // Legal address — verbatim from the registration certificate (public/assets/docs/registration-certificate-2026.jpg,
    // справка от 25.01.2026, «Местонахождение»): «Казахстан, город Шымкент, Абайский район, Микрорайон Асар,
    // улица Сейхун, здание 125, почтовый индекс 160000». The district IS on the certificate (checked 24.09.2026).
    legal: {
      postcode: '160000',
      text: {
        kz: 'Шымкент қ., Абай ауданы, Асар шағын ауданы, Сейхун көшесі, 125-ғимарат',
        ru: 'г. Шымкент, Абайский район, мкр. Асар, ул. Сейхун, здание 125',
        en: '125 Seikhun St., Asar microdistrict, Abay district, Shymkent',
      },
    },
    // Object address stated in the 2022 licence (relationship to the current site unconfirmed)
    licence2022: {
      postcode: '160000',
      text: {
        kz: 'Шымкент қ., Қаратау ауданы, Нұрсәт шағын ауданы, 173-үй, 3-тұрғын емес бөлме',
        ru: 'г. Шымкент, Каратауский район, мкр. Нурсат, д. 173, нежилое помещение 3',
        en: '173 Nursat microdistrict, non-residential premises 3, Karatau district, Shymkent',
      },
    },
    // TODO(school): confirm whether ул. Сейхун 125 and мкр. Асар 911/2 are the same site.
  },

  // ---------------------------------------------------------------- contacts
  contacts: {
    phone: { display: '+7 (771) 242-45-38', tel: '+77712424538', whatsapp: '77712424538', confirmed: true },
    // Probable (single source: Instagram post 12.08.2025) — show ONLY on admission/contacts as "WhatsApp (қабылдау)".
    whatsappAdmission: { display: '+7 (777) 315-29-39', tel: '+77773152939', whatsapp: '77773152939', confirmed: false },
    cityPhone: null, // TODO(school): landline with city code +7 (7252) …
    // TODO(school): official e-mail. None was found (SCHOOL-FACTS.md; keremet.edu.kz does not resolve), so NO address is
    // shown: ui.schoolEmail() prints «Ресми e-mail нақтылануда / Официальный e-mail уточняется / Official e-mail to be
    // confirmed». Put the real mailbox here and set emailConfirmed: true once it receives mail.
    email: null,
    emailConfirmed: false,
    hours: {
      kz: 'Дүйсенбі–жұма, 09:00–18:00',
      ru: 'Понедельник–пятница, 09:00–18:00',
      en: 'Monday–Friday, 09:00–18:00',
    },
    hoursConfirmed: false, // TODO(school): confirm working hours (2GIS: opens 09:00)
    instagram: { handle: '@keremet_mektep_asar', url: 'https://www.instagram.com/keremet_mektep_asar/' },
    twoGis: {
      url: 'https://2gis.kz/shymkent/firm/70000001065233723',
      rating: 4.8, ratings: 241, checked: '2026-09-24',
    },
    responsibleForAppeals: null, // TODO(school): person responsible for appeals (name, position, phone)
  },

  // ---------------------------------------------------------------- education
  // Grades per the school's Instagram bio "0-6 сыныптарға арналған мектеп". TODO(school): confirm current range.
  grades: { from: 0, to: 6, confirmed: false },
  languages: [
    { id: 'kz', label: { kz: 'қазақ тілі', ru: 'казахский язык', en: 'Kazakh' } },
    { id: 'ru', label: { kz: 'орыс тілі', ru: 'русский язык', en: 'Russian' } },
  ],
  // Levels & activities covered by licence № KZ29LAM00002781 (05.05.2025)
  licenceLevels: [
    { id: 'primary', label: { kz: 'Бастауыш білім беру', ru: 'Начальное образование', en: 'Primary education' } },
    { id: 'basic', label: { kz: 'Негізгі орта білім беру', ru: 'Основное среднее образование', en: 'Lower secondary education' } },
    { id: 'general', label: { kz: 'Жалпы орта білім беру', ru: 'Общее среднее образование', en: 'Upper secondary education' } },
    { id: 'tvet', label: { kz: 'Техникалық және кәсіптік білім беру', ru: 'Техническое и профессиональное образование', en: 'Technical and vocational education' } },
    { id: 'postsec', label: { kz: 'Орта білімнен кейінгі білім беру', ru: 'Послесреднее образование', en: 'Post-secondary education' } },
    { id: 'spiritual', label: { kz: 'Рухани білім беру', ru: 'Духовное образование', en: 'Spiritual education' } },
    { id: 'health', label: { kz: 'Кәмелетке толмағандарға білім беру-сауықтыру қызметтері', ru: 'Образовательно-оздоровительные услуги несовершеннолетним', en: 'Educational and health-improving services for minors' } },
  ],
  // Programmes advertised in the admission post of 12.08.2025 (https://www.instagram.com/p/DNR-UIYM5uW/)
  programmes: [
    { id: 'nis', icon: 'star', label: { kz: 'НЗМ және РФММ әдістемесі бойынша оқыту', ru: 'Обучение по методике НИШ и РФМШ', en: 'Teaching based on NIS and RPMS methods' } },
    { id: 'singapore', icon: 'calculator', label: { kz: 'Сингапур математикасы', ru: 'Сингапурская математика', en: 'Singapore maths' } },
    { id: 'olympiad', icon: 'trophy', label: { kz: 'Тереңдетілген және олимпиадалық математика', ru: 'Углублённая и олимпиадная математика', en: 'Advanced and olympiad maths' } },
    { id: 'languages', icon: 'languages', label: { kz: 'Тілдерді тереңдетіп оқыту', ru: 'Углублённое изучение языков', en: 'In-depth language study' } },
    { id: 'fullday', icon: 'clock', label: { kz: 'Толық күн мектебі және қосымша сабақтар', ru: 'Школа полного дня и дополнительные уроки', en: 'Full-day school and extra lessons' } },
    { id: 'speaking', icon: 'mic', label: { kz: 'Шешендік өнер', ru: 'Ораторское мастерство', en: 'Public speaking' } },
    { id: 'finance', icon: 'coins', label: { kz: 'Қаржылық сауаттылық', ru: 'Финансовая грамотность', en: 'Financial literacy' } },
    { id: 'sport', icon: 'ball', label: { kz: 'Спорт үйірмелері', ru: 'Спортивные секции', en: 'Sports clubs' } },
    { id: 'coding', icon: 'code', label: { kz: 'Бағдарламалау', ru: 'Программирование', en: 'Programming' } },
    { id: 'robotics', icon: 'robot', label: { kz: 'Робототехника және жасанды интеллект', ru: 'Робототехника и искусственный интеллект', en: 'Robotics and AI' } },
  ],
  // Features from the Instagram bio (spelled «педагогтер» on the site): "Кәсіби педагогтар · Тегін үйірмелер · Ұзартылған күн · Ыстық тамақ"
  features: [
    { id: 'teachers', icon: 'users', label: { kz: 'Кәсіби педагогтер', ru: 'Профессиональные педагоги', en: 'Professional teachers' } },
    { id: 'clubs', icon: 'sparkles', label: { kz: 'Тегін үйірмелер', ru: 'Бесплатные кружки', en: 'Free clubs' } },
    { id: 'extended', icon: 'sun', label: { kz: 'Ұзартылған күн', ru: 'Продлённый день', en: 'Extended day' } },
    { id: 'meals', icon: 'utensils', label: { kz: 'Ыстық тамақ', ru: 'Горячее питание', en: 'Hot meals' } },
  ],
  // "Free tuition in Kazakh and Russian" — from the 12.08.2025 post. TODO(school): confirm wording/basis (state funding?).
  freeTuition: { stated: true, confirmed: false, source: 'https://www.instagram.com/p/DNR-UIYM5uW/' },
  tuition: null, // TODO(school): tuition fees / contract terms (order №93 template)
  contingent: null, // TODO(school): { year, students, classes, byLevel:[…], freePlaces, graduates }
  teachingStarted: null, // TODO(school): year teaching started (entity 2021, first licence 2022)
  international: null, // TODO(school): partners & projects — or the explicit statement "не осуществляется"
  staff: null, // TODO(school): teachers list with consent (name, subject, education, category, courses)
  deputies: null, // TODO(school): deputies (full names, areas, contacts, reception hours)
  schedule: { bells: null, weekly: null, academicCalendar: null }, // TODO(school) — shapes in the DATA CONTRACT above
  meals: { supplier: null, commission: null }, // TODO(school) — menus: src/data/menu.mjs

  // ---------------------------------------------------------------- building (2GIS)
  building: { floors: 2, ramp: true, accessibleEntrance: true, parking: 7, ownership: null /* TODO(school): own / lease ≥ 10 years */, capacity: null /* TODO(school) */ },

  // ---------------------------------------------------------------- licences (scans in public/assets/docs)
  licence: {
    current: {
      number: 'KZ29LAM00002781',
      date: '2025-05-05',
      firstIssued: '2022-11-07',
      term: { kz: 'мерзімсіз', ru: 'бессрочная', en: 'unlimited' },
      class: { kz: 'Иеліктен шығарылмайтын, 1-сынып', ru: 'Неотчуждаемая, класс 1', en: 'Non-transferable, class 1' },
      activity: {
        kz: 'Бастауыш, негізгі орта, жалпы орта, техникалық және кәсіптік, орта білімнен кейінгі білім беру, рухани білім беру салаларындағы білім беру қызметі, кәмелетке толмағандарға білім беру-сауықтыру қызметтері',
        ru: 'Образовательная деятельность в сфере начального, основного среднего, общего среднего, технического и профессионального, послесреднего образования, духовного образования, образовательно-оздоровительные услуги несовершеннолетним',
        en: 'Educational activity in primary, lower secondary, upper secondary, technical and vocational, post-secondary and spiritual education; educational and health-improving services for minors',
      },
      file: 'docs/license-2025-KZ29LAM00002781.jpg',
    },
    previous: {
      number: 'KZ18LAA00032760',
      date: '2022-11-07',
      term: { kz: 'мерзімсіз', ru: 'бессрочная', en: 'unlimited' },
      subtype: { kz: 'Бастауыш білім беру', ru: 'Начальное образование', en: 'Primary education' },
      appendix: { number: '001', date: '2022-11-07', basis: { kz: '07.11.2022 ж. № 299 бұйрық', ru: 'приказ № 299 от 07.11.2022', en: 'order No. 299 of 07.11.2022' } },
      file: 'docs/license-2022-KZ18LAA00032760.jpg',
    },
    registry: 'https://elicense.kz/',
  },

  // ---------------------------------------------------------------- history (facts only)
  history: [
    { date: '2021-04-28', title: { kz: '«Keremet-City» ЖШС тіркелді', ru: 'Зарегистрировано ТОО «Keremet-City»', en: 'Keremet-City LLP registered' },
      text: { kz: 'БСН 210440038887, Шымкент қаласы.', ru: 'БИН 210440038887, город Шымкент.', en: 'BIN 210440038887, Shymkent.' } },
    { date: '2022-11-07', title: { kz: 'Алғашқы білім беру лицензиясы', ru: 'Первая лицензия на образовательную деятельность', en: 'First education licence' },
      text: { kz: '№ KZ18LAA00032760 лицензия, № 001 қосымша — бастауыш білім беру.', ru: 'Лицензия № KZ18LAA00032760, приложение № 001 — начальное образование.', en: 'Licence No. KZ18LAA00032760, appendix 001 — primary education.' } },
    { date: '2025-05-05', title: { kz: 'Жаңа мерзімсіз лицензия', ru: 'Новая бессрочная лицензия', en: 'New unlimited licence' },
      text: { kz: '№ KZ29LAM00002781 — бастауыш, негізгі орта және жалпы орта білім беру және басқа да қызмет түрлері.', ru: '№ KZ29LAM00002781 — начальное, основное среднее, общее среднее образование и другие подвиды.', en: 'No. KZ29LAM00002781 — primary, lower and upper secondary education and other sub-types.' } },
    { date: '2025-08-12', title: { kz: '2025–2026 оқу жылына қабылдау', ru: 'Приём на 2025–2026 учебный год', en: 'Admission for 2025–2026' },
      text: { kz: 'Бастауыш сыныптарға қазақ және орыс тілдерінде оқуға қабылдау жарияланды.', ru: 'Объявлен приём в начальные классы с обучением на казахском и русском языках.', en: 'Admission to primary grades with Kazakh and Russian instruction announced.' } },
    { date: '2026-09-24', title: { kz: 'Мектептің жаңа сайты', ru: 'Новый сайт школы', en: 'New school website' },
      text: { kz: 'keremet.edu.kz — үш тілде, көру қабілеті нашар адамдарға арналған нұсқасымен.', ru: 'keremet.edu.kz — на трёх языках, с версией для слабовидящих.', en: 'keremet.edu.kz — in three languages, with a low-vision version.' } },
  ],

  // ---------------------------------------------------------------- helplines (national, public)
  helplines: [
    // Wording verified on the psychology page (src/pages/psychology.mjs, gov4c.kz, 25.09.2026): 111 is run by the
    // Government for Citizens State Corporation (24/7, free); 150 is the national helpline for children and youth.
    { number: '111', label: { kz: 'Отбасы, әйелдер мен балалардың құқықтарын қорғау мәселелері жөніндегі байланыс орталығы', ru: 'Контакт-центр по вопросам семьи, защиты прав женщин и детей', en: 'Contact centre for family, women’s and children’s rights' } },
    { number: '150', label: { kz: 'Балалар мен жастарға арналған ұлттық сенім телефоны', ru: 'Национальная телефонная линия доверия для детей и молодёжи', en: 'National helpline for children and young people' } },
  ],

  // ---------------------------------------------------------------- official links (footer, legislation)
  gov: {
    ministry: { url: 'https://www.gov.kz/memleket/entities/edu', label: { kz: 'ҚР Оқу-ағарту министрлігі', ru: 'Министерство просвещения РК', en: 'Ministry of Education of Kazakhstan' } },
    department: { url: 'https://www.gov.kz/memleket/entities/control-shymkent', label: { kz: 'Шымкент қ. білім саласында сапаны қамтамасыз ету департаменті', ru: 'Департамент по обеспечению качества в сфере образования г. Шымкент', en: 'Shymkent Department for Quality Assurance in Education' } },
    cityEducation: { url: 'https://www.gov.kz/memleket/entities/shymkent-bilim', label: { kz: 'Шымкент қаласының білім басқармасы', ru: 'Управление образования г. Шымкент', en: 'Shymkent City Education Department' } },
    // ORDER-114 A.14 lists edu.gov.kz among footer links. TODO(owner): confirm https://edu.gov.kz/ is live from KZ before
    // publishing (it did not answer from our test location); if it is gone, delete this entry — the footer skips missing keys.
    eduPortal: { url: 'https://edu.gov.kz/', label: { kz: 'Білім беру порталы edu.gov.kz', ru: 'Образовательный портал edu.gov.kz', en: 'Education portal edu.gov.kz' } },
    egov: { url: 'https://egov.kz/', label: { kz: 'Электрондық үкімет egov.kz', ru: 'Электронное правительство egov.kz', en: 'E-government egov.kz' } },
    elicense: { url: 'https://elicense.kz/', label: { kz: 'Лицензиялар тізілімі elicense.kz', ru: 'Реестр лицензий elicense.kz', en: 'Licence registry elicense.kz' } },
  },
};

// ---------------------------------------------------------------- read tracking (build.mjs)
// Every TODO(school) slot of the DATA CONTRACT. build.mjs warns when one of them is filled but no page read it
// (the value would never reach the site).
export const TODO_SLOTS = [
  'mission', 'values', 'teachingStarted', 'international',
  'legal.director.photo', 'legal.director.education', 'legal.director.appointmentOrder', 'legal.director.reception', 'legal.director.email',
  'deputies', 'contacts.cityPhone', 'contacts.email', 'contacts.responsibleForAppeals',
  'tuition', 'contingent', 'staff', 'schedule.bells', 'schedule.weekly', 'schedule.academicCalendar',
  'meals.supplier', 'meals.commission', 'building.ownership', 'building.capacity',
];
const reads = new Set();
const proxies = new WeakMap();
/** Read-only view that records every property path read ('contacts.email', 'schedule.bells', …). */
function tracked(obj, path) {
  if (proxies.has(obj)) return proxies.get(obj);
  const p = new Proxy(obj, {
    get(t, k, r) {
      const v = Reflect.get(t, k, r);
      if (typeof k !== 'string') return v;
      const full = path ? `${path}.${k}` : k;
      reads.add(full);
      return v && typeof v === 'object' ? tracked(v, full) : v;
    },
  });
  proxies.set(obj, p);
  return p;
}
export const school = tracked(data, '');
/** build.mjs: forget / list the paths read so far. */
export function _resetReads() { reads.clear(); }
export function _reads() { return new Set(reads); }
/** Raw value of a dotted path, without recording a read. */
export function _peek(path) { return path.split('.').reduce((o, k) => (o == null ? o : o[k]), data); }

export default school;
