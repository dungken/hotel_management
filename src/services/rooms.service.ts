import api from './api';
import { Room, RoomType } from '@/types';

export const roomsService = {
  getAll: () => api.get<Room[]>('/rooms'),
  getById: (id: number) => api.get<Room[]>(`/rooms?roomId=${id}`).then(rooms => {
    // Since we're using the query parameter, we get an array
    // We need to return the first item in the array
    if (Array.isArray(rooms) && rooms.length > 0) {
      return rooms[0];
    }
    throw new Error('Room not found');
  }),
  create: (room: Omit<Room, 'roomId'>) => {
    // JSON Server expects 'id' for auto-increment but our schema uses 'roomId'
    // Transform the data to match what JSON Server expects
    const transformedData = {
      ...room,
      // Don't include roomId - let JSON Server assign it
    };
    return api.post<Room>('/rooms', transformedData);
  },
  update: (id: number, room: Partial<Room>) => {
    // We need to handle both id and roomId fields for JSON Server compatibility
    // Since we're using roomId as our primary key but JSON Server expects id
    return api.put<Room>(`/rooms/${id}`, {
      ...room,
      roomId: id, // Ensure roomId is preserved
      id: id, // Ensure id is preserved for JSON Server
    });
  },
  delete: (id: number) => api.delete(`/rooms/${id}`),
  updateStatus: (id: number, status: string) => 
    api.patch<Room>(`/rooms/${id}`, { status }),
  checkAvailability: (checkInDate: string, checkOutDate: string) => {
    // Format: YYYY-MM-DD or ISO date string
    return api.get<Room[]>(`/rooms?status=AVAILABLE&checkIn=${checkInDate}&checkOut=${checkOutDate}`);
  },
};

export const roomTypesService = {
  getAll: () => api.get<RoomType[]>('/roomTypes'),
  getById: (id: number) => api.get<RoomType>(`/roomTypes?roomTypeId=${id}`).then(types => {
    // Since we're using the query parameter, we get an array
    // We need to return the first item in the array
    if (Array.isArray(types) && types.length > 0) {
      return types[0];
    }
    throw new Error('Room type not found');
  }),
  create: (roomType: Omit<RoomType, 'roomTypeId'>) => 
    api.post<RoomType>('/roomTypes', roomType),
  update: (id: number, roomType: Partial<RoomType>) => 
    api.put<RoomType>(`/roomTypes/${id}`, roomType),
  delete: (id: number) => api.delete(`/roomTypes/${id}`),
};
