// Запуск: node app/parse.test.js
const assert = require('assert');
const { parseChat } = require('./parse.js');

assert.deepStrictEqual(
  parseChat('Здравствуйте! Меня зовут Анна Смирнова, ищем двушку в Приморском районе, вторичка, бюджет до 12,5 млн, будем брать в ипотеку. Мой номер +7 921 123-45-67'),
  { name: 'Анна Смирнова', phone: '+7 921 123-45-67', budget: 12500000, rooms: 2, district: 'Приморский', type: 'вторичка', mortgage: true },
);

assert.deepStrictEqual(
  parseChat('Добрый день, это Игорь. Нужна 1-к в новостройке, Московский р-н, до 8 200 000 ₽, без ипотеки. 8 (900) 000-00-15'),
  { name: 'Игорь', phone: '8 (900) 000-00-15', budget: 8200000, rooms: 1, district: 'Московский', type: 'новостройка', mortgage: false },
);

assert.strictEqual(parseChat('Ищу студию').rooms, 0);
assert.strictEqual(parseChat('нужна 3-х комнатная').rooms, 3);
assert.strictEqual(parseChat('просто привет').budget, 0);

console.log('parse.test.js: ok');
