import api from './api';
import { Room, RoomType } from '@/types';

export const roomsService = {
  getAll: () => api.get<Room[]>('/rooms'),
  getById: (id: number) => api.get<Room>(`/rooms/${id}`),
  create: (room: Omit<Room, 'roomId'>) => api.post<Room>('/rooms', room),
  update: (id: number, room: Partial<Room>) => api.put<Room>(`/rooms/${id}`, room),
  delete: (id: number) => api.delete(`/rooms/${id}`),
  updateStatus: (id: number, status: string) => 
    api.patch<Room>(`/rooms/${id}`, { status }),
};

export const roomTypesService = {
  getAll: () => api.get<RoomType[]>('/roomTypes'),
  getById: (id: number) => api.get<RoomType>(`/roomTypes/${id}`),
  create: (roomType: Omit<RoomType, 'roomTypeId'>) => 
    api.post<RoomType>('/roomTypes', roomType),
  update: (id: number, roomType: Partial<RoomType>) => 
    api.put<RoomType>(`/roomTypes/${id}`, roomType),
  delete: (id: number) => api.delete(`/roomTypes/${id}`),
};
