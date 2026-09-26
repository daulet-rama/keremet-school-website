// About the school — REFERENCE PAGE: shows how to build an inner page with the foundation components.
// Facts come only from src/data/school.mjs; unknown items use ui.pending().
export default {
  slug: 'about',
  group: 'about',
  order: 10,
  title: { kz: 'Мектеп туралы', ru: 'О школе', en: 'About the school' },
  description: {
    kz: '«Керемет» зияткерлік мектебі: жалпы мәліметтер, лицензия, оқыту тілдері, ерекшеліктері, тарихы және байланыс деректері.',
    ru: 'Интеллектуальная школа «Керемет»: общие сведения, лицензия, языки обучения, преимущества, история и контакты.',
    en: 'Keremet Intellectual School: general information, licence, languages of instruction, strengths, history and contacts.',
  },
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, { ui, S, L, t, href, fmt, docById }) {
    const X = (kz, ru, en) => ({ kz, ru, en });
    const lic = S.licence.current;
    const addr = (a) => `${a.postcode}, ${L(a.text)}`;
    const gradesTxt = `${S.grades.from}–${S.grades.to}`;

    // ---------------------------------------------------------------- intro
    const intro = ui.split({
      ratio: '1:1', align: 'center',
      left: `${ui.eyebrow(X('Қош келдіңіз', 'Добро пожаловать', 'Welcome'))}
<h2 class="sec__title">${L(S.slogan)}</h2>
<p class="lead" style="margin-top:18px">${L(X(
        '«Керемет» зияткерлік мектебі — Шымкент қаласының Абай ауданындағы жеке меншік жалпы білім беретін мектеп. Оқыту қазақ және орыс тілдерінде жүргізіледі, мектептің 2022 жылдан бері білім беру қызметіне лицензиясы бар.',
        'Интеллектуальная школа «Керемет» — частная общеобразовательная школа в Абайском районе Шымкента. Обучение ведётся на казахском и русском языках, школа имеет лицензию на образовательную деятельность с 2022 года.',
        'Keremet Intellectual School is a private general education school in the Abay district of Shymkent. Teaching is in Kazakh and Russian; the school has held an education licence since 2022.',
      ))}</p>
<div style="margin-top:22px">${ui.chips([
        { icon: 'languages', label: X('Қазақ және орыс тілдері', 'Казахский и русский языки', 'Kazakh & Russian') },
        { icon: 'graduation', label: X(`${gradesTxt} сыныптар*`, `${gradesTxt} классы*`, `Grades ${gradesTxt}*`) },
        { icon: 'shield', label: X('Мерзімсіз лицензия', 'Бессрочная лицензия', 'Unlimited licence') },
        { icon: 'pin', label: X('Шымкент, Асар ш/а', 'Шымкент, мкр. Асар', 'Shymkent, Asar') },
      ])}</div>
<div class="cluster" style="margin-top:28px">${ui.button({ href: href('admission'), label: X('Қабылдау туралы', 'О приёме', 'Admission'), icon: 'arrow-right' })}${ui.button({ href: href('contacts'), label: X('Байланыс', 'Контакты', 'Contacts'), kind: 'ghost' })}</div>`,
      right: ui.panel({ theme: 'hero', cls: 'id-card', body: `<span class="id-card__mark">${ui.logo({ size: 72 })}</span>${ui.shanyrakArt()}
<p class="id-card__name">${L(S.name)}</p><p class="id-card__alt">${[S.name.kz, S.name.ru, S.name.en].filter((n) => n !== L(S.name)).join(' · ')}</p>
<p class="id-card__alt">${L(S.legal.name)} · ${t('bin')} ${S.legal.bin}</p><p class="id-card__slogan">${L(S.nameMeaning)}</p>` }),
    });
    const bento = ui.stats([
        { icon: 'shield', art: true, value: X('Мерзімсіз', 'Бессрочная', 'Unlimited'), label: X(`Лицензия № ${lic.number}`, `Лицензия № ${lic.number}`, `Licence No. ${lic.number}`), note: X(`${fmt.date(lic.date)} берілген · алғаш 2022 жылы`, `выдана ${fmt.date(lic.date)} · впервые в 2022 году`, `issued ${fmt.date(lic.date)} · first in 2022`),
          extra: ui.chips([...S.licenceLevels.slice(0, 3).map((l) => l.label), { label: X(`+ тағы ${S.licenceLevels.length - 3} кіші түрі`, `+ ещё ${S.licenceLevels.length - 3} подвида`, `+ ${S.licenceLevels.length - 3} more sub-types`), href: href('license') }]) },
        { icon: 'calendar', value: '2021', label: X('Серіктестік тіркелді', 'Регистрация ТОО', 'Legal entity registered'), note: fmt.date(S.legal.registered) },
        { icon: 'languages', value: '2', label: X('Оқыту тілі', 'Языка обучения', 'Languages of instruction'), note: X('қазақ, орыс', 'казахский, русский', 'Kazakh, Russian') },
        { icon: 'graduation', value: gradesTxt, label: X('Сыныптар*', 'Классы*', 'Grades*'), note: X('мектептің парақшасы бойынша', 'по данным страницы школы', 'per the school’s profile') },
        { icon: 'building', value: '2', label: X('Қабатты ғимарат', 'Этажа в здании', 'Storeys'), note: X('пандус, кедергісіз кіреберіс', 'пандус, доступный вход', 'ramp, step-free entrance') },
      ], { cls: 'stats--bento' });

    // ---------------------------------------------------------------- general info
    const general = ui.facts([
      { k: X('Толық атауы', 'Полное наименование', 'Full name'), v: `${S.name.kz}<br><span class="muted">${S.name.ru} · ${S.name.en}</span>` },
      { k: X('Заңды тұлға', 'Юридическое лицо', 'Legal entity'), v: L(S.legal.fullName) },
      { k: X('Ұйымның түрі', 'Вид организации', 'Type of organisation'), v: L(S.orgType) },
      { k: t('bin'), v: S.legal.bin, copy: S.legal.bin },
      { k: X('Мемлекеттік тіркелген күні', 'Дата государственной регистрации', 'State registration date'), v: fmt.date(S.legal.registered) },
      { k: X('ЭҚЖЖ коды', 'ОКЭД', 'Activity code (OKED)'), v: `${S.legal.oked.code} — ${L(S.legal.oked.title)}` },
      { k: X('Директор', 'Директор', 'Director'), v: L(S.legal.director.name) },
      { k: X('Құрылтайшы', 'Учредитель', 'Founder'), v: L(S.legal.founder) },
      { k: t('legalAddress'), v: addr(S.addresses.legal), copy: true },
      { k: t('actualAddress'), v: addr(S.addresses.actual), copy: true },
      { k: X('Лицензиаттың мекенжайы (2022 жылғы лицензия бойынша)', 'Адрес лицензиата (по лицензии 2022 года)', 'Licensee address (per the 2022 licence)'), v: addr(S.addresses.licence2022) },
      { k: X('Оқыту тілдері', 'Языки обучения', 'Languages of instruction'), v: S.languages.map((l) => L(l.label)).join(', ') },
      { k: X('Сыныптар', 'Классы', 'Grades'), v: `${gradesTxt} ${ui.badge(X('нақтылануда', 'уточняется', 'to be confirmed'), 'warn')}` },
      { k: X('Лицензия бойынша білім беру деңгейлері', 'Уровни образования по лицензии', 'Levels under the licence'), v: `<ul class="bullets">${S.licenceLevels.map((l) => `<li>${L(l.label)}</li>`).join('')}</ul>` },
      { k: t('hdr.licensor'), v: L(S.licensor) },
      { k: t('phone'), v: `<a href="tel:${S.contacts.phone.tel}">${S.contacts.phone.display}</a>` },
      { k: t('email'), v: S.contacts.emailConfirmed ? `<a href="mailto:${S.contacts.email}">${S.contacts.email}</a>` : `${ui.badge(X('нақтылануда', 'уточняется', 'to be confirmed'), 'warn')} <span class="muted">${L(X('ресми электрондық пошта мекенжайы әзірге расталмаған — телефон немесе WhatsApp арқылы хабарласыңыз', 'официальный адрес электронной почты пока не подтверждён — свяжитесь по телефону или WhatsApp', 'the official e-mail address is not yet confirmed — please call or use WhatsApp'))}</span>` },
    ]);
    const gradesNote = ui.note(X(
      '* Сынып аралығы мектептің Instagram парақшасындағы «0–6 сыныптарға арналған мектеп» деген мәлімет бойынша көрсетілген және нақтылануда.',
      '* Диапазон классов указан по данным страницы школы в Instagram («школа для 0–6 классов») и уточняется.',
      '* The grade range follows the school’s Instagram profile (“a school for grades 0–6”) and is being confirmed.',
    ));

    // ---------------------------------------------------------------- strengths
    const features = ui.cards(S.features.map((f) => ({ icon: f.icon, title: f.label })), { variant: 'feature', cols: 4 });
    const programmes = ui.cards(S.programmes.map((p) => ({ icon: p.icon, title: p.label })), { cols: 3 });
    const srcNote = ui.note(X(
      `Дереккөз: мектептің Instagram парақшасы және 12.08.2025 жарияланған қабылдау туралы хабарландыру (${ui.extLink('https://www.instagram.com/p/DNR-UIYM5uW/', 'instagram.com')}).`,
      `Источник: страница школы в Instagram и объявление о приёме от 12.08.2025 (${ui.extLink('https://www.instagram.com/p/DNR-UIYM5uW/', 'instagram.com')}).`,
      `Source: the school’s Instagram profile and the admission announcement of 12.08.2025 (${ui.extLink('https://www.instagram.com/p/DNR-UIYM5uW/', 'instagram.com')}).`,
    ));

    // ---------------------------------------------------------------- name & mission
    // Data hooks (school.mjs, owner: foundation). Until a slot is filled, a neutral pending block is shown.
    //   S.mission : {kz,ru,en}  or  { mission: {kz,ru,en}, vision: {kz,ru,en} }
    //   S.values  : {kz,ru,en}  or  [{kz,ru,en}, …]
    const isLoc = (v) => typeof v === 'string' || (v && typeof v === 'object' && ('kz' in v || 'ru' in v || 'en' in v));
    const mis = S.mission ? (isLoc(S.mission) ? { mission: S.mission } : S.mission) : {};
    const vals = S.values ? (Array.isArray(S.values) ? S.values : [S.values]) : [];
    const missionPending = ui.pending({ title: X('Миссия және пайым', 'Миссия и видение', 'Mission and vision'), note: X('Мектептің ресми миссиясы мен пайымы бекітілгеннен кейін осы жерде жарияланады.', 'Официальная миссия и видение школы будут опубликованы здесь после утверждения.', 'The school’s official mission and vision will be published here once approved.') });
    const missionHtml = [
      mis.mission ? `<div><h3>${L(X('Миссия', 'Миссия', 'Mission'))}</h3><p class="lead">${L(mis.mission)}</p></div>` : missionPending,
      mis.vision ? `<div><h3>${L(X('Пайым', 'Видение', 'Vision'))}</h3><p>${L(mis.vision)}</p></div>` : '',
      vals.length ? `<div><h3>${L(X('Құндылықтар', 'Ценности', 'Values'))}</h3><ul class="bullets">${vals.map((v) => `<li>${L(v)}</li>`).join('')}</ul></div>` : '',
    ].join('');
    const name = ui.split({
      ratio: '3:2', align: 'center',
      left: ui.quote({
        text: L(S.nameMeaning),
        cite: X('Атаудың мағынасы', 'Значение названия', 'Meaning of the name'),
        role: X('мектеп негізін қалаушының түсіндірмесі бойынша, Kapital.kz, 2018 · ресми миссия емес', 'по объяснению основателя школы, Kapital.kz, 2018 · не официальная миссия', 'as explained by the school’s founder, Kapital.kz, 2018 · not the official mission'),
      }),
      right: `<div class="stack">${missionHtml}
<p class="muted" style="font-family:var(--font-serif);font-style:italic;font-size:1.15rem">«${L(S.slogan)}»</p></div>`,
    });

    // ---------------------------------------------------------------- history
    const history = ui.timeline(S.history.map((h) => ({ date: h.date, title: h.title, text: h.text })));
    // S.teachingStarted: year (number or 'YYYY') — shown as a fact; achievements are still pending.
    const ts = S.teachingStarted;
    const historyNote = ts
      ? ui.facts([{ k: X('Оқу жұмысын бастаған жылы', 'Год начала учебной деятельности', 'Teaching began'), v: String(ts) }])
        + ui.pending(lang, X('Мектептің негізгі жетістіктері нақтыланып жатыр.', 'Основные достижения школы уточняются.', 'The school’s main achievements are being confirmed.'))
      : ui.pending(lang, X(
        'Мектептің оқу жұмысын бастаған жылы және негізгі жетістіктері нақтыланып жатыр.',
        'Год начала учебной деятельности и основные достижения школы уточняются.',
        'The year teaching began and the school’s main achievements are being confirmed.',
      ));

    // ---------------------------------------------------------------- international
    // S.international (school.mjs): { statement: {kz,ru,en}, date: 'YYYY-MM-DD',
    //   partners: [{ name, country: {kz,ru,en}, agreement: {kz,ru,en}, period: {kz,ru,en} | 'YYYY–YYYY' }] }
    // Either a list of partners, or a dated statement (e.g. that no international cooperation is carried out).
    const I = S.international || {};
    const partners = I.partners || [];
    const intl = partners.length || I.statement
      ? [
        I.statement ? `<p class="lead">${L(I.statement)}</p>${I.date ? `<p class="muted small">${L(X('Мәлімдеме күні', 'Дата заявления', 'Statement date'))}: ${fmt.date(I.date)}</p>` : ''}` : '',
        partners.length ? ui.table({
          caption: X('Халықаралық серіктестер мен жобалар', 'Международные партнёры и проекты', 'International partners and projects'),
          head: [X('Серіктес', 'Партнёр', 'Partner'), X('Елі', 'Страна', 'Country'), X('Келісім', 'Соглашение', 'Agreement'), X('Мерзімі', 'Сроки', 'Period')],
          rows: partners.map((p) => [p.name, p.country || '—', p.agreement || '—', p.period || '—']),
        }) : '',
      ].join('')
      : ui.pending({
        title: X('Халықаралық ынтымақтастық', 'Международное сотрудничество', 'International cooperation'),
        note: X(
          'Халықаралық ынтымақтастық туралы ақпарат нақтылануда.',
          'Информация о международном сотрудничестве уточняется.',
          'Information about international cooperation is being confirmed.',
        ),
      });

    // ---------------------------------------------------------------- documents & location
    const tvLink = (d, anchor) => d && ({ ...d, note: `${L(d.note)} <a href="${href('license')}#${anchor}">${L(X('Мәтіндік нұсқасы', 'Текстовая версия', 'Text version'))}</a>` });
    const docs = ui.docList([tvLink(docById('license-2025'), 'current'), tvLink(docById('registration-certificate'), 'registration')].filter(Boolean), { thumbs: true });
    const where = ui.split({
      ratio: '1:1',
      left: `<div class="stack">${ui.contactList({})}${S.contacts.emailConfirmed || !S.contacts.email ? '' : `<p class="note">${ui.icon('info', { size: 16 })}<span>${L(X(`${S.contacts.email} мекенжайы нақтылануда — әзірге телефон немесе WhatsApp арқылы хабарласыңыз.`, `Адрес ${S.contacts.email} уточняется — пока свяжитесь по телефону или WhatsApp.`, `The address ${S.contacts.email} is being confirmed — for now, please call or use WhatsApp.`))}</span></p>`}<p class="note">${ui.icon('bus', { size: 16 })}<span>${L(S.addresses.actual.transit)}</span></p><p class="note">${ui.icon('accessible', { size: 16 })}<span>${L(S.addresses.actual.building)}</span></p></div>`,
      right: ui.mapEmbed(S.addresses.actual.lat, S.addresses.actual.lng, { zoom: 16, height: 420 }),
    });

    const related = ui.linkList([
      { href: href('leadership'), icon: 'user', label: X('Басшылық', 'Руководство', 'Leadership'), note: X('Директор, орынбасарлар, қабылдау кестесі', 'Директор, заместители, график приёма', 'Director, deputies, reception hours') },
      { href: href('structure'), icon: 'sitemap', label: X('Басқару құрылымы', 'Структура управления', 'Governance structure'), note: X('Алқалы органдар мен қызметтер', 'Коллегиальные органы и службы', 'Councils and services') },
      { href: href('license'), icon: 'shield', label: X('Лицензия және тіркеу', 'Лицензия и регистрация', 'Licence & registration'), note: X('Құжаттардың көшірмелері және мәтіндік нұсқалары', 'Копии документов и их текстовые версии', 'Document copies and text versions') },
      { href: href('development-plan'), icon: 'target', label: X('Даму жоспары', 'План развития', 'Development plan') },
      { href: href('symbols'), icon: 'flag', label: X('Мемлекеттік рәміздер', 'Государственные символы', 'State symbols') },
      { href: href('teachers'), icon: 'users', label: X('Педагогтер құрамы', 'Педагогический состав', 'Teaching staff') },
    ]);

    const toc = ui.toc([
      { id: 'general', label: X('Жалпы мәліметтер', 'Общие сведения', 'General information') },
      { id: 'strengths', label: X('Ерекшеліктері', 'Преимущества', 'Strengths') },
      { id: 'name', label: X('Атауы және миссиясы', 'Название и миссия', 'Name and mission') },
      { id: 'history', label: X('Тарихы', 'История', 'History') },
      { id: 'international', label: X('Халықаралық ынтымақтастық', 'Международное сотрудничество', 'International cooperation') },
      { id: 'docs', label: X('Құжаттар', 'Документы', 'Documents') },
      { id: 'location', label: X('Мекенжай және карта', 'Адрес и карта', 'Address and map') },
    ]);

    return [
      intro,
      bento,
      ui.split({ ratio: '1:2', left: toc, right: ui.section({ id: 'general', eyebrow: X('Құрылтай мәліметтері', 'Учредительные сведения', 'Founding details'), title: X('Жалпы мәліметтер', 'Общие сведения', 'General information'), body: general + gradesNote }) }),
      ui.section({ id: 'strengths', tone: 'hero', eyebrow: X('Неліктен Keremet', 'Почему Keremet', 'Why Keremet'), title: X('Мектептің ерекшеліктері', 'Преимущества школы', 'What makes the school special'), lead: X('Мектеп өз парақшасында атап өткен басты ерекшеліктер мен бағдарламалар.', 'Главные особенности и программы, которые школа называет на своей странице.', 'The key features and programmes the school lists on its own page.'), body: features + `<h3 style="margin-top:clamp(28px,4vw,48px)">${L(X('Бағдарламалар мен бағыттар', 'Программы и направления', 'Programmes'))}</h3>` + programmes + srcNote }),
      ui.section({ id: 'name', eyebrow: X('Шаңырақ астында', 'Под шаныраком', 'Under the shanyrak'), title: X('Атауы және миссиясы', 'Название и миссия', 'Name and mission'), body: name }),
      ui.section({ id: 'history', eyebrow: X('2021 жылдан бері', 'С 2021 года', 'Since 2021'), title: X('Мектеп тарихы', 'История школы', 'History'), body: history + historyNote }),
      ui.section({ id: 'international', title: X('Халықаралық ынтымақтастық', 'Международное сотрудничество', 'International cooperation'), body: intl }),
      ui.section({ id: 'docs', eyebrow: X('Растайтын құжаттар', 'Подтверждающие документы', 'Supporting documents'), title: X('Құжаттар', 'Документы', 'Documents'), body: docs, actions: ui.button({ href: href('license'), label: X('Барлық лицензиялық құжаттар', 'Все лицензионные документы', 'All licence documents'), kind: 'ghost', icon: 'arrow-right' }) }),
      ui.section({ id: 'location', eyebrow: X('Бізге келіңіз', 'Приходите к нам', 'Visit us'), title: X('Мекенжай және карта', 'Адрес и карта', 'Address and map'), body: where }),
      ui.banner({ theme: 'geography', icon: 'graduation', eyebrow: X('Қабылдау', 'Приём', 'Admission'), title: X('Балаңызды «Керемет» мектебіне бергіңіз келе ме?', 'Хотите, чтобы ваш ребёнок учился в «Керемет»?', 'Would you like your child to study at Keremet?'), text: X('Қабылдау қағидаларымен, құжаттар тізімімен танысып, өтінім қалдырыңыз.', 'Ознакомьтесь с правилами приёма и списком документов и оставьте заявку.', 'Read the admission rules and document list, then leave a request.'), href: href('admission'), label: X('Қабылдау туралы', 'О приёме', 'About admission') }),
      ui.section({ title: X('Осы бөлімде', 'В этом разделе', 'In this section'), body: related }),
    ].join('\n');
  },
};
