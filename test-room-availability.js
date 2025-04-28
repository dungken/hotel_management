const axios = require('axios');

async function testRoomAvailability() {
  try {
    // Set the check-in and check-out dates for testing
    const checkInDate = '2025-05-01';  // Future date to test
    const checkOutDate = '2025-05-05'; // Future date to test
    
    // Make the API request
    const response = await axios.get(`http://localhost:3001/rooms?status=AVAILABLE&checkIn=${checkInDate}&checkOut=${checkOutDate}`);
    
    // Log the response
    console.log('Available Rooms:', response.data);
    console.log(`Found ${response.data.length} available rooms for the period ${checkInDate} to ${checkOutDate}`);
    
    // Test with invalid dates
    try {
      const invalidResponse = await axios.get('http://localhost:3001/rooms?status=AVAILABLE&checkIn=invalid-date&checkOut=2025-05-05');
      console.log('Response with invalid date:', invalidResponse.data);
    } catch (error) {
      console.log('Error with invalid date (expected):', error.response.data);
    }
    
    // Test without dates
    const allRoomsResponse = await axios.get('http://localhost:3001/rooms');
    console.log(`Total rooms in system: ${allRoomsResponse.data.length}`);
    
  } catch (error) {
    console.error('Error testing room availability:', error.response ? error.response.data : error.message);
  }
}

// Run the test
testRoomAvailability();
