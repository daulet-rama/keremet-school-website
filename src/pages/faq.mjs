// FAQ — ORDER-114 §M item 84. Answers ONLY from verified school facts (school.mjs / SCHOOL-FACTS.md) and official rules.
// Admission rules: order of the Minister of Education and Science № 564 of 12.10.2018 (V1800017553), pp. 1, 8, 10, 11, 17 (p. 17 as
// amended by order № 54-НҚ of 03.03.2026; re-read 25.09.2026) —
// text read on zakon.uchet.kz (mirror of adilet.zan.kz) on 24.09.2026; visitors are pointed to adilet for the current edition.
export default {
  slug: 'faq',
  group: 'feedback',
  order: 40,
  title: { kz: 'Сұрақ–жауап', ru: 'Вопрос–ответ', en: 'FAQ' },
  description: {
    kz: 'Ата-аналардың жиі қоятын сұрақтары: 1-сыныпқа қабылдау жасы мен құжаттары, оқыту тілдері, үйірмелер, ұзартылған күн, тамақтану, байланыс.',
    ru: 'Частые вопросы родителей: возраст и документы для приёма в 1 класс, языки обучения, кружки, продлёнка, питание, связь со школой.',
    en: 'Parents’ frequent questions: grade 1 admission age and documents, languages of instruction, clubs, extended day, meals, contacting us.',
  },
  lead: {
    kz: 'Жиі қойылатын сұрақтарға қысқа жауаптар — мектеп жариялаған деректер мен ресми қағидалар негізінде; расталмаған мәліметтер белгіленген.',
    ru: 'Короткие ответы на частые вопросы — по данным школы и официальным правилам; неподтверждённое отмечено.',
    en: 'Short answers to common questions — based on the school’s own information and official rules; anything unconfirmed is marked.',
  },
  styles: ['feedback'],
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, { ui, S, L, t, href, fmt }) {
    const X = (kz, ru, en) => ({ kz, ru, en });
    const c = S.contacts;
    const R564 = { kz: 'https://adilet.zan.kz/kaz/docs/V1800017553', ru: 'https://adilet.zan.kz/rus/docs/V1800017553', en: 'https://adilet.zan.kz/rus/docs/V1800017553' }[lang];
    const rules = X('Қабылдаудың үлгілік қағидалары (ҚР БҒМ 12.10.2018 № 564 бұйрығы)', 'Типовые правила приёма (приказ МОН РК от 12.10.2018 № 564)', 'Standard Admission Rules (Order of the Ministry of Education and Science No. 564 of 12.10.2018)');
    const rulesLink = ui.extLink(R564, rules);
    // Russian needs the dative after «По» ("По Типовым правилам приёма …")
    const rulesLinkDat = ui.extLink(R564, 'Типовым правилам приёма (приказ МОН РК от 12.10.2018 № 564)');
    const a = (html) => `<p>${L(html)}</p>`;
    const more = (slug, label) => `<p><a class="fb-more" href="${href(slug)}">${L(label)}${ui.icon('arrow-right', { size: 16 })}</a></p>`;
    const list = (items) => `<ul class="bullets">${items.map((x) => `<li>${L(x)}</li>`).join('')}</ul>`;
    const conf = ` ${ui.badge(t('unconfirmed'), 'warn')}`;

    // ---------------------------------------------------------------- categories
    const cats = [
      {
        id: 'admission', icon: 'graduation', title: X('Қабылдау', 'Приём в школу', 'Admission'),
        items: [
          { id: 'q-age', q: X('Бала 1-сыныпқа неше жастан қабылданады?', 'С какого возраста принимают в 1 класс?', 'At what age can a child start grade 1?'),
            a: a(X(`${rulesLink} бойынша (8-тармақ) бірінші сыныпқа алты жастағы балалар және ағымдағы күнтізбелік жылы алты жасқа толатын балалар қабылданады.`, `По ${rulesLinkDat} (п. 8) в первый класс принимаются дети шести лет и дети, которым в текущем календарном году исполняется шесть лет.`, `Under the ${rulesLink} (para. 8), grade 1 admits children aged six and children who turn six during the current calendar year.`)) + more('admission', X('Қабылдау туралы толығырақ', 'Подробнее о приёме', 'More about admission')) },
          { id: 'q-docs', q: X('Қабылдау үшін қандай құжаттар керек?', 'Какие документы нужны для приёма?', 'Which documents are needed?'),
            a: a(X('Үлгілік қағидалардың 11-тармағы бойынша:', 'По п. 11 Типовых правил:', 'Under para. 11 of the Standard Rules:')) + list([
              X('ата-ананың (заңды өкілдің) белгіленген нысандағы өтініші;', 'заявление родителя (законного представителя) по установленной форме;', 'an application from the parent (legal representative) on the prescribed form;'),
              X('баланың туу туралы куәлігі (қағаз түрінде тапсырғанда салыстыру үшін көрсетіледі);', 'свидетельство о рождении ребёнка (предъявляется для сверки при подаче на бумаге);', 'the child’s birth certificate (shown for checking when applying on paper);'),
              X('ата-ананың жеке куәлігі (салыстыру үшін көрсетіледі);', 'удостоверение личности родителя (предъявляется для сверки);', 'the parent’s ID card (shown for checking);'),
              X('№ 065/е «Иммундау паспорты» және № 052-2/е «Бала денсаулығының паспорты» медициналық анықтамалары;', 'медицинские справки формы № 065/у «Паспорт иммунизации» и № 052-2/у «Паспорт здоровья ребёнка»;', 'medical forms No. 065/у “Immunisation passport” and No. 052-2/у “Child health passport”;'),
              X('баланың 3×4 см фотосуреті.', 'фотография ребёнка 3×4 см.', 'a 3×4 cm photo of the child.'),
            ]) + ui.note(X(`Қағидаларға өзгерістер енгізілуі мүмкін — өзекті редакциясын ${ui.extLink(R564, 'adilet.zan.kz')} сайтынан тексеріңіз.`, `В правила могут вноситься изменения — актуальную редакцию проверяйте на ${ui.extLink(R564, 'adilet.zan.kz')}.`, `The rules may be amended — check the current version on ${ui.extLink(R564, 'adilet.zan.kz')}.`)) },
          { id: 'q-dates', q: X('1-сыныпқа құжаттар қашан қабылданады?', 'Когда принимают документы в 1 класс?', 'When are grade 1 documents accepted?'),
            a: a(X('Үлгілік қағидалардың 10-тармағы бойынша бірінші сыныпқа құжаттар ағымдағы жылдың <strong>1 сәуірінен 31 тамызына</strong> дейін қабылданады.', 'По п. 10 Типовых правил документы в первый класс принимаются <strong>с 1 апреля по 31 августа</strong> текущего года.', 'Under para. 10 of the Standard Rules, grade 1 documents are accepted <strong>from 1 April to 31 August</strong> of the current year.')) },
          { id: 'q-online', q: X('Өтінішті онлайн беруге бола ма?', 'Можно ли подать заявление онлайн?', 'Can I apply online?'),
            a: a(X(`Қағидалар «Білім беру ұйымдарына құжаттарды қабылдау және оқуға қабылдау» мемлекеттік қызметін ${ui.extLink('https://egov.kz/', 'egov.kz')} порталы арқылы да алуды көздейді. Мектепке алдын ала өтінімді сайттағы <a href="${href('admission')}">«Қабылдау»</a> бетінен қалдыруға немесе WhatsApp-қа жазуға болады.`, `Правила предусматривают получение государственной услуги «Приём документов и зачисление в организации образования» в том числе через портал ${ui.extLink('https://egov.kz/', 'egov.kz')}. Предварительную заявку в школу можно оставить на странице <a href="${href('admission')}">«Приём»</a> или написать в WhatsApp.`, `The rules provide for the public service “Acceptance of documents and enrolment in education organisations”, including via the ${ui.extLink('https://egov.kz/', 'egov.kz')} portal. You can leave a preliminary request on our <a href="${href('admission')}">Admission</a> page or message us on WhatsApp.`)) + ui.pending(lang, X('Мектептің бұл қызметті egov.kz порталы арқылы көрсететін-көрсетпейтіні нақтылануда.', 'Уточняется, оказывает ли школа эту услугу через портал egov.kz.', 'Whether the school provides this service through egov.kz is being confirmed.')) },
          { id: 'q-zero', q: X('0-сыныпқа (мектепалды даярлыққа) қабылдайсыздар ма?', 'Есть ли 0 класс (предшкольная подготовка)?', 'Is there a grade 0 (pre-school year)?'),
            a: a(X(`Мектептің Instagram парақшасында мектеп 0–6 сыныптарға арналғаны көрсетілген${conf}. 0-сыныпқа қабылдау шарттары мен бос орындар туралы телефонмен сұраңыз: <a href="tel:${c.phone.tel}">${c.phone.display}</a>.`, `В профиле школы в Instagram указано, что школа рассчитана на 0–6 классы${conf}. Об условиях приёма в 0 класс и свободных местах спросите по телефону <a href="tel:${c.phone.tel}">${c.phone.display}</a>.`, `The school’s Instagram profile says it serves grades 0–6${conf}. Ask about grade 0 admission terms and places by phone: <a href="tel:${c.phone.tel}">${c.phone.display}</a>.`)) },
          { id: 'q-transfer', q: X('Басқа мектептен ауысуға бола ма?', 'Можно ли перевестись из другой школы?', 'Can my child transfer from another school?'),
            a: a(X('Иә. Үлгілік қағидаларда «Бастауыш, негізгі орта, жалпы орта білім беру ұйымдары арасында балаларды ауыстыру үшін құжаттарды қабылдау» мемлекеттік қызметі қарастырылған. 17-тармаққа сәйкес ауыстыруға құжаттар <strong>каникул кезеңінде</strong> қабылданады; одан тыс уақытта тек сол тармақта аталған жағдайларда қабылданады (заңды күшіне енген сот шешімі, басқа мекенжайға көшу, Қазақстаннан тыс жерге кету, зорлық-зомбылыққа немесе буллингке ұшыраған не оның куәгері болған балалар). Бос орын бар-жоғын алдымен мектептен сұраңыз.', 'Да. Типовые правила предусматривают государственную услугу «Приём документов для перевода детей между организациями начального, основного среднего, общего среднего образования». По п. 17 документы на перевод принимаются <strong>в каникулярный период</strong>; в другое время — только в случаях, перечисленных в этом пункте (вступившее в силу решение суда, переезд, выезд за пределы Казахстана, перевод детей, подвергшихся насилию или травле (буллингу) либо ставших их свидетелями). Сначала уточните в школе наличие свободных мест.', 'Yes. The Standard Rules provide the public service “Acceptance of documents for transferring children between primary, lower secondary and general secondary education organisations”. Under para. 17, transfer documents are accepted <strong>during the school holidays</strong>; at other times only in the cases listed there (a court decision in force, moving home, leaving Kazakhstan, or a child who suffered or witnessed violence or bullying). First check with us whether places are available.')) + more('contingent', X('Контингент және бос орындар', 'Контингент и свободные места', 'Pupil numbers and free places')) },
          { id: 'q-fee', q: X('Оқу ақылы ма?', 'Обучение платное?', 'Is tuition paid?'),
            a: a(X('12.08.2025 жарияланған қабылдау хабарландыруында мектеп қазақ және орыс тілдерінде <strong>тегін оқыту</strong> туралы жазған. Бұл шарттың негізі мен нақты талаптары мектеппен нақтылануда.', 'В объявлении о приёме от 12.08.2025 школа сообщила о <strong>бесплатном обучении</strong> на казахском и русском языках. Основание и точные условия уточняются у школы.', 'In its admission announcement of 12.08.2025 the school announced <strong>free tuition</strong> in Kazakh and Russian. The basis and exact terms are being confirmed.')) + more('tuition', X('Оқу ақысы және шарт', 'Оплата и договор', 'Tuition and contract')) },
        ],
      },
      {
        id: 'learning', icon: 'book', title: X('Оқу', 'Обучение', 'Learning'),
        items: [
          { id: 'q-lang', q: X('Оқыту қай тілдерде жүргізіледі?', 'На каких языках ведётся обучение?', 'What are the languages of instruction?'),
            a: a(X('Қазақ және орыс тілдерінде. Мектеп тілдерді тереңдетіп оқытуды да ұсынады.', 'На казахском и русском языках. Школа также предлагает углублённое изучение языков.', 'Kazakh and Russian. The school also offers in-depth language study.')) },
          { id: 'q-grades', q: X('Мектепте қай сыныптар бар?', 'Какие классы есть в школе?', 'Which grades does the school have?'),
            a: a(X(`Мектеп парақшасы бойынша — ${S.grades.from}–${S.grades.to} сыныптар${conf}. Лицензия (№ ${S.licence.current.number}) бастауыш, негізгі орта және жалпы орта білім беруді қамтиды.`, `По данным страницы школы — ${S.grades.from}–${S.grades.to} классы${conf}. Лицензия (№ ${S.licence.current.number}) охватывает начальное, основное среднее и общее среднее образование.`, `Per the school’s profile — grades ${S.grades.from}–${S.grades.to}${conf}. The licence (No. ${S.licence.current.number}) covers primary, lower and upper secondary education.`)) },
          { id: 'q-programmes', q: X('Қандай бағдарламалар мен әдістемелер қолданылады?', 'Какие программы и методики используются?', 'Which programmes and methods are used?'),
            a: a(X('Қабылдау хабарландыруында (12.08.2025) мектеп мыналарды атаған:', 'В объявлении о приёме (12.08.2025) школа назвала:', 'The admission announcement (12.08.2025) lists:')) + ui.chips(S.programmes.map((p) => ({ icon: p.icon, label: p.label }))) + more('curriculum', X('Оқу жоспары және бағдарламалар', 'Учебный план и программы', 'Curriculum and programmes')) },
          { id: 'q-schedule', q: X('Сабақ кестесін қайдан көруге болады?', 'Где посмотреть расписание уроков?', 'Where can I see the timetable?'),
            a: a(X('Қоңырау кестесі, сабақ кестесі және академиялық күнтізбе «Сабақ кестесі» бетінде жарияланады.', 'Расписание звонков, уроков и академический календарь публикуются на странице «Расписание».', 'The bell schedule, timetable and academic calendar are published on the Schedule page.')) + more('schedule', X('Сабақ кестесі', 'Расписание', 'Schedule')) },
        ],
      },
      {
        id: 'day', icon: 'sun', title: X('Мектептегі күн', 'Школьный день', 'The school day'),
        items: [
          { id: 'q-extended', q: X('Ұзартылған күн тобы бар ма?', 'Есть ли продлённый день?', 'Is there an extended day?'),
            a: a(X('Иә. Мектептің Instagram парақшасында «ұзартылған күн» көрсетілген, ал 12.08.2025 жарияланған қабылдау хабарландыруында «толық күн мектебі және қосымша сабақтар» аталған. Кестесі мен шарттары нақтылануда.', 'Да. В профиле школы в Instagram указан «продлённый день», а в объявлении о приёме от 12.08.2025 названы «школа полного дня и дополнительные занятия». График и условия уточняются.', 'Yes. The school’s Instagram profile lists an extended day, and the admission announcement of 12.08.2025 mentions a full-day school with extra lessons. Hours and terms are being confirmed.')) },
          { id: 'q-meals', q: X('Балалар мектепте тамақтана ма?', 'Кормят ли детей в школе?', 'Are meals provided?'),
            a: a(X('Мектеп парақшасында «ыстық тамақ» көрсетілген. Мәзір, жеткізуші және тамақтану сапасын бақылау туралы мәліметтер «Мектептегі тамақтану» бетінде жарияланады.', 'На странице школы указано «горячее питание». Меню, поставщик и контроль качества питания публикуются на странице «Школьное питание».', 'The school’s profile lists hot meals. The menu, supplier and quality control are published on the School meals page.')) + more('meals', X('Мектептегі тамақтану', 'Школьное питание', 'School meals')) },
          { id: 'q-clubs', q: X('Қандай үйірмелер бар және олар тегін бе?', 'Какие есть кружки и платные ли они?', 'What clubs are there, and are they free?'),
            a: a(X(`Мектептің Instagram парақшасында «тегін үйірмелер» көрсетілген. Нақты үйірмелер тізімі мен кестесі әлі жарияланған жоқ${conf}. 12.08.2025 жарияланған қабылдау хабарландыруында мектеп бағдарлама бағыттарын атаған: шешендік өнер мен қаржылық сауаттылық, спорт үйірмелері мен бағдарламалау, робототехника және жасанды интеллект.`, `В профиле школы в Instagram указаны «бесплатные кружки». Точный список кружков и их расписание пока не опубликованы${conf}. В объявлении о приёме от 12.08.2025 школа назвала направления программы: ораторское мастерство и финансовая грамотность, спортивные секции и программирование, робототехника и искусственный интеллект.`, `The school’s Instagram profile mentions free clubs. The actual list of clubs and their timetable have not been published yet${conf}. The admission announcement of 12.08.2025 names these programme areas: public speaking and financial literacy, sports clubs and programming, robotics and AI.`)) + more('clubs', X('Үйірмелер және кестесі', 'Кружки и расписание', 'Clubs and schedule')) },
          { id: 'q-help', q: X('Бала қиын жағдайға тап болса, қайда жүгінуге болады?', 'Куда обратиться, если ребёнок попал в трудную ситуацию?', 'Where can a child get help in a difficult situation?'),
            a: a(X('Алдымен сынып жетекшісіне немесе мектеп әкімшілігіне хабарласыңыз. Тәулік бойы тегін желілер: <strong>111</strong> — балалар құқықтарын қорғау байланыс орталығы, <strong>150</strong> — балалар мен жастарға арналған сенім телефоны. Шұғыл жағдайда — <strong>112</strong>.', 'Сначала свяжитесь с классным руководителем или администрацией школы. Бесплатные линии: <strong>111</strong> — контакт-центр по защите прав детей, <strong>150</strong> — телефон доверия для детей и молодёжи. В экстренной ситуации — <strong>112</strong>.', 'First contact the class teacher or the school office. Free lines: <strong>111</strong> — children’s rights contact centre, <strong>150</strong> — helpline for children and young people. In an emergency — <strong>112</strong>.')) + more('psychology', X('Психологиялық қызмет', 'Психологическая служба', 'Psychological support')) },
        ],
      },
      {
        id: 'contact', icon: 'chat', title: X('Байланыс және өтініштер', 'Связь и обращения', 'Contact and appeals'),
        items: [
          { id: 'q-contact', q: X('Мектеппен қалай байланысуға болады?', 'Как связаться со школой?', 'How do I contact the school?'),
            a: a(X(`Телефон және WhatsApp: <a href="tel:${c.phone.tel}">${c.phone.display}</a>. Мекенжай: ${S.addresses.actual.postcode}, ${L(S.addresses.actual.text)}. Жұмыс уақыты: ${L(c.hours)}${conf}.`, `Телефон и WhatsApp: <a href="tel:${c.phone.tel}">${c.phone.display}</a>. Адрес: ${S.addresses.actual.postcode}, ${L(S.addresses.actual.text)}. Время работы: ${L(c.hours)}${conf}.`, `Phone and WhatsApp: <a href="tel:${c.phone.tel}">${c.phone.display}</a>. Address: ${S.addresses.actual.postcode}, ${L(S.addresses.actual.text)}. Hours: ${L(c.hours)}${conf}.`)) + more('contacts', X('Барлық байланыстар және карта', 'Все контакты и карта', 'All contacts and map')) },
          { id: 'q-appeal', q: X('Өтінішке қанша уақытта жауап береді?', 'Как быстро ответят на обращение?', 'How soon will an appeal be answered?'),
            a: a(X(`Әкімшілік рәсімдік-процестік кодекс бойынша арыз тіркелген күннен бастап 15 жұмыс күні ішінде (76-бап), шағым 20 жұмыс күні ішінде (99-бап) қаралады. Бұл мерзімдер әкімшілік рәсімдерге, мысалы, мектепке қабылдау сияқты мемлекеттік қызметке қолданылады; мектептің өтініштерді қарау жөніндегі ішкі тәртібі бекітілгеннен кейін жарияланады. Жазбаша ақпарат сұрауына «Ақпаратқа қол жеткізу туралы» Заң бойынша 15 күнтізбелік күн ішінде жауап беріледі. Толығырақ: <a href="${href('feedback')}#procedure">қарау тәртібі мен мерзімдері</a>.`, `По Административному процедурно-процессуальному кодексу заявление рассматривается в течение 15 рабочих дней со дня регистрации (ст. 76), жалоба — 20 рабочих дней (ст. 99). Сроки АППК применяются к административным процедурам, например к государственной услуге приёма в школу; внутренний порядок рассмотрения обращений школы будет опубликован после утверждения. На письменный запрос информации по Закону «О доступе к информации» отвечают в течение 15 календарных дней. Подробнее: <a href="${href('feedback')}#procedure">порядок и сроки рассмотрения</a>.`, `Under the Administrative Procedural Code an application is considered within 15 working days of registration (Art. 76) and a complaint within 20 working days (Art. 99). These limits apply to administrative procedures, such as the public service of school admission; the school’s internal procedure for appeals will be published once approved. A written information request is answered within 15 calendar days under the Law on Access to Information. More: <a href="${href('feedback')}#procedure">procedure and time limits</a>.`)) + more('feedback', X('Өтініш жолдау', 'Направить обращение', 'Send an appeal')) },
          { id: 'q-director', q: X('Директормен қалай кездесуге болады?', 'Как попасть на приём к директору?', 'How can I meet the director?'),
            a: a(X(`Мектеп директоры — ${L(S.legal.director.name)}. Жеке қабылдау кестесі нақтылануда; сұрағыңызды директор блогы арқылы жазуға болады.`, `Директор школы — ${L(S.legal.director.name)}. График личного приёма уточняется; вопрос можно задать через блог директора.`, `The director is ${L(S.legal.director.name)}. Reception hours are being confirmed; you can ask a question through the director’s blog.`)) + more('director-blog', X('Директор блогы', 'Блог директора', 'Director’s blog')) },
        ],
      },
      {
        id: 'site', icon: 'doc', title: X('Құжаттар және сайт', 'Документы и сайт', 'Documents and the website'),
        items: [
          { id: 'q-licence', q: X('Мектептің лицензиясы бар ма?', 'Есть ли у школы лицензия?', 'Is the school licensed?'),
            a: a(X(`Иә. Білім беру қызметіне № ${S.licence.current.number} лицензия ${fmt.date(S.licence.current.date)} берілген, мерзімсіз (алғашқы лицензия — ${fmt.date(S.licence.current.firstIssued)}). Оны ${ui.extLink(S.licence.registry, 'elicense.kz')} тізілімінен тексеруге болады.`, `Да. Лицензия на образовательную деятельность № ${S.licence.current.number} выдана ${fmt.date(S.licence.current.date)}, бессрочная (первая лицензия — ${fmt.date(S.licence.current.firstIssued)}). Её можно проверить в реестре ${ui.extLink(S.licence.registry, 'elicense.kz')}.`, `Yes. Education licence No. ${S.licence.current.number} was issued on ${fmt.date(S.licence.current.date)} with no expiry (first licence: ${fmt.date(S.licence.current.firstIssued)}). You can check it in the ${ui.extLink(S.licence.registry, 'elicense.kz')} registry.`)) + more('license', X('Лицензия көшірмелері', 'Сканы лицензии', 'Licence scans')) },
          { id: 'q-docs-site', q: X('Мектеп құжаттарын қайдан табуға болады?', 'Где найти документы школы?', 'Where are the school’s documents?'),
            a: a(X('«Құжаттар» бөлімінде. Әр құжаттың пішімі, көлемі және күні көрсетілген; әлі жүктелмеген құжаттар «Құжат жүктеледі» деп белгіленген.', 'В разделе «Документы». У каждого документа указаны формат, размер и дата; ещё не загруженные отмечены «Документ будет загружен».', 'In the Documents section. Each document shows its format, size and date; ones not yet uploaded are marked “Document will be uploaded”.')) + more('documents', X('Құжаттар', 'Документы', 'Documents')) },
          { id: 'q-a11y', q: X('Көру қабілеті нашар адамдарға арналған нұсқа қалай жұмыс істейді?', 'Как работает версия для слабовидящих?', 'How does the low-vision version work?'),
            a: a(X(`Әр беттің жоғарғы жолағындағы «${t('a11y.button')}» батырмасын басыңыз. Панельде қаріп өлшемін (100, 130, 160%), түс схемасын, әріп және жол аралығын таңдап, суреттерді өшіруге болады. Баптаулар браузерде сақталады.`, `Нажмите «${t('a11y.button')}» в верхней строке любой страницы. На панели можно выбрать размер шрифта (100, 130, 160%), цветовую схему, интервалы и отключить изображения. Настройки сохраняются в браузере.`, `Press “${t('a11y.button')}” in the top bar of any page. The panel lets you choose font size (100, 130, 160%), colour scheme and spacing, and turn images off. Settings are saved in your browser.`)) + `<p><button type="button" class="btn btn--ghost btn--s" data-a11y-open>${ui.icon('eye', { size: 18 })}<span>${t('a11y.button')}</span></button></p>` + more('accessibility', X('Толық нұсқаулық', 'Подробная инструкция', 'Full guide')) },
          { id: 'q-langs', q: X('Сайт қай тілдерде жұмыс істейді?', 'На каких языках работает сайт?', 'Which languages is the site in?'),
            a: a(X('Қазақ, орыс және ағылшын тілдерінде. Тілді ауыстырғанда сол бет ашылады.', 'На казахском, русском и английском. При смене языка открывается та же страница.', 'Kazakh, Russian and English. Switching language keeps you on the same page.')) },
        ],
      },
    ];

    // ---------------------------------------------------------------- category navigator
    const nav = `<ul class="fb-cats" role="list">${cats.map((cat, i) => `<li><a class="fb-cat" href="#${cat.id}"><span class="fb-cat__n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><span class="fb-cat__ico">${ui.icon(cat.icon, { size: 24 })}</span><span class="fb-cat__t">${L(cat.title)}</span><span class="fb-cat__c">${L(X(`${cat.items.length} сұрақ`, `${cat.items.length} ${cat.items.length < 5 ? 'вопроса' : 'вопросов'}`, `${cat.items.length} questions`))}</span></a></li>`).join('')}</ul>`;

    const sections = cats.map((cat, i) => ui.section({
      id: cat.id,
      cls: 'fb-faqsec',
      body: ui.split({
        ratio: '1:2',
        left: `<div class="fb-faqhead panel pattern" data-theme="chemistry"><span class="fb-faqhead__n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><span class="fb-faqhead__ico">${ui.icon(cat.icon, { size: 30 })}</span><h2 class="fb-faqhead__t" id="${cat.id}-title">${L(cat.title)}</h2><p class="fb-faqhead__c">${L(X(`${cat.items.length} сұрақ`, `${cat.items.length} ${cat.items.length < 5 ? 'вопроса' : 'вопросов'}`, `${cat.items.length} questions`))}</p></div>`,
        right: ui.accordion(cat.items.map((it, j) => ({ id: it.id, q: it.q, a: it.a, open: i === 0 && j === 0 }))),
      }),
    }));

    const realQs = ui.pending({
      title: X('Бөлім келушілердің сұрақтары бойынша толықтырылады', 'Раздел пополняется по вопросам посетителей', 'This section grows with visitors’ questions'),
      note: X('Сайт арқылы, телефонмен және директор блогына келіп түскен нақты сұрақтар мектеп әкімшілігі жауап бергеннен кейін осында қосылады.', 'Реальные вопросы, поступившие через сайт, по телефону и в блог директора, будут добавляться сюда после ответа администрации школы.', 'Real questions received via the site, by phone and through the director’s blog will be added here once the school has answered them.'),
    });

    return [
      nav,
      ...sections,
      realQs,
      ui.banner({ theme: 'chemistry', icon: 'chat', eyebrow: X('Жауап таппадыңыз ба?', 'Не нашли ответ?', 'Didn’t find an answer?'), title: X('Сұрағыңызды бізге жіберіңіз', 'Задайте свой вопрос', 'Send us your question'), text: X('Директорға сұрақ қойыңыз немесе ресми өтініш жолдаңыз — жауап сіз көрсеткен байланысқа келеді.', 'Спросите директора или направьте официальное обращение — ответ придёт на указанный вами контакт.', 'Ask the director or send a formal appeal — the answer will come to the contact you give.'), href: href('director-blog') + '#ask', label: X('Сұрақ қою', 'Задать вопрос', 'Ask a question') }),
      ui.section({ title: t('nav.inSection'), body: ui.linkList([
        { href: href('feedback'), icon: 'chat', label: X('Өтініш жолдау', 'Обращения', 'Appeals & feedback') },
        { href: href('director-blog'), icon: 'user', label: X('Директор блогы', 'Блог директора', 'Director’s blog') },
        { href: href('contacts'), icon: 'pin', label: X('Байланыс', 'Контакты', 'Contacts') },
        { href: href('surveys'), icon: 'users', label: X('Сауалнамалар', 'Анкетирование', 'Surveys') },
      ]) }),
    ].join('\n');
  },
};
