import express, { Request, Response, Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import BlacklistedToken from '@models/blackListToken';
import User from '@models/user';
import dotenv from 'dotenv';

dotenv.config();

const router: Router = express.Router();

// Интерфейсы для типизации

interface RegisterRequestBody {
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  password: string;
  gender?: 'male' | 'female' | 'other';
  birthDate?: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

interface UserResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  gender?: 'male' | 'female' | 'other';
  birthDate?: string;
}

interface AuthResponse {
  message?: string;
  token?: string;
  user?: UserResponse;
}

interface IRegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  password: string;
  gender?: 'male' | 'female' | 'other';
  birthDate?: string;
}

interface ILoginRequest {
  email: string;
  password: string;
}

interface IAuthResponse {
  message?: string;
  token?: string;
  user?: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    gender?: 'male' | 'female' | 'other';
    birthDate?: string;
  };
}

  

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
router.post('/register', (async (req: Request, res: Response) => {
  const { email, firstName, lastName, password, middleName, gender, birthDate } = req.body;

  if (!email || !firstName || !lastName || !password) {
    res.status(400).json({ message: 'Обязательные поля: email, имя, фамилия и пароль' });
    return undefined as unknown as void;
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'Email уже используется' });
      return undefined as unknown as void;
    }

    const user = await User.create({ 
      email, 
      firstName, 
      lastName, 
      password,
      middleName,
      gender,
      birthDate: birthDate ? new Date(birthDate) : undefined,
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    res.status(201).json({
      message: 'Регистрация успешна',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        gender: user.gender,
        birthDate: user.birthDate?.toISOString().split('T')[0],
      },
    });
    return undefined as unknown as void;
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
    return undefined as unknown as void;
  }
}) as express.RequestHandler);

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
router.post('/login', (async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Обязательные поля: email и пароль' });
    return undefined as unknown as void;
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ message: 'Неверные учетные данные' });
      return undefined as unknown as void;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Неверные учетные данные' });
      return undefined as unknown as void;
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    res.status(200).json({
      message: 'Авторизация успешна',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        gender: user.gender,
        birthDate: user.birthDate?.toISOString().split('T')[0],
      },
    });
    return undefined as unknown as void;
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
    return undefined as unknown as void;
  }
}) as express.RequestHandler);

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
router.post('/logout', (async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ message: 'Токен отсутствует' });
      return undefined as unknown as void;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Неверный формат токена' });
      return undefined as unknown as void;
    }

    const decoded = jwt.decode(token) as JwtPayload;
    if (!decoded || !decoded.exp) {
      res.status(400).json({ message: 'Невалидный токен' });
      return undefined as unknown as void;
    }

    const expiresAt = new Date(decoded.exp * 1000);

    await BlacklistedToken.create({
      token,
      expires_at: expiresAt,
    });

    res.status(200).json({ message: 'Успешный выход из системы' });
    return undefined as unknown as void;
  } catch (error) {
    console.error('Ошибка при выходе:', error);

    if (error instanceof Error && 'name' in error && error.name === 'SequelizeUniqueConstraintError') {
      res.status(200).json({ message: 'Токен уже недействителен' });
      return undefined as unknown as void;
    }

    res.status(500).json({ message: 'Ошибка сервера при выходе' });
    return undefined as unknown as void;
  }
}) as express.RequestHandler);

export default router;