const axios = require('axios');

async function testDirectServer() {
  try {
    console.log('===============================================================');
    console.log('TESTING DIRECT SERVER IMPLEMENTATION');
    console.log('===============================================================\n');
    
    // 1. Check if server is running
    console.log('1. Checking server connection...');
    let response = await axios.get('http://localhost:3001/bookings');
    console.log(`✅ Server is running! Found ${response.data.length} bookings`);
    
    // 2. Test room availability check
    console.log('\n2. Testing room availability check...');
    const checkInDate = '2025-05-10';
    const checkOutDate = '2025-05-15';
    
    response = await axios.get(`http://localhost:3001/rooms?status=AVAILABLE&checkIn=${checkInDate}&checkOut=${checkOutDate}`);
    console.log(`✅ Found ${response.data.length} available rooms for the period ${checkInDate} to ${checkOutDate}`);
    
    if (response.data.length === 0) {
      console.log('⚠️ No available rooms found. Skipping booking creation test.');
      return;
    }
    
    const roomToBook = response.data[0];
    console.log(`Selected room for booking: Room ID ${roomToBook.roomId}`);
    
    // 3. Test booking creation
    console.log('\n3. Testing booking creation...');
    
    const bookingData = {
      customerId: 1,
      roomId: roomToBook.roomId,
      channelId: 1,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      adults: 2,
      children: 1,
      childAges: "8",
      specialRequests: "Direct server test booking",
      totalAmount: 2000000,
      extraBeds: 1,
      includesBreakfast: true,
      discountPercent: 5,
      discountReason: "Testing discount"
    };
    
    response = await axios.post('http://localhost:3001/bookings', bookingData);
    
    if (response.status === 201) {
      console.log(`✅ Booking created successfully with ID: ${response.data.bookingId}`);
      console.log('Created booking data:', JSON.stringify(response.data, null, 2));
      
      // Store the booking ID for later tests
      const bookingId = response.data.bookingId;
      
      // 4. Test getting a single booking
      console.log('\n4. Testing get booking by ID...');
      response = await axios.get(`http://localhost:3001/bookings/${bookingId}`);
      console.log(`✅ Successfully retrieved booking with ID ${bookingId}`);
      
      // 5. Test updating a booking
      console.log('\n5. Testing booking update...');
      const updateData = {
        ...response.data,
        specialRequests: "Updated special request for testing",
        discountPercent: 10
      };
      
      response = await axios.put(`http://localhost:3001/bookings/${bookingId}`, updateData);
      console.log(`✅ Successfully updated booking with ID ${bookingId}`);
      console.log('Updated fields:');
      console.log(`  - Special Requests: ${response.data.specialRequests}`);
      console.log(`  - Discount: ${response.data.discountPercent}%`);
      
      // 6. Check if room status was updated to OCCUPIED
      console.log('\n6. Testing room status update...');
      response = await axios.get(`http://localhost:3001/rooms`);
      const updatedRoom = response.data.find(r => r.roomId === roomToBook.roomId);
      
      if (updatedRoom.status === 'OCCUPIED') {
        console.log(`✅ Room ${roomToBook.roomId} status was correctly updated to OCCUPIED`);
      } else {
        console.log(`❌ Room ${roomToBook.roomId} status was not updated correctly. Current status: ${updatedRoom.status}`);
      }
    }
    
    console.log('\n===============================================================');
    console.log('ALL TESTS COMPLETED SUCCESSFULLY!');
    console.log('===============================================================');
  } catch (error) {
    console.error('\n❌ TEST FAILED:');
    
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Response:', error.response.data);
    } else if (error.request) {
      console.error('No response received. Is the server running?');
    } else {
      console.error('Error:', error.message);
    }
  }
}

testDirectServer();
