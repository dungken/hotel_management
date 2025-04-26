import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getRooms } from '../../services/room.service';
import { getBookings } from '../../services/booking.service';
import { getPayments } from '../../services/payment.service';
import { getCustomers } from '../../services/customer.service';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

// Simple stats card component
const StatCard = ({ title, value, icon, color }: { title: string, value: number, icon: string, color: string }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-medium text-gray-500">{title}</h3>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
      </div>
      <div className={`text-3xl ${color}`}>{icon}</div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    maintenanceRooms: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);

        // Fetch data from different services
        const [rooms, bookings, payments, customers] = await Promise.all([
          getRooms(),
          getBookings(),
          getPayments(),
          getCustomers()
        ]);

        // Calculate stats
        const occupiedRooms = rooms.filter(room => room.status === 'occupied').length;
        const maintenanceRooms = rooms.filter(room => room.status === 'maintenance').length;
        const pendingBookings = bookings.filter(booking => booking.status === 'pending').length;
        const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);

        setStats({
          totalRooms: rooms.length,
          occupiedRooms,
          maintenanceRooms,
          totalBookings: bookings.length,
          pendingBookings,
          totalCustomers: customers.length,
          totalRevenue,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Error loading dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Rooms"
          value={stats.totalRooms}
          icon="🏨"
          color="text-blue-600"
        />
        <StatCard
          title="Occupied Rooms"
          value={stats.occupiedRooms}
          icon="🛌"
          color="text-green-600"
        />
        <StatCard
          title="Maintenance"
          value={stats.maintenanceRooms}
          icon="🔧"
          color="text-yellow-600"
        />
        <StatCard
          title="Available Rooms"
          value={stats.totalRooms - stats.occupiedRooms - stats.maintenanceRooms}
          icon="✅"
          color="text-primary"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon="📝"
          color="text-purple-600"
        />
        <StatCard
          title="Pending Bookings"
          value={stats.pendingBookings}
          icon="⏳"
          color="text-orange-600"
        />
        <StatCard
          title="Registered Customers"
          value={stats.totalCustomers}
          icon="👥"
          color="text-indigo-600"
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2">Total Revenue</h2>
        <p className="text-3xl font-bold text-green-600">${stats.totalRevenue.toFixed(2)}</p>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="btn-primary">Generate Reports</button>
          <button className="btn-primary">Manage Users</button>
          <button className="btn-primary">System Settings</button>
          <button className="btn-primary">View Logs</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
