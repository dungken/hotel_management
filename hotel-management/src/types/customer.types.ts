export interface Customer {
  id: number;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  address?: string;
  nationality?: string;
  idType?: string;
  idNumber?: string;
  dateOfBirth?: string;
  customerType?: number;
  registrationDate?: string;
  loyaltyPoints?: number;
}

export interface CreateCustomerRequest {
  name: string;
  email: string;
  phone: string;
  address?: string;
  nationality?: string;
  idType?: string;
  idNumber?: string;
  dateOfBirth?: string;
}
