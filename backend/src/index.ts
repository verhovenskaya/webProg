import 'module-alias/register';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import passport from 'passport';
import checkBlackListToken from './middleware/checkBlackListToken';
import '@config/passport';
import { sequelize } from '@config/db';

import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './swagger';

import eventRoutes from '@routes/eventRoutes';
import userRoutes from '@routes/userRoutes';
import authRoutes from '@routes/authRoutes';
import protectedRoutes from '@routes/protectedRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Логируем только запросы, начинающиеся с /api
app.use(
  '/api',
  morgan(':method :url :status :res[content-length] - :response-time ms'),
);

// Настройка Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const corsOptions = {
  origin: ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(checkBlackListToken);
app.use(passport.initialize());



// Подключение маршрутов
app.use('/api', eventRoutes);
app.use('/api', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Сервер работает!' });
});

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('База данных синхронизирована.');
    app
      .listen(PORT, () => {
        console.log(`Сервер запущен на порту ${PORT}`);
      })
      .on('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE') {
          console.error(`Порт ${PORT} уже занят.`);
          process.exit(1);
        } else {
          console.error('Ошибка при запуске сервера:', err);
          process.exit(1);
        }
      });
  })
  .catch((err: Error) => {
    console.error('Ошибка при синхронизации базы данных:', err);
  });
