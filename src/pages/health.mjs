// Health care — ORDER-114 §H item 60 (medical room, licence or contract with a medical organisation).
// Legal basis read on 24.09.2026:
// · Standard of medical care in secondary education organisations — order of the acting Minister of Health
//   No. 37 of 14.03.2023 (V2300032069): separate medical room (п.3), care by the attached primary-care
//   organisation's nurses (п.9–10), nurse's functions incl. vaccination with parents' informed consent
//   and first/emergency aid (п.14), emergency aid without consent when life is at risk, parents informed (п.15);
// · Government decree No. 612 of 24.09.2020 (P2000000612) — mandatory vaccinations;
// · Sanitary rules ҚР ДСМ-76 (V2100023890) — isolating a pupil who falls ill until parents arrive.
// School-specific facts (nurse, room, contract) are all pending.
const X = (kz, ru, en) => ({ kz, ru, en });

export default {
  slug: 'health',
  group: 'campus',
  order: 40,
  title: { kz: 'Медициналық қызмет', ru: 'Медицинское обслуживание', en: 'Health care' },
  description: {
    kz: 'Мектептегі медициналық қызмет: медициналық кабинет, медбике, екпелер, бала ауырып қалса не істеу керек, шұғыл нөмірлер.',
    ru: 'Медицинское обслуживание в школе: медкабинет, медсестра, прививки, что делать, если ребёнок заболел, экстренные номера.',
    en: 'Health care at school: the medical room, the nurse, vaccinations, what to do if your child is ill, and emergency numbers.',
  },
  styles: ['campus'],
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, { ui, S, L, t, href, docById }) {
    const wait = ui.badge(t('unconfirmed'), 'warn');
    const docWait = ui.badge(t('doc.pending'), 'warn');
    const adilet = (code) => `https://adilet.zan.kz/${lang === 'kz' ? 'kaz' : 'rus'}/docs/${code}`;
    // Per-item disclosure cards (campus.css .lf-pd): title visible, explanation opens inside the same card.
    const pd = (items, { num = false, one = false } = {}) => `<${num ? 'ol' : 'ul'} class="lf-pd${one ? ' lf-pd--1' : ''}" role="list">${items.map((it, i) => `<li><details class="lf-pd__d"><summary class="lf-pd__s">${num ? `<span class="lf-pd__n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>` : it.icon ? `<span class="lf-pd__ic" aria-hidden="true">${ui.icon(it.icon, { size: 22 })}</span>` : ''}<span class="lf-pd__t"><span class="lf-pd__h">${L(it.title)}</span></span><span class="lf-pd__chev" aria-hidden="true"></span></summary><div class="lf-pd__b"><p>${L(it.text)}</p></div></details></li>`).join('')}</${num ? 'ol' : 'ul'}>`;
    const egov = (path) => `https://egov.kz/cms/${lang === 'kz' ? 'kk' : lang}/${path}`;
    const stdDat = ui.extLink(adilet('V2300032069'), X('медициналық көмек көрсету стандарты', 'стандарту оказания медицинской помощи', 'standard of medical care'));
    const std = ui.extLink(adilet('V2300032069'), X('медициналық көмек көрсету стандарты', 'стандарт оказания медицинской помощи', 'standard of medical care'));

    // ------------------------------------------------------------------ intro
    const model = ui.panel({
      theme: 'biology',
      cls: 'cmp-svc-panel',
      body: `<ul class="cmp-rubric" role="list">
<li>${ui.icon('medical', { size: 20 })}<span class="cmp-rubric__t">${L(X('Жеке медициналық кабинет', 'Отдельный медицинский кабинет', 'A separate medical room'))}</span>${wait}</li>
<li>${ui.icon('user', { size: 20 })}<span class="cmp-rubric__t">${L(X('Медбике — мектеп жұмыс уақытында', 'Медсестра — в часы работы школы', 'A nurse during school hours'))}</span>${wait}</li>
<li>${ui.icon('handshake', { size: 20 })}<span class="cmp-rubric__t">${L(X('Емханамен (МСАК ұйымымен) шарт немесе лицензия', 'Договор с поликлиникой (организацией ПМСП) или лицензия', 'Contract with a primary-care clinic, or a licence'))}</span>${docWait}</li>
</ul>
<div class="dz-row cmp-panel-row">SERVICE_MORE_SLOT${ui.legal(X(`<p>Орта білім беру ұйымдарындағы ${std} бойынша (ҚР ДСМ 14.03.2023 № 37).</p>`, `<p>По ${stdDat} в организациях среднего образования (приказ МЗ РК от 14.03.2023 № 37).</p>`, `<p>Under the ${std} in schools (Health Ministry order No. 37 of 14.03.2023).</p>`))}</div>`,
    });
    const intro = (toc) => ui.split({
      ratio: '1:1', align: 'center',
      left: `${ui.eyebrow(X('Денсаулық', 'Здоровье', 'Health'))}
<h2 class="sec__title">${L(X('Балаңыздың денсаулығы — біздің ортақ қамқорлығымыз', 'Здоровье ребёнка — наша общая забота', 'Your child’s health is our shared concern'))}</h2>
${ui.lead(X(
        'Мектептегі медициналық көмек, екпелер және бала ауырса не істеу керек.',
        'Медпомощь в школе, прививки и что делать, если ребёнок заболел.',
        'Medical care at school, vaccinations, and what to do if your child is ill.',
      ))}`,
      right: toc,
    });

    const toc = ui.toc([
      { id: 'service', label: X('Медициналық қызмет', 'Медицинская служба', 'Medical service') },
      { id: 'nurse', label: X('Медбике не істейді', 'Что делает медсестра', 'What the nurse does') },
      { id: 'ill', label: X('Бала ауырып қалса', 'Если ребёнок заболел', 'If your child is ill') },
      { id: 'vaccination', label: X('Екпелер', 'Прививки', 'Vaccinations') },
      { id: 'tell', label: X('Мектепке не айту керек', 'Что сообщить школе', 'What to tell the school') },
      { id: 'numbers', label: X('Шұғыл нөмірлер', 'Экстренные номера', 'Emergency numbers') },
      { id: 'docs', label: X('Құжаттар', 'Документы', 'Documents') },
    ]);

    // ------------------------------------------------------------------ service facts
    const serviceFacts = ui.facts([
      { k: X('Медициналық кабинет', 'Медицинский кабинет', 'Medical room'), v: `— ${wait}` },
      { k: X('Медицина қызметкері (аты-жөні, біліктілігі)', 'Медицинский работник (ФИО, квалификация)', 'Medical worker (name, qualification)'), v: `— ${wait}` },
      { k: X('Жұмыс уақыты', 'Часы работы', 'Hours'), v: `— ${wait}` },
      { k: X('Медициналық көмек көрсету негізі', 'Основание оказания медпомощи', 'Basis for medical care'), v: `${L(X('МСАК ұйымымен шарт немесе медициналық қызметке лицензия', 'Договор с организацией ПМСП или лицензия на медицинскую деятельность', 'Contract with a primary-care organisation, or a medical licence'))} ${docWait}` },
      { k: X('Бекітілген емхана (МСАК ұйымы)', 'Прикреплённая поликлиника (организация ПМСП)', 'Attached clinic (primary-care organisation)'), v: `— ${wait}` },
    ]);
    const servicePendingText = (X(
      'Мектеп медициналық кабинеттің бар-жоғын, медбикенің аты-жөні мен жұмыс кестесін және медициналық ұйыммен жасалған шарттың деректемелерін растағаннан кейін олар осында жарияланады.',
      'После того как школа подтвердит наличие медкабинета, ФИО и график медсестры и реквизиты договора с медицинской организацией, они будут опубликованы здесь.',
      'Once the school confirms the medical room, the nurse’s name and schedule, and the details of the contract with a medical organisation, they will be published here.',
    ));
    const service = ui.more({ label: X('Медқызмет туралы мәліметтер нақтылануда', 'Сведения о медслужбе уточняются', 'Medical-service details being confirmed'), icon: 'hourglass', count: 5, tone: 'card', cls: 'cmp-svc-more', body: serviceFacts + ui.note(servicePendingText) });
    const servicePending = '';

    // ------------------------------------------------------------------ nurse functions (п.14)
    const nurseCards = ([
      { icon: 'medical', title: X('Алғашқы және шұғыл көмек', 'Первая и неотложная помощь', 'First and emergency aid'), text: X('Жарақат немесе кенет ауырған кезде көмек көрсетеді, қажет болса жедел жәрдем шақырады.', 'Помогает при травме или внезапном недомогании, при необходимости вызывает скорую.', 'Helps with injuries or sudden illness and calls an ambulance if needed.') },
      { icon: 'shield', title: X('Екпелер', 'Прививки', 'Vaccinations'), text: X('Ата-ананың ақпараттандырылған келісімімен екпе жасайды және кейін баланы бақылайды.', 'Проводит прививки с информированного согласия родителей и наблюдает за ребёнком после них.', 'Gives vaccinations with parents’ informed consent and monitors the child afterwards.') },
      { icon: 'target', title: X('Профилактикалық тексерулер', 'Профилактические осмотры', 'Health screenings'), text: X('Скринингтік тексерулерге балалар тізімін жасайды, дәрігерлермен бірге жұмыс істейді.', 'Формирует списки детей на скрининговые осмотры, работает вместе с врачами.', 'Prepares lists for screening check-ups and works with doctors.') },
      { icon: 'leaf', title: X('Салауатты өмір салты', 'Здоровый образ жизни', 'Healthy lifestyle'), text: X('Балалармен және ата-аналармен гигиена, тамақтану, күн тәртібі туралы әңгімелер өткізеді.', 'Проводит беседы с детьми и родителями о гигиене, питании, режиме дня.', 'Talks with children and parents about hygiene, nutrition and daily routine.') },
      { icon: 'heart', title: X('Психикалық денсаулық', 'Психическое здоровье', 'Mental health'), text: X(`Мектеп психологымен бірге балалардың эмоциялық жағдайына назар аударады: <a href="${href('psychology')}">психологиялық қызмет</a>.`, `Вместе с психологом следит за эмоциональным состоянием детей: <a href="${href('psychology')}">психологическая служба</a>.`, `Works with the psychologist to watch children’s wellbeing: <a href="${href('psychology')}">psychological service</a>.`) },
      { icon: 'grid', title: X('Санитариялық бақылау', 'Санитарный контроль', 'Hygiene checks'), text: X(`Оқушылардың отырғызылуын, тамақтану сапасын бақылауға қатысады: <a href="${href('meals')}">мектептегі тамақтану</a>.`, `Контролирует рассадку учеников, участвует в контроле качества питания: <a href="${href('meals')}">школьное питание</a>.`, `Checks pupils’ seating and helps monitor meal quality: <a href="${href('meals')}">school meals</a>.`) },
    ]);
    const nurse = pd(nurseCards);
    const nurseNote = `<div class="dz-row">${ui.legal(X(`<p>Функциялар ${std} (14-тармақ) бойынша сипатталған.</p>`, `<p>Функции описаны по п. 14 документа «${std}».</p>`, `<p>Functions follow para. 14 of the ${std}.</p>`))}</div>`;

    // ------------------------------------------------------------------ if ill
    const col = (ic, title, items) => `<div class="cmp-duo__col"><div class="cmp-duo__head"><span class="cmp-duo__ico" aria-hidden="true">${ui.icon(ic, { size: 26 })}</span><p class="cmp-duo__t">${L(title)}</p></div>${pd(items.map(([title, text]) => ({ title, text })), { num: true, one: true })}</div>`;
    const ill = `<div class="cmp-duo">${col('home', X('Бала үйде ауырып қалса', 'Ребёнок заболел дома', 'Your child is ill at home'), [
      [X('Мектепке жібермеңіз', 'Не отправляйте в школу', 'Keep them at home'), X('Ауру балаға демалыс керек, әрі ол басқа балаларды жұқтыруы мүмкін.', 'Больному ребёнку нужен покой, к тому же он может заразить других детей.', 'A sick child needs rest and may infect other children.')],
      [X('Сынып жетекшісіне хабарлаңыз', 'Сообщите классному руководителю', 'Tell the class teacher'), X(`Сабақ басталғанға дейін немесе мектеп телефоны арқылы: <a href="tel:${S.contacts.phone.tel}">${S.contacts.phone.display}</a>.`, `До начала уроков или по телефону школы: <a href="tel:${S.contacts.phone.tel}">${S.contacts.phone.display}</a>.`, `Before lessons start, or via the school phone: <a href="tel:${S.contacts.phone.tel}">${S.contacts.phone.display}</a>.`)],
      [X('Дәрігерге көрсетіңіз', 'Обратитесь к врачу', 'See a doctor'), X('Бекітілген емханадағы учаскелік педиатрға немесе жалпы тәжірибелік дәрігерге.', 'К участковому педиатру или врачу общей практики в прикреплённой поликлинике.', 'Your local paediatrician or GP at the clinic you are registered with.')],
      [X('Сауыққан соң оралыңыз', 'Возвращайтесь после выздоровления', 'Return once recovered'), X('Ауырғаннан кейін мектепке келудің тәртібі (анықтама қажет пе) мектептің ішкі тәртіп ережелерінде бекітіледі.', 'Порядок возвращения в школу после болезни (нужна ли справка) закрепляется в правилах внутреннего распорядка.', 'How pupils return after illness (whether a certificate is needed) is set in the school’s internal rules.')],
    ])}${col('school', X('Бала мектепте ауырып қалса', 'Ребёнку стало плохо в школе', 'Your child falls ill at school'), [
      [X('Мұғалім медбикеге хабарлайды', 'Учитель сообщает медсестре', 'The teacher alerts the nurse'), X('Баланың халі нашарлағанын байқаған педагог бірден медицина қызметкеріне жүгінеді.', 'Заметив, что ребёнку плохо, педагог сразу обращается к медицинскому работнику.', 'A teacher who notices a child is unwell turns to the medical worker straight away.')],
      [X('Алғашқы көмек көрсетіледі', 'Оказывается первая помощь', 'First aid is given'), X('Медбике баланың жағдайын бағалап, көмек көрсетеді.', 'Медсестра оценивает состояние и оказывает помощь.', 'The nurse assesses the child and gives first aid.')],
      [X('Ата-анаға хабарланады', 'Родителям сообщают', 'Parents are informed'), X('Жұқпалы ауру белгілері болса, бала ата-анасы келгенше басқа балалардан бөлек болады.', 'При признаках инфекции ребёнок находится отдельно от других детей до прихода родителей.', 'If there are signs of infection, the child waits apart from other children until a parent arrives.')],
      [X('Қажет болса — 103', 'При необходимости — 103', 'If needed — 103'), X('Өмірге қауіп төнсе, көмек ата-ананың келісімін күтпей көрсетіледі, кейін міндетті түрде хабарланады.', 'При угрозе жизни помощь оказывают, не дожидаясь согласия родителей, с обязательным последующим информированием.', 'If life is at risk, help is given without waiting for consent, and parents are always informed afterwards.')],
    ])}</div>`;
    const signs = `<div class="cmp-signs">${ui.chips([
      { icon: 'sun', label: X('Қызба', 'Температура', 'Fever') },
      { icon: 'warn', label: X('Құсу, іш өту', 'Рвота, диарея', 'Vomiting, diarrhoea') },
      { icon: 'eye', label: X('Себебі белгісіз бөртпе', 'Сыпь неясного происхождения', 'Unexplained rash') },
      { icon: 'eye', label: X('Көздің қызаруы, іріңдеуі', 'Покраснение, гноение глаз', 'Red or sticky eyes') },
      { icon: 'chat', label: X('Қатты жөтел, тұмау', 'Сильный кашель, насморк', 'Heavy cough or cold') },
    ])}</div>`;
    const signsNote = ui.note(X('Баланы дәрігерге көрсетіңіз — мектепке қашан оралуға болатынын дәрігер шешеді.', 'Покажите ребёнка врачу — когда вернуться в школу, решает врач.', 'See a doctor, who decides when your child can return.'));

    // ------------------------------------------------------------------ vaccination
    const vaccSteps = ([
      { title: X('Ұлттық кесте бойынша', 'По национальному календарю', 'National schedule'), text: X('Міндетті екпелердің тізімі мен мерзімдері ҚР Үкіметінің 2020 жылғы 24 қыркүйектегі № 612 қаулысымен бекітілген.', 'Перечень и сроки обязательных прививок утверждены постановлением Правительства РК от 24 сентября 2020 года № 612.', 'The list and timing of mandatory vaccinations are set by Government decree No. 612 of 24 September 2020.') },
      { title: X('Ата-анаға алдын ала хабарланады', 'Родителей предупреждают заранее', 'Parents are told in advance'), text: X('Қандай екпе, қашан және не үшін жасалатыны түсіндіріледі.', 'Объясняют, какая прививка, когда и зачем.', 'You are told which vaccine, when, and why.') },
      { title: X('Ақпараттандырылған келісім', 'Информированное согласие', 'Informed consent'), text: X('Екпе ата-ананың (заңды өкілдің) келісімімен ғана жасалады; бас тартуға құқығыңыз бар, ол жазбаша ресімделеді.', 'Прививка проводится только с согласия родителя (законного представителя); отказ возможен и оформляется письменно.', 'Vaccination is given only with a parent’s (guardian’s) consent; you may refuse, in writing.') },
      { title: X('Екпеден кейінгі бақылау', 'Наблюдение после прививки', 'Aftercare'), text: X('Медбике екпе алған баланы бақылайды және ата-анаға кеңес береді.', 'Медсестра наблюдает за ребёнком после прививки и даёт рекомендации родителям.', 'The nurse monitors the child afterwards and advises parents.') },
    ]);
    const vacc = pd(vaccSteps, { num: true });

    // ------------------------------------------------------------------ what to tell the school
    const tell = ui.cards([
      { icon: 'warn', title: X('Аллергия', 'Аллергия', 'Allergies'), text: X('Тағамға, дәріге, жәндіктің шағуына — жазбаша хабарлаңыз.', 'На продукты, лекарства, укусы насекомых — сообщите письменно.', 'To food, medicines, insect stings — tell us in writing.') },
      { icon: 'heart', title: X('Созылмалы аурулар', 'Хронические заболевания', 'Chronic conditions'), text: X('Демікпе, қант диабеті, эпилепсия және т. б. — дәрігердің ұсынымдарымен.', 'Астма, диабет, эпилепсия и др. — с рекомендациями врача.', 'Asthma, diabetes, epilepsy, etc. — with the doctor’s advice.') },
      { icon: 'ball', title: X('Дене шынықтыру тобы', 'Группа по физкультуре', 'PE group'), text: X('Денсаулығына байланысты шектеу болса, дәрігердің анықтамасын ұсыныңыз.', 'Если есть ограничения по здоровью, предоставьте справку врача.', 'If there are health restrictions, provide a doctor’s note.') },
      { icon: 'phone', title: X('Байланыс телефоны', 'Контактный телефон', 'Contact number'), text: X('Жедел хабарласу үшін ата-ананың өзекті нөмірі.', 'Актуальный номер родителя для срочной связи.', 'An up-to-date parent number for urgent contact.') },
    ], { cols: 4 });
    const tellNote = '<div class="dz-row">' + ui.more({ icon: 'lock', tone: 'card', label: X('Жеке деректер қорғалады', 'Персональные данные защищены', 'Personal data is protected'), body: X(`Балаңыздың денсаулығы туралы мәлімет тек медицина қызметкері мен тиісті педагогтерге ғана қолжетімді. Толығырақ: <a href="${href('privacy')}">құпиялылық саясаты</a>.`, `Сведения о здоровье ребёнка доступны только медицинскому работнику и причастным педагогам. Подробнее: <a href="${href('privacy')}">политика конфиденциальности</a>.`, `Information about your child’s health is available only to the medical worker and the staff concerned. See the <a href="${href('privacy')}">privacy policy</a>.`) }) + '</div>';

    // ------------------------------------------------------------------ numbers
    const sos = `<ul class="cmp-sos" role="list">${[
      { num: '103', kind: 'med', l: X('Жедел медициналық жәрдем', 'Скорая медицинская помощь', 'Ambulance') },
      { num: '112', kind: 'one', l: X('Бірыңғай құтқару қызметі', 'Единая служба спасения', 'Single emergency number') },
      { num: '111', kind: 'child', l: S.helplines[0].label },
      { num: '150', kind: 'child', l: S.helplines[1].label },
    ].map((n) => `<li class="cmp-sos--${n.kind}"><a class="cmp-sos__a" href="tel:${n.num}"><span class="cmp-sos__n">${n.num}</span><span class="cmp-sos__l">${L(n.l)}</span><span class="cmp-sos__call">${ui.icon('phone', { size: 14 })}${L(X('Қоңырау шалу', 'Позвонить', 'Call'))}</span></a></li>`).join('')}</ul>`;
    const egovLinks = ui.linkList([
      { href: egov('articles/health_care/2Fvybor_polikliniki'), icon: 'globe', label: X('Емханаға бекіну', 'Прикрепление к поликлинике', 'Registering with a clinic'), note: 'egov.kz' },
      { href: egov('services/495pass_mz'), icon: 'calendar', label: X('Дәрігердің қабылдауына жазылу', 'Запись на приём к врачу', 'Booking a doctor’s appointment'), note: 'egov.kz' },
    ]);

    // ------------------------------------------------------------------ documents & sources
    const docs = ui.docList([
      ...['medical-contract'].map(docById).filter(Boolean),
      docById('medical-room-certificate'),
      docById('medical-schedule'),
      docById('vaccination-plan'),
    ], { collapse: 3, groupPending: true });
    const sources = ui.legal([
      { href: adilet('V2300032069'), title: X('Орта білім беру ұйымдарында медициналық көмек көрсету стандарты (ҚР ДСМ м.а. 14.03.2023 № 37 бұйрығы)', 'Стандарт оказания медицинской помощи в организациях среднего образования (приказ и.о. Министра здравоохранения РК от 14.03.2023 № 37)', 'Standard of medical care in secondary education organisations (Health Ministry order No. 37 of 14.03.2023)'), note: 'adilet.zan.kz' },
      { href: adilet('P2000000612'), title: X('Міндетті профилактикалық екпелер жүргізілетін аурулардың тізбесі, қағидалары мен мерзімдері (ҚР Үкіметінің 24.09.2020 № 612 қаулысы)', 'Перечень заболеваний, против которых проводятся обязательные профилактические прививки, правила и сроки (постановление Правительства РК от 24.09.2020 № 612)', 'Mandatory vaccinations: list, rules and timing (Government decree No. 612 of 24.09.2020)'), note: 'adilet.zan.kz' },
      { href: adilet('V2100023890'), title: X('«Білім беру объектілеріне қойылатын санитариялық-эпидемиологиялық талаптар» (ҚР ДСМ-76)', 'Санитарные правила «Санитарно-эпидемиологические требования к объектам образования» (ҚР ДСМ-76)', 'Sanitary rules for education facilities (ҚР ДСМ-76)'), note: 'adilet.zan.kz' },
    ]);

    const related = ui.linkList([
      { href: href('meals'), icon: 'utensils', label: X('Мектептегі тамақтану', 'Школьное питание', 'School meals') },
      { href: href('psychology'), icon: 'heart', label: X('Психологиялық қызмет', 'Психологическая служба', 'Psychological service') },
      { href: href('safety'), icon: 'shield', label: X('Қауіпсіздік', 'Безопасность', 'Safety & security') },
      { href: href('inclusive'), icon: 'accessible', label: X('Инклюзивті білім беру', 'Инклюзивное образование', 'Inclusive education') },
      { href: href('facilities'), icon: 'building', label: X('Ғимарат және кабинеттер', 'Здание и кабинеты', 'Building & classrooms') },
    ]);

    return [
      intro(toc),
      ui.section({ id: 'service', eyebrow: X('Мектепте', 'В школе', 'At school'), title: X('Медициналық қызмет', 'Медицинская служба', 'Medical service'), body: model.replace('SERVICE_MORE_SLOT', service + servicePending) }),
      ui.section({ id: 'nurse', eyebrow: X('Мектеп медбикесі', 'Школьная медсестра', 'School nurse'), title: X('Медбике не істейді', 'Чем занимается медсестра', 'What the school nurse does'), body: nurse + nurseNote }),
      ui.section({ id: 'ill', eyebrow: X('Ата-аналарға', 'Родителям', 'For parents'), title: X('Бала ауырып қалса не істеу керек', 'Что делать, если ребёнок заболел', 'What to do if your child is ill'), body: ill + `<h3 class="cmp-h3">${L(X('Баланы қашан үйде қалдырған жөн', 'Когда лучше оставить ребёнка дома', 'When to keep your child at home'))}</h3>` + signs + signsNote }),
      ui.section({ id: 'vaccination', eyebrow: X('Профилактика', 'Профилактика', 'Prevention'), title: X('Екпелер', 'Прививки', 'Vaccinations'), body: vacc }),
      ui.section({ id: 'tell', eyebrow: X('Маңызды', 'Важно', 'Important'), title: X('Мектепке не туралы хабарлау керек', 'О чём сообщить школе', 'What to tell the school'), body: tell + tellNote }),
      ui.section({ id: 'numbers', eyebrow: X('Шұғыл көмек', 'Экстренная помощь', 'Urgent help'), title: X('Шұғыл нөмірлер және онлайн қызметтер', 'Экстренные номера и онлайн-услуги', 'Emergency numbers and online services'), body: sos + egovLinks }),
      ui.section({ id: 'docs', eyebrow: X('Растайтын құжаттар', 'Подтверждающие документы', 'Supporting documents'), title: X('Құжаттар', 'Документы', 'Documents'), body: docs + `<div class="dz-row cmp-law">${sources}</div>` }),
      ui.section({ title: X('Осы бөлімде', 'В этом разделе', 'In this section'), body: related }),
    ].join('\n');
  },
};
