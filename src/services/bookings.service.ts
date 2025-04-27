import api from './api';
import { Booking, BookingChannel } from '@/types';

export const bookingsService = {
  getAll: () => api.get<Booking[]>('/bookings'),
  getById: (id: number) => api.get<Booking>(`/bookings/${id}`),
  create: (booking: Omit<Booking, 'bookingId'>) => 
    api.post<Booking>('/bookings', booking),
  update: (id: number, booking: Partial<Booking>) => 
    api.put<Booking>(`/bookings/${id}`, booking),
  delete: (id: number) => api.delete(`/bookings/${id}`),
  updateStatus: (id: number, status: string) => 
    api.patch<Booking>(`/bookings/${id}`, { status }),
};

export const bookingChannelsService = {
  getAll: () => api.get<BookingChannel[]>('/bookingChannels'),
  getById: (id: number) => api.get<BookingChannel>(`/bookingChannels/${id}`),
  create: (channel: Omit<BookingChannel, 'channelId'>) => 
    api.post<BookingChannel>('/bookingChannels', channel),
  update: (id: number, channel: Partial<BookingChannel>) => 
    api.put<BookingChannel>(`/bookingChannels/${id}`, channel),
  delete: (id: number) => api.delete(`/bookingChannels/${id}`),
};
