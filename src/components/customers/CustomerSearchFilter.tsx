import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, X } from 'lucide-react';
import { CustomerSearchParams } from '@/types/customers';

interface CustomerSearchFilterProps {
  onFilter: (params: CustomerSearchParams) => void;
  currentFilters?: CustomerSearchParams;
}

export function CustomerSearchFilter({ onFilter, currentFilters }: CustomerSearchFilterProps) {
  const [filters, setFilters] = useState<CustomerSearchParams>(currentFilters || {});
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (field: keyof CustomerSearchParams, value: string) => {
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
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={filters.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Search by name"
            />
          </div>
          
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
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={filters.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="Search by phone"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="idNumber">ID Number</Label>
            <Input
              id="idNumber"
              value={filters.idNumber || ''}
              onChange={(e) => handleChange('idNumber', e.target.value)}
              placeholder="Search by ID number"
            />
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
