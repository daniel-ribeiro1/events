import { Router } from 'express';

import * as UserController from '../controllers/userController';

const router = Router();

router.get('/', UserController.myEvents);
router.get('/new-event', UserController.newEvent);

export default router;