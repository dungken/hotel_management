import api from './api';
import { Room, RoomType } from '../types';
import { mockRooms, mockRoomTypes } from './mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const roomService = {
  // Get all rooms with optional filters
  getRooms: async (filters?: {
    status?: string;
    roomType?: number;
    floor?: number;
  }): Promise<Room[]> => {
    try {
      const response = await api.get<{ message?: string; messenge?: string; data: Room[] }>('/Phong/GetRoom');
      let rooms = response.data.data;

      if (filters) {
        if (filters.status) {
          rooms = rooms.filter(room => room.trangThai === filters.status);
        }
        if (filters.roomType) {
          rooms = rooms.filter(room => room.maLoaiPhong === filters.roomType);
        }
        if (filters.floor) {
          rooms = rooms.filter(room => Math.floor(parseInt(room.soPhong) / 100) === filters.floor);
        }
      }

      return rooms;
    } catch (error) {
      console.error('Error fetching rooms:', error);
      return mockRooms;
    }
  },

  // Get available rooms for a date range
  getAvailableRooms: async (checkIn?: string, checkOut?: string): Promise<Room[]> => {
    try {
      if (checkIn && checkOut) {
        const response = await api.put<{ messesge?: string; listRoom: Room[] }>('/Phong/GetRoomEmpty', {
          ngayNhan: checkIn,
          ngayTra: checkOut
        });
        return response.data.listRoom;
      } else {
        // If no dates provided, return all rooms with status 'Trống'
        const rooms = await roomService.getRooms({ status: 'Trống' });
        return rooms;
      }
    } catch (error) {
      console.error('Error fetching available rooms:', error);
      return mockRooms.filter(room => room.trangThai === 'Trống');
    }
  },

  // Get room by ID
  getRoomById: async (id: number): Promise<Room | null> => {
    try {
      const response = await api.get<{ message?: string; messenge?: string; data: Room }>(`/Phong/GetRoom/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching room:', error);
      return mockRooms.find(room => room.maPhong === id) || null;
    }
  },

  // Get room types
  getRoomTypes: async (): Promise<RoomType[]> => {
    try {
      const response = await api.get<{ message?: string; messenge?: string; data: RoomType[] }>('/LoaiPhong/LayLoaiPhong');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching room types:', error);
      return mockRoomTypes;
    }
  },

  // Calculate room price
  calculateRoomPrice: async (roomTypeId: number, hasExtraPerson: boolean): Promise<number> => {
    try {
      const response = await api.get<number>(`/LoaiPhong/TinhGiaLoaiPhong`, {
        params: {
          maLoaiPhong: roomTypeId,
          coThemNguoi: hasExtraPerson
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error calculating room price:', error);
      // Fallback to mock calculation
      const roomType = mockRoomTypes.find(rt => rt.maLoaiPhong === roomTypeId);
      if (!roomType) throw new Error('Room type not found');
      return hasExtraPerson ? roomType.giaCoBan + roomType.phiNguoiThem : roomType.giaCoBan;
    }
  },

  // Create room
  createRoom: async (roomData: Omit<Room, 'maPhong'>): Promise<Room> => {
    try {
      const response = await api.put<{ message?: string; messenge?: string; data: Room }>('/Phong/ThemPhong', roomData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  },

  // Update room
  updateRoom: async (id: number, roomData: Partial<Room>): Promise<Room> => {
    try {
      const response = await api.put<{ message?: string; messenge?: string; data: Room }>(`/Phong/CapNhatPhong/${id}`, roomData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating room:', error);
      throw error;
    }
  },

  // Delete room
  deleteRoom: async (id: number): Promise<void> => {
    await delay(500);
    const index = mockRooms.findIndex(room => room.maPhong === id);
    if (index === -1) throw new Error('Không tìm thấy phòng');
    mockRooms.splice(index, 1);
  },

  // Get room status options
  getRoomStatuses: async (): Promise<{ value: string; label: string; color: string }[]> => {
    return [
      { value: 'AVAILABLE', label: 'Trống', color: 'green' },
      { value: 'OCCUPIED', label: 'Đã thuê', color: 'blue' },
      { value: 'RESERVED', label: 'Đã đặt', color: 'yellow' },
      { value: 'MAINTENANCE', label: 'Bảo trì', color: 'red' },
      { value: 'CLEANING', label: 'Đang dọn', color: 'purple' }
    ];
  },

  // Update room status
  updateRoomStatus: async (id: number, status: string): Promise<Room> => {
    return roomService.updateRoom(id, { trangThai: status });
  }
};
