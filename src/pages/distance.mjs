// Education group — Distance learning incl. adverse weather & emergencies (ORDER-114 §F item 51).
// Rules: appendix 1 to order №349 of 27.11.2023 (ed. №103 of 02.05.2025 and №182-НҚ of 26.06.2026), text read 24.09.2026.
// The school's own order, channels and platforms → pending.
import { actItems, actRef, checkedNote } from './curriculum.mjs';

const X = (kz, ru, en) => ({ kz, ru, en });

export default {
  slug: 'distance',
  group: 'education',
  order: 60,
  title: X('Қашықтан оқыту', 'Дистанционное обучение', 'Distance learning'),
  description: X(
    'Қашықтан оқытуға көшу тәртібі (№ 349 қағидалар): қолайсыз ауа райы, төтенше жағдай, карантин; хабарлау уақыты мен арналары, ата-аналарға кеңестер.',
    'Порядок перехода на дистанционное обучение (правила № 349): непогода, ЧС, карантин; время и каналы оповещения, советы родителям.',
    'How the school switches to distance learning (rules No. 349): adverse weather, emergencies, quarantine; alert times and channels, tips for parents.',
  ),
  styles: ['education'],
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, { ui, S, L, href, docById }) {
    const ref = (id, label) => actRef(ui, id, lang, label);

    // ------------------------------------------------------------ cases (p. 3)
    const cases = ui.cards([
      { icon: 'warn', tag: '1', title: X('Қолайсыз ауа райы', 'Неблагоприятные погодные условия', 'Adverse weather'), text: X('Аяз, боран және басқа да қолайсыз метеожағдайлар.', 'Мороз, метель и другие неблагоприятные метеоусловия.', 'Frost, blizzards and other adverse conditions.') },
      { icon: 'shield', tag: '2', title: X('Төтенше жағдай, карантин', 'ЧП, ЧС, карантин', 'Emergency, quarantine'), text: X('Төтенше жағдай, шектеу іс-шаралары, карантин, төтенше жағдайлар жарияланғанда.', 'Введение чрезвычайного положения, ограничительных мероприятий, карантина, объявление ЧС.', 'State of emergency, restrictions, quarantine or a declared emergency.') },
      { icon: 'medical', tag: '3', title: X('Денсаулық жағдайы', 'Состояние здоровья', 'Health'), text: X('Дәрігерлік-консультациялық комиссияның (ДКК) қорытындысы болса; мерзімін ДКК белгілейді.', 'При наличии заключения врачебно-консультационной комиссии (ВКК); срок определяет ВКК.', 'With a medical advisory commission conclusion; it sets the period.') },
      { icon: 'trophy', tag: '4', title: X('Жарыстар мен конкурстар', 'Сборы, соревнования, конкурсы', 'Competitions'), text: X('Халықаралық, республикалық жиындарға, жарыстарға, зияткерлік және шығармашылық конкурстарға қатысу кезеңінде.', 'На период участия в международных и республиканских сборах, соревнованиях, интеллектуальных и творческих конкурсах.', 'While taking part in international or national training camps, competitions and contests.') },
      { icon: 'users', tag: '5', title: X('Ата-ананың өтініші', 'Заявление родителей', 'Parents’ request'), text: X('Педагогикалық және қамқоршылық кеңестің шешімімен, үлгерімі, жағдайлары, психолог қорытындысы ескеріледі.', 'Решением педагогического и попечительского советов с учётом успеваемости, условий, заключения психолога.', 'By decision of the pedagogical and trustee councils, considering progress, conditions and the psychologist’s opinion.') },
    ], { cols: 3 });

    // ------------------------------------------------------------ morning timeline (pp. 14–15)
    const t0 = 5.75, t1 = 13.25; // 05:45 … 13:15
    const pos = (h) => (((h - t0) / (t1 - t0)) * 100).toFixed(2);
    const win = (a, b, cls, label) => `<span class="edu-clock__win edu-clock__win--${cls}" style="--l:${pos(a)}%;--w:${(pos(b) - pos(a)).toFixed(2)}%"><em>${label}</em></span>`;
    const hm = (h) => `${String(Math.floor(h)).padStart(2, '0')}:${String(Math.round((h % 1) * 60)).padStart(2, '0')}`;
    const ticks = [6, 7, 8, 9, 10, 11, 12, 13].map((h) => `<span class="edu-clock__tick" style="--x:${pos(h)}%">${hm(h)}</span>`).join('');
    const clock = `<div class="edu-clock" role="group" aria-label="${L(X('Хабарлау уақыты', 'Время оповещения', 'Alert times'))}">
<div class="edu-clock__lane"><span></span><div class="edu-clock__axis" aria-hidden="true">${ticks}</div></div>
<div class="edu-clock__lane"><span class="edu-clock__k">${L(X('Мектеп бұйрығы', 'Приказ школы', 'School order'))}<small>${L(X('басқармаға хабарланады', 'доводится до управления', 'reported to the department'))}</small></span><div class="edu-clock__track">${win(6, 7, 'order', `${L(X('1-ауысым', '1 смена', 'Shift 1'))} · 06:00–07:00`)}${win(10.5, 12, 'order', `${L(X('2–3-ауысым', '2–3 смена', 'Shifts 2–3'))} · 10:30–12:00`)}</div></div>
<div class="edu-clock__lane"><span class="edu-clock__k">${L(X('Ата-аналар мен оқушыларға хабарлау', 'Оповещение родителей и учеников', 'Alert to parents & pupils'))}</span><div class="edu-clock__track">${win(6.75, 8, 'notify', `${L(X('1-ауысым', '1 смена', 'Shift 1'))} · 06:45–08:00`)}${win(11.25, 13, 'notify', `${L(X('2–3-ауысым', '2–3 смена', 'Shifts 2–3'))} · 11:15–13:00`)}</div></div></div>`;
    const weatherSteps = ui.steps([
      { title: X('Көрсеткіштерді қала бекітеді', 'Показатели утверждает город', 'The city sets the thresholds'), text: X('Оқу жылы басталғанға дейін Шымкент қаласының білім басқармасы сабақ қашықтан өтетін ауа райы көрсеткіштерін (оқушылардың жасын ескеріп) және хабарлау жүйесін бекітеді.', 'До начала учебного года Управление образования г. Шымкент утверждает показатели погоды, при которых занятия переводятся на дистанционное обучение (с учётом возраста обучающихся), и систему оповещения.', 'Before the year starts, Shymkent’s education department approves the weather thresholds (by age) and the alert system.') },
      { title: X('Мектеп бұйрық шығарады', 'Школа издаёт приказ', 'The school issues an order'), text: X('Бұйрықта: қай сыныптар мен ауысымдар, мектептің жұмыс режимі, әкімшіліктен жауаптылар, оқушыларды қабылдап, үйге қауіпсіз жіберетін педагогтер көрсетіледі.', 'В приказе: какие классы и смены, режим работы школы, ответственные из администрации, педагоги, которые принимают детей и обеспечивают их безопасную отправку домой.', 'The order names the classes and shifts, the school’s regime, responsible administrators, and the teachers who receive pupils and see them safely home.') },
      { title: X('Бұйрық сайтқа қойылады', 'Приказ — на сайт', 'The order goes online'), text: X('Бекітілген бойда мектептің ресми сайтында және ақпараттық стендтерде жарияланады.', 'Сразу после утверждения размещается на официальном сайте школы и на информационных стендах.', 'Immediately published on the school website and notice boards.') },
      { title: X('Мектепке келгендерге — толық күн', 'Пришедшим — полный день', 'Full day for those who come'), text: X('Мектепке келген оқушыларға барлық сабақтар, үйірмелер, ұзартылған күн тобы және ыстық тамақ кесте бойынша толық көлемде беріледі.', 'Для пришедших в школу все занятия, кружки, группы продлённого дня и горячее питание проводятся в полном объёме по расписанию.', 'Pupils who come to school get all lessons, clubs, extended-day care and hot meals as scheduled.') },
    ]);
    const channels = ui.cards([
      { icon: 'globe', title: X('Ресми сайттар', 'Официальные сайты', 'Official websites'), text: X('Мектеп пен білім басқармасының сайттары.', 'Сайты школы и управления образования.', 'The school’s and the education department’s sites.') },
      { icon: 'chat', title: X('Әлеуметтік желілер мен мессенджерлер', 'Соцсети и мессенджеры', 'Social media & messengers'), text: X('Мектеп пен білім басқармасының парақшалары мен топтары.', 'Страницы и группы школы и управления образования.', 'Pages and groups of the school and department.') },
      { icon: 'user', title: X('Сынып жетекшілері', 'Классные руководители', 'Class teachers'), text: X('Әр отбасына сынып жетекшісі арқылы.', 'Каждой семье — через классного руководителя.', 'Every family, via the class teacher.') },
      { icon: 'mic', title: X('Жергілікті ТВ және радио', 'Местное ТВ и радио', 'Local TV & radio'), text: X('Білім басқару органдарының хабарландырулары.', 'Объявления органов управления образованием.', 'Announcements by education authorities.') },
    ], { cols: 4 });
    const channelsPending = ui.pending({ title: X('«Керемет» мектебінің хабарлау арналары', 'Каналы оповещения школы «Керемет»', 'Keremet’s alert channels'), note: X(
      'Мектеп нақты арналарды бекіткен соң жарияланады: сыныптардың мессенджер топтары, жауапты тұлға және оның телефоны. Мектептің ресми парақшасы — ',
      'Будут опубликованы после утверждения школой: групповые чаты классов в мессенджерах, ответственное лицо и его телефон. Официальная страница школы — ',
      'To be published once approved: class messenger groups, the responsible person and phone. The school’s official page is ',
    )[lang] + ui.extLink(S.contacts.instagram.url, S.contacts.instagram.handle) + '.' });

    // ------------------------------------------------------------ other cases
    const other = ui.accordion([
      { q: X('Төтенше жағдай немесе карантин кезінде', 'При ЧП, ЧС или карантине', 'In an emergency or quarantine'), a: ui.prose(X(
        '<p>Қашықтан оқыту Шымкент қаласы білім басқармасының бұйрығы негізінде ұйымдастырылады. Мектеп оқушылардың оқуды басқару жүйесіне интернет арқылы қосылуына жағдай жасайды (22–23-т.).</p>',
        '<p>Дистанционное обучение организуется на основании приказа Управления образования г. Шымкент. Школа обеспечивает условия и доступ обучающихся к системе управления обучением через Интернет (пп. 22–23).</p>',
        '<p>Distance learning is organised by order of the Shymkent education department. The school provides access to its learning-management system over the Internet (paras 22–23).</p>')), open: true },
      { q: X('ДКК қорытындысы бойынша', 'По заключению ВКК', 'On medical grounds'), a: ui.prose(X(
        '<p>Қашықтан оқыту кезеңі мен мерзімін дәрігерлік-консультациялық комиссияның қорытындысы белгілейді (24-т.). Мектеп оқушыға үлгілік оқу бағдарламаларын, КТЖ, оқулықтарды, БЖБ мен ТЖБ кестелерін береді; ТЖБ, аралық және қорытынды аттестаттау мектепте күндізгі форматта өтеді (5-т.).</p>',
        '<p>Период и срок дистанционного обучения определяет заключение врачебно-консультационной комиссии (п. 24). Школа предоставляет типовые программы, КТП, учебники, графики СОр и СОч; СОч, промежуточная и итоговая аттестация проходят в школе очно (п. 5).</p>',
        '<p>The medical commission sets the period (para. 24). The school provides the syllabuses, lesson plans, textbooks and test schedules; term tests and attestation are taken at school in person (para. 5).</p>')) },
      { q: X('Жарыстар мен конкурстарға қатысу', 'Участие в соревнованиях и конкурсах', 'Competitions and contests'), a: ui.prose(X(
        '<p>Оқушының немесе ата-ананың директор атына еркін нысандағы өтініші және қатысуды растайтын уәкілетті органның бұйрығы (хаты) негізінде, қатысу кезеңіне беріледі. Оралғаннан кейін оқушы БЖБ мен ТЖБ тапсырады, мерзімдер сәйкес келмесе — жеке кесте бойынша (26-т.).</p>',
        '<p>По заявлению ученика или родителя на имя директора в произвольной форме и на основании приказа (письма) уполномоченного органа, подтверждающего участие, — на период участия. После возвращения ученик сдаёт СОр и СОч, при несовпадении сроков — по индивидуальному графику (п. 26).</p>',
        '<p>On a free-form application to the director plus an order or letter from the relevant authority confirming participation, for the period of the event. Afterwards the pupil sits the unit and term tests, if needed on an individual schedule (para. 26).</p>')) },
      { q: X('Ата-ананың өтініші бойынша', 'По заявлению родителей', 'At parents’ request'), a: ui.prose(X(
        '<p>Педагогикалық кеңес пен қамқоршылық кеңестің шешімімен, оқушының үлгерімі, қашықтан оқуға жағдайдың болуы, 10 жасқа толған баланың пікірі, мектеп психологының қорытындысы және отбасының тұрмыстық жағдайын тексеру актісі ескеріледі (28-т.). Ата-ана баланың оқуы мен әлеуметтенуін (секциялар, үйірмелер) өзі ұйымдастырады; мектеп спорт залын, кітапхананы, компьютер сыныбын тегін пайдалануға береді.</p>',
        '<p>Решением педагогического и попечительского советов с учётом успеваемости, наличия условий, мнения ребёнка, достигшего 10 лет, заключения школьного психолога и акта обследования материально-бытового положения семьи (п. 28). Родители сами организуют занятия и социализацию ребёнка (секции, кружки); школа бесплатно предоставляет спортзал, библиотеку, компьютерный класс.</p>',
        '<p>By decision of the pedagogical and trustee councils, considering progress, conditions at home, the views of a child aged 10+, the school psychologist’s opinion and a home-conditions report (para. 28). Parents organise study and socialising (clubs, sports); the school offers free use of its gym, library and computer room.</p>')) },
    ]);

    // ------------------------------------------------------------ tips
    const tips = ui.steps([
      { title: X('Хабарлау уақытында телефонды тексеріңіз', 'Проверяйте телефон в часы оповещения', 'Check your phone at alert times'), text: X('1-ауысым үшін 06:45–08:00, 2–3-ауысым үшін 11:15–13:00.', 'Для 1 смены — 06:45–08:00, для 2–3 смены — 11:15–13:00.', 'Shift 1: 06:45–08:00; shifts 2–3: 11:15–13:00.') },
      { title: X('Сынып жетекшісінің хабарламасына сүйеніңіз', 'Ориентируйтесь на сообщение классного руководителя', 'Rely on the class teacher’s message'), text: X('Расталмаған «хабарламаларды» таратпаңыз; ресми ақпарат — мектеп пен білім басқармасынан.', 'Не пересылайте непроверенные «сообщения»; официальная информация — от школы и управления образования.', 'Don’t forward unverified messages; official information comes from the school and the department.') },
      { title: X('Құрылғы мен байланысты алдын ала дайындаңыз', 'Заранее подготовьте устройство и связь', 'Prepare the device and connection'), text: X('Зарядталған құрылғы, платформаға кіру деректері, тыныш оқу орны.', 'Заряженное устройство, данные для входа на платформу, тихое место для занятий.', 'A charged device, platform log-in details, a quiet place to study.') },
      { title: X('Бала мектепке келсе', 'Если ребёнок пришёл в школу', 'If your child comes to school'), text: X('Мектеп жұмыс істейді: келген балалар толық кесте бойынша оқиды және тамақтанады, сабақтан кейін ата-анасының сүйемелдеуімен үйге қайтады.', 'Школа работает: пришедшие дети занимаются по полному расписанию и питаются, уходят домой в сопровождении родителей.', 'The school stays open: children who come follow the full timetable, eat, and go home accompanied by parents.') },
    ]);

    // ------------------------------------------------------------ platforms & docs
    const platforms = ui.split({
      ratio: '1:1',
      left: ui.pending({ title: X('Платформалар мен цифрлық ресурстар', 'Платформы и цифровые ресурсы', 'Platforms and digital resources'), note: X('Мектеп қолданатын оқуды басқару жүйесі (LMS), электрондық журнал, бейнебайланыс платформасы, кіру тәртібі және техникалық қолдау байланысы.', 'Используемая школой система управления обучением (LMS), электронный журнал, платформа видеосвязи, порядок входа и контакт техподдержки.', 'The school’s learning-management system, e-journal, video platform, log-in procedure and technical support contact.') }),
      right: ui.docList([
        // Local title: align the registry wording with the term of the Kazakh text of order №349 («қашықтан оқыту»).
        ...[docById('distance-order')].filter(Boolean).map((d) => ({ ...d, title: X('Қашықтан оқытуды ұйымдастыру тәртібі туралы бұйрық', 'Приказ о порядке организации дистанционного обучения', 'Order on the organisation of distance learning') })),
        docById('distance-weather-orders'),
      ].filter(Boolean)),
    });

    const related = ui.linkList([
      { href: href('schedule'), icon: 'calendar', label: X('Сабақ кестесі және оқу жылы', 'Расписание и учебный год', 'Timetable & school year') },
      { href: href('news'), icon: 'rss', label: X('Жаңалықтар', 'Новости', 'News'), note: X('Хабарландырулар', 'Объявления', 'Announcements') },
      { href: href('safety'), icon: 'shield', label: X('Қауіпсіздік', 'Безопасность', 'Safety') },
      { href: S.gov.cityEducation.url, icon: 'building', label: S.gov.cityEducation.label, note: 'gov.kz' },
    ]);
    const toc = ui.toc([
      { id: 'cases', label: X('Қашан қашықтан оқимыз', 'Когда учимся дистанционно', 'When we learn remotely') },
      { id: 'weather', label: X('Қолайсыз ауа райы', 'Неблагоприятная погода', 'Adverse weather') },
      { id: 'other', label: X('Басқа жағдайлар', 'Другие случаи', 'Other cases') },
      { id: 'tips', label: X('Ата-аналарға', 'Родителям', 'For parents') },
      { id: 'platforms', label: X('Платформалар мен құжаттар', 'Платформы и документы', 'Platforms & documents') },
    ]);

    return [
      ui.split({ ratio: '2:1', align: 'center', left: `${ui.eyebrow(X('№ 349 қағидалар', 'Правила № 349', 'Rules No. 349'))}<h2 class="sec__title">${L(X('Оқу тоқтамайды — тек форматы өзгереді', 'Учёба не останавливается — меняется только формат', 'Learning doesn’t stop — only the format changes'))}</h2>${ui.lead(X(
        'Қашықтан оқыту — педагог пен оқушының арақашықтықта, соның ішінде цифрлық технологиялар арқылы өзара әрекеттесуі. Оған көшу тәртібін Оқу-ағарту министрлігінің қағидалары белгілейді.',
        'Дистанционное обучение — взаимодействие педагога и обучающихся на расстоянии, в том числе с применением цифровых технологий. Порядок перехода на него устанавливают правила Министерства просвещения.',
        'Distance learning means teacher and pupils working together at a distance, including through digital technology. The Ministry of Education’s rules set out how the switch happens.'))}`, right: toc }),
      ui.section({ id: 'cases', eyebrow: X('Қағидалардың 3-тармағы', 'Пункт 3 правил', 'Rules, para. 3'), title: X('Қашықтан оқыту қашан қолданылады', 'Когда применяется дистанционное обучение', 'When distance learning applies'), body: cases }),
      ui.section({ id: 'weather', tone: 'physics', eyebrow: X('Аяз, боран, дауыл', 'Мороз, метель, буран', 'Frost, blizzard, storm'), title: X('Қолайсыз ауа райы кезінде', 'При неблагоприятной погоде', 'In adverse weather'), lead: X('Мақсат — балалардың өмірі мен денсаулығын қорғау. Барлығы таңертең белгілі бір уақыт аралығында шешіледі.', 'Цель — охрана жизни и здоровья детей. Всё решается утром в строго определённые часы.', 'The aim is to protect children’s lives and health. Everything is decided in fixed morning windows.'), body: clock + ui.note(X(`Уақыт аралықтары — ${ref('distance', '№ 349 қағидалар, 14–15-т.')}.`, `Временные окна — ${ref('distance', 'правила № 349, пп. 14–15')}.`, `Time windows — ${ref('distance', 'rules No. 349, paras 14–15')}.`)) + weatherSteps }),
      ui.section({ eyebrow: X('13-тармақ', 'Пункт 13', 'Para. 13'), title: X('Қайдан білуге болады', 'Где узнать', 'Where to find out'), body: channels + channelsPending }),
      ui.section({ id: 'other', title: X('Басқа жағдайлар', 'Другие случаи', 'Other cases'), body: other }),
      ui.section({ id: 'tips', tone: 'hero', eyebrow: X('Ата-аналарға кеңес', 'Советы родителям', 'Tips for parents'), title: X('Суық таңға дайын болайық', 'Готовимся к морозному утру', 'Ready for a frosty morning'), body: tips }),
      ui.section({ id: 'platforms', title: X('Платформалар мен құжаттар', 'Платформы и документы', 'Platforms and documents'), body: platforms }),
      ui.section({ eyebrow: 'adilet.zan.kz', title: X('Құқықтық негіз', 'Правовая основа', 'Legal basis'), body: ui.linkList(actItems(['distance', 'assess'], lang)) + ui.note(checkedNote) }),
      ui.section({ title: X('Осы бөлімде', 'В этом разделе', 'In this section'), body: related }),
    ].join('\n');
  },
};
