

// import { Booking, Role } from "../../../generated/prisma/client.js";
// import { prisma } from "../../lib/prisma.js";





// type BookingPayload = Omit<Booking, "id" | "createdAt" | "updatedAt">;

// const createBookingIntoDB = async (
//   payload: BookingPayload,
//   userId: string 
// ) => {
//   return await prisma.$transaction(async (tx: any) => {

//     // 1. STUDENT CHECK
//     const student = await tx.user.findUnique({
//       where: { id: userId },
//     });

//     if (!student) throw new Error("Student not found");
//     if (student.role !== Role.STUDENT) {
//       throw new Error("Only students can book tutors");
//     }

    
//     const tutorProfile = await tx.tutorProfiles.findUnique({
//       where: { id: payload.tutorId },
//       include: { user: true },
//     });

//     if (!tutorProfile) throw new Error("Tutor profile not found");
//     if (tutorProfile.user.role !== Role.TUTOR) {
//       throw new Error("Selected user is not a tutor");
//     }

//     const category = await tx.category.findUnique({
//       where: { id: payload.categoryId },
//     });

//     if (!category) throw new Error("Category not found");

//     // 3. SUBJECT CHECK
//     if (!payload.subjectId) throw new Error("Subject is required");
    
//     const subject = await tx.subject.findUnique({
//       where: { id: payload.subjectId },
//     });

//     if (!subject) throw new Error("Subject not found");

//     // 4. DATE VALIDATION & PARSING
//     const start = new Date(payload.startDate);
//     const end = new Date(payload.endDate);
//     const now = new Date();

   
//     // if (start < now) {
//     //   throw new Error("Cannot book a tutor for a past date/time");
//     // }

//     if (end <= start) {
//       throw new Error("End date must be after start date");
//     }

//     const durationInHour = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

   
//     const existingBooking = await tx.booking.findFirst({
//       where: {
//         tutorId: tutorProfile.id,
//         status: "PAID", 
//         AND: [
//           { startDate: { lt: end } },
//           { endDate: { gt: start } },
//         ],
//       },
//     });

//     if (existingBooking) {
//       throw new Error("The tutor is already booked (PAID) during this time slot");
//     }

//     // 6. PRICE CALCULATION
//     const totalPrice = durationInHour * category.price;

//     // 7. CREATE BOOKING
//     const booking = await tx.booking.create({
//       data: {
//         studentId: userId,          
//         tutorId: tutorProfile.id,
//         categoryId: payload.categoryId,
//         subjectId: payload.subjectId,
//         startDate: start,
//         endDate: end,
//         totalPrice: Number(totalPrice.toFixed(2)), 
//         status: "PENDING", 
//         note: payload.note || "",
//       },
//       include: {
//         subject: true,
//         tutor: {
//             include: {
//                 user: true 
//             }
//         },
//         category: true
//       }
//     });

//     return booking;
//   });
// };

// const getSingleBookingFromDB = async (bookingId: string) => {
//   const result = await prisma.booking.findUnique({
//     where: { id: bookingId },
//     include: {
//       tutor: {
//         include: {
//             user: true
//         }
//       },
//       subject: true,
//       category: true,
//     },
//   });

//   if(!result) throw new Error("Booking not found");
//   return result;
// };

// export const BookingService = {
//   createBookingIntoDB,
//   getSingleBookingFromDB,
// };






import { Booking, Role } from "@prisma/client";
import { prisma } from "../../lib/prisma";

type BookingPayload = Omit<Booking, "id" | "createdAt" | "updatedAt">;

const createBookingIntoDB = async (
  payload: BookingPayload,
  userId: string 
) => {
  return await prisma.$transaction(async (tx: any) => {

    // 1. STUDENT CHECK
    const student = await tx.user.findUnique({
      where: { id: userId },
    });

    if (!student) throw new Error("Student not found");
    if (student.role !== Role.STUDENT) {
      throw new Error("Only students can book tutors");
    }

    // 2. TUTOR CHECK
    const tutorProfile = await tx.tutorProfiles.findUnique({
      where: { id: payload.tutorId },
      include: { user: true },
    });

    if (!tutorProfile) throw new Error("Tutor profile not found");
    if (tutorProfile.user.role !== Role.TUTOR) {
      throw new Error("Selected user is not a tutor");
    }

    const category = await tx.category.findUnique({
      where: { id: payload.categoryId },
    });

    if (!category) throw new Error("Category not found");

    // 3. SUBJECT CHECK
    if (!payload.subjectId) throw new Error("Subject is required");
    
    const subject = await tx.subject.findUnique({
      where: { id: payload.subjectId },
    });

    if (!subject) throw new Error("Subject not found");

    // 4. DATE VALIDATION & PARSING
    const start = new Date(payload.startDate);
    const end = new Date(payload.endDate);

    if (end <= start) {
      throw new Error("End date must be after start date");
    }

    const durationInHour = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

    // 5. OVERLAP CHECK
    const existingBooking = await tx.booking.findFirst({
      where: {
        tutorId: tutorProfile.id,
        status: "PAID", 
        AND: [
          { startDate: { lt: end } },
          { endDate: { gt: start } },
        ],
      },
    });

    if (existingBooking) {
      throw new Error("The tutor is already booked (PAID) during this time slot");
    }

    // 6. PRICE CALCULATION
    const totalPrice = durationInHour * category.price;

    // 7. CREATE BOOKING
    const booking = await tx.booking.create({
      data: {
        studentId: userId,          
        tutorId: tutorProfile.id,
        categoryId: payload.categoryId,
        subjectId: payload.subjectId,
        startDate: start,
        endDate: end,
        totalPrice: Number(totalPrice.toFixed(2)), 
        status: "PENDING", 
        note: payload.note || "",
      },
      include: {
        subject: true,
        tutor: {
          include: {
            user: true 
          }
        },
        category: true
      }
    });

    return booking;
  });
};

const getSingleBookingFromDB = async (bookingId: string) => {
  const result = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      tutor: {
        include: {
          user: true
        }
      },
      subject: true,
      category: true,
    },
  });

  if(!result) throw new Error("Booking not found");
  return result;
};

export const BookingService = {
  createBookingIntoDB,
  getSingleBookingFromDB,
};