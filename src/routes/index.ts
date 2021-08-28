import { Router } from "express";
import * as AuthController from '../controllers/authController';

const router = Router();

router.get('/login', AuthController.login);
router.get('/register', AuthController.register);

export default router;