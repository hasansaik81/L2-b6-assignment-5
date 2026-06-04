// export type TTutor = {
//     // Add interface properties here
//     };




//     "use client";

// import {
//   CardElement,
//   useElements,
//   useStripe,
// } from "@stripe/react-stripe-js";

// import { confirmPayment } from "@/services/payment";

// type Props = {
//   bookingId: string;
//   amount: number;
// };

// export default function CheckoutForm({
//   bookingId,
//   amount,
// }: Props) {

//   const stripe = useStripe();
//   const elements = useElements();

//   const handleSubmit = async (
//     e: React.FormEvent
//   ) => {

//     e.preventDefault();

//     if (!stripe || !elements) return;

//     const cardElement =
//       elements.getElement(CardElement);

//     if (!cardElement) return;

//     const result =
//       await stripe.confirmCardPayment(
//         "",
//         {
//           payment_method: {
//             card: cardElement,
//           },
//         }
//       );

//     if (result.error) {

//       alert(result.error.message);

//       return;
//     }

//     if (
//       result.paymentIntent?.status ===
//       "succeeded"
//     ) {

//       // ✅ confirm backend
//       await confirmPayment(
//         bookingId,
//         result.paymentIntent.id
//       );

//       window.location.href =
//         "/payment/success";
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>

//       <div className="border p-4 rounded-lg mb-4">
//         <CardElement />
//       </div>

//       <button
//         type="submit"
//         className="w-full bg-black text-white py-3 rounded-xl"
//       >
//         Pay ${amount}
//       </button>
//     </form>
//   );
// }





// const session = await stripe.checkout.sessions.create({
//   payment_method_types: ["card"],

//   line_items: [
//     {
//       price_data: {
//         currency: "usd",

//         product_data: {
//           name: "Booking Payment",
//         },

//         unit_amount: amountInCents,
//       },

//       quantity: 1,
//     },
//   ],

//   mode: "payment",

//   success_url:
//     `http://localhost:3000/booking-confirm?bookingId=${bookingId}`,

//   cancel_url:
//     `http://localhost:3000/payment/cancel`,
// });




// ...existing code...



// ...existing code...







// http://localhost:3000/dashboard/bookings/checkout/YOUR_BOOKING_ID