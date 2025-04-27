# Users Module Testing Guide

## Overview
This document provides comprehensive testing instructions for the Users Module in the Hotel Management System.

## Pre-Test Setup
1. Ensure JSON Server is running on port 3001
2. Ensure Next.js development server is running on port 3000
3. Clear browser cache and local storage
4. Have test credentials ready: admin@hotel.com / password

## Test Scenarios

### 1. Authentication Tests
- [ ] Login with valid credentials
- [ ] Login with invalid credentials - verify error message
- [ ] Verify logout functionality
- [ ] Check session persistence after page refresh
- [ ] Verify redirect to login when not authenticated

### 2. User List Page Tests
- [ ] View all users in table format
- [ ] Verify date formatting (no errors)
- [ ] Test search functionality by username, email
- [ ] Test advanced search filters (by role, status)
- [ ] Verify role badges display correctly
- [ ] Test action buttons (view, edit, delete)

### 3. Create User Tests
- [ ] Access create user page
- [ ] Test form validation for required fields
- [ ] Test email format validation
- [ ] Test username validation (min length, format)
- [ ] Test password validation (min length)
- [ ] Test role assignment (at least one required)
- [ ] Verify success notification on creation
- [ ] Verify redirect to user list after creation

### 4. Edit User Tests
- [ ] Access edit user page
- [ ] Verify form pre-fills with user data
- [ ] Test updating user information
- [ ] Test role management (add/remove roles)
- [ ] Verify success notification on update
- [ ] Verify changes persist after save

### 5. User Details Page Tests
- [ ] View comprehensive user information
- [ ] Verify date formatting for created date and last login
- [ ] Test change password dialog
- [ ] Test role management dialog
- [ ] Verify back navigation works
- [ ] Test delete functionality (soft delete)

### 6. Error Handling Tests
- [ ] Test with invalid date values
- [ ] Test network error scenarios
- [ ] Verify error notifications appear
- [ ] Test form validation errors display correctly
- [ ] Verify error boundaries catch runtime errors

### 7. UI/UX Tests
- [ ] Verify loading states during API calls
- [ ] Test responsive design on different screens
- [ ] Verify proper button states (disabled during loading)
- [ ] Test keyboard navigation
- [ ] Check color contrast and accessibility

### 8. Data Integrity Tests
- [ ] Verify soft delete doesn't remove data
- [ ] Test concurrent updates (multiple tabs)
- [ ] Verify data persists after browser refresh
- [ ] Check data validation on backend

## Common Issues Fixed

1. **Date Formatting Errors**
   - Fixed invalid date handling with proper validation
   - Created utility functions for consistent date formatting
   - Added date validation checks before formatting

2. **Form Validation**
   - Implemented comprehensive validation rules
   - Added clear error messages for each field
   - Proper validation feedback on form submission

3. **Error Handling**
   - Added try-catch blocks in all API calls
   - Improved error messages for better UX
   - Added error boundaries for runtime errors

4. **Loading States**
   - Added loading spinners for all async operations
   - Proper button states during loading
   - Loading indicators for page loads

5. **API Error Handling**
   - Improved error interceptors
   - Better error message extraction
   - Proper 401 unauthorized handling

## Testing Commands

```bash
# Make the test script executable
chmod +x test-users-module.sh

# Run the test script
./test-users-module.sh

# Run both servers
npm run dev:all

# Or run servers separately
npm run mock-server  # Terminal 1
npm run dev         # Terminal 2
```

## Test Data

### User Types
1. Admin User
   - Email: admin@hotel.com
   - Password: password
   - Roles: ADMIN

2. Regular User
   - Email: receptionist@hotel.com
   - Password: password
   - Roles: RECEPTIONIST

## Post-Test Validation

1. Check browser console for any errors
2. Verify all form submissions work correctly
3. Ensure notifications appear for all actions
4. Confirm data persistence across sessions
5. Validate proper error handling

## Troubleshooting

If you encounter issues:
1. Clear browser cache and local storage
2. Restart both servers
3. Check console for specific error messages
4. Ensure db.json has correct user data
5. Verify network requests in browser DevTools

## Sign-off Checklist

- [ ] All test scenarios completed
- [ ] No console errors observed
- [ ] All CRUD operations working
- [ ] Validation functioning correctly
- [ ] Error handling tested
- [ ] UI/UX meets requirements
- [ ] Performance acceptable
- [ ] Module ready for production
