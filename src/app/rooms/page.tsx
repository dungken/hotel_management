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
import { Room, RoomType } from "@/types";
import axios from "axios";
import { Plus, Search, Edit, Trash2, DoorClosed, BedDouble, Wrench, Sparkles } from "lucide-react";

const API_BASE_URL = "http://localhost:3001";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const { toast } = useToast();

  useEffect(() => {
    fetchRooms();
    fetchRoomTypes();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/rooms`);
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast({
        title: "Error",
        description: "Failed to fetch rooms",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/roomTypes`);
      setRoomTypes(response.data);
    } catch (error) {
      console.error("Error fetching room types:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this room?')) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/rooms/${id}`);
      toast({
        title: "Success",
        description: "Room deleted successfully",
      });
      fetchRooms();
    } catch (error) {
      console.error("Error deleting room:", error);
      toast({
        title: "Error",
        description: "Failed to delete room",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (roomId: number, newStatus: string) => {
    try {
      const room = rooms.find(r => r.roomId === roomId);
      if (!room) return;

      await axios.put(`${API_BASE_URL}/rooms/${roomId}`, {
        ...room,
        status: newStatus
      });
      
      toast({
        title: "Success",
        description: "Room status updated successfully",
      });
      fetchRooms();
    } catch (error) {
      console.error("Error updating room status:", error);
      toast({
        title: "Error",
        description: "Failed to update room status",
        variant: "destructive",
      });
    }
  };

  const getRoomType = (roomTypeId: number) => {
    return roomTypes.find(type => type.roomTypeId === roomTypeId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return <Badge variant="default" className="bg-green-500">Available</Badge>;
      case 'OCCUPIED':
        return <Badge variant="destructive">Occupied</Badge>;
      case 'MAINTENANCE':
        return <Badge variant="secondary" className="bg-orange-500">Maintenance</Badge>;
      case 'CLEANING':
        return <Badge variant="secondary" className="bg-blue-500">Cleaning</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return <DoorClosed className="h-5 w-5 text-green-500" />;
      case 'OCCUPIED':
        return <BedDouble className="h-5 w-5 text-red-500" />;
      case 'MAINTENANCE':
        return <Wrench className="h-5 w-5 text-orange-500" />;
      case 'CLEANING':
        return <Sparkles className="h-5 w-5 text-blue-500" />;
      default:
        return <DoorClosed className="h-5 w-5 text-gray-400" />;
    }
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || room.status === statusFilter;
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
          <h1 className="text-3xl font-bold">Room Management</h1>
          <p className="text-gray-500">Manage hotel rooms and their status</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => window.location.href = '/rooms/types'} variant="outline">
            Manage Room Types
          </Button>
          <Button onClick={() => window.location.href = '/rooms/create'}>
            <Plus className="mr-2 h-4 w-4" /> Add Room
          </Button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rooms..."
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
            <SelectItem value="AVAILABLE">Available</SelectItem>
            <SelectItem value="OCCUPIED">Occupied</SelectItem>
            <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
            <SelectItem value="CLEANING">Cleaning</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room Number</TableHead>
              <TableHead>Room Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price (VND)</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRooms.map((room) => {
              const roomType = getRoomType(room.roomTypeId);
              return (
                <TableRow key={room.roomId}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {getStatusIcon(room.status)}
                      <span className="ml-2">{room.roomNumber}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {roomType ? roomType.name : 'Unknown'}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={room.status}
                      onValueChange={(value) => handleStatusChange(room.roomId, value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue>{getStatusBadge(room.status)}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AVAILABLE">Available</SelectItem>
                        <SelectItem value="OCCUPIED">Occupied</SelectItem>
                        <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                        <SelectItem value="CLEANING">Cleaning</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {roomType ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(roomType.basePrice) : 'N/A'}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {room.notes}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => window.location.href = `/rooms/${room.roomId}/edit`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(room.roomId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredRooms.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No rooms found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}