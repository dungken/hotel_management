# Create Room Feature

This feature allows users to create new rooms in the hotel management system.

## API Endpoint

### Create Room
- **Method**: POST
- **URL**: `/api/rooms`
- **Body**:
  ```json
  {
    "roomNumber": "A101",
    "roomTypeId": 1,
    "status": "AVAILABLE",
    "notes": "Optional notes about the room"
  }
  ```
- **Response**: Returns the created room object with a generated `roomId`

## Components

### CreateRoomForm (`/src/components/rooms/CreateRoomForm.tsx`)
A reusable form component for creating rooms. Features:
- Room number input
- Room type selection (fetched from API)
- Status selection (dropdown with predefined options)
- Optional notes field
- Form validation
- Error handling

### Pages

1. **Create Room Page** (`/src/app/rooms/create/page.tsx`)
   - Full page for creating a new room
   - Uses the CreateRoomForm component
   - Handles navigation after successful creation

2. **Rooms List Page** (`/src/app/rooms/page.tsx`)
   - Lists all rooms
   - Shows room number, type, status, and notes
   - Includes a "Create Room" button that links to the create page

## Data Storage
- Rooms are stored in `/data/rooms.json`
- Each room has:
  - `roomId`: Auto-generated unique identifier
  - `roomNumber`: String (e.g., "A101", "202")
  - `roomTypeId`: Number referencing room type
  - `status`: Enum of AVAILABLE, OCCUPIED, MAINTENANCE, CLEANING, INACTIVE
  - `notes`: Optional string for additional information

## Testing
- Test script available at `/src/scripts/test-create-room.ts`
- Run with: `ts-node src/scripts/test-create-room.ts`

## Usage
1. Navigate to `/rooms` to see the list of rooms
2. Click "Create Room" button
3. Fill in the form with room details
4. Click "Create Room" to submit
5. You'll be redirected back to the rooms list upon success
