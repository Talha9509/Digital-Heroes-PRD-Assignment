// @ts-ignore
import type { Request, Response } from 'express';
import { prisma } from '../../config/prisma.js';

export const listCharities = async (_req: Request, res: Response) => {
  const charities = await prisma.charity.findMany({
    include: { upcomingEvents: true },
  });
  res.json(charities);
};

export const getCharity = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid charity ID' });
  }
  const charity = await prisma.charity.findUnique({
    where: { id },
    include: { upcomingEvents: true },
  });
  if (!charity) return res.status(404).json({ message: 'Charity not found' });
  res.json(charity);
};