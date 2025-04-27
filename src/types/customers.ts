export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  nationality?: string;
  idType?: string;
  idNumber?: string;
  dateOfBirth?: string;
  customerType?: number;
  registrationDate?: string;
  loyaltyPoints?: number;
  loyaltyTier?: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface CreateCustomerDto {
  name: string;
  email: string;
  phone: string;
  address: string;
  nationality?: string;
  idType?: string;
  idNumber?: string;
  dateOfBirth?: string;
  customerType?: number;
  loyaltyPoints?: number;
}

export interface UpdateCustomerDto extends Partial<CreateCustomerDto> {
  loyaltyTier?: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface CustomerSearchParams {
  q?: string;
  name?: string;
  email?: string;
  phone?: string;
  idNumber?: string;
  page?: number;
  limit?: number;
}

export interface Feedback {
  id: number;
  customerId: number;
  bookingId: number;
  rating: number;
  comment: string;
  feedbackDate: string;
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED';
}

export interface Notification {
  id: number;
  customerId: number;
  type: 'EMAIL' | 'SMS';
  purpose: 'BOOKING_CONFIRMATION' | 'PROMOTION' | 'REMINDER' | 'FEEDBACK_REQUEST';
  subject: string;
  content: string;
  status: 'PENDING' | 'SENT' | 'FAILED';
  sentDate?: string;
  scheduledDate?: string;
  error?: string;
}
