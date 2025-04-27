"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format, addDays, differenceInDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Booking, Customer, Room, BookingChannel, RoomType } from "@/types";
import { bookingsService, bookingChannelsService } from "@/services/bookings.service";
import { cn } from "@/lib/utils";

// Form validation schema
const bookingFormSchema = z.object({
  customerId: z.coerce.number().min(1, "Please select a customer"),
  roomId: z.coerce.number().min(1, "Please select a room"),
  channelId: z.coerce.number().min(1, "Please select a booking channel"),
  checkInDate: z.date({
    required_error: "Check-in date is required"
  }),
  checkOutDate: z.date({
    required_error: "Check-out date is required"
  }),
  adults: z.coerce.number().min(1, "At least one adult is required"),
  children: z.coerce.number().min(0, "Cannot be negative"),
  childAges: z.string().optional(),
  specialRequests: z.string().optional(),
  extraBeds: z.coerce.number().min(0, "Cannot be negative"),
  includesBreakfast: z.boolean().default(false),
  discountPercent: z.coerce.number().min(0, "Cannot be negative").max(100, "Cannot exceed 100%"),
  discountReason: z.string().optional(),
  totalAmount: z.coerce.number().min(0, "Total amount cannot be negative"),
  status: z.enum(["PENDING", "CONFIRMED", "CHECKED_IN", "CANCELLED", "COMPLETED"]).optional(),
  hasCancellationFee: z.boolean().default(false),
  cancellationReason: z.string().optional(),
}).refine(data => {
  return data.checkOutDate > data.checkInDate;
}, {
  message: "Check-out date must be after check-in date",
  path: ["checkOutDate"],
});

type BookingFormValues = z.infer<typeof bookingFormSchema> & {
  status?: "PENDING" | "CONFIRMED" | "CHECKED_IN" | "CANCELLED" | "COMPLETED";
};

interface BookingFormProps {
  initialData?: Booking;
  customers: Customer[];
  rooms: Room[];
  roomTypes: RoomType[];
  channels: BookingChannel[];
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
}

export function BookingForm({
  initialData,
  customers,
  rooms,
  roomTypes,
  channels,
  onSubmit,
  isSubmitting = false
}: BookingFormProps) {
  const [availableRooms, setAvailableRooms] = useState<Room[]>(rooms || []);
  const [totalNights, setTotalNights] = useState(0);
  const [baseRoomPrice, setBaseRoomPrice] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | undefined>();

  // Initialize the form with default values or initial data
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema) as any,
    defaultValues: initialData ? {
      ...initialData,
      checkInDate: new Date(initialData.checkInDate),
      checkOutDate: new Date(initialData.checkOutDate),
      status: initialData.status,
    } : {
      customerId: 0,
      roomId: 0,
      channelId: 0,
      checkInDate: new Date(),
      checkOutDate: addDays(new Date(), 1),
      adults: 1,
      children: 0,
      childAges: "",
      specialRequests: "",
      extraBeds: 0,
      includesBreakfast: false,
      discountPercent: 0,
      discountReason: "",
      totalAmount: 0,
      status: "PENDING",
      hasCancellationFee: false,
      cancellationReason: "",
    },
  });

  // Watch form values for calculations
  const watchedValues = form.watch();

  // Effect for checking room availability when dates change
  useEffect(() => {
    if (watchedValues.checkInDate && watchedValues.checkOutDate) {
      const checkIn = format(watchedValues.checkInDate, "yyyy-MM-dd");
      const checkOut = format(watchedValues.checkOutDate, "yyyy-MM-dd");
      
      // If editing an existing booking, we need to include the current room as available
      const currentRoomId = initialData?.roomId;
      
      const checkAvailability = async () => {
        try {
          const response = await bookingsService.checkAvailability(checkIn, checkOut);
          let availableRooms = response || [];
          
          // If editing, add current room if not in the list
          if (currentRoomId && !availableRooms.some(room => room.roomId === currentRoomId)) {
            const currentRoom = rooms.find(room => room.roomId === currentRoomId);
            if (currentRoom) {
              availableRooms = [...availableRooms, currentRoom];
            }
          }
          
          setAvailableRooms(availableRooms);
        } catch (error) {
          console.error("Error checking room availability:", error);
          setAvailableRooms(rooms || []); // Fallback to all rooms
        }
      };
      
      checkAvailability();
      
      // Calculate total nights
      const nights = differenceInDays(watchedValues.checkOutDate, watchedValues.checkInDate);
      setTotalNights(nights > 0 ? nights : 0);
    }
  }, [watchedValues.checkInDate, watchedValues.checkOutDate, initialData?.roomId, rooms]);

  // Effect for updating selected room type and calculating price
  useEffect(() => {
    if (watchedValues.roomId) {
      const selectedRoom = rooms.find(room => room.roomId === watchedValues.roomId);
      if (selectedRoom) {
        const roomType = roomTypes.find(type => type.roomTypeId === selectedRoom.roomTypeId);
        setSelectedRoomType(roomType);
        
        if (roomType) {
          // Base price calculation
          let price = roomType.basePrice * totalNights;
          
          // Extra person fee
          const totalAdults = watchedValues.adults;
          if (totalAdults > roomType.maxAdults) {
            price += (totalAdults - roomType.maxAdults) * roomType.extraPersonFee * totalNights;
          }
          
          // Extra beds
          if (watchedValues.extraBeds > 0) {
            // Assuming a fixed price for extra bed
            price += watchedValues.extraBeds * 300000 * totalNights; // Example: 300,000 VND per night
          }
          
          // Breakfast
          if (watchedValues.includesBreakfast) {
            // Assuming a fixed price for breakfast
            const totalGuests = watchedValues.adults + watchedValues.children;
            price += totalGuests * 150000 * totalNights; // Example: 150,000 VND per person per day
          }
          
          setBaseRoomPrice(price);
          setSubTotal(price);
          
          // Apply discount
          const discountAmount = price * (watchedValues.discountPercent / 100);
          setDiscount(discountAmount);
          
          // Calculate total after discount
          const finalTotal = price - discountAmount;
          
          // Update total amount field
          form.setValue("totalAmount", finalTotal);
        }
      }
    }
  }, [
    watchedValues.roomId, 
    watchedValues.adults, 
    watchedValues.children, 
    watchedValues.extraBeds, 
    watchedValues.includesBreakfast, 
    watchedValues.discountPercent, 
    totalNights, 
    rooms, 
    roomTypes, 
    form
  ]);

  // Handle form submission
  const handleSubmit = (values: BookingFormValues) => {
    // Format dates to strings for API
    const formattedValues = {
      ...values,
      checkInDate: format(values.checkInDate, "yyyy-MM-dd"),
      checkOutDate: format(values.checkOutDate, "yyyy-MM-dd"),
      bookingDate: format(new Date(), "yyyy-MM-dd"), // Current date for new bookings
      bookingCode: initialData?.bookingCode || `BK${Date.now().toString().slice(-8)}`, // Generate a code for new bookings
      staffId: initialData?.staffId || 1, // Default staff ID
    };
    
    onSubmit(formattedValues as BookingFormValues);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer & Room</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value ? field.value.toString() : ""}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a customer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id.toString()}>
                              {customer.name} ({customer.email})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="channelId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Booking Channel</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value ? field.value.toString() : ""}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select booking channel" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {channels.map((channel) => (
                            <SelectItem key={channel.channelId} value={channel.channelId.toString()}>
                              {channel.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="roomId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        value={field.value ? field.value.toString() : ""}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an available room" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableRooms && availableRooms.length > 0 ? (
                            availableRooms.map((room) => {
                              const roomType = roomTypes.find(type => type.roomTypeId === room.roomTypeId);
                              return (
                                <SelectItem key={room.roomId} value={room.roomId.toString()}>
                                  Room {room.roomNumber} - {roomType?.name || "Unknown Type"}
                                </SelectItem>
                              );
                            })
                          ) : (
                            <SelectItem value="" disabled>
                              No rooms available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stay Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="checkInDate"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Check-in Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                                disabled={isSubmitting}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="checkOutDate"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Check-out Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                                disabled={isSubmitting}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => {
                                const checkInDate = form.getValues("checkInDate");
                                return date < (checkInDate || new Date());
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="adults"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adults</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={1} 
                            {...field} 
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="children"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Children</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={0} 
                            {...field} 
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="childAges"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Child Ages (comma separated)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., 5, 7, 12" 
                          {...field} 
                          disabled={isSubmitting || watchedValues.children === 0}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Additional Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="extraBeds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Extra Beds</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={0} 
                          {...field} 
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="includesBreakfast"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Include Breakfast</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Add breakfast for all guests
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specialRequests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Requests</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any special requests or notes"
                          className="min-h-[100px]"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment & Discount</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="discountPercent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={0} 
                            max={100}
                            {...field} 
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discountReason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Reason</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Reason for discount"
                            {...field}
                            disabled={isSubmitting || watchedValues.discountPercent === 0}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {initialData && (
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Booking Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isSubmitting}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                            <SelectItem value="CHECKED_IN">Checked In</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {initialData && watchedValues.status === "CANCELLED" && (
                  <>
                    <FormField
                      control={form.control}
                      name="hasCancellationFee"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Apply Cancellation Fee</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Indicate if this cancellation incurs a fee
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cancellationReason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cancellation Reason</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Reason for cancellation"
                              className="min-h-[80px]"
                              {...field}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Nights:</span>
                  <span>{totalNights} nights</span>
                </div>
                <div className="flex justify-between">
                  <span>Room & Services:</span>
                  <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(baseRoomPrice)}</span>
                </div>
                {watchedValues.discountPercent > 0 && (
                  <div className="flex justify-between text-red-500">
                    <span>Discount ({watchedValues.discountPercent}%):</span>
                    <span>-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total Amount:</span>
                  <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(watchedValues.totalAmount)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : initialData ? "Update Booking" : "Create Booking"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
