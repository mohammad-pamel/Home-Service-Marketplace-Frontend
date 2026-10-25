export type WorkLog = {
  id: string;
  bookingId: string;
  title: string;
  description?: string | null;
  startedAt: string;
  completedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  booking?: {
    id: string;
    status: string;
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