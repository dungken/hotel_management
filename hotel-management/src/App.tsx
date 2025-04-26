import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

// Pages
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import CreateRoom from './pages/CreateRoom';
import EditRoom from './pages/EditRoom';
import Bookings from './pages/Bookings';
import CreateBooking from './pages/CreateBooking';
import EditBooking from './pages/EditBooking';
import BookingDetail from './pages/BookingDetail';
import Customers from './pages/Customers';
import CreateCustomer from './pages/CreateCustomer';
import EditCustomer from './pages/EditCustomer';
import Payments from './pages/Payments';
import CreatePayment from './pages/CreatePayment';
import EditPayment from './pages/EditPayment';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

const ProtectedRoutes = () => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <Routes>
        <Route index element={<Dashboard />} />
        
        {/* Rooms */}
        <Route path="rooms" element={<Rooms />} />
        <Route path="rooms/create" element={<CreateRoom />} />
        <Route path="rooms/edit/:id" element={<EditRoom />} />
        
        {/* Bookings */}
        <Route path="bookings" element={<Bookings />} />
        <Route path="bookings/create" element={<CreateBooking />} />
        <Route path="bookings/edit/:id" element={<EditBooking />} />
        <Route path="bookings/:id" element={<BookingDetail />} />
        
        {/* Customers */}
        <Route path="customers" element={<Customers />} />
        <Route path="customers/create" element={<CreateCustomer />} />
        <Route path="customers/edit/:id" element={<EditCustomer />} />
        
        {/* Payments */}
        <Route path="payments" element={<Payments />} />
        <Route path="payments/create" element={<CreatePayment />} />
        <Route path="payments/edit/:id" element={<EditPayment />} />
        
        {/* User */}
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/*" element={<ProtectedRoutes />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
