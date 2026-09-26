// School meals — the «Школьное питание / Мектептегі тамақтану» rubric (ORDER-114 P.93, §H item 62).
// Legal basis read on 24.09.2026: order of the Minister of Education and Science No. 598 of 31.10.2018
// (V1800017948), п.105 (rubric: perspective menu, work plan, commission acts), п.106 (the HEAD of the school
// approves the daily menu with portion sizes on the basis of the long-term menu approved by the health authority
// and posts it in the canteen and where parents can see it), п.109 (monitoring-commission composition, chaired by
// the head), п.110 (as amended 05.05.2026: quarterly report to the local executive body by the 15th of the month
// after the quarter on suppliers' compliance, incl. бракераж), п.111 (monthly results -> pedagogical council ->
// website), п.70 (supplier info within 2 working days). ORDER-114 P.93 also expects the бракераж commission's acts.
// Sanitary rules ҚР ДСМ-76 (V2100023890): п.4 пп.3 (definition of бракераж), пп.28, 30 (drinking regime: boiled
// water kept <= 3 hours; a responsible person appointed by the head's order; free access all day), app. 11 item 19
// (the бракераж log is part of the medical documentation). All re-read on adilet 25.09.2026. The order binds STATE schools; for this
// private school it is best practice. Fact: the school's Instagram bio lists «Ыстық тамақ» (hot meals).
// Everything else (supplier, menu, commission members, documents) is pending.
// DATA: the menus live in src/data/menu.mjs (daily menus keyed by date + the weekly board); supplier and commission in
// S.meals.{supplier, commission} (src/data/school.mjs). Each block renders from data and falls back to a pending block
// only while its data is empty — publishing a menu never requires editing this file.
import MENU from '../data/menu.mjs';

const X = (kz, ru, en) => ({ kz, ru, en });
const MONTHS_NOM = {
  kz: ['Қаңтар', 'Ақпан', 'Наурыз', 'Сәуір', 'Мамыр', 'Маусым', 'Шілде', 'Тамыз', 'Қыркүйек', 'Қазан', 'Қараша', 'Желтоқсан'],
  ru: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};
const WEEKDAYS = [X('Дүйсенбі', 'Понедельник', 'Monday'), X('Сейсенбі', 'Вторник', 'Tuesday'), X('Сәрсенбі', 'Среда', 'Wednesday'), X('Бейсенбі', 'Четверг', 'Thursday'), X('Жұма', 'Пятница', 'Friday'), X('Сенбі', 'Суббота', 'Saturday')];
const isDate = (d) => /^\d{4}-\d{2}-\d{2}$/.test(String(d || ''));
const num = (n) => (n == null || n === '' ? '' : String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '));

export default {
  slug: 'meals',
  group: 'campus',
  order: 20,
  title: { kz: 'Мектептегі тамақтану', ru: 'Школьное питание', en: 'School meals' },
  description: {
    kz: '«Мектептегі тамақтану» айдары: ыстық тамақ, перспективалық және күнделікті мәзір, сапа комиссиясы, жеткізуші, ауыз су режимі.',
    ru: 'Рубрика «Школьное питание»: горячее питание, перспективное и ежедневное меню, комиссия по качеству, поставщик, питьевой режим.',
    en: 'School meals: hot meals, long-term and daily menus, the meal-quality commission, the supplier and drinking water.',
  },
  styles: ['campus'],
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, { ui, S, L, t, href, asset, docById, fmt }) {
    const wait = ui.badge(t('unconfirmed'), 'warn');
    const docWait = ui.badge(t('doc.pending'), 'warn');
    const ok = ui.badge(X('Расталған', 'Подтверждено', 'Confirmed'), 'ok');
    const esc = ui.esc;
    const M = S.meals || {};
    const menuDays = [...(MENU.days || []), ...(Array.isArray(M.menu) ? M.menu : [])]
      .filter((d) => d && isDate(d.date) && Array.isArray(d.meals) && d.meals.length)
      .sort((a, b) => b.date.localeCompare(a.date));
    const weekData = MENU.week && Array.isArray(MENU.week.days) && MENU.week.days.length ? MENU.week : null;
    const hasMenu = menuDays.length > 0;
    const adilet = (code) => `https://adilet.zan.kz/${lang === 'kz' ? 'kaz' : 'rus'}/docs/${code}`;
    const o598 = ui.extLink(adilet('V1800017948'), X('№ 598 бұйрық', 'приказ № 598', 'order No. 598'));
    const o598g = ui.extLink(adilet('V1800017948'), X('№ 598 бұйрықтың', 'приказа № 598', 'order No. 598'));
    const igSrc = ui.extLink(S.contacts.instagram.url, 'Instagram');

    // ------------------------------------------------------------------ intro + rubric card
    const rubricItems = [
      { icon: 'calendar', t: X('Перспективалық мәзір', 'Перспективное меню', 'Long-term (cyclic) menu') },
      { icon: 'utensils', t: X('Күнделікті мәзір — тағам фотосы және бағасымен', 'Ежедневное меню — с фото блюд и ценами', 'Daily menu — with dish photos and prices') },
      { icon: 'doc', t: X('Тамақтануды ұйымдастыру жұмыс жоспары', 'План работы по организации питания', 'Work plan for school meals') },
      { icon: 'check', t: X('Бракераж комиссиясының актілері / журналы', 'Акты (журнал) бракеражной комиссии', 'Food-tasting (brakerazh) commission records') },
      { icon: 'users', t: X('Сапа мониторингі комиссиясының актілері (ай сайын)', 'Акты комиссии по мониторингу качества (ежемесячно)', 'Quality-commission reports (monthly)') },
      { icon: 'handshake', t: X('Жеткізуші туралы мәліметтер', 'Сведения о поставщике', 'Supplier information') },
    ];
    // Compact "what this rubric publishes" list (п.105) — one shared status, shown lower on the page (docs section).
    const rubric = `<div class="cmp-publist">
<div class="cmp-publist__head"><p class="cmp-publist__t">${L(X('Бұл айдарда не жарияланады', 'Что публикуется в этой рубрике', 'What this section publishes'))}</p>${docWait}</div>
<p class="cmp-publist__sub">${L(X(`${o598g} 105-тармағы бойынша, бракераж актілерімен қоса`, `По п. 105 ${o598g}, включая акты бракеража`, `Following para. 105 of ${o598g}, plus food-tasting records`))}</p>
<ul class="cmp-publist__list" role="list">${rubricItems.map((r) => `<li>${ui.icon(r.icon, { size: 18 })}<span>${L(r.t)}</span></li>`).join('')}</ul>
</div>`;

    // First screen: the confirmed fact (hot meals) + the drinking-water rules — real content, not a list of "not yet".
    const glanceItems = [
      { icon: 'utensils', t: X('Ыстық тамақ', 'Горячее питание', 'Hot meals'), s: X(`Мектептің ${igSrc} парақшасында көрсетілген`, `Указано на странице школы в ${igSrc}`, `Stated on the school’s ${igSrc} profile`), badge: ok },
      { icon: 'users', t: X('Ауыз суға күні бойы еркін қолжетімділік', 'Свободный доступ к питьевой воде весь день', 'Free access to drinking water all day'), s: X('ҚР ДСМ-76 санитариялық қағидалары, 30-т.', 'Санитарные правила ҚР ДСМ-76, п. 30', 'Sanitary rules ҚР ДСМ-76, para. 30') },
      { icon: 'clock', t: X('Қайнатылған су 3 сағаттан артық сақталмайды', 'Кипячёная вода хранится не дольше 3 часов', 'Boiled water is kept no longer than 3 hours'), s: X('ҚР ДСМ-76, 28-т.', 'ҚР ДСМ-76, п. 28', 'ҚР ДСМ-76, para. 28') },
      { icon: 'check', t: X('Жеке су бөтелкесіне рұқсат етіледі', 'Можно приносить свою бутылку воды', 'Children may bring their own water bottle'), s: X('ҚР ДСМ-76, 28-т.', 'ҚР ДСМ-76, п. 28', 'ҚР ДСМ-76, para. 28') },
      { icon: 'handshake', t: X('Ата-аналар тамақ сапасын бақылауға қатысады', 'Родители участвуют в контроле качества питания', 'Parents take part in checking meal quality'), s: X(`${o598g} 109-т. — комиссия құрамында`, `П. 109 ${o598g} — в составе комиссии`, `Para. 109 of ${o598g} — as commission members`) },
    ];
    const glance = ui.panel({
      theme: 'biology',
      body: `<p class="cmp-rubric-head">${L(X('Бір қарағанда', 'Коротко о главном', 'At a glance'))}</p>
<ul class="cmp-rubric cmp-glance" role="list">${glanceItems.map((g) => `<li>${ui.icon(g.icon, { size: 20 })}<span class="cmp-glance__txt"><span class="cmp-rubric__t">${L(g.t)}</span><small>${L(g.s)}</small></span>${g.badge || ''}</li>`).join('')}</ul>
<p class="cmp-glance__more"><a href="#water">${L(X('Ауыз су режимі толығырақ', 'Подробнее о питьевом режиме', 'More on drinking water'))} →</a></p>`,
    });
    const intro = ui.split({
      ratio: '1:1', align: 'center',
      left: `${ui.eyebrow(X('Ата-аналарға', 'Родителям', 'For parents'))}
<h2 class="sec__title">${L(X('Ыстық тамақ — ашық әрі түсінікті', 'Горячее питание — открыто и понятно', 'Hot meals — open and clear'))}</h2>
${ui.lead(X(
        'Мектеп ыстық тамақты өзінің басты артықшылықтарының бірі ретінде атайды. Осы бетте ата-аналар балалардың немен тамақтанатынын, тағамның сапасын кім тексеретінін және тамақты кім жеткізетінін біле алады.',
        'Школа называет горячее питание одним из своих главных преимуществ. На этой странице родители узнают, чем питаются дети, кто проверяет качество блюд и кто поставляет продукты.',
        'The school lists hot meals among its main strengths. This page tells parents what children eat, who checks the quality of the food and who supplies it.',
      ))}
${ui.chips([
        { icon: 'utensils', label: X('Ыстық тамақ', 'Горячее питание', 'Hot meals') },
        { icon: 'calendar', label: X('Мәзір', 'Меню', 'Menu'), href: '#today' },
        { icon: 'users', label: X('Сапа комиссиясы', 'Комиссия по качеству', 'Quality commission'), href: '#commission' },
      ])}
${ui.note(X(`«Ыстық тамақ» — мектептің ${igSrc} парақшасындағы мәлімет. Тамақтану режимі (күніне неше рет) нақтылануда.`, `«Горячее питание» — по данным страницы школы в ${igSrc}. Режим питания (сколько раз в день) уточняется.`, `“Hot meals” is stated on the school’s ${igSrc} profile. The meal schedule (how many meals a day) is being confirmed.`))}`,
      right: glance,
    });

    const toc = ui.toc([
      { id: 'today', label: hasMenu ? X('Күнделікті мәзір', 'Ежедневное меню', 'Daily menu') : X('Мәзір', 'Меню', 'Menu') },
      ...(weekData ? [{ id: 'week', label: X('Апталық мәзір', 'Меню на неделю', 'Weekly menu') }] : []),
      ...(menuDays.length > 1 ? [{ id: 'archive', label: X('Мәзір мұрағаты', 'Архив меню', 'Menu archive') }] : []),
      { id: 'commission', label: X('Сапа комиссиясы', 'Комиссия по качеству', 'Quality commission') },
      { id: 'supplier', label: X('Жеткізуші және асхана', 'Поставщик и столовая', 'Supplier and canteen') },
      { id: 'water', label: X('Ауыз су режимі', 'Питьевой режим', 'Drinking water') },
      { id: 'faq', label: X('Жиі қойылатын сұрақтар', 'Частые вопросы', 'FAQ') },
      { id: 'docs', label: X('Құжаттар', 'Документы', 'Documents') },
    ]);

    // ------------------------------------------------------------------ menus (from src/data/menu.mjs)
    const menuBasis = ui.note(X(
      `Күнделікті мәзірді перспективалық (циклдік) мәзір негізінде мектеп директоры бекітеді; мәзір асханада және ата-аналарға қолжетімді жерде ілінеді (${o598g} 106-т.). Перспективалық мәзір жас ерекшелігіне сай тамақтану нормаларымен құрастырылып, денсаулық сақтау органында бекітіледі.`,
      `Ежедневное меню утверждает руководитель школы на основе перспективного (цикличного) меню и размещает его в столовой и в месте, доступном для родителей (п. 106 ${o598g}). Перспективное меню составляется с учётом возрастных норм питания и утверждается органом здравоохранения.`,
      `The daily menu is approved by the head of the school on the basis of the long-term (cyclic) menu and posted in the canteen and where parents can see it (para. 106, ${o598g}). The long-term menu follows age-appropriate nutrition norms and is approved by the health authority.`,
    ));
    const menuTable = (day, caption) => ui.table({
      compact: true,
      caption,
      head: [X('Ас', 'Приём пищи', 'Meal'), X('Тағам', 'Блюдо', 'Dish'), X('Шығымы, г', 'Выход, г', 'Portion, g'), X('Бағасы, ₸', 'Цена, ₸', 'Price, ₸')],
      numeric: [2, 3],
      rows: day.meals.map((m) => [
        esc(L(m.slot)),
        `${m.photo ? `<img class="cmp-dish__img" src="${esc(asset(m.photo))}" alt="" loading="lazy" width="56" height="56">` : ''}<span>${esc(L(m.dish))}</span>`,
        num(m.grams) || '—',
        num(m.price) || '—',
      ]),
    });
    const dayTitle = (d) => `<time datetime="${d.date}">${fmt.dateLong(d.date)}</time>`;
    let menuBody;
    if (hasMenu) {
      const d = menuDays[0];
      const photo = d.photo
        ? `<figure class="cmp-daily__photo cmp-daily__photo--img"><img src="${esc(asset(d.photo))}" alt="${esc(L(d.photoAlt) || L(X('Күннің тағамдары', 'Блюда дня', 'The day’s dishes')))}" loading="lazy" width="640" height="480"></figure>`
        : '';
      menuBody = `<article class="cmp-daily${photo ? ' cmp-daily--photo' : ''}">${photo}
<div class="cmp-daily__main"><div class="cmp-daily__head"><h3 class="cmp-daily__date">${L(X('Мәзір:', 'Меню на', 'Menu for'))} ${dayTitle(d)}</h3>${ui.badge(X('Директор бекіткен', 'Утверждено директором', 'Approved by the director'), 'ok')}</div>
${menuTable(d, X('Тағамдар, шығымы және бағасы', 'Блюда, выход и цена', 'Dishes, portion and price'))}</div>
</article>${menuBasis}`;
    } else {
      menuBody = `${ui.pending({
        title: X('Мәзір әлі жарияланған жоқ', 'Меню пока не опубликовано', 'The menu has not been published yet'),
        note: X(
          'Жарияланғаннан кейін мұнда әр күннің мәзірі күнімен бірге көрсетіледі: тағамның атауы, шығымы (г), бағасы және фотосы. Сондай-ақ апталық мәзір мен өткен күндердің мұрағаты болады.',
          'После публикации здесь появится меню на каждый день с датой: название блюда, выход (г), цена и фото. Также будут меню на неделю и архив прошлых дней.',
          'Once published, each day’s menu will appear here with its date: dish name, portion (g), price and a photo — plus the weekly menu and an archive of past days.',
        ),
      })}${menuBasis}`;
    }

    // weekly board — only when the approved weekly menu is in the data
    const week = weekData
      ? `<ul class="cmp-week" role="list">${weekData.days.map((wd) => `<li class="cmp-day"><p class="cmp-day__name"><span>${L(WEEKDAYS[(+wd.day || 1) - 1] || WEEKDAYS[0])}</span></p>
${(wd.meals || []).map((m) => `<div class="cmp-slot"><p class="cmp-slot__k">${ui.icon('utensils', { size: 14 })}${esc(L(m.slot))}</p><p class="cmp-slot__d">${esc(L(m.dish))}</p></div>`).join('')}
</li>`).join('')}</ul>`
      : '';
    const weekPeriod = weekData && isDate(weekData.from) && isDate(weekData.to) ? X(`${fmt.date(weekData.from)} – ${fmt.date(weekData.to)}`, `${fmt.date(weekData.from)} – ${fmt.date(weekData.to)}`, `${fmt.date(weekData.from)} – ${fmt.date(weekData.to)}`) : null;

    // archive — every earlier day, grouped by month (newest first)
    const pastDays = menuDays.slice(1);
    const byMonth = new Map();
    for (const d of pastDays) { const k = d.date.slice(0, 7); if (!byMonth.has(k)) byMonth.set(k, []); byMonth.get(k).push(d); }
    const archive = pastDays.length
      ? ui.accordion([...byMonth.entries()].map(([k, list], i) => ({
        open: i === 0,
        q: `${MONTHS_NOM[lang][+k.slice(5, 7) - 1]} ${k.slice(0, 4)} <span class="cmp-arch__n">· ${list.length}</span>`,
        a: list.map((d) => `<div class="cmp-arch__day"><h4 class="cmp-arch__date">${dayTitle(d)}</h4>${menuTable(d, null)}</div>`).join(''),
      })), { cls: 'cmp-arch' })
      : '';

    // ------------------------------------------------------------------ commission (п.109–111)
    const roles = [
      { chair: true, icon: 'user', t: X('Мектеп директоры', 'Директор школы', 'School director'), n: X('Комиссия төрағасы', 'Председатель комиссии', 'Chair of the commission') },
      { icon: 'building', t: X('Мектеп әкімшілігі', 'Администрация школы', 'School administration'), n: X('Тамақтануға жауапты тұлға', 'Ответственный за питание', 'Person responsible for meals') },
      { icon: 'medical', t: X('Медицина қызметкері', 'Медицинский работник', 'Medical worker'), n: X('Тағам сапасы мен санитарияны бақылайды', 'Контроль качества блюд и санитарии', 'Checks food quality and hygiene') },
      { icon: 'users', t: X('Ата-аналар комитеті', 'Родительский комитет', 'Parents’ committee'), n: X('Ата-аналар өкілдері', 'Представители родителей', 'Parent representatives') },
      { icon: 'handshake', t: X('Қамқоршылық кеңес', 'Попечительский совет', 'Board of trustees'), n: X('Кеңес өкілі', 'Представитель совета', 'Board representative') },
    ];
    const rolesHtml = `<ul class="cmp-roles" role="list">${roles.map((r) => `<li class="cmp-role${r.chair ? ' cmp-role--chair' : ''}"><span class="cmp-role__ico" aria-hidden="true">${ui.icon(r.icon, { size: 22 })}</span><p class="cmp-role__t">${L(r.t)}</p><p class="cmp-role__n">${L(r.n)}</p></li>`).join('')}</ul>`;
    const commissionSteps = ui.steps([
      { title: X('Күнделікті бракераж', 'Ежедневный бракераж', 'Daily food tasting (brakerazh)'), text: X('Бракераж комиссиясы мен медицина қызметкері әр тағамды таратар алдында органолептикалық бағалайды және нәтижесін бракераж журналына жазады.', 'Бракеражная комиссия и медицинский работник перед раздачей оценивают каждое блюдо органолептически и вносят результат в бракеражный журнал.', 'Before serving, the brakerazh commission and the medical worker check each dish by look, smell and taste and record the result in the brakerazh log.') },
      { title: X('Жеткізушіні бақылау', 'Контроль поставщика', 'Supplier control'), text: X('Мониторинг комиссиясы жеткізуші қызметкерлерінің біліктілігін, тоңазытқыш және технологиялық жабдықтың жарамдылығын және бракераждың жүргізілуін тексереді.', 'Комиссия по мониторингу проверяет квалификацию работников поставщика, исправность холодильного и технологического оборудования и проведение бракеража.', 'The monitoring commission checks the supplier’s staff qualifications, that refrigeration and kitchen equipment works, and that brakerazh is carried out.') },
      { title: X('Ай сайынғы қорытынды', 'Ежемесячный итог', 'Monthly summary'), text: X('Мониторинг комиссиясының жұмыс қорытындысы ай сайын педагогикалық кеңесте қаралып, осы бетте жарияланады (111-т.).', 'Итоги работы комиссии по мониторингу ежемесячно рассматриваются на педсовете и публикуются на этой странице (п. 111).', 'The monitoring commission’s results are reviewed monthly by the pedagogical council and published on this page (para. 111).') },
      { title: X('Тоқсан сайынғы есеп', 'Ежеквартальный отчёт', 'Quarterly report'), text: X('Жеткізушілердің талаптарды сақтауы туралы ақпарат жергілікті атқарушы органға тоқсаннан кейінгі айдың 15-іне дейін ұсынылады (110-т.; мемлекеттік мектептер үшін міндетті).', 'Информация о соблюдении требований поставщиками представляется в местный исполнительный орган до 15 числа месяца, следующего за кварталом (п. 110; обязательно для государственных школ).', 'Information on suppliers’ compliance goes to the local executive body by the 15th of the month after each quarter (para. 110; mandatory for state schools).') },
    ]);
    const brakerazhNote = ui.callout({
      type: 'info',
      title: X('Бракераж дегеніміз не?', 'Что такое бракераж?', 'What is brakerazh?'),
      text: X(
        'Бракераж — азық-түлік пен дайын тағамның сапасын сыртқы түрі, иісі және дәмі бойынша (органолептикалық) бағалау (ҚР ДСМ-76 санитариялық қағидаларының 4-т.). «Дайын тамақтың сапасын бақылау журналы (бракераждық)» мектептің медициналық құжаттамасына кіреді (11-қосымша). Бракераж комиссиясының құрамы мен актілері төменде жарияланады.',
        'Бракераж — оценка качества продуктов и готовых блюд по органолептическим показателям: внешний вид, запах, вкус (п. 4 санитарных правил ҚР ДСМ-76). «Журнал контроля качества готовой пищи (бракеражный)» входит в медицинскую документацию школы (приложение 11). Состав бракеражной комиссии и её акты будут опубликованы ниже.',
        'Brakerazh is checking the quality of food products and ready dishes by look, smell and taste (para. 4 of sanitary rules ҚР ДСМ-76). The “ready-food quality control (brakerazh) log” is part of the school’s medical records (appendix 11). The brakerazh commission’s membership and records will be published below.',
      ),
    });
    // members from S.meals.commission = { monitoring:[{name, role}], brakerazh:[{name, role}] }
    const C = M.commission || {};
    const memberTable = (list, caption) => (Array.isArray(list) && list.length ? ui.table({
      compact: true, caption,
      head: [X('Аты-жөні', 'ФИО', 'Name'), X('Комиссиядағы рөлі / лауазымы', 'Роль в комиссии / должность', 'Role / position')],
      rows: list.map((m) => [esc(L(m.name)), esc(L(m.role))]),
    }) : '');
    const members = memberTable(C.monitoring, X('Мониторинг комиссиясының құрамы', 'Состав комиссии по мониторингу', 'Monitoring commission members'))
      + memberTable(C.brakerazh, X('Бракераж комиссиясының құрамы', 'Состав бракеражной комиссии', 'Brakerazh commission members'));
    const commissionPending = members ? `<div class="cmp-members">${members}</div>` : ui.pending({
      title: X('Комиссия құрамы', 'Состав комиссии', 'Commission members'),
      note: X('Мониторинг комиссиясы мен бракераж комиссиясының бекітілген құрамы (аты-жөні, лауазымы) және оларды құру туралы бұйрықтар жарияланады.', 'Будут опубликованы утверждённые составы комиссии по мониторингу и бракеражной комиссии (ФИО, должности) и приказы об их создании.', 'The approved membership (names, positions) of the monitoring commission and the brakerazh commission, and the orders setting them up, will be published.'),
    });

    // ------------------------------------------------------------------ supplier & canteen
    // from S.meals.supplier = { name, bin?, type?, contract:{number,date,term}?, sez:{number,date}?, responsible?, cost? }
    const sup = M.supplier || {};
    const noDate = (o) => [o.number ? `№ ${esc(o.number)}` : '', isDate(o.date) ? fmt.date(o.date) : '', o.term ? esc(L(o.term)) : ''].filter(Boolean).join(', ');
    const supplier = ui.facts([
      { k: X('Тамақтану түрі', 'Вид питания', 'Type of meals'), v: `${L(X('Ыстық тамақ', 'Горячее питание', 'Hot meals'))} ${ok}` },
      { k: X('Тамақтануды ұйымдастыру тәсілі', 'Способ организации питания', 'How meals are organised'), v: sup.type ? esc(L(sup.type)) : `${L(X('Өз асханасы немесе мамандандырылған ұйыммен шарт', 'Собственная столовая или договор со специализированной организацией', 'Own canteen or a contract with a catering company'))} ${wait}` },
      { k: X('Жеткізуші', 'Поставщик', 'Supplier'), v: sup.name ? `${esc(L(sup.name))}${sup.bin ? ` <span class="cmp-muted">(${L(X('БСН', 'БИН', 'BIN'))} ${esc(sup.bin)})</span>` : ''}` : `— ${wait}` },
      { k: X('Шарт (нөмірі, күні, мерзімі)', 'Договор (номер, дата, срок)', 'Contract (number, date, term)'), v: sup.contract && noDate(sup.contract) ? noDate(sup.contract) : `— ${docWait}` },
      { k: X('Тамақтану объектісінің санитариялық-эпидемиологиялық қорытындысы', 'Санитарно-эпидемиологическое заключение на объект питания', 'Sanitary certificate of the catering facility'), v: sup.sez && noDate(sup.sez) ? noDate(sup.sez) : `— ${docWait}` },
      { k: X('Тамақтану құны', 'Стоимость питания', 'Cost of meals'), v: sup.cost ? esc(L(sup.cost)) : `${L(X(`— <a href="${href('tuition')}">оқу ақысы туралы бет</a>`, `— <a href="${href('tuition')}">страница об оплате</a>`, `— <a href="${href('tuition')}">fees page</a>`))} ${wait}` },
      { k: X('Тамақтануға жауапты тұлға', 'Ответственный за питание', 'Person responsible for meals'), v: sup.responsible ? esc(L(sup.responsible)) : `— ${wait}` },
    ]);
    const supplierNote = ui.callout({
      type: 'info',
      title: X('Заң не дейді', 'Что говорит закон', 'What the rules say'),
      text: X(
        `${o598} мемлекеттік мектептерге жеткізуші таңдалғаннан кейін екі жұмыс күні ішінде ол туралы мәліметті сайтта жариялауды міндеттейді (70-т.). «Керемет» — жеке мектеп, бірақ біз осы ашықтық тәртібін ұстанамыз.`,
        `${o598} обязывает государственные школы в течение двух рабочих дней после выбора поставщика размещать сведения о нём на сайте (п. 70). «Керемет» — частная школа, но мы придерживаемся того же порядка открытости.`,
        `${o598} requires state schools to publish supplier details on their website within two working days of choosing them (para. 70). Keremet is a private school, but we follow the same transparency practice.`,
      ),
    });

    // ------------------------------------------------------------------ drinking water
    const water = ui.cards([
      { icon: 'check', title: X('Қауіпсіз ауыз су', 'Безопасная питьевая вода', 'Safe drinking water'), text: X('Ауыз су — бөтелкедегі немесе ыдысқа (графин, шәйнек, бак) құйылған — сапа мен қауіпсіздік талаптарына сай болуы тиіс. Жеке бөтелкені пайдалануға рұқсат етіледі (ҚР ДСМ-76, 28-т.).', 'Питьевая вода — бутилированная или расфасованная в ёмкости (графины, чайники, бачки) — должна соответствовать требованиям качества и безопасности. Разрешается индивидуальная бутылка (ҚР ДСМ-76, п. 28).', 'Drinking water — bottled or dispensed into containers (jugs, kettles, tanks) — must meet quality and safety requirements. Children may use their own bottle (ҚР ДСМ-76, para. 28).') },
      { icon: 'clock', title: X('Қайнатылған су — 3 сағаттан артық емес', 'Кипячёная вода — не дольше 3 часов', 'Boiled water — no longer than 3 hours'), text: X('Қайнатылған ауыз суды пайдалануға болады, бірақ ол үш сағаттан артық сақталмауы тиіс (28-т.).', 'Кипячёную питьевую воду использовать можно, но хранить её допускается не более трёх часов (п. 28).', 'Boiled drinking water may be used, but it may be kept for no more than three hours (para. 28).') },
      { icon: 'users', title: X('Күні бойы еркін қолжетімді', 'Свободный доступ весь день', 'Free access all day'), text: X('Оқушылар мектепте болған барлық уақытта ауыз суға еркін қол жеткізуі тиіс (30-т.).', 'Обучающимся обеспечивается свободный доступ к питьевой воде в течение всего времени пребывания в школе (п. 30).', 'Pupils must have free access to drinking water the whole time they are at school (para. 30).') },
      { icon: 'user', title: X('Жауапты тұлға', 'Ответственное лицо', 'Person in charge'), text: `${L(X('Ауыз су режимін ұйымдастыруға жауапты тұлға мектеп директорының бұйрығымен тағайындалады (30-т.). Мектептегі жауапты тұлға мен су беру тәсілі (кулер, бөтелкедегі немесе қайнатылған су) нақтылануда.', 'Ответственный за организацию питьевого режима назначается приказом руководителя (п. 30). Ответственный в школе и способ подачи воды (кулеры, бутилированная или кипячёная) уточняются.', 'A person responsible for the drinking regime is appointed by the director’s order (para. 30). Who it is at the school, and how water is provided (coolers, bottled or boiled), is being confirmed.'))} ${wait}` },
    ], { cols: 2 });

    // ------------------------------------------------------------------ FAQ
    const faq = ui.accordion([
      { q: X('Баламның аллергиясы немесе арнайы диетасы бар. Не істеу керек?', 'У ребёнка аллергия или особая диета. Что делать?', 'My child has an allergy or a special diet. What should I do?'),
        a: X(`<p>Сынып жетекшісіне және мектептің медицина қызметкеріне жазбаша хабарлаңыз, қажет болса дәрігердің қорытындысын қоса беріңіз. Медицина қызметі туралы: <a href="${href('health')}">медициналық қызмет</a>.</p>`, `<p>Письменно сообщите классному руководителю и медицинскому работнику школы, при необходимости приложите заключение врача. О медицинской службе: <a href="${href('health')}">медицинское обслуживание</a>.</p>`, `<p>Tell the class teacher and the school’s medical worker in writing, attaching a doctor’s note if needed. See <a href="${href('health')}">health care</a>.</p>`) },
      { q: X('Тамақтану ақылы ма?', 'Питание платное?', 'Do meals cost extra?'),
        a: X(`<p>Тамақтанудың құны мен төлеу тәртібі нақтылануда және <a href="${href('tuition')}">оқу ақысы</a> бетінде жарияланады.</p>`, `<p>Стоимость и порядок оплаты питания уточняются и будут опубликованы на странице <a href="${href('tuition')}">об оплате обучения</a>.</p>`, `<p>The cost of meals and how to pay are being confirmed and will appear on the <a href="${href('tuition')}">tuition</a> page.</p>`) },
      { q: X('Ата-ана тамақтану сапасын бақылауға қатыса ала ма?', 'Могут ли родители участвовать в контроле качества?', 'Can parents take part in quality checks?'),
        a: X(`<p>${o598g} 109-тармағы бойынша тамақтану сапасына мониторинг жүргізу комиссиясының құрамына ата-аналар комитетінің өкілдері кіреді. Мектептегі комиссияның құрамы жарияланады. Қатысқыңыз келсе, сынып жетекшісіне немесе мектеп әкімшілігіне хабарласыңыз.</p>`, `<p>По п. 109 ${o598g} в комиссию по мониторингу качества питания входят представители родительского комитета. Состав комиссии в школе будет опубликован. Если хотите участвовать, обратитесь к классному руководителю или в администрацию.</p>`, `<p>Under para. 109 of ${o598g}, representatives of the parents’ committee sit on the meal-quality monitoring commission. The school’s commission membership will be published. Contact the class teacher or the administration if you would like to take part.</p>`) },
      { q: X('Тамақ туралы ескерту немесе ұсынысты қайда жіберуге болады?', 'Куда направить замечание или предложение о питании?', 'Where can I send a comment about meals?'),
        a: X(`<p><a href="${href('feedback')}">Кері байланыс формасы</a> арқылы немесе ${S.contacts.phone.display} телефоны бойынша. Әр өтініш қаралып, жауап беріледі.</p>`, `<p>Через <a href="${href('feedback')}">форму обратной связи</a> или по телефону ${S.contacts.phone.display}. Каждое обращение рассматривается, вы получите ответ.</p>`, `<p>Use the <a href="${href('feedback')}">feedback form</a> or call ${S.contacts.phone.display}. Every message is reviewed and answered.</p>`) },
    ], { exclusive: false });

    // ------------------------------------------------------------------ documents & sources
    const docs = ui.docList([
      ...['meals-menu', 'meals-contract'].map(docById).filter(Boolean),
      docById('meals-plan'),
      docById('meals-commission-order'),
      docById('meals-commission-reports'),
      docById('brakerazh-order'),
      docById('brakerazh-records'),
      docById('drinking-water-order'),
      docById('meals-sez'),
    ]);
    const sources = ui.linkList([
      { href: adilet('V1800017948'), icon: 'scale', label: X('Білім алушыларды тамақтандыруды ұйымдастыру қағидалары (ҚР БҒМ 31.10.2018 № 598 бұйрығы)', 'Правила организации питания обучающихся (приказ МОН РК от 31.10.2018 № 598)', 'Rules for organising pupils’ meals (MES order No. 598 of 31.10.2018)'), note: X('70, 105, 106, 109–111-тармақтар · adilet.zan.kz', 'пп. 70, 105, 106, 109–111 · adilet.zan.kz', 'paras. 70, 105, 106, 109–111 · adilet.zan.kz') },
      { href: adilet('V2100023890'), icon: 'scale', label: X('«Білім беру объектілеріне қойылатын санитариялық-эпидемиологиялық талаптар» (ҚР ДСМ-76)', 'Санитарные правила «Санитарно-эпидемиологические требования к объектам образования» (ҚР ДСМ-76)', 'Sanitary rules for education facilities (ҚР ДСМ-76)'), note: X('4, 28, 30-т., 11-қосымша · adilet.zan.kz', 'пп. 4, 28, 30, прил. 11 · adilet.zan.kz', 'paras. 4, 28, 30, app. 11 · adilet.zan.kz') },
    ]);

    const related = ui.linkList([
      { href: href('health'), icon: 'medical', label: X('Медициналық қызмет', 'Медицинское обслуживание', 'Health care') },
      { href: href('facilities'), icon: 'building', label: X('Ғимарат және кабинеттер', 'Здание и кабинеты', 'Building & classrooms') },
      { href: href('board'), icon: 'handshake', label: X('Қамқоршылық кеңес', 'Попечительский совет', 'Board of trustees') },
      { href: href('parents'), icon: 'users', label: X('Ата-аналармен жұмыс', 'Работа с родителями', 'Working with parents') },
      { href: href('feedback'), icon: 'chat', label: X('Кері байланыс', 'Обратная связь', 'Feedback') },
    ]);

    return [
      intro,
      ui.split({ ratio: '1:2', cls: 'cmp-menu-split', left: toc, right: ui.section({ id: 'today', eyebrow: hasMenu ? X('Соңғы жарияланған', 'Последнее опубликованное', 'Latest published') : X('Күнделікті және апталық', 'Ежедневное и недельное', 'Daily and weekly'), title: hasMenu ? X('Күнделікті мәзір', 'Ежедневное меню', 'Daily menu') : X('Мәзір', 'Меню', 'Menu'), body: menuBody }) }),
      weekData ? ui.section({ id: 'week', tone: 'biology', eyebrow: X('Перспективалық мәзір', 'Перспективное меню', 'Long-term menu'), title: X('Апталық мәзір', 'Меню на неделю', 'Weekly menu'), lead: weekPeriod || X('Аптаның әр күнінде балалар не жейді.', 'Что дети едят в каждый день недели.', 'What children eat each day of the week.'), body: week }) : '',
      archive ? ui.section({ id: 'archive', eyebrow: X('Өткен күндер', 'Прошлые дни', 'Past days'), title: X('Мәзір мұрағаты', 'Архив меню', 'Menu archive'), body: archive }) : '',
      ui.section({ id: 'commission', eyebrow: X('Қоғамдық бақылау', 'Общественный контроль', 'Public oversight'), title: X('Тамақтану сапасына мониторинг жүргізу жөніндегі комиссия', 'Комиссия по мониторингу качества питания', 'Meal-quality monitoring commission'), lead: X(`${o598g} 109-тармағы бойынша комиссия құрамына қамқоршылық кеңестің, ата-аналар комитетінің, мектеп әкімшілігінің өкілдері және медицина қызметкері кіреді; төрағасы — мектеп басшысы.`, `По п. 109 ${o598g} в комиссию входят представители попечительского совета, родительского комитета, администрации школы и медицинский работник; председатель — руководитель школы.`, `Under para. 109 of ${o598g}, the commission includes representatives of the board of trustees, the parents’ committee and the school administration, plus the medical worker; it is chaired by the head of the school.`), body: rolesHtml + commissionSteps + brakerazhNote + commissionPending }),
      ui.section({ id: 'supplier', eyebrow: X('Асхана', 'Столовая', 'Canteen'), title: X('Жеткізуші және тамақтану объектісі', 'Поставщик и объект питания', 'Supplier and catering facility'), body: supplier + supplierNote }),
      ui.section({ id: 'water', eyebrow: X('Су — денсаулық көзі', 'Вода — источник здоровья', 'Water matters'), title: X('Ауыз су режимі', 'Питьевой режим', 'Drinking water'), body: water }),
      ui.section({ id: 'faq', title: X('Жиі қойылатын сұрақтар', 'Частые вопросы', 'Frequently asked questions'), body: faq }),
      ui.section({ id: 'docs', eyebrow: X('Растайтын құжаттар', 'Подтверждающие документы', 'Supporting documents'), title: X('Құжаттар', 'Документы', 'Documents'), body: rubric + docs + `<h3 class="cmp-h3">${L(X('Нормативтік негіз', 'Нормативная база', 'Legal basis'))}</h3>` + sources }),
      ui.section({ title: X('Осы бөлімде', 'В этом разделе', 'In this section'), body: related }),
    ].filter(Boolean).join('\n');
  },
};
