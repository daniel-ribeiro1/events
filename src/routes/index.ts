import { Router } from "express";
import passport from "passport";

import * as AuthController from '../controllers/authController';

import registerValidator from "../middlewares/validators/registrationValidator";
import loginValidator from "../middlewares/validators/loginValidator";

import myLocalStrategy from "../middlewares/myLocalStrategy";
import isAuthenticated from "../middlewares/isAuthenticated";

const router = Router();

router.get('/login', AuthController.login);
router.post('/login', loginValidator, myLocalStrategy, AuthController.loginAction);          

router.get('/register', AuthController.register);
router.post('/register', registerValidator, AuthController.registerAction);

router.get('/user/logout', isAuthenticated, AuthController.logoutAction);

export default router;