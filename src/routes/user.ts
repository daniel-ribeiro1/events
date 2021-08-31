import { Router } from 'express';

import * as EventController from '../controllers/eventController';
import * as UserController from '../controllers/userController';
import eventValidator from '../middlewares/validators/eventValidator';

import isAuthenticated from '../middlewares/auth/isAuthenticated';
import profileValidator from '../middlewares/validators/profileValidator';

const router = Router();

// Auth middleware
router.use(isAuthenticated);

// Events
router.get('/', EventController.myEvents);

router.get('/new-event', EventController.newEvent);
router.post('/new-event', eventValidator, EventController.newEventAction);

router.get('/edit-event/:id', EventController.editEvent);
router.post('/edit-event/:id', eventValidator, EventController.editEventAction);

router.get('/delete-event/:id', EventController.deleteEventAction);

// User
router.get('/profile', UserController.editProfile);
router.post('/profile', profileValidator, UserController.editProfileAction);

export default router;