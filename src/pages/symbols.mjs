// State symbols — flag, emblem (assets/img/symbols, public domain), full official text of the State Anthem
// «Менің Қазақстаным» (Appendix 3 to Constitutional Law No. 258-III of 04.06.2007, cross-checked with akorda.kz on
// 24.09.2026), and the rules of respect/use from that Constitutional Law (arts 1, 4, 5, 6, 8, 9, 13, 15).
// No official Russian translation of the anthem is published on akorda.kz → RU page gives explanations only;
// EN page shows the English translation published on akorda.kz (clearly labelled as reference).
const ADILET = (code, lang) => `https://adilet.zan.kz/${lang === 'kz' ? 'kaz' : 'rus'}/docs/${code}`;
const AKORDA = (page, lang) => `https://www.akorda.kz/${lang}/state_symbols/${page}`;

// Official text — Appendix 3 to the Constitutional Law «О государственных символах Республики Казахстан».
const VERSES = [
  ['Алтын күн аспаны,', 'Алтын дән даласы,', 'Ерліктің дастаны,', 'Еліме қарашы!', 'Ежелден ер деген,', 'Даңқымыз шықты ғой.', 'Намысын бермеген,', 'Қазағым мықты ғой.'],
  ['Ұрпаққа жол ашқан,', 'Кең байтақ жерім бар.', 'Бірлігі жарасқан,', 'Тәуелсіз елім бар.', 'Қарсы алған уақытты,', 'Мәңгілік досындай.', 'Біздің ел бақытты,', 'Біздің ел осындай!'],
];
const CHORUS = ['Менің елім, менің елім,', 'Гүлің болып егілемін,', 'Жырың болып төгілемін, елім!', 'Туған жерім менің – Қазақстаным!'];
// English translation as published on akorda.kz/en/state_symbols/kazakhstan_anthem (reference only).
const EN = [
  ['Sky of golden sun,', 'Steppe of golden seed,', 'Legend of courage -', 'Take a look at my country!', 'From the antiquity', 'Our heroic glory emerged,', 'They did not give up their pride', 'My Kazakh people are strong!'],
  ['The way was opened to the posterity', 'I have a vast land.', 'Its unity is proper,', 'I have an independent country.', 'It welcomed the time', 'Like an eternal friend,', 'Our country is happy,', 'Such is our country.'],
];
const EN_CHORUS = ['My country, my country,', 'As your flower I will be planted,', 'As your song I will stream, my country!', 'My native land – My Kazakhstan!'];

export default {
  slug: 'symbols',
  group: 'about',
  order: 70,
  title: { kz: 'Мемлекеттік рәміздер', ru: 'Государственные символы', en: 'State symbols' },
  description: {
    kz: 'Қазақстан Республикасының мемлекеттік рәміздері: Мемлекеттік Ту, Елтаңба, «Менің Қазақстаным» Гимнінің ресми мәтіні және рәміздерді құрметтеу ережелері.',
    ru: 'Государственные символы Республики Казахстан: Флаг, Герб, официальный текст Гимна «Менің Қазақстаным» и правила уважительного отношения к символам.',
    en: 'State symbols of Kazakhstan: the Flag, the Emblem, the official text of the anthem “Menin Qazaqstanym” and the rules for honouring them.',
  },
  lead: {
    kz: 'Мемлекеттік Ту, Мемлекеттік Елтаңба және Мемлекеттік Гимн — Қазақстан Республикасының мемлекеттік рәміздері.',
    ru: 'Государственный Флаг, Государственный Герб и Государственный Гимн — государственные символы Республики Казахстан.',
    en: 'The State Flag, the State Emblem and the State Anthem are the state symbols of the Republic of Kazakhstan.',
  },
  styles: ['about'],
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, { ui, L, href, asset }) {
    const X = (kz, ru, en) => ({ kz, ru, en });
    const pill = (kind, label, ic) => `<span class="ab-pill ab-pill--${kind}">${ic ? ui.icon(ic, { size: 14 }) : ''}${L(label)}</span>`;
    const LAW = ADILET('Z070000258_', lang);
    const akLang = lang === 'kz' ? 'kz' : lang === 'en' ? 'en' : 'ru';
    const art = (n) => L(X(`${n}-бап`, `ст. ${n}`, `Art. ${n}`));

    // ---------------------------------------------------------------- flag & emblem
    const symCard = ({ cls, img, alt, w, h, tag, name, desc, chips, links }) => `<article class="ab-sym__card">
<div class="ab-sym__art ab-sym__art--${cls}"><span class="ab-sym__tag">${tag}</span><img src="${asset(img)}" alt="${L(alt)}" width="${w}" height="${h}" loading="lazy"></div>
<div class="ab-sym__body"><h3 class="ab-sym__name">${L(name)}</h3><div class="ab-sym__facts">${chips.map((c) => pill('law', c)).join('')}</div>${ui.more({ label: X('Ресми сипаттамасы', 'Официальное описание', 'Official description'), icon: 'doc', tone: 'tint', body: `<p class="ab-sym__desc">${L(desc)}</p><p class="ab-rule__law">${L(X(`Конституциялық заң, ${art(1)}`, `Конституционный закон, ${art(1)}`, `Constitutional Law, ${art(1)}`))}</p>` })}<p class="ab-src">${links}</p></div></article>`;
    const flag = symCard({
      cls: 'flag', img: 'img/symbols/flag-kazakhstan.svg', w: 1000, h: 500,
      alt: X('Қазақстан Республикасының Мемлекеттік Туы: көгілдір матада алтын түсті күн, қыран және ұлттық өрнек', 'Государственный Флаг Республики Казахстан: на голубом полотнище золотые солнце, парящий орёл и национальный орнамент', 'State Flag of Kazakhstan: a golden sun, soaring eagle and national ornament on a sky-blue field'),
      tag: pill('ok', X('Ресми рәміз', 'Официальный символ', 'Official symbol'), 'check'),
      name: X('Мемлекеттік Ту', 'Государственный Флаг', 'State Flag'),
      desc: X(
        'Ортасында шұғылалы күн, оның астында қалықтап ұшқан қыран бейнеленген тік бұрышты көгілдір түсті мата. Тудың сабының тұсында ұлттық өрнек тік жолақ түрінде нақышталған. Күн, оның шұғыласы, қыран және ұлттық өрнек бейнесі алтын түстес. Тудың ені мен ұзындығының арақатынасы — 1:2.',
        'Прямоугольное полотнище голубого цвета с изображением в центре солнца с лучами, под которым — парящий орёл. У древка — национальный орнамент в виде вертикальной полосы. Изображение солнца, его лучей, орла и национального орнамента — цвета золота. Соотношение ширины флага к его длине — 1:2.',
        'A rectangular sky-blue cloth with a sun and its rays in the centre and a soaring steppe eagle beneath it. Along the staff runs a vertical band of national ornament. The sun, rays, eagle and ornament are golden. Width to length ratio: 1:2.'),
      chips: [X('Қабылданды: 1992', 'Принят: 1992', 'Adopted: 1992'), X('Авторы: Шәкен Ниязбеков', 'Автор: Шакен Ниязбеков', 'Designer: Shaken Niyazbekov'), X('Арақатынасы 1:2', 'Пропорции 1:2', 'Ratio 1:2')],
      links: `${L(X('Дереккөз', 'Источник', 'Source'))}: ${ui.extLink(AKORDA('kazakhstan_flag', akLang), 'akorda.kz')}`,
    });
    const emblem = symCard({
      cls: 'emblem', img: 'img/symbols/emblem-kazakhstan.svg', w: 400, h: 400,
      alt: X('Қазақстан Республикасының Мемлекеттік Елтаңбасы: көгілдір аядағы алтын шаңырақ, қанатты пырақтар, бес бұрышты жұлдыз және QAZAQSTAN жазуы', 'Государственный Герб Республики Казахстан: золотой шанырак на голубом фоне, крылатые кони, пятиконечная звезда и надпись QAZAQSTAN', 'State Emblem of Kazakhstan: a golden shanyrak on blue, winged horses, a five-pointed star and the word QAZAQSTAN'),
      tag: pill('ok', X('Ресми рәміз', 'Официальный символ', 'Official symbol'), 'check'),
      name: X('Мемлекеттік Елтаңба', 'Государственный Герб', 'State Emblem'),
      desc: X(
        'Дөңгелек нысанды, көгілдір түс аясындағы шаңырақ (киіз үйдің жоғарғы күмбез тәрізді бөлігі), шаңырақты айнала күн сәулесіндей тарап уықтар шаншылған. Шаңырақтың оң жағы мен сол жағында аңыздардағы қанатты пырақтар бейнесі орналасқан. Жоғарғы бөлігінде — бес бұрышты көлемді жұлдыз, төменгі бөлігінде — «QAZAQSTAN» деген жазу. Барлық бейнелер алтын түстес.',
        'Имеет форму круга: шанырак (верхняя сводчатая часть юрты) на голубом фоне, от которого во все стороны в виде солнечных лучей расходятся уыки. Справа и слева — мифические крылатые кони. В верхней части — объёмная пятиконечная звезда, в нижней — надпись «QAZAQSTAN». Все изображения — цвета золота.',
        'A circle showing a shanyrak (the domed crown of the yurt) on a blue background, with uyks radiating like sunrays. Mythical winged horses stand to the right and left. At the top is a five-pointed star, at the bottom the word “QAZAQSTAN”. All images are golden.'),
      chips: [X('Қабылданды: 1992', 'Принят: 1992', 'Adopted: 1992'), X('Авторлары: Ж. Мәлібеков, Ш. Уәлиханов', 'Авторы: Ж. Малибеков, Ш. Уалиханов', 'Designers: Zh. Malibekov, Sh. Ualikhanov')],
      links: `${L(X('Дереккөз', 'Источник', 'Source'))}: ${ui.extLink(AKORDA('kazakhstan_emblem', akLang), 'akorda.kz')}`,
    });
    const symbolsNote = (X(
      'Ту мен Елтаңбаның эталондары Қазақстан Республикасы Президентінің Резиденциясында сақталады (1-бап). Сайттағы бейнелер ақпараттық мақсатта берілген; ресми файлдарды akorda.kz сайтынан жүктеп алуға болады.',
      'Эталоны Флага и Герба хранятся в Резиденции Президента Республики Казахстан (ст. 1). Изображения на сайте приведены в информационных целях; официальные файлы можно скачать на akorda.kz.',
      'The reference standards of the Flag and Emblem are kept at the Residence of the President (Art. 1). The images here are for information; official files can be downloaded from akorda.kz.'));

    // ---------------------------------------------------------------- anthem
    const verse = (lines, n, chorus, chorusLabel, lng) => `<div class="ab-verse"><p class="ab-verse__n">${n}</p><p class="ab-verse__l"${lng ? ` lang="${lng}"` : ''}>${lines.join('<br>')}</p>
<div class="ab-verse__chorus"><p class="ab-verse__n"${lng ? ` lang="${lng}"` : ''}>${chorusLabel}</p><p class="ab-verse__l"${lng ? ` lang="${lng}"` : ''}>${chorus.join('<br>')}</p></div></div>`;
    const kkAttr = lang === 'kz' ? '' : 'kk';
    const anthemText = `<div class="ab-anthem__cols">${VERSES.map((v, i) => verse(v, L(X(`${i + 1}-шумақ`, `Куплет ${i + 1}`, `Verse ${i + 1}`)), CHORUS, 'Қайырмасы:', kkAttr)).join('')}</div>`;
    const translation = lang === 'en' ? `<details class="ab-transl"><summary>English translation published on akorda.kz (for reference; the anthem is sung only in Kazakh)</summary>
<div class="ab-transl__grid">${EN.map((v, i) => `<div><p><strong>${i + 1}</strong><br>${v.join('<br>')}</p><p><em>Chorus:</em><br>${EN_CHORUS.join('<br>')}</p></div>`).join('')}</div></details>` : '';
    const anthem = `<div class="ab-anthem pattern" data-theme="hero">${ui.shanyrakArt()}
<header class="ab-anthem__head"><p class="ab-anthem__k">${L(X('Қазақстан Республикасының Мемлекеттік Гимні', 'Государственный Гимн Республики Казахстан', 'State Anthem of the Republic of Kazakhstan'))}</p>
<h3 class="ab-anthem__title" lang="kk">«Менің Қазақстаным»</h3>
<p class="ab-anthem__authors">${L(X('Әні: Шәмші Қалдаяқов · Сөзі: Жұмекен Нәжімеденов, Нұрсұлтан Назарбаев', 'Музыка: Шамши Калдаяков · Слова: Жумекен Нажимеденов, Нурсултан Назарбаев', 'Music: Shamshi Kaldayakov · Lyrics: Zhumeken Nazhimedenov, Nursultan Nazarbayev'))}</p></header>
${anthemText}${translation}
<p class="ab-anthem__foot"><span>${L(X('Мәтін: «Қазақстан Республикасының мемлекеттік рәміздері туралы» Конституциялық заңның 3-қосымшасы', 'Текст: приложение 3 к Конституционному закону «О государственных символах Республики Казахстан»', 'Text: Appendix 3 to the Constitutional Law “On State Symbols of the Republic of Kazakhstan”'))}</span><span>${ui.extLink(LAW, 'adilet.zan.kz')} · ${ui.extLink(AKORDA('kazakhstan_anthem', akLang), X('akorda.kz — ноталары', 'akorda.kz — ноты', 'akorda.kz — sheet music'))}</span></p></div>`;
    const anthemAbout = ui.split({
      ratio: '1:1', align: 'start',
      left: ui.more({
        summary: X('Қазіргі Гимн 2006 жылы қабылданды.', 'Действующий Гимн принят в 2006 году.', 'The current anthem was adopted in 2006.'),
        body: X(
        '<p>Оның негізіне Шәмші Қалдаяқовтың 1956 жылы Жұмекен Нәжімеденовтің сөзіне жазған «Менің Қазақстаным» патриоттық әні алынды.</p><p>Гимн мемлекеттік тілде — бекітілген мәтіні мен музыкалық редакциясына дәлме-дәл сәйкес орындалады (9-бап, 3-т.).</p>',
        '<p>В его основу легла патриотическая песня «Менің Қазақстаным», написанная Шамши Калдаяковым в 1956 году на стихи Жумекена Нажимеденова.</p><p>Гимн исполняется на государственном (казахском) языке в точном соответствии с утверждённым текстом и музыкальной редакцией (ст. 9, п. 3). Во время исполнения присутствующие встают, граждане прикладывают правую руку к сердцу (ст. 9, п. 1). Официальный русский перевод текста на akorda.kz не публикуется, поэтому текст приводится на казахском языке.</p>',
        '<p>It is based on the patriotic song “Menin Qazaqstanym”, written by Shamshi Kaldayakov in 1956 to words by Zhumeken Nazhimedenov.</p><p>The anthem is performed in the state (Kazakh) language exactly as the approved text and music (Art. 9(3)). Everyone stands while it is played; citizens place their right hand on their heart (Art. 9(1)).</p>'),
      }),
      right: ui.callout({ type: 'info', icon: 'heart', title: X('Гимн орындалғанда', 'Во время исполнения Гимна', 'When the anthem is played'), text: X('Қатысушылар оны орнынан тұрып айтады (тыңдайды), Қазақстан азаматтары оң қолын жүрек тұсына қояды.', 'Присутствующие поют (выслушивают) его стоя, граждане Казахстана прикладывают правую руку к сердцу.', 'Everyone stands to sing or listen; citizens of Kazakhstan place their right hand on their heart.') }),
    });

    // ---------------------------------------------------------------- rules
    // Each rule is a card whose explanation and article open on click (native <details>: keyboard, Ctrl+F, print).
    const rule = (icon, t, d, a) => `<li><details class="ab-rule"><summary class="ab-rule__s"><span class="ab-rule__ico">${ui.icon(icon, { size: 22 })}</span><span class="ab-rule__t">${L(t)}</span><span class="ab-rule__chev" aria-hidden="true"></span></summary><div class="ab-rule__b"><p class="ab-rule__d">${L(d)}</p><p class="ab-rule__law">${L(a)}</p></div></details></li>`;
    const rules = `<ul class="ab-rules" role="list">
${rule('shield', X('Құрметтеу — әркімнің міндеті', 'Уважать символы обязан каждый', 'Everyone must respect them'), X('Қазақстан азаматтары және Республика аумағында жүрген адамдар мемлекеттік рәміздерді құрметтеуге міндетті.', 'Граждане Казахстана и лица, находящиеся на территории Республики, обязаны уважать государственные символы.', 'Citizens and everyone present in Kazakhstan must respect the state symbols.'), X('13-бап, 1-т.', 'ст. 13, п. 1', 'Art. 13(1)'))}
${rule('flag', X('Ту көтерілгенде', 'При подъёме Флага', 'When the flag is raised'), X('Туды салтанатты көтеру Гимнмен қатар жүреді, қатысушылар жүздерін Туға қарай бұрады.', 'Торжественный подъём Флага сопровождается Гимном, присутствующие поворачиваются лицом к Флагу.', 'A ceremonial flag-raising is accompanied by the anthem; everyone turns to face the flag.'), X('9-бап, 1-т.', 'ст. 9, п. 1', 'Art. 9(1)'))}
${rule('languages', X('Тек мемлекеттік тілде', 'Только на государственном языке', 'Only in the state language'), X('Гимн бекітілген мәтіні мен музыкасына дәлме-дәл орындалады; ықшамдап орындауға жол беріледі.', 'Гимн исполняется точно по утверждённому тексту и музыке; допускается сокращённое исполнение.', 'The anthem is performed exactly as approved; a shortened version is allowed.'), X('9-бап, 2–3-т.', 'ст. 9, пп. 2–3', 'Art. 9(2–3)'))}
${rule('graduation', X('Мектептегі салтанатты рәсімдер', 'Торжественные церемонии в школе', 'School ceremonies'), X('Жаңа оқу жылының ашылуы мен аяқталуы рәсімдерінде Ту көтеріледі және Гимн орындалады, сондай-ақ Гимн өзге де салтанатты іс-шараларда орындалады.', 'На церемониях открытия и окончания учебного года поднимается Флаг и исполняется Гимн; Гимн звучит и на других торжественных мероприятиях.', 'The flag is raised and the anthem played at the opening and closing of the school year and at other ceremonies.'), X('4-бап, 1-т. 11) тт.; 8-бап, 1-т. 8) тт.', 'ст. 4 п. 1 пп. 11; ст. 8 п. 1 пп. 8', 'Art. 4(1)(11); Art. 8(1)(8)'))}
${rule('school', X('Көрнекті орында — ұдайы', 'На видном месте — постоянно', 'Permanently on display'), X('Жалпы орта білім беретін ұйымдарда арнайы көрнекті орында Ту, Елтаңба (не олардың бейнелері) және Гимннің мемлекеттік тілдегі мәтіні орналастырылады.', 'В школах в специально отведённом видном месте постоянно размещаются Флаг, Герб (или их изображения) и текст Гимна на государственном языке.', 'Schools permanently display the Flag, the Emblem (or their images) and the anthem text in Kazakh in a prominent place.'), X('13-бап, 2-т.', 'ст. 13, п. 2', 'Art. 13(2)'))}
${rule('book', X('Рәміздерді оқыту', 'Изучение символов', 'Learning about the symbols'), X('Рәміздерді оқыту жалпы білім беретін бағдарламаларға енгізілген — азаматтық пен отансүйгіштікке тәрбиелеу үшін.', 'Изучение символов включено в общеобразовательные программы — для воспитания гражданственности и патриотизма.', 'Studying the symbols is part of the general curriculum, to foster citizenship and patriotism.'), X('13-бап, 2-т.', 'ст. 13, п. 2', 'Art. 13(2)'))}
${rule('lock', X('Елтаңба — жеке ұйымдардың бланкісінде емес', 'Герб — не на бланках частных организаций', 'No emblem on private letterheads'), X('Мемлекеттік емес ұйымдардың бланкілерінде, мөрлерінде және өзге деректемелерінде Елтаңба бейнесін пайдалануға тыйым салынады. Сондықтан мектеп логотипінде Елтаңба жоқ.', 'Запрещено использовать изображение Герба на бланках, печатях и других реквизитах негосударственных организаций. Поэтому в логотипе школы Герба нет.', 'Non-state organisations may not use the Emblem on letterheads, seals or other requisites — which is why the school logo does not include it.'), X('6-бап, 4-т.', 'ст. 6, п. 4', 'Art. 6(4)'))}
${rule('scale', X('Басқа тулармен бірге', 'Вместе с другими флагами', 'Alongside other flags'), X('Мемлекеттік Ту басқа тулардан кіші болмауы және олардан төмен орналаспауы тиіс.', 'Государственный Флаг не может быть меньше других флагов и размещаться ниже них.', 'The State Flag may not be smaller than, or placed lower than, other flags.'), X('5-бап, 1-т.', 'ст. 5, п. 1', 'Art. 5(1)'))}
</ul>`;

    // ---------------------------------------------------------------- at school & day of symbols
    const atSchool = ui.split({
      ratio: '1:1', align: 'start',
      left: ui.banner({ theme: 'hero', icon: 'flag', eyebrow: X('4 маусым', '4 июня', '4 June'), title: X('Мемлекеттік рәміздер күні', 'День государственных символов', 'Day of State Symbols'), text: X('1992 жылғы 4 маусымда тәуелсіз Қазақстанның Туы мен Елтаңбасы бекітілді. Мектептің салтанатты рәсімдері мен іс-шаралары туралы — іс-шаралар күнтізбесінде.', '4 июня 1992 года были утверждены Флаг и Герб независимого Казахстана. О торжественных церемониях и мероприятиях школы — в календаре событий.', 'On 4 June 1992 the Flag and Emblem of independent Kazakhstan were approved. For the school’s ceremonies and events, see the events calendar.'), href: href('events'), label: X('Іс-шаралар күнтізбесі', 'Календарь событий', 'Events calendar') }),
      right: `<div class="ab-symcorner"><span class="ab-symcorner__ico" aria-hidden="true">${ui.icon('flag', { size: 28 })}</span><h3 class="ab-symcorner__t">${L(X('Мектептегі рәміздер бұрышы', 'Уголок символов в школе', 'The school’s symbols corner'))}</h3><p class="ab-symcorner__x">${L(X('Ту, Елтаңба және Гимн мәтіні — көрнекті орында.', 'Флаг, Герб и текст Гимна — на видном месте.', 'Flag, emblem and anthem text on display.'))}</p>${ui.pendingGroup(lang, [{ title: X('Мектептегі рәміздер бұрышы', 'Уголок государственных символов в школе', 'The school’s state-symbols corner'), note: X('Мектептегі мемлекеттік рәміздер орналастырылған орынның фотосы (13-бап, 2-т.), салтанатты рәсімдердің фотолары және рәміздерге арналған мектеп іс-шараларының тізбесі (өткізілген күні, атауы) жүктеледі.', 'Будут загружены фото места в школе, где размещены государственные символы (ст. 13, п. 2), фото торжественных церемоний и перечень школьных мероприятий, посвящённых символам (дата, название).', 'Photos of the place in the school where the state symbols are displayed (Art. 13(2)), photos of ceremonies and a list of the school’s symbol-related events (date, title) will be uploaded.') }], { title: X('Фотолар дайындалуда', 'Фото готовятся', 'Photos in preparation') })}</div>`,
    });

    const sources = ui.legal([
      { href: LAW, title: X('«Қазақстан Республикасының мемлекеттік рәміздері туралы» 2007 жылғы 4 маусымдағы № 258-III Конституциялық заң', 'Конституционный закон РК от 4 июня 2007 года № 258-III «О государственных символах Республики Казахстан»', 'Constitutional Law No. 258-III of 4 June 2007 “On State Symbols” (Russian/Kazakh)') },
      { href: AKORDA('kazakhstan_flag', akLang), title: X('Ту — akorda.kz', 'Флаг — akorda.kz', 'Flag — akorda.kz') },
      { href: AKORDA('kazakhstan_emblem', akLang), title: X('Елтаңба — akorda.kz', 'Герб — akorda.kz', 'Emblem — akorda.kz') },
      { href: AKORDA('kazakhstan_anthem', akLang), title: X('Гимн — akorda.kz', 'Гимн — akorda.kz', 'Anthem — akorda.kz') },
    ], { title: X('Заң және ресми дереккөздер', 'Закон и официальные источники', 'Law and official sources'), note: symbolsNote, id: 'sources' });
    const related = ui.linkList([
      { href: href('about'), icon: 'school', label: X('Мектеп туралы', 'О школе', 'About the school') },
      { href: href('upbringing'), icon: 'heart', label: X('Тәрбие жұмысы', 'Воспитательная работа', 'Upbringing') },
      { href: href('events'), icon: 'calendar', label: X('Іс-шаралар күнтізбесі', 'Календарь событий', 'Events calendar') },
    ]);
    const toc = ui.toc([
      { id: 'flag-emblem', label: X('Ту және Елтаңба', 'Флаг и Герб', 'Flag and Emblem') },
      { id: 'anthem', label: X('Мемлекеттік Гимн', 'Государственный Гимн', 'State Anthem') },
      { id: 'rules', label: X('Рәміздерді құрметтеу ережелері', 'Правила уважения к символам', 'Rules of respect') },
      { id: 'school', label: X('Мектепте', 'В школе', 'At school') },
    ]);
    const intro = ui.split({
      ratio: '2:1', align: 'start', cls: 'ab-intro',
      left: `${ui.eyebrow(X('Ел рәміздері', 'Символы страны', 'Symbols of the nation'))}
<p class="lead">${L(X(
        'Мемлекеттік рәміздер — еліміздің егемендігі мен бірлігінің белгісі. Оларды құрметтеуге және мән-мағынасын түсінуге тәрбиелеу — мектептің міндеттерінің бірі.',
        'Государственные символы — знак суверенитета и единства страны. Воспитывать уважение к ним и понимание их смысла — одна из задач школы.',
        'The state symbols stand for the country’s sovereignty and unity. Teaching respect for them and what they mean is one of the school’s tasks.'))}</p>
${sources}`,
      right: toc,
    });

    return [
      intro,
      ui.section({ id: 'flag-emblem', eyebrow: X('1992 жылдан', 'С 1992 года', 'Since 1992'), title: X('Мемлекеттік Ту және Мемлекеттік Елтаңба', 'Государственный Флаг и Государственный Герб', 'State Flag and State Emblem'), body: `<div class="ab-sym">${flag}${emblem}</div>` }),
      ui.section({ id: 'anthem', eyebrow: X('Сөзі мен әні', 'Слова и музыка', 'Words and music'), title: X('Мемлекеттік Гимн', 'Государственный Гимн', 'State Anthem'), body: anthem + anthemAbout }),
      ui.section({ id: 'rules', eyebrow: X('Құрмет', 'Уважение', 'Respect'), title: X('Рәміздерді құрметтеу ережелері', 'Правила уважительного отношения к символам', 'Rules for honouring the symbols'), lead: X('Сегіз негізгі ереже — толығырақ оқу үшін карточканы басыңыз.', 'Восемь главных правил — нажмите на карточку, чтобы прочитать подробнее.', 'Eight key rules — tap a card to read more.'), body: rules }),
      ui.section({ id: 'school', eyebrow: X('Keremet-те', 'В Keremet', 'At Keremet'), title: X('Мектептегі рәміздер', 'Символы в школе', 'The symbols at school'), body: atSchool }),
      ui.section({ title: X('Осы бөлімде', 'В этом разделе', 'In this section'), body: related }),
    ].join('\n');
  },
};
