// Education group — Curriculum & programmes (ORDER-114 §F items 42–45).
// Legal texts verified 24.09.2026 on zakon.uchet.kz mirrors of adilet.zan.kz (editions noted inline).
// Also exports ACTS / actItems() — the legal-act registry shared by the other education pages.

const X = (kz, ru, en) => ({ kz, ru, en });

/** Normative acts used by the education pages (adilet.zan.kz codes). */
export const ACTS = {
  law: { code: 'Z070000319_', icon: 'scale', title: X('«Білім туралы» Қазақстан Республикасының Заңы', 'Закон Республики Казахстан «Об образовании»', 'Law of the Republic of Kazakhstan “On Education”'), note: X('2007 жылғы 27 шілдедегі № 319-III', 'от 27 июля 2007 года № 319-III', 'No. 319-III of 27 July 2007') },
  goso: { code: 'V2200029031', icon: 'shield', title: X('Мемлекеттік жалпыға міндетті білім беру стандарттары (МЖМБС)', 'Государственные общеобязательные стандарты образования (ГОСО)', 'State compulsory education standards'), note: X('ҚР Оқу-ағарту министрінің 2022 жылғы 3 тамыздағы № 348 бұйрығы', 'приказ Министра просвещения РК от 3 августа 2022 года № 348', 'Order of the Minister of Education No. 348 of 3 August 2022') },
  tup: { code: 'V1200008170', icon: 'grid', title: X('Бастауыш, негізгі орта, жалпы орта білім берудің үлгілік оқу жоспарлары', 'Типовые учебные планы начального, основного среднего, общего среднего образования', 'Standard curricula for primary, lower and upper secondary education'), note: X('ҚР БҒМ 2012 жылғы 8 қарашадағы № 500 бұйрығы (2024 жылғы 27 маусымдағы № 161 бұйрық редакциясында, 01.09.2025 бастап)', 'приказ МОН РК от 8 ноября 2012 года № 500 (в ред. приказа от 27 июня 2024 года № 161, с 01.09.2025)', 'Order No. 500 of 8 November 2012 (as amended by Order No. 161 of 27 June 2024, from 01.09.2025)') },
  tupr: { code: 'V2200029767', icon: 'book', title: X('Жалпы білім беретін пәндер мен таңдау курстары бойынша үлгілік оқу бағдарламалары', 'Типовые учебные программы по общеобразовательным предметам и курсам по выбору', 'Standard syllabuses for general subjects and elective courses'), note: X('ҚР Оқу-ағарту министрінің 2022 жылғы 16 қыркүйектегі № 399 бұйрығы', 'приказ Министра просвещения РК от 16 сентября 2022 года № 399', 'Order of the Minister of Education No. 399 of 16 September 2022') },
  assess: { code: 'V080005191_', icon: 'target', title: X('Үлгеріміне ағымдағы бақылауды, аралық және қорытынды аттестаттауды өткізудің үлгілік қағидалары', 'Типовые правила проведения текущего контроля успеваемости, промежуточной и итоговой аттестации обучающихся', 'Standard rules for continuous assessment, interim and final attestation'), note: X('ҚР БҒМ 2008 жылғы 18 наурыздағы № 125 бұйрығы', 'приказ МОН РК от 18 марта 2008 года № 125', 'Order No. 125 of 18 March 2008') },
  docs130: { code: 'V2000020317', icon: 'doc', title: X('Педагогтер жүргізуге міндетті құжаттардың тізбесі және олардың нысандары', 'Перечень документов, обязательных для ведения педагогами, и их формы', 'List of documents teachers must keep, and their forms'), note: X('ҚР БҒМ 2020 жылғы 6 сәуірдегі № 130 бұйрығы', 'приказ МОН РК от 6 апреля 2020 года № 130', 'Order No. 130 of 6 April 2020') },
  method: { code: 'V2300033285', icon: 'bulb', title: X('Оқу-әдістемелік және ғылыми-әдістемелік жұмысты ұйымдастыру және жүзеге асыру қағидалары', 'Правила организации и осуществления учебно-методической и научно-методической работы', 'Rules for organising methodological work in education organisations'), note: X('ҚР Оқу-ағарту министрінің 2023 жылғы 10 тамыздағы № 253 бұйрығы', 'приказ Министра просвещения РК от 10 августа 2023 года № 253', 'Order of the Minister of Education No. 253 of 10 August 2023') },
  distance: { code: 'V2300033682', icon: 'globe', title: X('Қашықтан оқыту бойынша оқу процесін ұйымдастыру қағидалары (оның ішінде қолайсыз ауа райы мен төтенше жағдайларда)', 'Правила организации учебного процесса по дистанционному обучению (в том числе при неблагоприятных погодных условиях и ЧС)', 'Rules for organising distance learning (incl. adverse weather and emergencies)'), note: X('ҚР Оқу-ағарту министрінің 2023 жылғы 27 қарашадағы № 349 бұйрығы (2026 жылғы 26 маусымдағы № 182-НҚ бұйрық редакциясында)', 'приказ Министра просвещения РК от 27 ноября 2023 года № 349 (в ред. приказа от 26 июня 2026 года № 182-НҚ)', 'Order No. 349 of 27 November 2023 (as amended by Order No. 182-NK of 26 June 2026)') },
  calendar: { code: 'G26HP000213', icon: 'calendar', title: X('2026–2027 оқу жылының басталу және аяқталу мерзімдерін, қорытынды аттестаттау мерзімдерін айқындау туралы', 'Об определении сроков начала и завершения 2026–2027 учебного года и сроков итоговой аттестации', 'On the start and end dates of the 2026–2027 school year and final attestation'), note: X('ҚР Оқу-ағарту министрінің м.а. 2026 жылғы 29 шілдедегі № 213-НҚ бұйрығы', 'приказ и.о. Министра просвещения РК от 29 июля 2026 года № 213-НҚ', 'Order of the Acting Minister of Education No. 213-NK of 29 July 2026') },
  attest: { code: 'V2600038645', icon: 'star', title: X('Білім беру ұйымдарын мемлекеттік аттестаттаудан өткізу қағидалары', 'Правила проведения государственной аттестации организаций образования', 'Rules for the state attestation of education organisations'), note: X('ҚР Оқу-ағарту министрінің 2026 жылғы 30 сәуірдегі № 114-НҚ бұйрығы', 'приказ Министра просвещения РК от 30 апреля 2026 года № 114-НҚ', 'Order of the Minister of Education No. 114-NK of 30 April 2026') },
  sppc: { code: 'V2500036047', icon: 'heart', title: X('Психологиялық-педагогикалық қолдау қызметінің жұмыс істеу қағидалары', 'Правила деятельности службы психолого-педагогического сопровождения', 'Rules of the psychological and pedagogical support service'), note: X('ҚР Оқу-ағарту министрінің 2025 жылғы 29 сәуірдегі № 92 бұйрығы (2026 жылғы 29 мамырдағы № 144-НҚ бұйрық редакциясында)', 'приказ Министра просвещения РК от 29 апреля 2025 года № 92 (в ред. приказа от 29 мая 2026 года № 144-НҚ)', 'Order No. 92 of 29 April 2025 (as amended by Order No. 144-NK of 29 May 2026)') },
  oop: { code: 'V2200026618', icon: 'compass', title: X('Ерекше білім беру қажеттіліктерін бағалау қағидалары және бағдарламалары', 'Правила и программы оценки особых образовательных потребностей', 'Rules and programmes for assessing special educational needs'), note: X('ҚР БҒМ 2022 жылғы 12 қаңтардағы № 4 бұйрығы', 'приказ МОН РК от 12 января 2022 года № 4', 'Order No. 4 of 12 January 2022') },
  pmpk: { code: 'V2000020744', icon: 'medical', title: X('Психологиялық-педагогикалық қолдау саласындағы мемлекеттік қызметтерді көрсету қағидалары', 'Правила оказания государственных услуг в сфере психолого-педагогической поддержки', 'Rules for state services in psychological and pedagogical support'), note: X('ҚР БҒМ 2020 жылғы 27 мамырдағы № 223 бұйрығы', 'приказ МОН РК от 27 мая 2020 года № 223', 'Order No. 223 of 27 May 2020') },
};
/** adilet.zan.kz URL of an act in the page language (English → Russian text). */
export const actUrl = (id, lang) => `https://adilet.zan.kz/${lang === 'kz' ? 'kaz' : 'rus'}/docs/${ACTS[id].code}`;
/** linkList items for a set of acts. */
export const actItems = (ids, lang) => ids.map((id) => ({ href: actUrl(id, lang), icon: ACTS[id].icon, label: ACTS[id].title, note: ACTS[id].note }));
/** Inline external link to an act: «№ 348». */
export const actRef = (ui, id, lang, label) => ui.extLink(actUrl(id, lang), label || ACTS[id].note);
/** Small "texts checked" note under legal link lists. */
export const checkedNote = X(
  'Нормативтік актілердің мәтіндері 24.09.2026 жағдайы бойынша «Әділет» ақпараттық-құқықтық жүйесінде жарияланған редакциялары бойынша тексерілді.',
  'Тексты нормативных актов сверены по редакциям, опубликованным в ИПС «Әділет», по состоянию на 24.09.2026.',
  'The legal texts were checked against the editions published in the Adilet legal information system as of 24.09.2026.',
);
/** Pass/fail subjects — one wording shared by curriculum and assessment (rules №125 p. 16 vs TUP ed. №161). */
export const passFail = (tail = X('', '', '')) => X(
  `<p>№ 125 қағидалардың 16-тармағы бойынша музыка, дене шынықтыру, көркем еңбек және бастауыш мектептегі цифрлық сауаттылық пәндерінен БЖБ мен ТЖБ өткізілмейді — «сынақ» / «сынақ емес» қойылады.</p><p>Ескерту: 2025 жылғы 1 қыркүйектен бастап қолданылатын үлгілік оқу жоспарында (№ 500 бұйрық, № 161 бұйрық редакциясы) бастауыш сыныптарда «Көркем еңбек» деген пән жоқ — оның орнына «Бейнелеу өнері» мен «Еңбекке баулу» жеке пәндер ретінде оқытылады. Осы екі пәннің қалай бағаланатынын (балл немесе «сынақ») мектеп нақтылап, осы бетте жариялайды.${tail.kz}</p>`,
  `<p>По п. 16 правил № 125 по музыке, физической культуре, художественному труду и цифровой грамотности в начальной школе СОр и СОч не проводятся — выставляется «зачёт» / «незачёт».</p><p>Примечание: в типовом учебном плане, действующем с 1 сентября 2025 года (приказ № 500 в ред. приказа № 161), в начальных классах нет предмета «Художественный труд» — вместо него отдельно изучаются «Изобразительное искусство» и «Трудовое обучение». Как оцениваются эти два предмета (баллы или «зачёт»), школа уточнит и опубликует на этой странице.${tail.ru}</p>`,
  `<p>Under para. 16 of rules No. 125, music, PE, arts and crafts (“художественный труд”) and primary digital literacy have no summative tests — a pass/fail is recorded.</p><p>Note: the standard curriculum in force since 1 September 2025 (Order No. 500 as amended by No. 161) no longer has “arts and crafts” in primary grades — Visual arts and Labour training are taught as separate subjects instead. The school will confirm how these two subjects are assessed (points or pass/fail) and publish it here.${tail.en}</p>`,
);
/** Decimal number in the page language (4,5 / 4.5). */
export const num = (v, lang) => (v == null ? '—' : String(v).replace('.', lang === 'en' ? '.' : ','));

// ---------------------------------------------------------------- typical curriculum data (TUP №500, appendices 1–2, ed. №161)
const A = (name) => ({ area: true, name });
const R = (name, h, w) => ({ name, h, w });
const TUP_KZ = [
  { ...A(X('Тіл және әдебиет', 'Язык и литература', 'Language and literature')), h: [6, 9, 11, 11], w: 37 },
  R(X('Әліппе, Ана тілі', 'Әліппе, Ана тілі (букварь, родной язык)', 'Alippe, Ana tili (primer, mother tongue)'), [6, null, null, null], 6),
  R(X('Қазақ тілі', 'Казахский язык', 'Kazakh language'), [null, 4, 4, 4], 12),
  R(X('Әдебиеттік оқу', 'Литературное чтение', 'Literary reading'), [null, 3, 3, 3], 9),
  R(X('Орыс тілі', 'Русский язык', 'Russian language'), [null, 2, 2, 2], 6),
  R(X('Шетел тілі', 'Иностранный язык', 'Foreign language'), [null, null, 2, 2], 4),
  { ...A(X('Математика және информатика', 'Математика и информатика', 'Mathematics and computing')), h: [4.5, 5, 6, 6], w: 21.5 },
  R(X('Математика', 'Математика', 'Mathematics'), [4, 4, 5, 5], 18),
  R(X('Цифрлық сауаттылық', 'Цифровая грамотность', 'Digital literacy'), [0.5, 1, 1, 1], 3.5),
  { ...A(X('Жаратылыстану', 'Естествознание', 'Natural science')), h: [1, 1, 1, 1], w: 4 },
  R(X('Жаратылыстану', 'Естествознание', 'Natural science'), [1, 1, 1, 1], 4),
  { ...A(X('Адам және қоғам', 'Человек и общество', 'People and society')), h: [1, 1, 1, 1], w: 4 },
  R(X('Дүниетану', 'Познание мира', 'Knowledge of the world'), [1, 1, 1, 1], 4),
  { ...A(X('Технология және өнер', 'Технология и искусство', 'Technology and arts')), h: [3, 3, 3, 3], w: 12 },
  R(X('Музыка', 'Музыка', 'Music'), [1, 1, 1, 1], 4),
  R(X('Еңбекке баулу', 'Трудовое обучение', 'Labour training'), [1, 1, 1, 1], 4),
  R(X('Бейнелеу өнері', 'Изобразительное искусство', 'Visual arts'), [1, 1, 1, 1], 4),
  { ...A(X('Дене шынықтыру', 'Физическая культура', 'Physical education')), h: [3, 3, 3, 3], w: 12 },
  R(X('Дене шынықтыру', 'Физическая культура', 'Physical education'), [3, 3, 3, 3], 12),
];
const TUP_KZ_TOTAL = { inv: [18.5, 22, 25, 25, 90.5], vari: [1, 2, 1, 1, 5], max: [19.5, 24, 26, 26, 95.5] };
const TUP_RU = [
  { ...A(X('Тіл және әдебиет', 'Язык и литература', 'Language and literature')), h: [8, 10, 12, 13], w: 43 },
  R(X('Букварь, Обучение грамоте', 'Букварь, Обучение грамоте', 'Primer, Literacy'), [6, null, null, null], 6),
  R(X('Орыс тілі', 'Русский язык', 'Russian language'), [null, 4, 4, 4], 12),
  R(X('Әдебиеттік оқу', 'Литературное чтение', 'Literary reading'), [null, 3, 3, 3], 9),
  R(X('Қазақ тілі', 'Казахский язык', 'Kazakh language'), [2, 3, 3, 4], 12),
  R(X('Шетел тілі', 'Иностранный язык', 'Foreign language'), [null, null, 2, 2], 4),
  ...TUP_KZ.slice(6),
];
const TUP_RU_TOTAL = { inv: [20.5, 23, 26, 27, 96.5], vari: [null, 1, null, null, 1], max: [20.5, 24, 26, 27, 97.5] };
// ---------------------------------------------------------------- grades 5–6: TUP №500, appendices 6–7 (ed. Order No. 323 of 26.10.2023),
// columns 5 and 6 only (the appendices cover grades 5–9). Applies only if the school opens grades 5–6.
const TUP5_TAIL = [
  { ...A(X('Математика және информатика', 'Математика и информатика', 'Mathematics and computing')), h: [6, 6] },
  R(X('Математика', 'Математика', 'Mathematics'), [5, 5]),
  R(X('Информатика', 'Информатика', 'Computer science'), [1, 1]),
  { ...A(X('Жаратылыстану', 'Естествознание', 'Natural science')), h: [2, 2] },
  R(X('Жаратылыстану', 'Естествознание', 'Natural science'), [2, 2]),
  { ...A(X('Адам және қоғам', 'Человек и общество', 'People and society')), h: [3, 3] },
  R(X('Қазақстан тарихы', 'История Казахстана', 'History of Kazakhstan'), [2, 2]),
  R(X('Дүниежүзі тарихы', 'Всемирная история', 'World history'), [1, 1]),
  { ...A(X('Технология және өнер', 'Технология и искусство', 'Technology and arts')), h: [3, 3] },
  R(X('Музыка', 'Музыка', 'Music'), [1, 1]),
  R(X('Көркем еңбек', 'Художественный труд', 'Arts and crafts'), [2, 2]),
  { ...A(X('Дене шынықтыру', 'Физическая культура', 'Physical education')), h: [3, 3] },
  R(X('Дене шынықтыру', 'Физическая культура', 'Physical education'), [3, 3]),
];
const TUP5_KZ = [
  { ...A(X('Тіл және әдебиет', 'Язык и литература', 'Language and literature')), h: [11, 11] },
  R(X('Қазақ тілі', 'Казахский язык', 'Kazakh language'), [3, 3]),
  R(X('Қазақ әдебиеті', 'Казахская литература', 'Kazakh literature'), [2, 2]),
  R(X('Орыс тілі мен әдебиеті', 'Русский язык и литература', 'Russian language and literature'), [3, 3]),
  R(X('Шетел тілі', 'Иностранный язык', 'Foreign language'), [3, 3]),
  ...TUP5_TAIL,
];
const TUP5_RU = [
  { ...A(X('Тіл және әдебиет', 'Язык и литература', 'Language and literature')), h: [12, 12] },
  R(X('Орыс тілі', 'Русский язык', 'Russian language'), [3, 3]),
  R(X('Орыс әдебиеті', 'Русская литература', 'Russian literature'), [2, 2]),
  R(X('Қазақ тілі мен әдебиеті', 'Казахский язык и литература', 'Kazakh language and literature'), [4, 4]),
  R(X('Шетел тілі', 'Иностранный язык', 'Foreign language'), [3, 3]),
  ...TUP5_TAIL,
];
const VARI5 = X('Вариативтік компонент: жаһандық құзыреттілік', 'Вариативный компонент: глобальные компетенции', 'Variable component: global competences');
const TUP5_KZ_TOTAL = { inv: [28, 28], vari: [0.5, 0.5], max: [28.5, 28.5], variName: VARI5 };
const TUP5_RU_TOTAL = { inv: [29, 29], vari: [0.5, 0.5], max: [29.5, 29.5], variName: VARI5 };

/** Maximum weekly load by grade (TUP №500) and the state-standard caps (МЖМБС №348: primary p. 28 — 27 h; basic secondary p. 40 — 30.5 h in grades 5–6). */
export const TUP_MAX = {
  grades: [1, 2, 3, 4, 5, 6],
  kz: [...TUP_KZ_TOTAL.max.slice(0, 4), ...TUP5_KZ_TOTAL.max],
  ru: [...TUP_RU_TOTAL.max.slice(0, 4), ...TUP5_RU_TOTAL.max],
  cap: [27, 27, 27, 27, 30.5, 30.5],
};

/** Grade label in the page language: kz «1-сынып» / «5–6-сыныптар», ru «1 класс», en «grade 1». */
const gradeLbl = (n, lang) => (lang === 'en' ? `grade ${n}` : lang === 'kz' ? `${n}-сынып` : `${n} класс`);

function tupTable(rows, total, caption, { L, lang }, { grades = [1, 2, 3, 4], week = true } = {}) {
  const T = (o) => L(o);
  const heat = (v) => (v == null ? 0 : Math.min(6, Math.ceil(v)));
  const cell = (v) => `<td class="edu-tup__c"><span class="edu-h edu-h--${heat(v)}">${v == null ? '<span aria-hidden="true">–</span><span class="sr-only">0</span>' : num(v, lang)}</span></td>`;
  const n = grades.length;
  const wk = (v) => (week ? `<td class="edu-tup__c edu-tup__w">${num(v, lang)}</td>` : '');
  const head = `<thead><tr><th scope="col" class="edu-tup__subj">${T(X('Білім саласы / пән', 'Область / предмет', 'Area / subject'))}</th>${grades.map((g) => `<th scope="col" class="edu-tup__c"><span aria-hidden="true">${g}</span><span class="sr-only">${gradeLbl(g, lang)}</span></th>`).join('')}${week ? `<th scope="col" class="edu-tup__c edu-tup__w">${T(X('Апта', 'Нед.', 'Week'))}<span class="sr-only"> ${T(X('барлығы', 'всего', 'total'))}</span></th>` : ''}</tr></thead>`;
  const body = rows.map((r) => r.area
    ? (week
      ? `<tr class="edu-tup__area"><th scope="row" colspan="${n + 1}">${T(r.name)}</th>${wk(r.w)}</tr>`
      : `<tr class="edu-tup__area"><th scope="row">${T(r.name)}</th>${r.h.map((v) => `<td class="edu-tup__c edu-tup__w">${num(v, lang)}</td>`).join('')}</tr>`)
    : `<tr><th scope="row" class="edu-tup__subj">${T(r.name)}</th>${r.h.map(cell).join('')}${wk(r.w)}</tr>`).join('');
  const foot = [
    [X('Инварианттық жүктеме', 'Инвариантная нагрузка', 'Invariant load'), total.inv, ''],
    [total.variName || X('Вариативтік компонент*', 'Вариативный компонент*', 'Variable component*'), total.vari, ''],
    [X('Ең жоғары апталық жүктеме', 'Максимальная недельная нагрузка', 'Maximum weekly load'), total.max, ' edu-tup__max'],
  ].map(([k, v, c]) => `<tr class="edu-tup__tot${c}"><th scope="row">${T(k)}</th>${v.slice(0, n).map((x) => `<td class="edu-tup__c">${num(x, lang)}</td>`).join('')}${wk(v[n])}</tr>`).join('');
  return `<figure class="edu-tup-fig"><div class="edu-tup-wrap"><table class="edu-tup${week ? '' : ' edu-tup--56'}"><caption>${caption}</caption>${head}<tbody>${body}</tbody><tfoot>${foot}</tfoot></table></div></figure>`;
}

export default {
  slug: 'curriculum',
  group: 'education',
  order: 10,
  title: X('Оқу жоспары мен бағдарламалар', 'Учебный план и программы', 'Curriculum & programmes'),
  description: X(
    'Жұмыс оқу жоспары, МЖМБС (№348), үлгілік оқу жоспары (№500) мен бағдарламалар (№399), бастауыш сынып пәндері, ӨҚН мен ЖҚЕ, Keremet бағдарламалары.',
    'Рабочий учебный план, ГОСО (№348), типовой учебный план (№500) и программы (№399), предметы начальной школы, ОБЖ и ПДД, программы Keremet.',
    'Working curriculum, state standard (No. 348), standard curriculum (No. 500) and syllabuses (No. 399), primary subjects, safety courses, Keremet programmes.',
  ),
  styles: ['education'],
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, { ui, S, L, href, docById }) {
    const ref = (id, label) => actRef(ui, id, lang, label);

    // ------------------------------------------------------------ intro + stats
    const intro = ui.split({
      ratio: '3:2', align: 'center',
      left: `${ui.eyebrow(X('Оқу процесінің негізі', 'Основа учебного процесса', 'The backbone of learning'))}
<h2 class="sec__title">${L(X('Мемлекеттік стандарттан — сыныптағы сабаққа дейін', 'От государственного стандарта — до урока в классе', 'From the state standard to the lesson in class'))}</h2>
${ui.lead(X(
        'Мектеп мемлекеттік жалпыға міндетті білім беру стандартына, үлгілік оқу жоспары мен үлгілік оқу бағдарламаларына сүйеніп, әр оқу жылына жұмыс оқу жоспарын (ЖОЖ) бекітеді. Төменде — осы құжаттардың не белгілейтіні, бастауыш сыныптардың пәндері мен сағат саны және «Керемет» мектебінің қосымша бағыттары.',
        'Школа ежегодно утверждает рабочий учебный план (РУП) на основе государственного общеобязательного стандарта образования, типового учебного плана и типовых учебных программ. Ниже — что устанавливают эти документы, предметы и часы начальной школы и дополнительные направления школы «Керемет».',
        'Every year the school approves a working curriculum based on the state compulsory education standard, the standard curriculum and the standard syllabuses. Below: what these documents set, the primary-school subjects and hours, and Keremet’s additional programmes.',
      ))}`,
      right: '<!--toc-->',
    });
    const chain = ui.panel({ theme: 'physics', cls: 'edu-chain', body: `<p class="edu-chain__t">${L(X('Құжаттар тізбегі', 'Цепочка документов', 'Document chain'))}</p><ol class="edu-chain__list">
<li><b>${L(X('МЖМБС', 'ГОСО', 'Standard'))}</b><span>№ 348 · ${L(X('нәтижелер мен ең жоғары жүктеме', 'результаты и предельная нагрузка', 'outcomes & maximum load'))}</span></li>
<li><b>${L(X('ҮОЖ', 'ТУП', 'Standard curriculum'))}</b><span>№ 500 · ${L(X('пәндер мен апталық сағаттар', 'предметы и часы в неделю', 'subjects & weekly hours'))}</span></li>
<li><b>${L(X('ҮОБ', 'ТУПр', 'Syllabuses'))}</b><span>№ 399 · ${L(X('әр пәннің мазмұны мен оқу мақсаттары', 'содержание и цели обучения по предметам', 'content & learning objectives'))}</span></li>
<li><b>${L(X('ЖОЖ', 'РУП', 'Working curriculum'))}</b><span>${L(X('мектеп жыл сайын бекітеді', 'школа утверждает ежегодно', 'approved by the school each year'))}</span></li>
<li><b>${L(X('КТЖ', 'КТП', 'Lesson plans'))}</b><span>${L(X('күнтізбелік-тақырыптық жоспарлар', 'календарно-тематические планы', 'calendar-thematic plans'))}</span></li></ol>` });
    const stats = ui.stats([
      { icon: 'graduation', art: true, value: X('4 жыл', '4 года', '4 years'), label: X('Бастауыш білім беру мерзімі', 'Срок начального образования', 'Length of primary education'), note: X('МЖМБС, 46-тармақ', 'ГОСО, п. 46', 'Standard, para. 46'), extra: ui.chips([{ label: X('1–4-сыныптар', '1–4 классы', 'Grades 1–4') }, { label: X('қазақ және орыс тілдерінде', 'на казахском и русском', 'in Kazakh & Russian') }]) },
      { icon: 'clock', value: '≤ 27', label: X('Апталық жүктеменің шегі', 'Предельная недельная нагрузка', 'Max weekly hours'), note: X('бастауыш мектеп, МЖМБС 28-т.', 'начальная школа, ГОСО п. 28', 'primary school, para. 28') },
      { icon: 'book', value: '13', label: X('Инварианттық пәндер', 'Инвариантных предметов', 'Core subjects'), note: X('1–4-сыныптар, ҮОЖ', '1–4 классы, ТУП', 'grades 1–4, standard curriculum') },
      { icon: 'languages', value: '3', label: X('Тіл: қазақ, орыс, шетел', 'Языка: казахский, русский, иностранный', 'Languages: Kazakh, Russian, foreign'), note: X('шетел тілі 3-сыныптан', 'иностранный — с 3 класса', 'foreign language from grade 3') },
      { icon: 'shield', value: '6 + 6', label: X('ӨҚН мен ЖҚЕ, жылына сағат', 'ОБЖ и ПДД, часов в год', 'Safety & road rules, h/year'), note: X('1–3-сыныптар; 4-сыныпта ӨҚН — 10 сағат', '1–3 классы; в 4 классе ОБЖ — 10 часов', 'grades 1–3; grade 4 life safety — 10 h') },
    ], { cls: 'stats--bento' });

    // ------------------------------------------------------------ legal basis
    const basis = ui.cards([
      { icon: 'shield', tag: '№ 348', title: X('МЖМБС — мемлекеттік стандарт', 'ГОСО — государственный стандарт', 'The state standard'), text: X(
        `Білім беру мазмұнына, оқу жүктемесінің ең жоғары көлеміне, оқушылардың дайындық деңгейіне және оқу мерзіміне қойылатын талаптарды белгілейді. ${ref('goso', 'adilet.zan.kz')}`,
        `Устанавливает требования к содержанию образования, максимальному объёму учебной нагрузки, уровню подготовки обучающихся и срокам обучения. ${ref('goso', 'adilet.zan.kz')}`,
        `Sets requirements for content, maximum workload, expected learning outcomes and length of study. ${ref('goso', 'adilet.zan.kz')}`) },
      { icon: 'grid', tag: '№ 500', title: X('ҮОЖ — үлгілік оқу жоспары', 'ТУП — типовой учебный план', 'Standard curriculum'), text: X(
        `Пәндер тізбесін және әр сыныптағы инварианттық (міндетті) пен вариативтік компоненттің апталық сағатын айқындайды. ${ref('tup', 'adilet.zan.kz')}`,
        `Определяет перечень предметов и недельные часы инвариантного (обязательного) и вариативного компонентов по классам. ${ref('tup', 'adilet.zan.kz')}`,
        `Lists the subjects and weekly hours of the core (invariant) and variable components per grade. ${ref('tup', 'adilet.zan.kz')}`) },
      { icon: 'book', tag: '№ 399', title: X('ҮОБ — үлгілік оқу бағдарламалары', 'ТУПр — типовые учебные программы', 'Standard syllabuses'), text: X(
        `Әр пәннің мазмұнын, оқу мақсаттарының жүйесін және ұзақ мерзімді жоспарын белгілейді. ${ref('tupr', 'adilet.zan.kz')}`,
        `Задают содержание каждого предмета, систему целей обучения и долгосрочный план. ${ref('tupr', 'adilet.zan.kz')}`,
        `Define each subject’s content, system of learning objectives and long-term plan. ${ref('tupr', 'adilet.zan.kz')}`) },
    ], { cols: 3 });
    const rupSteps = ui.steps([
      { title: X('Үлгілік оқу жоспарын таңдау', 'Выбор типового учебного плана', 'Choosing the standard curriculum'), text: X('Оқыту тіліне сәйкес: қазақ тілінде оқытатын сыныптар — 1-қосымша, орыс тілінде оқытатын сыныптар — 2-қосымша.', 'По языку обучения: классы с казахским языком — приложение 1, с русским — приложение 2.', 'By language of instruction: Kazakh-medium classes — appendix 1, Russian-medium — appendix 2.') },
      { title: X('Вариативтік компонентті бөлу', 'Распределение вариативного компонента', 'Allocating the variable component'), text: X('Мектеп вариативтік сағаттарды оқушылардың білім беру қажеттіліктеріне қарай дамытушылық сипаттағы жеке және топтық сабақтарға бөледі.', 'Школа распределяет вариативные часы на индивидуальные и групповые занятия развивающего характера с учётом образовательных потребностей обучающихся.', 'The school allocates variable hours to individual and group developmental lessons according to pupils’ needs.') },
      { title: X('Бекіту', 'Утверждение', 'Approval'), text: X(`Оқу ісі жөніндегі орынбасар ЖОЖ-ды оқу жылы басталғанға дейін әзірлейді, директор бекітеді (${ref('docs130', '№ 130 бұйрық, 5–6-тармақтар')}).`, `Заместитель по учебной работе разрабатывает РУП до начала учебного года, директор утверждает (${ref('docs130', 'приказ № 130, пп. 5–6')}).`, `The deputy head for teaching drafts it before the school year and the director approves it (${ref('docs130', 'Order No. 130, paras 5–6')}).`) },
      { title: X('КТЖ және сабақ кестесі', 'КТП и расписание', 'Lesson plans and timetable'), text: X(`Педагогтер ҮОБ негізінде күнтізбелік-тақырыптық жоспар жасайды; ол әдістемелік бірлестікте қаралып, директор бекітеді (${ref('method', '№ 253 бұйрық, 26-т.')}).`, `Педагоги составляют КТП по типовым программам; они рассматриваются на методобъединении и утверждаются директором (${ref('method', 'приказ № 253, п. 26')}).`, `Teachers write calendar-thematic plans from the syllabuses; the subject team reviews them and the director approves (${ref('method', 'Order No. 253, para. 26')}).`) },
    ]);

    // ------------------------------------------------------------ working curriculum 2026–2027
    const rupDocs = ui.docList([docById('curriculum-rup')].filter(Boolean).map((d) => ({ ...d, note: X(
      'Мектеп жүктейді: әр сынып пен оқыту тілі бойынша бекітілген ЖОЖ (PDF), бекіту күні мен бұйрық нөмірі көрсетіледі.',
      'Школа загружает утверждённый РУП по каждому классу и языку обучения (PDF) с датой и номером приказа об утверждении.',
      'To be uploaded by the school: the approved working curriculum per grade and language of instruction (PDF), with the approval date and order number.',
    ) })));
    const rupPending = ui.pending(lang, X(
      '2026–2027 оқу жылына арналған ЖОЖ: қай сыныптар ашық (0–6), оқыту тілі, вариативтік компоненттің қай сабақтарға бөлінгені және тереңдетілген бағыттардың (математика, тілдер) сағаты. 5–6-сыныптар болса, негізгі орта білім берудің үлгілік оқу жоспары (№ 500 бұйрықтың 6–7-қосымшалары) қолданылады.',
      'РУП на 2026–2027 учебный год: какие классы открыты (0–6), язык обучения, на что распределён вариативный компонент и часы углублённых направлений (математика, языки). Если есть 5–6 классы, для них применяется типовой план основного среднего образования (приложения 6–7 к приказу № 500).',
      'Working curriculum for 2026–2027: which grades are open (0–6), language of instruction, how the variable component is used and the hours of the in-depth tracks (maths, languages). If grades 5–6 exist, the lower-secondary standard curriculum (appendices 6–7 of Order No. 500) applies.',
    ));

    // ------------------------------------------------------------ TUP tables
    const ctx = { L, lang };
    const tables = ui.split({
      ratio: '1:1',
      left: tupTable(TUP_KZ, TUP_KZ_TOTAL, L(X('Қазақ тілінде оқытатын сыныптар (1-қосымша)', 'Классы с казахским языком обучения (приложение 1)', 'Kazakh-medium classes (appendix 1)')), ctx),
      right: tupTable(TUP_RU, TUP_RU_TOTAL, L(X('Орыс тілінде оқытатын сыныптар (2-қосымша)', 'Классы с русским языком обучения (приложение 2)', 'Russian-medium classes (appendix 2)')), ctx),
    });
    const opt56 = { grades: [5, 6], week: false };
    const tables56 = ui.split({
      ratio: '1:1',
      left: tupTable(TUP5_KZ, TUP5_KZ_TOTAL, L(X('5–6-сыныптар, қазақ тілінде оқыту (6-қосымша)', '5–6 классы с казахским языком обучения (приложение 6)', 'Grades 5–6, Kazakh-medium (appendix 6)')), ctx, opt56),
      right: tupTable(TUP5_RU, TUP5_RU_TOTAL, L(X('5–6-сыныптар, орыс тілінде оқыту (7-қосымша)', '5–6 классы с русским языком обучения (приложение 7)', 'Grades 5–6, Russian-medium (appendix 7)')), ctx, opt56),
    });
    const block56 = `<h3 id="tup-56">${L(X('5–6-сыныптар (ашылған жағдайда)', '5–6 классы (если открыты)', 'Grades 5–6 (if opened)'))}</h3>
<p class="edu-src">${L(X(
      `Мектеп парақшасында 0–6-сыныптар көрсетілген. 5–6-сыныптар ашылса, оларға негізгі орта білім берудің үлгілік оқу жоспары қолданылады: ${ref('tup', '№ 500 бұйрықтың 6–7-қосымшалары')} (ҚР Оқу-ағарту министрінің 2023 жылғы 26 қазандағы № 323 бұйрығының редакциясы). Кестеде — осы қосымшалардың 5- және 6-сынып бағандары, аптасына сағат. МЖМБС бойынша 5–6-сыныптарда апталық жүктеме 30,5 сағаттан аспауы тиіс (негізгі орта білім беру стандарты, 40-т.).`,
      `На странице школы указаны 0–6 классы. Если открыты 5–6 классы, для них применяется типовой учебный план основного среднего образования: ${ref('tup', 'приложения 6–7 к приказу № 500')} (в ред. приказа Министра просвещения РК от 26 октября 2023 года № 323). В таблицах — столбцы 5 и 6 классов из этих приложений, часов в неделю. По ГОСО недельная нагрузка в 5–6 классах — не более 30,5 часа (стандарт основного среднего образования, п. 40).`,
      `The school’s page lists grades 0–6. If grades 5–6 are opened, the lower-secondary standard curriculum applies: ${ref('tup', 'appendices 6–7 of Order No. 500')} (as amended by Order No. 323 of 26 October 2023). The tables show the grade 5 and grade 6 columns of those appendices, hours per week. Under the state standard, the weekly load in grades 5–6 may not exceed 30.5 hours (lower-secondary standard, para. 40).`,
    ))}</p>`;
    const tupLegend = `<p class="edu-legend" aria-hidden="true"><span>${L(X('Аптасына сағат:', 'Часов в неделю:', 'Hours per week:'))}</span>${[1, 2, 3, 4, 5, 6].map((n) => `<span class="edu-h edu-h--${n}">${n}</span>`).join('')}</p>`;
    const tupNotes = ui.accordion([
      { q: X('* Вариативтік компонент дегеніміз не?', '* Что такое вариативный компонент?', '* What is the variable component?'), a: ui.prose(X(
        '<p>Үлгілік жоспарда ол «дамытушылық сипаттағы жеке және топтық сабақтар» деп аталады. Сағаттарды мектеп оқушылардың қажеттілігіне қарай бөледі; барлық сағат ең жоғары апталық жүктеме шегінде болуы тиіс. «Керемет» мектебінің тереңдетілген математика мен тілдерге қанша сағат бөлгені ЖОЖ-да көрсетіледі.</p>',
        '<p>В типовом плане он называется «индивидуальные и групповые занятия развивающего характера». Часы распределяет школа с учётом потребностей обучающихся; все часы укладываются в максимальную недельную нагрузку. Сколько часов «Керемет» отводит на углублённую математику и языки, будет указано в РУП.</p>',
        '<p>In the standard curriculum it is called “individual and group developmental lessons”. The school allocates these hours by pupils’ needs, within the maximum weekly load. The hours Keremet gives to in-depth maths and languages will be shown in its working curriculum.</p>')) },
      { q: X('Қай пәндер бағаланбайды?', 'Какие предметы не оцениваются баллами?', 'Which subjects are not graded?'), a: ui.prose(X('<p>1-сыныпта оқу жетістіктері бағаланбайды (№ 125 қағидалар, 7-т.).</p>', '<p>В 1 классе учебные достижения не оцениваются (правила № 125, п. 7).</p>', '<p>Grade 1 achievements are not graded (rules No. 125, para. 7).</p>')) + ui.prose(passFail(X(
        ` Толығырақ: <a href="${href('assessment')}">Бағалау және нәтижелер</a>.`,
        ` Подробнее: <a href="${href('assessment')}">Оценивание и результаты</a>.`,
        ` More: <a href="${href('assessment')}">Assessment & results</a>.`))) },
    ]);

    // ------------------------------------------------------------ typical programmes (399)
    const P = (kz, ru, en, grades, lng) => [X(kz, ru, en), grades, lng];
    const both = X('барлық сыныптар', 'все классы', 'all classes');
    const kzOnly = X('қазақ тілінде оқытатын сыныптар', 'классы с казахским языком обучения', 'Kazakh-medium classes');
    const ruOnly = X('орыс тілінде оқытатын сыныптар', 'классы с русским языком обучения', 'Russian-medium classes');
    const progRows = [
      P('«Әліппе», «Ана тілі»', '«Әліппе», «Ана тілі»', '“Alippe”, “Ana tili”', '1', kzOnly),
      P('«Букварь», «Обучение грамоте»', '«Букварь», «Обучение грамоте»', '“Bukvar”, “Literacy”', '1', ruOnly),
      P('«Қазақ тілі», «Әдебиеттік оқу»', '«Казахский язык», «Литературное чтение»', 'Kazakh language, Literary reading', '2–4', kzOnly),
      P('«Орыс тілі», «Әдебиеттік оқу»', '«Русский язык», «Литературное чтение»', 'Russian language, Literary reading', '2–4', ruOnly),
      P('«Қазақ тілі» (қазақ тілінде оқытпайтын сыныптар)', '«Казахский язык» (классы с неказахским языком обучения)', 'Kazakh as a second language', '1–4', ruOnly),
      P('«Орыс тілі» (орыс тілінде оқытпайтын сыныптар)', '«Русский язык» (классы с нерусским языком обучения)', 'Russian as a second language', '2–4', kzOnly),
      P('«Ағылшын тілі» (сондай-ақ неміс, француз тілдері)', '«Английский язык» (а также немецкий, французский)', 'English (also German, French)', '3–4', both),
      P('«Математика»', '«Математика»', 'Mathematics', '1–4', both),
      P('«Цифрлық сауаттылық»', '«Цифровая грамотность»', 'Digital literacy', '1–4', both),
      P('«Жаратылыстану»', '«Естествознание»', 'Natural science', '1–4', both),
      P('«Дүниетану»', '«Познание мира»', 'Knowledge of the world', '1–4', both),
      P('«Бейнелеу өнері», «Еңбекке баулу», «Музыка»', '«Изобразительное искусство», «Трудовое обучение», «Музыка»', 'Visual arts, Labour training, Music', '1–4', both),
      P('«Дене шынықтыру»', '«Физическая культура»', 'Physical education', '1–4', both),
    ];
    const progTable = `<p class="edu-prog__cap">${L(X('Бастауыш білім беру деңгейінің үлгілік оқу бағдарламалары (№ 399 бұйрық)', 'Типовые учебные программы уровня начального образования (приказ № 399)', 'Primary-level standard syllabuses (Order No. 399)'))}</p>
<p class="edu-prog__legend">${L(X('Белгілер: сынып және бағдарлама арналған сыныптардың оқыту тілі.', 'Метки: классы и язык обучения классов, для которых предназначена программа.', 'Badges: grades, and the language of instruction of the classes the syllabus is for.'))}</p>
<ul class="edu-prog" role="list">${progRows.map(([n, g, l]) => `<li><span class="edu-prog__n">${L(n)}</span><span class="edu-prog__m"><span class="badge badge--info">${L(X(g.includes("–") ? `${g}-сыныптар` : `${g}-сынып`, `${g} кл.`, g.includes("–") ? `grades ${g}` : `grade ${g}`))}</span><span class="badge">${L(l)}</span></span></li>`).join('')}</ul>`;
    const progNote = ui.note(X(
      `Бағдарламалардың толық мәтіні (мазмұны, оқу мақсаттары, ұзақ мерзімді жоспар): ${ref('tupr')}. № 399 бұйрыққа 2024 жылғы 5 қарашадағы № 323 бұйрықпен енгізілген өзгерістер 2025 жылғы 1 қыркүйектен бастап қолданылады.`,
      `Полный текст программ (содержание, цели обучения, долгосрочный план): ${ref('tupr')}. Изменения, внесённые в приказ № 399 приказом № 323 от 5 ноября 2024 года, действуют с 1 сентября 2025 года.`,
      `Full texts (content, learning objectives, long-term plans): ${ref('tupr')}. Amendments made to Order No. 399 by Order No. 323 of 5 November 2024 apply from 1 September 2025.`,
    ));

    // ------------------------------------------------------------ OBZh / PDD
    const course = (icon, name, hours, who) => `<article class="edu-course"><header><span class="card__icon">${ui.icon(icon, { size: 24 })}</span><h3>${L(name)}</h3></header>
<dl class="edu-course__h">${hours.map((h, i) => `<div><dt>${L(X(`${i + 1}-сынып`, `${i + 1} класс`, `Grade ${i + 1}`))}</dt><dd><b>${h}</b> ${L(X('сағ/жыл', 'ч/год', 'h/yr'))}</dd></div>`).join('')}</dl>
<p class="edu-course__who">${ui.icon('user', { size: 16 })}<span>${L(who)}</span></p></article>`;
    const safetyTable = `<p class="edu-prog__cap">${L(X('Жылдық сағат саны, 1–4-сыныптар (МЖМБС, 25–26-тармақтар)', 'Часов в год, 1–4 классы (ГОСО, пп. 25–26)', 'Hours per year, grades 1–4 (standard, paras 25–26)'))}</p><div class="edu-courses">${
      course('shield', X('Өмір қауіпсіздігінің негіздері (ӨҚН)', 'Основы безопасности жизнедеятельности (ОБЖ)', 'Basics of life safety'), [6, 6, 6, 10], X('бастауыш сынып мұғалімдері, «Дүниетану» пәні шеңберінде', 'учителя начальных классов в рамках предмета «Познание мира»', 'primary teachers within “Knowledge of the world”'))
    }${
      course('compass', X('Жол қозғалысы ережелері (ЖҚЕ)', 'Правила дорожного движения (ПДД)', 'Road safety rules'), [6, 6, 6, 6], X('сынып жетекшілері, сынып сағаттары есебінен және сабақтан тыс уақытта', 'классные руководители за счёт классных часов и во внеурочное время', 'class teachers, in form periods and after lessons'))
    }</div>`;
    const safetyPending = ui.docList([
      docById('life-safety-topics'),
      docById('road-safety-plan'),
    ]);

    // ------------------------------------------------------------ Keremet programmes
    const keremet = ui.cards(S.programmes.map((p) => ({ icon: p.icon, title: p.label })), { cols: 3, cls: 'edu-kprog' });
    const keremetSrc = ui.note(X(
      `Дереккөз: мектептің 12.08.2025 жарияланған қабылдау туралы хабарландыруы (${ui.extLink('https://www.instagram.com/p/DNR-UIYM5uW/', 'instagram.com')}).`,
      `Источник: объявление школы о приёме от 12.08.2025 (${ui.extLink('https://www.instagram.com/p/DNR-UIYM5uW/', 'instagram.com')}).`,
      `Source: the school’s admission announcement of 12.08.2025 (${ui.extLink('https://www.instagram.com/p/DNR-UIYM5uW/', 'instagram.com')}).`,
    ));
    const keremetPending = ui.pending(lang, X(
      'Әр бағыт бойынша нақтыланады: қай сыныптарға арналғаны, аптасына қанша сағат, ЖОЖ-дың вариативтік компоненті есебінен өте ме, әлде тегін үйірме ретінде өте ме, қолданылатын оқу-әдістемелік кешен.',
      'По каждому направлению уточняется: для каких классов, сколько часов в неделю, проводится ли оно за счёт вариативного компонента РУП или как бесплатный кружок, какой УМК используется.',
      'For each programme the school will confirm: which grades, hours per week, whether it runs within the variable component or as a free club, and which teaching materials are used.',
    ));
    const extra = ui.split({
      ratio: '1:1',
      left: ui.callout({ type: 'info', title: X('Бейіндік оқыту', 'Профильное обучение', 'Specialised (profile) streams'), text: X(
        'Бейіндік оқыту жалпы орта білім беру деңгейінде (10–11-сыныптар) ұйымдастырылады. Мектеп парақшасында көрсетілген сынып аралығында (0–6) ол қолданылмайды; ашылған жағдайда осы бөлімде жарияланады.',
        'Профильное обучение организуется на уровне общего среднего образования (10–11 классы). При указанном на странице школы диапазоне классов (0–6) оно не применяется; при открытии будет опубликовано в этом разделе.',
        'Profile streams exist at upper-secondary level (grades 10–11). They do not apply to the grade range stated by the school (0–6); if opened, they will be listed here.') }),
      right: ui.pending({ title: X('Факультативтер мен таңдау курстары', 'Факультативы и курсы по выбору', 'Optional and elective courses'), note: X('2026–2027 оқу жылындағы факультативтер тізімі, сыныптары мен сағаты.', 'Перечень факультативов на 2026–2027 учебный год, классы и часы.', 'List of optional courses for 2026–2027, grades and hours.') }),
    });

    const related = ui.linkList([
      { href: href('schedule'), icon: 'calendar', label: X('Сабақ кестесі және оқу жылы', 'Расписание и учебный год', 'Timetable & school year'), note: X('Демалыстар, апталық жүктеме', 'Каникулы, недельная нагрузка', 'Holidays, weekly load') },
      { href: href('assessment'), icon: 'target', label: X('Бағалау және нәтижелер', 'Оценивание и результаты', 'Assessment & results'), note: X('ҚБ, БЖБ, ТЖБ', 'ФО, СОр, СОч', 'Formative & summative') },
      { href: href('methodical'), icon: 'bulb', label: X('Әдістемелік жұмыс', 'Методическая работа', 'Methodological work') },
      { href: href('clubs'), icon: 'sparkles', label: X('Үйірмелер', 'Кружки', 'Clubs'), note: X('Робототехника, бағдарламалау, спорт', 'Робототехника, программирование, спорт', 'Robotics, coding, sport') },
      { href: href('legislation'), icon: 'scale', label: X('Нормативтік құқықтық актілер', 'Нормативные правовые акты', 'Legislation') },
    ]);
    const acts = ui.linkList(actItems(['goso', 'tup', 'tupr', 'docs130', 'method'], lang)) + ui.note(checkedNote);

    const toc = ui.toc([
      { id: 'basis', label: X('Нормативтік негіз', 'Нормативная основа', 'Legal basis') },
      { id: 'rup', label: X('Жұмыс оқу жоспары 2026–2027', 'Рабочий учебный план 2026–2027', 'Working curriculum 2026–2027') },
      { id: 'tup', label: X('Бастауыш сынып пәндері', 'Предметы начальной школы', 'Primary subjects') },
      { id: 'programmes', label: X('Үлгілік оқу бағдарламалары', 'Типовые учебные программы', 'Standard syllabuses') },
      { id: 'safety', label: X('ӨҚН және ЖҚЕ', 'ОБЖ и ПДД', 'Safety courses') },
      { id: 'keremet', label: X('Keremet бағдарламалары', 'Программы Keremet', 'Keremet programmes') },
      { id: 'acts', label: X('Құқықтық актілер', 'Правовые акты', 'Legal acts') },
    ]);

    return [
      intro.replace('<!--toc-->', toc),
      stats,
      ui.section({ id: 'basis', eyebrow: X('Үш негізгі құжат', 'Три базовых документа', 'Three key documents'), title: X('Нормативтік негіз', 'Нормативная основа', 'Legal basis'), body: basis + `<h3>${L(X('Жұмыс оқу жоспары қалай жасалады', 'Как составляется рабочий учебный план', 'How the working curriculum is built'))}</h3>` + ui.split({ ratio: '3:2', left: rupSteps, right: chain }) }),
      ui.section({ id: 'rup', eyebrow: X('Ағымдағы оқу жылы', 'Текущий учебный год', 'Current school year'), title: X('Жұмыс оқу жоспары 2026–2027', 'Рабочий учебный план 2026–2027', 'Working curriculum 2026–2027'), body: rupDocs + rupPending }),
      ui.section({ id: 'tup', tone: 'physics', eyebrow: X('Үлгілік оқу жоспары, № 500', 'Типовой учебный план, № 500', 'Standard curriculum, No. 500'), title: X('Бастауыш сыныптардың пәндері мен сағаттары', 'Предметы и часы начальной школы', 'Primary subjects and weekly hours'), lead: X('1–4-сыныптар, аптасына сағат. 2025 жылғы 1 қыркүйектен бастап қолданылатын редакция (2024 жылғы 27 маусымдағы № 161 бұйрық).', '1–4 классы, часов в неделю. Редакция, действующая с 1 сентября 2025 года (приказ № 161 от 27 июня 2024 года).', 'Grades 1–4, hours per week. Edition in force since 1 September 2025 (Order No. 161 of 27 June 2024).'), body: tupLegend + tables + tupNotes + block56 + tables56 }),
      ui.section({ id: 'programmes', eyebrow: X('Не оқытамыз', 'Чему учим', 'What we teach'), title: X('Үлгілік оқу бағдарламалары', 'Типовые учебные программы', 'Standard syllabuses'), body: progTable + progNote }),
      ui.section({ id: 'safety', eyebrow: X('Міндетті курстар', 'Обязательные курсы', 'Compulsory courses'), title: X('Өмір қауіпсіздігінің негіздері және жол қозғалысы ережелері', 'ОБЖ и правила дорожного движения', 'Life safety and road rules'), lead: X('Екі курс та 1–4-сыныптарда міндетті түрде оқытылады.', 'Оба курса обязательны в 1–4 классах.', 'Both courses are compulsory in grades 1–4.'), body: safetyTable + safetyPending }),
      ui.section({ id: 'keremet', tone: 'hero', eyebrow: X('Мектептің ерекшелігі', 'Особенность школы', 'What’s special'), title: X('«Керемет» мектебінің бағдарламалары', 'Программы школы «Керемет»', 'Keremet’s programmes'), lead: X('Мемлекеттік стандартқа қосымша мектеп жариялаған бағыттар.', 'Направления, которые школа заявляет в дополнение к государственному стандарту.', 'Tracks the school offers on top of the state standard.'), body: keremet + keremetSrc + keremetPending }),
      ui.section({ title: X('Бейіндік оқыту және факультативтер', 'Профильное обучение и факультативы', 'Profile streams and optional courses'), body: extra }),
      ui.section({ id: 'acts', eyebrow: 'adilet.zan.kz', title: X('Құқықтық актілер', 'Правовые акты', 'Legal acts'), body: acts }),
      ui.banner({ theme: 'physics', icon: 'calendar', eyebrow: X('Келесі бет', 'Следующая страница', 'Next'), title: X('Оқу жылы қашан басталып, қашан аяқталады?', 'Когда начинается и заканчивается учебный год?', 'When does the school year start and end?'), text: X('2026–2027 оқу жылының ресми күнтізбесі мен демалыстары.', 'Официальный календарь 2026–2027 учебного года и каникулы.', 'The official 2026–2027 calendar and holidays.'), href: href('schedule'), label: X('Сабақ кестесі', 'Расписание', 'Timetable') }),
      ui.section({ title: X('Осы бөлімде', 'В этом разделе', 'In this section'), body: related }),
    ].join('\n');
  },
};
