import api from './api';
import { Booking, BookingChannel, BookingStatus, CreateBookingRequest } from '../types/booking.types';
import { mockBookings, mockBookingChannels } from './mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const bookingService = {
  // Get all bookings with optional filters
  getBookings: async (filters?: {
    status?: string;
    fromDate?: Date;
    toDate?: Date;
  }): Promise<Booking[]> => {
    try {
      await delay(500); // Simulate network delay
      let bookings = [...mockBookings]; // Use mock data for now

      if (filters) {
        if (filters.status && filters.status !== 'ALL') {
          bookings = bookings.filter(booking => booking.trangThaiDatPhong === filters.status);
        }
        if (filters.fromDate) {
          bookings = bookings.filter(booking => 
            new Date(booking.ngayNhanPhong) >= filters.fromDate!
          );
        }
        if (filters.toDate) {
          bookings = bookings.filter(booking => 
            new Date(booking.ngayTraPhong) <= filters.toDate!
          );
        }
      }

      return bookings;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }
  },

  // Get booking by ID
  getBookingById: async (id: number): Promise<Booking | null> => {
    try {
      const response = await api.get<{ message?: string; messenge?: string; data: Booking }>(`/DatPhong/LayDatPhong/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching booking:', error);
      return mockBookings.find(booking => booking.maDatPhong === id) || null;
    }
  },

  // Create new booking
  createBooking: async (bookingData: CreateBookingRequest): Promise<Booking> => {
    try {
      const apiData = {
        soPhong: bookingData.roomId.toString(),
        maKenh: bookingData.channelId.toString(),
        ngayNhanPhong: bookingData.checkInDate,
        ngayTraPhong: bookingData.checkOutDate,
        soNguoiLon: bookingData.adults,
        soTreEm: bookingData.children,
        tuoiTreEm: bookingData.childrenAges || "",
        ngayDat: new Date().toISOString(),
        yeuCauDacBiet: bookingData.specialRequests || "",
        soGiuongPhu: bookingData.extraBeds || 0,
        coAnSang: bookingData.includesBreakfast || true,
        phanTramGiamGia: bookingData.discount || 0,
        lyDoGiamGia: bookingData.discountReason || "",
        sdtKhachHang: bookingData.customerId.toString()
      };

      const response = await api.put<{ message?: string; messenge?: string; data: Booking }>('/DatPhong/DatPhong', apiData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  // Update booking
  updateBooking: async (id: number, bookingData: Partial<Booking>): Promise<Booking> => {
    try {
      const response = await api.put<{ message?: string; messenge?: string; data: Booking }>(`/DatPhong/CapNhatDatPhong/${id}`, bookingData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  },

  // Delete booking
  deleteBooking: async (id: number): Promise<void> => {
    await delay(500);
    const index = mockBookings.findIndex(booking => booking.maDatPhong === id);
    if (index === -1) throw new Error('Không tìm thấy đơn đặt phòng');
    mockBookings.splice(index, 1);
  },

  // Get booking channels
  getBookingChannels: async (): Promise<BookingChannel[]> => {
    try {
      await delay(500); // Simulate network delay
      return mockBookingChannels;
    } catch (error) {
      console.error('Error fetching booking channels:', error);
      return [];
    }
  },

  // Get booking statuses
  getBookingStatuses: async (): Promise<{ value: string; label: string; color: string }[]> => {
    await delay(500); // Simulate network delay
    return [
      { value: 'PENDING', label: 'Chờ xác nhận', color: 'yellow' },
      { value: 'CONFIRMED', label: 'Đã xác nhận', color: 'green' },
      { value: 'CHECKED_IN', label: 'Đã nhận phòng', color: 'blue' },
      { value: 'CHECKED_OUT', label: 'Đã trả phòng', color: 'gray' },
      { value: 'CANCELLED', label: 'Đã hủy', color: 'red' }
    ];
  },

  // Update booking status
  updateBookingStatus: async (id: number, status: string): Promise<void> => {
    try {
      await delay(500); // Simulate network delay
      const bookingIndex = mockBookings.findIndex(b => b.maDatPhong === id);
      if (bookingIndex !== -1) {
        mockBookings[bookingIndex].trangThaiDatPhong = status;
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  },

  // Cancel booking
  cancelBooking: async (id: number, reason: string): Promise<void> => {
    try {
      await delay(500); // Simulate network delay
      const bookingIndex = mockBookings.findIndex(b => b.maDatPhong === id);
      if (bookingIndex === -1) {
        throw new Error('Không tìm thấy đơn đặt phòng');
      }
      mockBookings[bookingIndex].trangThaiDatPhong = 'CANCELLED';
      mockBookings[bookingIndex].lyDoHuy = reason;
      mockBookings[bookingIndex].coTinhPhiHuy = true;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }
};

export const createBooking = async (data: CreateBookingRequest): Promise<Booking> => {
  try {
    // Transform the data to match API structure
    const apiData = {
      soPhong: data.roomId.toString(),
      maKenh: data.channelId.toString(),
      ngayNhanPhong: data.checkInDate,
      ngayTraPhong: data.checkOutDate,
      soNguoiLon: data.adults || 2,
      soTreEm: data.children || 0,
      tuoiTreEm: data.childrenAges || "",
      ngayDat: new Date().toISOString(),
      yeuCauDatBiet: data.specialRequests || "",
      soGiuongPhu: data.extraBeds || 0,
      coAnSang: data.includesBreakfast || true,
      phanTramGiamGia: data.discount || 0,
      lyDoGiamGia: data.discountReason || "",
      sdtKhachHang: data.customerId.toString() // Using customerId as phone for now
    };

    // API sử dụng cả message và messenge
    const response = await api.put<{ message?: string, messenge?: string, bookingCode: string }>('/DatPhong/DatPhong', apiData);

    // Sau khi tạo booking thành công, chúng ta nên lấy thông tin đặt phòng từ API
    return {
      id: Math.floor(Math.random() * 1000), // Giả lập ID
      displayId: response.data.bookingCode,
      customer: { id: data.customerId, name: 'Customer', email: 'customer@example.com', phone: data.customerId.toString() },
      room: {
        id: data.roomId,
        number: apiData.soPhong,
        status: 'occupied',
        floor: Math.floor(parseInt(apiData.soPhong) / 100),
        type: { id: 0, name: 'Room', price: 0, description: '', capacity: 0 }
      },
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      status: 'pending',
      channel: { id: data.channelId, name: '' },
      totalPrice: 0,
      adults: data.adults,
      children: data.children,
      specialRequests: data.specialRequests
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const getBookings = async (): Promise<Booking[]> => {
  try {
    // Xử lý cả hai trường message và messenge
    const response = await api.get<{ message?: string, messenge?: string, data: { maDatPhong: number, maDatPhongHienThi: string, maKhachHang: number, maPhong: number, ngayNhanPhong: string, ngayTraPhong: string, trangThaiDatPhong?: string, maKenh: number, tongTien?: number, soNguoiLon: number, soTreEm: number, yeuCauDacBiet?: string }[] }>('/DatPhong/LayDatPhong');

    if (!response.data || !response.data.data) {
      return [];
    }

    // Map API response to our frontend model
    return response.data.data.map(item => ({
      id: item.maDatPhong,
      displayId: item.maDatPhongHienThi,
      customer: { id: item.maKhachHang, name: 'Customer', email: '', phone: '' },
      room: {
        id: item.maPhong,
        number: '',
        status: 'occupied',
        floor: 0,
        type: { id: 0, name: '', price: 0, description: '', capacity: 0 }
      },
      checkInDate: item.ngayNhanPhong,
      checkOutDate: item.ngayTraPhong,
      status: (item.trangThaiDatPhong?.toLowerCase() as 'pending' | 'confirmed' | 'cancelled' | 'completed') || 'pending',
      channel: { id: item.maKenh, name: '' },
      totalPrice: item.tongTien || 0,
      adults: item.soNguoiLon,
      children: item.soTreEm,
      specialRequests: item.yeuCauDacBiet
    }));
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
};

export const cancelBooking = async (bookingCode: string, reason: string, applyFee: boolean): Promise<void> => {
  await api.put<string>('/DatPhong/CancelBill', {
    maDatPhongHienThi: bookingCode,
    coTinhPhiHuy: applyFee,
    lyDoHuy: reason
  });
};

export const approveBooking = async (bookingCode: string): Promise<void> => {
  await api.put<{ message: string }>(`/DatPhong/ApproveBill`, null, {
    params: { MaDatPhong: bookingCode }
  });
};

export const getBookingChannels = async (): Promise<BookingChannel[]> => {
  const response = await api.get<{ messenge: string, data: { maKenh: number, tenKenh: string }[] }>('/kenh/LayKenh');

  // Map API response to our frontend model
  return response.data.data.map(item => ({
    id: item.maKenh,
    name: item.tenKenh
  }));
};
