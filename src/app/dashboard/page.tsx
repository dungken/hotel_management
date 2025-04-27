"use client";

import { useEffect, useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Building2, 
  Users, 
  CalendarDays, 
  DollarSign,
  TrendingUp,
  BedDouble,
  UserCheck,
  CreditCard
} from "lucide-react";
import { format } from "date-fns";
import { Booking, Room, Customer, Payment, BookingChannel, User } from "@/types";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001";

import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    totalBookings: 0,
    todayCheckIns: 0,
    todayCheckOuts: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    activeBookings: 0,
    occupancyRate: 0,
    totalStaff: 0,
    pendingPayments: 0,
    topChannel: ""
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          roomsResponse,
          bookingsResponse,
          customersResponse,
          paymentsResponse,
          usersResponse,
          channelsResponse
        ] = await Promise.all([
          axios.get(`${API_BASE_URL}/rooms`),
          axios.get(`${API_BASE_URL}/bookings`),
          axios.get(`${API_BASE_URL}/customers`),
          axios.get(`${API_BASE_URL}/payments`),
          axios.get(`${API_BASE_URL}/users`),
          axios.get(`${API_BASE_URL}/bookingChannels`)
        ]);

        const rooms: Room[] = roomsResponse.data;
        const bookings: Booking[] = bookingsResponse.data;
        const customers: Customer[] = customersResponse.data;
        const payments: Payment[] = paymentsResponse.data;
        const users: User[] = usersResponse.data;
        const channels: BookingChannel[] = channelsResponse.data;

        // Calculate stats
        const today = format(new Date(), 'yyyy-MM-dd');
        const availableRooms = rooms.filter(room => room.status === 'AVAILABLE').length;
        const todayCheckIns = bookings.filter(booking => 
          format(new Date(booking.checkInDate), 'yyyy-MM-dd') === today &&
          booking.status === 'CONFIRMED'
        ).length;
        const todayCheckOuts = bookings.filter(booking => 
          format(new Date(booking.checkOutDate), 'yyyy-MM-dd') === today &&
          booking.status === 'CONFIRMED'
        ).length;
        const totalRevenue = payments
          .filter(payment => payment.status === 'COMPLETED')
          .reduce((sum, payment) => sum + payment.amount, 0);
        const activeBookings = bookings.filter(booking => 
          booking.status === 'CONFIRMED' || booking.status === 'PENDING'
        ).length;
        const occupancyRate = ((rooms.length - availableRooms) / rooms.length) * 100;
        const pendingPayments = payments.filter(payment => 
          payment.status === 'PENDING'
        ).length;

        // Find top booking channel
        const channelCounts = bookings.reduce((acc, booking) => {
          acc[booking.channelId] = (acc[booking.channelId] || 0) + 1;
          return acc;
        }, {} as Record<number, number>);
        
        const topChannelId = Object.entries(channelCounts)
          .sort(([, a], [, b]) => b - a)[0]?.[0];
        const topChannel = channels.find(channel => 
          channel.channelId === parseInt(topChannelId)
        )?.name || "";

        setStats({
          totalRooms: rooms.length,
          availableRooms,
          totalBookings: bookings.length,
          todayCheckIns,
          todayCheckOuts,
          totalRevenue,
          totalCustomers: customers.length,
          activeBookings,
          occupancyRate,
          totalStaff: users.length,
          pendingPayments,
          topChannel
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <AuthenticatedLayout>
      <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to Hotel Management System</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Today's Date</p>
          <p className="text-lg font-semibold">{format(new Date(), 'MMMM dd, yyyy')}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Room Statistics */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRooms}</div>
            <p className="text-xs text-muted-foreground">
              {stats.availableRooms} available
            </p>
          </CardContent>
        </Card>

        {/* Occupancy Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.occupancyRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Current occupancy
            </p>
          </CardContent>
        </Card>

        {/* Today's Check-ins */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Check-ins Today</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayCheckIns}</div>
            <p className="text-xs text-muted-foreground">
              {stats.todayCheckOuts} check-outs
            </p>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingPayments} pending payments
            </p>
          </CardContent>
        </Card>

        {/* Total Customers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Registered customers
            </p>
          </CardContent>
        </Card>

        {/* Active Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeBookings}</div>
            <p className="text-xs text-muted-foreground">
              Out of {stats.totalBookings} total
            </p>
          </CardContent>
        </Card>

        {/* Staff Count */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStaff}</div>
            <p className="text-xs text-muted-foreground">
              Active employees
            </p>
          </CardContent>
        </Card>

        {/* Top Booking Channel */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Channel</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{stats.topChannel}</div>
            <p className="text-xs text-muted-foreground">
              Most bookings source
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <a href="/bookings/create" className="block">
            <Card className="hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <CalendarDays className="h-8 w-8 text-blue-500" />
                  <div>
                    <h3 className="font-semibold">New Booking</h3>
                    <p className="text-sm text-muted-foreground">Create a new reservation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </a>
          
          <a href="/customers/create" className="block">
            <Card className="hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Users className="h-8 w-8 text-green-500" />
                  <div>
                    <h3 className="font-semibold">Add Customer</h3>
                    <p className="text-sm text-muted-foreground">Register new customer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </a>

          <a href="/rooms" className="block">
            <Card className="hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <BedDouble className="h-8 w-8 text-purple-500" />
                  <div>
                    <h3 className="font-semibold">Manage Rooms</h3>
                    <p className="text-sm text-muted-foreground">View room status</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </a>

          <a href="/payments" className="block">
            <Card className="hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <CreditCard className="h-8 w-8 text-orange-500" />
                  <div>
                    <h3 className="font-semibold">View Payments</h3>
                    <p className="text-sm text-muted-foreground">Track transactions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </a>
        </div>
      </div>
      </div>
    </AuthenticatedLayout>
  );
}