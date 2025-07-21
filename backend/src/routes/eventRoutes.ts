import express from 'express';
const router = express.Router();
import Event from '@models/event';
import User from '@models/user';
import { Request, Response } from 'express';

import jwt from 'jsonwebtoken';

const authenticateToken = (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    (req as any).user = user;
    next();
  });
};
/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Управление мероприятиями
 */

/**
 * @swagger
 * /api/events:
 *   get:
 *     tags: [Events]
 *     summary: Получить все мероприятия
 *     responses:
 *       200:
 *         description: Успешный запрос
 *       500:
 *         description: Ошибка сервера
 */
router.get('/events', async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [{ model: User, as: 'creator', attributes: ['name', 'email'] }],
    });
    res.json(events);
  } catch (err) {
    console.error('Ошибка при получении событий:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     tags: [Events]
 *     summary: Получить мероприятие по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Успешный запрос
 *       404:
 *         description: Мероприятие не найдено
 *       500:
 *         description: Ошибка сервера
 */
router.get('/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id, {
      include: [{ model: User, as: 'creator', attributes: ['name', 'email'] }],
    });
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: 'Событие не найдено' });
    }
  } catch (err) {
    console.error('Ошибка при получении события:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     tags: [Events]
 *     summary: Обновить мероприятие
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *               createdby:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Мероприятие обновлено
 *       400:
 *         description: Неверные данные
 *       404:
 *         description: Мероприятие не найдено
 *       500:
 *         description: Ошибка сервера
 */

router.put(
  '/events/:id',
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const { id } = req.params;
      const { title, description, date, location, createdby } = req.body;

      const event = await Event.findByPk(id);
      if (!event) {
        res.status(404).json({ message: 'Событие не найдено' });
        return;
      }

      if (title) event.title = title;
      if (description) event.description = description;
      if (date) event.date = date;
      if (location) event.location = location;
      if (createdby) event.createdby = createdby;

      await event.save();
      res.json(event);
    } catch (err) {
      console.error('Ошибка при обновлении события:', err);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  },
);

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     tags: [Events]
 *     summary: Удалить мероприятие
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Мероприятие удалено
 *       404:
 *         description: Мероприятие не найдено
 *       500:
 *         description: Ошибка сервера
 */
router.delete(
  '/events/:id',
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const { id } = req.params;
      const event = await Event.findByPk(id);
      if (!event) {
        res.status(404).json({ message: 'Событие не найдено' });
        return;
      }

      await event.destroy();
      res.status(204).send();
    } catch (err) {
      console.error('Ошибка при удалении события:', err);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  },
);

export default router;
