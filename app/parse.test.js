// Запуск: node app/parse.test.js
const assert = require('assert');
const { parseChat, parseListing } = require('./parse.js');
const SUNDAY = new Date(2026, 9, 11); // 11.10.2026, воскресенье

assert.deepStrictEqual(
  parseChat('Здравствуйте! Меня зовут Анна Смирнова, ищем двушку в Приморском районе, вторичка, бюджет до 12,5 млн, будем брать в ипотеку. Мой номер +7 921 123-45-67'),
  { name: 'Анна Смирнова', phone: '+7 921 123-45-67', budget: 12500000, rooms: 2, district: 'Приморский', type: 'вторичка', payment: 'ипотека' },
);

assert.deepStrictEqual(
  parseChat('Добрый день, это Игорь. Нужна 1-к в новостройке, Московский р-н, до 8 200 000 ₽, без ипотеки. 8 (900) 000-00-15'),
  { name: 'Игорь', phone: '8 (900) 000-00-15', budget: 8200000, rooms: 1, district: 'Московский', type: 'новостройка', payment: 'наличные' },
);

// заметка агента после звонка: взнос не путается с бюджетом, есть следующий шаг и этап
assert.deepStrictEqual(
  parseChat('Созвонился с клиентом. Ипотека одобрена, первоначальный взнос 3 млн, бюджет вырос до 14 млн. Продают свою однушку. Встреча в четверг в офисе.', SUNDAY),
  { downPayment: 3000000, budget: 14000000, payment: 'ипотека', mortgageApproved: true, alternative: true, next: { kind: 'Встреча', inDays: 4 }, stage: 'Встреча назначена' },
);

assert.deepStrictEqual(parseChat('Встреча прошла, клиент пришёл с Авито, показ завтра', SUNDAY),
  { source: 'Авито', next: { kind: 'Показ', inDays: 1 }, stage: 'Встреча прошла' });

assert.strictEqual(parseChat('Ищу студию').rooms, 0);
assert.strictEqual(parseChat('нужна 3-х комнатная').rooms, 3);
assert.deepStrictEqual(parseChat('просто привет'), {});

// описание квартиры от собственника
assert.deepStrictEqual(
  parseListing('Двушка 54 кв.м, кухня 9 м², 7/12 эт., ул. Савушкина, д. 12, Приморский район. Евроремонт, санузел раздельный, есть лоджия. Цена 11,9 млн.'),
  { rooms: 2, district: 'Приморский', price: 11900000, area: 54, kitchen: 9, floor: 7, floors: 12, address: 'ул. Савушкина, д. 12', renovation: 'евро', bathroom: 'раздельный', balcony: true },
);
assert.deepStrictEqual(
  parseListing('Продаю 1-к квартиру 36 метров на 3 этаже 5-этажного дома, без ремонта, без балкона, санузел совмещенный'),
  { rooms: 1, area: 36, floor: 3, floors: 5, renovation: 'без ремонта', bathroom: 'совмещённый', balcony: false },
);
assert.deepStrictEqual(parseListing('просто текст'), {});

console.log('parse.test.js: ok');
