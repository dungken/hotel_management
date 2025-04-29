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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Customer } from '@/types/customers';
import { customersService } from '@/services/customers.service';
import { useToast } from '@/components/ui/use-toast';

interface LoyaltyPointsDialogProps {
  customer: Customer;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function LoyaltyPointsDialog({ customer, isOpen, onClose, onUpdate }: LoyaltyPointsDialogProps) {
  const [points, setPoints] = useState<number>(customer.loyaltyPoints || 0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await customersService.updateLoyaltyPoints(customer.id, points);
      toast({
        title: "Success",
        description: "Loyalty points updated successfully",
      });
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating loyalty points:', error);
      toast({
        title: "Error",
        description: "Failed to update loyalty points",
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
          <DialogTitle>Update Loyalty Points</DialogTitle>
          <DialogDescription>
            Manage loyalty points for {customer.name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="points">Loyalty Points</Label>
              <Input
                id="points"
                type="number"
                min="0"
                value={points}
                onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Points'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
