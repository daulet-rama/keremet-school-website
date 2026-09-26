// Privacy policy — ORDER-114 §P item 96; Law of the RK No. 94-V "On Personal Data and Their Protection"
// (articles checked on adilet.zan.kz, 24.09.2026: 7, 8, 12, 16, 18, 24, 25, 30).
// Describes what THIS site really does (see src/ui.mjs form(), public/api/feedback.php, public/assets/js/main.js):
// forms are e-mailed to the school, no database; the sender's IP is written into the e-mail body (feedback.php l. 129);
// a hashed-IP rate-limit file keeps only stamps from the last 10 minutes (the file itself is not deleted); localStorage keys
// keremet-lang / keremet-a11y / keremet-motion; no cookies, no analytics; self-hosted fonts (no third-party font requests); OpenStreetMap embed on map pages.
// Unknown (pending): person responsible for personal-data processing, official e-mail, hosting location, retention periods.
import { ACTS, adiletUrl } from './legislation.mjs';

const X = (kz, ru, en) => ({ kz, ru, en });
const act = (id) => ACTS.find((a) => a.id === id);

export default {
  slug: 'privacy',
  group: 'documents',
  order: 50,
  title: { kz: 'Құпиялылық саясаты', ru: 'Политика конфиденциальности', en: 'Privacy policy' },
  description: {
    kz: 'Сайт қандай дербес деректерді жинайды, не үшін, қалай сақтайды және сіздің құқықтарыңыз — «Дербес деректер және оларды қорғау туралы» Заң бойынша.',
    ru: 'Какие персональные данные собирает сайт, зачем, как хранит и какие у вас права — по Закону «О персональных данных и их защите».',
    en: 'What personal data this site collects, why, how it is stored and your rights under the Law “On Personal Data and Their Protection”.',
  },
  styles: ['documents'],
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, { ui, L, t, href, S, fmt, docsByGroup }) {
    const pd = act('pd');
    const mailOk = Boolean(S.contacts.email && S.contacts.emailConfirmed);
    const law = (art) => ui.extLink(adiletUrl(pd, lang), L(X(`Заңның ${art}-бабы`, `ст. ${art} Закона`, `Art. ${art} of the Law`)));

    // ------------------------------------------------------------ summary
    const summary = ui.stats([
      { icon: 'check', value: X('Келісім', 'Согласие', 'Consent'), label: X('Нысандағы деректер тек сіздің келісіміңізбен жіберіледі', 'Данные из форм отправляются только с вашего согласия', 'Form data is sent only with your consent') },
      { icon: 'lock', value: '0', label: X('Cookie файлдары мен аналитика жүйелері', 'Cookie-файлов и систем аналитики', 'Cookies and analytics trackers'), note: X('сайт оларды қолданбайды', 'сайт их не использует', 'the site uses none') },
      { icon: 'mail', value: X('Пошта', 'Почта', 'E-mail'), label: X('Өтініштер мектептің поштасына жіберіледі', 'Обращения приходят на почту школы', 'Requests go to the school’s mailbox'), note: X('сайтта дерекқор жоқ', 'базы данных на сайте нет', 'no database on the site') },
      { icon: 'user', value: '24', label: X('Заңның 24-бабы бойынша құқықтарыңыз', 'Ваши права по ст. 24 Закона', 'Your rights under Art. 24'), note: X('білу, түзету, жою, келісімді кері қайтару', 'знать, исправить, удалить, отозвать согласие', 'know, correct, delete, withdraw consent') },
    ], { cls: 'dx-stats' });

    // ------------------------------------------------------------ operator
    const operator = ui.facts([
      { k: X('Дербес деректер операторы', 'Оператор персональных данных', 'Personal data operator'), v: L(S.legal.fullName) },
      { k: t('bin'), v: S.legal.bin, copy: S.legal.bin },
      { k: t('legalAddress'), v: `${S.addresses.legal.postcode}, ${L(S.addresses.legal.text)}` },
      { k: t('actualAddress'), v: `${S.addresses.actual.postcode}, ${L(S.addresses.actual.text)}` },
      { k: X('Директор', 'Директор', 'Director'), v: L(S.legal.director.name) },
      { k: t('phone'), v: `<a href="tel:${S.contacts.phone.tel}">${S.contacts.phone.display}</a>` },
      { k: t('email'), v: mailOk ? ui.schoolEmail() : ui.badge(t('email.pending'), 'warn') },
      { k: X('Дербес деректерді өңдеуді ұйымдастыруға жауапты адам', 'Ответственный за организацию обработки персональных данных', 'Person responsible for personal data processing'), v: `${L(X('тағайындалғаннан кейін көрсетіледі (Заңның 25-бабы)', 'будет указан после назначения (ст. 25 Закона)', 'to be named after appointment (Art. 25)'))} ${ui.badge(X('күтілуде', 'ожидается', 'pending'), 'warn')}` },
    ]);

    // ------------------------------------------------------------ what we collect
    const req = (s) => `${s}<span class="dx-req" aria-hidden="true">*</span>`;
    // stacked-table cells on phones are CSS grids: wrap mixed inline content so it stays one grid item
    const cell = (h) => `<span>${h}</span>`;
    const collect = ui.table({
      caption: X('Сайт нысандары арқылы жиналатын деректер (* — міндетті өріс)', 'Данные, которые собираются через формы сайта (* — обязательное поле)', 'Data collected through the site’s forms (* — required field)'),
      head: [X('Нысан', 'Форма', 'Form'), X('Деректер', 'Данные', 'Data'), X('Мақсаты', 'Цель', 'Purpose')],
      rows: [
        [
          `<a href="${href('feedback')}">${L(X('Кері байланыс', 'Обратная связь', 'Feedback'))}</a>`,
          cell(L(X(`${req('аты-жөні')}, ${req('электрондық пошта')}, телефон, өтініш тақырыбы, ${req('хабарлама мәтіні')}`, `${req('имя')}, ${req('e-mail')}, телефон, тема обращения, ${req('текст сообщения')}`, `${req('name')}, ${req('e-mail')}, phone, topic, ${req('message')}`))),
          L(X('Өтінішті қарау және жауап беру', 'Рассмотрение обращения и ответ', 'Handling and answering your request')),
        ],
        [
          `<a href="${href('director-blog')}">${L(X('Директорға сұрақ', 'Вопрос директору', 'Question to the director'))}</a>`,
          cell(L(X(`${req('аты-жөні')}, ${req('электрондық пошта')}, ${req('сұрақ')}, жариялауға келісім белгісі`, `${req('имя')}, ${req('e-mail')}, ${req('вопрос')}, отметка о согласии на публикацию`, `${req('name')}, ${req('e-mail')}, ${req('question')}, consent-to-publish tick box`))),
          L(X('Сұраққа жауап беру; сұрақ пен жауап тек келісім болса жарияланады, байланыс деректері жарияланбайды', 'Ответ на вопрос; вопрос и ответ публикуются только с согласия, контакты не публикуются', 'Answering; the question and answer are published only with consent, contact details never')),
        ],
        [
          `<a href="${href('admission')}">${L(X('Қабылдауға өтінім', 'Заявка на приём', 'Admission request'))}</a>`,
          cell(L(X(`ата-ананың ${req('аты-жөні')}, ${req('телефоны')}, электрондық пошта, баланың ${req('аты-жөні')}, туған күні, ${req('сыныбы')}, оқыту тілі, түсініктеме`, `${req('ФИО родителя')}, ${req('телефон')}, e-mail, ${req('ФИО ребёнка')}, дата рождения, ${req('класс')}, язык обучения, комментарий`, `parent’s ${req('name')}, ${req('phone')}, e-mail, child’s ${req('name')}, date of birth, ${req('grade')}, language of instruction, comment`))),
          L(X('Қабылдау мәселесі бойынша хабарласу. Бұл алдын ала өтінім; ресми өтініш № 564 қағидалар бойынша беріледі', 'Связаться по вопросу приёма. Это предварительная заявка; официальное заявление подаётся по Правилам № 564', 'Contacting you about admission. This is a preliminary request; the official application follows Rules No. 564')),
        ],
        [
          L(X('Барлық нысандар (техникалық)', 'Все формы (технические)', 'All forms (technical)')),
          L(X('IP мекенжайы, бет мекенжайы, тіл, жіберу уақыты', 'IP-адрес, адрес страницы, язык, время отправки', 'IP address, page address, language, time of sending')),
          L(X('Спамнан қорғау және өтінішті сәйкестендіру. IP мекенжайы өтініш хатында көрсетіледі және хатпен бірге сақталады. Спамнан қорғау үшін серверде қосымша IP-дің хэші (IP-дің өзі емес) және жіберу уақыттары сақталады; соңғы 10 минуттан ескі уақыттар есепке алынбайды', 'Защита от спама и идентификация обращения. IP-адрес указывается в письме с обращением и хранится вместе с ним. Для защиты от спама на сервере дополнительно хранится хэш IP (не сам IP) и отметки времени отправки; отметки старше 10 минут не учитываются', 'Spam protection and identifying the request. The IP address is included in the e-mail with your request and kept with it. For spam protection the server also keeps a hash of the IP (not the IP itself) with sending times; times older than 10 minutes are ignored')),
        ],
      ],
    });
    const howSent = ui.callout({
      type: 'info', icon: 'mail',
      title: X('Деректер қайда түседі', 'Куда попадают данные', 'Where the data goes'),
      text: X(
        'Нысан жіберілгенде деректер (IP мекенжайымен бірге) мектептің электрондық поштасына хат болып келеді; сайтта дерекқор жоқ. Хатқа тек өтінішпен жұмыс істейтін қызметкерлер ғана қол жеткізуі тиіс. Егер нысан жіберілмесе, сайт WhatsApp немесе электрондық пошта арқылы жазуды ұсынады — бұл жағдайда хабарлама сол қызметтердің ережелері бойынша беріледі.',
        'При отправке формы данные (вместе с IP-адресом) приходят письмом на электронную почту школы; базы данных на сайте нет. Доступ к письму должен предоставляться только сотрудникам, работающим с обращением. Если форма не отправилась, сайт предложит написать через WhatsApp или e-mail — тогда сообщение передаётся по правилам этих сервисов.',
        'When you submit a form, the data (together with your IP address) arrives as an e-mail in the school’s mailbox; the site has no database. Access to it must be limited to the staff handling the request. If sending fails, the site offers WhatsApp or e-mail instead — the message is then carried under those services’ own terms.',
      ),
    });

    // ------------------------------------------------------------ browser storage & third parties
    const storage = ui.table({
      caption: X('Браузерде сақталатын баптаулар (localStorage)', 'Настройки, сохраняемые в браузере (localStorage)', 'Settings stored in your browser (localStorage)'),
      head: [X('Кілт', 'Ключ', 'Key'), X('Не сақталады', 'Что хранится', 'What it stores')],
      rows: [
        ['<code>keremet-lang</code>', L(X('Таңдалған тіл (kz / ru / en)', 'Выбранный язык (kz / ru / en)', 'Chosen language (kz / ru / en)'))],
        ['<code>keremet-a11y</code>', L(X('Нашар көретіндерге арналған нұсқаның баптаулары', 'Настройки версии для слабовидящих', 'Low-vision version settings'))],
        ['<code>keremet-motion</code>', L(X('Анимацияны тоқтату баптауы', 'Настройка остановки анимации', 'Animation pause setting'))],
      ],
      compact: true,
    });
    const storageNote = ui.note(X('Бұл жазбалар тек сіздің құрылғыңызда қалады, серверге жіберілмейді және дербес деректер емес. Оларды браузер баптауларында кез келген уақытта өшіруге болады. Сайт cookie файлдарын, аналитика мен жарнама жүйелерін қолданбайды.', 'Эти записи остаются только на вашем устройстве, не передаются на сервер и не являются персональными данными. Их можно удалить в настройках браузера в любой момент. Сайт не использует cookie, системы аналитики и рекламы.', 'These entries stay on your device, are never sent to the server and are not personal data. You can clear them in your browser settings at any time. The site uses no cookies, analytics or advertising systems.'));
    const third = ui.cards([
      { icon: 'languages', title: X('Қаріптер', 'Шрифты', 'Fonts'), text: X('Қаріптер сайттың өз серверінде орналасқан: оларды жүктеу кезінде браузер сыртқы қызметтерге (мысалы, Google Fonts) сұраныс жібермейді.', 'Шрифты размещены на сервере самого сайта: при их загрузке браузер не обращается к сторонним сервисам (например, Google Fonts).', 'Fonts are hosted on the site’s own server: loading them sends no request to third-party services (such as Google Fonts).') },
      { icon: 'pin', title: 'OpenStreetMap', text: X('Карта бар беттерде OpenStreetMap картасы енгізілген; ол ашылғанда браузер карта серверіне сұраныс жібереді.', 'На страницах с картой встроена карта OpenStreetMap; при её показе браузер обращается к серверу карт.', 'Pages with a map embed OpenStreetMap; showing it makes your browser contact the map server.') },
      { icon: 'ext', title: X('Сыртқы сілтемелер', 'Внешние ссылки', 'External links'), text: X('Instagram, WhatsApp, 2GIS, egov.kz, adilet.zan.kz және басқа сайттардың өз құпиялылық саясаттары бар.', 'У Instagram, WhatsApp, 2GIS, egov.kz, adilet.zan.kz и других сайтов свои политики конфиденциальности.', 'Instagram, WhatsApp, 2GIS, egov.kz, adilet.zan.kz and other sites have their own privacy policies.') },
    ], { cols: 3 });

    // ------------------------------------------------------------ principles (the law)
    const principles = ui.accordion([
      { q: X('Қандай негізде өңдейміз', 'На каком основании мы обрабатываем данные', 'Legal basis'), open: true, a: `<p>${L(X(`Дербес деректер сіздің немесе заңды өкіліңіздің келісімімен жиналады және өңделеді (${law(7)}, ${law(8)}). Нысандағы «келісемін» белгісі — осы келісім; онсыз нысан жіберілмейді.`, `Персональные данные собираются и обрабатываются с согласия субъекта или его законного представителя (${law(7)}, ${law(8)}). Отметка «согласен» в форме — это согласие; без неё форма не отправляется.`, `Personal data is collected and processed with the consent of the data subject or their legal representative (${law(7)}, ${law(8)}). The consent tick box in each form is that consent; the form cannot be sent without it.`))}</p>` },
      { q: X('Тек нақты мақсат үшін', 'Только для конкретной цели', 'Purpose limitation'), a: `<p>${L(X(`Деректер тек жоғарыдағы кестеде көрсетілген мақсаттарға қажетті көлемде жиналады. Жариялау, жарнама немесе сату үшін пайдаланылмайды (${law(7)}, 8-тармақ; ${law(12)}).`, `Данные собираются только в объёме, нужном для целей из таблицы выше. Они не используются для рекламы, продажи или публикации (${law(7)}, п. 8; ${law(12)}).`, `Only the data needed for the purposes in the table above is collected. It is not used for advertising, sale or publication (${law(7)}(8); ${law(12)}).`))}</p>` },
      { q: X('Қайда және қанша уақыт сақталады', 'Где и сколько хранятся', 'Where and how long data is kept'), a: `<p>${L(X(`Заң бойынша дербес деректер Қазақстан Республикасының аумағындағы базада сақталады және оларды жинау мақсатына қол жеткізілгенге дейін сақталады; мақсатқа жеткеннен кейін жойылады (${law(12)}, ${law(18)}).`, `По закону персональные данные хранятся в базе на территории Республики Казахстан и до достижения целей их сбора; после этого они уничтожаются (${law(12)}, ${law(18)}).`, `By law, personal data is stored in a database located in Kazakhstan until the purpose of collection is achieved, and is then destroyed (${law(12)}, ${law(18)}).`))}</p>${ui.pending({ title: X('Нақтыланатын мәліметтер', 'Уточняемые сведения', 'Details to be confirmed'), note: X('Хостинг пен пошта серверінің орналасқан жері, өтініштер хаттарын (IP мекенжайымен бірге) сақтаудың нақты мерзімдері, хаттарға кімнің қол жеткізе алатыны және HTTPS қосылуы мектептің ішкі ережесі бекітіліп, сайт хостингке орналастырылғаннан кейін көрсетіледі.', 'Место размещения хостинга и почтового сервера, конкретные сроки хранения писем с обращениями (вместе с IP-адресом), круг лиц с доступом к ним и подключение HTTPS будут указаны после утверждения внутреннего положения школы и размещения сайта на хостинге.', 'The hosting and mail-server location, the exact retention period for request e-mails (including the IP address), who has access to them and the HTTPS setup will be stated once the school approves its internal policy and the site is hosted.') })}` },
      { q: X('Үшінші тұлғаларға беру', 'Передача третьим лицам', 'Sharing with third parties'), a: `<p>${L(X(`Заңда көзделген жағдайларды қоспағанда, нысандағы деректер үшінші тұлғаларға берілмейді. Шетелге трансшекаралық беру тек ${law(16)} талаптарына сәйкес мүмкін.`, `Данные из форм не передаются третьим лицам, кроме случаев, предусмотренных законом. Трансграничная передача возможна только в соответствии со ${law(16)}.`, `Form data is not shared with third parties except where the law requires. Cross-border transfer is possible only as permitted by ${law(16)}.`))}</p>` },
      { q: X('Балалардың деректері', 'Данные детей', 'Children’s data'), a: `<p>${L(X('Кәмелетке толмаған баланың деректерін (мысалы, қабылдауға өтінімде) оның ата-анасы немесе заңды өкілі береді және келісімді де солар береді.', 'Данные несовершеннолетнего (например, в заявке на приём) предоставляет и даёт согласие на их обработку его родитель или законный представитель.', 'A minor’s data (for example in an admission request) is provided — and consented to — by the parent or legal representative.'))}</p>` },
      { q: X('Педагогтер туралы мәліметтер', 'Сведения о педагогах', 'Information about teachers'), a: `<p>${L(X(`Педагогтердің аты-жөні, фотосуреті және біліктілігі сайтта тек олардың келісімімен жарияланады (${law(7)}, 3-тармақ); мектеп бұл келісімді жазбаша алады.`, `ФИО, фото и квалификация педагогов публикуются на сайте только с их согласия (${law(7)}, п. 3); школа получает это согласие письменно.`, `Teachers’ names, photos and qualifications are published only with their consent (${law(7)}(3)); the school obtains this consent in writing.`))}</p>` },
      { q: X('Қорғау шаралары', 'Меры защиты', 'Security measures'), a: `<p>${L(X('Нысандар спамнан қорғалған (жасырын өріс, жіберу жиілігін шектеу), капча қолданылмайды. Талаптар: сайт тек HTTPS хаттамасы арқылы жұмыс істеуі тиіс, ал өтініштер хаттарына тек жауапты қызметкерлер ғана қол жеткізуі тиіс. Бұл шаралардың іске асырылуы жоғарыдағы «Нақтыланатын мәліметтер» блогында расталады.', 'Формы защищены от спама (скрытое поле, ограничение частоты отправки), без капчи. Требования: сайт должен работать только по протоколу HTTPS, а доступ к письмам с обращениями предоставляется только ответственным сотрудникам. Выполнение этих мер будет подтверждено в блоке «Уточняемые сведения» выше.', 'Forms are protected from spam (hidden field, rate limiting) without a captcha. Requirements: the site must run over HTTPS only, and access to request e-mails is given only to responsible staff. Their implementation will be confirmed in the “Details to be confirmed” block above.'))}</p>` },
    ]);

    // ------------------------------------------------------------ rights
    const rights = ui.cards([
      { icon: 'eye', title: X('Білу', 'Знать', 'Know'), text: X('Мектепте сіздің қандай деректеріңіз бар, олар қайдан, не үшін және қанша уақыт өңделетінін білу (24-бап).', 'Знать, какие ваши данные есть у школы, откуда, зачем и как долго они обрабатываются (ст. 24).', 'Know what data the school holds about you, its source, purpose and processing period (Art. 24).') },
      { icon: 'doc', title: X('Танысу — тегін', 'Ознакомиться — бесплатно', 'Access free of charge'), text: X('Өз деректеріңізбен өтеусіз танысу (24-бап).', 'Безвозмездно ознакомиться со своими данными (ст. 24).', 'See your own data free of charge (Art. 24).') },
      { icon: 'check', title: X('Түзету', 'Исправить', 'Correct'), text: X('Растайтын құжаттар болса, деректерді өзгерту және толықтыру. Оператор мұны 1 жұмыс күні ішінде орындайды (25-бап).', 'Изменить и дополнить данные при подтверждающих документах. Оператор делает это в течение 1 рабочего дня (ст. 25).', 'Have data changed or completed with supporting documents — within 1 working day (Art. 25).') },
      { icon: 'lock', title: X('Бұғаттау және жою', 'Блокировать и удалить', 'Block and delete'), text: X('Заң бұзылып жиналған деректерді бұғаттауды және жоюды талап ету (24-бап).', 'Требовать блокирования и удаления данных, собранных с нарушением закона (ст. 24).', 'Demand blocking and deletion of data collected unlawfully (Art. 24).') },
      { icon: 'arrow-left', title: X('Келісімді кері қайтару', 'Отозвать согласие', 'Withdraw consent'), text: X('Оператор 15 жұмыс күні ішінде өңдеуді тоқтатады немесе дәлелді бас тарту береді (8-бап, 7-тармақ).', 'Оператор в течение 15 рабочих дней прекращает обработку или даёт мотивированный отказ (п. 7 ст. 8).', 'The operator stops processing within 15 working days or gives a reasoned refusal (Art. 8(7)).') },
      { icon: 'scale', title: X('Қорғау', 'Защита', 'Protection'), text: X('Құқықтарыңызды қорғау, оның ішінде зиянды өтеу; шағымдану заңда белгіленген тәртіппен (24, 30-баптар).', 'Защита прав, в том числе возмещение вреда; обжалование — в порядке, установленном законом (ст. 24, 30).', 'Protection of your rights, including compensation; appeals as set by law (Arts. 24, 30).') },
    ], { cols: 3 });
    const exercise = ui.steps([
      { title: X('Өтініш жазыңыз', 'Напишите запрос', 'Write to us'), text: mailOk
        ? X(`<a href="${href('feedback')}">Кері байланыс нысаны</a> арқылы, электрондық пошта (${ui.schoolEmail()}) арқылы немесе мектепке жазбаша.`, `Через <a href="${href('feedback')}">форму обратной связи</a>, по электронной почте (${ui.schoolEmail()}) или письменно в школу.`, `Via the <a href="${href('feedback')}">feedback form</a>, by e-mail (${ui.schoolEmail()}) or in writing to the school.`)
        : X(`<a href="${href('feedback')}">Кері байланыс нысаны</a> арқылы немесе мектепке жазбаша.`, `Через <a href="${href('feedback')}">форму обратной связи</a> или письменно в школу.`, `Via the <a href="${href('feedback')}">feedback form</a> or in writing to the school.`) },
      { title: X('Нені сұрайтыныңызды көрсетіңіз', 'Укажите, что вы просите', 'Say what you ask for'), text: X('Танысу, түзету, жою немесе келісімді кері қайтару; қай нысан арқылы және шамамен қашан деректер жіберілгенін жазыңыз.', 'Ознакомление, исправление, удаление или отзыв согласия; через какую форму и примерно когда были отправлены данные.', 'Access, correction, deletion or withdrawal; which form you used and roughly when.') },
      { title: X('Жауап алыңыз', 'Получите ответ', 'Get an answer'), text: X('Мектеп заңда белгіленген мерзімде жауап береді; бас тартқан жағдайда дәлелді жауап береді.', 'Школа отвечает в сроки, установленные законом; при отказе — мотивированно.', 'The school answers within the legal time limits; any refusal is reasoned.') },
    ]);

    const docs = ui.docList(docsByGroup('privacy'));
    const version = ui.callout({
      type: 'warn', icon: 'info',
      title: X('Саясаттың редакциясы', 'Редакция политики', 'Policy version'),
      text: X(`Осы беттегі редакция: ${fmt.date('2026-09-24')}. Ол сайттың нақты жұмысын сипаттайды. Мектеп басшылығы бекіткен «Дербес деректерді қорғау туралы ереже» PDF түрінде жүктеледі; өзгерістер осы бетте күні көрсетіліп жарияланады.`, `Редакция на этой странице: ${fmt.date('2026-09-24')}. Она описывает фактическую работу сайта. Утверждённое руководством школы «Положение о защите персональных данных» будет загружено в PDF; изменения публикуются на этой странице с датой.`, `Version on this page: ${fmt.date('2026-09-24')}. It describes how the site actually works. The school’s approved “Personal data protection policy” will be uploaded as a PDF; changes are published here with their date.`),
    });

    const related = ui.linkList([
      { href: adiletUrl(pd, lang), icon: 'scale', label: X('«Дербес деректер және оларды қорғау туралы» Заң', 'Закон «О персональных данных и их защите»', 'Law “On Personal Data and Their Protection”'), note: X('21.05.2013 ж. № 94-V — adilet.zan.kz', 'от 21.05.2013 № 94-V — adilet.zan.kz', '21.05.2013, No. 94-V — adilet.zan.kz') },
      { href: href('feedback'), icon: 'chat', label: X('Кері байланыс', 'Обратная связь', 'Feedback') },
      { href: href('accessibility'), icon: 'accessible', label: X('Сайттың қолжетімділігі', 'Доступность сайта', 'Site accessibility') },
      { href: href('legislation'), icon: 'book', label: X('Нормативтік құқықтық актілер', 'Нормативные правовые акты', 'Legislation') },
    ]);

    const toc = ui.toc([
      { id: 'operator', label: X('Оператор', 'Оператор', 'Operator') },
      { id: 'collect', label: X('Қандай деректер жиналады', 'Какие данные собираются', 'What we collect') },
      { id: 'storage', label: X('Браузер және сыртқы қызметтер', 'Браузер и внешние сервисы', 'Browser and third parties') },
      { id: 'rules', label: X('Өңдеу қағидаттары', 'Принципы обработки', 'Processing principles') },
      { id: 'rights', label: X('Сіздің құқықтарыңыз', 'Ваши права', 'Your rights') },
      { id: 'policy-docs', label: X('Құжаттар және редакция', 'Документы и редакция', 'Documents and version') },
    ]);

    return [
      ui.split({
        ratio: '3:2', align: 'center',
        left: `${ui.eyebrow(X('Дербес деректер', 'Персональные данные', 'Personal data'))}<h2 class="sec__title">${L(X('Деректеріңізге ұқыпты қараймыз', 'Бережно относимся к вашим данным', 'We take care of your data'))}</h2>${ui.lead(X('Бұл саясат «Керемет» мектебінің сайты қандай дербес деректерді, не үшін жинайтынын, оларды қалай қорғайтынын және сіз өз құқықтарыңызды қалай жүзеге асыра алатыныңызды түсіндіреді.', 'Эта политика объясняет, какие персональные данные и зачем собирает сайт школы «Керемет», как они защищаются и как вы можете реализовать свои права.', 'This policy explains what personal data Keremet School’s website collects and why, how it is protected and how you can exercise your rights.'))}`,
        right: ui.panel({ theme: 'hero', cls: 'dx-shield', body: `${ui.icon('lock', { size: 44 })}<p class="dx-shield__t">${L(X('Тек қажеттісі. Тек келісіммен.', 'Только нужное. Только с согласия.', 'Only what is needed. Only with consent.'))}</p><p class="dx-shield__s">${L(X('Заң № 94-V', 'Закон № 94-V', 'Law No. 94-V'))}</p>` }),
      }),
      summary,
      ui.split({ ratio: '1:2', left: `<div class="dx-sticky">${toc}</div>`, right: ui.section({ id: 'operator', eyebrow: X('Кім өңдейді', 'Кто обрабатывает', 'Who processes'), title: X('Дербес деректер операторы', 'Оператор персональных данных', 'Personal data operator'), body: operator }) }),
      ui.section({ id: 'collect', eyebrow: X('Нысандар', 'Формы', 'Forms'), title: X('Қандай деректер жиналады және не үшін', 'Какие данные собираются и зачем', 'What we collect and why'), body: collect + howSent }),
      ui.section({ id: 'storage', eyebrow: X('Техникалық', 'Технически', 'Technical'), title: X('Браузер және сыртқы қызметтер', 'Браузер и внешние сервисы', 'Your browser and third-party services'), body: ui.split({ ratio: '3:2', align: 'start', left: storage, right: storageNote }) + `<h3 class="dx-subh">${L(X('Сыртқы қызметтер', 'Внешние сервисы', 'Third-party services'))}</h3>` + third }),
      ui.section({ id: 'rules', tone: 'tint', eyebrow: X('Заң талаптары', 'Требования закона', 'What the law requires'), title: X('Өңдеу қағидаттары', 'Принципы обработки', 'Processing principles'), body: principles }),
      ui.section({ id: 'rights', eyebrow: X('Заңның 24-бабы', 'Статья 24 Закона', 'Article 24'), title: X('Сіздің құқықтарыңыз', 'Ваши права', 'Your rights'), body: rights + `<h3 class="dx-subh">${L(X('Құқығыңызды қалай пайдалануға болады', 'Как воспользоваться правами', 'How to exercise your rights'))}</h3>` + exercise }),
      ui.section({ id: 'policy-docs', title: X('Құжаттар және редакция', 'Документы и редакция', 'Documents and version'), body: docs + version }),
      ui.section({ title: X('Пайдалы сілтемелер', 'Полезные ссылки', 'Useful links'), body: related }),
    ].join('\n');
  },
};
