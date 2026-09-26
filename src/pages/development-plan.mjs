// Development plan — purpose (criterion 4 of Order 114-NK, read in full on 24.09.2026), recommended structure (practice),
// indicators linked to attestation criteria with legal 5-point thresholds (criteria 5, 6, 7, 38, 39) and PENDING
// baseline/target values, pending plan PDF and annual reports. ORDER-114 C.31.
const ADILET = (code, lang) => `https://adilet.zan.kz/${lang === 'kz' ? 'kaz' : 'rus'}/docs/${code}`;

export default {
  slug: 'development-plan',
  group: 'about',
  order: 50,
  title: { kz: 'Даму жоспары', ru: 'План развития', en: 'Development plan' },
  description: {
    kz: '«Керемет» мектебінің даму жоспары: мақсаты, құрылымы, мақсатты индикаторлар, іске асыру циклі және орындалуы туралы жылдық есептер.',
    ru: 'План развития школы «Керемет»: назначение, структура, целевые индикаторы, цикл реализации и годовые отчёты о выполнении.',
    en: 'Keremet School development plan: purpose, structure, target indicators, implementation cycle and annual progress reports.',
  },
  lead: {
    kz: 'Мектептің бірнеше жылға арналған стратегиялық құжаты: неге ұмтыламыз, нәтижені немен өлшейміз және жыл сайын қалай есеп береміз.',
    ru: 'Стратегический документ школы на несколько лет: к чему мы стремимся, чем измеряем результат и как ежегодно отчитываемся.',
    en: 'The school’s multi-year strategy: what we aim for, how we measure results and how we report every year.',
  },
  styles: ['about'],
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, { ui, S, L, href, docById }) {
    const X = (kz, ru, en) => ({ kz, ru, en });
    const pill = (kind, label, ic) => `<span class="ab-pill ab-pill--${kind}">${ic ? ui.icon(ic, { size: 14 }) : ''}${L(label)}</span>`;
    const wait = pill('wait', X('Нақтылануда', 'Уточняется', 'To be confirmed'), 'hourglass');

    // ---------------------------------------------------------------- what & why
    const why = ui.split({
      ratio: '3:2', align: 'start',
      left: `<div class="prose">${L(X(
        `<p>Даму жоспары мектептің қазіргі жағдайын талдауға сүйеніп, бірнеше жылға арналған мақсаттарды, оларға жету жолдарын және нәтижені өлшейтін <strong>мақсатты индикаторларды</strong> белгілейді.</p>
<p>Мемлекеттік аттестаттауда № 114-НҚ бұйрықтың 4-өлшемшарты бойынша <em>«МЖМБС талаптарына сәйкес білім сапасын қамтамасыз етуге және оқыту нәтижелеріне қол жеткізуге бағытталған білім беру ұйымын дамыту жоспарының болуы және іске асырылуы»</em> бағаланады.</p>
<p>Қамқоршылық кеңес мектепті дамытудың басым бағыттарын келіседі (№ 355 бұйрық, 2-қосымша, 14-т. 1) тармақша).</p>`,
        `<p>План развития опирается на анализ текущего состояния школы и определяет цели на несколько лет, пути их достижения и <strong>целевые индикаторы</strong>, по которым измеряется результат.</p>
<p>При государственной аттестации по критерию 4 приказа № 114-НҚ оценивается <em>«наличие и реализация плана развития организации образования, направленного на обеспечение качества образования и достижение результатов обучения в соответствии с требованиями ГОСО»</em>.</p>
<p>Попечительский совет согласовывает приоритетные направления развития школы (приказ № 355, приложение 2, п. 14 пп. 1).</p>`,
        `<p>The development plan builds on an analysis of the school’s current state and sets goals for several years, the steps to reach them and the <strong>target indicators</strong> used to measure progress.</p>
<p>In the state attestation, criterion 4 of Order No. 114-NK assesses <em>“the existence and implementation of a development plan aimed at ensuring the quality of education and achieving learning outcomes in line with the state education standards”</em>.</p>
<p>The Board of Trustees agrees the school’s development priorities (Order No. 355, Annex 2, para. 14(1)).</p>`))}</div>
${ui.linkList([
        { href: ADILET('V2600038645', lang), icon: 'scale', label: X('№ 114-НҚ бұйрық, 2-қосымша, 4-өлшемшарт', 'Приказ № 114-НҚ, приложение 2, критерий 4', 'Order No. 114-NK, Annex 2, criterion 4') },
        { href: ADILET('V1700015584', lang), icon: 'scale', label: X('№ 355 бұйрық (Қамқоршылық кеңес)', 'Приказ № 355 (попечительский совет)', 'Order No. 355 (Board of Trustees)') },
      ])}`,
      right: `<p class="ab-kicker">${L(X('4-өлшемшарт · бағалау шкаласы', 'Критерий 4 · шкала оценки', 'Criterion 4 · scoring scale'))}</p>
<ol class="ab-ladder" reversed>${[
        ['s5', 5, X('жоспар бекітілген; өзекті; оқу нәтижелерімен және МЖМБС талаптарымен байланысты мақсатты индикаторларды қамтиды; іске асыру нәтижелері расталған', 'план утверждён; актуален; содержит целевые индикаторы, связанные с результатами обучения и ГОСО; результаты реализации подтверждены', 'approved, current, with indicators tied to learning outcomes and the standards; results evidenced')],
        ['s4', 4, X('жоспар бар және іске асырылуда; көрсеткіштер ішінара қол жеткізілген', 'план имеется и реализуется; показатели частично достигнуты', 'plan exists and is being implemented; indicators partly met')],
        ['s3', 3, X('жоспар формалды; жүйелі іске асыру жоқ немесе нәтиже расталмаған', 'план формален; нет системной реализации или достижение не подтверждено', 'formal plan; no systematic implementation or unproven results')],
        ['s2', 2, X('жоспар жоқ немесе іске асырылмайды', 'план отсутствует либо не реализуется', 'no plan, or it is not implemented')],
      ].map(([c, n, txt]) => `<li class="${c}"><span class="ab-ladder__score" aria-hidden="true">${n}</span><div><p class="ab-ladder__lvl">${n} ${L(X('балл', n === 5 ? 'баллов' : 'балла', 'points'))}</p><p class="ab-ladder__txt">${L(txt)}</p></div></li>`).join('')}</ol>`,
    });

    // ---------------------------------------------------------------- the plan document
    const plan = ui.split({
      ratio: '1:1', align: 'start',
      left: ui.facts([
        { k: X('Жоспар кезеңі', 'Период плана', 'Plan period'), v: wait },
        { k: X('Бекітілген күні және бұйрық', 'Дата и приказ об утверждении', 'Approval date and order'), v: wait },
        { k: X('Қамқоршылық кеңеспен келісу', 'Согласование с попечительским советом', 'Agreed with the Board of Trustees'), v: wait },
        { k: X('Жауапты', 'Ответственный', 'Responsible'), v: `${L(X('Директор', 'Директор', 'Director'))} — ${L(S.legal.director.name)}` },
        { k: X('Соңғы есеп', 'Последний отчёт', 'Latest report'), v: wait },
      ]),
      right: `${ui.docList([docById('development-plan')].filter(Boolean))}
${ui.pending({ title: X('Жарияланатын мәліметтер', 'Что будет опубликовано', 'To be published'), note: X('Бекітілген даму жоспары (PDF, қол қойылған және мөрмен), оның кезеңі, бекіту туралы бұйрықтың нөмірі мен күні және Қамқоршылық кеңестің келісу хаттамасы.', 'Утверждённый план развития (PDF, с подписью и печатью), период, номер и дата приказа об утверждении и протокол согласования попечительским советом.', 'The approved development plan (signed and stamped PDF), its period, the approval order number and date, and the Board of Trustees’ minutes agreeing it.') })}`,
    });

    // ---------------------------------------------------------------- recommended structure
    const structure = `${ui.cards([
      { icon: 'search', tag: '01', title: X('Ағымдағы жағдайды талдау', 'Анализ текущего состояния', 'Current-state analysis'), text: X('Контингент, кадрлар, оқу нәтижелері, материалдық-техникалық база; күшті және әлсіз жақтар.', 'Контингент, кадры, результаты обучения, материально-техническая база; сильные и слабые стороны.', 'Pupils, staff, learning outcomes, facilities; strengths and weaknesses.') },
      { icon: 'compass', tag: '02', title: X('Миссия, пайым, мақсаттар', 'Миссия, видение, цели', 'Mission, vision, goals'), text: X('Бекітілген миссия мен пайымнан туындайтын стратегиялық мақсаттар.', 'Стратегические цели, вытекающие из утверждённой миссии и видения.', 'Strategic goals derived from the approved mission and vision.') },
      { icon: 'target', tag: '03', title: X('Мақсатты индикаторлар', 'Целевые индикаторы', 'Target indicators'), text: X('Оқу нәтижелерімен және МЖМБС талаптарымен байланысқан, базалық және мақсатты мәндері бар көрсеткіштер.', 'Показатели с базовыми и целевыми значениями, связанные с результатами обучения и ГОСО.', 'Measures with baseline and target values linked to learning outcomes and the standards.') },
      { icon: 'calendar', tag: '04', title: X('Іс-шаралар жоспары', 'План мероприятий', 'Action plan'), text: X('Әр мақсат бойынша іс-шаралар, мерзімдер және жауапты тұлғалар.', 'Мероприятия по каждой цели, сроки и ответственные.', 'Actions for each goal, deadlines and owners.') },
      { icon: 'coins', tag: '05', title: X('Ресурстар', 'Ресурсы', 'Resources'), text: X('Кадрлық, материалдық және қаржылық ресурстар.', 'Кадровые, материальные и финансовые ресурсы.', 'Staffing, material and financial resources.') },
      { icon: 'check', tag: '06', title: X('Мониторинг және есеп', 'Мониторинг и отчётность', 'Monitoring and reporting'), text: X('Индикаторларды жыл сайын өлшеу, жылдық есепті сайтта жариялау.', 'Ежегодное измерение индикаторов, публикация годового отчёта на сайте.', 'Measuring indicators every year and publishing an annual report online.') },
    ], { cols: 3 })}
${ui.note(X('Бұл — ұсынылатын құрылым (тәжірибе), заңмен бекітілген нысан емес.', 'Это рекомендуемая структура (практика), а не утверждённая законом форма.', 'This is a recommended structure (common practice), not a form prescribed by law.'))}`;

    // ---------------------------------------------------------------- indicators linked to attestation
    const indicators = ui.table({
      caption: X('Аттестаттау өлшемшарттарымен байланысты индикаторлар', 'Индикаторы, связанные с критериями аттестации', 'Indicators linked to attestation criteria'),
      head: [X('Индикатор', 'Индикатор', 'Indicator'), X('Өлшемшарт', 'Критерий', 'Criterion'), X('5 балл шегі (№ 114-НҚ)', 'Порог 5 баллов (№ 114-НҚ)', '5-point threshold (No. 114-NK)'), X('Базалық мән', 'Базовое значение', 'Baseline'), X('Мақсатты мән', 'Целевое значение', 'Target')],
      rows: [
        [X('Бейіні бойынша педагогикалық білімі бар педагогтер үлесі', 'Доля педагогов с педагогическим образованием по профилю', 'Teachers with a subject-relevant teaching qualification'), '5', '100%', wait, wait],
        [X('Педагог-сарапшы, зерттеуші, шебер санаты бар педагогтер үлесі', 'Доля педагогов-экспертов, исследователей, мастеров', 'Share of expert, researcher and master teachers'), '6', X('толық жинақты: бастауыш &gt;&nbsp;45%, негізгі және жалпы орта &gt;&nbsp;55%<br>шағын жинақты: бастауыш &gt;&nbsp;30%, негізгі және жалпы орта &gt;&nbsp;35%', 'полнокомплектная: начальное &gt;&nbsp;45%, основное и общее среднее &gt;&nbsp;55%<br>малокомплектная: начальное &gt;&nbsp;30%, основное и общее среднее &gt;&nbsp;35%', 'full-size school: primary &gt;&nbsp;45%, secondary &gt;&nbsp;55%<br>small school: primary &gt;&nbsp;30%, secondary &gt;&nbsp;35%'), wait, wait],
        [X('3 жылда кемінде бір рет біліктілігін арттырған педагогтер', 'Педагоги, повысившие квалификацию не реже раза в 3 года', 'Teachers trained at least once in 3 years'), '7', '100%', wait, wait],
        [X('4-сынып компьютерлік тестілеуіндегі оң жауаптар үлесі', 'Доля положительных ответов на КТ в 4 классе', 'Correct answers in the grade-4 computer test'), '39', '85–100%', wait, wait],
        [X('edu.kz аймағындағы ресми сайт, өзекті ақпарат', 'Официальный сайт в зоне edu.kz, актуальная информация', 'Official site on edu.kz with current information'), '38', X('жұмыс істейді, ақпарат өзекті', 'функционирует, информация актуальна', 'live and up to date'), wait, wait],
      ],
    });
    const indNote = ui.note(X(
      '5 балл шектері № 114-НҚ бұйрықтың 2-қосымшасынан алынды (6-өлшемшарт бойынша толық жинақты және шағын жинақты мектептерге әртүрлі шектер белгіленген; мектептің санаты нақтылануда). Мектептің базалық және мақсатты мәндері жоспар бекітілгеннен кейін толтырылады.',
      'Пороги 5 баллов взяты из приложения 2 к приказу № 114-НҚ (по критерию 6 для полнокомплектных и малокомплектных школ установлены разные пороги; категория школы уточняется). Базовые и целевые значения школы будут заполнены после утверждения плана.',
      'The 5-point thresholds come from Annex 2 to Order No. 114-NK (criterion 6 sets different thresholds for full-size and small schools; the school’s category is being confirmed). The school’s baseline and target values will be added once the plan is approved.'));

    // ---------------------------------------------------------------- cycle
    const cycle = `<ol class="ab-cycle">${[
      [X('Талдау', 'Анализ', 'Analyse'), X('Өзін-өзі бағалау нәтижелері мен деректер негізінде қазіргі жағдайды бағалау.', 'Оценка текущего состояния по данным самооценки.', 'Assess the current state using self-assessment data.')],
      [X('Бекіту', 'Утверждение', 'Approve'), X('Жоспарды бекіту және басым бағыттарды Қамқоршылық кеңеспен келісу.', 'Утверждение плана и согласование приоритетов с попечительским советом.', 'Approve the plan and agree priorities with the Board of Trustees.')],
      [X('Іске асыру', 'Реализация', 'Implement'), X('Іс-шараларды орындау, индикаторларды тұрақты бақылау.', 'Выполнение мероприятий, регулярный мониторинг индикаторов.', 'Carry out actions and monitor indicators regularly.')],
      [X('Есеп беру', 'Отчёт', 'Report'), X('Жылдық есепті сайтта жариялау және жоспарды түзету.', 'Публикация годового отчёта на сайте и корректировка плана.', 'Publish the annual report online and adjust the plan.')],
    ].map(([t, d]) => `<li><p class="ab-cycle__t">${L(t)}</p><p class="ab-cycle__d">${L(d)}</p></li>`).join('')}</ol>`;

    // ---------------------------------------------------------------- reports
    const reports = ui.docList([
      docById('development-report-2024-2025'),
      docById('development-report-2025-2026'),
      docById('development-monitoring-2026-2027'),
    ]);
    const reportsNote = ui.note(X(
      'Өзін-өзі бағалау алдыңғы екі оқу жылы мен ағымдағы оқу жылын қамтиды (№ 114-НҚ, 15-т.), сондықтан сайтта осы кезеңдердің есептері орналастырылады.',
      'Самооценка охватывает два предыдущих учебных года и текущий (приказ № 114-НҚ, п. 15), поэтому на сайте размещаются отчёты за эти периоды.',
      'Self-assessment covers the two previous school years and the current one (Order No. 114-NK, para. 15), so reports for these periods are published here.'));

    const related = ui.linkList([
      { href: href('self-assessment'), icon: 'check', label: X('Өзін-өзі бағалау', 'Самооценка', 'Self-assessment'), note: X('8 бағыт, 39 өлшемшарт', '8 направлений, 39 критериев', '8 areas, 39 criteria') },
      { href: href('board'), icon: 'handshake', label: X('Қамқоршылық кеңес', 'Попечительский совет', 'Board of Trustees') },
      { href: href('structure'), icon: 'sitemap', label: X('Басқару құрылымы', 'Структура управления', 'Governance structure') },
      { href: href('about'), icon: 'school', label: X('Мектеп туралы', 'О школе', 'About the school'), note: X('Миссия және тарих', 'Миссия и история', 'Mission and history') },
    ]);
    const toc = ui.toc([
      { id: 'purpose', label: X('Жоспар не үшін керек', 'Зачем нужен план', 'Why a plan') },
      { id: 'plan', label: X('Бекітілген жоспар', 'Утверждённый план', 'Approved plan') },
      { id: 'contents', label: X('Жоспардың құрылымы', 'Структура плана', 'Plan structure') },
      { id: 'indicators', label: X('Мақсатты индикаторлар', 'Целевые индикаторы', 'Target indicators') },
      { id: 'cycle', label: X('Іске асыру циклі', 'Цикл реализации', 'Implementation cycle') },
      { id: 'reports', label: X('Жылдық есептер', 'Годовые отчёты', 'Annual reports') },
    ]);
    const intro = ui.split({
      ratio: '2:1', align: 'start', cls: 'ab-intro',
      left: `${ui.eyebrow(X('Стратегия', 'Стратегия', 'Strategy'))}
<p class="lead">${L(X('Даму жоспары мектептің қайда бара жатқанын және табысты немен өлшейтінін көрсетеді. Жоспар мен оның орындалуы туралы есептер ата-аналар мен комиссия үшін ашық жарияланады.', 'План развития показывает, куда движется школа и чем она измеряет успех. План и отчёты о его выполнении открыто публикуются для родителей и комиссии.', 'The development plan shows where the school is heading and how it measures success. The plan and progress reports are published openly for parents and the attestation commission.'))}</p>
${ui.pending({ title: X('Жоспар жүктелуде', 'План загружается', 'Plan being uploaded'), note: X('Мектептің бекітілген даму жоспары мен есептері осы бетте жарияланады.', 'Утверждённый план развития школы и отчёты будут опубликованы на этой странице.', 'The school’s approved development plan and reports will be published on this page.') })}`,
      right: toc,
    });

    return [
      intro,
      ui.section({ id: 'purpose', eyebrow: X('Заң не талап етеді', 'Что требует закон', 'What the law requires'), title: X('Жоспар не үшін керек', 'Зачем нужен план развития', 'Why a development plan'), body: why }),
      ui.section({ id: 'plan', tone: 'card', eyebrow: X('Құжат', 'Документ', 'Document'), title: X('Бекітілген даму жоспары', 'Утверждённый план развития', 'Approved development plan'), body: plan }),
      ui.section({ id: 'contents', eyebrow: X('Не кіреді', 'Что входит', 'What’s inside'), title: X('Жоспардың құрылымы', 'Структура плана', 'Structure of the plan'), body: structure }),
      ui.section({ id: 'indicators', eyebrow: X('Нәтижені өлшеу', 'Измерение результата', 'Measuring results'), title: X('Мақсатты индикаторлар', 'Целевые индикаторы', 'Target indicators'), body: indicators + indNote }),
      ui.section({ id: 'cycle', tone: 'hero', eyebrow: X('Жыл сайын', 'Каждый год', 'Every year'), title: X('Іске асыру циклі', 'Цикл реализации', 'Implementation cycle'), body: cycle }),
      ui.section({ id: 'reports', eyebrow: X('Есептілік', 'Отчётность', 'Reporting'), title: X('Орындалуы туралы жылдық есептер', 'Годовые отчёты о выполнении', 'Annual progress reports'), body: reports + reportsNote }),
      ui.section({ title: X('Осы бөлімде', 'В этом разделе', 'In this section'), body: related }),
    ].join('\n');
  },
};
