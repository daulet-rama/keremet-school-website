// Director's blog — ORDER-114 §M items 85 (director's address + ask a question) and 86 (personal reception schedule).
// The director's own address, photo, biography and reception hours are NOT known yet → pending blocks (no invented letter).
export default {
  slug: 'director-blog',
  group: 'feedback',
  order: 30,
  title: { kz: 'Директор блогы', ru: 'Блог директора', en: 'Director’s blog' },
  description: {
    kz: '«Керемет» мектебі директорының блогы: ата-аналарға үндеу, директорға сұрақ қою формасы, жеке қабылдау кестесі және жарияланған жауаптар.',
    ru: 'Блог директора школы «Керемет»: обращение к родителям, форма вопроса директору, график личного приёма и опубликованные ответы.',
    en: 'Keremet School director’s blog: a message to parents, a form to ask the director, personal reception hours and published answers.',
  },
  lead: {
    kz: 'Мектеп басшылығымен тікелей байланыс: сұрағыңызды жазыңыз, жеке қабылдауға келіңіз, басқа ата-аналардың сұрақтарына берілген жауаптарды оқыңыз.',
    ru: 'Прямая связь с руководством школы: задайте вопрос, приходите на личный приём, читайте ответы на вопросы других родителей.',
    en: 'A direct line to the school’s leadership: ask a question, come to a personal meeting and read answers to other parents’ questions.',
  },
  styles: ['feedback'],
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, { ui, S, L, t, href }) {
    const X = (kz, ru, en) => ({ kz, ru, en });
    const d = S.legal.director;
    const unconf = ui.badge(t('unconfirmed'), 'warn');

    // ---------------------------------------------------------------- intro: director card + address placeholder + school welcome
    const director = ui.personCard({
      name: d.name,
      role: X('«Керемет» мектебінің директоры', 'Директор школы «Керемет»', 'Director, Keremet School'),
      theme: 'chemistry',
      text: X('Ресми фотосурет, білімі мен еңбек өтілі туралы мәлімет нақтылануда.', 'Официальное фото, сведения об образовании и стаже уточняются.', 'Official photo, education and experience are being confirmed.'),
      reception: X('Жеке қабылдау кестесі — төменде', 'График личного приёма — ниже', 'Reception hours — see below'),
    });
    const letter = `<article class="fb-letter panel pattern" data-theme="chemistry">${ui.shanyrakArt()}
<p class="fb-letter__eyebrow">${L(X('Директордың үндеуі', 'Обращение директора', 'A message from the director'))}</p>
<h3 class="fb-letter__title">${L(X('Ата-аналар мен оқушыларға', 'К родителям и ученикам', 'To parents and pupils'))}</h3>
${ui.pendingGroup(lang, [{ title: X('Үндеу мәтіні дайындалуда', 'Текст обращения готовится', 'The message is being prepared'), note: X('Директордың ата-аналарға арналған жеке үндеуі (мәтіні және қаласа — фотосуреті) бекітілгеннен кейін осы жерде жарияланады.', 'Личное обращение директора к родителям (текст и, по желанию, фотография) будет опубликовано здесь после утверждения.', 'The director’s personal message to parents (text and, optionally, a photo) will be published here once approved.') }], { title: X('Үндеу мәтіні дайындалуда', 'Текст обращения готовится', 'The message is being prepared') })}
</article>`;
    // Neutral description of the page (no quotation, no attribution — the school has not approved any address text yet).
    const welcome = `<div class="fb-about">
<p class="fb-about__t">${L(X('Бұл бетте не бар', 'Что есть на этой странице', 'What this page offers'))}</p>
<ul class="bullets">${[
      X(`директорға сұрақ қоюға немесе ұсыныс жазуға арналған <a href="#ask">форма</a>;`, `<a href="#ask">форма</a>, чтобы задать вопрос директору или написать предложение;`, `a <a href="#ask">form</a> to ask the director a question or make a suggestion;`),
      X(`директор мен орынбасарлардың <a href="#reception">жеке қабылдау кестесі</a>;`, `<a href="#reception">график личного приёма</a> директора и заместителей;`, `the <a href="#reception">personal reception hours</a> of the director and deputies;`),
      X(`авторлары келісім берген сұрақтар мен директордың <a href="#answers">жауаптары</a>.`, `вопросы, которые авторы разрешили опубликовать, и <a href="#answers">ответы</a> директора.`, `questions their authors agreed to publish, with the director’s <a href="#answers">answers</a>.`),
    ].map((x) => `<li>${L(x)}</li>`).join('')}</ul>
</div>`;
    const intro = ui.split({ ratio: '1:2', left: director, right: `<div class="stack stack--l">${letter}${welcome}</div>` });

    // ---------------------------------------------------------------- ask the director
    const how = `<div class="stack">
${ui.steps([
      { title: X('Сұрақ жазыңыз', 'Напишите вопрос', 'Write your question'), text: X('Бір хабарламада бір тақырыпты қысқа әрі нақты сипаттаңыз.', 'Опишите одну тему в одном сообщении — коротко и по существу.', 'Keep to one topic per message — short and to the point.') },
      { title: X('Жауап поштаңызға келеді', 'Ответ придёт на почту', 'The answer comes by e-mail'), text: X('Директордың жауабы сіз көрсеткен электрондық поштаға жіберіледі.', 'Ответ директора будет направлен на указанную вами почту.', 'The director’s answer is sent to the e-mail you give.') },
      { title: X('Келісім берсеңіз — жариялаймыз', 'С вашего согласия — публикуем', 'Published with your consent'), text: X('Белгі қойсаңыз, сұрақ пен жауап аты-жөніңізсіз осы бетте жариялануы мүмкін — басқа ата-аналарға да пайдалы болады.', 'Если отметите галочку, вопрос и ответ могут быть опубликованы на этой странице без вашего имени — это поможет и другим родителям.', 'If you tick the box, the question and answer may be published here without your name — it helps other parents too.') },
    ])}
${ui.callout({ type: 'info', title: X('Шағым немесе ресми өтініш пе?', 'Жалоба или официальное обращение?', 'A complaint or a formal appeal?'), text: X(`Заңда белгіленген мерзімде тіркеліп, қаралуы тиіс ресми өтініш үшін <a href="${href('feedback')}">«Өтініш жолдау»</a> бетін пайдаланыңыз.`, `Для официального обращения, которое регистрируется и рассматривается в установленные законом сроки, используйте страницу <a href="${href('feedback')}">«Обращения»</a>.`, `For a formal appeal that is registered and handled within legal time limits, use the <a href="${href('feedback')}">Appeals</a> page.`) })}
</div>`;
    const ask = ui.split({ ratio: '3:2', left: ui.form({ kind: 'blog', lang }), right: how });

    // ---------------------------------------------------------------- reception schedule
    // Same data slot as the leadership page: S.legal.director.reception (null until approved). Accepted shapes:
    // { days, hours, room? } (each a string or {kz,ru,en}) or one localized summary string. Unknown parts → "to be confirmed".
    const rec = d.reception;
    const isLoc = (v) => v && typeof v === 'object' && ('kz' in v || 'ru' in v || 'en' in v);
    const recObj = rec && typeof rec === 'object' && !isLoc(rec) ? rec : null;
    const recDays = recObj ? L(recObj.days) : L(rec);
    const recHours = recObj ? [L(recObj.hours), recObj.room ? L(recObj.room) : ''].filter(Boolean).join(', ') : '';
    const reception = ui.table({
      cls: 'fb-rec',
      caption: `<span class="sr-only">${L(X('Басшылардың қабылдау күндері, сағаттары және жазылу тәсілі', 'Дни, часы приёма руководителей и способ записи', 'Reception days, hours and how to book, by official'))}</span>`,
      head: [X('Лауазымы', 'Должность', 'Position'), X('Аты-жөні', 'ФИО', 'Name'), X('Күндері', 'Дни', 'Days'), X('Уақыты', 'Время', 'Hours'), X('Қалай жазылуға болады', 'Как записаться', 'How to book')],
      rows: [
        [X('Директор', 'Директор', 'Director'), L(d.name), recDays || unconf, recHours || (recDays ? '—' : unconf), `<a href="tel:${S.contacts.phone.tel}">${S.contacts.phone.display}</a>`],
        [X('Директордың орынбасарлары', 'Заместители директора', 'Deputy directors'), unconf, unconf, unconf, `<a href="tel:${S.contacts.phone.tel}">${S.contacts.phone.display}</a>`],
      ],
    });
    const receptionPending = rec && S.deputies ? '' : ui.pendingGroup(lang, [{
      title: X('Жарияланатын мәліметтер', 'Что будет опубликовано', 'To be published'),
      note: X(
        'Директордың және әр орынбасардың жеке қабылдау күндері мен сағаттары, қабылдау өтетін кабинет, алдын ала жазылу тәртібі; орынбасарлардың аты-жөні мен жетекшілік ететін бағыттары.',
        'Дни и часы личного приёма директора и каждого заместителя, кабинет, порядок предварительной записи; ФИО заместителей и курируемые направления.',
        'Reception days and hours for the director and each deputy, the room, how to book in advance; the deputies’ names and areas of responsibility.',
      ),
    }], { title: X('Қабылдау кестесі бекітілуде', 'График приёма утверждается', 'Reception hours are being approved') });

    // ---------------------------------------------------------------- published Q&A
    const answers = `<div class="fb-empty">
<span class="fb-empty__ico" aria-hidden="true">${ui.icon('chat', { size: 34 })}</span>
<p class="fb-empty__title">${L(X('Жарияланған жауаптар әзірге жоқ', 'Опубликованных ответов пока нет', 'No published answers yet'))}</p>
<p class="fb-empty__text">${L(X('Ата-аналар жариялауға келісім берген алғашқы сұрақтар мен директордың жауаптары осында пайда болады. Жиі қойылатын сұрақтарға жауаптарды «Сұрақ–жауап» бетінен табасыз.', 'Здесь появятся первые вопросы, которые родители разрешили опубликовать, и ответы директора. Ответы на частые вопросы — на странице «Вопрос–ответ».', 'The first questions parents agree to publish, with the director’s answers, will appear here. Answers to common questions are on the FAQ page.'))}</p>
<div class="cluster">${ui.button({ href: '#ask', label: X('Бірінші болып сұрақ қою', 'Задать вопрос первым', 'Be the first to ask'), kind: 'primary', icon: 'arrow-right' })}${ui.button({ href: href('faq'), label: X('Сұрақ–жауап', 'Вопрос–ответ', 'FAQ'), kind: 'ghost' })}</div>
</div>`;

    const toc = ui.toc([
      { id: 'message', label: X('Үндеу', 'Обращение', 'Message') },
      { id: 'ask', label: X('Директорға сұрақ', 'Вопрос директору', 'Ask the director') },
      { id: 'reception', label: X('Қабылдау кестесі', 'График приёма', 'Reception hours') },
      { id: 'answers', label: X('Жарияланған жауаптар', 'Опубликованные ответы', 'Published answers') },
    ]);

    const related = ui.linkList([
      { href: href('leadership'), icon: 'users', label: X('Басшылық', 'Руководство', 'Leadership'), note: X('Директор мен орынбасарлар', 'Директор и заместители', 'Director and deputies') },
      { href: href('feedback'), icon: 'chat', label: X('Өтініш жолдау', 'Обращения', 'Appeals & feedback'), note: X('Ресми өтініш және шағымдану тәртібі', 'Официальное обращение и порядок обжалования', 'Formal appeals and how to appeal') },
      { href: href('faq'), icon: 'info', label: X('Сұрақ–жауап', 'Вопрос–ответ', 'FAQ') },
      { href: href('contacts'), icon: 'pin', label: X('Байланыс', 'Контакты', 'Contacts') },
    ]);

    return [
      `<div class="fb-toc-row">${toc}</div>`,
      ui.section({ id: 'message', eyebrow: X('Мектеп басшылығы', 'Руководство школы', 'School leadership'), title: X('Директор және мектеп туралы', 'Директор и школа', 'The director and the school'), body: intro }),
      ui.section({ id: 'ask', tone: 'chemistry', eyebrow: X('Тікелей байланыс', 'Прямая связь', 'Direct line'), title: X('Директорға сұрақ қою', 'Задать вопрос директору', 'Ask the director a question'), lead: X('Оқу, тәрбие, мектеп өмірі туралы сұрағыңызды қойыңыз немесе ұсынысыңызды жазыңыз.', 'Спросите об учёбе, воспитании, жизни школы или поделитесь предложением.', 'Ask about learning, upbringing or school life, or share a suggestion.'), body: ask }),
      ui.section({ id: 'reception', eyebrow: X('Жеке қабылдау', 'Личный приём', 'Personal reception'), title: X('Қабылдау кестесі', 'График приёма', 'Reception hours'), body: reception + receptionPending }),
      ui.section({ id: 'answers', eyebrow: X('Сұрақтар мен жауаптар', 'Вопросы и ответы', 'Questions and answers'), title: X('Жарияланған жауаптар', 'Опубликованные ответы', 'Published answers'), body: answers }),
      ui.section({ title: t('nav.inSection'), body: related }),
    ].join('\n');
  },
};
