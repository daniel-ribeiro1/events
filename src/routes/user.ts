import { Router } from 'express';

import * as UserController from '../controllers/userController';

const router = Router();

router.get('/', UserController.myEvents);

router.get('/new-event', UserController.newEvent);
router.post('/new-event', UserController.newEventAction);

router.get('/edit-event/:id', UserController.editEvent);
router.get('/profile', UserController.profile);

export default router;