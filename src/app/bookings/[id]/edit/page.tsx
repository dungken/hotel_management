"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookingForm } from "@/components/booking-form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Customer, Room, BookingChannel, RoomType, Booking } from "@/types";
import { bookingsService, bookingChannelsService } from "@/services/bookings.service";
import { ArrowLeft } from "lucide-react";

const API_BASE_URL = "http://localhost:3001";

interface EditBookingPageProps {
  params: {
    id: string;
  };
}

export default function EditBookingPage({ params }: EditBookingPageProps) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [channels, setChannels] = useState<BookingChannel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all required data in parallel
        const [bookingRes, customersRes, roomsRes, roomTypesRes, channelsRes] = await Promise.all([
          bookingsService.getById(parseInt(id)),
          fetch(`${API_BASE_URL}/customers`),
          fetch(`${API_BASE_URL}/rooms`),
          fetch(`${API_BASE_URL}/roomTypes`),
          bookingChannelsService.getAll()
        ]);

        const customersData = await customersRes.json();
        const roomsData = await roomsRes.json();
        const roomTypesData = await roomTypesRes.json();

        setBooking(bookingRes);
        setCustomers(customersData);
        setRooms(roomsData);
        setRoomTypes(roomTypesData);
        setChannels(channelsRes);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load booking data. Please try again.",
          variant: "destructive",
        });
        router.push("/bookings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, toast, router]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await bookingsService.update(parseInt(id), data);

      toast({
        title: "Success",
        description: "Booking updated successfully",
      });

      router.push("/bookings");
    } catch (error) {
      console.error("Error updating booking:", error);
      toast({
        title: "Error",
        description: "Failed to update booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-8">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            className="mr-4"
            onClick={() => router.push("/bookings")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Booking Not Found</h1>
            <p className="text-gray-500">The booking you're looking for doesn't exist or was deleted.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          className="mr-4"
          onClick={() => router.push("/bookings")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Booking</h1>
          <p className="text-gray-500">Booking #{booking.bookingCode}</p>
        </div>
      </div>

      <BookingForm
        initialData={booking}
        customers={customers}
        rooms={rooms}
        roomTypes={roomTypes}
        channels={channels}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
