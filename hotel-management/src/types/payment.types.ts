import { Booking } from './booking.types';

export interface Payment {
  id: number;
  booking: Booking;
  amount: number;
  date: string;
  method: 'cash' | 'credit_card' | 'bank_transfer';
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  invoiceNumber?: string;
  vatInvoice?: boolean;
  companyName?: string;
  taxId?: string;
  notes?: string;
}

export interface CreatePaymentRequest {
  bookingId: number;
  amount: number;
  method: 'cash' | 'credit_card' | 'bank_transfer';
  transactionId?: string;
  companyName?: string;
  taxId?: string;
  notes?: string;
}

export interface VatInvoiceRequest {
  paymentId: number;
  companyName: string;
  taxId: string;
  notes: string;
}
