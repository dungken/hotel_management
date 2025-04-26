import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Booking } from '../../types/booking.types';
import { approveBooking, cancelBooking } from '../../services/booking.service';
import LoadingSpinner from '../ui/LoadingSpinner';

interface BookingDetailsProps {
  booking: Booking;
  onUpdate: () => void;
  onClose: () => void;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({ booking, onUpdate, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [applyCancellationFee, setApplyCancellationFee] = useState(false);
  const [showCancelForm, setShowCancelForm] = useState(false);

  const handleApprove = async () => {
    try {
      setIsLoading(true);
      await approveBooking(booking.displayId || booking.id.toString());
      toast.success('Booking approved successfully');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error approving booking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a cancellation reason');
      return;
    }

    try {
      setIsLoading(true);
      await cancelBooking(
        booking.displayId || booking.id.toString(),
        cancelReason,
        applyCancellationFee
      );
      toast.success('Booking cancelled successfully');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error cancelling booking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return 'Invalid date';
    }
  };

  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Booking Details</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Booking ID:</span>
          <span className="font-medium">{booking.displayId || booking.id}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Status:</span>
          <span className={`px-2 py-1 rounded-full text-sm ${getStatusClass(booking.status)}`}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Customer:</span>
          <span className="font-medium">{booking?.customer?.name || 'Unknown'}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Room:</span>
          <span className="font-medium">
            {booking?.room?.number || 'Unknown'}
            {booking?.room?.type?.name ? `(${booking.room.type.name})` : ''}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Check-in:</span>
          <span className="font-medium">{formatDate(booking.checkInDate)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Check-out:</span>
          <span className="font-medium">{formatDate(booking.checkOutDate)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Total Price:</span>
          <span className="font-medium">${booking.totalPrice.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Booking Channel:</span>
          <span className="font-medium">{booking.channel.name}</span>
        </div>

        {booking.specialRequests && (
          <div>
            <span className="text-gray-600 block mb-1">Special Requests:</span>
            <p className="bg-gray-50 p-2 rounded text-gray-700">{booking.specialRequests}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-8 space-y-4">
        {booking.status === 'pending' && (
          <button
            onClick={handleApprove}
            disabled={isLoading}
            className="w-full btn-primary"
          >
            {isLoading ? <LoadingSpinner size="small" /> : 'Approve Booking'}
          </button>
        )}

        {(booking.status === 'pending' || booking.status === 'confirmed') && (
          <>
            {!showCancelForm ? (
              <button
                onClick={() => setShowCancelForm(true)}
                className="w-full btn-secondary border border-red-500 text-red-500 hover:bg-red-50"
              >
                Cancel Booking
              </button>
            ) : (
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium text-gray-800 mb-2">Cancel Booking</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cancellation Reason
                    </label>
                    <textarea
                      className="form-input"
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="Please provide a reason for cancellation"
                      rows={3}
                    ></textarea>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="cancellationFee"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      checked={applyCancellationFee}
                      onChange={(e) => setApplyCancellationFee(e.target.checked)}
                    />
                    <label htmlFor="cancellationFee" className="ml-2 block text-sm text-gray-700">
                      Apply cancellation fee
                    </label>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowCancelForm(false)}
                      className="btn-secondary"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="btn-primary bg-red-600 hover:bg-red-700"
                    >
                      {isLoading ? <LoadingSpinner size="small" /> : 'Confirm Cancellation'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookingDetails;
