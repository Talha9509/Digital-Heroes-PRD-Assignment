// import { Router } from 'express';
// import { requireAuth } from '../../middleware/auth.js';
// // @ts-ignore
// import { simulateDraw, publishDraw, listDraws } from './draw.controller.js';

// export const drawRouter = Router();

// drawRouter.get('/', requireAuth(), listDraws);
// drawRouter.post('/simulate', requireAuth(['ADMIN']), simulateDraw);
// drawRouter.post('/publish', requireAuth(['ADMIN']), publishDraw);


import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.js';
import { simulateDraw, publishDraw, listDraws } from './draw.controller.js';

export const drawRouter = Router();

drawRouter.get('/', requireAuth(), listDraws);
drawRouter.post('/simulate', requireAuth(['ADMIN']), simulateDraw);
drawRouter.post('/publish', requireAuth(['ADMIN']), publishDraw);