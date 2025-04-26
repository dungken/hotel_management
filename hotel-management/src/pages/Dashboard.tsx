import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';
import getBookings from '../services/api';
import getPayments from '../services/api';
import { mockBookings, mockPayments } from '../services/mockData';
import { Booking, Payment } from '../types';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';

const Dashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Using mock data for now
        setBookings(mockBookings);
        setPayments(mockPayments);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate statistics
  const totalBookings = bookings.length;
  const totalRevenue = payments.reduce((sum, payment) => sum + payment.soTien, 0);
  const activeRooms = bookings.filter(booking => booking.trangThaiDatPhong === 'CONFIRMED').length;
  const uniqueCustomers = new Set(bookings.map(booking => booking.maKhachHang)).size;

  // Sample data for charts
  const bookingTrends = [
    { name: 'Jan', bookings: 65 },
    { name: 'Feb', bookings: 59 },
    { name: 'Mar', bookings: 80 },
    { name: 'Apr', bookings: 81 },
    { name: 'May', bookings: 56 },
    { name: 'Jun', bookings: 55 },
  ];

  const revenueData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 4780 },
    { name: 'May', revenue: 5890 },
    { name: 'Jun', revenue: 4390 },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'success';
      case 'PENDING':
        return 'warning';
      default:
        return 'danger';
    }
  };

  const columns = [
    {
      header: 'Booking ID',
      accessor: 'maDatPhong' as keyof Booking
    },
    {
      header: 'Customer',
      accessor: 'maKhachHang' as keyof Booking
    },
    {
      header: 'Room',
      accessor: 'maPhong' as keyof Booking
    },
    {
      header: 'Status',
      accessor: 'trangThaiDatPhong' as keyof Booking,
      cell: (value: string) => (
        <Badge variant={getStatusVariant(value)}>{value}</Badge>
      )
    }
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Bookings</p>
              <p className="text-2xl font-bold">{totalBookings}</p>
            </div>
            <div className="flex items-center text-green-500">
              <ArrowUpIcon className="w-4 h-4 mr-1" />
              <span className="text-sm">12%</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="flex items-center text-green-500">
              <ArrowUpIcon className="w-4 h-4 mr-1" />
              <span className="text-sm">8%</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Active Rooms</p>
              <p className="text-2xl font-bold">{activeRooms}</p>
            </div>
            <div className="flex items-center text-red-500">
              <ArrowDownIcon className="w-4 h-4 mr-1" />
              <span className="text-sm">5%</span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Total Customers</p>
              <p className="text-2xl font-bold">{uniqueCustomers}</p>
            </div>
            <div className="flex items-center text-green-500">
              <ArrowUpIcon className="w-4 h-4 mr-1" />
              <span className="text-sm">15%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Booking Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookings" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Bookings Table */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
        <Table
          columns={columns}
          data={bookings.slice(0, 5)}
          onRowClick={() => {}}
          keyExtractor={(item) => item.maDatPhong.toString()}
        />
      </Card>
    </div>
  );
};

export default Dashboard; 