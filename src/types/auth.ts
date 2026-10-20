
export type UserRole = "superadmin" | "tenant-admin" | "team-member";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
