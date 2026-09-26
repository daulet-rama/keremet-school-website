// =====================================================================================
//  src/i18n.mjs — UI strings (kz = literary Kazakh, ru, en) + locale helpers.
//  t(lang, key, vars?)   → string ("{n}" placeholders replaced from vars). Missing key → key itself (and a build warning).
//  L(lang, value)        → picks value[lang] from {kz,ru,en}; fallback ru → kz → en; plain strings pass through.
//  fmtDate(lang, iso)    → '24.09.2026'          fmtDateTime(lang, iso, time?) → '24.09.2026 10:00'
//  fmtDateLong(lang,iso) → '24 қыркүйек 2026 ж.' / '24 сентября 2026 г.' / '24 September 2026'
//  fmtSize(lang, bytes)  → '216 КБ' / '216 KB'
//  LANGS, HTML_LANG, OG_LOCALE, LANG_NAMES
// =====================================================================================

export const LANGS = ['kz', 'ru', 'en'];
export const HTML_LANG = { kz: 'kk', ru: 'ru', en: 'en' };
export const OG_LOCALE = { kz: 'kk_KZ', ru: 'ru_RU', en: 'en_US' };
export const LANG_NAMES = {
  kz: { short: 'ҚАЗ', name: 'Қазақша' },
  ru: { short: 'РУС', name: 'Русский' },
  en: { short: 'ENG', name: 'English' },
};

const S = {
  // ------------------------------------------------------------------ general
  'site.name': { kz: '«Керемет» зияткерлік мектебі', ru: 'Интеллектуальная школа «Керемет»', en: 'Keremet Intellectual School' },
  'site.short': { kz: 'Керемет мектебі', ru: 'Школа «Керемет»', en: 'Keremet School' },
  'site.titleShort': { kz: '«Керемет» мектебі', ru: 'Школа «Керемет»', en: 'Keremet School' },
  'email.pending': { kz: 'Ресми e-mail нақтылануда', ru: 'Официальный e-mail уточняется', en: 'Official e-mail to be confirmed' },
  'site.slogan': { kz: 'Білім әлемі — керемет саяхат', ru: 'Учёба — удивительное путешествие', en: 'Learning is a wonderful journey' },
  home: { kz: 'Басты бет', ru: 'Главная', en: 'Home' },
  more: { kz: 'Толығырақ', ru: 'Подробнее', en: 'Learn more' },
  all: { kz: 'Барлығы', ru: 'Все', en: 'All' },
  back: { kz: 'Артқа', ru: 'Назад', en: 'Back' },
  close: { kz: 'Жабу', ru: 'Закрыть', en: 'Close' },
  open: { kz: 'Ашу', ru: 'Открыть', en: 'Open' },
  source: { kz: 'Дереккөз', ru: 'Источник', en: 'Source' },
  yes: { kz: 'Иә', ru: 'Да', en: 'Yes' },
  no: { kz: 'Жоқ', ru: 'Нет', en: 'No' },
  onThisPage: { kz: 'Беттегі бөлімдер', ru: 'Разделы страницы', en: 'On this page' },
  copy: { kz: 'Көшіру', ru: 'Копировать', en: 'Copy' },
  copied: { kz: 'Көшірілді', ru: 'Скопировано', en: 'Copied' },
  print: { kz: 'Басып шығару', ru: 'Распечатать', en: 'Print' },
  extNewTab: { kz: '(жаңа бетте ашылады)', ru: '(откроется в новой вкладке)', en: '(opens in a new tab)' },
  skip: { kz: 'Негізгі мазмұнға өту', ru: 'Перейти к основному содержанию', en: 'Skip to main content' },
  toTop: { kz: 'Жоғарыға', ru: 'Наверх', en: 'Back to top' },
  lang: { kz: 'Сайт тілі', ru: 'Язык сайта', en: 'Site language' },

  // ------------------------------------------------------------------ header
  'hdr.orgType': { kz: 'жеке меншік жалпы білім беретін мектеп', ru: 'частная общеобразовательная школа', en: 'private general education school' },
  'hdr.licensor': { kz: 'Лицензиар', ru: 'Лицензиар', en: 'Licensor' },
  'nav.main': { kz: 'Негізгі мәзір', ru: 'Основное меню', en: 'Main menu' },
  'nav.menu': { kz: 'Мәзір', ru: 'Меню', en: 'Menu' },
  'nav.openMenu': { kz: 'Мәзірді ашу', ru: 'Открыть меню', en: 'Open menu' },
  'nav.closeMenu': { kz: 'Мәзірді жабу', ru: 'Закрыть меню', en: 'Close menu' },
  'nav.section': { kz: 'Бөлім', ru: 'Раздел', en: 'Section' },
  'nav.inSection': { kz: 'Осы бөлімде', ru: 'В этом разделе', en: 'In this section' },
  'nav.crumbs': { kz: 'Сілтемелер тізбегі', ru: 'Навигационная цепочка', en: 'Breadcrumbs' },
  'nav.goto': { kz: 'Бөлімге өту', ru: 'Перейти в раздел', en: 'Go to section' },
  'cta.admission': { kz: 'Қабылдау', ru: 'Приём', en: 'Admission' },
  'cta.apply': { kz: 'Өтініш беру', ru: 'Подать заявку', en: 'Apply' },
  'cta.call': { kz: 'Қоңырау шалу', ru: 'Позвонить', en: 'Call' },
  'cta.write': { kz: 'Хат жазу', ru: 'Написать', en: 'Write to us' },

  // ------------------------------------------------------------------ search
  'search.label': { kz: 'Сайттан іздеу', ru: 'Поиск по сайту', en: 'Search the site' },
  'search.placeholder': { kz: 'Сайттан іздеу…', ru: 'Поиск по сайту…', en: 'Search the site…' },
  'search.submit': { kz: 'Іздеу', ru: 'Найти', en: 'Search' },
  'search.advanced': { kz: 'Кеңейтілген іздеу', ru: 'Расширенный поиск', en: 'Advanced search' },
  'search.query': { kz: 'Іздеу сұрауы', ru: 'Поисковый запрос', en: 'Search query' },
  'search.section': { kz: 'Бөлім', ru: 'Раздел', en: 'Section' },
  'search.allSections': { kz: 'Барлық бөлімдер', ru: 'Все разделы', en: 'All sections' },
  'search.sort': { kz: 'Сұрыптау', ru: 'Сортировка', en: 'Sort by' },
  'search.byRelevance': { kz: 'Сәйкестігі бойынша', ru: 'По релевантности', en: 'Relevance' },
  'search.byDate': { kz: 'Күні бойынша (жаңалары алдымен)', ru: 'По дате (сначала новые)', en: 'Date (newest first)' },
  'search.found': { kz: 'Табылған нәтижелер: {n}', ru: 'Найдено результатов: {n}', en: 'Results found: {n}' },
  'search.none': { kz: '«{q}» бойынша ештеңе табылмады. Басқа сөзбен іздеп көріңіз немесе бөлім сүзгісін алып тастаңыз.', ru: 'По запросу «{q}» ничего не найдено. Попробуйте другие слова или уберите фильтр раздела.', en: 'Nothing found for “{q}”. Try other words or remove the section filter.' },
  'search.empty': { kz: 'Іздеу сұрауын енгізіңіз (кемінде 2 таңба).', ru: 'Введите поисковый запрос (не менее 2 символов).', en: 'Enter a search query (at least 2 characters).' },
  'search.loading': { kz: 'Іздеу жүріп жатыр…', ru: 'Идёт поиск…', en: 'Searching…' },
  'search.error': { kz: 'Іздеу индексін жүктеу мүмкін болмады. Сайт картасын пайдаланыңыз.', ru: 'Не удалось загрузить поисковый индекс. Воспользуйтесь картой сайта.', en: 'Could not load the search index. Please use the site map.' },
  'search.noscript': { kz: 'Іздеу үшін браузерде JavaScript қосулы болуы керек. Сонымен қатар сайт картасын пайдалана аласыз.', ru: 'Для поиска нужен включённый JavaScript. Также можно воспользоваться картой сайта.', en: 'Search needs JavaScript. You can also use the site map.' },
  'search.updated': { kz: 'Жаңартылды', ru: 'Обновлено', en: 'Updated' },

  // ------------------------------------------------------------------ a11y
  'a11y.button': { kz: 'Көзі нашар көретіндерге', ru: 'Версия для слабовидящих', en: 'Low-vision version' },
  // short visible labels on phones — each is a substring of the full label (WCAG 2.5.3 label in name)
  'a11y.short': { kz: 'Нашар көретіндерге', ru: 'Для слабовидящих', en: 'Low-vision' },
  'a11y.exitShort': { kz: 'Қалыпты нұсқа', ru: 'Обычная версия', en: 'Standard version' },
  'a11y.title': { kz: 'Көру қабілеті нашар адамдарға арналған нұсқа', ru: 'Версия для слабовидящих', en: 'Version for people with low vision' },
  'a11y.font': { kz: 'Қаріп өлшемі', ru: 'Размер шрифта', en: 'Font size' },
  'a11y.scheme': { kz: 'Түс схемасы', ru: 'Цветовая схема', en: 'Colour scheme' },
  'a11y.scheme.wb': { kz: 'Ақ фонда қара', ru: 'Чёрным по белому', en: 'Black on white' },
  'a11y.scheme.bw': { kz: 'Қара фонда ақ', ru: 'Белым по чёрному', en: 'White on black' },
  'a11y.scheme.blue': { kz: 'Көгілдір фонда көк', ru: 'Синим по голубому', en: 'Dark blue on light blue' },
  'a11y.scheme.beige': { kz: 'Беж фонда қоңыр', ru: 'Коричневым по бежевому', en: 'Brown on beige' },
  'a11y.images': { kz: 'Суреттер', ru: 'Изображения', en: 'Images' },
  'a11y.on': { kz: 'Қосулы', ru: 'Вкл.', en: 'On' },
  'a11y.off': { kz: 'Өшірулі', ru: 'Выкл.', en: 'Off' },
  'a11y.spacing': { kz: 'Әріп аралығы', ru: 'Межбуквенный интервал', en: 'Letter spacing' },
  'a11y.lh': { kz: 'Жол аралығы', ru: 'Межстрочный интервал', en: 'Line spacing' },
  'a11y.normal': { kz: 'Қалыпты', ru: 'Обычный', en: 'Normal' },
  'a11y.wide': { kz: 'Кең', ru: 'Увеличенный', en: 'Wide' },
  'a11y.reset': { kz: 'Баптауларды қалпына келтіру', ru: 'Сбросить настройки', en: 'Reset settings' },
  'a11y.exit': { kz: 'Қалыпты нұсқаға оралу', ru: 'Обычная версия сайта', en: 'Standard version' },
  'a11y.help': { kz: 'Нұсқаулық', ru: 'Как пользоваться', en: 'How to use' },
  'a11y.settings': { kz: 'Баптаулар', ru: 'Настройки', en: 'Settings' },
  'a11y.settingsFull': { kz: 'Көру қабілеті нашар адамдарға арналған нұсқаның баптаулары', ru: 'Настройки версии для слабовидящих', en: 'Low-vision version settings' },
  'a11y.imgAlt': { kz: 'Сурет', ru: 'Изображение', en: 'Image' },

  // ------------------------------------------------------------------ motion
  'motion.pause': { kz: 'Анимацияны тоқтату', ru: 'Остановить анимацию', en: 'Pause animation' },
  'motion.play': { kz: 'Анимацияны қосу', ru: 'Включить анимацию', en: 'Play animation' },
  'motion.pauseShort': { kz: 'Тоқтату', ru: 'Остановить', en: 'Pause' },
  'motion.playShort': { kz: 'Қосу', ru: 'Включить', en: 'Play' },

  // ------------------------------------------------------------------ page meta
  'meta.published': { kz: 'Жарияланған күні', ru: 'Опубликовано', en: 'Published' },
  'meta.updated': { kz: 'Соңғы жаңартылған күні', ru: 'Последнее обновление', en: 'Last updated' },
  'meta.report': { kz: 'Қате таптыңыз ба? Бізге жазыңыз', ru: 'Нашли ошибку? Напишите нам', en: 'Found a mistake? Tell us' },

  // ------------------------------------------------------------------ pending / documents
  'pending.title': { kz: 'Ақпарат толықтырылуда', ru: 'Информация обновляется', en: 'Information is being updated' },
  'pending.text': { kz: 'Бұл мәліметтерді мектеп әкімшілігі нақтылап жатыр, олар жақын арада жарияланады.', ru: 'Сведения уточняются администрацией школы и будут опубликованы в ближайшее время.', en: 'The school administration is verifying this information; it will be published soon.' },
  // pendingGroup summary line — plural forms (1 / 2–4 / 5+; ru grammar, kz/en map onto them)
  'pgroup.1': { kz: '{n} материал дайындалуда', ru: '{n} материал готовится', en: '{n} item in preparation' },
  'pgroup.2': { kz: '{n} материал дайындалуда', ru: '{n} материала готовятся', en: '{n} items in preparation' },
  'pgroup.5': { kz: '{n} материал дайындалуда', ru: '{n} материалов готовятся', en: '{n} items in preparation' },
  'pgroup.docs.1': { kz: '{n} құжат жүктеледі', ru: '{n} документ будет загружен', en: '{n} document will be uploaded' },
  'pgroup.docs.2': { kz: '{n} құжат жүктеледі', ru: '{n} документа будут загружены', en: '{n} documents will be uploaded' },
  'pgroup.docs.5': { kz: '{n} құжат жүктеледі', ru: '{n} документов будут загружены', en: '{n} documents will be uploaded' },

  // ------------------------------------------------------------------ disclosures (ui.more / legal / docList collapse / tldr / expand-all)
  'disc.more': { kz: 'Толығырақ', ru: 'Подробнее', en: 'More' },
  'disc.less': { kz: 'Жасыру', ru: 'Скрыть', en: 'Show less' },
  'disc.legal': { kz: 'Құқықтық негіз', ru: 'Правовая основа', en: 'Legal basis' },
  'disc.showAll': { kz: 'Барлығын көрсету ({n})', ru: 'Показать все ({n})', en: 'Show all ({n})' },
  'disc.showLess': { kz: 'Тізімді жию', ru: 'Свернуть список', en: 'Show fewer' },
  'disc.inShort': { kz: 'Қысқаша', ru: 'Коротко', en: 'In short' },
  'disc.expandAll': { kz: 'Барлығын ашу', ru: 'Развернуть всё', en: 'Expand all' },
  'disc.collapseAll': { kz: 'Барлығын жабу', ru: 'Свернуть всё', en: 'Collapse all' },
  'doc.pending': { kz: 'Құжат жүктеледі', ru: 'Документ будет загружен', en: 'Document will be uploaded' },
  'doc.open': { kz: 'Ашу', ru: 'Открыть', en: 'Open' },
  'doc.download': { kz: 'Жүктеп алу', ru: 'Скачать', en: 'Download' },
  'doc.archive': { kz: 'Мұрағат', ru: 'Архив', en: 'Archive' },
  'doc.no': { kz: '№', ru: '№', en: 'No.' },
  'doc.from': { kz: 'күні', ru: 'от', en: 'dated' },
  'doc.link': { kz: 'Сілтеме', ru: 'Ссылка', en: 'Link' },
  'doc.issuer': { kz: 'Берген орган', ru: 'Выдан', en: 'Issued by' },
  'doc.posted': { kz: 'Орналастырылды', ru: 'Размещено', en: 'Posted' },
  'doc.changed': { kz: 'Жаңартылды', ru: 'Обновлено', en: 'Updated' },
  'size.kb': { kz: 'КБ', ru: 'КБ', en: 'KB' },
  'size.mb': { kz: 'МБ', ru: 'МБ', en: 'MB' },

  // ------------------------------------------------------------------ footer
  'ftr.contacts': { kz: 'Байланыс', ru: 'Контакты', en: 'Contacts' },
  'ftr.requisites': { kz: 'Деректемелер', ru: 'Реквизиты', en: 'Requisites' },
  'ftr.gov': { kz: 'Ресми сілтемелер', ru: 'Официальные ресурсы', en: 'Official resources' },
  'ftr.menu': { kz: 'Сайт бөлімдері', ru: 'Разделы сайта', en: 'Site sections' },
  'ftr.rights': { kz: 'Барлық құқықтар қорғалған.', ru: 'Все права защищены.', en: 'All rights reserved.' },
  'ftr.question': { kz: 'Сұрағыңыз бар ма?', ru: 'Остались вопросы?', en: 'Have a question?' },
  'ftr.questionText': { kz: 'Хат жазыңыз немесе қоңырау шалыңыз — біз міндетті түрде жауап береміз.', ru: 'Напишите или позвоните — мы обязательно ответим.', en: 'Write or call us — we will definitely get back to you.' },
  'ftr.rss': { kz: 'RSS-арна', ru: 'RSS-лента', en: 'RSS feed' },
  'ftr.feedback': { kz: 'Кері байланыс формасы', ru: 'Форма обратной связи', en: 'Feedback form' },
  bin: { kz: 'БСН', ru: 'БИН', en: 'BIN' },
  licence: { kz: 'Лицензия', ru: 'Лицензия', en: 'Licence' },
  address: { kz: 'Мекенжай', ru: 'Адрес', en: 'Address' },
  actualAddress: { kz: 'Нақты мекенжайы', ru: 'Фактический адрес', en: 'Actual address' },
  legalAddress: { kz: 'Заңды мекенжайы', ru: 'Юридический адрес', en: 'Legal address' },
  phone: { kz: 'Телефон', ru: 'Телефон', en: 'Phone' },
  email: { kz: 'Электрондық пошта', ru: 'Электронная почта', en: 'E-mail' },
  hours: { kz: 'Жұмыс уақыты', ru: 'Время работы', en: 'Working hours' },
  whatsappAdmission: { kz: 'WhatsApp (қабылдау)', ru: 'WhatsApp (приём)', en: 'WhatsApp (admission)' },
  unconfirmed: { kz: 'нақтылануда', ru: 'уточняется', en: 'to be confirmed' },

  // ------------------------------------------------------------------ map
  'map.title': { kz: 'Картадағы орны', ru: 'Мы на карте', en: 'On the map' },
  'map.open': { kz: 'Үлкен картадан ашу', ru: 'Открыть большую карту', en: 'Open a larger map' },
  'map.2gis': { kz: '2GIS-те ашу', ru: 'Открыть в 2GIS', en: 'Open in 2GIS' },
  'map.frame': { kz: 'Мектептің орналасқан жері көрсетілген карта', ru: 'Карта с расположением школы', en: 'Map showing the school location' },

  // ------------------------------------------------------------------ forms
  'form.required': { kz: 'міндетті', ru: 'обязательно', en: 'required' },
  'form.requiredNote': { kz: '* белгісі бар өрістерді толтыру міндетті.', ru: 'Поля, отмеченные *, обязательны для заполнения.', en: 'Fields marked * are required.' },
  'form.name': { kz: 'Аты-жөніңіз', ru: 'Ваше имя', en: 'Your name' },
  'form.name.hint': { kz: 'Мысалы: Айгерім Сәрсенова', ru: 'Например: Айгерим Сарсенова', en: 'For example: Aigerim Sarsenova' },
  'form.email': { kz: 'Электрондық пошта', ru: 'Электронная почта', en: 'E-mail' },
  'form.email.hint': { kz: 'Жауап осы мекенжайға жіберіледі', ru: 'Ответ придёт на этот адрес', en: 'We will reply to this address' },
  'form.phone': { kz: 'Телефон', ru: 'Телефон', en: 'Phone' },
  'form.phone.hint': { kz: 'Мысалы: +7 777 123 45 67', ru: 'Например: +7 777 123 45 67', en: 'For example: +7 777 123 45 67' },
  'form.topic': { kz: 'Өтініш тақырыбы', ru: 'Тема обращения', en: 'Topic' },
  'form.topic.general': { kz: 'Жалпы сұрақ', ru: 'Общий вопрос', en: 'General question' },
  'form.topic.admission': { kz: 'Қабылдау', ru: 'Приём в школу', en: 'Admission' },
  'form.topic.learning': { kz: 'Оқу процесі', ru: 'Учебный процесс', en: 'Learning' },
  'form.topic.proposal': { kz: 'Ұсыныс', ru: 'Предложение', en: 'Suggestion' },
  'form.topic.complaint': { kz: 'Шағым', ru: 'Жалоба', en: 'Complaint' },
  'form.message': { kz: 'Хабарлама мәтіні', ru: 'Текст сообщения', en: 'Message' },
  'form.message.hint': { kz: 'Кемінде 10 таңба. Жағдайды толық сипаттаңыз.', ru: 'Не менее 10 символов. Опишите ситуацию подробно.', en: 'At least 10 characters. Please describe the situation.' },
  'form.question': { kz: 'Директорға сұрағыңыз', ru: 'Ваш вопрос директору', en: 'Your question to the director' },
  'form.publishOk': { kz: 'Сұрағым мен жауапты сайтта аты-жөнімді көрсетпей жариялауға келісемін', ru: 'Согласен(-на) на публикацию вопроса и ответа на сайте без указания моего имени', en: 'I agree that my question and the answer may be published on the site without my name' },
  'form.parent': { kz: 'Ата-ананың (заңды өкілдің) аты-жөні', ru: 'ФИО родителя (законного представителя)', en: 'Parent’s (guardian’s) full name' },
  'form.child': { kz: 'Баланың аты-жөні', ru: 'ФИО ребёнка', en: 'Child’s full name' },
  'form.birth': { kz: 'Баланың туған күні', ru: 'Дата рождения ребёнка', en: 'Child’s date of birth' },
  'form.grade': { kz: 'Қай сыныпқа', ru: 'В какой класс', en: 'Grade applying for' },
  'form.grade.hint': { kz: 'Мысалы: 0 (мектепалды даярлық) немесе 1-сынып', ru: 'Например: 0 (предшкольная подготовка) или 1 класс', en: 'For example: 0 (pre-school) or grade 1' },
  'form.langInstr': { kz: 'Оқыту тілі', ru: 'Язык обучения', en: 'Language of instruction' },
  'form.comment': { kz: 'Қосымша ақпарат', ru: 'Дополнительная информация', en: 'Additional information' },
  'form.consent': { kz: 'Мен <a href="{href}">дербес деректерімді өңдеуге</a> келісім беремін', ru: 'Я даю согласие на <a href="{href}">обработку персональных данных</a>', en: 'I consent to the <a href="{href}">processing of my personal data</a>' },
  'form.submit': { kz: 'Жіберу', ru: 'Отправить', en: 'Send' },
  'form.submitAdmission': { kz: 'Өтінім жіберу', ru: 'Отправить заявку', en: 'Send application' },
  'form.sending': { kz: 'Жіберілуде…', ru: 'Отправка…', en: 'Sending…' },
  'form.ok': { kz: 'Рақмет! Хабарламаңыз жіберілді. Біз сізбен жақын арада байланысамыз.', ru: 'Спасибо! Сообщение отправлено. Мы свяжемся с вами в ближайшее время.', en: 'Thank you! Your message has been sent. We will contact you soon.' },
  'form.fail': { kz: 'Хабарламаны сайт арқылы жіберу мүмкін болмады. Оны WhatsApp немесе электрондық пошта арқылы жіберіңіз — мәтін сақталған:', ru: 'Не удалось отправить сообщение через сайт. Отправьте его через WhatsApp или по электронной почте — текст сохранён:', en: 'The message could not be sent through the site. Send it via WhatsApp or e-mail — your text is kept:' },
  'form.viaWhatsapp': { kz: 'WhatsApp арқылы жіберу', ru: 'Отправить в WhatsApp', en: 'Send via WhatsApp' },
  'form.failWa': { kz: 'Хабарламаны сайт арқылы жіберу мүмкін болмады. Оны WhatsApp арқылы жіберіңіз — мәтін сақталған. Немесе мектепке қоңырау шалыңыз:', ru: 'Не удалось отправить сообщение через сайт. Отправьте его через WhatsApp — текст сохранён. Или позвоните в школу:', en: 'The message could not be sent through the site. Send it via WhatsApp — your text is kept. Or call the school:' },
  'form.viaPhone': { kz: 'Қоңырау шалу', ru: 'Позвонить', en: 'Call' },
  'form.viaEmail': { kz: 'Электрондық поштамен жіберу', ru: 'Отправить по e-mail', en: 'Send by e-mail' },
  'form.errSummary': { kz: 'Форманы жіберу мүмкін болмады. Мына өрістерді тексеріңіз:', ru: 'Форма не отправлена. Проверьте поля:', en: 'The form was not sent. Please check:' },
  'form.err.required': { kz: 'Бұл өрісті толтырыңыз.', ru: 'Заполните это поле.', en: 'Please fill in this field.' },
  'form.err.email': { kz: 'Электрондық пошта мекенжайын дұрыс енгізіңіз, мысалы: name@mail.kz.', ru: 'Введите корректный адрес почты, например: name@mail.kz.', en: 'Enter a valid e-mail address, e.g. name@mail.kz.' },
  'form.err.phone': { kz: 'Телефон нөмірін дұрыс енгізіңіз, мысалы: +7 777 123 45 67.', ru: 'Введите корректный номер телефона, например: +7 777 123 45 67.', en: 'Enter a valid phone number, e.g. +7 777 123 45 67.' },
  'form.err.short': { kz: 'Мәтін тым қысқа — кемінде 10 таңба жазыңыз.', ru: 'Слишком коротко — напишите не менее 10 символов.', en: 'Too short — please write at least 10 characters.' },
  'form.err.consent': { kz: 'Жіберу үшін дербес деректерді өңдеуге келісім беру қажет.', ru: 'Для отправки необходимо согласие на обработку персональных данных.', en: 'Please give consent to the processing of personal data.' },
  'form.err.contact': { kz: 'Телефонды немесе электрондық поштаны көрсетіңіз.', ru: 'Укажите телефон или электронную почту.', en: 'Please give a phone number or an e-mail.' },
  'form.honeypot': { kz: 'Бұл өрісті бос қалдырыңыз', ru: 'Оставьте это поле пустым', en: 'Leave this field empty' },
  'form.privacyNote': { kz: 'Деректеріңіз тек өтінішіңізге жауап беру үшін пайдаланылады.', ru: 'Ваши данные используются только для ответа на обращение.', en: 'Your data is used only to answer your request.' },

  // ------------------------------------------------------------------ news
  'news.all': { kz: 'Барлық жаңалықтар', ru: 'Все новости', en: 'All news' },
  'news.soon': { kz: 'Жаңалықтар жақында', ru: 'Новости скоро', en: 'News coming soon' },
  'news.read': { kz: 'Оқу', ru: 'Читать', en: 'Read' },

  // ------------------------------------------------------------------ 404
  '404.title': { kz: 'Бет табылмады', ru: 'Страница не найдена', en: 'Page not found' },
  '404.text': { kz: 'Сұралған бет жоқ немесе басқа мекенжайға көшірілген.', ru: 'Запрошенная страница не существует или перемещена.', en: 'The page you requested does not exist or has moved.' },
};

export const strings = S;
const missing = new Set();

/** Localised UI string. vars: {n:5, q:'…'} replaces {n}/{q}. */
export function t(lang, key, vars) {
  const e = S[key];
  if (!e) { missing.add(key); return key; }
  if (e[lang] == null && fbSink) fbSink(lang, `t('${key}')`);
  let s = e[lang] ?? e.ru ?? e.kz ?? e.en ?? key;
  if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] ?? m));
  return s;
}
/** Keys requested but not defined (build prints them). */
export function missingKeys() { return [...missing]; }

/** Pick a localised value. Accepts {kz,ru,en}, plain string/number, null. Fallback ru → kz → en. */
export function L(lang, v) {
  if (v == null) return '';
  if (typeof v !== 'object' || Array.isArray(v)) return v;
  const own = v[lang];
  if (own != null && own !== '') return own;
  const fb = v.ru ?? v.kz ?? v.en ?? '';
  if (fbSink && fb !== '' && ('kz' in v || 'ru' in v || 'en' in v)) fbSink(lang, fb);
  return own ?? fb;
}
let fbSink = null;
/** Build hook: fn(lang, fallbackText) is called whenever L() had to fall back to another language. */
export function _setFallbackSink(fn) { fbSink = fn; }

const MONTHS = {
  kz: ['қаңтар', 'ақпан', 'наурыз', 'сәуір', 'мамыр', 'маусым', 'шілде', 'тамыз', 'қыркүйек', 'қазан', 'қараша', 'желтоқсан'],
  ru: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};
function parts(iso) {
  const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/);
  return m ? { y: m[1], mo: m[2], d: m[3], hh: m[4], mm: m[5] } : null;
}
export function fmtDate(lang, iso) {
  const p = parts(iso); return p ? `${p.d}.${p.mo}.${p.y}` : '';
}
export function fmtDateTime(lang, iso, time) {
  const p = parts(iso); if (!p) return '';
  const tm = time || (p.hh ? `${p.hh}:${p.mm}` : '');   // no invented time: date only when none is given
  return tm ? `${p.d}.${p.mo}.${p.y} ${tm}` : `${p.d}.${p.mo}.${p.y}`;
}
export function fmtDateLong(lang, iso) {
  const p = parts(iso); if (!p) return '';
  const d = String(+p.d), m = MONTHS[lang]?.[+p.mo - 1] || MONTHS.ru[+p.mo - 1];
  if (lang === 'kz') return `${p.y} жылғы ${d} ${m}`;
  if (lang === 'en') return `${d} ${m} ${p.y}`;
  return `${d} ${m} ${p.y} г.`;
}
export function fmtSize(lang, bytes) {
  if (!bytes && bytes !== 0) return '';
  if (bytes >= 1024 * 1024) return `${(bytes / 1048576).toFixed(1).replace('.', lang === 'en' ? '.' : ',')} ${t(lang, 'size.mb')}`;
  return `${Math.max(1, Math.round(bytes / 1024))} ${t(lang, 'size.kb')}`;
}

export default { t, L, LANGS, HTML_LANG, OG_LOCALE, LANG_NAMES, fmtDate, fmtDateTime, fmtDateLong, fmtSize, strings };
