export const API_BASE_URL = "http://localhost:3001";

export const ROLES = [
  { value: "ADMIN", label: "Admin" },
  { value: "MANAGER", label: "Manager" },
  { value: "RECEPTIONIST", label: "Receptionist" },
  { value: "STAFF", label: "Staff" },
  { value: "ACCOUNTANT", label: "Accountant" },
  { value: "HOUSEKEEPER", label: "Housekeeper" },
  { value: "CHEF", label: "Chef" },
  { value: "SECURITY", label: "Security" },
  { value: "MAINTENANCE", label: "Maintenance" },
] as const;

export const ROOM_STATUS = {
  AVAILABLE: 'AVAILABLE',
  OCCUPIED: 'OCCUPIED',
  MAINTENANCE: 'MAINTENANCE',
  CLEANING: 'CLEANING',
} as const;

export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD: '/dashboard',
  USERS: '/users',
  CUSTOMERS: '/customers',
  ROOMS: '/rooms',
  BOOKINGS: '/bookings',
  PAYMENTS: '/payments',
  BOOKING_CHANNELS: '/booking-channels',
  SETTINGS: '/settings',
} as const;

export const AUTH_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
} as const;

export const DEFAULT_PASSWORD = 'password';
