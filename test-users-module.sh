#!/bin/bash

echo "=== Testing Users Module ==="

# Check if servers are running
echo "Checking servers..."
curl -s http://localhost:3001/users > /dev/null && echo "✓ JSON Server is running" || echo "✗ JSON Server is not running"
curl -s http://localhost:3000 > /dev/null && echo "✓ Next.js is running" || echo "✗ Next.js is not running"

echo -e "\nNavigation Test URLs:"
echo "1. Login Page: http://localhost:3000/login"
echo "2. Users List: http://localhost:3000/users"
echo "3. Create User: http://localhost:3000/users/create"
echo "4. Edit User: http://localhost:3000/users/1/edit"
echo "5. User Details: http://localhost:3000/users/1"

echo -e "\nTest Checklist:"
echo "[ ] Login with admin@hotel.com / password"
echo "[ ] View users list with proper date formatting"
echo "[ ] Test user search functionality"
echo "[ ] Create new user with validation"
echo "[ ] Edit existing user"
echo "[ ] Delete user (soft delete)"
echo "[ ] Change password functionality"
echo "[ ] Role management"
echo "[ ] Verify error handling for invalid inputs"
echo "[ ] Check loading states"
echo "[ ] Test logout functionality"

echo -e "\nCommon Issues to Check:"
echo "1. Date formatting should work without errors"
echo "2. All form validations should display proper messages"
echo "3. Notifications (toasts) should appear for success/error"
echo "4. Navigation should work between all pages"
echo "5. Data should persist after page refresh"

echo -e "\nTo run full test suite:"
echo "1. Clear browser cache"
echo "2. Restart both servers"
echo "3. Follow test checklist above"
echo "4. Check browser console for any errors"
