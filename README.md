# Hotel Management System

A modern hotel management system built with Next.js, TailwindCSS, and shadcn/ui.

## Features

- Dashboard with key metrics
- User management
- Customer management
- Room and room type management
- Booking management
- Payment tracking
- Booking channel overview

## Tech Stack

- Next.js 14
- TypeScript
- TailwindCSS
- shadcn/ui
- Axios
- json-server (for mock API)

## Prerequisites

- Node.js 18+ and npm

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hotel-management
```

2. Install dependencies:
```bash
npm install
```

3. Start the mock API server:
```bash
npm run mock-server
```

4. In a new terminal, start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
hotel-management/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard page
│   ├── users/            # Users management
│   ├── customers/        # Customers management
│   ├── rooms/           # Rooms management
│   ├── bookings/        # Bookings management
│   ├── payments/        # Payments view
│   └── booking-channels/ # Booking channels view
├── components/           # Reusable components
│   └── ui/              # UI components from shadcn/ui
├── services/            # API services
├── lib/                 # Utility functions
└── data/               # Mock data files
```

## API Endpoints

The mock API server runs on `http://localhost:3001` and provides the following endpoints:

- `GET /users` - Get all users
- `GET /customers` - Get all customers
- `GET /rooms` - Get all rooms
- `GET /roomTypes` - Get all room types
- `GET /bookings` - Get all bookings
- `GET /payments` - Get all payments
- `GET /bookingChannels` - Get all booking channels
- `GET /paymentMethods` - Get all payment methods

Each endpoint supports standard CRUD operations (POST, GET, PUT, DELETE).

## Development

- The project uses TypeScript for type safety
- TailwindCSS for styling
- shadcn/ui for pre-built components
- Axios for API calls
- json-server for mock API

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 