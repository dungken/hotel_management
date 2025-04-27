import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db.json');

interface Feedback {
  id: number;
  customerId: number;
  bookingId: number;
  rating: number;
  comment: string;
  feedbackDate: string;
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED';
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

// GET /api/customerFeedback - Get all feedback with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const customerId = searchParams.get('customerId');
    const bookingId = searchParams.get('bookingId');
    const status = searchParams.get('status');
    const rating = searchParams.get('rating');

    const db = await readDb();
    let feedback = db.feedback || [];

    // Apply filters
    if (customerId) {
      feedback = feedback.filter((f: Feedback) => f.customerId === parseInt(customerId));
    }
    if (bookingId) {
      feedback = feedback.filter((f: Feedback) => f.bookingId === parseInt(bookingId));
    }
    if (status) {
      feedback = feedback.filter((f: Feedback) => f.status === status);
    }
    if (rating) {
      feedback = feedback.filter((f: Feedback) => f.rating === parseInt(rating));
    }

    return NextResponse.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}

// POST /api/customerFeedback - Create new feedback
export async function POST(request: NextRequest) {
  try {
    const feedbackData = await request.json();
    const db = await readDb();
    
    // Validate required fields
    if (!feedbackData.customerId || !feedbackData.bookingId || !feedbackData.rating) {
      return NextResponse.json(
        { error: 'Missing required fields: customerId, bookingId, and rating are required' },
        { status: 400 }
      );
    }

    // Validate rating range
    if (feedbackData.rating < 1 || feedbackData.rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Initialize feedback array if it doesn't exist
    if (!db.feedback) {
      db.feedback = [];
    }

    // Generate new ID
    const newId = db.feedback.length > 0 
      ? Math.max(...db.feedback.map((f: Feedback) => f.id)) + 1 
      : 1;

    // Create new feedback
    const newFeedback: Feedback = {
      id: newId,
      customerId: feedbackData.customerId,
      bookingId: feedbackData.bookingId,
      rating: feedbackData.rating,
      comment: feedbackData.comment || '',
      feedbackDate: new Date().toISOString(),
      status: 'PENDING'
    };

    db.feedback.push(newFeedback);
    await writeDb(db);

    return NextResponse.json(newFeedback, { status: 201 });
  } catch (error) {
    console.error('Error creating feedback:', error);
    return NextResponse.json(
      { error: 'Failed to create feedback' },
      { status: 500 }
    );
  }
}
