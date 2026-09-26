// Safety & security — ORDER-114 §H item 63 (video surveillance, access control, guard, panic button,
// anti-terror protection) and item 61 (fire-safety act). Legal basis read on 24.09.2026:
// · Government decree No. 305 of 06.05.2021 (P2100000305) — anti-terror protection requirements;
// · MES order No. 117 of 30.03.2022 (V2200027414) — instruction for education facilities: notification
//   system, video surveillance, alarm button (п.78), access regime & visitor log (пп.12–18),
//   video kept ≥ 30 days (п.88), briefings ≥ 2/year (п.42), practical drills ≥ 1/year (п.39);
// · Fire safety rules, MES-ЧС order No. 55 of 21.02.2022 (V2200026867);
// · Road traffic rules — Interior Ministry order No. 534 of 30.06.2023 (V2300033003; replaced Government decree
//   No. 1196 of 2014, which is no longer in force) — read on adilet 25.09.2026;
// · list of items banned from education organisations — MES order No. 235 of 25.05.2021 (V2100022857), read 25.09.2026.
// Every school-specific status is "to be confirmed" — nothing is claimed as installed.
const X = (kz, ru, en) => ({ kz, ru, en });

export default {
  slug: 'safety',
  group: 'campus',
  order: 30,
  title: { kz: 'Қауіпсіздік', ru: 'Безопасность', en: 'Safety & security' },
  description: {
    kz: 'Мектептегі қауіпсіздік: күзет, өткізу режимі, бейнебақылау, дабыл түймесі, өрт және жол қауіпсіздігі, шұғыл қызметтердің нөмірлері.',
    ru: 'Безопасность в школе: охрана, пропускной режим, видеонаблюдение, тревожная кнопка, пожарная и дорожная безопасность, экстренные номера.',
    en: 'School safety: security, access control, CCTV, panic button, fire and road safety, and emergency numbers.',
  },
  styles: ['campus'],
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, { ui, S, L, t, href, docById }) {
    const wait = ui.badge(t('unconfirmed'), 'warn');
    const adilet = (code) => `https://adilet.zan.kz/${lang === 'kz' ? 'kaz' : 'rus'}/docs/${code}`;

    // ------------------------------------------------------------------ emergency numbers
    const sos = (items) => `<ul class="cmp-sos" role="list">${items.map((n) => `<li class="cmp-sos--${n.kind}"><a class="cmp-sos__a" href="tel:${n.tel || n.num}"><span class="cmp-sos__n">${n.show || n.num}</span><span class="cmp-sos__l">${L(n.l)}</span>${n.d ? `<span class="cmp-sos__d">${L(n.d)}</span>` : ''}<span class="cmp-sos__call">${ui.icon('phone', { size: 14 })}${L(X('Қоңырау шалу', 'Позвонить', 'Call'))}</span></a></li>`).join('')}</ul>`;
    const numbers = sos([
      { num: '112', kind: 'one', l: X('Бірыңғай құтқару қызметі', 'Единая служба спасения', 'Single emergency number'), d: X('Кез келген төтенше жағдайда', 'При любой экстренной ситуации', 'For any emergency') },
      { num: '101', kind: 'fire', l: X('Өрт сөндіру қызметі', 'Пожарная служба', 'Fire service'), d: X('Өрт, түтін, адамдарды құтқару', 'Пожар, дым, спасение людей', 'Fire, smoke, rescue') },
      { num: '102', kind: 'police', l: X('Полиция', 'Полиция', 'Police'), d: X('Құқық бұзушылық, күдікті зат', 'Правонарушение, подозрительный предмет', 'Crime, suspicious object') },
      { num: '103', kind: 'med', l: X('Жедел медициналық жәрдем', 'Скорая медицинская помощь', 'Ambulance'), d: X('Жарақат, өмірге қауіп', 'Травма, угроза жизни', 'Injury, threat to life') },
      { num: '104', kind: 'gas', l: X('Газ қызметі', 'Газовая служба', 'Gas emergency'), d: X('Газ иісі, газ ағуы', 'Запах газа, утечка', 'Gas smell or leak') },
      { num: '111', kind: 'child', l: L(S.helplines[0].label), d: X('Балалардың құқықтарын қорғау', 'Защита прав детей', 'Protecting children’s rights') },
      { num: '150', kind: 'child', l: L(S.helplines[1].label), d: X('Тегін, жасырын', 'Бесплатно, анонимно', 'Free and anonymous') },
      { num: 'school', kind: 'school', tel: S.contacts.phone.tel, show: S.contacts.phone.display, l: X('«Керемет» мектебі', 'Школа «Керемет»', 'Keremet School'), d: X('Мектеп әкімшілігі, WhatsApp', 'Администрация школы, WhatsApp', 'School office, WhatsApp') },
    ]);

    const intro = ui.split({
      ratio: '1:1', align: 'center',
      left: `${ui.eyebrow(X('Балалардың қауіпсіздігі — басты міндет', 'Безопасность детей — главное', 'Children’s safety comes first'))}
<h2 class="sec__title">${L(X('Қауіпсіз мектеп: не істелген, не нақтылануда', 'Безопасная школа: что сделано и что уточняется', 'A safe school: what is in place and what is being confirmed'))}</h2>
${ui.lead(X(
        'Бұл бетте мектептің күзеті, өткізу режимі, өрт және жол қауіпсіздігі туралы, сондай-ақ ата-аналар мен балалар білуге тиіс ережелер жинақталған. Әрбір шара бойынша мәртебесі көрсетілген: мектеп растағаннан кейін «Расталған» деп белгіленеді.',
        'На этой странице собраны сведения об охране школы, пропускном режиме, пожарной и дорожной безопасности, а также правила, которые важно знать родителям и детям. По каждой мере указан статус: после подтверждения школой она отмечается как «Подтверждено».',
        'This page brings together information on school security, access control, fire and road safety, and the rules parents and children should know. Each measure shows its status; it is marked “Confirmed” once the school verifies it.',
      ))}
${ui.chips([{ icon: 'shield', label: X('Антитеррорлық қорғау', 'Антитеррористическая защита', 'Anti-terror protection') }, { icon: 'warn', label: X('Өрт қауіпсіздігі', 'Пожарная безопасность', 'Fire safety') }, { icon: 'bus', label: X('Жол қауіпсіздігі', 'Безопасность на дорогах', 'Road safety') }])}`,
      right: ui.panel({ theme: 'biology', body: `<p class="cmp-rubric-head">${L(X('Шұғыл жағдайда', 'В экстренной ситуации', 'In an emergency'))}</p><p class="cmp-rubric-sub">${L(X('Алдымен 112 немесе тиісті қызметке, содан кейін мектепке хабарласыңыз:', 'Сначала позвоните 112 или в нужную службу, затем в школу:', 'Call 112 or the relevant service first, then the school:'))}</p>
<ul class="cmp-rubric" role="list"><li>${ui.icon('phone', { size: 20 })}<span class="cmp-rubric__t"><a href="tel:${S.contacts.phone.tel}">${S.contacts.phone.display}</a></span>${ui.badge(X('Мектеп', 'Школа', 'School'), 'ok')}</li>
<li>${ui.icon('phone', { size: 20 })}<span class="cmp-rubric__t"><a href="tel:112">112</a> · <a href="tel:101">101</a> · <a href="tel:102">102</a> · <a href="tel:103">103</a></span></li>
<li>${ui.icon('shield', { size: 20 })}<span class="cmp-rubric__t">${L(X('Күзет бекетінің телефоны', 'Телефон поста охраны', 'Security desk phone'))}</span>${wait}</li></ul>` }),
    });

    const toc = ui.toc([
      { id: 'numbers', label: X('Шұғыл нөмірлер', 'Экстренные номера', 'Emergency numbers') },
      { id: 'security', label: X('Күзет және антитеррорлық қорғау', 'Охрана и антитеррористическая защита', 'Security and anti-terror protection') },
      { id: 'access', label: X('Өткізу режимі', 'Пропускной режим', 'Access control') },
      { id: 'fire', label: X('Өрт қауіпсіздігі', 'Пожарная безопасность', 'Fire safety') },
      { id: 'road', label: X('Жол қауіпсіздігі', 'Безопасность на дорогах', 'Road safety') },
      { id: 'parents', label: X('Ата-аналарға жадынама', 'Памятка родителям', 'Parents’ checklist') },
      { id: 'docs', label: X('Құжаттар', 'Документы', 'Documents') },
    ]);

    // ------------------------------------------------------------------ security checklist
    const check = (items) => `<ul class="cmp-check cmp-check--wide" role="list">${items.map((it) => `<li class="cmp-check__item cmp-check__item--wait"><span class="cmp-check__icon" aria-hidden="true">${ui.icon(it.icon, { size: 22 })}</span><div class="cmp-check__body"><p class="cmp-check__title">${L(it.title)}</p><p class="cmp-check__text">${L(it.text)}</p></div><span class="cmp-check__status">${wait}</span></li>`).join('')}</ul>`;
    const security = check([
      { icon: 'eye', title: X('Бейнебақылау', 'Видеонаблюдение', 'Video surveillance'), text: X('Кіреберістер мен аумақ камералармен бақыланады; жазбалар кемінде 30 күн сақталады (№ 117 нұсқаулық).', 'Входы и территория под камерами; записи хранятся не менее 30 дней (инструкция № 117).', 'Entrances and grounds covered by cameras; footage kept for at least 30 days (instruction No. 117).') },
      { icon: 'lock', title: X('Өткізу режимі', 'Пропускной режим', 'Access control'), text: X('Келушілер жеке басын куәландыратын құжатпен кіреді және журналға тіркеледі.', 'Посетители проходят по удостоверению личности и регистрируются в журнале.', 'Visitors enter with an ID document and are registered in a log.') },
      { icon: 'shield', title: X('Күзет', 'Охрана', 'Security guard'), text: X('Күзет бекеті және күзет ұйымы (немесе өз күзетшілері) туралы мәлімет.', 'Пост охраны и охранная организация (или собственные сторожа).', 'Security desk and the security company (or own guards).') },
      { icon: 'warn', title: X('Дабыл түймесі', 'Тревожная кнопка', 'Panic button'), text: X('Мобильді немесе стационарлық дабыл беру құралы.', 'Мобильное или стационарное средство подачи тревоги.', 'A mobile or fixed alarm device.') },
      { icon: 'mic', title: X('Хабарлау жүйесі', 'Система оповещения', 'Public-address system'), text: X('Төтенше жағдай кезінде барлық адамдарды жедел хабардар ету.', 'Быстрое оповещение всех людей в здании при ЧС.', 'Quickly alerting everyone in the building in an emergency.') },
      { icon: 'grid', title: X('Аумақтың қоршауы және жарықтандыру', 'Ограждение и освещение территории', 'Fencing and lighting'), text: X('Периметрдің қоршауы, кешкі жарық.', 'Ограждение периметра, освещение в тёмное время.', 'Perimeter fence and night-time lighting.') },
    ]);
    const secretNote = ui.callout({
      type: 'info',
      title: X('Неге барлық мәлімет жарияланбайды', 'Почему опубликовано не всё', 'Why not everything is published'),
      text: X(
        'Объектінің антитеррорлық қорғалу паспорты, камералардың орналасуы мен күзет кестесі — қызметтік пайдалануға арналған мәліметтер. Сайтта тек шаралардың бар-жоғы және ата-аналарға қажетті ережелер жарияланады.',
        'Паспорт антитеррористической защищённости объекта, схема размещения камер и график охраны — сведения для служебного пользования. На сайте публикуется только наличие мер и правила, важные для родителей.',
        'The facility’s anti-terror protection passport, camera layout and guard schedule are for official use only. The website publishes only which measures exist and the rules parents need to know.',
      ),
    });
    const drills = ui.stats([
      { icon: 'calendar', value: X('≥ 2', '≥ 2', '≥ 2'), label: X('Жоспарлы нұсқаулық жылына', 'Плановых инструктажа в год', 'Scheduled briefings a year'), note: X('№ 117 нұсқаулықтың 42-т.', 'п. 42 инструкции № 117', 'para. 42, instruction No. 117') },
      { icon: 'users', value: X('≥ 1', '≥ 1', '≥ 1'), label: X('Практикалық жаттығу жылына', 'Практическое учение в год', 'Practical drill a year'), note: X('№ 117 нұсқаулықтың 39-т.', 'п. 39 инструкции № 117', 'para. 39, instruction No. 117') },
      { icon: 'eye', value: '30', label: X('Күн — бейнежазбаны сақтау', 'Дней хранения видеозаписей', 'Days of CCTV storage'), note: X('кемінде, 88-т.', 'не менее, п. 88', 'minimum, para. 88') },
    ]);
    const drillsNote = ui.note(X('Бұл — нұсқаулықтың талаптары. Мектептегі жаттығулар кестесі мен өткізілген күндері нақтыланғаннан кейін жарияланады.', 'Это требования инструкции. График учений в школе и даты проведённых тренировок будут опубликованы после уточнения.', 'These are the instruction’s requirements. The school’s drill schedule and completed dates will be published once confirmed.'));

    // ------------------------------------------------------------------ access regime
    const access = ui.steps([
      { title: X('Жеке куәлікпен кіру', 'Вход по удостоверению', 'Enter with ID'), text: X('Ата-ана мен қонақ күзетшіге жеке басын куәландыратын құжатты көрсетеді.', 'Родители и гости предъявляют охраннику удостоверение личности.', 'Parents and guests show an ID document to the guard.') },
      { title: X('Журналға тіркелу', 'Регистрация в журнале', 'Sign the log'), text: X('Келу уақыты мен мақсаты келушілер журналына жазылады.', 'Время и цель визита записываются в журнал посетителей.', 'The time and purpose of the visit are recorded in the visitor log.') },
      { title: X('Белгіленген тәртіппен', 'По установленному порядку', 'By set procedure'), text: X('Ата-аналар ғимаратқа мектеп бекіткен тәртіп бойынша кіреді (№ 117 нұсқаулықтың 18-т.).', 'Родители проходят в здание по порядку, установленному школой (п. 18 инструкции № 117).', 'Parents enter the building under the procedure set by the school (para. 18, instruction No. 117).') },
      { title: X('Баланы алып кету', 'Забрать ребёнка', 'Picking up'), text: X('Баланы кім алып кете алатыны алдын ала келісіледі; бөгде адамға бала берілмейді.', 'Кто может забирать ребёнка, согласуется заранее; посторонним детей не отдают.', 'Who may collect a child is agreed in advance; children are not handed to strangers.') },
    ]);
    const accessPending = ui.pending({ title: X('Мектептің өткізу режимі туралы бұйрығы', 'Приказ школы о пропускном режиме', 'The school’s access-control order'), note: X('Кіру уақыты, ата-аналар күтетін орын, тыйым салынған заттар тізімі осы бұйрықпен бекітіліп, жарияланады.', 'Время входа, место ожидания для родителей и перечень запрещённых предметов будут утверждены этим приказом и опубликованы.', 'Entry times, the parents’ waiting area and the list of prohibited items will be set by this order and published.') });

    // ------------------------------------------------------------------ fire safety
    const fireSteps = `<div class="cmp-duo">
<div class="cmp-duo__col"><div class="cmp-duo__head"><span class="cmp-duo__ico" aria-hidden="true">${ui.icon('warn', { size: 26 })}</span><p class="cmp-duo__t">${L(X('Өрт болса, балалар не істейді', 'Если пожар: что делают дети', 'If there is a fire: what children do'))}</p></div>
<ol class="cmp-ol">${[
      [X('Үлкендерге айт', 'Скажи взрослому', 'Tell an adult'), X('Түтін немесе от көрсең — бірден мұғалімге хабарла.', 'Увидел дым или огонь — сразу сообщи учителю.', 'If you see smoke or fire, tell a teacher at once.')],
      [X('Мұғалімнің соңынан жүр', 'Иди за учителем', 'Follow the teacher'), X('Эвакуация жоспары бойынша сабырмен шық, жүгірме.', 'Спокойно выходи по плану эвакуации, не беги.', 'Leave calmly by the evacuation route; don’t run.')],
      [X('Жасырынба', 'Не прячься', 'Don’t hide'), X('Шкафқа, парта астына тығылма — сені таппай қалуы мүмкін.', 'Не прячься в шкаф или под парту — тебя могут не найти.', 'Don’t hide in a cupboard or under a desk — you might not be found.')],
      [X('Жиналу орнында тұр', 'Стой на месте сбора', 'Stay at the assembly point'), X('Сыныппен бірге бол, мұғалім барлығын түгендейді.', 'Будь со своим классом, учитель всех пересчитает.', 'Stay with your class so the teacher can count everyone.')],
    ].map(([a, b]) => `<li><strong>${L(a)}</strong><span>${L(b)}</span></li>`).join('')}</ol></div>
<div class="cmp-duo__col"><div class="cmp-duo__head"><span class="cmp-duo__ico" aria-hidden="true">${ui.icon('building', { size: 26 })}</span><p class="cmp-duo__t">${L(X('Мектептегі өрт қауіпсіздігі шаралары', 'Меры пожарной безопасности в школе', 'Fire-safety measures at school'))}</p></div>
${[
      X('Өрт дабылы және хабарлау жүйесі', 'Пожарная сигнализация и оповещение', 'Fire alarm and warning system'),
      X('Әр қабаттағы эвакуация жоспарлары', 'Планы эвакуации на каждом этаже', 'Evacuation plans on every floor'),
      X('Өрт сөндіргіштер және олардың тексерілуі', 'Огнетушители и их проверка', 'Fire extinguishers and their checks'),
      X('Эвакуациялық шығулардың бос болуы', 'Свободные эвакуационные выходы', 'Clear emergency exits'),
      X('Оқу-жаттығу эвакуациясы', 'Учебные эвакуации', 'Evacuation drills'),
    ].map((t) => `<p class="cmp-row">${ui.icon('hourglass', { size: 18 })}<span>${L(t)}</span>${wait}</p>`).join('')}
</div></div>`;

    // ------------------------------------------------------------------ road safety
    const road = ui.cards([
      { icon: 'bus', title: X('Аялдамадан мектепке дейін', 'От остановки до школы', 'From the stop to school'), text: X(`«Қ. Жалайыри даңғылы» аялдамасынан мектепке дейін 250 м. Жолды тек жаяу жүргіншілер өткелі арқылы кесіп өтіңіз.`, `От остановки «проспект К. Жалаири» до школы 250 м. Переходите дорогу только по пешеходному переходу.`, `It is 250 m from the “K. Zhalairi Avenue” stop to the school. Cross only at pedestrian crossings.`) },
      { icon: 'parking', title: X('Көлікпен әкелсеңіз', 'Если везёте на машине', 'If you drive'), text: X('Автотұрақта 7 орын бар. Кіреберіс алдында тоқтап тұрмаңыз, баланы тротуар жағынан түсіріңіз, балалар орындығын пайдаланыңыз.', 'На парковке 7 мест. Не останавливайтесь у самого входа, высаживайте ребёнка со стороны тротуара, используйте детское кресло.', 'There are 7 parking spaces. Don’t stop right at the entrance; let children out on the pavement side and use a child seat.') },
      { icon: 'sun', title: X('Көрінетін бол', 'Будь заметным', 'Be visible'), text: X('Күзден бастап ерте қараңғы түседі — киімге немесе сөмкеге шағылыстырғыш белгі тағыңыз.', 'С осени рано темнеет — прикрепите к одежде или рюкзаку световозвращатели.', 'It gets dark early from autumn on — add reflectors to clothes or backpacks.') },
      { icon: 'compass', title: X('Қауіпсіз маршрут', 'Безопасный маршрут', 'Safe route'), text: `${L(X('«Үй — мектеп — үй» қауіпсіз маршрутының сызбасы жарияланады.', 'Будет опубликована схема безопасного маршрута «дом — школа — дом».', 'A map of the safe home–school–home route will be published.'))} ${wait}` },
    ], { cols: 4 });

    // ------------------------------------------------------------------ parents checklist
    const parents = ui.accordion([
      { q: X('Балаңызбен нені үйрену керек', 'Что выучить с ребёнком', 'What to learn with your child'), open: true,
        a: X('<ul class="bullets"><li>Ата-анасының телефон нөмірі мен үй мекенжайы.</li><li>112, 101, 102, 103 нөмірлері және оларға қалай қоңырау шалу керек.</li><li>Бөгде адаммен кетпеу, бөгде адамның сыйлығын алмау.</li><li>Иесіз заттарды ұстамау — бірден үлкендерге айту.</li></ul>', '<ul class="bullets"><li>Телефон родителей и домашний адрес.</li><li>Номера 112, 101, 102, 103 и как по ним звонить.</li><li>Не уходить с незнакомыми, не брать у них подарки.</li><li>Не трогать бесхозные вещи — сразу сказать взрослому.</li></ul>', '<ul class="bullets"><li>Parents’ phone number and home address.</li><li>The numbers 112, 101, 102, 103 and how to call them.</li><li>Never leave with strangers or accept gifts from them.</li><li>Don’t touch unattended items — tell an adult right away.</li></ul>') },
      { q: X('Мектепке не әкелуге болмайды', 'Что нельзя приносить в школу', 'What must not be brought to school'),
        a: X(`<p>Өткір және кесетін заттар, пиротехника, сіріңке мен оттық, газ баллончиктері, темекі бұйымдары. Толық тізім ${ui.extLink(adilet('V2100022857'), 'ҚР БҒМ 2021 жылғы 25 мамырдағы № 235 бұйрығымен')} бекітілген; мектептің өткізу режимі туралы бұйрығы осы тізбеге сүйенеді.</p>`, `<p>Колющие и режущие предметы, пиротехника, спички и зажигалки, газовые баллончики, табачные изделия. Полный перечень утверждён ${ui.extLink(adilet('V2100022857'), 'приказом МОН РК от 25.05.2021 № 235')}; приказ школы о пропускном режиме ссылается на этот перечень.</p>`, `<p>Sharp or cutting objects, fireworks, matches and lighters, gas sprays, tobacco products. The full list is set by ${ui.extLink(adilet('V2100022857'), 'MES order No. 235 of 25.05.2021')}; the school’s access-control order refers to it.</p>`) },
      { q: X('Төтенше жағдайда мектеп ата-аналарға қалай хабарлайды', 'Как школа оповещает родителей при ЧС', 'How the school informs parents in an emergency'),
        a: X(`<p>Хабарлау тәсілі (сынып чаттары, SMS, қоңырау) нақтылануда. Ауа райы қолайсыз болғанда немесе ТЖ кезінде оқу қашықтан жүргізілуі мүмкін: <a href="${href('distance')}">қашықтан оқыту</a>.</p>`, `<p>Способ оповещения (чаты классов, SMS, звонки) уточняется. При непогоде или ЧС обучение может переводиться в дистанционный формат: <a href="${href('distance')}">дистанционное обучение</a>.</p>`, `<p>The notification channel (class chats, SMS, calls) is being confirmed. In bad weather or emergencies lessons may move online: <a href="${href('distance')}">distance learning</a>.</p>`) },
      { q: X('Балаға қысым жасалса немесе ол қорқып жүрсе', 'Если ребёнка обижают или он боится', 'If your child is bullied or afraid'),
        a: X(`<p>Сынып жетекшісіне немесе мектеп психологына хабарласыңыз: <a href="${href('psychology')}">психологиялық қызмет</a>. Тегін сенім телефондары: <a href="tel:111">111</a>, <a href="tel:150">150</a>.</p>`, `<p>Обратитесь к классному руководителю или школьному психологу: <a href="${href('psychology')}">психологическая служба</a>. Бесплатные телефоны доверия: <a href="tel:111">111</a>, <a href="tel:150">150</a>.</p>`, `<p>Talk to the class teacher or the school psychologist: <a href="${href('psychology')}">psychological service</a>. Free helplines: <a href="tel:111">111</a>, <a href="tel:150">150</a>.</p>`) },
    ]);

    // ------------------------------------------------------------------ documents & sources
    const docs = ui.docList([
      ...['fire-safety'].map(docById).filter(Boolean),
      docById('access-control-order'),
      docById('anti-terror-drills-plan'),
      docById('safe-route-map'),
      docById('security-contract'),
    ]);
    const sources = ui.linkList([
      { href: adilet('P2100000305'), icon: 'scale', label: X('Терроризм тұрғысынан осал объектілерді антитеррорлық қорғауды ұйымдастыруға қойылатын талаптар (ҚР Үкіметінің 06.05.2021 № 305 қаулысы)', 'Требования к организации антитеррористической защиты объектов, уязвимых в террористическом отношении (постановление Правительства РК от 06.05.2021 № 305)', 'Requirements for anti-terror protection of vulnerable facilities (Government decree No. 305 of 06.05.2021)'), note: 'adilet.zan.kz' },
      { href: adilet('V2200027414'), icon: 'scale', label: X('Білім беру саласындағы объектілерді антитеррорлық қорғауды ұйымдастыру жөніндегі нұсқаулық (№ 117 бұйрық, 30.03.2022)', 'Инструкция по организации антитеррористической защиты объектов в области образования (приказ № 117 от 30.03.2022)', 'Instruction on anti-terror protection of education facilities (order No. 117 of 30.03.2022)'), note: 'adilet.zan.kz' },
      { href: adilet('V2200026867'), icon: 'scale', label: X('Өрт қауіпсіздігі қағидалары (ҚР ТЖМ 21.02.2022 № 55 бұйрығы)', 'Правила пожарной безопасности (приказ МЧС РК от 21.02.2022 № 55)', 'Fire safety rules (Emergencies Ministry order No. 55 of 21.02.2022)'), note: 'adilet.zan.kz' },
      { href: adilet('V2300033003'), icon: 'scale', label: X('Жол жүрісі қағидалары (ҚР ІІМ 30.06.2023 № 534 бұйрығы)', 'Правила дорожного движения (приказ МВД РК от 30.06.2023 № 534)', 'Road traffic rules (Interior Ministry order No. 534 of 30.06.2023)'), note: 'adilet.zan.kz' },
      { href: adilet('V2100022857'), icon: 'scale', label: X('Білім беру ұйымдарына әкелуге тыйым салынған заттар мен заттектердің тізбесі (ҚР БҒМ 25.05.2021 № 235 бұйрығы)', 'Перечень предметов и веществ, запрещённых к вносу в организации образования (приказ МОН РК от 25.05.2021 № 235)', 'List of items and substances banned from education organisations (MES order No. 235 of 25.05.2021)'), note: 'adilet.zan.kz' },
      { href: `https://www.gov.kz/memleket/entities/emer?lang=${lang === 'kz' ? 'kk' : lang}`, icon: 'globe', label: X('ҚР Төтенше жағдайлар министрлігі', 'Министерство по чрезвычайным ситуациям РК', 'Ministry of Emergency Situations'), note: 'gov.kz' },
    ]);

    const related = ui.linkList([
      { href: href('health'), icon: 'medical', label: X('Медициналық қызмет', 'Медицинское обслуживание', 'Health care'), note: X('Бала ауырса не істеу керек', 'Что делать, если ребёнок заболел', 'What to do if your child is ill') },
      { href: href('psychology'), icon: 'heart', label: X('Психологиялық қызмет', 'Психологическая служба', 'Psychological service'), note: X('Буллинг профилактикасы, 111 және 150', 'Профилактика буллинга, 111 и 150', 'Anti-bullying, 111 and 150') },
      { href: href('facilities'), icon: 'building', label: X('Ғимарат және кабинеттер', 'Здание и кабинеты', 'Building & classrooms') },
      { href: href('distance'), icon: 'globe', label: X('Қашықтан оқыту', 'Дистанционное обучение', 'Distance learning') },
      { href: href('meals'), icon: 'utensils', label: X('Мектептегі тамақтану', 'Школьное питание', 'School meals') },
    ]);

    return [
      intro,
      ui.split({ ratio: '1:2', left: toc, right: ui.section({ id: 'numbers', eyebrow: X('Жаттап алыңыз', 'Запомните', 'Remember these'), title: X('Шұғыл қызметтердің нөмірлері', 'Номера экстренных служб', 'Emergency numbers'), lead: X('Нөмірлер тегін, ұялы телефоннан да қоңырау шалуға болады.', 'Звонки бесплатные, в том числе с мобильного.', 'Calls are free, including from mobiles.'), body: numbers }) }),
      ui.section({ id: 'security', tone: 'biology', eyebrow: X('Антитеррорлық қорғалу', 'Антитеррористическая защищённость', 'Anti-terror protection'), title: X('Күзет және техникалық қорғау', 'Охрана и технические средства защиты', 'Security and technical protection'), lead: X('Білім беру объектілеріне арналған № 117 нұсқаулықта көзделген шаралар және олардың мектептегі мәртебесі.', 'Меры, предусмотренные инструкцией № 117 для объектов образования, и их статус в школе.', 'Measures required by instruction No. 117 for education facilities and their status at the school.'), body: security + drills + drillsNote + secretNote }),
      ui.section({ id: 'access', eyebrow: X('Ата-аналар мен қонақтарға', 'Родителям и гостям', 'For parents and visitors'), title: X('Өткізу режимі', 'Пропускной режим', 'Access control'), body: access + accessPending }),
      ui.section({ id: 'fire', eyebrow: X('101', '101', '101'), title: X('Өрт қауіпсіздігі', 'Пожарная безопасность', 'Fire safety'), body: fireSteps }),
      ui.section({ id: 'road', eyebrow: X('Жол жүрісі қағидалары', 'Правила дорожного движения', 'Road rules'), title: X('Мектепке қауіпсіз жол', 'Безопасная дорога в школу', 'A safe way to school'), body: road }),
      ui.section({ id: 'parents', eyebrow: X('Жадынама', 'Памятка', 'Checklist'), title: X('Ата-аналар не білуі керек', 'Что важно знать родителям', 'What parents should know'), body: parents }),
      ui.section({ id: 'docs', eyebrow: X('Растайтын құжаттар', 'Подтверждающие документы', 'Supporting documents'), title: X('Құжаттар', 'Документы', 'Documents'), body: docs + `<h3 class="cmp-h3">${L(X('Нормативтік негіз', 'Нормативная база', 'Legal basis'))}</h3>` + sources }),
      ui.section({ title: X('Осы бөлімде', 'В этом разделе', 'In this section'), body: related }),
    ].join('\n');
  },
};
