"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Room } from "@/types";
import { roomsService } from "@/services/rooms.service";
import { UpdateRoomForm } from "@/components/rooms";

export default function EditRoomPage() {
  const router = useRouter();
  const params = useParams();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const roomId = Number(params.id);
        if (isNaN(roomId)) {
          setError('Invalid room ID');
          setLoading(false);
          return;
        }

        const roomData = await roomsService.getById(roomId);
        setRoom(roomData);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching room details:', err);
        setError(err.response?.data?.error || 'Failed to load room details');
        setLoading(false);
      }
    };

    fetchRoom();
  }, [params.id]);

  const handleSuccess = () => {
    // Navigate back to room details page after successful update
    router.push(`/rooms/${params.id}`);
  };

  const handleCancel = () => {
    // Navigate back to room details page on cancel
    router.push(`/rooms/${params.id}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
          <button
            onClick={() => router.back()}
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
        <div className="max-w-2xl mx-auto">
          <p className="text-gray-700 mb-6">Room not found.</p>
          <button
            onClick={() => router.back()}
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
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Edit Room {room.roomNumber}</h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300"
          >
            Back
          </button>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <UpdateRoomForm
            roomId={room.roomId}
            initialData={{
              status: room.status,
              notes: room.notes
            }}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}
