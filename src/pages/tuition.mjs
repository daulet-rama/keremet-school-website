// Tuition & contract — ORDER-114 item 41: standard contract (MES order No. 93 of 28.01.2016, V1600013227,
// Appendix 2 "Типовой договор оказания образовательных услуг организаций среднего образования", as amended
// 30.04.2025) and tuition information. "Free tuition in Kazakh and Russian" is the school's own statement in
// its admission post of 12.08.2025 (S.freeTuition.confirmed = false) — shown as such, never as a guarantee.
export default {
  slug: 'tuition',
  group: 'admission',
  order: 40,
  styles: ['staff-admission'],
  title: { kz: 'Оқу ақысы және шарт', ru: 'Оплата обучения и договор', en: 'Tuition and contract' },
  description: {
    kz: 'Оқу ақысы туралы ақпарат және білім беру қызметтерін көрсетудің үлгілік шарты (ҚР БҒМ 28.01.2016 № 93 бұйрығы).',
    ru: 'Информация об оплате обучения и типовой договор оказания образовательных услуг (приказ МОН РК от 28.01.2016 № 93).',
    en: 'Tuition information and the standard contract for educational services (Order No. 93 of the Ministry of Education and Science, 28.01.2016).',
  },
  lead: {
    kz: 'Мектепке қабылдаған кезде ата-анамен білім беру қызметтерін көрсету туралы шарт жасалады. Мұнда шарттың құрылымы мен оқу ақысы туралы мәлімет берілген.',
    ru: 'При приёме в школу с родителями заключается договор об оказании образовательных услуг. Здесь — его структура и сведения об оплате.',
    en: 'When a child is admitted, the school signs a contract for educational services with the parents. Here is how it is structured and what we know about fees.',
  },
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, { ui, S, L, t, href, docById }) {
    const X = (kz, ru, en) => ({ kz, ru, en });
    const adl = (code) => `https://adilet.zan.kz/${lang === 'kz' ? 'kaz' : 'rus'}/docs/${code}`;
    const O93 = adl('V1600013227');
    const R564 = adl('V1800017553');
    const POST = S.freeTuition.source;
    const phone = S.contacts.phone;

    // ------------------------------------------------------------------ announcement
    const announce = ui.split({ ratio: '3:2', align: 'center', cls: 'sa-split',
      left: `${ui.lead(X(
        'Мектептің 2025 жылғы 12 тамыздағы қабылдау туралы хабарландыруында бастауыш сыныптарда <strong>қазақ және орыс тілдерінде тегін оқыту</strong> туралы айтылған.',
        'В объявлении школы о приёме от 12 августа 2025 года говорится о <strong>бесплатном обучении на казахском и русском языках</strong> в начальных классах.',
        'The school’s admission announcement of 12 August 2025 mentions <strong>free tuition in Kazakh and Russian</strong> in the primary grades.',
      ))}
${ui.callout({ type: 'warn', title: X('Шарттарын мектептен нақтылаңыз', 'Условия уточняйте в школе', 'Please confirm the terms with the school'), text: `<p>${L(X('Бұл — мектептің өз хабарландыруындағы мәлімет; нақты шарттар шартта көрсетіледі.', 'Это сведения из объявления самой школы; точные условия фиксируются в договоре.', 'This comes from the school’s own announcement; the exact terms are set in the contract.'))}</p>${ui.more({ body: X(
        `Бұл — мектептің өз хабарландыруындағы мәлімет. Тегін оқытудың негізі мен шарттары, сондай-ақ қосымша ақылы қызметтер (бар болса) шартта көрсетіледі. Сұрақтар бойынша: <a href="tel:${phone.tel}">${phone.display}</a>.`,
        `Это сведения из объявления самой школы. Основание и условия бесплатного обучения, а также дополнительные платные услуги (если они есть) фиксируются в договоре. По вопросам: <a href="tel:${phone.tel}">${phone.display}</a>.`,
        `This is taken from the school’s own announcement. The basis and terms of free tuition, and any additional paid services, are set out in the contract. Questions: <a href="tel:${phone.tel}">${phone.display}</a>.`,
      ) })}` })}
${ui.note(X(`Дереккөз: ${ui.extLink(POST, 'мектептің хабарландыруы, 12.08.2025')}.`, `Источник: ${ui.extLink(POST, 'объявление школы от 12.08.2025')}.`, `Source: ${ui.extLink(POST, 'school announcement, 12.08.2025')}.`))}`,
      right: ui.panel({ theme: 'geography', cls: 'sa-idcard', body: `${ui.shanyrakArt()}<div class="sa-idcard__main"><p class="sa-idcard__eyebrow">${L(X('Хабарландырудан', 'Из объявления', 'From the announcement'))} · 12.08.2025</p>
<p class="sa-idcard__big sa-idcard__big--word">${L(X('Тегін', 'Бесплатно', 'Free'))}</p>
<p class="sa-idcard__txt">${L(X('қазақ және орыс тілдерінде оқыту', 'обучение на казахском и русском', 'tuition in Kazakh and Russian'))} ${ui.badge(t('unconfirmed'), 'warn')}</p></div>` }),
    });

    // ------------------------------------------------------------------ fees table (ORDER-114 items 41, 109)
    // Rendered from S.tuition: [{ service, terms, price, basis }] (each value a string or {kz,ru,en}); also accepts
    // { year, items: [...] }. While it is null, only what the school itself has announced is shown, plus the pending block.
    const tuitionRows = Array.isArray(S.tuition) ? S.tuition : (S.tuition && Array.isArray(S.tuition.items) ? S.tuition.items : null);
    const tuitionYear = (S.tuition && !Array.isArray(S.tuition) && S.tuition.year) || '2026–2027';
    const cellOf = (v) => (v == null || v === '' ? '—' : typeof v === 'number' ? String(v) : v);
    const fees = tuitionRows && tuitionRows.length
      ? ui.table({
        caption: X(`Қызметтер және олардың құны, ${tuitionYear} оқу жылы`, `Услуги и их стоимость, ${tuitionYear} учебный год`, `Services and fees, school year ${tuitionYear}`),
        head: [X('Қызмет', 'Услуга', 'Service'), X('Шарты', 'Условия', 'Terms'), X('Құны', 'Стоимость', 'Fee'), X('Негізі', 'Основание', 'Basis')],
        rows: tuitionRows.map((r) => [cellOf(r.service), cellOf(r.terms), cellOf(r.price), cellOf(r.basis)]),
      })
      : ui.table({
        caption: X('Мектеп хабарлаған мәліметтер', 'Что сообщила школа', 'What the school has announced'),
        head: [X('Қызмет', 'Услуга', 'Service'), X('Мектептің мәлімдемесі', 'Заявление школы', 'School’s statement')],
        rows: [
          [X('Негізгі білім беру бағдарламасы бойынша оқыту', 'Обучение по основной общеобразовательной программе', 'Teaching under the general education programme'), X('хабарландыру бойынша — тегін (12.08.2025)', 'по объявлению — бесплатно (12.08.2025)', 'per the announcement — free (12.08.2025)')],
          [X('Үйірмелер', 'Кружки', 'Clubs'), X('мектеп парақшасы бойынша — тегін', 'по профилю школы — бесплатно', 'per the school profile — free')],
        ],
      });
    const feesPending = tuitionRows && tuitionRows.length ? '' : ui.pending({
      title: X('Құны мен шарттары толықтырылуда', 'Стоимость и условия уточняются', 'Fees and terms are being confirmed'),
      note: X(
        'Мектеп бекіткен қызметтер тізімі, тарифтер мен шарттар (бар болса) және тегін оқытудың негізі бекітілгеннен кейін осында кесте түрінде жарияланады.',
        'Утверждённый школой перечень услуг, тарифы и условия (если есть) и основание бесплатного обучения будут опубликованы здесь таблицей после утверждения.',
        'The school’s approved list of services, fees and terms (if any), and the basis of free tuition, will be published here as a table once approved.',
      ),
    });

    // ------------------------------------------------------------------ contract anatomy (order 93, appendix 2)
    const secs = [
      [X('Шарттың мәні', 'Предмет договора', 'Subject of the contract'), X('білім беру ұйымы мен ата-ана (заңды өкіл) арасындағы қарым-қатынасты, тараптардың құқықтары мен міндеттерін реттейді', 'регулирует взаимоотношения между организацией образования и родителем (законным представителем), права и обязанности сторон', 'governs the relationship between the school and the parent (legal representative) and each side’s rights and duties')],
      [X('Білім беру ұйымының құқықтары мен міндеттері', 'Права и обязанности организации образования', 'Rights and duties of the school'), X('жарғымен және лицензиямен таныстыру, заң талаптарына сай білім беру, санитариялық талаптарды сақтау, мектеп аумағында баланың өмірі мен денсаулығына жауап беру', 'ознакомить с уставом и лицензией, обеспечить обучение по требованиям закона, соблюдать санитарные требования, отвечать за жизнь и здоровье ребёнка на территории школы', 'show the charter and licence, teach to legal standards, meet sanitary rules, be responsible for the child’s life and health on school grounds')],
      [X('Ата-ананың құқықтары мен міндеттері', 'Права и обязанности родителя', 'Rights and duties of the parent'), X('баланы оқыту мен тәрбиелеу мәселелері бойынша мектеппен өзара әрекеттесу; мектеп жарғысы мен шартты сақтау, ата-аналар жиналыстарына қатысу, педагогтер мен қызметкерлерді құрметтеу', 'взаимодействовать со школой по вопросам обучения и воспитания ребёнка; соблюдать устав школы и договор, посещать родительские собрания, уважать педагогов и сотрудников', 'work with the school on the child’s learning and upbringing; follow the school charter and the contract, attend parent meetings, respect teachers and staff')],
      [X('Тараптардың жауапкершілігі', 'Ответственность сторон', 'Liability'), X('міндеттемелерді орындамағаны үшін — Қазақстан Республикасының заңнамасына сәйкес', 'за неисполнение обязательств — по законодательству Республики Казахстан', 'for failing to meet obligations — under the law of Kazakhstan')],
      [X('Дауларды шешу', 'Разрешение споров', 'Dispute resolution'), X('тараптар арасында тікелей, келісімге келмесе — заңнамада белгіленген тәртіппен', 'непосредственно между сторонами, при недостижении согласия — в порядке, установленном законодательством', 'directly between the parties, otherwise as provided by law')],
      [X('Еңсерілмейтін күш жағдайлары', 'Форс-мажор', 'Force majeure'), X('тараптардың еркінен тыс мән-жайлар', 'обстоятельства, не зависящие от воли сторон', 'circumstances beyond the parties’ control')],
      [X('Шарттың мерзімі, өзгертілуі және бұзылуы', 'Срок, изменение и расторжение договора', 'Term, amendment and termination'), X('қол қойылған күннен бастап толық орындалғанға дейін қолданылады; шарт мектеп басшысының тиісті бұйрығымен тоқтатылады', 'вступает в силу со дня подписания и действует до полного исполнения; прекращается соответствующим приказом руководителя школы', 'in force from signature until fully performed; ends with the corresponding order of the head of school')],
    ];
    const anatomy = `<ol class="sa-contract sa-contract--short">${secs.map(([h]) => `<li><b>${L(h)}</b></li>`).join('')}</ol>`;
    const anatomyFull = `<ol class="sa-contract">${secs.map(([h, d]) => `<li><b>${L(h)}</b><span>${L(d)}</span></li>`).join('')}</ol>`;
    const anatomyNote = `<div class="dz-row">${ui.more({ label: X('Әр бөлімде не жазылған', 'Что сказано в каждом разделе', 'What each section says'), icon: 'doc', count: secs.length, tone: 'plain', body: anatomyFull })}${ui.legal([
      { href: O93, title: X('Орта білім беру ұйымдарының білім беру қызметтерін көрсетуінің үлгілік шарты (ҚР БҒМ бұйрығы, 2-қосымша)', 'Типовой договор оказания образовательных услуг организаций среднего образования (приказ МОН РК, приложение 2)', 'Standard contract for educational services of secondary schools (MES order, Appendix 2)'), number: '93', date: '2016-01-28', note: X('30.04.2025 редакциясы', 'ред. от 30.04.2025', 'as amended 30.04.2025') },
      { href: R564, title: X('Қабылдаудың үлгілік қағидалары', 'Типовые правила приёма', 'Standard Admission Rules'), number: '564', date: '2018-10-12', note: X('5-тармақ — қабылдау кезінде шарт жасалады', 'п. 5 — договор заключается при приёме', 'para. 5 — the contract is signed on admission') },
    ], { note: X(
      `Құрылымы ${ui.extLink(O93, 'ҚР Білім және ғылым министрінің 2016 жылғы 28 қаңтардағы № 93 бұйрығымен')} бекітілген «Орта білім беру ұйымдарының білім беру қызметтерін көрсетуінің үлгілік шарты» (2-қосымша, 30.04.2025 редакциясы) бойынша қысқаша берілген. Толық мәтіні — adilet.zan.kz сайтында.`,
      `Структура кратко изложена по «Типовому договору оказания образовательных услуг организаций среднего образования» (приложение 2 к ${ui.extLink(O93, 'приказу Министра образования и науки РК от 28 января 2016 года № 93')}, ред. от 30.04.2025). Полный текст — на adilet.zan.kz.`,
      `Summarised from the “Standard contract for educational services of secondary education organisations” (Appendix 2 to ${ui.extLink(O93, 'Order No. 93 of the Minister of Education and Science, 28 January 2016')}, as amended 30.04.2025). Full text on adilet.zan.kz.`,
    ) })}</div>`;

    const contractDocs = ui.docList([
      docById('contract-template') || { title: X('Білім беру қызметтерін көрсету туралы үлгілік шарт', 'Типовой договор об оказании образовательных услуг', 'Standard contract for educational services'), file: null },
      { title: X('№ 93 бұйрық — үлгілік шарт нысандары (adilet.zan.kz)', 'Приказ № 93 — формы типового договора (adilet.zan.kz)', 'Order No. 93 — standard contract forms (adilet.zan.kz)'), url: O93, date: '2016-01-28', number: '93' },
    ], { groupPending: true });

    const faq = ui.accordion([
      { q: X('Шартқа қашан қол қойылады?', 'Когда подписывается договор?', 'When is the contract signed?'), a: X(
        `<p>Оқуға қабылдаған кезде — ${ui.extLink(R564, 'Қабылдаудың үлгілік қағидаларының')} 5-тармағына сәйкес мектеп басшысы ата-анамен шарт жасасады.</p>`,
        `<p>При приёме на обучение — по п. 5 ${ui.extLink(R564, 'Типовых правил приёма')} руководитель школы заключает договор с родителями.</p>`,
        `<p>On admission — under para. 5 of the ${ui.extLink(R564, 'Standard Admission Rules')}, the head of the school signs a contract with the parents.</p>`) },
      { q: X('Шарттың көшірмесін алдын ала көруге бола ма?', 'Можно ли заранее посмотреть договор?', 'Can I see the contract in advance?'), a: X(
        `<p>Иә. Мектептің шарт үлгісі осы бетке жүктеледі; оған дейін мектептен сұраңыз: <a href="tel:${phone.tel}">${phone.display}</a>. Үлгілік нысанды adilet.zan.kz сайтынан көруге болады.</p>`,
        `<p>Да. Образец договора школы будет загружен на эту страницу; до этого запросите его в школе: <a href="tel:${phone.tel}">${phone.display}</a>. Типовую форму можно посмотреть на adilet.zan.kz.</p>`,
        `<p>Yes. The school’s contract template will be uploaded here; until then, ask the school: <a href="tel:${phone.tel}">${phone.display}</a>. The standard form is on adilet.zan.kz.</p>`) },
      { q: X('Шартты бұзуға бола ма?', 'Можно ли расторгнуть договор?', 'Can the contract be terminated?'), a: X(
        '<p>Иә, шартта көзделген тәртіппен. Үлгілік шартта оның өзгертілуі мен бұзылуына жеке бөлім арналған; шарт мектеп басшысының бұйрығымен тоқтатылады.</p>',
        '<p>Да, в порядке, предусмотренном договором. В типовом договоре этому посвящён отдельный раздел; договор прекращается приказом руководителя школы.</p>',
        '<p>Yes, as provided in the contract. The standard form has a separate section on this; the contract ends with an order of the head of school.</p>') },
    ]);

    return [
      ui.section({ id: 'tuition', eyebrow: X('Оқу ақысы', 'Оплата обучения', 'Tuition'), title: X('Оқу ақылы ма?', 'Обучение платное?', 'Is tuition paid?'), body: announce }),
      ui.section({ id: 'fees', eyebrow: X('2026–2027 оқу жылы', '2026–2027 учебный год', 'School year 2026–2027'), title: X('Қызметтер мен құны', 'Услуги и стоимость', 'Services and fees'), body: fees + feesPending }),
      ui.section({ id: 'contract', tone: 'geography', eyebrow: X('№ 93 бұйрық, 2-қосымша', 'Приказ № 93, приложение 2', 'Order No. 93, Appendix 2'), title: X('Үлгілік шарттың негізгі бөлімдері', 'Основные разделы типового договора', 'Main sections of the standard contract'), body: anatomy + anatomyNote }),
      ui.section({ id: 'docs', eyebrow: X('Құжаттар', 'Документы', 'Documents'), title: X('Шарт үлгісі', 'Образец договора', 'Contract template'), body: contractDocs }),
      ui.section({ id: 'faq', title: X('Жиі қойылатын сұрақтар', 'Частые вопросы', 'Frequently asked questions'), body: faq }),
      ui.section({ title: X('Байланысты беттер', 'Связанные страницы', 'Related pages'), body: ui.cards([
        { icon: 'compass', href: href('admission'), title: X('Қабылдау қағидалары', 'Правила приёма', 'Admission rules'), text: X('Құжаттар, мерзімдер, egov.kz', 'Документы, сроки, egov.kz', 'Documents, deadlines, egov.kz') },
        { icon: 'coins', href: href('finance'), title: X('Қаржылық есептер', 'Финансовые отчёты', 'Financial reports'), text: X('Қайырымдылық көмек туралы есеп', 'Отчёт о благотворительной помощи', 'Charitable aid report') },
        { icon: 'shield', href: href('anticorruption'), title: X('Сыбайлас жемқорлыққа қарсы іс-қимыл', 'Противодействие коррупции', 'Anti-corruption'), text: X('Заңсыз алымдарға тыйым', 'Запрет незаконных поборов', 'No unlawful charges') },
      ], { cols: 3, cls: 'sa-cards' }) }),
    ].join('\n');
  },
};
