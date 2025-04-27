import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Hotel Management System</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/dashboard" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">Dashboard</h2>
            <p className="text-gray-600">View system overview and statistics</p>
          </Link>

          <Link href="/users" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">Users</h2>
            <p className="text-gray-600">Manage system users and permissions</p>
          </Link>

          <Link href="/customers" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">Customers</h2>
            <p className="text-gray-600">Manage customer information</p>
          </Link>

          <Link href="/rooms" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">Rooms</h2>
            <p className="text-gray-600">Manage rooms and room types</p>
          </Link>

          <Link href="/bookings" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">Bookings</h2>
            <p className="text-gray-600">Manage room bookings</p>
          </Link>

          <Link href="/payments" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-2">Payments</h2>
            <p className="text-gray-600">View payment transactions</p>
          </Link>
        </div>
      </div>
    </main>
  );
} 