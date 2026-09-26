// Building & classrooms — ORDER-114 §H items 58 (basis of use, capacity), 59 (rooms per order №70),
// 61 (СЭЗ / fire act), 64 (accessible environment). Facts: 2GIS card (2 storeys, ramp, accessible entrance,
// 7 parking spaces, 250 m from the «проспект К. Жалаири» stop, a stop named «школа Керемет»). Everything
// else is pending — the school must supply it (see the pending blocks / file:null documents below).
const X = (kz, ru, en) => ({ kz, ru, en });

export default {
  slug: 'facilities',
  group: 'campus',
  order: 10,
  title: { kz: 'Ғимарат және кабинеттер', ru: 'Здание и кабинеты', en: 'Building & classrooms' },
  description: {
    kz: '«Керемет» мектебінің ғимараты: 2 қабат, пандус, қолжетімді кіреберіс, автотұрақ, кабинеттердің жарақталуы және қолжетімді орта.',
    ru: 'Здание школы «Керемет»: 2 этажа, пандус, доступный вход, парковка, оснащение кабинетов по нормам и доступная среда.',
    en: 'The Keremet school building: 2 storeys, ramp, accessible entrance, parking, classroom equipment standards and accessibility.',
  },
  styles: ['campus'],
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, { ui, S, L, t, href, docById }) {
    const B = S.building;
    const A = S.addresses.actual;
    const src2gis = ui.extLink(S.contacts.twoGis.url, '2GIS');
    const ok = ui.badge(X('Расталған', 'Подтверждено', 'Confirmed'), 'ok');
    const wait = ui.badge(t('unconfirmed'), 'warn');
    const docWait = ui.badge(t('doc.pending'), 'warn');

    // status checklist (local component, styled in campus.css)
    const check = (items) => `<ul class="cmp-check" role="list">${items.map((it) => `<li class="cmp-check__item cmp-check__item--${it.ok ? 'ok' : 'wait'}">
<span class="cmp-check__icon" aria-hidden="true">${ui.icon(it.icon, { size: 22 })}</span>
<div class="cmp-check__body"><p class="cmp-check__title">${L(it.title)}</p>${it.text ? `<p class="cmp-check__text">${L(it.text)}</p>` : ''}</div>
<span class="cmp-check__status">${it.badge || (it.ok ? ok : wait)}</span></li>`).join('')}</ul>`;

    // ------------------------------------------------------------------ decorative building scheme
    const lbl = {
      floors: L(X('2 қабат', '2 этажа', '2 storeys')),
      ramp: L(X('Пандус', 'Пандус', 'Ramp')),
      park: L(X('7 орын', '7 мест', '7 spaces')),
      stop: L(X('250 м', '250 м', '250 m')),
    };
    const win = [];
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 5; c++) {
        if (r === 1 && c === 2) continue; // entrance
        win.push(`<rect class="cmp-bld__win" x="${170 + c * 48}" y="${r === 0 ? 108 : 184}" width="30" height="${r === 0 ? 40 : 40}" rx="3"/>`);
      }
    }
    const slots = Array.from({ length: 8 }, (_, i) => `<path class="cmp-bld__slot" d="M${448 + i * 14} 262 l-6 26"/>`).join('');
    const building = `<figure class="cmp-bld" aria-hidden="true"><svg viewBox="0 0 560 310" focusable="false">
<defs><linearGradient id="cmpSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="currentColor" stop-opacity=".0"/><stop offset="1" stop-color="currentColor" stop-opacity=".10"/></linearGradient></defs>
<rect x="0" y="0" width="560" height="262" fill="url(#cmpSky)"/>
<circle class="cmp-bld__sun" cx="486" cy="58" r="22"/>
<path class="cmp-bld__ground" d="M0 262 H560"/>
<path class="cmp-bld__path" d="M60 280 C120 280 160 274 186 264"/>
<polygon class="cmp-bld__roof" points="138,94 422,94 402,66 158,66"/>
<rect class="cmp-bld__wall" x="150" y="94" width="260" height="168"/>
<rect class="cmp-bld__stripe" x="150" y="166" width="260" height="7"/>
<rect class="cmp-bld__stripe" x="150" y="94" width="260" height="5"/>
${win.join('')}
<rect class="cmp-bld__door" x="263" y="200" width="34" height="62" rx="3"/>
<path class="cmp-bld__ramp" d="M188 262 L262 246 L262 262 Z"/>
<path class="cmp-bld__rail" d="M188 250 L262 234"/>
<g class="cmp-bld__access" transform="translate(128 238)"><circle r="13"/><path d="M-2 -6 a2 2 0 1 0 .01 0 M-2 -2 v6 h6 l3 6 M-6 0 a6 6 0 1 0 8 7"/></g>
<g class="cmp-bld__stop"><path d="M56 262 V196"/><rect x="40" y="176" width="32" height="24" rx="5"/><text x="56" y="193" text-anchor="middle">A</text></g>
<text class="cmp-bld__tag" x="96" y="300" text-anchor="middle">${lbl.stop}</text>
<g class="cmp-bld__park"><rect x="440" y="206" width="30" height="30" rx="6"/><text x="455" y="228" text-anchor="middle">P</text><path d="M455 236 V262"/>${slots}</g>
<text class="cmp-bld__tag" x="490" y="304" text-anchor="middle">${lbl.park}</text>
<text class="cmp-bld__tag" x="280" y="56" text-anchor="middle">${lbl.floors}</text>
<text class="cmp-bld__tag" x="226" y="286" text-anchor="middle">${lbl.ramp}</text>
</svg></figure>`;

    // ------------------------------------------------------------------ intro
    const intro = ui.split({
      ratio: '1:1', align: 'center',
      left: `${ui.eyebrow(X('Мектеп ортасы', 'Школьная среда', 'Campus'))}
<h2 class="sec__title">${L(X('Екі қабатты ғимарат — бәріне қолжетімді кіреберіспен', 'Двухэтажное здание с доступным для всех входом', 'A two-storey building with an entrance open to everyone'))}</h2>
${ui.lead(X(
        'Мектеп Шымкент қаласы Абай ауданының Асар шағын ауданындағы екі қабатты ғимаратта орналасқан. Кіреберісте пандус бар, кіреберіс қолжетімді, ғимарат жанында шағын автотұрақ бар.',
        'Школа располагается в двухэтажном здании в микрорайоне Асар Абайского района Шымкента. У входа есть пандус, вход доступный, рядом со зданием — небольшая парковка.',
        'The school occupies a two-storey building in the Asar microdistrict of Shymkent’s Abay district. The entrance has a ramp and is listed as accessible, and there is a small car park next to the building.',
      ))}
${ui.chips([
        { icon: 'building', label: X('2 қабат', '2 этажа', '2 storeys') },
        { icon: 'accessible', label: X('Пандус және қолжетімді кіреберіс', 'Пандус и доступный вход', 'Ramp & accessible entrance') },
        { icon: 'parking', label: X('Автотұрақ — 7 орын', 'Парковка — 7 мест', 'Parking — 7 spaces') },
        { icon: 'bus', label: X('Аялдамадан 250 м', '250 м от остановки', '250 m from the bus stop') },
      ])}
${ui.note(X(`Дереккөз: мектептің ${src2gis} картасындағы сипаттамасы (24.09.2026 тексерілді).`, `Источник: карточка школы в ${src2gis} (проверено 24.09.2026).`, `Source: the school’s ${src2gis} listing (checked 24.09.2026).`))}`,
      right: ui.panel({ theme: 'biology', cls: 'cmp-bld-panel', body: building }),
    });

    const stats = ui.stats([
      { icon: 'building', art: true, value: String(B.floors), label: X('Қабатты ғимарат', 'Этажа в здании', 'Storeys'), note: X('Асар шағын ауданы, Абай ауданы', 'мкр. Асар, Абайский район', 'Asar microdistrict, Abay district'),
        extra: ui.chips([{ label: X('Жобалық қуаты — нақтылануда', 'Проектная мощность — уточняется', 'Design capacity — to be confirmed') }]) },
      { icon: 'parking', value: String(B.parking), label: X('Автотұрақ орны', 'Мест на парковке', 'Parking spaces'), note: X('ғимарат жанында', 'рядом со зданием', 'next to the building') },
      { icon: 'bus', value: X('250 м', '250 м', '250 m'), label: X('Аялдамаға дейін', 'До остановки', 'To the bus stop'), note: X('жаяу шамамен 3 минут', 'около 3 минут пешком', 'about a 3-minute walk') },
      { icon: 'accessible', value: X('Иә', 'Есть', 'Yes'), label: X('Пандус', 'Пандус', 'Ramp'), note: X('қолжетімді кіреберіс', 'доступный вход', 'accessible entrance') },
      { icon: 'pin', value: '2', label: X('Жақын аялдама', 'Остановки рядом', 'Nearby stops'), note: X('«Қ. Жалайыри даңғылы», «школа Керемет»', '«проспект К. Жалаири», «школа Керемет»', '“K. Zhalairi Ave”, “Keremet school”') },
    ], { cls: 'stats--bento' });

    const toc = ui.toc([
      { id: 'building', label: X('Ғимарат туралы мәліметтер', 'Сведения о здании', 'About the building') },
      { id: 'rooms', label: X('Кабинеттер мен жарақтандыру', 'Кабинеты и оснащение', 'Rooms and equipment') },
      { id: 'photos', label: X('Фотосуреттер', 'Фотографии', 'Photos') },
      { id: 'access', label: X('Қолжетімді орта', 'Доступная среда', 'Accessible environment') },
      { id: 'route', label: X('Қалай жетуге болады', 'Как добраться', 'Getting here') },
      { id: 'docs', label: X('Құжаттар', 'Документы', 'Documents') },
    ]);

    // ------------------------------------------------------------------ building facts
    const buildingFacts = ui.facts([
      { k: X('Нақты мекенжайы', 'Фактический адрес', 'Actual address'), v: `${A.postcode}, ${L(A.text)}`, copy: true },
      { k: X('Қабат саны', 'Этажность', 'Storeys'), v: `${B.floors} ${ok}` },
      { k: X('Кіреберіс', 'Вход', 'Entrance'), v: `${L(X('Пандус, қолжетімді кіреберіс', 'Пандус, доступный вход', 'Ramp, accessible entrance'))} ${ok}` },
      { k: X('Автотұрақ', 'Парковка', 'Parking'), v: `${L(X('7 орын', '7 мест', '7 spaces'))} ${ok}` },
      { k: X('Ғимаратты пайдалану негізі', 'Основание пользования зданием', 'Basis for using the building'), v: `${L(X('Меншік немесе кемінде 10 жылға жалдау', 'Собственность или аренда не менее чем на 10 лет', 'Ownership, or a lease of at least 10 years'))} ${docWait}` },
      { k: X('Жобалық қуаты (оқушы орны)', 'Проектная мощность (ученических мест)', 'Design capacity (pupil places)'), v: `— ${wait}` },
      { k: X('Салынған / пайдалануға берілген жылы', 'Год постройки / ввода в эксплуатацию', 'Year built / commissioned'), v: `— ${wait}` },
      { k: X('Жалпы және оқу алаңы, м²', 'Общая и учебная площадь, м²', 'Total and teaching area, m²'), v: `— ${wait}` },
    ]);
    const addrNote = ui.callout({
      type: 'info',
      title: X('Мекенжайлар туралы', 'Об адресах', 'About the addresses'),
      text: X(
        `Серіктестіктің заңды мекенжайы — ${L(S.addresses.legal.text)}. Мектеп ${L(A.text)} мекенжайында жұмыс істейді. 2022 жылғы лицензияда білім беру объектісінің мекенжайы ретінде ${L(S.addresses.licence2022.text)} көрсетілген. Лицензия мен меншік немесе жалдау құжаты қай ғимаратқа қатысты екенін және бұл мекенжайлардың өзара байланысын мектеп әкімшілігі нақтылайды.`,
        `Юридический адрес товарищества — ${L(S.addresses.legal.text)}. Школа работает по адресу: ${L(A.text)}. В лицензии 2022 года адресом объекта указано: ${L(S.addresses.licence2022.text)}. Какое здание охватывают лицензия и документ о собственности или аренде и как связаны эти адреса, уточняет администрация школы.`,
        `The partnership’s legal address is ${L(S.addresses.legal.text)}; the school operates at ${L(A.text)}. The 2022 licence names the premises at ${L(S.addresses.licence2022.text)}. The school will confirm which building the licence and the ownership or lease document cover, and how these addresses relate.`,
      ),
    });

    // ------------------------------------------------------------------ rooms per order №70
    const W = t('unconfirmed');
    const pendingCell = `<span class="cmp-cell-wait">${ui.icon('hourglass', { size: 16 })}${W}</span>`;
    const rooms = [
      [X('Бастауыш сынып кабинеттері', 'Кабинеты начальных классов', 'Primary classrooms'), X('Интерактивті панель, биіктігі реттелетін парталар мен орындықтар, оқу-көрнекі құралдарға арналған шкафтар', 'Интерактивная панель, регулируемые по высоте парты и стулья, шкафы для учебно-наглядных пособий', 'Interactive panel, height-adjustable desks and chairs, cabinets for teaching aids')],
      [X('Мектепалды даярлық сыныбы', 'Класс предшкольной подготовки', 'Pre-school class'), X('Ойын және оқу аймақтарына арналған жиһаз, дамытушы құралдар', 'Мебель для игровой и учебной зон, развивающие пособия', 'Furniture for play and learning zones, developmental materials')],
      [X('Информатика (IT-сынып) және робототехника', 'Информатика (IT-класс) и робототехника', 'Computer science (IT class) and robotics'), X('Оқушы және мұғалім компьютерлері, желі, робототехника жинақтары', 'Компьютеры ученика и учителя, сеть, наборы по робототехнике', 'Pupil and teacher computers, network, robotics kits')],
      [X('Математика, тілдер, зияткерлік ойындар', 'Математика, языки, интеллектуальные игры', 'Maths, languages, intellectual games'), X('Пәндік көрнекі құралдар, лингафондық және цифрлық ресурстар', 'Предметные наглядные пособия, лингафонные и цифровые ресурсы', 'Subject teaching aids, language-lab and digital resources')],
      [X('Жаратылыстану / STEM-зертхана', 'Естествознание / STEM-лаборатория', 'Natural science / STEM lab'), X('Зертханалық жабдық, микроскоптар, қауіпсіздік құралдары', 'Лабораторное оборудование, микроскопы, средства безопасности', 'Lab equipment, microscopes, safety equipment')],
      [X('Спорт залы', 'Спортивный зал', 'Gym'), X('Гимнастикалық және ойын жабдығы, төсеніштер, мүкәммал', 'Гимнастическое и игровое оборудование, маты, инвентарь', 'Gymnastics and games equipment, mats, sports kit')],
      [X('Кітапхана', 'Библиотека', 'Library'), X('Кітап қоры, оқу залы, электрондық кітапхана', 'Книжный фонд, читальный зал, электронная библиотека', 'Book stock, reading room, e-library')],
      [X('Акт залы / музыка залы', 'Актовый / музыкальный зал', 'Assembly / music hall'), X('Дыбыс күшейту жабдығы, музыкалық аспаптар', 'Звукоусиливающая аппаратура, музыкальные инструменты', 'Sound system, musical instruments')],
      [X('Психолог және арнайы педагог кабинеттері', 'Кабинеты психолога и специальных педагогов', 'Psychologist and special-needs rooms'), X('Кеңес беру және түзету-дамыту жұмысына арналған жабдық', 'Оборудование для консультаций и коррекционно-развивающей работы', 'Equipment for counselling and remedial work')],
    ];
    const roomsTable = ui.table({
      caption: X('№ 70 нормалары бойынша жарақтандыру: мектептегі жағдай', 'Оснащение по нормам приказа № 70: состояние в школе', 'Equipment under order No. 70: status at the school'),
      head: [X('Үй-жай', 'Помещение', 'Space'), X('Норма бойынша (мысалдар)', 'По норме (примеры)', 'Standard (examples)'), X('«Керемет» мектебінде', 'В школе «Керемет»', 'At Keremet')],
      rows: rooms.map(([a, b]) => [a, b, pendingCell]),
    });
    const roomsLead = ui.prose(X(
      `<p>Жалпы білім беретін мектептердің кабинеттері мен зертханалары ҚР Білім және ғылым министрінің 2016 жылғы 22 қаңтардағы № 70 бұйрығымен бекітілген <em>жабдықтармен және жиһазбен жарақтандыру нормаларына</em> сәйкес жабдықталады. Төмендегі кестеде нормада қарастырылған негізгі үй-жайлар көрсетілген; мектептегі нақты жарақтандыру туралы мәліметтер (кабинеттер саны, негізгі жабдықтар) мектеп әкімшілігі растағаннан кейін жарияланады.</p>`,
      `<p>Кабинеты и лаборатории общеобразовательных школ оснащаются по <em>нормам оснащения оборудованием и мебелью</em>, утверждённым приказом Министра образования и науки РК от 22 января 2016 года № 70. В таблице — основные помещения, которые предусматривает норма; фактическое оснащение школы (число кабинетов, основное оборудование) будет опубликовано после подтверждения администрацией.</p>`,
      `<p>Classrooms and labs in general schools are equipped under the <em>equipment and furniture standards</em> approved by order No. 70 of the Minister of Education and Science of 22 January 2016. The table lists the main spaces the standard covers; the school’s actual equipment (number of rooms, key equipment) will be published once confirmed by the administration.</p>`,
    ));
    const roomsCaveat = ui.callout({
      type: 'warn',
      title: X('Кестеде норма көрсетілген', 'В таблице — норма', 'The table shows the standard'),
      text: X(
        'Бұл үй-жайлардың мектепте бар-жоғы нақтыланады. Мектепте жоқ үй-жайлар кестеден алынып тасталады, бар үй-жайлар бойынша нақты жабдықтар көрсетіледі.',
        'Наличие этих помещений в школе уточняется. Помещения, которых в школе нет, будут убраны из таблицы, по имеющимся — указано фактическое оснащение.',
        'Whether the school has each of these spaces is being confirmed. Spaces the school does not have will be removed from the table; for the rest, the actual equipment will be listed.',
      ),
    });
    const roomLinks = ui.cards([
      { icon: 'book', title: X('Кітапхана және цифрлық ресурстар', 'Библиотека и цифровые ресурсы', 'Library & digital resources'), text: X('Кітап қоры, оқулықтар, электрондық журнал', 'Фонд, учебники, электронный журнал', 'Book stock, textbooks, e-journal'), href: href('library') },
      { icon: 'utensils', title: X('Асхана және тамақтану', 'Столовая и питание', 'Canteen & meals'), text: X('Мәзір, сапа комиссиясы, жеткізуші', 'Меню, комиссия по качеству, поставщик', 'Menu, quality commission, supplier'), href: href('meals') },
      { icon: 'medical', title: X('Медициналық кабинет', 'Медицинский кабинет', 'Medical room'), text: X('Медбике, екпелер, бала ауырса', 'Медсестра, прививки, если ребёнок заболел', 'Nurse, vaccinations, if a child is ill'), href: href('health') },
      { icon: 'heart', title: X('Психологиялық қызмет', 'Психологическая служба', 'Psychological service'), text: X('Кеңес беру, 111 және 150 сенім телефондары', 'Консультации, телефоны доверия 111 и 150', 'Counselling, helplines 111 and 150'), href: href('psychology') },
    ], { cols: 4 });

    // ------------------------------------------------------------------ photos (placeholders)
    const shots = [
      X('Мектеп қасбеті', 'Фасад школы', 'School façade'), X('Кіреберіс пен пандус', 'Вход и пандус', 'Entrance and ramp'),
      X('Сынып бөлмесі', 'Учебный класс', 'Classroom'), X('Ғимарат іші', 'Интерьер здания', 'Building interior'),
      X('Дәліз және демалыс аймағы', 'Рекреация', 'Hallway and breakout area'), X('Мектеп ауласы', 'Школьный двор', 'School grounds'),
    ];
    const photos = `<ul class="cmp-photos" role="list">${shots.map((s) => `<li class="cmp-photo"><span class="cmp-photo__icon" aria-hidden="true">${ui.icon('image', { size: 26 })}</span><span class="cmp-photo__txt"><span class="cmp-photo__title">${L(s)}</span><span class="cmp-photo__status">${L(X('Фото жүктеледі', 'Фото будет загружено', 'Photo coming soon'))}</span></span></li>`).join('')}</ul>`;
    const photosNote = ui.note(X(
      'Сайтта мектептің тек өз фотосуреттері жарияланады. Оқушылар бейнеленген суреттер ата-аналардың жазбаша келісімімен ғана орналастырылады.',
      'На сайте публикуются только собственные фотографии школы. Снимки с учениками размещаются только с письменного согласия родителей.',
      'Only the school’s own photos are published. Pictures showing pupils are posted only with parents’ written consent.',
    ));

    // ------------------------------------------------------------------ accessible environment (ORDER-114 п.64)
    const access = check([
      { ok: true, icon: 'accessible', title: X('Кіреберістегі пандус', 'Пандус у входа', 'Ramp at the entrance'), text: X('2GIS деректері бойынша.', 'По данным 2GIS.', 'According to 2GIS.') },
      { ok: true, icon: 'home', title: X('Қолжетімді кіреберіс', 'Доступный вход', 'Accessible entrance'), text: X('2GIS деректері бойынша кіреберіс қолжетімді.', 'По данным 2GIS вход доступный.', 'Accessible entrance according to 2GIS.') },
      { ok: false, icon: 'parking', title: X('Мүгедектігі бар адамдарға арналған тұрақ орны', 'Парковочное место для людей с инвалидностью', 'Accessible parking space'), text: X('7 орынның ішінде белгіленген орынның бар-жоғы нақтылануда.', 'Наличие выделенного места среди 7 уточняется.', 'Whether one of the 7 spaces is designated is being confirmed.') },
      { ok: false, icon: 'grid', title: X('Контрастты және тактильді таңбалау', 'Контрастная и тактильная маркировка', 'Contrast and tactile marking'), text: X('Есіктер, баспалдақтар, жол бағыттары.', 'Двери, ступени, направляющие дорожки.', 'Doors, steps, guidance paths.') },
      { ok: false, icon: 'accessible', title: X('Бейімделген санитариялық бөлме', 'Адаптированный санузел', 'Accessible toilet'), text: X('Ерекше білім беру қажеттіліктері бар балаларға арналған.', 'Для детей с особыми образовательными потребностями.', 'For children with special educational needs.') },
      { ok: false, icon: 'arrow-up', title: X('Екінші қабатқа жету', 'Доступ на второй этаж', 'Access to the upper (second) floor'), text: X('Көтергіш немесе оқу үй-жайларын бірінші қабатта ұйымдастыру.', 'Подъёмник или организация занятий на первом этаже.', 'A lift, or holding lessons on the ground (first) floor.') },
      { ok: false, icon: 'users', title: X('Арнайы педагогтердің сүйемелдеуі', 'Сопровождение специальных педагогов', 'Support from special-needs staff'), text: X('Психолог, логопед, арнайы педагог — ПМПК ұсынымдары бойынша.', 'Психолог, логопед, специальный педагог — по рекомендациям ПМПК.', 'Psychologist, speech therapist, special-needs teacher — per PMPC recommendations.') },
      { ok: true, icon: 'eye', title: X('Сайттың көру қабілеті нашар адамдарға арналған нұсқасы', 'Версия сайта для слабовидящих', 'Low-vision version of the website'), text: `<a href="${href('accessibility')}">${L(X('Қалай пайдалану керек', 'Как пользоваться', 'How to use it'))}</a>`, badge: ok },
    ]);
    const accessAside = ui.callout({
      type: 'ok',
      title: X('Балаңызға ерекше жағдай қажет пе?', 'Ребёнку нужны особые условия?', 'Does your child need special arrangements?'),
      text: X(
        `Қабылдау кезінде немесе кез келген уақытта мектеп әкімшілігіне хабарлаңыз — баланың қажеттіліктері ескеріледі. Толығырақ: <a href="${href('inclusive')}">инклюзивті білім беру</a>.`,
        `Сообщите администрации школы при поступлении или в любой момент — потребности ребёнка будут учтены. Подробнее: <a href="${href('inclusive')}">инклюзивное образование</a>.`,
        `Tell the school administration at admission or at any time and your child’s needs will be taken into account. More: <a href="${href('inclusive')}">inclusive education</a>.`,
      ),
    });

    // ------------------------------------------------------------------ route
    const routeItems = [
      { title: X('«Қ. Жалайыри даңғылы» аялдамасы', 'Остановка «проспект К. Жалаири»', '“K. Zhalairi Avenue” stop'), text: X('Мектепке дейін 250 м — жаяу шамамен 3 минут.', 'До школы 250 м — около 3 минут пешком.', '250 m to the school — about a 3-minute walk.') },
      { title: X('«школа Керемет» аялдамасы', 'Остановка «школа Керемет»', 'The “Keremet school” stop'), text: X('2GIS картасында мектеп жанындағы аялдама осылай аталады. Маршруттарды 2GIS-тен тексеріңіз.', 'Так называется остановка рядом со школой в 2GIS. Маршруты уточняйте в 2GIS.', 'That is the name of the stop next to the school in 2GIS; check routes there.') },
      { title: X('Автокөлікпен', 'На автомобиле', 'By car'), text: X('Ғимарат жанында 7 орындық тұрақ бар. Балаларды тек тұрақта немесе тоқтауға рұқсат етілген жерде түсіріңіз.', 'У здания — парковка на 7 мест. Высаживайте детей только на парковке или там, где остановка разрешена.', 'There are 7 parking spaces by the building. Drop children off only in the car park or where stopping is allowed.') },
    ];
    const route = ui.split({
      ratio: '1:1',
      left: `<div class="cmp-duo__col"><div class="cmp-duo__head"><span class="cmp-duo__ico" aria-hidden="true">${ui.icon('bus', { size: 26 })}</span><p class="cmp-duo__t">${L(X('Қоғамдық көлікпен және автокөлікпен', 'На общественном транспорте и автомобиле', 'By public transport and car'))}</p></div>
<ol class="cmp-ol">${routeItems.map((r) => `<li><strong>${L(r.title)}</strong><span>${L(r.text)}</span></li>`).join('')}</ol>
<p class="small muted">${ui.icon('pin', { size: 16 })} ${A.postcode}, ${L(A.text)}</p>
<div class="cluster">${ui.button({ href: href('contacts'), label: X('Барлық байланыс деректері', 'Все контакты', 'All contact details'), kind: 'ghost', icon: 'arrow-right' })}${ui.button({ href: S.contacts.twoGis.url, label: X('2GIS-те маршрут', 'Маршрут в 2GIS', 'Route in 2GIS'), kind: 'link' })}</div></div>`,
      right: ui.mapEmbed(A.lat, A.lng, { zoom: 16, height: 420 }),
    });

    // ------------------------------------------------------------------ documents
    const docs = ui.docList([
      ...['building-basis', 'sez', 'fire-safety'].map(docById).filter(Boolean),
      docById('design-capacity'),
      docById('classroom-equipment'),
    ]);

    const sources = ui.linkList([
      { href: `https://adilet.zan.kz/${lang === 'kz' ? 'kaz' : 'rus'}/docs/V1600013272`, icon: 'scale', label: X('Жабдықтармен және жиһазбен жарақтандыру нормалары (№ 70 бұйрық)', 'Нормы оснащения оборудованием и мебелью (приказ № 70)', 'Equipment and furniture standards (order No. 70)'), note: 'adilet.zan.kz' },
      { href: `https://adilet.zan.kz/${lang === 'kz' ? 'kaz' : 'rus'}/docs/V2100023890`, icon: 'scale', label: X('«Білім беру объектілеріне қойылатын санитариялық-эпидемиологиялық талаптар» (ҚР ДСМ-76)', 'Санитарные правила «Санитарно-эпидемиологические требования к объектам образования» (ҚР ДСМ-76)', 'Sanitary rules for education facilities (No. ҚР ДСМ-76)'), note: 'adilet.zan.kz' },
    ]);

    const related = ui.linkList([
      { href: href('safety'), icon: 'shield', label: X('Қауіпсіздік', 'Безопасность', 'Safety & security'), note: X('Күзет, өрт қауіпсіздігі, жол қауіпсіздігі', 'Охрана, пожарная и дорожная безопасность', 'Security, fire and road safety') },
      { href: href('meals'), icon: 'utensils', label: X('Мектептегі тамақтану', 'Школьное питание', 'School meals') },
      { href: href('health'), icon: 'medical', label: X('Медициналық қызмет', 'Медицинское обслуживание', 'Health care') },
      { href: href('library'), icon: 'book', label: X('Кітапхана', 'Библиотека', 'Library') },
      { href: href('self-6'), icon: 'target', label: X('Өзін-өзі бағалау: материалдық-техникалық база', 'Самооценка: материально-техническая база', 'Self-assessment: facilities and equipment') },
    ]);

    return [
      intro,
      stats,
      ui.split({ ratio: '1:2', left: toc, right: ui.section({ id: 'building', eyebrow: X('Паспорт', 'Паспорт', 'Passport'), title: X('Ғимарат туралы мәліметтер', 'Сведения о здании', 'About the building'), body: buildingFacts + addrNote }) }),
      ui.section({ id: 'rooms', tone: 'biology', eyebrow: X('Материалдық-техникалық база', 'Материально-техническая база', 'Facilities'), title: X('Кабинеттер, зертханалар және залдар', 'Кабинеты, лаборатории и залы', 'Classrooms, labs and halls'), lead: X('Қандай үй-жайлар болуы керек және олардың жабдықталуы туралы мәліметтер қай жерде жарияланады.', 'Какие помещения предусмотрены и где будут опубликованы сведения об их оснащении.', 'Which spaces are provided for and where their equipment details will be published.'), body: roomsLead + roomsCaveat + roomsTable + roomLinks }),
      ui.section({ id: 'photos', eyebrow: X('Галерея', 'Галерея', 'Gallery'), title: X('Мектеп фотосуреттерде', 'Школа в фотографиях', 'The school in photos'), body: photos + photosNote }),
      ui.section({ id: 'access', eyebrow: X('Кедергісіз орта', 'Безбарьерная среда', 'Barrier-free'), title: X('Қолжетімді орта', 'Доступная среда', 'Accessible environment'), lead: X('Мүгедектігі бар балалар мен ерекше білім беру қажеттіліктері бар оқушыларға арналған жағдайлар.', 'Условия для детей с инвалидностью и учеников с особыми образовательными потребностями.', 'Arrangements for children with disabilities and pupils with special educational needs.'), body: access + accessAside }),
      ui.section({ id: 'route', eyebrow: X('Бізге келіңіз', 'Приходите к нам', 'Visit us'), title: X('Мектепке қалай жетуге болады', 'Как добраться до школы', 'How to get to the school'), body: route }),
      ui.section({ id: 'docs', eyebrow: X('Растайтын құжаттар', 'Подтверждающие документы', 'Supporting documents'), title: X('Құжаттар', 'Документы', 'Documents'), body: docs + `<h3 class="cmp-h3">${L(X('Нормативтік негіз', 'Нормативная база', 'Legal basis'))}</h3>` + sources }),
      ui.section({ title: X('Осы бөлімде', 'В этом разделе', 'In this section'), body: related }),
    ].join('\n');
  },
};
