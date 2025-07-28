import express from 'express';
const router = express.Router();
import User from '@models/user';
import { Request, Response } from 'express';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Управление пользователями
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Получить всех пользователей
 *     responses:
 *       200:
 *         description: Успешный запрос
 *       500:
 *         description: Ошибка сервера
 */
router.get('/users', async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'createdat'],
      raw: true
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Ошибка:', error);
    res.status(500).json({ 
      message: 'Ошибка сервера',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Получить пользователя по ID
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
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
router.get('/users/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'ID должен быть числом' });
      return;
    }

    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: 'Пользователь не найден' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Ошибка при получении пользователя:', error);
    res.status(500).json({ 
      message: 'Ошибка сервера',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     tags: [Users]
 *     summary: Создать нового пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               middleName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               birthDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Пользователь создан
 *       400:
 *         description: Неверные данные
 *       500:
 *         description: Ошибка сервера
 */
router.post('/users/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    if (!firstName || !lastName || !email || !password) {
      res.status(400).json({ message: 'Все обязательные поля должны быть заполнены' });
      return;
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'Пользователь с таким email уже существует' });
      return;
    }

    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error);
    res.status(500).json({ 
      message: 'Ошибка сервера',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Обновить пользователя
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
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               middleName:
 *                 type: string
 *               email:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               birthDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Пользователь обновлен
 *       400:
 *         description: Неверные данные
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
router.put('/users/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'ID должен быть числом' });
      return;
    }

    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: 'Пользователь не найден' });
      return;
    }

    if (req.body.email) {
      const existingUser = await User.findOne({ where: { email: req.body.email } });
      if (existingUser && existingUser.id !== id) {
        res.status(400).json({ message: 'Пользователь с таким email уже существует' });
        return;
      }
    }

    await user.update(req.body);
    res.status(200).json(user);
  } catch (error) {
    console.error('Ошибка при обновлении пользователя:', error);
    res.status(500).json({ 
      message: 'Ошибка сервера',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Удалить пользователя
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Пользователь удален
 *       404:
 *         description: Пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
router.delete('/users/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'ID должен быть числом' });
      return;
    }

    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: 'Пользователь не найден' });
      return;
    }

    await user.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Ошибка при удалении пользователя:', error);
    res.status(500).json({ 
      message: 'Ошибка сервера',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;