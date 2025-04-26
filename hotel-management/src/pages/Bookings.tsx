import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Booking, BookingChannel } from '../types';
import { bookingService } from '../services/booking.service';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { toast } from 'react-hot-toast';
import { format, differenceInDays, isToday, isPast, isFuture } from 'date-fns';
import { vi } from 'date-fns/locale';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { Badge as UIBadge } from '@/components/ui/badge';
import { Button as UIButton } from '@/components/ui/button';

interface BookingFilters {
  status: string;
  fromDate: string;
  toDate: string;
  searchTerm: string;
  channel: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface Column<T> {
  header: string;
  accessor: (item: T) => React.ReactNode;
}

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'CONFIRMED':
      return 'default';
    case 'PENDING':
      return 'secondary';
    case 'CANCELLED':
      return 'destructive';
    default:
      return 'outline';
  }
};

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [channels, setChannels] = useState<BookingChannel[]>([]);
  const [statuses, setStatuses] = useState<{ value: string; label: string; color: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<BookingFilters>({
    status: 'ALL',
    fromDate: '',
    toDate: '',
    searchTerm: '',
    channel: 'ALL',
    sortBy: 'ngayNhanPhong',
    sortOrder: 'asc'
  });

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsData, channelsData, statusesData] = await Promise.all([
          bookingService.getBookings(),
          bookingService.getBookingChannels(),
          bookingService.getBookingStatuses()
        ]);
        setBookings(bookingsData);
        setFilteredBookings(bookingsData);
        setChannels(channelsData);
        setStatuses(statusesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...bookings];

    // Apply status filter
    if (filters.status !== 'ALL') {
      result = result.filter(booking => booking.trangThaiDatPhong === filters.status);
    }

    // Apply date filters
    if (filters.fromDate) {
      result = result.filter(booking => 
        new Date(booking.ngayNhanPhong) >= new Date(filters.fromDate)
      );
    }
    if (filters.toDate) {
      result = result.filter(booking => 
        new Date(booking.ngayTraPhong) <= new Date(filters.toDate)
      );
    }

    // Apply channel filter
    if (filters.channel !== 'ALL') {
      result = result.filter(booking => booking.maKenh.toString() === filters.channel);
    }

    // Apply search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(booking => 
        booking.maDatPhongHienThi.toLowerCase().includes(searchLower) ||
        booking.maPhong.toString().includes(searchLower) ||
        booking.yeuCauDacBiet?.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let compareResult = 0;
      switch (filters.sortBy) {
        case 'ngayNhanPhong':
          compareResult = new Date(a.ngayNhanPhong).getTime() - new Date(b.ngayNhanPhong).getTime();
          break;
        case 'ngayDat':
          compareResult = new Date(a.ngayDat).getTime() - new Date(b.ngayDat).getTime();
          break;
        case 'tongTien':
          compareResult = a.tongTien - b.tongTien;
          break;
        case 'maPhong':
          compareResult = a.maPhong - b.maPhong;
          break;
        default:
          compareResult = 0;
      }
      return filters.sortOrder === 'asc' ? compareResult : -compareResult;
    });

    setFilteredBookings(result);
  }, [filters, bookings]);

  // Handle filter changes
  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Handle sorting
  const handleSort = (field: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle booking cancellation
  const handleCancelBooking = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn đặt phòng này?')) return;
    
    try {
      const reason = prompt('Vui lòng nhập lý do hủy:');
      if (!reason) return;

      await bookingService.cancelBooking(id, reason);
      const updatedBookings = await bookingService.getBookings();
      setBookings(updatedBookings);
      toast.success('Hủy đơn đặt phòng thành công');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Lỗi khi hủy đơn đặt phòng');
    }
  };

  // Handle status change
  const handleStatusChange = async (id: number, status: string) => {
    try {
      await bookingService.updateBookingStatus(id, status);
      const updatedBookings = await bookingService.getBookings();
      setBookings(updatedBookings);
      toast.success('Cập nhật trạng thái thành công');
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const columns: Array<Column<Booking>> = [
    {
      header: 'Booking ID',
      accessor: (booking: Booking) => (
        <div className="min-w-[120px]">
          <div className="font-medium">{booking.maDatPhongHienThi}</div>
          <div className="text-sm text-gray-500">
            {format(new Date(booking.ngayDat), 'dd/MM/yyyy')}
          </div>
        </div>
      ),
    },
    {
      header: 'Guest',
      accessor: (booking: Booking) => (
        <div className="min-w-[200px]">
          <div className="font-medium">{booking.thongTinKhachHang.tenKhachHang}</div>
          <div className="text-sm text-gray-500">{booking.thongTinKhachHang.email}</div>
          <div className="text-sm text-gray-500">{booking.thongTinKhachHang.soDienThoai}</div>
        </div>
      ),
    },
    {
      header: 'Room',
      accessor: (booking: Booking) => (
        <div className="min-w-[180px]">
          <div className="font-medium">Room {booking.thongTinPhong.soPhong}</div>
          <div className="text-sm text-gray-500">{booking.thongTinPhong.tenLoaiPhong}</div>
          <div className="text-sm text-gray-500">
            Base rate: ${booking.thongTinPhong.giaCoBan.toLocaleString()}
          </div>
        </div>
      ),
    },
    {
      header: 'Dates',
      accessor: (booking: Booking) => {
        const checkIn = new Date(booking.ngayNhanPhong);
        const checkOut = new Date(booking.ngayTraPhong);
        const nights = differenceInDays(checkOut, checkIn);
        
        return (
          <div className="min-w-[200px]">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-green-500" />
              <span>{format(checkIn, 'dd/MM/yyyy')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-red-500" />
              <span>{format(checkOut, 'dd/MM/yyyy')}</span>
            </div>
            <div className="text-sm text-gray-500">{nights} night(s)</div>
          </div>
        );
      },
    },
    {
      header: 'Channel',
      accessor: (booking: Booking) => {
        const channel = channels.find((c) => c.maKenh === booking.maKenh);
        return (
          <div className="min-w-[120px]">
            <Badge variant="outline">{channel?.tenKenh || 'Unknown'}</Badge>
          </div>
        );
      },
    },
    {
      header: 'Status',
      accessor: (booking: Booking) => {
        const status = statuses.find((s) => s.value === booking.trangThaiDatPhong);
        return (
          <div className="min-w-[120px]">
            <Badge variant={getStatusVariant(booking.trangThaiDatPhong)}>
              {status?.label || booking.trangThaiDatPhong}
            </Badge>
          </div>
        );
      },
    },
    {
      header: 'Total',
      accessor: (booking: Booking) => {
        const discount = booking.phanTramGiamGia > 0 ? (
          <div className="text-sm text-green-600">-{booking.phanTramGiamGia}% off</div>
        ) : null;
        
        return (
          <div className="min-w-[120px]">
            <div className="font-medium">${booking.tongTien.toLocaleString()}</div>
            {discount}
          </div>
        );
      },
    },
    {
      header: 'Actions',
      accessor: (booking: Booking) => (
        <div className="flex gap-2 min-w-[120px]">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewDetails(booking)}
          >
            Details
          </Button>
          {booking.trangThaiDatPhong === 'PENDING' && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleCancelBooking(booking.maDatPhong)}
            >
              Cancel
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Calculate statistics
  const stats = {
    total: filteredBookings.length,
    pending: filteredBookings.filter(b => b.trangThaiDatPhong === 'PENDING').length,
    confirmed: filteredBookings.filter(b => b.trangThaiDatPhong === 'CONFIRMED').length,
    cancelled: filteredBookings.filter(b => b.trangThaiDatPhong === 'CANCELLED').length,
    totalRevenue: filteredBookings.reduce((sum, b) => sum + b.tongTien, 0),
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
          <div className="w-full md:w-64">
            <Input
              label="Tìm kiếm"
              placeholder="Mã đặt phòng, phòng, ghi chú..."
              value={filters.searchTerm}
              onChange={e => handleFilterChange('searchTerm', e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              label="Trạng thái"
              value={filters.status}
              onChange={e => handleFilterChange('status', e.target.value)}
              options={[
                { value: 'ALL', label: 'Tất cả' },
                ...statuses.map(s => ({ value: s.value, label: s.label }))
              ]}
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              label="Kênh"
              value={filters.channel}
              onChange={e => handleFilterChange('channel', e.target.value)}
              options={[
                { value: 'ALL', label: 'Tất cả' },
                ...channels.map(c => ({ value: c.maKenh.toString(), label: c.tenKenh }))
              ]}
            />
          </div>
          <div className="w-full md:w-40">
            <Input
              type="date"
              label="Từ ngày"
              value={filters.fromDate}
              onChange={e => handleFilterChange('fromDate', e.target.value)}
            />
          </div>
          <div className="w-full md:w-40">
            <Input
              type="date"
              label="Đến ngày"
              value={filters.toDate}
              onChange={e => handleFilterChange('toDate', e.target.value)}
            />
          </div>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            data={filteredBookings}
            loading={loading}
            emptyMessage="Không có đơn đặt phòng nào"
            onRowClick={booking => window.location.href = `/bookings/${booking.maDatPhong}`}
          />
        </div>
      </Card>
    </div>
  );
};

export default Bookings; 