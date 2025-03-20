const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { sequelize, authenticateDB } = require('./config/db'); // Импорт sequelize и authenticateDB

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.json({ message: 'Сервер работает!' });
});

app.listen(PORT, async (err) => {
  if (err) {
    console.error('Ошибка при запуске сервера:', err);
  } else {
    console.log(`Сервер запущен на http://localhost:${PORT}`);

    // Проверка подключения к базе данных
    await authenticateDB();
  }
});