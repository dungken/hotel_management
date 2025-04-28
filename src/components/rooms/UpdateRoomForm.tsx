'use client';

import { useState, useEffect } from 'react';
import { Room } from '@/types';
import { roomsService } from '@/services/rooms.service';

interface UpdateRoomFormProps {
  roomId: number;
  initialData?: Partial<Room>;
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

export default function UpdateRoomForm({ 
  roomId, 
  initialData, 
  onSuccess, 
  onCancel 
}: UpdateRoomFormProps) {
  const [formData, setFormData] = useState<Partial<Room>>({
    status: initialData?.status || 'AVAILABLE',
    notes: initialData?.notes || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        status: initialData.status || 'AVAILABLE',
        notes: initialData.notes || '',
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await roomsService.update(roomId, {
        status: formData.status,
        notes: formData.notes,
      });

      setSuccessMessage('Room updated successfully');
      
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1500); // Show success message for 1.5 seconds before redirect
      }
    } catch (err: any) {
      console.error('Error updating room:', err);
      setError(err.response?.data?.error || 'Failed to update room');
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

      {successMessage && (
        <div className="bg-green-50 text-green-600 p-4 rounded-md">
          {successMessage}
        </div>
      )}

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
            disabled={loading}
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
          {loading ? 'Updating...' : 'Update Room'}
        </button>
      </div>
    </form>
  );
}
