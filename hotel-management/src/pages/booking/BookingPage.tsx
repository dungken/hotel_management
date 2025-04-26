import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getRooms, checkAvailability, getRoomTypes } from '../../services/room.service';
import { getBookingChannels, createBooking, getBookings } from '../../services/booking.service';
import { Room, RoomType } from '../../types/room.types';
import { BookingChannel, Booking, CreateBookingRequest } from '../../types/booking.types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import BookingDetails from '../../components/booking/BookingDetails';

const BookingPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [channels, setChannels] = useState<BookingChannel[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [showAvailabilityForm, setShowAvailabilityForm] = useState(true);
  const [step, setStep] = useState<'availability' | 'booking'>('availability');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      checkInDate: '',
      checkOutDate: '',
      roomId: '',
      channelId: '',
      customerId: '',
      adults: 1,
      children: 0
    }
  });

  const checkInDate = watch('checkInDate');
  const checkOutDate = watch('checkOutDate');

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const [roomsData, roomTypesData, channelsData, bookingsData] = await Promise.all([
          getRooms(),
          getRoomTypes(),
          getBookingChannels(),
          getBookings()
        ]);

        setRooms(roomsData);
        setRoomTypes(roomTypesData);
        setChannels(channelsData);
        setBookings(bookingsData);
      } catch (error) {
        console.error('Error loading initial data:', error);
        toast.error('Failed to load initial data');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const onCheckAvailability = async (data: any) => {
    if (!data.checkInDate || !data.checkOutDate) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    try {
      setIsLoading(true);
      const availableRooms = await checkAvailability(data.checkInDate, data.checkOutDate);
      setAvailableRooms(availableRooms);
      setStep('booking');
      setShowAvailabilityForm(false);
      toast.success(`Found ${availableRooms.length} available rooms`);
    } catch (error) {
      console.error('Error checking availability:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onCreateBooking = async (data: any) => {
    const bookingData: CreateBookingRequest = {
      customerId: parseInt(data.customerId),
      roomId: parseInt(data.roomId),
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      channelId: parseInt(data.channelId)
    };

    try {
      setIsSubmitting(true);
      const booking = await createBooking(bookingData);
      toast.success('Booking created successfully!');

      // Reset form and state
      reset();
      setBookings([...bookings, booking]);
      setStep('availability');
      setShowAvailabilityForm(true);
    } catch (error) {
      console.error('Error creating booking:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelBookingCheck = () => {
    setStep('availability');
    setShowAvailabilityForm(true);
    reset();
  };

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  const handleBookingUpdate = async () => {
    try {
      setIsLoading(true);
      const updatedBookings = await getBookings();
      setBookings(updatedBookings);
    } catch (error) {
      console.error('Error refreshing bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeBookingDetails = () => {
    setSelectedBooking(null);
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Booking Management</h1>

      {step === 'availability' && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Check Room Availability</h2>
          <form onSubmit={handleSubmit(onCheckAvailability)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-in Date
                </label>
                <input
                  type="date"
                  className="form-input"
                  {...register('checkInDate', { required: 'Check-in date is required' })}
                />
                {errors.checkInDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.checkInDate.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-out Date
                </label>
                <input
                  type="date"
                  className="form-input"
                  {...register('checkOutDate', { required: 'Check-out date is required' })}
                />
                {errors.checkOutDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.checkOutDate.message}</p>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? <LoadingSpinner size="small" /> : 'Check Availability'}
              </button>
            </div>
          </form>
        </div>
      )}

      {step === 'booking' && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Create Booking</h2>
          <form onSubmit={handleSubmit(onCreateBooking)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-in Date
                </label>
                <input
                  type="date"
                  className="form-input"
                  readOnly
                  value={checkInDate}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-out Date
                </label>
                <input
                  type="date"
                  className="form-input"
                  readOnly
                  value={checkOutDate}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room
                </label>
                <select
                  className="form-input"
                  {...register('roomId', { required: 'Room is required' })}
                >
                  <option value="">Select a room</option>
                  {availableRooms.map(room => (
                    <option key={room.id} value={room.id}>
                      {room.number} - {room.type.name} (${room.type.price}/night)
                    </option>
                  ))}
                </select>
                {errors.roomId && (
                  <p className="mt-1 text-sm text-red-600">{errors.roomId.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Booking Channel
                </label>
                <select
                  className="form-input"
                  {...register('channelId', { required: 'Booking channel is required' })}
                >
                  <option value="">Select a booking channel</option>
                  {channels.map(channel => (
                    <option key={channel.id} value={channel.id}>
                      {channel.name}
                    </option>
                  ))}
                </select>
                {errors.channelId && (
                  <p className="mt-1 text-sm text-red-600">{errors.channelId.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer ID
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter customer ID"
                  {...register('customerId', { required: 'Customer ID is required' })}
                />
                {errors.customerId && (
                  <p className="mt-1 text-sm text-red-600">{errors.customerId.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Adults
                </label>
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  {...register('adults', { required: 'Number of adults is required' })}
                />
                {errors.adults && (
                  <p className="mt-1 text-sm text-red-600">{errors.adults.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Children
                </label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  {...register('children')}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="btn-secondary"
                onClick={cancelBookingCheck}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? <LoadingSpinner size="small" /> : 'Create Booking'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Recent Bookings</h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <LoadingSpinner size="large" />
          </div>
        ) : bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check-in
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check-out
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
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {booking.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.room.number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(booking.checkInDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(booking.checkOutDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                        }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        className="text-primary hover:text-primary/80 mr-2"
                        onClick={() => handleViewBooking(booking)}
                      >
                        View
                      </button>
                      {booking.status === 'pending' && (
                        <button className="text-green-600 hover:text-green-800 mr-2">
                          Approve
                        </button>
                      )}
                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <button className="text-red-600 hover:text-red-800">
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No bookings found.
          </div>
        )}
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <BookingDetails
            booking={selectedBooking}
            onUpdate={handleBookingUpdate}
            onClose={closeBookingDetails}
          />
        </div>
      )}
    </div>
  );
};

export default BookingPage;
