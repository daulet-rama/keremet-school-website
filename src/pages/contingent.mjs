// Contingent — ORDER-114 item 39 (criteria 8–9): classes and pupils by level, class sizes, group division,
// free places, graduates. Only the grade range 0–6 is known (school's Instagram bio, unconfirmed): all
// numbers are pending (S.contingent is null).
// Group division: ГОСО (order No. 348 of 03.08.2022, V2200029031, ред. 26.06.2026) — primary standard p. 30,
// basic secondary standard pp. 43–44; inclusive — p. 31 / p. 45. Class overcrowding: sanitary rules ҚР ДСМ-76, app. 2.
export default {
  slug: 'contingent',
  group: 'admission',
  order: 20,
  styles: ['staff-admission'],
  title: { kz: 'Білім алушылар контингенті', ru: 'Контингент обучающихся', en: 'Student numbers' },
  description: {
    kz: '«Керемет» мектебінің контингенті: деңгейлер бойынша сынып-жинақтар мен оқушылар саны, толымдылық, бос орындар және түлектер.',
    ru: 'Контингент школы «Керемет»: классы-комплекты и учащиеся по уровням, наполняемость, свободные места и выпускники.',
    en: 'Keremet School student numbers: classes and pupils by level, class sizes, free places and graduates.',
  },
  lead: {
    kz: 'Мектепте қанша сынып пен оқушы бар, сыныптар қаншалықты толы және бос орын бар ма — бәрі бір кестеде.',
    ru: 'Сколько в школе классов и учеников, насколько заполнены классы и есть ли свободные места — всё в одной таблице.',
    en: 'How many classes and pupils the school has, how full the classes are and whether there are free places — all in one table.',
  },
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, { ui, S, L, t, href }) {
    const X = (kz, ru, en) => ({ kz, ru, en });
    const dash = `<span class="sa-ph sa-ph--s" aria-hidden="true"></span><span class="sr-only">${L(X('толықтырылуда', 'обновляется', 'being updated'))}</span>`;
    const year = X('2026–2027 оқу жылы', '2026–2027 учебный год', 'School year 2026–2027');
    const adl = (code) => `https://adilet.zan.kz/${lang === 'kz' ? 'kaz' : 'rus'}/docs/${code}`;
    const GOSO = adl('V2200029031');
    const TUP = adl('V1200008170');
    const A114 = adl('V2600038645');
    const SAN = adl('V2100023890');
    const R564 = adl('V1800017553');
    const ifLic = X('лицензия бойынша, қажет болса', 'по лицензии, если применимо', 'per licence, if applicable');

    const stats = ui.stats([
      { icon: 'graduation', art: true, value: `${S.grades.from}–${S.grades.to}`, label: X('Сыныптар', 'Классы', 'Grades'),
        note: X('Мектептің Instagram парақшасындағы «0–6 сыныптарға арналған мектеп» деген мәлімет бойынша; нақтылануда.', 'По данным профиля школы в Instagram («школа для 0–6 классов»); уточняется.', 'Per the school’s Instagram profile (“a school for grades 0–6”); being confirmed.'),
        extra: ui.chips([{ icon: 'languages', label: X('қазақ тілінде', 'на казахском', 'in Kazakh') }, { icon: 'languages', label: X('орыс тілінде', 'на русском', 'in Russian') }]) },
      { icon: 'users', value: '—', label: X('Оқушылар саны', 'Всего учащихся', 'Pupils in total'), note: X('толықтырылуда', 'обновляется', 'being updated') },
      { icon: 'grid', value: '—', label: X('Сынып-жинақтар', 'Классов-комплектов', 'Classes'), note: X('толықтырылуда', 'обновляется', 'being updated') },
      { icon: 'school', value: '—', label: X('Орташа толымдылық', 'Средняя наполняемость', 'Average class size'), note: X('толықтырылуда', 'обновляется', 'being updated') },
      { icon: 'plus', value: '—', label: X('Бос орындар', 'Свободные места', 'Free places'), note: X('толықтырылуда', 'обновляется', 'being updated') },
    ], { cls: 'stats--bento sa-keystats' });

    const lvl = (name, grades, note) => `<div class="sa-level"><p class="sa-level__name">${L(name)}</p><ul class="sa-level__grades" role="list">${grades.map((g) => `<li class="sa-grade"><span>${g}</span><span class="sr-only">${L(X('-сынып', ' класс', ' (grade)'))}</span></li>`).join('')}</ul><p class="sa-level__note">${L(note)}</p></div>`;
    const ladder = `<div class="sa-ladder">
${lvl(X('Мектепалды даярлық', 'Предшкольная подготовка', 'Pre-school'), [0], X('0-сынып', '0 класс', 'grade 0'))}
${lvl(X('Бастауыш білім беру', 'Начальное образование', 'Primary education'), [1, 2, 3, 4], X('1–4-сыныптар', '1–4 классы', 'grades 1–4'))}
${lvl(X('Негізгі орта білім беру', 'Основное среднее образование', 'Lower secondary'), [5, 6], X('5–6-сыныптар (деңгей 5–9-сыныптарды қамтиды)', '5–6 классы (уровень охватывает 5–9 классы)', 'grades 5–6 (the level spans grades 5–9)'))}
</div>`;
    const ladderNote = ui.more({ label: X('Сынып аралығы мен лицензия', 'Диапазон классов и лицензия', 'Grade range and licence'), icon: 'info', body: ui.note(X(
      `Сынып аралығы мектептің өз мәлімдемесі бойынша көрсетілген және нақтылануда. Лицензия (№ ${S.licence.current.number}) бастауыш, негізгі орта және жалпы орта білім беруді қамтиды — <a href="${href('license')}">лицензия</a>.`,
      `Диапазон классов указан по заявлению самой школы и уточняется. Лицензия (№ ${S.licence.current.number}) охватывает начальное, основное среднее и общее среднее образование — <a href="${href('license')}">лицензия</a>.`,
      `The grade range is as stated by the school and is being confirmed. The licence (No. ${S.licence.current.number}) covers primary, lower and upper secondary education — see the <a href="${href('license')}">licence</a>.`,
    )) });

    const head = [
      X('Деңгей / сынып', 'Уровень / класс', 'Level / grade'),
      X('Сынып-жинақтар', 'Классы-комплекты', 'Classes'),
      X('Оқушылар', 'Учащиеся', 'Pupils'),
      X('қазақ тілінде', 'на казахском', 'in Kazakh'),
      X('орыс тілінде', 'на русском', 'in Russian'),
      X('Орташа толымдылық', 'Средняя наполняемость', 'Avg. class size'),
      X('Бос орындар', 'Свободные места', 'Free places'),
    ];
    const row = (label) => [label, dash, dash, dash, dash, dash, dash];
    const table = ui.table({
      cls: 'sa-tbl',
      caption: X('Сыныптар мен оқушылар саны, 2026–2027 оқу жылы', 'Классы и учащиеся, 2026–2027 учебный год', 'Classes and pupils, school year 2026–2027'),
      head, numeric: [1, 2, 3, 4, 5, 6],
      rows: [
        row(X('Мектепалды даярлық (0)', 'Предшкольная подготовка (0)', 'Pre-school (0)')),
        row(X('Бастауыш (1–4)', 'Начальное (1–4)', 'Primary (1–4)')),
        row(`${L(X('Негізгі орта (5–9)', 'Основное среднее (5–9)', 'Lower secondary (5–9)'))}<span class="sa-cellnote">${L(X('қазір 5–6-сыныптар, нақтылануда', 'сейчас 5–6 классы, уточняется', 'currently grades 5–6, being confirmed'))}</span>`),
        row(`${L(X('Жалпы орта (10–11)', 'Общее среднее (10–11)', 'Upper secondary (10–11)'))}<span class="sa-cellnote">${L(ifLic)}</span>`),
        row(`<strong>${L(X('Барлығы', 'Итого', 'Total'))}</strong>`),
      ],
    });
    const tablePending = ui.pending({
      title: X('Контингент туралы деректер толықтырылуда', 'Данные о контингенте готовятся', 'Student data are being prepared'),
      note: X(
        'Мектеп 2026 жылғы 1 қыркүйектегі жағдай бойынша сыныптар, оқушылар, толымдылық және бос орындар санын ұсынғаннан кейін кесте толтырылады. Деректер жыл сайын 1 қыркүйекке дейін жаңартылады.',
        'Таблица будет заполнена после того, как школа предоставит число классов, учащихся, наполняемость и свободные места по состоянию на 1 сентября 2026 года. Данные обновляются ежегодно к 1 сентября.',
        'The table will be filled in once the school provides the numbers of classes, pupils, class sizes and free places as of 1 September 2026. The data are refreshed every year by 1 September.',
      ),
    });

    const indicatorItems = [
      { icon: 'grid', title: X('Сынып-жинақ', 'Класс-комплект', 'Class'), text: X('Бір сыныпта бірге оқитын оқушылар тобы. Әр деңгей бойынша және оқыту тілі бойынша бөлек көрсетіледі.', 'Группа учащихся, обучающихся вместе в одном классе. Указывается по уровням и языкам обучения.', 'A group of pupils studying together. Shown by level and language of instruction.') },
      { icon: 'users', title: X('Толымдылық', 'Наполняемость', 'Class size'), text: X('Бір сыныптағы оқушылардың орташа саны. Санитариялық қағидалар мен нормативтерге сәйкес келуі тиіс.', 'Среднее число учащихся в классе. Должно соответствовать санитарным правилам и нормативам.', 'Average number of pupils per class. It must meet sanitary rules and standards.') },
      { icon: 'languages', title: X('Топтарға бөлу', 'Деление на группы', 'Splitting into groups'), text: X('Жекелеген пәндер (тілдер, цифрлық сауаттылық, информатика) бойынша сыныпты екі топқа бөлу МЖМБС бойынша жүргізіледі — <a href="#groups">жоғарыдағы кесте</a>.', 'Деление класса на две группы по отдельным предметам (языки, цифровая грамотность, информатика) проводится по ГОСО — <a href="#groups">таблица выше</a>.', 'Some subjects (languages, digital literacy, computing) are split into two groups under the state standard — <a href="#groups">see the table above</a>.') },
      { icon: 'plus', title: X('Бос орындар', 'Свободные места', 'Free places'), text: X(`Қабылдау кезінде бос орын болуы маңызды: Үлгілік қағидалар бойынша сыныптардың толып кетуі бас тарту негізі бола алады. <a href="${href('admission')}">Қабылдау қағидалары</a>.`, `Важно для приёма: по Типовым правилам переполненность классов может быть основанием для отказа. <a href="${href('admission')}">Правила приёма</a>.`, `This matters for admission: under the Standard Rules, full classes can be a ground for refusal. <a href="${href('admission')}">Admission rules</a>.`) },
      { icon: 'graduation', title: X('Түлектер', 'Выпускники', 'Graduates'), text: X('4-сыныпты бітірушілер (бастауыш), 9 және 11-сынып түлектері саны. Мектепте тек 0–6-сыныптар болса, 9 және 11-сынып түлектері әзірге болмайды.', 'Число окончивших 4 класс (начальная школа), выпускников 9 и 11 классов. Если в школе только 0–6 классы, выпускников 9 и 11 классов пока нет.', 'Number completing grade 4 (primary), and graduates of grades 9 and 11. If the school runs grades 0–6 only, there are no grade 9 or 11 graduates yet.') },
      { icon: 'calendar', title: X('Кезең', 'Период', 'Period'), text: X('Өзін-өзі бағалау үшін — алдыңғы екі оқу жылы және ағымдағы оқу жылы бойынша.', 'Для самооценки — за два предыдущих учебных года и текущий.', 'For self-assessment — the two previous school years and the current one.') },
    ];
    // Glossary as tabs: six terms in one row, one short explanation shown at a time (all printed / findable).
    const indicators = ui.tabs(indicatorItems.map((it) => ({ icon: it.icon, label: it.title, body: `<p class="sa-glosstxt">${L(it.text)}</p>` })), { label: X('Көрсеткіштер', 'Показатели', 'Indicators'), cls: 'sa-glosstabs' });

    const history = ui.table({
      head: [X('Оқу жылы', 'Учебный год', 'School year'), X('Сынып-жинақтар', 'Классы-комплекты', 'Classes'), X('Оқушылар', 'Учащиеся', 'Pupils'), X('Түлектер', 'Выпускники', 'Graduates')],
      numeric: [1, 2, 3],
      rows: ['2024–2025', '2025–2026', '2026–2027'].map((y) => [y, dash, dash, dash]),
    });

    // ------------------------------------------------------------------ group division (ГОСО)
    const g = (kz, ru, en) => L(X(kz, ru, en));
    const rule = (txt) => `<span class="sa-rule">${ui.icon('scale', { size: 14 })}<span>${txt}</span></span>`;
    const splitRules = ui.table({
      cls: 'sa-tbl',
      caption: X('МЖМБС бойынша сыныпты екі топқа бөлу (қалалық мектептер: сыныпта 24 және одан көп оқушы)', 'Деление класса на две группы по ГОСО (городские школы: 24 и более учащихся в классе)', 'Splitting a class into two groups under the state standard (urban schools: 24 or more pupils)'),
      head: [X('Деңгей', 'Уровень', 'Level'), X('Міндетті түрде бөлінеді', 'Делится обязательно', 'Split required'), X('Бөлуге рұқсат етіледі', 'Деление допускается', 'Split allowed'), X('Негіз', 'Основание', 'Basis')],
      rows: [
        [X('Бастауыш (1–4)', 'Начальное (1–4)', 'Primary (1–4)'),
          X('қазақ тілі (қазақ тілінде оқытпайтын сыныптарда); шетел тілі; цифрлық сауаттылық (1-сыныптан басқа)', 'казахский язык (в классах с неказахским языком обучения); иностранный язык; цифровая грамотность (кроме 1 класса)', 'Kazakh (in non-Kazakh-medium classes); foreign language; digital literacy (not in grade 1)'),
          X('орыс тілі (орыс тілінде оқытпайтын сыныптарда)', 'русский язык (в классах с нерусским языком обучения)', 'Russian (in non-Russian-medium classes)'),
          rule(g('Бастауыш білім берудің МЖМБС, 30-т.', 'ГОСО начального образования, п. 30', 'Primary standard, para. 30'))],
        [X('Негізгі орта (5–9)', 'Основное среднее (5–9)', 'Lower secondary (5–9)'),
          X('қазақ тілі мен әдебиеті (қазақ тілінде оқытпайтын сыныптарда); шетел тілі; көркем еңбек / технология; информатика', 'казахский язык и литература (в классах с неказахским языком обучения); иностранный язык; художественный труд / технология; информатика', 'Kazakh language & literature (in non-Kazakh-medium classes); foreign language; art & design / technology; computing'),
          X('орыс тілі мен әдебиеті (орыс тілінде оқытпайтын сыныптарда); көркем еңбек — ұлдар мен қыздар бойынша, толымдылыққа қарамастан', 'русский язык и литература (в классах с нерусским языком обучения); художественный труд — на мальчиков и девочек независимо от наполняемости', 'Russian language & literature (in non-Russian-medium classes); art & design split into boys and girls regardless of class size'),
          rule(g('Негізгі орта білім берудің МЖМБС, 43–44-т.', 'ГОСО основного среднего образования, пп. 43–44', 'Lower secondary standard, paras. 43–44'))],
      ],
    });
    const splitNoteTxt = (X(
      `Инклюзивті білім беруде әр ерекше білім беру қажеттіліктері бар балаға сынып толымдылығы шегі 3-ке азаяды (МЖМБС, 31 және 45-тармақтар). Карантин немесе төтенше жағдайда барлық пәндер бойынша топқа бөлінеді — бір топта 15 оқушыға дейін. Дереккөз: ${ui.extLink(GOSO, 'ҚР Оқу-ағарту министрінің 03.08.2022 № 348 бұйрығы (МЖМБС)')}, 26.06.2026 редакциясы.`,
      `В инклюзивном образовании порог наполняемости для деления уменьшается на 3 на каждого ребёнка с особыми образовательными потребностями (ГОСО, пп. 31 и 45). При карантине и ЧС деление на группы проводится по всем предметам — до 15 учащихся в группе. Источник: ${ui.extLink(GOSO, 'приказ Министра просвещения РК от 03.08.2022 № 348 (ГОСО)')}, ред. от 26.06.2026.`,
      `In inclusive education the class-size threshold drops by 3 for each child with special educational needs (standard, paras. 31 and 45). During quarantine or emergencies all subjects are split, up to 15 pupils per group. Source: ${ui.extLink(GOSO, 'Order No. 348 of the Minister of Education, 03.08.2022 (state standard)')}, as amended 26.06.2026.`,
    ));
    const splitSummary = `<div class="sa-splitsum">
<p class="sa-splitsum__big"><b>24+</b><span>${L(X('оқушы болса, қалалық мектепте сынып екі топқа бөлінеді', 'учащихся — и в городской школе класс делится на две группы', 'pupils or more, and an urban class is split into two groups'))}</span></p>
${ui.chips([
      { icon: 'languages', label: X('Қазақ / орыс тілі', 'Казахский / русский язык', 'Kazakh / Russian') },
      { icon: 'globe', label: X('Шетел тілі', 'Иностранный язык', 'Foreign language') },
      { icon: 'code', label: X('Цифрлық сауаттылық, информатика', 'Цифровая грамотность, информатика', 'Digital literacy, computing') },
      { icon: 'palette', label: X('Көркем еңбек / технология', 'Художественный труд / технология', 'Art & design / technology') },
    ])}
</div>`;
    const splitDetails = `<div class="dz-row">${ui.more({ label: X('МЖМБС бойынша бөлу ережелері', 'Правила деления по ГОСО', 'Splitting rules under the standard'), icon: 'grid', count: 2, tone: 'card', body: splitRules + ui.note(splitNoteTxt) })}${ui.legal([
      { href: GOSO, title: X('Мемлекеттік жалпыға міндетті білім беру стандарттары (ҚР ОАМ бұйрығы)', 'Государственные общеобязательные стандарты образования (приказ МП РК)', 'State compulsory education standards (Ministry of Education order)'), number: '348', date: '2022-08-03', note: X('Бастауыш — 30, 31-т.; негізгі орта — 43–45-т.; 26.06.2026 редакциясы', 'Начальное — пп. 30, 31; основное среднее — пп. 43–45; ред. от 26.06.2026', 'Primary — paras. 30, 31; lower secondary — paras. 43–45; as amended 26.06.2026') },
    ])}</div>`;
    const splitData = ui.table({
      cls: 'sa-tbl',
      caption: X('«Керемет» мектебінде топтарға бөлу, 2026–2027 оқу жылы', 'Деление на группы в школе «Керемет», 2026–2027 учебный год', 'Group splits at Keremet, school year 2026–2027'),
      head: [X('Пән', 'Предмет', 'Subject'), X('Сыныптар', 'Классы', 'Grades'), X('Топтар саны', 'Число групп', 'Groups'), X('Негіз (МЖМБС / ҮОЖ)', 'Основание (ГОСО / ТУП)', 'Basis (standard / curriculum)')],
      numeric: [2],
      rows: [
        [X('Шетел тілі (ағылшын)', 'Иностранный язык (английский)', 'Foreign language (English)'), dash, dash, dash],
        [X('Қазақ тілі (орыс тілінде оқитын сыныптарда)', 'Казахский язык (в классах с русским языком обучения)', 'Kazakh (Russian-medium classes)'), dash, dash, dash],
        [X('Орыс тілі (қазақ тілінде оқитын сыныптарда)', 'Русский язык (в классах с казахским языком обучения)', 'Russian (Kazakh-medium classes)'), dash, dash, dash],
        [X('Цифрлық сауаттылық / информатика', 'Цифровая грамотность / информатика', 'Digital literacy / computing'), dash, dash, dash],
      ],
    });
    const splitPending = ui.pending({
      title: X('Мектептің топтарға бөлу деректері толықтырылуда', 'Данные школы о делении на группы готовятся', 'The school’s group data are being prepared'),
      note: X(
        'Мектеп әр пән бойынша қай сыныптар бөлінетінін, топтар санын және негізін (МЖМБС тармағы немесе мектептің оқу жоспары) көрсеткеннен кейін кесте толтырылады.',
        'Таблица будет заполнена, когда школа укажет по каждому предмету, какие классы делятся, число групп и основание (пункт ГОСО или рабочий учебный план школы).',
        'The table will be filled in once the school states, for each subject, which grades are split, how many groups there are and the basis (standard clause or the school’s curriculum).',
      ),
    });

    const sources = ui.legal([
      { href: GOSO, icon: 'scale', label: X('Мемлекеттік жалпыға міндетті білім беру стандарттары (ҚР ОАМ 03.08.2022 № 348 бұйрығы)', 'Государственные общеобязательные стандарты образования (приказ МП РК от 03.08.2022 № 348)', 'State compulsory education standards (Order No. 348 of 03.08.2022)'), note: 'adilet.zan.kz' },
      { href: TUP, icon: 'scale', label: X('Үлгілік оқу жоспарлары (ҚР БҒМ 08.11.2012 № 500 бұйрығы)', 'Типовые учебные планы (приказ МОН РК от 08.11.2012 № 500)', 'Standard curricula (MES order No. 500 of 08.11.2012)'), note: 'adilet.zan.kz' },
      { href: A114, icon: 'scale', label: X('Мемлекеттік аттестаттау қағидалары, 8–9-өлшемшарттар (ҚР ОАМ 30.04.2026 № 114-НҚ бұйрығы)', 'Правила государственной аттестации, критерии 8–9 (приказ МП РК от 30.04.2026 № 114-НҚ)', 'State attestation rules, criteria 8–9 (Order No. 114-NK of 30.04.2026)'), note: 'adilet.zan.kz' },
      { href: SAN, icon: 'scale', label: X('«Білім беру объектілеріне қойылатын санитариялық-эпидемиологиялық талаптар» (ҚР ДСМ-76, 05.08.2021), 2-қосымша — сынып толымдылығы', 'Санитарные правила «Санитарно-эпидемиологические требования к объектам образования» (ҚР ДСМ-76 от 05.08.2021), приложение 2 — наполняемость классов', 'Sanitary rules for education facilities (ҚР ДСМ-76 of 05.08.2021), Appendix 2 — class sizes'), note: 'adilet.zan.kz' },
      { href: R564, icon: 'scale', label: X('Қабылдаудың үлгілік қағидалары (№ 564 бұйрық), 13 және 25-тармақтар — сыныптардың толып кетуі', 'Типовые правила приёма (приказ № 564), пп. 13 и 25 — переполненность классов', 'Standard Admission Rules (Order No. 564), paras. 13 and 25 — full classes'), note: 'adilet.zan.kz' },
    ], { id: 'sources', title: X('Нормативтік актілер', 'Нормативные акты', 'Regulations') });


    const toc = ui.toc([
      { id: 'levels', label: X('Деңгейлер мен сыныптар', 'Уровни и классы', 'Levels and grades') },
      { id: 'table', label: X('Сыныптар мен оқушылар', 'Классы и учащиеся', 'Classes and pupils') },
      { id: 'groups', label: X('Топтарға бөлу', 'Деление на группы', 'Group splits') },
      { id: 'dynamics', label: X('Динамика', 'Динамика', 'Changes over time') },
      { id: 'indicators', label: X('Түсіндірме', 'Пояснения', 'Explanations') },
      { id: 'sources', label: X('Нормативтік актілер', 'Нормативные акты', 'Regulations') },
    ]);
    return [
      stats,
      ui.split({ ratio: '1:2', cls: 'sa-split', left: toc, right: ui.section({ id: 'levels', eyebrow: year, title: X('Білім беру деңгейлері мен сыныптар', 'Уровни образования и классы', 'Levels and grades'), body: ladder + ladderNote }) }),
      ui.section({ id: 'table', eyebrow: X('Деңгейлер бойынша', 'По уровням', 'By level'), title: X('Сыныптар мен оқушылар', 'Классы и учащиеся', 'Classes and pupils'), body: table + tablePending }),
      ui.section({ id: 'groups', eyebrow: X('МЖМБС бойынша', 'По ГОСО', 'Under the state standard'), title: X('Сыныпты топтарға бөлу', 'Деление классов на группы', 'Splitting classes into groups'), lead: X(
        'Тілдер мен цифрлық пәндер бойынша үлкен сыныптар екі топқа бөлінеді — әр оқушыға көбірек көңіл бөлу үшін.',
        'По языкам и цифровым предметам большие классы делятся на две группы — чтобы уделять больше внимания каждому ученику.',
        'Large classes are split into two groups for languages and digital subjects, so each pupil gets more attention.',
      ), body: splitSummary + splitDetails + `<h3>${L(X('Мектептегі топтар', 'Группы в школе', 'Groups at the school'))}</h3>` + splitData + splitPending }),
      ui.section({ id: 'dynamics', tone: 'geography', eyebrow: X('3 жыл', '3 года', '3 years'), title: X('Контингент динамикасы', 'Динамика контингента', 'Changes over time'), body: history }),
      ui.section({ id: 'indicators', eyebrow: X('Көрсеткіштер нені білдіреді', 'Что означают показатели', 'What the indicators mean'), title: X('Түсіндірме', 'Пояснения', 'Explanations'), body: indicators + `<div class="dz-row sa-srcrow">${sources}</div>` }),
      ui.banner({ theme: 'geography', icon: 'graduation', eyebrow: X('Қабылдау', 'Приём', 'Admission'), title: X('Бос орындарды нақтылағыңыз келе ме?', 'Хотите уточнить свободные места?', 'Want to check free places?'), text: X(`Қоңырау шалыңыз: ${S.contacts.phone.display} немесе қабылдауға өтінім қалдырыңыз.`, `Позвоните: ${S.contacts.phone.display} или оставьте заявку на приём.`, `Call ${S.contacts.phone.display} or leave an admission request.`), href: `${href('admission')}#request`, label: X('Өтінім қалдыру', 'Оставить заявку', 'Leave a request') }),
      ui.section({ title: X('Байланысты беттер', 'Связанные страницы', 'Related pages'), body: ui.cards([
        { icon: 'compass', href: href('admission'), title: X('Қабылдау қағидалары', 'Правила приёма', 'Admission rules'), text: X('Құжаттар, мерзімдер, egov.kz', 'Документы, сроки, egov.kz', 'Documents, deadlines, egov.kz') },
        { icon: 'target', href: href('self-3'), title: X('Өзін-өзі бағалау: контингент', 'Самооценка: контингент', 'Self-assessment: students'), text: X('3-бағыт, 8–9-өлшемшарттар', 'Направление 3, критерии 8–9', 'Area 3, criteria 8–9') },
        { icon: 'doc', href: href('forms'), title: X('Өтініш үлгілері', 'Образцы заявлений', 'Application forms'), text: X('Қабылдау, ауысу, анықтама', 'Приём, перевод, справка', 'Admission, transfer, certificate') },
      ], { cols: 3, cls: 'sa-cards' }) }),
    ].join('\n');
  },
};
