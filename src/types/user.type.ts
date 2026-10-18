export type UserRole = "SUPER_ADMIN" | "ADMIN" | "PROVIDER" | "CUSTOMER";

export type UserStatus = "ACTIVE" | "SUSPENDED" | "BLOCKED";

export type AuthProvider = "GOOGLE" | "CREDENTIAL";



export interface User {
  id:       string;   
  name:     string;
  email:    string;    
  password?: string;
  googleId?:  null | string;      
  authProvider:       AuthProvider;
  emailVerified:      boolean;      
  phone?:    string;
  role:     UserRole;       
  status:   UserStatus; 
  needPasswordChange: boolean;
  imageUrl:     null | string;      
  imagePublicId: null | string;      
  deletedAt?: null | string;
  createdAt: string;  
  updatedAt: string; 
}