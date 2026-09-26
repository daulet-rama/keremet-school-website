// Library, textbooks & digital resources (ORDER-114 §I items 65–67).
// Legal (adilet.zan.kz, read 24.09.2026): Law "On Education" — Art. 47 p.3 sub-p.7–8 (pupils' free use of information
// resources, provision with textbooks and teaching kits, free use of the library and computer classes);
// Art. 7 p.3 (digital system "National Educational Database", НОБД); Art. 49 p.1 sub-p.6 (parents' free electronic access
// to marks and homework). External resources checked live on 24.09.2026: nobd.edu.kz ("Национальная образовательная база
// данных"), bilimland.kz, imektep.kz, opiq.kz (e-textbooks, publishers Көкжиек-Горизонт and Study Inn), kundelik.kz.
// Law "On Access to Information" of 16.11.2015 No. 401-V (Z1500000401, read 25.09.2026): Art. 16 p. 7 sub-p. 10 — the
// internet resource must carry the "list of databases (data banks), registers, registries, cadastres" the body keeps.
// (Formally addressed to state institutions; ORDER-114 item 67 applies it to schools — we cite it as the basis of the list.)
// Library fund, textbook provision, UMK list, ICT equipment, internet speed and the school's e-journal system are
// NOT known → pending.
const X = (kz, ru, en) => ({ kz, ru, en });

export default {
  slug: 'library',
  group: 'campus',
  order: 50,
  styles: ['upbringing'],
  title: X('Кітапхана және цифрлық ресурстар', 'Библиотека и цифровые ресурсы', 'Library and digital resources'),
  description: X(
    'Мектеп кітапханасы, оқулықтармен қамтамасыз ету, оқулықтар мен ОӘК тізбесі, электрондық журнал, ҰБДҚ және пайдалы ұлттық цифрлық ресурстар.',
    'Школьная библиотека, обеспеченность учебниками, перечень учебников и УМК, электронный журнал, НОБД и полезные национальные цифровые ресурсы.',
    'The school library, textbook provision, the list of textbooks and teaching kits, the e-journal, NOBD and useful national digital resources.',
  ),
  lead: X(
    'Кітап пен цифрлық ресурстар — білім әлеміне ашылатын екі есік. Мұнда кітапхана, оқулықтар және мектеп пайдаланатын цифрлық жүйелер туралы ақпарат жиналған.',
    'Книги и цифровые ресурсы — две двери в мир знаний. Здесь собрана информация о библиотеке, учебниках и цифровых системах школы.',
    'Books and digital resources are two doors into the world of knowledge. Here you will find the library, textbooks and the school’s digital systems.',
  ),
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, { ui, L, href, docById }) {
    const LAW = `https://adilet.zan.kz/${lang === 'kz' ? 'kaz' : 'rus'}/docs/Z070000319_`;
    const ACCESS = `https://adilet.zan.kz/${lang === 'kz' ? 'kaz' : 'rus'}/docs/Z1500000401`;
    const pb = ui.badge(X('нақтылануда', 'уточняется', 'to be confirmed'), 'warn');

    // ---------------------------------------------------------------- intro
    const intro = ui.split({
      ratio: '1:1', align: 'start',
      left: `${ui.eyebrow(X('Кітап — білім бұлағы', 'Книга — источник знаний', 'Books are a source of knowledge'))}
<h2 class="sec__title">${L(X('Кітапхана — мектептің жүрегі', 'Библиотека — сердце школы', 'The library is the heart of the school'))}</h2>
<p class="lead" style="margin-top:18px">${L(X(
        '«Білім туралы» Заң бойынша оқушылар мектептің ақпараттық ресурстарын, кітапханасы мен компьютерлік сыныптарын тегін пайдалануға және оқулықтармен, оқу-әдістемелік кешендермен қамтамасыз етілуге құқылы.',
        'По Закону «Об образовании» учащиеся имеют право бесплатно пользоваться информационными ресурсами, библиотекой и компьютерными классами школы и на обеспечение учебниками и учебно-методическими комплексами.',
        'Under the Law “On Education”, pupils have the right to use the school’s information resources, library and computer rooms free of charge and to be provided with textbooks and teaching kits.',
      ))}</p>
<p class="ub-src" style="margin-top:12px">${ui.extLink(LAW, X('«Білім туралы» ҚР Заңы, 47-бап, 3-тармақ, 7)–8) тармақшалар', 'Закон РК «Об образовании», ст. 47, п. 3, пп. 7)–8)', 'Law “On Education”, Art. 47(3)(7)–(8)'))}</p>
<div class="cluster" style="margin-top:22px">${ui.button({ href: '#textbooks', label: X('Оқулықтар тізбесі', 'Перечень учебников', 'Textbook list'), icon: 'arrow-right' })}${ui.button({ href: '#resources', label: X('Цифрлық ресурстар', 'Цифровые ресурсы', 'Digital resources'), kind: 'ghost' })}</div>`,
      right: ui.panel({ theme: 'biology', cls: 'ub-lib-glance', body: `<p class="ub-kicker" style="color:var(--t-accent-text)">${L(X('Кітапхана бір қарағанда', 'Библиотека в цифрах', 'Library at a glance'))}</p>${ui.facts([
        { k: X('Кітап қоры (барлығы, дана)', 'Книжный фонд (всего, экз.)', 'Collection (items)'), v: pb },
        { k: X('Оның ішінде оқулықтар', 'В том числе учебники', 'of which textbooks'), v: pb },
        { k: X('Оқулықпен қамтамасыз ету', 'Обеспеченность учебниками', 'Textbook provision'), v: pb },
        { k: X('Оқу залы / орын саны', 'Читальный зал / мест', 'Reading room / seats'), v: pb },
        { k: X('Кітапханашы', 'Библиотекарь', 'Librarian'), v: pb },
        { k: X('Жұмыс уақыты', 'Часы работы', 'Opening hours'), v: pb },
      ])}` }),
    });

    // ---------------------------------------------------------------- textbooks & UMK
    const textbooks = `${ui.callout({ type: 'info', icon: 'book', title: X('Аттестаттау талабы: 100%', 'Требование аттестации: 100%', 'Attestation requirement: 100%'), text: X('Мемлекеттік аттестаттау кезінде оқушылардың оқулықтармен қамтамасыз етілуі, оқулықтар мен ОӘК тізбесі тексеріледі. Мектеп әр сынып бойынша қамтамасыз ету деңгейін және пайдаланылатын оқулықтардың толық тізбесін жариялайды.', 'При государственной аттестации проверяется обеспеченность учащихся учебниками и перечень учебников и УМК. Школа публикует уровень обеспеченности по каждому классу и полный перечень используемых учебников.', 'State attestation checks pupils’ textbook provision and the list of textbooks and teaching kits. The school publishes provision by grade and the full list of textbooks in use.') })}
${ui.table({
      caption: X('Оқулықтармен қамтамасыз ету, 2026–2027 оқу жылы', 'Обеспеченность учебниками, 2026–2027 учебный год', 'Textbook provision, 2026–2027'),
      head: [X('Көрсеткіш', 'Показатель', 'Indicator'), X('Мәні', 'Значение', 'Value'), X('Дереккөз', 'Источник', 'Source')],
      rows: [
        [L(X('Оқушылар саны', 'Количество учащихся', 'Number of pupils')), pb, L(X('ҰБДҚ', 'НОБД', 'NOBD'))],
        [L(X('Оқулықтар жиынтығымен қамтылған оқушылар', 'Учащиеся, обеспеченные комплектом учебников', 'Pupils with a full set of textbooks')), pb, L(X('кітапхана есебі', 'учёт библиотеки', 'library records'))],
        [L(X('Қамтамасыз ету деңгейі, %', 'Уровень обеспеченности, %', 'Provision, %')), pb, L(X('кітапхана есебі', 'учёт библиотеки', 'library records'))],
        [L(X('Оқулықтарды беру тәртібі', 'Порядок выдачи учебников', 'How textbooks are issued')), pb, L(X('мектеп бұйрығы', 'приказ школы', 'school order'))],
      ],
    })}
${ui.docList([
      docById('textbook-list'),
      docById('textbook-provision'),
      docById('library-collection'),
    ])}
${ui.pending(lang, X(
      'Кітапхана қорының көлемі, әр сынып бойынша оқулықпен қамтамасыз ету пайызы, оқулықтарды беру тәртібі және сыныптар бойынша оқулықтар мен ОӘК тізбесі (авторы, баспасы, шыққан жылы) осы жерде жарияланады.',
      'Здесь будут опубликованы объём библиотечного фонда, процент обеспеченности учебниками по каждому классу, порядок выдачи учебников и перечень учебников и УМК по классам (автор, издательство, год издания).',
      'The size of the collection, textbook provision in % by grade, how textbooks are issued and the list of textbooks and teaching kits by grade (author, publisher, year) will be published here.',
    ))}`;

    // ---------------------------------------------------------------- ICT
    const ict = ui.facts([
      { k: X('Компьютерлік сыныптар / жұмыс орындары', 'Компьютерные классы / рабочие места', 'Computer rooms / workstations'), v: pb },
      { k: X('Интернет жылдамдығы', 'Скорость интернета', 'Internet speed'), v: pb },
      { k: X('Интерактивті тақталар мен проекторлар', 'Интерактивные доски и проекторы', 'Interactive boards and projectors'), v: pb },
      { k: X('Робототехника жабдықтары', 'Оборудование для робототехники', 'Robotics equipment'), v: pb },
      { k: X('Сабақта пайдаланылатын цифрлық білім беру ресурстары', 'Цифровые образовательные ресурсы, используемые на уроках', 'Digital learning resources used in lessons'), v: pb },
    ], { cols: 2 });

    // ---------------------------------------------------------------- systems (НОБД, e-journal)
    const systems = ui.table({
      caption: X('Мектептің ақпараттық жүйелері мен деректер қорлары', 'Информационные системы и базы данных школы', 'The school’s information systems and databases'),
      head: [X('Жүйе', 'Система', 'System'), X('Мақсаты', 'Назначение', 'Purpose'), X('Кімге арналған', 'Для кого', 'Who uses it'), X('Мәртебесі', 'Статус', 'Status')],
      rows: [
        [`${L(X('Ұлттық білім беру деректер қоры (ҰБДҚ)', 'Национальная образовательная база данных (НОБД)', 'National Educational Database (NOBD)'))}<br>${ui.extLink('https://nobd.edu.kz/', 'nobd.edu.kz')}`, L(X('Білім беру саласындағы әкімшілік және өзге де деректерді жинау, өңдеу және талдау жөніндегі мемлекеттік цифрлық жүйе («Білім туралы» Заңның 7-бабы)', 'Государственная цифровая система сбора, обработки и анализа административных и иных данных в сфере образования (ст. 7 Закона «Об образовании»)', 'The state digital system that collects, processes and analyses administrative and other education data (Law “On Education”, Art. 7)')), L(X('мектеп әкімшілігі', 'администрация школы', 'school administration')), `${ui.badge(X('пайдаланылады', 'используется', 'in use'), 'ok')}<br><small>${L(X('міндетті мемлекеттік жүйе', 'обязательная государственная система', 'mandatory state system'))}</small>`],
        [L(X('Электрондық журнал және күнделік', 'Электронный журнал и дневник', 'E-journal and e-diary')), L(X('Бағалар, сабаққа қатысу, үй тапсырмалары; ата-аналардың бағалар мен үй тапсырмаларына тегін электрондық қолжетімділігі (49-бап)', 'Оценки, посещаемость, домашние задания; бесплатный электронный доступ родителей к оценкам и заданиям (ст. 49)', 'Marks, attendance and homework; parents’ free electronic access to marks and homework (Art. 49)')), L(X('педагогтер, оқушылар, ата-аналар', 'педагоги, ученики, родители', 'teachers, pupils, parents')), `${pb}<br><small>${L(X('жүйенің атауы', 'название системы', 'which system'))}</small>`],
        [`${L(X('Мектеп сайты', 'Сайт школы', 'School website'))}<br><span class="mono">keremet.edu.kz</span>`, L(X('Ресми ақпарат, құжаттар, жаңалықтар, өтініштер', 'Официальная информация, документы, новости, обращения', 'Official information, documents, news, messages')), L(X('барлығы', 'все', 'everyone')), L(X('осы сайт', 'этот сайт', 'this website'))],
      ],
    });
    const systemsBasis = `<p class="ub-src" style="margin-top:12px"><strong>${L(X('Неге бұл тізім:', 'Почему этот перечень:', 'Why this list:'))}</strong>${L(X(
      `${ui.extLink(ACCESS, '«Ақпаратқа қол жеткізу туралы» ҚР Заңы, 16-бап, 7-тармақ, 10) тармақша')} — интернет-ресурста ұйымның жүргізуіндегі дерекқорлардың, тізілімдердің тізбесі орналастырылады.`,
      `${ui.extLink(ACCESS, 'Закон РК «О доступе к информации», ст. 16, п. 7, пп. 10)')} — на интернет-ресурсе размещается перечень баз данных, реестров и регистров, находящихся в ведении организации.`,
      `${ui.extLink(ACCESS, 'Law “On Access to Information”, Art. 16(7)(10)')} — the website must list the databases and registers the organisation maintains.`,
    ))}</p>`;
    const systemsPending = ui.pending(lang, X(
      'Мектеп пайдаланатын электрондық журнал (атауы, сілтемесі, ата-аналардың логин алу тәртібі) және басқа ақпараттық жүйелер осы жерде жарияланады. Оған дейін журналға кіру туралы сынып жетекшісінен сұраңыз.',
      'Здесь будет указан электронный журнал школы (название, ссылка, как родителям получить логин) и другие информационные системы. А пока о доступе к журналу спросите у классного руководителя.',
      'The school’s e-journal (name, link, how parents get a login) and other information systems will be listed here. Until then, ask the class teacher about journal access.',
    ));

    // ---------------------------------------------------------------- national resources
    const res = [
      { c: '#0A7BBF', l: 'B', name: 'Bilimland', url: 'https://bilimland.kz/', host: 'bilimland.kz', text: X('Оқушылар мен студенттерге арналған білім беру платформасы.', 'Образовательная платформа для школьников и студентов.', 'An education platform for school and university students.') },
      { c: '#E0559A', l: 'iM', name: 'iMektep', url: 'https://imektep.kz/', host: 'imektep.kz', text: X('Мектеп бағдарламасына арналған интерактивті сабақтар: қазақ, орыс және ағылшын тілдерінде.', 'Интерактивные уроки по школьной программе на казахском, русском и английском языках.', 'Interactive lessons for the school curriculum in Kazakh, Russian and English.') },
      { c: '#12A87E', l: 'O', name: 'Opiq', url: 'https://www.opiq.kz/', host: 'opiq.kz', text: X('Қазақстан бағдарламасына сай цифрлық оқулықтар платформасы.', 'Платформа цифровых учебников по казахстанской программе.', 'A platform of digital textbooks aligned with Kazakhstan’s curriculum.') },
      { c: '#6C5CE7', l: 'K', name: 'Kundelik', url: 'https://kundelik.kz/', host: 'kundelik.kz', text: X('Қазақстанның цифрлық білім беру платформасы (электрондық күнделік).', 'Цифровая образовательная платформа Казахстана (электронный дневник).', 'A digital education platform in Kazakhstan (e-diary).') },
      { c: '#E08E00', l: X('Ұ', 'Н', 'N'), name: X('ҰБДҚ', 'НОБД', 'NOBD'), url: 'https://nobd.edu.kz/', host: 'nobd.edu.kz', text: X('Ұлттық білім беру деректер қоры — мемлекеттік жүйе.', 'Национальная образовательная база данных — государственная система.', 'National Educational Database — a state system.') },
      { c: '#0096B4', l: 'e', name: 'eGov', url: 'https://egov.kz/', host: 'egov.kz', text: X('Электрондық үкімет: білім беру саласындағы мемлекеттік қызметтер.', 'Электронное правительство: госуслуги в сфере образования.', 'E-government: public services in education.') },
    ];
    const resHtml = `<ul class="ub-res" role="list" data-reveal-stagger>${res.map((r) => `<li><a href="${r.url}" target="_blank" rel="noopener" data-ext style="--c:${r.c}"><span class="ub-res__logo" aria-hidden="true">${typeof r.l === 'string' ? r.l : L(r.l)}</span><span class="ub-res__name">${L(r.name)}${ui.icon('ext', { size: 14 })}</span><span class="ub-res__url">${r.host}</span><span class="ub-res__text">${L(r.text)}</span><span class="sr-only"> ${L(X('(жаңа бетте ашылады)', '(откроется в новой вкладке)', '(opens in a new tab)'))}</span></a></li>`).join('')}</ul>
${ui.note(X('Бұл — сыртқы ресурстар; олар мектепке тиесілі емес. Мектептің сабақта нақты қай ресурстарды пайдаланатыны жоғарыдағы АКТ бөлімінде көрсетіледі.', 'Это внешние ресурсы, они не принадлежат школе. Какие ресурсы школа фактически использует на уроках, указывается в разделе ИКТ выше.', 'These are external resources not owned by the school. Which ones the school actually uses in lessons is shown in the ICT section above.'))}`;

    const related = ui.linkList([
      { href: `${href('upbringing')}#projects`, icon: 'book', label: X('«Балалар кітапханасы» жобасы', 'Проект «Балалар кітапханасы»', 'The “Children’s Library” project'), note: X('«Адал азамат» бағдарламасы', 'Программа «Адал азамат»', 'Part of “Adal Azamat”') },
      { href: href('curriculum'), icon: 'graduation', label: X('Оқу жоспары мен бағдарламалар', 'Учебный план и программы', 'Curriculum') },
      { href: href('distance'), icon: 'globe', label: X('Қашықтан оқыту', 'Дистанционное обучение', 'Distance learning') },
      { href: href('facilities'), icon: 'building', label: X('Ғимарат және кабинеттер', 'Здание и кабинеты', 'Building and classrooms') },
      { href: href('self-7'), icon: 'target', label: X('Өзін-өзі бағалау: оқу-әдістемелік және цифрлық ресурстар', 'Самооценка: учебно-методические и цифровые ресурсы', 'Self-assessment: learning and digital resources') },
      { href: href('parents'), icon: 'handshake', label: X('Ата-аналарға', 'Родителям', 'For parents') },
    ]);

    const toc = ui.toc([
      { id: 'textbooks', label: X('Оқулықтар және ОӘК', 'Учебники и УМК', 'Textbooks and kits') },
      { id: 'ict', label: X('АКТ және жабдықтар', 'ИКТ и оснащение', 'ICT and equipment') },
      { id: 'digital', label: X('Ақпараттық жүйелер', 'Информационные системы', 'Information systems') },
      { id: 'resources', label: X('Ұлттық цифрлық ресурстар', 'Национальные цифровые ресурсы', 'National digital resources') },
    ]);

    return [
      intro,
      ui.split({ ratio: '1:2', left: toc, right: ui.section({ id: 'textbooks', eyebrow: X('Қор', 'Фонд', 'Collection'), title: X('Оқулықтар мен ОӘК', 'Учебники и УМК', 'Textbooks and teaching kits'), body: textbooks }) }),
      ui.section({ id: 'ict', tone: 'card', eyebrow: X('Цифрлық орта', 'Цифровая среда', 'Digital environment'), title: X('АКТ және жабдықтар', 'ИКТ и оснащение', 'ICT and equipment'), body: ict + ui.pending(lang, X('Компьютерлік сыныптардың саны мен жабдықталуы, интернет жылдамдығы (Мбит/с) және сабақта пайдаланылатын цифрлық ресурстар мектеппен нақтыланғаннан кейін жарияланады.', 'Количество и оснащение компьютерных классов, скорость интернета (Мбит/с) и используемые на уроках цифровые ресурсы будут опубликованы после уточнения школой.', 'The number and equipment of computer rooms, internet speed (Mbit/s) and digital resources used in lessons will be published once confirmed by the school.')) }),
      ui.section({ id: 'digital', eyebrow: X('Деректер', 'Данные', 'Data'), title: X('Ақпараттық жүйелер: ҰБДҚ және электрондық журнал', 'Информационные системы: НОБД и электронный журнал', 'Information systems: NOBD and the e-journal'), body: systems + systemsBasis + systemsPending }),
      ui.section({ id: 'resources', tone: 'biology', eyebrow: X('Сыртқы сілтемелер', 'Внешние ссылки', 'External links'), title: X('Пайдалы ұлттық цифрлық ресурстар', 'Полезные национальные цифровые ресурсы', 'Useful national digital resources'), body: resHtml }),
      ui.section({ title: X('Байланысты беттер', 'Связанные страницы', 'Related pages'), body: related }),
    ].join('\n');
  },
};
