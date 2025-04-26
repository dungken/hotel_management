export interface User {
  userId: number;
  username: string;
  email: string;
  role?: string;
  dateCreated?: string;
}

export interface LoginRequest {
  username?: string;
  email?: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
