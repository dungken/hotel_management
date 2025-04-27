"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface BookingIdPageProps {
  params: {
    id: string;
  };
}

export default function BookingIdPage({ params }: BookingIdPageProps) {
  const router = useRouter();
  const { id } = params;
  
  useEffect(() => {
    // Redirect to the view page
    router.push(`/bookings/${id}/view`);
  }, [id, router]);
  
  return (
    <div className="p-8 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
    </div>
  );
}
