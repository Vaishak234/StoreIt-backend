import express from 'express';
import { signupController, verifyRegistrationOtp ,signInController, logoutUser, refreshUser} from '../controllers/authController.js';

const router = express.Router();


router.post('/sign-up',signupController)

router.post('/sign-in',signInController)

router.post('/verify-otp',verifyRegistrationOtp)

router.get('/logout',logoutUser)

router.get('/refresh',refreshUser)


export default router