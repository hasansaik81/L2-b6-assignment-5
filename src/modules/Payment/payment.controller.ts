




import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";
import httpStatus from "http-status";
import config from "../../config";
import Stripe from "stripe";
import { PaymentWebhookService } from "./payment.webhook";
import { envVars } from "../../config/env";
import { stripe } from "../../config/stripe.config";



const handleStripeWebhookEvent = catchAsync(async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;
  const webhookSecret = envVars.STRIPE.WEBHOOK_SECRET;

  // ✅ Validate webhook signature and secret
  if (!signature || !webhookSecret) {
    console.error("❌ Missing Stripe signature or webhook secret");
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Missing Stripe signature or webhook secret",
      data: null,
    });
  }

  let event

  // ✅ Verify webhook signature
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
    console.log(`✅ Webhook signature verified: ${event.type} - ${event.id}`);
  } catch (error: any) {
    console.error("❌ Error verifying Stripe webhook signature:", error.message);
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: `Webhook signature verification failed: ${error.message}`,
      data: null,
    });
  }

  // ✅ Process webhook event
  try {
    const result = await PaymentWebhookService.handleStripeWebhook(event);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Stripe webhook event processed successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("❌ Error handling Stripe webhook event:", error);
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message || "Error handling Stripe webhook event",
      data: null,
    });
  }
});





/**
 *  Create Payment Intent Controller
 */
const createPaymentIntent = catchAsync(
  async (req: Request, res: Response) => {
    const result = await PaymentService.createPaymentIntent(
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment intent created successfully",
      data: result,
    });
  }
);

/**
 *  Save Payment Record Controller
 */
const savePaymentRecord = catchAsync(
  async (req: Request, res: Response) => {
    const result = await PaymentService.savePaymentRecord(
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Payment saved successfully",
      data: result,
    });
  }
);

export const PaymentController = {
  createPaymentIntent,
  savePaymentRecord,
  handleStripeWebhookEvent
};


