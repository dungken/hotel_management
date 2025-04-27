# Troubleshooting Guide

## 404 Page Not Found Error

If you get a 404 error when accessing the login page or other routes:

1. **Check Next.js Server**
   - Make sure the development server is running with `npm run dev`
   - Server should be running on http://localhost:3000

2. **Check JSON Server**
   - Ensure JSON Server is running with `npm run mock-server`
   - Should be accessible at http://localhost:3001
   - Verify db.json exists and has correct data

3. **Clear Browser Cache**
   - Clear browser cache and cookies
   - Delete localStorage (Open DevTools > Application > Local Storage)
   - Refresh the page with Ctrl+F5 (or Cmd+Shift+R on Mac)

4. **Check URL Paths**
   - Login page: http://localhost:3000/login (not /auth/login)
   - Dashboard: http://localhost:3000/dashboard (after login)
   - Default redirect: Root URL (/) redirects to /login if not authenticated

5. **Check Console Errors**
   - Open browser DevTools (F12)
   - Check for errors in the Console tab
   - Look for network errors in the Network tab

## Authentication Issues

### Can't Log In

1. **Check Credentials**
   - Use the test credentials from README.md
   - Admin: admin@hotel.com / password
   - Receptionist: receptionist@hotel.com / password

2. **Check API Connection**
   - Ensure JSON Server is running
   - Check Network tab for API requests
   - Verify API responses

3. **Check localStorage**
   - Clear localStorage if needed
   - Check if auth_token and auth_user are being set

### Redirect Loop

1. **Clear Browser Data**
   - Clear cookies and localStorage
   - Restart browser

2. **Check Middleware**
   - Verify middleware.ts is correctly configured
   - Check public paths are accessible without auth

## API Connection Issues

1. **JSON Server Not Running**
   ```bash
   # Start JSON Server
   npm run mock-server
   
   # Or use the combined command
   npm run dev:all
   ```

2. **Wrong API URL**
   - Check API_BASE_URL in src/constants/index.ts
   - Should be "http://localhost:3001"

3. **CORS Issues**
   - JSON Server includes CORS support by default
   - If issues persist, check browser console for CORS errors

## Quick Restart

If you encounter any persistent issues:

1. Stop all servers (Ctrl+C)
2. Clear browser data
3. Run:
   ```bash
   npm run dev:all
   ```
4. Navigate to http://localhost:3000/login

## Common Error Messages

### "Invalid email or password"
- Check you're using the correct credentials
- Verify user exists in db.json
- Ensure password matches (default: "password")

### "Failed to fetch"
- JSON Server is not running
- API URL is incorrect
- Network connectivity issues

### "Unauthorized"
- Token has expired or is invalid
- User session has ended
- Need to log in again

## Development Tools

### Useful Browser Extensions
- React Developer Tools
- Redux DevTools (if using Redux)
- JSON Viewer

### Debug Tips
1. Enable verbose logging:
   ```typescript
   console.log('Login attempt:', credentials);
   console.log('API response:', response);
   ```

2. Check API requests:
   - Open Network tab in DevTools
   - Filter by XHR/Fetch
   - Inspect request/response payloads

3. Monitor Authentication:
   - Check localStorage for auth_token
   - Verify token is sent in request headers
   - Monitor cookie values

## Contact Support

If you continue experiencing issues:
1. Check the project's GitHub issues
2. Create a new issue with:
   - Error description
   - Steps to reproduce
   - Browser/OS information
   - Console logs
   - Network requests/responses
