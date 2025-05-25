import express from 'express';
const router = express.Router();
import passport from 'passport';
import Event from '../model/event';
import checkEventLimit from '../middleware/eventLimit';
import { Request, Response } from 'express';

/**
 * @swagger
 * /api/events:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [Events]
 *     summary: Создать мероприятие (требуется авторизация)
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
