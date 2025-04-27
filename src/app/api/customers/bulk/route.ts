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

// POST /api/customers/bulk - Bulk import customers from CSV
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Content type must be multipart/form-data' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const text = await file.text();
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    
    const db = await readDb();
    const existingCustomers = db.customers || [];
    const newCustomers: Customer[] = [];
    const errors: string[] = [];

    // Parse CSV and validate data
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(',').map(value => value.trim());
      const customerData: Record<string, string> = {};
      
      headers.forEach((header, index) => {
        customerData[header] = values[index] || '';
      });

      // Validate required fields
      if (!customerData.name || !customerData.email || !customerData.phone) {
        errors.push(`Line ${i + 1}: Missing required fields (name, email, or phone)`);
        continue;
      }

      // Check for duplicates
      const emailExists = existingCustomers.some((c: Customer) => c.email === customerData.email);
      const phoneExists = existingCustomers.some((c: Customer) => c.phone === customerData.phone);
      
      if (emailExists) {
        errors.push(`Line ${i + 1}: Email ${customerData.email} already exists`);
        continue;
      }
      
      if (phoneExists) {
        errors.push(`Line ${i + 1}: Phone ${customerData.phone} already exists`);
        continue;
      }

      // Generate new ID
      const newId = existingCustomers.length + newCustomers.length + 1;

      // Create new customer
      const newCustomer: Customer = {
        id: newId,
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address || '',
        nationality: customerData.nationality,
        idType: customerData.idType,
        idNumber: customerData.idNumber,
        dateOfBirth: customerData.dateOfBirth,
        customerType: customerData.customerType ? parseInt(customerData.customerType) : undefined,
        registrationDate: new Date().toISOString(),
        loyaltyPoints: customerData.loyaltyPoints ? parseInt(customerData.loyaltyPoints) : 0,
        status: 'ACTIVE'
      };

      newCustomers.push(newCustomer);
    }

    // Save to database if there are new customers
    if (newCustomers.length > 0) {
      db.customers = [...existingCustomers, ...newCustomers];
      await writeDb(db);
    }

    return NextResponse.json({
      success: true,
      imported: newCustomers.length,
      errors: errors
    });
  } catch (error) {
    console.error('Error importing customers:', error);
    return NextResponse.json(
      { error: 'Failed to import customers' },
      { status: 500 }
    );
  }
}
