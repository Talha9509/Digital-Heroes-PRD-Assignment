import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../../middleware/auth.js';
import {
  listMyWinnings,
  uploadProof,
  listWinnersAdmin,
  verifyWinner,
  markPayoutPaid,
} from './winner.controller.js';

export const winnerRouter = Router();
const upload = multer({ dest: 'uploads/' }); // for demo, better to use S3 in prod

winnerRouter.get('/me', requireAuth(), listMyWinnings);
winnerRouter.post('/:winnerId/proof', requireAuth(), upload.single('proof'), uploadProof);

// Admin
winnerRouter.get('/admin', requireAuth(['ADMIN']), listWinnersAdmin);
winnerRouter.post('/:winnerId/verify', requireAuth(['ADMIN']), verifyWinner);
winnerRouter.post('/:winnerId/pay', requireAuth(['ADMIN']), markPayoutPaid);