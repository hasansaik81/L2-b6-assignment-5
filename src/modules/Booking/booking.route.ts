import express from "express";
import auth, { UserRole } from "../../middlewares/auth.js";
import { BookingController } from "./booking.controller.js";
;


const router = express.Router();

// Student only
router.post(
  "/",
  auth(UserRole.student),
  BookingController.createBooking
);

router.get("/",auth(UserRole.student),BookingController.getSingleBooking);



export const BookingRoutes= router;
