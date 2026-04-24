import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import { authRouter } from './modules/auth/auth.routes.js';
import { userRouter } from './modules/users/user.routes.js';
import { subscriptionRouter } from './modules/subscription/subscription.routes.js';
import { scoreRouter } from './modules/scores/score.routes.js';
import { charityRouter } from './modules/charity/charity.routes.js';
import { drawRouter } from './modules/draws/draw.routes.js';
import { winnerRouter } from './modules/winners/winner.routes.js';
import { adminRouter } from './modules/admin/admin.routes.js';
import { stripeWebhookRouter } from './modules/subscription/stripe.webhook.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// Stripe webhook needs raw body:
app.use('/stripe/webhook', bodyParser.raw({ type: 'application/json' }));

app.use('/admin/users', userRouter);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', authRouter);
app.use('/subscription', subscriptionRouter);
app.use('/scores', scoreRouter);
app.use('/charities', charityRouter);
app.use('/draws', drawRouter);
app.use('/winners', winnerRouter);
app.use('/admin', adminRouter);
app.use('/stripe/webhook', stripeWebhookRouter);

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});