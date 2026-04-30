
import { Booking, Role } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

type BookingPayload = Omit<Booking, "id" | "createdAt" | "updatedAt">;

const createBookingIntoDB = async (
  payload: BookingPayload,
  userId: string // লগইন করা স্টুডেন্টের আইডি
) => {
  return await prisma.$transaction(async (tx) => {

    // =========================
    // 1. STUDENT CHECK
    // =========================
    const student = await tx.user.findUnique({
      where: { id: userId },
    });

    if (!student) throw new Error("Student not found");

    if (student.role !== Role.STUDENT) {
      throw new Error("Only students can book tutors");
    }

    // =========================
    // 2. TUTOR CHECK
    // =========================
    const tutorProfile = await tx.tutorProfiles.findUnique({
      where: { id: payload.tutorId },
      include: { user: true },
    });

    if (!tutorProfile) throw new Error("Tutor not found");

    if (tutorProfile.user.role !== Role.TUTOR) {
      throw new Error("Selected user is not a tutor");
    }

    // =========================
    // 3. CATEGORY CHECK
    // =========================
    const category = await tx.category.findUnique({
      where: { id: payload.categoryId },
    });

    if (!category) throw new Error("Category not found");

    // =========================
    // 4. SUBJECT CHECK
    // =========================
    if (!payload.subjectId) {
      throw new Error("Subject is required");
    }

    const subject = await tx.subject.findUnique({
      where: { id: payload.subjectId },
    });

    if (!subject) throw new Error("Subject not found");

    // =========================
    // 5. DATE VALIDATION
    // =========================
    const start = new Date(payload.startDate);
    const end = new Date(payload.endDate);

    if (end.getTime() <= start.getTime()) {
      throw new Error("End date must be after start date");
    }

    // প্রতি ঘণ্টার হিসেবে ডিউরেশন বের করা
    const durationInHour = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

    if (durationInHour <= 0) {
      throw new Error("Invalid time range");
    }

    // =========================
    // 6. OVERLAP CHECK (সঠিক লজিক)
    // =========================
    const existingBooking = await tx.booking.findFirst({
      where: {
        tutorId: tutorProfile.id,
        status: { not: "CANCELLED" }, // বাতিল হওয়া বুকিং বাদ দিয়ে চেক
        AND: [
          {
            startDate: { lt: end },
          },
          {
            endDate: { gt: start },
          },
        ],
      },
    });

    if (existingBooking) {
      throw new Error("Tutor is already booked at this time");
    }

    // =========================
    // 7. PRICE CALCULATION
    // =========================
    const totalPrice = durationInHour * category.price;

    // =========================
    // 8. CREATE BOOKING (FIXED)
    // =========================
    // ...payload ব্যবহার না করে ম্যানুয়ালি ডেটা ইনসার্ট করা নিরাপদ
    const booking = await tx.booking.create({
      data: {
        studentId: userId,           // সঠিক স্টুডেন্ট আইডি নিশ্চিত করা হলো
        tutorId: tutorProfile.id,
        categoryId: payload.categoryId,
        subjectId: payload.subjectId,
        startDate: start,
        endDate: end,
        totalPrice: Number(totalPrice.toFixed(2)), // দশমিক ২ ঘর পর্যন্ত রাখা
        status: "PENDING",
        note: payload.note || "",
      },
      include: {
        subject: true,
        tutor: true,
        category: true
      }
    });

    return booking;
  });
};

export const BookingService = {
  createBookingIntoDB,
};