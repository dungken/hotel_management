import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import { bookingService } from '../services/booking.service';
import { roomService } from '../services/room.service';
import { customerService } from '../services/customer.service';
import { Booking, Room, Customer } from '../types';
import { BookingChannel } from '../types/booking.types';

interface EditBookingForm {
  maPhong: number;
  maKenh: number;
  ngayNhanPhong: string;
  ngayTraPhong: string;
  soNguoiLon: number;
  soTreEm: number;
  tuoiTreEm: string;
  yeuCauDacBiet: string;
  soGiuongPhu: number;
  coAnSang: boolean;
  phanTramGiamGia: number;
  lyDoGiamGia: string;
}

const EditBooking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [channels, setChannels] = useState<BookingChannel[]>([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EditBookingForm>();

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;

        const [bookingData, roomsData, channelsData] = await Promise.all([
          bookingService.getBookingById(parseInt(id)),
          roomService.getRooms(),
          bookingService.getBookingChannels()
        ]);

        if (!bookingData) {
          toast.error('Không tìm thấy đơn đặt phòng');
          navigate('/bookings');
          return;
        }

        setBooking(bookingData);
        setRooms(roomsData);
        setChannels(channelsData);

        // Fetch customer data
        const customerData = await customerService.getCustomerById(bookingData.maKhachHang);
        setCustomer(customerData);

        // Set form default values
        reset({
          maPhong: bookingData.maPhong,
          maKenh: bookingData.maKenh,
          ngayNhanPhong: bookingData.ngayNhanPhong.split('T')[0],
          ngayTraPhong: bookingData.ngayTraPhong.split('T')[0],
          soNguoiLon: bookingData.soNguoiLon,
          soTreEm: bookingData.soTreEm,
          tuoiTreEm: bookingData.tuoiTreEm,
          yeuCauDacBiet: bookingData.yeuCauDacBiet || '',
          soGiuongPhu: bookingData.soGiuongPhu,
          coAnSang: bookingData.coAnSang,
          phanTramGiamGia: bookingData.phanTramGiamGia,
          lyDoGiamGia: bookingData.lyDoGiamGia || ''
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, reset]);

  // Handle form submission
  const onSubmit = async (data: EditBookingForm) => {
    if (!booking) return;

    setSaving(true);
    try {
      await bookingService.updateBooking(booking.maDatPhong, {
        ...booking,
        ...data
      });

      toast.success('Cập nhật đặt phòng thành công');
      navigate('/bookings');
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Lỗi khi cập nhật đặt phòng');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!booking || !customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Không tìm thấy dữ liệu</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Chỉnh sửa đặt phòng #{booking.maDatPhongHienThi}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Khách hàng: {customer.tenKhachHang} ({customer.soDienThoai})
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Room Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Phòng</label>
              <select
                {...register('maPhong', { required: 'Vui lòng chọn phòng' })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {rooms.map((room) => (
                  <option key={room.maPhong} value={room.maPhong}>
                    {room.soPhong} - {room.ghiChu}
                  </option>
                ))}
              </select>
              {errors.maPhong && (
                <p className="mt-1 text-sm text-red-600">{errors.maPhong.message}</p>
              )}
            </div>

            {/* Booking Channel */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Kênh đặt phòng</label>
              <select
                {...register('maKenh', { required: 'Vui lòng chọn kênh đặt phòng' })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {channels.map((channel) => (
                  <option key={channel.maKenh} value={channel.maKenh}>
                    {channel.tenKenh}
                  </option>
                ))}
              </select>
              {errors.maKenh && (
                <p className="mt-1 text-sm text-red-600">{errors.maKenh.message}</p>
              )}
            </div>

            {/* Check-in/Check-out Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                type="date"
                label="Ngày nhận phòng"
                {...register('ngayNhanPhong', { required: 'Vui lòng chọn ngày nhận phòng' })}
                error={errors.ngayNhanPhong?.message}
              />
              <Input
                type="date"
                label="Ngày trả phòng"
                {...register('ngayTraPhong', { required: 'Vui lòng chọn ngày trả phòng' })}
                error={errors.ngayTraPhong?.message}
              />
            </div>

            {/* Number of Guests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                type="number"
                label="Số người lớn"
                {...register('soNguoiLon', {
                  required: 'Vui lòng nhập số người lớn',
                  min: { value: 1, message: 'Tối thiểu 1 người lớn' }
                })}
                error={errors.soNguoiLon?.message}
              />
              <Input
                type="number"
                label="Số trẻ em"
                {...register('soTreEm', {
                  required: 'Vui lòng nhập số trẻ em',
                  min: { value: 0, message: 'Không được nhập số âm' }
                })}
                error={errors.soTreEm?.message}
              />
            </div>

            {/* Children Ages */}
            <Input
              label="Độ tuổi trẻ em"
              placeholder="VD: 5,7,10"
              {...register('tuoiTreEm')}
              error={errors.tuoiTreEm?.message}
            />

            {/* Extra Beds */}
            <Input
              type="number"
              label="Số giường phụ"
              {...register('soGiuongPhu', {
                min: { value: 0, message: 'Không được nhập số âm' }
              })}
              error={errors.soGiuongPhu?.message}
            />

            {/* Breakfast Option */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="coAnSang"
                {...register('coAnSang')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="coAnSang" className="text-sm text-gray-700">
                Bao gồm bữa sáng
              </label>
            </div>

            {/* Discount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                type="number"
                label="Giảm giá (%)"
                {...register('phanTramGiamGia', {
                  min: { value: 0, message: 'Không được nhập số âm' },
                  max: { value: 100, message: 'Không được vượt quá 100%' }
                })}
                error={errors.phanTramGiamGia?.message}
              />
              <Input
                label="Lý do giảm giá"
                {...register('lyDoGiamGia')}
                error={errors.lyDoGiamGia?.message}
              />
            </div>

            {/* Special Requests */}
            <Input
              label="Yêu cầu đặc biệt"
              {...register('yeuCauDacBiet')}
              error={errors.yeuCauDacBiet?.message}
            />

            {/* Form Actions */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/bookings')}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                isLoading={saving}
              >
                Lưu thay đổi
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default EditBooking; 