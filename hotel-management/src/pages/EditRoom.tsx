import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { roomApi } from '../services/api';
import { mockRooms, mockRoomTypes } from '../services/mockData';
import { Room, RoomType } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

interface EditRoomForm {
  soPhong: string;
  maLoaiPhong: string;
  trangThai: string;
  ghiChu?: string;
}

const EditRoom: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<EditRoomForm>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, we would use the API
        // const [roomResponse, roomTypesResponse] = await Promise.all([
        //   roomApi.getRoom(parseInt(id!)),
        //   roomTypeApi.getRoomTypes()
        // ]);
        // const room = roomResponse.data.data;
        // setRoomTypes(roomTypesResponse.data.data);

        // For now, using mock data
        const room = mockRooms.find(r => r.maPhong === parseInt(id!));
        setRoomTypes(mockRoomTypes);

        if (room) {
          reset({
            soPhong: room.soPhong,
            maLoaiPhong: room.maLoaiPhong.toString(),
            trangThai: room.trangThai,
            ghiChu: room.ghiChu,
          });
        } else {
          navigate('/rooms');
        }
      } catch (error) {
        console.error('Error fetching room data:', error);
        navigate('/rooms');
      } finally {
        setIsFetching(false);
      }
    };

    if (id) {
      fetchData();
    } else {
      navigate('/rooms');
    }
  }, [id, navigate, reset]);

  const onSubmit = async (data: EditRoomForm) => {
    setIsLoading(true);
    try {
      // In a real app, we would use the API
      // await roomApi.updateRoom(parseInt(id!), {
      //   ...data,
      //   maLoaiPhong: parseInt(data.maLoaiPhong),
      // });

      // For now, just navigate back
      navigate('/rooms');
    } catch (error) {
      console.error('Error updating room:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Edit Room</h1>
      </div>

      <Card className="max-w-2xl p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Input
              label="Room Number"
              {...register('soPhong', { required: 'Room number is required' })}
              error={errors.soPhong?.message}
            />
          </div>

          <div>
            <Select
              label="Room Type"
              {...register('maLoaiPhong', { required: 'Room type is required' })}
              error={errors.maLoaiPhong?.message}
              options={roomTypes.map(type => ({
                value: type.maLoaiPhong.toString(),
                label: type.tenLoaiPhong,
              }))}
            />
          </div>

          <div>
            <Select
              label="Status"
              {...register('trangThai', { required: 'Status is required' })}
              error={errors.trangThai?.message}
              options={[
                { value: '1', label: 'Available' },
                { value: '2', label: 'Occupied' },
                { value: '3', label: 'Maintenance' },
              ]}
            />
          </div>

          <div>
            <Input
              label="Notes"
              {...register('ghiChu')}
              placeholder="Optional notes about the room"
            />
          </div>

          <div className="flex space-x-4">
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/rooms')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditRoom; 