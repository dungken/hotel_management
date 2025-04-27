import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Customer } from '@/types/customers';

const dbPath = path.join(process.cwd(), 'db.json');

// Helper function to read the database
async function readDb() {
  const data = await fs.readFile(dbPath, 'utf8');
  return JSON.parse(data);
}

// GET /api/customers/export - Export customers to CSV
export async function GET(request: NextRequest) {
  try {
    const db = await readDb();
    const customers = db.customers || [];
    
    // Define CSV headers
    const headers = [
      'id',
      'name',
      'email',
      'phone',
      'address',
      'nationality',
      'idType',
      'idNumber',
      'dateOfBirth',
      'customerType',
      'registrationDate',
      'loyaltyPoints',
      'status'
    ];

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...customers.map((customer: Customer) => {
        return headers.map(header => {
          const value = customer[header as keyof Customer];
          // Handle special cases: quote fields that might contain commas
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value !== undefined ? value : '';
        }).join(',');
      })
    ].join('\n');

    // Create response with CSV content
    const response = new NextResponse(csvContent);
    
    // Set headers for file download
    response.headers.set('Content-Type', 'text/csv');
    response.headers.set('Content-Disposition', `attachment; filename=customers_export_${new Date().toISOString().split('T')[0]}.csv`);
    
    return response;
  } catch (error) {
    console.error('Error exporting customers:', error);
    return NextResponse.json(
      { error: 'Failed to export customers' },
      { status: 500 }
    );
  }
}
