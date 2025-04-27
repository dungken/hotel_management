import api from './api';
import { AUTH_KEYS, DEFAULT_PASSWORD } from '@/constants';
import { User } from '@/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  roles: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // In a real implementation, this would call an authentication endpoint
      // For this mock implementation, we'll check against existing users
      const response = await api.get('/users');
      const users = response.data;
      
      const user = users.find((u: User) => u.email === credentials.email);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // In a real app, we'd verify the password here
      // For mock purposes, let's use the default password
      if (credentials.password !== DEFAULT_PASSWORD) {
        throw new Error('Invalid email or password');
      }

      const token = this.generateMockToken();
      this.setToken(token);
      this.setUser(user);

      return { user, token };
    } catch (error) {
      throw error;
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Check if email already exists
      const response = await api.get('/users');
      const users = response.data;
      
      if (users.some((u: User) => u.email === data.email)) {
        throw new Error('Email already registered');
      }

      // Create new user
      const newUser: User = {
        id: users.length + 1,
        username: data.username,
        email: data.email,
        roles: data.roles,
        dateCreated: new Date().toISOString()
      };

      await api.post('/users', newUser);

      const token = this.generateMockToken();
      this.setToken(token);
      this.setUser(newUser);

      return { user: newUser, token };
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      // In a real implementation, this would send a password reset email
      const response = await api.get('/users');
      const users = response.data;
      
      const user = users.find((u: User) => u.email === email);
      
      if (!user) {
        throw new Error('Email not found');
      }

      // Simulate sending email
      console.log(`Password reset email sent to ${email}`);
      return Promise.resolve();
    } catch (error) {
      throw error;
    }
  }

  logout(): void {
    this.removeToken();
    this.removeUser();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(AUTH_KEYS.TOKEN);
    }
    return null;
  }

  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEYS.TOKEN, token);
      // Also set as a cookie for middleware
      document.cookie = `${AUTH_KEYS.TOKEN}=${token}; path=/`;
    }
  }

  removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_KEYS.TOKEN);
      // Also remove cookie
      document.cookie = `${AUTH_KEYS.TOKEN}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
    }
  }

  getUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem(AUTH_KEYS.USER);
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  setUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(user));
    }
  }

  removeUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_KEYS.USER);
    }
  }

  private generateMockToken(): string {
    return 'mock_token_' + Math.random().toString(36).substr(2);
  }
}

export const authService = AuthService.getInstance();
