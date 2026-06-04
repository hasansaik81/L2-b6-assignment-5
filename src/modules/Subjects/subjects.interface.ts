




//     import PaymentSection from "@/components/paymentForm/PaymentSection";
// import { getSingleBooking } from "@/services/booking";

// export default async function ConfirmPage({
//   searchParams,
// }: {
//   searchParams: Promise<{ bookingId?: string }>;
// }) {

//   const params = await searchParams;

//   const bookingId = params.bookingId;

//   // ❌ invalid booking
//   if (!bookingId) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Invalid Booking ID
//       </div>
//     );
//   }

//   // ✅ fetch booking
//   const response = await getSingleBooking(
//     bookingId
//   );

//   const booking = response?.data;

//   // ✅ payment check
//   const isPaid =
//     booking?.status === "CONFIRMED";

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">

//       <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

//         {/* Title */}
//         <h1 className="text-3xl font-bold mb-6 text-center">
//           Booking Confirmation
//         </h1>

//         {/* Booking Info */}
//         <div className="space-y-4 mb-6">

//           <div className="flex justify-between">
//             <span className="font-medium">
//               Booking ID
//             </span>

//             <span>{bookingId}</span>
//           </div>

//           <div className="flex justify-between">
//             <span className="font-medium">
//               Amount
//             </span>

//             <span>
//               ${booking?.totalPrice}
//             </span>
//           </div>

//           <div className="flex justify-between">
//             <span className="font-medium">
//               Status
//             </span>

//             <span
//               className={
//                 isPaid
//                   ? "text-green-600 font-semibold"
//                   : "text-red-500 font-semibold"
//               }
//             >
//               {isPaid
//                 ? "Paid"
//                 : "Pending"}
//             </span>
//           </div>

//         </div>

//         {/* Payment */}
//         {!isPaid ? (
//           <PaymentSection
//             bookingId={bookingId}
//             amount={booking?.totalPrice}
//           />
//         ) : (
//           <div className="text-center">

//             <h2 className="text-2xl font-bold text-green-600">
//               🎉 Payment Successful
//             </h2>

//             <p className="text-gray-600 mt-2">
//               Your booking has been confirmed.
//             </p>

//           </div>
//         )}

//       </div>

//     </div>
//   );
// }




// review page 


// import { getMyReviews } from "@/services/review-index";

// export default async function StudentReviewsPage() {
//   const response = await getMyReviews();
//   const myReviews = response?.data || [];

//   return (
//     <div className="bg-white p-4 rounded shadow">
//       <h1 className="text-xl font-semibold mb-4">আমার দেওয়া রিভিউসমূহ</h1>
//       {myReviews.map((review: any) => (
//         <div key={review.id} className="border-b py-2">
//           <p className="font-bold">রেটিং: {review.rating}/5</p>
//           <p>{review.comment}</p>
//         </div>
//       ))}
//     </div>
//   );
// }


// src/app/dashboard/bookings/checkout/[bookingId]/page.tsx


// export default function CheckoutPage({
//   params,
// }: {
//   params: {
//     bookingId: string;
//   };
// }) {

//   return (
//     <div>
//       Payment Success

//       {params.bookingId}
//     </div>
//   );
// }


// amar path hobe success_url:
// `http://localhost:3000/booking-confirm?bookingId=${bookingId}`


// best hobe src/app/booking-confirm/[bookingId]/page.tsx