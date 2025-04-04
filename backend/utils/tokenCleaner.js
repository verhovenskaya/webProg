const BlacklistedToken = require('../model/blackListToken');
const cron = require('node-cron');

module.exports = () => {
  // Очищаем просроченные токены каждый день в 3:00
  cron.schedule('0 3 * * *', async () => {
    try {
      await BlacklistedToken.destroy({
        where: {
          expiresAt: { [Sequelize.Op.lt]: new Date() }
        }
      });
      console.log('Очищены просроченные токены');
    } catch (err) {
      console.error('Ошибка очистки токенов:', err);
    }
  });
};