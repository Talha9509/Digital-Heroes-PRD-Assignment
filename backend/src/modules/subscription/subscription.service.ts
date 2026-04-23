import Stripe from 'stripe';
import { prisma } from '../../config/prisma.js';
import { env } from '../../config/env.js';

const stripe = new Stripe(env.stripeSecretKey, {
  // @ts-ignore
  apiVersion: '2023-10-16',
});

const SUBSCRIPTION_PORTION_TO_POOL = 0.7;

export async function ensureStripeCustomer(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const err = new Error('User not found');
    // @ts-ignore
    err.statusCode = 404;
    throw err;
  }

  if (user.stripeCustomerId) {
    return { user, customerId: user.stripeCustomerId };
  }

  const customer = await stripe.customers.create({
    email: user.email,
    metadata: { userId: user.id },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { stripeCustomerId: customer.id },
  });

  return { user, customerId: customer.id };
}

export async function createSubscriptionCheckoutSession(
  userId: string,
  plan: 'monthly' | 'yearly',
) {
  const { user, customerId } = await ensureStripeCustomer(userId);

  const priceId =
    plan === 'yearly' ? env.stripePriceYearly : env.stripePriceMonthly;

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${env.frontendUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.frontendUrl}/pricing`,
    metadata: { userId: user.id, plan },
  });

  return session;
}

export async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const plan = session.metadata?.plan as 'monthly' | 'yearly' | undefined;
  const subscriptionId = session.subscription as string | undefined;

  if (!userId || !subscriptionId) return;

  await prisma.user.update({
    where: { id: userId },
    data: {
      stripeSubscriptionId: subscriptionId,
      subscriptionStatus: 'ACTIVE',
      ...(plan && { subscriptionPlan: plan }),
    },
  });
}

export async function handleInvoicePaid(invoice: Stripe.Invoice) {
  // @ts-ignore
  const subscriptionId = invoice.subscription as string | undefined;
  if (!subscriptionId) return;

  const user = await prisma.user.findFirst({
    where: { stripeSubscriptionId: subscriptionId },
  });

  if (!user) return;

  const amountPaid = invoice.amount_paid;
  const currency = invoice.currency;

  const prizePoolShare = Math.round(amountPaid * SUBSCRIPTION_PORTION_TO_POOL);
  const charityPct = Math.max(user.charityContributionPct, 10);
  const charityShare = Math.round(amountPaid * (charityPct / 100));

  await prisma.payment.create({
    data: {
      userId: user.id,
      amount: amountPaid,
      currency,
      // @ts-ignore
      stripePaymentId: String(invoice.payment_intent),
      subscriptionPlan: user.subscriptionPlan ?? null,
      prizePoolShare,
      charityShare,
    },
  });
}