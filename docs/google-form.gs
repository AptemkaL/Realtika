/**
 * Создаёт Google Форму «Realtika — отзыв агента» и таблицу для ответов.
 * Как запустить: script.google.com → «Новый проект» → вставить этот код вместо пустого →
 * сохранить → вверху выбрать функцию createRealtikaForm → «Выполнить» → разрешить доступ.
 * Ссылки на форму и таблицу появятся внизу, в «Журнале выполнения».
 */
function createRealtikaForm() {
  const SITE = 'https://aptemkal.github.io/Realtika/';
  const TEST_DOC = 'https://docs.google.com/document/d/1FnQ35BDs2002mK1Za78hVfX4F-aRXoA63qGTJTTtVJ0/edit';

  const form = FormApp.create('Realtika — отзыв агента');
  form.setDescription(
    'Спасибо, что тестируете Realtika — CRM для агентств недвижимости, которую заполняет ИИ.\n' +
    'Сначала пройдите сценарии по инструкции: ' + TEST_DOC + '\n' +
    'Сайт: ' + SITE + ' (вход: любой демо-аккаунт, пароль demo).\n' +
    'Займёт 10 минут. Критика ценнее комплиментов.'
  );
  form.setProgressBar(true);
  form.setConfirmationMessage('Спасибо! Итоги исследования пришлю всем участникам.');

  // --- О вас
  form.addSectionHeaderItem().setTitle('О вас');
  form.addTextItem().setTitle('Имя').setRequired(true);
  form.addTextItem().setTitle('Агентство').setHelpText('Можно не указывать');
  form.addMultipleChoiceItem().setTitle('Ваша роль')
    .setChoiceValues(['Агент', 'Руководитель отдела продаж', 'Директор']).showOtherOption(true).setRequired(true);
  form.addTextItem().setTitle('Сколько лет в недвижимости?');
  form.addMultipleChoiceItem().setTitle('Сколько агентов в агентстве?')
    .setChoiceValues(['1–5', '6–20', '21–50', 'Больше 50']);
  form.addCheckboxItem().setTitle('С чем работаете?')
    .setChoiceValues(['Вторичка', 'Новостройки', 'Аренда', 'Загородная']).showOtherOption(true);
  form.addCheckboxItem().setTitle('Где сейчас ведёте клиентов?')
    .setChoiceValues(['amoCRM', 'Битрикс24', 'Excel или Google Таблицы', 'Мессенджеры и блокнот']).showOtherOption(true);
  form.addMultipleChoiceItem().setTitle('С какого устройства проходили тест?')
    .setChoiceValues(['Телефон', 'Компьютер', 'Оба']).setRequired(true);

  // --- Сценарии
  form.addPageBreakItem().setTitle('Сценарии').setHelpText('Оцените каждый сценарий: 1 — неудобно и непонятно, 5 — пользовался бы каждый день.');
  form.addGridItem().setTitle('Оценка сценариев')
    .setRows([
      '1. Новый клиент из переписки',
      '2. Сделка по этапам с вопросами ИИ',
      '3. Подбор квартиры при клиенте',
      '4. Выставить квартиру на продажу',
      '5. Рабочий день агента',
      '6. Для руководителей',
    ])
    .setColumns(['1', '2', '3', '4', '5', 'Не проходил']);
  form.addParagraphTextItem().setTitle('Что было непонятно или неудобно в сценариях?')
    .setHelpText('Укажите номер сценария и что бы вы сделали иначе');

  // --- Впечатление
  form.addPageBreakItem().setTitle('Впечатление от Realtika');
  form.addScaleItem().setTitle('Насколько вероятно, что вы посоветуете Realtika коллеге?')
    .setBounds(0, 10).setLabels('Точно нет', 'Точно да').setRequired(true);
  form.addParagraphTextItem().setTitle('Какие 2–3 функции самые полезные?');
  form.addParagraphTextItem().setTitle('Что оказалось лишним или мешало?');
  form.addParagraphTextItem().setTitle('Где запутались или не поняли, что делать?');
  form.addScaleItem().setTitle('Насколько точно ИИ разобрал переписку и заметки?')
    .setBounds(1, 5).setLabels('Мимо', 'Точно');
  form.addScaleItem().setTitle('Удобно ли пользоваться с телефона?')
    .setBounds(1, 5).setLabels('Неудобно', 'Удобно');

  // --- Работа сейчас
  form.addPageBreakItem().setTitle('Ваша работа сейчас');
  form.addMultipleChoiceItem().setTitle('Сколько времени в день уходит на заполнение CRM или таблиц?')
    .setChoiceValues(['Меньше 15 минут', '15–30 минут', '30–60 минут', 'Больше часа']);
  form.addParagraphTextItem().setTitle('Этапы в Realtika совпадают с вашим процессом? Чего не хватает, что лишнее?');
  form.addParagraphTextItem().setTitle('Записываете звонки с клиентами? Реально ли требовать запись звонка для перехода на следующий этап?');
  form.addParagraphTextItem().setTitle('Как отслеживаете брони и сроки? Бывало, что бронь сгорела?');
  form.addParagraphTextItem().setTitle('Как отслеживаете комиссию от застройщика или продавца? Были задержки или забытые счета?');
  form.addParagraphTextItem().setTitle('Как публикуете объявления на Авито и Циан? Сколько времени уходит на одно?');
  form.addParagraphTextItem().setTitle('Теряли клиентов, потому что забыли написать или перезвонить? Как часто?');

  // --- Деньги
  form.addPageBreakItem().setTitle('Деньги');
  form.addTextItem().setTitle('Сколько агентство платит за CRM сейчас, за одного агента в месяц?');
  form.addMultipleChoiceItem().setTitle('Сколько готовы платить за такую CRM за одного агента в месяц?')
    .setChoiceValues(['До 500 ₽', '500–1000 ₽', '1000–2000 ₽', 'Больше 2000 ₽', 'Не стал бы платить']);
  form.addTextItem().setTitle('Кто у вас решает, какую CRM покупать?');

  // --- Напоследок
  form.addPageBreakItem().setTitle('Напоследок');
  form.addParagraphTextItem().setTitle('Какую одну вещь в работе агента вы убрали бы навсегда?');
  form.addParagraphTextItem().setTitle('Чего не хватает в Realtika, чтобы вы начали ей пользоваться?');
  form.addTextItem().setTitle('Можно связаться с вами для 15-минутного звонка по итогам? Оставьте контакт');

  // Ответы автоматически складываются в таблицу
  const sheet = SpreadsheetApp.create('Realtika — ответы агентов');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  // Новые формы Google иногда создаёт неопубликованными — публикуем и открываем приём ответов
  try { form.setPublished(true); } catch (e) { /* метода нет в старых версиях — форма уже опубликована */ }
  form.setAcceptingResponses(true);

  Logger.log('Ссылка для агентов: ' + form.getPublishedUrl());
  Logger.log('Редактировать форму: ' + form.getEditUrl());
  Logger.log('Таблица ответов: ' + sheet.getUrl());
}
