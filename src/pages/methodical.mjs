// Education group — Methodological work & internal quality control (ORDER-114 §F items 48, 52).
// Rules of methodological work: order №253 (10.08.2023, ed. 15.04.2025); internal control plan: order №130
// (06.04.2020, ed. 30.04.2025) — plan structure from its form; texts read 24.09.2026. School plans → pending.
import { actItems, actRef, checkedNote } from './curriculum.mjs';

const X = (kz, ru, en) => ({ kz, ru, en });

export default {
  slug: 'methodical',
  group: 'education',
  order: 40,
  title: X('Әдістемелік жұмыс', 'Методическая работа', 'Methodological work'),
  description: X(
    'Әдістемелік кеңес пен әдістемелік бірлестіктер (№ 253 қағидалар), мектепішілік бақылау жоспары (№ 130 бұйрық), талдамалық анықтамалар және басқару шешімдері.',
    'Методический совет и методобъединения (правила № 253), план внутришкольного контроля (приказ № 130), аналитические справки и управленческие решения.',
    'Methodological council and subject teams (rules No. 253), internal quality-control plan (Order No. 130), analytical reports and management decisions.',
  ),
  styles: ['education'],
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, { ui, L, href, docById }) {
    const ref = (id, label) => actRef(ui, id, lang, label);

    // ------------------------------------------------------------ intro
    const intro = ui.split({
      ratio: '2:1', align: 'center',
      left: `${ui.eyebrow(X('Мұғалімге қолдау', 'Поддержка учителя', 'Supporting teachers'))}
<h2 class="sec__title">${L(X('Жақсы сабақ — ортақ жұмыстың нәтижесі', 'Хороший урок — результат общей работы', 'A good lesson is teamwork'))}</h2>
${ui.lead(X(
        'Әдістемелік жұмыс мұғалімдерге сабақты жоспарлауға, тәжірибе алмасуға, бағалау тапсырмаларын талқылауға және біліктілігін арттыруға көмектеседі. Мектепішілік бақылау оқу процесінің сапасын жүйелі түрде тексеріп, нақты шешімдер қабылдауға мүмкіндік береді.',
        'Методическая работа помогает учителям планировать уроки, обмениваться опытом, обсуждать задания для оценивания и повышать квалификацию. Внутришкольный контроль позволяет системно проверять качество учебного процесса и принимать конкретные решения.',
        'Methodological work helps teachers plan lessons, share practice, review assessment tasks and grow professionally. Internal quality control checks the learning process systematically and leads to concrete decisions.'))}`,
      right: '<!--toc-->',
    });

    // ------------------------------------------------------------ structure
    const structure = ui.cards([
      { icon: 'sitemap', title: X('Әдістемелік кеңес', 'Методический совет', 'Methodological council'), text: X('Әдістемелік бірлестіктердің жұмысын басқарады және үйлестіреді; мазмұны бойынша педагогикалық кеңестің жұмысын қайталамайды (31-т.).', 'Руководит и координирует работу методобъединений; по содержанию не дублирует педагогический совет (п. 31).', 'Leads and coordinates the subject teams without duplicating the pedagogical council (para. 31).') },
      { icon: 'users', tag: X('≥ 3 педагог', '≥ 3 педагога', '≥ 3 teachers'), title: X('Әдістемелік бірлестіктер (ӘБ)', 'Методические объединения (МО)', 'Subject teams'), text: X('Пән мұғалімдерінің, бастауыш сынып мұғалімдерінің, сынып жетекшілерінің кәсіби бірлестіктері; бір пәннің кемінде 3 педагогі болғанда құрылады. Жетекшісі тәжірибелі педагогтер арасынан сайланады (тағайындалады) (21, 23, 29-т.).', 'Профессиональные объединения учителей-предметников, учителей начальных классов, классных руководителей; создаются при наличии не менее 3 педагогов одного предмета. Руководитель избирается (назначается) из опытных педагогов (пп. 21, 23, 29).', 'Professional teams of subject teachers, primary teachers and class teachers, formed when there are at least 3 teachers of a subject, led by an experienced teacher (paras 21, 23, 29).') },
      { icon: 'user', title: X('Оқу ісі жөніндегі орынбасар', 'Заместитель по учебной работе', 'Deputy head for teaching'), text: X('Мектептің оқу-әдістемелік жұмысына тікелей басшылық жасайды (25-т.).', 'Осуществляет непосредственное руководство учебно-методической работой школы (п. 25).', 'Directly manages the school’s methodological work (para. 25).') },
    ], { cols: 3 });
    const tasks = ui.chips([
      X('Әдістемелік бірлестіктер', 'Методические объединения', 'Subject teams'), X('Шеберлік сыныптары', 'Мастер-классы', 'Master classes'), X('Озық тәжірибе мектептері', 'Школы передового опыта', 'Best-practice schools'),
      X('Тәжірибе алаңдары', 'Экспериментальные площадки', 'Pilot sites'), X('Кейстер', 'Кейсы', 'Cases'), X('Шығармашылық зертханалар', 'Творческие лаборатории', 'Creative labs'),
      X('Семинарлар мен конференциялар', 'Семинары и конференции', 'Seminars & conferences'), X('Креативті сессиялар', 'Креативные сессии', 'Creative sessions'), X('Әдістемелік консилиумдар', 'Методические консилиумы', 'Methodological consilia'), X('Тағылымдамалар', 'Методические стажировки', 'Internships'),
    ].map((l) => ({ label: l })));
    const docsFlow = ui.steps([
      { title: X('Жылдық жоспар', 'Годовой план', 'Annual plan'), text: X('ӘБ жұмыс жоспары бір жылға жасалады, оны директор бекітеді (28-т.).', 'План работы МО составляется на год и утверждается директором (п. 28).', 'Each team’s plan is drawn up for the year and approved by the director (para. 28).') },
      { title: X('КТЖ', 'КТП', 'Lesson plans'), text: X('Күнтізбелік-тақырыптық жоспарлар ӘБ отырысында қаралып, директор бекітеді (26-т.).', 'Календарно-тематические планы рассматриваются на заседании МО и утверждаются директором (п. 26).', 'Calendar-thematic plans are reviewed by the team and approved by the director (para. 26).') },
      { title: X('ТЖБ тапсырмалары', 'Задания СОч', 'Term-test tasks'), text: X('ТЖБ алдында тапсырмалардың оқу мақсаттарына сәйкестігі, көлемі мен уақыты ӘБ-де талқыланады (№ 125 қағидалар, 21-т.).', 'Перед СОч на МО обсуждается соответствие заданий целям обучения, объём и время (правила № 125, п. 21).', 'Before term tests the team checks tasks against objectives, volume and time (rules No. 125, para. 21).') },
      { title: X('Құжаттарды мақұлдау', 'Одобрение документов', 'Approving materials'), text: X('Әкімшілік пен педагогтер әзірлеген оқу-әдістемелік құжаттама ӘБ немесе әдістемелік кеңесте талқыланады (27-т.).', 'Учебно-методическая документация обсуждается на МО или методсовете и затем утверждается (п. 27).', 'Teaching materials are discussed by the team or council before approval (para. 27).') },
    ]);
    const structPending = ui.pending(lang, X(
      '«Керемет» мектебінің әдістемелік кеңесінің құрамы, ашылған әдістемелік бірлестіктер (мысалы, бастауыш сынып мұғалімдері, сынып жетекшілері) және олардың жетекшілері, 2026–2027 оқу жылының әдістемелік тақырыбы.',
      'Состав методического совета школы «Керемет», созданные методобъединения (например, учителей начальных классов, классных руководителей) и их руководители, методическая тема на 2026–2027 учебный год.',
      'Membership of Keremet’s methodological council, its subject teams (e.g. primary teachers, class teachers) and their leaders, and the methodological theme for 2026–2027.',
    ));
    const methodDocs = ui.docList([
      docById('method-council'),
      docById('method-plan'),
      docById('method-teams-plans'),
      docById('method-council-minutes'),
    ].filter(Boolean));

    // ------------------------------------------------------------ internal control (130)
    const cycle = `<ol class="edu-cycle">${[
      [X('Жоспар', 'План', 'Plan'), X('директор оқу жылы басталғанға дейін бекітеді', 'утверждается директором до начала учебного года', 'approved by the director before the school year')],
      [X('Бақылау', 'Контроль', 'Review'), X('тақырып, мақсат, объект, түрі мен әдісі бойынша', 'по теме, цели, объекту, виду и методике', 'by topic, goal, object, type and method')],
      [X('Талдау', 'Анализ', 'Analysis'), X('талдамалық анықтама, қаралатын орны', 'аналитическая справка, место рассмотрения', 'analytical report and where it is discussed')],
      [X('Шешім', 'Решение', 'Decision'), X('басқару шешімі: бұйрық, кеңес шешімі', 'управленческое решение: приказ, решение совета', 'management decision: order or council decision')],
      [X('Қайта бақылау', 'Вторичный контроль', 'Follow-up'), X('шешімнің орындалуын тексеру', 'проверка исполнения решения', 'checking that the decision worked')],
    ].map(([t, s]) => `<li><b>${L(t)}</b><span>${L(s)}</span></li>`).join('')}</ol>`;
    const vshkDirs = ui.cards([
      { icon: 'doc', tag: 'I', title: X('Нормативтік құжаттардың орындалуы және мектеп құжаттамасы', 'Выполнение нормативных документов и ведение школьной документации', 'Compliance and school records') },
      { icon: 'target', tag: 'II', title: X('Оқу процесінің сапасы', 'Качество учебного процесса', 'Quality of teaching and learning') },
      { icon: 'handshake', tag: 'III', title: X('Білімдегі олқылықтарды жою, үлгерімі төмен оқушылармен жұмыс', 'Восполнение пробелов в знаниях, работа со слабоуспевающими', 'Closing gaps, supporting low achievers') },
      { icon: 'bulb', tag: 'IV', title: X('Оқу-зерттеу қызметі', 'Учебно-исследовательская деятельность', 'Research activity') },
      { icon: 'graduation', tag: 'V', title: X('Мұғалімнің шеберлігі мен әдістемелік дайындығы', 'Мастерство и методическая готовность учителя', 'Teacher mastery and readiness') },
      { icon: 'heart', tag: 'VI', title: X('Тәрбие процесінің сапасы, іс-шаралар', 'Качество воспитательного процесса, мероприятия', 'Quality of upbringing and events') },
    ], { cols: 3 });
    const vshkNote = ui.note(X(
      `Бөлімдер мен бағандар (бақылау тақырыбы, мақсаты, объектісі, түрі, әдістемесі, мерзімі, жауаптылар, қаралатын орны, басқару шешімі, қайта бақылау) — ${ref('docs130')} бекіткен нысан бойынша. Жоспарды оқу ісі жөніндегі орынбасар әзірлейді, директор бекітеді.`,
      `Разделы и графы плана (тема, цель, объект, вид контроля, методика, сроки, ответственные, место рассмотрения, управленческое решение, вторичный контроль) — по форме, утверждённой документом: ${ref('docs130')}. План разрабатывает заместитель по учебной работе, утверждает директор.`,
      `Sections and columns (topic, goal, object, type, method, deadline, responsible, where discussed, management decision, follow-up) follow the form approved by ${ref('docs130')}. The deputy head drafts the plan; the director approves it.`,
    ));
    const vshkDocs = ui.docList([
      docById('control-plan'),
      docById('control-reports'),
      docById('control-decisions'),
    ].filter(Boolean));

    // ------------------------------------------------------------ professional development
    const growth = ui.split({
      ratio: '1:1',
      left: ui.callout({ type: 'info', icon: 'graduation', title: X('Біліктілікті арттыру', 'Повышение квалификации', 'Professional development'), text: X(
        `Педагогтердің соңғы үш жылдағы курстары, санаттары және аттестаттау кестесі <a href="${href('teachers')}">Педагогтер құрамы</a> бетінде жарияланады.`,
        `Курсы педагогов за последние три года, категории и график аттестации публикуются на странице <a href="${href('teachers')}">Педагогический состав</a>.`,
        `Teachers’ courses over the last three years, categories and attestation schedule are on the <a href="${href('teachers')}">Teaching staff</a> page.`) }),
      right: ui.pending({ title: X('Ашық сабақтар мен тәжірибе алмасу', 'Открытые уроки и обмен опытом', 'Open lessons and sharing practice'), note: X('2026–2027 оқу жылындағы ашық сабақтар, шеберлік сыныптары, семинарлар кестесі және өткен іс-шаралардың қысқаша есебі.', 'График открытых уроков, мастер-классов и семинаров на 2026–2027 год и краткие отчёты о проведённых.', 'Schedule of open lessons, master classes and seminars for 2026–2027 and short reports.') }),
    });

    const related = ui.linkList([
      { href: href('structure'), icon: 'sitemap', label: X('Басқару құрылымы', 'Структура управления', 'Governance structure'), note: X('Педагогикалық, әдістемелік, әдеп кеңестері', 'Педагогический, методический, этический советы', 'Pedagogical, methodological, ethics councils') },
      { href: href('teachers'), icon: 'users', label: X('Педагогтер құрамы', 'Педагогический состав', 'Teaching staff') },
      { href: href('assessment'), icon: 'target', label: X('Бағалау және нәтижелер', 'Оценивание и результаты', 'Assessment & results') },
      { href: href('self-4'), icon: 'star', label: X('Өзін-өзі бағалау: оқу-әдістемелік жұмыс', 'Самооценка: учебно-методическая работа', 'Self-assessment: teaching and methodology') },
    ]);
    const toc = ui.toc([
      { id: 'structure', label: X('Әдістемелік қызметтің құрылымы', 'Структура методической службы', 'Structure') },
      { id: 'vshk', label: X('Мектепішілік бақылау', 'Внутришкольный контроль', 'Internal quality control') },
      { id: 'growth', label: X('Кәсіби даму', 'Профессиональное развитие', 'Professional growth') },
      { id: 'acts', label: X('Құқықтық негіз', 'Правовая основа', 'Legal basis') },
    ]);

    return [
      intro.replace('<!--toc-->', toc),
      ui.section({ id: 'structure', eyebrow: X('№ 253 қағидалар', 'Правила № 253', 'Rules No. 253'), title: X('Әдістемелік қызметтің құрылымы', 'Структура методической службы', 'How methodological work is organised'), body: structure + structPending }),
      ui.section({ eyebrow: X('Ұжымдық әдістемелік жұмыс нысандары', 'Формы коллективной методической работы', 'Forms of collective work'), title: X('Мұғалімдер қалай бірге жұмыс істейді', 'Как учителя работают вместе', 'How teachers work together'), body: tasks + docsFlow + `<h3>${L(X('Құжаттар', 'Документы', 'Documents'))}</h3>` + methodDocs }),
      ui.section({ id: 'vshk', tone: 'physics', eyebrow: X('№ 130 бұйрық', 'Приказ № 130', 'Order No. 130'), title: X('Мектепішілік бақылау', 'Внутришкольный контроль', 'Internal quality control'), lead: X('Бақылаудың бес қадамдық циклі және жоспардың алты бағыты.', 'Пятишаговый цикл контроля и шесть разделов плана.', 'A five-step review cycle and the six sections of the plan.'), body: cycle + vshkDirs + vshkNote }),
      ui.section({ title: X('Мектепішілік бақылау құжаттары', 'Документы внутришкольного контроля', 'Internal control documents'), body: vshkDocs }),
      ui.section({ id: 'growth', eyebrow: X('Кәсіби даму', 'Профессиональное развитие', 'Professional growth'), title: X('Біліктілік және тәжірибе алмасу', 'Квалификация и обмен опытом', 'Qualifications and sharing practice'), body: growth }),
      ui.section({ id: 'acts', eyebrow: 'adilet.zan.kz', title: X('Құқықтық негіз', 'Правовая основа', 'Legal basis'), body: ui.linkList(actItems(['method', 'docs130', 'assess', 'attest'], lang)) + ui.note(checkedNote) }),
      ui.section({ title: X('Осы бөлімде', 'В этом разделе', 'In this section'), body: related }),
    ].join('\n');
  },
};
