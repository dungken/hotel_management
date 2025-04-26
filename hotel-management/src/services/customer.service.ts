import api from './api';
import { Customer, CreateCustomerRequest } from '../types/customer.types';

export const getCustomers = async (): Promise<Customer[]> => {
  try {
    // Mặc dù API không có endpoint riêng cho việc lấy tất cả khách hàng,
    // chúng ta có thể sử dụng dữ liệu mẫu cho việc demo
    // Trong môi trường thực tế, bạn sẽ cần thêm endpoint này vào API
    return [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '0123456789',
        address: '123 Main St'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '0987654321',
        address: '456 Oak Ave'
      }
    ];
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
};

export const createCustomer = async (data: CreateCustomerRequest): Promise<Customer> => {
  // Transform to match API structure
  const apiData = {
    tenDayDu: data.name,
    email: data.email,
    soDienThoai: data.phone,
    quocTich: "Vietnam", // Default or pass from form
    loaiGiayTo: "CMND", // Default or pass from form
    soGiayTo: "123456789", // Default or pass from form
    ngaySinh: "1990-01-01" // Default or pass from form
  };

  const response = await api.put<{ messenge: string, data: any }>('/KhachHang/TaoTaiKhoang', apiData);

  // Map API response to our frontend model
  return {
    id: response.data.data.maKhachHang,
    name: `${response.data.data.ho} ${response.data.data.ten}`,
    email: response.data.data.email,
    phone: response.data.data.soDienThoai,
    address: ''
  };
};

export const getCustomerById = async (id: number): Promise<Customer> => {
  // Note: The API doesn't seem to have an endpoint for getting customers by ID
  // This is a mock implementation that would need to be updated
  return {
    id,
    name: 'Customer',
    email: 'customer@example.com',
    phone: '123456789',
    address: ''
  };
};
