export interface ProviderUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "PROVIDER";
  status: "ACTIVE" | "SUSPENDED" | "BLOCKED";
  emailVerified: boolean;
  imageUrl: string;
  createdAt: string;
}

export interface Provider {
  id: string;
  userId: string;
  bio: string | null;
  experienceYears: number;
  isVerified: boolean;
  rating: number;
  totalReviews: number;
  totalJobs: number;
  serviceArea: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
  user: ProviderUser;
}

export interface ProviderApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Provider[];
}

export interface ProviderProfile {
  id: string;
  userId: string;
  bio?: string | null;
  experienceYears: number;
  isVerified: boolean;
  rating: number;
  totalReviews: number;
  totalJobs: number;
  serviceArea?: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    status: string;
  };
}

// export interface Assignment {
//   id: string;
//   serviceRequestId: string;
//   providerId: string;
//   status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED" | "COMPLETED";
//   assignedAt: string;
//   respondedAt?: string | null;
//   provider?: {
//     id: string;
//     name: string;
//     email: string;
//     phone?: string | null;
//   };
// }

// export interface ProviderProfile {
//   id: string;
//   userId: string;
//   bio: string | null;
//   experienceYears: number;
//   isVerified: boolean;
//   rating: number;
//   totalReviews: number;
//   totalJobs: number;
//   serviceArea: string | null;
//   latitude: number | null;
//   longitude: number | null;
//   createdAt: string;
//   updatedAt: string;
// }

export interface ProviderProfilePayload {
  bio?: string;
  experienceYears?: number;
  serviceArea?: string;
  latitude?: number;
  longitude?: number;
}



export interface Assignment {
  id: string;
  serviceRequestId: string;
  providerId: string;
  status:
    | "PENDING"
    | "ACCEPTED"
    | "REJECTED"
    | "CANCELLED"
    | "COMPLETED";
  assignedAt: string;
  respondedAt?: string | null;

  serviceRequest?: {
    id: string;
    title: string;
    description: string;
    preferredDate?: string | null;
    preferredTime?: string | null;
    status: string;

    service: {
      id: string;
      name: string;
      description?: string | null;
      basePrice: number | string;
    };

    location: {
      id: string;
      address: string;
      city?: string | null;
      area?: string | null;
    };

    customer: {
      id: string;
      name: string;
      email: string;
      phone?: string | null;
    };
  };
}





export interface ProviderService {
  id: string;
  providerId: string;
  serviceId: string;
  price: number | string;
  createdAt: string;
  updatedAt: string;

  service: {
    id: string;
    name: string;
    description?: string | null;
    basePrice: number | string;
    category: {
      id: string;
      name: string;
    };
  };
}

export interface CreateProviderServicePayload {
  serviceId: string;
  price?: number;
}

export interface UpdateProviderServicePayload {
  price?: number;
}
