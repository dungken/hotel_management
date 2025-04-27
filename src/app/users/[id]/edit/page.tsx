"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserForm } from '@/components/users/UserForm';
import { usersService } from '@/services/users.service';
import { User, UpdateUserDto } from '@/types/user';
import { useToast } from '@/components/ui/use-toast';
import { FormWrapper } from '@/components/shared/FormWrapper';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';

export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [params.id]);

  const fetchUser = async () => {
    try {
      const response = await usersService.getById(parseInt(params.id));
      setUser(response);
    } catch (error) {
      console.error('Error fetching user:', error);
      setFetchError(true);
      toast({
        title: "Error",
        description: "Failed to fetch user details",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (data: UpdateUserDto) => {
    setIsLoading(true);
    try {
      await usersService.update(parseInt(params.id), data);
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      router.push('/users');
    } catch (error: any) {
      console.error('Error updating user:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update user';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (fetchError) {
    return (
      <FormWrapper title="Edit User">
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold text-red-500">Error Loading User</h3>
          <p className="text-gray-500 mt-2">Failed to load user details. Please try again.</p>
          <Button 
            onClick={() => router.push('/users')} 
            className="mt-4"
          >
            Back to Users
          </Button>
        </div>
      </FormWrapper>
    );
  }

  if (!user) {
    return (
      <FormWrapper title="Edit User">
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      </FormWrapper>
    );
  }

  return (
    <FormWrapper title="Edit User">
      <UserForm
        user={user}
        onSubmit={handleSubmit}
        onCancel={() => router.push('/users')}
        isLoading={isLoading}
      />
    </FormWrapper>
  );
}
