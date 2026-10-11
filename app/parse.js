// ИИ-заглушка: правила вместо модели. Позже заменяется вызовом LLM с тем же форматом ответа.
const DISTRICTS = {
  'адмиралтейск': 'Адмиралтейский', 'василеостровск': 'Василеостровский', 'васильевск': 'Василеостровский',
  'выборгск': 'Выборгский', 'калининск': 'Калининский', 'кировск': 'Кировский', 'красногвардейск': 'Красногвардейский',
  'красносельск': 'Красносельский', 'московск': 'Московский', 'невск': 'Невский', 'петроградк': 'Петроградский',
  'петроградск': 'Петроградский', 'приморск': 'Приморский', 'фрунзенск': 'Фрунзенский', 'центральн': 'Центральный',
};

function parseChat(text) {
  const t = text.toLowerCase().replace(/ё/g, 'е');
  const r = { name: '', phone: '', budget: 0, rooms: null, district: '', type: 'любая', mortgage: false };

  const phone = text.match(/(?:\+7|8)[\s(-]*\d{3}[\s)-]*\d{3}[\s-]*\d{2}[\s-]*\d{2}/);
  if (phone) r.phone = phone[0].trim();

  const name = text.match(/(?:^|[\s,.!])(?:[Мм]еня зовут|[Ээ]то|[Яя])\s+([А-ЯЁ][а-яё]+(?:\s+[А-ЯЁ][а-яё]+)?)/);
  if (name) r.name = name[1];

  const mln = t.match(/(\d+(?:[.,]\d+)?)\s*(?:млн|миллион)/);
  const raw = t.match(/(\d{1,3}(?:[\s ]\d{3}){2,})/);
  if (mln) r.budget = Math.round(parseFloat(mln[1].replace(',', '.')) * 1e6);
  else if (raw) r.budget = Number(raw[1].replace(/\D/g, ''));

  if (/студи/.test(t)) r.rooms = 0;
  else if (/однушк|однокомнат/.test(t)) r.rooms = 1;
  else if (/двушк|двухкомнат/.test(t)) r.rooms = 2;
  else if (/трешк|трехкомнат/.test(t)) r.rooms = 3;
  else {
    const m = t.match(/(\d)\s*-?\s*(?:х\s*)?(?:к(?![а-я])|комн)/);
    if (m) r.rooms = Number(m[1]);
  }

  const d = Object.keys(DISTRICTS).find(stem => t.includes(stem));
  if (d) r.district = DISTRICTS[d];

  if (/новостро|от застройщика/.test(t)) r.type = 'новостройка';
  else if (/вторичк|вторичн/.test(t)) r.type = 'вторичка';

  r.mortgage = /ипотек/.test(t) && !/без ипотек/.test(t);
  return r;
}

if (typeof module !== 'undefined') module.exports = { parseChat, DISTRICTS };
