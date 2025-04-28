const axios = require('axios');

async function testCompleteBookingFix() {
  try {
    console.log('-------------------------------------------------------------');
    console.log('Testing Room Availability Check');
    console.log('-------------------------------------------------------------');
    
    // Test room availability check
    const checkInDate = '2025-05-01';
    const checkOutDate = '2025-05-05';
    console.log(`Checking room availability for ${checkInDate} to ${checkOutDate}...`);
    
    const availabilityResponse = await axios.get(
      `http://localhost:3001/rooms?status=AVAILABLE&checkIn=${checkInDate}&checkOut=${checkOutDate}`
    );
    
    console.log(`Found ${availabilityResponse.data.length} available rooms`);
    
    if (availabilityResponse.data.length === 0) {
      console.log('No available rooms found. Skipping booking test.');
      return;
    }
    
    // Select the first available room
    const availableRoom = availabilityResponse.data[0];
    console.log(`Selected room: ${JSON.stringify(availableRoom, null, 2)}`);
    
    console.log('\n-------------------------------------------------------------');
    console.log('Testing Booking Creation');
    console.log('-------------------------------------------------------------');
    
    // Create a booking for the available room
    const bookingData = {
      customerId: 1,
      roomId: availableRoom.roomId,
      channelId: 1,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      adults: 2,
      children: 1,
      childAges: "7",
      specialRequests: "Testing booking creation from API",
      totalAmount: 1500000,
      extraBeds: 1,
      includesBreakfast: true,
      discountPercent: 5,
      discountReason: "Test discount",
      staffId: 1
    };
    
    console.log('Creating booking with data:', JSON.stringify(bookingData, null, 2));
    
    const bookingResponse = await axios.post('http://localhost:3001/bookings', bookingData);
    
    console.log(`Booking created with ID: ${bookingResponse.data.bookingId}`);
    console.log('Booking details:', JSON.stringify(bookingResponse.data, null, 2));
    
    // Verify the room status was updated
    console.log('\n-------------------------------------------------------------');
    console.log('Verifying Room Status Update');
    console.log('-------------------------------------------------------------');
    
    const updatedRoomResponse = await axios.get(`http://localhost:3001/rooms/${availableRoom.id}`);
    console.log(`Room status is now: ${updatedRoomResponse.data.status}`);
    
    if (updatedRoomResponse.data.status === 'OCCUPIED') {
      console.log('✅ SUCCESS: Room status correctly updated to OCCUPIED');
    } else {
      console.log('❌ ERROR: Room status not updated correctly');
    }
    
    console.log('\n-------------------------------------------------------------');
    console.log('Testing Booking Update');
    console.log('-------------------------------------------------------------');
    
    // Update the booking
    const bookingUpdateData = {
      ...bookingResponse.data,
      specialRequests: "Updated special request - need extra pillows",
      discountPercent: 10,
      discountReason: "Updated discount reason"
    };
    
    console.log('Updating booking...');
    const updateResponse = await axios.put(
      `http://localhost:3001/bookings/${bookingResponse.data.bookingId}`, 
      bookingUpdateData
    );
    
    console.log('Booking updated:');
    console.log(`Special Requests: ${updateResponse.data.specialRequests}`);
    console.log(`Discount Percent: ${updateResponse.data.discountPercent}%`);
    
    console.log('\n-------------------------------------------------------------');
    console.log('All tests completed successfully!');
    console.log('-------------------------------------------------------------');
    
  } catch (error) {
    console.error('\n❌ TEST FAILED:');
    
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received. Is the server running?');
    } else {
      console.error('Error:', error.message);
    }
    
    console.error('\nStack trace:', error.stack);
  }
}

// Run the test
testCompleteBookingFix();
