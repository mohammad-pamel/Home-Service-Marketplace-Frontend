export type PaymentStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentProvider = "STRIPE" | "BKASH" | "SSLCOMMERZ";

export type PaymentMethod =
  | "CARD"
  | "MOBILE_BANKING"
  | "ONLINE_PAYMENT";

export type Payment = {
  id: string;
  bookingId: string;
  provider: PaymentProvider;
  method: PaymentMethod;
  amount: number | string;
  status: PaymentStatus;
  merchantInvoiceNumber?: string | null;
  bkashPaymentId?: string | null;
  bkashTrxId?: string | null;
  transactionId?: string | null;
  paidAt?: string | null;
  createdAt: string;
  updatedAt?: string;

  booking?: {
    id: string;
    customer?: {
      id: string;
      name: string;
      email: string;
    };
    provider?: {
      id: string;
      name: string;
      email: string;
    };
    serviceRequest?: {
      service?: {
        name: string;
      };
    };
  };
};