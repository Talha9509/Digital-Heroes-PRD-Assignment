import { prisma } from '../../config/prisma.js';

export async function getUserScores(userId: string) {
  return prisma.golfScore.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
  });
}

export async function upsertScore(userId: string, date: Date, score: number) {
  const existing = await prisma.golfScore.findUnique({
    where: {
      userId_date: { userId, date },
    },
  });

  if (existing) {
    return prisma.golfScore.update({
      where: { id: existing.id },
      data: { score },
    });
  }

  const created = await prisma.golfScore.create({
    data: { userId, date, score },
  });

  const allScores = await prisma.golfScore.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
  });

  if (allScores.length > 5) {
    const toDelete = allScores.slice(5);
    // @ts-ignore
    const ids = toDelete.map((s) => s.id);
    await prisma.golfScore.deleteMany({ where: { id: { in: ids } } });
  }

  return created;
}

export async function updateUserScore(
  userId: string,
  scoreId: string,
  score: number,
) {
  const existing = await prisma.golfScore.findFirst({
    where: { id: scoreId, userId },
  });
  if (!existing) {
    const err = new Error('Score not found');
    // @ts-ignore
    err.statusCode = 404;
    throw err;
  }

  return prisma.golfScore.update({
    where: { id: scoreId },
    data: { score },
  });
}

export async function deleteUserScore(userId: string, scoreId: string) {
  const existing = await prisma.golfScore.findFirst({
    where: { id: scoreId, userId },
  });
  if (!existing) {
    const err = new Error('Score not found');
    // @ts-ignore
    err.statusCode = 404;
    throw err;
  }

  await prisma.golfScore.delete({ where: { id: scoreId } });
}