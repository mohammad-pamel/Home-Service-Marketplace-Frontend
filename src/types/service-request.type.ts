
export type ServiceRequestStatus =
  | "PENDING"
  | "MATCHED"
  | "ACCEPTED"
  | "REJECTED"
  | "CANCELLED"
  | "IN_PROGRESS"
  | "COMPLETED";

export type AssignmentStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "CANCELLED"
  | "COMPLETED";

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface ServiceRequestCustomer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

export interface ServiceRequestServiceInfo {
  id: string;
  name: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface ServiceRequestLocation {
  id: string;
  address: string;
  city: string | null;
  area: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface ServiceRequestProvider {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

export interface ServiceRequestAssignment {
  id: string;
  serviceRequestId: string;
  providerId: string;
  status: AssignmentStatus;
  assignedAt: string;
  respondedAt: string | null;
  provider: ServiceRequestProvider;
}

export interface ServiceRequestBooking {
  id: string;
  serviceRequestId: string;
  customerId: string;
  providerId: string;
  locationId: string;
  scheduledAt: string;
  status: BookingStatus;
  totalAmount: string;
}

export interface ServiceRequest {
  id: string;
  customerId: string;
  serviceId: string;
  locationId: string;
  title: string;
  description: string;
  preferredDate: string | null;
  preferredTime: string | null;
  status: ServiceRequestStatus;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  customer: ServiceRequestCustomer;
  service: ServiceRequestServiceInfo;
  location: ServiceRequestLocation;
  assignments: ServiceRequestAssignment[];
  booking: ServiceRequestBooking | null;
}


export type CreateServiceRequestPayload = {
  serviceId: string;
  title: string;
  description: string;
  address: string;
  city?: string;
  area?: string;
  latitude?: number;
  longitude?: number;
  preferredDate?: string;
  preferredTime?: string;
};