export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Allow various phone formats, including international
  const phoneRegex = /^\+?[\d\s-()]{8,}$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password: string): boolean => {
  // At least 6 characters long
  return password.length >= 6;
};

export const validateUsername = (username: string): boolean => {
  // Username should be at least 3 characters and only contain alphanumeric characters
  const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
  return usernameRegex.test(username);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateDate = (date: string | Date): boolean => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return !isNaN(dateObj.getTime());
};

export const getErrorMessage = (field: string, value: any): string | null => {
  switch (field) {
    case 'email':
      return !validateEmail(value) ? 'Invalid email format' : null;
    case 'phone':
      return !validatePhone(value) ? 'Invalid phone number' : null;
    case 'password':
      return !validatePassword(value) ? 'Password must be at least 6 characters' : null;
    case 'username':
      return !validateUsername(value) ? 'Username must be at least 3 characters and contain only letters, numbers, and underscores' : null;
    default:
      return !validateRequired(value) ? `${field} is required` : null;
  }
};
