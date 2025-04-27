import api from './api';
import { Booking, BookingChannel, Room } from '@/types';

export const bookingsService = {
  // Get all bookings with optional filters
  getAll: (filters?: { status?: string; customerId?: number; checkInDate?: string; checkOutDate?: string }) => {
    let url = '/bookings';
    if (filters) {
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.customerId) queryParams.append('customerId', filters.customerId.toString());
      if (filters.checkInDate) queryParams.append('checkInDate_gte', filters.checkInDate);
      if (filters.checkOutDate) queryParams.append('checkOutDate_lte', filters.checkOutDate);
      
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
    }
    return api.get<Booking[]>(url);
  },
  
  // Get booking by ID
  getById: (id: number) => api.get<Booking>(`/bookings/${id}`),
  
  // Create new booking
  create: (booking: Omit<Booking, 'bookingId'>) => 
    api.post<Booking>('/bookings', booking),
  
  // Update booking
  update: (id: number, booking: Partial<Booking>) => 
    api.put<Booking>(`/bookings/${id}`, booking),
  
  // Soft delete (we're not actually deleting but using PATCH for status update)
  delete: (id: number) => api.delete(`/bookings/${id}`),
  
  // Cancel booking
  cancelBooking: (id: number, cancellationReason: string) => 
    api.patch<Booking>(`/bookings/${id}`, { 
      status: "CANCELLED", 
      cancellationReason 
    }),
  
  // Approve/confirm booking
  approveBooking: (id: number) => 
    api.patch<Booking>(`/bookings/${id}`, { status: "CONFIRMED" }),
  
  // Check-in
  checkIn: (id: number) => 
    api.patch<Booking>(`/bookings/${id}`, { status: "CHECKED_IN" }),
  
  // Check-out (complete booking)
  checkOut: (id: number) => 
    api.patch<Booking>(`/bookings/${id}`, { status: "COMPLETED" }),
    
  // Check availability
  checkAvailability: (checkInDate: string, checkOutDate: string) => {
    const url = `/rooms?status=AVAILABLE&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`;
    return api.get<Room[]>(url);
  }
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
