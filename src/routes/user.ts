import { Router } from 'express';

import * as EventController from '../controllers/eventController';
import * as UserController from '../controllers/userController';

const router = Router();

// Events
router.get('/', EventController.myEvents);

router.get('/new-event', EventController.newEvent);
router.post('/new-event', EventController.newEventAction);

router.get('/edit-event/:id', EventController.editEvent);
router.post('/edit-event/:id', EventController.editEventAction);

router.get('/delete-event/:id', EventController.deleteEventAction);

// User
router.get('/profile', UserController.profile);

export default router;