import express from 'express';
import authController from '../controllers/authController.js';

export const authRouter = express.Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/complete-registration', authController.completeRegistration);

export default authRouter;