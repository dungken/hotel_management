export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  dateCreated: string;
  lastLogin?: string;
  roles: UserRole[];
  status?: 'ACTIVE' | 'INACTIVE';
}

export type UserRole = 'ADMIN' | 'MANAGER' | 'RECEPTIONIST' | 'STAFF' | 'ACCOUNTANT' | 'HOUSEKEEPER' | 'CHEF' | 'SECURITY' | 'MAINTENANCE';

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  roles: UserRole[];
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  roles?: UserRole[];
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface UserSearchParams {
  q?: string;
  email?: string;
  roles?: string;
  status?: string;
  page?: number;
  limit?: number;
}
