#!/bin/bash

# Start JSON Server in background
echo "Starting JSON Server on port 3001..."
json-server --watch db.json --port 3001 &
JSON_SERVER_PID=$!

# Wait a moment for JSON Server to start
sleep 2

# Start Next.js development server
echo "Starting Next.js development server..."
npm run dev

# When Next.js server is stopped, also stop JSON Server
trap "kill $JSON_SERVER_PID" EXIT
