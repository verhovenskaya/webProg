import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User as AppUser } from '@models/user';

declare global {
  namespace Express {
    interface User extends AppUser {}
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization || req.headers.Authorization as string;
  
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Access denied. No token provided.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
    req.user = { id: decoded.id, name: '', email: '', password: '' };
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

export default authMiddleware;