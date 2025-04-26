import api from './api';
import { Customer } from '../types';
import { mockCustomers } from './mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const customerService = {
  // Get all customers
  getCustomers: async (): Promise<Customer[]> => {
    try {
      const response = await api.get<{ message?: string; messenge?: string; data: Customer[] }>('/KhachHang/LayKhachHang');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      return mockCustomers;
    }
  },

  // Get customer by ID
  getCustomerById: async (id: number): Promise<Customer | null> => {
    try {
      const response = await api.get<{ message?: string; messenge?: string; data: Customer }>(`/KhachHang/LayKhachHang/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching customer:', error);
      return mockCustomers.find(customer => customer.maKhachHang === id) || null;
    }
  },

  // Search customers by name or phone number
  searchCustomers: async (query: string): Promise<Customer[]> => {
    try {
      const response = await api.get<{ message?: string; messenge?: string; data: Customer[] }>('/KhachHang/TimKiemKhachHang', {
        params: { query }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error searching customers:', error);
      // Fallback to mock data with local search
      return mockCustomers.filter(customer => 
        customer.tenKhachHang.toLowerCase().includes(query.toLowerCase()) ||
        customer.soDienThoai.includes(query)
      );
    }
  },

  // Create new customer
  createCustomer: async (customerData: Omit<Customer, 'maKhachHang' | 'diemTichLuy'>): Promise<Customer> => {
    try {
      const response = await api.put<{ message?: string; messenge?: string; data: Customer }>('/KhachHang/TaoTaiKhoang', customerData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  // Update customer
  updateCustomer: async (id: number, customerData: Partial<Customer>): Promise<Customer> => {
    try {
      const response = await api.put<{ message?: string; messenge?: string; data: Customer }>(`/KhachHang/CapNhatKhachHang/${id}`, customerData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  },

  // Delete customer
  deleteCustomer: async (id: number): Promise<void> => {
    try {
      await api.delete(`/KhachHang/XoaKhachHang/${id}`);
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  }
};
