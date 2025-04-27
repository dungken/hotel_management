export interface User {
  id: number;
  username: string;
  email: string;
  dateCreated: string;
  roles: string[];
}

export interface Customer {
  customerId: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  nationality: string;
  idType: string;
  idNumber: string;
  dateOfBirth: string;
  customerType: number;
  registrationDate: string;
  loyaltyPoints: number;
}

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
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'CLEANING';
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
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
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