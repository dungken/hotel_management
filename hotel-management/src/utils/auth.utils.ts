import { User } from '../types/user.types';

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('token') !== null;
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

export const getCurrentUserFromStorage = (): User | null => {
  const userJson = localStorage.getItem('user');
  if (userJson) {
    return JSON.parse(userJson);
  }
  return null;
};

export const setCurrentUser = (user: User): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearAuth = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const hasRole = (role: string): boolean => {
  const user = getCurrentUserFromStorage();
  if (!user || !user.role) return false;
  return user.role.includes(role);
};

export const isAdmin = (): boolean => {
  return hasRole('ADMIN');
};
