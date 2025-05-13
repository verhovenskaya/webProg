import BlacklistedToken from '../model/blackListToken';
import cron from 'node-cron';
import { Sequelize } from 'sequelize';

export default () => {
  // Очищаем просроченные токены каждый день в 3:00
  cron.schedule('0 3 * * *', async () => {
    try {
      await BlacklistedToken.destroy({
        where: {
          expires_at: { [Sequelize.Op.lt]: new Date() }
        }
      });
      console.log('Очищены просроченные токены');
    } catch (err) {
      console.error('Ошибка очистки токенов:', err);
    }
  });
};