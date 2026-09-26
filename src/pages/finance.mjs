// Finance — financial and charity reports (ORDER-114 §P item 94).
// Facts: whether the school receives state budget funding is NOT confirmed (SCHOOL-FACTS "Gaps") → pending.
// Legal basis verified on adilet.zan.kz (24.09.2026): Law "On access to information" art. 16 p. 9 (budget recipients
// publish information on the use of budget funds); Model Rules No. 355, pp. 28–31 (charitable aid: voluntary,
// bank account for non-state organisations, spent only by Board decision, 4 purposes, annual report on the website).
import { ACTS, adiletUrl } from './legislation.mjs';
import { registryOf } from './documents.mjs';

const X = (kz, ru, en) => ({ kz, ru, en });
const act = (id) => ACTS.find((a) => a.id === id);

export default {
  slug: 'finance',
  group: 'documents',
  order: 30,
  title: { kz: 'Қаржылық есептер', ru: 'Финансовые отчёты', en: 'Financial reports' },
  description: {
    kz: 'Бюджет қаражаты мен қайырымдылық көмекті пайдалану туралы есептер, қайырымдылық көмекті қабылдау және жұмсау тәртібі.',
    ru: 'Отчёты об использовании бюджетных средств и благотворительной помощи, порядок её приёма и расходования.',
    en: 'Reports on the use of budget funds and charitable aid, and how charitable aid is received and spent.',
  },
  styles: ['documents'],
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, ctx) {
    const { ui, L, href, S, asset, fmt } = ctx;
    const R = registryOf(ctx); // reports below are registry entries (shown on «Ішкі құжаттар» too)
    const info = act('info');
    const board = act('board');

    // ------------------------------------------------------------ intro + status board
    const status = (icon, title, state, kind, text) => `<li class="dx-status dx-status--${kind}"><span class="dx-status__icon">${ui.icon(icon, { size: 22 })}</span><div><p class="dx-status__title">${L(title)}</p><p class="dx-status__state">${ui.badge(state, kind === 'ok' ? 'ok' : kind === 'info' ? 'info' : 'warn')}</p><p class="dx-status__text">${L(text)}</p></div></li>`;
    const board3 = `<ul class="dx-statuses" role="list">
${status('building', X('Бюджет қаражаты', 'Бюджетные средства', 'Budget funds'), X('нақтылануда', 'уточняется', 'being confirmed'), 'warn', X('Мектептің мемлекеттік білім беру тапсырысы бойынша қаржыландырылуы нақтылануда.', 'Уточняется, финансируется ли школа по государственному образовательному заказу.', 'Whether the school is funded through the state education order is being confirmed.'))}
${status('heart', X('Қайырымдылық көмек', 'Благотворительная помощь', 'Charitable aid'), X('есеп жүктеледі', 'отчёт будет загружен', 'report to be uploaded'), 'warn', X('Қаржы жылының қорытындысы бойынша жыл сайынғы есеп.', 'Ежегодный отчёт по итогам финансового года.', 'Annual report after each financial year.'))}
${status('coins', X('Оқу ақысы', 'Оплата обучения', 'Tuition'), X('жеке бет', 'отдельная страница', 'separate page'), 'info', X(`Шарт талаптары мен оқу ақысы туралы — <a href="${href('tuition')}">«Оқу ақысы»</a> бетінде.`, `Условия договора и оплата обучения — на странице <a href="${href('tuition')}">«Оплата обучения»</a>.`, `Contract terms and fees are on the <a href="${href('tuition')}">Tuition</a> page.`))}
</ul>`;
    const intro = ui.split({
      ratio: '1:1', align: 'center',
      left: `${ui.eyebrow(X('Қаржылық ашықтық', 'Финансовая открытость', 'Financial transparency'))}
<h2 class="sec__title">${L(X('Қаражат қайдан келеді және қалай жұмсалады', 'Откуда средства и как они расходуются', 'Where the money comes from and how it is spent'))}</h2>
${ui.tldr({ points: [
        { icon: 'doc', text: X('Бюджет қаражатын (егер ол бөлінсе) және қайырымдылық көмекті пайдалану туралы есептер.', 'Отчёты об использовании бюджетных средств (если они выделяются) и благотворительной помощи.', 'Reports on the use of budget funds (if any are allocated) and of charitable aid.') },
        { icon: 'calendar', text: X('Қаржы жылы аяқталғаннан кейін жүктеледі және <strong>кемінде 3 жыл</strong> сақталады.', 'Загружаются по итогам финансового года и хранятся <strong>не менее 3 лет</strong>.', 'Uploaded after each financial year and kept for <strong>at least 3 years</strong>.') },
      ] })}`,
      right: board3,
    });

    // ------------------------------------------------------------ funding source: one plain sentence + details / legal basis / pending
    const funding = `<div class="flow">${ui.lead(X(
        `«Керемет» — жеке меншік білім беру ұйымы (${L(S.legal.name)}). Бюджет қаражатын алатыны-алмайтыны нақтылануда.`,
        `«Керемет» — частная организация образования (${L(S.legal.name)}). Получает ли школа бюджетные средства — уточняется.`,
        `Keremet is a private educational organisation (${L(S.legal.name)}). Whether it receives budget funds is being confirmed.`))}
<div class="dz-row">${ui.more({ icon: 'info', tone: 'card', body: X(
        '<p>Мектептің 12.08.2025 жарияланған қабылдау хабарландыруында қазақ және орыс тілдерінде тегін оқыту туралы айтылған; оның негізі (мемлекеттік білім беру тапсырысы немесе өзге көз) нақтылануда.</p>',
        '<p>В объявлении о приёме от 12.08.2025 школа сообщала о бесплатном обучении на казахском и русском языках; основание (государственный образовательный заказ или иной источник) уточняется.</p>',
        '<p>Its admission announcement of 12.08.2025 mentioned free tuition in Kazakh and Russian; the basis for this (state education order or another source) is being confirmed.</p>') })}${ui.legal([
        { href: adiletUrl(info, lang), title: X('«Ақпаратқа қол жеткізу туралы» Заң — adilet.zan.kz', 'Закон «О доступе к информации» — adilet.zan.kz', 'Law “On Access to Information” — adilet.zan.kz'), number: info.number, date: info.date, note: X('16-бап, 9-тармақ', 'ст. 16, п. 9', 'Art. 16(9)') },
      ], { note: X(
        '<p>«Ақпаратқа қол жеткізу туралы» Заңның 16-бабының 9-тармағына сәйкес бюджет қаражатын алушылар өз интернет-ресурстарында республикалық және жергілікті бюджеттерден бөлінген қаражаттың пайдаланылуы туралы ақпаратты орналастырады.</p>',
        '<p>Согласно пункту 9 статьи 16 Закона «О доступе к информации» получатели бюджетных средств размещают на своих интернет-ресурсах информацию об использовании средств, выделенных из республиканского и местных бюджетов.</p>',
        '<p>Under Article 16(9) of the Law “On Access to Information”, recipients of budget funds publish information on their websites about the use of funds allocated from the national and local budgets.</p>') })}</div>
${ui.pendingGroup(lang, [
        { title: X('Бюджеттік қаржыландыру туралы мәлімдеме', 'Заявление о бюджетном финансировании', 'Statement on budget funding'), note: X(
          'Мектеп әкімшілігі мына екі мәлімдеменің бірін жариялайды: «Мектеп мемлекеттік білім беру тапсырысы бойынша бюджет қаражатын алады» (қаржыландыру көлемі мен кезеңі көрсетіліп, пайдалану туралы есеп қоса беріледі) немесе «Мектеп бюджет қаражатын алмайды».',
          'Администрация школы опубликует одно из двух заявлений: «Школа получает бюджетные средства по государственному образовательному заказу» (с указанием объёма, периода и отчётом об использовании) или «Школа не получает бюджетных средств».',
          'The school will publish one of two statements: “The school receives budget funds under the state education order” (with the amount, period and a report on their use), or “The school does not receive budget funds”.') },
        ...[R.byId('budget-statement')].filter(Boolean).map((d) => ({ title: X(`${d.title.kz} (PDF)`, `${d.title.ru} (PDF)`, `${d.title.en} (PDF)`), note: X('Құжат жүктеледі', 'Документ будет загружен', 'Document will be uploaded') })),
      ], { title: X('Бюджеттік қаржыландыру туралы мәлімдеме дайындалуда', 'Заявление о бюджетном финансировании готовится', 'The statement on budget funding is being prepared') })}</div>`;

    // ------------------------------------------------------------ reports: a year × report matrix (layer 1) + the document list (layer 2)
    const yearsFin = ['2025', '2024', '2023'];
    const TYPES = [
      { icon: 'heart', label: X('Қайырымдылық көмек', 'Благотворительная помощь', 'Charitable aid'), id: (y) => (y === '2025' ? 'charity-report' : `charity-report-${y}`) },
      { icon: 'building', label: X('Бюджет қаражаты', 'Бюджетные средства', 'Budget funds'), id: (y) => `budget-report-${y}` },
      { icon: 'handshake', label: X('Қамқоршылық кеңестің есебі', 'Отчёт попечительского совета', 'Board of Trustees report'), id: (y) => `board-report-${y}` },
    ];
    const yearReports = (y) => TYPES.map((tp) => R.byId(tp.id(y))).filter(Boolean);
    const cell = (d, y) => {
      if (!d) return `<td class="dx-mx__c" data-y="${y}">—</td>`;
      if (d.file || d.url) return `<td class="dx-mx__c" data-y="${y}"><a class="dx-mx__ok" href="${ui.esc(d.file ? asset(d.file) : d.url)}">${ui.icon('download', { size: 16 })}<span>${d.date ? fmt.date(d.date) : 'PDF'}</span><span class="sr-only">: ${ui.esc(L(d.title).replace(/<[^>]*>/g, ''))}</span></a></td>`;
      return `<td class="dx-mx__c" data-y="${y}"><span class="dx-mx__wait">${ui.icon('hourglass', { size: 15 })}<span>${L(X('күтілуде', 'ожидается', 'pending'))}</span></span></td>`;
    };
    const matrix = `<div class="dx-mx-wrap" data-scroll-x data-stack="off"><table class="dx-mx"><caption class="sr-only">${L(X('Қаржы жылдары бойынша есептердің мәртебесі', 'Статус отчётов по финансовым годам', 'Report status by financial year'))}</caption><thead><tr><th scope="col"><span class="sr-only">${L(X('Есеп', 'Отчёт', 'Report'))}</span></th>${yearsFin.map((y) => `<th scope="col">${y}</th>`).join('')}</tr></thead><tbody>${TYPES.map((tp) => `<tr><th scope="row"><span class="dx-mx__ic" aria-hidden="true">${ui.icon(tp.icon, { size: 18 })}</span><span>${L(tp.label)}</span></th>${yearsFin.map((y) => cell(R.byId(tp.id(y)), y)).join('')}</tr>`).join('')}</tbody></table></div>`;
    const allReports = yearsFin.flatMap(yearReports);
    const reportList = ui.more({
      label: X('Есептердің толық атаулары (қаржы жылдары бойынша)', 'Полные названия отчётов (по финансовым годам)', 'Full report titles (by financial year)'), icon: 'doc', count: allReports.length, tone: 'card',
      body: yearsFin.map((y) => `<h3 class="dx-subh dx-subh--s">${L(X(`${y} қаржы жылы`, `${y} финансовый год`, `Financial year ${y}`))}</h3>${ui.docList(yearReports(y))}`).join(''),
    });

    // ------------------------------------------------------------ charity rules (No. 355, pp. 28–31)
    const charitySteps = ui.steps([
      { title: X('Тек ерікті және өтеусіз', 'Только добровольно и безвозмездно', 'Voluntary and free of charge only'), text: X('Қайырымдылық көмек ерікті түрде, өтеусіз негізде көрсетіледі (28-тармақ).', 'Благотворительная помощь оказывается в добровольном порядке на безвозмездной основе (п. 28).', 'Charitable aid is given voluntarily and free of charge (p. 28).') },
      { title: X('Банк шотына', 'На банковский счёт', 'To a bank account'), text: X('Мемлекеттік мекеме болып табылмайтын білім беру ұйымында түскен қаражат екінші деңгейдегі банктегі шотқа есептеледі (29-тармақ).', 'В организации образования, не являющейся государственным учреждением, поступления зачисляются на счёт в банке второго уровня (п. 29).', 'In an organisation that is not a state institution, donations are credited to an account in a commercial (second-tier) bank (p. 29).') },
      { title: X('Қамқоршылық кеңестің шешімімен', 'По решению попечительского совета', 'By decision of the Board of Trustees'), text: X('Көмек тек Қамқоршылық кеңестің шешімі бойынша жұмсалады (28-тармақ).', 'Помощь расходуется исключительно по решению попечительского совета (п. 28).', 'Aid is spent only by decision of the Board of Trustees (p. 28).') },
      { title: X('Жыл сайынғы есеп сайтта', 'Ежегодный отчёт на сайте', 'Annual report on the website'), text: X('Қаржы жылының қорытындысы бойынша ұйым ата-ана қауымдастығын сайттағы есеп арқылы хабардар етеді (31-тармақ).', 'По итогам финансового года организация информирует родительскую общественность, размещая отчёт на сайте (п. 31).', 'After each financial year the organisation informs parents by publishing a report on its website (p. 31).') },
    ]);
    // Layer 1: the four rules as short tiles + the four purposes; layer 2: the rules with their paragraph numbers.
    const RULES = [
      { icon: 'heart', t: X('Тек ерікті және өтеусіз', 'Только добровольно и безвозмездно', 'Voluntary and free of charge only') },
      { icon: 'coins', t: X('Банк шотына', 'На банковский счёт', 'To a bank account') },
      { icon: 'handshake', t: X('Қамқоршылық кеңестің шешімімен', 'По решению попечительского совета', 'By decision of the Board of Trustees') },
      { icon: 'doc', t: X('Жыл сайынғы есеп сайтта', 'Ежегодный отчёт на сайте', 'Annual report on the website') },
    ];
    const rulesTiles = `<ul class="dx-tiles" role="list">${RULES.map((r) => `<li class="dx-tile dx-tile--dark"><span class="dx-tile__ic" aria-hidden="true">${ui.icon(r.icon, { size: 20 })}</span><span class="dx-tile__t">${L(r.t)}</span></li>`).join('')}</ul>`;
    const purposes = `<ol class="dx-purposes" role="list">${[
      { icon: 'users', title: X('Білім алушыларды әлеуметтік қолдау', 'Социальная поддержка обучающихся', 'Social support for pupils') },
      { icon: 'building', title: X('Материалдық-техникалық базаны жетілдіру', 'Совершенствование материально-технической базы', 'Improving facilities and equipment') },
      { icon: 'star', title: X('Дарынды балаларды қолдау', 'Поддержка одарённых детей', 'Supporting gifted children') },
      { icon: 'sparkles', title: X('Дамытушы орта ұйымдастыру', 'Организация развивающей среды', 'A stimulating learning environment') },
    ].map((p, i) => `<li class="dx-purpose"><span class="dx-purpose__icon">${ui.icon(p.icon, { size: 20 })}</span><span class="dx-purpose__n" aria-hidden="true">${i + 1}</span><span class="dx-purpose__t">${L(p.title)}</span></li>`).join('')}</ol>`;
    const charity = `${rulesTiles}<h3 class="dx-subh">${L(X('Көмек жұмсалатын мақсаттар', 'На что расходуется помощь', 'What the aid may be spent on'))}</h3>${purposes}
<div class="dz-row dx-row-gap">${ui.more({ label: X('Ережелер толығырақ', 'Правила подробнее', 'The rules in detail'), icon: 'book', count: 4, tone: 'card', body: charitySteps })}${ui.legal([
      { href: adiletUrl(board, lang), title: X('Қамқоршылық кеңестің жұмысын ұйымдастырудың үлгілік қағидалары (№ 355 бұйрық)', 'Типовые правила организации работы попечительского совета (приказ № 355)', 'Model Rules on the Board of Trustees (Order No. 355)'), number: board.number, date: board.date, note: X('28–31-тармақтар; көмек жұмсалатын мақсаттар — 30-тармақ', 'пп. 28–31; цели расходования помощи — п. 30', 'pp. 28–31; purposes of the aid — p. 30') },
    ], { note: X('Дереккөз: Қамқоршылық кеңестің жұмысын ұйымдастырудың үлгілік қағидалары (№ 355 бұйрық), 28–31-тармақтар.', 'Источник: Типовые правила организации работы попечительского совета (приказ № 355), пп. 28–31.', 'Source: Model Rules on the Board of Trustees (Order No. 355), pp. 28–31.') })}</div>`;
    const noCash = ui.callout({
      type: 'warn', icon: 'shield',
      title: X('Мәжбүрлеп ақша жинауға жол берілмейді', 'Принудительные поборы недопустимы', 'Forced collections are not allowed'),
      text: X(
        `Қайырымдылық — тек ерікті. Егер сізден сыныпқа, жөндеуге, сыйлыққа және т.б. ақша талап етілсе, бұл туралы мектеп басшылығына немесе 1424 нөміріне хабарлаңыз. Толығырақ: <a href="${href('anticorruption')}">«Сыбайлас жемқорлыққа қарсы іс-қимыл»</a>.`,
        `Благотворительность — только добровольная. Если от вас требуют деньги «на класс», ремонт, подарки и т. п., сообщите руководству школы или по номеру 1424. Подробнее: <a href="${href('anticorruption')}">«Противодействие коррупции»</a>.`,
        `Donations are strictly voluntary. If you are asked to pay “for the class”, repairs, gifts and so on, tell the school’s management or call 1424. More: <a href="${href('anticorruption')}">Anti-corruption</a>.`,
      ),
    });

    const related = ui.linkList([
      { href: href('board'), icon: 'handshake', label: X('Қамқоршылық кеңес', 'Попечительский совет', 'Board of Trustees'), note: X('Құрамы, жоспары, шешімдері', 'Состав, план, решения', 'Members, plan, decisions') },
      { href: href('tuition'), icon: 'coins', label: X('Оқу ақысы', 'Оплата обучения', 'Tuition'), note: X('Шарт және төлем талаптары', 'Договор и условия оплаты', 'Contract and payment terms') },
      { href: href('anticorruption'), icon: 'scale', label: X('Сыбайлас жемқорлыққа қарсы іс-қимыл', 'Противодействие коррупции', 'Anti-corruption') },
      { href: href('documents'), icon: 'doc', label: X('Ішкі құжаттар', 'Внутренние документы', 'School documents') },
      { href: href('legislation'), icon: 'book', label: X('Нормативтік құқықтық актілер', 'Нормативные правовые акты', 'Legislation') },
    ]);

    return [
      intro,
      ui.section({ id: 'funding', eyebrow: X('Бюджет', 'Бюджет', 'Budget'), title: X('Қаржыландыру көздері', 'Источники финансирования', 'Funding sources'), body: funding }),
      ui.section({ id: 'reports', eyebrow: X('Есептілік', 'Отчётность', 'Reporting'), title: X('Қаржы жылдары бойынша есептер', 'Отчёты по финансовым годам', 'Reports by financial year'), lead: X('Есептер PDF форматында, қол қойылған және бекітілген күні көрсетілген түрде жарияланады.', 'Отчёты публикуются в PDF, подписанными, с датой утверждения.', 'Reports are published as signed PDFs showing their approval date.'), body: matrix + reportList }),
      ui.section({ id: 'charity', tone: 'tint', eyebrow: X('Үлгілік қағидалар № 355', 'Типовые правила № 355', 'Model Rules No. 355'), title: X('Қайырымдылық көмек қалай қабылданады және жұмсалады', 'Как принимается и расходуется благотворительная помощь', 'How charitable aid is received and spent'), body: charity + noCash }),
      ui.section({ title: X('Осы бөлімде', 'В этом разделе', 'In this section'), body: related }),
    ].join('\n');
  },
};
