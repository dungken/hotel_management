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
import { RoomType } from "@/types";
import axios from "axios";
import { Plus, Search, Edit, Trash2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const API_BASE_URL = "http://localhost:3001";

export default function RoomTypesPage() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const fetchRoomTypes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/roomTypes`);
      setRoomTypes(response.data);
    } catch (error) {
      console.error("Error fetching room types:", error);
      toast({
        title: "Error",
        description: "Failed to fetch room types",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this room type?')) return;
    
    try {
      // Check if any rooms are using this room type
      const roomsResponse = await axios.get(`${API_BASE_URL}/rooms?roomTypeId=${id}`);
      if (roomsResponse.data.length > 0) {
        toast({
          title: "Error",
          description: "Cannot delete room type that has rooms assigned to it",
          variant: "destructive",
        });
        return;
      }

      await axios.delete(`${API_BASE_URL}/roomTypes/${id}`);
      toast({
        title: "Success",
        description: "Room type deleted successfully",
      });
      fetchRoomTypes();
    } catch (error) {
      console.error("Error deleting room type:", error);
      toast({
        title: "Error",
        description: "Failed to delete room type",
        variant: "destructive",
      });
    }
  };

  const handleStatusToggle = async (roomType: RoomType) => {
    try {
      await axios.put(`${API_BASE_URL}/roomTypes/${roomType.roomTypeId}`, {
        ...roomType,
        status: !roomType.status
      });
      
      toast({
        title: "Success",
        description: `Room type ${roomType.status ? 'deactivated' : 'activated'} successfully`,
      });
      fetchRoomTypes();
    } catch (error) {
      console.error("Error updating room type status:", error);
      toast({
        title: "Error",
        description: "Failed to update room type status",
        variant: "destructive",
      });
    }
  };

  const filteredRoomTypes = roomTypes.filter(type => 
    type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Rooms
          </Button>
          <h1 className="text-3xl font-bold">Room Types</h1>
          <p className="text-gray-500">Manage room types and pricing</p>
        </div>
        <Button onClick={() => router.push('/rooms/types/create')}>
          <Plus className="mr-2 h-4 w-4" /> Add Room Type
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search room types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Base Price</TableHead>
              <TableHead>Discounts</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRoomTypes.map((type) => (
              <TableRow key={type.roomTypeId}>
                <TableCell className="font-medium">{type.name}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {type.description}
                </TableCell>
                <TableCell>
                  {type.maxAdults} Adults, {type.maxChildren} Children
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(type.basePrice)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge variant="outline">Default: {type.defaultDiscountPercent}%</Badge>
                    <Badge variant="outline">Long Stay: {type.longStayDiscount}%</Badge>
                    <Badge variant="outline">Early: {type.earlyBookingDiscount}%</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={type.status ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => handleStatusToggle(type)}
                  >
                    {type.status ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/rooms/types/${type.roomTypeId}/edit`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(type.roomTypeId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredRoomTypes.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No room types found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
