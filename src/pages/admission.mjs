// Admission rules — THE key page for parents (ORDER-114 item 38).
// Legal basis read on 24.09.2026: Типовые правила приёма, приказ МОН РК от 12.10.2018 № 564 (V1800017553,
// ред. 03.03.2026) — пп. 5, 7, 8, 9, 10, 11, 16, 17, 20–22 and Appendix 1 (service standard).
// 2026 campaign: joint pilot order МП + МИИЦР (zakon.kz / inbusiness.kz, 18.05.2026: Shymkent 18.06–31.08.2026, order valid
// 26.05–31.12.2026, own pre-school pupils enrolled automatically on application); OQU platform (Kazinform, 26.05.2026).
// Leaving & graduation: Order 125 (V080005191_, pp. 8, 29, 36–39), Order 39 (V1500010348, document types), Order 263
// (V2300033330, app. 4 — personal file), 564 p. 21 & Appendix 2. TODO(school): click-test every egov/OQU link in a browser.
// Keremet-specific facts: only from S (school.mjs) and the admission post of 12.08.2025.
export default {
  slug: 'admission',
  group: 'admission',
  order: 10,
  styles: ['staff-admission'],
  title: { kz: 'Қабылдау қағидалары', ru: 'Правила приёма', en: 'Admission rules' },
  description: {
    kz: '«Керемет» мектебіне қабылдау: 1-сыныпқа жасы, құжаттар тізімі, мерзімдер, egov.kz арқылы және мектепте өтініш беру, басқа мектептен ауысу.',
    ru: 'Приём в школу «Керемет»: возраст для 1 класса, документы, сроки, подача через egov.kz и в школе, перевод из другой школы.',
    en: 'Admission to Keremet School: age for grade 1, documents, deadlines, applying via egov.kz or at school, and transfers from another school.',
  },
  lead: {
    kz: 'Балаңызды мектепке беру — үлкен қадам. Бұл бетте қабылдаудың үлгілік қағидалары бойынша бәрі бір жерде: жасы, құжаттар, мерзімдер, өтініш берудің екі жолы және ауысу тәртібі.',
    ru: 'Отдать ребёнка в школу — большой шаг. Здесь по Типовым правилам приёма собрано всё в одном месте: возраст, документы, сроки, два способа подать заявление и порядок перевода.',
    en: 'Starting school is a big step. This page gathers everything from the Standard Admission Rules in one place: age, documents, deadlines, two ways to apply and how transfers work.',
  },
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, { ui, S, L, t, href, docsByGroup, docById }) {
    const X = (kz, ru, en) => ({ kz, ru, en });
    const adl = (code) => `https://adilet.zan.kz/${lang === 'kz' ? 'kaz' : 'rus'}/docs/${code}`;
    const eg = (path) => `https://egov.kz/cms/${{ kz: 'kk', ru: 'ru', en: 'en' }[lang]}/services/${path}`;
    const R564 = adl('V1800017553');
    const EGOV_1 = eg('pass_mp_203');
    const EGOV_ANY = eg('secondary_school/mon-197-205');
    const EGOV_TR = eg('pass_30_17_mp');
    const POST = 'https://www.instagram.com/p/DNR-UIYM5uW/';
    const phone = S.contacts.phone;
    const addr = `${S.addresses.actual.postcode}, ${L(S.addresses.actual.text)}`;
    const p = (n) => L(X(`${n}-тармақ`, `п. ${n}`, `para. ${n}`));
    const rulesName = X('Қабылдаудың үлгілік қағидалары', 'Типовые правила приёма', 'Standard Admission Rules');
    const src = (txt) => `<span class="sa-src">${ui.icon('scale', { size: 14 })}<span>${L(txt)}</span></span>`;
    const OQU = 'https://oqu.edu.kz/';
    const O125 = adl('V080005191_');
    const O39 = adl('V1500010348');
    const O263 = adl('V2300033330');
    // timeline items nested under an h3 → render their titles as h4
    const tl4 = (items) => ui.timeline(items).replace(/<h3 class="timeline__title">/g, '<h4 class="timeline__title">').replace(/<\/h3>/g, '</h4>');

    // Progressive disclosure (SPEC §6.1): layer 1 = what a parent needs (age, documents, dates, where to apply) as
    // numbers, tiles and step titles; layer 2 = exact rules, step details, paragraph references, sources — collapsed.
    const row = (...items) => `<div class="dz-row">${items.filter(Boolean).join('')}</div>`;
    const R564_ITEM = (note) => ({ href: R564, title: X('Қабылдаудың үлгілік қағидалары (ҚР БҒМ бұйрығы)', 'Типовые правила приёма (приказ МОН РК)', 'Standard Admission Rules (MES order)'), number: '564', date: '2018-10-12', note });
    const titlesOnly = (items, cls = 'sa-mini') => ui.steps(items.map((s) => ({ title: s.title })), { cls });

    // ------------------------------------------------------------------ key numbers
    const keyStats = ui.stats([
      {
        icon: 'graduation', art: true, value: X('6 жас', '6 лет', 'Age 6'),
        label: X('1-сыныпқа қабылдау жасы', 'Возраст приёма в 1 класс', 'Age for grade 1'),
        note: X('Ағымдағы күнтізбелік жылы 6 жасқа толатын балалар да қабылданады.', 'И дети, которым 6 лет исполнится в текущем календарном году.', 'Also children who turn six during the current calendar year.'),
        extra: ui.chips([
          { icon: 'globe', label: 'egov.kz', href: '#apply' },
          { icon: 'school', label: X('Мектепте', 'В школе', 'At school'), href: '#apply' },
          { icon: 'languages', label: X('Қазақ / орыс', 'Казахский / русский', 'Kazakh / Russian') },
        ]),
      },
      { icon: 'calendar', value: '01.04–31.08', label: X('Құжат қабылдау кезеңі', 'Период приёма документов', 'Document window'), note: X('1-сыныпқа', 'в 1 класс', 'for grade 1') },
      { icon: 'hourglass', value: X('1 күн', '1 день', '1 day'), label: X('Жауап мерзімі', 'Срок ответа', 'Response time'), note: X('1 жұмыс күні ішінде хабарлама немесе қолхат', 'уведомление или расписка — в течение 1 рабочего дня', 'notification or receipt within 1 working day') },
      { icon: 'doc', value: '25.08', label: X('Қабылдау туралы бұйрық', 'Приказ о зачислении', 'Enrolment order'), note: X('1-сыныпқа — 25 тамыздан ерте емес', 'в 1 класс — не ранее 25 августа', 'for grade 1 — not before 25 August') },
      { icon: 'sun', value: '01.09', label: X('Оқу жылының басы', 'Начало учебного года', 'School year starts'), note: X('оқуға 1 қыркүйектен бастап қабылданады', 'зачисление — с 1 сентября', 'enrolment effective 1 September') },
    ], { cls: 'stats--bento sa-keystats' });

    // ------------------------------------------------------------------ Keremet specific (post 12.08.2025)
    const idcard = ui.panel({ theme: 'geography', cls: 'sa-idcard', body: `${ui.shanyrakArt()}<div class="sa-idcard__main"><p class="sa-idcard__eyebrow">${L(X('Қабылдау', 'Приём', 'Admission'))} · ${L(S.shortName)}</p>
<p class="sa-idcard__big">${S.grades.from}–${S.grades.to}</p>
<p class="sa-idcard__txt">${L(X('сыныптар — мектептің өз парақшасындағы мәлімет бойынша', 'классы — по данным страницы школы', 'grades — as stated on the school’s profile'))} ${ui.badge(t('unconfirmed'), 'warn')}</p></div>
<ul class="sa-idcard__list" role="list">
<li>${ui.icon('languages', { size: 18 })}<span>${L(X('Оқыту тілі: қазақ, орыс', 'Языки обучения: казахский, русский', 'Languages: Kazakh, Russian'))}</span></li>
<li>${ui.icon('pin', { size: 18 })}<span>${addr}</span></li>
<li>${ui.icon('phone', { size: 18 })}<a href="tel:${phone.tel}">${phone.display}</a></li>
<li>${ui.icon('whatsapp', { size: 18 })}${ui.extLink(`https://wa.me/${phone.whatsapp}`, 'WhatsApp')}</li>
</ul>` });
    const keremetMore = ui.more({ label: X('Хабарландыру және дереккөз', 'Объявление и источник', 'Announcement and source'), icon: 'info', body: `${ui.prose(X(
        '<p>«Керемет» — Шымкент қаласы Абай ауданындағы жеке меншік жалпы білім беретін мектеп. Мектептің 2025 жылғы 12 тамыздағы хабарландыруында бастауыш сыныптарға қазақ және орыс тілдерінде оқуға қабылдау жарияланған.</p>',
        '<p>«Керемет» — частная общеобразовательная школа в Абайском районе Шымкента. В объявлении школы от 12 августа 2025 года объявлен приём в начальные классы с обучением на казахском и русском языках.</p>',
        '<p>Keremet is a private general education school in the Abay district of Shymkent. The school’s announcement of 12 August 2025 opened admission to the primary grades with teaching in Kazakh and Russian.</p>',
      ))}
${ui.note(X(
        `Дереккөз: мектептің қабылдау туралы хабарландыруы, 12.08.2025 (${ui.extLink(POST, 'Instagram')}). Хабарландыруда қазақ және орыс тілдерінде тегін оқыту туралы да айтылған — нақты шарттарын мектептен сұраңыз (<a href="${href('tuition')}">Оқу ақысы және шарт</a>).`,
        `Источник: объявление школы о приёме от 12.08.2025 (${ui.extLink(POST, 'Instagram')}). В объявлении также говорится о бесплатном обучении на казахском и русском языках — точные условия уточняйте в школе (<a href="${href('tuition')}">Оплата и договор</a>).`,
        `Source: the school’s admission announcement of 12.08.2025 (${ui.extLink(POST, 'Instagram')}). It also mentions free tuition in Kazakh and Russian — please check the exact terms with the school (<a href="${href('tuition')}">Tuition & contract</a>).`,
      ))}` });
    const keremet = `${idcard}
<div class="sa-keremet">
<div><h3>${L(X('Хабарландырудағы бағдарламалар', 'Программы из объявления', 'Programmes in the announcement'))}</h3>
${ui.chips(S.programmes.map((pr) => ({ icon: pr.icon, label: pr.label })))}</div>
${keremetMore}
</div>`;

    // ------------------------------------------------------------------ who & when
    const whoFull = ui.prose(X(
      `<ul><li><strong>1-сынып:</strong> алты жастағы және ағымдағы күнтізбелік жылы алты жасқа толатын балалар (${p(8)}).</li><li><strong>Мектепті таңдау:</strong> ата-ана мектепті баланың қалауын, жеке бейімі мен ерекшеліктерін ескере отырып таңдайды (6-тармақ).</li><li><strong>Басқа сыныптар:</strong> сынып-жинақтарда бос орын болған жағдайда қабылданады.</li><li><strong>Шарт:</strong> оқуға қабылдаған кезде мектеп басшысы ата-анамен білім беру қызметтерін көрсету туралы шарт жасасады (${p(5)}).</li></ul>`,
      `<ul><li><strong>1 класс:</strong> дети шести лет и дети, которым в текущем календарном году исполняется шесть лет (${p(8)}).</li><li><strong>Выбор школы:</strong> родители выбирают школу с учётом желания, индивидуальных склонностей и особенностей ребёнка (п. 6).</li><li><strong>Другие классы:</strong> при наличии свободных мест в классах-комплектах.</li><li><strong>Договор:</strong> при приёме руководитель школы заключает с родителями договор об оказании образовательных услуг (${p(5)}).</li></ul>`,
      `<ul><li><strong>Grade 1:</strong> children aged six and children who turn six during the current calendar year (${p(8)}).</li><li><strong>Choice of school:</strong> parents choose a school taking into account the child’s wishes, abilities and needs (para. 6).</li><li><strong>Other grades:</strong> if there are free places in the classes.</li><li><strong>Contract:</strong> on admission the head of the school signs a contract for educational services with the parents (${p(5)}).</li></ul>`,
    ));
    const whoTile = (ic, title, text) => `<li class="sa-who__i"><span class="sa-who__ic" aria-hidden="true">${ui.icon(ic, { size: 22 })}</span><div><p class="sa-who__t">${L(title)}</p><p class="sa-who__x">${L(text)}</p></div></li>`;
    const whoWhen = ui.grid({ cols: 2, cls: 'sa-grid', items: [
      `<h3>${L(X('Кім қабылданады', 'Кого принимают', 'Who is admitted'))}</h3>
<ul class="sa-who" role="list">
${whoTile('graduation', X('1-сынып', '1 класс', 'Grade 1'), X('6 жастағы балалар', 'дети 6 лет', 'children aged 6'))}
${whoTile('users', X('Басқа сыныптар', 'Другие классы', 'Other grades'), X('бос орын болса', 'при свободных местах', 'if there are free places'))}
${whoTile('handshake', X('Шарт', 'Договор', 'Contract'), X('қабылдаған кезде жасалады', 'заключается при приёме', 'signed on admission'))}
</ul>
${ui.more({ body: whoFull })}`,
      `<h3>${L(X('Мерзімдер', 'Сроки', 'Deadlines'))}</h3>
${tl4([
        { date: X('1 сәуір', '1 апреля', '1 April'), title: X('1-сыныпқа құжат қабылдау басталады', 'Начало приёма документов в 1 класс', 'Grade 1 applications open') },
        { date: X('25 тамыздан ерте емес', 'не ранее 25 августа', 'from 25 August'), title: X('1-сыныпқа қабылдау туралы бұйрық', 'Приказ о зачислении в 1 класс', 'Grade 1 enrolment order') },
        { date: X('31 тамыз', '31 августа', '31 August'), title: X('Құжат қабылдау аяқталады', 'Окончание приёма документов', 'Applications close') },
        { date: X('1 қыркүйек', '1 сентября', '1 September'), title: X('Оқу жылы басталады', 'Начало учебного года', 'School year begins') },
      ])}`,
    ] });
    const ZAKON = 'https://www.zakon.kz/pravo/6518203-utverzhdeny-sroki-priema-dokumentov-dlya-zachisleniy-detey-v-pervyy-klass-po-regionam.html';
    const KAZINFORM = 'https://www.inform.kz/ru/noviy-poryadok-priema-v-perviy-klass-startuet-v-kazahstane-8792a0c3';
    const campaignFull = X(
      `<p>2026 жылы Оқу-ағарту министрі мен Жасанды интеллект және цифрлық даму министрінің бірлескен бұйрығымен 1-сыныпқа қабылдаудың пилоттық жобасы өткізілді: өтініштер өңірлер бойынша кезең-кезеңмен, <strong>Шымкент қаласында — 2026 жылғы 18 маусым мен 31 тамыз аралығында</strong> қабылданды (${ui.extLink(ZAKON, 'zakon.kz, 18.05.2026')}). Өтініштер eGov арқылы кіретін ${ui.extLink(OQU, 'OQU (oqu.edu.kz)')} ұлттық платформасында берілді (${ui.extLink(KAZINFORM, 'Kazinform, 26.05.2026')}).</p><p>Пилот бойынша мектепалды даярлық бағдарламасын <strong>осы мектепте</strong> меңгерген және оқуын сонда жалғастырғысы келетін балалар ата-ананың өтініші негізінде 1-сыныпқа <strong>автоматты түрде</strong> қабылданады. Бірлескен бұйрық 2026 жылғы 31 желтоқсанға дейін қолданылады. 2027–2028 оқу жылына арналған мерзімдер жарияланған соң осы бетте көрсетіледі.</p>`,
      `<p>В 2026 году по совместному приказу Министра просвещения и Министра искусственного интеллекта и цифрового развития проводился пилотный проект приёма в 1 класс: заявления принимались поэтапно по регионам, <strong>в Шымкенте — с 18 июня по 31 августа 2026 года</strong> (${ui.extLink(ZAKON, 'zakon.kz, 18.05.2026')}). Заявления подавались на национальной платформе ${ui.extLink(OQU, 'OQU (oqu.edu.kz)')} с входом через eGov (${ui.extLink(KAZINFORM, 'Казинформ, 26.05.2026')}).</p><p>По условиям пилота дети, освоившие программу предшкольной подготовки <strong>в этой же школе</strong> и желающие продолжить в ней обучение, зачисляются в 1 класс <strong>автоматически</strong> на основании заявления родителей. Совместный приказ действует до 31 декабря 2026 года. Сроки на 2027–2028 учебный год появятся на этой странице после их объявления.</p>`,
      `<p>In 2026 a pilot for grade 1 admission ran under a joint order of the Minister of Education and the Minister of Artificial Intelligence and Digital Development: applications were taken region by region, <strong>in Shymkent from 18 June to 31 August 2026</strong> (${ui.extLink(ZAKON, 'zakon.kz, 18.05.2026')}), on the national ${ui.extLink(OQU, 'OQU platform (oqu.edu.kz)')} with eGov sign-in (${ui.extLink(KAZINFORM, 'Kazinform, 26.05.2026')}).</p><p>Under the pilot, children who completed pre-school preparation <strong>at the same school</strong> and wish to stay there are enrolled in grade 1 <strong>automatically</strong> on the parents’ application. The joint order is valid until 31 December 2026. Dates for 2027–2028 will be posted here once announced.</p>`,
    );
    const campaign = ui.callout({
      type: 'warn', icon: 'calendar',
      title: X('Нақты науқанның мерзімдерін министрлік жариялайды', 'Сроки конкретной кампании объявляет министерство', 'The Ministry announces each year’s campaign dates'),
      text: `<p>${L(X('2026 жылы Шымкентте 1-сыныпқа өтініштер <strong>18 маусым – 31 тамыз</strong> аралығында OQU платформасында қабылданды.', 'В 2026 году в Шымкенте заявления в 1 класс принимались <strong>с 18 июня по 31 августа</strong> на платформе OQU.', 'In 2026 Shymkent took grade 1 applications <strong>from 18 June to 31 August</strong> on the OQU platform.'))}</p>
${ui.more({ label: X('2026 пилоты туралы', 'О пилоте 2026 года', 'About the 2026 pilot'), body: campaignFull })}`,
    });
    const whoLegal = ui.legal([R564_ITEM(X(
      '5-т. — шарт; 6-т. — мектепті таңдау; 8-т. — 1-сыныпқа қабылдау жасы; 10-т. — 1-сыныпқа құжат қабылдау мерзімі (1 сәуір – 31 тамыз); 16-т. — мектеп 1-сыныпқа қабылдау туралы бұйрықты ағымдағы жылғы 25 тамыздан ерте шығармайды.',
      'п. 5 — договор; п. 6 — выбор школы; п. 8 — возраст приёма в 1 класс; п. 10 — сроки приёма документов в 1 класс (1 апреля – 31 августа); п. 16 — школа издаёт приказ о зачислении в 1 класс не ранее 25 августа текущего года.',
      'para. 5 — contract; para. 6 — choice of school; para. 8 — age for grade 1; para. 10 — grade 1 document window (1 April – 31 August); para. 16 — the school issues the grade 1 enrolment order no earlier than 25 August.'))], { note: X(
      `Мектепке қабылдау ${ui.extLink(R564, 'Қабылдаудың үлгілік қағидаларына')} (ҚР Білім және ғылым министрінің 2018 жылғы 12 қазандағы № 564 бұйрығы) сәйкес жүргізіледі.`,
      `Приём ведётся по ${ui.extLink(R564, 'Типовым правилам приёма')} (приказ Министра образования и науки РК от 12 октября 2018 года № 564).`,
      `Admission follows the ${ui.extLink(R564, 'Standard Admission Rules')} (Order No. 564 of the Minister of Education and Science, 12 October 2018).`) });

    // ------------------------------------------------------------------ documents
    // Layer 1: six tiles (what to bring, 2–4 words each); layer 2: what matters about each one + the norm.
    const needItems = [
      { icon: 'doc', tag: '01', title: X('Өтініш', 'Заявление', 'Application'), hint: X('белгіленген нысан бойынша', 'по установленной форме', 'in the set form'), text: X('Ата-ананың (заңды өкілінің) белгіленген нысандағы өтініші. Үлгісі — «Өтініш үлгілері» бетінде.', 'Заявление родителя (законного представителя) по установленной форме. Образец — на странице «Образцы заявлений».', 'Application by the parent (legal representative) in the set form. A sample is on the “Application forms” page.') },
      { icon: 'user', tag: '02', title: X('Баланың туу туралы куәлігі', 'Свидетельство о рождении ребёнка', 'Child’s birth certificate'), hint: X('салыстыру үшін', 'для сверки', 'for verification'), text: X('Мектепте тапсырғанда — салыстырып тексеру үшін көрсетіледі; порталда мәліметтер ақпараттық жүйелерден алынады.', 'При подаче в школе предъявляется для сверки; на портале сведения берутся из информационных систем.', 'Shown for verification when applying at school; on the portal the data come from state systems.') },
      { icon: 'shield', tag: '03', title: X('Ата-ананың жеке куәлігі', 'Удостоверение личности родителя', 'Parent’s ID'), hint: X('жеке басын растау', 'для идентификации', 'for identification'), text: X('Жеке басын куәландыратын құжат — тексеру үшін.', 'Документ, удостоверяющий личность, — для идентификации.', 'Identity document — for identification.') },
      { icon: 'medical', tag: '04', title: X('Медициналық құжаттар', 'Медицинские документы', 'Medical records'), hint: X('№ 065/е және № 052-2/е нысандары', 'формы № 065/у и № 052-2/у', 'forms 065/u and 052-2/u'), text: X('«Иммундау паспорты» (№ 065/е нысаны) және «Бала денсаулығының паспорты» (№ 052-2/е нысаны).', 'Паспорт иммунизации (форма № 065/у) и паспорт здоровья ребёнка (форма № 052-2/у).', 'Immunisation passport (form 065/u) and the child’s health passport (form 052-2/u).') },
      { icon: 'image', tag: '05', title: X('Фотосурет 3×4 см', 'Фотография 3×4 см', 'Photo 3×4 cm'), hint: X('2 дана немесе цифрлық', '2 шт. или цифровая', '2 prints or digital'), text: X('Мектепте тапсырғанда — 2 дана; порталда — цифрлық фотосурет.', 'В школу — 2 штуки; на портале — цифровая фотография.', 'Two prints at school; a digital photo on the portal.') },
      { icon: 'graduation', tag: '10–11', title: X('10–11-сыныптарға (қажет болса)', 'В 10–11 классы (если применимо)', 'Grades 10–11 (if applicable)'), hint: X('негізгі орта білім туралы құжат', 'документ об основном среднем образовании', 'basic secondary certificate'), text: X('Қосымша — негізгі орта білім туралы мемлекеттік үлгідегі құжат (27-тармақ). Мектеп қазір 0–6-сыныптарды оқытады (нақтылануда).', 'Дополнительно — документ государственного образца об основном среднем образовании (п. 27). Сейчас школа обучает 0–6 классы (уточняется).', 'In addition, the state certificate of basic secondary education (para. 27). The school currently teaches grades 0–6 (being confirmed).') },
    ];
    const docsNeeded = `<ul class="sa-need" role="list">${needItems.map((d) => `<li class="sa-need__i"><span class="sa-need__ic" aria-hidden="true">${ui.icon(d.icon, { size: 22 })}</span><span class="sa-need__tag">${d.tag}</span><p class="sa-need__t">${L(d.title)}</p><p class="sa-need__h">${L(d.hint)}</p></li>`).join('')}</ul>`;
    const docsMore = ui.more({ label: X('Әр құжат туралы', 'Подробнее о каждом документе', 'About each document'), icon: 'doc', count: needItems.length, tone: 'card',
      body: `<dl class="sa-needlist">${needItems.map((d) => `<div><dt><span class="sa-needlist__tag">${d.tag}</span>${L(d.title)}</dt><dd>${L(d.text)}</dd></div>`).join('')}</dl>` });
    const docsLegal = ui.legal([R564_ITEM(X('11-тармақ және 1-қосымша (мемлекеттік қызмет стандарты); 27-тармақ — 10–11-сыныптарға.', 'п. 11 и приложение 1 (стандарт государственной услуги); п. 27 — для 10–11 классов.', 'para. 11 and Appendix 1 (the service standard); para. 27 — grades 10–11.'))], { note: X(
      `Тізім ${ui.extLink(R564, 'Үлгілік қағидалардың')} 11-тармағы мен 1-қосымшасы (мемлекеттік қызмет стандарты) бойынша берілген.`,
      `Перечень приведён по п. 11 и приложению 1 (стандарт государственной услуги) ${ui.extLink(R564, 'Типовых правил приёма')}.`,
      `The list follows para. 11 and Appendix 1 (the service standard) of the ${ui.extLink(R564, 'Standard Admission Rules')}.`) });

    // ------------------------------------------------------------------ two ways to apply
    const egovSteps = [
      { title: X('Порталға кіріңіз', 'Войдите на портал', 'Sign in'), text: X('ЭЦҚ немесе бір реттік SMS-құпиясөз арқылы egov.kz немесе eGov mobile қосымшасына кіріңіз.', 'Авторизуйтесь на egov.kz или в eGov mobile с ЭЦП или одноразовым SMS-паролем.', 'Sign in to egov.kz or eGov mobile with a digital signature or a one-time SMS password.') },
      { title: X('Қызметті таңдаңыз', 'Выберите услугу', 'Choose the service'), text: X('«Білім беру» бөлімінде — «1-сыныпқа қабылдау үшін құжаттар қабылдау».', 'В разделе «Образование» — «Прием документов для зачисления в 1 класс».', 'Under “Education” — “Acceptance of documents for enrolment in grade 1”.') },
      { title: X('Өтінімді толтырыңыз', 'Заполните заявку', 'Fill in the request'), text: X('Бала мен мектеп туралы мәліметтерді енгізіп, медициналық нысандар мен фотосуретті тіркеңіз.', 'Укажите данные ребёнка и школы, приложите медицинские формы и фотографию.', 'Enter the child’s and school’s details, attach the medical forms and a photo.') },
      { title: X('Жауапты алыңыз', 'Получите ответ', 'Get the answer'), text: X('1 жұмыс күні ішінде жеке кабинетке оқуға қабылдау туралы хабарлама немесе дәлелді бас тарту келеді.', 'В течение 1 рабочего дня в личный кабинет придёт уведомление о зачислении или мотивированный отказ.', 'Within 1 working day your account receives an enrolment notice or a reasoned refusal.') },
    ];
    const schoolSteps = [
      { title: X('Алдын ала хабарласыңыз', 'Свяжитесь заранее', 'Get in touch first'), text: X(`Бос орындар мен келу уақытын нақтылау үшін <a href="tel:${phone.tel}">${phone.display}</a> нөміріне қоңырау шалыңыз немесе WhatsApp-қа жазыңыз.`, `Позвоните или напишите в WhatsApp по номеру <a href="tel:${phone.tel}">${phone.display}</a>, чтобы уточнить свободные места и время визита.`, `Call or message <a href="tel:${phone.tel}">${phone.display}</a> on WhatsApp to check free places and a time to visit.`) },
      { title: X('Құжаттарды әкеліңіз', 'Принесите документы', 'Bring the documents'), text: X('Жоғарыдағы тізім бойынша: өтініш, түпнұсқалар (салыстыру үшін), медициналық нысандар, 2 фотосурет.', 'По списку выше: заявление, оригиналы (для сверки), медицинские формы, 2 фотографии.', 'As listed above: application, originals for verification, medical forms, 2 photos.') },
      { title: X('Қолхат алыңыз', 'Получите расписку', 'Get a receipt'), text: X('Мектеп құжаттарды тіркеп, 1 жұмыс күні ішінде құжаттарды қабылдағаны (немесе бас тартқаны) туралы қолхат береді.', 'Школа регистрирует документы и в течение 1 рабочего дня выдаёт расписку о приёме документов (или об отказе).', 'The school registers the documents and within 1 working day issues a receipt (or a refusal).') },
      { title: X('Шартқа қол қойыңыз', 'Подпишите договор', 'Sign the contract'), text: X(`Білім беру қызметтерін көрсету туралы шарт — № 93 бұйрықтағы үлгілік нысан бойынша (<a href="${href('tuition')}">толығырақ</a>).`, `Договор об оказании образовательных услуг — по типовой форме приказа № 93 (<a href="${href('tuition')}">подробнее</a>).`, `The educational services contract follows the standard form of Order No. 93 (<a href="${href('tuition')}">details</a>).`) },
    ];
    const stepByStep = X('Қадамдар толығырақ', 'Каждый шаг подробно', 'Each step in detail');
    const routeEgov = `<div class="sa-route pattern" data-theme="geography">
<p class="sa-route__tag">${ui.icon('globe', { size: 18 })}<span>${L(X('Онлайн', 'Онлайн', 'Online'))}</span></p>
<h3 class="sa-route__title">${L(X('OQU және egov.kz арқылы', 'Через OQU и egov.kz', 'Via OQU and egov.kz'))}</h3>
${titlesOnly(egovSteps)}
<div class="cluster">${ui.button({ href: OQU, label: X('1-сыныпқа — OQU (2026 пилоты)', 'В 1 класс — OQU (пилот 2026)', 'Grade 1 — OQU (2026 pilot)'), kind: 'gold' })}${ui.button({ href: EGOV_1, label: X('1-сынып — egov.kz', '1 класс — egov.kz', 'Grade 1 — egov.kz'), kind: 'ghost' })}${ui.button({ href: EGOV_ANY, label: X('Басқа сыныптарға', 'В другие классы', 'Other grades'), kind: 'ghost' })}</div>
${ui.more({ label: stepByStep, icon: 'compass', count: egovSteps.length, tone: 'card', body: `${ui.steps(egovSteps, { cls: 'sa-steps-full' })}<p class="sa-route__hint">${L(X('2026 жылы 1-сыныпқа өтініштер OQU платформасында қабылданды; egov.kz қызметі — балама жол.', 'В 2026 году заявления в 1 класс принимались на платформе OQU; услуга egov.kz — запасной вариант.', 'In 2026 grade 1 applications went through the OQU platform; the egov.kz service is the fallback.'))}</p>` })}
</div>`;
    const routeSchool = `<div class="sa-route sa-route--paper">
<p class="sa-route__tag">${ui.icon('school', { size: 18 })}<span>${L(X('Қағаз түрінде', 'На бумаге', 'On paper'))}</span></p>
<h3 class="sa-route__title">${L(X('Тікелей мектепте', 'Непосредственно в школе', 'Directly at the school'))}</h3>
${titlesOnly(schoolSteps)}
<div class="cluster">${ui.button({ href: href('forms'), label: X('Өтініш үлгілері', 'Образцы заявлений', 'Application forms'), kind: 'primary', icon: 'arrow-right' })}${ui.button({ href: `https://wa.me/${phone.whatsapp}`, label: 'WhatsApp', kind: 'ghost', iconLeft: 'whatsapp' })}</div>
${ui.more({ label: stepByStep, icon: 'compass', count: schoolSteps.length, tone: 'card', body: ui.steps(schoolSteps, { cls: 'sa-steps-full' }) })}
</div>`;
    const routes = `<div class="sa-routes">${routeEgov}${routeSchool}</div>
${ui.legal([R564_ITEM(X('9-тармақ — құжаттар egov.kz веб-порталы арқылы және мектепте қағаз түрінде қабылданады.', 'п. 9 — документы принимаются через веб-портал egov.kz и на бумаге в школе.', 'para. 9 — documents are accepted via the egov.kz portal and on paper at the school.'))], { note: X(
      'Үлгілік қағидалар бойынша құжаттар egov.kz веб-порталы арқылы да, мектептің өзінде қағаз түрінде де қабылданады (9-тармақ).',
      'По Типовым правилам документы принимаются и через веб-портал egov.kz, и на бумаге непосредственно в школе (п. 9).',
      'Under the Standard Rules, documents are accepted both via the egov.kz web portal and on paper at the school itself (para. 9).') })}`;

    // ------------------------------------------------------------------ places of service
    const places = ui.split({
      ratio: '1:1', cls: 'sa-split',
      left: `${ui.facts([
        { k: t('actualAddress'), v: addr, copy: true },
        { k: t('hours'), v: `${L(S.contacts.hours)} ${S.contacts.hoursConfirmed ? '' : ui.badge(t('unconfirmed'), 'warn')}` },
        { k: t('phone'), v: `<a href="tel:${phone.tel}">${phone.display}</a> · ${ui.extLink(`https://wa.me/${phone.whatsapp}`, 'WhatsApp')}` },
        { k: X('Онлайн', 'Онлайн', 'Online'), v: `${ui.extLink(EGOV_1, 'egov.kz')} · eGov mobile` },
      ])}
${ui.more({ label: X('Қызмет көрсету орны туралы толығырақ', 'Подробнее о месте оказания услуги', 'More about the place of service'), icon: 'pin', count: 4, tone: 'card', body: `${ui.facts([
        { k: X('Қызмет көрсету орны', 'Место оказания услуги', 'Place of service'), v: `${L(S.name)}<br><span class="muted">${L(S.legal.name)}</span>` },
        { k: X('Қалай жетуге болады', 'Как добраться', 'Getting there'), v: L(S.addresses.actual.transit) },
        { k: X('Ғимарат', 'Здание', 'Building'), v: L(S.addresses.actual.building) },
        { k: t('whatsappAdmission'), v: `${ui.extLink(`https://wa.me/${S.contacts.whatsappAdmission.whatsapp}`, S.contacts.whatsappAdmission.display)} ${ui.badge(t('unconfirmed'), 'warn')}` },
      ])}
${ui.note(X(
        `Қабылдау мәселелері бойынша мектеп әкімшілігінің қабылдау кестесі нақтылануда. Кездесу уақытын телефон арқылы алдын ала келісіңіз. Барлық байланыс деректері — <a href="${href('contacts')}">«Байланыс»</a> бетінде.`,
        `График приёма родителей администрацией по вопросам зачисления уточняется. Время встречи лучше согласовать по телефону заранее. Все контакты — на странице <a href="${href('contacts')}">«Контакты»</a>.`,
        `The administration’s hours for admission visits are being confirmed. Please agree a time by phone first. All contacts are on the <a href="${href('contacts')}">Contacts</a> page.`,
      ))}` })}`,
      right: ui.mapEmbed(S.addresses.actual.lat, S.addresses.actual.lng, { zoom: 16, height: 360 }),
    });

    // ------------------------------------------------------------------ transfer
    const transferSteps = [
      { title: X('Жаңа мектепке өтініш', 'Заявление в новую школу', 'Apply to the new school'), text: X('Порталда немесе қабылдайтын мектепте қағаз түрінде беріледі. Ауысу — каникул кезеңінде.', 'Подаётся на портале или на бумаге в принимающей школе. Перевод — в каникулярный период.', 'Submitted on the portal or on paper at the receiving school. Transfers take place during school holidays.') },
      { title: X('Қабылдау талоны', 'Талон о принятии', 'Acceptance slip'), text: X('Қабылдайтын мектеп 1 жұмыс күні ішінде келген білім алушыны есепке алу талонын береді; ол 3 жұмыс күні жарамды (20-тармақ). Қызмет мерзімі: порталда — 1 жұмыс күні, қағаз түрінде — 3 жұмыс күніне дейін (2-қосымша).', 'Принимающая школа в течение 1 рабочего дня выдаёт открепительный талон о принятии; он действует 3 рабочих дня (п. 20). Срок услуги: на портале — 1 рабочий день, на бумаге — до 3 рабочих дней (приложение 2).', 'Within 1 working day the receiving school issues an acceptance slip, valid for 3 working days (para. 20). Service time: 1 working day on the portal, up to 3 working days on paper (Appendix 2).') },
      { title: X('Бұрынғы мектептен құжаттар', 'Документы из прежней школы', 'Papers from the old school'), text: X('Талонды көрсеткенде бұрынғы мектеп есептен шығару талонын және оқушының жеке ісін береді.', 'По талону прежняя школа выдаёт открепительный талон о выбытии и личное дело обучающегося.', 'On presenting the slip, the previous school issues a departure slip and the pupil’s personal file.') },
      { title: X('Бұйрықтар', 'Приказы', 'Orders'), text: X('Құжаттарды жаңа мектепке тапсырасыз; екі мектеп те оқуға қабылдау және шығару туралы бұйрық шығарады.', 'Документы сдаются в новую школу; обе школы издают приказы о зачислении и отчислении.', 'You hand the papers to the new school; both schools issue enrolment and withdrawal orders.') },
    ];
    const tabSum = (txt) => `<p class="sa-tabsum">${L(txt)}</p>`;
    const transfer = `${tabSum(X(
      'Ауысу каникул кезеңінде жүргізіледі: өтінішті жаңа мектепке — порталда немесе қағаз түрінде бересіз.',
      'Перевод проводится в каникулы: заявление подаётся в новую школу — на портале или на бумаге.',
      'Transfers take place in the holidays: you apply to the new school, online or on paper.'))}
${titlesOnly(transferSteps, 'sa-mini sa-mini--row')}
${ui.callout({ type: 'info', title: X('Каникулдан тыс ауысу', 'Перевод вне каникул', 'Transfers outside the holidays'), text: X(
      'Каникулдан тыс уақытта ауысуға мына жағдайларда жол беріледі: сот шешімі, тұрғылықты жерін ауыстыру, Қазақстаннан тыс жерге шығу, сондай-ақ балаға қатысты зорлық-зомбылық немесе буллинг болған жағдайда (Үлгілік қағидалар, 17-тармақ).',
      'Вне каникул перевод возможен по решению суда, при переезде, выезде за пределы Казахстана, а также при насилии или буллинге в отношении ребёнка (Типовые правила, п. 17).',
      'Outside the holidays a transfer is possible by court decision, when the family moves or leaves Kazakhstan, or in cases of violence or bullying against the child (Standard Rules, para. 17).',
    ) })}
<div class="cluster">${ui.button({ href: EGOV_TR, label: X('Ауысу — egov.kz', 'Перевод — egov.kz', 'Transfer — egov.kz'), kind: 'primary' })}${ui.button({ href: href('forms'), label: X('Ауысу туралы өтініш үлгісі', 'Образец заявления о переводе', 'Transfer application form'), kind: 'ghost', icon: 'arrow-right' })}</div>
${row(
      ui.more({ label: X('Талондар мен мерзімдер', 'Талоны и сроки — подробно', 'Slips and timelines in detail'), icon: 'clock', count: transferSteps.length, tone: 'card', body: ui.steps(transferSteps, { cls: 'sa-steps-full' }) }),
      ui.legal([R564_ITEM(X('17–23-тармақтар, 2-қосымша — мектептен мектепке ауыстыру.', 'пп. 17–23, приложение 2 — перевод из школы в школу.', 'paras. 17–23, Appendix 2 — transfers between schools.'))], { note: X(
        'Мемлекеттік қызмет: «Бастауыш, негізгі орта және жалпы орта білім беру ұйымдары арасында балаларды ауыстыру үшін құжаттарды қабылдау» (Үлгілік қағидалар, 17–23-тармақтар).',
        'Государственная услуга «Прием документов для перевода детей между организациями начального, основного среднего, общего среднего образования» (Типовые правила, пп. 17–23).',
        'State service: “Acceptance of documents for transferring children between primary and secondary schools” (Standard Rules, paras. 17–23).') }),
    )}`;

    // ------------------------------------------------------------------ leaving & graduation (ORDER-114 item 38: «приём, перевод и выпуск»)
    const withdrawSteps = [
      { title: X('Ата-ананың өтініші', 'Заявление родителей', 'Parent’s application'), text: X(
        `Ата-ана (заңды өкіл) мектепке баланың шығуы туралы жазбаша өтініш береді — үлгісі <a href="${href('forms')}#withdrawal">«Өтініш үлгілері»</a> бетінде (жүктелуде). Басқа мектепке ауысқанда — жаңа мектептің есепке алу талоны; Қазақстаннан тыс жерге шыққанда — шығуды растайтын құжат (564 бұйрық, 2-қосымша).`,
        `Родитель (законный представитель) подаёт в школу письменное заявление о выбытии — образец на странице <a href="${href('forms')}#withdrawal">«Образцы заявлений»</a> (загружается). При переводе — открепительный талон о принятии из новой школы; при выезде за пределы Казахстана — документ, подтверждающий выезд (приказ № 564, приложение 2).`,
        `The parent (legal representative) submits a written withdrawal application — see the template on <a href="${href('forms')}#withdrawal">Application forms</a> (being uploaded). For a transfer, bring the new school’s acceptance slip; when leaving Kazakhstan, a document confirming departure (Order No. 564, Appendix 2).`) },
      { title: X('Шығару туралы бұйрық', 'Приказ об отчислении', 'Withdrawal order'), text: X(
        'Мектеп директоры білім алушыны оқудан шығару туралы бұйрық шығарады; жаңа мектеп — қабылдау туралы бұйрық (564 бұйрық, 22-тармақ).',
        'Директор школы издаёт приказ об отчислении обучающегося; новая школа — приказ о зачислении (приказ № 564, п. 22).',
        'The head of school issues a withdrawal order; the new school issues an enrolment order (Order No. 564, para. 22).') },
      { title: X('Жеке іс пен талон', 'Личное дело и талон', 'Personal file and slip'), text: X(
        `Ата-анаға кетуі туралы есептен шығару талоны және директордың қолымен, мөрмен расталған «... мектебінен шықты» деген жазбасы бар оқушының жеке ісі беріледі (${ui.extLink(O263, '№ 263 бұйрық')}, 4 және 10-қосымшалар; 564 бұйрық, 21-тармақ).`,
        `Родителям выдаются открепительный талон о выбытии и личное дело с записью «Выбыл из ... школы», заверенной подписью директора и печатью (${ui.extLink(O263, 'приказ № 263')}, приложения 4 и 10; приказ № 564, п. 21).`,
        `Parents receive a departure slip and the pupil’s personal file marked “Left ... school”, signed by the head and stamped (${ui.extLink(O263, 'Order No. 263')}, Appendices 4 and 10; Order No. 564, para. 21).`) },
    ];
    const pathStage = (grades, title, text, badgeTxt, kind) => `<li class="sa-path__stage${kind ? ` sa-path__stage--${kind}` : ''}"><p class="sa-path__grades">${L(grades)}</p><p class="sa-path__title">${L(title)}</p><p class="sa-path__text">${L(text)}</p>${badgeTxt ? `<p class="sa-path__doc">${ui.icon(kind === 'exam' ? 'graduation' : 'doc', { size: 16 })}<span>${L(badgeTxt)}</span></p>` : ''}</li>`;
    const gradPath = `<ol class="sa-path" role="list">
${pathStage(X('1–4-сыныптар', '1–4 классы', 'Grades 1–4'), X('Бастауыш білім', 'Начальное образование', 'Primary'), X('1-сыныпта балл қойылмайды, 2–4-сыныптарда — тоқсандық және жылдық бағалар; қорытынды аттестаттау жоқ.', 'В 1 классе баллы не выставляются, во 2–4 классах — четвертные и годовые оценки; итоговой аттестации нет.', 'No marks in grade 1; term and annual marks in grades 2–4; no final attestation.'), null, 'now')}
${pathStage(X('5–8-сыныптар', '5–8 классы', 'Grades 5–8'), X('Негізгі орта білім', 'Основное среднее', 'Lower secondary'), X('Тоқсандық және жылдық бағалар; қорытынды аттестаттау жоқ.', 'Четвертные и годовые оценки; итоговой аттестации нет.', 'Term and annual marks; no final attestation.'), null)}
${pathStage(X('9-сынып', '9 класс', 'Grade 9'), X('Қорытынды аттестаттау', 'Итоговая аттестация', 'Final attestation'), X('4 емтихан, біреуі — таңдау бойынша.', '4 экзамена, один — по выбору.', '4 exams, one chosen by the pupil.'), X('Негізгі орта білім туралы аттестат', 'Аттестат об основном среднем образовании', 'Certificate of basic secondary education'), 'exam')}
${pathStage(X('11-сынып', '11 класс', 'Grade 11'), X('Қорытынды аттестаттау', 'Итоговая аттестация', 'Final attestation'), X('5 емтихан, біреуі — таңдау бойынша.', '5 экзаменов, один — по выбору.', '5 exams, one chosen by the pupil.'), X('Жалпы орта білім туралы аттестат (оның ішінде «Алтын белгі»)', 'Аттестат об общем среднем образовании (в т. ч. «Алтын белгі»)', 'Certificate of general secondary education (incl. “Altyn belgi”)'), 'exam')}
</ol>`;
    const gradNote = ui.callout({ type: 'info', icon: 'school', title: X('«Керемет» мектебі үшін', 'Для школы «Керемет»', 'What this means at Keremet'), text: `<p>${L(X(
      `Мектеп өз мәлімдемесі бойынша 0–${S.grades.to}-сыныптарды оқытады (нақтылануда), сондықтан әзірге 9 және 11-сынып түлектері жоқ, аттестат берілмейді.`,
      `По заявлению школы в ней обучаются 0–${S.grades.to} классы (уточняется), поэтому выпускников 9 и 11 классов и выдачи аттестатов пока нет.`,
      `The school states it teaches grades 0–${S.grades.to} (being confirmed), so there are no grade 9 or 11 graduates or certificates yet.`))}</p>
${ui.more({ body: X(
      '1–8-сыныптарда қорытынды аттестаттау өткізілмейді, ал білім туралы мемлекеттік үлгідегі құжат 9 және 11-сыныптан кейін ғана беріледі. Мектептің толық тәртібі — «Қабылдау, ауыстыру және шығару қағидаларында» (жүктелуде).',
      'В 1–8 классах итоговая аттестация не проводится, а документ об образовании государственного образца выдаётся только после 9 и 11 классов. Подробный порядок школы — в «Правилах приёма, перевода и отчисления» (загружается).',
      'There is no final attestation in grades 1–8, and a state education certificate is issued only after grades 9 and 11. The school’s full procedure is in its “Rules of admission, transfer and withdrawal” (being uploaded).') })}` });
    const gradLegal = ui.legal([
      { href: O125, title: X('Ағымдағы бақылау, аралық және қорытынды аттестаттаудың үлгілік қағидалары (ҚР БҒМ бұйрығы)', 'Типовые правила текущего контроля, промежуточной и итоговой аттестации (приказ МОН РК)', 'Standard Rules on assessment and final attestation (MES order)'), number: '125', date: '2008-03-18', note: X('8, 36–39-тармақтар', 'пп. 8, 36–39', 'paras. 8, 36–39') },
      { href: O39, title: X('Білім туралы құжаттардың түрлері (ҚР БҒМ бұйрығы)', 'Виды документов об образовании (приказ МОН РК)', 'Types of education documents (MES order)'), number: '39', date: '2015-01-28' },
      { href: O263, title: X('Оқушының жеке ісі (бұйрық)', 'Личное дело обучающегося (приказ)', 'Pupil’s personal file (order)'), number: '263', date: '2023-08-17', note: X('4-қосымша', 'приложение 4', 'Appendix 4') },
    ], { note: X(
      `Дереккөздер: ${ui.extLink(O125, 'Ағымдағы бақылау, аралық және қорытынды аттестаттаудың үлгілік қағидалары')} (ҚР БҒМ 18.03.2008 № 125 бұйрығы, 8, 36–39-тармақтар); білім туралы құжаттардың түрлері — ${ui.extLink(O39, 'ҚР БҒМ 28.01.2015 № 39 бұйрығы')}; жеке іс — ${ui.extLink(O263, '17.08.2023 № 263 бұйрық')}, 4-қосымша.`,
      `Источники: ${ui.extLink(O125, 'Типовые правила текущего контроля, промежуточной и итоговой аттестации')} (приказ МОН РК от 18.03.2008 № 125, пп. 8, 36–39); виды документов об образовании — ${ui.extLink(O39, 'приказ МОН РК от 28.01.2015 № 39')}; личное дело — ${ui.extLink(O263, 'приказ от 17.08.2023 № 263')}, приложение 4.`,
      `Sources: ${ui.extLink(O125, 'Standard Rules on assessment and final attestation')} (MES order No. 125 of 18.03.2008, paras. 8, 36–39); types of education documents — ${ui.extLink(O39, 'MES order No. 39 of 28.01.2015')}; personal file — ${ui.extLink(O263, 'Order No. 263 of 17.08.2023')}, Appendix 4.`) });
    const rulesDoc = ui.docList([docById('admission-rules') || { title: X('Білім алушыларды қабылдау, ауыстыру және шығару қағидалары', 'Правила приёма, перевода и отчисления обучающихся', 'Rules of admission, transfer and withdrawal'), file: null }]);
    const leaving = `${tabSum(X(
      'Шығу үшін мектепке жазбаша өтініш бересіз; мектеп бұйрық шығарып, жеке іс пен талонды береді.',
      'Для выбытия подаётся письменное заявление в школу; школа издаёт приказ и выдаёт личное дело и талон.',
      'To leave, you submit a written application; the school issues an order and hands over the personal file and slip.'))}
${titlesOnly(withdrawSteps, 'sa-mini sa-mini--row')}
${row(
      ui.more({ label: X('Қандай құжаттар ресімделеді', 'Какие документы оформляются', 'What paperwork is done'), icon: 'doc', count: withdrawSteps.length, tone: 'card', body: ui.steps(withdrawSteps, { cls: 'sa-steps-full' }) }),
      ui.legal([
        R564_ITEM(X('21, 22-тармақтар, 2-қосымша — шығу және құжаттар.', 'пп. 21, 22, приложение 2 — выбытие и документы.', 'paras. 21, 22, Appendix 2 — leaving and papers.')),
        { href: O263, title: X('Оқушының жеке ісі (бұйрық)', 'Личное дело обучающегося (приказ)', 'Pupil’s personal file (order)'), number: '263', date: '2023-08-17', note: X('4 және 10-қосымшалар', 'приложения 4 и 10', 'Appendices 4 and 10') },
      ]),
    )}
<h4 class="sa-subh">${L(X('Мектептің ішкі қағидалары', 'Внутренние правила школы', 'School’s internal rules'))}</h4>
${rulesDoc}`;
    const graduation = `${tabSum(X('Білім беру деңгейі қалай аяқталады.', 'Как завершается каждый уровень образования.', 'How each level of education is completed.'))}
${gradPath}
${gradNote}
${row(gradLegal)}`;
    const moves = ui.tabs([
      { id: 'transfer', icon: 'arrow-right', label: X('Басқа мектептен ауысу', 'Перевод из другой школы', 'Transfer from another school'), body: transfer },
      { id: 'leaving', icon: 'arrow-left', label: X('Мектептен шығу', 'Выбытие', 'Leaving'), body: leaving },
      { id: 'graduation', icon: 'graduation', label: X('Бітіру', 'Выпуск', 'Graduation'), body: graduation },
    ], { label: X('Ауысу, шығу және бітіру', 'Перевод, выбытие и выпуск', 'Transfer, leaving and graduation'), cls: 'sa-tabs' });

    // ------------------------------------------------------------------ FAQ
    const faq = ui.accordion([
      { q: X('Балам жылдың соңында 6 жасқа толады. Құжат тапсыруға бола ма?', 'Ребёнку исполнится 6 лет в конце года. Можно подавать документы?', 'My child turns 6 at the end of the year. Can we apply?'), a: X(
        '<p>Иә. Үлгілік қағидалар бойынша ағымдағы күнтізбелік жылы алты жасқа толатын балалар да 1-сыныпқа қабылданады (8-тармақ).</p>',
        '<p>Да. По Типовым правилам в 1 класс принимаются и дети, которым шесть лет исполняется в текущем календарном году (п. 8).</p>',
        '<p>Yes. Under the Standard Rules, children who turn six during the current calendar year are also admitted to grade 1 (para. 8).</p>') },
      { q: X('Қандай жағдайда бас тартуы мүмкін?', 'В каких случаях могут отказать?', 'When can an application be refused?'), a: X(
        '<p>Негіздер: құжаттардың немесе мәліметтердің анық еместігі; нормативтік талаптарға сәйкес келмеу; дербес деректерге қол жеткізуге келісімнің болмауы; сынып-жинақтардың толып кетуі және заңда көзделген басқа да жағдайлар (Үлгілік қағидалар, 13-тармақ және 1-қосымша).</p><p>Бас тартылса, тұрғылықты жеріңіз бойынша білім беруді басқарудың жергілікті органына — Шымкентте ' + ui.extLink(S.gov.cityEducation.url, 'қалалық білім басқармасына') + ' жүгінуге болады (7-тармақ).</p>',
        '<p>Основания: недостоверность документов или сведений; несоответствие требованиям нормативных актов; отсутствие согласия на доступ к персональным данным; переполненность классов-комплектов и другие случаи, предусмотренные законом (Типовые правила, п. 13 и приложение 1).</p><p>При отказе можно обратиться в местный орган управления образованием по месту жительства — в Шымкенте это ' + ui.extLink(S.gov.cityEducation.url, 'Управление образования города') + ' (п. 7).</p>',
        '<p>Grounds include unreliable documents or data; failure to meet regulatory requirements; no consent to access personal data; full classes; and other cases set by law (Standard Rules, para. 13 and Appendix 1).</p><p>If refused, you may apply to the local education authority at your place of residence — in Shymkent, the ' + ui.extLink(S.gov.cityEducation.url, 'City Education Department') + ' (para. 7).</p>') },
      { q: X('Мектепалды даярлық (0-сынып) бар ма?', 'Есть ли предшкольный (0) класс?', 'Is there a pre-school (grade 0) class?'), a: X(
        `<p>Мектептің Instagram парақшасында мектеп 0–6-сыныптарға арналғаны айтылған (нақтылануда). 0-сыныпқа қабылдау бұл Үлгілік қағидалармен реттелмейді — шарттарын мектептен сұраңыз: <a href="tel:${phone.tel}">${phone.display}</a>.</p>`,
        `<p>На странице школы в Instagram указано, что школа рассчитана на 0–6 классы (уточняется). Приём в 0 класс этими Типовыми правилами не регулируется — условия уточняйте в школе: <a href="tel:${phone.tel}">${phone.display}</a>.</p>`,
        `<p>The school’s Instagram profile says it serves grades 0–6 (being confirmed). Admission to grade 0 is not governed by these Standard Rules — please ask the school: <a href="tel:${phone.tel}">${phone.display}</a>.</p>`) },
      { q: X('Бос орындар бар-жоғын қайдан білуге болады?', 'Где узнать о свободных местах?', 'Where can I find out about free places?'), a: X(
        `<p>Сыныптар мен бос орындар туралы мәліметтер <a href="${href('contingent')}">«Контингент»</a> бетінде жарияланады (қазір толықтырылуда). Ең жылдам жолы — мектепке қоңырау шалу немесе WhatsApp-қа жазу.</p>`,
        `<p>Сведения о классах и свободных местах публикуются на странице <a href="${href('contingent')}">«Контингент»</a> (сейчас обновляется). Быстрее всего — позвонить в школу или написать в WhatsApp.</p>`,
        `<p>Classes and free places are published on the <a href="${href('contingent')}">Student numbers</a> page (being updated). The quickest way is to call the school or message it on WhatsApp.</p>`) },
      { q: X('Оқу ақылы ма?', 'Обучение платное?', 'Is tuition paid?'), a: X(
        `<p>Мектептің 12.08.2025 хабарландыруында қазақ және орыс тілдерінде тегін оқыту туралы айтылған. Нақты шарттар шартта көрсетіледі — <a href="${href('tuition')}">«Оқу ақысы және шарт»</a> бетін қараңыз.</p>`,
        `<p>В объявлении школы от 12.08.2025 говорится о бесплатном обучении на казахском и русском языках. Точные условия фиксируются в договоре — см. страницу <a href="${href('tuition')}">«Оплата и договор»</a>.</p>`,
        `<p>The school’s announcement of 12.08.2025 mentions free tuition in Kazakh and Russian. The exact terms are set in the contract — see <a href="${href('tuition')}">Tuition & contract</a>.</p>`) },
    ]);

    // ------------------------------------------------------------------ school documents & legal sources
    const schoolDocs = ui.docList(docsByGroup('admission'), { collapse: 3, groupPending: true });
    const actsLegal = ui.legal([
      { href: R564, title: X('Қабылдаудың үлгілік қағидалары (ҚР БҒМ 12.10.2018 № 564 бұйрығы)', 'Типовые правила приёма (приказ МОН РК от 12.10.2018 № 564)', 'Standard Admission Rules (MES order No. 564 of 12.10.2018)'), note: X('adilet.zan.kz · 03.03.2026 редакциясы', 'adilet.zan.kz · ред. от 03.03.2026', 'adilet.zan.kz · as amended 03.03.2026') },
      { href: O125, title: X('Қорытынды аттестаттаудың үлгілік қағидалары (№ 125 бұйрық)', 'Типовые правила итоговой аттестации (приказ № 125)', 'Standard final attestation rules (Order No. 125)'), note: 'adilet.zan.kz' },
      { href: O39, title: X('Білім туралы құжаттардың түрлері (№ 39 бұйрық)', 'Виды документов об образовании (приказ № 39)', 'Types of education documents (Order No. 39)'), note: 'adilet.zan.kz' },
      { href: O263, title: X('Оқушының жеке ісі (№ 263 бұйрық)', 'Личное дело обучающегося (приказ № 263)', 'Pupil’s personal file (Order No. 263)'), note: 'adilet.zan.kz' },
    ], { title: X('Нормативтік актілер', 'Нормативные акты', 'Regulations') });
    const services = ui.more({ label: X('Мемлекеттік қызметтер онлайн', 'Госуслуги онлайн', 'State e-services'), icon: 'globe', count: 5, tone: 'card', body: ui.linkList([
      { href: EGOV_1, icon: 'globe', label: X('1-сыныпқа қабылдау үшін құжаттар қабылдау', 'Прием документов для зачисления в 1 класс', 'Acceptance of documents for grade 1'), note: 'egov.kz' },
      { href: EGOV_ANY, icon: 'globe', label: X('Білім беру ұйымдарына құжаттар қабылдау және оқуға қабылдау', 'Прием документов и зачисление в организации образования', 'Acceptance of documents and enrolment in schools'), note: 'egov.kz' },
      { href: EGOV_TR, icon: 'globe', label: X('Балаларды мектептен мектепке ауыстыру үшін құжаттар қабылдау', 'Прием документов для перевода детей из школы в школу', 'Acceptance of documents for school transfers'), note: 'egov.kz' },
      { href: OQU, icon: 'globe', label: X('OQU ұлттық білім беру платформасы', 'Национальная образовательная платформа OQU', 'OQU national education platform'), note: X('2026 пилоты: 1-сыныпқа өтініш', 'пилот 2026: заявления в 1 класс', '2026 pilot: grade 1 applications') },
      { href: S.gov.cityEducation.url, icon: 'building', label: S.gov.cityEducation.label, note: 'gov.kz' },
    ]) });

    // ------------------------------------------------------------------ assemble
    const toc = ui.toc([
      { id: 'keremet', label: X('«Керемет» мектебіне қабылдау', 'Приём в «Керемет»', 'Admission to Keremet') },
      { id: 'who', label: X('Кім және қашан', 'Кто и когда', 'Who and when') },
      { id: 'documents', label: X('Құжаттар тізімі', 'Перечень документов', 'Documents') },
      { id: 'apply', label: X('Өтініш берудің екі жолы', 'Два способа подать заявление', 'Two ways to apply') },
      { id: 'places', label: X('Қызмет көрсету орны', 'Место оказания услуги', 'Place of service') },
      { id: 'moves', label: X('Ауысу, шығу және бітіру', 'Перевод, выбытие и выпуск', 'Transfer, leaving and graduation') },
      { id: 'faq', label: X('Жиі қойылатын сұрақтар', 'Частые вопросы', 'FAQ') },
      { id: 'request', label: X('Өтінім қалдыру', 'Оставить заявку', 'Leave a request') },
      { id: 'sources', label: X('Құжаттар мен дереккөздер', 'Документы и источники', 'Documents & sources') },
    ]);
    const intro = ui.tldr({ points: [
        { icon: 'compass', text: X('<strong>Төрт қадам:</strong> жасын тексеріңіз → құжаттарды жинаңыз → онлайн немесе мектепте өтініш беріңіз → шартқа қол қойыңыз.', '<strong>Четыре шага:</strong> проверьте возраст → соберите документы → подайте заявление онлайн или в школе → подпишите договор.', '<strong>Four steps:</strong> check the age → gather the documents → apply online or at school → sign the contract.') },
        { icon: 'phone', text: X(`Бос орындар мен келу уақыты — <a href="tel:${phone.tel}">${phone.display}</a> (WhatsApp да бар).`, `Свободные места и время визита — <a href="tel:${phone.tel}">${phone.display}</a> (есть WhatsApp).`, `Free places and visits: <a href="tel:${phone.tel}">${phone.display}</a> (WhatsApp too).`) },
      ] });

    return [
      intro,
      keyStats,
      ui.split({ ratio: '1:2', cls: 'sa-split sa-intro', left: toc, right: ui.section({ id: 'keremet', eyebrow: X('2026–2027 оқу жылы', '2026–2027 учебный год', 'School year 2026–2027'), title: X('«Керемет» мектебіне қабылдау', 'Приём в школу «Керемет»', 'Admission to Keremet School'), body: keremet }) }),
      ui.section({ id: 'who', eyebrow: rulesName, title: X('Кім және қашан қабылданады', 'Кого и когда принимают', 'Who is admitted, and when'), body: whoWhen + campaign + row(whoLegal) }),
      ui.section({ id: 'documents', eyebrow: X('Не дайындау керек', 'Что подготовить', 'What to prepare'), title: X('Қабылдауға қажетті құжаттар', 'Документы для приёма', 'Documents for admission'), body: docsNeeded + row(docsMore, docsLegal) }),
      ui.section({ id: 'apply', eyebrow: X('Өзіңізге ыңғайлысын таңдаңыз', 'Выберите удобный способ', 'Choose what suits you'), title: X('Өтініш берудің екі жолы', 'Два способа подать заявление', 'Two ways to apply'), lead: X('Онлайн немесе мектептің өзінде қағаз түрінде.', 'Онлайн или на бумаге в самой школе.', 'Online, or on paper at the school itself.'), body: routes }),
      ui.section({ id: 'places', eyebrow: X('Мемлекеттік қызмет көрсету орны', 'Место оказания государственной услуги', 'Where the service is provided'), title: X('Мектепке қалай келуге болады', 'Куда прийти', 'Where to come'), body: places }),
      ui.section({ id: 'moves', tone: 'tint', eyebrow: X(`1–${S.grades.to}-сыныптар (нақтылануда)`, `1–${S.grades.to} классы (уточняется)`, `Grades 1–${S.grades.to} (being confirmed)`), title: X('Ауысу, шығу және бітіру', 'Перевод, выбытие и выпуск', 'Transfers, leaving and graduation'), body: moves }),
      ui.section({ id: 'faq', title: X('Жиі қойылатын сұрақтар', 'Частые вопросы', 'Frequently asked questions'), body: faq }),
      ui.banner({ theme: 'geography', icon: 'whatsapp', eyebrow: X('Жылдам байланыс', 'Быстрая связь', 'Quick contact'), title: X('Сұрағыңыз бар ма? WhatsApp-қа жазыңыз', 'Есть вопрос? Напишите в WhatsApp', 'Got a question? Message us on WhatsApp'), text: X(`${phone.display} — қабылдау, бос орындар және мектепке келу уақыты туралы.`, `${phone.display} — о приёме, свободных местах и времени визита в школу.`, `${phone.display} — about admission, free places and visiting the school.`), href: `https://wa.me/${phone.whatsapp}`, label: X('WhatsApp-қа жазу', 'Написать в WhatsApp', 'Message on WhatsApp') }),
      ui.section({ id: 'request', eyebrow: X('Онлайн өтінім', 'Онлайн-заявка', 'Online request'), title: X('Қабылдауға өтінім қалдыру', 'Оставить заявку на приём', 'Leave an admission request'), lead: X(
        'Мектеп сізге хабарласады. Бұл өтінім ресми өтініштің орнын баспайды.',
        'Школа свяжется с вами. Заявка не заменяет официальное заявление.',
        'The school will contact you. This does not replace the official application.',
      ), body: ui.split({ ratio: '3:2', cls: 'sa-split', left: ui.form({ kind: 'admission', lang }), right: `<div class="sa-aside">
<h3>${L(X('Өтінімнен кейін не болады', 'Что будет после заявки', 'What happens next'))}</h3>
${tl4([
        { date: X('1-қадам', 'Шаг 1', 'Step 1'), title: X('Мектеп хабарласады', 'Школа свяжется с вами', 'The school gets in touch'), text: X('телефон немесе WhatsApp арқылы', 'по телефону или в WhatsApp', 'by phone or WhatsApp') },
        { date: X('2-қадам', 'Шаг 2', 'Step 2'), title: X('Мектеппен танысу', 'Знакомство со школой', 'Visit the school'), text: X('бос орындар мен шарттарды нақтылау', 'уточнение свободных мест и условий', 'check free places and terms') },
        { date: X('3-қадам', 'Шаг 3', 'Step 3'), title: X('Ресми өтініш', 'Официальное заявление', 'Official application'), text: X('egov.kz арқылы немесе мектепте', 'через egov.kz или в школе', 'via egov.kz or at school') },
      ])}
${ui.more({ label: X('Мектептің байланыс деректері', 'Контакты школы', 'School contacts'), icon: 'phone', tone: 'card', body: ui.contactList({ admission: true }) })}
<p class="sa-aside__hint">${L(X(
        'Бұл өтінім мектеппен байланысуға арналған және ресми өтініштің орнын баспайды. Мектеп сізге хабарласып, келесі қадамдарды түсіндіреді.',
        'Эта заявка — для связи со школой и не заменяет официальное заявление. Школа свяжется с вами и подскажет следующие шаги.',
        'This request is for getting in touch and does not replace the official application. The school will contact you and explain the next steps.'))}</p></div>` }) }),
      ui.section({ id: 'sources', tone: 'card', eyebrow: X('Құжаттар', 'Документы', 'Documents'), title: X('Құжаттар мен ресми дереккөздер', 'Документы и официальные источники', 'Documents and official sources'), body: ui.grid({ cols: 2, cls: 'sa-grid', items: [
        `<h3>${L(X('Мектеп құжаттары', 'Документы школы', 'School documents'))}</h3>${schoolDocs}`,
        `<h3>${L(X('Нормативтік актілер және қызметтер', 'Нормативные акты и услуги', 'Regulations and services'))}</h3>${row(actsLegal, services)}`,
      ] }) }),
      ui.section({ title: X('Осы бөлімде', 'В этом разделе', 'In this section'), body: ui.cards([
        { icon: 'users', href: href('contingent'), title: X('Контингент', 'Контингент', 'Student numbers'), text: X('Сыныптар, оқушылар саны, бос орындар', 'Классы, число учащихся, свободные места', 'Classes, pupils, free places') },
        { icon: 'doc', href: href('forms'), title: X('Өтініш үлгілері', 'Образцы заявлений', 'Application forms'), text: X('Қабылдау, ауысу, анықтама, телнұсқа', 'Приём, перевод, справка, дубликат', 'Admission, transfer, certificate, duplicate') },
        { icon: 'handshake', href: href('tuition'), title: X('Оқу ақысы және шарт', 'Оплата и договор', 'Tuition & contract'), text: X('№ 93 бұйрық бойынша үлгілік шарт', 'Типовой договор по приказу № 93', 'Standard contract under Order No. 93') },
      ], { cols: 3, cls: 'sa-cards' }) }),
    ].join('\n');
  },
};
