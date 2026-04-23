import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { getAllUsers, getUser, patchUser, removeUser } from './user.controller.js';

export const userRouter = Router();

// admin-only
userRouter.use(requireAuth(['ADMIN']));

userRouter.get('/', getAllUsers);
userRouter.get('/:id', getUser);
userRouter.patch('/:id', patchUser);
userRouter.delete('/:id', removeUser);