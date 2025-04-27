import api from './api';
import { Payment, PaymentMethod } from '@/types';

export const paymentsService = {
  getAll: () => api.get<Payment[]>('/payments'),
  getById: (id: number) => api.get<Payment>(`/payments/${id}`),
  create: (payment: Omit<Payment, 'paymentId'>) => 
    api.post<Payment>('/payments', payment),
  update: (id: number, payment: Partial<Payment>) => 
    api.put<Payment>(`/payments/${id}`, payment),
  delete: (id: number) => api.delete(`/payments/${id}`),
  updateStatus: (id: number, status: string) => 
    api.patch<Payment>(`/payments/${id}`, { status }),
};

export const paymentMethodsService = {
  getAll: () => api.get<PaymentMethod[]>('/paymentMethods'),
  getById: (id: number) => api.get<PaymentMethod>(`/paymentMethods/${id}`),
  create: (method: Omit<PaymentMethod, 'paymentMethodId'>) => 
    api.post<PaymentMethod>('/paymentMethods', method),
  update: (id: number, method: Partial<PaymentMethod>) => 
    api.put<PaymentMethod>(`/paymentMethods/${id}`, method),
  delete: (id: number) => api.delete(`/paymentMethods/${id}`),
};
