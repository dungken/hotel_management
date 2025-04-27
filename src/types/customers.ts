export interface Customer {
  customerId: number;
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
}

export interface UpdateCustomerDto {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  nationality?: string;
  idType?: string;
  idNumber?: string;
  dateOfBirth?: string;
  customerType?: number;
}
