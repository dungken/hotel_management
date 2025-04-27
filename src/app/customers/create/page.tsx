"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CustomerForm } from '@/components/customers/CustomerForm';
import { customersService } from '@/services/customers.service';
import { CreateCustomerDto, UpdateCustomerDto } from '@/types/customers';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';

export default function CreateCustomerPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CreateCustomerDto | UpdateCustomerDto) => {
    setIsLoading(true);
    try {
      await customersService.create(data as CreateCustomerDto);
      toast({
        title: "Success",
        description: "Customer created successfully",
      });
      router.push('/customers');
    } catch (error) {
      console.error('Error creating customer:', error);
      toast({
        title: "Error",
        description: "Failed to create customer",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomerForm
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
