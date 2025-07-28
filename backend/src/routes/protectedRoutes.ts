import express, { Request, Response, Router, NextFunction } from 'express';
const router: Router = express.Router();
import passport from 'passport';
import Event from '@models/event';
import User from '@models/user';
import checkEventLimit from '@middleware/eventLimit';

router.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  (async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        res.status(401).json({ message: 'Не авторизован' });
        return;
      }

      const user = await User.findByPk(req.user.id, {
        attributes: ['id', 'firstName', 'lastName', 'email', 'createdat'],
      });

      if (!user) {
        res.status(404).json({ message: 'Пользователь не найден' });
        return;
      }

      res.status(200).json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdat: user.createdat,
      });
    } catch (error) {
      console.error('Ошибка получения данных пользователя:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }) as express.RequestHandler
);

router.post(
  '/events',
  passport.authenticate('jwt', { session: false }),
  checkEventLimit,
  (async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        res.status(401).json({ message: 'Не авторизован' });
        return;
      }

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
        createdby: req.user.id,
      });

      res.status(201).json(event);
    } catch (error) {
      console.error('Ошибка создания события:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }) as express.RequestHandler
);

export default router;