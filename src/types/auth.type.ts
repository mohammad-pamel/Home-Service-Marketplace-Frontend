export enum Role {
  CUSTOMER = "CUSTOMER",
  PROVIDER = "PROVIDER",
  ADMIN = "ADMIN",
}

export interface RegistrationPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: Role
}

