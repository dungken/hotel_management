import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  User, 
  Customer, 
  Room, 
  RoomType, 
  Booking, 
  Payment, 
  BookingChannel, 
  PaymentMethod 
} from '../types';

// Lấy URL API từ biến môi trường
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.messenge || // Xử lý cả hai trường hợp lỗi chính tả "messenge"
      'Something went wrong. Please try again later.';

    toast.error(message);

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// User API
export const userApi = {
  login: (credentials: { username?: string; email?: string; password: string }) =>
    api.put('/users/SignIn', credentials),
  register: (userData: { username: string; password: string; email: string }) =>
    api.post('/users/SignUpUser', userData),
  getUserByEmail: (email: string) =>
    api.get(`/users/GetUserByEmail?email=${email}`),
  addRoleForUser: (params: { username?: string; email?: string; roleNameList: string[] }) =>
    api.get('/users/AddRoleForUser', { params }),
};

// Customer API
export const customerApi = {
  createCustomer: (customerData: Omit<Customer, 'maKhachHang' | 'ngayDangKy' | 'diemTichLuy'>) =>
    api.put('/KhachHang/TaoTaiKhoang', customerData),
  getCustomers: () => api.get('/KhachHang/GetCustomer'),
};

// Room API
export const roomApi = {
  getRooms: () => api.get('/Phong/GetRoom'),
  getAvailableRooms: (params: { ngayNhan: string; ngayTra: string }) =>
    api.put('/Phong/GetRoomEmpty', params),
};

// Room Type API
export const roomTypeApi = {
  getRoomTypes: () => api.get('/LoaiPhong/LayLoaiPhong'),
  calculateRoomPrice: (params: { maLoaiPhong: number; coThemNguoi: boolean }) =>
    api.get('/LoaiPhong/TinhGiaLoaiPhong', { params }),
};

// Booking API
export const bookingApi = {
  getBookings: () => api.get('/DatPhong/LayDatPhong'),
  createBooking: (bookingData: Omit<Booking, 'maDatPhong' | 'maDatPhongHienThi' | 'ngayDat' | 'trangThaiDatPhong'>) =>
    api.put('/DatPhong/DatPhong', bookingData),
  cancelBooking: (params: { maDatPhongHienThi: string; coTinhPhiHuy: boolean; lyDoHuy: string }) =>
    api.put('/DatPhong/CancelBill', params),
  approveBooking: (maDatPhong: string) =>
    api.put(`/DatPhong/ApproveBill?MaDatPhong=${maDatPhong}`),
};

// Payment API
export const paymentApi = {
  getPayments: () => api.get<{ data: Payment[] }>('/payments'),
  getPayment: (id: number) => api.get<{ data: Payment }>(`/payments/${id}`),
  createPayment: (data: Payment) => api.post<{ data: Payment }>('/payments', data),
  updatePayment: (id: number, data: Payment) => api.put<{ data: Payment }>(`/payments/${id}`, data),
  deletePayment: (id: number) => api.delete(`/payments/${id}`),
};

// Booking Channel API
export const bookingChannelApi = {
  getBookingChannels: () => api.get('/kenh/LayKenh'),
};

// Payment Method API
export const paymentMethodApi = {
  getPaymentMethods: () => api.get('/PhuongThucThanhToan/LayRaPhuongThucThanhToan'),
};

export default api;
