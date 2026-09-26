// Leadership — director (verified from the state registration certificate), deputies (pending),
// personal reception schedule (pending values), contacts. ORDER-114 C.28, C.29, M.86.
// Facts: src/data/school.mjs (legal.director, legal.founder); scan: assets/docs/registration-certificate-2026.jpg.
const ADILET = (code, lang) => `https://adilet.zan.kz/${lang === 'kz' ? 'kaz' : 'rus'}/docs/${code}`;

export default {
  slug: 'leadership',
  group: 'about',
  order: 20,
  title: { kz: 'Басшылық', ru: 'Руководство', en: 'Leadership' },
  description: {
    kz: '«Керемет» мектебінің басшылығы: директор Караманова Диана Муратхановна, орынбасарлар, азаматтарды жеке қабылдау кестесі және байланыс.',
    ru: 'Руководство школы «Керемет»: директор Караманова Диана Муратхановна, заместители, график личного приёма граждан и контакты.',
    en: 'Keremet School leadership: Director Diana Karamanova, deputy directors, personal reception hours and contacts.',
  },
  lead: {
    kz: 'Мектепті тікелей басқаратын директор, оның орынбасарлары және азаматтарды жеке қабылдау тәртібі.',
    ru: 'Директор, непосредственно управляющий школой, его заместители и порядок личного приёма граждан.',
    en: 'The director who runs the school day to day, the deputy directors and how to book a personal meeting.',
  },
  styles: ['about'],
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, { ui, S, L, href, fmt, asset, docById }) {
    const X = (kz, ru, en) => ({ kz, ru, en });
    const d = S.legal.director;
    const reg = docById('registration-certificate');
    const pill = (kind, label, ic) => `<span class="ab-pill ab-pill--${kind}">${ic ? ui.icon(ic, { size: 14 }) : ''}${L(label)}</span>`;
    const WAIT = X('Нақтылануда', 'Уточняется', 'To be confirmed');
    const wait = pill('wait', WAIT, 'hourglass');
    const ok = (lbl) => pill('ok', lbl, 'check');
    const initials = lang === 'en' ? 'DK' : 'КД';
    const isLoc = (v) => typeof v === 'string' || typeof v === 'number' || (v && typeof v === 'object' && ('kz' in v || 'ru' in v || 'en' in v));
    const muted = (lbl) => `<span class="muted">${L(lbl)}</span>`;
    const mail = (e) => `<a href="mailto:${e}">${e}</a>`;

    // ---------------------------------------------------------------- data hooks (school.mjs → legal.director, deputies)
    // d.photo            : 'img/staff/director.jpg' (path under assets/, published with consent)
    // d.education        : {kz,ru,en}  or  { text: {kz,ru,en}, experience: {kz,ru,en}, category: {kz,ru,en}, compliance: {kz,ru,en} }
    // d.appointmentOrder : { number: '…', date: 'YYYY-MM-DD' }  or  {kz,ru,en}
    // d.reception        : {kz,ru,en}  e.g. 'Дүйсенбі, 15:00–17:00, 101-кабинет'
    // d.email            : 'name@keremet.edu.kz'
    // S.deputies         : [{ area: 'teaching'|'upbringing'|'admin', name, position: {kz,ru,en}, phone: {display, tel},
    //                         email, reception: {kz,ru,en}, photo, text: {kz,ru,en} }]
    // Every slot left null falls back to a pending pill; nothing below is invented.
    const edu = d.education ? (isLoc(d.education) ? { text: d.education } : d.education) : {};
    const ord = d.appointmentOrder;
    const ordTxt = ord ? (isLoc(ord) ? L(ord) : [ord.number && `№ ${ord.number}`, ord.date && fmt.date(ord.date)].filter(Boolean).join(' · ')) : '';
    const val = (v, hint) => (v ? L(v) : `${wait}${hint ? muted(hint) : ''}`);

    // ---------------------------------------------------------------- director profile
    const rows = [
      { k: X('Толық аты-жөні', 'Фамилия, имя, отчество', 'Full name'), v: `<strong>${L(d.name)}</strong> ${ok(X('Расталған', 'Подтверждено', 'Verified'))}` },
      { k: X('Лауазымы', 'Должность', 'Position'), v: L(X(
        'Директор — заңды тұлғаның уәкілетті органы тағайындаған басшы',
        'Директор — руководитель, назначенный уполномоченным органом юридического лица',
        'Director — head appointed by the authorised body of the legal entity')) },
      { k: X('Білімі', 'Образование', 'Education'), v: val(edu.text, X('ЖОО, мамандығы, бітірген жылы', 'вуз, специальность, год окончания', 'university, speciality, year')) },
      { k: X('Жалпы және басқарушылық өтілі', 'Общий и управленческий стаж', 'Total and management experience'), v: val(edu.experience) },
      { k: X('Біліктілік санаты', 'Квалификационная категория', 'Qualification category'), v: val(edu.category) },
      { k: X('Тағайындау туралы бұйрық', 'Приказ о назначении', 'Appointment order'), v: ordTxt || `${wait}${muted(X('нөмірі мен күні', 'номер и дата', 'number and date'))}` },
      { k: X('№ 338 үлгілік біліктілік сипаттамаларына сәйкестігі', 'Соответствие Типовым квалификационным характеристикам (приказ № 338)', 'Compliance with Standard Qualification Characteristics (Order No. 338)'), v: val(edu.compliance) },
      { k: X('Байланыс', 'Контакты', 'Contacts'), v: `<a href="tel:${S.contacts.phone.tel}">${S.contacts.phone.display}</a> ${muted(X('(мектеп телефоны)', '(телефон школы)', '(school phone)'))}${d.email ? `<br>${mail(d.email)}` : ''}` },
      { k: X('Жеке қабылдау', 'Личный приём', 'Personal reception'), v: d.reception ? `${L(d.reception)} <a href="#reception">${L(X('Кесте', 'График', 'Schedule'))}</a>` : `<a href="#reception">${L(X('Қабылдау кестесін қараңыз', 'См. график приёма', 'See the reception schedule'))}</a>` },
    ];
    const portrait = d.photo
      ? `<img class="ab-profile__portrait" src="${asset(d.photo)}" alt="${L(X(`${L(d.name)}, мектеп директоры`, `${L(d.name)}, директор школы`, `${L(d.name)}, head of school`))}" width="240" height="300" loading="lazy" style="object-fit:cover">`
      : `<div class="ab-profile__portrait" role="img" aria-label="${L(X('Директордың ресми фотосы жүктеледі', 'Официальное фото директора будет загружено', 'The director’s official photo will be uploaded'))}"><b aria-hidden="true">${initials}</b><small aria-hidden="true">${L(X('Фото жүктеледі', 'Фото загружается', 'Photo pending'))}</small></div>`;
    const profile = `<article class="ab-profile" aria-labelledby="dir-name">
<div class="ab-profile__visual pattern" data-theme="hero">${ui.shanyrakArt()}
${portrait}
<div><p class="ab-profile__role">${L(X('Мектеп директоры', 'Директор школы', 'Head of school'))}</p>
<h3 class="ab-profile__name" id="dir-name">${L(d.name)}</h3>
<p class="ab-profile__src">${pill('ok', X('Мемлекеттік тіркеу анықтамасы, 25.01.2026', 'Справка о госрегистрации, 25.01.2026', 'State registration certificate, 25.01.2026'), 'check')}</p></div>
</div>
<div class="ab-profile__body">${ui.facts(rows)}</div>
</article>`;
    const dirDocs = ui.docList([
      docById('director-order'),
      docById('director-diploma'),
      reg && { ...reg, note: `${L(reg.note)} <a href="${href('license')}#registration">${L(X('Мәтіндік нұсқасы', 'Текстовая версия', 'Text version'))}</a>` },
    ].filter(Boolean), { thumbs: true });
    // Pending note lists only what is still missing (disappears once every slot is filled).
    const missing = [
      !d.photo && X('директордың ресми фотосы (келісімімен)', 'официальное фото директора (с согласия)', 'the director’s official photo (with consent)'),
      !edu.text && X('білімі', 'образование', 'education'),
      !edu.experience && X('жалпы және басқарушылық өтілі', 'общий и управленческий стаж', 'total and management experience'),
      !edu.category && X('біліктілік санаты', 'квалификационная категория', 'qualification category'),
      !ord && X('тағайындау туралы бұйрықтың нөмірі мен күні', 'номер и дата приказа о назначении', 'appointment order number and date'),
      !d.reception && X('жеке қабылдау кестесі', 'график личного приёма', 'personal reception hours'),
      !d.email && X('жұмыс электрондық поштасы', 'рабочий адрес электронной почты', 'work e-mail'),
    ].filter(Boolean);
    const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    const dirNote = missing.length ? ui.pending({
      title: X('Толықтырылатын мәліметтер', 'Сведения будут дополнены', 'Details to be added'),
      note: X(...['kz', 'ru', 'en'].map((lg) => `${cap(missing.map((m) => m[lg]).join(', '))}.`)),
    }) : '';

    // ---------------------------------------------------------------- deputies (typical positions)
    const role = (icon, title, text, areas) => `<li class="ab-role"><div class="ab-role__top"><span class="ab-role__icon">${ui.icon(icon, { size: 24 })}</span><div><h3 class="ab-role__title">${L(title)}</h3></div></div>
<p>${pill('typ', X('Типтік лауазым — нақтылануда', 'Типовая должность — уточняется', 'Typical position — to be confirmed'), 'info')}</p>
<p class="ab-role__text">${L(text)}</p>
<ul class="ab-role__list" role="list">${areas.map((a) => `<li>${ui.icon('check', { size: 16 })}<span>${L(a)}</span></li>`).join('')}</ul>
<p class="muted small">${L(X('Аты-жөні, телефоны мен қабылдау кестесі:', 'ФИО, телефон и график приёма:', 'Name, phone and reception hours:'))} ${wait}</p></li>`;
    const deps = Array.isArray(S.deputies) ? S.deputies.filter((p) => p && p.name) : [];
    const depPeople = deps.length ? ui.people(deps.map((p) => ({
      name: p.name, role: p.position, photo: p.photo || null, text: p.text || null,
      reception: p.reception || null,
      contacts: [p.phone && { type: 'phone', value: p.phone.display || p.phone }, p.email && { type: 'email', value: p.email }].filter(Boolean),
    }))) : '';
    const deputiesTypical = `<ul class="ab-roles" role="list">
${role('book', X('Директордың оқу-әдістемелік ісі жөніндегі орынбасары', 'Заместитель директора по учебно-методической работе', 'Deputy Director for Teaching and Methodology'),
      X('Оқу-әдістемелік және ғылыми-әдістемелік жұмысты тікелей басқарады (№ 253 бұйрық, 25-тармақ).', 'Непосредственно руководит учебно-методической и научно-методической работой (приказ № 253, п. 25).', 'Directly manages teaching and methodological work (Order No. 253, para. 25).'),
      [X('Жұмыс оқу жоспары және сабақ кестесі', 'Рабочий учебный план и расписание', 'Working curriculum and timetable'),
        X('Әдістемелік кеңес пен әдістемелік бірлестіктер', 'Методический совет и методические объединения', 'Methodological council and subject associations'),
        X('Мектепішілік бақылау және оқу сапасы', 'Внутришкольный контроль и качество обучения', 'Internal quality control'),
        X('Бағалау, аттестаттау, олимпиадалар', 'Оценивание, аттестация, олимпиады', 'Assessment, attestation, olympiads')])}
${role('heart', X('Директордың тәрбие ісі жөніндегі орынбасары', 'Заместитель директора по воспитательной работе', 'Deputy Director for Upbringing'),
      X('Тәрбие жұмысын, сынып жетекшілерінің қызметін және ата-аналармен байланысты үйлестіреді.', 'Координирует воспитательную работу, деятельность классных руководителей и взаимодействие с родителями.', 'Coordinates upbringing work, class teachers and cooperation with parents.'),
      [X('Тәрбие жұмысының жылдық жоспары', 'Годовой план воспитательной работы', 'Annual upbringing plan'),
        X('Үйірмелер мен секциялар', 'Кружки и секции', 'Clubs and sports sections'),
        X('Психологиялық-әлеуметтік қызмет', 'Психолого-социальная служба', 'Psychological and social service'),
        X('Буллинг пен құқық бұзушылықтың алдын алу', 'Профилактика буллинга и правонарушений', 'Preventing bullying and offences')])}
</ul>`;
    const depNote = ui.note(X(
      'Орынбасарлар лауазымдарының атауы — жалпы білім беретін мектептерге тән типтік үлгі. Мектептің нақты штаттық құрылымы бекітілгеннен кейін карточкалар нақты деректермен ауыстырылады.',
      'Названия должностей заместителей — типовая схема для общеобразовательных школ. После утверждения штатной структуры школы карточки будут заменены реальными данными.',
      'The deputy titles follow the typical pattern for general schools. Once the school’s staffing structure is approved, these cards will be replaced with real data.'));

    // ---------------------------------------------------------------- reception schedule
    // Schedule not yet approved → one pending block instead of a table full of "to be confirmed" cells.
    const tel = `<a href="tel:${S.contacts.phone.tel}">${S.contacts.phone.display}</a>`;
    // As soon as the director's or any deputy's reception hours are filled in, a real table replaces the pending block.
    const recRows = [
      d.reception && [`<strong>${L(d.name)}</strong>`, X('Директор', 'Директор', 'Director'), d.reception],
      ...deps.filter((p) => p.reception).map((p) => [`<strong>${L(p.name)}</strong>`, p.position || X('Директордың орынбасары', 'Заместитель директора', 'Deputy director'), p.reception]),
    ].filter(Boolean);
    const reception = recRows.length ? ui.table({
      caption: X('Азаматтарды жеке қабылдау кестесі', 'График личного приёма граждан', 'Personal reception schedule'),
      head: [X('Аты-жөні', 'ФИО', 'Name'), X('Лауазымы', 'Должность', 'Position'), X('Күндері, уақыты, орны', 'Дни, время, место', 'Days, time, place')],
      rows: recRows,
    }) : `<div class="ab-empty">${ui.pending({
      title: X('2026–2027 оқу жылына арналған жеке қабылдау кестесі жарияланады', 'График личного приёма на 2026–2027 учебный год будет опубликован', 'The personal reception schedule for 2026–2027 will be published'),
      note: X(
        `Директор (${L(d.name)}) және оның орынбасарлары бойынша: қабылдау күндері, уақыты, орны (кабинет). Кесте бекітілгенге дейін алдын ала жазылу мектеп телефоны бойынша: ${tel}.`,
        `По директору (${L(d.name)}) и его заместителям: дни приёма, время, место (кабинет). До утверждения графика записаться можно по телефону школы: ${tel}.`,
        `For the director (${L(d.name)}) and the deputies: reception days, time and place (room). Until the schedule is approved, book via the school phone: ${tel}.`),
    })}</div>`;
    const howTo = ui.steps([
      { title: X('Алдын ала жазылыңыз', 'Запишитесь заранее', 'Book in advance'), text: X(`Мектеп телефоны бойынша қоңырау шалыңыз немесе WhatsApp-қа жазыңыз: <a href="tel:${S.contacts.phone.tel}">${S.contacts.phone.display}</a>.`, `Позвоните или напишите в WhatsApp по телефону школы: <a href="tel:${S.contacts.phone.tel}">${S.contacts.phone.display}</a>.`, `Call or message the school on WhatsApp: <a href="tel:${S.contacts.phone.tel}">${S.contacts.phone.display}</a>.`) },
      { title: X('Мәселені қысқаша сипаттаңыз', 'Кратко опишите вопрос', 'Describe your question'), text: X('Жазылу кезінде сұрағыңыздың тақырыбын айтсаңыз, қажетті маман қабылдауға дайындалады.', 'При записи назовите тему вопроса — это поможет подготовить ответ и пригласить нужного специалиста.', 'Tell us the topic when booking so the right person can prepare.') },
      { title: X('Немесе жазбаша жүгініңіз', 'Или обратитесь письменно', 'Or write to us'), text: X(`<a href="${href('feedback')}">Өтініш формасы</a> немесе <a href="${href('director-blog')}">директор блогы</a> арқылы сұрақ қоюға болады.`, `Задать вопрос можно через <a href="${href('feedback')}">форму обращения</a> или <a href="${href('director-blog')}">блог директора</a>.`, `You can also use the <a href="${href('feedback')}">appeal form</a> or the <a href="${href('director-blog')}">director’s blog</a>.`) },
    ]);

    // ---------------------------------------------------------------- what attestation checks
    const law = ui.callout({
      type: 'info', icon: 'scale',
      title: X('Мемлекеттік аттестаттауда не тексеріледі', 'Что проверяется при государственной аттестации', 'What the state attestation checks'),
      text: L(X(
        `№ 114-НҚ бұйрықпен бекітілген Қағидалардың 2-қосымшасындағы 3-өлшемшарт: басшының педагогтер лауазымдарының үлгілік біліктілік сипаттамаларына (№ 338 бұйрық) сәйкестігі. 5 балл: «біліктілік талаптарына сәйкес келеді; тағайындау белгіленген тәртіппен рәсімделген». Дереккөздер: ${ui.extLink(ADILET('V2600038645', lang), '№ 114-НҚ бұйрық')}, ${ui.extLink(ADILET('V090005750_', lang), '№ 338 бұйрық')}.`,
        `Критерий 3 Приложения 2 к Правилам, утверждённым приказом № 114-НҚ: соответствие руководителя Типовым квалификационным характеристикам должностей педагогов (приказ № 338). 5 баллов — «соответствует квалификационным требованиям; назначение оформлено в установленном порядке». Источники: ${ui.extLink(ADILET('V2600038645', lang), 'приказ № 114-НҚ')}, ${ui.extLink(ADILET('V090005750_', lang), 'приказ № 338')}.`,
        `Criterion 3 of Annex 2 to the Rules approved by Order No. 114-NK: the head must meet the Standard Qualification Characteristics for teaching positions (Order No. 338). 5 points: “meets the qualification requirements; the appointment is formalised as prescribed”. Sources: ${ui.extLink(ADILET('V2600038645', lang), 'Order No. 114-NK')}, ${ui.extLink(ADILET('V090005750_', lang), 'Order No. 338')} (in Russian/Kazakh).`)),
    });

    // ---------------------------------------------------------------- contacts & related
    const contacts = ui.split({
      ratio: '1:1', align: 'start',
      left: `<div class="stack">${ui.contactList({})}${S.contacts.emailConfirmed || !S.contacts.email ? '' : `<p class="note">${ui.icon('info', { size: 16 })}<span>${L(X(`${S.contacts.email} мекенжайы нақтылануда — әзірге телефон немесе WhatsApp арқылы хабарласыңыз.`, `Адрес ${S.contacts.email} уточняется — пока свяжитесь по телефону или WhatsApp.`, `The address ${S.contacts.email} is being confirmed — for now, please call or use WhatsApp.`))}</span></p>`}</div>`,
      right: ui.banner({
        theme: 'hero', icon: 'chat',
        eyebrow: X('Директор блогы', 'Блог директора', 'Director’s blog'),
        title: X('Директорға сұрақ қойыңыз', 'Задайте вопрос директору', 'Ask the director a question'),
        text: X('Сұрақтар мен ұсыныстарға директор блогында жауап беріледі.', 'На вопросы и предложения директор отвечает в своём блоге.', 'The director answers questions and suggestions in the blog.'),
        href: href('director-blog'), label: X('Блогқа өту', 'Перейти в блог', 'Open the blog'),
      }),
    });
    const related = ui.linkList([
      { href: href('structure'), icon: 'sitemap', label: X('Басқару құрылымы', 'Структура управления', 'Governance structure'), note: X('Органиграмма және алқалы органдар', 'Органиграмма и коллегиальные органы', 'Organigram and councils') },
      { href: href('board'), icon: 'handshake', label: X('Қамқоршылық кеңес', 'Попечительский совет', 'Board of Trustees') },
      { href: href('teachers'), icon: 'users', label: X('Педагогтер құрамы', 'Педагогический состав', 'Teaching staff') },
      { href: href('feedback'), icon: 'chat', label: X('Өтініш жолдау', 'Обращения граждан', 'Send an appeal') },
    ]);

    const toc = ui.toc([
      { id: 'director', label: X('Директор', 'Директор', 'Director') },
      { id: 'deputies', label: X('Директордың орынбасарлары', 'Заместители директора', 'Deputy directors') },
      { id: 'reception', label: X('Жеке қабылдау кестесі', 'График личного приёма', 'Reception schedule') },
      { id: 'attestation', label: X('Басшыға қойылатын талаптар', 'Требования к руководителю', 'Requirements for the head') },
      { id: 'contacts', label: X('Байланыс', 'Контакты', 'Contacts') },
    ]);
    const intro = ui.split({
      ratio: '2:1', align: 'start', cls: 'ab-intro',
      left: `${ui.eyebrow(X('Дара басшылық және алқалылық', 'Единоначалие и коллегиальность', 'Single leadership and collegiality'))}
<p class="lead">${L(X(
        '«Білім туралы» Заңның 44-бабына сәйкес білім беру ұйымын басқару дара басшылық пен алқалылық қағидаттарында жүзеге асырылады, ал ұйымды тікелей оның басшысы басқарады.',
        'Согласно статье 44 Закона «Об образовании» управление организацией образования осуществляется на принципах единоначалия и коллегиальности, а непосредственное управление осуществляет её руководитель.',
        'Under Article 44 of the Law on Education, a school is governed on the principles of single leadership and collegiality; day-to-day management is carried out by its head.'))}</p>
<p class="ab-src">${L(X('Дереккөз', 'Источник', 'Source'))}: ${ui.extLink(ADILET('Z070000319_', lang), X('ҚР «Білім туралы» Заңы, 44-бап', 'Закон РК «Об образовании», ст. 44', 'Law of the RK “On Education”, Art. 44'))}</p>`,
      right: toc,
    });

    return [
      intro,
      ui.section({ id: 'director', eyebrow: X('Мектеп басшысы', 'Руководитель школы', 'Head of school'), title: X('Директор', 'Директор', 'Director'), body: profile + dirNote + `<h3>${L(X('Растайтын құжаттар', 'Подтверждающие документы', 'Supporting documents'))}</h3>` + dirDocs }),
      ui.section({ id: 'deputies', eyebrow: X('Басқару командасы', 'Управленческая команда', 'Management team'), title: X('Директордың орынбасарлары', 'Заместители директора', 'Deputy directors'), lead: X('Әр орынбасар бойынша толық аты-жөні, жетекшілік ететін бағыттары, байланыс деректері және қабылдау кестесі жарияланады.', 'По каждому заместителю публикуются ФИО полностью, курируемые направления, контакты и график приёма.', 'For each deputy we publish the full name, areas of responsibility, contacts and reception hours.'), body: depPeople || (deputiesTypical + depNote) }),
      ui.section({ id: 'reception', tone: 'hero', eyebrow: X('Азаматтарды қабылдау', 'Приём граждан', 'Meeting the public'), title: X('Жеке қабылдау кестесі', 'График личного приёма', 'Personal reception schedule'), lead: X('Ата-аналар мен азаматтар басшылыққа алдын ала жазылып, жеке қабылдауға келе алады.', 'Родители и граждане могут записаться и прийти на личный приём к руководству школы.', 'Parents and members of the public can book a personal meeting with the school’s leadership.'), body: reception + howTo }),
      ui.section({ id: 'attestation', title: X('Басшыға қойылатын талаптар', 'Требования к руководителю', 'Requirements for the head'), body: law }),
      ui.section({ id: 'contacts', eyebrow: X('Хабарласыңыз', 'Свяжитесь с нами', 'Get in touch'), title: X('Байланыс', 'Контакты', 'Contacts'), body: contacts }),
      ui.section({ title: X('Осы бөлімде', 'В этом разделе', 'In this section'), body: related }),
    ].join('\n');
  },
};
