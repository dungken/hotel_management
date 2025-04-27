# Hotel Management System

A modern hotel management system built with Next.js, TypeScript, and Tailwind CSS.

## Features

### Users Module
- User authentication (login/logout)
- User management (CRUD operations)
- Role-based access control
- Password management
- Soft delete functionality

### Customers Module
- Customer registration and management
- Loyalty points system
- Advanced search and filtering
- Customer type categorization
- Soft delete functionality

## Prerequisites

- Node.js 16+ 
- npm or yarn
- JSON Server for mock API

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hotel_management
```

2. Install dependencies:
```bash
npm install
```

3. Install JSON Server globally:
```bash
npm install -g json-server
```

## Running the Application

1. Start the mock API server:
```bash
json-server --watch db.json --port 3001
```

2. In a new terminal, start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

## Testing the Application

### Default Login Credentials

- **Admin User**
  - Email: admin@hotel.com
  - Password: password

- **Receptionist User**
  - Email: receptionist@hotel.com
  - Password: password

### Testing Workflow

1. **Login**
   - Navigate to http://localhost:3000/login
   - Use the credentials above to log in

2. **Users Module**
   - Access via the navigation menu "Users"
   - Test CRUD operations:
     - Create new user
     - View user list
     - Edit user
     - Delete user (soft delete)
     - Change password
     - Manage roles

3. **Customers Module**
   - Access via the navigation menu "Customers"
   - Test CRUD operations:
     - Create new customer
     - View customer list
     - Edit customer
     - Delete customer (soft delete)
     - Update loyalty points
     - Use advanced search

4. **Navigation**
   - Test responsive navigation menu
   - Verify logout functionality
   - Check header user menu

## API Endpoints

### Users
- `GET /users` - List all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `PATCH /users/:id` - Partial update (including soft delete)
- `DELETE /users/:id` - Delete user (hard delete)

### Customers
- `GET /customers` - List all customers
- `GET /customers/:id` - Get customer by ID
- `POST /customers` - Create new customer
- `PUT /customers/:id` - Update customer
- `PATCH /customers/:id` - Partial update (including soft delete)
- `DELETE /customers/:id` - Delete customer (hard delete)

## Project Structure

```
src/
├── app/               # Next.js pages
│   ├── customers/    # Customer management pages
│   ├── users/        # User management pages
│   ├── dashboard/    # Dashboard page
│   └── login/        # Authentication page
├── components/       # Reusable components
│   ├── customers/    # Customer-specific components
│   ├── users/        # User-specific components
│   └── layout/       # Layout components
├── services/         # API services
├── types/           # TypeScript types
└── contexts/        # React contexts
```

## Technologies Used

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: React Context
- **API**: JSON Server (mock)
- **Date Handling**: date-fns
- **Icons**: Lucide React

## Development Notes

1. The application uses a mock API server (json-server) for development
2. Authentication is simulated using localStorage
3. All data is persisted in the `db.json` file
4. Soft delete is implemented by updating status to "INACTIVE"

## Known Issues

- The application uses mock authentication (not secure for production)
- Data is stored locally in JSON file (not suitable for production)
- No real password hashing or security measures implemented

## Future Improvements

1. Implement real authentication with JWT
2. Connect to a real database
3. Add real-time updates
4. Implement more advanced search filters
5. Add data validation on the server side
6. Implement role-based permissions properly
