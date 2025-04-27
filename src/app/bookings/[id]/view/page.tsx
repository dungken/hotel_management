"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Booking, Customer, Room, BookingChannel, Payment } from "@/types";
import { bookingsService } from "@/services/bookings.service";
import { format, parseISO, differenceInDays } from "date-fns";
import {
  ArrowLeft,
  CalendarIcon,
  Edit,
  CheckCircle,
  XCircle,
  LogIn,
  LogOut,
  AlertTriangle,
  CreditCard,
  User,
  DoorClosed
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const API_BASE_URL = "http://localhost:3001";

interface ViewBookingPageProps {
  params: {
    id: string;
  };
}

export default function ViewBookingPage({ params }: ViewBookingPageProps) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [channel, setChannel] = useState<BookingChannel | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalNights, setTotalNights] = useState(0);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { toast } = useToast();
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch booking data
        const bookingData = await bookingsService.getById(parseInt(id));
        setBooking(bookingData);

        // Calculate total nights
        if (bookingData) {
          const checkIn = parseISO(bookingData.checkInDate);
          const checkOut = parseISO(bookingData.checkOutDate);
          setTotalNights(differenceInDays(checkOut, checkIn));

          // Fetch related data
          const [customerRes, roomRes, channelRes, paymentsRes] = await Promise.all([
            fetch(`${API_BASE_URL}/customers/${bookingData.customerId}`),
            fetch(`${API_BASE_URL}/rooms/${bookingData.roomId}`),
            fetch(`${API_BASE_URL}/bookingChannels/${bookingData.channelId}`),
            fetch(`${API_BASE_URL}/payments?bookingId=${bookingData.bookingId}`)
          ]);

          setCustomer(await customerRes.json());
          setRoom(await roomRes.json());
          setChannel(await channelRes.json());
          setPayments(await paymentsRes.json());
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
        toast({
          title: "Error",
          description: "Failed to load booking details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, toast]);

  // Handle cancel booking
  const handleCancelBooking = async () => {
    if (!cancellationReason.trim()) return;

    setIsProcessing(true);
    try {
      await bookingsService.cancelBooking(parseInt(id), cancellationReason);

      // Update booking data
      const updatedBooking = await bookingsService.getById(parseInt(id));
      setBooking(updatedBooking);

      toast({
        title: "Success",
        description: "Booking cancelled successfully",
      });

      setCancelDialogOpen(false);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast({
        title: "Error",
        description: "Failed to cancel booking",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle confirm booking
  const handleConfirmBooking = async () => {
    setIsProcessing(true);
    try {
      await bookingsService.approveBooking(parseInt(id));

      // Update booking data
      const updatedBooking = await bookingsService.getById(parseInt(id));
      setBooking(updatedBooking);

      toast({
        title: "Success",
        description: "Booking confirmed successfully",
      });
    } catch (error) {
      console.error("Error confirming booking:", error);
      toast({
        title: "Error",
        description: "Failed to confirm booking",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle check-in
  const handleCheckIn = async () => {
    setIsProcessing(true);
    try {
      // Update booking data
      const updatedBooking = await bookingsService.getById(parseInt(id));
      setBooking(updatedBooking);

      toast({
        title: "Success",
        description: "Guest checked in successfully",
      });
    } catch (error) {
      console.error("Error checking in guest:", error);
      toast({
        title: "Error",
        description: "Failed to check in guest",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle check-out
  const handleCheckOut = async () => {
    setIsProcessing(true);
    try {
      await bookingsService.checkOut(parseInt(id));

      // Update booking data
      const updatedBooking = await bookingsService.getById(parseInt(id));
      setBooking(updatedBooking);

      toast({
        title: "Success",
        description: "Guest checked out successfully",
      });
    } catch (error) {
      console.error("Error checking out guest:", error);
      toast({
        title: "Error",
        description: "Failed to check out guest",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary" className="bg-yellow-500">Pending</Badge>;
      case 'CONFIRMED':
        return <Badge variant="default" className="bg-green-500">Confirmed</Badge>;
      case 'CHECKED_IN':
        return <Badge variant="default" className="bg-purple-500">Checked In</Badge>;
      case 'CANCELLED':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'COMPLETED':
        return <Badge variant="secondary" className="bg-blue-500">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary" className="bg-yellow-500">Pending</Badge>;
      case 'COMPLETED':
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case 'FAILED':
        return <Badge variant="destructive">Failed</Badge>;
      case 'REFUNDED':
        return <Badge variant="secondary" className="bg-blue-500">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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

  // Determine available actions based on status
  const showConfirmButton = booking.status === 'PENDING';
  const showCancelButton = booking.status === 'PENDING' || booking.status === 'CONFIRMED';
  const showCheckInButton = booking.status === 'CONFIRMED';
  const showCheckOutButton = booking.status === 'CHECKED_IN';
  const showEditButton = booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED';

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
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Booking Details</h1>
          <p className="text-gray-500">
            Booking #{booking.bookingCode} - {getStatusBadge(booking.status)}
          </p>
        </div>
        <div className="flex gap-2">
          {showEditButton && (
            <Button
              onClick={() => router.push(`/bookings/${id}/edit`)}
              disabled={isProcessing}
            >
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Button>
          )}

          {showConfirmButton && (
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handleConfirmBooking}
              disabled={isProcessing}
            >
              <CheckCircle className="h-4 w-4 mr-2" /> Confirm
            </Button>
          )}

          {showCheckInButton && (
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleCheckIn}
              disabled={isProcessing}
            >
              <LogIn className="h-4 w-4 mr-2" /> Check In
            </Button>
          )}

          {showCheckOutButton && (
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleCheckOut}
              disabled={isProcessing}
            >
              <LogOut className="h-4 w-4 mr-2" /> Check Out
            </Button>
          )}

          {showCancelButton && (
            <Button
              variant="destructive"
              onClick={() => setCancelDialogOpen(true)}
              disabled={isProcessing}
            >
              <XCircle className="h-4 w-4 mr-2" /> Cancel
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Booking Code</p>
                <p className="text-sm text-gray-500">{booking.bookingCode}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Status</p>
                <div className="mt-1">{getStatusBadge(booking.status)}</div>
              </div>
              <div>
                <p className="text-sm font-medium">Booking Date</p>
                <p className="text-sm text-gray-500">
                  {format(new Date(booking.bookingDate), 'MMM dd, yyyy')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Channel</p>
                <p className="text-sm text-gray-500">
                  {channel ? channel.name : 'Unknown'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              {customer ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.customerType}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-gray-500">{customer.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-gray-500">{customer.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">ID Type</p>
                      <p className="text-sm text-gray-500">{customer.idType}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">ID Number</p>
                      <p className="text-sm text-gray-500">{customer.idNumber}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-sm text-gray-500">{customer.address}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Customer information not available</p>
              )}
            </CardContent>
          </Card>

          {booking.status === 'CANCELLED' && booking.cancellationReason && (
            <Card className="border-red-300">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-red-600">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Cancellation Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">{booking.cancellationReason}</p>
                {booking.hasCancellationFee && (
                  <p className="text-sm text-red-500 mt-2 font-medium">
                    This booking has a cancellation fee
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stay Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <DoorClosed className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">Room {room?.roomNumber || 'Unknown'}</p>
                  <p className="text-sm text-gray-500">{room?.status || 'Unknown status'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Check-in</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{format(new Date(booking.checkInDate), 'MMM dd, yyyy')}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Check-out</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{format(new Date(booking.checkOutDate), 'MMM dd, yyyy')}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Nights</p>
                  <p className="text-sm text-gray-500">{totalNights} nights</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Guests</p>
                  <p className="text-sm text-gray-500">
                    {booking.adults} Adults, {booking.children} Children
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Extra Beds</p>
                  <p className="text-sm text-gray-500">{booking.extraBeds}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Breakfast</p>
                  <p className="text-sm text-gray-500">
                    {booking.includesBreakfast ? 'Included' : 'Not Included'}
                  </p>
                </div>
              </div>

              {booking.specialRequests && (
                <div>
                  <p className="text-sm font-medium">Special Requests</p>
                  <p className="text-sm text-gray-500 p-3 bg-gray-50 rounded-md mt-1">
                    {booking.specialRequests}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Total Amount</p>
                  <p className="text-xl font-bold text-gray-900">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.totalAmount)}
                  </p>
                </div>
                {booking.discountPercent > 0 && (
                  <div>
                    <p className="text-sm font-medium">Discount</p>
                    <p className="text-sm text-red-500">
                      {booking.discountPercent}%
                      {booking.discountReason && ` (${booking.discountReason})`}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Payment History</p>
                {payments.length > 0 ? (
                  <div className="space-y-2">
                    {payments.map((payment) => (
                      <div key={payment.paymentId} className="flex justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payment.amount)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {format(new Date(payment.paymentDate), 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                        <div>
                          {getPaymentStatusBadge(payment.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 p-3 bg-gray-50 rounded-md">
                    No payments recorded yet
                  </p>
                )}
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push(`/payments/create?bookingId=${id}`)}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Record New Payment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cancellation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Please provide a reason for cancellation. This information will be stored for record keeping.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Cancellation reason"
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelBooking}
              disabled={!cancellationReason.trim() || isProcessing}
            >
              {isProcessing ? "Processing..." : "Cancel Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
