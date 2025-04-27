# Debug Checklist for 404 Error

## Quick Checks

1. **Server Running**
   - Is Next.js dev server running? (`npm run dev`)
   - Is JSON Server running? (`npm run mock-server`)
   - Try the combined command: `npm run dev:all`

2. **Access Debug Page**
   - Go to http://localhost:3000/debug
   - This will show system status

3. **Check URLs**
   - Login: http://localhost:3000/login (NOT /auth/login)
   - Root: http://localhost:3000/
   - Debug: http://localhost:3000/debug

4. **Clear Browser Cache**
   - Open DevTools (F12)
   - Right-click refresh button
   - Select "Empty Cache and Hard Reload"

5. **Check Console Output**
   - Look for errors in terminal where you ran `npm run dev`
   - Check browser console for JavaScript errors

## If Still Not Working

### 1. Restart Everything
```bash
# Stop all processes (Ctrl+C)
# Then run:
npm run dev:all
```

### 2. Clean Install
```bash
rm -rf .next
rm -rf node_modules
npm install
npm run dev:all
```

### 3. Verify Files Exist
Check these key files:
- `/src/app/login/page.tsx`
- `/src/app/page.tsx`
- `/src/middleware.ts`
- `/src/services/auth.service.ts`

### 4. Check Port Conflicts
```bash
# Check if ports are in use:
lsof -i :3000
lsof -i :3001
```

### 5. Manual Test
Try accessing these URLs directly:
- http://localhost:3000/api/health
- http://localhost:3001/users
- http://localhost:3000/debug

### 6. Check Middleware
Ensure middleware.ts is not blocking routes:
- Public paths include /login
- API paths are allowed
- Debug path is accessible

## Common Issues

1. **Wrong URL Path**
   - Using /auth/login instead of /login
   - Missing port number (3000)

2. **Server Not Started**
   - Next.js dev server not running
   - JSON Server not running

3. **Browser Cache Issues**
   - Old routing cached
   - Need hard refresh

4. **Port Conflicts**
   - Another process using port 3000
   - Another process using port 3001

5. **File System Issues**
   - Files not saved
   - Permission issues
   - Build cache issues

## Last Resort

1. **Create Fresh Project**
   ```bash
   npx create-next-app@latest test-app
   cd test-app
   npm run dev
   ```
   
2. **Compare Configurations**
   - Compare package.json
   - Compare tsconfig.json
   - Compare next.config.js

3. **Check Node Version**
   ```bash
   node --version
   # Should be 16+ for Next.js 14
   ```

4. **Environment Variables**
   Create `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

5. **Build Test**
   ```bash
   npm run build
   npm run start
   ```
