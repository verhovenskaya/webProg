import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '@models/user';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization || req.headers.Authorization as string;
  
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Access denied. No token provided.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    
    // Получаем только необходимые данные пользователя
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'email', 'firstName', 'lastName'],
      raw: true // Возвращает простой объект без методов Sequelize
    });

    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    // Явно указываем тип для req.user
    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    } as Express.User;

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

export default authMiddleware;