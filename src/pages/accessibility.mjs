// How to use the low-vision version & accessibility statement.
export default {
  slug: 'accessibility',
  group: 'util',
  order: 30,
  title: { kz: 'Сайттың қолжетімділігі', ru: 'Доступность сайта', en: 'Website accessibility' },
  description: {
    kz: 'Көру қабілеті нашар адамдарға арналған нұсқаны қалай пайдалану керек: қаріп, түс схемасы, суреттер, пернетақтамен басқару.',
    ru: 'Как пользоваться версией для слабовидящих: шрифт, цветовая схема, изображения, управление с клавиатуры.',
    en: 'How to use the low-vision version: font size, colour schemes, images, keyboard navigation.',
  },
  published: '2026-09-24T10:00',
  updated: '2026-09-24T10:00',
  render(lang, { ui, L, t, S, href }) {
    const X = (kz, ru, en) => ({ kz, ru, en });
    const steps = ui.steps([
      { title: X('Батырманы басыңыз', 'Нажмите кнопку', 'Press the button'), text: X(`Әр беттің жоғарғы жолағындағы «${t('a11y.button')}» (көз белгісі) батырмасын басыңыз.`, `Нажмите кнопку «${t('a11y.button')}» (значок глаза) в верхней строке любой страницы.`, `Press “${t('a11y.button')}” (the eye icon) in the top bar of any page.`) },
      { title: X('Баптауларды таңдаңыз', 'Выберите настройки', 'Choose settings'), text: X('Жоғарыда пайда болған панельде қаріп өлшемін, түс схемасын, әріп және жол аралығын таңдаңыз, суреттерді өшіріңіз.', 'На появившейся панели выберите размер шрифта, цветовую схему, интервалы и отключите изображения.', 'In the panel that appears, pick the font size, colour scheme and spacing, or turn images off.') },
      { title: X('Баптаулар сақталады', 'Настройки сохраняются', 'Settings are saved'), text: X('Таңдауыңыз осы браузерде сақталады және сайттың барлық беттерінде қолданылады.', 'Выбор сохраняется в этом браузере и действует на всех страницах сайта.', 'Your choice is saved in this browser and applies to every page.') },
      { title: X('Қалыпты нұсқаға оралу', 'Возврат к обычной версии', 'Back to standard'), text: X(`Панельдегі «${t('a11y.exit')}» батырмасын басыңыз.`, `Нажмите «${t('a11y.exit')}» на панели.`, `Press “${t('a11y.exit')}” in the panel.`) },
    ]);
    const settings = ui.table({
      caption: X('Панельдегі баптаулар', 'Настройки панели', 'Panel settings'),
      head: [X('Баптау', 'Настройка', 'Setting'), X('Мәндері', 'Значения', 'Options')],
      rows: [
        [t('a11y.font'), 'A (100%) · A+ (130%) · A++ (160%)'],
        [t('a11y.scheme'), [t('a11y.scheme.wb'), t('a11y.scheme.bw'), t('a11y.scheme.blue'), t('a11y.scheme.beige')].join(' · ')],
        [t('a11y.images'), `${t('a11y.on')} · ${t('a11y.off')}`],
        [t('a11y.spacing'), `${t('a11y.normal')} · ${t('a11y.wide')}`],
        [t('a11y.lh'), `${t('a11y.normal')} · ${t('a11y.wide')}`],
      ],
    });
    const keys = ui.table({
      caption: X('Пернетақтамен басқару', 'Управление с клавиатуры', 'Keyboard navigation'),
      head: [X('Перне', 'Клавиша', 'Key'), X('Әрекет', 'Действие', 'Action')],
      rows: [
        ['<kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd>', X('Сілтемелер мен батырмалар бойынша жылжу', 'Переход по ссылкам и кнопкам', 'Move between links and buttons')],
        ['<kbd>Enter</kbd> / <kbd>Space</kbd>', X('Мәзірді ашу, батырманы басу', 'Открыть меню, нажать кнопку', 'Open a menu, press a button')],
        ['<kbd>↓</kbd> <kbd>↑</kbd> <kbd>←</kbd> <kbd>→</kbd>', X('Мәзір пункттері бойынша жылжу', 'Перемещение по пунктам меню', 'Move through menu items')],
        ['<kbd>Esc</kbd>', X('Ашық мәзірді жабу', 'Закрыть открытое меню', 'Close an open menu')],
      ],
    });
    const features = ui.cards([
      { icon: 'arrow-right', title: X('Негізгі мазмұнға өту', 'Переход к содержанию', 'Skip link'), text: X('Tab пернесін бірінші басқанда мәзірді өткізіп жіберуге мүмкіндік беретін сілтеме пайда болады.', 'При первом нажатии Tab появляется ссылка, позволяющая пропустить меню.', 'The first Tab press reveals a link that skips the menu.') },
      { icon: 'pause', title: X('Анимацияны тоқтату', 'Остановка анимации', 'Pause animation'), text: X('Басты беттегі қозғалатын элементтерді бір батырмамен тоқтатуға болады; жүйелік «қозғалысты азайту» баптауы да ескеріледі.', 'Движущиеся элементы на главной странице останавливаются одной кнопкой; учитывается и системная настройка «уменьшить движение».', 'Moving elements on the home page stop with one button; the system “reduce motion” setting is respected too.') },
      { icon: 'languages', title: X('Үш тіл', 'Три языка', 'Three languages'), text: X('Тілді ауыстырғанда сол бет ашылады. Негізгі тіл — қазақ тілі.', 'При смене языка открывается та же страница. Основной язык — казахский.', 'Switching the language keeps you on the same page. Kazakh is the default.') },
      { icon: 'search', title: X('Іздеу және сайт картасы', 'Поиск и карта сайта', 'Search and site map'), text: X('Кез келген бетті іздеу немесе сайт картасы арқылы табуға болады.', 'Любую страницу можно найти через поиск или карту сайта.', 'Any page can be found through search or the site map.') },
    ], { cols: 4 });
    return [
      ui.section({ title: X('Нұсқаны қалай қосу керек', 'Как включить версию', 'How to switch it on'), body: steps + `<div class="cluster" style="margin-top:24px">${ui.button({ label: t('a11y.title'), iconLeft: 'eye', attrs: { 'data-a11y-open': '' } })}</div>` }),
      ui.section({ title: X('Баптаулар', 'Настройки', 'Settings'), body: ui.grid({ cols: 2, items: [settings, keys] }) }),
      ui.section({ title: X('Сайттың басқа мүмкіндіктері', 'Другие возможности сайта', 'Other features'), body: features }),
      ui.section({ tone: 'card', title: X('Қолжетімділік туралы мәлімдеме', 'Заявление о доступности', 'Accessibility statement'), body: ui.prose(L(X(
        `<p>Сайт ҚР СТ 2191-2023 стандартының (AA деңгейі) талаптарын ескере отырып әзірленді: семантикалық белгілеу, суреттердің балама мәтіні, мәтін мен фон арасындағы кемінде 4,5:1 контраст, барлық функцияларды пернетақтамен басқару, 200% масштабта көлденең айналдырусыз жұмыс.</p><p>Егер сайтты пайдалану кезінде қиындыққа тап болсаңыз, бізге <a href="${href('feedback')}">кері байланыс формасы</a> арқылы немесе <a href="tel:${S.contacts.phone.tel}">${S.contacts.phone.display}</a> телефоны бойынша хабарлаңыз.</p>`,
        `<p>Сайт разработан с учётом требований стандарта СТ РК 2191-2023 (уровень AA): семантическая разметка, альтернативный текст изображений, контраст текста не ниже 4,5:1, управление всеми функциями с клавиатуры, работа при масштабе 200% без горизонтальной прокрутки.</p><p>Если вы столкнулись с трудностями при использовании сайта, сообщите нам через <a href="${href('feedback')}">форму обратной связи</a> или по телефону <a href="tel:${S.contacts.phone.tel}">${S.contacts.phone.display}</a>.</p>`,
        `<p>The site was built following the ST RK 2191-2023 standard (level AA): semantic markup, text alternatives for images, text contrast of at least 4.5:1, full keyboard operation, and working at 200% zoom without horizontal scrolling.</p><p>If anything is hard to use, please tell us via the <a href="${href('feedback')}">feedback form</a> or by phone <a href="tel:${S.contacts.phone.tel}">${S.contacts.phone.display}</a>.</p>`,
      ))) }),
    ].join('\n');
  },
};
