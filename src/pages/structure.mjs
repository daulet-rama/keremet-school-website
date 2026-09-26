// Governance structure — organigram (verified: owner LLP + founder, director; everything below = TYPICAL scheme,
// clearly labelled), the four collegial bodies with their purpose per the typical rules, pending documents.
// ORDER-114 C.27, C.30 (criterion 2 of Order 114-NK). Legal texts read on zakon.uchet.kz mirror of adilet (24.09.2026).
const ADILET = (code, lang) => `https://adilet.zan.kz/${lang === 'kz' ? 'kaz' : 'rus'}/docs/${code}`;

export default {
  slug: 'structure',
  group: 'about',
  order: 30,
  title: { kz: 'Басқару құрылымы', ru: 'Структура управления', en: 'Governance structure' },
  description: {
    kz: '«Керемет» мектебін басқару құрылымы: органиграмма, әкімшілік, әдістемелік бірлестіктер, қызметтер және алқалы басқару органдары.',
    ru: 'Структура управления школой «Керемет»: органиграмма, администрация, методические объединения, службы и коллегиальные органы управления.',
    en: 'How Keremet School is governed: organigram, administration, subject associations, support services and collegial governing bodies.',
  },
  lead: {
    kz: 'Мектеп дара басшылық пен алқалылық қағидаттарымен басқарылады: кім неге жауап береді және шешімдер қалай қабылданады.',
    ru: 'Школа управляется на принципах единоначалия и коллегиальности: кто за что отвечает и как принимаются решения.',
    en: 'The school is run on the principles of single leadership and collegiality: who is responsible for what, and how decisions are made.',
  },
  styles: ['about'],
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, { ui, S, L, href, docById }) {
    const X = (kz, ru, en) => ({ kz, ru, en });
    const pill = (kind, label, ic) => `<span class="ab-pill ab-pill--${kind}">${ic ? ui.icon(ic, { size: 14 }) : ''}${L(label)}</span>`;
    const REAL = pill('ok', X('Расталған', 'Подтверждено', 'Verified'), 'check');
    const TYP = pill('typ', X('Типтік', 'Типовая', 'Typical'), 'info');
    const law = (code, label) => ui.extLink(ADILET(code, lang), label);

    // ---------------------------------------------------------------- organigram
    const box = ({ kind, icon, k, t, v, units, tag }) => `<div class="ab-org__box ab-org__box--${kind}"><div class="ab-org__head"><span class="ab-org__ico">${ui.icon(icon, { size: 20 })}</span><span class="ab-org__k">${L(k)}</span>${tag || ''}</div><p class="ab-org__t">${L(t)}</p>${v ? `<p class="ab-org__v">${L(v)}</p>` : ''}${units ? `<ul class="ab-org__units" role="list">${units.map((u) => `<li>${L(u)}</li>`).join('')}</ul>` : ''}</div>`;
    const council = (icon, t, v) => `<li>${box({ kind: 'council', icon, k: X('Алқалы орган', 'Коллегиальный орган', 'Collegial body'), t, v })}</li>`;
    const councilsA = `<ul class="ab-org__councils ab-org__councils--a" role="list" aria-label="${L(X('Алқалы органдар', 'Коллегиальные органы', 'Collegial bodies'))}">
<li class="ab-org__councils-t" aria-hidden="true">${L(X('Алқалы басқару органдары', 'Коллегиальные органы управления', 'Collegial governing bodies'))}</li>
${council('users', X('Педагогикалық кеңес', 'Педагогический совет', 'Pedagogical Council'), X('барлық педагогтер', 'все педагоги', 'all teachers'))}
${council('book', X('Әдістемелік кеңес', 'Методический совет', 'Methodological Council'), X('әдістемелік бірлестіктерді үйлестіреді', 'координирует методобъединения', 'coordinates subject associations'))}</ul>`;
    const councilsB = `<ul class="ab-org__councils ab-org__councils--b" role="list" aria-label="${L(X('Алқалы органдар', 'Коллегиальные органы', 'Collegial bodies'))}">
${council('handshake', X('Қамқоршылық кеңес', 'Попечительский совет', 'Board of Trustees'), X('қоғамдық бақылау', 'общественный контроль', 'public oversight'))}
${council('scale', X('Педагогикалық әдеп жөніндегі кеңес', 'Совет по педагогической этике', 'Pedagogical Ethics Council'), X('әдеп мәселелері', 'вопросы этики', 'ethics matters'))}</ul>`;

    const cols = [
      { area: 'teaching', icon: 'book', k: X('Орынбасар', 'Заместитель', 'Deputy'), t: X('Оқу-әдістемелік жұмыс', 'Учебно-методическая работа', 'Teaching & methodology'),
        units: [X('Бастауыш сыныптар ӘБ', 'МО начальных классов', 'Primary grades association'), X('Тілдер ӘБ', 'МО языков', 'Languages association'), X('Математика және жаратылыстану ӘБ', 'МО математики и естествознания', 'Maths & science association'), X('Кітапхана', 'Библиотека', 'Library'), X('Цифрлық ресурстар', 'Цифровые ресурсы', 'Digital resources')] },
      { area: 'upbringing', icon: 'heart', k: X('Орынбасар', 'Заместитель', 'Deputy'), t: X('Тәрбие жұмысы', 'Воспитательная работа', 'Upbringing'),
        units: [X('Сынып жетекшілері', 'Классные руководители', 'Class teachers'), X('Педагог-психолог', 'Педагог-психолог', 'School psychologist'), X('Әлеуметтік педагог', 'Социальный педагог', 'Social pedagogue'), X('Үйірмелер мен секциялар', 'Кружки и секции', 'Clubs & sports'), X('Ұзартылған күн тобы', 'Группа продлённого дня', 'Extended-day group')] },
      { area: 'admin', icon: 'building', k: X('Бөлім', 'Служба', 'Unit'), t: X('Әкімшілік-шаруашылық жұмыс', 'Административно-хозяйственная работа', 'Administration & facilities'),
        units: [X('Бухгалтерия', 'Бухгалтерия', 'Accounts'), X('Медициналық кабинет', 'Медицинский кабинет', 'Medical room'), X('Асхана', 'Столовая', 'Canteen'), X('Күзет және қауіпсіздік', 'Охрана и безопасность', 'Security & safety'), X('Техникалық қызмет', 'Техническая служба', 'Maintenance')] },
    ];

    // S.deputies (school.mjs): [{ area: 'teaching'|'upbringing'|'admin', name, … }] — a filled deputy turns the
    // matching typical column into a confirmed one with the real name; otherwise the typical scheme stays.
    const depBy = (area) => (Array.isArray(S.deputies) ? S.deputies.find((p) => p && p.area === area && p.name) : null);
    const organigram = ui.panel({ theme: 'hero', cls: 'ab-orgpanel', body: `<figure class="ab-org" aria-labelledby="org-cap">
<figcaption class="sr-only" id="org-cap">${L(X('Мектепті басқару құрылымының органиграммасы', 'Органиграмма структуры управления школой', 'Organigram of the school’s governance structure'))}</figcaption>
<p class="ab-org__legend" aria-hidden="true"><span><i class="l-real"></i>${L(X('құжатпен расталған', 'подтверждено документами', 'confirmed by documents'))}</span><span><i class="l-typ"></i>${L(X('типтік схема — нақтылануда', 'типовая схема — уточняется', 'typical scheme — being confirmed'))}</span><span><i class="l-cn"></i>${L(X('алқалы органдар', 'коллегиальные органы', 'collegial bodies'))}</span></p>
<ul role="list"><li>
<div class="ab-org__lvl"><div class="ab-org__owner">${box({ kind: 'real', icon: 'building', k: X('Заңды тұлға (білім беру ұйымы)', 'Юридическое лицо (организация образования)', 'Legal entity operating the school'), t: S.legal.name, v: X(`Құрылтайшысы (қатысушысы): ${L(S.legal.founder)}`, `Учредитель (участник): ${L(S.legal.founder)}`, `Founder (participant): ${L(S.legal.founder)}`), tag: REAL })}</div></div>
<ul role="list"><li>
<div class="ab-org__link" aria-hidden="true"></div>
<div class="ab-org__mid">${councilsA}<div class="ab-org__dir">${box({ kind: 'real', icon: 'user', k: X('Мектеп басшысы', 'Руководитель школы', 'Head of school'), t: X('Директор', 'Директор', 'Director'), v: S.legal.director.name, tag: REAL })}</div>${councilsB}</div>
<div class="ab-org__link ab-org__link--typ ab-org__link--cols" aria-hidden="true"></div>
<ul class="ab-org__cols" role="list">${cols.map((c) => { const dep = depBy(c.area); return `<li>${box(dep ? { kind: 'real', ...c, v: dep.name, tag: REAL } : { kind: 'typ', ...c, tag: TYP })}</li>`; }).join('')}</ul>
</li></ul>
</li></ul>
<p class="ab-org__note">${ui.icon('info', { size: 18 })}<span>${L(X(
      'Заңды тұлға, оның құрылтайшысы (қатысушысы) және директоры мемлекеттік тіркеу туралы анықтама бойынша көрсетілген; мектеп жеке заңды тұлға емес, оның қызметін «Keremet-City» ЖШС өзі жүзеге асырады. Орынбасарлар, бөлімдер мен әдістемелік бірлестіктер — жалпы білім беретін мектептерге тән типтік схема; мектептің бекітілген құрылымы жарияланғаннан кейін нақтыланады.',
      'Юридическое лицо, его учредитель (участник) и директор указаны по справке о государственной регистрации; школа не является отдельным юрлицом — образовательную деятельность ведёт само ТОО «Keremet-City». Заместители, службы и методические объединения — типовая схема для общеобразовательной школы; она будет уточнена после публикации утверждённой структуры школы.',
      'The legal entity, its founder (participant) and the director are shown as stated in the state registration certificate; the school is not a separate legal entity — it is operated by Keremet-City LLP itself. Deputies, units and subject associations follow the typical scheme of a general school and will be updated once the school’s approved structure is published.'))}</span></p>
</figure>` });

    // ---------------------------------------------------------------- collegial bodies
    const meta = (items) => `<dl class="ab-body__meta">${items.map(([k, v]) => `<div><dt>${L(k)}</dt><dd>${L(v)}</dd></div>`).join('')}</dl>`;
    const bodyCard = ({ n, title, lawHtml, text, metaItems, tasks, docs, extra }) => `<li class="ab-body" id="${n.id}">
<div class="ab-body__top"><span class="ab-body__n" aria-hidden="true">${n.no}</span><div><h3 class="ab-body__title">${L(title)}</h3><p class="ab-body__law">${lawHtml}</p></div></div>
<p>${L(text)}</p>${meta(metaItems)}
<ul class="ab-body__tasks">${tasks.map((x) => `<li>${L(x)}</li>`).join('')}</ul>
${extra || ''}
<p class="ab-kicker">${L(X('Жарияланатын құжаттар', 'Публикуемые документы', 'Documents published'))}</p>
${ui.docList(docs)}</li>`;

    const bodies = `<ul class="ab-bodies" role="list">
${bodyCard({
      n: { id: 'ped-council', no: '01' }, title: X('Педагогикалық кеңес', 'Педагогический совет', 'Pedagogical Council'),
      lawHtml: law('V080005229_', X('ҚР БҒМ м.а. 16.05.2008 № 272 бұйрығы', 'Приказ и.о. МОН РК от 16.05.2008 № 272', 'Order No. 272 of 16.05.2008')),
      text: X('Білім беру ұйымын алқалы басқару нысандарының бірі: оқу-тәрбие жұмысының негізгі мәселелерін қарайды.', 'Одна из форм коллегиального управления: рассматривает ключевые вопросы учебно-воспитательной работы.', 'One of the forms of collegial governance: it decides key questions of teaching and upbringing.'),
      metaItems: [[X('Құрамы', 'Состав', 'Members'), X('барлық педагогтер', 'все педагоги', 'all teachers')], [X('Мерзімі', 'Срок', 'Term'), X('1 оқу жылы', '1 учебный год', '1 school year')], [X('Отырыстар', 'Заседания', 'Meetings'), X('жылына ≥ 5 жоспарлы', '≥ 5 плановых в год', '≥ 5 planned a year')]],
      tasks: [X('оқу-тәрбие жұмысын жоспарлау және іске асыру, жұмыс оқу жоспарларын бекіту', 'планирование учебно-воспитательной работы, утверждение рабочих учебных планов', 'planning teaching and upbringing; approving working curricula'),
        X('білім беру қызметтерінің сапасы, сабақ кестесін құрастыру', 'качество образовательных услуг, составление расписания', 'quality of education; drawing up the timetable'),
        X('қорытынды аттестаттау, келесі сыныпқа ауыстыру, марапаттау', 'итоговая аттестация, перевод в следующий класс, награждение', 'final attestation, promotion to the next grade, awards'),
        X('білім алушыларды қабылдау, ауыстыру және бітіріп шығару', 'приём, перевод и выпуск обучающихся', 'admission, transfer and graduation of pupils')],
      docs: [docById('ped-council'), docById('ped-council-order'), docById('ped-council-plan'), docById('ped-council-minutes')].filter(Boolean),
    })}
${bodyCard({
      n: { id: 'method-council', no: '02' }, title: X('Әдістемелік кеңес', 'Методический совет', 'Methodological Council'),
      lawHtml: law('V2300033285', X('ҚР Оқу-ағарту министрінің 10.08.2023 № 253 бұйрығы', 'Приказ Министра просвещения РК от 10.08.2023 № 253', 'Order No. 253 of 10.08.2023')),
      text: X('Әдістемелік бірлестіктердің жұмысын басқару және үйлестіру үшін құрылады, педагогикалық кеңестің жұмысын қайталамайды (31-т.).', 'Создаётся для руководства и координации работы методических объединений и не дублирует педагогический совет (п. 31).', 'Set up to lead and coordinate the subject associations without duplicating the Pedagogical Council (para. 31).'),
      metaItems: [[X('Жетекшілік', 'Руководство', 'Led by'), X('оқу-әдістемелік ісі жөніндегі орынбасар', 'заместитель по учебно-методической работе', 'deputy for teaching')], [X('Бірлестік', 'Объединение', 'Association'), X('бір пәннің ≥ 3 педагогі', '≥ 3 педагогов одного предмета', '≥ 3 teachers of a subject')], [X('Жоспар', 'План', 'Plan'), X('1 жылға, директор бекітеді', 'на год, утверждает директор', 'yearly, approved by the director')]],
      tasks: [X('әдістемелік бірлестіктердің жұмысын үйлестіру', 'координация работы методических объединений', 'coordinating subject associations'),
        X('оқу-әдістемелік құжаттаманы талқылау (27-т.)', 'обсуждение учебно-методической документации (п. 27)', 'reviewing teaching materials (para. 27)'),
        X('күнтізбелік-тақырыптық жоспарларды әдістемелік бірлестікте қарау (26-т.)', 'рассмотрение календарно-тематических планов на МО (п. 26)', 'reviewing lesson plans in the associations (para. 26)'),
        X('озық тәжірибені тарату, педагогтерге әдістемелік көмек', 'распространение опыта, методическая помощь педагогам', 'sharing good practice, supporting teachers')],
      docs: [docById('method-council'), docById('method-council-membership'), docById('method-plan'), docById('method-council-minutes')].filter(Boolean),
    })}
${bodyCard({
      n: { id: 'board-of-trustees', no: '03' }, title: X('Қамқоршылық кеңес', 'Попечительский совет', 'Board of Trustees'),
      lawHtml: law('V1700015584', X('ҚР БҒМ 27.07.2017 № 355 бұйрығы', 'Приказ МОН РК от 27.07.2017 № 355', 'Order No. 355 of 27.07.2017')),
      text: X('Ұйымның дамуына ықпал ететін және оның қызметіне қоғамдық бақылауды қамтамасыз ететін алқалы басқару органы.', 'Коллегиальный орган управления, содействующий развитию школы и обеспечивающий общественный контроль за её деятельностью.', 'A collegial governing body that supports the school’s development and provides public oversight.'),
      metaItems: [[X('Мерзімі', 'Срок', 'Term'), X('3 жыл', '3 года', '3 years')], [X('Отырыстар', 'Заседания', 'Meetings'), X('тоқсанына ≥ 1', '≥ 1 в квартал', '≥ 1 per quarter')], [X('Ашықтық', 'Открытость', 'Openness'), X('шешімдер сайтта', 'решения на сайте', 'decisions online')]],
      tasks: [X('мектепті дамытудың басым бағыттарын келіседі', 'согласует приоритетные направления развития школы', 'agrees the school’s development priorities'),
        X('жылына кемінде 2 рет басшының есебін тыңдайды', 'не реже 2 раз в год заслушивает отчёт руководителя', 'hears the head’s report at least twice a year'),
        X('қайырымдылық көмекті жұмсау туралы шешім қабылдайды', 'принимает решения о расходовании благотворительной помощи', 'decides how charitable aid is spent')],
      docs: [docById('board-regulation'), docById('board-composition')].filter(Boolean),
      extra: `<p>${ui.button({ href: href('board'), label: X('Қамқоршылық кеңес туралы толығырақ', 'Подробнее о попечительском совете', 'More about the Board of Trustees'), kind: 'ghost', icon: 'arrow-right', size: 's' })}</p>`,
    })}
${bodyCard({
      n: { id: 'ethics-council', no: '04' }, title: X('Педагогикалық әдеп жөніндегі кеңес', 'Совет по педагогической этике', 'Pedagogical Ethics Council'),
      lawHtml: law('V2000020619', X('ҚР БҒМ 11.05.2020 № 190 бұйрығы, 2-қосымша', 'Приказ МОН РК от 11.05.2020 № 190, приложение 2', 'Order No. 190 of 11.05.2020, Annex 2')),
      text: X('Педагогтердің педагогикалық әдепті сақтау мәселелерін және жеке және заңды тұлғалардың өтініштерін қарайды; шешімі ұсынымдық сипатта (29-т.).', 'Рассматривает вопросы соблюдения педагогами педагогической этики и обращения физических и юридических лиц; решения носят рекомендательный характер (п. 29).', 'Considers teachers’ compliance with pedagogical ethics and complaints from the public; its decisions are recommendations (para. 29).'),
      metaItems: [[X('Мерзімі', 'Срок', 'Term'), X('3 жыл', '3 года', '3 years')], [X('Құрамы', 'Состав', 'Members'), X('≥ 7, тақ сан', '≥ 7, нечётное число', '≥ 7, odd number')], [X('Отырыстар', 'Заседания', 'Meetings'), X('тоқсанына ≥ 1', '≥ 1 в квартал', '≥ 1 per quarter')]],
      tasks: [X('педагогикалық кеңесте сайланады, құрамын директор бұйрықпен бекітеді (9, 11-т.)', 'избирается на педагогическом совете, состав утверждается приказом директора (пп. 9, 11)', 'elected at the Pedagogical Council; membership approved by the director’s order (paras 9, 11)'),
        X('директор, әкімшілік қызметкерлер мен ата-аналар мүше бола алмайды (7-т.)', 'руководитель, административные работники и родители не могут быть членами (п. 7)', 'the head, administrative staff and parents cannot be members (para. 7)'),
        X('өтініш 15 күнтізбелік күнде, қосымша ақпарат қажет болса — 30 күнде қаралады (23-т.)', 'обращение рассматривается за 15 календарных дней, при запросе информации — за 30 (п. 23)', 'a complaint is considered within 15 calendar days, or 30 if more information is needed (para. 23)')],
      extra: ui.note(X('Педагогке қатысты талқылаулар мен шешімдер тек оның жазбаша келісімімен жарияланады (31-т.), сондықтан сайтта тек жоспар, құрам және жалпы есеп орналастырылады.', 'Обсуждения и решения в отношении педагога публикуются только с его письменного согласия (п. 31), поэтому на сайте размещаются план, состав и обобщённый отчёт.', 'Discussions and decisions about a teacher may be published only with their written consent (para. 31), so the site shows the plan, membership and a summary report.')),
      docs: [docById('ethics-council'), docById('ethics-council-order'), docById('ethics-council-plan'), docById('ethics-council-report')].filter(Boolean),
    })}
</ul>`;

    // ---------------------------------------------------------------- attestation criterion 2
    const ladder = `<ol class="ab-ladder" reversed>${[
      ['s5', 5, X('Үлгілі', 'Образцовый', 'Exemplary'), X('құрылым сәйкес; органдар жұмыс істейді; қызметі жоспарлармен және хаттамалармен расталған; шешімдер білім беру бағдарламаларын іске асыруға бағытталған', 'структура соответствует; органы управления функционируют; деятельность подтверждена планами и протоколами; решения направлены на реализацию образовательных программ', 'structure complies; bodies function; work is evidenced by plans and minutes; decisions support the curriculum')],
      ['s4', 4, X('Жақсы', 'Хороший', 'Good'), X('құрылым сәйкес; жоспарлар мен хаттамалар бар; жекелеген шешімдер формалды', 'структура соответствует; есть планы и протоколы; отдельные решения формальны', 'structure complies; plans and minutes exist; some decisions are formal')],
      ['s3', 3, X('Жақсартуды қажет етеді', 'Требует улучшения', 'Needs improvement'), X('органдар тұрақсыз жұмыс істейді; хаттамалар мен жоспарлар формалды немесе ішінара жоқ', 'деятельность нерегулярна; протоколы и планы формальны или частично отсутствуют', 'irregular work; plans and minutes are formal or partly missing')],
      ['s2', 2, X('Төмен', 'Низкий', 'Low'), X('органдар жұмыс істемейді; жоспарлар мен хаттамалар жоқ', 'органы не функционируют; планы и протоколы отсутствуют', 'bodies do not function; no plans or minutes')],
    ].map(([c, n, lvl, txt]) => `<li class="${c}"><span class="ab-ladder__score" aria-hidden="true">${n}</span><div><p class="ab-ladder__lvl">${n} ${L(X('балл', n === 5 ? 'баллов' : 'балла', 'points'))} · ${L(lvl)}</p><p class="ab-ladder__txt">${L(txt)}</p></div></li>`).join('')}</ol>`;
    const legal = ui.split({
      ratio: '1:1', align: 'start',
      left: `<div class="prose">${L(X(
        `<p>«Білім туралы» Заңның 44-бабының 9-тармағына сәйкес білім беру ұйымдарында алқалы басқару органдары құрылады.</p><p>Орта білім беру ұйымдары үшін № 385 бұйрықпен бекітілген Үлгілік қағидалардың 2-қосымшасының 43-тармағы төрт нысанды атайды: педагогикалық, қамқоршылық, әдістемелік кеңестер және педагогикалық әдеп жөніндегі кеңес.</p><p>Мемлекеттік аттестаттауда бұл құрылым № 114-НҚ бұйрықтың 2-өлшемшарты бойынша бағаланады.</p>`,
        `<p>Согласно пункту 9 статьи 44 Закона «Об образовании» в организациях образования создаются коллегиальные органы управления.</p><p>Для организаций среднего образования пункт 43 приложения 2 к Типовым правилам (приказ № 385) называет четыре формы: педагогический, попечительский, методический советы и совет по педагогической этике.</p><p>При государственной аттестации эта структура оценивается по критерию 2 приказа № 114-НҚ.</p>`,
        `<p>Under Article 44(9) of the Law on Education, schools set up collegial governing bodies.</p><p>For secondary schools, para. 43 of Annex 2 to the Standard Rules (Order No. 385) names four of them: the pedagogical, trustee and methodological councils and the pedagogical ethics council.</p><p>In the state attestation this structure is scored under criterion 2 of Order No. 114-NK.</p>`))}</div>
${ui.linkList([
  { href: ADILET('Z070000319_', lang), icon: 'scale', label: X('«Білім туралы» Заң, 44-бап', 'Закон «Об образовании», ст. 44', 'Law on Education, Art. 44') },
  { href: ADILET('V2200029329', lang), icon: 'scale', label: X('№ 385 бұйрық (Үлгілік қағидалар)', 'Приказ № 385 (Типовые правила)', 'Order No. 385 (Standard Rules)') },
  { href: ADILET('V2600038645', lang), icon: 'scale', label: X('№ 114-НҚ бұйрық (аттестаттау)', 'Приказ № 114-НҚ (аттестация)', 'Order No. 114-NK (attestation)') },
])}`,
      right: `<p class="ab-kicker">${L(X('2-өлшемшарт · бағалау шкаласы', 'Критерий 2 · шкала оценки', 'Criterion 2 · scoring scale'))}</p>${ladder}`,
    });

    // ---------------------------------------------------------------- services & documents
    const services = ui.cards([
      { icon: 'heart', title: X('Психологиялық қызмет', 'Психологическая служба', 'Psychological service'), text: X('Педагог-психолог не істейді, буллингтің алдын алу, 111 және 150 сенім телефондары.', 'Чем занимается педагог-психолог, профилактика буллинга, телефоны доверия 111 и 150.', 'What a school psychologist does, anti-bullying, helplines 111 and 150.'), href: href('psychology') },
      { icon: 'medical', title: X('Медициналық қызмет', 'Медицинское обслуживание', 'Medical service'), text: X('Мектепте медициналық қызмет көрсету қалай ұйымдастырылады және қандай құжаттар жарияланады.', 'Как организуется медицинское обслуживание в школе и какие документы публикуются.', 'How medical care at school is organised and which documents are published.'), href: href('health') },
      { icon: 'book', title: X('Кітапхана', 'Библиотека', 'Library'), text: X('Оқулықтармен қамтамасыз ету және цифрлық білім беру ресурстары туралы.', 'Об обеспечении учебниками и цифровых образовательных ресурсах.', 'About textbook provision and digital learning resources.'), href: href('library') },
      { icon: 'sparkles', title: X('Үйірмелер', 'Кружки', 'Clubs'), text: X('Қосымша білім беру: үйірмелер мен секциялар туралы ақпарат.', 'Дополнительное образование: информация о кружках и секциях.', 'Extra-curricular education: information on clubs and sections.'), href: href('clubs') },
    ], { cols: 4 });
    const docs = ui.docList([docById('structure-order'), docById('charter')].filter(Boolean));

    const related = ui.linkList([
      { href: href('leadership'), icon: 'user', label: X('Басшылық', 'Руководство', 'Leadership'), note: X('Директор, орынбасарлар, қабылдау кестесі', 'Директор, заместители, график приёма', 'Director, deputies, reception hours') },
      { href: href('board'), icon: 'handshake', label: X('Қамқоршылық кеңес', 'Попечительский совет', 'Board of Trustees') },
      { href: href('development-plan'), icon: 'target', label: X('Даму жоспары', 'План развития', 'Development plan') },
      { href: href('methodical'), icon: 'bulb', label: X('Әдістемелік жұмыс', 'Методическая работа', 'Methodological work') },
    ]);
    const toc = ui.toc([
      { id: 'organigram', label: X('Органиграмма', 'Органиграмма', 'Organigram') },
      { id: 'bodies', label: X('Алқалы басқару органдары', 'Коллегиальные органы', 'Collegial bodies') },
      { id: 'law', label: X('Құқықтық негіз', 'Правовая основа', 'Legal basis') },
      { id: 'services', label: X('Қызметтер', 'Службы', 'Services') },
      { id: 'documents', label: X('Құжаттар', 'Документы', 'Documents') },
    ]);
    const intro = ui.split({
      ratio: '2:1', align: 'start', cls: 'ab-intro',
      left: `${ui.eyebrow(X('Кім неге жауап береді', 'Кто за что отвечает', 'Who is responsible for what'))}
<p class="lead">${L(X(
        'Мектепті директор басқарады, ал маңызды шешімдер алқалы органдарда — педагогикалық, әдістемелік, қамқоршылық кеңестерде және педагогикалық әдеп жөніндегі кеңесте талқыланады.',
        'Школой руководит директор, а важные решения обсуждаются коллегиально — на педагогическом, методическом, попечительском советах и в совете по педагогической этике.',
        'The director runs the school, while important decisions are discussed collegially — in the pedagogical, methodological and trustee councils and the pedagogical ethics council.'))}</p>
${ui.chips([{ icon: 'user', label: X('1 басшы', '1 руководитель', '1 head') }, { icon: 'users', label: X('4 алқалы орган', '4 коллегиальных органа', '4 collegial bodies') }, { icon: 'sitemap', label: X('3 бағыт', '3 направления', '3 areas') }])}`,
      right: toc,
    });

    return [
      intro,
      ui.section({ id: 'organigram', eyebrow: X('Басқару схемасы', 'Схема управления', 'Management chart'), title: X('Органиграмма', 'Органиграмма', 'Organigram'), body: organigram }),
      ui.section({ id: 'bodies', eyebrow: X('Алқалылық', 'Коллегиальность', 'Collegiality'), title: X('Алқалы басқару органдары', 'Коллегиальные органы управления', 'Collegial governing bodies'), lead: X('Әр орган бойынша: мақсаты, құрамы, отырыстардың жиілігі және жарияланатын құжаттар — ереже, құрам, жұмыс жоспары, хаттамалар.', 'По каждому органу: назначение, состав, периодичность заседаний и публикуемые документы — положение, состав, план работы, протоколы.', 'For each body: purpose, membership, how often it meets, and the documents we publish — regulations, membership, work plan, minutes.'), body: bodies }),
      ui.section({ id: 'law', tone: 'tint', eyebrow: X('Заң не талап етеді', 'Что требует закон', 'What the law requires'), title: X('Құқықтық негіз', 'Правовая основа', 'Legal basis'), body: legal }),
      ui.section({ id: 'services', title: X('Қолдау қызметтері', 'Службы сопровождения', 'Support services'), body: services }),
      ui.section({ id: 'documents', title: X('Құрылымды бекітетін құжаттар', 'Документы, утверждающие структуру', 'Documents approving the structure'), body: docs }),
      ui.section({ title: X('Осы бөлімде', 'В этом разделе', 'In this section'), body: related }),
    ].join('\n');
  },
};
