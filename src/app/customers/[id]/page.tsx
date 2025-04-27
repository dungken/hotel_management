"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Customer } from '@/types/customers';
import { customersService } from '@/services/customers.service';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { Edit, Trash2, ArrowLeft, Mail, Phone, Globe, User, Calendar, Star, Hash, Gift } from 'lucide-react';
import { LoyaltyPointsDialog } from '@/components/customers/LoyaltyPointsDialog';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';

export default function CustomerDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoyaltyDialog, setShowLoyaltyDialog] = useState(false);

  useEffect(() => {
    fetchCustomer();
  }, [params.id]);

  const fetchCustomer = async () => {
    try {
      const response = await customersService.getById(parseInt(params.id));
      setCustomer(response);
    } catch (error) {
      console.error('Error fetching customer:', error);
      toast({
        title: "Error",
        description: "Failed to fetch customer details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    
    try {
      await customersService.delete(parseInt(params.id));
      toast({
        title: "Success",
        description: "Customer deleted successfully",
      });
      router.push('/customers');
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Customer not found</h2>
          <Button onClick={() => router.push('/customers')} className="mt-4">
            Back to Customers
          </Button>
        </div>
      </div>
    );
  }

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

  return (
    <AuthenticatedLayout>
      <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/customers')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h1 className="text-3xl font-bold">Customer Details</h1>
        </div>
        <div className="space-x-2">
          <Button 
            variant="outline"
            onClick={() => router.push(`/customers/${params.id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button 
            variant="destructive"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <User className="mr-3 h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{customer.name}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Mail className="mr-3 h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{customer.email}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Phone className="mr-3 h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{customer.phone}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Globe className="mr-3 h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Nationality</p>
                <p className="font-medium">{customer.nationality || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Calendar className="mr-3 h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">
                  {customer.dateOfBirth ? format(new Date(customer.dateOfBirth), 'MMM dd, yyyy') : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Identification & Loyalty</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <Hash className="mr-3 h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">ID Type</p>
                <p className="font-medium">{customer.idType || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Hash className="mr-3 h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">ID Number</p>
                <p className="font-medium">{customer.idNumber || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Star className="mr-3 h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Customer Type</p>
                <div className="mt-1">{getCustomerTypeBadge(customer.customerType || 1)}</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Star className="mr-3 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Loyalty Points</p>
                  <p className="font-medium">{customer.loyaltyPoints || 0}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowLoyaltyDialog(true)}
              >
                <Gift className="mr-2 h-4 w-4" /> Update Points
              </Button>
            </div>
            
            <div className="flex items-center">
              <Calendar className="mr-3 h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Registration Date</p>
                <p className="font-medium">
                  {customer.registrationDate ? format(new Date(customer.registrationDate), 'MMM dd, yyyy') : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Address</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{customer.address}</p>
          </CardContent>
        </Card>
      </div>

      {customer && (
        <LoyaltyPointsDialog
          customer={customer}
          isOpen={showLoyaltyDialog}
          onClose={() => setShowLoyaltyDialog(false)}
          onUpdate={fetchCustomer}
        />
      )}
      </div>
    </AuthenticatedLayout>
  );
}
