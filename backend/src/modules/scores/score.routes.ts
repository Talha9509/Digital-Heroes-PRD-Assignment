import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { createScore, listScores, updateScore, deleteScore } from './score.controller.js';

export const scoreRouter = Router();

scoreRouter.get('/', requireAuth(), listScores);
scoreRouter.post('/', requireAuth(), createScore);
scoreRouter.put('/:id', requireAuth(), updateScore);
scoreRouter.delete('/:id', requireAuth(), deleteScore);