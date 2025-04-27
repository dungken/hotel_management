import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Customer, UpdateCustomerDto } from '@/types/customers';

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

// GET /api/customers/:id - Get a single customer by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const db = await readDb();
    const customer = db.customers.find((c: Customer) => c.id === id);

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer' },
      { status: 500 }
    );
  }
}

// PUT /api/customers/:id - Update entire customer record
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const updateData: UpdateCustomerDto = await request.json();
    const db = await readDb();
    const customerIndex = db.customers.findIndex((c: Customer) => c.id === id);

    if (customerIndex === -1) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Check for unique constraints (excluding current customer)
    if (updateData.email) {
      const emailExists = db.customers.some((c: Customer) => 
        c.email === updateData.email && c.id !== id
      );
      if (emailExists) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        );
      }
    }

    if (updateData.phone) {
      const phoneExists = db.customers.some((c: Customer) => 
        c.phone === updateData.phone && c.id !== id
      );
      if (phoneExists) {
        return NextResponse.json(
          { error: 'Phone number already exists' },
          { status: 400 }
        );
      }
    }

    if (updateData.idNumber) {
      const idNumberExists = db.customers.some((c: Customer) => 
        c.idNumber === updateData.idNumber && c.id !== id
      );
      if (idNumberExists) {
        return NextResponse.json(
          { error: 'ID number already exists' },
          { status: 400 }
        );
      }
    }

    // Update customer
    db.customers[customerIndex] = {
      ...db.customers[customerIndex],
      ...updateData
    };

    await writeDb(db);
    return NextResponse.json(db.customers[customerIndex]);
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}

// PATCH /api/customers/:id - Partial update of customer record
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const updateData: Partial<UpdateCustomerDto> = await request.json();
    const db = await readDb();
    const customerIndex = db.customers.findIndex((c: Customer) => c.id === id);

    if (customerIndex === -1) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Check for unique constraints (excluding current customer)
    if (updateData.email) {
      const emailExists = db.customers.some((c: Customer) => 
        c.email === updateData.email && c.id !== id
      );
      if (emailExists) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        );
      }
    }

    if (updateData.phone) {
      const phoneExists = db.customers.some((c: Customer) => 
        c.phone === updateData.phone && c.id !== id
      );
      if (phoneExists) {
        return NextResponse.json(
          { error: 'Phone number already exists' },
          { status: 400 }
        );
      }
    }

    if (updateData.idNumber) {
      const idNumberExists = db.customers.some((c: Customer) => 
        c.idNumber === updateData.idNumber && c.id !== id
      );
      if (idNumberExists) {
        return NextResponse.json(
          { error: 'ID number already exists' },
          { status: 400 }
        );
      }
    }

    // Update customer fields
    db.customers[customerIndex] = {
      ...db.customers[customerIndex],
      ...updateData
    };

    await writeDb(db);
    return NextResponse.json(db.customers[customerIndex]);
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}

// DELETE /api/customers/:id - Soft delete customer (set status to INACTIVE)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const db = await readDb();
    const customerIndex = db.customers.findIndex((c: Customer) => c.id === id);

    if (customerIndex === -1) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Soft delete by setting status to INACTIVE
    db.customers[customerIndex].status = 'INACTIVE';

    await writeDb(db);
    return NextResponse.json(db.customers[customerIndex]);
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}
