// Contacts — ORDER-114 §N (item 90): postal address with index, phones, e-mail, map, hours, requisites, social networks.
// Facts only from src/data/school.mjs (SCHOOL-FACTS.md). Probable data is labelled "нақтылануда / уточняется".
export default {
  slug: 'contacts',
  group: 'feedback',
  order: 10,
  title: { kz: 'Байланыс', ru: 'Контакты', en: 'Contacts' },
  description: {
    kz: '«Керемет» мектебінің мекенжайы, телефоны мен WhatsApp, жұмыс уақыты, картасы, қалай жетуге болатыны және деректемелері.',
    ru: 'Адрес школы «Керемет», телефон и WhatsApp, время работы, карта, как добраться и реквизиты ТОО «Keremet-City».',
    en: 'Keremet School address, phone and WhatsApp, working hours, map, directions and the legal requisites of Keremet-City LLP.',
  },
  lead: {
    kz: 'Мектепке қоңырау шалыңыз, WhatsApp-қа жазыңыз немесе Шымкенттегі Асар шағын ауданына келіңіз — барлық байланыс арналары бір жерде.',
    ru: 'Позвоните, напишите в WhatsApp или приходите в школу в мкр. Асар в Шымкенте — все каналы связи на одной странице.',
    en: 'Call us, message us on WhatsApp or visit the school in the Asar microdistrict of Shymkent — every way to reach us on one page.',
  },
  styles: ['feedback'],
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, { ui, S, L, t, href, fmt }) {
    const X = (kz, ru, en) => ({ kz, ru, en });
    const c = S.contacts;
    const a = S.addresses;
    const unconf = ui.badge(t('unconfirmed'), 'warn');
    const addr = (x) => `${x.postcode}, ${L(x.text)}`;
    const wa = (n) => `https://wa.me/${n}`;

    // ---------------------------------------------------------------- hub (hero-level contact card)
    const hub = `<div class="fb-hub">
<div class="fb-hub__main panel pattern" data-theme="chemistry">${ui.shanyrakArt()}
  <p class="fb-hub__eyebrow">${L(X('Негізгі байланыс желісі', 'Основная линия связи', 'Main line'))}</p>
  <p class="fb-hub__label">${t('phone')} · WhatsApp</p>
  <a class="fb-hub__phone" href="tel:${c.phone.tel}">${c.phone.display.replace(/^(.*\)) (.*)$/, '<span>$1</span> <span>$2</span>')}</a>
  <div class="cluster fb-hub__btns">${ui.button({ href: `tel:${c.phone.tel}`, label: t('cta.call'), kind: 'gold', iconLeft: 'phone', icon: null })}${ui.button({ href: wa(c.phone.whatsapp), label: X('WhatsApp-қа жазу', 'Написать в WhatsApp', 'Message on WhatsApp'), kind: 'light', iconLeft: 'whatsapp' })}</div>
  <ul class="fb-hub__meta" role="list">
    <li>${ui.icon('pin', { size: 18 })}<span>${addr(a.actual)}</span></li>
    <li>${ui.icon('clock', { size: 18 })}<span>${L(c.hours)} <small>(${t('unconfirmed')})</small></span></li>
  </ul>
</div>
<ul class="fb-hub__side" role="list">
  <li>${quick('pin', X('Бағыт құру', 'Построить маршрут', 'Get directions'), X('2GIS-те ашу', 'Открыть в 2ГИС', 'Open in 2GIS'), c.twoGis.url)}</li>
  <li>${quick('instagram', 'Instagram', c.instagram.handle, c.instagram.url)}</li>
  <li>${quick('chat', X('Өтініш жолдау', 'Направить обращение', 'Send an appeal'), X('Онлайн-форма', 'Онлайн-форма', 'Online form'), href('feedback'))}</li>
  <li>${quick('user', X('Директорға сұрақ', 'Вопрос директору', 'Ask the director'), X('Директор блогы', 'Блог директора', 'Director’s blog'), href('director-blog'))}</li>
</ul>
</div>`;
    function quick(ic, title, note, url) {
      const ext = /^https?:/.test(url);
      return `<a class="fb-quick" href="${url}"${ext ? ' target="_blank" rel="noopener" data-ext' : ''}><span class="fb-quick__ico">${ui.icon(ic, { size: 22 })}</span><span class="fb-quick__txt"><span class="fb-quick__t">${L(title)}</span><span class="fb-quick__n">${L(note)}</span></span>${ext ? `<span class="sr-only"> ${t('extNewTab')}</span>` : ''}${ui.icon(ext ? 'ext' : 'arrow-right', { size: 18, cls: 'fb-quick__arr' })}</a>`;
    }

    // ---------------------------------------------------------------- addresses
    const addresses = `<div class="fb-addr">
<article class="fb-addr__card fb-addr__card--main">
  <p class="fb-addr__tag">${ui.icon('school', { size: 18 })}<span>${t('actualAddress')}</span></p>
  <h3 class="fb-addr__title">${L(X('Мектеп осы жерде жұмыс істейді', 'Здесь работает школа', 'Where the school operates'))}</h3>
  <p class="fb-addr__line"><span class="fb-addr__index">${a.actual.postcode}</span>${L(a.actual.text)}</p>
  <p class="fb-addr__coords">${a.actual.lat.toFixed(6)}° N, ${a.actual.lng.toFixed(6)}° E · ${L(X('2GIS деректері', 'данные 2ГИС', '2GIS data'))} ${unconf}</p>
  <div class="cluster">${ui.button({ href: c.twoGis.url, label: t('map.2gis'), kind: 'primary', size: 's' })}<button type="button" class="copy-btn" data-copy="${ui.esc(addr(a.actual))}">${ui.icon('copy', { size: 16 })}<span class="copy-btn__txt">${t('copy')}</span></button></div>
</article>
<article class="fb-addr__card">
  <p class="fb-addr__tag">${ui.icon('building', { size: 18 })}<span>${t('legalAddress')}</span></p>
  <h3 class="fb-addr__title">${L(S.legal.name)}</h3>
  <p class="fb-addr__line"><span class="fb-addr__index">${a.legal.postcode}</span>${L(a.legal.text)}</p>
  <p class="fb-addr__src">${L(X('Заңды тұлғаны мемлекеттік тіркеу туралы анықтама бойынша (25.01.2026)', 'По справке о государственной регистрации юридического лица (25.01.2026)', 'Per the certificate of state registration (25.01.2026)'))}</p>
  <div class="cluster"><button type="button" class="copy-btn" data-copy="${ui.esc(addr(a.legal))}">${ui.icon('copy', { size: 16 })}<span class="copy-btn__txt">${t('copy')}</span></button></div>
</article>
</div>`;
    const addrTitle = X('Хат-хабарға арналған мекенжай нақтылануда', 'Почтовый адрес для корреспонденции уточняется', 'Postal address for correspondence is being confirmed');
    const addrNote = ui.pendingGroup(lang, [{
      title: addrTitle,
      note: X(
        'Заңды мекенжай (Сейхун к-сі, 125) мен мектептің нақты орны (Асар ш/а, 911/2) бір нысан ба, әлде әртүрлі ме — мектеп әкімшілігі нақтылап жатыр. Хаттарды қай мекенжайға жіберу керектігі расталғаннан кейін осында көрсетіледі.',
        'Администрация школы уточняет, являются ли юридический адрес (ул. Сейхун, 125) и фактическое место работы школы (мкр. Асар, 911/2) одним объектом. После подтверждения здесь будет указано, по какому адресу направлять письма.',
        'The school is confirming whether the legal address (125 Seikhun St.) and the site where it operates (Asar, 911/2) are the same property. Once confirmed, this page will state which address to use for letters.',
      ),
    }], { title: addrTitle });

    // ---------------------------------------------------------------- channels
    const ch = (o) => `<li class="fb-ch${o.pending ? ' fb-ch--pending' : ''}${o.cls ? ' ' + o.cls : ''}"><span class="fb-ch__ico">${ui.icon(o.icon, { size: 22 })}</span><div class="fb-ch__body"><p class="fb-ch__k">${L(o.k)}${o.badge ? ' ' + o.badge : ''}</p><p class="fb-ch__v">${o.v}</p>${o.note ? `<p class="fb-ch__note">${L(o.note)}</p>` : ''}</div></li>`;
    // Featured row: the main number for calls and WhatsApp (the channels parents use most), large and side by side.
    const featured = `<ul class="fb-channels fb-channels--main" role="list">${[
      { icon: 'phone', k: X('Телефон (қоңырау)', 'Телефон (звонки)', 'Phone (calls)'), v: `<a href="tel:${c.phone.tel}">${c.phone.display}</a>`, note: X('Мектептің негізгі нөмірі', 'Основной номер школы', 'The school’s main number') },
      { icon: 'whatsapp', k: 'WhatsApp', v: ui.extLink(wa(c.phone.whatsapp), c.phone.display), note: X('Сол нөмірге хат жазуға болады', 'На этот же номер можно написать', 'You can message the same number') },
    ].map(ch).join('')}</ul>`;
    // Landline: shown only once S.contacts.cityPhone exists ({display, tel} or a plain string) — no half-written number.
    const city = c.cityPhone ? (typeof c.cityPhone === 'string' ? { display: c.cityPhone, tel: c.cityPhone.replace(/[^+\d]/g, '') } : c.cityPhone) : null;
    const channels = featured + `<ul class="fb-channels fb-channels--more" role="list" data-reveal-stagger>${[
      { icon: 'whatsapp', k: X('Қабылдау бойынша WhatsApp', 'WhatsApp по приёму', 'WhatsApp for admission'), badge: unconf, v: ui.extLink(wa(c.whatsappAdmission.whatsapp), c.whatsappAdmission.display), note: X('Нөмір 12.08.2025 жарияланған қабылдау хабарландыруынан алынды және расталуда', 'Номер взят из объявления о приёме от 12.08.2025 и уточняется', 'Taken from the admission announcement of 12.08.2025; being confirmed') },
      city && { icon: 'phone', k: X('Қалалық телефон', 'Городской телефон', 'Landline'), v: `<a href="tel:${city.tel}">${city.display}</a>` },
      { icon: 'instagram', k: 'Instagram', v: ui.extLink(c.instagram.url, c.instagram.handle), note: X('Мектеп жаңалықтары мен хабарландырулары', 'Новости и объявления школы', 'School news and announcements') },
      { icon: 'star', k: X('2GIS карточкасы', 'Карточка в 2ГИС', '2GIS listing'), v: ui.extLink(c.twoGis.url, `${String(c.twoGis.rating).replace('.', lang === 'en' ? '.' : ',')} ★`), note: X(`${c.twoGis.ratings} бағалау (${fmt.date(c.twoGis.checked)} жағдай бойынша)`, `${c.twoGis.ratings} оценка (на ${fmt.date(c.twoGis.checked)})`, `${c.twoGis.ratings} ratings (as of ${fmt.date(c.twoGis.checked)})`) },
      { icon: 'chat', k: X('Онлайн-өтініш', 'Онлайн-обращение', 'Online appeal'), v: `<a href="${href('feedback')}">${L(X('Кері байланыс формасы', 'Форма обратной связи', 'Feedback form'))}</a>`, note: X('Ұсыныс, сұрақ немесе шағым үшін', 'Для вопросов, предложений и жалоб', 'For questions, suggestions and complaints') },
      // No official mailbox is confirmed (SCHOOL-FACTS: keremet.edu.kz does not resolve) → no address and no mailto link until the school confirms one.
      // Full-width card at the end (a normal channel card with the «нақтылануда» badge) so its longer note does not stretch the others.
      { icon: 'mail', k: t('email'), badge: unconf, cls: 'fb-ch--wide', v: `<span class="fb-ch__pend">${L(X('Ресми электрондық пошта нақтылануда', 'Официальный e-mail уточняется', 'Official e-mail to be confirmed'))}</span>`, note: X(`Жазбаша хабарласу үшін <a href="${href('feedback')}#form">онлайн-форманы</a> немесе WhatsApp-ты пайдаланыңыз. Пошта мекенжайы мектеп растағаннан кейін осында жарияланады.${city ? '' : ' Қалалық телефон нөмірі де нақтыланып жатыр.'}`, `Чтобы написать в школу, используйте <a href="${href('feedback')}#form">онлайн-форму</a> или WhatsApp. Адрес почты появится здесь после подтверждения школой.${city ? '' : ' Городской номер телефона также уточняется.'}`, `To write to the school, use the <a href="${href('feedback')}#form">online form</a> or WhatsApp. The e-mail address will appear here once the school confirms it.${city ? '' : ' The landline number is also being confirmed.'}`) },
    ].filter(Boolean).map(ch).join('')}</ul>`;

    // ---------------------------------------------------------------- hours (week strip)
    const days = {
      kz: [['Дс', 'Дүйсенбі'], ['Сс', 'Сейсенбі'], ['Ср', 'Сәрсенбі'], ['Бс', 'Бейсенбі'], ['Жм', 'Жұма'], ['Сб', 'Сенбі'], ['Жс', 'Жексенбі']],
      ru: [['Пн', 'Понедельник'], ['Вт', 'Вторник'], ['Ср', 'Среда'], ['Чт', 'Четверг'], ['Пт', 'Пятница'], ['Сб', 'Суббота'], ['Вс', 'Воскресенье']],
      en: [['Mon', 'Monday'], ['Tue', 'Tuesday'], ['Wed', 'Wednesday'], ['Thu', 'Thursday'], ['Fri', 'Friday'], ['Sat', 'Saturday'], ['Sun', 'Sunday']],
    }[lang];
    // Only Mon–Fri tiles (2GIS data); weekend hours are unknown → one plain-text line instead of "?" tiles.
    const week = `<ol class="fb-week" role="list">${days.slice(0, 5).map(([sh, full]) => `<li class="fb-week__d is-work"><abbr class="fb-week__n" title="${full}">${sh}</abbr><span class="sr-only">${full}: </span><span class="fb-week__h">09:00<br>18:00</span></li>`).join('')}</ol>
<p class="fb-week__off">${ui.icon('calendar', { size: 18 })}<span>${L(X('Сенбі, жексенбі — нақтылануда', 'Суббота, воскресенье — уточняется', 'Saturday, Sunday — to be confirmed'))}</span></p>`;
    const hoursBlock = ui.split({
      ratio: '3:2', align: 'center',
      left: `${week}${ui.more({ icon: 'info', label: X('Дереккөз және демалыс күндері', 'Источник и выходные дни', 'Source and days off'), body: X(
        'Жұмыс уақыты 2GIS анықтамалығының деректері бойынша көрсетілген (мектеп 09:00-де ашылады) және мектеп әкімшілігімен нақтылануда. Демалыс күндері мен мереке күндерінің кестесі расталғаннан кейін жарияланады.',
        'Время работы указано по данным справочника 2ГИС (школа открывается в 09:00) и уточняется администрацией. График в выходные и праздничные дни будет опубликован после подтверждения.',
        'Hours follow the 2GIS directory (the school opens at 09:00) and are being confirmed by the administration. Weekend and holiday hours will be published once confirmed.',
      ) })}`,
      right: ui.cards([
        { icon: 'user', title: X('Директордың қабылдау кестесі', 'График приёма директора', 'Director’s reception hours'), text: X('Жеке қабылдау күндері мен уақыты', 'Дни и часы личного приёма', 'Days and hours of personal reception'), href: href('director-blog') + '#reception' },
        { icon: 'calendar', title: X('Сабақ кестесі мен қоңыраулар', 'Расписание уроков и звонков', 'Timetable and bells'), href: href('schedule') },
      ], { cols: 1 }),
    });

    // ---------------------------------------------------------------- directions
    const route = ui.split({
      ratio: '1:1',
      left: `${ui.steps([
        { title: X('Автобуспен', 'На автобусе', 'By bus'), text: X('«Қ. Жалайыри даңғылы» аялдамасына дейін жетіңіз — мектепке дейін 250 м, жаяу шамамен 3 минут.', 'Доезжайте до остановки «проспект К. Жалаири» — до школы 250 м, около 3 минут пешком.', 'Ride to the “K. Zhalairi Avenue” stop — the school is 250 m away, about a 3-minute walk.') },
        { title: X(`«школа Керемет» аялдамасы ${unconf}`, `Остановка «школа Керемет» ${unconf}`, `The “Keremet school” stop ${unconf}`), text: X('2GIS деректері бойынша мектептің жанында «школа Керемет» деп аталатын аялдама бар.', 'По данным 2ГИС, рядом со школой есть остановка с названием «школа Керемет».', 'According to 2GIS, a stop named “школа Керемет” (Keremet school) is next to the school.') },
        { title: X('Көлікпен', 'На автомобиле', 'By car'), text: X('Ғимарат жанында 7 орындық автотұрақ бар.', 'У здания есть парковка на 7 мест.', 'There is a 7-space car park by the building.') },
        { title: X('Кедергісіз кіру', 'Доступный вход', 'Step-free access'), text: X('2 қабатты ғимаратқа пандус және кедергісіз кіреберіс арқылы кіруге болады.', 'В 2-этажное здание можно попасть через пандус и доступный вход.', 'The 2-storey building has a ramp and a step-free entrance.') },
      ])}
${ui.pendingGroup(lang, [{ title: X('Автобус маршруттарының нөмірлері нақтылануда', 'Номера автобусных маршрутов уточняются', 'Bus route numbers are being confirmed'), note: X('Аялдамадан өтетін автобус маршруттарының нөмірлері нақтыланып жатыр. Ағымдағы маршрутты 2GIS-тен құра аласыз.', 'Номера автобусных маршрутов уточняются. Актуальный маршрут можно построить в 2ГИС.', 'Bus route numbers are being confirmed. You can plan an up-to-date route in 2GIS.') }], { title: X('Автобус маршруттарының нөмірлері нақтылануда', 'Номера автобусных маршрутов уточняются', 'Bus route numbers are being confirmed') })}`,
      right: ui.mapEmbed(a.actual.lat, a.actual.lng, { zoom: 16, height: 480, title: X('«Керемет» мектебінің картадағы орны: Шымкент, Асар ш/а, 911/2', 'Школа «Керемет» на карте: Шымкент, мкр. Асар, 911/2', 'Keremet School on the map: 911/2 Asar, Shymkent') }),
    });

    // ---------------------------------------------------------------- requisites
    const req = ui.split({
      ratio: '2:1',
      left: ui.facts([
        { k: X('Толық атауы', 'Полное наименование', 'Full legal name'), v: L(S.legal.fullName) },
        { k: t('bin'), v: S.legal.bin, copy: S.legal.bin },
        { k: t('licence'), v: `№ ${S.licence.current.number} (${fmt.date(S.licence.current.date)}, ${L(S.licence.current.term)})`, copy: S.licence.current.number },
      ]) + ui.more({ icon: 'doc', count: 6, label: X('Барлық деректемелер', 'Все реквизиты', 'All requisites'), body: ui.facts([
        { k: X('Мемлекеттік тіркелген күні', 'Дата государственной регистрации', 'State registration date'), v: fmt.date(S.legal.registered) },
        { k: t('legalAddress'), v: addr(a.legal), copy: true },
        { k: t('actualAddress'), v: addr(a.actual), copy: true },
        { k: X('ЭҚЖЖ коды', 'ОКЭД', 'Activity code (OKED)'), v: `${S.legal.oked.code} — ${L(S.legal.oked.title)}` },
        { k: t('hdr.licensor'), v: L(S.licensorShort) },
        { k: X('Директор', 'Директор', 'Director'), v: L(S.legal.director.name) },
      ]) }),
      right: `<div class="stack">${ui.cards([
        { icon: 'shield', title: X('Лицензия және тіркеу құжаттары', 'Лицензия и регистрационные документы', 'Licence and registration documents'), text: X('Сканерленген көшірмелер', 'Сканы документов', 'Document scans'), href: href('license') },
        { icon: 'doc', title: X('Барлық құжаттар', 'Все документы', 'All documents'), href: href('documents') },
      ], { cols: 1 })}
${ui.pendingGroup(lang, [{ title: X('Банк деректемелері', 'Банковские реквизиты', 'Bank details'), note: X('ЖСК, БСК және банк атауы мектеп бухгалтериясы растағаннан кейін жарияланады.', 'ИИК, БИК и наименование банка будут опубликованы после подтверждения бухгалтерией школы.', 'IBAN, BIC and bank name will be published once confirmed by the school’s accountant.') }], { title: X('Банк деректемелері нақтылануда', 'Банковские реквизиты уточняются', 'Bank details are being confirmed') })}</div>`,
    });

    // ---------------------------------------------------------------- official links
    const gov = ui.linkList(['department', 'cityEducation', 'ministry', 'egov'].map((k) => ({ href: S.gov[k].url, label: S.gov[k].label, icon: k === 'egov' ? 'globe' : 'building' })));

    const toc = ui.toc([
      { id: 'address', label: X('Мекенжай', 'Адрес', 'Address') },
      { id: 'channels', label: X('Телефондар және арналар', 'Телефоны и каналы', 'Phones and channels') },
      { id: 'hours', label: t('hours') },
      { id: 'route', label: X('Карта және жол', 'Карта и проезд', 'Map and directions') },
      { id: 'requisites', label: t('ftr.requisites') },
      { id: 'gov', label: X('Жоғары тұрған органдар', 'Вышестоящие органы', 'Supervising authorities') },
    ]);

    const related = ui.linkList([
      { href: href('feedback'), icon: 'chat', label: X('Өтініш жолдау', 'Обращения', 'Appeals & feedback'), note: X('Онлайн-форма, қарау мерзімдері, шағымдану тәртібі', 'Онлайн-форма, сроки, порядок обжалования', 'Online form, response times, how to appeal') },
      { href: href('director-blog'), icon: 'user', label: X('Директор блогы', 'Блог директора', 'Director’s blog'), note: X('Директорға сұрақ қою', 'Задать вопрос директору', 'Ask the director a question') },
      { href: href('faq'), icon: 'info', label: X('Сұрақ–жауап', 'Вопрос–ответ', 'FAQ'), note: X('Ата-аналардың жиі қоятын сұрақтары', 'Частые вопросы родителей', 'Parents’ frequent questions') },
      { href: href('surveys'), icon: 'users', label: X('Сауалнамалар', 'Анкетирование', 'Surveys'), note: X('Сауалнамалар және олардың нәтижелері', 'Опросы и их результаты', 'Surveys and their results') },
    ]);

    return [
      hub,
      ui.split({ ratio: '1:2', left: toc, right: ui.section({ id: 'address', eyebrow: X('Индексімен', 'С индексом', 'With postcode'), title: X('Мекенжай', 'Адрес', 'Address'), body: addresses + addrNote }) }),
      ui.section({ id: 'channels', eyebrow: X('Байланыс арналары', 'Каналы связи', 'Channels'), title: X('Телефондар, пошта және әлеуметтік желілер', 'Телефоны, почта и соцсети', 'Phones, e-mail and social media'), lead: X('«Нақтылануда» белгісі бар деректер бір ғана дереккөзден алынған — оларды мектеп растағанша негізгі нөмірді пайдаланыңыз.', 'Данные с пометкой «уточняется» взяты из одного источника — пока школа их не подтвердит, пользуйтесь основным номером.', 'Details marked “to be confirmed” come from a single source — until the school confirms them, please use the main number.'), body: channels }),
      ui.section({ id: 'hours', eyebrow: X('Кесте', 'График', 'Schedule'), title: X('Жұмыс уақыты', 'Время работы', 'Working hours'), body: hoursBlock }),
      ui.section({ id: 'route', tone: 'chemistry', eyebrow: X('Бізге келіңіз', 'Приходите к нам', 'Visit us'), title: X('Карта және қалай жетуге болады', 'Карта и как добраться', 'Map and how to get here'), body: route }),
      ui.section({ id: 'requisites', eyebrow: L(S.legal.name), title: X('Деректемелер', 'Реквизиты', 'Requisites'), body: req }),
      ui.section({ id: 'gov', eyebrow: X('Ресми сілтемелер', 'Официальные ресурсы', 'Official resources'), title: X('Білім беру саласындағы мемлекеттік органдар', 'Государственные органы в сфере образования', 'State education authorities'), lead: X('Мектеп лицензиясын берген және білім беру саласындағы бақылауды жүзеге асыратын органдар.', 'Органы, выдавшие лицензию школе и осуществляющие контроль в сфере образования.', 'The bodies that issued the school’s licence and supervise education.'), body: gov }),
      ui.banner({ theme: 'chemistry', icon: 'chat', eyebrow: X('Кері байланыс', 'Обратная связь', 'Feedback'), title: X('Сұрағыңыз, ұсынысыңыз немесе шағымыңыз бар ма?', 'Есть вопрос, предложение или жалоба?', 'Have a question, suggestion or complaint?'), text: X('Өтінішті онлайн жолдаңыз — ол тіркеліп, жауапты адамға жіберіледі.', 'Направьте обращение онлайн — оно будет зарегистрировано и передано ответственному лицу.', 'Send it online — it will be registered and passed to the person in charge.'), href: href('feedback'), label: X('Өтініш жолдау', 'Направить обращение', 'Send an appeal') }),
      ui.section({ title: t('nav.inSection'), body: related }),
    ].join('\n');
  },
};
