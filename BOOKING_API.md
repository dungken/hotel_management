# Booking API Documentation

This document provides information about the Booking API endpoints.

## Create Booking

Creates a new booking in the system.

### HTTP Method
- **HTTP Method:** POST
- **Path:** `/bookings`
- **Description:** Creates a new booking record and updates the room status to OCCUPIED.
- **Authentication:** Not required (for testing purposes)

### Request Body
The request body should be a JSON object with the following fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| customerId | number | Yes | ID of the customer making the booking |
| roomId | number | Yes | ID of the room being booked |
| channelId | number | Yes | ID of the booking channel |
| checkInDate | string | Yes | Check-in date in YYYY-MM-DD format |
| checkOutDate | string | Yes | Check-out date in YYYY-MM-DD format |
| adults | number | Yes | Number of adults |
| children | number | No | Number of children (defaults to 0) |
| childAges | string | No | Ages of children, comma-separated (e.g., "5,7,12") |
| totalAmount | number | Yes | Total booking amount |
| bookingDate | string | No | Date of booking (defaults to current date) |
| status | string | No | Booking status (defaults to "PENDING") |
| hasCancellationFee | boolean | No | Whether cancellation incurs a fee (defaults to false) |
| cancellationReason | string | No | Reason for cancellation (null if not cancelled) |
| specialRequests | string | No | Special requests for the booking |
| extraBeds | number | No | Number of extra beds (defaults to 0) |
| includesBreakfast | boolean | No | Whether breakfast is included (defaults to false) |
| discountPercent | number | No | Percentage discount applied (defaults to 0) |
| discountReason | string | No | Reason for discount (null if no discount) |
| staffId | number | No | ID of staff creating the booking (defaults to 1) |

### Example Request
```http
POST /bookings
Content-Type: application/json

{
  "customerId": 1,
  "roomId": 3,
  "channelId": 1,
  "checkInDate": "2025-05-01",
  "checkOutDate": "2025-05-05",
  "adults": 2,
  "children": 0,
  "totalAmount": 1000000,
  "specialRequests": "Late check-in",
  "includesBreakfast": true,
  "staffId": 1
}
```

### Success Response (201 Created)
Returns the created booking object with additional generated fields:

```json
{
  "customerId": 1,
  "roomId": 3,
  "channelId": 1,
  "checkInDate": "2025-05-01",
  "checkOutDate": "2025-05-05",
  "adults": 2,
  "children": 0,
  "childAges": "",
  "bookingDate": "2025-04-28",
  "status": "PENDING",
  "hasCancellationFee": false,
  "cancellationReason": null,
  "specialRequests": "Late check-in",
  "totalAmount": 1000000,
  "extraBeds": 0,
  "includesBreakfast": true,
  "discountPercent": 0,
  "discountReason": null,
  "staffId": 1,
  "bookingCode": "BK12345678",
  "bookingId": 3,
  "id": 3
}
```

### Error Responses
- **400 Bad Request**: `{ "error": "Missing required fields" }` - One or more required fields are missing
- **500 Internal Server Error**: `{ "error": "Failed to create booking" }` - Server error occurred during booking creation

### Additional Actions
When a booking is created:
1. A unique booking code is generated if not provided
2. The room status is automatically updated to "OCCUPIED"
3. Default values are set for optional fields

### Usage Example (Frontend)
```typescript
import { bookingsService } from '@/services/bookings.service';

// Example function to create a booking
async function createBooking() {
  try {
    const bookingData = {
      customerId: 1,
      roomId: 3,
      channelId: 1,
      checkInDate: "2025-05-01",
      checkOutDate: "2025-05-05",
      adults: 2,
      totalAmount: 1000000,
      // Other optional fields...
    };
    
    const createdBooking = await bookingsService.create(bookingData);
    console.log('Booking created:', createdBooking);
    
    return createdBooking;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}
```

### Testing
You can test this endpoint using the provided test script:
```bash
node test-create-booking.js
```
