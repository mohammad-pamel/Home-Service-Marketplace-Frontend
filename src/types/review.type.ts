export type ReviewStatus = "PUBLISHED" | "HIDDEN";

export type Review = {
  id: string;
  customerId: string;
  providerId: string;
  bookingId: string;
  rating: number;
  comment?: string | null;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;

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

  booking?: {
    id: string;
    status: string;
    serviceRequest?: {
      service?: {
        name: string;
      };
    };
  };
};