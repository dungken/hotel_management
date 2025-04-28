'use client';

import { useState } from 'react';
import { Room, RoomType } from '@/types';
import { roomsService } from '@/services/rooms.service';

interface RoomDetailsProps {
  room: Room;
  roomType: RoomType | null;
  onStatusUpdate?: () => void;
}

export default function RoomDetails({ room, roomType, onStatusUpdate }: RoomDetailsProps) {
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const updateRoomStatus = async (newStatus: string) => {
    setUpdating(true);
    setUpdateError(null);
    setSuccessMessage(null);
    
    try {
      await roomsService.updateStatus(room.roomId, newStatus);
      setSuccessMessage(`Room status updated to ${getStatusBadge(newStatus).label}`);
      
      if (onStatusUpdate) {
        setTimeout(() => {
          onStatusUpdate();
        }, 1500); // Show success message for 1.5 seconds before refresh
      }
    } catch (err: any) {
      console.error('Error updating room status:', err);
      setUpdateError(err.response?.data?.error || 'Failed to update room status');
    } finally {
      setUpdating(false);
    }
  };

  // Map status to a color and badge style
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; label: string }> = {
      'AVAILABLE': { color: 'bg-green-100 text-green-800', label: 'Available' },
      'OCCUPIED': { color: 'bg-red-100 text-red-800', label: 'Occupied' },
      'MAINTENANCE': { color: 'bg-orange-100 text-orange-800', label: 'Maintenance' },
      'CLEANING': { color: 'bg-blue-100 text-blue-800', label: 'Cleaning' },
      'INACTIVE': { color: 'bg-gray-100 text-gray-800', label: 'Inactive' },
    };

    const statusInfo = statusMap[status] || { color: 'bg-gray-100 text-gray-800', label: status };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        {updateError && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
            {updateError}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 text-green-600 p-4 rounded-md mb-4">
            {successMessage}
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Room {room.roomNumber}</h2>
          {getStatusBadge(room.status)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Room Type</h3>
            <p className="text-gray-900">{roomType?.name || 'Unknown Room Type'}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
            <p className="text-gray-900">{room.status}</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Quick Status Update</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateRoomStatus('AVAILABLE')}
              disabled={updating || room.status === 'AVAILABLE'}
              className={`px-3 py-1 text-sm rounded-full ${room.status === 'AVAILABLE' ? 'bg-green-100 text-green-800 cursor-default' : 'bg-gray-100 hover:bg-green-100 hover:text-green-800'}`}
            >
              Available
            </button>
            <button
              onClick={() => updateRoomStatus('OCCUPIED')}
              disabled={updating || room.status === 'OCCUPIED'}
              className={`px-3 py-1 text-sm rounded-full ${room.status === 'OCCUPIED' ? 'bg-red-100 text-red-800 cursor-default' : 'bg-gray-100 hover:bg-red-100 hover:text-red-800'}`}
            >
              Occupied
            </button>
            <button
              onClick={() => updateRoomStatus('MAINTENANCE')}
              disabled={updating || room.status === 'MAINTENANCE'}
              className={`px-3 py-1 text-sm rounded-full ${room.status === 'MAINTENANCE' ? 'bg-orange-100 text-orange-800 cursor-default' : 'bg-gray-100 hover:bg-orange-100 hover:text-orange-800'}`}
            >
              Maintenance
            </button>
            <button
              onClick={() => updateRoomStatus('CLEANING')}
              disabled={updating || room.status === 'CLEANING'}
              className={`px-3 py-1 text-sm rounded-full ${room.status === 'CLEANING' ? 'bg-blue-100 text-blue-800 cursor-default' : 'bg-gray-100 hover:bg-blue-100 hover:text-blue-800'}`}
            >
              Cleaning
            </button>
            <button
              onClick={() => updateRoomStatus('INACTIVE')}
              disabled={updating || room.status === 'INACTIVE'}
              className={`px-3 py-1 text-sm rounded-full ${room.status === 'INACTIVE' ? 'bg-gray-300 text-gray-800 cursor-default' : 'bg-gray-100 hover:bg-gray-300 hover:text-gray-800'}`}
            >
              Inactive
            </button>
          </div>
        </div>

        {roomType ? (
          <div className="border-t border-gray-200 pt-4 mb-6">
            <h3 className="text-lg font-medium mb-2">Room Type Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                <p className="text-gray-900">{roomType.description}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Base Price</h4>
                <p className="text-gray-900">{(roomType.basePrice || 0).toLocaleString()} VND</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Max Occupancy</h4>
                <p className="text-gray-900">
                  {roomType.maxAdults} Adults, {roomType.maxChildren} Children (up to {roomType.maxChildAge} years old)
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Extra Person Fee</h4>
                <p className="text-gray-900">{(roomType.extraPersonFee || 0).toLocaleString()} VND</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="border-t border-gray-200 pt-4 mb-6">
            <h3 className="text-lg font-medium mb-2">Room Type Details</h3>
            <p className="text-gray-700">Room type information is not available.</p>
          </div>
        )}

        {room.notes && (
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-medium mb-2">Notes</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{room.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
