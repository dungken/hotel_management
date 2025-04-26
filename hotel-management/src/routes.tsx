import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { isAuthenticated } from './utils/auth.utils';
import Layout from './components/layout/Layout';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Main pages
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import CreateRoom from './pages/CreateRoom';
import EditRoom from './pages/EditRoom';
import Customers from './pages/Customers';
import CreateCustomer from './pages/CreateCustomer';
import EditCustomer from './pages/EditCustomer';
import Bookings from './pages/Bookings';
import Payments from './pages/Payments';
import NotFoundPage from './pages/NotFoundPage';
import CreateBooking from './pages/CreateBooking';
import EditBooking from './pages/EditBooking';
import CreatePayment from './pages/CreatePayment';
import EditPayment from './pages/EditPayment';
import Login from './pages/Login';

const ProtectedRoute = () => {
  // TODO: Add authentication check
  const isAuthenticated = true;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout><Outlet /></Layout>,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: 'rooms',
            children: [
              { index: true, element: <Rooms /> },
              { path: 'create', element: <CreateRoom /> },
              { path: 'edit/:id', element: <EditRoom /> },
            ],
          },
          {
            path: 'bookings',
            children: [
              { index: true, element: <Bookings /> },
              { path: 'create', element: <CreateBooking /> },
              { path: 'edit/:id', element: <EditBooking /> },
            ],
          },
          {
            path: 'customers',
            children: [
              { index: true, element: <Customers /> },
              { path: 'create', element: <CreateCustomer /> },
              { path: 'edit/:id', element: <EditCustomer /> },
            ],
          },
          {
            path: 'payments',
            children: [
              { index: true, element: <Payments /> },
              { path: 'create', element: <CreatePayment /> },
              { path: 'edit/:id', element: <EditPayment /> },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
]);

export default router;
