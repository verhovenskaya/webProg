import { Request, Response, Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import BlacklistedToken from '@models/blackListToken';
import User from '@models/user';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

// Интерфейсы для типизации
interface IUser {
  id: number;
  email: string;
  name: string;
  password: string;
}

interface RegisterRequestBody {
  email: string;
  name: string;
  password: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

interface AuthResponse {
  message?: string;
  token?: string;
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

// Типы для запросов и ответов
type RegisterRequest = Request<
  Record<string, never>,
  unknown,
  RegisterRequestBody
>;
type LoginRequest = Request<Record<string, never>, unknown, LoginRequestBody>;
type AuthResponseType = Response<AuthResponse>;

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Успешная регистрация
 *       400:
 *         description: Ошибка валидации
 */
router.post(
  '/register',
  async (req: RegisterRequest, res: AuthResponseType): Promise<void> => {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      res.status(400).json({ message: 'Все поля обязательны' });
      return;
    }

    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        res.status(400).json({ message: 'Email уже используется' });
        return;
      }

      const user = await User.create({ email, name, password });
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
        expiresIn: '1h',
      });

      res.status(201).json({
        message: 'Регистрация успешна',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  },
  
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Авторизация пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Успешная авторизация
 *       401:
 *         description: Неверные учетные данные
 */
router.post(
  '/login',
  async (req: LoginRequest, res: AuthResponseType): Promise<void> => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({
        where: { email },
        attributes: ['id', 'email', 'name', 'password'],
      });

      if (!user) {
        res.status(401).json({ message: 'Неверные учетные данные' });
        return;
      }

      const userData = user.get() as IUser;
      const isMatch = await bcrypt.compare(password, userData.password);
      if (!isMatch) {
        res.status(401).json({ message: 'Неверные учетные данные' });
        return;
      }

      const token = jwt.sign({ id: userData.id }, process.env.JWT_SECRET!, {
        expiresIn: '1h',
      });

      res.json({
        token,
        user: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  },
);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Выход из системы
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успешный выход
 *       401:
 *         description: Не авторизован
 *       500:
 *         description: Ошибка сервера
 */
router.post(
  '/logout',
  async (req: Request, res: Response<{ message: string }>): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({ message: 'Токен отсутствует' });
        return;
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        res.status(401).json({ message: 'Неверный формат токена' });
        return;
      }

      const decoded = jwt.decode(token) as JwtPayload;
      if (!decoded || !decoded.exp) {
        res.status(400).json({ message: 'Невалидный токен' });
        return;
      }

      const expiresAt = new Date(decoded.exp * 1000);

      await BlacklistedToken.create({
        token,
        expires_at: expiresAt,
      });

      res.json({ message: 'Успешный выход из системы' });
    } catch (err: unknown) {
      console.error('Ошибка при выходе:', err);

      if (
        err instanceof Error &&
        'name' in err &&
        err.name === 'SequelizeUniqueConstraintError'
      ) {
        res.status(200).json({ message: 'Токен уже недействителен' });
        return;
      }

      res.status(500).json({ message: 'Ошибка сервера при выходе' });
    }
  },
);

export default router;
