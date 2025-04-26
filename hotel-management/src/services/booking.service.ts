import api from './api';
import { Booking, CreateBookingRequest, BookingChannel } from '../types/booking.types';

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
