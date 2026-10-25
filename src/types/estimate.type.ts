export type EstimateStatus =
  | "DRAFT"
  | "SENT"
  | "APPROVED"
  | "REJECTED"
  | "EXPIRED";

export type EstimateItem = {
  id: string;
  estimateId: string;
  description: string;
  quantity: number;
  unitPrice: number | string;
  total: number | string;
};

export type Estimate = {
  id: string;
  bookingId: string;
  subtotal: number | string;
  tax: number | string;
  discount: number | string;
  total: number | string;
  status: EstimateStatus;
  notes?: string | null;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  items: EstimateItem[];
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
      location?: {
        address?: string;
      };
    };
  };
};