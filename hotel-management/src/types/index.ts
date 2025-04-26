export interface User {
  maNguoiDung: number;
  tenDangNhap: string;
  matKhau: string;
  hoTen: string;
  email: string;
  soDienThoai: string;
  vaiTro: string;
  trangThai: boolean;
}

export interface Customer {
  maKhachHang: number;
  tenKhachHang: string;
  email: string;
  soDienThoai: string;
  quocTich: string;
  loaiGiayTo: string;
  soGiayTo: string;
  ngaySinh: string;
  diemTichLuy: number;
}

export interface Room {
  maPhong: number;
  soPhong: string;
  maLoaiPhong: number;
  trangThai: string;
  ghiChu: string;
}

export interface RoomType {
  maLoaiPhong: number;
  tenLoaiPhong: string;
  moTa: string;
  soNguoiToiDa: number;
  soTreEmToiDa: number;
  tuoiToiDaTreEm: number;
  giaCoBan: number;
  phiNguoiThem: number;
  phanTramGiamGiaMacDinh: number;
  giamGiaLuuTruDai: number;
  giamGiaDatSom: number;
  trangThai: boolean;
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
}

export interface BookingChannel {
  maKenh: number;
  tenKenh: string;
  moTa: string;
  trangThai: boolean;
}

export interface Payment {
  maThanhToan: number;
  maDatPhong: number;
  maPhuongThuc: number;
  ngayThanhToan: string;
  soTien: number;
  maGiaoDich: string;
  trangThai: string;
  soHoaDon: string;
  xuatHoaDonVat: boolean;
  tenCongTy?: string;
  maSoThue?: string;
  ghiChu: string;
}

export interface PaymentMethod {
  maPhuongThuc: number;
  tenPhuongThuc: string;
  moTa: string;
  trangThai: boolean;
}

export interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (value: any) => React.ReactNode;
} 