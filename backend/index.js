const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan'); 
const passport = require('passport');
require('./config/passport'); // Добавьте эту строку ПЕРЕД маршрутами
const { sequelize, authenticateDB } = require('./config/db'); 

const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger'); 

const eventRoutes = require('./routes/eventRoutes'); 
const userRoutes = require('./routes/userRoutes'); 
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protectedRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080; 

// Логируем только запросы, начинающиеся с /api
app.use('/api', morgan(':method :url :status :res[content-length] - :response-time ms'));

// Настройка Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());
app.use(cors());
app.use(passport.initialize());

// Подключение маршрутов
app.use('/api', eventRoutes);
app.use('/api', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes); // Защищённые маршруты

app.get('/', (req, res) => {
  res.json({ message: 'Сервер работает!' });
});

sequelize.sync({ force: false }) // force: false - чтобы не пересоздавать таблицы каждый раз
  .then(() => {
    console.log('База данных синхронизирована.');
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    }).on('error', (err) => {
      // Обработка ошибок
      if (err.code === 'EADDRINUSE') {
        console.error(`Порт ${PORT} уже занят.`);
        process.exit(1); 
      } else {
        console.error('Ошибка при запуске сервера:', err);
        process.exit(1);
      }
    });
  })
  .catch((err) => {
    console.error('Ошибка при синхронизации базы данных:', err);
  });


