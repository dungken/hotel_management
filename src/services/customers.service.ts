import api from './api';
import { Customer } from '@/types';

export const customersService = {
  getAll: () => api.get<Customer[]>('/customers'),
  getById: (id: number) => api.get<Customer>(`/customers/${id}`),
  create: (customer: Omit<Customer, 'customerId'>) => api.post<Customer>('/customers', customer),
  update: (id: number, customer: Partial<Customer>) => api.put<Customer>(`/customers/${id}`, customer),
  delete: (id: number) => api.delete(`/customers/${id}`),
};
