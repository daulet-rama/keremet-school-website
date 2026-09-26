// Work with parents (ORDER-114 §G item 56: meetings, forms of cooperation).
// Legal: Law "On Education" Art. 49 — rights & duties of parents (read on adilet.zan.kz, 24.09.2026):
//   rights p.1: 1) choose school; 2) take part in governance via parent committees; 3) get information on progress,
//   behaviour and conditions; 4) advice in ПМПК; 5) extra services by contract; 6) free electronic access to current
//   marks and homework. Duties p.2: 1) healthy & safe conditions; 1-1) control phone / internet; 3) follow the charter;
//   4) ensure attendance; 5) respect staff; 6)–7) school uniform / dress code; 8) respect teachers' rights.
// Meeting schedule, parent committee members, class-teacher hours — unknown → pending.
// The meetings table renders only when S.parentMeetings (TODO(school)) holds real rows:
//   S.parentMeetings = [{ term: 1, date: '2026-10-..T18:00', topic: {kz,ru,en}, place: {kz,ru,en} }].
import { ubDoc } from './psychology.mjs';

const X = (kz, ru, en) => ({ kz, ru, en });

export default {
  slug: 'parents',
  group: 'upbringing',
  order: 40,
  styles: ['upbringing'],
  title: X('Ата-аналармен жұмыс', 'Работа с родителями', 'Working with parents'),
  description: X(
    'Мектеп пен отбасының ынтымақтастығы: ата-аналар жиналыстары, ата-аналар комитеті, сауалнамалар, ата-аналардың құқықтары мен міндеттері, кеңестер.',
    'Сотрудничество школы и семьи: родительские собрания, родительский комитет, опросы, права и обязанности родителей, советы.',
    'School–family partnership: parent meetings, the parent committee, surveys, parents’ rights and duties, and advice.',
  ),
  lead: X(
    'Бала табысының құпиясы — мектеп пен отбасының бір бағытта жұмыс істеуі. Біз ата-аналармен ашық әрі тұрақты байланыста боламыз.',
    'Секрет успеха ребёнка — школа и семья, которые действуют заодно. Мы строим открытое и постоянное общение с родителями.',
    'The secret of a child’s success is school and family pulling in the same direction. We keep open, regular contact with parents.',
  ),
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, { ui, S, L, href, fmt, docById }) {
    const LAW = `https://adilet.zan.kz/${lang === 'kz' ? 'kaz' : 'rus'}/docs/Z070000319_`;

    // ---------------------------------------------------------------- intro
    const intro = ui.split({
      ratio: '3:2', align: 'center',
      left: `${ui.eyebrow(X('Мектеп + отбасы', 'Школа + семья', 'School + family'))}
<h2 class="sec__title">${L(X('Бір шаңырақ астында', 'Под одним шаныраком', 'Under one shanyrak'))}</h2>
<p class="ub-quote-lead" style="margin-top:18px">${L(X('Шаңырақ — үйдің, бірліктің белгісі. Мектеп пен отбасы да бір шаңырақтың уықтары сияқты: бірге болғанда ғана берік.', 'Шанырак — символ дома и единства. Школа и семья — как жерди одного шанырака: прочны только вместе.', 'The shanyrak is the symbol of home and unity. School and family are like the poles of one shanyrak — strong only together.'))}</p>
<div class="cluster" style="margin-top:26px">${ui.button({ href: '#meetings', label: X('Ата-аналар жиналыстары', 'Родительские собрания', 'Parent meetings'), icon: 'arrow-right' })}${ui.button({ href: href('surveys'), label: X('Сауалнамаға қатысу', 'Пройти опрос', 'Take a survey'), kind: 'ghost' })}</div>`,
      right: ui.panel({ theme: 'arts', cls: 'ub-roof', body: `${ui.shanyrakArt({ cls: 'ub-roof__art' })}<p class="ub-emblem__k">${L(X('Бірлескен жұмыс', 'Совместная работа', 'Working together'))}</p><ul class="ub-roof__list" role="list">${[
        ['calendar', X('Жиналыстар', 'Собрания', 'Meetings'), X('сынып және жалпы мектептік', 'классные и общешкольные', 'class and whole-school')],
        ['chat', X('Кеңестер', 'Консультации', 'Consultations'), X('педагогтер мен психолог', 'педагоги и психолог', 'teachers and psychologist')],
        ['handshake', X('Ата-аналар комитеті', 'Родительский комитет', 'Parent committee'), X('мектепті басқаруға қатысу', 'участие в управлении школой', 'a voice in running the school')],
        ['target', X('Сауалнамалар', 'Опросы', 'Surveys'), X('сіздің пікіріңіз', 'ваше мнение', 'your opinion')],
      ].map(([ic, t, n]) => `<li><span class="ub-roof__ic">${ui.icon(ic, { size: 22 })}</span><span><strong>${L(t)}</strong><small>${L(n)}</small></span></li>`).join('')}</ul>` }),
    });

    // ---------------------------------------------------------------- forms of cooperation
    const forms = ui.cards([
      { icon: 'users', title: X('Ата-аналар жиналыстары', 'Родительские собрания', 'Parent meetings'), text: X('Сынып және жалпы мектептік жиналыстар: оқу нәтижелері, тәрбие, қауіпсіздік, буллингтің алдын алу.', 'Классные и общешкольные собрания: учёба, воспитание, безопасность, профилактика буллинга.', 'Class and whole-school meetings: learning, upbringing, safety and bullying prevention.'), tag: X('Кестесі жарияланады', 'График будет опубликован', 'Schedule to be published') },
      { icon: 'handshake', title: X('Ата-аналар комитеті', 'Родительский комитет', 'Parent committee'), text: X('Заң бойынша ата-аналар мектепті басқаруға ата-аналар комитеттері арқылы қатысады.', 'По закону родители участвуют в управлении школой через родительские комитеты.', 'By law parents take part in school governance through parent committees.') },
      { icon: 'chat', title: X('Жеке кеңестер', 'Индивидуальные консультации', 'One-to-one meetings'), text: X('Сынып жетекшісімен, пән мұғалімдерімен және педагог-психологпен кездесу.', 'Встречи с классным руководителем, учителями-предметниками и педагогом-психологом.', 'Meetings with the class teacher, subject teachers and the school psychologist.'), href: href('psychology') },
      { icon: 'building', title: X('Қамқоршылық кеңес', 'Попечительский совет', 'Board of trustees'), text: X('Мектепті дамытуға қоғамның қатысуы: кеңестің құрамы, жұмыс жоспары мен шешімдері — жеке бетте.', 'Участие общественности в развитии школы: состав совета, план работы и решения — на отдельной странице.', 'Community involvement in the school: the board’s members, plan and decisions are on its own page.'), href: href('board') },
      { icon: 'target', title: X('Сауалнамалар', 'Анкетирование', 'Surveys'), text: X('Тамақтану, қауіпсіздік, білім сапасы туралы пікіріңізді білдіріңіз.', 'Поделитесь мнением о питании, безопасности, качестве обучения.', 'Share your views on meals, safety and teaching quality.'), href: href('surveys') },
      { icon: 'calendar', title: X('Бірлескен іс-шаралар', 'Совместные мероприятия', 'Joint events'), text: X('Мерекелер, отбасылық жобалар, ашық есік күндері — іс-шаралар күнтізбесінде.', 'Праздники, семейные проекты, дни открытых дверей — в календаре событий.', 'Celebrations, family projects and open days — in the events calendar.'), href: href('events') },
      { icon: 'doc', title: X('Электрондық журнал', 'Электронный журнал', 'E-journal'), text: X('Баланың ағымдағы бағалары мен үй тапсырмасына тегін электрондық қолжетімділік — заң берген құқық.', 'Бесплатный электронный доступ к текущим оценкам и домашним заданиям ребёнка — право по закону.', 'Free electronic access to your child’s current marks and homework is your legal right.'), href: `${href('library')}#digital` },
      { icon: 'mail', title: X('Өтініштер', 'Обращения', 'Messages'), text: X('Ұсыныс, сұрақ немесе шағымды сайт арқылы жолдауға болады.', 'Предложение, вопрос или жалобу можно отправить через сайт.', 'Send a suggestion, question or complaint through the website.'), href: href('feedback') },
    ], { cols: 4 });

    // ---------------------------------------------------------------- rights & duties (Art. 49)
    const rights = [
      X('баланың қалауы мен ерекшеліктерін ескеріп, білім беру ұйымын таңдау;', 'выбирать организацию образования с учётом желания и особенностей ребёнка;', 'choose a school that suits the child’s wishes and needs;'),
      X('ата-аналар комитеттері арқылы мектепті басқаруға қатысу;', 'участвовать в управлении школой через родительские комитеты;', 'take part in running the school through parent committees;'),
      X('баланың үлгерімі, мінез-құлқы және оқу жағдайлары туралы ақпарат алу;', 'получать информацию об успеваемости, поведении и условиях учёбы ребёнка;', 'get information on the child’s progress, behaviour and study conditions;'),
      X('психологиялық-медициналық-педагогикалық консультацияларда кеңес алу;', 'получать консультации в психолого-медико-педагогических консультациях;', 'receive advice from psychological-medical-pedagogical consultations;'),
      X('шарт негізінде қосымша қызметтер алу;', 'получать для ребёнка дополнительные услуги на договорной основе;', 'obtain extra services for the child under a contract;'),
      X('баланың ағымдағы бағалары мен үй тапсырмаларына тегін электрондық қолжетімділік алу.', 'иметь бесплатный электронный доступ к текущим оценкам и домашним заданиям ребёнка.', 'have free electronic access to the child’s current marks and homework.'),
    ];
    const duties = [
      X('балаға өмір сүру мен оқу үшін салауатты және қауіпсіз жағдай жасау;', 'создавать ребёнку здоровые и безопасные условия для жизни и учёбы;', 'provide healthy and safe conditions for living and learning;'),
      X('баланың ұялы телефонды пайдалануын және зиянды интернет-ресурстарға кіруін бақылау;', 'контролировать использование ребёнком телефона и посещение вредных интернет-ресурсов;', 'oversee the child’s phone use and access to harmful websites;'),
      X('мектеп жарғысында белгіленген ережелерді орындау;', 'выполнять правила, определённые уставом школы;', 'follow the rules set by the school charter;'),
      X('баланың сабаққа қатысуын қамтамасыз ету;', 'обеспечивать посещение ребёнком занятий;', 'make sure the child attends lessons;'),
      X('мектеп қызметкерлерінің ар-намысы мен қадір-қасиетін құрметтеу;', 'уважать честь и достоинство работников школы;', 'respect the honour and dignity of school staff;'),
      X('мектеп формасына және киім үлгісіне қойылатын талаптарды сақтау.', 'соблюдать требования к школьной форме и форме одежды.', 'follow the school uniform and dress-code requirements.'),
    ];
    const duoFull = `<div class="ub-duo">
<div class="ub-duo__col"><h3 class="ub-duo__h">${ui.icon('check', { size: 24 })}${L(X('Ата-ананың құқықтары', 'Права родителей', 'Parents’ rights'))}</h3><ul>${rights.map((r) => `<li>${L(r)}</li>`).join('')}</ul></div>
<div class="ub-duo__col ub-duo__col--b"><h3 class="ub-duo__h">${ui.icon('shield', { size: 24 })}${L(X('Ата-ананың міндеттері', 'Обязанности родителей', 'Parents’ duties'))}</h3><ul>${duties.map((r) => `<li>${L(r)}</li>`).join('')}</ul></div>
</div>
<p class="ub-duo__src">${L(X(`Дереккөз: ${ui.extLink(LAW, '«Білім туралы» ҚР Заңы, 49-бап')} (қысқартылған мазмұны).`, `Источник: ${ui.extLink(LAW, 'Закон РК «Об образовании», статья 49')} (в сокращении).`, `Source: ${ui.extLink(LAW, 'Law of the Republic of Kazakhstan “On Education”, Article 49')} (summary).`))}</p>`;
    const duo = `<div class="ub-goal"><span class="ub-tiles__ic" aria-hidden="true">${ui.icon('scale', { size: 22 })}</span><p>${L(X(
      'Қысқаша: ата-ана баланың оқуы туралы ақпарат алуға, мектепті басқаруға қатысуға және бағаларды онлайн көруге құқылы; баланың сабаққа қатысуын және қауіпсіз жағдайын қамтамасыз етуге міндетті.',
      'Коротко: родители вправе знать об учёбе ребёнка, участвовать в управлении школой и видеть оценки онлайн; обязаны обеспечить посещение уроков и безопасные условия.',
      'In short: parents may get information on their child’s studies, take part in running the school and see marks online; they must make sure the child attends and is safe.'))}</p></div>
<div class="dz-row ub-row">${ui.more({ tone: 'plain', icon: 'check', count: rights.length + duties.length, label: X('Құқықтар мен міндеттердің толық тізімі', 'Полный список прав и обязанностей', 'Full list of rights and duties'), body: duoFull })}${ui.legal([{ href: LAW, title: X('«Білім туралы» ҚР Заңы, 49-бап', 'Закон РК «Об образовании», статья 49', 'Law “On Education”, Article 49') }])}</div>`;

    // ---------------------------------------------------------------- meetings
    const meetRows = Array.isArray(S.parentMeetings) ? S.parentMeetings.filter((r) => r && r.date) : [];
    const meetFacts = `<ul class="lf-facts" role="list">${[
      ['calendar', X('Жиналыстар — тоқсан сайын', 'Собрания — по четвертям', 'Meetings every term')],
      ['users', X('Сынып және жалпы мектептік жиналыстар', 'Классные и общешкольные собрания', 'Class and whole-school meetings')],
      ['doc', X('Хаттамалардың қысқаша қорытындылары осында жарияланады', 'Краткие итоги протоколов появятся здесь', 'Brief summaries of the minutes will be posted here')],
    ].map(([ic, tx]) => `<li><span class="lf-facts__ic" aria-hidden="true">${ui.icon(ic, { size: 22 })}</span><span>${L(tx)}</span></li>`).join('')}</ul>`;
    const meetAll = [ubDoc(docById, 'parents-plan'), docById('parent-committee'), docById('parent-meeting-minutes')].filter(Boolean);
    const meetWait = meetAll.filter((d) => !d.file && !d.url).map((d) => ({ title: d.title, note: d.note || X('Құжат жүктеледі', 'Документ будет загружен', 'Document to be uploaded') }));
    const meetings = meetFacts + (meetRows.length
      ? ui.table({
        caption: X('Жалпы мектептік ата-аналар жиналыстары, 2026–2027 оқу жылы', 'Общешкольные родительские собрания, 2026–2027 учебный год', 'Whole-school parent meetings, 2026–2027'),
        head: [X('Тоқсан', 'Четверть', 'Term'), X('Күні мен уақыты', 'Дата и время', 'Date and time'), X('Тақырыбы', 'Тема', 'Topic'), X('Өтетін орны', 'Место', 'Place')],
        rows: meetRows.map((r) => [L(X(`${r.term}-тоқсан`, `${r.term} четверть`, `Term ${r.term}`)), fmt.dateTime ? fmt.dateTime(r.date) : fmt.date(r.date), L(r.topic || ''), L(r.place || '')]),
      })
      : ui.pendingGroup(lang, [{
        title: X('Жиналыстар кестесі жарияланады', 'График собраний будет опубликован', 'The meeting schedule will be published'),
        note: X(
          'Мұнда 2026–2027 оқу жылының тоқсан сайынғы жиналыстар кестесі (күні, тақырыбы, өтетін орны), ата-аналар комитетінің құрамы және сынып жетекшілерінің қабылдау уақыты жарияланады. Жиналыс хаттамаларының қысқаша қорытындылары да осы жерде болады.',
          'Здесь появится график собраний по четвертям на 2026–2027 учебный год (дата, тема, место), состав родительского комитета и часы приёма классных руководителей. Здесь же будут краткие итоги протоколов собраний.',
          'The term-by-term 2026–2027 meeting schedule (date, topic, place), the parent committee members and class teachers’ hours for parents will appear here, along with brief summaries of meeting minutes.',
        ),
      }, ...meetWait]));
    const meetingDocs = ui.docList(meetAll.filter((d) => d.file || d.url)) + (meetRows.length ? ui.pendingGroup(lang, meetWait, { kind: 'docs' }) : '');

    // ---------------------------------------------------------------- advice
    const tips = [
      [X('Күн тәртібі', 'Режим дня', 'A daily routine'), X('Тұрақты ұйқы уақыты мен сабаққа дайындалу уақыты баланың зейінін сақтайды.', 'Стабильное время сна и выполнения уроков помогает ребёнку сохранять внимание.', 'Regular sleep and homework times help a child stay focused.')],
      [X('Күн сайын сөйлесу', 'Разговор каждый день', 'Talk every day'), X('«Бүгін не қызық болды?» деп сұраңыз — бағадан бұрын баланың көңіл-күйіне назар аударыңыз.', 'Спросите «Что сегодня было интересного?» — интересуйтесь настроением прежде оценок.', 'Ask “What was interesting today?” — care about mood before marks.')],
      [X('Бірге оқу', 'Читайте вместе', 'Read together'), X('Күніне 15–20 минут отбасылық оқу — сөздік қор мен қиялды дамытады.', '15–20 минут семейного чтения в день развивают словарный запас и воображение.', '15–20 minutes of family reading a day builds vocabulary and imagination.')],
      [X('Экран уақыты', 'Экранное время', 'Screen time'), X('Гаджетке отбасылық ереже белгілеңіз және оны өзіңіз де сақтаңыз.', 'Установите семейные правила для гаджетов — и соблюдайте их сами.', 'Set family rules for gadgets — and follow them yourself.')],
      [X('Мұғаліммен байланыс', 'На связи с учителем', 'Stay in touch'), X('Сұрақ туындаса, күтпей сынып жетекшісіне хабарласыңыз — мәселе ерте шешіледі.', 'Если есть вопрос — не ждите, напишите классному руководителю: так проблемы решаются раньше.', 'If something worries you, contact the class teacher early — problems are easier to solve.')],
      [X('Қолдау және мақтау', 'Поддержка и похвала', 'Support and praise'), X('Нәтижені ғана емес, еңбекті де мақтаңыз — бұл «Адал азамат» құндылықтарына сай.', 'Хвалите не только результат, но и усилия — это в духе ценностей «Адал азамат».', 'Praise effort, not just results — very much in the spirit of “Adal Azamat”.')],
    ];
    const tipsHtml = `<ol class="ub-tips" data-reveal-stagger>${tips.map(([t, x]) => `<li class="ub-tip"><p class="ub-tip__title">${L(t)}</p><p class="ub-tip__text">${L(x)}</p></li>`).join('')}</ol>`;

    const related = ui.linkList([
      { href: href('surveys'), icon: 'target', label: X('Сауалнамалар', 'Опросы', 'Surveys'), note: X('Ата-аналардың пікірін білу', 'Мнение родителей', 'Parents’ opinions') },
      { href: href('psychology'), icon: 'heart', label: X('Психологиялық қызмет', 'Психологическая служба', 'Psychological service'), note: X('Сенім телефондары 111 және 150', 'Телефоны доверия 111 и 150', 'Helplines 111 and 150') },
      { href: href('board'), icon: 'building', label: X('Қамқоршылық кеңес', 'Попечительский совет', 'Board of trustees') },
      { href: href('admission'), icon: 'graduation', label: X('Қабылдау', 'Приём', 'Admission') },
      { href: href('faq'), icon: 'info', label: X('Сұрақ–жауап', 'Вопрос–ответ', 'FAQ') },
      { href: href('feedback'), icon: 'mail', label: X('Өтініш жолдау', 'Отправить обращение', 'Send a message') },
    ]);

    const toc = ui.toc([
      { id: 'forms', label: X('Ынтымақтастық түрлері', 'Формы сотрудничества', 'Ways we work together') },
      { id: 'rights', label: X('Құқықтар мен міндеттер', 'Права и обязанности', 'Rights and duties') },
      { id: 'meetings', label: X('Ата-аналар жиналыстары', 'Родительские собрания', 'Parent meetings') },
      { id: 'advice', label: X('Ата-аналарға кеңестер', 'Советы родителям', 'Advice for parents') },
    ]);

    return [
      intro,
      ui.split({ ratio: '1:2', align: 'start', left: toc, right: ui.callout({ type: 'info', icon: 'phone', title: X('Мектеппен байланыс', 'Связь со школой', 'Contact the school'), text: X(`Телефон / WhatsApp: <a class="ub-nw" href="tel:${S.contacts.phone.tel}">${S.contacts.phone.display}</a>. Жазбаша өтініш — <a href="${href('feedback')}">кері байланыс формасы</a> арқылы.`, `Телефон / WhatsApp: <a class="ub-nw" href="tel:${S.contacts.phone.tel}">${S.contacts.phone.display}</a>. Письменное обращение — через <a href="${href('feedback')}">форму обратной связи</a>.`, `Phone / WhatsApp: <a class="ub-nw" href="tel:${S.contacts.phone.tel}">${S.contacts.phone.display}</a>. For written requests use the <a href="${href('feedback')}">feedback form</a>.`) }) }),
      ui.section({ id: 'forms', eyebrow: X('Бірге', 'Вместе', 'Together'), title: X('Ынтымақтастық түрлері', 'Формы сотрудничества', 'Ways we work together'), body: forms }),
      ui.section({ id: 'rights', tone: 'card', eyebrow: X('Заң бойынша', 'По закону', 'By law'), title: X('Ата-аналардың құқықтары мен міндеттері', 'Права и обязанности родителей', 'Parents’ rights and duties'), body: duo }),
      ui.section({ id: 'meetings', eyebrow: X('Кесте', 'График', 'Schedule'), title: X('Ата-аналар жиналыстары', 'Родительские собрания', 'Parent meetings'), body: meetings + meetingDocs }),
      ui.banner({ theme: 'chemistry', icon: 'target', eyebrow: X('Сіздің пікіріңіз маңызды', 'Ваше мнение важно', 'Your opinion matters'), title: X('Ата-аналарға арналған сауалнамалар', 'Опросы для родителей', 'Surveys for parents'), text: X('Мектеп өмірін бірге жақсартайық: бірнеше минут бөліп, сауалнамаға қатысыңыз.', 'Давайте улучшать школу вместе: уделите несколько минут опросу.', 'Let’s improve the school together — spare a few minutes for a survey.'), href: href('surveys'), label: X('Сауалнамаларға өту', 'Перейти к опросам', 'Go to surveys') }),
      ui.section({ id: 'advice', eyebrow: X('Үйде', 'Дома', 'At home'), title: X('Ата-аналарға алты кеңес', 'Шесть советов родителям', 'Six tips for parents'), body: tipsHtml }),
      ui.section({ title: X('Пайдалы беттер', 'Полезные страницы', 'Useful pages'), body: related }),
    ].join('\n');
  },
};
