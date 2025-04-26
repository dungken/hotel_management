import { Customer, Room } from './index';

export interface BookingChannel {
  maKenh: number;
  tenKenh: string;
  moTa: string;
  trangThai: boolean;
}

export interface BookingStatus {
  value: string;
  label: string;
  color: string;
}

export interface Booking {
  maDatPhong: number;
  maDatPhongHienThi: string;
  maKhachHang: number;
  maPhong: number;
  maKenh: number;
  ngayNhanPhong: string;
  ngayTraPhong: string;
  soNguoiLon: number;
  soTreEm: number;
  tuoiTreEm: string;
  ngayDat: string;
  trangThaiDatPhong: string;
  coTinhPhiHuy: boolean;
  lyDoHuy: string | null;
  yeuCauDacBiet: string | null;
  tongTien: number;
  soGiuongPhu: number;
  coAnSang: boolean;
  phanTramGiamGia: number;
  lyDoGiamGia: string | null;
  maNhanVienDat: number;
  thongTinKhachHang: {
    tenKhachHang: string;
    email: string;
    soDienThoai: string;
    quocTich: string;
    loaiGiayTo: string;
    soGiayTo: string;
  };
  thongTinPhong: {
    soPhong: string;
    tenLoaiPhong: string;
    moTa: string;
    giaCoBan: number;
  };
}

export interface CreateBookingRequest {
  roomId: number;
  customerId: number;
  channelId: number;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  childrenAges?: string;
  specialRequests?: string;
  extraBeds?: number;
  includesBreakfast?: boolean;
  discount?: number;
  discountReason?: string;
}

export interface CancelBookingRequest {
  bookingCode: string;
  reason: string;
  applyCancellationFee: boolean;
}
