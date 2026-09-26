// =====================================================================================
//  src/data/news.mjs — news items (FACTUAL ONLY). Newest first is NOT required; use sortedNews().
//  Each item:
//    id        URL-safe slug (unique) → news-<id>.html
//    date      'YYYY-MM-DD' — the date of the EVENT (when it happened / the act was signed). Drives the feed order,
//              the archive year and the date stamp on the card.
//    time?     'HH:MM' — only when the event time is really known (shown as a clock chip). Omit otherwise.
//    posted    'YYYY-MM-DDTHH:MM' — when the item was published on THIS website (page "published" date,
//              JSON-LD datePublished). Never earlier than the site itself.
//    updated?  'YYYY-MM-DDTHH:MM' — last edit of the item (defaults to posted)
//    title{kz,ru,en}, lead{..}, body{..} (HTML), place{..} (ORDER-114 O.91), result{..} (O.91)
//    image:    { src (relative to assets/), alt{..}, bg? (backdrop colour behind the illustration) }
//    tags:     ids from NEWS_TAGS below (the news page filter + news.css know these ids; add new ones in both)
//    sources?: [{ url, label{..} }] — external sources (official acts first); doc?: id in documents.mjs
//  Pages: news.html lists them; news-<id>.html is one page per item (src/pages/news.mjs exports an array).
//  RSS: build.mjs emits /{lang}/rss.xml from this list.
//  To add news: append an object below. Images → public/assets/img/news/. Links inside `body` are relative
//  page URLs (e.g. admission.html) — every page lives in the same /{lang}/ folder.
//  ORDER-114 O.91 / п.109: the feed must be updated DAILY; every item needs date, place, content, result, photo.
// =====================================================================================

const POSTED = '2026-09-24T10:00'; // the day these items were put on the website

export const news = [
  {
    id: 'website-launch',
    // TODO(integrator): set `date` and `posted` to the real deploy day of keremet.edu.kz (the domain does not
    // resolve yet) — otherwise the launch date shown on the site will be wrong.
    date: '2026-09-24',
    posted: POSTED,
    tags: ['school'],
    place: {
      kz: 'keremet.edu.kz — мектептің ресми интернет-ресурсы',
      ru: 'keremet.edu.kz — официальный интернет-ресурс школы',
      en: 'keremet.edu.kz — the school’s official website',
    },
    result: {
      kz: 'Сайт қазақ, орыс және ағылшын тілдерінде жарияланды; әр бетте көру қабілеті нашар адамдарға арналған нұсқа, іздеу, сайт картасы және RSS-арна бар. Бөлімдер мектеп құжаттарымен кезең-кезеңімен толықтырылады.',
      ru: 'Сайт опубликован на казахском, русском и английском языках; на каждой странице есть версия для слабовидящих, поиск, карта сайта и RSS-лента. Разделы поэтапно наполняются документами школы.',
      en: 'The site is published in Kazakh, Russian and English; every page has a low-vision version, search, a site map and an RSS feed. Sections are being filled with the school’s documents step by step.',
    },
    title: {
      kz: 'Мектептің жаңа ресми сайты іске қосылды',
      ru: 'Запущен новый официальный сайт школы',
      en: 'The school’s new official website is live',
    },
    lead: {
      kz: 'keremet.edu.kz сайты қазақ, орыс және ағылшын тілдерінде жұмыс істейді және көру қабілеті нашар адамдарға арналған нұсқасы бар.',
      ru: 'Сайт keremet.edu.kz работает на казахском, русском и английском языках и имеет версию для слабовидящих.',
      en: 'keremet.edu.kz works in Kazakh, Russian and English and has a version for people with low vision.',
    },
    body: {
      kz: `<p>«Керемет» зияткерлік мектебінің жаңа ресми сайты іске қосылды. Сайтта мектеп туралы жалпы мәліметтер, лицензиялар, қабылдау тәртібі, құжаттар мен байланыс деректері жарияланады.</p>
<p>Сайт үш тілде жұмыс істейді: <strong>қазақ</strong> (негізгі тіл), <strong>орыс</strong> және <strong>ағылшын</strong>. Тілді ауыстырғанда сол бет ашылады.</p>
<p>Әр беттің жоғарғы жағында <strong>көру қабілеті нашар адамдарға арналған нұсқаның</strong> батырмасы бар: қаріп өлшемін, түс схемасын, әріп аралығын өзгертуге және суреттерді өшіруге болады.</p>
<p><a href="self-assessment.html">«Өзін-өзі бағалау»</a> бөлімінде мемлекеттік аттестаттауға арналған материалдар кезең-кезеңімен жарияланады.</p>`,
      ru: `<p>Заработал новый официальный сайт Интеллектуальной школы «Керемет». Здесь публикуются общие сведения о школе, лицензии, порядок приёма, документы и контакты.</p>
<p>Сайт работает на трёх языках: <strong>казахском</strong> (основной), <strong>русском</strong> и <strong>английском</strong>. При смене языка открывается та же страница.</p>
<p>На каждой странице вверху есть кнопка <strong>версии для слабовидящих</strong>: можно изменить размер шрифта, цветовую схему, межбуквенный интервал и отключить изображения.</p>
<p>В разделе <a href="self-assessment.html">«Самооценка»</a> поэтапно размещаются материалы для государственной аттестации.</p>`,
      en: `<p>The new official website of Keremet Intellectual School is now online. It publishes general information about the school, licences, admission rules, documents and contacts.</p>
<p>The site works in three languages: <strong>Kazakh</strong> (default), <strong>Russian</strong> and <strong>English</strong>. Switching the language keeps you on the same page.</p>
<p>Every page has a <strong>low-vision version</strong> button at the top: change the font size, colour scheme and letter spacing, or turn images off.</p>
<p>Materials for the state attestation are being published step by step in the <a href="self-assessment.html">“Self-assessment”</a> section.</p>`,
    },
    image: {
      src: 'img/news/website-launch.svg',
      bg: '#070A1F',
      alt: { kz: 'Сайт терезесі, шаңырақ белгісі және үш тіл', ru: 'Окно браузера со знаком шанырака и тремя языками', en: 'Browser window with the shanyrak mark and three languages' },
    },
  },
  {
    id: 'admission-2025-2026',
    date: '2025-08-12',
    posted: POSTED,
    tags: ['admission'],
    sources: [{ url: 'https://www.instagram.com/p/DNR-UIYM5uW/', label: { kz: 'Мектептің Instagram-дағы хабарландыруы, 12.08.2025', ru: 'Объявление школы в Instagram, 12.08.2025', en: 'The school’s Instagram post, 12.08.2025' } }],
    place: {
      kz: 'Шымкент қ., Асар ш/а, 911/2 · хабарландыру мектептің Instagram парақшасында жарияланды',
      ru: 'г. Шымкент, мкр. Асар, 911/2 · объявление опубликовано на странице школы в Instagram',
      en: '911/2 Asar, Shymkent · announced on the school’s Instagram page',
    },
    result: {
      kz: 'Бастауыш сыныптарға қабылдау туралы хабарландыру жарияланды, мектептің оқу бағыттары аталды. Хабарландыруда байланыс телефоны мен WhatsApp нөмірі көрсетілді. Қабылданған оқушылар саны туралы мәліметті мектеп нақтылап жатыр.',
      ru: 'Опубликовано объявление о приёме в начальные классы с перечнем направлений школы. В объявлении указаны телефон и номер WhatsApp для связи. Сведения о числе принятых учеников школа уточняет.',
      en: 'An announcement of admission to the primary grades was published, listing the school’s programmes. The announcement gave a phone number and a WhatsApp contact. The school is confirming the number of pupils admitted.',
    },
    title: {
      kz: '2025–2026 оқу жылына қабылдау басталды',
      ru: 'Открыт приём на 2025–2026 учебный год',
      en: 'Admission for the 2025–2026 school year is open',
    },
    lead: {
      kz: 'Мектеп бастауыш сыныптарға қазақ және орыс тілдерінде оқуға оқушылар қабылдайтынын хабарлады.',
      ru: 'Школа объявила приём учеников в начальные классы с обучением на казахском и русском языках.',
      en: 'The school announced admission to the primary grades with instruction in Kazakh and Russian.',
    },
    body: {
      kz: `<p>2025 жылғы 12 тамызда мектеп Instagram парақшасында 2025–2026 оқу жылына <strong>бастауыш сыныптарға</strong> қабылдау басталғанын жариялады. Оқыту <strong>қазақ және орыс тілдерінде</strong> жүргізіледі.</p>
<p>Хабарламада мектептің мынадай бағыттары аталды:</p>
<ul>
<li>НЗМ және РФММ әдістемесі бойынша оқыту;</li>
<li>Сингапур математикасы;</li>
<li>тереңдетілген және олимпиадалық математика;</li>
<li>тілдерді тереңдетіп оқыту;</li>
<li>толық күн мектебі және қосымша сабақтар;</li>
<li>шешендік өнер және қаржылық сауаттылық;</li>
<li>спорт үйірмелері және бағдарламалау;</li>
<li>робототехника және жасанды интеллект.</li>
</ul>
<p>Қабылдау тәртібі мен қажетті құжаттар туралы толығырақ — <a href="admission.html">«Қабылдау»</a> бөлімінде.</p>`,
      ru: `<p>12 августа 2025 года школа объявила в Instagram о начале приёма на 2025–2026 учебный год в <strong>начальные классы</strong>. Обучение ведётся на <strong>казахском и русском языках</strong>.</p>
<p>В объявлении названы направления школы:</p>
<ul>
<li>обучение по методике НИШ и РФМШ;</li>
<li>сингапурская математика;</li>
<li>углублённая и олимпиадная математика;</li>
<li>углублённое изучение языков;</li>
<li>школа полного дня и дополнительные уроки;</li>
<li>ораторское мастерство и финансовая грамотность;</li>
<li>спортивные секции и программирование;</li>
<li>робототехника и искусственный интеллект.</li>
</ul>
<p>Подробнее о порядке приёма и документах — в разделе <a href="admission.html">«Приём»</a>.</p>`,
      en: `<p>On 12 August 2025 the school announced on Instagram that admission to the <strong>primary grades</strong> for the 2025–2026 school year was open. Instruction is in <strong>Kazakh and Russian</strong>.</p>
<p>The announcement listed the school’s programmes:</p>
<ul>
<li>teaching based on NIS and RPMS methods;</li>
<li>Singapore maths;</li>
<li>advanced and olympiad maths;</li>
<li>in-depth language study;</li>
<li>full-day school and extra lessons;</li>
<li>public speaking and financial literacy;</li>
<li>sports clubs and programming;</li>
<li>robotics and artificial intelligence.</li>
</ul>
<p>See the <a href="admission.html">“Admission”</a> section for the rules and the list of documents.</p>`,
    },
    image: {
      src: 'img/news/admission-2025.svg',
      bg: '#F2E6CC',
      alt: { kz: '2025–2026 оқу жылына қабылдау: мектеп сөмкесі мен шаңырақ', ru: 'Приём на 2025–2026 учебный год: рюкзак и шанырак', en: 'Admission 2025–2026: school bag and shanyrak' },
    },
  },
  {
    id: 'academic-year-2026-2027',
    date: '2026-07-29',
    posted: POSTED,
    tags: ['official', 'parents'],
    sources: [
      { url: 'https://adilet.zan.kz/rus/docs/G26HP000213', label: { kz: '«Әділет» АҚЖ: 29.07.2026 № 213-НҚ бұйрық', ru: 'ИПС «Әділет»: приказ от 29.07.2026 № 213-НҚ', en: 'Adilet legal database: order No. 213-NK of 29.07.2026' } },
      { url: 'https://www.zakon.kz/pravo/6527082-novyy-uchebnyy-god-utverzhdeny-sroki-chetvertey-kanikul-i-ekzamenov.html', label: { kz: 'zakon.kz, 05.08.2026', ru: 'zakon.kz, 05.08.2026', en: 'zakon.kz, 05.08.2026' } },
    ],
    place: {
      kz: 'Астана қ. · ҚР Оқу-ағарту министрлігі',
      ru: 'г. Астана · Министерство просвещения РК',
      en: 'Astana · Ministry of Education of Kazakhstan',
    },
    result: {
      kz: 'Бұйрық 2026 жылғы 15 тамыздан бастап қолданыста және барлық орта білім беру ұйымдарына, соның ішінде біздің мектепке де қатысты. Тоқсандар мен демалыстар сайттың «Іс-шаралар күнтізбесі» бетінде күнтізбе түрінде жарияланды.',
      ru: 'Приказ действует с 15 августа 2026 года и распространяется на все организации среднего образования, включая нашу школу. Четверти и каникулы опубликованы в виде календаря на странице «Календарь событий».',
      en: 'The order has applied since 15 August 2026 to all secondary schools, ours included. The terms and breaks are shown as a calendar on the “Events calendar” page.',
    },
    title: {
      kz: '2026–2027 оқу жылының мерзімдері бекітілді',
      ru: 'Утверждены сроки 2026–2027 учебного года',
      en: 'Dates of the 2026–2027 school year approved',
    },
    lead: {
      kz: 'Оқу жылы 2026 жылғы 1 қыркүйекте басталып, 2027 жылғы 25 мамырда аяқталады. Министрлік бұйрығы тоқсандар мен демалыс мерзімдерін айқындады.',
      ru: 'Учебный год начался 1 сентября 2026 года и завершится 25 мая 2027 года. Приказ министерства определил четверти и сроки каникул.',
      en: 'The school year runs from 1 September 2026 to 25 May 2027. A ministry order sets the terms and the break dates.',
    },
    body: {
      kz: `<p>ҚР Оқу-ағарту министрінің міндетін атқарушының 2026 жылғы 29 шілдедегі № 213-НҚ бұйрығымен орта білім беру ұйымдарында 2026–2027 оқу жылының басталу және аяқталу мерзімдері, сондай-ақ білім алушыларды қорытынды аттестаттау мерзімдері айқындалды. Бұйрық 2026 жылғы 15 тамыздан бастап қолданысқа енгізілді.</p>
<p>Бұйрыққа сәйкес оқу жылы былай құрылады:</p>
<ul>
<li><strong>1-тоқсан</strong> — 8 оқу аптасы; күзгі демалыс — 7 күнтізбелік күн (2026 жылғы 26 қазан – 1 қараша);</li>
<li><strong>2-тоқсан</strong> — 8 оқу аптасы; қысқы демалыс — 14 күнтізбелік күн (2026 жылғы 28 желтоқсан – 2027 жылғы 10 қаңтар);</li>
<li><strong>3-тоқсан</strong> — 10 оқу аптасы; көктемгі демалыс — 7 күнтізбелік күн (2027 жылғы 22–28 наурыз);</li>
<li>1-сынып оқушыларына қосымша демалыс — 7 күнтізбелік күн (2027 жылғы 8–14 ақпан);</li>
<li><strong>4-тоқсан</strong> — 8 оқу аптасы; оқу жылы 2027 жылғы 25 мамырда аяқталады.</li>
</ul>
<p>Қорытынды аттестаттау: 9 (10)-сыныптарда — 2027 жылғы 31 мамыр – 11 маусым, 11 (12)-сыныптарда — 2027 жылғы 1–17 маусым.</p>
<p>Барлық күндер <a href="events.html">«Іс-шаралар күнтізбесі»</a> бетінде ай торы мен тізім түрінде берілген. Сабақ кестесі — <a href="schedule.html">«Сабақ кестесі»</a> бетінде.</p>`,
      ru: `<p>Приказом и.о. Министра просвещения РК от 29 июля 2026 года № 213-НҚ определены сроки начала и завершения 2026–2027 учебного года, а также сроки итоговой аттестации обучающихся в организациях среднего образования. Приказ введён в действие с 15 августа 2026 года.</p>
<p>По приказу учебный год устроен так:</p>
<ul>
<li><strong>1-я четверть</strong> — 8 учебных недель; осенние каникулы — 7 календарных дней (с 26 октября по 1 ноября 2026 года);</li>
<li><strong>2-я четверть</strong> — 8 учебных недель; зимние каникулы — 14 календарных дней (с 28 декабря 2026 года по 10 января 2027 года);</li>
<li><strong>3-я четверть</strong> — 10 учебных недель; весенние каникулы — 7 календарных дней (с 22 по 28 марта 2027 года);</li>
<li>дополнительные каникулы для 1 классов — 7 календарных дней (с 8 по 14 февраля 2027 года);</li>
<li><strong>4-я четверть</strong> — 8 учебных недель; учебный год завершается 25 мая 2027 года.</li>
</ul>
<p>Итоговая аттестация: в 9 (10) классах — с 31 мая по 11 июня 2027 года, в 11 (12) классах — с 1 по 17 июня 2027 года.</p>
<p>Все даты — сеткой по месяцам и списком — на странице <a href="events.html">«Календарь событий»</a>. Расписание уроков — на странице <a href="schedule.html">«Расписание»</a>.</p>`,
      en: `<p>Order No. 213-NK of the Acting Minister of Education of Kazakhstan, dated 29 July 2026, sets the start and end dates of the 2026–2027 school year and the dates of the final attestation in secondary schools. The order came into force on 15 August 2026.</p>
<p>Under the order the year is structured as follows:</p>
<ul>
<li><strong>Term 1</strong>: 8 teaching weeks; autumn break of 7 calendar days (26 October – 1 November 2026);</li>
<li><strong>Term 2</strong>: 8 teaching weeks; winter break of 14 calendar days (28 December 2026 – 10 January 2027);</li>
<li><strong>Term 3</strong>: 10 teaching weeks; spring break of 7 calendar days (22–28 March 2027);</li>
<li>an extra break for Grade 1: 7 calendar days (8–14 February 2027);</li>
<li><strong>Term 4</strong>: 8 teaching weeks; the school year ends on 25 May 2027.</li>
</ul>
<p>Final attestation: grades 9 (10) from 31 May to 11 June 2027; grades 11 (12) from 1 to 17 June 2027.</p>
<p>All dates are shown as a month grid and as a list on the <a href="events.html">“Events calendar”</a> page. The timetable is on the <a href="schedule.html">“Timetable”</a> page.</p>`,
    },
    image: {
      src: 'img/news/calendar-2026-2027.svg',
      bg: '#F5F1E6',
      alt: { kz: '2026–2027 оқу жылы: төрт тоқсан мен демалыстар белгіленген күнтізбе', ru: '2026–2027 учебный год: календарь с четырьмя четвертями и каникулами', en: 'The 2026–2027 school year: a calendar showing four terms and the breaks' },
    },
  },
  {
    id: 'constitution-day-15-march',
    date: '2026-06-11',
    posted: POSTED,
    tags: ['official'],
    sources: [
      { url: 'https://adilet.zan.kz/rus/docs/Z010000267_', label: { kz: '«Әділет» АҚЖ: «Қазақстан Республикасындағы мерекелер туралы» Заң', ru: 'ИПС «Әділет»: Закон «О праздниках в Республике Казахстан»', en: 'Adilet legal database: Law “On holidays in the Republic of Kazakhstan”' } },
      { url: 'https://prg.kz/document/?doc_id=39661979', label: { kz: '«Параграф», 15.06.2026', ru: '«Параграф», 15.06.2026', en: 'Paragraph (prg.kz), 15.06.2026' } },
    ],
    place: {
      kz: 'Астана қ. · Қазақстан Республикасының Заңы',
      ru: 'г. Астана · Закон Республики Казахстан',
      en: 'Astana · Law of the Republic of Kazakhstan',
    },
    result: {
      kz: 'Өзгерістер 2026 жылғы 1 шілдеден бастап күшіне енді. Сайттағы 2026–2027 оқу жылының іс-шаралар күнтізбесінде Конституция күні 2027 жылғы 15 наурызға белгіленді.',
      ru: 'Изменения вступили в силу с 1 июля 2026 года. В календаре событий 2026–2027 учебного года на сайте День Конституции отмечен 15 марта 2027 года.',
      en: 'The changes took effect on 1 July 2026. The site’s 2026–2027 events calendar marks Constitution Day on 15 March 2027.',
    },
    title: {
      kz: 'Конституция күні енді 15 наурызда аталып өтеді',
      ru: 'День Конституции теперь отмечается 15 марта',
      en: 'Constitution Day moves to 15 March',
    },
    lead: {
      kz: '2026 жылғы 11 маусымдағы № 306-VIII Заң «Қазақстан Республикасындағы мерекелер туралы» заңға өзгеріс енгізді: Конституция күні 30 тамыздан 15 наурызға ауыстырылды.',
      ru: 'Закон от 11 июня 2026 года № 306-VIII изменил закон «О праздниках в Республике Казахстан»: День Конституции перенесён с 30 августа на 15 марта.',
      en: 'Law No. 306-VIII of 11 June 2026 amended the Law “On holidays in the Republic of Kazakhstan”: Constitution Day moved from 30 August to 15 March.',
    },
    body: {
      kz: `<p>Қазақстан Республикасының 2026 жылғы 11 маусымдағы № 306-VIII Заңымен «Қазақстан Республикасындағы мерекелер туралы» 2001 жылғы 13 желтоқсандағы № 267 Заңға өзгерістер енгізілді. Олар 2026 жылғы 1 шілдеден бастап күшіне енді.</p>
<ul>
<li><strong>Қазақстан Республикасының Конституциясы күні</strong> енді <strong>15 наурызда</strong> аталып өтеді — 2026 жылғы 15 наурызда республикалық референдумда жаңа Конституция қабылданған күн. Мерекені 30 тамызда атап өту туралы бұрынғы норма алып тасталды.</li>
<li>«Республика күні» ұлттық мерекесінің атауы нақтыланды: енді ол <strong>«Қазақстан Республикасы күні»</strong> (25 қазан) деп аталады.</li>
</ul>
<p>Мектеп күнтізбесі үшін: 2026–2027 оқу жылында Конституция күні 2027 жылғы 15 наурызға — 3-тоқсанның соңғы аптасына келеді (көктемгі демалыс 22 наурыздан басталады). Өзгеріс 1 шілдеден күшіне енгендіктен, 2026 жылы бұл мереке күнтізбеде болған жоқ: 15 наурыз одан бұрын өтті, ал 30 тамыз мереке күні болудан қалды.</p>
<p>Барлық мемлекеттік және ұлттық мерекелер <a href="events.html">«Іс-шаралар күнтізбесі»</a> бетінде көрсетілген. Мемлекеттік рәміздер туралы — <a href="symbols.html">«Мемлекеттік рәміздер»</a> бетінде.</p>`,
      ru: `<p>Законом Республики Казахстан от 11 июня 2026 года № 306-VIII внесены изменения в Закон от 13 декабря 2001 года № 267 «О праздниках в Республике Казахстан». Они действуют с 1 июля 2026 года.</p>
<ul>
<li><strong>День Конституции Республики Казахстан</strong> теперь отмечается <strong>15 марта</strong> — в день, когда на республиканском референдуме 15 марта 2026 года была принята новая Конституция. Прежняя норма о праздновании 30 августа исключена.</li>
<li>Уточнено название национального праздника «День Республики»: теперь это <strong>«День Республики Казахстан»</strong> (25 октября).</li>
</ul>
<p>Для школьного календаря: в 2026–2027 учебном году День Конституции приходится на 15 марта 2027 года — последнюю неделю 3-й четверти (весенние каникулы начинаются 22 марта). Поскольку изменения вступили в силу с 1 июля, в 2026 году этого праздника в календаре не было: 15 марта уже прошло, а 30 августа перестало быть праздничной датой.</p>
<p>Все государственные и национальные праздники — на странице <a href="events.html">«Календарь событий»</a>. О государственных символах — на странице <a href="symbols.html">«Государственные символы»</a>.</p>`,
      en: `<p>Law of the Republic of Kazakhstan No. 306-VIII of 11 June 2026 amended Law No. 267 of 13 December 2001 “On holidays in the Republic of Kazakhstan”. The changes have applied since 1 July 2026.</p>
<ul>
<li><strong>Constitution Day of the Republic of Kazakhstan</strong> is now marked on <strong>15 March</strong>, the day the new Constitution was adopted at the national referendum of 15 March 2026. The former rule placing the holiday on 30 August was removed.</li>
<li>The national holiday “Republic Day” was renamed <strong>“Day of the Republic of Kazakhstan”</strong> (25 October).</li>
</ul>
<p>For the school calendar: in 2026–2027 Constitution Day falls on 15 March 2027, the last week of Term 3 (the spring break starts on 22 March). Because the change took effect on 1 July, the holiday did not occur in 2026 at all: 15 March had already passed and 30 August was no longer a holiday.</p>
<p>All state and national holidays are on the <a href="events.html">“Events calendar”</a> page. See the <a href="symbols.html">“State symbols”</a> page for the national symbols.</p>`,
    },
    image: {
      src: 'img/news/constitution-day.svg',
      bg: '#0A2A5E',
      alt: { kz: 'Күнтізбе парағы: 15 наурыз — Конституция күні', ru: 'Листок календаря: 15 марта — День Конституции', en: 'Calendar page: 15 March, Constitution Day' },
    },
  },
  {
    id: 'licence-2025',
    date: '2025-05-05',
    posted: POSTED,
    tags: ['documents'],
    doc: 'license-2025',
    place: {
      kz: 'Шымкент қаласының білім саласында сапаны қамтамасыз ету департаменті (лицензиар)',
      ru: 'Департамент по обеспечению качества в сфере образования г. Шымкент (лицензиар)',
      en: 'Shymkent Department for Quality Assurance in Education (the licensor)',
    },
    result: {
      kz: 'Лицензия 2025 жылғы 5 мамырдан бастап мерзімсіз әрекет етеді: мектеп бастауыш, негізгі орта және жалпы орта білім беру бағдарламаларын іске асыра алады. Лицензияның көшірмесін «Лицензия және тіркеу» бетінен көруге болады.',
      ru: 'Лицензия действует бессрочно с 5 мая 2025 года: школа вправе реализовывать программы начального, основного среднего и общего среднего образования. Копия лицензии доступна на странице «Лицензия и регистрация».',
      en: 'The licence has been valid without a time limit since 5 May 2025, so the school may deliver primary, lower secondary and upper secondary programmes. A copy is available on the “Licence & registration” page.',
    },
    title: {
      kz: 'Білім беру қызметіне №\u00A0KZ29LAM00002781 лицензия берілді',
      ru: 'Выдана лицензия на образовательную деятельность №\u00A0KZ29LAM00002781',
      en: 'Education licence No.\u00A0KZ29LAM00002781 issued',
    },
    lead: {
      kz: 'Мерзімсіз лицензия бастауыш, негізгі орта және жалпы орта білім беруді қамтиды.',
      ru: 'Бессрочная лицензия охватывает начальное, основное среднее и общее среднее образование.',
      en: 'The unlimited licence covers primary, lower secondary and upper secondary education.',
    },
    body: {
      kz: `<p>2025 жылғы 5 мамырда «Keremet-City» ЖШС-ға білім беру қызметімен айналысуға <strong>№ KZ29LAM00002781</strong> лицензия берілді. Лицензия <strong>мерзімсіз</strong>. Құжатта алғаш берілген күні ретінде 07.11.2022 көрсетілген — осы күні мектептің алғашқы лицензиясы (№ KZ18LAA00032760, бастауыш білім беру) берілген.</p>
<p>Лицензия мына қызмет түрлерін қамтиды:</p>
<ul>
<li>бастауыш білім беру;</li>
<li>негізгі орта білім беру;</li>
<li>жалпы орта білім беру;</li>
<li>техникалық және кәсіптік, орта білімнен кейінгі білім беру;</li>
<li>рухани білім беру;</li>
<li>кәмелетке толмағандарға білім беру-сауықтыру қызметтері.</li>
</ul>
<p>Лицензиар — Шымкент қаласының білім саласында сапаны қамтамасыз ету департаменті. Лицензияның көшірмесі <a href="license.html">«Лицензия және тіркеу»</a> бетінде.</p>`,
      ru: `<p>5 мая 2025 года ТОО «Keremet-City» выдана лицензия на занятие образовательной деятельностью <strong>№ KZ29LAM00002781</strong>. Лицензия <strong>бессрочная</strong>. В документе дата первичной выдачи указана как 07.11.2022 — в этот день школа получила свою первую лицензию (№ KZ18LAA00032760, начальное образование).</p>
<p>Лицензия охватывает:</p>
<ul>
<li>начальное образование;</li>
<li>основное среднее образование;</li>
<li>общее среднее образование;</li>
<li>техническое и профессиональное, послесреднее образование;</li>
<li>духовное образование;</li>
<li>образовательно-оздоровительные услуги несовершеннолетним.</li>
</ul>
<p>Лицензиар — Департамент по обеспечению качества в сфере образования города Шымкент. Копия лицензии — на странице <a href="license.html">«Лицензия и регистрация»</a>.</p>`,
      en: `<p>On 5 May 2025 Keremet-City LLP was issued education licence <strong>No. KZ29LAM00002781</strong>. The licence is <strong>unlimited</strong>. The document gives 07.11.2022 as the date of first issue, the day the school received its first licence (No. KZ18LAA00032760, primary education).</p>
<p>The licence covers:</p>
<ul>
<li>primary education;</li>
<li>lower secondary education;</li>
<li>upper secondary education;</li>
<li>technical and vocational, and post-secondary education;</li>
<li>spiritual education;</li>
<li>educational and health-improving services for minors.</li>
</ul>
<p>The licensor is the Shymkent Department for Quality Assurance in Education. A copy of the licence is on the <a href="license.html">“Licence &amp; registration”</a> page.</p>`,
    },
    image: {
      src: 'img/news/licence-2025.svg',
      bg: '#F7F3EA',
      alt: { kz: 'Лицензия құжаты мен мөр бейнесі', ru: 'Изображение лицензии с печатью', en: 'Illustration of a licence document with a seal' },
    },
  },
];

/** Tag vocabulary: id → label. The news page shows a filter chip for every tag that has items. */
export const NEWS_TAGS = {
  school: { kz: 'Мектеп өмірі', ru: 'Жизнь школы', en: 'School life' },
  admission: { kz: 'Қабылдау', ru: 'Приём', en: 'Admission' },
  documents: { kz: 'Құжаттар', ru: 'Документы', en: 'Documents' },
  events: { kz: 'Іс-шаралар', ru: 'Мероприятия', en: 'Events' },
  projects: { kz: 'Жобалар', ru: 'Проекты', en: 'Projects' },
  achievements: { kz: 'Жетістіктер', ru: 'Достижения', en: 'Achievements' },
  parents: { kz: 'Ата-аналарға', ru: 'Родителям', en: 'For parents' },
  official: { kz: 'Ресми ақпарат', ru: 'Официально', en: 'Official' },
};

/** When the item appeared on this website ('YYYY-MM-DDTHH:MM'). */
export const postedOf = (n) => n.posted || `${n.date}T${n.time || '00:00'}`;
/** Last change of the item on this website. */
export const updatedOf = (n) => n.updated || postedOf(n);

/** News sorted newest first (by event date, then by the website publication stamp). */
export function sortedNews() {
  return [...news].sort((a, b) => (b.date + postedOf(b)).localeCompare(a.date + postedOf(a)));
}

/** Find one item by id. */
export function newsById(id) {
  return news.find((n) => n.id === id) || null;
}

export default news;
