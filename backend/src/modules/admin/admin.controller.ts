
import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma.js';

export const getStats = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [userCount, prizePoolSum, charitySum] = await Promise.all([
      prisma.user.count(),
      prisma.payment.aggregate({ _sum: { prizePoolShare: true } }),
      prisma.donation.aggregate({ _sum: { amount: true } }),
    ]);

    res.json({
      totalUsers: userCount,
      totalPrizePool: prizePoolSum._sum.prizePoolShare ?? 0,
      totalCharityContributions: charitySum._sum.amount ?? 0,
    });
  } catch (err) {
    next(err);
  }
};

export const getPrizePoolSummary = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const monthly = await prisma.payment.groupBy({
      by: ['currency'],
      _sum: { prizePoolShare: true },
    });
    res.json(monthly);
  } catch (err) {
    next(err);
  }
};

export const getCharityTotals = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const totals = await prisma.donation.groupBy({
      by: ['charityId'],
      _sum: { amount: true },
    });

    res.json(totals);
  } catch (err) {
    next(err);
  }
};

export const getDrawStats = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const draws = await prisma.draw.findMany({
      include: { winners: true },
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
    });
    res.json(draws);
  } catch (err) {
    next(err);
  }
};

