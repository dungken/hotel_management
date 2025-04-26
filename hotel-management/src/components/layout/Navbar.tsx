import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearAuth, getCurrentUserFromStorage } from '../../utils/auth.utils';

const Navbar = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUserFromStorage();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary">
                Hotel Management
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <span className="mr-4 text-gray-700">
              {currentUser?.username || 'User'}
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
