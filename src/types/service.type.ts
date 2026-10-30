export interface Service {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string | null;
  basePrice: number | string;
  durationMinutes: number | null;
  isActive: boolean;
  category?: {
    id: string;
    name: string;
  };
}

export interface CreateServicePayload {
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  basePrice: number;
  durationMinutes?: number;
}

export interface UpdateServiceVariables {
  serviceId: string;
  payload: CreateServicePayload;
}


export interface PaginatedResponse<T> {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: T[];
}

