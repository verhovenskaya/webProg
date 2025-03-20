const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { sequelize, authenticateDB } = require('./config/db'); // Импорт sequelize и authenticateDB

const eventRoutes = require('./routes/eventRoutes'); 
const Event = require('./model/event'); 
const User = require('./model/user'); 
const userRoutes = require('./routes/userRoutes'); 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

// Подключение маршрутов
app.use('/api', eventRoutes);
app.use('/api', userRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Сервер работает!' });
});

sequelize.sync({ force: false }) // force: false - чтобы не пересоздавать таблицы каждый раз
  .then(() => {
    console.log('База данных синхронизирована.');
    // Запуск сервера после успешной синхронизации
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    }).on('error', (err) => {
      // Обработка ошибок
      if (err.code === 'EADDRINUSE') {
        console.error(`Порт ${PORT} уже занят.`);
        process.exit(1); // Завершение процесса с кодом ошибки
      } else {
        console.error('Ошибка при запуске сервера:', err);
        process.exit(1);
      }
    });
  })
  .catch((err) => {
    console.error('Ошибка при синхронизации базы данных:', err);
  });

