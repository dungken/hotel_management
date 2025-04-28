# Room Availability API Documentation

This document provides information about the Room Availability API endpoint.

## Check Room Availability

Retrieves a list of available rooms for a specific date range.

### HTTP Method
- **HTTP Method:** GET
- **Path:** `/rooms?status=AVAILABLE&checkIn=date&checkOut=date`
- **Description:** Returns a list of rooms that are available for booking during the specified date range.
- **Authentication:** Not required (for testing purposes)

### Request Parameters
All parameters are provided as query parameters:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| status | string | Yes | Must be set to "AVAILABLE" |
| checkIn | string | Yes | Check-in date in ISO format (YYYY-MM-DD or full ISO date) |
| checkOut | string | Yes | Check-out date in ISO format (YYYY-MM-DD or full ISO date) |

### Example Request
```http
GET /rooms?status=AVAILABLE&checkIn=2025-05-01&checkOut=2025-05-05
```

### Success Response (200 OK)
Returns an array of available room objects:

```json
[
  {
    "roomId": 3,
    "roomNumber": "103",
    "roomTypeId": 1,
    "status": "AVAILABLE",
    "notes": "Sea view, balcony",
    "id": 3
  },
  {
    "roomId": 6,
    "roomNumber": "302",
    "roomTypeId": 3,
    "status": "AVAILABLE",
    "notes": "Executive suite, with kitchenette",
    "id": 6
  }
]
```

### Error Responses
- **400 Bad Request**: `{ "error": "Invalid date format" }` - The provided dates are invalid

### Important Notes
1. The endpoint checks for:
   - Rooms with status "AVAILABLE"
   - Rooms that are not already booked for the requested dates
   - Only active bookings (excluding CANCELLED or COMPLETED bookings)

2. The date ranges are inclusive, meaning that rooms booked on the exact check-in or check-out date will be considered unavailable.

3. To use this endpoint in the frontend service, use the `roomsService.checkAvailability(checkInDate, checkOutDate)` method.

### Usage Example (Frontend)
```typescript
import { roomsService } from '@/services/rooms.service';

// Example function to find available rooms
async function findAvailableRooms() {
  try {
    const checkInDate = '2025-05-01';
    const checkOutDate = '2025-05-05';
    
    const availableRooms = await roomsService.checkAvailability(checkInDate, checkOutDate);
    console.log('Available rooms:', availableRooms);
    
    return availableRooms;
  } catch (error) {
    console.error('Error finding available rooms:', error);
    throw error;
  }
}
```

### Testing
You can test this endpoint using the provided test script:
```bash
node test-room-availability.js
```
