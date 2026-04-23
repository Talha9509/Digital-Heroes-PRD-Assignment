import { prisma } from '../../config/prisma.js';
import type { Prisma, SubscriptionStatus } from '@prisma/client';

type UpdateUserInput = {
  name?: string;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionPlan?: string | null;
  selectedCharityId?: string | null;
  charityContributionPct?: number;
};

export async function listUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      selectedCharity: true,
    },
  });
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { selectedCharity: true, scores: true },
  });

  if (!user) {
    const err = new Error('User not found');
    // @ts-expect-error custom property
    err.statusCode = 404;
    throw err;
  }

  return user;
}

export async function updateUser(id: string, input: UpdateUserInput = {}) {
  const data: Prisma.UserUpdateInput = {
    ...(input.name !== undefined ? { name: input.name } : {}),
    ...(input.subscriptionStatus !== undefined
      ? { subscriptionStatus: input.subscriptionStatus }
      : {}),
    ...(input.subscriptionPlan !== undefined
      ? { subscriptionPlan: input.subscriptionPlan }
      : {}),
    ...(input.charityContributionPct !== undefined
      ? { charityContributionPct: Math.max(10, input.charityContributionPct) }
      : {}),
    ...(input.selectedCharityId !== undefined
      ? input.selectedCharityId === null
        ? { selectedCharity: { disconnect: true } }
        : { selectedCharity: { connect: { id: input.selectedCharityId } } }
      : {}),
  };

  if (Object.keys(data).length === 0) {
    const err = new Error('No valid fields provided for update');
    // @ts-expect-error custom property
    err.statusCode = 400;
    throw err;
  }

  try {
    return await prisma.user.update({
      where: { id },
      data,
      include: { selectedCharity: true },
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      const err = new Error('User not found');
      // @ts-expect-error custom property
      err.statusCode = 404;
      throw err;
    }
    throw error;
  }
}

// export async function updateUser(id: string, input: UpdateUserInput) {
//   const data: Prisma.UserUpdateInput = {};

//   if (input.name !== undefined) {
//     data.name = input.name;
//   }

//   if (input.subscriptionStatus !== undefined) {
//     data.subscriptionStatus = input.subscriptionStatus;
//   }

//   if (input.subscriptionPlan !== undefined) {
//     data.subscriptionPlan = input.subscriptionPlan;
//   }

//   if (input.charityContributionPct !== undefined) {
//     data.charityContributionPct = Math.max(10, input.charityContributionPct);
//   }

//   if (input.selectedCharityId !== undefined) {
//     if (input.selectedCharityId === null) {
//       data.selectedCharity = {
//         disconnect: true,
//       };
//     } else {
//       data.selectedCharity = {
//         connect: { id: input.selectedCharityId },
//       };
//     }
//   }

//   return prisma.user.update({
//     where: { id },
//     data,
//     include: {
//       selectedCharity: true,
//     },
//   });
// }

export async function deleteUser(id: string) {
  await prisma.user.delete({
    where: { id },
  });
}