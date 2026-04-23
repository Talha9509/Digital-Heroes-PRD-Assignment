import { Router } from 'express';
import { createCheckoutSession, getStatus } from './subscription.controller.js';
import { requireAuth } from '../../middleware/auth.js';

export const subscriptionRouter = Router();

subscriptionRouter.post('/checkout', requireAuth(), createCheckoutSession);
subscriptionRouter.get('/status', requireAuth(), getStatus);