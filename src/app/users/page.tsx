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
import { User, UserSearchParams } from "@/types/user";
import { usersService } from "@/services/users.service";
import { formatDate, formatDateTime } from "@/utils/date";
import { Plus, Search, Edit, Trash2, UserIcon, Mail, Eye, Shield, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { UserSearchFilter } from "@/components/users/UserSearchFilter";
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [searchFilters, setSearchFilters] = useState<UserSearchParams>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, [debouncedSearchTerm, searchFilters]);

  const fetchUsers = async () => {
    try {
      const params: UserSearchParams = { ...searchFilters };
      if (debouncedSearchTerm) {
        params.q = debouncedSearchTerm;
      }
      const response = await usersService.getAll(params);
      // Filter only active users by default
      const activeUsers = response.filter(u => u.status !== 'INACTIVE');
      setUsers(activeUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await usersService.delete(id);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
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

  return (
    <AuthenticatedLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-gray-500">Manage system users and their roles</p>
          </div>
          <Button onClick={() => router.push('/users/create')}>
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <UserSearchFilter
            onFilter={setSearchFilters}
            currentFilters={searchFilters}
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <UserIcon className="mr-2 h-5 w-5 text-gray-400" />
                      <div>{user.username}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-gray-400" />
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.roles && user.roles.map(role => (
                        <Badge 
                          key={role} 
                          variant={getRoleBadgeVariant(role)}
                        >
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'ACTIVE' ? 'default' : 'secondary'}>
                      {user.status || 'ACTIVE'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-gray-400" />
                      {formatDate(user.dateCreated)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDateTime(user.lastLogin)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/users/${user.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/users/${user.id}/edit`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No users found
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
