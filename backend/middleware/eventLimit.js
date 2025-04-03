const Event = require('../model/event'); 
const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');

dotenv.config();

const checkEventLimit = async (req, res, next) => {
  console.log('Middleware checkEventLimit вызван'); 
  
  // Берем ID пользователя из объекта req.user, а не из тела запроса
  const createdby = req.user.id;

  const eventLimit = parseInt(process.env.EVENT_LIMIT_PER_DAY, 10);
  console.log('Лимит событий:', eventLimit); 

  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
  console.log('Временной диапазон:', twentyFourHoursAgo, 'до', now); 

  try {
      const eventCount = await Event.count({
          where: {
              createdby,
              date: { [Sequelize.Op.gte]: twentyFourHoursAgo }
          }
      });
      console.log('Количество событий за последние 24 часа:', eventCount); 

      if (eventCount >= eventLimit) {
          console.log('Лимит превышен'); 
          return res.status(429).json({ message: 'Превышен лимит создания мероприятий за день' });
      }

      next();
  } catch (err) {
      console.error("Ошибка при проверке лимита событий:", err);
      res.status(500).json({ message: 'Ошибка сервера' });
  }
};

module.exports = checkEventLimit;