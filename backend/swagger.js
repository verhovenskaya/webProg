// swagger.js
const swaggerJsDoc = require('swagger-jsdoc');

// Настройки Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Event API',
      version: '1.0.0',
      description: 'API для управления мероприятиями и пользователями',
    },
    servers: [
      {
        url: `http://localhost:8080`, // Убедитесь, что порт совпадает с вашим сервером
      },
    ],
  },
  apis: ['./backend/routes/*.js'], // Указываем путь к файлам с роутами
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;