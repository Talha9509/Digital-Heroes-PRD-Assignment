// import { prisma } from '../../config/prisma.js';

// const PRIZE_SPLIT = {
//   MATCH_5: 0.40,
//   MATCH_4: 0.35,
//   MATCH_3: 0.25,
// };

// export const generateRandomDrawNumbers = (): number[] => {
//   const nums = new Set<number>();
//   while (nums.size < 5) {
//     nums.add(Math.floor(Math.random() * 45) + 1);
//   }
//   return Array.from(nums).sort((a, b) => a - b);
// };

// export const computePrizePoolForMonth = async (year: number, month: number) => {
//   const firstDay = new Date(year, month - 1, 1);
//   const nextMonth = new Date(year, month, 1);
//   const payments = await prisma.payment.findMany({
//     where: {
//       createdAt: {
//         gte: firstDay,
//         lt: nextMonth,
//       },
//     },
//   });

//   // @ts-ignore
//   const totalPrizePool = payments.reduce((sum, p) => sum + p.prizePoolShare, 0);
//   return totalPrizePool;
// };

// export const runDrawForMonth = async (
//   year: number,
//   month: number,
//   options?: { algorithmic?: boolean; simulate?: boolean },
// ) => {
//   const totalPrizePool = await computePrizePoolForMonth(year, month);

//   const previousDraw = await prisma.draw.findFirst({
//     where: {
//       year: { lt: year },
//     },
//     orderBy: [{ year: 'desc' }, { month: 'desc' }],
//   });

//   const jackpotCarry = previousDraw?.jackpotPool ?? 0;
//   const effectivePool = totalPrizePool + jackpotCarry;

//   const drawnNumbers = generateRandomDrawNumbers(); // TODO: swap with algorithmic variant if options.algorithmic

//   // Fetch all active subscribers with last 5 scores
//   const users = await prisma.user.findMany({
//     where: { subscriptionStatus: 'ACTIVE' },
//     include: {
//       scores: {
//         orderBy: { date: 'desc' },
//         take: 5,
//       },
//     },
//   });

//   type Entry = { userId: string; scores: number[]; matchCount: number };

//   // @ts-ignore
//   const entries: Entry[] = users.map(u => {
//     // @ts-ignore
//     const scores = Array.from(new Set(u.scores.map(s => s.score).filter(Boolean)));
//     // @ts-ignore
//     const matchCount = scores.filter(s => drawnNumbers.includes(s)).length;
//     return { userId: u.id, scores, matchCount };
//   });

//   const matches5 = entries.filter(e => e.matchCount === 5);
//   const matches4 = entries.filter(e => e.matchCount === 4);
//   const matches3 = entries.filter(e => e.matchCount === 3);

//   const pool5 = Math.round(effectivePool * PRIZE_SPLIT.MATCH_5);
//   const pool4 = Math.round(effectivePool * PRIZE_SPLIT.MATCH_4);
//   const pool3 = Math.round(effectivePool * PRIZE_SPLIT.MATCH_3);

//   const winners: { userId: string; matchType: 'MATCH_5' | 'MATCH_4' | 'MATCH_3'; amount: number }[] = [];

//   const perWinner5 = matches5.length ? Math.floor(pool5 / matches5.length) : 0;
//   const perWinner4 = matches4.length ? Math.floor(pool4 / matches4.length) : 0;
//   const perWinner3 = matches3.length ? Math.floor(pool3 / matches3.length) : 0;

//   matches5.forEach(e => winners.push({ userId: e.userId, matchType: 'MATCH_5', amount: perWinner5 }));
//   matches4.forEach(e => winners.push({ userId: e.userId, matchType: 'MATCH_4', amount: perWinner4 }));
//   matches3.forEach(e => winners.push({ userId: e.userId, matchType: 'MATCH_3', amount: perWinner3 }));

//   const has5MatchWinner = matches5.length > 0;
//   const jackpotPool = has5MatchWinner ? 0 : pool5; // carries forward if no 5-match.[file:1]

//   if (options?.simulate) {
//     return {
//       year,
//       month,
//       drawnNumbers,
//       totalPrizePool: effectivePool,
//       jackpotPool,
//       winners,
//       simulate: true,
//     };
//   }

//   const draw = await prisma.draw.create({
//     data: {
//       year,
//       month,
//       drawnNumbers,
//       isPublished: true,
//       isSimulation: false,
//       prizePoolTotal: effectivePool,
//       jackpotPool,
//       winners: {
//         create: winners.map(w => ({
//           userId: w.userId,
//           matchType: w.matchType,
//           prizeAmount: w.amount,
//         })),
//       },
//     },
//     include: {
//       winners: true,
//     },
//   });

//   return draw;
// };


import type { Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma.js';
import type { AuthRequest } from '../../middleware/auth.js';
import { runDrawForMonth } from './draw.service.js';

export const simulateDraw = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { year, month, algorithmic } = req.body;

    const result = await runDrawForMonth(Number(year), Number(month), {
      algorithmic,
      simulate: true,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const publishDraw = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { year, month, algorithmic } = req.body;

    const draw = await runDrawForMonth(Number(year), Number(month), {
      algorithmic,
      simulate: false,
    });

    res.json(draw);
  } catch (err) {
    next(err);
  }
};

export const listDraws = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const draws = await prisma.draw.findMany({
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
      include: { winners: true },
    });

    res.json(draws);
  } catch (err) {
    next(err);
  }
};