
import type { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser, getMe } from './auth.service.js';
import type { AuthRequest } from '../../middleware/auth.js';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, name, charityId, charityContributionPct } = req.body;
  try {
    const result = await registerUser({
      email,
      password,
      name,
      charityId,
      charityContributionPct,
    });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const result = await loginUser({ email, password });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const me = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const data = await getMe(req.user.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
};