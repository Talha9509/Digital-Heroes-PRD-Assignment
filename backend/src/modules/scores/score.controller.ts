// @ts-ignore
import type { Response } from 'express';
import { prisma } from '../../config/prisma.js';


import type { AuthRequest } from '../../middleware/auth.js';

export const listScores = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

  const scores = await prisma.golfScore.findMany({
    where: { userId: req.user.id },
    orderBy: { date: 'desc' },
  });

  res.json(scores);
};

export const createScore = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  const { date, score } = req.body;

  if (!date || typeof score !== 'number' || score < 1 || score > 45) {
    return res.status(400).json({ message: 'Invalid score or date' });
  }

  const scoreDate = new Date(date);

  try {
    // Enforce one score per date: if exists, update instead
    const existing = await prisma.golfScore.findUnique({
      where: {
        userId_date: { userId: req.user.id, date: scoreDate },
      },
    });

    if (existing) {
      const updated = await prisma.golfScore.update({
        where: { id: existing.id },
        data: { score },
      });
      return res.json(updated);
    }

    // Create new score
    const created = await prisma.golfScore.create({
      data: {
        userId: req.user.id,
        date: scoreDate,
        score,
      },
    });

    // Ensure only last 5 scores kept
    const allScores = await prisma.golfScore.findMany({
      where: { userId: req.user.id },
      orderBy: { date: 'desc' },
    });

    if (allScores.length > 5) {
      const toDelete = allScores.slice(5); // drop oldest
      // @ts-ignore
      const ids = toDelete.map(s => s.id);
      await prisma.golfScore.deleteMany({ where: { id: { in: ids } } });
    }

    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ message: 'Failed to create score' });
  }
};

export const updateScore = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  const { id } = req.params;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid score ID' });
  }
  const { score } = req.body;

  if (typeof score !== 'number' || score < 1 || score > 45) {
    return res.status(400).json({ message: 'Invalid score' });
  }

  const existing = await prisma.golfScore.findFirst({
    where: { id, userId: req.user.id },
  });
  if (!existing) return res.status(404).json({ message: 'Score not found' });

  const updated = await prisma.golfScore.update({
    where: { id },
    data: { score },
  });

  res.json(updated);
};

export const deleteScore = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  const { id } = req.params;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid score ID' });
  }

  const existing = await prisma.golfScore.findFirst({
    where: { id, userId: req.user.id },
  });
  if (!existing) return res.status(404).json({ message: 'Score not found' });

  await prisma.golfScore.delete({ where: { id } });

  res.status(204).send();
};