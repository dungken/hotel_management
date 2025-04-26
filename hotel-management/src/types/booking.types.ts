import { Customer } from './customer.types';
import { Room } from './room.types';

export interface BookingChannel {
  id: number;
  name: string;
  description?: string;
}

export interface Booking {
  id: number;
  displayId?: string;
  customer: Customer;
  room: Room;
  checkInDate: string;
  checkOutDate: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  channel: BookingChannel;
  totalPrice: number;
  adults?: number;
  children?: number;
  childrenAges?: string;
  bookingDate?: string;
  specialRequests?: string;
  extraBeds?: number;
  includesBreakfast?: boolean;
  discount?: number;
  discountReason?: string;
  hasCancellationFee?: boolean;
  cancellationReason?: string;
  staffId?: number;
}

export interface CreateBookingRequest {
  roomId: number;
  customerId: number;
  channelId: number;
  checkInDate: string;
  checkOutDate: string;
  adults?: number;
  children?: number;
  childrenAges?: string;
  specialRequests?: string;
  extraBeds?: number;
  includesBreakfast?: boolean;
  discount?: number;
  discountReason?: string;
}

export interface CancelBookingRequest {
  bookingCode: string;
  reason: string;
  applyCancellationFee: boolean;
}
