"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { RoomType } from "@/types";

const API_BASE_URL = "http://localhost:3001";

export default function EditRoomTypePage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    maxAdults: 2,
    maxChildren: 1,
    maxChildAge: 12,
    basePrice: 0,
    extraPersonFee: 0,
    defaultDiscountPercent: 0,
    longStayDiscount: 0,
    earlyBookingDiscount: 0,
    status: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (params.id) {
      fetchRoomType(params.id as string);
    }
  }, [params.id]);

  const fetchRoomType = async (id: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/roomTypes/${id}`);
      const roomType: RoomType = response.data;
      setFormData({
        name: roomType.name,
        description: roomType.description,
        maxAdults: roomType.maxAdults,
        maxChildren: roomType.maxChildren,
        maxChildAge: roomType.maxChildAge,
        basePrice: roomType.basePrice,
        extraPersonFee: roomType.extraPersonFee,
        defaultDiscountPercent: roomType.defaultDiscountPercent,
        longStayDiscount: roomType.longStayDiscount,
        earlyBookingDiscount: roomType.earlyBookingDiscount,
        status: roomType.status,
      });
    } catch (error) {
      console.error("Error fetching room type:", error);
      toast({
        title: "Error",
        description: "Failed to fetch room type details",
        variant: "destructive",
      });
      router.push("/rooms/types");
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Room type name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (formData.maxAdults < 1) {
      newErrors.maxAdults = "Max adults must be at least 1";
    }

    if (formData.maxChildren < 0) {
      newErrors.maxChildren = "Max children cannot be negative";
    }

    if (formData.maxChildAge < 0) {
      newErrors.maxChildAge = "Max child age cannot be negative";
    }

    if (formData.basePrice <= 0) {
      newErrors.basePrice = "Base price must be greater than 0";
    }

    if (formData.extraPersonFee < 0) {
      newErrors.extraPersonFee = "Extra person fee cannot be negative";
    }

    if (formData.defaultDiscountPercent < 0 || formData.defaultDiscountPercent > 100) {
      newErrors.defaultDiscountPercent = "Discount must be between 0 and 100";
    }

    if (formData.longStayDiscount < 0 || formData.longStayDiscount > 100) {
      newErrors.longStayDiscount = "Discount must be between 0 and 100";
    }

    if (formData.earlyBookingDiscount < 0 || formData.earlyBookingDiscount > 100) {
      newErrors.earlyBookingDiscount = "Discount must be between 0 and 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await axios.put(`${API_BASE_URL}/roomTypes/${params.id}`, {
        ...formData,
        roomTypeId: parseInt(params.id as string),
      });

      toast({
        title: "Success",
        description: "Room type updated successfully",
      });
      
      router.push("/rooms/types");
    } catch (error) {
      console.error("Error updating room type:", error);
      toast({
        title: "Error",
        description: "Failed to update room type",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Room Type</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Room Type Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, name: e.target.value }));
                  setErrors(prev => ({ ...prev, name: "" }));
                }}
                placeholder="Enter room type name (e.g., Standard, Deluxe)"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, description: e.target.value }));
                  setErrors(prev => ({ ...prev, description: "" }));
                }}
                placeholder="Enter room type description"
                className={errors.description ? "border-red-500" : ""}
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxAdults">Max Adults *</Label>
                <Input
                  id="maxAdults"
                  type="number"
                  min="1"
                  value={formData.maxAdults}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, maxAdults: parseInt(e.target.value) || 0 }));
                    setErrors(prev => ({ ...prev, maxAdults: "" }));
                  }}
                  className={errors.maxAdults ? "border-red-500" : ""}
                />
                {errors.maxAdults && (
                  <p className="text-sm text-red-500">{errors.maxAdults}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxChildren">Max Children *</Label>
                <Input
                  id="maxChildren"
                  type="number"
                  min="0"
                  value={formData.maxChildren}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, maxChildren: parseInt(e.target.value) || 0 }));
                    setErrors(prev => ({ ...prev, maxChildren: "" }));
                  }}
                  className={errors.maxChildren ? "border-red-500" : ""}
                />
                {errors.maxChildren && (
                  <p className="text-sm text-red-500">{errors.maxChildren}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxChildAge">Max Child Age *</Label>
              <Input
                id="maxChildAge"
                type="number"
                min="0"
                value={formData.maxChildAge}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, maxChildAge: parseInt(e.target.value) || 0 }));
                  setErrors(prev => ({ ...prev, maxChildAge: "" }));
                }}
                className={errors.maxChildAge ? "border-red-500" : ""}
              />
              {errors.maxChildAge && (
                <p className="text-sm text-red-500">{errors.maxChildAge}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="basePrice">Base Price (VND) *</Label>
                <Input
                  id="basePrice"
                  type="number"
                  min="0"
                  value={formData.basePrice}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, basePrice: parseInt(e.target.value) || 0 }));
                    setErrors(prev => ({ ...prev, basePrice: "" }));
                  }}
                  className={errors.basePrice ? "border-red-500" : ""}
                />
                {errors.basePrice && (
                  <p className="text-sm text-red-500">{errors.basePrice}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="extraPersonFee">Extra Person Fee (VND)</Label>
                <Input
                  id="extraPersonFee"
                  type="number"
                  min="0"
                  value={formData.extraPersonFee}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, extraPersonFee: parseInt(e.target.value) || 0 }));
                    setErrors(prev => ({ ...prev, extraPersonFee: "" }));
                  }}
                  className={errors.extraPersonFee ? "border-red-500" : ""}
                />
                {errors.extraPersonFee && (
                  <p className="text-sm text-red-500">{errors.extraPersonFee}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="defaultDiscountPercent">Default Discount (%)</Label>
                <Input
                  id="defaultDiscountPercent"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.defaultDiscountPercent}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, defaultDiscountPercent: parseInt(e.target.value) || 0 }));
                    setErrors(prev => ({ ...prev, defaultDiscountPercent: "" }));
                  }}
                  className={errors.defaultDiscountPercent ? "border-red-500" : ""}
                />
                {errors.defaultDiscountPercent && (
                  <p className="text-sm text-red-500">{errors.defaultDiscountPercent}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="longStayDiscount">Long Stay Discount (%)</Label>
                <Input
                  id="longStayDiscount"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.longStayDiscount}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, longStayDiscount: parseInt(e.target.value) || 0 }));
                    setErrors(prev => ({ ...prev, longStayDiscount: "" }));
                  }}
                  className={errors.longStayDiscount ? "border-red-500" : ""}
                />
                {errors.longStayDiscount && (
                  <p className="text-sm text-red-500">{errors.longStayDiscount}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="earlyBookingDiscount">Early Booking Discount (%)</Label>
                <Input
                  id="earlyBookingDiscount"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.earlyBookingDiscount}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, earlyBookingDiscount: parseInt(e.target.value) || 0 }));
                    setErrors(prev => ({ ...prev, earlyBookingDiscount: "" }));
                  }}
                  className={errors.earlyBookingDiscount ? "border-red-500" : ""}
                />
                {errors.earlyBookingDiscount && (
                  <p className="text-sm text-red-500">{errors.earlyBookingDiscount}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="status"
                checked={formData.status}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, status: checked }))}
              />
              <Label htmlFor="status">Active</Label>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Room Type"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
