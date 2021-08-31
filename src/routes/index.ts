import { Router } from "express";

import * as AuthController from '../controllers/authController';

import registerValidator from "../middlewares/validators/registrationValidator";
import loginValidator from "../middlewares/validators/loginValidator";

import authenticateUser from "../middlewares/auth/authenticateUser";
import isAuthenticated from "../middlewares/auth/isAuthenticated";

const router = Router();

router.get('/login', AuthController.login);
router.post('/login', loginValidator, authenticateUser);          

router.get('/register', AuthController.register);
router.post('/register', registerValidator, AuthController.registerAction);

router.get('/user/logout', isAuthenticated, AuthController.logoutAction);

export default router;