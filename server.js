const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.urlencoded({ extended: true }));
const FILE_NAME = 'accounts.json';
function getAccounts() { if (!fs.existsSync(FILE_NAME)) return []; return JSON.parse(fs.readFileSync(FILE_NAME, 'utf-8')); }
app.get('/', (req, res) => {
 res.setHeader('Content-Type', 'text/html; charset=utf-8');
 res.send('<h1>Cubix</h1><div style="display:flex;gap:20px;"><form action="/register" method="POST"><h3>Регистрация</h3><input name="username" placeholder="Ник" required><br><input name="password" type="password" placeholder="Пароль" required><br><button>Создать</button></form><form action="/login" method="POST"><h3>Вход</h3><input name="username" placeholder="Ник" required><br><input name="password" type="password" placeholder="Пароль" required><br><button>Войти</button></form></div>');
});
app.post('/register', (req, res) => {
 res.setHeader('Content-Type', 'text/html; charset=utf-8');
 const name = req.body.username.trim(); const pass = req.body.password;
 const list = getAccounts();
 if (list.some(u => u.nick.toLowerCase() === name.toLowerCase())) return res.send('Ник занят! <a href="/">Назад</a>');
 list.push({ nick: name, pass: pass, coins: 500 });
 fs.writeFileSync(FILE_NAME, JSON.stringify(list, null, 2));
 res.send('Аккаунт создан! +500 монет. <a href="/">Назад</a>');
});
app.post('/login', (req, res) => {
 res.setHeader('Content-Type', 'text/html; charset=utf-8');
 const name = req.body.username.trim(); const pass = req.body.password;
 const u = getAccounts().find(user => user.nick.toLowerCase() === name.toLowerCase());
 if (!u) return res.send('Пользователь не найден! <a href="/">Назад</a>');
 if (u.pass === pass) res.send('<h1>Привет, ' + u.nick + '!</h1><h2>Баланс: ' + u.coins + ' монет</h2><a href="/">Выйти</a>');
 else res.send('Неверный пароль! <a href="/">Назад</a>');
});
app.listen(3000, () => console.log('=== Cubix запущен на порту 3000 ==='));