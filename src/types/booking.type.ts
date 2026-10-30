export type Booking = {
  id: string;
  status: "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  scheduledAt: string;
  totalAmount: number | string;
  createdAt: string;
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



// export type BookingStatus =
//   | "PENDING"
//   | "CONFIRMED"
//   | "IN_PROGRESS"
//   | "COMPLETED"
//   | "CANCELLED";

// export type Booking = {
//   id: string;
//   serviceRequestId: string;
//   customerId: string;
//   providerId: string;
//   locationId: string;
//   scheduledAt: string;
//   status: BookingStatus;
//   totalAmount: number | string;
//   createdAt: string;
//   updatedAt: string;

//   serviceRequest?: {
//     id: string;
//     service?: {
//       id: string;
//       name: string;
//       description?: string | null;
//     };
//     location?: {
//       id: string;
//       address?: string;
//       city?: string;
//       area?: string;
//     };
//   };

//   customer?: {
//     id: string;
//     name: string;
//     email: string;
//     phone?: string | null;
//   };

//   provider?: {
//     id: string;
//     name: string;
//     email: string;
//   };

//   estimate?: {
//     id: string;
//     totalAmount?: number | string;
//     status?: string;
//   } | null;

//   payments?: {
//     id: string;
//     amount: number | string;
//     status: string;
//   }[];

//   review?: {
//     id: string;
//     rating: number;
//     comment?: string | null;
//   } | null;
// };
