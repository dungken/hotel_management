import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingService } from '../services/booking.service';
import { Booking, BookingChannel } from '../types';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import { toast } from 'react-hot-toast';
import { format, differenceInDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import { FaCheck, FaTimes } from 'react-icons/fa';

const BookingDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [channels, setChannels] = useState<BookingChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bookings, channelsData] = await Promise.all([
          bookingService.getBookings(),
          bookingService.getBookingChannels()
        ]);
        const found = bookings.find(b => b.maDatPhong.toString() === id || b.maDatPhongHienThi === id);
        setBooking(found || null);
        setChannels(channelsData);
      } catch (error) {
        toast.error('Lỗi khi tải dữ liệu đặt phòng');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleStatusChange = async (status: string) => {
    if (!booking) return;
    setActionLoading(true);
    try {
      await bookingService.updateBookingStatus(booking.maDatPhong, status);
      toast.success('Cập nhật trạng thái thành công');
      navigate('/bookings');
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!booking) return;
    const reason = prompt('Vui lòng nhập lý do hủy:');
    if (!reason) return;
    setActionLoading(true);
    try {
      await bookingService.cancelBooking(booking.maDatPhong, reason);
      toast.success('Hủy đơn đặt phòng thành công');
      navigate('/bookings');
    } catch (error) {
      toast.error('Lỗi khi hủy đơn đặt phòng');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Đang tải...</div>;
  if (!booking) return <div className="text-center py-12 text-red-500">Không tìm thấy đơn đặt phòng</div>;

  const channel = channels.find(c => c.maKenh === booking.maKenh);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Chi tiết đặt phòng</h2>
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">&larr; Quay lại</button>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Mã đặt phòng:</span>
            <span className="font-medium">{booking.maDatPhongHienThi}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Trạng thái:</span>
            <span><Badge color={booking.trangThaiDatPhong === 'CONFIRMED' ? 'green' : booking.trangThaiDatPhong === 'PENDING' ? 'yellow' : booking.trangThaiDatPhong === 'CANCELLED' ? 'red' : 'gray'}>{booking.trangThaiDatPhong}</Badge></span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Phòng:</span>
            <span className="font-medium">{booking.maPhong}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Ngày nhận phòng:</span>
            <span className="font-medium">{format(new Date(booking.ngayNhanPhong), 'EEE, dd/MM/yyyy', { locale: vi })}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Ngày trả phòng:</span>
            <span className="font-medium">{format(new Date(booking.ngayTraPhong), 'EEE, dd/MM/yyyy', { locale: vi })}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Số đêm:</span>
            <span className="font-medium">{differenceInDays(new Date(booking.ngayTraPhong), new Date(booking.ngayNhanPhong))}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Số người lớn / trẻ em:</span>
            <span className="font-medium">{booking.soNguoiLon} người lớn{booking.soTreEm > 0 ? `, ${booking.soTreEm} trẻ em` : ''}</span>
          </div>
          {booking.soGiuongPhu > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Giường phụ:</span>
              <span className="font-medium">{booking.soGiuongPhu}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Kênh đặt:</span>
            <span className="font-medium">{channel?.tenKenh || booking.maKenh}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Ngày đặt:</span>
            <span className="font-medium">{format(new Date(booking.ngayDat), 'dd/MM/yyyy HH:mm')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tổng tiền:</span>
            <span className="font-medium">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.tongTien)}</span>
          </div>
          {booking.phanTramGiamGia > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Giảm giá:</span>
              <span className="font-medium text-green-600">{booking.phanTramGiamGia}%</span>
            </div>
          )}
          {booking.yeuCauDacBiet && (
            <div>
              <span className="text-gray-600 block mb-1">Yêu cầu đặc biệt:</span>
              <p className="bg-gray-50 p-2 rounded text-gray-700">{booking.yeuCauDacBiet}</p>
            </div>
          )}
        </div>
        {/* Actions */}
        <div className="mt-8 flex gap-4">
          {booking.trangThaiDatPhong === 'PENDING' && (
            <button
              onClick={() => handleStatusChange('CONFIRMED')}
              disabled={actionLoading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              <FaCheck /> Xác nhận
            </button>
          )}
          {(booking.trangThaiDatPhong === 'PENDING' || booking.trangThaiDatPhong === 'CONFIRMED') && (
            <button
              onClick={handleCancelBooking}
              disabled={actionLoading}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              <FaTimes /> Hủy
            </button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default BookingDetail; 