"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CustomerForm } from '@/components/customers/CustomerForm';
import { customersService } from '@/services/customers.service';
import { Customer, UpdateCustomerDto } from '@/types/customers';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';

export default function EditCustomerPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCustomer();
  }, [params.id]);

  const fetchCustomer = async () => {
    try {
      const customerData = await customersService.getById(parseInt(params.id));
      setCustomer(customerData);
    } catch (error) {
      console.error('Error fetching customer:', error);
      toast({
        title: "Error",
        description: "Failed to fetch customer details",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (data: UpdateCustomerDto) => {
    setIsLoading(true);
    try {
      await customersService.update(parseInt(params.id), data);
      toast({
        title: "Success",
        description: "Customer updated successfully",
      });
      router.push('/customers');
    } catch (error) {
      console.error('Error updating customer:', error);
      toast({
        title: "Error",
        description: "Failed to update customer",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!customer) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Customer</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomerForm
            customer={customer}
            onSubmit={handleSubmit}
            onCancel={() => router.push('/customers')}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
      </div>
    </AuthenticatedLayout>
  );
}
