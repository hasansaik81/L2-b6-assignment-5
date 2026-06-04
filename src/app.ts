import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PaymentController } from './modules/Payment/payment.controller.js';
import { prisma } from './lib/prisma.js';
import router from './routes/index.js';
import { errorHandler } from './middlewares/globalErrorHandler.js';
import notFound from './middlewares/notFound.js';


import {
  BookingStatus,
  PaymentStatus,
} from "../generated/prisma/client";

const app: Application = express();

// parsers


app.use(
  cors({
    origin: "http://localhost:3000", 
    credentials: true,               
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json());
app.use(cookieParser());


app.post("/webhook", express.raw({ type: "application/json" }), PaymentController.handleStripeWebhookEvent)


const cancelUnpaidBookings = async () => {
  const timeLimit = new Date(Date.now() - 30 * 60 * 1000);

  const deletedBookings = await prisma.booking.deleteMany({
    where: {
      status: BookingStatus.PENDING,
      createdAt: {
        lt: timeLimit,
      },
      payments: {
        some: {
          status: PaymentStatus.PENDING,
        },
      },
    },
  });

  return deletedBookings;
};



app.use('/api/v1',router);


app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Apollo Gears World!');
});

app.use(errorHandler);
app.use(notFound)

export default app;
