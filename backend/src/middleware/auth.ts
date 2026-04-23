// @ts-ignore
import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';

export interface AuthRequest extends Request {
  user?: { id: string; role: 'SUBSCRIBER' | 'ADMIN' };
}

export const requireAuth = (roles?: ('SUBSCRIBER' | 'ADMIN')[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    try {
      // @ts-ignore
      const payload = verifyToken(token);
      if (roles && !roles.includes(payload.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      req.user = { id: payload.userId, role: payload.role };
      next();
    } catch {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
};