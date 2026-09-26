// Anti-corruption — policy, ethics officer, prohibition of illegal collections, how to report (ORDER-114 §P item 95).
// Verified sources (24.09.2026): Law No. 410-V "On Combating Corruption" arts. 24, 24-1, 24-3 (adilet.zan.kz);
// Rules of pedagogical ethics (Order No. 190), p. 8 subp. 3 (teachers do not allow financial extortion);
// 1424 — free call-centre of the Anti-Corruption Agency (Anti-Corruption Service), free across Kazakhstan.
// Unknown: the school's ethics officer (name, contacts), approved anti-corruption policy → pending.
import { ACTS, adiletUrl } from './legislation.mjs';
import { registryOf } from './documents.mjs';

const X = (kz, ru, en) => ({ kz, ru, en });
const act = (id) => ACTS.find((a) => a.id === id);

export default {
  slug: 'anticorruption',
  group: 'documents',
  order: 40,
  title: { kz: 'Сыбайлас жемқорлыққа қарсы іс-қимыл', ru: 'Противодействие коррупции', en: 'Anti-corruption' },
  description: {
    kz: 'Мектептің сыбайлас жемқорлыққа қарсы ұстанымы, заңсыз ақша жинауға тыйым, әдеп жөніндегі уәкіл және 1424 сенім телефоны.',
    ru: 'Антикоррупционная политика школы, запрет поборов, уполномоченный по этике и как сообщить о коррупции: телефон 1424.',
    en: 'The school’s anti-corruption stance, the ban on illegal collections, the ethics officer and how to report corruption: call 1424.',
  },
  styles: ['documents'],
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',

  render(lang, ctx) {
    const { ui, L, href, S } = ctx;
    const R = registryOf(ctx); // registry incl. documents listed only by this group's pages
    const corr = act('corr');
    const ethics = act('ethics');
    const AGENCY = 'https://www.gov.kz/memleket/entities/anticorruption';
    // egov.kz article "What to do when facing corruption" (1424 is free; ways to report)
    const EGOV = `https://egov.kz/cms/${lang === 'kz' ? 'kk' : lang}/articles/legal_relations/corruption`;

    // ------------------------------------------------------------ hotline hero
    const hotline = `<div class="dx-hotline pattern" data-theme="hero">
<div class="dx-hotline__main"><p class="dx-hotline__eyebrow">${L(X('Сыбайлас жемқорлыққа тап болдыңыз ба?', 'Столкнулись с коррупцией?', 'Faced with corruption?'))}</p>
<p class="dx-hotline__num"><a href="tel:1424" aria-label="${ui.esc(L(X('1424 нөміріне қоңырау шалу', 'Позвонить по номеру 1424', 'Call 1424')))}">1424</a></p>
<p class="dx-hotline__text">${L(X('Қазақстан Республикасы Сыбайлас жемқорлыққа қарсы іс-қимыл агенттігінің (Сыбайлас жемқорлыққа қарсы қызмет) бірыңғай байланыс орталығы. Қазақстанның барлық аумағынан қоңырау шалу тегін.', 'Единый call-центр Агентства Республики Казахстан по противодействию коррупции (Антикоррупционной службы). Звонок бесплатный по всему Казахстану.', 'The single call centre of the Anti-Corruption Agency of Kazakhstan (Anti-Corruption Service). Calls are free from anywhere in Kazakhstan.'))}</p>
<div class="cluster">${ui.button({ href: 'tel:1424', label: X('Қоңырау шалу: 1424', 'Позвонить: 1424', 'Call 1424'), kind: 'gold', iconLeft: 'phone', ext: false })}${ui.button({ href: AGENCY, label: X('Агенттіктің сайты', 'Сайт Агентства', 'Agency website'), kind: 'light' })}${ui.button({ href: EGOV, label: X('egov.kz: не істеу керек', 'egov.kz: что делать', 'egov.kz: what to do'), kind: 'light' })}</div></div>
<ul class="dx-hotline__facts" role="list">
<li>${ui.icon('lock', { size: 20 })}<span>${L(X('Хабарлаған адамның өтініші бойынша онымен жария етпеу туралы келісім жасалады — өтініші туралы мәліметтер құпия болады.', 'По просьбе сообщившего с ним заключается соглашение о неразглашении — сведения о его обращении конфиденциальны.', 'At the reporter’s request a non-disclosure agreement is concluded with them, keeping their report confidential.'))}</span></li>
<li>${ui.icon('shield', { size: 20 })}<span>${L(X('Хабарлаған адам мемлекеттің қорғауында болады.', 'Сообщивший находится под защитой государства.', 'The person reporting is protected by the state.'))}</span></li>
<li>${ui.icon('calendar', { size: 20 })}<span>${L(X('Еңбек қатынастарындағы құқықтары 3 жыл бойы қорғалады.', 'Трудовые права защищаются в течение 3 лет.', 'Their employment rights are protected for 3 years.'))}</span></li>
</ul></div>`;

    // ------------------------------------------------------------ principles: 6 tiles (layer 1) + full wording (layer 2)
    const PRINCIPLES = [
      { icon: 'target', title: X('Мүлдем төзбеушілік', 'Нулевая терпимость', 'Zero tolerance'), text: X('Мектепте пара, сыйақы талап ету және өз қызметін жеке мүддеге пайдалануға кез келген түрде жол берілмейді.', 'В школе недопустимы взятки, вымогательство вознаграждений и использование должности в личных интересах в любой форме.', 'Bribes, demands for rewards and use of position for personal gain are not tolerated in any form.') },
      { icon: 'heart', title: X('Қайырымдылық — тек ерікті', 'Благотворительность — только добровольно', 'Donations are voluntary only'), text: X(`Қайырымдылық көмек ерікті, өтеусіз және тек Қамқоршылық кеңестің шешімімен жұмсалады. Есебі — <a href="${href('finance')}">«Қаржылық есептер»</a> бетінде.`, `Благотворительная помощь — добровольная, безвозмездная и расходуется только по решению попечительского совета. Отчёт — на странице <a href="${href('finance')}">«Финансовые отчёты»</a>.`, `Charitable aid is voluntary, free and spent only by Board of Trustees decision. Reports are on the <a href="${href('finance')}">Financial reports</a> page.`) },
      { icon: 'scale', title: X('Мүдделер қақтығысы', 'Конфликт интересов', 'Conflict of interest'), text: X('Қызметкер жеке мүддесі жұмысына әсер етуі мүмкін жағдай туралы басшылыққа хабарлайды.', 'Работник сообщает руководству о ситуации, когда личный интерес может повлиять на его работу.', 'Staff tell management whenever a personal interest could affect their work.') },
      { icon: 'eye', title: X('Ашықтық', 'Открытость', 'Transparency'), text: X(`Қабылдау қағидалары, шарт үлгілері, есептер мен ішкі құжаттар <a href="${href('documents')}">сайтта жарияланады</a>.`, `Правила приёма, образцы договоров, отчёты и внутренние документы <a href="${href('documents')}">публикуются на сайте</a>.`, `Admission rules, contract templates, reports and internal documents are <a href="${href('documents')}">published on the site</a>.`) },
      { icon: 'graduation', title: X('Педагогикалық әдеп', 'Педагогическая этика', 'Teaching ethics'), text: X('Педагогтер білім беру процесіне қатысушыларға қатысты қаржылық және өзге де қорқытып алушылыққа жол бермейді (Педагогикалық әдеп қағидалары, 8-тармақ, 3-тармақша).', 'Педагоги не допускают финансовых и иных вымогательств по отношению к участникам образовательного процесса (Правила педагогической этики, п. 8 пп. 3).', 'Teachers do not allow financial or other extortion from anyone in the learning process (Rules of Teaching Ethics, p. 8(3)).') },
      { icon: 'book', title: X('Антикоррупциялық мәдениет', 'Антикоррупционная культура', 'Integrity education'), text: X('Адалдық құндылығы тәрбие жұмысында және оқушылармен, ата-аналармен сөйлесуде қалыптасады.', 'Ценность честности формируется в воспитательной работе и в общении с учениками и родителями.', 'Honesty is taught through upbringing work and everyday contact with pupils and parents.') },
    ];
    const principles = `<ul class="dx-tiles dx-tiles--3" role="list">${PRINCIPLES.map((p) => `<li class="dx-tile"><span class="dx-tile__ic" aria-hidden="true">${ui.icon(p.icon, { size: 20 })}</span><span class="dx-tile__t">${L(p.title)}</span></li>`).join('')}</ul>${ui.more({ label: X('Қағидаттар толығырақ', 'Принципы подробнее', 'The principles in detail'), icon: 'book', count: PRINCIPLES.length, body: ui.cards(PRINCIPLES, { cols: 2 }) })}`;

    // ------------------------------------------------------------ what is forbidden
    const forbidden = `<ul class="dx-nolist" role="list">${[
      X('Ата-аналардан сыныпқа, жөндеуге, күзетке, мерекеге немесе сыйлыққа мәжбүрлеп ақша жинау', 'Принудительный сбор денег с родителей «на класс», ремонт, охрану, праздники или подарки', 'Forced collection of money from parents “for the class”, repairs, security, parties or gifts'),
      X('Баға, қабылдау, ауыстыру, анықтама немесе құжат беру үшін ақша, сыйлық не қызмет талап ету', 'Требование денег, подарков или услуг за оценку, приём, перевод, справку или документ', 'Demanding money, gifts or favours for marks, admission, transfer, certificates or documents'),
      X('Шартта көзделмеген төлемдерді құжатсыз алу', 'Получение не предусмотренных договором платежей без документов', 'Taking payments not provided for in the contract, without documents'),
      X('Қызмет бабындағы ақпаратты жеке пайда үшін пайдалану', 'Использование служебной информации в личных целях', 'Using work-related information for personal gain'),
    ].map((i) => `<li>${ui.icon('close', { size: 18 })}<span>${L(i)}</span></li>`).join('')}</ul>`;

    // ------------------------------------------------------------ ethics officer + documents: ONE pending line, the council note under ⚖
    const docs = [...R.byGroup('anticorruption'), R.byId('ethics-council')].filter(Boolean);
    const isPub = (d) => Boolean(d.file || d.url);
    const officerItem = {
      title: X('Әдеп жөніндегі уәкіл', 'Уполномоченный по этике', 'Ethics officer'),
      note: X('Уәкілдің аты-жөні, лауазымы, телефоны мен қабылдау уақыты оны тағайындау туралы бұйрық шыққаннан кейін жарияланады.', 'ФИО, должность, телефон и время приёма уполномоченного будут опубликованы после приказа о его назначении.', 'The officer’s name, position, phone and office hours will be published once the appointment order is issued.'),
    };
    const pendDocs = docs.filter((d) => !isPub(d)).map((d) => ({ title: d.title, note: d.note || X('Құжат жүктеледі', 'Документ будет загружен', 'Document will be uploaded') }));
    const person = `<div class="dx-person"><span class="dx-person__ic" aria-hidden="true">${ui.icon('user', { size: 30 })}</span><div><p class="dx-person__t">${L(officerItem.title)}</p><p class="dx-person__st">${ui.icon('hourglass', { size: 14 })}${L(X('Ақпарат толықтырылуда', 'Информация обновляется', 'Information pending'))}</p><p class="dx-person__n">${L(officerItem.note)}</p></div></div>`;
    const officer = ui.split({ ratio: '1:1', align: 'start', left: person, right: `<div class="flow">${ui.pendingGroup(lang, pendDocs, { kind: 'docs' })}${docs.some(isPub) ? ui.docList(docs.filter(isPub)) : ''}
<div class="dz-row">${ui.legal([{ href: adiletUrl(ethics, lang), title: ethics.title, number: ethics.number, date: ethics.date }], { title: X('Педагогикалық әдеп жөніндегі кеңес', 'Совет по педагогической этике', 'Pedagogical ethics council'), note: X(`Педагогикалық әдеп мәселелерін білім беру ұйымындағы педагогикалық әдеп жөніндегі кеңес қарайды (${ui.extLink(adiletUrl(ethics, lang), '№ 190 бұйрық')}). Кеңес туралы — <a href="${href('structure')}">«Басқару құрылымы»</a> бетінде.`, `Вопросы педагогической этики рассматривает совет по педагогической этике организации образования (${ui.extLink(adiletUrl(ethics, lang), 'приказ № 190')}). О совете — на странице <a href="${href('structure')}">«Структура управления»</a>.`, `Teaching-ethics matters are handled by the school’s pedagogical ethics council (${ui.extLink(adiletUrl(ethics, lang), 'Order No. 190')}). See <a href="${href('structure')}">Governance structure</a>.`) })}</div></div>` });

    // ------------------------------------------------------------ how to report
    const report = ui.steps([
      { title: X('Мектеп басшылығына', 'Руководству школы', 'The school’s management'), text: X(`Директорға немесе әдеп жөніндегі уәкілге жазбаша, <a href="tel:${S.contacts.phone.tel}">${S.contacts.phone.display}</a> телефоны арқылы немесе <a href="${href('feedback')}">кері байланыс нысаны</a> арқылы («Шағым» тақырыбы) хабарласыңыз.`, `Обратитесь к директору или уполномоченному по этике письменно, по телефону <a href="tel:${S.contacts.phone.tel}">${S.contacts.phone.display}</a> или через <a href="${href('feedback')}">форму обратной связи</a> (тема «Жалоба»).`, `Contact the director or the ethics officer in writing, by phone <a href="tel:${S.contacts.phone.tel}">${S.contacts.phone.display}</a> or via the <a href="${href('feedback')}">feedback form</a> (topic “Complaint”).`) },
      { title: X('1424 байланыс орталығына', 'В call-центр 1424', 'The 1424 call centre'), text: X('Сыбайлас жемқорлыққа қарсы қызметтің тегін нөміріне қоңырау шалыңыз — кеңес береді немесе хабарламаңызды қабылдайды.', 'Позвоните на бесплатный номер Антикоррупционной службы — там проконсультируют или примут сообщение.', 'Call the Anti-Corruption Service’s free number for advice or to make a report.') },
      { title: X('Онлайн өтініш', 'Онлайн-обращение', 'Online appeal'), text: X(`Мемлекеттік органдарға өтініштер ${ui.extLink('https://eotinish.kz/', 'eOtinish.kz')} порталы арқылы жіберіледі.`, `Обращения в государственные органы подаются через портал ${ui.extLink('https://eotinish.kz/', 'eOtinish.kz')}.`, `Appeals to state bodies can be filed on ${ui.extLink('https://eotinish.kz/', 'eOtinish.kz')}.`) },
    ]);
    // Longer wording (sources, what to include) → layer 2.
    const reportMore = ui.more({ label: X('Тағы не білу керек', 'Что ещё важно знать', 'More to know'), icon: 'info', count: 2, tone: 'card', body: X(
      `<p><strong>Онлайн өтініш.</strong> Агенттік туралы ақпарат — ${ui.extLink(AGENCY, 'gov.kz')}, ал хабарлау тәсілдері — ${ui.extLink(EGOV, 'egov.kz')} порталындағы «Сыбайлас жемқорлыққа тап болғанда не істеу керек» мақаласында.</p><p><strong>Не көрсету керек.</strong> Не болды, қашан және қайда, кім қатысты; бар болса — құжаттар, хаттар, скриншоттар. Мәліметтердің анықтығы тексеруді жеделдетеді.</p>`,
      `<p><strong>Онлайн-обращение.</strong> Сведения об Агентстве — на ${ui.extLink(AGENCY, 'gov.kz')}, способы сообщить — в статье ${ui.extLink(EGOV, '«Что делать при столкновении с коррупцией?»')} на egov.kz.</p><p><strong>Что указать.</strong> Что произошло, когда и где, кто участвовал; при наличии — документы, переписку, скриншоты. Точные сведения ускоряют проверку.</p>`,
      `<p><strong>Online appeal.</strong> See the Agency’s page on ${ui.extLink(AGENCY, 'gov.kz')} and the e-government article ${ui.extLink(EGOV, '“What is to be done when facing corruption?”')} on egov.kz.</p><p><strong>What to include.</strong> What happened, when and where, who was involved; any documents, messages or screenshots. Precise details speed up the check.</p>`) });
    // Legal guarantees + the acts → ONE "⚖ Правовая основа" chip.
    const guaranteesNote = X(
      `<p><strong>Заң кепілдіктері.</strong> Сыбайлас жемқорлық фактісі туралы хабарлаған адам мемлекеттің қорғауында болады (24-бап); оның өтініші бойынша онымен жария етпеу туралы келісім жасалады және өтініші туралы мәліметтер құпия болады (24-1, 24-3-баптар), ал еңбек құқықтары 3 жыл бойы қорғалады (24-1-бап). Көрінеу жалған ақпарат бергендер заң бойынша жауап береді. (${ui.extLink(adiletUrl(corr, lang), '«Сыбайлас жемқорлыққа қарсы іс-қимыл туралы» Заң')}, 24, 24-1, 24-3-баптар.)</p>`,
      `<p><strong>Гарантии закона.</strong> Лицо, сообщившее о факте коррупции, находится под защитой государства (ст. 24); по просьбе сообщившего с ним заключается соглашение о неразглашении, и сведения о его обращении конфиденциальны (ст. 24-1, 24-3), а трудовые права защищаются в течение 3 лет (ст. 24-1). Сообщившие заведомо ложную информацию несут ответственность по закону. (${ui.extLink(adiletUrl(corr, lang), 'Закон «О противодействии коррупции»')}, ст. 24, 24-1, 24-3.)</p>`,
      `<p><strong>Legal guarantees.</strong> A person who reports corruption is protected by the state (Art. 24); at their request a non-disclosure agreement is concluded with them so that information about the report stays confidential (Arts. 24-1, 24-3), and their employment rights are protected for 3 years (Art. 24-1). Knowingly false reports carry legal liability. (${ui.extLink(adiletUrl(corr, lang), 'Law “On Combating Corruption”')}, Arts. 24, 24-1, 24-3.)</p>`);
    const legalActs = ['corr', 'ethics', 'edu', 'teacher'].map((id) => {
      const a = act(id);
      return { href: adiletUrl(a, lang), title: a.kind === 'law' ? X(`${a.title.kz} Заң`, `Закон ${a.title.ru}`, `Law ${a.title.en}`) : a.title, note: X(`${a.date.split('-').reverse().join('.')} ж. № ${a.number}`, `от ${a.date.split('-').reverse().join('.')} № ${a.number}`, `${a.date.split('-').reverse().join('.')}, No. ${a.number}`) };
    });
    const legal = `<div class="dz-row dx-row-gap">${reportMore}${ui.legal(legalActs, { note: guaranteesNote })}</div>`;

    const related = ui.linkList([
      { href: href('feedback'), icon: 'chat', label: X('Кері байланыс', 'Обратная связь', 'Feedback'), note: X('Өтініш немесе шағым жіберу', 'Отправить обращение или жалобу', 'Send an appeal or complaint') },
      { href: href('finance'), icon: 'coins', label: X('Қаржылық есептер', 'Финансовые отчёты', 'Financial reports') },
      { href: href('structure'), icon: 'sitemap', label: X('Басқару құрылымы', 'Структура управления', 'Governance structure') },
      { href: href('legislation'), icon: 'book', label: X('Нормативтік құқықтық актілер', 'Нормативные правовые акты', 'Legislation') },
    ]);

    return [
      hotline,
      ui.section({ id: 'principles', eyebrow: X('Ұстаным', 'Позиция школы', 'Our stance'), title: X('Негізгі қағидаттар', 'Основные принципы', 'Key principles'), lead: X('Мектеп сыбайлас жемқорлыққа қарсы іс-қимылда заң мен педагогикалық әдеп қағидаларын басшылыққа алады.', 'В противодействии коррупции школа руководствуется законом и правилами педагогической этики.', 'The school follows the law and the rules of teaching ethics in preventing corruption.'), body: principles }),
      ui.section({ id: 'forbidden', tone: 'hero', eyebrow: X('Заңсыз ақша жинауға тыйым', 'Запрет поборов', 'No illegal collections'), title: X('Не нәрсеге тыйым салынады', 'Что запрещено', 'What is forbidden'), lead: X('Мұндай жағдайға тап болсаңыз — төлемеңіз және хабарлаңыз.', 'Если вы столкнулись с таким — не платите и сообщите.', 'If this happens to you, do not pay — report it.'), body: forbidden }),
      ui.section({ id: 'report', eyebrow: X('Әрекет ету тәртібі', 'Порядок действий', 'What to do'), title: X('Сыбайлас жемқорлық туралы қалай хабарлауға болады', 'Как сообщить о коррупции', 'How to report corruption'), body: report + legal }),
      ui.section({ id: 'ethics', eyebrow: X('Жауапты тұлға', 'Ответственное лицо', 'Responsible person'), title: X('Әдеп жөніндегі уәкіл және құжаттар', 'Уполномоченный по этике и документы', 'Ethics officer and documents'), body: officer }),
      ui.section({ id: 'acts', title: X('Осы бөлімде', 'В этом разделе', 'In this section'), body: related, actions: ui.button({ href: href('legislation'), label: X('Барлық актілер', 'Все акты', 'All acts'), kind: 'ghost', icon: 'arrow-right' }) }),
    ].join('\n');
  },
};
