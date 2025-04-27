export * from './user';

export * from './customers';

export interface RoomType {
  roomTypeId: number;
  name: string;
  description: string;
  maxAdults: number;
  maxChildren: number;
  maxChildAge: number;
  basePrice: number;
  extraPersonFee: number;
  defaultDiscountPercent: number;
  longStayDiscount: number;
  earlyBookingDiscount: number;
  status: boolean;
}

export interface Room {
  roomId: number;
  roomNumber: string;
  roomTypeId: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'CLEANING' | 'INACTIVE';
  notes: string;
}

export interface BookingChannel {
  channelId: number;
  name: string;
  description: string;
  status: boolean;
}

export interface PaymentMethod {
  paymentMethodId: number;
  name: string;
  description: string;
  status: boolean;
}

export interface Booking {
  bookingId: number;
  bookingCode: string;
  customerId: number;
  roomId: number;
  channelId: number;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  childAges: string;
  bookingDate: string;
  status: 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CANCELLED' | 'COMPLETED';
  hasCancellationFee: boolean;
  cancellationReason: string | null;
  specialRequests: string;
  totalAmount: number;
  extraBeds: number;
  includesBreakfast: boolean;
  discountPercent: number;
  discountReason: string | null;
  staffId: number;
}

export interface Payment {
  paymentId: number;
  bookingId: number;
  paymentMethodId: number;
  paymentDate: string;
  amount: number;
  transactionId: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  invoiceNumber: string | null;
  isVAT: boolean;
  companyName: string | null;
  taxNumber: string | null;
  notes: string;
}
