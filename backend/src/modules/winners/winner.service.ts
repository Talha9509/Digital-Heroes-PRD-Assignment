import { prisma } from '../../config/prisma.js';

export function listWinningsForUser(userId: string) {
  return prisma.winner.findMany({
    where: { userId },
    include: { proofUpload: true, draw: true },
    orderBy: { createdAt: 'desc' },
  });
}

export function listAllWinners() {
  return prisma.winner.findMany({
    include: { user: true, proofUpload: true, draw: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function setWinnerVerification(
  winnerId: string,
  status: 'PENDING' | 'APPROVED' | 'REJECTED',
) {
  return prisma.winner.update({
    where: { id: winnerId },
    data: { verificationStatus: status },
  });
}

export async function setWinnerPaid(winnerId: string) {
  return prisma.winner.update({
    where: { id: winnerId },
    data: { paymentStatus: 'PAID' },
  });
}

export async function saveWinnerProof(winnerId: string, imageUrl: string) {
  return prisma.winnerProof.upsert({
    where: { winnerId },
    update: { imageUrl },
    create: { winnerId, imageUrl },
  });
}