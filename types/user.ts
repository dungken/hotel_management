export interface User {
  userId: number;
  username: string;
  email: string;
  dateCreated: string;
  roles: string[];
}

export type UserRole = 'ADMIN' | 'MANAGER' | 'RECEPTIONIST' | 'STAFF' | 'ACCOUNTANT' | 'HOUSEKEEPER' | 'CHEF' | 'SECURITY' | 'MAINTENANCE';

export interface CreateUserDto {
  username: string;
  email: string;
  roles: UserRole[];
}

export interface UpdateUserDto extends Partial<CreateUserDto> {} 