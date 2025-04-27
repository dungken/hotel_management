import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, UserRole } from '@/types/user';
import { usersService } from '@/services/users.service';
import { useToast } from '@/components/ui/use-toast';
import { X } from 'lucide-react';

interface RoleManagementDialogProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const AVAILABLE_ROLES: UserRole[] = [
  'ADMIN',
  'MANAGER',
  'RECEPTIONIST',
  'STAFF',
  'ACCOUNTANT',
  'HOUSEKEEPER',
  'CHEF',
  'SECURITY',
  'MAINTENANCE'
];

export function RoleManagementDialog({ user, isOpen, onClose, onUpdate }: RoleManagementDialogProps) {
  const [roles, setRoles] = useState<UserRole[]>(user.roles);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddRole = (role: UserRole) => {
    if (!roles.includes(role)) {
      setRoles([...roles, role]);
    }
  };

  const handleRemoveRole = (role: UserRole) => {
    setRoles(roles.filter(r => r !== role));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await usersService.assignRoles(user.id, roles);
      toast({
        title: "Success",
        description: "User roles updated successfully",
      });
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating roles:', error);
      toast({
        title: "Error",
        description: "Failed to update user roles",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Roles</DialogTitle>
          <DialogDescription>
            Manage roles for {user.username}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Select onValueChange={(value: UserRole) => handleAddRole(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role to add" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_ROLES.map(role => (
                  <SelectItem 
                    key={role} 
                    value={role}
                    disabled={roles.includes(role)}
                  >
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {roles.map(role => (
              <Badge 
                key={role} 
                variant="secondary"
                className="flex items-center gap-1"
              >
                {role}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleRemoveRole(role)}
                />
              </Badge>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Roles'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
