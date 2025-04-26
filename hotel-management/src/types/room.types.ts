export interface RoomType {
  id: number;
  name: string;
  price: number;
  description: string;
  capacity: number;
  maxChildren?: number;
  maxChildAge?: number;
  extraPersonFee?: number;
  defaultDiscount?: number;
}

export interface Room {
  id: number;
  number: string;
  type: RoomType;
  status: 'available' | 'occupied' | 'maintenance';
  floor: number;
  notes?: string;
}
