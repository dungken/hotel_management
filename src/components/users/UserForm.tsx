import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, CreateUserDto, UpdateUserDto, UserRole } from '@/types/user';
import { Badge } from "@/components/ui/badge";
import { X } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { validateEmail, validateUsername, validatePassword } from '@/utils/validation';

interface UserFormProps {
  user?: User;
  onSubmit: (data: CreateUserDto | UpdateUserDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
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

export function UserForm({ user, onSubmit, onCancel, isLoading = false }: UserFormProps) {
  const [formData, setFormData] = useState<CreateUserDto | UpdateUserDto>({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    roles: user?.roles || []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (!validateUsername(formData.username)) {
      newErrors.username = 'Username must be at least 3 characters and contain only letters, numbers, and underscores';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation (only for new users)
    if (!user && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (!user && !validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Roles validation
    if (!formData.roles || formData.roles.length === 0) {
      newErrors.roles = 'At least one role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddRole = (role: UserRole) => {
    const roles = formData.roles || [];
    if (!roles.includes(role)) {
      handleChange('roles', [...roles, role]);
    }
  };

  const handleRemoveRole = (role: UserRole) => {
    const roles = formData.roles || [];
    handleChange('roles', roles.filter(r => r !== role));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check the form for errors",
        variant: "destructive",
      });
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username*</Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => handleChange('username', e.target.value)}
            className={errors.username ? 'border-red-500' : ''}
          />
          {errors.username && (
            <p className="text-sm text-red-500">{errors.username}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email*</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>
        
        {!user && (
          <div className="space-y-2">
            <Label htmlFor="password">Password*</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label>Roles*</Label>
        <Select onValueChange={(value: UserRole) => handleAddRole(value)}>
          <SelectTrigger className={errors.roles ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select role to add" />
          </SelectTrigger>
          <SelectContent>
            {AVAILABLE_ROLES.map(role => (
              <SelectItem 
                key={role} 
                value={role}
                disabled={formData.roles?.includes(role)}
              >
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.roles?.map(role => (
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
        {errors.roles && (
          <p className="text-sm text-red-500">{errors.roles}</p>
        )}
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
