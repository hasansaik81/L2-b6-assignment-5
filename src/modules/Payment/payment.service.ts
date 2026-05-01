import config from "../../config";
import Stripe from 'stripe';
import httpStatus from 'http-status';
import { AppError } from "../../errors/AppError";
import { TIPaymentResult, TPaymentIntent } from "./payment.interface";
import { prisma } from "../../lib/prisma";


const stripe=new Stripe(config.stripe_secret_key as string,{
apiVersion:'2022-11-15' as any,

})

const createPaymentIntent = async (
  payload: TPaymentIntent
): Promise<TIPaymentResult> => {
  const { bookingId } = payload

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      tutor: true,
      student: true,
    },
  })

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking not found')
  }

  const paymentStatus = (booking as any).paymentStatus

  if (paymentStatus === 'paid') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Already paid for this booking')
  }

  const bookingData = booking as unknown as Record<string, any>
  const amount = bookingData.totalAmount ?? bookingData.amount

  if (typeof amount !== 'number' || amount <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid booking amount')
  }

  const amountInCents = Math.round(amount * 100)

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: 'usd',
    metadata: {
      bookingId: booking.id,
      studentId: booking.studentId,
      tutorId: booking.tutorId,
    },
    automatic_payment_methods: {
      enabled: true,
    },
  })

  return {
    clientSecret: paymentIntent.client_secret as string,
    amount,
    transactionId: paymentIntent.id,
  }
}
export const PaymentService = {
    // Add service methods here
    };