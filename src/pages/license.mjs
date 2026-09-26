// Licence & registration — real scans (public/assets/docs) with the full metadata transcribed from them
// (text version of every document, ORDER-114 K.76), pending appendix to the 2025 licence and the charter,
// how to verify on elicense.kz / egov.kz. ORDER-114 C.25, C.26 (criterion 1 of Order 114-NK).
// Transcribed from the scans on 24.09.2026: license-2025-KZ29LAM00002781.jpg, license-2022-KZ18LAA00032760.jpg,
// license-2022-appendix-001.jpg, registration-certificate-2026.jpg.
const ADILET = (code, lang) => `https://adilet.zan.kz/${lang === 'kz' ? 'kaz' : 'rus'}/docs/${code}`;

export default {
  slug: 'license',
  group: 'about',
  order: 40,
  title: { kz: 'Лицензия және тіркеу', ru: 'Лицензия и регистрация', en: 'Licence and registration' },
  description: {
    kz: '«Keremet-City» ЖШС білім беру қызметіне лицензиялары, лицензияға қосымша және мемлекеттік тіркеу туралы анықтама: сканерленген көшірмелер мен деректемелер.',
    ru: 'Лицензии ТОО «Keremet-City» на образовательную деятельность, приложение к лицензии и справка о госрегистрации: сканы и реквизиты.',
    en: 'Keremet-City LLP education licences, licence appendix and state registration certificate: scans and full details.',
  },
  lead: {
    kz: 'Мектептің білім беру қызметіне құқығын растайтын құжаттар: мерзімсіз лицензия, оның қосымшасы және заңды тұлғаны тіркеу туралы анықтама.',
    ru: 'Документы, подтверждающие право школы на образовательную деятельность: бессрочная лицензия, приложение к ней и справка о регистрации юридического лица.',
    en: 'The documents that give the school the right to teach: an unlimited licence, its appendix and the legal-entity registration certificate.',
  },
  styles: ['about'],
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, { ui, S, L, href, asset, fmt, docById }) {
    const X = (kz, ru, en) => ({ kz, ru, en });
    const cur = S.licence.current, prev = S.licence.previous;
    const pill = (kind, label, ic) => `<span class="ab-pill ab-pill--${kind}">${ic ? ui.icon(ic, { size: 14 }) : ''}${L(label)}</span>`;
    const ELICENSE = 'https://elicense.kz/';
    const EGOV = 'https://egov.kz/';
    const d25 = docById('license-2025'), d22 = docById('license-2022'), app = docById('license-2022-appendix-001'), reg = docById('registration-certificate');
    const size = (d) => (d && d.size ? fmt.size(d.size) : '');

    const scan = (d, stamp, old, trim) => `<figure class="ab-scan${trim ? ` ab-scan--trim-${trim}` : ''}">
<span class="ab-scan__stamp${old ? ' ab-scan__stamp--old' : ''}">${L(stamp)}</span>
<a class="ab-scan__frame" href="${asset(d.file)}" aria-label="${L(X('Құжат фотосын толық өлшемде ашу', 'Открыть фото документа в полном размере', 'Open the full-size photo of the document'))}: ${L(d.title)} (JPG, ${size(d)})"><img src="${asset(d.file)}" alt="${L(X('Құжаттың фотокөшірмесі', 'Фотокопия документа', 'Photo of the document'))}: ${L(d.title)}" width="960" height="1280" loading="lazy" decoding="async"><span class="ab-scan__zoom" aria-hidden="true">${ui.icon('search', { size: 14 })}${L(X('Үлкейту', 'Увеличить', 'Zoom'))}</span></a>
<figcaption>JPG, ${size(d)} · ${L(X('басып шығарылған құжаттың фотокөшірмесі', 'фотокопия распечатанного документа', 'photo of a printed copy'))}${trim ? ` · ${L(X('алдын ала қарауда жиектері қиылған, толық файл — сілтеме бойынша', 'в превью обрезаны края, полный файл — по ссылке', 'edges trimmed in the preview; full file via the link'))}` : ''}</figcaption>
</figure>`;
    const textVersion = X('Құжаттың мәтіндік нұсқасы', 'Текстовая версия документа', 'Text version of the document');
    // Text version in a <details> (open by default; an inline script collapses it on phones to keep the page short).
    const tv = (facts) => `<details class="ab-tv" open><summary class="ab-kicker">${L(textVersion)}</summary>${facts}</details>`;
    // Compact download row: the text version above already carries the metadata, so drop issuer/note.
    const dl = (d) => ui.docList([{ ...d, issuer: null, note: null }]);

    // ---------------------------------------------------------------- stats
    const bento = ui.stats([
      { icon: 'shield', art: true, value: L(cur.term).replace(/^./, (c) => c.toUpperCase()), label: X(`Лицензия № ${cur.number}`, `Лицензия № ${cur.number}`, `Licence No. ${cur.number}`),
        note: X(`${fmt.date(cur.date)} берілген · алғаш ${fmt.date(cur.firstIssued)}`, `выдана ${fmt.date(cur.date)} · первично ${fmt.date(cur.firstIssued)}`, `issued ${fmt.date(cur.date)} · first issued ${fmt.date(cur.firstIssued)}`),
        extra: ui.chips([{ label: X('Иеліктен шығарылмайтын', 'Неотчуждаемая', 'Non-transferable') }, { label: X('1-сынып', 'Класс 1', 'Class 1') }]) },
      { icon: 'graduation', value: String(S.licenceLevels.length), label: X('Қызмет түрлері', 'Видов деятельности', 'Activities covered'), note: X('лицензия мәтіні бойынша', 'по тексту лицензии', 'as worded in the licence') },
      { icon: 'calendar', value: '2022', label: X('Алғашқы лицензия', 'Первая лицензия', 'First licence'), note: fmt.date(prev.date) },
      { icon: 'building', value: '2021', label: X('Заңды тұлға тіркелді', 'Регистрация юрлица', 'Entity registered'), note: fmt.date(S.legal.registered) },
      { icon: 'doc', value: '4', label: X('Құжат көшірмесі', 'Копии документов', 'Document copies'), note: X('JPG фотокөшірмелер · PDF күтілуде', 'фотокопии JPG · PDF ожидаются', 'JPG photos · PDFs awaited') },
    ], { cls: 'stats--bento' });

    // ---------------------------------------------------------------- current licence
    const curFacts = ui.facts([
      { k: X('Лицензия нөмірі', 'Номер лицензии', 'Licence number'), v: `<span class="mono">${cur.number}</span>`, copy: cur.number },
      { k: X('Берілген күні', 'Дата выдачи', 'Date of issue'), v: fmt.date(cur.date) },
      { k: X('Алғаш берілген күні', 'Дата первичной выдачи', 'First issued'), v: fmt.date(cur.firstIssued) },
      { k: X('Кімге берілді', 'Выдана', 'Issued to'), v: `${L(S.legal.fullName)}, ${L(X('БСН', 'БИН', 'BIN'))} ${S.legal.bin}` },
      { k: X('Қызмет түрі', 'На занятие', 'Activity'), v: L(cur.activity) },
      { k: X('Ерекше шарттар', 'Особые условия', 'Special conditions'), v: `${L(cur.term)} <span class="muted">(${L(X('«Рұқсаттар және хабарламалар туралы» Заңның 36-бабы', 'ст. 36 Закона «О разрешениях и уведомлениях»', 'Art. 36 of the Law on Permits and Notifications'))})</span>` },
      { k: X('Ескерту', 'Примечание', 'Note'), v: L(cur.class) },
      { k: X('Лицензиар', 'Лицензиар', 'Licensor'), v: lang === 'kz' ? `«${L(S.licensor)}» мемлекеттік мекемесі` : `${L(X('', 'Государственное учреждение', 'State institution'))} «${L(S.licensor)}»` },
      { k: X('Басшы (уәкілетті тұлға)', 'Руководитель (уполномоченное лицо)', 'Head (authorised person)'), v: L(X('Әліш Рыскелді Салхутдинұлы', 'Әліш Рыскелді Салхутдинұлы', 'Alish Ryskeldi Salkhutdinuly')) },
      { k: X('Берілген орны', 'Место выдачи', 'Place of issue'), v: L(X('Шымкент қ.', 'г. Шымкент', 'Shymkent')) },
    ]);
    const current = `<div class="ab-lic">${scan(d25, X('Қолданыстағы', 'Действующая', 'Current'))}
<div><div class="ab-lic__head"><p class="ab-lic__no">№ ${cur.number}</p>${pill('ok', X('Қолданыста · мерзімсіз', 'Действует · бессрочно', 'Valid · unlimited'), 'check')}</div>
${tv(curFacts)}
${dl(d25)}</div></div>`;
    const appendixPending = ui.callout({
      type: 'warn', icon: 'hourglass',
      title: X('№ KZ29LAM00002781 лицензияға қосымша жүктеледі', 'Приложение к лицензии № KZ29LAM00002781 будет загружено', 'The appendix to licence No. KZ29LAM00002781 will be uploaded'),
      text: X(
        'Қосымшада лицензияланатын қызметтің кіші түрлері (бастауыш, негізгі орта, жалпы орта білім беру және т.б.), білім беру объектісінің мекенжайы, берілу негізі (лицензиардың бұйрығы) көрсетіледі. Қосымшаның сканерленген көшірмесі немесе elicense.kz-тен алынған электрондық нұсқасы осы бетте орналастырылады.',
        'В приложении указываются подвиды лицензируемой деятельности (начальное, основное среднее, общее среднее образование и др.), адрес объекта и основание выдачи (приказ лицензиара). Скан приложения или его электронная копия с elicense.kz будет размещена на этой странице.',
        'The appendix lists the licensed sub-types (primary, lower and upper secondary education, etc.), the address of the premises and the basis for issue (the licensor’s order). A scan of the appendix or its electronic copy from elicense.kz will be posted on this page.'),
    });

    // ---------------------------------------------------------------- what the licence covers
    const covers = `<ul class="ab-covers" role="list">${S.licenceLevels.map((l, i) => {
      const desc = {
        primary: X('1–4 сыныптар', '1–4 классы', 'grades 1–4'),
        basic: X('5–9 сыныптар', '5–9 классы', 'grades 5–9'),
        general: X('10–11 сыныптар', '10–11 классы', 'grades 10–11'),
        tvet: X('колледж деңгейіндегі бағдарламалар', 'программы уровня колледжа', 'college-level programmes'),
        postsec: X('орта білімнен кейінгі бағдарламалар', 'программы послесреднего уровня', 'post-secondary programmes'),
        spiritual: X('лицензия мәтініндегі қызмет түрі', 'вид деятельности по тексту лицензии', 'activity as worded in the licence'),
        health: X('кәмелетке толмағандарға арналған қызметтер', 'услуги для несовершеннолетних', 'services for minors'),
      }[l.id];
      return `<li class="ab-cover"><span class="ab-cover__n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><div><p class="ab-cover__t">${L(l.label)}</p>${desc ? `<p class="ab-cover__d">${L(desc)}</p>` : ''}</div></li>`;
    }).join('')}</ul>`;
    const coversNote = `<p class="ab-org__note">${ui.icon('info', { size: 18 })}<span>${L(X(
      `Лицензия қызметті жүзеге асыру құқығын береді. Мектеп қазір іс жүзінде қай сыныптарды оқытатыны — <a href="${href('contingent')}">контингент</a> бетінде (мектептің Instagram парақшасы бойынша — 0–6 сыныптар, нақтылануда).`,
      `Лицензия даёт право осуществлять деятельность. Какие классы школа фактически обучает сейчас — на странице <a href="${href('contingent')}">«Контингент»</a> (по странице школы в Instagram — 0–6 классы, уточняется).`,
      `The licence grants the right to operate. Which grades the school actually teaches now is shown on the <a href="${href('contingent')}">Pupils</a> page (grades 0–6 according to the school’s Instagram profile, being confirmed).`))}</span></p>`;

    // ---------------------------------------------------------------- 2022 licence + appendix 001
    const prevFacts = ui.facts([
      { k: X('Лицензия нөмірі', 'Номер лицензии', 'Licence number'), v: `<span class="mono">${prev.number}</span>`, copy: prev.number },
      { k: X('Берілген күні', 'Дата выдачи', 'Date of issue'), v: fmt.date(prev.date) },
      { k: X('Кімге берілді', 'Выдана', 'Issued to'), v: `${L(S.legal.fullName)}, ${L(X('БСН', 'БИН', 'BIN'))} ${S.legal.bin}` },
      { k: X('Лицензиаттың мекенжайы', 'Адрес лицензиата', 'Licensee address'), v: `${S.addresses.licence2022.postcode}, ${L(S.addresses.licence2022.text)}` },
      { k: X('Қызмет түрі', 'Вид деятельности', 'Activity'), v: L(X('Білім беру қызметі', 'Образовательная деятельность', 'Educational activity')) },
      { k: X('Ерекше шарттар', 'Особые условия', 'Special conditions'), v: L(prev.term) },
      { k: X('Ескерту', 'Примечание', 'Note'), v: L(X('Иеліктен шығарылмайтын; 1-сынып', 'Неотчуждаемая; класс 1', 'Non-transferable; class 1')) },
      { k: X('Басшы (уәкілетті тұлға)', 'Руководитель (уполномоченное лицо)', 'Head (authorised person)'), v: L(X('Шамшиева Нургуль Акылбековна', 'Шамшиева Нургуль Акылбековна', 'Shamshiyeva Nurgul Akylbekovna')) },
      { k: X('Берілген орны', 'Место выдачи', 'Place of issue'), v: L(X('Шымкент қ.', 'г. Шымкент', 'Shymkent')) },
    ]);
    const appFacts = ui.facts([
      { k: X('Қосымшаның нөмірі', 'Номер приложения', 'Appendix number'), v: `<span class="mono">${prev.appendix.number}</span>` },
      { k: X('Қосымшаның берілген күні', 'Дата выдачи приложения', 'Date of the appendix'), v: fmt.date(prev.appendix.date) },
      { k: X('Лицензияның нөмірі', 'К лицензии', 'To licence'), v: `<span class="mono">${prev.number}</span>` },
      { k: X('Кіші түрі', 'Подвид деятельности', 'Sub-type'), v: `<strong>${L(prev.subtype)}</strong>` },
      { k: X('Беру үшін негіз', 'Основание выдачи', 'Basis for issue'), v: L(X('Шымкент қаласының білім саласында сапаны қамтамасыз ету департаментінің 2022 жылғы 7 қарашадағы № 299 бұйрығы', 'Приказ Департамента по обеспечению качества в сфере образования г. Шымкент от 7 ноября 2022 года № 299', 'Order No. 299 of 7 November 2022 of the Shymkent Department for Quality Assurance in Education')) },
      { k: X('Лицензиат', 'Лицензиат', 'Licensee'), v: `${L(S.legal.fullName)}, ${L(X('БСН', 'БИН', 'BIN'))} ${S.legal.bin}` },
      { k: X('Лицензиаттың мекенжайы', 'Адрес лицензиата', 'Licensee address'), v: `${S.addresses.licence2022.postcode}, ${L(S.addresses.licence2022.text)}` },
      { k: X('Басшы (уәкілетті тұлға)', 'Руководитель (уполномоченное лицо)', 'Head (authorised person)'), v: L(X('Шамшиева Нургуль Акылбековна', 'Шамшиева Нургуль Акылбековна', 'Shamshiyeva Nurgul Akylbekovna')) },
      { k: X('Берілген орны', 'Место выдачи', 'Place of issue'), v: L(X('Шымкент қ.', 'г. Шымкент', 'Shymkent')) },
    ]);
    const previous = `<div class="ab-lic">${scan(d22, X('2022 · алғашқы', '2022 · первая', '2022 · first'), true, 'top')}
<div><div class="ab-lic__head"><p class="ab-lic__no">№ ${prev.number}</p>${pill('law', X('Алғашқы лицензия', 'Первичная лицензия', 'Original licence'), 'calendar')}</div>
${tv(prevFacts)}${dl(d22)}</div></div>
<div class="ab-lic ab-lic--rev">${scan(app, X('Қосымша № 001', 'Приложение № 001', 'Appendix 001'), true)}
<div><div class="ab-lic__head"><p class="ab-lic__no">${L(X('Қосымша № 001', 'Приложение № 001', 'Appendix No. 001'))}</p>${pill('law', X('Бастауыш білім беру', 'Начальное образование', 'Primary education'), 'graduation')}</div>
${tv(appFacts)}${dl(app)}</div></div>
${ui.note(X(`2025 жылғы № ${cur.number} лицензияда алғаш берілген күні ретінде ${fmt.date(cur.firstIssued)} көрсетілген.`, `В лицензии № ${cur.number} 2025 года датой первичной выдачи указано ${fmt.date(cur.firstIssued)}.`, `Licence No. ${cur.number} (2025) gives ${fmt.date(cur.firstIssued)} as the date of first issue.`))}`;

    // ---------------------------------------------------------------- registration certificate + charter
    const regFacts = ui.facts([
      { k: X('Бизнес-сәйкестендіру нөмірі (БСН)', 'Бизнес-идентификационный номер (БИН)', 'Business identification number (BIN)'), v: `<span class="mono">${S.legal.bin}</span>`, copy: S.legal.bin },
      { k: X('Атауы', 'Наименование', 'Name'), v: L(S.legal.fullName) },
      { k: X('Тіркелген күні', 'Дата регистрации', 'Registration date'), v: fmt.date(S.legal.registered) },
      { k: X('Орналасқан жері', 'Местонахождение', 'Registered address'), v: `${S.addresses.legal.postcode}, ${L(S.addresses.legal.text)}` },
      { k: X('Басшы', 'Руководитель', 'Head'), v: L(S.legal.director.name) },
      { k: X('Құрылтайшы (қатысушы)', 'Учредитель (участник)', 'Founder (participant)'), v: L(S.legal.founder) },
      { k: X('Анықтаманы берген орган', 'Орган, выдавший справку', 'Issued by'), v: L(X('«Азаматтарға арналған үкімет» мемлекеттік корпорациясы» КЕАҚ Шымкент қаласы бойынша филиалының заңды тұлғаларды тіркеу басқармасы', 'Управление регистрации юридических лиц филиала НАО «Государственная корпорация «Правительство для граждан» по городу Шымкент', 'Legal Entities Registration Office, Shymkent branch of the Government for Citizens State Corporation')) },
      { k: X('Анықтама берілген күні', 'Дата выдачи справки', 'Certificate issued'), v: fmt.date(reg.date) },
    ]);
    const registration = `<div class="ab-lic">${scan(reg, X('egov.kz анықтамасы', 'Справка egov.kz', 'egov.kz certificate'), false, 'left')}
<div><div class="ab-lic__head"><p class="ab-lic__no">${L(X('БСН', 'БИН', 'BIN'))} ${S.legal.bin}</p>${pill('ok', X('Тіркелген', 'Зарегистрировано', 'Registered'), 'check')}</div>
${tv(regFacts)}${dl(reg)}${ui.docList([docById('charter')].filter(Boolean))}</div></div>`;

    // ---------------------------------------------------------------- how to verify
    const verify = ui.split({
      ratio: '3:2', align: 'start',
      left: ui.steps([
        { title: X('elicense.kz порталын ашыңыз', 'Откройте портал elicense.kz', 'Open elicense.kz'), text: X(`Рұқсаттар мен хабарламалардың мемлекеттік электрондық тізілімі: ${ui.extLink(ELICENSE, 'elicense.kz')}.`, `Государственный электронный реестр разрешений и уведомлений: ${ui.extLink(ELICENSE, 'elicense.kz')}.`, `The state electronic register of permits and notifications: ${ui.extLink(ELICENSE, 'elicense.kz')}.`) },
        { title: X('Лицензияны іздеңіз', 'Найдите лицензию', 'Search for the licence'), text: X(`Тізілімнен БСН <span class="mono">${S.legal.bin}</span> немесе лицензия нөмірі <span class="mono">${cur.number}</span> бойынша іздеңіз.`, `Ищите в реестре по БИН <span class="mono">${S.legal.bin}</span> или номеру лицензии <span class="mono">${cur.number}</span>.`, `Search the register by BIN <span class="mono">${S.legal.bin}</span> or licence number <span class="mono">${cur.number}</span>.`) },
        { title: X('Деректерді салыстырыңыз', 'Сверьте данные', 'Compare the details'), text: X('Құжаттың төменгі жағында QR-кодтар бар; құжат мәтінінде оның түпнұсқалығын elicense.kz порталында тексеруге болатыны көрсетілген.', 'Внизу документа есть QR-коды; в тексте документа указано, что его подлинность можно проверить на портале elicense.kz.', 'The documents carry QR codes, and their text states that authenticity can be checked on elicense.kz.') },
      ]),
      right: `<div class="stack">${ui.banner({ theme: 'hero', icon: 'shield', eyebrow: X('Лицензиялар тізілімі', 'Реестр лицензий', 'Licence register'), title: 'elicense.kz', text: X('Лицензияның жарамдылығын тексеріңіз.', 'Проверьте действительность лицензии.', 'Check that the licence is valid.'), href: ELICENSE, label: X('Порталға өту', 'Перейти на портал', 'Go to the portal') })}
${ui.banner({ theme: 'geography', icon: 'building', eyebrow: X('Заңды тұлғалар', 'Юридические лица', 'Legal entities'), title: 'egov.kz', text: X('Мемлекеттік тіркеу туралы анықтаманың түпнұсқалығын тексеріңіз.', 'Проверьте подлинность справки о государственной регистрации.', 'Check the authenticity of the registration certificate.'), href: EGOV, label: X('Порталға өту', 'Перейти на портал', 'Go to the portal') })}</div>`,
    });

    // ---------------------------------------------------------------- criterion 1 & law
    const ladder = `<ol class="ab-ladder" reversed>${[
      ['s5', 5, X('құжаттар заңнама талаптарына сәйкес келеді', 'документы соответствуют требованиям законодательства', 'documents comply with the law')],
      ['s4', 4, X('құжаттар сәйкес, болмашы техникалық алшақтықтар бар', 'документы соответствуют, имеются незначительные технические расхождения', 'documents comply, with minor technical discrepancies')],
      ['s3', 3, X('құжаттарда сәйкессіздіктер бар (мәліметтер, қосымшалар, деректемелер)', 'имеются несоответствия в документах (сведения, приложения, реквизиты)', 'inconsistencies in the documents (details, appendices, requisites)')],
      ['s2', 2, X('лицензияның болмауы немесе құжаттардың талаптарға сәйкес келмеуі', 'отсутствие лицензии либо несоответствие документов требованиям', 'no licence, or documents do not meet the requirements')],
    ].map(([c, n, txt]) => `<li class="${c}"><span class="ab-ladder__score" aria-hidden="true">${n}</span><div><p class="ab-ladder__lvl">${n} ${L(X('балл', n === 5 ? 'баллов' : 'балла', 'points'))}</p><p class="ab-ladder__txt">${L(txt)}</p></div></li>`).join('')}</ol>`;
    const legal = ui.split({
      ratio: '1:1', align: 'start',
      left: `<div class="prose">${L(X(
        '<p>Мемлекеттік аттестаттауда № 114-НҚ бұйрықтың 1-өлшемшарты бойынша құрылтай және рұқсат беру құжаттарының болуы және олардың «Рұқсаттар және хабарламалар туралы» және «Білім туралы» заңдарға сәйкестігі бағаланады.</p><p>Сондықтан сайтта лицензия ғана емес, оның барлық қосымшалары, жарғы және мемлекеттік тіркеу туралы анықтама жарияланады.</p>',
        '<p>При государственной аттестации по критерию 1 приказа № 114-НҚ оценивается наличие учредительных и разрешительных документов и их соответствие законам «О разрешениях и уведомлениях» и «Об образовании».</p><p>Поэтому на сайте публикуется не только лицензия, но и все приложения к ней, устав и справка о государственной регистрации.</p>',
        '<p>Criterion 1 of Order No. 114-NK assesses whether the founding and permit documents exist and comply with the Law on Permits and Notifications and the Law on Education.</p><p>That is why the site publishes not only the licence but all its appendices, the charter and the registration certificate.</p>'))}</div>
${ui.linkList([
        { href: ADILET('Z1400000202', lang), icon: 'scale', label: X('«Рұқсаттар және хабарламалар туралы» Заң', 'Закон «О разрешениях и уведомлениях»', 'Law on Permits and Notifications') },
        { href: ADILET('Z070000319_', lang), icon: 'scale', label: X('«Білім туралы» Заң', 'Закон «Об образовании»', 'Law on Education') },
        { href: ADILET('V2600038645', lang), icon: 'scale', label: X('№ 114-НҚ бұйрық (аттестаттау)', 'Приказ № 114-НҚ (аттестация)', 'Order No. 114-NK (attestation)') },
      ])}`,
      right: `<p class="ab-kicker">${L(X('1-өлшемшарт · бағалау шкаласы', 'Критерий 1 · шкала оценки', 'Criterion 1 · scoring scale'))}</p>${ladder}`,
    });

    const related = ui.linkList([
      { href: href('about'), icon: 'school', label: X('Мектеп туралы', 'О школе', 'About the school'), note: X('Жалпы мәліметтер мен деректемелер', 'Общие сведения и реквизиты', 'General information and requisites') },
      { href: href('structure'), icon: 'sitemap', label: X('Басқару құрылымы', 'Структура управления', 'Governance structure') },
      { href: href('documents'), icon: 'doc', label: X('Барлық құжаттар', 'Все документы', 'All documents') },
      { href: href('self-1'), icon: 'check', label: X('Өзін-өзі бағалау: жалпы сипаттама', 'Самооценка: общая характеристика', 'Self-assessment: general profile') },
    ]);
    const toc = ui.toc([
      { id: 'current', label: X('Қолданыстағы лицензия', 'Действующая лицензия', 'Current licence') },
      { id: 'scope', label: X('Лицензия нені қамтиды', 'Что охватывает лицензия', 'What the licence covers') },
      { id: 'previous', label: X('2022 жылғы лицензия мен қосымша', 'Лицензия и приложение 2022 года', '2022 licence and appendix') },
      { id: 'registration', label: X('Мемлекеттік тіркеу', 'Государственная регистрация', 'State registration') },
      { id: 'verify', label: X('Қалай тексеруге болады', 'Как проверить', 'How to verify') },
      { id: 'law', label: X('Аттестаттау талаптары', 'Требования аттестации', 'Attestation requirements') },
    ]);
    const intro = ui.split({
      ratio: '2:1', align: 'start', cls: 'ab-intro',
      left: `${ui.eyebrow(X('Рұқсат беру құжаттары', 'Разрешительные документы', 'Permits'))}
<p class="lead">${L(X(
        `«Keremet-City» ЖШС білім беру қызметін ${L(S.licensorShort)} берген мерзімсіз лицензия негізінде жүзеге асырады. Төменде құжаттардың фотокөшірмелері және әр құжаттың мәтіндік нұсқасы берілген.`,
        `ТОО «Keremet-City» ведёт образовательную деятельность на основании бессрочной лицензии, выданной Департаментом по обеспечению качества в сфере образования г. Шымкент. Ниже — фотокопии документов и текстовая версия каждого из них.`,
        `Keremet-City LLP operates under an unlimited licence issued by the Shymkent Department for Quality Assurance in Education. Below are photos of the documents and a text version of each.`))}</p>`,
      right: toc,
    });

    const pdfPending = ui.callout({
      type: 'info', icon: 'doc',
      title: X('Құжаттардың электрондық нұсқалары (PDF) жүктеледі', 'Будут загружены электронные версии документов (PDF)', 'Electronic versions (PDF) of the documents will be uploaded'),
      text: X(
        'Қазір сайтта басып шығарылған құжаттардың телефонмен түсірілген фотолары орналастырылған. № 114-НҚ бұйрыққа сәйкес құрылтай құжаттары PDF форматында жарияланады: мұнда elicense.kz порталынан алынған лицензиялардың қосымшаларымен бірге электрондық құжаттары (PDF) және egov.kz порталынан алынған мемлекеттік тіркеу туралы анықтама (PDF) орналастырылады.',
        'Сейчас на сайте размещены фотографии распечатанных документов, сделанные на телефон. По приказу № 114-НҚ учредительные документы публикуются в формате PDF: здесь будут размещены электронные документы лицензий с приложениями (PDF) с портала elicense.kz и справка о государственной регистрации (PDF) с портала egov.kz.',
        'The site currently shows phone photos of printed copies. Under Order No. 114-NK founding documents are published as PDF: the electronic licences with their appendices (PDF) from elicense.kz and the registration certificate (PDF) from egov.kz will be posted here.'),
    });
    // Collapse the text versions on phones (they stay open on larger screens and without JS).
    const collapse = `<script>if(matchMedia('(max-width: 639px)').matches)document.querySelectorAll('details.ab-tv').forEach(function(d){d.open=false});</script>`;

    return [
      intro,
      bento,
      pdfPending,
      ui.section({ id: 'current', eyebrow: X('Негізгі құжат', 'Основной документ', 'Main document'), title: X('Қолданыстағы лицензия', 'Действующая лицензия', 'Current licence'), body: current + appendixPending }),
      ui.section({ id: 'scope', tone: 'hero', eyebrow: X('Лицензия мәтіні бойынша', 'По тексту лицензии', 'As worded in the licence'), title: X('Лицензия нені қамтиды', 'Что охватывает лицензия', 'What the licence covers'), lead: X('Қызмет түрі: білім беру қызметі. Лицензияда аталған деңгейлер мен қызметтер:', 'Вид деятельности: образовательная деятельность. Уровни и услуги, перечисленные в лицензии:', 'Activity: education. Levels and services listed in the licence:'), body: covers + coversNote }),
      ui.section({ id: 'previous', eyebrow: X('Лицензия тарихы', 'История лицензии', 'Licence history'), title: X('2022 жылғы лицензия мен № 001 қосымша', 'Лицензия 2022 года и приложение № 001', 'The 2022 licence and appendix 001'), body: previous }),
      ui.section({ id: 'registration', eyebrow: X('Құрылтай құжаттары', 'Учредительные документы', 'Founding documents'), title: X('Мемлекеттік тіркеу', 'Государственная регистрация', 'State registration'), body: registration }),
      ui.section({ id: 'verify', eyebrow: X('Ашықтық', 'Прозрачность', 'Transparency'), title: X('Лицензияны қалай тексеруге болады', 'Как проверить лицензию', 'How to verify the licence'), body: verify }),
      ui.section({ id: 'law', tone: 'tint', eyebrow: X('Заң не талап етеді', 'Что требует закон', 'What the law requires'), title: X('Аттестаттау талаптары', 'Требования аттестации', 'Attestation requirements'), body: legal }),
      ui.section({ title: X('Осы бөлімде', 'В этом разделе', 'In this section'), body: related }),
      collapse,
    ].join('\n');
  },
};
