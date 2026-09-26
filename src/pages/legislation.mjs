// Legislation — normative legal acts that govern the school (ORDER-114 §K item 74).
// Every act below was opened on adilet.zan.kz (rus + kaz, eng where marked) on 24.09.2026 and its
// requisites (date, number, Ministry of Justice registration) copied from the act's own header.
// Kazakh titles are the official ones shown by adilet (for №564 and №598 the long official title is shortened — marked).
import { dxFilterScript } from './documents.mjs';

const X = (kz, ru, en) => ({ kz, ru, en });
export const ADILET = 'https://adilet.zan.kz';
export const VERIFIED = '2026-09-24';

/** adilet.zan.kz URL of an act for the given site language (en → English text only where it exists). */
export function adiletUrl(act, lang) {
  const l = lang === 'kz' ? 'kaz' : lang === 'en' && act.en ? 'eng' : 'rus';
  return `${ADILET}/${l}/docs/${act.code}`;
}

const MIN_EDU = X('ҚР Оқу-ағарту министрінің бұйрығы', 'Приказ Министра просвещения РК', 'Order of the Minister of Education of Kazakhstan');
const MIN_MON = X('ҚР Білім және ғылым министрінің бұйрығы', 'Приказ Министра образования и науки РК', 'Order of the Minister of Education and Science of Kazakhstan');
const MIN_CULT = X('ҚР Мәдениет және ақпарат министрінің бұйрығы', 'Приказ Министра культуры и информации РК', 'Order of the Minister of Culture and Information of Kazakhstan');
const LAW = X('Қазақстан Республикасының Заңы', 'Закон Республики Казахстан', 'Law of the Republic of Kazakhstan');

export const CATS = [
  { id: 'laws', icon: 'scale', label: X('Заңдар', 'Законы', 'Laws') },
  { id: 'content', icon: 'book', label: X('Білім мазмұны', 'Содержание образования', 'Curriculum & standards') },
  { id: 'org', icon: 'school', label: X('Мектеп қызметі', 'Деятельность школы', 'School operation') },
  { id: 'quality', icon: 'shield', label: X('Сапа, лицензия, сайт', 'Качество, лицензия, сайт', 'Quality, licence, website') },
];

export const ACTS = [
  // ------------------------------------------------------------------ laws
  { id: 'edu', code: 'Z070000319_', cat: 'laws', kind: 'law', en: true, date: '2007-07-27', number: '319-III', issuer: LAW,
    short: X('Білім туралы', 'Об образовании', 'On Education'),
    title: X('«Білім туралы»', '«Об образовании»', '“On Education”'),
    why: X('Білім беру жүйесінің негізі: білім беру ұйымдарының құқықтары мен міндеттері, білім алушылар мен ата-аналардың құқықтары.', 'Основа системы образования: права и обязанности организаций образования, обучающихся и родителей.', 'The foundation of the education system: rights and duties of schools, pupils and parents.') },
  { id: 'teacher', code: 'Z1900000293', cat: 'laws', kind: 'law', en: true, date: '2019-12-27', number: '293-VI', issuer: LAW,
    short: X('Педагог мәртебесі', 'Статус педагога', 'Teacher status'),
    title: X('«Педагог мәртебесі туралы»', '«О статусе педагога»', '“On the Status of a Teacher”'),
    why: X('Педагогтің құқықтары, кепілдіктері мен міндеттері, оның кәсіби абыройын қорғау.', 'Права, гарантии и обязанности педагога, защита его профессиональной чести.', 'Teachers’ rights, guarantees and duties, and protection of their professional honour.') },
  { id: 'child', code: 'Z020000345_', cat: 'laws', kind: 'law', en: true, date: '2002-08-08', number: '345', issuer: LAW,
    short: X('Бала құқықтары', 'Права ребёнка', 'Rights of the child'),
    title: X('«Қазақстан Республикасындағы баланың құқықтары туралы»', '«О правах ребенка в Республике Казахстан»', '“On the Rights of the Child in the Republic of Kazakhstan”'),
    why: X('Баланың білім алуға, қорғалуға және өз пікірін білдіруге құқығы.', 'Право ребёнка на образование, защиту и выражение своего мнения.', 'The child’s right to education, protection and to express their views.') },
  { id: 'info', code: 'Z1500000401', cat: 'laws', kind: 'law', en: true, date: '2015-11-16', number: '401-V', issuer: LAW,
    short: X('Ақпаратқа қол жеткізу', 'Доступ к информации', 'Access to information'),
    title: X('«Ақпаратқа қол жеткізу туралы»', '«О доступе к информации»', '“On Access to Information”'),
    why: X('Сайттың мазмұнына, жаңарту мерзімдеріне, тілдеріне және қолжетімділігіне қойылатын талаптар.', 'Требования к содержанию сайта, срокам обновления, языкам и доступности.', 'Requirements for website content, update deadlines, languages and accessibility.') },
  { id: 'pd', code: 'Z1300000094', cat: 'laws', kind: 'law', en: true, date: '2013-05-21', number: '94-V', issuer: LAW,
    short: X('Дербес деректер', 'Персональные данные', 'Personal data'),
    title: X('«Дербес деректер және оларды қорғау туралы»', '«О персональных данных и их защите»', '“On Personal Data and Their Protection”'),
    why: X('Сайттағы нысандар арқылы жиналатын деректерді өңдеу және қорғау тәртібі.', 'Порядок обработки и защиты данных, собираемых через формы сайта.', 'How data collected through the site’s forms is processed and protected.'), page: 'privacy' },
  { id: 'corr', code: 'Z1500000410', cat: 'laws', kind: 'law', en: true, date: '2015-11-18', number: '410-V', issuer: LAW,
    short: X('Сыбайлас жемқорлыққа қарсы іс-қимыл', 'Противодействие коррупции', 'Combating corruption'),
    title: X('«Сыбайлас жемқорлыққа қарсы іс-қимыл туралы»', '«О противодействии коррупции»', '“On Combating Corruption”'),
    why: X('Сыбайлас жемқорлық туралы хабарлау тәртібі және хабарлаған адамды қорғау кепілдіктері.', 'Порядок сообщения о коррупции и гарантии защиты сообщившего.', 'How to report corruption and how whistle-blowers are protected.'), page: 'anticorruption' },

  // ------------------------------------------------------------------ curriculum & standards
  { id: 'goso', code: 'V2200029031', cat: 'content', kind: 'order', en: false, date: '2022-08-03', number: '348', issuer: MIN_EDU, reg: { date: '2022-08-05', no: '29031' },
    short: X('МЖМБС', 'ГОСО', 'State standards'),
    title: X('Мектепке дейінгі тәрбие мен оқытудың, бастауыш, негізгі орта, жалпы орта, техникалық және кәсіптік, орта білімнен кейінгі білім берудің мемлекеттік жалпыға міндетті стандарттарын бекіту туралы',
      'Об утверждении государственных общеобязательных стандартов дошкольного воспитания и обучения, начального, основного среднего и общего среднего, технического и профессионального, послесреднего образования',
      'On approval of the state compulsory standards of preschool, primary, basic secondary, general secondary, technical and vocational and post-secondary education'),
    why: X('Әр деңгейдегі білім мазмұнына, оқу жүктемесіне және күтілетін нәтижелерге қойылатын талаптар.', 'Требования к содержанию образования, учебной нагрузке и ожидаемым результатам на каждом уровне.', 'Requirements for content, workload and expected results at each level.'), page: 'curriculum' },
  { id: 'tup', code: 'V1200008170', cat: 'content', kind: 'order', en: false, date: '2012-11-08', number: '500', issuer: MIN_MON, reg: { date: '2012-12-10', no: '8170' },
    short: X('Үлгілік оқу жоспарлары', 'ТУП', 'Model curricula'),
    title: X('Қазақстан Республикасындағы бастауыш, негізгі орта, жалпы орта білім берудің үлгілік оқу жоспарларын бекіту туралы',
      'Об утверждении типовых учебных планов начального, основного среднего, общего среднего образования Республики Казахстан',
      'On approval of the model curricula of primary, basic secondary and general secondary education of the Republic of Kazakhstan'),
    why: X('Мектептің жұмыс оқу жоспары (ЖОЖ) осы үлгілік жоспарлар негізінде жасалады.', 'На основе типовых планов школа составляет свой рабочий учебный план (РУП).', 'The school’s working curriculum is built on these model curricula.'), page: 'curriculum' },
  { id: 'tupr', code: 'V2200029767', cat: 'content', kind: 'order', en: false, date: '2022-09-16', number: '399', issuer: MIN_EDU, reg: { date: '2022-09-23', no: '29767' },
    short: X('Үлгілік оқу бағдарламалары', 'ТУПр', 'Model syllabuses'),
    title: X('Бастауыш, негізгі орта және жалпы орта білім деңгейлерінің жалпы білім беретін пәндері мен таңдау курстары бойынша үлгілік оқу бағдарламаларын бекіту туралы',
      'Об утверждении типовых учебных программ по общеобразовательным предметам и курсам по выбору уровней начального, основного среднего и общего среднего образования',
      'On approval of model syllabuses for general education subjects and elective courses at the primary, basic secondary and general secondary levels'),
    why: X('Әр пән бойынша оқу мақсаттары мен мазмұны.', 'Цели обучения и содержание по каждому предмету.', 'Learning objectives and content for every subject.'), page: 'curriculum' },
  { id: 'assess', code: 'V080005191_', cat: 'content', kind: 'order', en: false, date: '2008-03-18', number: '125', issuer: MIN_MON, reg: { date: '2008-04-21', no: '5191' },
    short: X('Бағалау', 'Оценивание', 'Assessment'),
    title: X('Орта, техникалық және кәсіптік, орта білімнен кейінгі білім беру ұйымдары үшін білім алушылардың үлгеріміне ағымдағы бақылауды, оларды аралық және қорытынды аттестаттауды өткізудің үлгілік қағидаларын бекіту туралы',
      'Об утверждении Типовых правил проведения текущего контроля успеваемости, промежуточной и итоговой аттестации обучающихся для организаций среднего, технического и профессионального, послесреднего образования',
      'On approval of the Model Rules for ongoing assessment, interim and final attestation of students in secondary, technical and vocational and post-secondary education'),
    why: X('Критериалды бағалау: ағымдағы бағалау, БЖБ, ТЖБ, тоқсандық және қорытынды бағалар.', 'Критериальное оценивание: текущее, СОр, СОч, четвертные и итоговые оценки.', 'Criteria-based assessment: ongoing, unit and term summatives, term and final marks.'), page: 'assessment' },

  // ------------------------------------------------------------------ school operation
  { id: 'rules', code: 'V2200029329', cat: 'org', kind: 'order', en: false, date: '2022-08-31', number: '385', issuer: MIN_EDU, reg: { date: '2022-08-31', no: '29329' },
    short: X('Қызметтің үлгілік қағидалары', 'Типовые правила деятельности', 'Model rules of activity'),
    title: X('Жоғары және жоғары оқу орнынан кейінгі білім беру ұйымдарын қоспағанда, тиісті типтердегі және түрлердегі білім беру ұйымдары қызметінің үлгілік қағидаларын бекіту туралы',
      'Об утверждении Типовых правил деятельности организаций образования соответствующих типов и видов, за исключением организаций высшего и послевузовского образования',
      'On approval of the Model Rules of activity of educational organisations of the relevant types and kinds, except higher and postgraduate education'),
    why: X('Мектептің жұмыс тәртібі, оқу жылы, сынып толымдылығы, алқалы органдар.', 'Режим работы школы, учебный год, наполняемость классов, коллегиальные органы.', 'School operating regime, school year, class sizes and collegial bodies.'), page: 'structure' },
  { id: 'admission', code: 'V1800017553', cat: 'org', kind: 'order', en: true, date: '2018-10-12', number: '564', issuer: MIN_MON, reg: { date: '2018-10-16', no: '17553' }, shortened: true,
    short: X('Қабылдаудың үлгілік қағидалары', 'Типовые правила приёма', 'Model admission rules'),
    title: X('Бастауыш, негізгі орта және жалпы орта білімнің жалпы білім беретін оқу бағдарламаларын іске асыратын білім беру ұйымдарына оқуға қабылдаудың үлгілік қағидаларын бекіту туралы',
      'Об утверждении Типовых правил приема на обучение в организации образования, реализующие общеобразовательные учебные программы начального, основного среднего и общего среднего образования',
      'On approval of the Model Rules for Admission to studies in educational organizations, implementing general educational curricula of primary, basic secondary and general secondary education'),
    why: X('1-сыныпқа және басқа сыныптарға қабылдау, құжаттар тізбесі, мерзімдер, egov.kz қызметі.', 'Приём в 1 класс и другие классы, перечень документов, сроки, услуга на egov.kz.', 'Admission to grade 1 and other grades, documents, deadlines, the egov.kz service.'), page: 'admission' },
  { id: 'distance', code: 'V2300033682', cat: 'org', kind: 'order', en: false, date: '2023-11-27', number: '349', issuer: MIN_EDU, reg: { date: '2023-11-27', no: '33682' },
    short: X('Қашықтан оқыту', 'Дистанционное обучение', 'Distance learning'),
    title: X('Орта, қосымша, техникалық және кәсіптік, орта білімнен кейінгі білім беру ұйымдарында, оның ішінде қолайсыз ауа райы метеожағдайларында, сондай-ақ тиісті әкімшілік-аумақтық бірліктерде (жекелеген объектілерде) төтенше жағдай, шектеу іс-шаралары, оның ішінде карантин енгізілген, төтенше жағдайлар жарияланған кезде қашықтан оқыту бойынша және техникалық және кәсіптік, орта білімнен кейінгі білімнің білім беретін оқу бағдарламаларын іске асыратын білім беру ұйымдарында онлайн-оқыту нысанында оқу процесін ұйымдастыру қағидаларын, сондай-ақ қашықтан оқытуды ұсыну бойынша білім беру ұйымдарына қойылатын талаптарын бекіту туралы',
      'Об утверждении правил организации учебного процесса по дистанционному обучению в организациях среднего, дополнительного, технического и профессионального, послесреднего образования, в том числе при неблагоприятных погодных метеоусловиях, а также при введении чрезвычайного положения, ограничительных мероприятий, в том числе карантина, на соответствующих административно-территориальных единицах (на отдельных объектах), при объявлении чрезвычайных ситуаций и в форме онлайн-обучения в организациях образования, реализующих образовательные учебные программы технического и профессионального, послесреднего образования, а также требований к организациям образования по предоставлению дистанционного обучения',
      'On approval of the rules for organising distance learning in secondary, additional, technical and vocational and post-secondary education (including in adverse weather, states of emergency, quarantine and emergencies), online learning in TVET and post-secondary education, and the requirements for education organisations providing distance learning'),
    why: X('Ауа райы қолайсыз болғанда, карантин мен төтенше жағдайларда оқуды ұйымдастыру тәртібі.', 'Порядок обучения при непогоде, карантине и чрезвычайных ситуациях.', 'How learning is organised during bad weather, quarantine and emergencies.'), page: 'distance' },
  { id: 'board', code: 'V1700015584', cat: 'org', kind: 'order', en: false, date: '2017-07-27', number: '355', issuer: MIN_MON, reg: { date: '2017-08-29', no: '15584' },
    short: X('Қамқоршылық кеңес', 'Попечительский совет', 'Board of Trustees'),
    title: X('Білім беру ұйымдарында қамқоршылық кеңестің жұмысын ұйымдастыру және оны сайлау тәртібінің үлгілік қағидаларын бекіту туралы',
      'Об утверждении Типовых правил организации работы Попечительского совета и порядок его избрания в организациях образования',
      'On approval of the Model Rules for organising the work of the Board of Trustees and the procedure for its election in educational organisations'),
    why: X('Кеңесті сайлау, отырыстар, шешімдерді сайтта жариялау, қайырымдылық көмекті жұмсау тәртібі.', 'Избрание совета, заседания, публикация решений на сайте, расходование благотворительной помощи.', 'Electing the board, meetings, publishing decisions, spending charitable aid.'), page: 'board' },
  { id: 'meals', code: 'V1800017948', cat: 'org', kind: 'order', en: true, date: '2018-10-31', number: '598', issuer: MIN_MON, reg: { date: '2018-12-14', no: '17948' }, shortened: true,
    short: X('Тамақтануды ұйымдастыру', 'Организация питания', 'School meals'),
    title: X('Мемлекеттік орта, техникалық және кәсіптік, орта білімнен кейінгі білім беру ұйымдарында, қосымша білім беретін мектептен тыс ұйымдарда білім алушыларды тамақтандыруды ұйымдастыру қағидаларын бекіту туралы',
      'Об утверждении Правил организации питания обучающихся в государственных организациях среднего, технического и профессионального, послесреднего образования, внешкольных организациях дополнительного образования',
      'On approval of the Rules for organization of meals for students in state organizations of secondary, technical and vocational, post-secondary education, extracurricular organizations of additional education'),
    why: X('Мемлекеттік мектептерге тікелей міндетті; жеке мектеп үшін мәзірді, комиссияны және жеткізушіні жариялаудың үлгісі.', 'Прямо обязательны для государственных школ; для частной школы — образец публикации меню, комиссии и поставщика.', 'Binding on state schools; for a private school, the model for publishing menus, the commission and the supplier.'), page: 'meals' },
  { id: 'ethics', code: 'V2000020619', cat: 'org', kind: 'order', en: false, date: '2020-05-11', number: '190', issuer: MIN_MON, reg: { date: '2020-05-12', no: '20619' },
    short: X('Педагогикалық әдеп', 'Педагогическая этика', 'Teaching ethics'),
    title: X('Педагогикалық әдептің кейбір мәселелері туралы', 'О некоторых вопросах педагогической этики', 'On certain issues of pedagogical ethics'),
    why: X('Педагогикалық әдеп қағидалары және білім беру ұйымындағы педагогикалық әдеп жөніндегі кеңес.', 'Правила педагогической этики и совет по педагогической этике в организации образования.', 'Rules of teaching ethics and the school’s pedagogical ethics council.'), page: 'anticorruption' },

  // ------------------------------------------------------------------ quality, licence, website
  { id: 'attest', code: 'V2600038645', cat: 'quality', kind: 'order', en: false, date: '2026-04-30', number: '114-НҚ', issuer: MIN_EDU, reg: { date: '2026-05-04', no: '38645' },
    short: X('Мемлекеттік аттестаттау', 'Государственная аттестация', 'State attestation'),
    title: X('Меншік нысанына және ведомстволық бағыныстылығына қарамастан, мектепке дейінгі тәрбие мен оқытудың, бастауыш, негізгі орта және жалпы орта білімнің жалпы білім беретін оқу бағдарламаларын, техникалық және кәсіптік, орта білімнен кейінгі білімнің білім беру бағдарламаларын іске асыратын білім беру ұйымдарын мемлекеттік аттестаттаудан өткізу қағидаларын бекіту туралы',
      'Об утверждении правил проведения государственной аттестации организаций образования, реализующих общеобразовательные учебные программы дошкольного воспитания и обучения, начального, основного среднего и общего среднего образования, образовательные программы технического и профессионального, послесреднего образования независимо от форм собственности и ведомственной подчиненности',
      'On approval of the rules for the state attestation of educational organisations implementing preschool, primary, basic secondary and general secondary curricula and TVET and post-secondary programmes, regardless of ownership and departmental subordination'),
    why: X('Өзін-өзі бағалау және мемлекеттік аттестаттау; ресми сайт — бағалау өлшемшарттарының бірі.', 'Самооценка и государственная аттестация; официальный сайт — один из критериев оценки.', 'Self-assessment and state attestation; the official website is one of the criteria.'), page: 'self-assessment' },
  { id: 'qual', code: 'V2200030721', cat: 'quality', kind: 'order', en: false, date: '2022-11-24', number: '473', issuer: MIN_EDU, reg: { date: '2022-11-25', no: '30721' },
    short: X('Біліктілік талаптары', 'Квалификационные требования', 'Licensing requirements'),
    title: X('Жоғары және жоғары оқу орнынан кейінгі білім беру ұйымдарын қоспағанда, білім беру ұйымдарының білім беру қызметіне қойылатын біліктілік талаптарын және оларға сәйкестікті растайтын құжаттардың тізбесін бекіту туралы',
      'Об утверждении квалификационных требований, предъявляемых к образовательной деятельности организаций образования, за исключением организаций высшего и послевузовского образования, и перечень документов, подтверждающих соответствие им',
      'On approval of the qualification requirements for the educational activity of educational organisations (except higher and postgraduate education) and the list of documents confirming compliance'),
    why: X('Лицензия алу және сақтау үшін қойылатын талаптар: кадрлар, ғимарат, жабдық, кітапхана қоры.', 'Требования для получения и сохранения лицензии: кадры, здание, оснащение, библиотечный фонд.', 'Requirements to obtain and keep the licence: staff, building, equipment, library stock.'), page: 'license' },
  { id: 'it', code: 'V2200030534', cat: 'quality', kind: 'order', en: false, date: '2022-11-14', number: '456', issuer: MIN_EDU, reg: { date: '2022-11-15', no: '30534' },
    short: X('Ақпараттандыру объектілеріне талаптар', 'Требования к объектам информатизации', 'Digital systems requirements'),
    title: X('Білім беру саласындағы ақпараттандыру объектілеріне қойылатын ең төменгі талаптарды бекіту туралы', 'Об утверждении минимальных требований к объектам информатизации в области образования', 'On approval of minimum requirements for informatisation objects in education'),
    why: X('edu.kz доменіндегі сайт, қазақ және орыс тілдері, деректерді қорғау.', 'Сайт в домене edu.kz, казахский и русский языки, защита данных.', 'A website on the edu.kz domain, Kazakh and Russian versions, data protection.') },
  { id: 'web', code: 'V2500035902', cat: 'quality', kind: 'order', en: false, date: '2025-03-31', number: '124-НҚ', issuer: MIN_CULT, reg: { date: '2025-03-31', no: '35902' },
    short: X('Интернет-ресурстардың мазмұны', 'Содержание интернет-ресурсов', 'Website content rules'),
    title: X('Мемлекеттік органдардың интернет-ресурстарын ақпаратпен толықтыру қағидаларын және олардың мазмұнына қойылатын талаптарды бекіту туралы', 'Об утверждении Правил информационного наполнения интернет-ресурсов государственных органов и требования к их содержанию', 'On approval of the Rules for filling state bodies’ internet resources with information and the requirements for their content'),
    why: X('Мемлекеттік органдарға арналған; мектеп сайты құрылымы, қолжетімділігі мен жаңартылуы бойынша үлгі ретінде қолданылады.', 'Адресован госорганам; сайт школы использует его как эталон структуры, доступности и обновления.', 'Addressed to state bodies; this site follows it as a benchmark for structure, accessibility and updates.'), page: 'accessibility' },
];

export default {
  slug: 'legislation',
  group: 'documents',
  order: 20,
  title: { kz: 'Нормативтік құқықтық актілер', ru: 'Нормативные правовые акты', en: 'Legislation' },
  description: {
    kz: 'Мектеп қызметін реттейтін заңдар мен бұйрықтар: толық деректемелері және adilet.zan.kz ресми мәтіндеріне сілтемелер.',
    ru: 'Законы и приказы, регулирующие деятельность школы: полные реквизиты и ссылки на официальные тексты на adilet.zan.kz.',
    en: 'Laws and ministerial orders governing the school: full requisites and links to the official texts on adilet.zan.kz.',
  },
  styles: ['documents'],
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, { ui, L, t, href, fmt }) {
    const laws = ACTS.filter((a) => a.kind === 'law').length;
    const orders = ACTS.length - laws;
    const langLinks = (a) => {
      const items = [
        { l: 'kz', label: lang === 'en' ? 'KAZ' : 'ҚАЗ', url: `${ADILET}/kaz/docs/${a.code}`, name: X('қазақша мәтін', 'текст на казахском', 'Kazakh text') },
        { l: 'ru', label: lang === 'en' ? 'RUS' : 'РУС', url: `${ADILET}/rus/docs/${a.code}`, name: X('орысша мәтін', 'текст на русском', 'Russian text') },
      ];
      if (a.en) items.push({ l: 'en', label: 'ENG', url: `${ADILET}/eng/docs/${a.code}`, name: X('ағылшынша аударма', 'перевод на английский', 'English translation') });
      return items.map((i) => `<a class="dx-act__lang" href="${i.url}" target="_blank" rel="noopener" data-ext hreflang="${i.l === 'kz' ? 'kk' : i.l}"><span aria-hidden="true">${i.label}</span><span class="sr-only">${L(i.name)}: ${ui.esc(L(a.short))}</span><span class="sr-only"> ${t('extNewTab')}</span>${ui.icon('ext', { size: 14 })}</a>`).join('');
    };
    const card = (a) => {
      const main = adiletUrl(a, lang);
      const reg = a.reg ? `<div class="dx-act__row"><dt>${L(X('ҚР Әділет министрлігінде тіркелді', 'Зарегистрирован в Минюсте РК', 'Registered with the Ministry of Justice'))}</dt><dd>${fmt.date(a.reg.date)}, № ${a.reg.no}</dd></div>` : '';
      const note = a.shortened ? `<p class="dx-act__note">${L(X('Ресми атауы қысқартылып берілген — толық атауы adilet.zan.kz сайтында.', 'Официальное наименование приведено в сокращении — полное на adilet.zan.kz.', 'The official title is shortened here — see adilet.zan.kz for the full title.'))}</p>` : '';
      const page = a.page ? `<a class="dx-act__more" href="${href(a.page)}">${ui.icon('arrow-right', { size: 16 })}<span>${L(X('Сайттағы тиісті бөлім', 'Раздел сайта по теме', 'Related section of this site'))}</span></a>` : '';
      const enNote = lang === 'en' && !a.en ? `<span class="dx-act__hint">${L(X('', '', 'official texts in Kazakh and Russian; English title is an unofficial translation'))}</span>` : '';
      return `<li class="dx-act dx-act--${a.kind}" data-dx-item data-cat="${a.cat}">
<div class="dx-act__head"><span class="dx-act__kind">${ui.icon(a.kind === 'law' ? 'scale' : 'doc', { size: 16 })}<span>${L(a.kind === 'law' ? X('Заң', 'Закон', 'Law') : X('Бұйрық', 'Приказ', 'Order'))}</span></span><span class="dx-act__no">№ ${a.number}</span></div>
<h3 class="dx-act__title"><a href="${main}" target="_blank" rel="noopener" data-ext><span class="dx-act__short">${L(a.short)}</span><span class="sr-only"> ${t('extNewTab')}</span></a></h3>
<dl class="dx-act__meta">${a.kind === 'order' ? `<div class="dx-act__row dx-act__row--wide"><dt>${L(X('Түрі және қабылдаған орган', 'Вид и орган', 'Type and issuer'))}</dt><dd>${L(a.issuer)}</dd></div>` : ''}<div class="dx-act__row"><dt>${L(X('Күні мен нөмірі', 'Дата и номер', 'Date and number'))}</dt><dd><time datetime="${a.date}">${fmt.date(a.date)}</time>, № ${a.number}</dd></div>${reg}<div class="dx-act__row"><dt>${L(X('«Әділет» коды', 'Код в «Әділет»', 'Adilet code'))}</dt><dd><code>${a.code}</code></dd></div></dl>
<details class="dx-act__fold" open data-dx-fold><summary>${ui.icon('info', { size: 16 })}<span>${L(X('Толық атауы және мектеп үшін маңызы', 'Полное название и значение для школы', 'Full title and why it matters'))}</span></summary><p class="dx-act__full">${a.kind === 'law' ? L(X(`Қазақстан Республикасының ${a.title.kz} Заңы`, `Закон Республики Казахстан ${a.title.ru}`, `Law of the Republic of Kazakhstan ${a.title.en}`)) : L(a.title)}</p><p class="dx-act__why">${L(a.why)}</p>${note}</details>
<div class="dx-act__foot"><span class="dx-act__langs" role="group" aria-label="${ui.esc(L(X('Ресми мәтін тілдері', 'Языки официального текста', 'Official text languages')))}">${langLinks(a)}</span>${enNote}${page}</div></li>`;
    };

    // On phones the full title + "why it matters" block starts folded (open without JS / on wider screens).
    const foldScript = `<script>(function(){if(!window.matchMedia||!matchMedia('(max-width: 599px)').matches)return;[].forEach.call(document.querySelectorAll('[data-dx-fold]'),function(d){d.open=false;});})();</script>`;

    // ------------------------------------------------------------ intro
    const intro = ui.split({
      ratio: '3:2', align: 'center',
      left: `${ui.eyebrow(X('Құқықтық негіз', 'Правовая основа', 'Legal basis'))}
<h2 class="sec__title">${L(X('Мектеп қандай заңдар бойынша жұмыс істейді', 'По каким законам работает школа', 'The rules the school works by'))}</h2>
${ui.lead(X(
        'Мұнда «Керемет» мектебінің оқу-тәрбие жұмысын, қабылдауын, бағалауын, сайтын және дербес деректерді қорғауын реттейтін негізгі нормативтік құқықтық актілер жинақталған. Әр актінің толық деректемелері мен «Әділет» ақпараттық-құқықтық жүйесіндегі ресми мәтініне сілтеме берілген.',
        'Здесь собраны основные нормативные правовые акты, которые регулируют учебно-воспитательную работу школы «Керемет», приём, оценивание, работу сайта и защиту персональных данных. Для каждого акта указаны полные реквизиты и ссылка на официальный текст в информационно-правовой системе «Әділет».',
        'This page lists the main laws and ministerial orders that govern Keremet School’s teaching, admission, assessment, website and personal-data protection, with full requisites and a link to the official text in the Adilet legal information system.',
      ))}`,
      right: ui.panel({ theme: 'hero', cls: 'dx-adilet', body: `<span class="dx-adilet__icon">${ui.icon('scale', { size: 34 })}</span><p class="dx-adilet__k">${L(X('Ресми дереккөз', 'Официальный источник', 'Official source'))}</p><p class="dx-adilet__t">adilet.zan.kz</p><p class="dx-adilet__s">${L(X(`Барлық сілтемелер мен деректемелер ${fmt.date(VERIFIED)} тексерілді`, `Все ссылки и реквизиты проверены ${fmt.date(VERIFIED)}`, `All links and requisites checked on ${fmt.date(VERIFIED)}`))}</p>${ui.button({ href: 'https://adilet.zan.kz/', label: X('«Әділет» ашу', 'Открыть «Әділет»', 'Open Adilet'), kind: 'gold', size: 's' })}` }),
    });
    const statsRow = ui.stats([
      { icon: 'scale', value: String(laws), label: X('Қазақстан Республикасының заңдары', 'Законов Республики Казахстан', 'Laws of Kazakhstan') },
      { icon: 'doc', value: String(orders), label: X('Министрліктердің бұйрықтары', 'Приказов министерств', 'Ministerial orders') },
      { icon: 'grid', value: String(CATS.length), label: X('Тақырыптық бөлім', 'Тематических раздела', 'Topic groups') },
      { icon: 'languages', value: '2', label: X('Ресми мәтін тілі', 'Языка официального текста', 'Official text languages'), note: X('қазақ және орыс; кейбіреуі ағылшынша', 'казахский и русский; часть — на английском', 'Kazakh and Russian; some in English') },
    ], { cls: 'dx-stats dx-stats--4' });

    // ------------------------------------------------------------ filter toolbar (progressive enhancement)
    const toolbar = `<div class="dx-toolbar" data-dx-toolbar hidden>
<div class="dx-toolbar__search"><label class="sr-only" for="dx-q-acts">${L(X('Актілерден іздеу', 'Поиск по актам', 'Search the acts'))}</label>${ui.icon('search', { size: 18 })}<input id="dx-q-acts" type="search" maxlength="200" autocomplete="off" data-dx-q placeholder="${ui.esc(L(X('Атауы, нөмірі немесе коды…', 'Название, номер или код…', 'Title, number or code…')))}"></div>
<div class="dx-toolbar__chips" role="group" aria-label="${ui.esc(L(X('Санат бойынша сүзу', 'Фильтр по разделу', 'Filter by category')))}"><button type="button" class="dx-chip" data-dx-cat="*" aria-pressed="true">${L(X('Барлығы', 'Все', 'All'))} <b>${ACTS.length}</b></button>${CATS.map((c) => `<button type="button" class="dx-chip" data-dx-cat="${c.id}" aria-pressed="false">${ui.icon(c.icon, { size: 16 })}<span>${L(c.label)}</span> <b>${ACTS.filter((a) => a.cat === c.id).length}</b></button>`).join('')}</div>
<p class="dx-toolbar__count" aria-live="polite">${L(X('Көрсетілді', 'Показано', 'Showing'))}: <b data-dx-count>${ACTS.length}</b> / ${ACTS.length}</p></div>`;

    const groups = CATS.map((c) => `<section class="dx-cat" data-dx-group aria-labelledby="cat-${c.id}"><h2 class="dx-cat__title" id="cat-${c.id}"><span class="dx-cat__icon">${ui.icon(c.icon, { size: 22 })}</span>${L(c.label)}</h2><ul class="dx-acts" role="list">${ACTS.filter((a) => a.cat === c.id).map(card).join('')}</ul></section>`).join('');
    const empty = `<p class="dx-empty" data-dx-empty hidden>${ui.icon('info', { size: 18 })}<span>${L(X('Сұрау бойынша акт табылмады. Басқа сөзбен іздеп көріңіз.', 'По запросу актов не найдено. Попробуйте другое слово.', 'No acts match. Try another word.'))}</span></p>`;

    // ------------------------------------------------------------ summary table (requisites at a glance, printable)
    const summary = ui.table({
      caption: X('Деректемелердің жиынтық кестесі', 'Сводная таблица реквизитов', 'Requisites at a glance'),
      head: [X('Акт', 'Акт', 'Act'), X('Күні', 'Дата', 'Date'), X('Нөмірі', 'Номер', 'No.'), X('Әділет министрлігінде тіркелуі', 'Регистрация в Минюсте', 'MoJ registration'), X('Ресми мәтін', 'Официальный текст', 'Official text')],
      rows: ACTS.map((a) => [
        `<span>${L(a.short)}<br><span class="muted">${L(a.kind === 'law' ? X('Заң', 'Закон', 'Law') : X('Бұйрық', 'Приказ', 'Order'))}</span></span>`,
        fmt.date(a.date), a.number,
        a.reg ? `${fmt.date(a.reg.date)}, № ${a.reg.no}` : '—',
        ui.extLink(adiletUrl(a, lang), a.code),
      ]),
      compact: true,
    });

    // ------------------------------------------------------------ how to read / use
    const how = ui.steps([
      { title: X('Ресми дереккөз', 'Официальный источник', 'Official source'), text: X('Актілердің ресми мәтіндері «Әділет» ақпараттық-құқықтық жүйесінде (adilet.zan.kz) жарияланады — сілтемелер тікелей сол жаққа апарады.', 'Официальные тексты актов публикуются в ИПС «Әділет» (adilet.zan.kz) — ссылки ведут прямо туда.', 'Official texts are published in the Adilet system (adilet.zan.kz); the links go straight there.') },
      { title: X('Қолданыстағы редакция', 'Действующая редакция', 'Current wording'), text: X('«Әділет» өзгерістер енгізілген соңғы редакцияны көрсетеді; өзгерістер тарихы «Өзгерістер тарихы» қойындысында.', '«Әділет» показывает актуальную редакцию с внесёнными изменениями; история — во вкладке «История изменений».', 'Adilet shows the up-to-date wording with all amendments; see the “History of changes” tab.') },
      { title: X('Тізімді жаңарту', 'Обновление перечня', 'Keeping the list current'), text: X('Мектеп тізімді жаңа акт шыққанда немесе акт күшін жойғанда, әрі кемінде жылына бір рет — 1 қыркүйекке дейін тексереді.', 'Школа проверяет перечень при выходе нового акта или утрате силы, и не реже раза в год — до 1 сентября.', 'The school reviews the list whenever an act is adopted or repealed, and at least yearly before 1 September.') },
    ]);

    const official = ui.linkList([
      { href: 'https://adilet.zan.kz/', icon: 'scale', label: X('«Әділет» ақпараттық-құқықтық жүйесі', 'ИПС «Әділет»', 'Adilet legal information system'), note: 'adilet.zan.kz' },
      { href: 'https://www.gov.kz/memleket/entities/edu', icon: 'building', label: X('ҚР Оқу-ағарту министрлігі', 'Министерство просвещения РК', 'Ministry of Education of Kazakhstan'), note: 'gov.kz' },
      { href: 'https://www.gov.kz/memleket/entities/shymkent-bilim', icon: 'school', label: X('Шымкент қаласының білім басқармасы', 'Управление образования г. Шымкент', 'Shymkent City Education Department'), note: 'gov.kz' },
      { href: 'https://egov.kz/', icon: 'globe', label: X('Электрондық үкімет порталы', 'Портал электронного правительства', 'E-government portal'), note: X('мемлекеттік қызметтер, оның ішінде мектепке қабылдау', 'госуслуги, в том числе приём в школу', 'public services, including school admission') },
    ]);

    const related = ui.linkList([
      { href: href('documents'), icon: 'doc', label: X('Ішкі құжаттар', 'Внутренние документы', 'School documents'), note: X('Мектептің бұйрықтары, ережелері, жоспарлары', 'Приказы, положения, планы школы', 'School orders, regulations, plans') },
      { href: href('privacy'), icon: 'lock', label: X('Құпиялылық саясаты', 'Политика конфиденциальности', 'Privacy policy') },
      { href: href('anticorruption'), icon: 'shield', label: X('Сыбайлас жемқорлыққа қарсы іс-қимыл', 'Противодействие коррупции', 'Anti-corruption') },
      { href: href('finance'), icon: 'coins', label: X('Қаржылық есептер', 'Финансовые отчёты', 'Financial reports') },
    ]);

    const toc = ui.toc([
      ...CATS.map((c) => ({ id: `cat-${c.id}`, label: c.label })),
      { id: 'summary', label: X('Жиынтық кесте', 'Сводная таблица', 'Summary table') },
      { id: 'how', label: X('Қалай пайдалану керек', 'Как пользоваться', 'How to use') },
      { id: 'official', label: X('Ресми ресурстар', 'Официальные ресурсы', 'Official resources') },
    ]);

    return [
      intro,
      statsRow,
      ui.split({ ratio: '1:2', left: `<div class="dx-sticky">${toc}</div>`, right: `<div class="dx-filter" data-dx-filter>${toolbar}${groups}${empty}</div>` }),
      ui.section({ id: 'summary', eyebrow: X('Басып шығаруға ыңғайлы', 'Удобно для печати', 'Print-friendly'), title: X('Жиынтық кесте', 'Сводная таблица', 'Summary table'), body: ui.accordion([{ q: X(`Барлық ${ACTS.length} актінің деректемелерін көрсету`, `Показать реквизиты всех ${ACTS.length} актов`, `Show the requisites of all ${ACTS.length} acts`), a: summary }]) }),
      ui.section({ id: 'how', tone: 'tint', eyebrow: X('Анықтама', 'Справка', 'Guide'), title: X('Қалай пайдалану керек', 'Как пользоваться перечнем', 'How to use this list'), body: how + ui.callout({ type: 'info', title: X('Ағылшын тіліндегі атаулар туралы', 'Об английских названиях', 'About English titles'), text: X('Ресми мәтіндер қазақ және орыс тілдерінде. Ағылшынша атаулар — ресми емес аударма; «Әділетте» ағылшынша аудармасы бар актілер үшін ENG сілтемесі берілген.', 'Официальные тексты — на казахском и русском языках. Английские названия — неофициальный перевод; для актов, у которых в «Әділет» есть перевод, дана ссылка ENG.', 'Official texts exist in Kazakh and Russian. English titles are unofficial translations unless an ENG link to Adilet’s own translation is shown.') }) }),
      ui.split({ ratio: '1:1', left: ui.section({ id: 'official', title: X('Ресми ресурстар', 'Официальные ресурсы', 'Official resources'), body: official }), right: ui.section({ title: X('Осы бөлімде', 'В этом разделе', 'In this section'), body: related }) }),
      dxFilterScript() + foldScript,
    ].join('\n');
  },
};
