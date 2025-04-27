"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/user';
import { usersService } from '@/services/users.service';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/components/ui/use-toast';
import { formatDateTime } from '@/utils/date';
import { Edit, Trash2, ArrowLeft, Mail, User as UserIcon, Calendar, Shield, Key, Clock } from 'lucide-react';
import { ChangePasswordDialog } from '@/components/users/ChangePasswordDialog';
import { RoleManagementDialog } from '@/components/users/RoleManagementDialog';
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout';

export default function UserDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [params.id]);

  const fetchUser = async () => {
    try {
      const response = await usersService.getById(parseInt(params.id));
      setUser(response);
    } catch (error) {
      console.error('Error fetching user:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await usersService.delete(parseInt(params.id));
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      router.push('/users');
    } catch (error: any) {
      console.error('Error deleting user:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete user';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'destructive';
      case 'MANAGER':
        return 'default';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      </AuthenticatedLayout>
    );
  }

  if (!user) {
    return (
      <AuthenticatedLayout>
        <div className="p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold">User not found</h2>
            <Button onClick={() => router.push('/users')} className="mt-4">
              Back to Users
            </Button>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/users')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <h1 className="text-3xl font-bold">User Details</h1>
          </div>
          <div className="space-x-2">
            <Button 
              variant="outline"
              onClick={() => setShowPasswordDialog(true)}
            >
              <Key className="mr-2 h-4 w-4" /> Change Password
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push(`/users/${params.id}/edit`)}
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
                <UserIcon className="mr-3 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Username</p>
                  <p className="font-medium">{user.username}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Mail className="mr-3 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Calendar className="mr-3 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Created Date</p>
                  <p className="font-medium">
                    {formatDateTime(user.dateCreated)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Clock className="mr-3 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Last Login</p>
                  <p className="font-medium">
                    {user.lastLogin ? formatDateTime(user.lastLogin) : 'Never'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Roles & Permissions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="mr-3 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Roles</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {user.roles && user.roles.map(role => (
                        <Badge 
                          key={role} 
                          variant={getRoleBadgeVariant(role)}
                        >
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowRoleDialog(true)}
                >
                  <Shield className="mr-2 h-4 w-4" /> Manage Roles
                </Button>
              </div>
              
              <div className="flex items-center">
                <Shield className="mr-3 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="mt-1">
                    <Badge variant={user.status === 'ACTIVE' ? 'default' : 'secondary'}>
                      {user.status || 'ACTIVE'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {user && (
          <ChangePasswordDialog
            user={user}
            isOpen={showPasswordDialog}
            onClose={() => setShowPasswordDialog(false)}
          />
        )}
        
        {user && (
          <RoleManagementDialog
            user={user}
            isOpen={showRoleDialog}
            onClose={() => setShowRoleDialog(false)}
            onUpdate={fetchUser}
          />
        )}
      </div>
    </AuthenticatedLayout>
  );
}
