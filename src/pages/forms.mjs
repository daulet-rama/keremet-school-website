// Application templates — ORDER-114 item 40: samples for admission, transfer, certificate, duplicate.
// Files are pending (file:null) until the school uploads its approved templates; official e-services on egov.kz.
export default {
  slug: 'forms',
  group: 'admission',
  order: 30,
  styles: ['staff-admission'],
  title: { kz: 'Өтініш үлгілері', ru: 'Образцы заявлений', en: 'Application forms' },
  description: {
    kz: 'Өтініш үлгілері: мектепке қабылдау, ауысу, анықтама алу, құжат телнұсқасы. egov.kz-тегі ресми электрондық қызметтерге сілтемелер.',
    ru: 'Образцы заявлений: приём в школу, перевод, справка, дубликат документа. Ссылки на официальные электронные услуги egov.kz.',
    en: 'Application templates: admission, transfer, certificates and duplicate documents, plus links to the official e-services on egov.kz.',
  },
  lead: {
    kz: 'Өтінішті қолмен толтырып мектепке әкелуге немесе egov.kz арқылы электрондық түрде беруге болады. Мұнда екі жолдың да үлгілері мен сілтемелері бар.',
    ru: 'Заявление можно заполнить от руки и принести в школу или подать в электронном виде через egov.kz. Здесь — образцы и ссылки для обоих способов.',
    en: 'You can fill in an application by hand and bring it to school, or submit it online via egov.kz. Here are templates and links for both.',
  },
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, { ui, S, L, t, href, docById }) {
    const X = (kz, ru, en) => ({ kz, ru, en });
    const eg = (path) => `https://egov.kz/cms/${{ kz: 'kk', ru: 'ru', en: 'en' }[lang]}/services/${path}`;
    const R564 = `https://adilet.zan.kz/${lang === 'kz' ? 'kaz' : 'rus'}/docs/V1800017553`;

    const admissionDoc = docById('application-template');
    const OQU = 'https://oqu.edu.kz/';
    const svc = (href, label) => ui.button({ href, label, kind: 'ghost', size: 's', iconLeft: 'globe' });
    const atSchool = (txt) => `<p class="sa-form__atschool">${ui.icon('school', { size: 18 })}<span>${L(txt)}</span></p>`;
    // TODO(school): click-test every egov/OQU link in a browser (egov.kz is a JS app; deep links could not be verified server-side).
    const forms = [
      { id: 'admission', icon: 'school', tag: X('Қабылдау', 'Приём', 'Admission'),
        doc: { ...admissionDoc, note: X('1-сыныпқа және басқа сыныптарға қабылдау үшін.', 'Для приёма в 1 и другие классы.', 'For admission to grade 1 and other grades.') },
        online: svc(OQU, X('1-сынып — OQU (2026 пилоты)', '1 класс — OQU (пилот 2026)', 'Grade 1 — OQU (2026 pilot)')) + svc(eg('pass_mp_203'), X('1-сынып — egov.kz', '1 класс — egov.kz', 'Grade 1 — egov.kz')) + svc(eg('secondary_school/mon-197-205'), X('Басқа сыныптар — egov.kz', 'Другие классы — egov.kz', 'Other grades — egov.kz')) },
      { id: 'transfer', icon: 'arrow-right', tag: X('Ауысу', 'Перевод', 'Transfer'),
        doc: docById('transfer-application'),
        online: svc(eg('pass_30_17_mp'), X('Ауысу — egov.kz', 'Перевод — egov.kz', 'Transfer — egov.kz')) },
      { id: 'certificate', icon: 'doc', tag: X('Анықтама', 'Справка', 'Certificate'),
        doc: docById('certificate-request'),
        online: atSchool(X('Мектептің өзінде беріледі', 'Выдаётся в самой школе', 'Issued at the school itself')) },
      { id: 'duplicate', icon: 'copy', tag: X('Телнұсқа', 'Дубликат', 'Duplicate'),
        doc: docById('duplicate-request'),
        online: svc(eg('pass-mon212-214'), X('Телнұсқа — egov.kz', 'Дубликат — egov.kz', 'Duplicate — egov.kz')) },
      { id: 'withdrawal', icon: 'arrow-left', tag: X('Шығу', 'Выбытие', 'Withdrawal'),
        doc: docById('withdrawal-application'),
        online: `<a class="sa-form__more" href="${href('admission')}#leaving">${L(X('Шығу тәртібі', 'Порядок выбытия', 'How leaving works'))}${ui.icon('arrow-right', { size: 16 })}</a>` },
    ];
    const isPend = (d) => d && !d.file && !d.url;
    const pendDoc = (d) => `<p class="sa-form__title">${L(d.title)}</p>${d.note ? `<p class="sa-form__note">${L(d.note)}</p>` : ''}<p class="sa-form__status">${ui.icon('hourglass', { size: 14 })}<span>${t('doc.pending')}</span></p>`;
    const templates = `<ul class="sa-forms" role="list">${forms.map((f) => `<li class="sa-form sa-form--${f.id}" id="${f.id}">
<div class="sa-form__head"><span class="sa-form__icon">${ui.icon(f.icon, { size: 22 })}</span><span class="sa-form__tag">${L(f.tag)}</span></div>
<div class="sa-form__doc"${isPend(f.doc) ? ' data-pending' : ''}>${isPend(f.doc) ? pendDoc(f.doc) : ui.docList([f.doc])}</div>
<div class="sa-form__svc"><p class="sa-form__svclabel">${L(X('Онлайн / қайда', 'Онлайн / где', 'Online / where'))}</p><div class="sa-form__btns">${f.online}</div></div>
</li>`).join('')}</ul>`;

    const sheet = `<figure class="sa-sheet" aria-labelledby="sa-sheet-cap">
<div class="sa-sheet__to">${L(X('«Керемет» зияткерлік мектебінің директорына', 'Директору интеллектуальной школы «Керемет»', 'To the Director of Keremet Intellectual School'))}
<span class="sa-sheet__line"></span><span class="sa-sheet__hint">${L(X('ата-ананың (заңды өкілінің) аты-жөні, ЖСН', 'ФИО родителя (законного представителя), ИИН', 'parent’s (legal representative’s) full name, IIN'))}</span>
<span class="sa-sheet__line"></span><span class="sa-sheet__hint">${L(X('мекенжайы, телефоны', 'адрес, телефон', 'address, phone'))}</span></div>
<p class="sa-sheet__title">${L(X('Өтініш', 'Заявление', 'Application'))}</p>
<p>${L(X('Менің баламды', 'Прошу принять моего ребёнка', 'Please admit my child'))} <span class="sa-sheet__line"></span><span class="sa-sheet__hint">${L(X('баланың аты-жөні, туған күні, ЖСН', 'ФИО ребёнка, дата рождения, ИИН', 'child’s full name, date of birth, IIN'))}</span>
${L(X('___ сыныпқа ______ оқыту тілімен қабылдауыңызды сұраймын.', 'в ___ класс с ______ языком обучения.', 'to grade ___ with ______ as the language of instruction.'))}</p>
<p class="sa-sheet__consent">${L(X('Дербес деректерді өңдеуге келісемін.', 'Даю согласие на обработку персональных данных.', 'I consent to the processing of personal data.'))}</p>
<div class="sa-sheet__sign"><span>${L(X('күні', 'дата', 'date'))}</span><span>${L(X('қолы', 'подпись', 'signature'))}</span></div>
<span class="sa-sheet__stamp" aria-hidden="true">${L(X('Схема', 'Схема', 'Outline'))}</span>
<figcaption id="sa-sheet-cap" class="sr-only">${L(X('Қабылдау туралы өтініштің құрылымы (ресми бланк емес)', 'Структура заявления о приёме (не официальный бланк)', 'Structure of an admission application (not an official form)'))}</figcaption>
</figure>`;
    const howFill = ui.steps([
      { title: X('Үлгіні жүктеп алыңыз', 'Скачайте образец', 'Download the template'), text: X('немесе мектептен қағаз бланкісін алыңыз.', 'или возьмите бумажный бланк в школе.', 'or pick up a paper form at school.') },
      { title: X('Барлық жолды толтырыңыз', 'Заполните все строки', 'Fill in every line'), text: X('аты-жөндер құжаттағыдай, ЖСН мен байланыс телефоны міндетті.', 'ФИО — как в документах; ИИН и телефон обязательны.', 'names as in the documents; IIN and phone are required.') },
      { title: X('Қол қойыңыз', 'Подпишите', 'Sign it'), text: X('күнін көрсетіп, қол қойыңыз; дербес деректерді өңдеуге келісім беріңіз.', 'укажите дату, подпишите и дайте согласие на обработку персональных данных.', 'date and sign it, and give consent to data processing.') },
      { title: X('Мектепке тапсырыңыз', 'Сдайте в школу', 'Hand it in'), text: X('құжаттармен бірге; 1 жұмыс күні ішінде қолхат беріледі.', 'вместе с документами; расписка выдаётся в течение 1 рабочего дня.', 'with the documents; a receipt is issued within 1 working day.') },
    ]);

    return [
      ui.section({ id: 'templates', eyebrow: X('Жүктеп алу', 'Скачать', 'Download'), title: X('Өтініш үлгілері', 'Образцы заявлений', 'Templates'), lead: X(
        'Әр үлгінің жанында — сол өтінішті онлайн беруге арналған ресми қызмет. Мектеп бекіткен үлгілер жүктелгенге дейін төмендегі құрылымды пайдалануға болады.',
        'Рядом с каждым образцом — официальная услуга, чтобы подать то же заявление онлайн. Пока утверждённые школой образцы не загружены, можно воспользоваться структурой ниже.',
        'Next to each template is the official service for filing the same request online. Until the school’s approved templates are uploaded, you can use the outline below.',
      ), body: templates + `<div class="dz-row sa-after">${ui.legal([
        { href: R564, title: X('Қабылдаудың үлгілік қағидалары (ҚР БҒМ бұйрығы)', 'Типовые правила приёма (приказ МОН РК)', 'Standard Admission Rules (MES order)'), number: '564', date: '2018-10-12' },
      ], { note: X(
        `Қызметтердің тәртібі ${ui.extLink(R564, 'Қабылдаудың үлгілік қағидаларында')} бекітілген.`,
        `Порядок услуг утверждён ${ui.extLink(R564, 'Типовыми правилами приёма')}.`,
        `The procedures are set by the ${ui.extLink(R564, 'Standard Admission Rules')}.`) })}</div>` }),
      ui.section({ id: 'fill', eyebrow: X('Қағаз түрінде', 'На бумаге', 'On paper'), title: X('Өтінішті қалай толтыру керек', 'Как заполнить заявление', 'How to fill in an application'), body: ui.split({ ratio: '1:1', align: 'center', cls: 'sa-split', left: sheet, right: `${howFill}${ui.note(X('Сол жақтағы сурет — өтініштің құрылымын түсіндіретін схема, ресми бланк емес.', 'Изображение слева — схема, поясняющая структуру заявления, а не официальный бланк.', 'The picture on the left is an outline of the structure, not an official form.'))}` }) }),
      ui.callout({ type: 'info', icon: 'phone', title: X('Көмек керек пе?', 'Нужна помощь?', 'Need help?'), text: X(
        `Өтінішті толтыру бойынша сұрақтарыңызды мектепке қойыңыз: <a href="tel:${S.contacts.phone.tel}">${S.contacts.phone.display}</a> (WhatsApp да бар).`,
        `С вопросами по заполнению обращайтесь в школу: <a href="tel:${S.contacts.phone.tel}">${S.contacts.phone.display}</a> (есть WhatsApp).`,
        `For help filling in a form, contact the school: <a href="tel:${S.contacts.phone.tel}">${S.contacts.phone.display}</a> (WhatsApp available).`) }),
      ui.section({ title: X('Байланысты беттер', 'Связанные страницы', 'Related pages'), body: ui.cards([
        { icon: 'compass', href: href('admission'), title: X('Қабылдау қағидалары', 'Правила приёма', 'Admission rules'), text: X('Құжаттар тізімі мен мерзімдер', 'Перечень документов и сроки', 'Documents and deadlines') },
        { icon: 'handshake', href: href('tuition'), title: X('Оқу ақысы және шарт', 'Оплата и договор', 'Tuition & contract'), text: X('№ 93 бұйрық бойынша үлгілік шарт', 'Типовой договор по приказу № 93', 'Standard contract, Order No. 93') },
        { icon: 'chat', href: href('feedback'), title: X('Өтініш жолдау', 'Обращение', 'Send an appeal'), text: X('Мектепке жазбаша өтініш', 'Письменное обращение в школу', 'A written appeal to the school') },
      ], { cols: 3, cls: 'sa-cards' }) }),
    ].join('\n');
  },
};
