"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { BookingChannel, Booking } from "@/types";
import axios from "axios";
import { Plus, Search, Edit, Trash2, Globe, BarChart3, TrendingUp, PieChart } from "lucide-react";

const API_BASE_URL = "http://localhost:3001";

export default function BookingChannelsPage() {
  const [channels, setChannels] = useState<BookingChannel[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchChannels();
    fetchBookings();
  }, []);

  const fetchChannels = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/bookingChannels`);
      setChannels(response.data);
    } catch (error) {
      console.error("Error fetching channels:", error);
      toast({
        title: "Error",
        description: "Failed to fetch booking channels",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/bookings`);
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this booking channel?')) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/bookingChannels/${id}`);
      toast({
        title: "Success",
        description: "Booking channel deleted successfully",
      });
      fetchChannels();
    } catch (error) {
      console.error("Error deleting channel:", error);
      toast({
        title: "Error",
        description: "Failed to delete booking channel",
        variant: "destructive",
      });
    }
  };

  const toggleStatus = async (channel: BookingChannel) => {
    try {
      await axios.put(`${API_BASE_URL}/bookingChannels/${channel.channelId}`, {
        ...channel,
        status: !channel.status
      });
      
      toast({
        title: "Success",
        description: `Channel ${!channel.status ? 'activated' : 'deactivated'} successfully`,
      });
      fetchChannels();
    } catch (error) {
      console.error("Error updating channel status:", error);
      toast({
        title: "Error",
        description: "Failed to update channel status",
        variant: "destructive",
      });
    }
  };

  const getChannelStats = (channelId: number) => {
    const channelBookings = bookings.filter(booking => booking.channelId === channelId);
    const totalBookings = channelBookings.length;
    const totalRevenue = channelBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    const conversionRate = (totalBookings / bookings.length) * 100 || 0;
    
    return { totalBookings, totalRevenue, conversionRate };
  };

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    channel.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  const topChannel = channels.reduce((top, channel) => {
    const stats = getChannelStats(channel.channelId);
    const topStats = getChannelStats(top?.channelId || 0);
    return stats.totalBookings > topStats.totalBookings ? channel : top;
  }, channels[0]);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Booking Channels</h1>
          <p className="text-gray-500">Manage booking sources and distribution channels</p>
        </div>
        <Button onClick={() => window.location.href = '/booking-channels/create'}>
          <Plus className="mr-2 h-4 w-4" /> Add Channel
        </Button>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Channels</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{channels.length}</div>
            <p className="text-xs text-muted-foreground">
              {channels.filter(c => c.status).length} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                bookings.reduce((sum, booking) => sum + booking.totalAmount, 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">All channels</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Channel</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topChannel?.name || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">Most bookings</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search channels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Channel Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Bookings</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Conversion Rate</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredChannels.map((channel) => {
              const stats = getChannelStats(channel.channelId);
              return (
                <TableRow key={channel.channelId}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Globe className="mr-2 h-4 w-4 text-gray-400" />
                      {channel.name}
                    </div>
                  </TableCell>
                  <TableCell>{channel.description}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={channel.status ? "default" : "secondary"}
                      className={channel.status ? "bg-green-500" : "bg-gray-500"}
                      onClick={() => toggleStatus(channel)}
                      style={{ cursor: 'pointer' }}
                    >
                      {channel.status ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>{stats.totalBookings}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.totalRevenue)}
                  </TableCell>
                  <TableCell>
                    {stats.conversionRate.toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => window.location.href = `/booking-channels/${channel.channelId}/edit`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(channel.channelId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredChannels.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No booking channels found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}