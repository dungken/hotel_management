import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    routes: {
      login: '/login',
      dashboard: '/dashboard',
      users: '/users',
      customers: '/customers'
    },
    environment: process.env.NODE_ENV,
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
  });
}
