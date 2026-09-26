// Clubs & sections (ORDER-114 §G item 55: schedule, coverage, directions).
// Facts: "Тегін үйірмелер" — school's Instagram bio; directions — admission post of 12.08.2025
// (https://www.instagram.com/p/DNR-UIYM5uW/): robotics & AI, programming, public speaking, financial literacy,
// sports clubs (= SPEC §8 club list). "In-depth & olympiad maths" is a TEACHING programme in the same post, not a club →
// shown only as a cross-link to curriculum.html. "Free" is stated once, at section level, sourced to the bio (not per card).
// Everything else (schedule, grades, leaders, coverage, which clubs are free) → pending.
// Timetable: rendered as a table only when S.clubs (TODO(school)) holds real rows:
//   S.clubs = [{ id:'robotics', grades, days, room, leader, participants }], S.clubsCoverage = '…%'.
const X = (kz, ru, en) => ({ kz, ru, en });
const POST = 'https://www.instagram.com/p/DNR-UIYM5uW/';

export default {
  slug: 'clubs',
  group: 'upbringing',
  order: 20,
  styles: ['upbringing'],
  title: X('Үйірмелер мен секциялар', 'Кружки и секции', 'Clubs and sections'),
  description: X(
    '«Керемет» мектебінің үйірмелері: робототехника және ЖИ, бағдарламалау, шешендік өнер, қаржылық сауаттылық, спорт секциялары. Кесте және жазылу.',
    'Кружки школы «Керемет»: робототехника и ИИ, программирование, ораторское искусство, финансовая грамотность, спортивные секции. Расписание и запись.',
    'Keremet’s clubs: robotics & AI, programming, public speaking, financial literacy and sports. Timetable and how to join.',
  ),
  lead: X(
    'Сабақтан кейін бала өз қызығушылығын дамытып, жаңа дағдыларды үйренеді. Мектеп өз парақшасында «Тегін үйірмелер» деп жариялайды.',
    'После уроков ребёнок развивает свои интересы и осваивает новые навыки. Школа заявляет на своей странице: «Бесплатные кружки».',
    'After lessons children follow their interests and learn new skills. The school advertises “free clubs” on its profile.',
  ),
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, { ui, S, L, href, docById }) {

    const clubs = [
      { id: 'robotics', theme: 'physics', icon: 'robot',
        title: X('Робототехника және жасанды интеллект', 'Робототехника и искусственный интеллект', 'Robotics and AI'),
        text: X('Модельдерді құрастыру және бағдарламалау, жасанды интеллекттің қалай жұмыс істейтінімен танысу.', 'Сборка и программирование моделей, знакомство с тем, как работает искусственный интеллект.', 'Building and programming models, and discovering how artificial intelligence works.'),
        skills: [X('инженерлік ойлау', 'инженерное мышление', 'engineering thinking'), X('логика', 'логика', 'logic'), X('командада жұмыс', 'командная работа', 'teamwork')] },
      { id: 'coding', theme: 'informatics', icon: 'code',
        title: X('Бағдарламалау', 'Программирование', 'Programming'),
        text: X('Алгоритмдер мен бағдарламалау негіздері, өз шағын жобаларын жасау.', 'Основы алгоритмов и программирования, создание собственных небольших проектов.', 'Algorithms and programming basics, and building small projects of their own.'),
        skills: [X('алгоритмдер', 'алгоритмы', 'algorithms'), X('цифрлық сауат', 'цифровая грамотность', 'digital literacy'), X('жобалар', 'проекты', 'projects')] },
      { id: 'speaking', theme: 'languages', icon: 'mic',
        title: X('Шешендік өнер', 'Ораторское мастерство', 'Public speaking'),
        text: X('Көпшілік алдында сенімді сөйлеу, ойын анық әрі әдемі жеткізу, пікірсайыс мәдениеті.', 'Уверенные выступления перед аудиторией, ясная и красивая речь, культура дебатов.', 'Speaking confidently in front of others, clear and expressive speech, the culture of debate.'),
        skills: [X('сенімділік', 'уверенность', 'confidence'), X('риторика', 'риторика', 'rhetoric'), X('пікірсайыс', 'дебаты', 'debate')] },
      { id: 'finance', theme: 'geography', icon: 'coins',
        title: X('Қаржылық сауаттылық', 'Финансовая грамотность', 'Financial literacy'),
        text: X('Ақша, жинақ және жоспарлау туралы — балаларға түсінікті тілде.', 'Про деньги, накопления и планирование — понятным для детей языком.', 'Money, saving and planning — in words children understand.'),
        skills: [X('жоспарлау', 'планирование', 'planning'), X('өмірдегі математика', 'математика в жизни', 'maths in real life'), X('жауапкершілік', 'ответственность', 'responsibility')] },
      { id: 'sport', theme: 'biology', icon: 'ball',
        title: X('Спорт секциялары', 'Спортивные секции', 'Sports clubs'),
        text: X('Денсаулық, төзімділік және командалық рух. Спорт түрлерінің тізімі нақтылануда.', 'Здоровье, выносливость и командный дух. Перечень видов спорта уточняется.', 'Health, stamina and team spirit. The list of sports is being confirmed.'),
        skills: [X('денсаулық', 'здоровье', 'health'), X('төзімділік', 'выносливость', 'stamina'), X('командалық рух', 'командный дух', 'team spirit')] },
    ];

    // ---------------------------------------------------------------- intro
    const freeWord = L(X('ТЕГІН', 'БЕСПЛАТНО', 'FREE'));
    const intro = ui.split({
      ratio: '3:2', align: 'center',
      left: `${ui.eyebrow(X('Сабақтан кейін', 'После уроков', 'After lessons'))}
<h2 class="sec__title">${L(X('Қызығушылықтың бәріне — тегін үйірме', 'Для каждого интереса — бесплатный кружок', 'A free club for every interest'))}</h2>
<p class="lead" style="margin-top:18px">${L(X(
        'Мектеп өзінің ерекшеліктерінің бірі ретінде тегін үйірмелерді атайды. Роботтар мен кодтан бастап шешендік өнер мен спортқа дейін: бала өзіне ұнайтын бағытты таңдап, дағдыларын дамытады.',
        'Одной из своих особенностей школа называет бесплатные кружки. От роботов и кода до ораторского искусства и спорта: ребёнок выбирает близкое ему направление и развивает навыки.',
        'The school names free clubs as one of its strengths. From robots and code to public speaking and sport, every child can pick what they enjoy and grow their skills.',
      ))}</p>
<div style="margin-top:22px">${ui.chips(S.features.map((f) => ({ icon: f.icon, label: f.label })))}</div>
<div class="cluster" style="margin-top:26px">${ui.button({ href: '#schedule', label: X('Кесте және жазылу', 'Расписание и запись', 'Schedule and sign-up'), icon: 'arrow-right' })}${ui.button({ href: `tel:${S.contacts.phone.tel}`, label: S.contacts.phone.display, iconLeft: 'phone', kind: 'ghost' })}</div>`,
      right: `<div class="ub-free" role="img" aria-label="${L(X('Үйірмелер — тегін', 'Кружки — бесплатно', 'Clubs are free'))}"><div class="ub-free__core"><div><p class="ub-free__big" style="--len:${[...freeWord].length}">${freeWord}</p><p class="ub-free__small">${L(X('мектеп оқушыларына арналған үйірмелер', 'кружки для учеников школы', 'clubs for the school’s pupils'))}</p></div></div>
<div class="ub-free__orbit" aria-hidden="true"><span>${ui.icon('robot', { size: 24 })}</span><span>${ui.icon('mic', { size: 24 })}</span><span>${ui.icon('ball', { size: 24 })}</span><span>${ui.icon('coins', { size: 24 })}</span><span>${ui.icon('code', { size: 24 })}</span></div></div>`,
    });

    // ---------------------------------------------------------------- club grid
    const grid = `<ul class="ub-clubs" role="list" data-reveal-stagger>${clubs.map((c) => `<li class="ub-club pattern" data-theme="${c.theme}" id="club-${c.id}">
<span class="ub-club__icon" aria-hidden="true">${ui.icon(c.icon, { size: 36 })}</span>
<h3 class="ub-club__title">${L(c.title)}</h3>
<p class="ub-club__text">${L(c.text)}</p>
<ul class="ub-club__skills" role="list" aria-label="${L(X('Дамытатын дағдылар', 'Развиваемые навыки', 'Skills'))}">${c.skills.map((s) => `<li>${L(s)}</li>`).join('')}</ul>
${ui.icon(c.icon, { size: 150, cls: 'ub-club__doodle' })}</li>`).join('')}
<li class="ub-club ub-club--more pattern" data-theme="math" id="club-curriculum">
<span class="ub-club__kind">${L(X('Үйірме емес — сабақта', 'Не кружок — на уроках', 'Not a club — in lessons'))}</span>
<span class="ub-club__icon" aria-hidden="true">${ui.icon('trophy', { size: 36 })}</span>
<h3 class="ub-club__title"><a class="ub-club__link" href="${href('curriculum')}">${L(X('Олимпиадалық математика', 'Олимпиадная математика', 'Olympiad maths'))}</a></h3>
<p class="ub-club__text">${L(X('Тереңдетілген және олимпиадалық математика мен Сингапур математикасын мектеп үйірме ретінде емес, оқу бағдарламасы ретінде жариялаған.', 'Углублённую и олимпиадную математику и сингапурскую математику школа заявляет как учебные программы, а не как кружки.', 'The school advertises in-depth and olympiad maths and Singapore maths as teaching programmes, not as clubs.'))}</p>
<p class="ub-club__foot">${ui.icon('arrow-right', { size: 16 })}<span>${L(X('«Оқу жоспары мен бағдарламалар» бетінде', 'На странице «Учебный план и программы»', 'See the Curriculum page'))}</span></p>
${ui.icon('calculator', { size: 150, cls: 'ub-club__doodle' })}</li></ul>`;
    const freeNote = ui.more({ tone: 'card', icon: 'info', label: X('Тегін үйірмелер туралы', 'О бесплатных кружках', 'About free clubs'), body: `<p class="ub-free-note">${ui.icon('info', { size: 20 })}<span>${L(X(
      `<strong>Тегін үйірмелер туралы.</strong> Мектептің Instagram парақшасында «Тегін үйірмелер» деп көрсетілген. Әр үйірменің шарттарын (тегін бе, қай сыныптарға, орын саны) мектеп нақтылап жатыр — жазылмас бұрын <a class="ub-nw" href="tel:${S.contacts.phone.tel}">${S.contacts.phone.display}</a> нөміріне хабарласыңыз.`,
      `<strong>О бесплатных кружках.</strong> На странице школы в Instagram указано: «Тегін үйірмелер» (бесплатные кружки). Условия каждого кружка (бесплатно ли, для каких классов, число мест) школа уточняет — перед записью позвоните по номеру <a class="ub-nw" href="tel:${S.contacts.phone.tel}">${S.contacts.phone.display}</a>.`,
      `<strong>About free clubs.</strong> The school’s Instagram profile says “Тегін үйірмелер” (free clubs). The school is confirming the terms of each club (whether it is free, which grades, how many places), so please call <a class="ub-nw" href="tel:${S.contacts.phone.tel}">${S.contacts.phone.display}</a> before signing up.`,
    ))}</span></p>` });
    const srcNote = ui.more({ icon: 'instagram', label: X('Дереккөз', 'Источник', 'Source'), body: X(
      `Бағыттар мектептің Instagram парақшасындағы «Тегін үйірмелер» деген мәлімет пен 12.08.2025 жарияланған қабылдау хабарландыруы (${ui.extLink(POST, 'instagram.com')}) бойынша көрсетілген. Бағыттардың қысқа сипаттамасы — ата-аналарға арналған түсіндірме.`,
      `Направления указаны по данным страницы школы в Instagram («Тегін үйірмелер» — бесплатные кружки) и объявлению о приёме от 12.08.2025 (${ui.extLink(POST, 'instagram.com')}). Краткие описания — пояснения для родителей.`,
      `Directions are listed from the school’s Instagram profile (“Тегін үйірмелер” — free clubs) and the admission announcement of 12.08.2025 (${ui.extLink(POST, 'instagram.com')}). The short descriptions are ours, for parents.`,
    ) });

    // ---------------------------------------------------------------- schedule & coverage
    const rowsData = Array.isArray(S.clubs) ? S.clubs.filter((r) => r && (r.days || r.leader)) : [];
    const byId = Object.fromEntries(clubs.map((c) => [c.id, c]));
    const schedule = rowsData.length
      ? ui.table({
        caption: X('2026–2027 оқу жылындағы үйірмелер кестесі', 'Расписание кружков на 2026–2027 учебный год', 'Club timetable, 2026–2027'),
        head: [X('Үйірме', 'Кружок', 'Club'), X('Сыныптар', 'Классы', 'Grades'), X('Күндері мен уақыты', 'Дни и время', 'Days and time'), X('Кабинет', 'Кабинет', 'Room'), X('Жетекшісі', 'Руководитель', 'Leader'), X('Қатысушылар', 'Участники', 'Participants')],
        rows: rowsData.map((r) => [L(byId[r.id]?.title || r.title || r.id), L(r.grades || ''), L(r.days || ''), L(r.room || ''), L(r.leader || ''), String(r.participants ?? '')]),
      }) + (S.clubsCoverage ? ui.note(X(`Оқушыларды үйірмелермен қамту: ${S.clubsCoverage}`, `Охват учеников кружками: ${S.clubsCoverage}`, `Pupils attending clubs: ${S.clubsCoverage}`)) : '')
      : ui.pendingGroup(lang, [{
        title: X('Үйірмелер кестесі жарияланады', 'Расписание кружков будет опубликовано', 'The club timetable will be published'),
        note: X(
          `2026–2027 оқу жылының кестесі бекітілгеннен кейін мұнда әр үйірменің күндері, уақыты, сыныптары және жетекшісі жарияланады. Оған дейін кестені <a class="ub-nw" href="tel:${S.contacts.phone.tel}">${S.contacts.phone.display}</a> нөмірі арқылы біле аласыз.`,
          `Когда расписание на 2026–2027 учебный год будет утверждено, здесь появятся дни, время, классы и руководитель каждого кружка. А пока расписание можно узнать по номеру <a class="ub-nw" href="tel:${S.contacts.phone.tel}">${S.contacts.phone.display}</a>.`,
          `Once the 2026–2027 timetable is approved, the days, times, grades and leader of every club will appear here. Until then, ask about the timetable on <a class="ub-nw" href="tel:${S.contacts.phone.tel}">${S.contacts.phone.display}</a>.`,
        ),
      }, { title: X('Кесте мен сыныптар нақтылануда', 'Расписание и классы уточняются', 'Schedule and grades to be confirmed') }], { title: X('Үйірмелер кестесі дайындалуда', 'Расписание кружков готовится', 'The club timetable is in preparation') })
        + `<p class="ub-ask">${ui.icon('phone', { size: 18 })}<span>${L(X('Қазір кестені телефон арқылы біліңіз:', 'Пока расписание можно узнать по телефону:', 'For now, ask about the timetable by phone:'))} <a class="ub-nw" href="tel:${S.contacts.phone.tel}">${S.contacts.phone.display}</a></span></p>`;
    const scheduleDocs = ui.docList([
      docById('clubs-timetable'),
      docById('clubs-coverage'),
    ], { groupPending: true });

    // ---------------------------------------------------------------- how to join
    const join = ui.steps([
      { title: X('Бағытты таңдаңыз', 'Выберите направление', 'Choose a direction'), text: X('Баламен бірге оған не қызық екенін талқылаңыз — бірнеше үйірмені қатар байқап көруге болады.', 'Обсудите с ребёнком, что ему интересно, — можно попробовать несколько кружков.', 'Talk with your child about what excites them — trying several clubs is fine.') },
      { title: X('Мектеппен байланысыңыз', 'Свяжитесь со школой', 'Contact the school'), text: X(`Кесте, бос орындар және жазылу тәртібі туралы телефон немесе WhatsApp арқылы біліңіз: <a class="ub-nw" href="tel:${S.contacts.phone.tel}">${S.contacts.phone.display}</a>.`, `Узнайте о расписании, свободных местах и порядке записи по телефону или WhatsApp: <a class="ub-nw" href="tel:${S.contacts.phone.tel}">${S.contacts.phone.display}</a>.`, `Ask about the timetable, free places and how to sign up by phone or WhatsApp: <a class="ub-nw" href="tel:${S.contacts.phone.tel}">${S.contacts.phone.display}</a>.`) },
      { title: X('Алғашқы сабаққа келіңіз', 'Приходите на первое занятие', 'Come to the first session'), text: X('Балаңыз үйірмеде өзін қалай сезінетінін бақылап, әсерімен бөлісуін сұраңыз — қызығушылық осылай бекиді.', 'Понаблюдайте, как ребёнок чувствует себя на занятиях, и расспросите о впечатлениях — так интерес закрепляется.', 'Notice how your child feels at the club and ask about it — that is how interest takes root.') },
    ]);

    const IG = S.contacts.instagram;
    const photos = `<p class="ub-ig">${ui.icon('instagram', { size: 22 })}<span>${L(X(
      `Үйірме сабақтарынан түсірілген сәттерді мектептің Instagram парақшасынан көре аласыз: ${ui.extLink(IG.url, IG.handle)}. Сайтта фотосуреттер ата-аналардың келісімімен ғана жарияланады.`,
      `Моменты с занятий кружков смотрите на странице школы в Instagram: ${ui.extLink(IG.url, IG.handle)}. На сайте фотографии публикуются только с согласия родителей.`,
      `See moments from club sessions on the school’s Instagram: ${ui.extLink(IG.url, IG.handle)}. Photos appear on this site only with parents’ consent.`,
    ))}</span></p>`;

    const related = ui.linkList([
      { href: href('upbringing'), icon: 'heart', label: X('Тәрбие жұмысы', 'Воспитательная работа', 'Upbringing'), note: X('«Адал азамат» бағдарламасы және оның жобалары', 'Программа «Адал азамат» и её проекты', 'The “Adal Azamat” programme and its projects') },
      { href: href('curriculum'), icon: 'book', label: X('Оқу жоспары мен бағдарламалар', 'Учебный план и программы', 'Curriculum & programmes'), note: X('Сингапур математикасы, тереңдетілген тілдер', 'Сингапурская математика, углублённые языки', 'Singapore maths, in-depth languages') },
      { href: href('schedule'), icon: 'clock', label: X('Сабақ кестесі', 'Расписание', 'Timetable') },
      { href: href('events'), icon: 'calendar', label: X('Іс-шаралар', 'События', 'Events') },
      { href: href('parents'), icon: 'handshake', label: X('Ата-аналарға', 'Родителям', 'For parents') },
    ]);

    return [
      intro,
      ui.section({ id: 'directions', eyebrow: X('5 бағыт', '5 направлений', '5 directions'), title: X('Үйірмелер мен бағыттар', 'Кружки и направления', 'Clubs and directions'), lead: X('Әр карточкада — бағыт мазмұны және ол дамытатын дағдылар.', 'На каждой карточке — содержание направления и навыки, которые оно развивает.', 'Each card shows what the club is about and the skills it builds.'), body: grid + `<div class="dz-row ub-row">${freeNote}${srcNote}</div>` }),
      ui.section({ id: 'schedule', tone: 'card', eyebrow: X('Кесте және қамту', 'Расписание и охват', 'Timetable and coverage'), title: X('Үйірмелер кестесі', 'Расписание кружков', 'Club timetable'), body: schedule + scheduleDocs }),
      ui.section({ id: 'join', eyebrow: X('Қалай жазылуға болады', 'Как записаться', 'How to join'), title: X('Үш қарапайым қадам', 'Три простых шага', 'Three simple steps'), body: join }),
      ui.section({ id: 'gallery', eyebrow: X('Фото', 'Фото', 'Photos'), title: X('Үйірме өмірінен', 'Из жизни кружков', 'Club life'), body: photos }),
      ui.banner({ theme: 'arts', icon: 'star', eyebrow: X('«Адал азамат»', '«Адал азамат»', '“Adal Azamat”'), title: X('Үйірмелер — тәрбие жұмысының бір бөлігі', 'Кружки — часть воспитательной работы', 'Clubs are part of upbringing'), text: X('«Smart Bala», «Шабыт», «Ұшқыр ой алаңы» сияқты республикалық жобалар туралы оқыңыз.', 'Узнайте о республиканских проектах «Smart Bala», «Шабыт», «Ұшқыр ой алаңы».', 'Read about national projects such as Smart Bala, Shabyt (Inspiration) and Ushqyr Oi Alany (a debate platform).'), href: `${href('upbringing')}#projects`, label: X('Жобалар', 'Проекты', 'Projects') }),
      ui.section({ eyebrow: X('Қараңыз', 'Смотрите также', 'See also'), title: X('Осы бөлімде', 'В этом разделе', 'In this section'), body: related }),
    ].join('\n');
  },
};
