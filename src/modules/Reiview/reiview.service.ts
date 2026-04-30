

import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IReviewPayload } from "./reiview.interface";

const createReview = async (
  studentId: string,
  payload: IReviewPayload
) => {
  return prisma.$transaction(async (tx) => {
    //  Find booking
    const booking = await tx.booking.findUnique({
      where: { id: payload.bookingId },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    //  Ensure booking belongs to student
    if (booking.studentId !== studentId) {
      throw new Error("Unauthorized");
    }

    //  Ensure booking completed
    if (booking.status !== BookingStatus.COMPLETED) {
      throw new Error("Can only review completed sessions");
    }

    //  Check if already reviewed
    const existingReview = await tx.review.findUnique({
      where: { bookingId: payload.bookingId },
    });

    if (existingReview) {
      throw new Error("Review already submitted");
    }

    //  Create review
    const review = await tx.review.create({
      data: {
        rating: payload.rating,
         review: payload.review, 
        comment: payload.comment,
        studentId,
        tutorId: booking.tutorId, // IMPORTANT
        bookingId: booking.id,
      },
    });

    //  Recalculate tutor rating
    const reviews = await tx.review.findMany({
      where: { tutorId: booking.tutorId },
    });

    const totalReviews = reviews.length;
    const avgRating =
      reviews.reduce((sum: number, r) => sum + Number(r.rating), 0) /
      totalReviews;

    //  Update TutorProfile
    await tx.tutorProfiles.update({
      where: { id: booking.tutorId },
      data: {
        // rating: avgRating,
        // totalReviews,
        avgRating: Number(avgRating.toFixed(1)),
        totalReviews: totalReviews,
      },
    });

    return review;
  });
};

const getTutorReviews = async (tutorUserId: string) => {
  return prisma.review.findMany({
    where: { tutorId: tutorUserId },
    include: {
      student: {
        select: {
          name: true,
          avatar: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};



export const ReviewService = {
  createReview,
  getTutorReviews,
};