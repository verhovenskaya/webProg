import express from 'express';
const router = express.Router();
import passport from 'passport';
import Event from '@models/event';
import User from '@models/user';
import checkEventLimit from '@middleware/eventLimit';
import { Request, Response } from 'express';

router.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req.user as { id: number }).id;
      const user = await User.findByPk(userId, {
        attributes: ['id', 'name', 'email', 'createdat'],
      });

      if (!user) {
        res.status(404).json({ message: 'Пользователь не найден' });
        return;
      }

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        createdat: user.createdat,
      });
    } catch (err) {
      console.error('Ошибка получения данных пользователя:', err);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  },
);

/**
 * @swagger
 * /api/events:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [Events]
 *     summary: Создать мероприятие (требуется авторизация)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - date
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Мероприятие создано
 *       401:
 *         description: Не авторизован
 *       400:
 *         description: Неверные данные
 *       500:
 *         description: Ошибка сервера
 */
router.post(
  '/events',
  passport.authenticate('jwt', { session: false }),
  checkEventLimit,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description, date, location } = req.body;

      if (!title || !date) {
        res.status(400).json({ message: 'Укажите название и дату' });
        return;
      }

      const event = await Event.create({
        title,
        description,
        date,
        location,
        createdby: (req.user as { id: number }).id,
      });

      res.status(201).json(event);
    } catch (err) {
      console.error('Ошибка создания события:', err);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  },
);

export default router;
