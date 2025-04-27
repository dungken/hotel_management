import { Customer, CreateCustomerDto, UpdateCustomerDto } from '@/types/customers';
import { api } from './api';

export const customersApi = {
  getAll: async (): Promise<Customer[]> => {
    const response = await api.get<Customer[]>('/customers');
    return response.data;
  },

  getById: async (id: number): Promise<Customer> => {
    const response = await api.get<Customer>(`/customers/${id}`);
    return response.data;
  },

  create: async (customer: CreateCustomerDto): Promise<Customer> => {
    const response = await api.post<Customer>('/customers', customer);
    return response.data;
  },

  update: async (id: number, customer: UpdateCustomerDto): Promise<Customer> => {
    const response = await api.patch<Customer>(`/customers/${id}`, customer);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/customers/${id}`);
  },
};
