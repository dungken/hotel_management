import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.json');

interface Notification {
  id: number;
  customerId: number;
  type: 'EMAIL' | 'SMS';
  purpose: 'BOOKING_CONFIRMATION' | 'PROMOTION' | 'REMINDER' | 'FEEDBACK_REQUEST';
  subject: string;
  content: string;
  status: 'PENDING' | 'SENT' | 'FAILED';
  sentDate?: string;
  scheduledDate?: string;
  error?: string;
}

// Helper function to read the database
async function readDb() {
  const data = await fs.readFile(dbPath, 'utf8');
  return JSON.parse(data);
}

// Helper function to write to the database
async function writeDb(data: any) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}

// GET /api/customerNotifications - Get all notifications with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const customerId = searchParams.get('customerId');
    const type = searchParams.get('type');
    const purpose = searchParams.get('purpose');
    const status = searchParams.get('status');

    const db = await readDb();
    let notifications = db.notifications || [];

    // Apply filters
    if (customerId) {
      notifications = notifications.filter((n: Notification) => n.customerId === parseInt(customerId));
    }
    if (type) {
      notifications = notifications.filter((n: Notification) => n.type === type);
    }
    if (purpose) {
      notifications = notifications.filter((n: Notification) => n.purpose === purpose);
    }
    if (status) {
      notifications = notifications.filter((n: Notification) => n.status === status);
    }

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// POST /api/customerNotifications - Create new notification
export async function POST(request: NextRequest) {
  try {
    const notificationData = await request.json();
    const db = await readDb();
    
    // Validate required fields
    if (!notificationData.customerId || !notificationData.type || 
        !notificationData.purpose || !notificationData.subject || 
        !notificationData.content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Initialize notifications array if it doesn't exist
    if (!db.notifications) {
      db.notifications = [];
    }

    // Generate new ID
    const newId = db.notifications.length > 0 
      ? Math.max(...db.notifications.map((n: Notification) => n.id)) + 1 
      : 1;

    // Create new notification
    const newNotification: Notification = {
      id: newId,
      customerId: notificationData.customerId,
      type: notificationData.type,
      purpose: notificationData.purpose,
      subject: notificationData.subject,
      content: notificationData.content,
      status: 'PENDING',
      scheduledDate: notificationData.scheduledDate
    };

    db.notifications.push(newNotification);
    await writeDb(db);

    // In a real application, you would send the email/SMS here
    // For now, we'll just simulate sending by setting status to SENT
    const notificationIndex = db.notifications.findIndex((n: Notification) => n.id === newId);
    if (notificationIndex !== -1) {
      db.notifications[notificationIndex].status = 'SENT';
      db.notifications[notificationIndex].sentDate = new Date().toISOString();
      await writeDb(db);
    }

    return NextResponse.json(db.notifications[notificationIndex], { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}
