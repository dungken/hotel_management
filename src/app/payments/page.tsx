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
import { Payment, PaymentMethod, Booking, Customer } from "@/types";
import axios from "axios";
import { format } from "date-fns";
import { Search, Receipt, CreditCard, CheckCircle, XCircle, AlertCircle, RefreshCcw } from "lucide-react";

const API_BASE_URL = "http://localhost:3001";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const { toast } = useToast();

  useEffect(() => {
    fetchPayments();
    fetchPaymentMethods();
    fetchBookings();
    fetchCustomers();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/payments`);
      setPayments(response.data);
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast({
        title: "Error",
        description: "Failed to fetch payments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/paymentMethods`);
      setPaymentMethods(response.data);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
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

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/customers`);
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const getPaymentMethod = (paymentMethodId: number) => {
    return paymentMethods.find(method => method.paymentMethodId === paymentMethodId);
  };

  const getBooking = (bookingId: number) => {
    return bookings.find(booking => booking.bookingId === bookingId);
  };

  const getCustomer = (customerId: number) => {
    return customers.find(customer => customer.id === customerId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge variant="secondary" className="bg-yellow-500">
            <AlertCircle className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case 'COMPLETED':
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        );
      case 'FAILED':
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Failed
          </Badge>
        );
      case 'REFUNDED':
        return (
          <Badge variant="secondary" className="bg-blue-500">
            <RefreshCcw className="mr-1 h-3 w-3" />
            Refunded
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const booking = getBooking(payment.bookingId);
    const customer = booking ? getCustomer(booking.customerId) : null;
    const paymentMethod = getPaymentMethod(payment.paymentMethodId);

    const matchesSearch = payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer && customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (paymentMethod && paymentMethod.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || payment.status === statusFilter;

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
          <h1 className="text-3xl font-bold">Payment Management</h1>
          <p className="text-gray-500">Track and manage payment transactions</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search payments..."
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
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
            <SelectItem value="REFUNDED">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Booking Code</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.map((payment) => {
              const booking = getBooking(payment.bookingId);
              const customer = booking ? getCustomer(booking.customerId) : null;
              const paymentMethod = getPaymentMethod(payment.paymentMethodId);

              return (
                <TableRow key={payment.paymentId}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Receipt className="mr-2 h-4 w-4 text-gray-400" />
                      {payment.transactionId}
                    </div>
                  </TableCell>
                  <TableCell>
                    {customer ? customer.name : 'Unknown'}
                  </TableCell>
                  <TableCell>
                    {booking ? booking.bookingCode : 'Unknown'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4 text-gray-400" />
                      {paymentMethod ? paymentMethod.name : 'Unknown'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payment.amount)}
                  </TableCell>
                  <TableCell>
                    {format(new Date(payment.paymentDate), 'MMM dd, yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(payment.status)}
                  </TableCell>
                  <TableCell>
                    {payment.invoiceNumber || '-'}
                    {payment.isVAT && (
                      <Badge variant="outline" className="ml-2">VAT</Badge>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {payment.notes}
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredPayments.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  No payments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary Section */}
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-gray-500">Total Revenue</div>
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
              payments
                .filter(p => p.status === 'COMPLETED')
                .reduce((sum, p) => sum + p.amount, 0)
            )}
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-gray-500">Pending Payments</div>
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
              payments
                .filter(p => p.status === 'PENDING')
                .reduce((sum, p) => sum + p.amount, 0)
            )}
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-gray-500">Refunded Amount</div>
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
              payments
                .filter(p => p.status === 'REFUNDED')
                .reduce((sum, p) => sum + p.amount, 0)
            )}
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-gray-500">Failed Transactions</div>
          <div className="text-2xl font-bold">
            {payments.filter(p => p.status === 'FAILED').length}
          </div>
        </div>
      </div>
    </div>
  );
}