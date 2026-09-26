// Surveys — ORDER-114 §M item 88: results of surveys of parents, pupils and teachers.
// No surveys have been published yet → invitation structure + pending result slots (file:null) telling the school what to upload.
export default {
  slug: 'surveys',
  group: 'feedback',
  order: 50,
  title: { kz: 'Сауалнамалар', ru: 'Анкетирование', en: 'Surveys' },
  description: {
    kz: 'Ата-аналар, оқушылар мен педагогтер арасындағы сауалнамалар: қатысуға шақыру, өткізу қағидаттары және нәтижелері.',
    ru: 'Анкетирование родителей, учеников и педагогов: приглашение к участию, принципы проведения и результаты опросов.',
    en: 'Surveys of parents, pupils and teachers: how to take part, how surveys are run and their published results.',
  },
  lead: {
    kz: 'Сіздің пікіріңіз мектептің шешімдеріне әсер етеді. Мұнда белсенді сауалнамалар мен олардың қорытындылары жарияланады.',
    ru: 'Ваше мнение влияет на решения школы. Здесь публикуются актуальные опросы и их итоги.',
    en: 'Your opinion shapes the school’s decisions. Current surveys and their results are published here.',
  },
  styles: ['feedback'],
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, { ui, L, t, href, docById }) {
    const X = (kz, ru, en) => ({ kz, ru, en });
    const PD_LAW = { kz: 'https://adilet.zan.kz/kaz/docs/Z1300000094', ru: 'https://adilet.zan.kz/rus/docs/Z1300000094', en: 'https://adilet.zan.kz/eng/docs/Z1300000094' }[lang];
    const pdLaw = ui.extLink(PD_LAW, X('«Дербес деректер және оларды қорғау туралы» Заң', 'Закон «О персональных данных и их защите»', 'Law on Personal Data and its Protection'));
    const year = X('2026–2027 оқу жылы', '2026–2027 учебный год', '2026–2027 school year');

    // ---------------------------------------------------------------- audiences
    const audience = (icon, title, text, theme) => `<article class="fb-aud" data-theme="${theme}"><span class="fb-aud__ico">${ui.icon(icon, { size: 28 })}</span><h3 class="fb-aud__t">${L(title)}</h3><p class="fb-aud__x">${L(text)}</p><p class="fb-aud__s">${ui.icon('hourglass', { size: 16 })}<span>${L(X('Сауалнама жарияланады', 'Опрос будет опубликован', 'Survey coming soon'))}</span></p></article>`;
    const audiences = `<div class="fb-auds" data-reveal-stagger>
${audience('users', X('Ата-аналар', 'Родители', 'Parents'), X('Оқу сапасы, мектептегі жайлылық, тамақтану, үйірмелер, мектеппен байланыс.', 'Качество обучения, комфорт в школе, питание, кружки, связь со школой.', 'Teaching quality, comfort at school, meals, clubs, communication with the school.'), 'chemistry')}
${audience('graduation', X('Оқушылар', 'Ученики', 'Pupils'), X('Сабақтар, достар мен мұғалімдермен қарым-қатынас, қауіпсіздік сезімі, қызығушылықтар.', 'Уроки, отношения с друзьями и учителями, чувство безопасности, интересы.', 'Lessons, relationships with friends and teachers, feeling safe, interests.'), 'hero')}
${audience('book', X('Педагогтер', 'Педагоги', 'Teachers'), X('Еңбек жағдайлары, әдістемелік қолдау, кәсіби даму, ұжымдағы ахуал.', 'Условия труда, методическая поддержка, профессиональный рост, климат в коллективе.', 'Working conditions, methodological support, professional growth, team climate.'), 'arts')}
</div>`;

    // ---------------------------------------------------------------- current surveys
    const current = `<div class="fb-empty">
<span class="fb-empty__ico" aria-hidden="true">${ui.icon('target', { size: 34 })}</span>
<p class="fb-empty__title">${L(X('Қазір белсенді сауалнама жоқ', 'Сейчас активных опросов нет', 'No active surveys right now'))}</p>
<p class="fb-empty__text">${L(X('Жаңа сауалнама басталғанда оның сілтемесі, мақсаты, өтетін мерзімі және кімге арналғаны осы жерде жарияланады. Хабарландыруларды мектептің Instagram парақшасынан да қадағалаңыз.', 'Когда начнётся новый опрос, здесь появятся ссылка, цель, сроки проведения и для кого он предназначен. Следите также за объявлениями в Instagram школы.', 'When a new survey starts, its link, purpose, dates and audience will appear here. Also watch the school’s Instagram for announcements.'))}</p>
<div class="cluster">${ui.button({ href: href('feedback'), label: X('Сауалнама тақырыбын ұсыну', 'Предложить тему опроса', 'Suggest a survey topic'), kind: 'primary', icon: 'arrow-right' })}</div>
</div>`;

    // ---------------------------------------------------------------- principles (generic, legally grounded)
    const principles = ui.cards([
      { icon: 'heart', title: X('Ерікті қатысу', 'Добровольное участие', 'Voluntary'), text: X('Сауалнамаға қатысу — міндет емес; кез келген сұраққа жауап бермеуге болады.', 'Участие в опросе — не обязанность; на любой вопрос можно не отвечать.', 'Taking part is never compulsory; you may skip any question.') },
      { icon: 'lock', title: X('Дербес деректерді қорғау', 'Защита персональных данных', 'Data protection'), text: X(`Кәмелетке толмағандардың деректерін өңдеу үшін заңды өкілдерінің келісімі қажет (${pdLaw}). Мектеп деректерді қалай өңдейтіні — <a href="${href('privacy')}">құпиялылық саясатында</a>.`, `Для обработки данных несовершеннолетних нужно согласие их законных представителей (${pdLaw}). Как школа обрабатывает данные — в <a href="${href('privacy')}">политике конфиденциальности</a>.`, `Processing minors’ data requires their legal representatives’ consent (${pdLaw}). How the school handles data is set out in the <a href="${href('privacy')}">privacy policy</a>.`) },
      { icon: 'grid', title: X('Жиынтық нәтижелер', 'Обобщённые итоги', 'Aggregated results'), text: X('Жарияланатын қорытындыларда тек жалпы сандар мен үлестер көрсетіледі, жеке жауаптар жарияланбайды.', 'В публикуемых итогах — только общие цифры и доли, без индивидуальных ответов.', 'Published results show only totals and shares, never individual answers.') },
      { icon: 'target', title: X('Нәтиже → шешім', 'Итог → решение', 'Result → action'), text: X('Әр есептің соңында мектептің қорытындыға сай қандай шаралар қабылдағаны көрсетіледі.', 'В конце каждого отчёта указывается, какие меры школа приняла по итогам.', 'Each report ends with what the school decided to do about the results.') },
    ], { cols: 4, variant: 'feature' });

    // ---------------------------------------------------------------- results (pending slots)
    const results = ui.docList(['parents', 'pupils', 'teachers'].map((k) => docById(`survey-${k}-2026-2027`)).filter(Boolean));
    const resultsPending = ui.pending({
      title: X('Жарияланатын мәліметтер', 'Что будет опубликовано', 'To be published'),
      note: X(
        'Әр өткізілген сауалнама бойынша: тақырыбы мен мақсаты, өткізілген мерзімі, қатысушылар саны, негізгі нәтижелер (кесте немесе диаграмма) және қабылданған шаралар — PDF немесе сайт бетіндегі мәтін түрінде.',
        'По каждому проведённому опросу: тема и цель, сроки, число участников, основные результаты (таблица или диаграмма) и принятые меры — в виде PDF или текста на странице.',
        'For each survey: topic and purpose, dates, number of participants, key results (table or chart) and the actions taken — as a PDF or as text on this page.',
      ),
    });

    // ---------------------------------------------------------------- how a survey cycle works
    const cycle = ui.steps([
      { title: X('Хабарландыру', 'Объявление', 'Announcement'), text: X('Осы бетте және мектеп арналарында сауалнаманың мақсаты мен мерзімі жарияланады.', 'На этой странице и в каналах школы объявляются цель и сроки опроса.', 'The purpose and dates are announced here and on the school’s channels.') },
      { title: X('Жауап беру', 'Участие', 'Taking part'), text: X('Сілтеме бойынша онлайн-сауалнаманы толтырасыз.', 'Вы заполняете онлайн-анкету по ссылке.', 'You fill in the online form via the link.') },
      { title: X('Талдау', 'Анализ', 'Analysis'), text: X('Жауаптар жинақталып, жалпы нәтижелер есептеледі.', 'Ответы обобщаются, считаются общие результаты.', 'Answers are pooled and overall results calculated.') },
      { title: X('Жариялау', 'Публикация', 'Publication'), text: X('Қорытындылар мен шаралар осы бетте жарияланады.', 'Итоги и меры публикуются на этой странице.', 'Results and actions are published on this page.') },
    ]);

    const toc = ui.toc([
      { id: 'who', label: X('Кімге арналған', 'Для кого', 'Who is surveyed') },
      { id: 'current', label: X('Белсенді сауалнамалар', 'Актуальные опросы', 'Current surveys') },
      { id: 'results', label: X('Нәтижелер', 'Результаты', 'Results') },
      { id: 'principles', label: X('Өткізу қағидаттары', 'Принципы', 'Principles') },
    ]);

    return [
      ui.split({ ratio: '1:2', align: 'start', left: toc, right: ui.section({ id: 'who', eyebrow: X('Үш тарап — бір мектеп', 'Три стороны — одна школа', 'Three voices — one school'), title: X('Кімнің пікірін сұраймыз', 'Чьё мнение мы спрашиваем', 'Whose views we ask for'), body: audiences }) }),
      ui.section({ id: 'current', eyebrow: X('Қазір', 'Сейчас', 'Now'), title: X('Белсенді сауалнамалар', 'Актуальные опросы', 'Current surveys'), body: current }),
      ui.section({ id: 'results', tone: 'chemistry', eyebrow: L(year), title: X('Сауалнама нәтижелері', 'Результаты анкетирования', 'Survey results'), body: results + resultsPending }),
      ui.section({ id: 'principles', eyebrow: X('Қалай өтеді', 'Как это устроено', 'How it works'), title: X('Сауалнама қалай өткізіледі', 'Как проводится анкетирование', 'How surveys are run'), lead: X('Сауалнама циклі мен негізгі қағидаттар. Мектептің сауалнама жүргізу тәртібі бекітілгеннен кейін осы жерде нақтыланады.', 'Цикл опроса и основные принципы. После утверждения порядка анкетирования в школе он будет уточнён здесь.', 'The survey cycle and core principles. Once the school approves its survey procedure, the details will be given here.'), body: cycle + principles }),
      ui.section({ title: t('nav.inSection'), body: ui.linkList([
        { href: href('feedback'), icon: 'chat', label: X('Өтініш жолдау', 'Обращения', 'Appeals & feedback'), note: X('Ұсынысыңызды жазыңыз', 'Напишите предложение', 'Send a suggestion') },
        { href: href('parents'), icon: 'users', label: X('Ата-аналармен жұмыс', 'Работа с родителями', 'Working with parents') },
        { href: href('self-assessment'), icon: 'target', label: X('Өзін-өзі бағалау', 'Самооценка', 'Self-assessment') },
        { href: href('faq'), icon: 'info', label: X('Сұрақ–жауап', 'Вопрос–ответ', 'FAQ') },
        { href: href('privacy'), icon: 'lock', label: X('Құпиялылық саясаты', 'Политика конфиденциальности', 'Privacy policy'), note: X('Дербес деректер қалай өңделеді', 'Как обрабатываются персональные данные', 'How personal data is processed') },
        { href: PD_LAW, icon: 'scale', label: X('«Дербес деректер және оларды қорғау туралы» Заң', 'Закон «О персональных данных и их защите»', 'Law on Personal Data and its Protection'), note: 'adilet.zan.kz', ext: true },
      ]) }),
    ].join('\n');
  },
};
