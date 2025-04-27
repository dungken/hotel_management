# Hotel Management System - Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Install JSON Server Globally (if not already installed)
```bash
npm install -g json-server
```

### 3. Start Development Environment

#### Option 1: Run both servers with one command
```bash
npm run dev:all
```

#### Option 2: Run servers separately

Terminal 1:
```bash
npm run mock-server
```

Terminal 2:
```bash
npm run dev
```

#### Option 3: Use platform-specific scripts

For Linux/Mac:
```bash
npm run start:linux
```

For Windows:
```bash
npm run start:windows
```

### 4. Access the Application
- Application: http://localhost:3000
- API Server: http://localhost:3001

## Development Setup

### Environment Requirements
- Node.js 16+
- npm or yarn
- Modern web browser (Chrome, Firefox, Safari, Edge)

### IDE Setup (Recommended)
- VSCode with following extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features

### Default Test Users

| Role        | Email                 | Password  |
|-------------|-----------------------|-----------|
| Admin       | admin@hotel.com       | password  |
| Receptionist| receptionist@hotel.com| password  |

## Project Structure

```
hotel_management/
├── src/
│   ├── app/              # Next.js pages & routes
│   ├── components/       # Reusable UI components
│   ├── services/         # API service layers
│   ├── types/           # TypeScript type definitions
│   ├── contexts/        # React context providers
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utility functions
├── public/              # Static assets
├── db.json             # Mock database file
└── package.json        # Project configuration
```

## Common Issues

### JSON Server Port Conflict
If port 3001 is already in use:
1. Change the port in package.json: `"mock-server": "json-server --watch db.json --port YOUR_PORT"`
2. Update API_BASE_URL in all service files

### Next.js Port Conflict
If port 3000 is already in use:
1. Run with a different port: `npm run dev -- -p YOUR_PORT`

### Authentication Issues
If you can't log in:
1. Ensure JSON Server is running
2. Check db.json file has user data
3. Clear browser localStorage
4. Refresh the page

## Development Workflow

1. Pull latest changes from repository
2. Install any new dependencies: `npm install`
3. Start development environment
4. Make your changes
5. Test thoroughly using test checklist
6. Commit and push changes

## Testing

Use the `test-checklist.md` file to ensure all features work correctly before deployment.

## Build for Production

```bash
npm run build
npm run start
```

Note: For production, you'll need a real backend instead of JSON Server.
