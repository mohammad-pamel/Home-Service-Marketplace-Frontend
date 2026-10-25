
export type Availability = {
  id: string;
  providerId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
  provider?: {
    id: string;
    user?: {
      id: string;
      name: string;
      email: string;
    };
  };
};
