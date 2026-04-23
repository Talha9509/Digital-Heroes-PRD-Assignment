// @ts-ignore
import type { Response } from 'express';
import { prisma } from '../../config/prisma.js';

import type { AuthRequest } from '../../middleware/auth.js';

export const listMyWinnings = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

  const winners = await prisma.winner.findMany({
    where: { userId: req.user.id },
    include: { proofUpload: true, draw: true },
    orderBy: { createdAt: 'desc' },
  });

  res.json(winners);
};

export const uploadProof = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  const { winnerId } = req.params;
  if (!winnerId || typeof winnerId !== 'string') {
    return res.status(400).json({ message: 'Invalid winner ID' });
  }
  // @ts-ignore
  const file = req.file;

  const winner = await prisma.winner.findFirst({
    where: { id: winnerId, userId: req.user.id },
  });
  if (!winner) return res.status(404).json({ message: 'Winner not found' });

  if (!file) return res.status(400).json({ message: 'No file uploaded' });

  const imageUrl = `/uploads/${file.filename}`; // serve via static; or upload to S3

  await prisma.winnerProof.upsert({
    where: { winnerId },
    update: { imageUrl },
    create: { winnerId, imageUrl },
  });

  res.json({ message: 'Proof uploaded', imageUrl });
};

export const listWinnersAdmin = async (_req: AuthRequest, res: Response) => {
  const winners = await prisma.winner.findMany({
    include: { user: true, proofUpload: true, draw: true },
  });
  res.json(winners);
};

export const verifyWinner = async (req: AuthRequest, res: Response) => {
  const { winnerId } = req.params;
  if (!winnerId || typeof winnerId !== 'string') {
    return res.status(400).json({ message: 'Invalid winner ID' });
  }
  const { status } = req.body; // "APPROVED" | "REJECTED"

  const winner = await prisma.winner.update({
    where: { id: winnerId },
    data: { verificationStatus: status },
  });

  res.json(winner);
};

export const markPayoutPaid = async (req: AuthRequest, res: Response) => {
  const { winnerId } = req.params;
  if (!winnerId || typeof winnerId !== 'string') {
    return res.status(400).json({ message: 'Invalid winner ID' });
  }

  const winner = await prisma.winner.update({
    where: { id: winnerId },
    data: { paymentStatus: 'PAID' },
  });

  res.json(winner);
};