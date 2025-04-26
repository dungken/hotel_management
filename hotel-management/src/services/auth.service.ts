import api from './api';
import { LoginRequest, RegisterRequest, User, AuthResponse } from '../types/user.types';
import { API_URL } from '../config';
import { User as UserType } from '../types';

// For now, we'll use mock data
const mockUser: UserType = {
  userId: 1,
  username: 'admin',
  email: 'admin@hotel.com',
  firstName: 'Admin',
  lastName: 'User',
  phoneNumber: '0123456789',
  dateCreated: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
  roles: ['ADMIN'],
  isActive: true
};

export const authService = {
  login: async (data: LoginRequest): Promise<{ user: UserType; token: string }> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock authentication logic
    if ((data.username === 'admin' && data.password === 'admin123') || 
        (data.username === 'test' && data.password === 'test123')) {
      return {
        user: mockUser,
        token: 'mock-jwt-token'
      };
    }
    throw new Error('Sai tên đăng nhập hoặc mật khẩu');
  },

  register: async (data: { username: string; email: string; password: string }): Promise<void> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Register data:', data);
  },

  logout: async (): Promise<void> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Clear local storage or any other cleanup
  },

  getCurrentUser: async (email: string): Promise<UserType> => {
    const response = await api.get<{ messenge: string, data: UserType }>('/users/GetUserByEmail', {
      params: { email }
    });
    return response.data.data;
  },

  addUserRole: async (username: string, roleNameList: string[]): Promise<any> => {
    const response = await api.get<{ messenge: string, data: any }>('/users/AddRoleForUser', {
      params: { username, roleNameList }
    });
    return response.data.data;
  }
};
