// Teaching staff — ORDER-114 items 35 (staff list, with consent) and 36 (staff analytics, criteria 5–7).
// No names are published: S.staff is null until the school supplies the list with written consent.
// Legal basis: Law "On personal data and their protection" (Z1300000094); Standard qualification
// characteristics of teachers' positions — MES order No. 338 of 13.07.2009 (V090005750_).
export default {
  slug: 'teachers',
  group: 'staff',
  order: 10,
  styles: ['staff-admission'],
  title: { kz: 'Педагогтер құрамы', ru: 'Педагогический состав', en: 'Teaching staff' },
  description: {
    kz: '«Керемет» мектебінің педагогтері: білімі, біліктілік санаты, біліктілікті арттыру курстары және кадрлық әлеует көрсеткіштері.',
    ru: 'Педагоги школы «Керемет»: образование, квалификационная категория, курсы повышения квалификации и показатели кадрового потенциала.',
    en: 'Keremet School teachers: education, qualification category, professional development courses and staffing indicators.',
  },
  lead: {
    kz: 'Мұғалім — мектептің жүрегі. Бұл бетте педагогтер туралы мәліметтер олардың келісімімен жарияланады, ал кадрлық әлеует көрсеткіштері мемлекеттік аттестаттау өлшемшарттарымен салыстырылады.',
    ru: 'Учитель — сердце школы. Сведения о педагогах публикуются здесь с их согласия, а показатели кадрового потенциала сопоставляются с критериями государственной аттестации.',
    en: 'Teachers are the heart of a school. Staff details are published here with each teacher’s consent, and staffing indicators are compared with the state attestation criteria.',
  },
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, { ui, S, L, t, href }) {
    const X = (kz, ru, en) => ({ kz, ru, en });
    const adl = (code) => `https://adilet.zan.kz/${lang === 'kz' ? 'kaz' : 'rus'}/docs/${code}`;
    const PD_LAW = adl('Z1300000094');
    const TKH = adl('V090005750_');
    const A114 = adl('V2600038645');
    const STATUS = adl('Z1900000293');
    const pend = ui.badge(t('unconfirmed'), 'warn');

    // ------------------------------------------------------------------ overview bento (all pending)
    const overview = ui.stats([
      { icon: 'users', art: true, value: X('Кәсіби педагогтер', 'Профессиональные педагоги', 'Professional teachers'),
        label: X('Мектептің Instagram парақшасындағы басты ерекшелік', 'Главная особенность из профиля школы в Instagram', 'A key feature named on the school’s Instagram profile'),
        note: X('Педагогтердің саны мен құрамы нақтыланып жатыр.', 'Численность и состав педагогов уточняются.', 'Staff numbers and composition are being confirmed.'),
        extra: ui.chips([
          { icon: 'star', label: X('НЗМ / РФММ әдістемесі', 'Методика НИШ / РФМШ', 'NIS / RPMS methods') },
          { icon: 'calculator', label: X('Сингапур математикасы', 'Сингапурская математика', 'Singapore maths') },
          { icon: 'languages', label: X('Тілдерді тереңдетіп оқыту', 'Углублённые языки', 'In-depth languages') },
        ]) },
      { icon: 'user', value: '—', label: X('Педагогтер саны', 'Всего педагогов', 'Teachers in total'), note: X('толықтырылуда', 'обновляется', 'being updated') },
      { icon: 'graduation', value: '—', label: X('Бейінді білімі бар', 'С профильным образованием', 'With a relevant degree'), note: X('толықтырылуда', 'обновляется', 'being updated') },
      { icon: 'trophy', value: '—', label: X('Сарапшы, зерттеуші, шебер', 'Эксперты, исследователи, мастера', 'Experts, researchers, masters'), note: X('толықтырылуда', 'обновляется', 'being updated') },
      { icon: 'book', value: '—', label: X('Соңғы 3 жылда курстан өткен', 'Прошли курсы за 3 года', 'Trained in the last 3 years'), note: X('толықтырылуда', 'обновляется', 'being updated') },
    ], { cls: 'stats--bento sa-keystats' });

    // ------------------------------------------------------------------ staff list structure
    const cols = [
      X('Аты-жөні', 'ФИО', 'Full name'),
      X('Лауазымы / пәні', 'Должность / предмет', 'Position / subject'),
      X('Білімі (ЖОО, мамандығы, жылы)', 'Образование (вуз, специальность, год)', 'Education (university, major, year)'),
      X('Санаты және берілген күні', 'Категория и дата присвоения', 'Category and date awarded'),
      X('Біліктілікті арттыру (соңғы 3 жыл)', 'Повышение квалификации (за 3 года)', 'Professional development (last 3 years)'),
    ];
    const ph = (s = '') => `<span class="sa-ph${s}" aria-hidden="true"></span><span class="sr-only">${L(X('толықтырылуда', 'обновляется', 'being updated'))}</span>`;
    const staffTable = ui.table({
      cls: 'sa-tbl',
      caption: X('Педагогтер тізімі, 2026–2027 оқу жылы', 'Список педагогов, 2026–2027 учебный год', 'Teaching staff, school year 2026–2027'),
      head: cols,
      rows: [[ph(), ph(), ph(), ph(' sa-ph--s'), ph()], [ph(), ph(), ph(), ph(' sa-ph--s'), ph()]],
    });
    const colGuideList = `<ul class="sa-colguide" role="list">
<li><b>${L(cols[0])}</b><span>${L(X('толық, құжат бойынша', 'полностью, по документу', 'in full, as in the ID'))}</span></li>
<li><b>${L(cols[1])}</b><span>${L(X('оқытатын пәні, сыныптары, жетекшілігі', 'предмет, классы, классное руководство', 'subject, grades, form tutoring'))}</span></li>
<li><b>${L(X('Білімі', 'Образование', 'Education'))}</b><span>${L(X('ЖОО, мамандығы, дипломы; болса — педагогикалық қайта даярлау туралы құжат', 'вуз, специальность, диплом; при наличии — документ о педагогической переподготовке', 'university, major, diploma; if any — teacher retraining certificate'))}</span></li>
<li><b>${L(X('Санаты', 'Категория', 'Category'))}</b><span>${L(X('педагог, модератор, сарапшы, зерттеуші, шебер — бұйрық күнімен', 'педагог, модератор, эксперт, исследователь, мастер — с датой приказа', 'teacher, moderator, expert, researcher, master — with the order date'))}</span></li>
<li><b>${L(X('Курстар', 'Курсы', 'Courses'))}</b><span>${L(X('соңғы 3 жылдағы курстардың атауы, ұйымы, жылы, сағаты', 'название, организация, год и объём курсов за 3 года', 'title, provider, year and hours for the last 3 years'))}</span></li>
</ul>`;
    const colGuide = ui.more({ label: X('Әр бағанда не көрсетіледі', 'Что указывается в каждом столбце', 'What each column contains'), icon: 'grid', count: 5, tone: 'plain', body: colGuideList });
    const staffPending = ui.pending({
      title: X('Педагогтер тізімі толықтырылуда', 'Список педагогов готовится', 'The staff list is being prepared'),
      note: X(
        'Мектеп әкімшілігі әр педагогтен дербес деректерді жариялауға жазбаша келісім алғаннан кейін тізім осы кестеге енгізіледі. Келісім бермеген педагог туралы тек лауазымы мен санаты (атаусыз) көрсетіледі.',
        'Список будет внесён в эту таблицу после того, как администрация получит от каждого педагога письменное согласие на публикацию персональных данных. О педагоге без согласия указываются только должность и категория (без имени).',
        'The list will be entered here once the administration has written consent from each teacher to publish personal data. For a teacher who does not consent, only the position and category are shown (no name).',
      ),
    });
    const consent = ui.callout({
      type: 'info', icon: 'lock',
      title: X('Дербес деректер тек келісіммен жарияланады', 'Персональные данные — только с согласия', 'Personal data only with consent'),
      text: X('Жеке телефон мен мекенжай жарияланбайды; келісімді кез келген уақытта кері қайтарып алуға болады.', 'Личные телефоны и адреса не публикуются; согласие можно отозвать в любой момент.', 'Private phones and addresses are never published; consent can be withdrawn at any time.'),
    });
    const consentLegal = ui.legal([
      { href: PD_LAW, title: X('«Дербес деректер және оларды қорғау туралы» ҚР Заңы', 'Закон РК «О персональных данных и их защите»', 'Law “On personal data and their protection”'), number: '94-V', date: '2013-05-21' },
    ], { note: X(
        `${ui.extLink(PD_LAW, '«Дербес деректер және оларды қорғау туралы» ҚР Заңына')} сәйкес педагогтің аты-жөні, білімі мен біліктілігі туралы мәліметтер оның келісімімен ғана жалпыға қолжетімді етіледі. Келісімді кез келген уақытта кері қайтарып алуға болады — ол жағдайда мәлімет сайттан алынады. Байланыс деректері (жеке телефон, мекенжай) жарияланбайды.`,
        `По ${ui.extLink(PD_LAW, 'Закону РК «О персональных данных и их защите»')} ФИО, сведения об образовании и квалификации педагога делаются общедоступными только с его согласия. Согласие можно отозвать в любой момент — тогда сведения удаляются с сайта. Личные контакты (телефон, адрес) не публикуются.`,
        `Under the ${ui.extLink(PD_LAW, 'Law of Kazakhstan “On personal data and their protection”')}, a teacher’s name, education and qualifications are made public only with their consent. Consent can be withdrawn at any time, and the data are then removed from the site. Private contacts (phone, address) are never published.`,
      ) });

    // ------------------------------------------------------------------ analytics vs criteria
    const meter = ({ icon, label, crit, rows }) => `<article class="sa-meter">
<div class="sa-meter__head"><span class="sa-meter__icon">${ui.icon(icon, { size: 22 })}</span><div><p class="sa-meter__label">${L(label)}</p><p class="sa-meter__crit">${L(crit)}</p></div></div>
${rows.map((r) => `<div class="sa-meter__row"><p class="sa-meter__rowlabel"><span>${L(r.label)}</span><b>${L(r.target)}</b></p><div class="sa-meter__bar" role="img" aria-label="${L(X('Талап', 'Норма', 'Target'))}: ${L(r.target)}. ${L(X('Мектеп көрсеткіші толықтырылуда', 'Показатель школы обновляется', 'School figure being updated'))}"><span class="sa-meter__zone" style="--t:${r.t}%"></span><span class="sa-meter__mark" style="--t:${r.t}%"></span></div></div>`).join('')}
<p class="sa-meter__value"><strong>—</strong><span>${L(X('мектеп көрсеткіші', 'показатель школы', 'school figure'))}</span>${pend}</p>
</article>`;
    const meters = `<div class="sa-meters">
${meter({ icon: 'graduation', label: X('Бейінді білімі бар педагогтердің үлесі', 'Доля педагогов с профильным образованием', 'Share of teachers with a relevant degree'), crit: X('«Үлгілі» деңгей (5 балл) үшін', 'Для уровня «образцовый» (5 баллов)', 'For the “exemplary” level (5 points)'), rows: [{ label: X('талап', 'норма', 'target'), target: '100%', t: 99.4 }] })}
${meter({ icon: 'trophy', label: X('Сарапшы, зерттеуші және шебер санатындағы педагогтердің үлесі', 'Доля педагогов-экспертов, исследователей и мастеров', 'Share of expert, researcher and master teachers'), crit: X('«Үлгілі» деңгей (5 балл) үшін', 'Для уровня «образцовый» (5 баллов)', 'For the “exemplary” level (5 points)'), rows: [
      { label: X('бастауыш деңгей', 'начальный уровень', 'primary level'), target: X('45%-дан жоғары', 'более 45%', 'over 45%'), t: 45 },
      { label: X('негізгі және жалпы орта деңгей', 'основной и общий средний', 'lower & upper secondary'), target: X('55%-дан жоғары', 'более 55%', 'over 55%'), t: 55 },
    ] })}
${meter({ icon: 'book', label: X('Соңғы 3 жылда біліктілігін арттырған педагогтердің үлесі', 'Доля педагогов, повысивших квалификацию за 3 года', 'Share of teachers trained in the last 3 years'), crit: X('«Үлгілі» деңгей (5 балл) үшін', 'Для уровня «образцовый» (5 баллов)', 'For the “exemplary” level (5 points)'), rows: [{ label: X('талап', 'норма', 'target'), target: '100%', t: 99.4 }] })}
</div>`;
    const metersNote = `<div class="dz-row">${ui.legal([
      { href: A114, title: X('Мемлекеттік аттестаттау қағидалары (ҚР Оқу-ағарту министрінің бұйрығы)', 'Правила государственной аттестации (приказ Министра просвещения РК)', 'State Attestation Rules (Minister of Education order)'), number: '114-НҚ', date: '2026-04-30', note: X('5–7-өлшемшарттар — кадрлық әлеует', 'критерии 5–7 — кадровый потенциал', 'criteria 5–7 — staffing') },
    ], { note: X(
      `Талап етілетін үлестер ${ui.extLink(A114, 'мемлекеттік аттестаттау қағидаларының')} (ҚР Оқу-ағарту министрінің 30.04.2026 № 114-НҚ бұйрығы) кадрлық әлеует өлшемшарттары бойынша (5–7-өлшемшарттар) көрсетілген. Мектептің нақты көрсеткіштері өзін-өзі бағалау материалдарымен бірге жарияланады — <a href="${href('self-2')}">«Кадрлық әлеует»</a>.`,
      `Требуемые доли приведены по критериям кадрового потенциала (критерии 5–7) ${ui.extLink(A114, 'Правил государственной аттестации')} (приказ Министра просвещения РК от 30.04.2026 № 114-НҚ). Фактические показатели школы публикуются вместе с материалами самооценки — <a href="${href('self-2')}">«Кадровый потенциал»</a>.`,
      `Target shares follow the staffing criteria (criteria 5–7) of the ${ui.extLink(A114, 'State Attestation Rules')} (Order No. 114-NK of the Minister of Education, 30.04.2026). The school’s actual figures are published with the self-assessment materials — <a href="${href('self-2')}">Staffing</a>.`,
    ) })}<a class="sa-chiplink" href="${href('self-2')}">${ui.icon('target', { size: 16 })}<span>${L(X('Өзін-өзі бағалау: кадрлық әлеует', 'Самооценка: кадровый потенциал', 'Self-assessment: staffing'))}</span>${ui.icon('arrow-right', { size: 16 })}</a></div>`;

    // ------------------------------------------------------------------ categories ladder
    // Order 338, §7 "Учителя всех специальностей", p.66 (minimum experience) and p.67 (competences), ред. 19.06.2026.
    const exp = (kz, ru, en) => `<span class="sa-exp">${ui.icon('clock', { size: 14 })}<span>${L(X(kz, ru, en))}</span></span>`;
    const cats = [
      { title: X('Педагог', 'Педагог', 'Teacher'), text: L(X(
        'Оқу-тәрбие процесін оқушылардың жас ерекшеліктерін ескеріп жоспарлайды; білім беру ұйымы деңгейіндегі іс-шараларға қатысады; сандық білім беру ресурстарын қолданады.',
        'Планирует учебно-воспитательный процесс с учётом возрастных особенностей учеников; участвует в мероприятиях на уровне организации образования; применяет цифровые образовательные ресурсы.',
        'Plans teaching with pupils’ age in mind, takes part in events at school level and uses digital learning resources.')) + exp('өтілге талап жоқ', 'без требований к стажу', 'no minimum experience') },
      { title: X('Педагог-модератор', 'Педагог-модератор', 'Teacher-moderator'), text: L(X(
        'Оқытудың инновациялық формалары мен әдістерін қолданады; өзі немесе оқушылары мектеп, аудан (облыстық маңызы бар қала) деңгейіндегі конкурстар мен олимпиадалардың қатысушысы не жүлдегері.',
        'Использует инновационные формы и методы обучения; сам или его ученики — участники или призёры конкурсов и олимпиад на уровне школы, района (города областного значения).',
        'Uses innovative teaching methods; the teacher or their pupils take part or win prizes in competitions and olympiads at school or district level.')) + exp('өтілі кемінде 2 жыл', 'стаж не менее 2 лет', 'at least 2 years') },
      { title: X('Педагог-сарапшы', 'Педагог-эксперт', 'Teacher-expert'), text: L(X(
        'Сабақ пен оқу-тәрбие процесін талдай алады; мектеп деңгейінде өзінің және әріптестерінің кәсіби даму басымдықтарын айқындайды; аудан және облыс деңгейіндегі конкурстарға қатысады.',
        'Владеет навыками анализа уроков и учебно-воспитательного процесса; определяет приоритеты профессионального развития — своего и коллег — на уровне школы; участвует в конкурсах на уровне района и области.',
        'Analyses lessons and the learning process, sets professional development priorities for self and colleagues at school level, and takes part in district and regional competitions.')) + exp('өтілі кемінде 3 жыл', 'стаж не менее 3 лет', 'at least 3 years') },
      { title: X('Педагог-зерттеуші', 'Педагог-исследователь', 'Teacher-researcher'), text: L(X(
        'Сабақты зерттеу және бағалау құралдарын әзірлеу дағдыларын меңгерген; оқушылардың зерттеу дағдыларын дамытады; тәжірибесін облыс деңгейінде жинақтайды; облыстық, республикалық, халықаралық конкурстарға қатысады.',
        'Владеет навыками исследования урока и разработки инструментов оценивания; развивает исследовательские навыки учеников; обобщает опыт на уровне области; участвует в конкурсах областного, республиканского, международного уровня.',
        'Carries out lesson study and designs assessment tools, develops pupils’ research skills, shares practice at regional level and competes at regional, national or international level.')) + exp('өтілі кемінде 4 жыл', 'стаж не менее 4 лет', 'at least 4 years') },
      { title: X('Педагог-шебер', 'Педагог-мастер', 'Teacher-master'), text: L(X(
        'Ы. Алтынсарин атындағы Ұлттық білім академиясы жанындағы РОӘК мақұлдаған авторлық бағдарламасы бар немесе бекітілген оқулықтың, құралдың авторы; республикалық не халықаралық конкурстардың жүлдегері немесе жеңімпаздарын дайындаған.',
        'Имеет авторскую программу, одобренную РУМС при Национальной академии образования им. Ы. Алтынсарина, или является автором утверждённых учебников, пособий; призёр республиканских или международных конкурсов либо подготовил их победителей.',
        'Has an original programme approved by the council of the Altynsarin National Academy of Education, or authored approved textbooks; has won, or coached winners of, national or international competitions.')) + exp('өтілі 5 жыл', 'стаж 5 лет', '5 years') },
    ];
    // Layer 1: five steps with the minimum experience badge; layer 2: what each category must be able to do.
    const expOf = (txt) => (txt.match(/<span class="sa-exp">[\s\S]*$/) || [''])[0];
    const ladder = `${ui.steps(cats.map((c) => ({ title: c.title, text: expOf(c.text) })), { cls: 'sa-steps sa-cats sa-cats--short' })}
<div class="dz-row">${ui.more({ label: X('Әр санатқа қойылатын талаптар', 'Требования к каждой категории', 'What each category requires'), icon: 'trophy', count: cats.length, tone: 'card', body: ui.steps(cats, { cls: 'sa-steps-full sa-cats' }) })}`;
    const ladderNote = `${ui.legal([
      { href: TKH, title: X('Педагог лауазымдарының үлгілік біліктілік сипаттамалары (ҚР БҒМ бұйрығы)', 'Типовые квалификационные характеристики должностей педагогов (приказ МОН РК)', 'Standard qualification characteristics of teachers’ positions (MES order)'), number: '338', date: '2009-07-13', note: X('66–67-тармақтар; 19.06.2026 редакциясы', 'пп. 66–67; ред. от 19.06.2026', 'paras. 66–67; as amended 19.06.2026') },
      { href: STATUS, title: X('«Педагог мәртебесі туралы» ҚР Заңы', 'Закон РК «О статусе педагога»', 'Law “On the status of a teacher”') },
    ], { note: X(
      `Қысқаша сипаттама ${ui.extLink(TKH, 'Педагог лауазымдарының үлгілік біліктілік сипаттамаларының')} «Барлық мамандықтағы мұғалімдер» параграфы (66–67-тармақтар) бойынша берілген (ҚР БҒМ 13.07.2009 № 338 бұйрығы, 19.06.2026 редакциясы). Санаттар ${ui.extLink(STATUS, '«Педагог мәртебесі туралы» ҚР Заңына')} сәйкес аттестаттау қорытындысы бойынша беріледі.`,
      `Кратко по параграфу «Учителя всех специальностей» (пп. 66–67) ${ui.extLink(TKH, 'Типовых квалификационных характеристик должностей педагогов')} (приказ МОН РК от 13.07.2009 № 338, ред. от 19.06.2026). Категории присваиваются по итогам аттестации в соответствии с ${ui.extLink(STATUS, 'Законом РК «О статусе педагога»')}.`,
      `Summarised from the “Teachers of all subjects” section (paras. 66–67) of the ${ui.extLink(TKH, 'Standard qualification characteristics of teachers’ positions')} (MES order No. 338 of 13.07.2009, as amended 19.06.2026). Categories are awarded through attestation under the ${ui.extLink(STATUS, 'Law “On the status of a teacher”')}.`,
    ) })}</div>`;

    // ------------------------------------------------------------------ assemble
    const toc = ui.toc([
      { id: 'list', label: X('Педагогтер тізімі', 'Список педагогов', 'Staff list') },
      { id: 'analytics', label: X('Кадрлық әлеует', 'Кадровый потенциал', 'Staffing indicators') },
      { id: 'categories', label: X('Біліктілік санаттары', 'Квалификационные категории', 'Qualification categories') },
      { id: 'join', label: X('Командаға қосылу', 'Присоединиться к команде', 'Join the team') },
    ]);
    return [
      overview,
      ui.split({ ratio: '1:2', cls: 'sa-split', left: toc, right: ui.section({ id: 'list', eyebrow: X('Келісіммен жарияланады', 'Публикуется с согласия', 'Published with consent'), title: X('Педагогтер тізімі', 'Список педагогов', 'Staff list'), lead: X(
        'Кестеде әр педагог бойынша бес баған болады.',
        'В таблице по каждому педагогу будет пять столбцов.',
        'The table will have five columns per teacher.',
      ), body: staffTable + staffPending + consent + `<div class="dz-row">${colGuide}${consentLegal}</div>` }) }),
      ui.section({ id: 'analytics', tone: 'languages', eyebrow: X('5–7-өлшемшарттар', 'Критерии 5–7', 'Criteria 5–7'), title: X('Кадрлық әлеует көрсеткіштері', 'Показатели кадрового потенциала', 'Staffing indicators'), lead: X(
        'Сызық — «үлгілі» деңгейге қажетті шек. Мектептің мәні жарияланғанда осы шкалада көрсетіледі.',
        'Черта — порог для уровня «образцовый». Значение школы появится на шкале после публикации.',
        'The mark is the threshold for the “exemplary” level. The school’s figure will appear on the scale once published.',
      ), body: meters + metersNote }),
      ui.section({ id: 'categories', eyebrow: X('Кәсіби өсу жолы', 'Путь профессионального роста', 'Career path'), title: X('Педагогтердің біліктілік санаттары', 'Квалификационные категории педагогов', 'Teacher qualification categories'), body: ladder + ladderNote }),
      ui.section({ id: 'join', body: ui.banner({ theme: 'languages', icon: 'handshake', eyebrow: X('Бос жұмыс орындары', 'Вакансии', 'Vacancies'), title: X('«Керемет» командасына қосылғыңыз келе ме?', 'Хотите работать в «Керемет»?', 'Would you like to join Keremet?'), text: X('Бос орындар, біліктілік талаптары және өтініш беру тәртібі.', 'Вакансии, квалификационные требования и порядок отклика.', 'Open positions, qualification requirements and how to apply.'), href: href('vacancies'), label: X('Бос орындар', 'Вакансии', 'Vacancies') }) }),
      ui.section({ title: X('Байланысты беттер', 'Связанные страницы', 'Related pages'), body: ui.cards([
        { icon: 'user', href: href('leadership'), title: X('Басшылық', 'Руководство', 'Leadership'), text: X('Директор және орынбасарлар', 'Директор и заместители', 'Director and deputies') },
        { icon: 'target', href: href('self-2'), title: X('Кадрлық әлеует', 'Кадровый потенциал', 'Staffing'), text: X('Өзін-өзі бағалау, 2-бағыт', 'Самооценка, направление 2', 'Self-assessment, area 2') },
        { icon: 'book', href: href('methodical'), title: X('Әдістемелік жұмыс', 'Методическая работа', 'Methodological work'), text: X('Әдістемелік кеңес пен бірлестіктер', 'Методсовет и объединения', 'Methodological council and groups') },
      ], { cols: 3, cls: 'sa-cards' }) }),
    ].join('\n');
  },
};
