import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export default (req: Request, res: Response, next: NextFunction): void => {
  // Get token from header
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access denied. No token provided.' });
    return;
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Attach user to request
    req.user = {
      id: decoded.id,
      ...(decoded.email && { email: decoded.email }),
      ...(decoded.name && { name: decoded.name }),
    };

    next();
  } catch {
    res.status(400).json({ error: 'Invalid token' });
  }
};
