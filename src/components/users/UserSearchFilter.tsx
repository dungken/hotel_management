import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, X } from 'lucide-react';
import { UserSearchParams, UserRole } from '@/types/user';

interface UserSearchFilterProps {
  onFilter: (params: UserSearchParams) => void;
  currentFilters?: UserSearchParams;
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

export function UserSearchFilter({ onFilter, currentFilters }: UserSearchFilterProps) {
  const [filters, setFilters] = useState<UserSearchParams>(currentFilters || {});
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (field: keyof UserSearchParams, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    onFilter(filters);
    setIsOpen(false);
  };

  const handleClear = () => {
    setFilters({});
    onFilter({});
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Search className="mr-2 h-4 w-4" /> Advanced Search
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Advanced Search</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={filters.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Search by email"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="roles">Role</Label>
            <Select
              value={filters.roles}
              onValueChange={(value) => handleChange('roles', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_ROLES.map(role => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => handleChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleClear}>
            <X className="mr-2 h-4 w-4" /> Clear
          </Button>
          <Button onClick={handleApply}>
            <Search className="mr-2 h-4 w-4" /> Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
