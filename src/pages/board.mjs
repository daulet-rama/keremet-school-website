// Board of Trustees (попечительский совет / қамқоршылық кеңес) — rules of Order No. 355 (Annex 2, secondary schools,
// as amended by Order No. 137-НҚ of 25.05.2026), read in full (RU + KZ) on 24.09.2026. Everything the school must
// publish (ORDER-114 L.78–82) is listed with PENDING slots; no names, dates or amounts are invented.
import { board as B } from '../data/board.mjs';

const ADILET = (code, lang) => `https://adilet.zan.kz/${lang === 'kz' ? 'kaz' : 'rus'}/docs/${code}`;

export default {
  slug: 'board',
  group: 'about',
  order: 60,
  title: { kz: 'Қамқоршылық кеңес', ru: 'Попечительский совет', en: 'Board of Trustees' },
  description: {
    kz: '«Керемет» мектебінің қамқоршылық кеңесі: құрамы, сайлау тәртібі, функциялары, отырыстар анонсы, шешімдер және жылдық есеп (№ 355 бұйрық).',
    ru: 'Попечительский совет школы «Керемет»: состав, порядок избрания, функции, анонсы заседаний, решения и годовой отчёт (приказ № 355).',
    en: 'Keremet School Board of Trustees: membership, election procedure, functions, meeting notices, decisions and annual report (Order No. 355).',
  },
  lead: {
    kz: 'Мектептің дамуына ықпал ететін және оның қызметіне қоғамдық бақылауды қамтамасыз ететін алқалы басқару органы.',
    ru: 'Коллегиальный орган управления, который содействует развитию школы и обеспечивает общественный контроль за её деятельностью.',
    en: 'A collegial governing body that supports the school’s development and provides public oversight of its work.',
  },
  styles: ['about'],
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, { ui, S, L, href, fmt, asset, docById, docsByGroup }) {
    const X = (kz, ru, en) => ({ kz, ru, en });
    const pill = (kind, label, ic) => `<span class="ab-pill ab-pill--${kind}">${ic ? ui.icon(ic, { size: 14 }) : ''}${L(label)}</span>`;
    const wait = pill('wait', X('Нақтылануда', 'Уточняется', 'To be confirmed'), 'hourglass');
    const soon = pill('wait', X('Жарияланады', 'Будет опубликовано', 'To be published'), 'hourglass');
    const R = X('№ 355 бұйрық, 2-қосымша', 'Приказ № 355, прил. 2', 'Order No. 355, Annex 2');
    const pt = (n) => `${L(R)}, ${L(X(`${n}-т.`, `п. ${n}`, `para. ${n}`))}`;
    const LAW = ADILET('V1700015584', lang);
    // Live data: src/data/board.mjs (announcement, members, approved, chair, secretary, meetings). Empty slot → pending.
    const members = (B.members || []).filter((m) => m && m.name);
    const meetingsData = (B.meetings || []).filter((m) => m && m.date).sort((a, b) => String(a.date).localeCompare(String(b.date)));
    const decisions = meetingsData.filter((m) => m.decision && (m.decision.file || m.decision.url));
    const when = (m) => [m.date && fmt.date(m.date), m.time].filter(Boolean).join(', ');
    const inCat = (cat) => {
      const list = members.filter((m) => m.category === cat);
      return list.length ? `<ul class="ab-names" role="list">${list.map((m) => `<li>${L(m.name)}${m.note ? `<small>${L(m.note)}</small>` : ''}</li>`).join('')}</ul>` : wait;
    };
    const done = pill('ok', X('Жарияланды', 'Опубликовано', 'Published'), 'check');

    // ---------------------------------------------------------------- key numbers
    const nums = `<div class="ab-bignums">${[
      ['3', X('жыл — өкілеттік мерзімі', 'года — срок полномочий', 'years — term of office'), 4],
      ['≥ 1', X('отырыс тоқсан сайын', 'заседание в квартал', 'meeting every quarter'), 16],
      ['10', X('күн бұрын — ата-аналар жиналысы туралы хабарландыру', 'дней — уведомление о собрании родителей', 'days’ notice of the parents’ meeting'), 11],
      ['2/3', X('мүше — отырыстың кворумы', 'членов — кворум заседания', 'of members — quorum'), 22],
      ['≤ 11', X('ата-ана — әр параллельден біреуден', 'родителей — по одному от параллели', 'parents — one per grade level'), 10],
    ].map(([v, l, p]) => `<div class="ab-bignum"><b>${v}</b><span>${L(l)}</span><small>${L(X(`${p}-т.`, `п. ${p}`, `para. ${p}`))}</small></div>`).join('')}</div>`;
    const principles = ui.chips([
      X('Тәуелсіздік', 'Независимость', 'Independence'), X('Мүшелердің өтеусіз қызметі', 'Безвозмездность', 'Unpaid membership'),
      X('Еріктілік', 'Добровольность', 'Voluntariness'), X('Ашықтық', 'Прозрачность', 'Transparency'), X('Жариялылық', 'Гласность и публичность', 'Openness and publicity'),
    ].map((l) => ({ icon: 'check', label: l })));

    // ---------------------------------------------------------------- composition
    const comp = ui.table({
      caption: X(`Кеңестің құрамы (${pt(10)})`, `Состав совета (${pt(10)})`, `Membership (${pt(10)})`),
      head: [X('Санат', 'Категория', 'Category'), X('Саны', 'Количество', 'Number'), X('Біздің кеңесте', 'В нашем совете', 'In our board')],
      numeric: [1],
      rows: [
        [X('Ата-аналар немесе заңды өкілдер (әр сынып параллелінен біреуден)', 'Родители или законные представители (по одному от параллели классов)', 'Parents or legal guardians (one per grade level)'), X('≤ 11', '≤ 11', '≤ 11'), inCat('parents')],
        [X('Педагогикалық еңбек ардагері (болған жағдайда)', 'Ветеран педагогического труда (при наличии)', 'Veteran teacher (if any)'), '1', inCat('veteran')],
        [X('Жергілікті өкілді, атқарушы және/немесе құқық қорғау органдарының өкілдері', 'Представители местных представительных, исполнительных и/или правоохранительных органов', 'Representatives of local councils, executive or law-enforcement bodies'), '1–3', inCat('authority')],
        [X('Үкіметтік емес (коммерциялық емес) ұйымдардың өкілдері', 'Представители неправительственных (некоммерческих) организаций', 'NGO representatives'), '1–2', inCat('ngo')],
        [X('Қайырымдылар және/немесе меценаттар (болған жағдайда)', 'Благотворители и/или меценаты (при наличии)', 'Donors or patrons (if any)'), '1–2', inCat('donor')],
        [X('БАҚ өкілі (болған жағдайда)', 'Представитель СМИ (при наличии)', 'Media representative (if any)'), '1', inCat('media')],
        [X('Оқушылардың өзін-өзі басқару органдарының өкілдері', 'Представители органов ученического самоуправления', 'Pupil self-government representatives'), '1–2', inCat('pupils')],
      ],
    });
    const officers = ui.facts([
      { k: X('Төраға', 'Председатель', 'Chair'), v: B.chair ? L(B.chair) : `${wait}<span class="muted">${L(X('мүшелер арасынан ашық дауыспен сайланады (19-т.)', 'избирается из числа членов открытым голосованием (п. 19)', 'elected by the members in an open vote (para. 19)'))}</span>` },
      { k: X('Хатшы', 'Секретарь', 'Secretary'), v: B.secretary ? L(B.secretary) : `${wait}<span class="muted">${L(X('кеңес мүшесі емес; отырыстарды дайындайды, хаттама жүргізеді (21-т.)', 'не является членом совета; готовит заседания и ведёт протоколы (п. 21)', 'not a member; prepares meetings and keeps minutes (para. 21)'))}</span>` },
      { k: X('Құрамды бекіткен орган', 'Кем утверждён состав', 'Approved by'), v: B.approved ? [L(B.approved.body), B.approved.number && `№ ${B.approved.number}`, B.approved.date && fmt.date(B.approved.date)].filter(Boolean).join(' · ') : `${wait}<span class="muted">${L(X('білім беру саласындағы уәкілетті орган немесе жергілікті атқарушы орган (13-т.)', 'уполномоченный орган или местный исполнительный орган в области образования (п. 13)', 'the education authority or local executive body (para. 13)'))}</span>` },
    ]);

    // ---------------------------------------------------------------- election timeline
    const election = ui.timeline([
      { date: X('1–10 қыркүйек', '1–10 сентября', '1–10 September'), title: X('Сайлау туралы хабарландыру', 'Объявление об избрании', 'Election announced'), text: X('Уәкілетті орган немесе жергілікті атқарушы орган қазақ және орыс тілдерінде хабарландыру жариялайды; құжаттар 20 күнтізбелік күн қабылданады (8-т.).', 'Уполномоченный или местный исполнительный орган публикует объявление на казахском и русском языках; документы принимаются 20 календарных дней (п. 8).', 'The authority publishes the announcement in Kazakh and Russian; documents are accepted for 20 calendar days (para. 8).') },
      { date: X('≥ 10 күн бұрын', 'за ≥ 10 дней', '≥ 10 days before'), title: X('Ата-аналарды хабардар ету', 'Уведомление родителей', 'Parents notified'), text: X('Мектеп ата-аналарға жиналыстың күні, уақыты және орны туралы хабарлама жібереді және хабарландыруды стендте және/немесе ресми сайтта орналастырады (11-т. 1) тт.).', 'Школа направляет родителям уведомление с датой, временем и местом собрания и размещает объявление на стенде и/или официальном сайте (п. 11 пп. 1).', 'The school notifies parents of the date, time and place of the meeting and posts the notice on the board and/or the official website (para. 11(1)).') },
      { date: X('Жиналыс күні', 'День собрания', 'Meeting day'), title: X('Кандидаттарды сайлау', 'Выдвижение и голосование', 'Nomination and vote'), text: X('Әр сынып параллелінен бір кандидат; ашық немесе жасырын дауыс беру; нәтиже хаттамамен ресімделеді (11-т. 2)–5) тт.).', 'По одному кандидату от параллели классов; открытое или тайное голосование; итоги оформляются протоколом (п. 11 пп. 2–5).', 'One candidate per grade level; open or secret ballot; results recorded in minutes (para. 11(2–5)).') },
      { date: X('3 жұмыс күні ішінде', 'в течение 3 рабочих дней', 'within 3 working days'), title: X('Тізімді жіберу', 'Направление списка', 'List submitted'), text: X('Сайланған кандидаттардың тізімі құжаттарымен бірге уәкілетті органға жіберіледі (11-т. 6) тт.).', 'Список избранных кандидатов с документами направляется в уполномоченный орган (п. 11 пп. 6).', 'The list of elected candidates and their documents goes to the authority (para. 11(6)).') },
      { date: X('30 қазанға дейін', 'до 30 октября', 'by 30 October'), title: X('Комиссияның шешімі', 'Решение комиссии', 'Commission decision'), text: X('Комиссия құжаттарды 7 жұмыс күнінде қарап, 10 жұмыс күнінде кандидаттарды сайлайды; сайлау 30 қазаннан кешіктірілмей аяқталады (12-т.).', 'Комиссия рассматривает документы за 7 рабочих дней и избирает кандидатов в течение 10 рабочих дней; избрание завершается не позднее 30 октября (п. 12).', 'The commission reviews documents within 7 working days and elects members within 10; the election ends by 30 October (para. 12).') },
      { date: X('3 жұмыс күні ішінде', 'в течение 3 рабочих дней', 'within 3 working days'), title: X('Құрамды бекіту және жариялау', 'Утверждение и публикация состава', 'Membership approved and published'), text: X('Құрам бекітіледі, тізім органның және мектептің ресми интернет-ресурсында орналастырылады (13-т.).', 'Состав утверждается, список размещается на официальных интернет-ресурсах органа и школы (п. 13).', 'The membership is approved and the list is posted on the authority’s and the school’s websites (para. 13).') },
    ]);
    const candidateDocs = ((items) => `<ol class="ab-check ab-check--plain">${items.map((x, i) => `<li><span class="ab-check__ico" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><div><p class="ab-check__t">${L(x)}</p></div></li>`).join('')}</ol>`)([
      X('Өтініш (еркін нысанда)', 'Заявление (в произвольной форме)', 'Application (free form)'),
      X('Жеке басын куәландыратын құжаттың көшірмесі', 'Копия документа, удостоверяющего личность', 'Copy of an identity document'),
      X('Қазақ немесе орыс тіліндегі түйіндеме', 'Резюме на казахском или русском языке', 'CV in Kazakh or Russian'),
      X('Білімі туралы құжаттың көшірмесі (болған жағдайда)', 'Копия документа об образовании (при наличии)', 'Copy of education certificate (if any)'),
      X('Соттылығының және сыбайлас жемқорлық құқық бұзушылықтарының жоқтығы туралы анықтама', 'Справка об отсутствии судимости и коррупционных правонарушений', 'Certificate of no criminal record or corruption offences'),
    ]);

    // ---------------------------------------------------------------- functions (para 14)
    const functions = ui.accordion([
      { open: true, q: X('Даму және басқару', 'Развитие и управление', 'Development and governance'), a: `<ul class="bullets">${[
        X('мектепті дамытудың басым бағыттарын келіседі', 'согласует приоритетные направления развития школы', 'agrees the school’s development priorities'),
        X('бюджетті қалыптастыру кезінде ұсыныстар әзірлейді', 'вырабатывает предложения при формировании бюджета', 'makes proposals when the budget is drawn up'),
        X('жарғы мен ішкі тәртіп ережелеріне өзгерістерді келіседі', 'согласует изменения в устав и правила внутреннего распорядка', 'agrees changes to the charter and internal rules'),
        X('оқу жылының балама мерзімдерін және эксперименттік бағдарламаларды келіседі', 'согласует альтернативные сроки учебного года и экспериментальные программы', 'agrees alternative school-year dates and experimental programmes'),
        X('жылына кемінде 2 рет басшының есебін тыңдайды', 'не реже 2 раз в год заслушивает отчёты руководителя', 'hears the head’s reports at least twice a year'),
      ].map((x) => `<li>${L(x)}</li>`).join('')}</ul>` },
      { q: X('Қаржы және қайырымдылық көмек', 'Финансы и благотворительная помощь', 'Finance and charitable aid'), a: `<ul class="bullets">${[
        X('қайырымдылық көмекті бөлу туралы хаттамалық шешім шығарады', 'выносит протокольное решение по распределению благотворительной помощи', 'decides, in minutes, how charitable aid is allocated'),
        X('демеушілік қаражаттың жұмсалуын бақылайды', 'осуществляет контроль за расходованием спонсорских средств', 'oversees how sponsorship funds are spent'),
        X('тауарларды, жұмыстар мен қызметтерді сатып алу процесін бақылайды', 'проводит мониторинг приобретения товаров, работ и услуг', 'monitors procurement of goods and services'),
      ].map((x) => `<li>${L(x)}</li>`).join('')}</ul>` },
      { q: X('Балалардың құқықтары мен қауіпсіздігі', 'Права и безопасность детей', 'Children’s rights and safety'), a: `<ul class="bullets">${[
        X('білім алушылар мен ата-аналардың құқықтарының сақталуын бақылайды, балаларды зорлық-зомбылықтан қорғауға жәрдемдеседі', 'контролирует соблюдение прав обучающихся и родителей, содействует защите детей от насилия', 'monitors the rights of pupils and parents and helps protect children from violence'),
        X('санитарлық-гигиеналық жағдайларды, тамақтану сапасын, ауыз су режимін бақылайды', 'контролирует санитарно-гигиенические условия, качество питания, питьевой режим', 'checks hygiene, the quality of meals and drinking water'),
        X('буллингтің, құқық бұзушылықтың, лудоманияның алдын алуға жәрдемдеседі', 'содействует профилактике буллинга, правонарушений, лудомании', 'helps prevent bullying, offences and gambling addiction'),
      ].map((x) => `<li>${L(x)}</li>`).join('')}</ul>` },
      { q: X('Мониторинг және ата-аналармен жұмыс', 'Мониторинг и работа с родителями', 'Monitoring and parents'), a: `<ul class="bullets">${[
        X('жылына бір рет оқушылар мен ата-аналар арасында жасырын сауалнама жүргізеді', 'раз в учебный год проводит анонимное анкетирование обучающихся и родителей', 'runs an anonymous survey of pupils and parents once a year'),
        X('ерекше білім беру қажеттіліктері бар балалардың үйірмелерге қатысуын бақылайды', 'мониторит занятость детей с ООП в кружках и секциях', 'monitors club participation of children with special needs'),
        X('ата-аналармен жұмыс істеуге және жалпы ата-аналар жиналыстарын өткізуге жәрдемдеседі', 'содействует работе с семьями и проведению общих родительских собраний', 'supports work with families and general parents’ meetings'),
        X('сыбайлас жемқорлыққа қарсы іс-шараларға жәрдемдеседі', 'содействует противодействию коррупции', 'supports anti-corruption measures'),
      ].map((x) => `<li>${L(x)}</li>`).join('')}</ul>` },
    ]);

    // ---------------------------------------------------------------- what is published here
    const item = (icon, title, text, p, live) => `<li><span class="ab-check__ico">${ui.icon(icon, { size: 20 })}</span><div><p class="ab-check__t">${L(title)}</p><p class="ab-check__d">${L(text)} · <span class="mono">${pt(p)}</span></p></div><span class="ab-check__s">${live ? `<a href="#${live}">${done}</a>` : soon}</span></li>`;
    const published = `<ul class="ab-check" role="list">
${item('calendar', X('Ата-аналар жиналысы туралы хабарландыру', 'Объявление о собрании родителей', 'Notice of the parents’ meeting'), X('кандидаттарды ұсыну үшін, кемінде 10 күнтізбелік күн бұрын', 'для выдвижения кандидатов, не менее чем за 10 календарных дней', 'to nominate candidates, at least 10 calendar days ahead'), '11', B.announcement && 'meetings')}
${item('users', X('Бекітілген құрам', 'Утверждённый состав', 'Approved membership'), X('мүшелердің толық аты-жөні және санаты', 'ФИО членов полностью и категория', 'members’ full names and categories'), '13', members.length && 'composition')}
${item('book', X('Оқу жылына арналған жұмыс жоспары', 'План работы на учебный год', 'Work plan for the school year'), X('кеңес жоспар бойынша жұмыс істейді', 'совет работает по плану', 'the board works to a plan'), '15')}
${item('clock', X('Әр отырыстың анонсы', 'Анонс каждого заседания', 'Notice of every meeting'), X('күні, уақыты және орны; отырыстар тоқсанына кемінде бір рет', 'дата, время и место; заседания не реже раза в квартал', 'date, time and place; at least one meeting per quarter'), '17', meetingsData.length && 'meetings')}
${item('doc', X('Шешімдер мен хаттамалар', 'Решения и протоколы', 'Decisions and minutes'), X('хатшы кеңестің шешімдерін сайтта орналастырады', 'секретарь размещает решения совета на сайте', 'the secretary posts decisions on the website'), '27', decisions.length && 'documents')}
${item('coins', X('Жылдық есеп', 'Годовой отчёт', 'Annual report'), X('қаржы жылының қорытындысы бойынша, қайырымдылық көмекті пайдалануды қоса', 'по итогам финансового года, включая использование благотворительной помощи', 'after each financial year, including the use of charitable aid'), '31')}
</ul>`;

    // ---------------------------------------------------------------- meetings schedule (pending)
    // No data yet → one pending block (the full table is rendered only once dates exist).
    const notice = B.announcement ? `<div class="ab-notice" role="note"><p class="ab-kicker">${L(X('Ата-аналар жиналысы туралы хабарландыру (11-т.)', 'Объявление о собрании родителей (п. 11)', 'Notice of the parents’ meeting (para. 11)'))}</p>
<p class="ab-notice__when">${ui.icon('calendar', { size: 18 })} ${when(B.announcement)}${B.announcement.place ? ` · ${L(B.announcement.place)}` : ''}</p>${B.announcement.text ? `<p>${L(B.announcement.text)}</p>` : ''}${B.announcement.posted ? `<p class="muted small">${L(X('Жарияланған күні', 'Дата публикации', 'Posted'))}: ${fmt.date(B.announcement.posted)}</p>` : ''}</div>` : '';
    const qName = (q) => (q ? L(X(`${q}-тоқсан`, `${['I', 'II', 'III', 'IV'][q - 1] || q} четверть`, `Term ${q}`)) : '—');
    const decisionCell = (m) => {
      const dc = m.decision;
      if (!dc) return soon;
      const label = [L(dc.title || X('Шешім (хаттама)', 'Решение (протокол)', 'Decision (minutes)')), dc.number && `№ ${dc.number}`].filter(Boolean).join(' ');
      const url = dc.file ? asset(dc.file) : dc.url;
      return url ? `<a href="${url}">${label}</a>` : label;
    };
    const meetings = meetingsData.length ? notice + ui.table({
      caption: X(`${B.schoolYear} оқу жылындағы отырыстар`, `Заседания в ${B.schoolYear} учебном году`, `Meetings in ${B.schoolYear}`),
      head: [X('Тоқсан', 'Четверть', 'Term'), X('Күні мен уақыты', 'Дата и время', 'Date and time'), X('Орны', 'Место', 'Place'), X('Күн тәртібі', 'Повестка', 'Agenda'), X('Шешім', 'Решение', 'Decision')],
      rows: meetingsData.map((m) => [qName(m.quarter), when(m), m.place || '—', m.agenda || '—', decisionCell(m)]),
    }) : notice + `<div class="ab-empty">${ui.pending({
      title: X('2026–2027 оқу жылындағы отырыстар кестесі жарияланады', 'График заседаний на 2026–2027 учебный год будет опубликован', 'The 2026–2027 meeting schedule will be published'),
      note: X('Әр тоқсан бойынша (I–IV): отырыстың күні мен уақыты, орны, күн тәртібі және қабылданған шешім (хаттама).', 'По каждой четверти (I–IV): дата и время заседания, место, повестка и принятое решение (протокол).', 'For each quarter (I–IV): date and time, place, agenda and the decision taken (minutes).'),
    })}</div>`;
    const meetNote = ui.note(X('Отырыстар бейнеконференцбайланыс режимінде өткізілуі мүмкін (16-т.); отырыстарға азаматтық қоғамның бақылаушылары қатысады (18-т.).', 'Заседания могут проводиться по видеоконференцсвязи (п. 16); в заседаниях участвуют наблюдатели от гражданского общества (п. 18).', 'Meetings may be held by video link (para. 16); civil-society observers take part (para. 18).'));

    // ---------------------------------------------------------------- charity
    const charity = ui.split({
      ratio: '1:1', align: 'start',
      left: ui.callout({
        type: 'ok', icon: 'shield',
        title: X('Қайырымдылық көмек — тек ерікті', 'Благотворительная помощь — только добровольно', 'Charitable aid is strictly voluntary'),
        text: X('Қайырымдылық көмек ерікті түрде, өтеусіз көрсетіледі және тек Қамқоршылық кеңестің шешімі бойынша жұмсалады (28-т.). Мемлекеттік емес мектеп үшін түсімдер екінші деңгейдегі банктегі шотқа есепке алынады (29-т. 2) тт.).', 'Благотворительная помощь оказывается добровольно и безвозмездно и расходуется исключительно по решению попечительского совета (п. 28). Для негосударственной школы поступления зачисляются на счёт в банке второго уровня (п. 29 пп. 2).', 'Charitable aid is given voluntarily and free of charge, and is spent only by decision of the Board (para. 28). For a non-state school it is credited to a commercial bank account (para. 29(2)).'),
      }),
      right: `<p class="ab-kicker">${L(X('Қаражат жұмсалатын мақсаттар (30-т.)', 'На что расходуется (п. 30)', 'What it can be spent on (para. 30)'))}</p>
${`<ul class="ab-check ab-check--plain" role="list">${[
        { icon: 'heart', title: X('Оқушыларды әлеуметтік қолдау', 'Социальная поддержка обучающихся', 'Social support for pupils') },
        { icon: 'building', title: X('Материалдық-техникалық базаны жетілдіру', 'Совершенствование материально-технической базы', 'Improving facilities') },
        { icon: 'star', title: X('Дарынды балаларды қолдау', 'Поддержка одарённых детей', 'Supporting gifted children') },
        { icon: 'sparkles', title: X('Дамытушы орта ұйымдастыру', 'Организация развивающей среды', 'A stimulating learning environment') },
      ].map((c) => `<li><span class="ab-check__ico">${ui.icon(c.icon, { size: 20 })}</span><div><p class="ab-check__t">${L(c.title)}</p></div></li>`).join('')}</ul>`}`,
    });

    // ---------------------------------------------------------------- documents
    const docs = ui.docList([
      ...docsByGroup('board'),
      ...decisions.map((m) => ({ title: m.decision.title || X(`Қамқоршылық кеңес отырысының шешімі, ${fmt.date(m.date)}`, `Решение заседания попечительского совета, ${fmt.date(m.date)}`, `Board meeting decision, ${fmt.date(m.date)}`), file: m.decision.file || null, url: m.decision.url || null, number: m.decision.number, date: m.decision.date || m.date })),
      docById('charity-report'),
    ].filter(Boolean));

    const related = ui.linkList([
      { href: href('structure'), icon: 'sitemap', label: X('Басқару құрылымы', 'Структура управления', 'Governance structure'), note: X('Барлық алқалы органдар', 'Все коллегиальные органы', 'All collegial bodies') },
      { href: href('development-plan'), icon: 'target', label: X('Даму жоспары', 'План развития', 'Development plan') },
      { href: href('finance'), icon: 'coins', label: X('Қаржылық есептер', 'Финансовые отчёты', 'Financial reports') },
      { href: href('anticorruption'), icon: 'shield', label: X('Сыбайлас жемқорлыққа қарсы іс-қимыл', 'Противодействие коррупции', 'Anti-corruption') },
      { href: href('surveys'), icon: 'chat', label: X('Сауалнамалар', 'Опросы', 'Surveys') },
    ]);
    const toc = ui.toc([
      { id: 'about-board', label: X('Кеңес туралы', 'О совете', 'About the board') },
      { id: 'composition', label: X('Құрамы', 'Состав', 'Membership') },
      { id: 'election', label: X('Сайлау тәртібі', 'Порядок избрания', 'Election') },
      { id: 'functions', label: X('Функциялары', 'Функции', 'Functions') },
      { id: 'published', label: X('Сайтта не жарияланады', 'Что публикуется', 'What we publish') },
      { id: 'meetings', label: X('Отырыстар', 'Заседания', 'Meetings') },
      { id: 'charity', label: X('Қайырымдылық көмек', 'Благотворительная помощь', 'Charitable aid') },
      { id: 'documents', label: X('Құжаттар', 'Документы', 'Documents') },
    ]);
    const intro = ui.split({
      ratio: '2:1', align: 'start', cls: 'ab-intro',
      left: `${ui.eyebrow(X('Қоғамдық бақылау', 'Общественный контроль', 'Public oversight'))}
<p class="lead">${L(X(
        'Қамқоршылық кеңеске ата-аналар, қоғам және мемлекеттік органдардың өкілдері кіреді. Кеңес мүшелері өтеусіз негізде жұмыс істейді, ал оның отырыстары мен шешімдері мектеп сайтында жарияланады.',
        'В попечительский совет входят родители, представители общественности и государственных органов. Члены совета работают на безвозмездной основе, а его заседания и решения публикуются на сайте школы.',
        'The Board of Trustees brings together parents, the community and public authorities. Members serve without pay, and the board’s meetings and decisions are published on the school website.'))}</p>
<p class="ab-src">${L(X('Негізгі акт', 'Основной акт', 'Governing act'))}: ${ui.extLink(LAW, X('ҚР БҒМ 27.07.2017 № 355 бұйрығы (2026 жылғы 25 мамырдағы № 137-НҚ өзгерістерімен)', 'Приказ МОН РК от 27.07.2017 № 355 (с изменениями от 25.05.2026 № 137-НҚ)', 'Order No. 355 of 27.07.2017 (as amended by No. 137-NK of 25.05.2026)'))}</p>`,
      right: toc,
    });

    return [
      intro,
      ui.section({ id: 'about-board', tone: 'hero', eyebrow: X('Қағидаттар', 'Принципы', 'Principles'), title: X('Кеңес туралы қысқаша', 'Коротко о совете', 'The board at a glance'), body: nums + principles }),
      ui.section({ id: 'composition', eyebrow: X('Кім кіреді', 'Кто входит', 'Who sits on it'), title: X('Кеңестің құрамы', 'Состав совета', 'Membership'), lead: X('Мектеп кеңесінің құрамы бекітілгеннен кейін осы жерде мүшелердің толық аты-жөнімен жарияланады.', 'После утверждения состав совета школы будет опубликован здесь с полными ФИО членов.', 'Once approved, the membership of the school’s board will be published here with members’ full names.'), body: comp + officers }),
      ui.section({ id: 'election', eyebrow: X('Сайлау', 'Избрание', 'Election'), title: X('Кеңес қалай сайланады', 'Как избирается совет', 'How the board is elected'), body: ui.split({ ratio: '3:2', align: 'start', left: election, right: `<h3>${L(X('Кандидат ұсынатын құжаттар (9-т.)', 'Документы кандидата (п. 9)', 'Candidate documents (para. 9)'))}</h3>${candidateDocs}${ui.button({ href: href('feedback'), label: X('Кандидатура туралы сұрақ қою', 'Задать вопрос о выдвижении', 'Ask about standing'), kind: 'ghost', icon: 'arrow-right' })}` }) }),
      ui.section({ id: 'functions', eyebrow: X('14-тармақ', 'Пункт 14', 'Paragraph 14'), title: X('Кеңестің функциялары', 'Функции совета', 'What the board does'), body: functions }),
      ui.section({ id: 'published', tone: 'tint', eyebrow: X('Ашықтық', 'Открытость', 'Transparency'), title: X('Сайтта не жарияланады', 'Что публикуется на сайте', 'What we publish on this site'), lead: X('№ 355 бұйрыққа сәйкес мектеп сайтында міндетті түрде орналастырылатын ақпарат.', 'Сведения, которые по приказу № 355 обязательно размещаются на сайте школы.', 'Information that Order No. 355 requires the school to post online.'), body: published }),
      ui.section({ id: 'meetings', eyebrow: X('Анонстар', 'Анонсы', 'Notices'), title: X('Отырыстар кестесі', 'График заседаний', 'Meeting schedule'), body: meetings + meetNote }),
      ui.section({ id: 'charity', eyebrow: X('Қаражат', 'Средства', 'Funds'), title: X('Қайырымдылық көмек', 'Благотворительная помощь', 'Charitable aid'), body: charity }),
      ui.section({ id: 'documents', eyebrow: X('Құжаттар', 'Документы', 'Documents'), title: X('Кеңестің құжаттары', 'Документы совета', 'Board documents'), body: docs }),
      ui.section({ title: X('Осы бөлімде', 'В этом разделе', 'In this section'), body: related }),
    ].join('\n');
  },
};
