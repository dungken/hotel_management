'use client';

import React, { useState } from 'react';
import { customersService } from '@/services/customers.service';

export const CustomerImportExport: React.FC = () => {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    imported: number;
    errors: string[];
  } | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportResult(null);

    try {
      const result = await customersService.bulkImport(file);
      setImportResult(result);
    } catch (error) {
      console.error('Error importing customers:', error);
      setImportResult({
        success: false,
        imported: 0,
        errors: ['Failed to import customers. Please check the file format.']
      });
    } finally {
      setImporting(false);
      // Reset the input
      event.target.value = '';
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await customersService.export();
    } catch (error) {
      console.error('Error exporting customers:', error);
      alert('Failed to export customers. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Import Customers
          </label>
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={importing}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                disabled:opacity-50"
            />
            {importing && <span className="text-sm text-gray-500">Importing...</span>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Export Customers
          </label>
          <button
            onClick={handleExport}
            disabled={exporting}
            className={`px-4 py-2 rounded-lg text-white ${
              exporting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {exporting ? 'Exporting...' : 'Export to CSV'}
          </button>
        </div>
      </div>

      {importResult && (
        <div className={`p-4 rounded-lg ${
          importResult.success ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <h3 className={`font-medium ${
            importResult.success ? 'text-green-800' : 'text-red-800'
          }`}>
            Import Result
          </h3>
          <p className="mt-1">
            Successfully imported: {importResult.imported} customers
          </p>
          {importResult.errors.length > 0 && (
            <div className="mt-2">
              <p className="font-medium text-red-800">Errors:</p>
              <ul className="list-disc pl-5 mt-1">
                {importResult.errors.map((error, index) => (
                  <li key={index} className="text-red-700">{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-900">CSV Format Guide</h3>
        <p className="mt-1 text-sm text-gray-600">
          Your CSV file should include the following columns:
        </p>
        <ul className="mt-2 text-sm text-gray-600 list-disc pl-5">
          <li>name (required)</li>
          <li>email (required, must be unique)</li>
          <li>phone (required, must be unique)</li>
          <li>address</li>
          <li>nationality</li>
          <li>idType</li>
          <li>idNumber</li>
          <li>dateOfBirth (YYYY-MM-DD format)</li>
          <li>customerType</li>
          <li>loyaltyPoints</li>
        </ul>
      </div>
    </div>
  );
};
