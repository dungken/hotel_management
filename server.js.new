// server.js
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.use(jsonServer.bodyParser);

// Custom route for creating bookings
server.post('/bookings', (req, res) => {
  const booking = req.body;
  
  // Validate required fields
  if (!booking.customerId || !booking.roomId || !booking.channelId || !booking.checkInDate || 
      !booking.checkOutDate || !booking.adults || booking.totalAmount === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
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
    
    // Get all bookings
    const bookings = router.db.get('bookings').value();
    
    // Calculate next bookingId
    const maxBookingId = bookings.length > 0 ? 
      Math.max(...bookings.map(b => b.bookingId || 0)) : 0;
    
    // Set IDs
    booking.bookingId = maxBookingId + 1;
    booking.id = booking.bookingId; // For JSON Server compatibility
    
    // Add booking to database manually
    router.db.get('bookings').push(booking).write();
    
    // Update room status
    const roomToUpdate = router.db.get('rooms').find({ roomId: parseInt(booking.roomId) }).value();
    if (roomToUpdate) {
      router.db.get('rooms')
        .find({ id: roomToUpdate.id })
        .assign({ status: 'OCCUPIED' })
        .write();
    }
    
    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking', details: error.message });
  }
});

// Custom route for updating bookings
server.put('/bookings/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const booking = req.body;
  
  try {
    // Make sure bookingId and id are consistent
    booking.bookingId = id;
    booking.id = id;
    
    // Update the booking
    router.db.get('bookings').find({ id }).assign(booking).write();
    
    res.json(booking);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Failed to update booking', details: error.message });
  }
});

// Custom route for checking room availability
server.get('/rooms', (req, res, next) => {
  const { status, checkIn, checkOut } = req.query;
  
  // If not querying for available rooms, continue with normal route handling
  if (status !== 'AVAILABLE' || !checkIn || !checkOut) {
    return next();
  }
  
  // Parse the dates
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
  // Validate dates
  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
    return res.status(400).json({ error: 'Invalid date format' });
  }
  
  // Get all rooms
  const rooms = router.db.get('rooms').value();
  
  // Get all bookings
  const bookings = router.db.get('bookings').value();
  
  // Filter out rooms that are not available
  const unavailableRoomIds = bookings.filter(booking => {
    // Convert booking dates to Date objects
    const bookingCheckIn = new Date(booking.checkInDate);
    const bookingCheckOut = new Date(booking.checkOutDate);
    
    // Check if booking status is active (not CANCELLED or COMPLETED)
    const isActiveBooking = booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED';
    
    // Check for date overlap
    const hasDateOverlap = (
      (checkInDate < bookingCheckOut && checkOutDate > bookingCheckIn) ||
      (checkInDate.getTime() === bookingCheckIn.getTime()) ||
      (checkOutDate.getTime() === bookingCheckOut.getTime())
    );
    
    return isActiveBooking && hasDateOverlap;
  }).map(booking => booking.roomId);
  
  // Filter available rooms
  const availableRooms = rooms.filter(room => {
    // Room must have AVAILABLE status and not be in unavailable rooms list
    return room.status === 'AVAILABLE' && !unavailableRoomIds.includes(room.roomId);
  });
  
  // Return the available rooms
  return res.json(availableRooms);
});

// Custom ID settings for different collections
router.db._.id = 'id'; // Default

// Simple mixin for id generation
router.db._.mixin({
  createId: function() {
    return Date.now();
  }
});

// Use default router for all other routes
server.use(router);

// Start server
const port = 3001;
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
