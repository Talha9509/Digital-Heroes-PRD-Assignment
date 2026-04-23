
import type { Request, Response } from 'express';
import Stripe from 'stripe';
import { prisma } from '../../config/prisma.js';

import type { AuthRequest } from '../../middleware/auth.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // @ts-ignore
  apiVersion: '2023-10-16',
});

const SUBSCRIPTION_PORTION_TO_POOL = 0.7;   // 70% to prize pool (example)
const PORTION_TO_CHARITY_MIN = 0.1;         // at least 10% to charity; you then adjust by user pct.[file:1]

export const createCheckoutSession = async (req: AuthRequest, res: Response) => {
  const { plan } = req.body; // "monthly" or "yearly"
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) return res.status(404).json({ message: 'User not found' });

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const priceId = plan === 'yearly'
    ? process.env.STRIPE_PRICE_YEARLY
    : process.env.STRIPE_PRICE_MONTHLY;

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId!, quantity: 1 }],
    success_url: `${process.env.FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/pricing`,
    metadata: { userId: user.id, plan },
  });

  res.json({ url: session.url });
};

export const getStatus = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json({
    subscriptionStatus: user.subscriptionStatus,
    subscriptionPlan: user.subscriptionPlan,
    subscriptionCurrentPeriodEnd: user.subscriptionCurrentPeriodEnd,
  });
};