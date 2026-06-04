import express from 'express';
import { PaymentController } from './payment.controller.js';
import auth, { UserRole } from '../../middlewares/auth.js';
// import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

// payment intent create 
router.post(
  '/create-intent',
  auth(UserRole.student),
  PaymentController.createPaymentIntent
);

// payment confirmation
router.post(
  '/confirm',
  auth(UserRole.student),
  PaymentController.savePaymentRecord
);

export const PaymentRoutes = router;




