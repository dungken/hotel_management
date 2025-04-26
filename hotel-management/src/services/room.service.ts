import api from './api';
import { Room, RoomType } from '../types/room.types';

export const getRooms = async (): Promise<Room[]> => {
  const response = await api.get<{ messenge: string, data: any[] }>('/Phong/GetRoom');

  // Map the API response to our frontend model
  return response.data.data.map(item => ({
    id: item.maPhong,
    number: item.soPhong,
    type: {
      id: item.maLoaiPhong,
      name: 'Room Type',  // We might need to fetch room types separately
      price: 0,
      description: '',
      capacity: 0
    },
    status: item.trangThai === '1' ? 'available' : 'occupied',
    floor: Math.floor(parseInt(item.soPhong) / 100)
  }));
};

export const checkAvailability = async (
  checkInDate: string,
  checkOutDate: string
): Promise<Room[]> => {
  const response = await api.put<{ messesge: string, listRoom: any[] }>('/Phong/GetRoomEmpty', {
    ngayNhan: checkInDate,
    ngayTra: checkOutDate
  });

  // Map the API response to our frontend model
  return response.data.listRoom.map(item => ({
    id: item.maPhong,
    number: item.soPhong,
    type: {
      id: item.maLoaiPhong,
      name: 'Room Type',  // We might need to fetch room types separately
      price: 0,
      description: '',
      capacity: 0
    },
    status: item.trangThai === '1' ? 'available' : 'occupied',
    floor: Math.floor(parseInt(item.soPhong) / 100)
  }));
};

export const getRoomTypes = async (): Promise<RoomType[]> => {
  const response = await api.get<{ messenge: string, data: any[] }>('/LoaiPhong/LayLoaiPhong');

  // Map the API response to our frontend model
  return response.data.data.map(item => ({
    id: item.maLoaiPhong,
    name: item.tenLoaiPhong,
    price: item.giaCoBan,
    description: item.moTa,
    capacity: item.soNguoiToiDa
  }));
};

export const calculateRoomPrice = async (roomTypeId: number, hasExtraPerson: boolean): Promise<number> => {
  const response = await api.get<number>('/LoaiPhong/TinhGiaLoaiPhong', {
    params: {
      maLoaiPhong: roomTypeId,
      coThemNguoi: hasExtraPerson
    }
  });
  return response.data;
};
