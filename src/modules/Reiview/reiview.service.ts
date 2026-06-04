


// import { BookingStatus } from "../../../generated/prisma/client.js";
// import { prisma } from "../../lib/prisma.js";
// import { IReviewPayload } from "./reiview.interface.js";

// const createReview = async (
//   studentId: string,
//   payload: IReviewPayload
// ) => {
//   return prisma.$transaction(async (tx) => {
//     //  Find booking
//     const booking = await tx.booking.findUnique({
//       where: { id: payload.bookingId },
//     });

//     if (!booking) {
//       throw new Error("Booking not found");
//     }

//     //  Ensure booking belongs to student
//     if (booking.studentId !== studentId) {
//       throw new Error("Unauthorized");
//     }

//     //  Ensure booking completed
//     if (booking.status !== BookingStatus.COMPLETED) {
//       throw new Error("Can only review completed sessions");
//     }

//     //  Check if already reviewed
//     const existingReview = await tx.review.findUnique({
//       where: { bookingId: payload.bookingId },
//     });

//     if (existingReview) {
//       throw new Error("Review already submitted");
//     }

//     //  Create review
//     const review = await tx.review.create({
//       data: {
//         rating: payload.rating,
//          review: payload.review, 
//         comment: payload.comment,
//         studentId,
//         tutorId: booking.tutorId, // IMPORTANT
//         bookingId: booking.id,
//       },
//     });

//     //  Recalculate tutor rating
//     const reviews = await tx.review.findMany({
//       where: { tutorId: booking.tutorId },
//     });

//     const totalReviews = reviews.length;
//     const avgRating =
//       reviews.reduce((sum: number, r) => sum + Number(r.rating), 0) /
//       totalReviews;

//     //  Update TutorProfile
//     await tx.tutorProfiles.update({
//       where: { id: booking.tutorId },
//       data: {
//         // rating: avgRating,
//         // totalReviews,
//         avgRating: Number(avgRating.toFixed(1)),
//         totalReviews: totalReviews,
//       },
//     });

//     return review;
//   });
// };

// const getTutorReviews = async (tutorUserId: string) => {
//   return prisma.review.findMany({
//     where: { tutorId: tutorUserId },
//     include: {
//       student: {
//         select: {
//           name: true,
//           avatar: true,
//         },
//       },
//     },
//     orderBy: { createdAt: "desc" },
//   });
// };



// export const ReviewService = {
//   createReview,
//   getTutorReviews,
// };




// import { BookingStatus } from "../../../generated/prisma/client.js";

import { BookingStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { IReviewPayload } from "./reiview.interface.js";

const createReview = async (
  studentId: string,
  payload: IReviewPayload
) => {
  return prisma.$transaction(async (tx) => {
    // Find booking
    const booking = await tx.booking.findUnique({
      where: {
        id: payload.bookingId,
      },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    // Ensure booking belongs to student
    if (booking.studentId !== studentId) {
      throw new Error("Unauthorized");
    }

    // Ensure booking completed
    if (booking.status !== BookingStatus.COMPLETED) {
      throw new Error("Can only review completed sessions");
    }

    // Check if already reviewed
    const existingReview = await tx.review.findUnique({
      where: {
        bookingId: payload.bookingId,
      },
    });

    if (existingReview) {
      throw new Error("Review already submitted");
    }

    // Create review
    const review = await tx.review.create({
      data: {
        rating: payload.rating,
        comment: payload.comment,
        studentId,
        tutorId: booking.tutorId,
        bookingId: booking.id,
      },
    });

    // Get all tutor reviews
    const reviews = await tx.review.findMany({
      where: {
        tutorId: booking.tutorId,
      },
    });

    const totalReviews = reviews.length;

    const avgRating =
      totalReviews > 0
        ? reviews.reduce(
            (sum, review) => sum + Number(review.rating),
            0
          ) / totalReviews
        : 0;

    // Update tutor profile
    await tx.tutorProfiles.update({
      where: {
        id: booking.tutorId,
      },
      data: {
        avgRating: Number(avgRating.toFixed(1)),
        totalReviews,
      },
    });

    return review;
  });
};

const getTutorReviews = async (tutorUserId: string) => {
  return prisma.review.findMany({
    where: {
      tutorId: tutorUserId,
    },
    include: {
      student: {
        select: {
          name: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const ReviewService = {
  createReview,
  getTutorReviews,
};