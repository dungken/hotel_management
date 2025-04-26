import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Room, RoomType } from '../types';
import { roomService } from '../services/room.service';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import { toast } from 'react-hot-toast';

interface CreateRoomForm {
  soPhong: string;
  maLoaiPhong: string;
  ghiChu?: string;
}

const CreateRoom: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [roomTypes, setRoomTypes] = React.useState<RoomType[]>([]);
  const [existingRooms, setExistingRooms] = React.useState<Room[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRoomForm>({
    defaultValues: {
      maLoaiPhong: '',
      soPhong: '',
      ghiChu: ''
    }
  });

  // Fetch room types and existing rooms
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [types, rooms] = await Promise.all([
          roomService.getRoomTypes(),
          roomService.getRooms()
        ]);
        setRoomTypes(types);
        setExistingRooms(rooms);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Lỗi khi tải dữ liệu');
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data: CreateRoomForm) => {
    if (!data.soPhong || !data.maLoaiPhong) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setLoading(true);

      const newRoom: Omit<Room, 'maPhong'> = {
        soPhong: data.soPhong,
        maLoaiPhong: parseInt(data.maLoaiPhong),
        trangThai: 'AVAILABLE',
        ghiChu: data.ghiChu || ''
      };

      const result = await roomService.createRoom(newRoom);
      
      if (result) {
        toast.success('Thêm phòng mới thành công');
        setTimeout(() => {
          navigate('/rooms');
        }, 500);
      } else {
        throw new Error('Không thể tạo phòng mới');
      }
    } catch (error) {
      console.error('Error creating room:', error);
      toast.error('Lỗi khi thêm phòng mới: ' + (error instanceof Error ? error.message : 'Lỗi không xác định'));
    } finally {
      setLoading(false);
    }
  };

  const validateRoomNumber = (value: string) => {
    if (!value) {
      return 'Vui lòng nhập số phòng';
    }
    if (!/^\d{3}$/.test(value)) {
      return 'Số phòng phải có 3 chữ số';
    }
    if (existingRooms.some(room => room.soPhong === value)) {
      return 'Số phòng đã tồn tại';
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Thêm phòng mới</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div>
              <Input
                label="Số phòng"
                {...register('soPhong', {
                  validate: validateRoomNumber
                })}
                error={errors.soPhong?.message}
                placeholder="Nhập số phòng (3 chữ số)"
                required
              />
            </div>

            <div>
              <Select
                label="Loại phòng"
                {...register('maLoaiPhong', {
                  required: 'Vui lòng chọn loại phòng'
                })}
                error={errors.maLoaiPhong?.message}
                options={[
                  { value: '', label: 'Chọn loại phòng' },
                  ...roomTypes.map(type => ({
                    value: type.maLoaiPhong.toString(),
                    label: type.tenLoaiPhong
                  }))
                ]}
                required
              />
            </div>

            <div>
              <Input
                label="Ghi chú"
                {...register('ghiChu')}
                placeholder="Nhập ghi chú (không bắt buộc)"
              />
            </div>

            <div className="flex items-center justify-end space-x-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/rooms')}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Thêm phòng'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom; 