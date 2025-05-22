import { Request, Response, Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import BlacklistedToken from '../model/blackListToken';
import User from '../model/user';
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
type RegisterRequest = Request<{}, {}, RegisterRequestBody>;
type LoginRequest = Request<{}, {}, LoginRequestBody>;
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
router.post('/register', async (req: RegisterRequest, res: AuthResponseType): Promise<any> => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ message: "Все поля обязательны" });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email уже используется" });
    }

    const user = await User.create({ email, name, password });
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    return res.status(201).json({
      message: "Регистрация успешна",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

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
router.post('/login', async (req: LoginRequest, res: AuthResponseType): Promise<any> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: { email },
      attributes: ['id', 'email', 'name', 'password']
    }) as unknown as IUser;

    if (!user) {
      return res.status(401).json({ message: "Неверные учетные данные" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Неверные учетные данные" });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

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
router.post('/logout', async (req: Request, res: Response<{ message: string }>): Promise<any> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Токен отсутствует' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Неверный формат токена' });
    }

    const decoded = jwt.decode(token) as JwtPayload;
    if (!decoded || !decoded.exp) {
      return res.status(400).json({ message: 'Невалидный токен' });
    }

    const expiresAt = new Date(decoded.exp * 1000);

    await BlacklistedToken.create({
      token,
      expires_at: expiresAt
    });

    return res.json({ message: 'Успешный выход из системы' });
  } catch (err: any) {
    console.error('Ошибка при выходе:', err);
    
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(200).json({ message: 'Токен уже недействителен' });
    }
    
    return res.status(500).json({ message: 'Ошибка сервера при выходе' });
  }
});

export default router;