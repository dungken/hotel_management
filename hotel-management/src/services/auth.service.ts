import api from './api';
import { LoginRequest, RegisterRequest, User, AuthResponse } from '../types/user.types';

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.put<{ messenge: string, data: AuthResponse }>('/users/SignIn', data);
  return response.data.data;
};

export const register = async (data: RegisterRequest): Promise<User> => {
  const response = await api.post<{ messenge: string, data: User }>('/users/SignUpUser', data);
  return response.data.data;
};

export const getCurrentUser = async (email: string): Promise<User> => {
  const response = await api.get<{ messenge: string, data: User }>('/users/GetUserByEmail', {
    params: { email }
  });
  return response.data.data;
};

export const addUserRole = async (username: string, roleNameList: string[]): Promise<any> => {
  const response = await api.get<{ messenge: string, data: any }>('/users/AddRoleForUser', {
    params: { username, roleNameList }
  });
  return response.data.data;
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
