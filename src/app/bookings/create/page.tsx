"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookingForm } from "@/components/booking-form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Customer, Room, BookingChannel, RoomType } from "@/types";
import { bookingsService, bookingChannelsService } from "@/services/bookings.service";
import { ArrowLeft } from "lucide-react";

const API_BASE_URL = "http://localhost:3001";

export default function CreateBookingPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [channels, setChannels] = useState<BookingChannel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all required data in parallel
        const [customersRes, roomsRes, roomTypesRes, channelsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/customers`),
          fetch(`${API_BASE_URL}/rooms`),
          fetch(`${API_BASE_URL}/roomTypes`),
          bookingChannelsService.getAll()
        ]);

        const customersData = await customersRes.json();
        const roomsData = await roomsRes.json();
        const roomTypesData = await roomTypesRes.json();

        setCustomers(customersData);
        setRooms(roomsData);
        setRoomTypes(roomTypesData);
        setChannels(channelsRes);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load required data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Add current date as booking date
      const bookingData = {
        ...data,
        bookingDate: new Date().toISOString().split('T')[0],
        staffId: 1, // Default staff ID
      };

      console.log('Submitting booking data:', bookingData);

      const result = await bookingsService.create(bookingData);
      console.log('Booking created successfully:', result);

      toast({
        title: "Success",
        description: "Booking created successfully",
      });

      router.push("/bookings");
    } catch (error: any) {
      console.error("Error creating booking:", error);
      
      // Enhanced error handling
      let errorMessage = "Failed to create booking. Please try again.";
      
      if (error.response?.data?.error) {
        // Get specific error message from API
        errorMessage = `Error: ${error.response.data.error}`;
        if (error.response.data.details) {
          errorMessage += ` (${error.response.data.details})`;
        }
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      toast({
        title: "Booking Creation Failed",
        description: errorMessage,
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
          <h1 className="text-3xl font-bold">Create New Booking</h1>
          <p className="text-gray-500">Fill in the details to create a new booking</p>
        </div>
      </div>

      <BookingForm
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
