const axios = require('axios');

async function testCreateBooking() {
  try {
    // Create a sample booking
    const bookingData = {
      customerId: 1,
      roomId: 3, // Assuming this is an available room
      channelId: 1,
      checkInDate: "2025-05-01",
      checkOutDate: "2025-05-05",
      adults: 2,
      children: 0,
      childAges: "",
      bookingDate: new Date().toISOString().split('T')[0],
      status: "PENDING",
      hasCancellationFee: false,
      cancellationReason: null,
      specialRequests: "Late check-in",
      totalAmount: 1000000,
      extraBeds: 0,
      includesBreakfast: true,
      discountPercent: 0,
      discountReason: null,
      staffId: 1
    };
    
    // Make the API request
    console.log('Creating booking...');
    const response = await axios.post('http://localhost:3001/bookings', bookingData);
    
    // Log the response
    console.log('Booking created successfully:');
    console.log(JSON.stringify(response.data, null, 2));

    // Verify that the booking was created by fetching it
    console.log('Fetching the created booking...');
    const bookingId = response.data.bookingId;
    const getResponse = await axios.get(`http://localhost:3001/bookings/${bookingId}`);
    console.log('Fetched booking:');
    console.log(JSON.stringify(getResponse.data, null, 2));
    
    // Verify that the room status was updated to OCCUPIED
    console.log('Checking room status...');
    const roomResponse = await axios.get(`http://localhost:3001/rooms/${bookingData.roomId}`);
    console.log('Room status:', roomResponse.data.status);
    
  } catch (error) {
    console.error('Error testing booking creation:');
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

// Run the test
testCreateBooking();
