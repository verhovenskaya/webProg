const Event = require('../model/event'); // Убедитесь, что путь правильный
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');

dotenv.config();

const checkEventLimit = async (req, res, next) => {
  console.log('Middleware checkEventLimit вызван'); // Отладочное сообщение
  const { createdby } = req.body;

  if (!createdby) {
      console.log('Не указан createdby'); // Отладочное сообщение
      return res.status(400).json({ message: 'Необходимо указать создателя мероприятия' });
  }

  const eventLimit = parseInt(process.env.EVENT_LIMIT_PER_DAY, 10);
  console.log('Лимит событий:', eventLimit); // Отладочное сообщение

  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
  console.log('Временной диапазон:', twentyFourHoursAgo, 'до', now); // Отладочное сообщение

  try {
      const eventCount = await Event.count({
          where: {
              createdby,
              date: { [Sequelize.Op.gte]: twentyFourHoursAgo }
          }
      });
      console.log('Количество событий за последние 24 часа:', eventCount); // Отладочное сообщение

      if (eventCount >= eventLimit) {
          console.log('Лимит превышен'); // Отладочное сообщение
          return res.status(429).json({ message: 'Превышен лимит создания мероприятий за день' });
      }

      next();
  } catch (err) {
      console.error("Ошибка при проверке лимита событий:", err);
      res.status(500).json({ message: 'Ошибка сервера' });
  }
};

module.exports = checkEventLimit;