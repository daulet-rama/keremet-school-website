// Education group — Inclusive education & special educational needs (ORDER-114 §F item 49).
// Rules of the psych-ped support service: order №92 (29.04.2025, ed. №144-НҚ of 29.05.2026); SEN assessment: order №4;
// PMPC state service: order №223. Texts read 24.09.2026. Building accessibility: 2GIS (school.mjs).
import { actItems, actRef, checkedNote } from './curriculum.mjs';

const X = (kz, ru, en) => ({ kz, ru, en });

export default {
  slug: 'inclusive',
  group: 'education',
  order: 50,
  title: X('Инклюзивті білім беру', 'Инклюзивное образование', 'Inclusive education'),
  description: X(
    'Ерекше білім беру қажеттілігі бар балаларды қолдау: психологиялық-педагогикалық қолдау қызметі, жеке бағдарламалар, ПМПК ұсынымдары, кедергісіз орта.',
    'Поддержка детей с особыми образовательными потребностями: служба психолого-педагогического сопровождения, индивидуальные программы, ПМПК, доступная среда.',
    'Support for children with special educational needs: the psychological and pedagogical support service, individual programmes, PMPC, accessible building.',
  ),
  styles: ['education'],
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, { ui, S, L, href, docById }) {
    const ref = (id, label) => actRef(ui, id, lang, label);
    const B = S.building;

    // ------------------------------------------------------------ intro
    const intro = ui.split({
      ratio: '3:2', align: 'center',
      left: `${ui.eyebrow(X('Әр балаға — өз жолы', 'Каждому ребёнку — свой путь', 'A path for every child'))}
<h2 class="sec__title">${L(X('Мектеп балаға бейімделеді', 'Школа подстраивается под ребёнка', 'The school adapts to the child'))}</h2>
${ui.lead(X(
        'Ерекше білім беру қажеттіліктері (ЕББҚ) бар балалар — білім алу үшін тұрақты немесе уақытша арнайы жағдайларды қажет ететін балалар. Бұл тек мүмкіндігі шектеулі балалар ғана емес: мінез-құлық пен эмоциялық қиындықтар, тілдік, әлеуметтік немесе мәдени кедергілер де ЕББҚ-ға жатады.',
        'Дети с особыми образовательными потребностями (ООП) — это дети, которым постоянно или временно нужны специальные условия для получения образования. Это не только дети с ограниченными возможностями: к ООП относятся и поведенческие и эмоциональные трудности, языковые, социальные или культурные барьеры.',
        'Children with special educational needs (SEN) need special conditions for learning, permanently or for a time. This covers not only disability but also behavioural and emotional difficulties and language, social or cultural barriers.'))}
<p class="edu-src">${L(X('Анықтамалар: ', 'Определения: ', 'Definitions: '))}${ref('sppc')}</p>`,
      right: '<!--toc-->',
    });

    const access = ui.stats([
      { icon: 'accessible', value: X('Бар', 'Есть', 'Yes'), label: X('Пандус', 'Пандус', 'Ramp'), note: X('мектеп нақтылап жатыр', 'уточняется школой', 'being confirmed by the school') },
      { icon: 'home', value: X('Бар', 'Есть', 'Yes'), label: X('Кедергісіз кіреберіс', 'Доступный вход', 'Step-free entrance'), note: X('мектеп нақтылап жатыр', 'уточняется школой', 'being confirmed by the school') },
      { icon: 'parking', value: String(B.parking), label: X('орындық автотұрақ', 'мест на парковке', 'parking spaces'), note: X('мектеп жанында', 'у школы', 'by the school') },
      { icon: 'building', value: String(B.floors), label: X('қабатты ғимарат', 'этажа в здании', 'storeys'), note: X('толық сипаттамасы төменде', 'подробности ниже', 'details below') },
    ]);

    // ------------------------------------------------------------ who needs support
    const who = ui.cards([
      { icon: 'heart', title: X('Мінез-құлық пен эмоциялық қиындықтар', 'Поведенческие и эмоциональные трудности', 'Behavioural and emotional difficulties'), text: X('Жағымсыз психологиялық факторлар, бейімделудегі қиындықтар.', 'Неблагоприятные психологические факторы, трудности адаптации.', 'Adverse psychological factors, difficulties adapting.') },
      { icon: 'languages', title: X('Әлеуметтік, тілдік, мәдени кедергілер', 'Социальные, языковые, культурные барьеры', 'Social, language and cultural barriers'), text: X('Оқыту тілін жетік білмеу, отбасының экономикалық жағдайы, көшіп келу.', 'Недостаточное владение языком обучения, экономическое положение семьи, переезд.', 'Limited command of the language of instruction, family hardship, relocation.') },
      { icon: 'accessible', title: X('Мүмкіндіктері шектеулі балалар', 'Дети с ограниченными возможностями', 'Children with disabilities'), text: X('ПМПК қорытындысы мен ұсынымдары негізінде арнайы психологиялық-педагогикалық қолдау.', 'Специальная психолого-педагогическая поддержка на основе заключения и рекомендаций ПМПК.', 'Special support based on the PMPC’s conclusion and recommendations.') },
    ], { cols: 3 });

    // ------------------------------------------------------------ three levels
    const levels = `<div class="edu-3lvl">${[
      [X('Сынып деңгейі', 'Уровень класса', 'Class level'), X('Мұғалім оқыту мен тәрбиеде жеке және сараланған тәсілді қолданады.', 'Учитель применяет индивидуальный и дифференцированный подходы в обучении и воспитании.', 'The teacher uses individual and differentiated approaches.')],
      [X('Қолдау қызметі мамандарының деңгейі', 'Уровень специалистов службы', 'Support-service level'), X('Педагог-психолог, әлеуметтік педагог, арнайы педагог жеке дамыту және түзету-дамыту бағдарламаларымен жұмыс істейді.', 'Педагог-психолог, социальный педагог, специальный педагог работают по индивидуально развивающим и коррекционно-развивающим программам.', 'Psychologist, social pedagogue and special-needs teacher run individual and corrective programmes.')],
      [X('Ұйым деңгейі', 'Уровень организации', 'School level'), X('Тар бейінді мамандар (сурдопедагог, тифлопедагог) тартылады, мүдделі органдармен өзара іс-қимыл жасалады.', 'Привлекаются узкие специалисты (сурдопедагог, тифлопедагог), взаимодействие с заинтересованными органами.', 'Specialists (teachers of the deaf or blind) are involved, with partner agencies.')],
    ].map(([t, s], i) => `<div style="--i:${i}"><b>${i + 1}</b><p><strong>${L(t)}</strong>${L(s)}</p></div>`).join('')}</div>`;
    const levelsNote = ui.note(X(`Қолдаудың үш деңгейі — ${ref('sppc', '№ 92 қағидалар, 10-т.')}.`, `Три уровня сопровождения — ${ref('sppc', 'правила № 92, п. 10')}.`, `Three levels of support — ${ref('sppc', 'rules No. 92, para. 10')}.`));

    // ------------------------------------------------------------ algorithm
    const algo = ui.steps([
      { title: X('Мұғалім байқайды', 'Учитель замечает', 'The teacher notices'), text: X('Сабақтағы бақылау мен критериалды бағалау негізінде қиындықты анықтап, жеке көмек көрсетеді.', 'По наблюдению на уроках и критериальному оцениванию выявляет трудности и оказывает индивидуальную помощь.', 'Through observation and assessment, identifies difficulties and helps individually.') },
      { title: X('Қызметке хабарлайды', 'Сообщает в службу', 'Informs the service'), text: X('Қиындық тоқсан бойы сақталса, қолдау қызметін үйлестіретін орынбасарға жазбаша хабарлайды.', 'Если трудность сохраняется в течение четверти — письменно информирует заместителя, курирующего службу.', 'If it persists for a term, informs the deputy head in writing.') },
      { title: X('Тереңдетілген зерттеу', 'Углублённое изучение', 'In-depth study'), text: X('Қызмет мамандары мұғалімдермен бірге себептерді алқалы түрде талқылап, ата-анаға түсіндіреді.', 'Специалисты вместе с учителями коллегиально разбирают причины и информируют родителей.', 'Specialists and teachers review the causes together and inform parents.') },
      { title: X('Жеке қолдау бағдарламасы', 'Индивидуальная программа поддержки', 'Individual support plan'), text: X('Жеке психологиялық-педагогикалық қолдау бағдарламасы ата-анамен келісіліп, 1–3 тоқсан бойы жүзеге асырылады.', 'Индивидуальная программа психолого-педагогического сопровождения согласуется с родителями и реализуется 1–3 четверти.', 'A plan agreed with parents, delivered over 1–3 terms.') },
      { title: X('Мониторинг', 'Мониторинг', 'Monitoring'), text: X('Әр тоқсан соңында нәтиже бағаланады, келесі тоқсанның көлемі жоспарланады.', 'По итогам каждой четверти оценивается результат и планируется объём на следующую.', 'Results are reviewed each term and the next term planned.') },
      { title: X('Қажет болса — ПМПК', 'При необходимости — ПМПК', 'If needed — PMPC'), text: X('Қиындықтар еңсерілмесе, ата-анаға ПМПК-ға жүгіну ұсынылады; оның ұсынымдары бойынша бағдарлама өзгертіледі.', 'Если трудности не преодолены, родителям рекомендуется обратиться в ПМПК; по её рекомендациям программа корректируется.', 'If difficulties remain, parents are advised to consult the PMPC; the plan is updated to its recommendations.') },
    ], { cls: 'edu-steps-3' });
    const consent = ui.callout({ type: 'warn', icon: 'lock', title: X('Ата-ананың жазбаша келісімі', 'Письменное согласие родителей', 'Written parental consent'), text: X(
      'Психологиялық диагностика, кеңес беру және тренингтер тек ата-ананың немесе заңды өкілдің жазбаша келісімімен өткізіледі (№ 92 қағидалар, 12-т.). Бала туралы ақпарат құпия сақталады.',
      'Психологическая диагностика, консультирование и тренинги проводятся только с письменного согласия родителей или законных представителей (правила № 92, п. 12). Информация о ребёнке конфиденциальна.',
      'Psychological diagnostics, counselling and training take place only with written consent of parents or guardians (rules No. 92, para. 12). Information about the child is confidential.') });

    // ------------------------------------------------------------ adaptations
    const adapt = ui.cards([
      { icon: 'book', title: X('Бейімделген бағдарламалар', 'Адаптированные программы', 'Adapted programmes'), text: X('Жалпы білім беретін бағдарламаларды бейімдеу, жеке оқу жоспарлары мен бағдарламалар.', 'Адаптация общеобразовательных программ, индивидуальные учебные планы и программы.', 'Adapted curricula, individual study plans and programmes.') },
      { icon: 'target', title: X('Бағалаудың өзгертілген тәсілдері', 'Изменённые способы оценивания', 'Adapted assessment'), text: X(`Сараланған және жеке тапсырмалар, бейімделген критерийлер (${ref('assess', '№ 125 қағидалар, 15-т.')}).`, `Дифференцированные и индивидуальные задания, адаптированные критерии (${ref('assess', 'правила № 125, п. 15')}).`, `Differentiated tasks and adapted criteria (${ref('assess', 'rules No. 125, para. 15')}).`) },
      { icon: 'hourglass', title: X('Икемді әдістер', 'Гибкие методы', 'Flexible methods'), text: X('Тапсырма көлемін азайту, орындау уақытын ұзарту немесе қысқарту, нұсқауларды жеңілдету.', 'Уменьшение объёма заданий, увеличение или сокращение времени, упрощение инструкций.', 'Fewer tasks, more or less time, simpler instructions.') },
      { icon: 'user', title: X('Педагог-ассистент', 'Педагог-ассистент', 'Teaching assistant'), text: X('Қолдау қызметінің шешімімен бір тоқсанға жеке сүйемелдеу; одан әрі қажеттілікті ПМПК анықтайды.', 'По решению службы — индивидуальное сопровождение на одну четверть; дальнейшую потребность определяет ПМПК.', 'By decision of the service, one-to-one support for a term; the PMPC decides on further need.') },
      { icon: 'accessible', title: X('Кедергісіз орта', 'Безбарьерная среда', 'Barrier-free environment'), text: X('Пандустар, тұтқалар, арнайы жабдықталған оқу орны, ортақ пайдаланылатын орындарды бейімдеу.', 'Пандусы, поручни, специально оборудованное учебное место, адаптация мест общего пользования.', 'Ramps, handrails, adapted desks and shared spaces.') },
      { icon: 'star', title: X('Сынақтардан босату', 'Освобождение от тестирования', 'Exemptions'), text: X('ПМПК қорытындысы бар балалар 4-сыныптың компьютерлік тестілеуінен босатылады (№ 114-НҚ, 55-т.).', 'Дети с заключением ПМПК освобождаются от компьютерного тестирования 4 класса (№ 114-НҚ, п. 55).', 'Children with a PMPC conclusion are exempt from grade-4 computer testing (No. 114-NK, para. 55).') },
    ], { cols: 3 });

    // ------------------------------------------------------------ PMPC
    const pmpk = ui.split({
      ratio: '3:2',
      left: ui.prose(X(
        `<p><strong>Психологиялық-медициналық-педагогикалық консультация (ПМПК)</strong> баланы тексеріп, оның ерекше білім беру қажеттіліктерін бағалайды және оқыту жағдайлары бойынша ұсынымдар береді. Бұл — мемлекеттік қызмет: «Мүмкіндіктері шектеулі балаларды психологиялық-медициналық-педагогикалық тексеру және оларға консультациялық көмек көрсету». Өтінішті ПМПК кеңсесі немесе ${ui.extLink('https://egov.kz/', 'egov.kz')} порталы арқылы беруге болады (${ref('pmpk', '№ 223 бұйрық')}).</p><p>ПМПК қорытындысы ата-ананың қолында болады; мектеп оның ұсынымдарын ата-ана ұсынған кезде ескереді.</p>`,
        `<p><strong>Психолого-медико-педагогическая консультация (ПМПК)</strong> обследует ребёнка, оценивает его особые образовательные потребности и даёт рекомендации по условиям обучения. Это государственная услуга «Обследование и оказание психолого-медико-педагогической консультативной помощи детям с ограниченными возможностями». Обратиться можно через канцелярию ПМПК или портал ${ui.extLink('https://egov.kz/', 'egov.kz')} (${ref('pmpk', 'приказ № 223')}).</p><p>Заключение ПМПК остаётся у родителей; школа учитывает его рекомендации, когда родители их предоставят.</p>`,
        `<p>The <strong>psychological, medical and pedagogical consultation (PMPC)</strong> examines the child, assesses special educational needs and recommends learning conditions. It is a state service (“Examination and PMPC counselling of children with disabilities”), requested at the PMPC office or via ${ui.extLink('https://egov.kz/', 'egov.kz')} (${ref('pmpk', 'Order No. 223')}).</p><p>Parents keep the PMPC conclusion; the school follows its recommendations once parents share them.</p>`)),
      right: ui.callout({ type: 'info', icon: 'medical', title: X('1-сыныпта қайта оқу', 'Повторный год в 1 классе', 'Repeating grade 1'), text: X('1-сынып оқушылары қайта оқуға қалдырылмайды; ерекшелік — ата-ананың өтінішімен ПМПК қорытындысы бойынша ұсынылған жағдай (№ 125 қағидалар, 29-т.).', 'Первоклассники не оставляются на повторный год, кроме случаев, когда это рекомендовано заключением ПМПК по заявлению родителей (правила № 125, п. 29).', 'Grade-1 pupils do not repeat the year unless a PMPC conclusion recommends it at the parents’ request (rules No. 125, para. 29).') }),
    });

    // ------------------------------------------------------------ Keremet (pending)
    const keremet = ui.grid({ cols: 2, items: [
      ui.pending({ title: X('Мектептегі қолдау қызметі', 'Служба сопровождения в школе', 'The school’s support service'), note: X('Қызмет құрамы (директор бекіткен бұйрық), мамандар: педагог-психолог, әлеуметтік педагог, логопед, арнайы педагог, педагог-ассистент — бар болса; қабылдау кестесі.', 'Состав службы (приказ директора), специалисты: педагог-психолог, социальный педагог, логопед, специальный педагог, педагог-ассистент — при наличии; график приёма.', 'Service membership (director’s order) and specialists — psychologist, social pedagogue, speech therapist, special-needs teacher, assistant, if any; consultation hours.') }),
      ui.pending({ title: X('ЕББҚ бар оқушылар және жеке бағдарламалар', 'Обучающиеся с ООП и индивидуальные программы', 'Pupils with SEN and individual plans'), note: X('Жеке деректерсіз жалпы мәлімет: ЕББҚ бар оқушылар саны, әзірленген ЖПҚБ саны, ПМПК ұсынымдарының орындалуы.', 'Обобщённо, без персональных данных: число обучающихся с ООП, количество ИППС, выполнение рекомендаций ПМПК.', 'Aggregate data only: number of pupils with SEN, individual plans, implementation of PMPC recommendations.') }),
      ui.pending({ title: X('Кедергісіз орта: толық сипаттама', 'Доступная среда: полное описание', 'Accessibility: full description'), note: X('Пандус пен кіреберістен басқа: бейімделген дәретхана, тұтқалар, жарықтандыру, мүмкіндігі шектеулі жандарға арналған тұрақ орны, көмек көрсететін жауапты қызметкер.', 'Помимо пандуса и входа: адаптированный санузел, поручни, освещение, парковочное место для людей с инвалидностью, ответственный сотрудник для помощи.', 'Beyond the ramp: adapted toilet, handrails, lighting, disabled parking bay, a staff member to assist.') }),
      ui.docList([
        docById('spps-order'),
        docById('spps-plan'),
      ]),
    ] });

    // ------------------------------------------------------------ help
    const help = ui.split({
      ratio: '1:1',
      left: ui.panel({ theme: 'physics', body: `<p class="edu-chain__t">${L(X('Сенім телефондары', 'Телефоны доверия', 'Helplines'))}</p><ul class="edu-help" role="list">${S.helplines.map((h) => `<li><a class="edu-help__n" href="tel:${h.number}">${h.number}</a><span>${L(h.label)}</span></li>`).join('')}</ul>` }),
      right: ui.linkList([
        { href: href('psychology'), icon: 'heart', label: X('Психологиялық қызмет', 'Психологическая служба', 'Psychological service'), note: X('Буллингтің алдын алу, кеңес беру', 'Профилактика буллинга, консультации', 'Anti-bullying, counselling') },
        { href: href('facilities'), icon: 'building', label: X('Ғимарат және кедергісіз орта', 'Здание и доступная среда', 'Building & accessibility') },
        { href: href('assessment'), icon: 'target', label: X('Бағалау', 'Оценивание', 'Assessment') },
        { href: href('feedback'), icon: 'chat', label: X('Сұрақ қою', 'Задать вопрос', 'Ask a question') },
      ]),
    });

    const toc = ui.toc([
      { id: 'who', label: X('Кімге қолдау қажет', 'Кому нужна поддержка', 'Who needs support') },
      { id: 'levels', label: X('Қолдау қалай ұйымдастырылады', 'Как организовано сопровождение', 'How support works') },
      { id: 'adapt', label: X('Оқытудағы бейімдеулер', 'Адаптации в обучении', 'Adaptations') },
      { id: 'pmpk', label: X('ПМПК', 'ПМПК', 'PMPC') },
      { id: 'keremet', label: X('«Керемет» мектебінде', 'В школе «Керемет»', 'At Keremet') },
      { id: 'help', label: X('Көмек', 'Помощь', 'Help') },
    ]);

    return [
      intro.replace('<!--toc-->', toc),
      access,
      ui.section({ id: 'who', eyebrow: X('Ерекше білім беру қажеттіліктері', 'Особые образовательные потребности', 'Special educational needs'), title: X('Кімге қолдау қажет', 'Кому нужна поддержка', 'Who needs support'), body: ui.prose(X(
        '<p>Психологиялық-педагогикалық қолдау ерекше білім беру қажеттіліктерін бағалау нәтижесі бойынша көрсетіледі. Бағалау тәртібін ерекше білім беру қажеттіліктерін бағалау қағидалары белгілейді.</p>',
        '<p>Психолого-педагогическое сопровождение оказывается по результатам оценки особых образовательных потребностей, порядок которой устанавливают правила оценки ООП.</p>',
        '<p>Support is provided after an assessment of special educational needs carried out under the SEN assessment rules.</p>')) + who }),
      ui.section({ id: 'levels', tone: 'physics', eyebrow: X('Психологиялық-педагогикалық қолдау қызметі', 'Служба психолого-педагогического сопровождения', 'Support service'), title: X('Қолдау қалай ұйымдастырылады', 'Как организовано сопровождение', 'How support is organised'), body: levels + levelsNote + `<h3>${L(X('Қадамдар', 'Шаги', 'Steps'))}</h3>` + algo }),
      consent,
      ui.section({ id: 'adapt', eyebrow: X('Арнайы жағдайлар', 'Специальные условия', 'Special conditions'), title: X('Оқытудағы бейімдеулер', 'Адаптации в обучении', 'Adaptations in learning'), body: adapt }),
      ui.section({ id: 'pmpk', eyebrow: X('Мемлекеттік қызмет', 'Государственная услуга', 'State service'), title: X('Психологиялық-медициналық-педагогикалық консультация', 'Психолого-медико-педагогическая консультация', 'PMPC consultation'), body: pmpk }),
      ui.section({ id: 'keremet', eyebrow: X('Мектептің деректері', 'Данные школы', 'School data'), title: X('«Керемет» мектебінде', 'В школе «Керемет»', 'At Keremet'), body: keremet }),
      ui.section({ id: 'help', title: X('Көмек және байланыс', 'Помощь и контакты', 'Help and contacts'), body: help }),
      ui.section({ eyebrow: 'adilet.zan.kz', title: X('Құқықтық негіз', 'Правовая основа', 'Legal basis'), body: ui.linkList(actItems(['law', 'sppc', 'oop', 'pmpk', 'assess'], lang)) + ui.note(checkedNote) }),
    ].join('\n');
  },
};
