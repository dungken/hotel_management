'use client';

import { useRouter } from 'next/navigation';
import CreateRoomForm from '@/components/rooms/CreateRoomForm';

export default function CreateRoomPage() {
  const router = useRouter();

  const handleSuccess = () => {
    // Navigate back to rooms list after successful creation
    router.push('/rooms');
  };

  const handleCancel = () => {
    // Navigate back to rooms list on cancel
    router.push('/rooms');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New Room</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <CreateRoomForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}
