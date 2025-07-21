# Event Management System

Полнофункциональная система управления мероприятиями с React frontend и Node.js backend.

## Структура проекта

- `backend/` - Node.js + Express + TypeScript + PostgreSQL
- `frontend/` - React + TypeScript + Vite

## Установка и запуск

### Backend

1. Перейдите в папку backend:
```bash
cd backend
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` в папке backend со следующим содержимым:
```env
PORT=8080
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=events_db
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:5173
EVENT_LIMIT_PER_DAY=5
```

4. Убедитесь, что PostgreSQL запущен и создайте базу данных `events_db`

5. Запустите сервер разработки:
```bash
npm run dev
```

### Frontend

1. Перейдите в папку frontend:
```bash
cd frontend
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите сервер разработки:
```bash
npm run dev
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `POST /api/auth/logout` - Выход
- `GET /api/me` - Информация о текущем пользователе

### Events
- `GET /api/events` - Получить все мероприятия
- `GET /api/events/:id` - Получить мероприятие по ID
- `POST /api/events` - Создать мероприятие (требует авторизации)
- `PUT /api/events/:id` - Обновить мероприятие
- `DELETE /api/events/:id` - Удалить мероприятие

### Users
- `GET /api/users` - Получить всех пользователей
- `GET /api/users/:id` - Получить пользователя по ID
- `POST /api/users` - Создать пользователя
- `PUT /api/users/:id` - Обновить пользователя
- `DELETE /api/users/:id` - Удалить пользователя

## Swagger Documentation

API документация доступна по адресу: `http://localhost:8080/api-docs`

## Исправленные проблемы

1. ✅ Исправлены импорты в моделях (использование правильных алиасов)
2. ✅ Добавлена недостающая зависимость `morgan`
3. ✅ Исправлена конфигурация TypeScript
4. ✅ Исправлены API вызовы в frontend
5. ✅ Добавлен маршрут `/api/me` для получения информации о пользователе
6. ✅ Исправлены middleware и типизация
7. ✅ Убрано дублирование в API конфигурации

## Технологии

### Backend
- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- Passport.js
- Swagger/OpenAPI
- bcryptjs
- cors

### Frontend
- React 19
- TypeScript
- Vite
- React Router DOM
- Axios
- SCSS Modules