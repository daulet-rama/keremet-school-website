// =====================================================================================
//  src/data/documents.mjs — registry of documents published on the site.
//  Entry: { id, group, title{kz,ru,en}, file: 'docs/…' (relative to public/assets/) | null,
//           type: 'pdf'|'jpg'|'doc'|'link', size (bytes, computed), date:'YYYY-MM-DD'|null,
//           number:string|null, issuer?{..}, note?{..}, archived?:true, url?: external link,
//           posted:'YYYY-MM-DDTHH:MM' (when the file was PLACED on the site, Shymkent time),
//           changed?:'YYYY-MM-DDTHH:MM' (when the file was last replaced) }
//  `date` is the document's own date (signed / issued); `posted` / `changed` are site placement stamps (ORDER S.11,
//  S.73, S.109): ui.docList shows "Орналастырылды / Размещено / Posted …", and build.mjs raises the "Last updated"
//  line, the search index and sitemap <lastmod> of every page that renders the document to the latest stamp.
//  file:null  → PENDING (rendered by ui.docList as "Құжат жүктеледі / Документ будет загружен").
//  To publish a document: put the file into public/assets/docs/, set `file`, `type`, `date`, `number` AND `posted`
//  (the build warns when a file has no `posted`). Size is computed from disk automatically. For a JPG/PNG scan also
//  run `python tools/make-thumbs.py` — it writes the small preview public/assets/docs/thumbs/<name>.webp.
//  Groups: founding, license, governance, plan, rules, education, upbringing, admission, campus,
//          meals, safety, board, finance, anticorruption, privacy
//  Usage in a page:  ctx.ui.docList(docsByGroup('license'))   (ui.docList understands these entries)
// =====================================================================================
import { statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const ASSETS = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'assets');
function sizeOf(rel) {
  if (!rel) return null;
  try { return statSync(join(ASSETS, rel)).size; } catch { return null; }
}
/** Small preview of a scan (docs/thumbs/<name>.webp, ~240×320) when it exists — ui.docList thumbs use it. */
function thumbOf(rel) {
  if (!rel || !/\.(jpe?g|png)$/i.test(rel)) return null;
  const t = rel.replace(/^docs\//, 'docs/thumbs/').replace(/\.(jpe?g|png)$/i, '.webp');
  try { statSync(join(ASSETS, t)); return t; } catch { return null; }
}
// build.mjs listens here to learn which documents each page renders (effective "Last updated", sitemap lastmod).
let sink = null;
export function _setAccessSink(fn) { sink = typeof fn === 'function' ? fn : null; }
const seen = (list) => { if (sink) for (const d of list) if (d) sink(d); return list; };

const LICENSOR = {
  kz: 'Шымкент қаласының білім саласында сапаны қамтамасыз ету департаменті',
  ru: 'Департамент по обеспечению качества в сфере образования г. Шымкент',
  en: 'Shymkent Department for Quality Assurance in Education',
};

/** pending(id, group, kz, ru, en, note?) — helper for documents the school still has to supply. */
const P = (id, group, kz, ru, en, note) => ({ id, group, title: { kz, ru, en }, file: null, type: 'pdf', date: null, number: null, ...(note ? { note } : {}) });

const BUDGET_NOTE = { kz: 'Мектеп бюджет қаражатын алған жағдайда ғана жарияланады.', ru: 'Публикуется, только если школа получает бюджетные средства.', en: 'Published only if the school receives budget funds.' };
const SURVEY_NOTE = { kz: 'Сауалнама өткізілгеннен кейін жиынтық есеп (PDF) жүктеледі', ru: 'Сводный отчёт (PDF) будет загружен после проведения опроса', en: 'A summary report (PDF) will be uploaded after the survey' };

/** Self-assessment evidence (Order 114-НҚ, Appendix 2): SA(id, group, criteria, kz, ru, en, note?) → id 'sa-<id>'.
 *  criteria = the Appendix 2 criterion numbers the document proves (self-1…8 read them with docById).
 *  SA3 adds the three assessed school years to the title. SA_Y3 must match YEARS in pages/self-assessment.mjs. */
const SA_Y3 = '2024–2025, 2025–2026, 2026–2027';
const SA = (id, group, criteria, kz, ru, en, note) => ({ ...P(`sa-${id}`, group, kz, ru, en, note), ...(criteria.length ? { criteria } : {}) });
const SA3 = (id, group, criteria, kz, ru, en, note) => SA(id, group, criteria, `${kz} (${SA_Y3} оқу жылдары)`, `${ru} (${SA_Y3} учебные годы)`, `${en} (school years ${SA_Y3})`, note);

const raw = [
  // ------------------------------------------------------------- PUBLISHED (real scans)
  {
    id: 'license-2025', group: 'license', type: 'jpg',
    file: 'docs/license-2025-KZ29LAM00002781.jpg',
    number: 'KZ29LAM00002781', date: '2025-05-05', posted: '2026-09-24T10:00',
    title: {
      kz: 'Білім беру қызметіне лицензия № KZ29LAM00002781',
      ru: 'Лицензия на образовательную деятельность № KZ29LAM00002781',
      en: 'Education licence No. KZ29LAM00002781',
    },
    issuer: LICENSOR,
    note: {
      kz: 'Мерзімсіз. Алғаш берілген күні: 07.11.2022. Бастауыш, негізгі орта, жалпы орта, ТжКБ, орта білімнен кейінгі, рухани білім беру; кәмелетке толмағандарға білім беру-сауықтыру қызметтері.',
      ru: 'Бессрочная. Дата первичной выдачи: 07.11.2022. Начальное, основное среднее, общее среднее, ТиПО, послесреднее, духовное образование; образовательно-оздоровительные услуги несовершеннолетним.',
      en: 'Unlimited term. First issued 07.11.2022. Primary, lower & upper secondary, TVET, post-secondary and spiritual education; health-improving services for minors.',
    },
  },
  {
    id: 'license-2022', group: 'license', type: 'jpg', archived: true,
    file: 'docs/license-2022-KZ18LAA00032760.jpg',
    number: 'KZ18LAA00032760', date: '2022-11-07', posted: '2026-09-24T10:00',
    title: {
      kz: 'Білім беру қызметіне лицензия № KZ18LAA00032760',
      ru: 'Лицензия на образовательную деятельность № KZ18LAA00032760',
      en: 'Education licence No. KZ18LAA00032760',
    },
    issuer: LICENSOR,
    note: {
      // The scan gives the LICENSEE's (legal entity's) address next to its name — not an "object address".
      kz: 'Алғашқы лицензия (2022). Мерзімсіз. Лицензиаттың мекенжайы: Шымкент қ., Қаратау ауданы, Нұрсәт шағын ауданы, 173-үй, 3-тұрғын емес бөлме.',
      ru: 'Первая лицензия (2022). Бессрочная. Адрес лицензиата: г. Шымкент, Каратауский район, мкр. Нурсат, д. 173, нежилое помещение 3.',
      en: 'First licence (2022). Unlimited term. Licensee address: 173 Nursat microdistrict, non-residential premises 3, Karatau district, Shymkent.',
    },
  },
  {
    id: 'license-2022-appendix-001', group: 'license', type: 'jpg', archived: true,
    file: 'docs/license-2022-appendix-001.jpg',
    number: '001', date: '2022-11-07', posted: '2026-09-24T10:00',
    title: {
      kz: '№ KZ18LAA00032760 лицензияға № 001 қосымша',
      ru: 'Приложение № 001 к лицензии № KZ18LAA00032760',
      en: 'Appendix 001 to licence No. KZ18LAA00032760',
    },
    issuer: LICENSOR,
    note: {
      kz: 'Кіші түрі: бастауыш білім беру. Негіздеме: департаменттің 07.11.2022 ж. № 299 бұйрығы.',
      ru: 'Подвид: начальное образование. Основание: приказ департамента № 299 от 07.11.2022.',
      en: 'Sub-type: primary education. Basis: Department order No. 299 of 07.11.2022.',
    },
  },
  {
    id: 'registration-certificate', group: 'founding', type: 'jpg',
    file: 'docs/registration-certificate-2026.jpg',
    number: '210440038887', date: '2026-01-25', posted: '2026-09-24T10:00',
    title: {
      kz: 'Заңды тұлғаны мемлекеттік тіркеу туралы анықтама',
      ru: 'Справка о государственной регистрации юридического лица',
      en: 'Certificate of state registration of the legal entity',
    },
    issuer: {
      kz: '«Азаматтарға арналған үкімет» МК КЕАҚ Шымкент қ. бойынша филиалы',
      ru: 'Филиал НАО «ГК «Правительство для граждан» по г. Шымкент',
      en: 'Government for Citizens State Corporation, Shymkent branch',
    },
    note: {
      kz: 'БСН 210440038887. Тіркелген күні: 28.04.2021. Анықтама берілген күні: 25.01.2026.',
      ru: 'БИН 210440038887. Дата регистрации: 28.04.2021. Справка выдана 25.01.2026.',
      en: 'BIN 210440038887. Registered 28.04.2021. Certificate issued 25.01.2026.',
    },
  },

  // ------------------------------------------------------------- PENDING (ORDER-114 §C–L) — TODO(school): supply files
  P('charter', 'founding', 'Серіктестік жарғысы', 'Устав товарищества', 'Charter of the partnership'),
  P('director-order', 'governance', 'Директорды тағайындау туралы бұйрық', 'Приказ о назначении директора', 'Order appointing the director'),
  P('structure-order', 'governance', 'Басқару құрылымын бекіту туралы бұйрық', 'Приказ об утверждении структуры управления', 'Order approving the management structure'),
  P('ped-council', 'governance', 'Педагогикалық кеңес туралы ереже', 'Положение о педагогическом совете', 'Regulations on the Pedagogical Council'),
  P('method-council', 'governance', 'Әдістемелік кеңес туралы ереже', 'Положение о методическом совете', 'Regulations on the Methodological Council'),
  P('ethics-council', 'governance', 'Педагогикалық әдеп жөніндегі кеңес туралы ереже', 'Положение о совете по педагогической этике', 'Regulations on the Pedagogical Ethics Council'),
  P('development-plan', 'plan', 'Мектептің даму жоспары', 'План развития школы', 'School development plan'),
  P('development-report', 'plan', 'Даму жоспарының орындалуы туралы жылдық есеп', 'Годовой отчёт о выполнении плана развития', 'Annual report on the development plan'),
  P('internal-rules', 'rules', 'Ішкі тәртіп ережелері', 'Правила внутреннего распорядка', 'Internal regulations'),
  P('curriculum-rup', 'education', 'Жұмыс оқу жоспары (2026–2027 оқу жылы)', 'Рабочий учебный план (2026–2027 учебный год)', 'Working curriculum (2026–2027)'),
  P('timetable', 'education', 'Сабақ кестесі (2026–2027 оқу жылы)', 'Расписание уроков (2026–2027 учебный год)', 'Timetable (2026–2027)'),
  P('academic-calendar', 'education', 'Академиялық күнтізбе және демалыс кезеңдері', 'Академический календарь и каникулы', 'Academic calendar and holidays'),
  P('control-plan', 'education', 'Мектепішілік бақылау жоспары', 'План внутришкольного контроля', 'Internal quality-control plan'),
  P('method-plan', 'education', 'Әдістемелік жұмыс жоспары', 'План методической работы', 'Methodological work plan'),
  P('distance-order', 'education', 'Қашықтан оқытуды ұйымдастыру тәртібі туралы бұйрық', 'Приказ о порядке организации дистанционного обучения', 'Order on the organisation of distance learning'),
  P('upbringing-plan', 'upbringing', '«Адал азамат» тәрбие жұмысының жылдық жоспары', 'Годовой план воспитательной работы «Адал азамат»', 'Annual upbringing plan “Adal azamat”'),
  P('admission-rules', 'admission', 'Білім алушыларды қабылдау, ауыстыру және шығару қағидалары', 'Правила приёма, перевода и отчисления обучающихся', 'Rules of admission, transfer and withdrawal'),
  P('contract-template', 'admission', 'Білім беру қызметтерін көрсету туралы үлгілік шарт', 'Типовой договор об оказании образовательных услуг', 'Standard contract for educational services'),
  P('application-template', 'admission', 'Мектепке қабылдау туралы өтініш үлгісі', 'Образец заявления о приёме в школу', 'Application form for admission'),
  P('building-basis', 'campus', 'Ғимаратты пайдалану негізі (меншік құқығы / жалдау шарты)', 'Основание пользования зданием (право собственности / договор аренды)', 'Basis for use of the building (ownership / lease)'),
  P('sez', 'campus', 'Санитариялық-эпидемиологиялық қорытынды', 'Санитарно-эпидемиологическое заключение', 'Sanitary-epidemiological certificate'),
  P('fire-safety', 'safety', 'Өрт қауіпсіздігі талаптарына сәйкестік актісі', 'Акт соответствия требованиям пожарной безопасности', 'Fire-safety compliance report'),
  P('medical-contract', 'campus', 'Медициналық қызмет көрсету туралы шарт', 'Договор на медицинское обслуживание', 'Medical services contract'),
  P('meals-contract', 'meals', 'Тамақтануды ұйымдастыру туралы шарт', 'Договор на организацию питания', 'Catering contract'),
  P('meals-menu', 'meals', 'Перспективалық мәзір', 'Перспективное меню', 'Long-term menu'),
  P('board-regulation', 'board', 'Қамқоршылық кеңес туралы ереже', 'Положение о попечительском совете', 'Regulations on the Board of Trustees'),
  P('board-composition', 'board', 'Қамқоршылық кеңестің құрамы туралы бұйрық', 'Приказ о составе попечительского совета', 'Order on the composition of the Board of Trustees'),
  P('board-plan', 'board', 'Қамқоршылық кеңестің жұмыс жоспары', 'План работы попечительского совета', 'Board of Trustees work plan'),
  P('charity-report', 'finance', '2025 қаржы жылы бойынша қайырымдылық көмекті пайдалану туралы есеп', 'Отчёт об использовании благотворительной помощи за 2025 финансовый год', 'Report on the use of charitable aid, financial year 2025'),
  P('ethics-order', 'anticorruption', 'Әдеп жөніндегі уәкілді тағайындау туралы бұйрық', 'Приказ о назначении уполномоченного по этике', 'Order appointing the ethics officer'),
  P('personal-data', 'privacy', 'Дербес деректерді қорғау туралы ереже', 'Положение о защите персональных данных', 'Personal data protection policy'),

  // ------------------------------------------------------------- PENDING — listed by the group pages. Moved here from
  // the page modules so the documents registry and its counters, the README checklist and every page agree. Pages
  // read them with docById('<id>') / docsByGroup('<group>'); publish the file here and every page updates.
  // upbringing: psychological support and prevention (were UB_DOCS in pages/psychology.mjs)
  P('spps-order', 'upbringing', 'Психологиялық-педагогикалық қолдау қызметінің құрамы туралы бұйрық', 'Приказ о составе службы психолого-педагогического сопровождения', 'Order on the membership of the psychological support service'),
  P('spps-plan', 'upbringing', 'ППҚҚ жұмыс жоспары (2026–2027 оқу жылы)', 'План работы СППС (2026–2027 учебный год)', 'Support service work plan (2026–2027)'),
  P('bullying-plan', 'upbringing', 'Баланы жәбірлеудің (буллингтің) профилактикасы жоспары (2026–2027 оқу жылы)', 'План профилактики травли (буллинга) ребёнка (2026–2027 учебный год)', 'Bullying prevention plan (2026–2027)', { kz: 'Оқу жылының басында директор бекітеді (№ 506 бұйрықпен бекітілген Қағидалардың 4-тармағы).', ru: 'Утверждается руководителем к началу учебного года (п. 4 Правил, утв. приказом № 506).', en: 'Approved by the head at the start of each school year (Rules approved by Order No. 506, para. 4).' }),
  P('offence-plan', 'upbringing', 'Құқық бұзушылықтың алдын алу жоспары (2026–2027 оқу жылы)', 'План профилактики правонарушений (2026–2027 учебный год)', 'Offence prevention plan (2026–2027)'),
  P('prevention-council', 'upbringing', 'Профилактика кеңесін құру және оның құрамы туралы бұйрық', 'Приказ о создании и составе совета профилактики', 'Order setting up the prevention council and its members', { kz: '№ 245-VIII Заңның 23-бабының 14) тармақшасы', ru: 'пп. 14) ст. 23 Закона № 245-VIII', en: 'Law No. 245-VIII, Art. 23(14)' }),
  P('parents-plan', 'upbringing', 'Ата-аналармен жұмыс жоспары (2026–2027 оқу жылы)', 'План работы с родителями (2026–2027 учебный год)', 'Plan of work with parents (2026–2027)'),
  // anti-corruption, finance and board reports (were EXTRA_DOCS in pages/documents.mjs)
  P('anticorruption-policy', 'anticorruption', 'Сыбайлас жемқорлыққа қарсы саясат (бекітілген мәтіні)', 'Антикоррупционная политика (утверждённый текст)', 'Anti-corruption policy (approved text)'),
  P('conflict-of-interest', 'anticorruption', 'Мүдделер қақтығысын реттеу тәртібі', 'Порядок урегулирования конфликта интересов', 'Conflict-of-interest procedure'),
  P('budget-statement', 'finance', 'Бюджеттік қаржыландыру туралы мәлімдеме', 'Заявление о бюджетном финансировании', 'Statement on budget funding'),
  ...['2025', '2024', '2023'].flatMap((y) => [
    // 2025's charity report is the 'charity-report' entry above
    ...(y === '2025' ? [] : [P(`charity-report-${y}`, 'finance', `${y} қаржы жылы бойынша қайырымдылық көмекті пайдалану туралы есеп`, `Отчёт об использовании благотворительной помощи за ${y} финансовый год`, `Report on the use of charitable aid, financial year ${y}`)]),
    P(`budget-report-${y}`, 'finance', `${y} жылғы бюджет қаражатын пайдалану туралы есеп`, `Отчёт об использовании бюджетных средств за ${y} год`, `Report on the use of budget funds, ${y}`, BUDGET_NOTE),
    P(`board-report-${y}`, 'board', `Қамқоршылық кеңестің ${y} жылғы қызметі туралы есебі`, `Отчёт о деятельности попечительского совета за ${y} год`, `Board of Trustees annual report, ${y}`),
  ]),
  // application forms (forms.html; type doc = DOCX + PDF templates)
  { ...P('transfer-application', 'admission', 'Басқа мектептен ауысу туралы өтініш үлгісі', 'Образец заявления о переводе из другой школы', 'Transfer application form', { kz: 'Ауысу каникул кезеңінде жүргізіледі (Үлгілік қағидалар, 17-тармақ).', ru: 'Перевод проводится в каникулярный период (Типовые правила, п. 17).', en: 'Transfers take place during school holidays (Standard Rules, para. 17).' }), type: 'doc' },
  { ...P('certificate-request', 'admission', 'Оқу орнынан анықтама беру туралы өтініш үлгісі', 'Образец заявления о выдаче справки с места учёбы', 'Request for a certificate of enrolment', { kz: 'Анықтама мектепте беріледі.', ru: 'Справка выдаётся в школе.', en: 'Issued by the school.' }), type: 'doc' },
  { ...P('duplicate-request', 'admission', 'Білім туралы құжаттың телнұсқасын беру туралы өтініш үлгісі', 'Образец заявления о выдаче дубликата документа об образовании', 'Request for a duplicate education document', { kz: 'Негізгі орта / жалпы орта білім туралы аттестаттың телнұсқасы.', ru: 'Дубликат аттестата об основном среднем / общем среднем образовании.', en: 'Duplicate of a lower/upper secondary certificate.' }), type: 'doc' },
  { ...P('withdrawal-application', 'admission', 'Мектептен шығу туралы өтініш үлгісі', 'Образец заявления о выбытии из школы', 'Withdrawal application form', { kz: 'Мектеп бекіткен үлгі жүктеледі (DOCX және PDF).', ru: 'Будет загружен утверждённый школой образец (DOCX и PDF).', en: 'The school’s approved template will be uploaded (DOCX and PDF).' }), type: 'doc' },
  // survey results (surveys.html)
  ...[['parents', 'Ата-аналар', 'родителей', 'Parent'], ['pupils', 'Оқушылар', 'учеников', 'Pupil'], ['teachers', 'Педагогтер', 'педагогов', 'Teacher']].map(([k, kz, ru, en]) => P(`survey-${k}-2026-2027`, 'governance', `${kz} сауалнамасының нәтижелері — 2026–2027 оқу жылы`, `Результаты анкетирования ${ru} — 2026–2027 учебный год`, `${en} survey results — 2026–2027 school year`, SURVEY_NOTE)),
  // listed on clubs.html
  P('clubs-timetable', 'upbringing', 'Үйірмелер мен секциялар кестесі (2026–2027 оқу жылы)', 'Расписание кружков и секций (2026–2027 учебный год)', 'Timetable of clubs and sections (2026–2027)'),
  P('clubs-coverage', 'upbringing', 'Оқушыларды үйірмелермен қамту туралы анықтама', 'Справка об охвате учащихся кружками', 'Statement on pupils’ club participation'),
  // listed on curriculum.html
  P('life-safety-topics', 'education', 'ӨҚН курсының тақырыптары мен өткізу күндері (2026–2027)', 'Темы и даты курса ОБЖ (2026–2027)', 'Life-safety course: topics and dates (2026–2027)', { kz: '«Дүниетану» КТЖ-дан үзінді, сыныптар бойынша.', ru: 'Выписка из КТП «Познание мира» по классам.', en: 'Extract from the “Knowledge of the world” lesson plans, per grade.' }),
  P('road-safety-plan', 'safety', 'ЖҚЕ бойынша сынып жетекшілерінің жоспары: тақырыптар мен күндер', 'План классных руководителей по ПДД: темы и даты', 'Class teachers’ road-safety plan: topics and dates', { kz: 'МЖМБС талабы: тақырып пен күн сынып жетекшісінің жылдық жоспарында көрсетіледі.', ru: 'Требование ГОСО: тема и дата указываются в годовом плане классного руководителя.', en: 'The standard requires the topic and date in each class teacher’s annual plan.' }),
  // listed on development-plan.html
  P('development-report-2024-2025', 'plan', 'Даму жоспарының орындалуы туралы есеп: 2024–2025 оқу жылы', 'Отчёт о выполнении плана развития: 2024–2025 учебный год', 'Development plan progress report: 2024–2025'),
  P('development-report-2025-2026', 'plan', 'Даму жоспарының орындалуы туралы есеп: 2025–2026 оқу жылы', 'Отчёт о выполнении плана развития: 2025–2026 учебный год', 'Development plan progress report: 2025–2026'),
  P('development-monitoring-2026-2027', 'plan', 'Ағымдағы оқу жылы (2026–2027) бойынша аралық мониторинг', 'Промежуточный мониторинг за текущий 2026–2027 учебный год', 'Interim monitoring for the current year (2026–2027)'),
  // listed on distance.html
  P('distance-weather-orders', 'education', 'Қолайсыз ауа райы кезінде қашықтан оқыту туралы бұйрықтар', 'Приказы о дистанционном обучении при неблагоприятной погоде', 'Orders on distance learning in adverse weather', { kz: 'Әр бұйрық бекітілген күні осы жерде және жаңалықтарда жарияланады.', ru: 'Каждый приказ публикуется здесь и в новостях в день утверждения.', en: 'Each order is published here and in the news on the day it is signed.' }),
  // listed on facilities.html
  P('design-capacity', 'campus', 'Жобалық қуаты туралы анықтама (техникалық паспорт)', 'Справка о проектной мощности (технический паспорт)', 'Design capacity statement (technical passport)'),
  P('classroom-equipment', 'campus', '№ 70 нормалары бойынша кабинеттерді жарақтандыру тізбесі', 'Перечень оснащения кабинетов по нормам приказа № 70', 'Classroom equipment list under order No. 70'),
  // listed on feedback.html
  P('appeals-officer-order', 'governance', 'Өтініштерге жауапты тұлғаны тағайындау туралы бұйрық', 'Приказ о назначении ответственного за рассмотрение обращений', 'Order appointing the person responsible for appeals'),
  P('appeals-regulation', 'governance', 'Өтініштерді қарау тәртібі туралы ереже', 'Положение о порядке рассмотрения обращений', 'Regulation on the procedure for handling appeals'),
  // listed on health.html
  P('medical-room-certificate', 'campus', 'Медициналық кабинетке арналған санитариялық-эпидемиологиялық қорытынды немесе лицензия', 'Санитарно-эпидемиологическое заключение или лицензия на медицинский кабинет', 'Sanitary certificate or licence for the medical room'),
  P('medical-schedule', 'campus', 'Медицина қызметкерінің жұмыс кестесі', 'График работы медицинского работника', 'Medical worker’s schedule'),
  P('vaccination-plan', 'campus', 'Профилактикалық екпелер жоспары (оқу жылына)', 'План профилактических прививок (на учебный год)', 'Vaccination plan for the school year'),
  // listed on leadership.html
  P('director-diploma', 'governance', 'Директордың білімі туралы құжат (диплом) және біліктілік санаты туралы куәлік', 'Документ об образовании (диплом) и удостоверение о квалификационной категории директора', 'Director’s diploma and qualification-category certificate', { kz: 'Дербес деректер көрсетілмейтін көшірме (директордың келісімімен).', ru: 'Копия без лишних персональных данных (с согласия директора).', en: 'A copy with personal data redacted (with the director’s consent).' }),
  // listed on library.html
  P('textbook-list', 'education', 'Оқулықтар мен оқу-әдістемелік кешендердің тізбесі, сыныптар бойынша (2026–2027 оқу жылы)', 'Перечень учебников и учебно-методических комплексов по классам (2026–2027 учебный год)', 'List of textbooks and teaching kits by grade (2026–2027)'),
  P('textbook-provision', 'education', 'Оқушылардың оқулықтармен қамтамасыз етілуі туралы анықтама', 'Справка об обеспеченности учащихся учебниками', 'Statement on pupils’ textbook provision'),
  P('library-collection', 'education', 'Кітапхана қоры туралы анықтама', 'Справка о библиотечном фонде', 'Statement on the library collection'),
  // listed on meals.html
  P('meals-plan', 'meals', 'Тамақтануды ұйымдастыру жөніндегі жұмыс жоспары', 'План работы по организации питания', 'Work plan for school meals'),
  P('meals-commission-order', 'meals', 'Тамақтану сапасына мониторинг жүргізу комиссиясын құру туралы бұйрық', 'Приказ о создании комиссии по мониторингу качества питания', 'Order setting up the meal-quality commission'),
  P('meals-commission-reports', 'meals', 'Комиссияның ай сайынғы актілері мен қорытындылары', 'Ежемесячные акты и итоги работы комиссии', 'Monthly commission reports'),
  P('brakerazh-order', 'meals', 'Бракераж комиссиясын құру туралы бұйрық', 'Приказ о создании бракеражной комиссии', 'Order setting up the brakerazh commission'),
  P('brakerazh-records', 'meals', 'Бракераж комиссиясының актілері / журналы', 'Акты (журнал) бракеражной комиссии', 'Food-tasting (brakerazh) commission records'),
  P('drinking-water-order', 'meals', 'Ауыз су режиміне жауапты тұлғаны тағайындау туралы бұйрық', 'Приказ о назначении ответственного за питьевой режим', 'Order appointing the person responsible for drinking water'),
  P('meals-sez', 'meals', 'Тамақтану объектісінің санитариялық-эпидемиологиялық қорытындысы', 'Санитарно-эпидемиологическое заключение на объект питания', 'Sanitary certificate of the catering facility'),
  // listed on methodical.html
  P('method-teams-plans', 'education', 'Әдістемелік бірлестіктердің 2026–2027 оқу жылына арналған жұмыс жоспарлары', 'Планы работы методобъединений на 2026–2027 учебный год', 'Subject teams’ work plans for 2026–2027'),
  P('method-council-minutes', 'governance', 'Әдістемелік кеңес отырыстарының хаттамалары', 'Протоколы заседаний методического совета', 'Minutes of methodological council meetings', { kz: 'Мемлекеттік аттестаттауда алқалы органдардың жоспарлары мен хаттамалары тексеріледі (№ 114-НҚ).', ru: 'При госаттестации проверяются планы и протоколы коллегиальных органов (№ 114-НҚ).', en: 'State attestation checks the plans and minutes of collegial bodies (No. 114-NK).' }),
  P('control-reports', 'education', 'Мектепішілік бақылау қорытындысы бойынша талдамалық анықтамалар (2025–2026, 2026–2027)', 'Аналитические справки по итогам внутришкольного контроля (2025–2026, 2026–2027)', 'Analytical reports on internal control (2025–2026, 2026–2027)'),
  P('control-decisions', 'education', 'Бақылау нәтижелері бойынша басқару шешімдері (бұйрықтар, кеңес шешімдері)', 'Управленческие решения по итогам контроля (приказы, решения советов)', 'Management decisions following reviews (orders, council decisions)'),
  // listed on parents.html
  P('parent-committee', 'upbringing', 'Ата-аналар комитетінің құрамы', 'Состав родительского комитета', 'Parent committee members'),
  P('parent-meeting-minutes', 'upbringing', 'Ата-аналар жиналысының хаттамасы (соңғы)', 'Протокол родительского собрания (последний)', 'Minutes of the latest parent meeting'),
  // listed on safety.html
  P('access-control-order', 'safety', 'Өткізу режимі және объектішілік режим туралы бұйрық', 'Приказ о пропускном и внутриобъектовом режиме', 'Order on access control and on-site rules'),
  P('anti-terror-drills-plan', 'safety', 'Антитеррорлық қорғау бойынша оқу-жаттығулар жоспары', 'План учений и тренировок по антитеррористической защите', 'Anti-terror drills and exercises plan'),
  P('safe-route-map', 'safety', 'Қауіпсіз маршрут сызбасы «үй — мектеп — үй»', 'Схема безопасного маршрута «дом — школа — дом»', 'Safe route map “home — school — home”'),
  P('security-contract', 'safety', 'Күзет қызметін көрсету туралы шарт (немесе күзет туралы бұйрық)', 'Договор на охранные услуги (или приказ об организации охраны)', 'Security services contract (or order on security)'),
  // listed on structure.html
  P('ped-council-order', 'governance', 'Педагогикалық кеңестің құрамы туралы бұйрық (2026–2027)', 'Приказ о составе педагогического совета (2026–2027)', 'Order on the membership of the Pedagogical Council (2026–2027)'),
  P('ped-council-plan', 'governance', 'Педагогикалық кеңестің жұмыс жоспары (2026–2027)', 'План работы педагогического совета (2026–2027)', 'Pedagogical Council work plan (2026–2027)'),
  P('ped-council-minutes', 'governance', 'Педагогикалық кеңес отырыстарының хаттамалары мен шешімдері', 'Протоколы и решения заседаний педагогического совета', 'Minutes and decisions of Pedagogical Council meetings'),
  P('method-council-membership', 'governance', 'Әдістемелік кеңес пен бірлестіктердің құрамы', 'Состав методического совета и методических объединений', 'Membership of the methodological council and subject teams'),
  P('ethics-council-order', 'governance', 'Педагогикалық әдеп жөніндегі кеңестің құрамы туралы бұйрық', 'Приказ о составе совета по педагогической этике', 'Order on the membership of the Pedagogical Ethics Council'),
  P('ethics-council-plan', 'governance', 'Педагогикалық әдеп жөніндегі кеңестің жұмыс жоспары', 'План работы совета по педагогической этике', 'Pedagogical Ethics Council work plan'),
  P('ethics-council-report', 'governance', 'Педагогикалық әдеп жөніндегі кеңестің жұмыс нәтижелері туралы жалпы есеп', 'Обобщённый отчёт о работе совета по педагогической этике', 'Summary report on the Pedagogical Ethics Council’s work'),
  // listed on board.html
  P('board-nomination-minutes', 'board', 'Ата-аналар жиналысының хаттамасы (кандидаттарды сайлау)', 'Протокол собрания родителей (выдвижение кандидатов)', 'Minutes of the parents’ meeting (nominations)'),
  P('board-minutes', 'board', 'Қамқоршылық кеңес отырыстарының хаттамалары мен шешімдері', 'Протоколы и решения заседаний попечительского совета', 'Minutes and decisions of Board meetings'),
  // listed on upbringing.html
  P('upbringing-report-2025-2026', 'upbringing', 'Тәрбие жұмысының жылдық жоспарының орындалуы туралы есеп (2025–2026 оқу жылы)', 'Отчёт о выполнении годового плана воспитательной работы (2025–2026 учебный год)', 'Report on the annual upbringing plan (2025–2026)'),
  // ------------------------------------------------------------- SELF-ASSESSMENT evidence (were E()/E3() placeholders in
  // pages/self-assessment.mjs; listed on self-assessment.html and self-1…8). Filed under the matching site group so the
  // documents page, its counters and the README checklist include them; `criteria` ties each one to its criterion.
  SA('k1-licence-appendix-2025', 'license', [1], '№ KZ29LAM00002781 лицензияға қосымша (кіші түрлері және объект мекенжайы көрсетілген)', 'Приложение к лицензии № KZ29LAM00002781 (с подвидами и адресом объекта)', 'Appendix to licence No. KZ29LAM00002781 (sub-types and object address)'),
  SA3('k2-ethics-minutes', 'governance', [2], 'Педагогикалық әдеп жөніндегі кеңес отырыстарының хаттамалары', 'Протоколы заседаний совета по педагогической этике', 'Minutes of the pedagogical ethics council'),
  SA('k3-experience', 'governance', [3], 'Директордың педагогикалық және басшылық өтілін растайтын құжат (еңбек кітапшасынан үзінді)', 'Документ о педагогическом и руководящем стаже директора (выписка из трудовой книжки)', 'Proof of the director’s teaching and management experience (employment record extract)'),
  SA('k3-courses', 'governance', [3], 'Директордың соңғы 3 жылдағы біліктілікті арттыру сертификаттары', 'Сертификаты повышения квалификации директора за последние 3 года', 'Director’s professional development certificates, last 3 years'),
  SA3('k4-indicators', 'plan', [4], 'Даму жоспарының мақсатты индикаторларына қол жеткізу мониторингі', 'Мониторинг достижения целевых индикаторов плана развития', 'Monitoring of the development plan’s target indicators'),
  SA3('k5-staff-list', 'governance', [5], 'Педагогтердің білімі туралы мәліметтер кестесі', 'Таблица сведений об образовании педагогов', 'Table of teachers’ education'),
  SA('k5-diplomas', 'governance', [5], 'Педагогтердің дипломдары мен қайта даярлау құжаттарының көшірмелері (жеке деректері жасырылған)', 'Копии дипломов и документов о переподготовке педагогов (персональные данные закрыты)', 'Copies of teachers’ diplomas and retraining documents (personal data masked)'),
  SA3('k6-categories', 'governance', [6], 'Педагогтердің біліктілік санаттары туралы жиынтық кесте', 'Сводная таблица квалификационных категорий педагогов', 'Summary table of teachers’ qualification categories'),
  SA('k6-orders', 'governance', [6], 'Біліктілік санаттарын беру туралы бұйрықтардан үзінділер', 'Выписки из приказов о присвоении квалификационных категорий', 'Extracts from orders awarding qualification categories'),
  SA3('k7-courses', 'governance', [7], 'Педагогтердің біліктілікті арттыру курстарының жиынтық кестесі', 'Сводная таблица курсов повышения квалификации педагогов', 'Summary table of teachers’ professional development'),
  SA('k7-certificates', 'governance', [7], 'Біліктілікті арттыру сертификаттарының көшірмелері', 'Копии сертификатов о повышении квалификации', 'Copies of professional development certificates'),
  SA('k7-plan', 'governance', [7], 'Біліктілікті арттырудың перспективалық жоспары', 'Перспективный план повышения квалификации', 'Long-term professional development plan'),
  SA3('k8-orders', 'admission', [8], 'Білім алушыларды қабылдау, ауыстыру және шығару туралы бұйрықтар', 'Приказы о приёме, переводе и выбытии обучающихся', 'Orders on admission, transfer and withdrawal of pupils'),
  SA3('k8-movement', 'admission', [8], 'Білім алушылар қозғалысы туралы есеп (келгендер/кеткендер)', 'Отчёт о движении обучающихся (прибыли/выбыли)', 'Report on pupil movement (arrivals/departures)'),
  SA3('k9-contingent', 'admission', [9], 'Контингент туралы мәлімет: сынып-жинақтар, білім алушылар саны, толымдылық', 'Сведения о контингенте: классы-комплекты, число обучающихся, наполняемость', 'Student body data: classes, number of pupils, class sizes'),
  SA3('k9-groups', 'admission', [9], 'Сыныптарды топтарға бөлу туралы бұйрықтар', 'Приказы о делении классов на группы', 'Orders on dividing classes into groups'),
  SA('k10-rup-2425', 'education', [10], 'Жұмыс оқу жоспары (2024–2025 оқу жылы)', 'Рабочий учебный план (2024–2025 учебный год)', 'Working curriculum (2024–2025)'),
  SA('k10-rup-2526', 'education', [10], 'Жұмыс оқу жоспары (2025–2026 оқу жылы)', 'Рабочий учебный план (2025–2026 учебный год)', 'Working curriculum (2025–2026)'),
  SA('k10-compare', 'education', [10], 'ЖОЖ-ды үлгілік оқу жоспарымен салыстыру кестесі', 'Таблица сверки РУП с типовым учебным планом', 'Working vs standard curriculum comparison table'),
  SA('k11-programmes', 'education', [11], 'Қолданылатын үлгілік оқу бағдарламаларының тізбесі', 'Перечень применяемых типовых учебных программ', 'List of standard syllabuses used'),
  SA3('k11-completion', 'education', [11], 'Оқу бағдарламаларының орындалуы туралы анықтамалар', 'Справки о выполнении учебных программ', 'Reports on syllabus completion'),
  SA('k12-applicability', 'education', [12], 'Бейіндік оқытудың болуы / болмауы туралы анықтама', 'Справка о наличии / отсутствии профильного обучения', 'Note on whether profile education is provided'),
  SA3('k13-list', 'education', [13], 'Вариативтік компонент курстарының тізбесі мен бағдарламалары', 'Перечень и программы курсов вариативного компонента', 'List and programmes of variable-component courses'),
  SA3('k14-plan', 'education', [14], '«Өмір қауіпсіздігінің негіздері» курсының жоспарлауы', 'Планирование курса «Основы безопасности жизнедеятельности»', 'Planning of the life-safety course'),
  SA3('k15-plan', 'education', [15], '«Жол қозғалысы ережелері» сабақтарының жоспары мен тіркеу журналы', 'План занятий и журнал учёта по курсу «Правила дорожного движения»', 'Road-safety lesson plan and register'),
  SA3('k16-load', 'education', [16], 'Сыныптар бойынша оқу жүктемесінің есебі', 'Расчёт учебной нагрузки по классам', 'Study-load calculation by grade'),
  SA3('k17-schedules', 'education', [17], 'Жиынтық бағалау кестелері', 'Графики суммативного оценивания', 'Summative assessment schedules'),
  SA3('k17-results', 'education', [17], 'Оқу жылының қорытындылары туралы талдамалық анықтама және көшіру туралы бұйрықтар', 'Аналитическая справка об итогах учебного года и приказы о переводе', 'Year-end results analysis and promotion orders'),
  SA3('k18-reports', 'education', [18], 'Мектепішілік бақылау қорытындылары бойынша анықтамалар мен бұйрықтар', 'Справки и приказы по итогам внутришкольного контроля', 'In-school control reports and orders'),
  SA3('k19-support', 'education', [19], 'Психологиялық-педагогикалық сүйемелдеу жоспары мен есебі', 'План и отчёт психолого-педагогического сопровождения', 'Psychological and pedagogical support plan and report'),
  SA3('k20-pmpk', 'education', [20], 'ПМПК ұсынымдарын іске асыру туралы анықтама', 'Справка о реализации рекомендаций ПМПК', 'Note on implementing PMPC recommendations'),
  SA('k21-terms', 'education', [21], 'Білім беру бағдарламаларын меңгеру мерзімдері туралы анықтама', 'Справка о сроках освоения образовательных программ', 'Note on programme durations'),
  SA('k22-cal-2425', 'education', [22], 'Академиялық күнтізбе (2024–2025 оқу жылы)', 'Академический календарь (2024–2025 учебный год)', 'Academic calendar (2024–2025)'),
  SA('k22-cal-2526', 'education', [22], 'Академиялық күнтізбе (2025–2026 оқу жылы)', 'Академический календарь (2025–2026 учебный год)', 'Academic calendar (2025–2026)'),
  SA3('k23-records', 'education', [23], 'Қашықтан оқыту кезеңдеріндегі сабақ кестесі мен қатысу есебі', 'Расписание и учёт посещаемости в периоды дистанционного обучения', 'Timetable and attendance during distance-learning periods'),
  SA3('k24-analysis', 'upbringing', [24], 'Тәрбие жұмысы жоспарының орындалуы туралы талдау', 'Анализ выполнения плана воспитательной работы', 'Analysis of upbringing-plan delivery'),
  SA3('k25-clubs', 'upbringing', [25], 'Үйірмелер мен секциялардың тізбесі, кестесі және қамту көрсеткіштері', 'Перечень, расписание и охват кружков и секций', 'List, timetable and participation of clubs and sections'),
  SA3('k26-meetings', 'upbringing', [26], 'Ата-аналар жиналыстарының хаттамалары', 'Протоколы родительских собраний', 'Minutes of parent meetings'),
  SA('k26-contracts', 'admission', [26], 'Білім беру қызметтерін көрсету туралы жасалған шарттар туралы анықтама', 'Справка о заключённых договорах об оказании образовательных услуг', 'Note on signed educational-services contracts'),
  SA3('k27-plan', 'upbringing', [27], 'Профилактикалық жұмыс жоспары (буллинг, құқық бұзушылық, киберқауіпсіздік)', 'План профилактической работы (буллинг, правонарушения, кибербезопасность)', 'Prevention work plan (bullying, offences, online safety)'),
  SA3('k27-psych', 'upbringing', [27], 'Педагог-психологтың жұмыс жоспары мен жылдық есебі', 'План работы и годовой отчёт педагога-психолога', 'School psychologist’s plan and annual report'),
  SA('k28-register', 'campus', [28], 'Жылжымайтын мүлік тізілімінен үзінді', 'Выписка из государственного регистра недвижимости', 'Extract from the real-estate register'),
  SA('k29-inventory', 'campus', [29], 'Негізгі құралдарды түгендеу актісі', 'Инвентаризационная опись основных средств', 'Fixed-asset inventory'),
  SA('k30-room', 'campus', [30], 'Медициналық пункттің жабдықталуы туралы анықтама', 'Справка об оснащении медицинского пункта', 'Note on the medical room’s equipment'),
  SA('k31-orders', 'campus', [31], 'Бақылаушы органдардың ұйғарымдары және олардың орындалуы туралы анықтама (болған жағдайда)', 'Справка о предписаниях контролирующих органов и их исполнении (при наличии)', 'Note on inspectors’ orders and their execution (if any)'),
  SA('k33-water', 'meals', [33], 'Ауыз су сапасын зертханалық зерттеу хаттамасы', 'Протокол лабораторного исследования питьевой воды', 'Drinking-water laboratory report'),
  SA('k33-note', 'meals', [33], 'Ауыз су режимі мен санитариялық тораптар туралы анықтама', 'Справка об организации питьевого режима и санитарных узлах', 'Note on drinking water and toilet facilities'),
  SA('k34-cctv', 'safety', [34], 'Бейнебақылау жүйесі және дабыл түймесі туралы анықтама', 'Справка о системе видеонаблюдения и тревожной кнопке', 'Note on video surveillance and the panic button'),
  SA('k35-passport', 'campus', [35], 'Ғимараттың қолжетімділік паспорты', 'Паспорт доступности здания', 'Building accessibility passport'),
  SA('k35-aids', 'campus', [35], 'ЕББҚ бар білім алушыларға арналған оқу құралдарының тізбесі', 'Перечень средств обучения для обучающихся с ООП', 'List of learning aids for pupils with SEN'),
  SA('k37-ict', 'education', [37], 'АКТ жабдықтарымен қамтамасыз етілу туралы анықтама', 'Справка об обеспеченности ИКТ-оборудованием', 'Note on ICT equipment'),
  SA('k37-internet', 'education', [37], 'Интернет қызметтерін көрсету шарты', 'Договор на оказание услуг Интернет', 'Internet services contract'),
  SA('k37-resources', 'education', [37], 'Пайдаланылатын цифрлық білім беру ресурстарының тізбесі', 'Перечень используемых цифровых образовательных ресурсов', 'List of digital learning resources used'),
  SA('k38-domain', 'governance', [38], 'keremet.edu.kz доменін тіркеу туралы куәлік', 'Свидетельство о регистрации домена keremet.edu.kz', 'Registration certificate for the keremet.edu.kz domain'),
  SA('k38-order', 'governance', [38], 'Сайтты жүргізуге жауапты тұлғаны тағайындау туралы бұйрық', 'Приказ о назначении ответственного за ведение сайта', 'Order appointing the person responsible for the website'),
  SA('k39-results', 'education', [39], 'Компьютерлік тестілеу нәтижелері (4-сынып; 9-сынып болған жағдайда)', 'Результаты компьютерного тестирования (4 класс; 9 класс — при наличии)', 'Computer-testing results (grade 4; grade 9 if any)'),
  SA('k39-participation', 'education', [39], 'Тестілеуге қатысу туралы анықтама (жалпы саны, қатысқандар, босатылғандар)', 'Справка об участии в тестировании (всего, приняли участие, освобождены)', 'Participation note (total, took part, exempted)'),
  SA('k39-analysis', 'education', [39], 'Компьютерлік тестілеу нәтижелерін талдау', 'Анализ результатов компьютерного тестирования', 'Analysis of computer-testing results'),
  SA('sheet-signed', 'governance', [], 'Бағалау парағы (Қағидаларға 4-қосымша), басшы қол қойған', 'Лист оценивания (приложение 4 к Правилам), подписанный руководителем', 'Evaluation sheet (Appendix 4 to the Rules) signed by the head', { kz: 'Нысан дәл 4-қосымша бойынша: жоғарыда — білім беру ұйымының атауы; бағандар — «р/с №», «Бағалау өлшемшарттары», «Білім беру ұйымына тиісті өлшеуішті бағалау мазмұны», «Баллдары»; соңғы жол — «Балдардың жалпы сомасы». 39 жол, қосымша бағандарсыз.', ru: 'Строго по форме приложения 4: вверху — наименование организации образования; столбцы — «№ п/п», «Критерии оценивания», «Содержание оценивания измерителя, соответствующего организации образования», «Баллы»; последняя строка — «Общая сумма баллов». 39 строк, без дополнительных столбцов.', en: 'Exactly in the Appendix 4 layout: the organisation’s name at the top; columns “No.”, “Evaluation criteria”, “Content of the measure”, “Points”; last row “Total score”. 39 rows, no extra columns.' }),
  SA('sa-order', 'governance', [], 'Өзін-өзі бағалау жүргізу және жұмыс тобын құру туралы бұйрық', 'Приказ о проведении самооценки и создании рабочей группы', 'Order on conducting the self-assessment and forming the working group'),
];

export const documents = raw.map((d) => ({ size: sizeOf(d.file), thumb: thumbOf(d.file), ...d }));

/** Site stamp of a document: the later of `changed` and `posted` ('' when neither is set). */
export const stampOf = (d) => [d?.changed, d?.posted].filter(Boolean).sort().pop() || '';

/** All documents of one group (published first, then pending). */
export function docsByGroup(group) {
  return seen(documents.filter((d) => d.group === group).sort((a, b) => (a.file ? 0 : 1) - (b.file ? 0 : 1)));
}
/** One document by id. */
export function docById(id) { const d = documents.find((x) => x.id === id) || null; seen([d]); return d; }
/** Published documents, newest placement first (for "latest documents" blocks). */
export function latestDocuments(n = 5) {
  return seen(documents.filter((d) => d.file && !d.archived).sort((a, b) => stampOf(b).localeCompare(stampOf(a)) || String(b.date).localeCompare(String(a.date))).slice(0, n));
}
/** Pending documents (for README checklist / self-assessment). */
export function pendingDocuments() { return documents.filter((d) => !d.file && !d.url); }

export default documents;
