// /* eslint-disable @typescript-eslint/no-explicit-any */
// import Stripe from "stripe";
// import config from "../../config";
// import { prisma } from "../../lib/prisma";
// import { generateInvoicePdf } from "./payment.utils";
// import { uploadFileToCloudinary } from "../../config/cloudinary.config";
// import { sendEmail } from "../../utils/email";

// const stripe = new Stripe(config.stripe_secret_key as string, {
//     apiVersion: "2023-10-16" as any,
// });

// const handleStripeWebhook = async (event: Stripe.Event) => {
//     // 1. Idempotency Check
//     const existingPayment = await prisma.payment.findFirst({
//         where: { stripeEventId: event.id }
//     });

//     if (existingPayment) return { message: "Already processed" };

//     switch (event.type) {
//         case "payment_intent.succeeded": {
//             const paymentIntent = event.data.object as Stripe.PaymentIntent;
//             const bookingId = paymentIntent.metadata.bookingId;

//             if (!bookingId) break;

//             const booking = await prisma.booking.findUnique({
//                 where: { id: bookingId },
//                 include: { student: true, tutor: true }
//             });

//             if (!booking) break;

//             let pdfBuffer: Buffer | null = null;
//             let invoiceUrl = null;

//             // Generate & Upload Invoice
//             try {
//                 pdfBuffer = await generateInvoicePdf({
//                     invoiceId: `INV-${booking.id.slice(-6)}`,
//                     studentName: booking.student.name,
//                     studentEmail: booking.student.email,
//                     tutorName: booking.tutor.name,
//                     sessionName: "SkillBridge Session", // Apnar course name field thakle sheta diben
//                     amount: booking.totalPrice,
//                     transactionId: paymentIntent.id,
//                     paymentDate: new Date().toISOString()
//                 });

//                 const cloudinaryRes = await uploadFileToCloudinary(pdfBuffer, `invoices/${bookingId}`);
//                 invoiceUrl = cloudinaryRes?.secure_url;
//             } catch (err) {
//                 console.error("PDF/Cloudinary Error:", err);
//             }

//             // Database Update (Transaction)
//             await prisma.$transaction(async (tx) => {
//                 await tx.payment.create({
//                     data: {
//                         bookingId,
//                         transactionId: paymentIntent.id,
//                         amount: booking.totalPrice,
//                         status: "SUCCESS",
//                         stripeEventId: event.id,
//                         paymentGatewayData: paymentIntent,
//                         invoiceUrl: invoiceUrl
//                     }
//                 });

//                 await tx.booking.update({
//                     where: { id: bookingId },
//                     data: { status: "CONFIRMED" }
//                 });
//             });

//             // Email Notification
//             if (invoiceUrl) {
//                 await sendEmail({
//                     to: booking.student.email,
//                     subject: "Payment Confirmed - SkillBridge",
//                     templateName: "invoice",
//                     templateData: {
//                         studentName: booking.student.name, // Fixed: Not patientName
//                         amount: booking.totalPrice,
//                         invoiceUrl: invoiceUrl
//                     }
//                 });
//             }
//             break;
//         }
//     }
//     return { success: true };
// };

// export const PaymentService = { handleStripeWebhook };





/* eslint-disable @typescript-eslint/no-explicit-any */



   
/* eslint-disable @typescript-eslint/no-explicit-any */

// import Stripe from "stripe";
// import config from "../../config";
// import { prisma } from "../../lib/prisma";
// import { generateInvoicePdf } from "./payment.utils";



// const stripe = new Stripe(config.stripe_secret_key as string, {
//   apiVersion: "2023-10-16" as any,
// });

// type StripeEvent = any

// const handleStripeWebhook = async (event: StripeEvent) => {
//   // 1. Duplicate event check (idempotency)
//   const existingPayment = await prisma.payment.findFirst({
//     where: {
//       stripeEventId: event.id,
//     },
//   });

//   if (existingPayment) {
//     return {
//       message: `Event ${event.id} already processed`,
//     };
//   }

//   switch (event.type) {
//     case "payment_intent.succeeded": {
//       const paymentIntent = event.data.object as any;

//       const bookingId = paymentIntent.metadata?.bookingId;

//       if (!bookingId) {
//         return {
//           message: "Booking ID missing",
//         };
//       }

//       // 2. FIXED BOOKING QUERY (IMPORTANT FIX HERE)
//       const booking = await prisma.booking.findUnique({
//         where: {
//           id: bookingId,
//         },
//         include: {
//           tutor: {
//             include: {
//               user: true, // ✅ tutor.user.name
//             },
//           },
//           student: true, // ✅ FIX: must include student relation
//         },
//       });

//       if (!booking) {
//         return {
//           message: "Booking not found",
//         };
//       }

//       // 3. Duplicate transaction check
//       const existingTransaction = await prisma.payment.findUnique({
//         where: {
//           transactionId: paymentIntent.id,
//         },
//       });

//       if (existingTransaction) {
//         return {
//           message: "Payment already saved",
//         };
//       }

//       // 4. Generate invoice (FIXED SAFE ACCESS)
//       const pdfBuffer = await generateInvoicePdf({
//         invoiceId: paymentIntent.id,
//         studentName: booking.student?.name,
//         studentEmail: booking.student?.email,
//         tutorName: booking.tutor?.user?.name,
//         bookingDate: booking.createdAt.toISOString(),
//         amount: booking.totalPrice,
//         transactionId: paymentIntent.id,
//         paymentDate: new Date().toISOString(),
//       });

//       // 5. Transaction block
//       await prisma.$transaction(async (tx) => {
//         await tx.payment.create({
//           data: {
//             bookingId: booking.id,
//             transactionId: paymentIntent.id,
//             amount: booking.totalPrice,
//             status: "SUCCESS",
//             stripeEventId: event.id,
//             paymentGatewayData: paymentIntent,
//           },
//         });

//         await tx.booking.update({
//           where: {
//             id: booking.id,
//           },
//           data: {
//             status: "CONFIRMED",
//           },
//         });
//       });

//       console.log("✅ Payment successful");
//       console.log("📄 Invoice generated");

//       break;
//     }

//     case "payment_intent.payment_failed": {
//       const paymentIntent = event.data.object as any;

//       console.log(`❌ Payment failed: ${paymentIntent.id}`);
//       break;
//     }

//     default:
//       console.log(`Unhandled event: ${event.type}`);
//   }

//   return {
//     message: `Webhook processed: ${event.id}`,
//   };
// };

// export const PaymentWebhookService = {
//   handleStripeWebhook,
// };







/* eslint-disable @typescript-eslint/no-explicit-any */

import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16" as any,
});

type StripeEvent = any

const handleStripeWebhook = async (event: StripeEvent) => {
  try {
    // ✅ 1. Idempotency check (duplicate event stop)
    const existingEvent = await prisma.payment.findFirst({
      where: {
        stripeEventId: event.id,
      },
    });

    if (existingEvent) {
      console.log(`⚠️ Event already processed: ${event.id}`);
      return { message: "Already processed" };
    }

    switch (event.type) {

      // ===============================
      // ✅ PAYMENT SUCCESS (MAIN FLOW)
      // ===============================
      case "checkout.session.completed": {
        const session = event.data.object as any;

        const bookingId = session.metadata?.bookingId;

        if (!bookingId) {
          console.log("❌ Missing bookingId in metadata");
          return { message: "Missing bookingId" };
        }

        // 🔍 booking check
        const booking = await prisma.booking.findUnique({
          where: { id: bookingId },
          include: {
            student: true,
            tutor: {
              include: { user: true },
            },
          },
        });

        if (!booking) {
          console.log("❌ Booking not found");
          return { message: "Booking not found" };
        }

        const paymentIntentId = session.payment_intent;

        // 💰 amount safe convert
        const amount = Number(booking.totalPrice);

        // 🧠 Transaction block
        await prisma.$transaction(async (tx) => {
          // 1. create payment record
          await tx.payment.create({
            data: {
              bookingId: booking.id,
              transactionId: paymentIntentId,
              stripePaymentId: paymentIntentId,
              amount: amount,
              currency: "usd",
              status:
                session.payment_status === "paid"
                  ? "SUCCESS"
                  : "FAILED",
              stripeEventId: event.id,
              paymentGatewayData: session,
            },
          });

          // 2. update booking status
          if (session.payment_status === "paid") {
            await tx.booking.update({
              where: { id: booking.id },
              data: {
                status: "CONFIRMED",
              },
            });
          }
        });

        console.log("✅ Payment successful for booking:", bookingId);
        break;
      }

      // ===============================
      // ❌ PAYMENT FAILED
      // ===============================
      case "payment_intent.payment_failed": {
        const intent = event.data.object as any;

        console.log(`❌ Payment failed: ${intent.id}`);

        break;
      }

      // ===============================
      // ⏰ SESSION EXPIRED
      // ===============================
      case "checkout.session.expired": {
        const session = event.data.object as any;

        console.log(`⏰ Session expired: ${session.id}`);

        break;
      }

      default:
        console.log(`ℹ️ Unhandled event: ${event.type}`);
    }

    return {
      message: `Webhook processed: ${event.id}`,
    };
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Webhook processing failed"
    );
  }
};

export const PaymentWebhookService = {
  handleStripeWebhook,
};