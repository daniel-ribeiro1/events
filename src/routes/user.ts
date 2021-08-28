import { Router } from 'express';

import * as UserController from '../controllers/userController';

const router = Router();

router.get('/', UserController.myEvents);
router.get('/new-event', UserController.newEvent);
router.get('/edit-event', UserController.editEvent);
router.get('/profile', UserController.profile);

export default router;