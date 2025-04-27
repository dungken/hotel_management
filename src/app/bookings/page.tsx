"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Booking, Customer, Room, BookingChannel } from "@/types";
import axios from "axios";
import { format } from "date-fns";
import { Plus, Search, Edit, Trash2, Calendar, User, DoorClosed, CreditCard } from "lucide-react";

const API_BASE_URL = "http://localhost:3001";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [channels, setChannels] = useState<BookingChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
    fetchCustomers();
    fetchRooms();
    fetchChannels();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/bookings`);
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers`);
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/rooms`);
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const fetchChannels = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/bookingChannels`);
      setChannels(response.data);
    } catch (error) {
      console.error("Error fetching channels:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/bookings/${id}`);
      toast({
        title: "Success",
        description: "Booking deleted successfully",
      });
      fetchBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast({
        title: "Error",
        description: "Failed to delete booking",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (bookingId: number, newStatus: string) => {
    try {
      const booking = bookings.find(b => b.bookingId === bookingId);
      if (!booking) return;

      await axios.put(`${API_BASE_URL}/bookings/${bookingId}`, {
        ...booking,
        status: newStatus
      });
      
      toast({
        title: "Success",
        description: "Booking status updated successfully",
      });
      fetchBookings();
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      });
    }
  };

  const getCustomer = (customerId: number) => {
    return customers.find(customer => customer.id === customerId);
  };

  const getRoom = (roomId: number) => {
    return rooms.find(room => room.roomId === roomId);
  };

  const getChannel = (channelId: number) => {
    return channels.find(channel => channel.channelId === channelId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary" className="bg-yellow-500">Pending</Badge>;
      case 'CONFIRMED':
        return <Badge variant="default" className="bg-green-500">Confirmed</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'COMPLETED':
        return <Badge variant="secondary" className="bg-blue-500">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const customer = getCustomer(booking.customerId);
    const room = getRoom(booking.roomId);
    const matchesSearch = booking.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer && customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (room && room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Booking Management</h1>
          <p className="text-gray-500">Manage hotel reservations and bookings</p>
        </div>
        <Button onClick={() => window.location.href = '/bookings/create'}>
          <Plus className="mr-2 h-4 w-4" /> New Booking
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking Code</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map((booking) => {
              const customer = getCustomer(booking.customerId);
              const room = getRoom(booking.roomId);
              const channel = getChannel(booking.channelId);
              return (
                <TableRow key={booking.bookingId}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                      {booking.bookingCode}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4 text-gray-400" />
                      {customer ? customer.name : 'Unknown'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <DoorClosed className="mr-2 h-4 w-4 text-gray-400" />
                      {room ? room.roomNumber : 'Unknown'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(booking.checkInDate), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    {format(new Date(booking.checkOutDate), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={booking.status}
                      onValueChange={(value) => handleStatusChange(booking.bookingId, value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue>{getStatusBadge(booking.status)}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.totalAmount)}
                  </TableCell>
                  <TableCell>
                    {channel ? channel.name : 'Unknown'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => window.location.href = `/bookings/${booking.bookingId}/edit`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(booking.bookingId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredBookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  No bookings found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}