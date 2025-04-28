// migrate-db.js
const fs = require('fs');
const path = require('path');

// Read the existing db.json file
const dbPath = path.join(__dirname, 'db.json');
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Create a backup of the original file
fs.writeFileSync(`${dbPath}.backup`, JSON.stringify(dbData, null, 2));

// Map of custom ID fields to standard 'id' field
const idMappings = {
  rooms: { from: 'roomId', to: 'id' },
  roomTypes: { from: 'roomTypeId', to: 'id' },
  bookings: { from: 'bookingId', to: 'id' },
  bookingChannels: { from: 'channelId', to: 'id' },
  payments: { from: 'paymentId', to: 'id' },
  paymentMethods: { from: 'paymentMethodId', to: 'id' }
};

// Transform collections that use custom ID fields
Object.keys(idMappings).forEach(collection => {
  if (dbData[collection]) {
    console.log(`Transforming collection: ${collection}`);
    
    // Add standard 'id' field to each record
    dbData[collection] = dbData[collection].map(item => {
      const { from, to } = idMappings[collection];
      // Copy the custom ID value to the standard 'id' field
      if (item[from] !== undefined) {
        return {
          ...item,
          [to]: item[from]
        };
      }
      return item;
    });
  }
});

// Write the transformed data back to db.json
fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));

console.log('Database migration completed. Original data backed up to db.json.backup');
