"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DebugPage() {
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [serverStatus, setServerStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check API health
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setServerStatus(data))
      .catch(err => setError('Server Health Check Failed: ' + err.message));

    // Check JSON Server
    fetch('http://localhost:3001/users')
      .then(res => res.json())
      .then(data => setApiStatus({ connected: true, userCount: data.length }))
      .catch(err => setApiStatus({ connected: false, error: err.message }));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">System Debug Information</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Next.js Server Status</CardTitle>
          </CardHeader>
          <CardContent>
            {serverStatus ? (
              <pre className="bg-gray-100 p-4 rounded">
                {JSON.stringify(serverStatus, null, 2)}
              </pre>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <div>Checking server status...</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>JSON Server Status</CardTitle>
          </CardHeader>
          <CardContent>
            {apiStatus ? (
              <pre className="bg-gray-100 p-4 rounded">
                {JSON.stringify(apiStatus, null, 2)}
              </pre>
            ) : (
              <div>Checking API status...</div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Test Links:</h3>
                <ul className="space-y-2">
                  <li><a href="/login" className="text-blue-500 hover:underline">/login</a></li>
                  <li><a href="/dashboard" className="text-blue-500 hover:underline">/dashboard</a></li>
                  <li><a href="/users" className="text-blue-500 hover:underline">/users</a></li>
                  <li><a href="/customers" className="text-blue-500 hover:underline">/customers</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Environment:</h3>
                <ul className="space-y-2">
                  <li>Node Environment: {process.env.NODE_ENV}</li>
                  <li>API URL: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}</li>
                  <li>Current URL: {typeof window !== 'undefined' ? window.location.href : 'Server Side'}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
