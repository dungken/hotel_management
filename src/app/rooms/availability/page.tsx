"use client";

import { RoomAvailabilityCheck } from "@/components/rooms/RoomAvailabilityCheck";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RoomAvailabilityPage() {
  const router = useRouter();

  return (
    <div className="p-8">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Room Availability</h1>
        <p className="text-gray-500">Check available rooms for specific dates</p>
      </div>

      <RoomAvailabilityCheck />
    </div>
  );
}
