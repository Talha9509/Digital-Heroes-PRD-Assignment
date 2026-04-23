
import type { Request, Response, NextFunction } from 'express';
import { listUsers, getUserById, updateUser, deleteUser } from './user.service.js';

// export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
//   try {
//     const users = await listUsers();
//     res.json(users);
//   } catch (err) {
//     next(err);
//   }
// };

// export const getUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     // @ts-ignore
//     const user = await getUserById(req.params.id);
//     res.json(user);
//   } catch (err) {
//     next(err);
//   }
// };

// export const patchUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     // @ts-ignore
//     const updated = await updateUser(req.params.id, req.body);
//     res.json(updated);
//   } catch (err) {
//     next(err);
//   }
// };

// export const removeUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     // @ts-ignore
//     await deleteUser(req.params.id);
//     res.status(204).send();
//   } catch (err) {
//     next(err);
//   }
// };



export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await listUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const user = await getUserById(id);
    res.json(user);
  } catch (err) {
    next(err);
  }
};


export const patchUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    console.log('PATCH /admin/users/:id', {
      id,
      body: req.body,
    });

    const updated = await updateUser(id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const removeUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    await deleteUser(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};