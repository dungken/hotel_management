"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import axios from "axios";
import { Room, RoomType, Booking } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const API_BASE_URL = "http://localhost:3001";

interface RoomAvailabilityCheckProps {
  onRoomSelect?: (room: Room, roomType: RoomType) => void;
}

export function RoomAvailabilityCheck({ onRoomSelect }: RoomAvailabilityCheckProps) {
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const checkAvailability = async () => {
    if (!checkInDate || !checkOutDate) {
      toast({
        title: "Error",
        description: "Please select both check-in and check-out dates",
        variant: "destructive",
      });
      return;
    }

    if (checkOutDate <= checkInDate) {
      toast({
        title: "Error",
        description: "Check-out date must be after check-in date",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Fetch all rooms
      const roomsResponse = await axios.get(`${API_BASE_URL}/rooms`);
      const allRooms: Room[] = roomsResponse.data;

      // Fetch room types
      const typesResponse = await axios.get(`${API_BASE_URL}/roomTypes`);
      const activeTypes = typesResponse.data.filter((type: RoomType) => type.status);
      setRoomTypes(activeTypes);

      // Fetch all bookings with date overlap
      const bookingsResponse = await axios.get(`${API_BASE_URL}/bookings`);
      const bookings: Booking[] = bookingsResponse.data;

      // Filter out rooms that are occupied during the selected dates
      const availableRooms = allRooms.filter(room => {
        // Room must be AVAILABLE status
        if (room.status !== 'AVAILABLE') return false;

        // Check if room is booked during the selected period
        const isBooked = bookings.some(booking => {
          if (booking.roomId !== room.roomId) return false;
          if (booking.status === 'CANCELLED') return false;
          
          const bookingCheckIn = new Date(booking.checkInDate);
          const bookingCheckOut = new Date(booking.checkOutDate);
          
          // Check for date overlap
          return (
            (checkInDate < bookingCheckOut && checkOutDate > bookingCheckIn)
          );
        });

        return !isBooked;
      });

      setAvailableRooms(availableRooms);

      if (availableRooms.length === 0) {
        toast({
          title: "No availability",
          description: "No rooms are available for the selected dates",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error checking availability:", error);
      toast({
        title: "Error",
        description: "Failed to check room availability",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoomType = (roomTypeId: number) => {
    return roomTypes.find(type => type.roomTypeId === roomTypeId);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-end">
        <div className="space-y-2">
          <label className="text-sm font-medium">Check-in Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !checkInDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkInDate ? format(checkInDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkInDate}
                onSelect={setCheckInDate}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Check-out Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !checkOutDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkOutDate ? format(checkOutDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkOutDate}
                onSelect={setCheckOutDate}
                disabled={(date) => date <= (checkInDate || new Date())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button onClick={checkAvailability} disabled={loading}>
          {loading ? "Checking..." : "Check Availability"}
        </Button>
      </div>

      {availableRooms.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room Number</TableHead>
                <TableHead>Room Type</TableHead>
                <TableHead>Price (VND)</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {availableRooms.map((room) => {
                const roomType = getRoomType(room.roomTypeId);
                return (
                  <TableRow key={room.roomId}>
                    <TableCell className="font-medium">{room.roomNumber}</TableCell>
                    <TableCell>
                      {roomType ? roomType.name : 'Unknown'}
                    </TableCell>
                    <TableCell>
                      {roomType ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(roomType.basePrice) : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {roomType ? `${roomType.maxAdults} Adults, ${roomType.maxChildren} Children` : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {onRoomSelect && roomType && (
                        <Button 
                          size="sm" 
                          onClick={() => onRoomSelect(room, roomType)}
                        >
                          Select
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {availableRooms.length === 0 && checkInDate && checkOutDate && !loading && (
        <div className="text-center py-8 text-gray-500">
          No rooms available for the selected dates
        </div>
      )}
    </div>
  );
}
