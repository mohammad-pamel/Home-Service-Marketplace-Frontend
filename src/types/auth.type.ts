export enum Role {
  CUSTOMER = "CUSTOMER",
  PROVIDER = "PROVIDER",
  ADMIN = "ADMIN",
}

export interface RegistrationPayload {
  name: string;
  email: string;
  password: string;
//   phone?: string;
  role: Role;
  customer: {
    contactNumber?: string;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyAccountPayload {
  email: string;
  otp: string;
}
