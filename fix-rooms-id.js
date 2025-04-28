// fix-rooms-id.js
const fs = require('fs');
const path = require('path');

// Read the existing db.json file
const dbPath = path.join(__dirname, 'db.json');
const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Create a backup of the original file
fs.writeFileSync(`${dbPath}.backup`, JSON.stringify(dbData, null, 2));

// Fix just the rooms collection
if (dbData.rooms) {
  console.log('Adding standard id field to rooms collection...');
  
  // Add standard 'id' field to each room record
  dbData.rooms = dbData.rooms.map(room => {
    // If room doesn't have an id field, add it with the same value as roomId
    if (room.id === undefined) {
      return {
        ...room,
        id: room.roomId
      };
    }
    return room;
  });
}

// Write the transformed data back to db.json
fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));

console.log('Room ID fix completed. Original data backed up to db.json.backup');
