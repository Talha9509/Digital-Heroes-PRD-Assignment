import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import {
  getStats,
  getPrizePoolSummary,
  getCharityTotals,
  getDrawStats,
} from './admin.controller.js';

import {
  createCharityHandler,
  updateCharityHandler,
  deleteCharityHandler,
} from '../charity/charity.admin.controller.js';

export const adminRouter = Router();

// all admin routes protected
adminRouter.use(requireAuth(['ADMIN']));

adminRouter.get('/stats', getStats);
adminRouter.get('/stats/prize-pool', getPrizePoolSummary);
adminRouter.get('/stats/charities', getCharityTotals);
adminRouter.get('/stats/draws', getDrawStats);

adminRouter.post('/charities', createCharityHandler);
adminRouter.patch('/charities/:id', updateCharityHandler);
adminRouter.delete('/charities/:id', deleteCharityHandler);