import { Request, Response, NextFunction } from 'express';
import BlacklistedToken from '../model/blackListToken';

export default async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    next();
    return;
  }

  const blacklisted = await BlacklistedToken.findOne({ where: { token } });
  if (blacklisted) {
    res.status(401).json({ message: 'Токен более недействителен' });
    return;
  }

  next();
};
