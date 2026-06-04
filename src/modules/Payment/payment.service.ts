// import Stripe from "stripe";
// import config from "../../config";
// import { prisma } from "../../lib/prisma";
// // ❌ Prisma import করার প্রয়োজন নেই
// import httpStatus from "http-status";
// import {
//   TPaymentIntent,
//   TIPaymentResult,
//   TPaymentConfirmation,
// } from "./payment.interface.ts";
// import AppError from "../../errors/AppError";

import Stripe from "stripe";
import config from "../../config";
import httpStatus from "http-status";
import { TIPaymentResult, TPaymentConfirmation, TPaymentIntent } from "./payment.interface.js";
import AppError from "../../errors/AppError.js";
import { prisma } from "../../lib/prisma.js";







const stripe = new Stripe(config.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16" as any,
});

const MAX_STRIPE_AMOUNT_USD = 999999.99;
const MAX_STRIPE_AMOUNT_CENTS = 99999999;

/**
 * সহজভাবে amount কে number এ convert করুন
 */
const getAmountAsNumber = (totalPrice: any): number => {
  // Number() constructor সবকিছু handle করে
  const amount = Number(totalPrice);
  
  if (isNaN(amount) || amount <= 0) {
    throw new Error("Invalid amount");
  }
  
  return amount;
};

const createPaymentIntent = async (payload: TPaymentIntent): Promise<TIPaymentResult> => {
  const { bookingId } = payload;

  if (!bookingId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Booking ID is required");
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  const existingPayment = await prisma.payment.findFirst({
    where: { bookingId, status: "SUCCESS" },
  });

  if (existingPayment) {
    throw new AppError(httpStatus.BAD_REQUEST, "This booking is already paid");
  }

  // ✅ সহজভাবে Number() ব্যবহার করুন
  const amountInDollars = Number(booking.totalPrice);
  
  console.log("💰 Payment amount:", {
    original: booking.totalPrice,
    originalType: typeof booking.totalPrice,
    amountInDollars,
  });

  if (isNaN(amountInDollars) || amountInDollars <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid booking amount");
  }

  // Stripe maximum limit check
  if (amountInDollars > MAX_STRIPE_AMOUNT_USD) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Payment amount cannot exceed $${MAX_STRIPE_AMOUNT_USD.toLocaleString()}`
    );
  }

  const amountInCents = Math.round(amountInDollars * 100);

  if (amountInCents > MAX_STRIPE_AMOUNT_CENTS) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Amount exceeds Stripe's maximum limit`
    );
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: "usd",
    metadata: { bookingId: booking.id },
    automatic_payment_methods: { enabled: true },
  });

  return {
    clientSecret: paymentIntent.client_secret!,
    amount: amountInDollars,
    transactionId: paymentIntent.id,
  };
};

const savePaymentRecord = async (payload: TPaymentConfirmation) => {
  return await prisma.$transaction(async (tx) => {
    const existingPayment = await tx.payment.findUnique({
      where: { transactionId: payload.transactionId },
    });

    if (existingPayment) {
      throw new AppError(httpStatus.BAD_REQUEST, "Payment already exists");
    }

    const payment = await tx.payment.create({
      data: {
        bookingId: payload.bookingId,
        transactionId: payload.transactionId,
        amount: payload.amount, // ✅ Prisma auto converts number to Decimal
        status: payload.status === "succeeded" ? "SUCCESS" : "FAILED",
        paymentGatewayData: payload.gatewayData as any,
        stripePaymentId: payload.stripePaymentId,
        stripeSessionId: payload.stripeSessionId,
      },
    });

    if (payload.status === "succeeded") {
      await tx.booking.update({
        where: { id: payload.bookingId },
        data: { status: "CONFIRMED" },
      });
    }

    return payment;
  });
};

export const PaymentService = {
  createPaymentIntent,
  savePaymentRecord,
};