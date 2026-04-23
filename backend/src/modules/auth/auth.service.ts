import { prisma } from '../../config/prisma.js';
import { hashPassword, comparePassword } from '../../utils/password.js';
import { signToken } from '../../utils/jwt.js';

export async function registerUser(input: {
  email: string;
  password: string;
  name?: string;
  charityId?: string;
  charityContributionPct?: number;
}) {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });
  if (existing) {
    const err = new Error('Email already exists');
    // @ts-ignore
    err.statusCode = 409;
    throw err;
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      ...(input.name && { name: input.name }),
      ...(input.charityId && { selectedCharityId: input.charityId }),
      charityContributionPct: Math.max(
        10,
        input.charityContributionPct ?? 10,
      ),
    },
  });

  const token = signToken({ userId: user.id, role: user.role });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
}

export async function loginUser(input: {
  email: string;
  password: string;
}) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    const err = new Error('Invalid credentials');
    // @ts-ignore
    err.statusCode = 401;
    throw err;
  }

  const valid = await comparePassword(input.password, user.passwordHash);
  if (!valid) {
    const err = new Error('Invalid credentials');
    // @ts-ignore
    err.statusCode = 401;
    throw err;
  }

  const token = signToken({ userId: user.id, role: user.role });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { selectedCharity: true },
  });

  if (!user) {
    const err = new Error('User not found');
    // @ts-ignore
    err.statusCode = 404;
    throw err;
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    subscriptionStatus: user.subscriptionStatus,
    subscriptionPlan: user.subscriptionPlan,
    subscriptionCurrentPeriodEnd: user.subscriptionCurrentPeriodEnd,
    selectedCharity: user.selectedCharity,
    charityContributionPct: user.charityContributionPct,
  };
}