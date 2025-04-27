import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Customer, CreateCustomerDto } from '@/types/customers';

const dbPath = path.join(process.cwd(), 'db.json');

// Helper function to read the database
async function readDb() {
  const data = await fs.readFile(dbPath, 'utf8');
  return JSON.parse(data);
}

// Helper function to write to the database
async function writeDb(data: any) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}

// GET /api/customers - Get all customers with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');
    const idNumber = searchParams.get('idNumber');
    const q = searchParams.get('q'); // Search query
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const db = await readDb();
    let customers = db.customers || [];

    // Apply filters
    if (name) {
      customers = customers.filter((customer: Customer) => 
        customer.name.toLowerCase().includes(name.toLowerCase())
      );
    }
    if (email) {
      customers = customers.filter((customer: Customer) => 
        customer.email.toLowerCase().includes(email.toLowerCase())
      );
    }
    if (phone) {
      customers = customers.filter((customer: Customer) => 
        customer.phone.includes(phone)
      );
    }
    if (idNumber) {
      customers = customers.filter((customer: Customer) => 
        customer.idNumber?.includes(idNumber)
      );
    }
    
    // Apply search
    if (q) {
      const query = q.toLowerCase();
      customers = customers.filter((customer: Customer) => 
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone.includes(query) ||
        customer.idNumber?.includes(query)
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCustomers = customers.slice(startIndex, endIndex);

    return NextResponse.json({
      data: paginatedCustomers,
      total: customers.length,
      page,
      limit,
      totalPages: Math.ceil(customers.length / limit)
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

// POST /api/customers - Create a new customer
export async function POST(request: NextRequest) {
  try {
    const customerData: CreateCustomerDto = await request.json();
    const db = await readDb();
    
    // Check for unique constraints
    const emailExists = db.customers.some((c: Customer) => c.email === customerData.email);
    const phoneExists = db.customers.some((c: Customer) => c.phone === customerData.phone);
    const idNumberExists = customerData.idNumber && 
      db.customers.some((c: Customer) => c.idNumber === customerData.idNumber);

    if (emailExists) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }
    if (phoneExists) {
      return NextResponse.json(
        { error: 'Phone number already exists' },
        { status: 400 }
      );
    }
    if (idNumberExists) {
      return NextResponse.json(
        { error: 'ID number already exists' },
        { status: 400 }
      );
    }

    // Generate new ID
    const newId = db.customers.length > 0 
      ? Math.max(...db.customers.map((c: Customer) => c.id)) + 1 
      : 1;

    // Create new customer
    const newCustomer: Customer = {
      id: newId,
      ...customerData,
      registrationDate: new Date().toISOString(),
      status: 'ACTIVE',
      loyaltyPoints: customerData.loyaltyPoints || 0
    };

    db.customers.push(newCustomer);
    await writeDb(db);

    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}
