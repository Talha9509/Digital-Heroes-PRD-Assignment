
import type { Request, Response, NextFunction } from 'express';
import {
  createCharity,
  updateCharity,
  deleteCharity,
} from '../charity/charity.service.js';

export const createCharityHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, description, imageUrl, websiteUrl } = req.body;

    const charity = await createCharity({
      name,
      description,
      imageUrl,
      websiteUrl,
    });

    res.status(201).json(charity);
  } catch (err) {
    next(err);
  }
};

export const updateCharityHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;

    const charity = await updateCharity(id, req.body);
    res.json(charity);
  } catch (err) {
    next(err);
  }
};

export const deleteCharityHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;

    await deleteCharity(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};