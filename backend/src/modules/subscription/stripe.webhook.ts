import { Router } from 'express';
import Stripe from 'stripe';
import { prisma } from '../../config/prisma.js';

export const stripeWebhookRouter = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // @ts-ignore
  apiVersion: '2023-10-16',
});

stripeWebhookRouter.post('/', async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;
    const subscriptionId = session.subscription as string;

    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          stripeSubscriptionId: subscriptionId,
          subscriptionStatus: 'ACTIVE',
          ...(plan && { subscriptionPlan: plan }),
        },
      });
    }
  }

  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object as Stripe.Invoice;
    // @ts-ignore
    const subscriptionId = invoice.subscription as string;
    const amountPaid = invoice.amount_paid;
    const currency = invoice.currency;

    const user = await prisma.user.findFirst({
      where: { stripeSubscriptionId: subscriptionId },
    });

    if (user) {
      // @ts-ignore
      const prizePoolShare = Math.round(amountPaid * SUBSCRIPTION_PORTION_TO_POOL);
      const charityPct = Math.max(user.charityContributionPct, 10);
      const charityShare = Math.round(amountPaid * (charityPct / 100));

      await prisma.payment.create({
        data: {
          userId: user.id,
          amount: amountPaid,
          currency,
          // @ts-ignore
          stripePaymentId: invoice.payment_intent as string,
          subscriptionPlan: user.subscriptionPlan ?? null,
          prizePoolShare,
          charityShare,
        },
      });
    }
  }

  res.json({ received: true });
});