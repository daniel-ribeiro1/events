import { Router } from "express";
import * as AuthController from '../controllers/authController';
import registerValidator from "../middlewares/registrationValidator";

const router = Router();

router.get('/login', AuthController.login);

router.get('/register', AuthController.register);
router.post('/register', registerValidator, AuthController.registerAction);

export default router;