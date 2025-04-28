'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Room, RoomType } from '@/types';
import { roomsService, roomTypesService } from '@/services/rooms.service';
import Link from 'next/link';
import { RoomDetails } from '@/components/rooms';

export default function RoomDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [room, setRoom] = useState<Room | null>(null);
  const [roomType, setRoomType] = useState<RoomType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to refresh room data after status update
  const refreshRoomData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const roomId = Number(params.id);
      if (isNaN(roomId)) {
        setError('Invalid room ID');
        setLoading(false);
        return;
      }

      try {
        // Fetch room data
        const roomData = await roomsService.getById(roomId);
        setRoom(roomData);

        // Fetch room type data
        if (roomData.roomTypeId) {
          try {
            const roomTypeData = await roomTypesService.getById(roomData.roomTypeId);
            setRoomType(roomTypeData);
          } catch (typeError) {
            console.error('Error fetching room type:', typeError);
            // Continue without the room type data
          }
        }

        setLoading(false);
      } catch (roomError) {
        console.error('Error fetching room:', roomError);
        setError('Room not found');
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Error fetching room details:', err);
      setError(err.response?.data?.error || 'Failed to load room details');
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const roomId = Number(params.id);
        if (isNaN(roomId)) {
          setError('Invalid room ID');
          setLoading(false);
          return;
        }

        try {
          // Fetch room data
          const roomData = await roomsService.getById(roomId);
          setRoom(roomData);

          // Fetch room type data
          if (roomData.roomTypeId) {
            try {
              const roomTypeData = await roomTypesService.getById(roomData.roomTypeId);
              setRoomType(roomTypeData);
            } catch (typeError) {
              console.error('Error fetching room type:', typeError);
              // Continue without the room type data
            }
          }

          setLoading(false);
        } catch (roomError) {
          console.error('Error fetching room:', roomError);
          setError('Room not found');
          setLoading(false);
        }
      } catch (err: any) {
        console.error('Error fetching room details:', err);
        setError(err.response?.data?.error || 'Failed to load room details');
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [params.id]);

  const handleBackClick = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-24 bg-gray-200 rounded mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
          <button
            onClick={handleBackClick}
            className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
          <p className="text-gray-700 mb-6">Room not found.</p>
          <button
            onClick={handleBackClick}
            className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Room Details</h1>
          <div>
            <button
              onClick={handleBackClick}
              className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 mr-2"
            >
              Back
            </button>
            <Link 
              href={`/rooms/${room.roomId}/edit`}
              className="px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700"
            >
              Edit Room
            </Link>
          </div>
        </div>

        <RoomDetails 
          room={room} 
          roomType={roomType}
          onStatusUpdate={refreshRoomData} 
        />
      </div>
    </div>
  );
}
