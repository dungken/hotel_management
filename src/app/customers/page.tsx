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
import { useToast } from "@/components/ui/use-toast";
import { Customer, CustomerSearchParams } from "@/types/customers";
import { customersService } from "@/services/customers.service";
import { format } from "date-fns";
import { Plus, Search, Edit, Trash2, User, Mail, Phone, Star, Globe, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { CustomerSearchFilter } from "@/components/customers/CustomerSearchFilter";
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [searchFilters, setSearchFilters] = useState<CustomerSearchParams>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomers();
  }, [debouncedSearchTerm, searchFilters]);

  const fetchCustomers = async () => {
    try {
      const params: CustomerSearchParams = { ...searchFilters };
      if (debouncedSearchTerm) {
        params.q = debouncedSearchTerm;
      }
      const response = await customersService.getAll(params);
      // Filter only active customers
      const activeCustomers = response.filter(c => c.status !== 'INACTIVE');
      setCustomers(activeCustomers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      toast({
        title: "Error",
        description: "Failed to fetch customers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    
    try {
      await customersService.delete(id);
      toast({
        title: "Success",
        description: "Customer deleted successfully",
      });
      fetchCustomers();
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive",
      });
    }
  };

  const getCustomerTypeBadge = (type: number) => {
    switch (type) {
      case 1:
        return <Badge>Regular</Badge>;
      case 2:
        return <Badge variant="secondary">Gold</Badge>;
      case 3:
        return <Badge variant="destructive">Platinum</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <p className="text-gray-500">Manage hotel guests and their information</p>
        </div>
        <Button onClick={() => router.push('/customers/create')}>
          <Plus className="mr-2 h-4 w-4" /> Add Customer
        </Button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <CustomerSearchFilter
          onFilter={setSearchFilters}
          currentFilters={searchFilters}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Nationality</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Loyalty Points</TableHead>
              <TableHead>Registration Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <User className="mr-2 h-5 w-5 text-gray-400" />
                    <div>
                      <div>{customer.name}</div>
                      <div className="text-sm text-gray-500">
                        {customer.idType && customer.idNumber ? 
                          `${customer.idType}: ${customer.idNumber}` : 
                          'No ID info'}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-gray-400" />
                      {customer.email}
                    </div>
                    <div className="flex items-center mt-1">
                      <Phone className="mr-2 h-4 w-4 text-gray-400" />
                      {customer.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Globe className="mr-2 h-4 w-4 text-gray-400" />
                    {customer.nationality || 'N/A'}
                  </div>
                </TableCell>
                <TableCell>{getCustomerTypeBadge(customer.customerType || 1)}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Star className="mr-2 h-4 w-4 text-yellow-400" />
                    {customer.loyaltyPoints || 0}
                  </div>
                </TableCell>
                <TableCell>
                  {customer.registrationDate ? 
                    format(new Date(customer.registrationDate), 'MMM dd, yyyy') : 
                    'N/A'
                  }
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/customers/${customer.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/customers/${customer.id}/edit`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(customer.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {customers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No customers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      </div>
    </AuthenticatedLayout>
  );
}
