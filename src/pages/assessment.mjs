// Education group — Criteria-based assessment and results (ORDER-114 §F items 47, 53).
// Rules: Typical rules of order №125 (ed. of 30.04.2025, text read 24.09.2026); computer testing of grades 4/9:
// chapter 5 of the attestation rules, order №114-НҚ (30.04.2026). Results are school data → pending.
import { actLegal, actRef, joinX, passFail, pendLine } from './curriculum.mjs';

const X = (kz, ru, en) => ({ kz, ru, en });

export default {
  slug: 'assessment',
  group: 'education',
  order: 30,
  title: X('Бағалау және нәтижелер', 'Оценивание и результаты', 'Assessment & results'),
  description: X(
    'Критериалды бағалау (№ 125 қағидалар): қалыптастырушы бағалау, БЖБ, ТЖБ, тоқсандық және жылдық баға; 4-сыныптардың компьютерлік тестілеуі; оқу нәтижелері.',
    'Критериальное оценивание (правила № 125): ФО, СОр, СОч, четвертная и годовая оценка; компьютерное тестирование 4 классов; результаты обучения.',
    'Criteria-based assessment (rules No. 125): formative and summative assessment, term and year grades; grade-4 computer testing; learning results.',
  ),
  lead: X(
    'Мектепте баға қалай қойылады: күнделікті, бөлім және тоқсан бойынша; тоқсандық және жылдық баға қалай шығады; 4-сыныптардың тестілеуі қалай өтеді.',
    'Как в школе ставят оценки: текущие, за раздел и за четверть; как складываются четвертная и годовая; как проходит тестирование 4 классов.',
    'How grading works: everyday, unit and term assessment; how term and year grades are formed; how grade-4 testing works.',
  ),
  styles: ['education'],
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, { ui, L, href }) {
    const ref = (id, label) => actRef(ui, id, lang, label);

    // ------------------------------------------------------------ intro
    const intro = ui.split({
      ratio: '2:1', align: 'center',
      left: `${ui.eyebrow(X('Критериалды бағалау', 'Критериальное оценивание', 'Criteria-based assessment'))}
<h2 class="sec__title">${L(X('Баға — оқу мақсатына жеткенінің өлшемі', 'Оценка — мера достижения целей обучения', 'A grade measures progress towards learning goals'))}</h2>
${ui.tldr({ points: [
        { icon: 'check', text: X('Бағалау критерийлері <strong>алдын ала белгілі</strong> — оқушыға да, ата-анаға да.', 'Критерии оценивания <strong>известны заранее</strong> — и ученику, и родителям.', 'The criteria are <strong>known in advance</strong> to pupils and parents.') },
        { icon: 'target', text: X('Тоқсандық баға үш бөліктен тұрады: <strong>ҚБ 25% · БЖБ 25% · ТЖБ 50%</strong>.', 'Четвертная оценка — из трёх частей: <strong>ФО 25% · СОр 25% · СОч 50%</strong>.', 'The term grade has three parts: <strong>formative 25% · unit 25% · term 50%</strong>.') },
        { icon: 'star', text: X('<strong>1-сыныпта</strong> баға қойылмайды — мұғалім кері байланыс береді.', 'В <strong>1 классе</strong> оценок нет — учитель даёт обратную связь.', 'No grades in <strong>grade 1</strong> — teachers give feedback instead.') },
      ] })}`,
      right: '<!--toc-->',
    });
    const introLead = X(
        'Оқушының жетістігі алдын ала белгілі критерийлер бойынша бағаланады: оқушы да, ата-ана да не бағаланатынын және қалай бағаланатынын біледі. Бағалау тәртібін Оқу-ағарту министрлігінің үлгілік қағидалары белгілейді.',
        'Достижения ученика оцениваются по заранее известным критериям: и ученик, и родители знают, что и как будет оцениваться. Порядок оценивания устанавливают типовые правила Министерства просвещения.',
        'Pupils are assessed against criteria known in advance, so pupils and parents know what is assessed and how. The procedure is set by the Ministry of Education’s standard rules.');
    const grade1 = ui.callout({ type: 'ok', icon: 'star', title: X('1-сынып', '1 класс', 'Grade 1'), text: X('1-сыныпта оқу жетістіктері бағаланбайды (№ 125 қағидалар, 7-т.). Мұғалім ауызша және жазбаша кері байланыс береді.', 'В 1 классе учебные достижения не оцениваются (правила № 125, п. 7). Учитель даёт устную и письменную обратную связь.', 'Grade 1 achievements are not graded (rules No. 125, para. 7). Teachers give oral and written feedback.') });

    // ------------------------------------------------------------ three kinds
    // Layer 2 of the three kinds: only what the visible tiles lack (no second set of cards).
    const kindsExtra = `<ul class="edu-dl">${[
      [X('ҚБ', 'ФО', 'FA'), X('Кері байланыс — дәптерде, күнделікте немесе ауызша; нәтижесі электрондық журналда балл түрінде көрсетілуі мүмкін.', 'Обратная связь — в тетради, дневнике или устно; результат может отражаться в электронном журнале в баллах.', 'Feedback in the notebook, diary or orally; results may appear in the e-journal as points.')],
      [X('БЖБ', 'СОр', 'SAU'), X('Бөлімді (ортақ тақырыпты) аяқтағанда; нысанын (бақылау жұмысы, жоба, эссе, диктант, тест т.б.) мұғалім таңдайды.', 'По завершении раздела (сквозной темы); форму (контрольная, проект, эссе, диктант, тест и др.) выбирает учитель.', 'At the end of a unit (cross-cutting theme); the teacher chooses the format (test, project, essay, dictation…).')],
      [X('ТЖБ', 'СОч', 'SAT'), X('Бір пән бойынша БЖБ мен ТЖБ бір күнде болмайды; тапсырмалар алдын ала әдістемелік бірлестікте талқыланады.', 'СОр и СОч по одному предмету в один день не проводятся; задания заранее обсуждаются на методобъединении.', 'Never on the same day as a unit test in that subject; tasks are reviewed by the subject team beforehand.')],
    ].map(([k, t]) => `<li><b>${L(k)}</b> ${L(t)}</li>`).join('')}</ul>`;

    // ------------------------------------------------------------ formula
    const formula = `<div class="edu-formula" role="img" aria-label="${L(X('Тоқсандық баға: қалыптастырушы бағалау 25%, БЖБ 25%, ТЖБ 50%', 'Четвертная оценка: ФО 25%, СОр 25%, СОч 50%', 'Term grade: formative 25%, unit summative 25%, term summative 50%'))}">
<div class="edu-formula__p"><span class="edu-formula__v">25%</span><span class="edu-formula__k">${L(X('Қалыптастырушы бағалау', 'Формативное оценивание', 'Formative'))}</span><span class="edu-formula__n">${L(X('сабақтағы және үйдегі жұмыс', 'работа на уроке и дома', 'class and homework'))}</span></div>
<div class="edu-formula__p"><span class="edu-formula__v">25%</span><span class="edu-formula__k">${L(X('БЖБ', 'СОр', 'Unit summative'))}</span><span class="edu-formula__n">${L(X('бөлімдер бойынша', 'за разделы', 'per unit'))}</span></div>
<div class="edu-formula__p"><span class="edu-formula__v">50%</span><span class="edu-formula__k">${L(X('ТЖБ', 'СОч', 'Term summative'))}</span><span class="edu-formula__n">${L(X('тоқсан соңындағы жұмыс', 'работа в конце четверти', 'end-of-term work'))}</span></div></div>`;
    const formulaNote = X(
      `<p>№ 125 қағидалар, 28-тармақ. Аптасына 1 сағаттық пәндер бойынша баға жартыжылдыққа қалыптастырушы бағалау мен БЖБ нәтижесі бойынша қойылады. Құжат: ${ref('assess')}.</p>`,
      `Правила № 125, п. 28. По предметам с нагрузкой 1 час в неделю оценка выставляется за полугодие по результатам ФО и СОр. Документ: ${ref('assess')}.</p>`,
      `Rules No. 125, para. 28. For subjects taught 1 hour a week the grade is given per half-year from formative and unit results. Source: ${ref('assess')}.</p>`,
    );

    // ------------------------------------------------------------ scale
    const scale = `<div class="edu-scale" role="table" aria-label="${L(X('Балдарды бағаға ауыстыру шкаласы', 'Шкала перевода баллов в оценки', 'Points-to-grade scale'))}">
${[['0–39%', '2', X('қанағаттанарлықсыз', 'неудовлетворительно', 'unsatisfactory')], ['40–64%', '3', X('қанағаттанарлық', 'удовлетворительно', 'satisfactory')], ['65–84%', '4', X('жақсы', 'хорошо', 'good')], ['85–100%', '5', X('өте жақсы', 'отлично', 'excellent')]]
      .map(([r, g, l]) => `<div class="edu-scale__s" role="row"><span class="edu-scale__g" role="cell">«${g}»</span><span class="edu-scale__l" role="cell">${L(l)}</span><span class="edu-scale__r" role="cell">${r}</span></div>`).join('')}</div>`;
    const scaleNote = X('<p>Жинаған балдың пайызы 2–11 (12) сыныптарда тоқсандық және жылдық бағаға осы шкала бойынша ауыстырылады (№ 125 қағидаларға 1-қосымша).</p>', '<p>Процент набранных баллов во 2–11 (12) классах переводится в четвертную и годовую оценку по этой шкале (приложение 1 к правилам № 125).</p>', '<p>The percentage of points in grades 2–11 (12) is converted to term and year grades on this scale (appendix 1 to rules No. 125).</p>');

    // ------------------------------------------------------------ year & special cases
    const year = ui.steps([
      { title: X('Жылдық баға', 'Годовая оценка', 'Year grade'), text: X('Тоқсандық бағалардың орташа арифметикалық мәні, ең жақын бүтін санға дейін дөңгелектенеді; ол қорытынды баға болып есептеледі.', 'Среднее арифметическое четвертных оценок с округлением до целого; является итоговой.', 'The average of the term grades, rounded to the nearest whole number; it is the final grade.') },
      { title: X('1–2 пәннен «2»', '«2» по 1–2 предметам', 'A “2” in 1–2 subjects'), text: X('Оқу жылы бойынша жиынтық бағалау өткізіледі; қорытынды баға — жылдық баға мен осы жұмыс бағасының орташасы.', 'Проводится суммативное оценивание за учебный год; итоговая оценка — среднее годовой и этой оценки.', 'A year summative test is held; the final grade is the average of the year grade and that test.') },
      { title: X('Қайта «2» алса', 'Повторная «2»', 'Another “2”'), text: X('Жаңа оқу жылы басталғанға дейін қосымша жиынтық бағалау өткізіледі. Одан да «2» алса, оқушы сол сыныпта қайта оқиды.', 'До начала нового учебного года — дополнительное суммативное оценивание. При повторной «2» ученик остаётся на повторный год.', 'An additional test before the new year; a further “2” means repeating the year.') },
      { title: X('3 және одан көп пәннен «2»', '«2» по трём и более предметам', 'A “2” in 3+ subjects'), text: X('Оқушы қайта оқуға қалдырылады. Тоқсандық, жылдық және қорытынды бағаларды қайта қарауға жол берілмейді.', 'Ученик остаётся на повторный год. Пересмотр четвертных, годовых и итоговых оценок не допускается.', 'The pupil repeats the year. Term, year and final grades cannot be revised.') },
    ]);
    const faq = ui.accordion([
      { q: X('Оқушы жиынтық бағалауға келмей қалса?', 'Если ученик пропустил суммативную работу?', 'What if a pupil misses a summative test?'), a: ui.prose(X(
        '<p>Дәлелді себеппен (денсаулығы, жақын туысының қайтыс болуы, жарыстарға, олимпиадаларға, конкурстарға қатысуы, қолайсыз ауа райы) келмеген оқушы жеке кесте бойынша тапсырады. Тоқсан соңына дейін тапсырмаса, журналда «уақытша аттестатталмаған» деп белгіленеді.</p>',
        '<p>Отсутствовавший по уважительной причине (болезнь, смерть близких, участие в соревнованиях, олимпиадах, конкурсах, неблагоприятная погода) сдаёт по индивидуальному графику. Если работа не сдана до конца четверти, в журнале ставится «временно не аттестован».</p>',
        '<p>Pupils absent for a valid reason (illness, bereavement, competitions, olympiads, adverse weather) sit it on an individual schedule. Until then the journal shows “temporarily not assessed”.</p>')) },
      { q: X('Қай пәндерде баллмен бағаланбайды?', 'По каким предметам нет балльной оценки?', 'Which subjects are pass/fail?'), a: ui.prose(passFail()) },
      { q: X('Модерация дегеніміз не?', 'Что такое модерация?', 'What is moderation?'), a: ui.prose(X(
        '<p>Даулы жағдайда педагогикалық кеңестің шешімімен ТЖБ жұмыстары бағалар қойылғанға дейін кемінде 1 күн бұрын қайта тексеріледі; балл жоғарылауы да, төмендеуі де мүмкін (22-т.).</p>',
        '<p>При спорных вопросах по решению педсовета работы СОч перепроверяются не позднее чем за 1 день до выставления оценок; балл может измениться в обе стороны (п. 22).</p>',
        '<p>In disputed cases, by decision of the pedagogical council, term tests are re-checked at least a day before grades are entered; scores may go up or down (para. 22).</p>')) },
      { q: X('Ерекше білім беру қажеттілігі бар балалар қалай бағаланады?', 'Как оцениваются дети с особыми образовательными потребностями?', 'How are children with special educational needs assessed?'), a: ui.prose(X(
        `<p>Мұғалім сараланған және (немесе) жеке тапсырмаларды қолданып, баланың ерекшеліктерін ескере отырып бағалау критерийлеріне өзгерістер енгізеді (15-т.). Толығырақ: <a href="${href('inclusive')}">Инклюзивті білім беру</a>.</p>`,
        `<p>Учитель использует дифференцированные и (или) индивидуальные задания и вносит изменения в критерии оценивания с учётом особенностей ребёнка (п. 15). Подробнее: <a href="${href('inclusive')}">Инклюзивное образование</a>.</p>`,
        `<p>Teachers use differentiated or individual tasks and adapt the criteria to the child (para. 15). More: <a href="${href('inclusive')}">Inclusive education</a>.</p>`)) },
      { q: X('Нәтижелер туралы ата-ана қалай біледі?', 'Как родители узнают о результатах?', 'How do parents learn the results?'), a: ui.prose(X(
        '<p>Жиынтық бағалау нәтижелері оқушы мен ата-анаға қағаз немесе электрондық түрде беріледі (27-т.); жазбаша жұмыстар оқу жылының соңына дейін мектепте сақталады.</p>',
        '<p>Итоги суммативного оценивания предоставляются ученику и родителям в бумажном или электронном формате (п. 27); письменные работы хранятся в школе до конца учебного года.</p>',
        '<p>Summative results are given to pupils and parents on paper or electronically (para. 27); written work is kept at school until the end of the year.</p>')) + ui.pending(lang, X('Мектепте қолданылатын электрондық журнал және оған қосылу тәртібі.', 'Какой электронный журнал использует школа и как к нему подключиться.', 'Which e-journal the school uses and how to access it.')) },
    ]);

    // ------------------------------------------------------------ computer testing (114-НҚ ch. 5)
    const ktStats = ui.stats([
      { icon: 'target', value: '≥ 90%', label: X('Оқушылардың қатысуы', 'Участие обучающихся', 'Pupil participation'), note: X('10 және одан аз оқушы болса — ≥ 80%', 'при 10 и менее учащихся — ≥ 80%', '≥ 80% if 10 pupils or fewer') },
      { icon: 'calendar', value: '30 → 5', label: X('Аттестаттауға дейінгі тестілеу терезесі (күнтізбелік / жұмыс күні)', 'Окно тестирования до аттестации (календарных / рабочих дней)', 'Testing window before attestation (calendar / working days)'), note: X('ерте дегенде 30 күнтізбелік, кеш дегенде 5 жұмыс күні бұрын (49-т.)', 'не ранее чем за 30 календарных и не позднее чем за 5 рабочих дней (п. 49)', 'no earlier than 30 calendar and no later than 5 working days before (para. 49)') },
      { icon: 'check', value: '≥ 40%', label: X('МЖМБС-ға сәйкестік шарты', 'Условие соответствия ГОСО', 'Compliance threshold'), note: X('кемінде «қанағаттанарлық» алған оқушылар үлесі', 'доля учащихся с результатом не ниже «удовлетворительно»', 'share of pupils scoring at least “satisfactory”') },
    ]);
    const ktText = ui.prose(X(
      `<p>Мемлекеттік аттестаттау рәсімінің құрамында 4 және 9-сынып оқушылары ақпараттық-коммуникациялық технологиялар арқылы кешенді тестілеуден өтеді. Тестілеу аттестаттаудан ерте дегенде 30 күнтізбелік күн және кеш дегенде 5 жұмыс күні бұрын өткізіледі (49-т.). Бағалау шкаласы: «өте жақсы» — 85–100%, «жақсы» — 65–84%, «қанағаттанарлық» — 40–64%, «қанағаттанарлықсыз» — 40%-дан төмен; апелляция қарастырылмаған. Өзін-өзі бағалаудың 39-өлшемшарты бойынша 5 балл оң жауаптар үлесі 85–100% болғанда қойылады. Құжат: ${ref('attest')}, 5-тарау.</p>`,
      `<p>В рамках процедуры государственной аттестации обучающиеся 4 и 9 классов проходят комплексное тестирование с применением ИКТ. Тестирование проводится не ранее чем за 30 календарных дней и не позднее чем за 5 рабочих дней до аттестации (п. 49). Шкала: «отлично» — 85–100%, «хорошо» — 65–84%, «удовлетворительно» — 40–64%, «неудовлетворительно» — менее 40%; апелляция не предусмотрена. По критерию 39 самооценки 5 баллов ставится при доле положительных ответов 85–100%. Документ: ${ref('attest')}, глава 5.</p>`,
      `<p>As part of the state attestation of the school, pupils in grades 4 and 9 take a comprehensive computer test, held no earlier than 30 calendar days and no later than 5 working days before the attestation (para. 49). Scale: “excellent” 85–100%, “good” 65–84%, “satisfactory” 40–64%, “unsatisfactory” below 40%; no appeals. Self-assessment criterion 39 scores 5 points at 85–100% correct answers. Source: ${ref('attest')}, chapter 5.</p>`,
    ));
    const ktExempt = ui.callout({ type: 'info', icon: 'shield', title: X('Тестілеуден кім босатылады', 'Кто освобождается от тестирования', 'Who is exempt'), text: `<ul class="bullets"><li>${L(X('ЕББҚ бар балалар — ПМПК қорытындысы бойынша', 'дети с ООП — по заключению ПМПК', 'children with SEN — on a PMPC conclusion'))}</li><li>${L(X('денсаулығы бойынша — ДКК қорытындысымен', 'по состоянию здоровья — по заключению ВКК', 'on health grounds — medical commission conclusion'))}</li><li>${L(X('олимпиадаларға, конкурстар мен жарыстарға қатысушылар', 'участники олимпиад, конкурсов и соревнований', 'those taking part in olympiads, contests and competitions'))}</li></ul>` });
    const ktPending = ({ title: X('4-сыныптардың компьютерлік тестілеу нәтижелері', 'Результаты компьютерного тестирования 4 классов', 'Grade-4 computer-testing results'), note: X('Тестілеу өткізілгеннен кейін жарияланады: өткізілген күні, қатысқан оқушылар үлесі, бағыттар бойынша оң жауаптар үлесі.', 'Публикуются после проведения: дата, доля участвовавших, доля положительных ответов по направлениям.', 'Published after testing: date, participation rate, share of correct answers per area.') });

    // ------------------------------------------------------------ results
    const results = [
      ({ title: X('Үлгерім мен білім сапасы', 'Успеваемость и качество знаний', 'Progress and attainment'), note: X('Соңғы екі оқу жылы мен ағымдағы жылдың тоқсандары бойынша: сыныптар мен пәндер бөлінісінде үлгерім және сапа пайызы.', 'За два последних учебных года и четверти текущего: процент успеваемости и качества по классам и предметам.', 'Last two years and current terms: pass and quality rates by class and subject.') }),
      ({ title: X('Олимпиадалар мен конкурстар', 'Олимпиады и конкурсы', 'Olympiads and competitions'), note: X('Қатысушылар мен жүлдегерлер (оқушының келісімімен), деңгейі, пәні, жылы, растайтын дипломдар.', 'Участники и призёры (с согласия), уровень, предмет, год, подтверждающие дипломы.', 'Participants and winners (with consent), level, subject, year, diplomas.') }),
      ({ title: X('Нәтижелерді талдау', 'Анализ результатов', 'Results analysis'), note: X('БЖБ/ТЖБ нәтижелерінің талдауы және қабылданған шешімдер (әдістемелік бірлестік хаттамалары).', 'Анализ результатов СОр/СОч и принятые решения (протоколы методобъединений).', 'Analysis of summative results and decisions taken (subject team minutes).') }),
    ];

    const finals = ui.callout({ type: 'info', icon: 'graduation', title: X('Қорытынды аттестаттау және ҰБТ', 'Итоговая аттестация и ЕНТ', 'Final attestation and the UNT'), text: X(
      `Қорытынды аттестаттау 9 және 11 (12)-сыныптарды бітірушілер үшін, ал ұлттық бірыңғай тестілеу (ҰБТ) жалпы орта білім беру деңгейін аяқтаған түлектер үшін өткізіледі. Мектеп парақшасында көрсетілген сынып аралығында (0–6) олар өткізілмейді, сондықтан бұл бөлімде олардың нәтижелері жоқ. Мерзімдері: <a href="${href('schedule')}#calendar">Академиялық күнтізбе</a>, ${ref('calendar', '№ 213-НҚ бұйрық')}. Олимпиадалар мен конкурстардың нәтижелері расталған соң төменде жарияланады.`,
      `Итоговая аттестация проводится для выпускников 9 и 11 (12) классов, а единое национальное тестирование (ЕНТ) — для выпускников, завершивших общее среднее образование. При указанном на странице школы диапазоне классов (0–6) они не проводятся, поэтому их результатов в этом разделе нет. Сроки: <a href="${href('schedule')}#calendar">Академический календарь</a>, ${ref('calendar', 'приказ № 213-НҚ')}. Результаты олимпиад и конкурсов публикуются ниже после подтверждения.`,
      `Final attestation is held for school leavers in grades 9 and 11 (12), and the Unified National Test (UNT) for those completing upper-secondary education. Neither takes place within the grade range stated by the school (0–6), so no such results appear here. Dates: <a href="${href('schedule')}#calendar">Academic calendar</a>, ${ref('calendar', 'Order No. 213-NK')}. Olympiad and competition results will be published below once verified.`) });

    const related = ui.linkList([
      { href: href('curriculum'), icon: 'grid', label: X('Оқу жоспары мен бағдарламалар', 'Учебный план и программы', 'Curriculum & programmes') },
      { href: href('methodical'), icon: 'bulb', label: X('Әдістемелік жұмыс', 'Методическая работа', 'Methodological work'), note: X('Мектепішілік бақылау', 'Внутришкольный контроль', 'Internal quality control') },
      { href: href('self-8'), icon: 'star', label: X('Өзін-өзі бағалау: компьютерлік тестілеу', 'Самооценка: компьютерное тестирование', 'Self-assessment: computer testing') },
      { href: href('inclusive'), icon: 'heart', label: X('Инклюзивті білім беру', 'Инклюзивное образование', 'Inclusive education') },
    ]);
    const toc = ui.toc([
      { id: 'kinds', label: X('Бағалау түрлері', 'Виды оценивания', 'Types of assessment') },
      { id: 'formula', label: X('Тоқсандық баға қалай шығады', 'Как выводится четвертная оценка', 'How the term grade is formed') },
      { id: 'year', label: X('Жылдық және қорытынды баға', 'Годовая и итоговая оценка', 'Year and final grades') },
      { id: 'kt', label: X('4-сыныптың компьютерлік тестілеуі', 'Компьютерное тестирование 4 класса', 'Grade-4 computer testing') },
      { id: 'results', label: X('Оқу нәтижелері', 'Результаты обучения', 'Learning results') },
    ]);

    // ------------------------------------------------------------ layer 1 visuals
    // Three kinds of assessment as cards with 2–3 key facts each (the full wording sits in "Подробнее").
    const kind = (ic, tag, title, facts) => `<li class="edu-kind"><div class="edu-kind__top"><span class="edu-kind__ic" aria-hidden="true">${ui.icon(ic, { size: 22 })}</span><span class="edu-kind__tag">${L(tag)}</span></div><h3 class="edu-kind__t">${L(title)}</h3><ul class="edu-kind__f" role="list">${facts.map((f) => `<li>${L(f)}</li>`).join('')}</ul></li>`;
    const kindsVis = `<ul class="edu-kinds" role="list">${[
      kind('chat', X('ҚБ', 'ФО', 'FA'), X('Қалыптастырушы бағалау', 'Формативное оценивание', 'Formative assessment'), [X('күнделікті сабақта және үй жұмысында', 'каждый урок и домашняя работа', 'every lesson and homework'), X('ауызша немесе жазбаша кері байланыс', 'устная или письменная обратная связь', 'oral or written feedback')]),
      kind('target', X('БЖБ', 'СОр', 'SAU'), X('Бөлім бойынша жиынтық бағалау', 'Суммативное оценивание за раздел', 'Summative assessment for a unit'), [X('бөлім соңында', 'в конце раздела', 'at the end of a unit'), X('тоқсанына 3 реттен артық емес', 'не более 3 раз в четверть', 'no more than 3 per term'), X('1–4-сыныптарда ең жоғары балл 7–15', 'в 1–4 классах максимум 7–15 баллов', 'grades 1–4: 7–15 points max')]),
      kind('trophy', X('ТЖБ', 'СОч', 'SAT'), X('Тоқсан бойынша жиынтық бағалау', 'Суммативное оценивание за четверть', 'Summative assessment for a term'), [X('тоқсан соңында', 'в конце четверти', 'at the end of the term'), X('бір күнде үштен артық емес', 'не более трёх в день', 'no more than three a day'), X('тоқсанның соңғы күні емес', 'не в последний день четверти', 'never on the last day of term')]),
    ].join('')}</ul>`;
    const kindsMore = ui.more({ label: X('Бағалау түрлері туралы толығырақ', 'Подробнее о видах оценивания', 'More about the types of assessment'), icon: 'book', tone: 'plain', body: ui.lead(introLead) + ui.prose(X(
        '<p>Оқу жетістіктері <strong>қалыптастырушы</strong> және <strong>жиынтық</strong> бағалау түрінде бағаланады. 2–11-сынып оқушыларына қалыптастырушы бағалау, БЖБ және ТЖБ нәтижелері бойынша балл қойылады, олар тоқсандық бағаны шығаруда ескеріледі.</p>',
        '<p>Учебные достижения оцениваются в форме <strong>формативного</strong> и <strong>суммативного</strong> оценивания. Обучающимся 2–11 классов по результатам ФО, СОр и СОч выставляются баллы, которые учитываются в четвертной оценке.</p>',
        '<p>Achievement is assessed through <strong>formative</strong> and <strong>summative</strong> assessment. Pupils in grades 2–11 receive points for formative work, unit and term tests, which feed the term grade.</p>')) + kindsExtra + grade1 });
    // Year-end: the escalation as four compact tiles; the exact rules under "Правила подробно".
    const ladder = `<ol class="edu-ladder" role="list">${[
      [X('Жылдық баға', 'Годовая оценка', 'Year grade'), X('тоқсандық бағалардың орташасы', 'среднее четвертных оценок', 'average of the term grades')],
      [X('1–2 пәннен «2»', '«2» по 1–2 предметам', 'A “2” in 1–2 subjects'), X('оқу жылы бойынша жиынтық бағалау', 'суммативная работа за год', 'a year summative test')],
      [X('Қайта «2» алса', 'Повторная «2»', 'Another “2”'), X('жаңа оқу жылына дейін қосымша жұмыс', 'доп. работа до нового учебного года', 'an extra test before the new year')],
      [X('3 және одан көп пәннен «2»', '«2» по трём и более предметам', 'A “2” in 3+ subjects'), X('қайта оқу', 'повторный год', 'repeating the year')],
    ].map(([t, r]) => `<li><b>${L(t)}</b><span>${L(r)}</span></li>`).join('')}</ol>`;
    const yearMore = ui.more({ label: X('Ережелер толығырақ', 'Правила подробно', 'The rules in full'), icon: 'doc', count: 4, tone: 'card', body: year });

    return [
      intro.replace('<!--toc-->', toc),
      ui.section({ id: 'kinds', eyebrow: X('Баға қалай қойылады', 'Как ставят оценки', 'How grading works'), title: X('Бағалаудың үш түрі', 'Три вида оценивания', 'Three types of assessment'), body: kindsVis + kindsMore }),
      ui.section({ id: 'formula', tone: 'physics', eyebrow: X('Тоқсандық баға', 'Четвертная оценка', 'Term grade'), title: X('Тоқсандық баға қалай шығады', 'Как выводится четвертная оценка', 'How the term grade is formed'), body: formula + `<h3>${L(X('Балдан бағаға', 'Из баллов — в оценку', 'From points to a grade'))}</h3>` + scale + `<div class="dz-row">${ui.legal(joinX(formulaNote, scaleNote))}</div>` }),
      ui.section({ id: 'year', eyebrow: X('Оқу жылының қорытындысы', 'Итоги учебного года', 'End of year'), title: X('Жылдық және қорытынды баға', 'Годовая и итоговая оценка', 'Year and final grades'), body: ladder + yearMore + `<h3>${L(X('Жиі қойылатын сұрақтар', 'Частые вопросы', 'Frequently asked questions'))}</h3>` + faq }),
      ui.section({ id: 'kt', eyebrow: X('Мемлекет мектепті қалай тексереді', 'Как государство проверяет школу', 'How the state checks the school'), title: X('4-сыныптардың компьютерлік тестілеуі', 'Компьютерное тестирование 4 классов', 'Computer testing in grade 4'), body: ktStats + `<div class="dz-row">${ui.more({ label: X('Тестілеу қалай өтеді', 'Как проходит тестирование', 'How the testing works'), icon: 'target', tone: 'card', body: ktText })}${ui.more({ label: X('Кім босатылады', 'Кто освобождается', 'Who is exempt'), icon: 'shield', count: 3, tone: 'card', body: ktExempt })}${pendLine(ui, lang, { items: [ktPending] })}</div>` }),
      ui.section({ id: 'results', tone: 'hero', eyebrow: X('Жетістіктер', 'Достижения', 'Achievements'), title: X('Оқу нәтижелері', 'Результаты обучения', 'Learning results'), lead: X('Нәтижелер расталған деректер бойынша ғана жарияланады.', 'Результаты публикуются только по подтверждённым данным.', 'Results are published only from verified data.'), body: `<div class="dz-row">${ui.more({ label: X('Қорытынды аттестаттау және ҰБТ', 'Итоговая аттестация и ЕНТ', 'Final attestation and the UNT'), icon: 'graduation', tone: 'card', body: finals })}${pendLine(ui, lang, { items: results })}${actLegal(ui, ['assess', 'attest', 'calendar', 'goso'], lang, { id: 'acts' })}</div>` }),
      ui.section({ title: X('Осы бөлімде', 'В этом разделе', 'In this section'), body: related }),
    ].join('\n');
  },
};
