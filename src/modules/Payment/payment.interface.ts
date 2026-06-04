
// export type TIPaymentResult = {
//     clientSecret: string;
//     amount: number;
//     transactionId?: string;
// };

// export type TPaymentIntent = {
//     bookingId: string;
// };

// export type TPaymentConfirmation = {
//     transactionId: string;
//     bookingId: string;
//     amount: number;
//     status: string;
//     gatewayData?: any;
// }





// payment.interface.ts
export interface TPaymentIntent {
  bookingId: string;
}

export interface TIPaymentResult {
  clientSecret: string;
  amount: number;
  transactionId: string;
}

export interface TPaymentConfirmation {
  bookingId: string;
  transactionId: string;
  amount: number;  // আসলে Decimal হবে কিন্তু number পাস করুন
  status: "succeeded" | "failed";
  gatewayData?: any;
  stripePaymentId?: string;
  stripeSessionId?: string;
}
