import { Router } from 'express';
import { listCharities, getCharity } from './charity.controller.js';
// import { requireAuth } from '../../middleware/auth';

export const charityRouter = Router();

// public endpoints
charityRouter.get('/', listCharities);
charityRouter.get('/:id', getCharity);

// admin endpoints could go in /api/admin/charities