import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUserFromStorage } from '../utils/auth.utils';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = getCurrentUserFromStorage();
    if (user) {
      setUserName(user.username);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome, {userName}!</h1>
        <p className="text-gray-600 mb-6">
          This is the hotel management system dashboard. Use the navigation to access different sections.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/rooms" className="card hover:bg-gray-50 transition-colors">
            <h2 className="text-xl font-semibold mb-2">Room Management</h2>
            <p className="text-gray-600">View and manage hotel rooms</p>
          </Link>

          <Link to="/booking" className="card hover:bg-gray-50 transition-colors">
            <h2 className="text-xl font-semibold mb-2">Booking</h2>
            <p className="text-gray-600">Create and manage bookings</p>
          </Link>

          <Link to="/customers" className="card hover:bg-gray-50 transition-colors">
            <h2 className="text-xl font-semibold mb-2">Customers</h2>
            <p className="text-gray-600">Manage customer information</p>
          </Link>

          <Link to="/payments" className="card hover:bg-gray-50 transition-colors">
            <h2 className="text-xl font-semibold mb-2">Payments</h2>
            <p className="text-gray-600">Process and view payments</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
