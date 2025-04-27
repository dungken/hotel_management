"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserForm } from '@/components/users/UserForm';
import { usersService } from '@/services/users.service';
import { CreateUserDto, UpdateUserDto } from '@/types/user';
import { useToast } from '@/components/ui/use-toast';
import { FormWrapper } from '@/components/shared/FormWrapper';

export default function CreateUserPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CreateUserDto | UpdateUserDto) => {
    setIsLoading(true);
    try {
      await usersService.create(data as CreateUserDto);
      toast({
        title: "Success",
        description: "User created successfully",
      });
      router.push('/users');
    } catch (error: any) {
      console.error('Error creating user:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create user';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormWrapper title="Create New User">
      <UserForm
        onSubmit={handleSubmit}
        onCancel={() => router.push('/users')}
        isLoading={isLoading}
      />
    </FormWrapper>
  );
}
