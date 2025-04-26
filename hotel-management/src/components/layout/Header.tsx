import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BellIcon, UserCircleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { User } from '../../types';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="/hotel-logo.png"
                alt="Hotel Logo"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/32';
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    className="p-2 rounded-full hover:bg-gray-100 relative"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <BellIcon className="h-6 w-6 text-gray-500" />
                    <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 z-50 border">
                      <div className="px-4 py-2 border-b">
                        <h3 className="text-sm font-semibold">Thông báo</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        <div className="px-4 py-3 hover:bg-gray-50">
                          <p className="text-sm text-gray-600">Có đơn đặt phòng mới #123</p>
                          <p className="text-xs text-gray-400">2 phút trước</p>
                        </div>
                        <div className="px-4 py-3 hover:bg-gray-50">
                          <p className="text-sm text-gray-600">Thanh toán thành công #456</p>
                          <p className="text-xs text-gray-400">1 giờ trước</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile */}
                <div className="relative">
                  <button
                    className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                  >
                    <UserCircleIcon className="h-8 w-8 text-gray-500" />
                    <div className="text-left hidden sm:block">
                      <p className="text-sm font-medium text-gray-700">{user?.username}</p>
                      <p className="text-xs text-gray-500">{user?.role || 'User'}</p>
                    </div>
                    <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        Thông tin cá nhân
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        Cài đặt
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 