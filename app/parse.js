// ИИ-заглушка: правила вместо модели. Позже заменяется вызовом LLM с тем же форматом ответа.
// Возвращает только то, что удалось найти в тексте: отсутствующий ключ = «не упоминалось».
const DISTRICTS = {
  'адмиралтейск': 'Адмиралтейский', 'василеостровск': 'Василеостровский', 'васильевск': 'Василеостровский',
  'выборгск': 'Выборгский', 'калининск': 'Калининский', 'кировск': 'Кировский', 'красногвардейск': 'Красногвардейский',
  'красносельск': 'Красносельский', 'московск': 'Московский', 'невск': 'Невский', 'петроградк': 'Петроградский',
  'петроградск': 'Петроградский', 'приморск': 'Приморский', 'фрунзенск': 'Фрунзенский', 'центральн': 'Центральный',
};
const SOURCES = [[/авито/, 'Авито'], [/циан/, 'Циан'], [/домклик/, 'Домклик'], [/рекоменд|посоветовал/, 'Рекомендация'], [/с сайта|на сайте/, 'Сайт']];
const WEEKDAYS = [[/воскресень/, 0], [/понедельник/, 1], [/вторник/, 2], [/сред[уа]/, 3], [/четверг/, 4], [/пятниц/, 5], [/суббот/, 6]];

function parseChat(text, now = new Date()) {
  const t = text.toLowerCase().replace(/ё/g, 'е');
  const r = {};

  const phone = text.match(/(?:\+7|8)[\s(-]*\d{3}[\s)-]*\d{3}[\s-]*\d{2}[\s-]*\d{2}/);
  if (phone) r.phone = phone[0].trim();

  const name = text.match(/(?:^|[\s,.!])(?:[Мм]еня зовут|[Ээ]то|[Яя]|[Кк]лиент(?:ка)?)\s+([А-ЯЁ][а-яё]+(?:\s+[А-ЯЁ][а-яё]+)?)/);
  if (name) r.name = name[1];

  // суммы в миллионах: та, что рядом со словом «взнос», — первый взнос, первая из остальных — бюджет
  for (const m of t.matchAll(/(\d+(?:[.,]\d+)?)\s*(?:млн|миллион)/g)) {
    const v = Math.round(parseFloat(m[1].replace(',', '.')) * 1e6);
    const clause = t.slice(0, m.index).split(/[.,;!?]/).pop();
    if (/взнос|пв\b|первоначальн/.test(clause)) r.downPayment ??= v;
    else r.budget ??= v;
  }
  if (r.budget == null) {
    const raw = t.match(/(\d{1,3}(?:[\s ]\d{3}){2,})/);
    if (raw) r.budget = Number(raw[1].replace(/\D/g, ''));
  }

  // фразы про продажу своего жилья не описывают запрос клиента
  const want = t.split(/[.;!?]/).filter(s => !/прода/.test(s)).join('.');
  if (/студи/.test(want)) r.rooms = 0;
  else if (/однушк|однокомнат/.test(want)) r.rooms = 1;
  else if (/двушк|двухкомнат/.test(want)) r.rooms = 2;
  else if (/трешк|трехкомнат/.test(want)) r.rooms = 3;
  else {
    const m = want.match(/(\d)\s*-?\s*(?:х\s*)?(?:к(?![а-я])|комн)/);
    if (m) r.rooms = Number(m[1]);
  }

  const d = Object.keys(DISTRICTS).find(stem => t.includes(stem));
  if (d) r.district = DISTRICTS[d];

  if (/новостро|от застройщика/.test(t)) r.type = 'новостройка';
  else if (/вторичк|вторичн/.test(t)) r.type = 'вторичка';

  if (/без ипотек|наличн/.test(t)) r.payment = 'наличные';
  else if (/ипотек/.test(t)) r.payment = 'ипотека';
  if (/ипотек[а-я]*\s+одобрен|одобрен[а-я]*\s+ипотек|одобрил/.test(t)) r.mortgageApproved = true;

  if (/альтернатив|прода[а-я]*\s+(?:свою|свою квартиру|нашу|свою однушку|свою двушку)/.test(t)) r.alternative = true;

  const src = SOURCES.find(([re]) => re.test(t));
  if (src) r.source = src[1];

  // следующий шаг: что и когда
  let inDays = null;
  if (/послезавтра/.test(t)) inDays = 2;
  else if (/завтра/.test(t)) inDays = 1;
  else if (/сегодня/.test(t)) inDays = 0;
  else {
    const n = t.match(/через\s+(\d+)\s+дн/);
    const wd = WEEKDAYS.find(([re]) => re.test(t));
    if (n) inDays = Number(n[1]);
    else if (wd) inDays = ((wd[1] - now.getDay() + 7) % 7) || 7;
  }
  const kind = /показ/.test(t) ? 'Показ' : /встреч/.test(t) ? 'Встреча' : /позвон|созвон|перезвон/.test(t) ? 'Звонок' : null;
  if (kind && inDays != null) r.next = { kind, inDays };

  if (/встреча прошла|провели встречу|после встречи|встретились/.test(t)) r.stage = 'Встреча прошла';
  else if (r.next?.kind === 'Показ') r.stage = 'Показ';
  else if (r.next?.kind === 'Встреча') r.stage = 'Встреча назначена';
  else if (/дозвонил|созвонил|поговорил|связал/.test(t)) r.stage = 'Связались';

  return r;
}

if (typeof module !== 'undefined') module.exports = { parseChat, DISTRICTS };
