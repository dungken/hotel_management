# Hotel Management System - Test Checklist

## Pre-test Setup
- [ ] JSON Server is running on port 3001
- [ ] Next.js development server is running
- [ ] Browser is open at http://localhost:3000

## Authentication Testing
### Login Functionality
- [ ] Test login with admin@hotel.com / password
- [ ] Test login with incorrect credentials
- [ ] Verify error messages display correctly
- [ ] Test logout functionality

## Navigation Testing
- [ ] Verify sidebar navigation is visible after login
- [ ] Test all navigation links work correctly
- [ ] Test mobile responsive navigation (hamburger menu)
- [ ] Verify active route highlighting

## Users Module Testing
### User List Page
- [ ] View all users in table format
- [ ] Test search functionality (by name/email)
- [ ] Test advanced search filters (role, status)
- [ ] Verify role badges display correctly
- [ ] Test pagination (if data is sufficient)

### Create User
- [ ] Test form validation (required fields)
- [ ] Test email format validation
- [ ] Add multiple roles to a user
- [ ] Verify success message on creation
- [ ] Check user appears in list after creation

### Edit User
- [ ] Update user information
- [ ] Change roles
- [ ] Test form validation
- [ ] Verify changes are saved

### User Details
- [ ] View user details
- [ ] Test change password dialog
- [ ] Test role management dialog
- [ ] Test edit navigation
- [ ] Test back navigation

### Delete User
- [ ] Test soft delete functionality
- [ ] Verify confirmation dialog
- [ ] Check user is removed from active list
- [ ] Verify success message

## Customers Module Testing
### Customer List Page
- [ ] View all customers in table format
- [ ] Test search functionality (by name/email/phone)
- [ ] Test advanced search filters
- [ ] Verify customer type badges display
- [ ] Verify loyalty points display
- [ ] Test pagination (if data is sufficient)

### Create Customer
- [ ] Test form validation (required fields)
- [ ] Test email and phone format validation
- [ ] Select ID type and customer type
- [ ] Verify success message on creation
- [ ] Check customer appears in list after creation

### Edit Customer
- [ ] Update customer information
- [ ] Change customer type
- [ ] Test form validation
- [ ] Verify changes are saved

### Customer Details
- [ ] View customer details
- [ ] Test loyalty points update dialog
- [ ] Test edit navigation
- [ ] Test back navigation
- [ ] Verify all customer data displays correctly

### Delete Customer
- [ ] Test soft delete functionality
- [ ] Verify confirmation dialog
- [ ] Check customer is removed from active list
- [ ] Verify success message

## UI/UX Testing
### Forms
- [ ] Test all form fields are accessible via keyboard
- [ ] Test tab order is logical
- [ ] Verify error states display correctly
- [ ] Test form submission with Enter key

### Tables
- [ ] Test sorting functionality
- [ ] Test responsive behavior on small screens
- [ ] Verify tooltips and hover states

### Modals/Dialogs
- [ ] Test dialog open/close functionality
- [ ] Test escape key to close
- [ ] Test clicking outside to close
- [ ] Verify focus management

### Accessibility
- [ ] Test keyboard navigation
- [ ] Verify ARIA labels are present
- [ ] Test with screen reader (optional)
- [ ] Check color contrast

## Error Handling
- [ ] Test API error responses
- [ ] Verify error messages are user-friendly
- [ ] Test network error handling
- [ ] Test 404 pages

## Security Testing
- [ ] Verify protected routes redirect to login
- [ ] Test direct URL access without authentication
- [ ] Verify logout clears authentication state
- [ ] Test role-based access (if implemented)

## Performance Testing
- [ ] Test page load times
- [ ] Check for unnecessary re-renders
- [ ] Test with large datasets
- [ ] Monitor network requests

## Browser Compatibility
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge

## Mobile Responsiveness
- [ ] Test on mobile viewport
- [ ] Test on tablet viewport
- [ ] Test touch interactions
- [ ] Test orientation changes

## Data Integrity
- [ ] Verify data persists after page refresh
- [ ] Test concurrent updates (multiple tabs)
- [ ] Verify soft delete doesn't actually delete data
- [ ] Check data validation on all fields

## Integration Testing
- [ ] Test user-customer relationships
- [ ] Test navigation between modules
- [ ] Verify data consistency across pages
- [ ] Test session management

## Known Issues to Verify
- [ ] Mock authentication limitations
- [ ] JSON Server data persistence
- [ ] Status field handling for soft deletes
- [ ] Role management restrictions

## Edge Cases
- [ ] Create user with existing email
- [ ] Create customer with existing phone
- [ ] Update with invalid data formats
- [ ] Test with special characters in names
- [ ] Test with very long input strings
- [ ] Test empty state displays

## Sign-off
- [ ] All essential functionalities work as expected
- [ ] No console errors in browser
- [ ] All test cases passed
- [ ] Ready for next module development

## Notes
- Document any bugs found
- Note any performance issues
- List any suggested improvements
- Record any deviations from requirements
