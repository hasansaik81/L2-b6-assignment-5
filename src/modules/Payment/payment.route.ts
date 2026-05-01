import express from 'express';
import { PaymentController } from './payment.controller';
import auth, { UserRole } from '../../middlewares/auth';
// import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

// পেমেন্ট ইন্টেন্ট তৈরি করা (শুধুমাত্র স্টুডেন্টরা পারবে)
router.post(
  '/create-intent',
  auth(UserRole.student),
  PaymentController.createPaymentIntent
);

// পেমেন্ট কনফার্ম করা
router.post(
  '/confirm',
  auth(UserRole.student),
  PaymentController.confirmPayment
);

export const PaymentRoutes = router;