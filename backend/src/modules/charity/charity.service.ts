import { prisma } from '../../config/prisma.js';

export function listAllCharities() {
  return prisma.charity.findMany({
    include: { upcomingEvents: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getCharityById(id: string) {
  const charity = await prisma.charity.findUnique({
    where: { id },
    include: { upcomingEvents: true },
  });
  if (!charity) {
    const err = new Error('Charity not found');
    // @ts-ignore
    err.statusCode = 404;
    throw err;
  }
  return charity;
}

export function createCharity(data: {
  name: string;
  description: string;
  imageUrl?: string;
  websiteUrl?: string;
}) {
  return prisma.charity.create({ data });
}

export function updateCharity(id: string, data: Partial<{
  name: string;
  description: string;
  imageUrl: string;
  websiteUrl: string;
}>) {
  return prisma.charity.update({
    where: { id },
    data,
  });
}

export async function deleteCharity(id: string) {
  await prisma.charity.delete({ where: { id } });
}