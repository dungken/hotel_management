import { Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { isAuthenticated } from './utils/auth.utils';
import Layout from './components/layout/Layout';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Main pages
import RoomListPage from './pages/rooms/RoomListPage';
import BookingPage from './pages/booking/BookingPage';
import CustomerListPage from './pages/customers/CustomerListPage';
import PaymentListPage from './pages/payments/PaymentListPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const auth = isAuthenticated();
    setIsAuth(auth);
    setCheckingAuth(false);
  }, []);

  if (checkingAuth) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return isAuth ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<HomePage />} />
        <Route path="rooms" element={<RoomListPage />} />
        <Route path="booking" element={<BookingPage />} />
        <Route path="customers" element={<CustomerListPage />} />
        <Route path="payments" element={<PaymentListPage />} />
        <Route path="admin" element={<AdminDashboard />} />
      </Route>

      <Route path="/not-found" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/not-found" />} />
    </Routes>
  );
};

export default AppRoutes;
