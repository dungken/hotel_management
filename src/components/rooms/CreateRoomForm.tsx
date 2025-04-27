'use client';

import { useState, useEffect } from 'react';
import { Room, RoomType } from '@/types';
import { roomsService, roomTypesService } from '@/services/rooms.service';

interface CreateRoomFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ROOM_STATUSES = [
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'OCCUPIED', label: 'Occupied' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
  { value: 'CLEANING', label: 'Cleaning' },
  { value: 'INACTIVE', label: 'Inactive' },
] as const;

export default function CreateRoomForm({ onSuccess, onCancel }: CreateRoomFormProps) {
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomTypeId: '',
    status: 'AVAILABLE' as Room['status'],
    notes: '',
  });
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const types = await roomTypesService.getAll();
        setRoomTypes(types);
      } catch (err) {
        console.error('Error fetching room types:', err);
        setError('Failed to load room types');
      }
    };

    fetchRoomTypes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await roomsService.create({
        roomNumber: formData.roomNumber,
        roomTypeId: Number(formData.roomTypeId),
        status: formData.status,
        notes: formData.notes,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Error creating room:', err);
      setError(err.response?.data?.error || 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700">
          Room Number*
        </label>
        <input
          type="text"
          id="roomNumber"
          name="roomNumber"
          value={formData.roomNumber}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="e.g., 101, A24, S03"
        />
      </div>

      <div>
        <label htmlFor="roomTypeId" className="block text-sm font-medium text-gray-700">
          Room Type*
        </label>
        <select
          id="roomTypeId"
          name="roomTypeId"
          value={formData.roomTypeId}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select a room type</option>
          {roomTypes.map(type => (
            <option key={type.roomTypeId} value={type.roomTypeId}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status*
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {ROOM_STATUSES.map(status => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Additional information about the room..."
        />
      </div>

      <div className="flex justify-end space-x-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
        >
          {loading ? 'Creating...' : 'Create Room'}
        </button>
      </div>
    </form>
  );
}
