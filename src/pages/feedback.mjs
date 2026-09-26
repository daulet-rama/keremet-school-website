// Appeals & feedback — ORDER-114 §M (items 83, 87): accessible feedback form with consent; procedure and terms for appeals;
// person responsible for appeals (pending); how to appeal decisions.
// Legal sources read on 24.09.2026 (zakon.uchet.kz mirror of adilet.zan.kz, editions incl. the Law of 17.12.2025 № 241-VIII):
//  · АППК РК (K2000000350): ст. 4 подп. 1), 16), 32), 35)–38) (обращение = заявление или жалоба; предложение, запрос, отклик,
//    сообщение определены отдельно; re-read 25.09.2026, edition of 25.08.2026), ст. 63 (требования к обращению), ст. 64 п.1, п.3 (обязательный приём,
//    регистрация в день поступления), ст. 76 п.1, п.3 (15 рабочих дней; продление не более чем до 2 месяцев, извещение в 3 рабочих дня),
//    ст. 91 п.1, п.3–5 (досудебное обжалование; жалоба подаётся через орган, чьё решение обжалуется, он передаёт её в 3 рабочих дня),
//    ст. 92 п.1 (жалоба — не позднее 3 месяцев), ст. 99 (жалоба рассматривается 20 рабочих дней).
//  · ЗРК «О доступе к информации» (Z1500000401): ст. 11 п.1 (бесплатно), п.4 (устный запрос), п.10 (письменный запрос — 15 календарных
//    дней; однократное продление не более чем на 15 календарных дней, если нужны сведения других обладателей информации,
//    с уведомлением в течение 3 рабочих дней), п.12 (ответ на языке обращения).
//  · eOtinish: https://eotinish.kz/ (checked: redirects to /kk/, HTTP 200).
export default {
  slug: 'feedback',
  group: 'feedback',
  order: 20,
  title: { kz: 'Өтініш жолдау', ru: 'Обращения', en: 'Appeals & feedback' },
  description: {
    kz: 'Мектепке онлайн-өтініш жолдау, қарау мерзімдері (ӘРПК, «Ақпаратқа қол жеткізу туралы» Заң), жауапты тұлға және шешімге шағымдану тәртібі.',
    ru: 'Онлайн-обращение в школу, сроки рассмотрения (АППК, Закон «О доступе к информации»), ответственное лицо и порядок обжалования решений.',
    en: 'Send an appeal to the school online: response times under Kazakh law, the person responsible and how to appeal a decision.',
  },
  lead: {
    kz: 'Сұрақ, ұсыныс, арыз немесе шағым — жазыңыз. Келіп түскен өтініш тіркеледі және белгіленген мерзімде қаралады.',
    ru: 'Вопрос, предложение, заявление или жалоба — напишите нам. Поступившее обращение регистрируется и рассматривается в установленные сроки.',
    en: 'A question, suggestion, application or complaint — write to us. What you send is registered and considered within the set time limits.',
  },
  styles: ['feedback'],
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, { ui, S, L, t, href, docById }) {
    const X = (kz, ru, en) => ({ kz, ru, en });
    const c = S.contacts;
    const unconf = ui.badge(t('unconfirmed'), 'warn');
    const LAW = {
      appk: { kz: 'https://adilet.zan.kz/kaz/docs/K2000000350', ru: 'https://adilet.zan.kz/rus/docs/K2000000350', en: 'https://adilet.zan.kz/eng/docs/K2000000350' }[lang],
      info: { kz: 'https://adilet.zan.kz/kaz/docs/Z1500000401', ru: 'https://adilet.zan.kz/rus/docs/Z1500000401', en: 'https://adilet.zan.kz/rus/docs/Z1500000401' }[lang],
      eotinish: 'https://eotinish.kz/',
    };
    const APPK = X('ӘРПК', 'АППК', 'APPC');

    // ---------------------------------------------------------------- key terms (bento)
    const terms = ui.stats([
      { icon: 'hourglass', art: true, value: X('15 жұмыс күні', '15 рабочих дней', '15 working days'), label: X('Арызды қарау мерзімі', 'Срок рассмотрения заявления', 'Time limit to consider an application'),
        note: X(`${L(APPK)} 76-бабы, 1-тармақ — жолданым тіркелген күннен бастап`, `${L(APPK)}, ст. 76 п. 1 — со дня регистрации обращения`, `${L(APPK)} Art. 76(1) — from the day the appeal is registered`),
        extra: ui.chips([X('Тіркеу — келіп түскен күні', 'Регистрация — в день поступления', 'Registered the day it arrives'), X('Қабылдаудан бас тартуға тыйым салынған', 'Отказ в приёме запрещён', 'Refusal to accept is prohibited')]) },
      { icon: 'scale', value: '20', label: X('жұмыс күні — шағымды қарау', 'рабочих дней — рассмотрение жалобы', 'working days to consider a complaint'), note: X(`${L(APPK)} 99-бабы`, `${L(APPK)}, ст. 99`, `${L(APPK)} Art. 99`) },
      { icon: 'calendar', value: X('3 ай', '3 мес.', '3 mo.'), label: X('шағым беру мерзімі', 'срок подачи жалобы', 'deadline to file a complaint'), note: X(`${L(APPK)} 92-бабы, 1-тармақ`, `${L(APPK)}, ст. 92 п. 1`, `${L(APPK)} Art. 92(1)`) },
      { icon: 'info', value: '15', label: X('күнтізбелік күн — ақпарат сұрауына жауап', 'календарных дней — ответ на запрос информации', 'calendar days to answer an information request'), note: X('«Ақпаратқа қол жеткізу туралы» Заң, 11-бап, 10-тармақ', 'Закон «О доступе к информации», ст. 11 п. 10', 'Law on Access to Information, Art. 11(10)') },
      { icon: 'coins', value: '0 ₸', label: X('ақпарат сұрау тегін', 'информация по запросу — бесплатно', 'information on request is free'), note: X('Сол Заң, 11-бап, 1-тармақ', 'Тот же закон, ст. 11 п. 1', 'Same law, Art. 11(1)') },
    ], { cls: 'stats--bento fb-terms' });

    // ---------------------------------------------------------------- form + aside
    const aside = `<div class="stack fb-aside">
${ui.panel({ theme: 'chemistry', cls: 'fb-aside__panel', body: `<p class="fb-aside__title">${L(X('Өтінішке не жазу керек', 'Что указать в обращении', 'What to include'))}</p>
<ul class="bullets">${[
      X('Аты-жөніңіз және жауап алатын байланыс (пошта немесе телефон)', 'Ваше имя и контакт для ответа (почта или телефон)', 'Your name and a contact for the reply (e-mail or phone)'),
      X('Мәселенің мәні: не болды, қашан, кімге қатысты', 'Суть вопроса: что произошло, когда, кого касается', 'The essence: what happened, when and whom it concerns'),
      X('Нені сұрайсыз немесе ұсынасыз', 'Чего вы просите или что предлагаете', 'What you are asking for or suggesting'),
      X('Балаңыздың сыныбы (қажет болса)', 'Класс ребёнка (если нужно)', 'Your child’s grade (if relevant)'),
    ].map((x) => `<li>${L(x)}</li>`).join('')}</ul>
<p class="fb-aside__small">${L(X(`Ресми жазбаша өтініштің мазмұнына қойылатын талаптар ${L(APPK)} 63-бабында белгіленген.`, `Требования к содержанию письменного обращения установлены ст. 63 ${L(APPK)}.`, `Formal requirements for a written appeal are set in Art. 63 of the ${L(APPK)}.`))}</p>` })}
${ui.callout({ type: 'warn', title: X('Шұғыл жағдайда', 'В экстренной ситуации', 'In an emergency'), text: X('Балаға қауіп төнсе, форманы күтпеңіз: <strong>112</strong> бірыңғай құтқару қызметі, <strong>111</strong> — балалар құқықтарын қорғау байланыс орталығы, <strong>150</strong> — балалар мен жастарға арналған сенім телефоны.', 'Если ребёнку угрожает опасность, не ждите ответа на форму: <strong>112</strong> — единая служба спасения, <strong>111</strong> — контакт-центр по защите прав детей, <strong>150</strong> — телефон доверия для детей и молодёжи.', 'If a child is in danger, do not wait for a form reply: <strong>112</strong> — emergency services, <strong>111</strong> — children’s rights contact centre, <strong>150</strong> — helpline for children and young people.') })}
<div class="fb-ways"><p class="fb-aside__title">${L(X('Өтініш берудің басқа тәсілдері', 'Другие способы обратиться', 'Other ways to reach us'))}</p>${ui.chips([
      { icon: 'phone', label: X('Телефон арқылы ауызша', 'Устно по телефону', 'Orally by phone') },
      { icon: 'doc', label: X('Мектепке жазбаша', 'Письменно в школу', 'In writing at the school') },
      { icon: 'user', label: X('Директордың жеке қабылдауында', 'На личном приёме у директора', 'At the director’s reception'), href: href('director-blog') + '#reception' },
    ])}</div>
${ui.linkList([
      { href: `tel:${c.phone.tel}`, icon: 'phone', label: c.phone.display, note: X('Ауызша сұрақ — телефон арқылы', 'Устный вопрос — по телефону', 'An oral question — by phone') },
      { href: `https://wa.me/${c.phone.whatsapp}`, icon: 'whatsapp', label: 'WhatsApp', note: X('Жылдам хабарлама', 'Быстрое сообщение', 'A quick message') },
    ])}
</div>`;
    const formBlock = ui.split({ ratio: '3:2', left: ui.form({ kind: 'feedback', lang }), right: aside });

    // ---------------------------------------------------------------- what you can write about (APPK Art. 4 definitions)
    // APPK Art. 4: подп. 16) обращение = заявление или жалоба (kz: жолданым = арыз немесе шағым); 1) заявление; 38) жалоба;
    // 32) запрос; 35) предложение; 36) отклик; 37) сообщение (kz: хабар) — the last four are defined separately, not as forms of обращение.
    const appealTag = X('Жолданым', 'Обращение', 'Appeal');
    const types = ui.cards([
      { icon: 'doc', tag: appealTag, title: X('Арыз', 'Заявление', 'Application'), text: X('Өз құқықтарыңызды немесе басқа адамдардың құқықтарын іске асыруға жәрдем сұрау: анықтама, құжат, ауыстыру т.б. (1) тармақша).', 'Ходатайство о содействии в реализации ваших прав или прав других лиц: справка, документ, перевод и т. п. (подп. 1).', 'A request for help in exercising your rights or those of others: a certificate, a document, a transfer, etc. (subpara. 1).') },
      { icon: 'scale', tag: appealTag, title: X('Шағым', 'Жалоба', 'Complaint'), text: X('Әкімшілік акт немесе әрекет (әрекетсіздік) бұзған құқықтарды қалпына келтіру не қорғау талабы (38) тармақша).', 'Требование о восстановлении или защите прав, нарушенных административным актом или действием (бездействием) (подп. 38).', 'A demand to restore or protect rights violated by an administrative act or action (inaction) (subpara. 38).') },
      { icon: 'search', title: X('Сұрау салу', 'Запрос', 'Information request'), text: X('Сізді қызықтыратын мәселе бойынша ақпарат беру туралы өтініш (32) тармақша). Жазбаша сұрау салуға «Ақпаратқа қол жеткізу туралы» Заң бойынша жауап беріледі.', 'Просьба предоставить информацию по интересующему вопросу (подп. 32). На письменный запрос отвечают по Закону «О доступе к информации».', 'A request for information on a matter of interest (subpara. 32). Written requests are answered under the Law on Access to Information.') },
      { icon: 'bulb', title: X('Ұсыныс', 'Предложение', 'Suggestion'), text: X('Жұмысты жетілдіру және жақсарту жөніндегі ұсынымыңыз (35) тармақша).', 'Ваша рекомендация по совершенствованию и улучшению работы (подп. 35).', 'Your recommendation on improving how things work (subpara. 35).') },
      { icon: 'chat', title: X('Үн қосу', 'Отклик', 'Response'), text: X('Қоғамдық сипаттағы оқиғалар мен құбылыстарға өз көзқарасыңызды білдіру (36) тармақша).', 'Выражение своего отношения к событиям и явлениям общественного характера (подп. 36).', 'Expressing your view on events and developments of public significance (subpara. 36).') },
      { icon: 'warn', title: X('Хабар', 'Сообщение', 'Report'), text: X('Заң бұзушылық немесе жұмыстағы кемшіліктер туралы хабарлау (37) тармақша).', 'Уведомление о нарушении законов или о недостатках в работе (подп. 37).', 'Notice of a breach of the law or of shortcomings in the work (subpara. 37).') },
    ], { cols: 3, variant: 'feature' }) + `<div class="fb-defs">${ui.callout({ type: 'info', title: X('Заң тілінде', 'Юридически', 'In legal terms'), text: X(
      `${L(APPK)} бойынша <strong>жолданым</strong> (өтініш) — бұл <strong>арыз немесе шағым</strong> (4-баптың 16) тармақшасы). Сұрау салу, ұсыныс, үн қосу және хабар сол баптың 32), 35)–37) тармақшаларында жеке анықталған. Сайттағы форма арқылы олардың кез келгенін жіберуге болады.`,
      `По ${L(APPK)} <strong>обращение</strong> — это <strong>заявление или жалоба</strong> (ст. 4 подп. 16). Запрос, предложение, отклик и сообщение определены отдельно — в подп. 32), 35)–37) той же статьи. Через форму на сайте можно направить любое из них.`,
      `Under the ${L(APPK)}, an <strong>appeal</strong> (обращение) means an <strong>application or a complaint</strong> (Art. 4, subpara. 16). Information requests, suggestions, responses and reports are defined separately in subparas. 32 and 35–37 of the same article. You can send any of them through the form on this site.`,
    ) })}</div>`;

    // ---------------------------------------------------------------- procedure (steps) + terms table
    const procedure = ui.steps([
      { title: X('Жіберу', 'Отправка', 'Send'), text: X('Онлайн-форма, WhatsApp, ауызша (телефонмен немесе жеке келіп) не жазбаша түрде мектепке өтініш бересіз.', 'Вы подаёте обращение через онлайн-форму, WhatsApp, устно (по телефону или лично) или письменно в школу.', 'You send the appeal via the online form, WhatsApp, orally (by phone or in person) or in writing.') },
      { title: X('Тіркеу', 'Регистрация', 'Registration'), text: X('Өтініш келіп түскен күні тіркеледі; жұмыс уақытынан кейін келсе — келесі жұмыс күні (ӘРПК 64-бабы, 3-тармақ).', 'Обращение регистрируется в день поступления, а после окончания рабочего дня — на следующий рабочий день (АППК, ст. 64 п. 3).', 'The appeal is registered on the day it arrives, or on the next working day if it comes after hours (APPC Art. 64(3)).') },
      { title: X('Қарау', 'Рассмотрение', 'Consideration'), text: X('Өтінішті жауапты қызметкер қарайды, қажет болса сізбен байланысып, мән-жайын нақтылайды.', 'Обращение рассматривает ответственный работник; при необходимости он свяжется с вами, чтобы уточнить обстоятельства.', 'A responsible staff member considers it and may contact you to clarify the facts.') },
      { title: X('Жауап', 'Ответ', 'Answer'), text: X('Жауап өтініш тілінде, сіз таңдаған тәсілмен (қағаз немесе электрондық түрде) беріледі.', 'Ответ даётся на языке обращения, в выбранной вами форме (бумажной или электронной).', 'The answer is given in the language of the appeal, on paper or electronically, as you choose.') },
    ]);
    const termsTable = ui.table({
      caption: X('Заңда белгіленген мерзімдер', 'Сроки, установленные законом', 'Time limits set by law'),
      head: [X('Не', 'Что', 'What'), X('Мерзімі', 'Срок', 'Time limit'), X('Норма', 'Норма', 'Legal basis')],
      rows: [
        [X('Жолданымды (өтінішті) тіркеу', 'Регистрация обращения', 'Registering an appeal'), X('келіп түскен күні', 'в день поступления', 'on the day it arrives'), X('ӘРПК, 64-бап, 3-т.', 'АППК, ст. 64 п. 3', 'APPC Art. 64(3)')],
        [X('Арызды қарау', 'Рассмотрение заявления', 'Considering an application'), X('15 жұмыс күні', '15 рабочих дней', '15 working days'), X('ӘРПК, 76-бап, 1-т.', 'АППК, ст. 76 п. 1', 'APPC Art. 76(1)')],
        [X('Мерзімді ұзарту', 'Продление срока', 'Extension'), X('дәлелді шешіммен, 2 айдан аспайды; өтініш берушіге 3 жұмыс күні ішінде хабарланады', 'мотивированным решением, не более чем до 2 месяцев; заявителя извещают в течение 3 рабочих дней', 'by a reasoned decision, up to 2 months; the applicant is told within 3 working days'), X('ӘРПК, 76-бап, 3-т.', 'АППК, ст. 76 п. 3', 'APPC Art. 76(3)')],
        [X('Жазбаша ақпарат сұрауына жауап', 'Ответ на письменный запрос информации', 'Answer to a written information request'), X('15 күнтізбелік күн; басқа ақпарат иелерінен мәлімет алу қажет болса, бір рет 15 күнтізбелік күнге дейін ұзартылуы мүмкін — бұл туралы 3 жұмыс күні ішінде хабарланады', '15 календарных дней; если нужны сведения от других обладателей информации, срок может быть однократно продлён не более чем на 15 календарных дней — об этом сообщают в течение 3 рабочих дней', '15 calendar days; if information from other holders is needed, it may be extended once by up to 15 calendar days, and you are told within 3 working days'), X('«Ақпаратқа қол жеткізу туралы» Заң, 11-бап, 10-т.', 'Закон «О доступе к информации», ст. 11 п. 10', 'Law on Access to Information, Art. 11(10)')],
        [X('Шағым беру', 'Подача жалобы', 'Filing a complaint'), X('шешім белгілі болған күннен бастап 3 айдан кешіктірмей', 'не позднее 3 месяцев со дня, когда стало известно о решении', 'within 3 months of learning of the decision'), X('ӘРПК, 92-бап, 1-т.', 'АППК, ст. 92 п. 1', 'APPC Art. 92(1)')],
        [X('Шағымды қарау', 'Рассмотрение жалобы', 'Considering a complaint'), X('20 жұмыс күні', '20 рабочих дней', '20 working days'), X('ӘРПК, 99-бап', 'АППК, ст. 99', 'APPC Art. 99')],
      ],
    });
    const scopeNote = ui.callout({ type: 'info', title: X('Бұл мерзімдер кімге қолданылады', 'К кому применяются эти сроки', 'Who these time limits apply to'), text: X(
      `ӘРПК мемлекеттік органдарға, сондай-ақ заң бойынша әкімшілік акт қабылдау өкілеттігі берілген өзге де ұйымдарға қолданылады (4-бап, 7-тармақ) — мысалы, мектепке қабылдау сияқты мемлекеттік қызметтер көрсету кезінде. Мектептің өтініштерді қарау жөніндегі ішкі тәртібі бекітілгеннен кейін осы бетте жарияланады.`,
      `АППК распространяется на государственные органы, а также на иные организации, наделённые законом полномочиями по принятию административного акта (ст. 4 п. 7), — например, при оказании государственных услуг, таких как приём в школу. Внутренний порядок рассмотрения обращений школы будет опубликован на этой странице после утверждения.`,
      `The APPC applies to state bodies and to other organisations empowered by law to take administrative acts (Art. 4(7)) — for example, when providing public services such as school admission. The school’s internal procedure for appeals will be published here once approved.`,
    ) });

    // ---------------------------------------------------------------- responsible person
    // S.contacts.responsibleForAppeals (null until the school supplies it): { name, position, phone: {display, tel} | string, email, hours }
    // — each field falls back to a "to be confirmed" badge; the phone falls back to the school's main number.
    const r = c.responsibleForAppeals || {};
    const rPhone = typeof r.phone === 'string' ? { display: r.phone, tel: r.phone.replace(/[^+\d]/g, '') } : r.phone;
    const rName = [L(r.name), L(r.position)].filter(Boolean).join(', ');
    const responsible = ui.split({
      ratio: '1:1', align: 'start',
      left: `<div class="fb-resp panel pattern" data-theme="chemistry"><div class="fb-resp__head"><span class="fb-resp__ava" aria-hidden="true">${ui.icon('user', { size: 34 })}</span><div><p class="fb-resp__role">${L(X('Өтініштерге жауапты тұлға', 'Ответственный за обращения', 'Person responsible for appeals'))}</p><p class="fb-resp__name">${L(r.name) || t('pending.title')}</p></div></div>
${ui.facts([
        { k: X('Аты-жөні, лауазымы', 'ФИО, должность', 'Name, position'), v: rName || unconf },
        { k: t('phone'), v: rPhone && rPhone.display ? `<a href="tel:${rPhone.tel}">${rPhone.display}</a>` : `<a href="tel:${c.phone.tel}">${c.phone.display}</a> <small class="muted">(${L(X('уақытша — мектептің негізгі нөмірі', 'временно — основной номер школы', 'meanwhile — the school’s main number'))})</small>` },
        { k: t('email'), v: r.email ? `<a href="mailto:${r.email}">${r.email}</a>` : unconf },
        { k: X('Қабылдау уақыты', 'Часы приёма', 'Reception hours'), v: L(r.hours) || unconf },
      ])}</div>`,
      right: (c.responsibleForAppeals ? '' : ui.pending({
        title: X('Жарияланатын мәліметтер', 'Что будет опубликовано', 'To be published'),
        note: X(
          'Өтініштерге жауапты қызметкердің аты-жөні мен лауазымы, байланыс телефоны мен поштасы, қабылдау күндері мен сағаттары; оны тағайындау туралы бұйрық (нөмірі, күні); өтініштерді қарау тәртібі туралы ішкі ереже (PDF).',
          'ФИО и должность ответственного за обращения, телефон и почта, дни и часы приёма; приказ о его назначении (номер, дата); внутреннее положение о порядке рассмотрения обращений (PDF).',
          'Name and position of the person responsible for appeals, phone and e-mail, reception days and hours; the appointment order (number, date); the internal regulation on handling appeals (PDF).',
        ),
      })) + ui.docList([
        docById('appeals-officer-order'),
        docById('appeals-regulation'),
      ]),
    });

    // ---------------------------------------------------------------- how to appeal a decision (timeline)
    const appeal = ui.timeline([
      { time: X('1-қадам', 'Шаг 1', 'Step 1'), title: X('Мектепте сөйлесу', 'Разговор в школе', 'Talk it through at school'), text: X('Көп мәселе сынып жетекшісімен, пән мұғалімімен немесе директордың орынбасарымен сөйлескенде шешіледі.', 'Многие вопросы решаются в разговоре с классным руководителем, учителем или заместителем директора.', 'Many issues are settled by talking to the class teacher, the subject teacher or a deputy director.') },
      { time: X('2-қадам', 'Шаг 2', 'Step 2'), title: X('Директорға жүгіну', 'Обращение к директору', 'Go to the director'), text: X(`Директордың жеке қабылдауына жазылыңыз немесе <a href="${href('director-blog')}">директор блогы</a> арқылы сұрақ қойыңыз.`, `Запишитесь на личный приём к директору или задайте вопрос через <a href="${href('director-blog')}">блог директора</a>.`, `Book a personal meeting with the director or ask through the <a href="${href('director-blog')}">director’s blog</a>.`) },
      { time: X('3-қадам', 'Шаг 3', 'Step 3'), title: X('Жазбаша шағым', 'Письменная жалоба', 'Written complaint'), text: X('Шешімге шағым сол шешімді қабылдаған ұйымға 3 ай ішінде беріледі. Ол шағымды 3 жұмыс күні ішінде қарауға өкілетті органға жібереді немесе осы мерзімде талапты өзі толық қанағаттандырады (ӘРПК 91-бабы, 4-тармақ; 92-бап).', 'Жалоба на решение подаётся в течение 3 месяцев в организацию, которая его приняла. В течение 3 рабочих дней она передаёт жалобу органу, рассматривающему жалобу, либо в этот срок сама полностью удовлетворяет требования (АППК, ст. 91 п. 4; ст. 92).', 'A complaint is filed within 3 months with the organisation that made the decision. Within 3 working days it forwards the complaint to the reviewing body, or fully satisfies the demand itself (APPC Art. 91(4); Art. 92).') },
      { time: X('4-қадам', 'Шаг 4', 'Step 4'), title: X('Білім беру органдары', 'Органы образования', 'Education authorities'), text: X(`Білім беру сапасына қатысты мәселелер бойынша ${ui.extLink(S.gov.department.url, S.gov.department.label)} немесе ${ui.extLink(S.gov.cityEducation.url, S.gov.cityEducation.label)} мекемесіне, соның ішінде ${ui.extLink(LAW.eotinish, 'eOtinish')} порталы арқылы жүгінуге болады.`, `По вопросам качества образования можно обратиться в ${ui.extLink(S.gov.department.url, S.gov.department.label)} или ${ui.extLink(S.gov.cityEducation.url, S.gov.cityEducation.label)}, в том числе через портал ${ui.extLink(LAW.eotinish, 'eOtinish')}.`, `On matters of education quality you can contact the ${ui.extLink(S.gov.department.url, S.gov.department.label)} or the ${ui.extLink(S.gov.cityEducation.url, S.gov.cityEducation.label)}, including via the ${ui.extLink(LAW.eotinish, 'eOtinish')} portal.`) },
      { time: X('5-қадам', 'Шаг 5', 'Step 5'), title: X('Сот', 'Суд', 'Court'), text: X('Заңда өзгеше көзделмесе, сотқа дейінгі (әкімшілік) тәртіппен шағымданғаннан кейін сотқа жүгінуге болады (ӘРПК 91-бабы, 5-тармақ).', 'Если иное не предусмотрено законом, обращение в суд допускается после досудебного обжалования (АППК, ст. 91 п. 5).', 'Unless the law provides otherwise, you may go to court after the pre-trial complaint stage (APPC Art. 91(5)).') },
    ]);

    // ---------------------------------------------------------------- official channels
    // Links live in the card text (not the heading) so the h3 is just the name, without the "opens in a new tab" sr text.
    const offLink = (url, label) => `<p class="fb-off__link">${ui.extLink(url, label)}</p>`;
    const official = ui.cards([
      { icon: 'globe', title: 'eOtinish', text: L(X('Мемлекеттік органдар мен ұйымдарға өтініштер мен шағымдарды онлайн жолдаудың бірыңғай жүйесі.', 'Единая система онлайн-обращений и жалоб в государственные органы и организации.', 'The single online system for appeals and complaints to state bodies and organisations.')) + offLink(LAW.eotinish, 'eotinish.kz') },
      { icon: 'building', title: S.gov.department.label, text: L(X('Мектепке лицензия берген орган.', 'Орган, выдавший лицензию школе.', 'The body that issued the school’s licence.')) + offLink(S.gov.department.url, 'gov.kz') },
      { icon: 'school', title: S.gov.cityEducation.label, text: L(X('Қаланың білім беруді басқару органы.', 'Городской орган управления образованием.', 'The city’s education authority.')) + offLink(S.gov.cityEducation.url, 'gov.kz') },
    ], { cols: 3 });
    const sources = ui.docList([
      { title: X('Қазақстан Республикасының Әкімшілік рәсімдік-процестік кодексі (29.06.2020 № 350-VI)', 'Административный процедурно-процессуальный кодекс Республики Казахстан от 29.06.2020 № 350-VI', 'Administrative Procedural and Process Code of the Republic of Kazakhstan, No. 350-VI of 29.06.2020'), url: LAW.appk, note: X('4, 63, 64, 76, 91, 92, 99-баптар', 'Статьи 4, 63, 64, 76, 91, 92, 99', 'Articles 4, 63, 64, 76, 91, 92, 99') },
      { title: X('«Ақпаратқа қол жеткізу туралы» Қазақстан Республикасының Заңы (16.11.2015 № 401-V)', 'Закон Республики Казахстан «О доступе к информации» от 16.11.2015 № 401-V', 'Law of the Republic of Kazakhstan “On Access to Information”, No. 401-V of 16.11.2015'), url: LAW.info, note: X('11-бап — сұрау бойынша ақпарат беру', 'Статья 11 — предоставление информации по запросу', 'Article 11 — providing information on request') },
    ]);

    const toc = ui.toc([
      { id: 'form', label: X('Онлайн-өтініш', 'Онлайн-обращение', 'Online appeal') },
      { id: 'types', label: X('Неге жүгінуге болады', 'С чем обратиться', 'What to write about') },
      { id: 'procedure', label: X('Қарау тәртібі мен мерзімдері', 'Порядок и сроки', 'Procedure and time limits') },
      { id: 'responsible', label: X('Жауапты тұлға', 'Ответственное лицо', 'Person responsible') },
      { id: 'appeal', label: X('Шешімге шағымдану', 'Обжалование решений', 'Appealing a decision') },
      { id: 'official', label: X('Ресми арналар мен заңдар', 'Официальные каналы и законы', 'Official channels and laws') },
    ]);

    const related = ui.linkList([
      { href: href('contacts'), icon: 'pin', label: X('Байланыс', 'Контакты', 'Contacts'), note: X('Мекенжай, телефон, карта', 'Адрес, телефон, карта', 'Address, phone, map') },
      { href: href('director-blog'), icon: 'user', label: X('Директор блогы', 'Блог директора', 'Director’s blog'), note: X('Қабылдау кестесі және директорға сұрақ', 'График приёма и вопрос директору', 'Reception hours and questions to the director') },
      { href: href('faq'), icon: 'info', label: X('Сұрақ–жауап', 'Вопрос–ответ', 'FAQ') },
      { href: href('anticorruption'), icon: 'shield', label: X('Сыбайлас жемқорлыққа қарсы іс-қимыл', 'Противодействие коррупции', 'Anti-corruption') },
      { href: href('privacy'), icon: 'lock', label: X('Құпиялылық саясаты', 'Политика конфиденциальности', 'Privacy policy'), note: X('Дербес деректеріңіз қалай өңделеді', 'Как обрабатываются ваши персональные данные', 'How your personal data is processed') },
    ]);

    return [
      // Phones: the form is the page's main task, so the TOC is hidden above it and repeated right after it (display:none keeps
      // only one copy in the accessibility tree at any width).
      ui.split({ ratio: '1:2', cls: 'fb-top', left: toc, right: ui.section({ id: 'form', cls: 'fb-formintro', eyebrow: X('Кері байланыс формасы', 'Форма обратной связи', 'Feedback form'), title: X('Мектепке жазу', 'Написать в школу', 'Write to the school'), lead: X('Барлық өрістердің жанында түсініктеме бар; қате болса, форма нені түзету керектігін мәтінмен көрсетеді. Капча жоқ.', 'У каждого поля есть подсказка; при ошибке форма текстом укажет, что исправить. Капчи нет.', 'Every field has a hint; if something is wrong the form says in words what to fix. No captcha.') }) }),
      ui.section({ body: formBlock, cls: 'fb-formsec' }),
      `<div class="fb-toc-m">${toc}</div>`,
      ui.section({ id: 'types', eyebrow: X('Жолданымдар мен өтініштер', 'Обращения и запросы', 'Appeals and requests'), title: X('Қандай мәселемен жүгінуге болады', 'С чем можно обратиться', 'What you can write to us about'), body: types }),
      ui.section({ id: 'procedure', tone: 'chemistry', eyebrow: X('Жолдаудан жауапқа дейін', 'От отправки до ответа', 'From sending to answer'), title: X('Өтініш қалай қаралады', 'Как рассматривается обращение', 'How an appeal is handled'), body: terms + procedure + termsTable }),
      ui.section({ body: scopeNote }),
      ui.section({ id: 'responsible', eyebrow: X('Байланыс тұлғасы', 'Контактное лицо', 'Contact person'), title: X('Өтініштерге жауапты тұлға', 'Ответственный за рассмотрение обращений', 'Person responsible for appeals'), body: responsible }),
      ui.section({ id: 'appeal', eyebrow: X('Келіспесеңіз', 'Если вы не согласны', 'If you disagree'), title: X('Шешімге қалай шағымдануға болады', 'Как обжаловать решение', 'How to appeal a decision'), body: appeal }),
      ui.section({ id: 'official', eyebrow: X('Ресми дереккөздер', 'Официальные источники', 'Official sources'), title: X('Ресми арналар мен нормативтік актілер', 'Официальные каналы и нормативные акты', 'Official channels and legislation'), body: official + sources + ui.note(X('Заң мәтіндері 25.09.2026 тексерілді (ӘРПК — 25.08.2026 жағдай бойынша редакция; 99-бап — 17.12.2025 № 241-VIII Заңның редакциясында). Өзекті редакциясын adilet.zan.kz сайтынан қараңыз.', 'Тексты законов сверены 25.09.2026 (АППК — в редакции по состоянию на 25.08.2026; ст. 99 — в редакции Закона от 17.12.2025 № 241-VIII). Актуальная редакция — на adilet.zan.kz.', 'Legal texts checked on 25.09.2026 (APPC as amended up to 25.08.2026; Art. 99 as worded by Law No. 241-VIII of 17.12.2025). See adilet.zan.kz for the current version.')) }),
      ui.section({ title: t('nav.inSection'), body: related }),
    ].join('\n');
  },
};
