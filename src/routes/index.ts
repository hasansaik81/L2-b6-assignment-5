import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/auth.route.js";
import { TutorRoutes } from "../modules/Tutor/tutor.route.js";
import { CategoryRoutes } from "../modules/Category/category.route.js";
import { SubjectsRoutes } from "../modules/Subjects/subjects.route.js";
import { BookingRoutes } from "../modules/Booking/booking.route.js";
import { ReviewRoutes } from "../modules/Reiview/reiview.route.js";
import { PaymentRoutes } from "../modules/Payment/payment.route.js";



const router=Router();

const routerManger=[
    {
        path:"/auth",
        route:AuthRoutes,
    },
    {
        path:"/tutors",
        route:TutorRoutes,
    },

    {
        path:"/category",
        route:CategoryRoutes,
    },
    {
        path:"/subjects",
        route:SubjectsRoutes,
    },
    {
        path:"/bookings",
        route:BookingRoutes,
    },
    {
        path:"/reviews",
        route:ReviewRoutes,
    },
    {
        path:"/payments",
        route:PaymentRoutes,
    }

]

routerManger.forEach((r)=>router.use(r.path,r.route));
export default router