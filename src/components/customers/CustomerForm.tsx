import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Customer, CreateCustomerDto, UpdateCustomerDto } from '@/types/customers';

interface CustomerFormProps {
  customer?: Customer;
  onSubmit: (data: CreateCustomerDto | UpdateCustomerDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CustomerForm({ customer, onSubmit, onCancel, isLoading = false }: CustomerFormProps) {
  const [formData, setFormData] = useState<CreateCustomerDto | UpdateCustomerDto>({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    address: customer?.address || '',
    nationality: customer?.nationality || '',
    idType: customer?.idType || '',
    idNumber: customer?.idNumber || '',
    dateOfBirth: customer?.dateOfBirth || '',
    customerType: customer?.customerType || 1,
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name*</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email*</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone*</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="nationality">Nationality</Label>
          <Input
            id="nationality"
            value={formData.nationality}
            onChange={(e) => handleChange('nationality', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="idType">ID Type</Label>
          <Select
            value={formData.idType}
            onValueChange={(value) => handleChange('idType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select ID Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PASSPORT">Passport</SelectItem>
              <SelectItem value="NATIONAL_ID">National ID</SelectItem>
              <SelectItem value="DRIVER_LICENSE">Driver's License</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="idNumber">ID Number</Label>
          <Input
            id="idNumber"
            value={formData.idNumber}
            onChange={(e) => handleChange('idNumber', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="customerType">Customer Type</Label>
          <Select
            value={formData.customerType?.toString()}
            onValueChange={(value) => handleChange('customerType', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Customer Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Regular</SelectItem>
              <SelectItem value="2">Gold</SelectItem>
              <SelectItem value="3">Platinum</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Address*</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
          required
        />
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
