import { Router } from 'express';

import * as EventController from '../controllers/eventController';
import * as UserController from '../controllers/userController';

import isAuthenticated from '../middlewares/isAuthenticated';

const router = Router();

// Events
router.get('/', isAuthenticated, EventController.myEvents);

router.get('/new-event', isAuthenticated, EventController.newEvent);
router.post('/new-event', isAuthenticated, EventController.newEventAction);

router.get('/edit-event/:id', isAuthenticated, EventController.editEvent);
router.post('/edit-event/:id', isAuthenticated, EventController.editEventAction);

router.get('/delete-event/:id', isAuthenticated, EventController.deleteEventAction);

// User
router.get('/profile', isAuthenticated, UserController.editProfile);

export default router;