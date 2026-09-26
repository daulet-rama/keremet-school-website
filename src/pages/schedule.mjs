// Education group — Timetable, bell schedule and the 2026–2027 academic calendar (ORDER-114 §F items 46, 50).
// Academic calendar: order of the Acting Minister of Education No. 213-НҚ of 29.07.2026 (adilet G26HP000213),
// text read 24.09.2026. Bell schedule / timetable / the school's calendar order come from S.schedule (school.mjs);
// each falls back to a pending block while null. Accepted shapes:
//   S.schedule.bells            [{ n?, from: '08:30', to: '09:10', shift?: 1, note? }, …]  rows; `shift` groups them (school.mjs contract)
//                               or { shifts: [{ name: X|string, rows: [ …as above ] }], note?: X|string }
//   S.schedule.weekly           { posted: 'YYYY-MM-DDTHH:MM', docId?: 'timetable' }         contract: the 'timetable' document + posting time
//                               or { file | url, number?, date? }                              one timetable document
//                               or [{ name: '1А', file | url, date? } | { name: '1А', days: [[Mon subjects…], …, [Fri…]] }, …]
//   S.schedule.academicCalendar [{ kind: 'term'|'holiday', title: X, from, to }, …]        contract: the school's approved periods (table)
//                               or { file | url, number?, date?, note? }                      the director's order
import { actLegal, actRef, num, pendLine, TUP_MAX } from './curriculum.mjs';

const X = (kz, ru, en) => ({ kz, ru, en });
const DAY = 86400000;
const d = (s) => Date.parse(`${s}T00:00:00Z`);
const days = (a, b) => Math.round((d(b) - d(a)) / DAY) + 1;

// Periods of the 2026–2027 school year (holidays verbatim from order 213-НҚ; quarter spans derived from them).
const PERIODS = [
  { k: 'q', from: '2026-09-01', to: '2026-10-25', weeks: 8, name: X('1-тоқсан', '1 четверть', 'Term 1') },
  { k: 'h', from: '2026-10-26', to: '2026-11-01', name: X('Күзгі демалыс', 'Осенние каникулы', 'Autumn break') },
  { k: 'q', from: '2026-11-02', to: '2026-12-27', weeks: 8, name: X('2-тоқсан', '2 четверть', 'Term 2') },
  { k: 'h', from: '2026-12-28', to: '2027-01-10', name: X('Қысқы демалыс', 'Зимние каникулы', 'Winter break') },
  { k: 'q', from: '2027-01-11', to: '2027-03-21', weeks: 10, name: X('3-тоқсан', '3 четверть', 'Term 3'), g1: { from: '2027-02-08', to: '2027-02-14' } },
  { k: 'h', from: '2027-03-22', to: '2027-03-28', name: X('Көктемгі демалыс', 'Весенние каникулы', 'Spring break') },
  { k: 'q', from: '2027-03-29', to: '2027-05-25', weeks: 8, name: X('4-тоқсан', '4 четверть', 'Term 4') },
];
const MONTHS = [
  ['2026-09-01', '2026-09-30', X('Қыр', 'Сен', 'Sep')], ['2026-10-01', '2026-10-31', X('Қаз', 'Окт', 'Oct')], ['2026-11-01', '2026-11-30', X('Қар', 'Ноя', 'Nov')],
  ['2026-12-01', '2026-12-31', X('Жел', 'Дек', 'Dec')], ['2027-01-01', '2027-01-31', X('Қаң', 'Янв', 'Jan')], ['2027-02-01', '2027-02-28', X('Ақп', 'Фев', 'Feb')],
  ['2027-03-01', '2027-03-31', X('Нау', 'Мар', 'Mar')], ['2027-04-01', '2027-04-30', X('Сәу', 'Апр', 'Apr')], ['2027-05-01', '2027-05-25', X('Мам', 'Май', 'May')],
];

export default {
  slug: 'schedule',
  group: 'education',
  order: 20,
  title: X('Сабақ кестесі', 'Расписание', 'Timetable'),
  description: X(
    '2026–2027 оқу жылының күнтізбесі мен демалыстары (№ 213-НҚ бұйрық), қоңырау кестесі, сабақ кестесі және сыныптардың апталық оқу жүктемесі.',
    'Академический календарь 2026–2027 и каникулы (приказ № 213-НҚ), расписание звонков и уроков, недельная учебная нагрузка по классам.',
    'The 2026–2027 academic calendar and holidays (Order No. 213-NK), bell schedule, timetable and weekly workload by grade.',
  ),
  lead: X(
    '2026–2027 оқу жылында қашан оқимыз және демаламыз, қоңырау мен сабақ кестесі, әр сыныптың аптасына қанша сағат оқитыны.',
    'Когда учимся и отдыхаем в 2026–2027 году, звонки и расписание уроков, сколько часов в неделю у каждого класса.',
    'When we study and rest in 2026–2027, bells and the timetable, and how many hours a week each grade has.',
  ),
  styles: ['education'],
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, { ui, S, L, href, fmt, docById }) {
    const SCH = (S && S.schedule) || {};
    const dm = (s) => fmt.date(s).slice(0, 5); // dd.mm
    const range = (a, b) => `${fmt.date(a)} – ${fmt.date(b)}`;
    const nd = (n) => L(X(`${n} күн`, `${n} ${n % 10 === 1 && n % 100 !== 11 ? 'день' : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? 'дня' : 'дней'}`, `${n} days`));
    const nw = (n) => L(X(`${n} апта`, `${n} ${[2, 3, 4].includes(n % 10) ? 'недели' : 'недель'}`, `${n} weeks`));
    const total = days('2026-09-01', '2027-05-25');

    // ------------------------------------------------------------ stats
    const stats = ui.stats([
      { icon: 'calendar', art: true, value: dm('2026-09-01'), label: X('Оқу жылының басталуы', 'Начало учебного года', 'School year starts'), note: fmt.date('2026-09-01') },
      { icon: 'flag', value: dm('2027-05-25'), label: X('Оқу жылының аяқталуы', 'Окончание учебного года', 'School year ends'), note: fmt.date('2027-05-25') },
      { icon: 'book', value: '34', label: X('Оқу аптасы', 'Учебные недели', 'Teaching weeks'), note: X('8 + 8 + 10 + 8; 1-сынып — 33 апта', '8 + 8 + 10 + 8; 1 класс — 33 недели', '8 + 8 + 10 + 8; grade 1 — 33 weeks') },
      { icon: 'sun', value: '28', label: X('Демалыс күндері', 'Дней каникул', 'Days of holidays'), note: X('7 + 14 + 7', '7 + 14 + 7', '7 + 14 + 7') },
      { icon: 'star', value: '+7', label: X('1-сыныпқа қосымша демалыс', 'Доп. каникулы для 1 класса', 'Extra break for grade 1'), note: range('2027-02-08', '2027-02-14') },
    ], { cls: 'stats--bento' });

    // ------------------------------------------------------------ year ribbon
    const cols = MONTHS.map(([a, b]) => `${days(a, b)}fr`).join(' ');
    const cols2 = PERIODS.map((p) => `${days(p.from, p.to)}fr`).join(' ');
    const seg = (p) => {
      const n = days(p.from, p.to);
      const g1 = p.g1 ? `<span class="edu-year__g1" style="--l:${((days(p.from, p.g1.from) - 1) / n * 100).toFixed(2)}%;--w:${(days(p.g1.from, p.g1.to) / n * 100).toFixed(2)}%" title="${L(X('1-сыныптарға қосымша демалыс', 'Дополнительные каникулы для 1 классов', 'Extra break for grade 1'))}"></span>` : '';
      return `<li class="edu-year__seg edu-year__seg--${p.k}"><b>${L(p.name)}</b><small>${dm(p.from)}–${dm(p.to)} · ${p.weeks ? nw(p.weeks) : nd(n)}</small>${g1}</li>`;
    };
    const ribbon = `<figure class="edu-year" aria-labelledby="edu-year-cap"><figcaption id="edu-year-cap" class="sr-only">${L(X('2026–2027 оқу жылының кестесі: тоқсандар мен демалыстар', 'График 2026–2027 учебного года: четверти и каникулы', 'The 2026–2027 school year: terms and holidays'))}</figcaption>
<div class="edu-year__months" style="--cols:${cols}" aria-hidden="true">${MONTHS.map((m) => `<span>${L(m[2])}</span>`).join('')}</div>
<ol class="edu-year__bar" style="--cols2:${cols2}" role="list">${PERIODS.map(seg).join('')}</ol>
<p class="edu-year__key"><span><i class="k-q"></i>${L(X('Оқу тоқсаны', 'Учебная четверть', 'Term'))}</span><span><i class="k-h"></i>${L(X('Демалыс', 'Каникулы', 'Holidays'))}</span><span><i class="k-g1"></i>${L(X(`1-сыныптарға қосымша демалыс (${dm('2027-02-08')}–${dm('2027-02-14')})`, `Доп. каникулы 1 классов (${dm('2027-02-08')}–${dm('2027-02-14')})`, `Extra grade-1 break (${dm('2027-02-08')}–${dm('2027-02-14')})`))}</span></p></figure>`;

    const calTable = ui.table({
      head: [X('Кезең', 'Период', 'Period'), X('Мерзімі', 'Сроки', 'Dates'), X('Ұзақтығы', 'Продолжительность', 'Length')],
      rows: [
        ...PERIODS.map((p) => [L(p.name), range(p.from, p.to), p.weeks ? nw(p.weeks) : nd(days(p.from, p.to))]),
        [X('1-сыныптарға қосымша демалыс', 'Дополнительные каникулы для 1 классов', 'Extra break for grade 1'), range('2027-02-08', '2027-02-14'), nd(7)],
      ],
      caption: X('2026–2027 оқу жылы: тоқсандар мен демалыстар', '2026–2027 учебный год: четверти и каникулы', '2026–2027: terms and holidays'),
    });
    const calNote = ui.note(X(
      `Оқу жылының басталуы мен аяқталуы, тоқсандардың ұзақтығы және демалыс күндері мына құжатпен белгіленген: ${actRef(ui, 'calendar', lang)}. Тоқсандардың басталу және аяқталу күндері демалыс күндерінен есептелген; мектеп бұйрығымен бекітілген академиялық күнтізбе төменде жарияланады.`,
      `Начало и окончание учебного года, продолжительность четвертей и даты каникул установлены документом: ${actRef(ui, 'calendar', lang)}. Даты начала и окончания четвертей рассчитаны по датам каникул; академический календарь, утверждённый приказом школы, публикуется ниже.`,
      `Start and end of the year, term lengths and holiday dates are set by: ${actRef(ui, 'calendar', lang)}. Term start/end dates are derived from the holiday dates; the calendar approved by the school’s order is published below.`,
    ));
    const finalsText = ui.prose(X(
      `<p>Сол бұйрыққа сәйкес: 9 (10) сыныптар — ${range('2027-05-31', '2027-06-11')}, 11 (12) сыныптар — ${range('2027-06-01', '2027-06-17')}. Бастауыш сыныптарда қорытынды аттестаттау өткізілмейді.</p>`,
      `<p>По тому же приказу: 9 (10) классы — ${range('2027-05-31', '2027-06-11')}, 11 (12) классы — ${range('2027-06-01', '2027-06-17')}. В начальных классах итоговая аттестация не проводится.</p>`,
      `<p>Under the same order: grades 9 (10) — ${range('2027-05-31', '2027-06-11')}, grades 11 (12) — ${range('2027-06-01', '2027-06-17')}. There is no final attestation in primary grades.</p>`));
    const calBase = docById('academic-calendar');
    const calRaw = SCH.academicCalendar;
    const calRows = Array.isArray(calRaw) ? calRaw.filter((r) => r && r.from && r.to) : [];
    const calData = calRaw && !Array.isArray(calRaw) && (calRaw.file || calRaw.url) ? calRaw : null;
    const KIND = { term: X('Оқу тоқсаны', 'Учебная четверть', 'Term'), holiday: X('Демалыс', 'Каникулы', 'Holidays') };
    const schoolCal = calRows.length ? ui.table({
      head: [X('Кезең', 'Период', 'Period'), X('Түрі', 'Вид', 'Kind'), X('Мерзімі', 'Сроки', 'Dates'), X('Ұзақтығы', 'Продолжительность', 'Length')],
      rows: calRows.map((r) => [r.title ? L(r.title) : L(KIND[r.kind] || KIND.term), L(KIND[r.kind] || KIND.term), range(r.from, r.to), nd(days(r.from, r.to))]),
      caption: X('Мектеп бекіткен академиялық күнтізбе, 2026–2027', 'Академический календарь, утверждённый школой, 2026–2027', 'Academic calendar approved by the school, 2026–2027'),
    }) : '';
    const calDocs = calBase || calData ? pendLine(ui, lang, { docs: [calData
      ? { ...(calBase || {}), ...calData, title: calData.title || (calBase && calBase.title) || X('Академиялық күнтізбе 2026–2027', 'Академический календарь 2026–2027', 'Academic calendar 2026–2027') }
      : calRows.length ? { ...calBase } : { ...calBase, note: X('Мектеп жүктейді: директор бекіткен 2026–2027 оқу жылының академиялық күнтізбесі (бұйрық нөмірі мен күні).', 'Школа загружает академический календарь на 2026–2027 учебный год, утверждённый директором (номер и дата приказа).', 'To be uploaded: the 2026–2027 academic calendar approved by the director (order number and date).') }] }) : '';

    // ------------------------------------------------------------ bells & timetable (S.schedule, pending while null)
    const hm = (t) => { const m = /^(\d{1,2})[:.](\d{2})$/.exec(String(t || '').trim()); return m ? +m[1] * 60 + +m[2] : null; };
    const bellTable = (rows, caption) => ui.table({
      head: [X('Сабақ', 'Урок', 'Lesson'), X('Уақыты', 'Время', 'Time'), X('Үзіліс', 'Перемена', 'Break')],
      rows: rows.map((r, i) => {
        const next = rows[i + 1];
        const gap = next && hm(r.to) != null && hm(next.from) != null ? hm(next.from) - hm(r.to) : null;
        return [r.n != null ? (typeof r.n === 'object' ? r.n : `${r.n}`) : `${i + 1}`, `${r.from}–${r.to}`, r.note || (gap != null ? L(X(`${gap} мин`, `${gap} мин`, `${gap} min`)) : '—')];
      }),
      caption, compact: true, stack: false,
    });
    const byShift = (rows) => {
      const keys = [...new Set(rows.map((r) => (r && r.shift != null ? String(r.shift) : '1')))];
      if (keys.length < 2) return [{ rows }];
      return keys.sort().map((k) => ({ name: /^\d+$/.test(k) ? X(`${k}-ауысым`, `${k} смена`, `Shift ${k}`) : k, rows: rows.filter((r) => String(r.shift != null ? r.shift : '1') === k) }));
    };
    const PEND = []; // items for the single "N материалов готовятся" line of the section
    const isPend = (d) => d && !d.file && !d.url;
    const docsOrPend = (list) => { const l = list.filter(Boolean); l.filter(isPend).forEach((d) => PEND.push({ title: d.title, note: d.note || X('Құжат жүктеледі', 'Документ будет загружен', 'Document will be uploaded') })); const r = l.filter((d) => !isPend(d)); return r.length ? ui.docList(r) : ''; };
    const shifts = Array.isArray(SCH.bells) ? byShift(SCH.bells.filter((r) => r && r.from && r.to)) : SCH.bells && Array.isArray(SCH.bells.shifts) ? SCH.bells.shifts : [];
    const bellsHtml = shifts.length
      ? shifts.map((sh, i) => bellTable(sh.rows || [], sh.name || (shifts.length > 1 ? X(`${i + 1}-ауысым`, `${i + 1} смена`, `Shift ${i + 1}`) : X('Қоңырау кестесі', 'Расписание звонков', 'Bell schedule')))).join('') + (SCH.bells && !Array.isArray(SCH.bells) && SCH.bells.note ? ui.note(SCH.bells.note) : '')
      : (PEND.push({ title: X('Қоңырау кестесі', 'Расписание звонков', 'Bell schedule'), note: X(
        'Ауысымдар саны, сабақтың басталу уақыты, әр сабақ пен үзілістің уақыты, 1-сыныптардың режимі. Мектеп бекіткен кесте келіп түскенде осы жерде кесте түрінде жарияланады.',
        'Количество смен, время начала занятий, время каждого урока и перемены, режим 1 классов. Утверждённое школой расписание будет опубликовано здесь в виде таблицы.',
        'Number of shifts, start time, the time of each lesson and break, the grade-1 regime. The approved schedule will be published here as a table.') }), '');
    const DAYS = [X('Дс', 'Пн', 'Mon'), X('Сс', 'Вт', 'Tue'), X('Ср', 'Ср', 'Wed'), X('Бс', 'Чт', 'Thu'), X('Жм', 'Пт', 'Fri'), X('Сн', 'Сб', 'Sat')];
    const classGrid = (c) => {
      const days = c.days || [];
      const max = Math.max(0, ...days.map((d) => (d || []).length));
      return ui.table({
        head: [X('№', '№', 'No.'), ...days.map((_, i) => DAYS[i])],
        rows: Array.from({ length: max }, (_, k) => [`${k + 1}`, ...days.map((d) => (d && d[k]) || '—')]),
        compact: true, stack: false,
      });
    };
    const weekly = SCH.weekly;
    const ttDoc = docById('timetable');
    const ttNote = X('Әр сыныпқа бөлек, оқу жылының басына бекітілген кесте; өзгерістер енгізілген сайын жаңартылады.', 'Отдельно по каждому классу, утверждённое на начало учебного года; обновляется при каждом изменении.', 'Per class, approved for the start of the year; updated whenever it changes.');
    let ttHtml;
    if (Array.isArray(weekly) && weekly.length) {
      const grids = weekly.filter((c) => Array.isArray(c.days));
      const files = weekly.filter((c) => !Array.isArray(c.days) && (c.file || c.url));
      ttHtml = (files.length ? docsOrPend(files.map((c) => ({ ...c, title: c.title || c.name }))) : '')
        + (grids.length ? ui.accordion(grids.map((c, i) => ({ q: c.name, a: classGrid(c), open: i === 0 }))) : '');
    } else if (weekly && !weekly.file && !weekly.url && (weekly.posted || weekly.docId)) {
      const wDoc = docById(weekly.docId || 'timetable') || ttDoc;
      ttHtml = wDoc ? docsOrPend([{ ...wDoc, ...(weekly.posted ? { posted: weekly.posted } : {}), ...(wDoc.file || wDoc.url ? {} : { note: ttNote }) }]) : '';
    } else if (weekly && (weekly.file || weekly.url)) {
      ttHtml = docsOrPend([{ ...(ttDoc || {}), ...weekly, title: weekly.title || (ttDoc && ttDoc.title) }]);
    } else {
      ttHtml = docsOrPend([ttDoc].filter(Boolean).map((x) => ({ ...x, note: ttNote })));
    }
    const bells = !bellsHtml && !ttHtml ? '' : ui.split({
      ratio: '1:1',
      left: `<h3>${L(X('Қоңырау кестесі', 'Расписание звонков', 'Bell schedule'))}</h3>${bellsHtml}`,
      right: `<h3>${L(X('Сабақ кестесі', 'Расписание уроков', 'Timetable'))}</h3>${ttHtml}`,
    });
    PEND.push({ title: X('Толық күн мектебі: күн тәртібі', 'Школа полного дня: режим дня', 'Full-day school: daily routine'), note: X(
      'Мектеп «толық күн мектебі және қосымша сабақтар» бағытын жариялаған (12.08.2025). Күн тәртібі (сабақтар, тамақтану, үй тапсырмасы сағаты, үйірмелер, балаларды алып кету уақыты) бекітілгеннен кейін жарияланады.',
      'Школа заявляет формат «школа полного дня и дополнительные уроки» (12.08.2025). Режим дня (уроки, питание, час самоподготовки, кружки, время, когда забирают детей) будет опубликован после утверждения.',
      'The school advertises a “full-day school with extra lessons” (12.08.2025). The daily routine (lessons, meals, homework hour, clubs, pick-up time) will be published once approved.') });
    const dayRegime = pendLine(ui, lang, { items: PEND, note: bells ? null : X('Қоңырау кестесін, сабақ кестесін және күн тәртібін мектеп бекітеді — бекітілген соң осы жерде жарияланады.', 'Звонки, расписание уроков и режим дня утверждает школа — после утверждения они появятся здесь.', 'Bells, the timetable and the daily routine are approved by the school and will appear here once approved.') });

    // ------------------------------------------------------------ weekly load bars
    const scale = 32;
    const bars = TUP_MAX.grades.map((g, i) => {
      const a = TUP_MAX.kz[i], b = TUP_MAX.ru[i], cap = TUP_MAX.cap[i];
      const capMark = `<span class="edu-bars__cap" style="--cap:${(cap / scale * 100).toFixed(1)}%"></span>`;
      const opt = g >= 5 ? `<small class="edu-bars__opt">${L(X('ашылған жағдайда', 'если открыт', 'if opened'))}</small>` : '';
      return `<div class="edu-bars__row${g >= 5 ? ' edu-bars__row--opt' : ''}"><span class="edu-bars__k">${L(X(`${g}-сынып`, `${g} класс`, `Grade ${g}`))}${opt}</span><div class="edu-bars__stack">
<div class="edu-bars__track" role="img" aria-label="${L(X(`${g}-сынып, қазақ тілінде оқыту: ${num(a, lang)} сағат, шегі ${num(cap, lang)}`, `${g} класс, казахский язык обучения: ${num(a, lang)} ч, предел ${num(cap, lang)}`, `Grade ${g}, Kazakh-medium: ${num(a, lang)} h, limit ${num(cap, lang)}`))}"><span class="edu-bars__fill" style="--w:${(a / scale * 100).toFixed(1)}%"><b>${num(a, lang)}</b></span>${capMark}</div>
<div class="edu-bars__track edu-bars__track--alt" role="img" aria-label="${L(X(`${g}-сынып, орыс тілінде оқыту: ${num(b, lang)} сағат, шегі ${num(cap, lang)}`, `${g} класс, русский язык обучения: ${num(b, lang)} ч, предел ${num(cap, lang)}`, `Grade ${g}, Russian-medium: ${num(b, lang)} h, limit ${num(cap, lang)}`))}"><span class="edu-bars__fill" style="--w:${(b / scale * 100).toFixed(1)}%"><b>${num(b, lang)}</b></span>${capMark}</div></div></div>`;
    }).join('');
    const loadChart = `<div class="edu-bars">${bars}</div><p class="edu-year__key"><span><i class="k-q"></i>${L(X('жоғарғы жолақ — қазақ тілінде оқытатын сыныптар', 'верхняя полоса — классы с казахским языком', 'top bar — Kazakh-medium classes'))}</span><span><i class="k-q edu-k-alt"></i>${L(X('төменгі — орыс тілінде оқытатын сыныптар', 'нижняя — классы с русским языком', 'bottom — Russian-medium classes'))}</span><span><i class="k-cap"></i>${L(X('МЖМБС шегі: 1–4-сыныптарда 27 сағат, 5–6-сыныптарда 30,5 сағат', 'предел ГОСО: 27 часов в 1–4 классах, 30,5 часа в 5–6 классах', 'standard limit: 27 h in grades 1–4, 30.5 h in grades 5–6'))}</span></p>`;
    const loadNote = ui.more({ label: X('Сандар қайдан алынды', 'Откуда эти цифры', 'Where the numbers come from'), icon: 'info', tone: 'card', body: ui.note(X(
      `Үлгілік оқу жоспары бойынша ең жоғары апталық жүктеме (инварианттық + вариативтік компонент), сағат: 1–4-сыныптар — № 500 бұйрықтың 1–2-қосымшалары, 5–6-сыныптар (ашылған жағдайда) — 6–7-қосымшалары. Пәндер бойынша бөлінісі: <a href="${href('curriculum')}#tup">Оқу жоспары мен бағдарламалар</a>. Мектептің нақты жүктемесі ЖОЖ-да көрсетіледі.`,
      `Максимальная недельная нагрузка по типовому учебному плану (инвариант + вариативный компонент), часов: 1–4 классы — приложения 1–2 к приказу № 500, 5–6 классы (если открыты) — приложения 6–7. Распределение по предметам: <a href="${href('curriculum')}#tup">Учебный план и программы</a>. Фактическая нагрузка школы указывается в РУП.`,
      `Maximum weekly load under the standard curriculum (core + variable), hours: grades 1–4 — appendices 1–2 of Order No. 500, grades 5–6 (if opened) — appendices 6–7. By subject: <a href="${href('curriculum')}#tup">Curriculum & programmes</a>. The school’s actual load is set in its working curriculum.`,
    )) });

    const related = ui.linkList([
      { href: href('curriculum'), icon: 'grid', label: X('Оқу жоспары мен бағдарламалар', 'Учебный план и программы', 'Curriculum & programmes') },
      { href: href('distance'), icon: 'globe', label: X('Қашықтан оқыту', 'Дистанционное обучение', 'Distance learning'), note: X('Қолайсыз ауа райы кезінде', 'При неблагоприятной погоде', 'In adverse weather') },
      { href: href('events'), icon: 'calendar', label: X('Іс-шаралар күнтізбесі', 'Календарь событий', 'Events calendar') },
      { href: href('meals'), icon: 'utensils', label: X('Мектептегі тамақтану', 'Школьное питание', 'School meals') },
    ]);
    const toc = ui.toc([
      { id: 'calendar', label: X('Академиялық күнтізбе', 'Академический календарь', 'Academic calendar') },
      { id: 'bells', label: X('Қоңырау және сабақ кестесі', 'Звонки и расписание уроков', 'Bells & timetable') },
      { id: 'load', label: X('Апталық оқу жүктемесі', 'Недельная нагрузка', 'Weekly load') },
      { id: 'acts', label: X('Құқықтық негіз', 'Правовая основа', 'Legal basis') },
    ]);

    const introLead = X(
      `Барлық мектептер үшін ортақ мерзімдерді Оқу-ағарту министрлігі бекітеді: 2026–2027 оқу жылы ${fmt.date('2026-09-01')} басталып, ${fmt.date('2027-05-25')} аяқталады. Қоңырау мен сабақ кестесін мектеп бекітеді.`,
      `Общие для всех школ сроки утверждает Министерство просвещения: 2026–2027 учебный год начинается ${fmt.date('2026-09-01')} и завершается ${fmt.date('2027-05-25')}. Расписание звонков и уроков утверждает школа.`,
      `The Ministry of Education sets dates common to all schools: the 2026–2027 year runs from ${fmt.date('2026-09-01')} to ${fmt.date('2027-05-25')}. Bells and the timetable are approved by the school.`);
    const tldr = ui.tldr({ points: [
      { icon: 'calendar', text: X(`<strong>${dm('2026-09-01')} – ${dm('2027-05-25')}</strong>: 4 тоқсан, 3 демалыс.`, `<strong>${dm('2026-09-01')} – ${dm('2027-05-25')}</strong>: 4 четверти и трое каникул.`, `<strong>${dm('2026-09-01')} – ${dm('2027-05-25')}</strong>: 4 terms, 3 breaks.`) },
      { icon: 'clock', text: X('Мерзімдер — министрліктен, қоңырау мен сабақ — мектептен.', 'Сроки — от министерства, звонки и уроки — от школы.', 'Dates come from the ministry; bells and lessons from the school.') },
    ] });
    const calRow = `<div class="dz-row">${ui.more({ label: X('Мерзімдер кестесі', 'Таблица сроков', 'Dates as a table'), icon: 'grid', count: PERIODS.length + 1, tone: 'card', body: ui.prose(`<p>${L(introLead)}</p>`) + calTable })}
${ui.more({ label: X('Қорытынды аттестаттау мерзімдері (анықтама үшін)', 'Сроки итоговой аттестации (для справки)', 'Final attestation dates (for reference)'), icon: 'graduation', tone: 'card', body: finalsText })}
${actLegal(ui, ['calendar'], lang, { lead: calNote })}</div>`;
    const schoolCalBlock = schoolCal || calDocs ? `<div class="edu-schoolcal"><h3>${L(X('Мектептің академиялық күнтізбесі', 'Академический календарь школы', 'The school’s academic calendar'))}</h3>${schoolCal}${calDocs}</div>` : '';

    return [
      ui.split({ ratio: '2:1', align: 'start', left: `${ui.eyebrow(X('2026–2027 оқу жылы', '2026–2027 учебный год', 'School year 2026–2027'))}<h2 class="sec__title">${L(X('Оқу жылы — бір қарағанда', 'Учебный год — одним взглядом', 'The school year at a glance'))}</h2>${tldr}`, right: toc }),
      stats,
      ui.section({ id: 'calendar', tone: 'physics', eyebrow: X('Министрлік күнтізбесі', 'Календарь министерства', 'The ministry’s calendar'), title: X('Академиялық күнтізбе 2026–2027', 'Академический календарь 2026–2027', 'Academic calendar 2026–2027'), lead: X(`${total} күн: 4 тоқсан және 3 демалыс кезеңі.`, `${total} дней: 4 четверти и 3 периода каникул.`, `${total} days: 4 terms and 3 holiday periods.`), body: ribbon + calRow + schoolCalBlock }),
      ui.section({ id: 'bells', eyebrow: X('Күнделікті тәртіп', 'Распорядок', 'Daily routine'), title: X('Қоңырау және сабақ кестесі', 'Звонки и расписание уроков', 'Bells and timetable'), body: bells + dayRegime }),
      ui.section({ id: 'load', eyebrow: X('Аптасына қанша сағат', 'Сколько часов в неделю', 'Hours per week'), title: X('Апталық оқу жүктемесі', 'Недельная учебная нагрузка', 'Weekly workload'), lead: X('1–6-сыныптар, ең көбі.', '1–6 классы, максимум.', 'Grades 1–6, at most.'), body: loadChart + `<div class="dz-row">${loadNote}${actLegal(ui, ['calendar', 'tup', 'goso'], lang, { id: 'acts' })}</div>` }),
      ui.banner({ theme: 'physics', icon: 'globe', eyebrow: X('Аяз, боран, карантин', 'Мороз, метель, карантин', 'Frost, blizzard, quarantine'), title: X('Сабақ қашықтан өткізілсе, қалай хабарлаймыз?', 'Как сообщаем о переходе на дистанционное обучение?', 'How we announce a switch to distance learning'), text: X('Хабарлау уақыты, арналары және ата-аналарға кеңестер.', 'Время оповещения, каналы и советы родителям.', 'Alert times, channels and tips for parents.'), href: href('distance'), label: X('Қашықтан оқыту', 'Дистанционное обучение', 'Distance learning') }),
      ui.section({ title: X('Осы бөлімде', 'В этом разделе', 'In this section'), body: related }),
    ].join('\n');
  },
};
