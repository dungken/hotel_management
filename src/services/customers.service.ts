import api from './api';
import { Customer, CreateCustomerDto, UpdateCustomerDto, CustomerSearchParams, Feedback, Notification } from '@/types/customers';

export const customersService = {
  // Get all customers with pagination and filters
  getAll: async (params?: CustomerSearchParams) => {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return api.get<Customer[]>(`/customers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
  },

  // Get a single customer by ID
  getById: (id: number): Promise<Customer> => api.get<Customer>(`/customers/${id}`),

  // Create a new customer
  create: (customer: CreateCustomerDto) => api.post<Customer>('/customers', {
    ...customer,
    registrationDate: new Date().toISOString(),
    status: 'ACTIVE',
    loyaltyPoints: customer.loyaltyPoints || 0
  }),

  // Update customer
  update: (id: number, customer: UpdateCustomerDto) => api.put<Customer>(`/customers/${id}`, customer),

  // Partial update customer
  partialUpdate: (id: number, customer: Partial<UpdateCustomerDto>) => api.patch<Customer>(`/customers/${id}`, customer),

  // Soft delete customer (update status to INACTIVE)
  delete: (id: number) => api.patch<Customer>(`/customers/${id}`, { status: 'INACTIVE' }),

  // Manage loyalty points
  updateLoyaltyPoints: (id: number, points: number) => api.patch<Customer>(`/customers/${id}`, { loyaltyPoints: points }),

  // Manage loyalty tier
  updateLoyaltyTier: (id: number, tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM') => 
    api.patch<Customer>(`/customers/${id}`, { loyaltyTier: tier }),

  // Calculate loyalty tier based on points
  calculateLoyaltyTier: (points: number): 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' => {
    if (points >= 10000) return 'PLATINUM';
    if (points >= 5000) return 'GOLD';
    if (points >= 1000) return 'SILVER';
    return 'BRONZE';
  },

  // Update loyalty tier based on points
  updateLoyaltyTierBasedOnPoints: async (id: number, points: number) => {
    const tier = customersService.calculateLoyaltyTier(points);
    return api.patch<Customer>(`/customers/${id}`, { loyaltyPoints: points, loyaltyTier: tier });
  },

  // Search customers
  search: (query: string) => api.get<Customer[]>(`/customers?q=${encodeURIComponent(query)}`),

  // Bulk import customers
  bulkImport: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<{ success: boolean; imported: number; errors: string[] }>('/customers/bulk', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Export customers to CSV
  export: () => api.get('/customers/export', {
    responseType: 'blob',
  }).then(data => {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }),

  // Customer feedback
  getFeedback: (params?: { customerId?: number; bookingId?: number; status?: string; rating?: number }) => {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return api.get<Feedback[]>(`/customerFeedback${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
  },

  submitFeedback: (feedback: Omit<Feedback, 'id' | 'feedbackDate' | 'status'>) => 
    api.post<Feedback>('/customerFeedback', feedback),

  // Customer notifications
  getNotifications: (params?: { customerId?: number; type?: string; purpose?: string; status?: string }) => {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return api.get<Notification[]>(`/customerNotifications${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
  },

  sendNotification: (notification: Omit<Notification, 'id' | 'status' | 'sentDate'>) => 
    api.post<Notification>('/customerNotifications', notification),
};
