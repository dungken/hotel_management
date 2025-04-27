// Test script to verify the room creation API
// Run with: ts-node src/scripts/test-create-room.ts

async function testCreateRoom() {
  try {
    const apiUrl = 'http://localhost:3000/api/rooms';
    
    const newRoom = {
      roomNumber: 'A101',
      roomTypeId: 1,
      status: 'AVAILABLE',
      notes: 'Test room created via API'
    };

    console.log('Testing room creation...');
    console.log('Sending:', newRoom);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newRoom),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${error.error}`);
    }

    const result = await response.json();
    console.log('Success! Created room:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

testCreateRoom();
