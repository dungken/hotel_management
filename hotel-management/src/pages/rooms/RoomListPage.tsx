import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getRooms, getRoomTypes, checkAvailability } from '../../services/room.service';
import { Room, RoomType } from '../../types/room.types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const RoomListPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [searchStatus, setSearchStatus] = useState<string>('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        const [roomsData, roomTypesData] = await Promise.all([
          getRooms(),
          getRoomTypes()
        ]);
        setRooms(roomsData);
        setRoomTypes(roomTypesData);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleAvailabilityCheck = async () => {
    if (!checkInDate || !checkOutDate) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    try {
      setIsLoading(true);
      const availableRooms = await checkAvailability(checkInDate, checkOutDate);
      setRooms(availableRooms);
      toast.success('Available rooms loaded successfully');
    } catch (error) {
      console.error('Error checking availability:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoomTypeName = (typeId: number): string => {
    const roomType = roomTypes.find(type => type.id === typeId);
    return roomType ? roomType.name : 'Unknown';
  };

  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRooms = searchStatus
    ? rooms.filter(room => room.status === searchStatus)
    : rooms;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Room Management</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Check Room Availability</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-in Date
            </label>
            <input
              type="date"
              className="form-input"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-out Date
            </label>
            <input
              type="date"
              className="form-input"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <button
              className="btn-primary w-full"
              onClick={handleAvailabilityCheck}
              disabled={isLoading}
            >
              Check Availability
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Room List</h2>
          <div className="flex items-center">
            <label className="mr-2 text-sm font-medium text-gray-700">Filter by status:</label>
            <select
              className="form-input"
              value={searchStatus}
              onChange={(e) => setSearchStatus(e.target.value)}
            >
              <option value="">All</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <LoadingSpinner size="large" />
          </div>
        ) : filteredRooms.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room Number
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Floor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRooms.map((room) => (
                  <tr key={room.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {room.number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getRoomTypeName(room.type.id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {room.floor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(room.status)}`}>
                        {room.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-primary hover:text-primary/80 mr-2">View Details</button>
                      {room.status === 'available' && (
                        <button className="text-green-600 hover:text-green-800">Book Room</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No rooms found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomListPage;
