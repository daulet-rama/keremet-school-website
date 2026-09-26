import { schoolEmail } from '../ui.mjs';
// Vacancies — ORDER-114 item 37: positions, qualification requirements, phone for enquiries.
// No vacancies are invented: the list is a pending block until the school supplies positions.
// Qualification requirements: Standard qualification characteristics, MES order No. 338 (V090005750_), §7 pp. 66–67, ред. 19.06.2026.
export default {
  slug: 'vacancies',
  group: 'staff',
  order: 20,
  styles: ['staff-admission'],
  title: { kz: 'Бос жұмыс орындары', ru: 'Вакансии', en: 'Vacancies' },
  description: {
    kz: '«Керемет» мектебіндегі бос жұмыс орындары: лауазымдар, біліктілік талаптары, қажетті құжаттар және анықтама телефоны.',
    ru: 'Вакансии школы «Керемет»: должности, квалификационные требования, необходимые документы и телефон для справок.',
    en: 'Jobs at Keremet School: positions, qualification requirements, documents to prepare and a phone number for enquiries.',
  },
  lead: {
    kz: 'Балаларды жақсы көретін және өз пәнін терең білетін педагогтерді күтеміз. Бос орындар осы бетте жарияланады.',
    ru: 'Мы ждём педагогов, которые любят детей и глубоко знают свой предмет. Открытые вакансии публикуются на этой странице.',
    en: 'We look for teachers who love children and know their subject in depth. Open positions are published on this page.',
  },
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, { ui, S, L, t, href }) {
    const X = (kz, ru, en) => ({ kz, ru, en });
    const adl = (code) => `https://adilet.zan.kz/${lang === 'kz' ? 'kaz' : 'rus'}/docs/${code}`;
    const TKH = adl('V090005750_');
    const LABOUR = adl('K1500000414');
    const STATUS = adl('Z1900000293');
    const ENBEK = `https://www.enbek.kz/${lang === 'kz' ? 'kk' : 'ru'}`;
    const phone = S.contacts.phone;

    // ------------------------------------------------------------------ open positions
    const table = ui.table({
      cls: 'sa-tbl',
      caption: X('Ашық бос орындар', 'Открытые вакансии', 'Open positions'),
      captionHidden: true, // the section's h2 right above says the same
      head: [X('Лауазым', 'Должность', 'Position'), X('Оқыту тілі', 'Язык обучения', 'Language'), X('Жүктеме', 'Нагрузка', 'Workload'), X('Жарияланған күні', 'Дата публикации', 'Posted'), X('Байланыс', 'Контакт', 'Contact')],
      rows: [[`<span class="sa-ph" aria-hidden="true"></span><span class="sr-only">${L(X('толықтырылуда', 'обновляется', 'being updated'))}</span>`, '—', '—', '—', `<a href="tel:${phone.tel}">${phone.display}</a>`]],
    });
    const openPending = ui.pending({
      title: X('Қазіргі бос орындар тізімі нақтылануда', 'Перечень текущих вакансий уточняется', 'The current list of vacancies is being confirmed'),
      note: X(
        `Бос орын ашылғанда мұнда лауазымы, пәні, оқыту тілі, жүктемесі және жарияланған күні көрсетіледі. Қазір сұрақтарыңызды телефон арқылы қоюға болады: <a href="tel:${phone.tel}">${phone.display}</a>.`,
        `Когда откроется вакансия, здесь будут указаны должность, предмет, язык обучения, нагрузка и дата публикации. Пока вопросы можно задать по телефону: <a href="tel:${phone.tel}">${phone.display}</a>.`,
        `When a position opens, its title, subject, language, workload and posting date will appear here. Meanwhile, ask by phone: <a href="tel:${phone.tel}">${phone.display}</a>.`,
      ),
    });

    // ------------------------------------------------------------------ requirements
    const reqItems = [
      { icon: 'graduation', title: X('Білімі', 'Образование', 'Education'), short: X('педагогикалық немесе бейінді білім, не қайта даярлау', 'педагогическое или профильное образование либо переподготовка', 'teacher or subject-field education, or retraining'), text: X(
        'Мұғалім үшін тиісті бейін бойынша мынаның бірі: жоғары және (немесе) жоғары оқу орнынан кейінгі педагогикалық білім; техникалық және кәсіптік, орта білімнен кейінгі педагогикалық білім; тиісті бейін бойынша өзге де кәсіптік білім; немесе педагогикалық қайта даярлауды растайтын құжат. «Педагог» санаты үшін жұмыс өтіліне талап қойылмайды.',
        'Для учителя — по соответствующему профилю одно из следующего: высшее и (или) послевузовское педагогическое образование; техническое и профессиональное, послесреднее педагогическое образование; иное профессиональное образование по соответствующему профилю; либо документ о педагогической переподготовке. Для категории «педагог» требования к стажу не предъявляются.',
        'For a teacher, one of the following in the relevant field: higher and/or postgraduate teacher education; technical and vocational or post-secondary teacher education (college); other professional education in the relevant field; or a teacher retraining certificate. No minimum experience for the “teacher” category.') },
      { icon: 'trophy', title: X('Біліктілік санаты', 'Квалификационная категория', 'Qualification category'), short: X('болса — куәлігі', 'при наличии — удостоверение', 'certificate, if you have one'), text: X(
        'Санаты бар болса — оның куәлігі (педагог, модератор, сарапшы, зерттеуші, шебер). Санат аттестаттау арқылы беріледі және көтеріледі.',
        'При наличии — удостоверение о категории (педагог, модератор, эксперт, исследователь, мастер). Категория присваивается и повышается через аттестацию.',
        'If you have one, the category certificate (teacher, moderator, expert, researcher, master). Categories are awarded and raised through attestation.') },
      { icon: 'book', title: X('Біліктілікті арттыру', 'Повышение квалификации', 'Professional development'), short: X('соңғы 3 жылдағы сертификаттар', 'сертификаты за 3 года', 'certificates for the last 3 years'), text: X(
        'Соңғы 3 жылдағы курстар туралы сертификаттар — олар мектептің кадрлық көрсеткіштеріне енеді.',
        'Сертификаты о курсах за последние 3 года — они учитываются в кадровых показателях школы.',
        'Certificates for courses taken in the last 3 years — they count towards the school’s staffing indicators.') },
      { icon: 'heart', title: X('Балалармен жұмыс', 'Работа с детьми', 'Working with children'), short: X('әдеп және қауіпсіз орта', 'этика и безопасная среда', 'ethics and a safe environment'), text: X(
        'Педагогикалық әдеп, балалардың құқықтарын құрметтеу және қауіпсіз орта жасау — міндетті талаптар.',
        'Педагогическая этика, уважение прав детей и создание безопасной среды — обязательные требования.',
        'Teaching ethics, respect for children’s rights and a safe environment are essential.') },
    ];
    const reqs = `${ui.cards(reqItems.map((r) => ({ icon: r.icon, title: r.title, text: r.short })), { cols: 4, cls: 'sa-cards sa-cards--short' })}
<div class="dz-row">${ui.more({ label: X('Талаптар толығырақ', 'Требования подробно', 'Requirements in full'), icon: 'doc', count: reqItems.length, tone: 'card', body: `<dl class="sa-needlist">${reqItems.map((r) => `<div><dt>${L(r.title)}</dt><dd>${L(r.text)}</dd></div>`).join('')}</dl>` })}`;
    // Order 338, §7 p.66 (ред. 19.06.2026): minimum teaching experience per category.
    const expTable = ui.table({
      cls: 'sa-tbl sa-exptbl',
      caption: X('Санат бойынша педагогикалық жұмыс өтілі (№ 338 бұйрық, 66-тармақ)', 'Стаж педагогической работы по категориям (приказ № 338, п. 66)', 'Teaching experience by category (Order No. 338, para. 66)'),
      head: [X('Санат', 'Категория', 'Category'), X('Ең аз өтіл', 'Минимальный стаж', 'Minimum experience'), X('Біліктілік деңгейі', 'Уровень квалификации', 'Qualification level')],
      rows: [
        [X('Педагог', 'Педагог', 'Teacher'), X('талап етілмейді', 'не требуется', 'none'), X('жоғары немесе орта', 'высший или средний', 'higher or secondary')],
        [X('Педагог-модератор', 'Педагог-модератор', 'Teacher-moderator'), X('кемінде 2 жыл', 'не менее 2 лет', 'at least 2 years'), X('жоғары немесе орта', 'высший или средний', 'higher or secondary')],
        [X('Педагог-сарапшы', 'Педагог-эксперт', 'Teacher-expert'), X('кемінде 3 жыл', 'не менее 3 лет', 'at least 3 years'), X('жоғары немесе орта', 'высший или средний', 'higher or secondary')],
        [X('Педагог-зерттеуші', 'Педагог-исследователь', 'Teacher-researcher'), X('кемінде 4 жыл', 'не менее 4 лет', 'at least 4 years'), X('жоғары немесе орта', 'высший или средний', 'higher or secondary')],
        [X('Педагог-шебер', 'Педагог-мастер', 'Teacher-master'), X('5 жыл', '5 лет', '5 years'), X('жоғары', 'высший', 'higher')],
      ],
    });
    const reqNote = `${ui.legal([
      { href: TKH, title: X('Педагог лауазымдарының үлгілік біліктілік сипаттамалары (ҚР БҒМ бұйрығы)', 'Типовые квалификационные характеристики должностей педагогов (приказ МОН РК)', 'Standard qualification characteristics of teachers’ positions (MES order)'), number: '338', date: '2009-07-13', note: X('66-тармақ; 19.06.2026 редакциясы', 'п. 66; ред. от 19.06.2026', 'para. 66; as amended 19.06.2026') },
      { href: STATUS, title: X('«Педагог мәртебесі туралы» ҚР Заңы', 'Закон РК «О статусе педагога»', 'Law “On the status of a teacher”') },
      { href: LABOUR, title: X('ҚР Еңбек кодексі', 'Трудовой кодекс РК', 'Labour Code'), note: X('32-бап — жұмысқа қабылдау кезіндегі құжаттар', 'ст. 32 — документы при приёме на работу', 'Art. 32 — documents on hiring') },
    ], { note: X(
      `Талаптар ${ui.extLink(TKH, 'Педагог лауазымдарының үлгілік біліктілік сипаттамаларының')} «Барлық мамандықтағы мұғалімдер» параграфы, 66-тармақ (ҚР БҒМ 13.07.2009 № 338 бұйрығы, 19.06.2026 редакциясы) және ${ui.extLink(STATUS, '«Педагог мәртебесі туралы» ҚР Заңы')} бойынша берілген. Басқа лауазымдарға (тәрбиеші, психолог, кітапханашы т.б.) өз параграфтарының талаптары қолданылады; нақты лауазымға қойылатын талаптар бос орын хабарландыруында көрсетіледі.`,
      `Требования приведены по п. 66 параграфа «Учителя всех специальностей» ${ui.extLink(TKH, 'Типовых квалификационных характеристик должностей педагогов')} (приказ МОН РК от 13.07.2009 № 338, ред. от 19.06.2026) и ${ui.extLink(STATUS, 'Закону РК «О статусе педагога»')}. Для других должностей (воспитатель, психолог, библиотекарь и др.) действуют требования их параграфов; требования к конкретной должности указываются в объявлении о вакансии.`,
      `Requirements follow para. 66 of the “Teachers of all subjects” section of the ${ui.extLink(TKH, 'Standard qualification characteristics of teachers’ positions')} (MES order No. 338 of 13.07.2009, as amended 19.06.2026) and the ${ui.extLink(STATUS, 'Law “On the status of a teacher”')}. Other posts (carer, psychologist, librarian, etc.) have their own sections; the requirements for a specific post are given in the vacancy notice.`,
    ) })}</div>`;

    // ------------------------------------------------------------------ how to apply (generic; the school's own selection procedure is not yet confirmed)
    const wa = ui.extLink(`https://wa.me/${phone.whatsapp}`, `WhatsApp ${phone.display}`);
    const howSteps = [
      { title: X('Хабарласыңыз', 'Свяжитесь с нами', 'Get in touch'), text: X(`Қоңырау шалыңыз: <a href="tel:${phone.tel}">${phone.display}</a>.`, `Позвоните: <a href="tel:${phone.tel}">${phone.display}</a>.`, `Call <a href="tel:${phone.tel}">${phone.display}</a>.`) },
      { title: X('Түйіндеме жіберіңіз', 'Отправьте резюме', 'Send your CV'), text: X(`Білімі, тәжірибесі, санаты және курстары көрсетілген түйіндемені ${wa} арқылы жіберіңіз (ресми электрондық пошта нақтыланғанша).`, `Резюме с образованием, опытом, категорией и курсами отправьте в ${wa} (пока официальный e-mail уточняется).`, `Send a CV with your education, experience, category and courses via ${wa} (until an official e-mail is confirmed).`) },
      { title: X('Келесі қадамдар', 'Следующие шаги', 'Next steps'), text: X('Мектеп әкімшілігі сізге хабарласып, іріктеу тәртібін түсіндіреді.', 'Администрация школы свяжется с вами и объяснит порядок отбора.', 'The school administration will contact you and explain the selection process.') },
      { title: X('Жұмысқа қабылдау', 'Оформление', 'Hiring'), text: X(`Еңбек шарты жасалады; құжаттар тізімі — ${ui.extLink(LABOUR, 'ҚР Еңбек кодексінің')} 32-бабы бойынша.`, `Заключается трудовой договор; перечень документов — по ст. 32 ${ui.extLink(LABOUR, 'Трудового кодекса РК')}.`, `An employment contract is signed; documents as listed in Art. 32 of the ${ui.extLink(LABOUR, 'Labour Code')}.`) },
    ];
    // Layer 1: four step titles (phone / WhatsApp buttons are in the contact section); details one click away.
    const how = ui.steps(howSteps.map((st) => ({ title: st.title })), { cls: 'sa-mini sa-mini--row' });
    const howPending = ui.pending({
      title: X('Мектептің іріктеу тәртібі нақтылануда', 'Порядок отбора школы уточняется', 'The school’s selection procedure is being confirmed'),
      note: X('Сұхбат, сынақ сабақ және шешім мерзімдері мектеп бекіткеннен кейін осы жерде көрсетіледі.', 'Собеседование, пробный урок и сроки решения будут указаны здесь после утверждения школой.', 'Interview, trial lesson and decision timelines will be listed here once the school approves them.'),
    });
    const docsPrepList = ui.prose(X(
      '<ul><li>жеке басын куәландыратын құжат;</li><li>білімі туралы диплом (қосымшасымен) және біліктілік санаты туралы құжат;</li><li>еңбек қызметін растайтын құжат (болса);</li><li>соңғы 3 жылдағы біліктілікті арттыру сертификаттары;</li><li>медициналық тексеру туралы құжат;</li><li>соттылығының болуы не болмауы туралы анықтама — балалармен жұмыс істеуге рұқсат беру үшін.</li></ul>',
      '<ul><li>документ, удостоверяющий личность;</li><li>диплом об образовании (с приложением) и документ о квалификационной категории;</li><li>документ о трудовой деятельности (при наличии);</li><li>сертификаты о повышении квалификации за 3 года;</li><li>документ о медицинском осмотре;</li><li>справка о наличии либо отсутствии судимости — для допуска к работе с детьми.</li></ul>',
      '<ul><li>identity document;</li><li>diploma (with transcript) and qualification category certificate;</li><li>employment record (if any);</li><li>professional development certificates for the last 3 years;</li><li>medical check-up document;</li><li>criminal record certificate — required to work with children.</li></ul>',
    ));
    const docsPrep = `<div class="dz-row">${ui.more({ label: X('Дайындалатын құжаттар', 'Какие документы подготовить', 'Documents to prepare'), icon: 'doc', count: 6, tone: 'card', body: docsPrepList })}${ui.more({ label: X('Қадамдар толығырақ', 'Каждый шаг подробно', 'Each step in detail'), icon: 'compass', count: howSteps.length, tone: 'card', body: ui.steps(howSteps, { cls: 'sa-steps-full' }) })}</div>`;

    const toc = ui.toc([
      { id: 'open', label: X('Ашық бос орындар', 'Открытые вакансии', 'Open positions') },
      { id: 'requirements', label: X('Біліктілік талаптары', 'Квалификационные требования', 'Requirements') },
      { id: 'apply', label: X('Қалай өтініш беруге болады', 'Как откликнуться', 'How to apply') },
      { id: 'contact', label: X('Анықтама телефоны', 'Телефон для справок', 'Enquiries') },
    ]);
    return [
      ui.split({ ratio: '1:2', cls: 'sa-split', left: toc, right: ui.section({ id: 'open', eyebrow: X('2026–2027 оқу жылы', '2026–2027 учебный год', 'School year 2026–2027'), title: X('Ашық бос орындар', 'Открытые вакансии', 'Open positions'), body: table + openPending }) }),
      ui.section({ id: 'requirements', eyebrow: X('Кімді іздейміз', 'Кого мы ищем', 'Who we look for'), title: X('Біліктілік талаптары', 'Квалификационные требования', 'Qualification requirements'), body: reqs + reqNote + `<h3>${L(X('Санат бойынша ең аз өтіл', 'Минимальный стаж по категориям', 'Minimum experience by category'))}</h3>` + expTable }),
      ui.section({ id: 'apply', tone: 'languages', eyebrow: X('Өтініш беру', 'Отклик', 'Applying'), title: X('Қалай өтініш беруге болады', 'Как откликнуться на вакансию', 'How to apply'), body: how + howPending + docsPrep }),
      ui.section({ id: 'contact', eyebrow: X('Байланыс', 'Контакты', 'Contact'), title: X('Анықтама телефоны', 'Телефон для справок', 'Phone for enquiries'), body: ui.split({ ratio: '1:1', align: 'center',
        left: ui.facts([
          { k: t('phone'), v: `<a href="tel:${phone.tel}">${phone.display}</a>`, copy: phone.display },
          { k: 'WhatsApp', v: ui.extLink(`https://wa.me/${phone.whatsapp}`, phone.display) },
          { k: t('email'), v: schoolEmail() },
          { k: t('hours'), v: `${L(S.contacts.hours)} ${S.contacts.hoursConfirmed ? '' : ui.badge(t('unconfirmed'), 'warn')}` },
          { k: t('actualAddress'), v: `${S.addresses.actual.postcode}, ${L(S.addresses.actual.text)}` },
        ]),
        right: `${ui.callout({ type: 'info', icon: 'globe', title: X('Бос орындардың ұлттық порталы', 'Национальный портал вакансий', 'National job portal'), text: X(
          `Бос орындар ${ui.extLink(ENBEK, 'Enbek.kz')} электрондық еңбек биржасында да жариялануы мүмкін.`,
          `Вакансии также могут размещаться на электронной бирже труда ${ui.extLink(ENBEK, 'Enbek.kz')}.`,
          `Vacancies may also be posted on the ${ui.extLink(ENBEK, 'Enbek.kz')} electronic labour exchange.`) })}
<div class="cluster">${ui.button({ href: `tel:${phone.tel}`, label: t('cta.call'), iconLeft: 'phone', kind: 'primary', ext: false })}${ui.button({ href: `https://wa.me/${phone.whatsapp}`, label: 'WhatsApp', iconLeft: 'whatsapp', kind: 'ghost' })}</div>` }) }),
      ui.section({ title: X('Байланысты беттер', 'Связанные страницы', 'Related pages'), body: ui.cards([
        { icon: 'users', href: href('teachers'), title: X('Педагогтер құрамы', 'Педагогический состав', 'Teaching staff'), text: X('Кадрлық әлеует көрсеткіштері', 'Показатели кадрового потенциала', 'Staffing indicators') },
        { icon: 'building', href: href('about'), title: X('Мектеп туралы', 'О школе', 'About the school'), text: X('Бағдарламалар мен ерекшеліктер', 'Программы и преимущества', 'Programmes and strengths') },
        { icon: 'pin', href: href('contacts'), title: X('Байланыс', 'Контакты', 'Contacts'), text: X('Мекенжай, карта, телефондар', 'Адрес, карта, телефоны', 'Address, map, phones') },
      ], { cols: 3, cls: 'sa-cards' }) }),
    ].join('\n');
  },
};
