import React, { useState, useEffect, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { Room, RoomType } from '../types';
import { roomService } from '../services/room.service';
import { mockRooms } from '../services/mockData';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import { toast } from 'react-hot-toast';

const Rooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [statuses, setStatuses] = useState<{ value: string; label: string; color: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'ALL',
    roomType: 0,
    floor: 0
  });

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [typesData, statusesData] = await Promise.all([
          roomService.getRoomTypes(),
          roomService.getRoomStatuses()
        ]);
        setRoomTypes(typesData);
        setStatuses(statusesData);
        // Initialize rooms with all mockRooms
        setRooms([...mockRooms]);
      } catch (error) {
        toast.error('Lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Get available floor options - should not change based on filtered rooms
  const floorOptions = React.useMemo(() => {
    const floors = Array.from(new Set(mockRooms.map(r => Math.floor(Number(r.soPhong) / 100))))
      .sort((a, b) => a - b)
      .map(floor => ({
        value: floor,
        label: `Tầng ${floor}`
      }));
    return [{ value: 0, label: 'Tất cả các tầng' }, ...floors];
  }, []); // Empty dependency array since mockRooms is constant

  // Handle filter changes
  const handleFilterChange = (name: string, value: string | number) => {
    setLoading(true);
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    // Always start with mockRooms
    let filteredRooms = [...mockRooms];

    // Apply all active filters
    if (newFilters.status && newFilters.status !== 'ALL') {
      filteredRooms = filteredRooms.filter(room => room.trangThai === newFilters.status);
    }
    if (newFilters.roomType) {
      filteredRooms = filteredRooms.filter(room => room.maLoaiPhong === newFilters.roomType);
    }
    if (newFilters.floor) {
      filteredRooms = filteredRooms.filter(room => {
        const floorNumber = Math.floor(parseInt(room.soPhong) / 100);
        return floorNumber === newFilters.floor;
      });
    }

    setRooms(filteredRooms);
    setLoading(false);
  };

  // Handle room deletion
  const handleDeleteRoom = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) return;
    
    try {
      await roomService.deleteRoom(id);
      setRooms(rooms.filter(room => room.maPhong !== id));
      toast.success('Xóa phòng thành công');
    } catch (error) {
      toast.error('Lỗi khi xóa phòng');
    }
  };

  // Handle status change
  const handleStatusChange = async (id: number, status: string) => {
    try {
      const updatedRoom = await roomService.updateRoomStatus(id, status);
      setRooms(rooms.map(room => 
        room.maPhong === id ? updatedRoom : room
      ));
      toast.success('Cập nhật trạng thái thành công');
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const columns = [
    {
      header: 'Số phòng',
      accessor: (room: Room) => (
        <div className="font-medium text-gray-900">
          {room.soPhong}
        </div>
      ),
    },
    {
      header: 'Loại phòng',
      accessor: (room: Room) => {
        const type = roomTypes.find(t => t.maLoaiPhong === room.maLoaiPhong);
        return (
          <div className="flex items-center">
            <span className="font-medium text-gray-700">{type?.tenLoaiPhong || 'N/A'}</span>
          </div>
        );
      }
    },
    {
      header: 'Trạng thái',
      accessor: (room: Room) => {
        const status = statuses.find(s => s.value === room.trangThai);
        return (
          <div className="flex items-center gap-3">
            <Badge color={status?.color || 'gray'}>
              {status?.label || room.trangThai}
            </Badge>
            <Select
              value={room.trangThai}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => handleStatusChange(room.maPhong, e.target.value)}
              options={statuses.map(s => ({
                value: s.value,
                label: s.label
              }))}
              className="w-36 text-sm"
            />
          </div>
        );
      }
    },
    {
      header: 'Ghi chú',
      accessor: (room: Room) => (
        <div className="text-gray-600 max-w-xs truncate">
          {room.ghiChu}
        </div>
      ),
    },
    {
      header: 'Thao tác',
      accessor: (room: Room) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/rooms/edit/${room.maPhong}`}
            className="text-blue-600 hover:text-blue-800"
          >
            <Button variant="secondary" size="sm" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Sửa
            </Button>
          </Link>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDeleteRoom(room.maPhong)}
            className="flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Xóa
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Quản lý phòng</h1>
            <Link to="/rooms/create">
              <Button className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Thêm phòng mới
              </Button>
            </Link>
          </div>
          
          <div className="mt-4 bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Select
                label="Trạng thái"
                value={filters.status}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => handleFilterChange('status', e.target.value)}
                options={[
                  { value: 'ALL', label: 'Tất cả trạng thái' },
                  ...statuses.map(s => ({
                    value: s.value,
                    label: s.label
                  }))
                ]}
                className="w-full"
              />
              <Select
                label="Loại phòng"
                value={filters.roomType}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => handleFilterChange('roomType', Number(e.target.value))}
                options={[
                  { value: 0, label: 'Tất cả loại phòng' },
                  ...roomTypes.map(type => ({
                    value: type.maLoaiPhong,
                    label: type.tenLoaiPhong
                  }))
                ]}
                className="w-full"
              />
              <Select
                label="Tầng"
                value={filters.floor}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => handleFilterChange('floor', Number(e.target.value))}
                options={floorOptions}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-1">
            <Table
              data={rooms}
              columns={columns}
              keyExtractor={(item: Room) => item.maPhong.toString()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rooms; 