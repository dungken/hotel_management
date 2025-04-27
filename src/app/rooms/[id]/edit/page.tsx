"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { Room, RoomType } from "@/types";

const API_BASE_URL = "http://localhost:3001";

export default function EditRoomPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [formData, setFormData] = useState({
    roomNumber: "",
    roomTypeId: "",
    status: "AVAILABLE",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchRoomTypes();
    if (params.id) {
      fetchRoom(params.id as string);
    }
  }, [params.id]);

  const fetchRoomTypes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/roomTypes`);
      // Filter only active room types
      const activeRoomTypes = response.data.filter((type: RoomType) => type.status);
      setRoomTypes(activeRoomTypes);
    } catch (error) {
      console.error("Error fetching room types:", error);
      toast({
        title: "Error",
        description: "Failed to fetch room types",
        variant: "destructive",
      });
    }
  };

  const fetchRoom = async (id: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/rooms/${id}`);
      const room: Room = response.data;
      setFormData({
        roomNumber: room.roomNumber,
        roomTypeId: room.roomTypeId.toString(),
        status: room.status,
        notes: room.notes,
      });
    } catch (error) {
      console.error("Error fetching room:", error);
      toast({
        title: "Error",
        description: "Failed to fetch room details",
        variant: "destructive",
      });
      router.push("/rooms");
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = "Room number is required";
    }

    if (!formData.roomTypeId) {
      newErrors.roomTypeId = "Room type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkRoomNumberExists = async (roomNumber: string, currentId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/rooms?roomNumber=${roomNumber}`);
      // Check if the room number exists for a different room ID
      return response.data.some((room: Room) => room.roomId.toString() !== currentId);
    } catch (error) {
      console.error("Error checking room number:", error);
      return false;
    }
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

    // Check if room number already exists for another room
    const exists = await checkRoomNumberExists(formData.roomNumber, params.id as string);
    if (exists) {
      setErrors(prev => ({ ...prev, roomNumber: "Room number already exists" }));
      toast({
        title: "Error",
        description: "Room number already exists",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await axios.put(`${API_BASE_URL}/rooms/${params.id}`, {
        ...formData,
        roomId: parseInt(params.id as string),
        roomTypeId: parseInt(formData.roomTypeId),
      });

      toast({
        title: "Success",
        description: "Room updated successfully",
      });
      
      router.push("/rooms");
    } catch (error) {
      console.error("Error updating room:", error);
      toast({
        title: "Error",
        description: "Failed to update room",
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
          <CardTitle>Edit Room</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roomNumber">Room Number *</Label>
              <Input
                id="roomNumber"
                value={formData.roomNumber}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, roomNumber: e.target.value }));
                  setErrors(prev => ({ ...prev, roomNumber: "" }));
                }}
                placeholder="Enter room number (e.g., 101, A202)"
                className={errors.roomNumber ? "border-red-500" : ""}
              />
              {errors.roomNumber && (
                <p className="text-sm text-red-500">{errors.roomNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomTypeId">Room Type *</Label>
              <Select
                value={formData.roomTypeId}
                onValueChange={(value) => {
                  setFormData(prev => ({ ...prev, roomTypeId: value }));
                  setErrors(prev => ({ ...prev, roomTypeId: "" }));
                }}
              >
                <SelectTrigger className={errors.roomTypeId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map((type) => (
                    <SelectItem key={type.roomTypeId} value={type.roomTypeId.toString()}>
                      {type.name} - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(type.basePrice)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.roomTypeId && (
                <p className="text-sm text-red-500">{errors.roomTypeId}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AVAILABLE">Available</SelectItem>
                  <SelectItem value="OCCUPIED">Occupied</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  <SelectItem value="CLEANING">Cleaning</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Enter any additional notes"
                rows={4}
              />
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
                {loading ? "Updating..." : "Update Room"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
