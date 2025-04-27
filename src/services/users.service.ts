import api from './api';
import { User, CreateUserDto, UpdateUserDto, ChangePasswordDto, UserSearchParams } from '@/types/user';

export const usersService = {
  // Get all users with filtering
  getAll: async (params?: UserSearchParams) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            queryParams.append(key, value.toString());
          }
        });
      }
      
      return await api.get<User[]>(`/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get user by ID
  getById: async (id: number) => {
    try {
      return await api.get<User>(`/users/${id}`);
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },

  // Create new user
  create: async (user: CreateUserDto) => {
    try {
      // Validate data before sending
      if (!user.username || !user.email || !user.password) {
        throw new Error('Username, email, and password are required');
      }

      return await api.post<User>('/users', {
        ...user,
        dateCreated: new Date().toISOString(),
        status: 'ACTIVE'
      });
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update user
  update: async (id: number, user: UpdateUserDto) => {
    try {
      // Validate data before sending
      if (user.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
        throw new Error('Invalid email format');
      }

      return await api.put<User>(`/users/${id}`, user);
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  },

  // Change password
  changePassword: async (id: number, data: ChangePasswordDto) => {
    try {
      if (!data.newPassword || data.newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      return await api.patch<User>(`/users/${id}`, { password: data.newPassword });
    } catch (error) {
      console.error(`Error changing password for user ${id}:`, error);
      throw error;
    }
  },

  // Assign roles
  assignRoles: async (id: number, roles: string[]) => {
    try {
      if (!roles || roles.length === 0) {
        throw new Error('At least one role is required');
      }

      return await api.patch<User>(`/users/${id}`, { roles });
    } catch (error) {
      console.error(`Error assigning roles to user ${id}:`, error);
      throw error;
    }
  },

  // Soft delete (set status to INACTIVE)
  delete: async (id: number) => {
    try {
      return await api.patch<User>(`/users/${id}`, { status: 'INACTIVE' });
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  },

  // Hard delete (for admin only)
  hardDelete: async (id: number) => {
    try {
      return await api.delete(`/users/${id}`);
    } catch (error) {
      console.error(`Error permanently deleting user ${id}:`, error);
      throw error;
    }
  },

  // Search users
  search: async (query: string) => {
    try {
      return await api.get<User[]>(`/users?q=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  },
};
