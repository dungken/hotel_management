import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import { bookingService } from '../services/booking.service';
import { roomService } from '../services/room.service';
import { customerService } from '../services/customer.service';
import { CreateBookingRequest } from '../types/booking.types';
import { Room, Customer, BookingChannel } from '../types';

interface CreateBookingForm extends CreateBookingRequest {
  customerSearch: string;
}

const CreateBooking: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [channels, setChannels] = useState<BookingChannel[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CreateBookingForm>();

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsData, channelsData] = await Promise.all([
          roomService.getAvailableRooms(),
          bookingService.getBookingChannels()
        ]);
        setRooms(roomsData);
        setChannels(channelsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Lỗi khi tải dữ liệu');
      }
    };
    fetchData();
  }, []);

  // Search customers when customerSearch changes
  const customerSearch = watch('customerSearch');
  useEffect(() => {
    if (customerSearch && customerSearch.length >= 3) {
      const searchCustomers = async () => {
        try {
          const results = await customerService.searchCustomers(customerSearch);
          setCustomers(results);
        } catch (error) {
          console.error('Error searching customers:', error);
        }
      };
      searchCustomers();
    } else {
      setCustomers([]);
    }
  }, [customerSearch]);

  // Handle customer selection
  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setValue('customerId', customer.maKhachHang);
    setValue('customerSearch', `${customer.tenKhachHang} - ${customer.soDienThoai}`);
  };

  // Handle form submission
  const onSubmit = async (data: CreateBookingForm) => {
    if (!selectedCustomer) {
      toast.error('Vui lòng chọn khách hàng');
      return;
    }

    setLoading(true);
    try {
      await bookingService.createBooking({
        roomId: parseInt(data.roomId.toString()),
        customerId: selectedCustomer.maKhachHang,
        channelId: parseInt(data.channelId.toString()),
        checkInDate: data.checkInDate,
        checkOutDate: data.checkOutDate,
        adults: parseInt(data.adults.toString()),
        children: parseInt(data.children.toString()),
        childrenAges: data.childrenAges,
        specialRequests: data.specialRequests,
        extraBeds: data.extraBeds,
        includesBreakfast: data.includesBreakfast,
        discount: data.discount,
        discountReason: data.discountReason
      });

      toast.success('Tạo đặt phòng thành công');
      navigate('/bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Lỗi khi tạo đặt phòng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Tạo đặt phòng mới</h1>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Customer Search */}
            <div className="relative">
              <Input
                label="Tìm khách hàng"
                placeholder="Nhập tên hoặc số điện thoại khách hàng"
                {...register('customerSearch', { required: true })}
                error={errors.customerSearch?.message}
              />
              {customers.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
                  <ul className="max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                    {customers.map((customer) => (
                      <li
                        key={customer.maKhachHang}
                        className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
                        onClick={() => handleCustomerSelect(customer)}
                      >
                        <div className="flex items-center">
                          <span className="font-normal block truncate">
                            {customer.tenKhachHang} - {customer.soDienThoai}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Room Selection */}
            <Select
              label="Phòng"
              {...register('roomId', { required: 'Vui lòng chọn phòng' })}
              error={errors.roomId?.message}
            >
              <option value="">Chọn phòng</option>
              {rooms.map((room) => (
                <option key={room.maPhong} value={room.maPhong}>
                  {room.soPhong} - {room.ghiChu}
                </option>
              ))}
            </Select>

            {/* Booking Channel */}
            <Select
              label="Kênh đặt phòng"
              {...register('channelId', { required: 'Vui lòng chọn kênh đặt phòng' })}
              error={errors.channelId?.message}
            >
              <option value="">Chọn kênh đặt phòng</option>
              {channels.map((channel) => (
                <option key={channel.maKenh} value={channel.maKenh}>
                  {channel.tenKenh}
                </option>
              ))}
            </Select>

            {/* Check-in/Check-out Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                type="date"
                label="Ngày nhận phòng"
                {...register('checkInDate', { required: 'Vui lòng chọn ngày nhận phòng' })}
                error={errors.checkInDate?.message}
              />
              <Input
                type="date"
                label="Ngày trả phòng"
                {...register('checkOutDate', { required: 'Vui lòng chọn ngày trả phòng' })}
                error={errors.checkOutDate?.message}
              />
            </div>

            {/* Number of Guests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                type="number"
                label="Số người lớn"
                {...register('adults', {
                  required: 'Vui lòng nhập số người lớn',
                  min: { value: 1, message: 'Tối thiểu 1 người lớn' }
                })}
                error={errors.adults?.message}
              />
              <Input
                type="number"
                label="Số trẻ em"
                {...register('children', {
                  required: 'Vui lòng nhập số trẻ em',
                  min: { value: 0, message: 'Không được nhập số âm' }
                })}
                error={errors.children?.message}
              />
            </div>

            {/* Children Ages */}
            <Input
              label="Độ tuổi trẻ em"
              placeholder="VD: 5,7,10"
              {...register('childrenAges')}
              error={errors.childrenAges?.message}
            />

            {/* Extra Beds */}
            <Input
              type="number"
              label="Số giường phụ"
              {...register('extraBeds', {
                min: { value: 0, message: 'Không được nhập số âm' }
              })}
              error={errors.extraBeds?.message}
            />

            {/* Breakfast Option */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="includesBreakfast"
                {...register('includesBreakfast')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="includesBreakfast" className="text-sm text-gray-700">
                Bao gồm bữa sáng
              </label>
            </div>

            {/* Discount */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                type="number"
                label="Giảm giá (%)"
                {...register('discount', {
                  min: { value: 0, message: 'Không được nhập số âm' },
                  max: { value: 100, message: 'Không được vượt quá 100%' }
                })}
                error={errors.discount?.message}
              />
              <Input
                label="Lý do giảm giá"
                {...register('discountReason')}
                error={errors.discountReason?.message}
              />
            </div>

            {/* Special Requests */}
            <Input
              label="Yêu cầu đặc biệt"
              {...register('specialRequests')}
              error={errors.specialRequests?.message}
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
                isLoading={loading}
              >
                Tạo đặt phòng
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateBooking; 