// server-direct.js
// A direct approach server that doesn't rely on json-server's router for bookings

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Create Express server
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database file path
const DB_FILE_PATH = path.join(__dirname, 'db.json');

// Helper functions
function readDatabase() {
  const data = fs.readFileSync(DB_FILE_PATH, 'utf8');
  return JSON.parse(data);
}

function writeDatabase(data) {
  fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// Routes

// GET all bookings
app.get('/bookings', (req, res) => {
  try {
    const db = readDatabase();
    const bookings = db.bookings || [];
    
    // Handle filter parameters
    const { status, customerId, checkInDate_gte, checkOutDate_lte } = req.query;
    
    let filteredBookings = [...bookings];
    
    if (status) {
      filteredBookings = filteredBookings.filter(booking => booking.status === status);
    }
    
    if (customerId) {
      filteredBookings = filteredBookings.filter(booking => booking.customerId === parseInt(customerId));
    }
    
    if (checkInDate_gte) {
      filteredBookings = filteredBookings.filter(booking => 
        new Date(booking.checkInDate) >= new Date(checkInDate_gte)
      );
    }
    
    if (checkOutDate_lte) {
      filteredBookings = filteredBookings.filter(booking => 
        new Date(booking.checkOutDate) <= new Date(checkOutDate_lte)
      );
    }
    
    res.json(filteredBookings);
  } catch (error) {
    console.error('Error getting bookings:', error);
    res.status(500).json({ error: 'Failed to get bookings', details: error.message });
  }
});

// GET a single booking
app.get('/bookings/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const db = readDatabase();
    const booking = db.bookings.find(b => b.bookingId === id || b.id === id);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    console.error('Error getting booking:', error);
    res.status(500).json({ error: 'Failed to get booking', details: error.message });
  }
});

// POST a new booking
app.post('/bookings', (req, res) => {
  try {
    const booking = req.body;
    
    // Validate required fields
    if (!booking.customerId || !booking.roomId || !booking.channelId || !booking.checkInDate || 
        !booking.checkOutDate || !booking.adults || booking.totalAmount === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Load database
    const db = readDatabase();
    
    // Generate a booking code if not provided
    booking.bookingCode = booking.bookingCode || `BK${Date.now().toString().slice(-8)}`;
    
    // Set default values for optional fields
    booking.status = booking.status || 'PENDING';
    booking.bookingDate = booking.bookingDate || new Date().toISOString().split('T')[0];
    booking.hasCancellationFee = booking.hasCancellationFee || false;
    booking.specialRequests = booking.specialRequests || '';
    booking.childAges = booking.childAges || '';
    booking.children = booking.children || 0;
    booking.extraBeds = booking.extraBeds || 0;
    booking.includesBreakfast = booking.includesBreakfast || false;
    booking.discountPercent = booking.discountPercent || 0;
    booking.cancellationReason = booking.cancellationReason || null;
    booking.discountReason = booking.discountReason || null;
    
    // Generate IDs
    const bookings = db.bookings || [];
    const maxBookingId = bookings.length > 0 ? 
      Math.max(...bookings.map(b => b.bookingId || 0)) : 0;
    
    booking.bookingId = maxBookingId + 1;
    booking.id = booking.bookingId; // For compatibility
    
    // Add booking to database
    db.bookings.push(booking);
    
    // Update room status to OCCUPIED
    const roomId = parseInt(booking.roomId);
    const roomToUpdate = db.rooms.find(r => r.roomId === roomId);
    
    if (roomToUpdate) {
      roomToUpdate.status = 'OCCUPIED';
    }
    
    // Save changes
    writeDatabase(db);
    
    // Return created booking
    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking', details: error.message });
  }
});

// PUT (update) a booking
app.put('/bookings/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const booking = req.body;
    
    // Make sure IDs are consistent
    booking.bookingId = id;
    booking.id = id;
    
    // Load database
    const db = readDatabase();
    
    // Find booking index
    const bookingIndex = db.bookings.findIndex(b => b.bookingId === id || b.id === id);
    
    if (bookingIndex === -1) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    // Update booking
    db.bookings[bookingIndex] = booking;
    
    // Save changes
    writeDatabase(db);
    
    // Return updated booking
    res.json(booking);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Failed to update booking', details: error.message });
  }
});

// DELETE a booking
app.delete('/bookings/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    // Load database
    const db = readDatabase();
    
    // Find booking index
    const bookingIndex = db.bookings.findIndex(b => b.bookingId === id || b.id === id);
    
    if (bookingIndex === -1) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    // Remove booking
    db.bookings.splice(bookingIndex, 1);
    
    // Save changes
    writeDatabase(db);
    
    // Return success
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Failed to delete booking', details: error.message });
  }
});

// PATCH (partial update) a booking
app.patch('/bookings/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates = req.body;
    
    // Load database
    const db = readDatabase();
    
    // Find booking
    const bookingIndex = db.bookings.findIndex(b => b.bookingId === id || b.id === id);
    
    if (bookingIndex === -1) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    // Update booking
    db.bookings[bookingIndex] = {
      ...db.bookings[bookingIndex],
      ...updates
    };
    
    // Save changes
    writeDatabase(db);
    
    // Return updated booking
    res.json(db.bookings[bookingIndex]);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Failed to update booking', details: error.message });
  }
});

// GET available rooms
app.get('/rooms', (req, res) => {
  try {
    const { status, checkIn, checkOut } = req.query;
    
    // If not querying for available rooms, return all rooms
    if (status !== 'AVAILABLE' || !checkIn || !checkOut) {
      const db = readDatabase();
      return res.json(db.rooms);
    }
    
    // Parse dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    // Validate dates
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }
    
    // Load database
    const db = readDatabase();
    
    // Filter unavailable rooms
    const unavailableRoomIds = db.bookings
      .filter(booking => {
        // Convert booking dates to Date objects
        const bookingCheckIn = new Date(booking.checkInDate);
        const bookingCheckOut = new Date(booking.checkOutDate);
        
        // Check if booking status is active
        const isActiveBooking = booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED';
        
        // Check for date overlap
        const hasDateOverlap = (
          (checkInDate < bookingCheckOut && checkOutDate > bookingCheckIn) ||
          (checkInDate.getTime() === bookingCheckIn.getTime()) ||
          (checkOutDate.getTime() === bookingCheckOut.getTime())
        );
        
        return isActiveBooking && hasDateOverlap;
      })
      .map(booking => booking.roomId);
    
    // Filter available rooms
    const availableRooms = db.rooms.filter(room => 
      room.status === 'AVAILABLE' && !unavailableRoomIds.includes(room.roomId)
    );
    
    res.json(availableRooms);
  } catch (error) {
    console.error('Error getting available rooms:', error);
    res.status(500).json({ error: 'Failed to get available rooms', details: error.message });
  }
});

// For all other routes, return 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Direct server is running on port ${PORT}`);
  console.log(`API is available at http://localhost:${PORT}`);
});
