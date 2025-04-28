const axios = require('axios');

async function testBookingCreation() {
  try {
    console.log('Testing booking creation with fixed approach...');
    
    // Create a sample booking
    const bookingData = {
      customerId: 1,
      roomId: 6, // Make sure this is an available room
      channelId: 1,
      checkInDate: "2025-05-10",
      checkOutDate: "2025-05-15",
      adults: 2,
      children: 1,
      childAges: "8",
      specialRequests: "Early check-in if possible",
      totalAmount: 2000000,
      extraBeds: 1,
      includesBreakfast: true,
      discountPercent: 5,
      discountReason: "Loyal customer",
      staffId: 1
    };
    
    // Log the request data
    console.log('Sending booking request with data:', JSON.stringify(bookingData, null, 2));
    
    // Make the API request
    const response = await axios.post('http://localhost:3001/bookings', bookingData);
    
    // Log the response
    console.log('\nBooking created successfully with status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    // Verify we can get the booking
    console.log('\nVerifying booking was saved by fetching it...');
    const bookingId = response.data.bookingId;
    const getResponse = await axios.get(`http://localhost:3001/bookings/${bookingId}`);
    
    console.log(`Booking with ID ${bookingId} found:`, JSON.stringify(getResponse.data, null, 2));
    
    // Verify room status
    console.log('\nVerifying room status was updated to OCCUPIED...');
    const roomId = response.data.roomId;
    const roomResponse = await axios.get(`http://localhost:3001/rooms/${roomId}`);
    
    console.log(`Room ${roomId} status:`, roomResponse.data.status);
    
    console.log('\nTest completed successfully!');
    
  } catch (error) {
    console.error('\n❌ ERROR during test:');
    
    if (error.response) {
      // Server responded with an error status
      console.error('Status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
      console.error('Response headers:', JSON.stringify(error.response.headers, null, 2));
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received from server. Is the server running?');
    } else {
      // Error in setting up the request
      console.error('Error message:', error.message);
    }
    
    console.error('Error stack trace:', error.stack);
  }
}

// Run the test
testBookingCreation();
