# Hotel Management API Endpoints Documentation

This document provides detailed information about all API endpoints available in the Hotel Management System.

## Table of Contents
- [User Management](#user-management)
- [Customer Management](#customer-management)
- [Room Management](#room-management)
- [Room Type Management](#room-type-management)
- [Booking Channel Management](#booking-channel-management)
- [Payment Method Management](#payment-method-management)
- [Booking Management](#booking-management)
- [Payment Management](#payment-management)

## User Management

### Register User
- **HTTP Method:** POST
- **Path:** `/api/users/SignUpUser`
- **Description:** Creates a new user account in the system.
- **Authentication:** Not required
- **Request Body:**
  ```json
  {
    "username": "string",     // Minimum 8 characters
    "password": "string",     // Minimum 8 characters, must contain uppercase, lowercase, number, and special character
    "email": "string"         // Valid email format
  }
  ```
- **Example Request:**
  ```http
  POST /api/users/SignUpUser
  Content-Type: application/json

  {
    "username": "johndoe123",
    "password": "SecurePass123!",
    "email": "john.doe@example.com"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "messenge": "Success",
    "data": {
      "userId": 1,
      "username": "johndoe123",
      "email": "john.doe@example.com",
      "dateCreated": "2023-04-07T10:30:00"
    }
  }
  ```
- **Error Responses:**
  - 400 Bad Request: "Missing information" - Required fields are empty
  - 400 Bad Request: "Username and password must be at least 8 characters" - Username/password too short
  - 400 Bad Request: "Username is already taken" - Username already exists
  - 400 Bad Request: "Password is incorrect" - Password doesn't meet requirements
  - 400 Bad Request: "Email is incorrect" - Invalid email format
  - 400 Bad Request: "Email is already taken" - Email already exists
  - 400 Bad Request: "Can't hash password" - Error during password hashing
  - 400 Bad Request: "Database error: [error message]" - Database operation failed

### User Login
- **HTTP Method:** PUT
- **Path:** `/api/users/SignIn`
- **Description:** Authenticates a user and returns a JWT token for subsequent requests.
- **Authentication:** Not required
- **Request Body:**
  ```json
  {
    "username": "string",     // Optional if email provided
    "email": "string",        // Optional if username provided
    "password": "string"
  }
  ```
- **Example Request:**
  ```http
  PUT /api/users/SignIn
  Content-Type: application/json

  {
    "username": "johndoe123",
    "password": "SecurePass123!"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "messenge": "Success",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "userId": 1,
        "username": "johndoe123",
        "email": "john.doe@example.com"
      }
    }
  }
  ```
- **Error Responses:**
  - 400 Bad Request: "Missing information" - Required fields are empty
  - 400 Bad Request: "Username is incorrect" - User not found
  - 400 Bad Request: "Password is incorrect" - Invalid password
  - 400 Bad Request: "Error: [error message]" - General error

### Get User by Email
- **HTTP Method:** GET
- **Path:** `/api/users/GetUserByEmail`
- **Description:** Retrieves user information by email address.
- **Authentication:** Not required
- **Query Parameters:**
  - `email` (string, required): The email address of the user to retrieve
- **Example Request:**
  ```http
  GET /api/users/GetUserByEmail?email=john.doe@example.com
  ```
- **Success Response (200 OK):**
  ```json
  {
    "messenge": "Success",
    "data": {
      "userId": 1,
      "username": "johndoe123",
      "email": "john.doe@example.com",
      "dateCreated": "2023-04-07T10:30:00"
    }
  }
  ```
- **Error Responses:**
  - 400 Bad Request: "Fail: email is empty" - Email parameter is missing
  - 400 Bad Request: "User not found" - No user with the provided email

### Add Role for User
- **HTTP Method:** GET
- **Path:** `/api/users/AddRoleForUser`
- **Description:** Assigns one or more roles to a user.
- **Authentication:** Required (JWT Token)
- **Query Parameters:**
  - `username` (string, optional): Username of the user
  - `email` (string, optional): Email of the user (either username or email must be provided)
  - `roleNameList` (array of strings, required): List of role names to assign
- **Example Request:**
  ```http
  GET /api/users/AddRoleForUser?username=johndoe123&roleNameList=USER&roleNameList=VIP
  ```
- **Success Response (200 OK):**
  ```json
  {
    "messenge": "Success",
    "data": {
      "userId": 1,
      "username": "johndoe123",
      "roles": ["USER", "VIP"]
    }
  }
  ```
- **Error Responses:**
  - 400 Bad Request: "Must input username or email" - Neither username nor email provided
  - 400 Bad Request: "Must input role" - No roles specified
  - 404 Not Found: "Not found user" - User not found
  - 404 Not Found: "Not found role" - One or more roles not found

## Customer Management

### Create Customer Account
- **HTTP Method:** PUT
- **Path:** `/api/KhachHang/TaoTaiKhoang`
- **Description:** Creates a new customer account in the system.
- **Authentication:** Not required
- **Request Body:**
  ```json
  {
    "tenDayDu": "string",      // Full name
    "email": "string",          // Email address
    "soDienThoai": "string",    // Phone number
    "quocTich": "string",       // Nationality
    "loaiGiayTo": "string",     // ID type
    "soGiayTo": "string",       // ID number
    "ngaySinh": "string"        // Date of birth (YYYY-MM-DD)
  }
  ```
- **Example Request:**
  ```http
  PUT /api/KhachHang/TaoTaiKhoang
  Content-Type: application/json

  {
    "tenDayDu": "John Doe",
    "email": "john.doe@example.com",
    "soDienThoai": "0123456789",
    "quocTich": "United States",
    "loaiGiayTo": "Passport",
    "soGiayTo": "P123456789",
    "ngaySinh": "1990-01-01"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "messenge": "Create account success",
    "data": {
      "maKhachHang": 1,
      "ho": "John",
      "ten": "Doe",
      "email": "john.doe@example.com",
      "soDienThoai": "0123456789",
      "quocTich": "United States",
      "loaiGiayTo": "Passport",
      "soGiayTo": "P123456789",
      "ngaySinh": "1990-01-01",
      "maLoaiKhach": 2,
      "ngayDangKy": "2023-04-07T10:30:00",
      "diemTichLuy": 0
    }
  }
  ```
- **Error Responses:**
  - 400 Bad Request: "TaoTaiKhoang fail" - Request body is null
  - 400 Bad Request: "TenDayDu is empty" - Full name is missing
  - 400 Bad Request: "Must input Email or SoDienThoai" - Both email and phone number are missing
  - 400 Bad Request: "Must input LoaiGiayTo or SoGiayTo" - ID information is missing
  - 400 Bad Request: "Email incorrect" - Invalid email format
  - 400 Bad Request: "SoDienThoai exits" - Phone number already exists
  - 400 Bad Request: "SoGiayTo exits" - ID number already exists
  - 400 Bad Request: "NgaySinh incorrect" - Invalid date format
  - 400 Bad Request: "Create fail: [error message]" - Database error

## Room Management

### Get All Rooms
- **HTTP Method:** GET
- **Path:** `/api/Phong/GetRoom`
- **Description:** Retrieves a list of all rooms in the hotel.
- **Authentication:** Required (JWT Token)
- **Example Request:**
  ```http
  GET /api/Phong/GetRoom
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Success Response (200 OK):**
  ```json
  {
    "messenge": "Success",
    "data": [
      {
        "maPhong": 1,
        "soPhong": "101",
        "maLoaiPhong": 1,
        "trangThai": "1",
        "ghiChu": "Ocean view"
      },
      {
        "maPhong": 2,
        "soPhong": "102",
        "maLoaiPhong": 1,
        "trangThai": "1",
        "ghiChu": "Mountain view"
      }
    ]
  }
  ```
- **Error Responses:**
  - 400 Bad Request: "Must sign in to countinue" - Not authenticated
  - 403 Forbidden: "You do not have permission to get room" - Insufficient permissions
  - 400 Bad Request: "Fail" - No rooms found

### Get Available Rooms
- **HTTP Method:** PUT
- **Path:** `/api/Phong/GetRoomEmpty`
- **Description:** Retrieves a list of available rooms for a specific date range.
- **Authentication:** Required (JWT Token)
- **Request Body:**
  ```json
  {
    "ngayNhan": "datetime",  // Check-in date
    "ngayTra": "datetime"    // Check-out date
  }
  ```
- **Example Request:**
  ```http
  PUT /api/Phong/GetRoomEmpty
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json

  {
    "ngayNhan": "2023-05-01T00:00:00",
    "ngayTra": "2023-05-05T00:00:00"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "messesge": "Success",
    "listRoom": [
      {
        "maPhong": 1,
        "soPhong": "101",
        "maLoaiPhong": 1,
        "trangThai": "1",
        "ghiChu": "Ocean view"
      },
      {
        "maPhong": 2,
        "soPhong": "102",
        "maLoaiPhong": 1,
        "trangThai": "1",
        "ghiChu": "Mountain view"
      }
    ]
  }
  ```
- **Error Responses:**
  - 400 Bad Request: "Must sign in to countinue" - Not authenticated
  - 403 Forbidden: "You do not have permission to get room" - Insufficient permissions
  - 400 Bad Request: "Fail" - No rooms found

## Room Type Management

### Get Room Types
- **HTTP Method:** GET
- **Path:** `/api/LoaiPhong/LayLoaiPhong`
- **Description:** Retrieves a list of all active room types.
- **Authentication:** Not required
- **Example Request:**
  ```http
  GET /api/LoaiPhong/LayLoaiPhong
  ```
- **Success Response (200 OK):**
  ```json
  {
    "messenge": "Success",
    "data": [
      {
        "maLoaiPhong": 1,
        "tenLoaiPhong": "Standard",
        "moTa": "Standard room with basic amenities",
        "soNguoiToiDa": 2,
        "soTreEmToiDa": 1,
        "tuoiToiDaTreEm": 12,
        "giaCoBan": 100.00,
        "phiNguoiThem": 20.00,
        "phanTramGiamGiaMacDinh": 0,
        "giamGiaLuuTruDai": 0,
        "giamGiaDatSom": 0,
        "trangThai": true
      },
      {
        "maLoaiPhong": 2,
        "tenLoaiPhong": "Deluxe",
        "moTa": "Deluxe room with premium amenities",
        "soNguoiToiDa": 3,
        "soTreEmToiDa": 2,
        "tuoiToiDaTreEm": 12,
        "giaCoBan": 150.00,
        "phiNguoiThem": 25.00,
        "phanTramGiamGiaMacDinh": 0,
        "giamGiaLuuTruDai": 0,
        "giamGiaDatSom": 0,
        "trangThai": true
      }
    ]
  }
  ```
- **Error Responses:**
  - 400 Bad Request: "ERROR: [error message]" - Database error

### Calculate Room Price
- **HTTP Method:** GET
- **Path:** `/api/LoaiPhong/TinhGiaLoaiPhong`
- **Description:** Calculates the price for a specific room type with optional parameters.
- **Authentication:** Not required
- **Query Parameters:**
  - `maLoaiPhong` (integer, required): Room type ID
  - `coThemNguoi` (boolean, required): Whether to include additional person fee
- **Example Request:**
  ```http
  GET /api/LoaiPhong/TinhGiaLoaiPhong?maLoaiPhong=1&coThemNguoi=true
  ```
- **Success Response (200 OK):**
  ```json
  120.00
  ```
- **Error Responses:**
  - 400 Bad Request: "LoaiPhong not exits" - Room type not found

## Booking Channel Management

### Get Booking Channels
- **HTTP Method:** GET
- **Path:** `/api/kenh/LayKenh`
- **Description:** Retrieves a list of all active booking channels.
- **Authentication:** Not required
- **Example Request:**
  ```http
  GET /api/kenh/LayKenh
  ```
- **Success Response (200 OK):**
  ```json
  {
    "messenge": "Success",
    "data": [
      {
        "maKenh": 1,
        "tenKenh": "Direct",
        "moTa": "Direct booking through hotel website",
        "trangThai": true
      },
      {
        "maKenh": 2,
        "tenKenh": "Booking.com",
        "moTa": "Booking through Booking.com",
        "trangThai": true
      }
    ]
  }
  ```
- **Error Responses:**
  - 400 Bad Request: "ERROR: [error message]" - Database error

## Payment Method Management

### Get Payment Methods
- **HTTP Method:** GET
- **Path:** `/api/PhuongThucThanhToan/LayRaPhuongThucThanhToan`
- **Description:** Retrieves a list of all active payment methods.
- **Authentication:** Required (JWT Token)
- **Example Request:**
  ```http
  GET /api/PhuongThucThanhToan/LayRaPhuongThucThanhToan
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Success Response (200 OK):**
  ```json
  {
    "messenge": "Get success",
    "data": [
      {
        "maPhuongThuc": 1,
        "tenPhuongThuc": "Cash",
        "moTa": "Payment in cash",
        "trangThai": true
      },
      {
        "maPhuongThuc": 2,
        "tenPhuongThuc": "Credit Card",
        "moTa": "Payment by credit card",
        "trangThai": true
      }
    ]
  }
  ```
- **Error Responses:**
  - 400 Bad Request: "Must sign in to countinue" - Not authenticated
  - 403 Forbidden: "You do not have permission" - Insufficient permissions
  - 400 Bad Request: "ERROR: [error message]" - Database error

## Booking Management

### Get All Bookings
- **HTTP Method:** GET
- **Path:** `/api/DatPhong/LayDatPhong`
- **Description:** Retrieves a list of all bookings.
- **Authentication:** Required (JWT Token)
- **Example Request:**
  ```http
  GET /api/DatPhong/LayDatPhong
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Success Response (200 OK):**
  ```json
  {
    "message": "Success",
    "data": [
      {
        "maDatPhong": 1,
        "maDatPhongHienThi": "101",
        "maKhachHang": 1,
        "maPhong": 1,
        "maKenh": 1,
        "ngayNhanPhong": "2023-05-01T00:00:00",
        "ngayTraPhong": "2023-05-05T00:00:00",
        "soNguoiLon": 2,
        "soTreEm": 1,
        "tuoiTreEm": "10",
        "ngayDat": "2023-04-07T10:30:00",
        "trangThaiDatPhong": "PENDING",
        "coTinhPhiHuy": false,
        "lyDoHuy": null,
        "yeuCauDacBiet": "Late check-in",
        "tongTien": 400.00,
        "soGiuongPhu": 0,
        "coAnSang": true,
        "phanTramGiamGia": 0,
        "lyDoGiamGia": null,
        "maNhanVienDat": 1
      }
    ]
  }
  ```
- **Error Responses:**
  - 400 Bad Request: "Must sign in to countinue" - Not authenticated
  - 403 Forbidden: "You do not have permission to get room" - Insufficient permissions
  - 400 Bad Request: "[error message]" - Database error

### Create Booking
- **HTTP Method:** PUT
- **Path:** `/api/DatPhong/DatPhong`
- **Description:** Creates a new room booking.
- **Authentication:** Required (JWT Token)
- **Request Body:**
  ```json
  {
    "soPhong": "string",           // Room number
    "maKenh": "string",            // Booking channel ID
    "ngayNhanPhong": "datetime",   // Check-in date
    "ngayTraPhong": "datetime",    // Check-out date
    "soNguoiLon": "integer",       // Number of adults
    "soTreEm": "integer",          // Number of children
    "tuoiTreEm": "string",         // Children's ages
    "ngayDat": "datetime",         // Booking date
    "yeuCauDatBiet": "string",     // Special requests
    "soGiuongPhu": "integer",      // Extra beds
    "coAnSang": "boolean",         // Includes breakfast
    "phanTramGiamGia": "decimal",  // Discount percentage
    "lyDoGiamGia": "string",       // Discount reason
    "sdtKhachHang": "string"       // Customer phone number
  }
  ```
- **Example Request:**
  ```http
  PUT /api/DatPhong/DatPhong
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json

  {
    "soPhong": "101",
    "maKenh": "1",
    "ngayNhanPhong": "2023-05-01T00:00:00",
    "ngayTraPhong": "2023-05-05T00:00:00",
    "soNguoiLon": 2,
    "soTreEm": 1,
    "tuoiTreEm": "10",
    "ngayDat": "2023-04-07T10:30:00",
    "yeuCauDatBiet": "Late check-in",
    "soGiuongPhu": 0,
    "coAnSang": true,
    "phanTramGiamGia": 0,
    "lyDoGiamGia": "",
    "sdtKhachHang": "0123456789"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "message": "Room booked successfully",
    "bookingCode": "101"
  }
  ```
- **Error Responses:**
  - 401 Unauthorized: "Must sign in to continue" - Not authenticated
  - 403 Forbidden: "You do not have permission to book a room" - Insufficient permissions
  - 400 Bad Request: "Must enter properties order" - Request body is null
  - 400 Bad Request: "Room number is invalid" - Room not found
  - 400 Bad Request: "Booking channel is invalid" - Booking channel not found
  - 400 Bad Request: "Check-in date is invalid" - Invalid check-in date
  - 400 Bad Request: "Check-out date is invalid" - Invalid check-out date
  - 400 Bad Request: "Check-in date cannot be after check-out date" - Invalid date range
  - 400 Bad Request: "Booking date is invalid" - Invalid booking date
  - 400 Bad Request: "Room is already booked for the selected dates" - Room unavailable
  - 400 Bad Request: "Room type not found" - Room type not found
  - 400 Bad Request: "Child age exceeds the limit for this room type" - Age restriction violation
  - 400 Bad Request: "Khach Hang not exits" - Customer not found
  - 400 Bad Request: "Errorr access API" - Error accessing room service

### Cancel Booking
- **HTTP Method:** PUT
- **Path:** `/api/DatPhong/CancelBill`
- **Description:** Cancels an existing booking.
- **Authentication:** Required (JWT Token)
- **Request Body:**
  ```json
  {
    "maDatPhongHienThi": "string",  // Booking code
    "coTinhPhiHuy": "boolean",      // Apply cancellation fee
    "lyDoHuy": "string"             // Cancellation reason
  }
  ```
- **Example Request:**
  ```http
  PUT /api/DatPhong/CancelBill
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json

  {
    "maDatPhongHienThi": "101",
    "coTinhPhiHuy": true,
    "lyDoHuy": "Change of plans"
  }
  ```
- **Success Response (200 OK):**
  ```json
  "HuyDatPhong successfully"
  ```
- **Error Responses:**
  - 400 Bad Request: "Must sign in to countinue" - Not authenticated
  - 403 Forbidden: "You do not have permission to get room" - Insufficient permissions
  - 400 Bad Request: "Must enter properties order" - Request body is null
  - 404 Not Found: "Not Found order" - Booking not found

### Approve Booking
- **HTTP Method:** PUT
- **Path:** `/api/DatPhong/ApproveBill`
- **Description:** Approves a pending booking.
- **Authentication:** Required (JWT Token)
- **Query Parameters:**
  - `MaDatPhong` (string, required): Booking code
- **Example Request:**
  ```http
  PUT /api/DatPhong/ApproveBill?MaDatPhong=101
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Success Response (200 OK):**
  ```json
  {
    "message": "Booking approved successfully"
  }
  ```
- **Error Responses:**
  - 400 Bad Request: "Must sign in to countinue" - Not authenticated
  - 403 Forbidden: "You do not have permission" - Insufficient permissions
  - 404 Not Found: "Booking not found" - Booking not found

## Payment Management

### Get All Payments
- **HTTP Method:** GET
- **Path:** `/api/ThanhToan/LayThanhToan`
- **Description:** Retrieves a list of all payments.
- **Authentication:** Required (JWT Token)
- **Example Request:**
  ```http
  GET /api/ThanhToan/LayThanhToan
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Success Response (200 OK):**
  ```json
  {
    "messenge": "Get success",
    "data": [
      {
        "maThanhToan": 1,
        "maDatPhong": 1,
        "maPhuongThuc": 1,
        "ngayThanhToan": "2023-04-07T10:30:00",
        "soTien": 400.00,
        "maGiaoDich": "TXN123456",
        "trangThai": "COMPLETED",
        "soHoaDon": "INV123456",
        "xuatHoaDonVat": false,
        "tenCongTy": null,
        "maSoThue": null,
        "ghiChu": "Full payment"
      }
    ]
  }
  ```
- **Error Responses:**
  - 400 Bad Request: "Must sign in to countinue" - Not authenticated
  - 403 Forbidden: "You do not have permission to get room" - Insufficient permissions
  - 400 Bad Request: "ERROR: [error message]" - Database error

### Create Payment
- **HTTP Method:** PUT
- **Path:** `/api/ThanhToan/TaoThanhToan`
- **Description:** Creates a new payment record.
- **Authentication:** Required (JWT Token)
- **Request Body:**
  ```json
  {
    "maDatPhong": "integer",        // Booking ID
    "maPhuongThuc": "integer",      // Payment method ID
    "soTien": "decimal",            // Amount
    "maGiaoDich": "string",         // Transaction ID
    "trangThai": "string",          // Payment status
    "tenCongTy": "string",          // Company name (for VAT invoice)
    "maSoThue": "string",           // Tax number (for VAT invoice)
    "ghiChu": "string"              // Notes
  }
  ```
- **Example Request:**
  ```http
  PUT /api/ThanhToan/TaoThanhToan
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json

  {
    "maDatPhong": 1,
    "maPhuongThuc": 1,
    "soTien": 400.00,
    "maGiaoDich": "TXN123456",
    "trangThai": "COMPLETED",
    "tenCongTy": "",
    "maSoThue": "",
    "ghiChu": "Full payment"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "messenge": "ThanhToan success",
    "data": {
      "maThanhToan": 1,
      "maDatPhong": 1,
      "maPhuongThuc": 1,
      "ngayThanhToan": "2023-04-07T10:30:00",
      "soTien": 400.00,
      "maGiaoDich": "TXN123456",
      "trangThai": "COMPLETED",
      "soHoaDon": null,
      "xuatHoaDonVat": false,
      "tenCongTy": null,
      "maSoThue": null,
      "ghiChu": "Full payment"
    }
  }
  ```
- **Error Responses:**
  - 401 Unauthorized: "Must sign in to continue" - Not authenticated
  - 403 Forbidden: "You do not have permission to book a room" - Insufficient permissions
  - 400 Bad Request: "Must enter properties order" - Request body is null
  - 400 Bad Request: "MaDatPhong not exits" - Booking not found
  - 400 Bad Request: "MaPhuongThuc not exits" - Payment method not found
  - 400 Bad Request: "ERROR: [error message]" - Database error

### Generate VAT Invoice
- **HTTP Method:** PUT
- **Path:** `/api/ThanhToan/XuatHoaDonVAT`
- **Description:** Generates a VAT invoice for a payment.
- **Authentication:** Required (JWT Token)
- **Query Parameters:**
  - `maThanhToan` (integer, required): Payment ID
  - `maSoThue` (string, required): Tax number
  - `tenCongTy` (string, required): Company name
  - `ghiChu` (string, required): Notes
- **Example Request:**
  ```http
  PUT /api/ThanhToan/XuatHoaDonVAT?maThanhToan=1&maSoThue=123456789&tenCongTy=ABC%20Corp&ghiChu=VAT%20Invoice
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```
- **Success Response (200 OK):**
  ```json
  {
    "messenge": "XuatHoaDonVAT success",
    "data": {
      "maThanhToan": 1,
      "maDatPhong": 1,
      "maPhuongThuc": 1,
      "ngayThanhToan": "2023-04-07T10:30:00",
      "soTien": 400.00,
      "maGiaoDich": "TXN123456",
      "trangThai": "COMPLETED",
      "soHoaDon": "INV123456",
      "xuatHoaDonVat": true,
      "tenCongTy": "ABC Corp",
      "maSoThue": "123456789",
      "ghiChu": "VAT Invoice"
    }
  }
  ```
- **Error Responses:**
  - 400 Bad Request: "Must sign in to countinue" - Not authenticated
  - 403 Forbidden: "You do not have permission to get room" - Insufficient permissions
  - 400 Bad Request: "MaDatPhong not exits" - Payment not found
  - 400 Bad Request: "MaSoThue is empty" - Tax number is missing
  - 400 Bad Request: "TenCongTy is empty" - Company name is missing
  - 400 Bad Request: "GhiChu is empty" - Notes are missing
  - 400 Bad Request: "ERROR: [error message]" - Database error 