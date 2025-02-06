# Code Gama Task

## Features

- 🔐 **Secure Authentication**
  - JWT-based authentication
  - Rate-limited login attempts
  - Secure password hashing

- 💰 **Wallet Management**
  - Multi-currency support
  - Real-time balance tracking
  - Secure fund transfers

- 💱 **Multi-Currency Support**
  - Support for USD, EUR, GBP, JPY
  - Real-time currency conversion
  - Default currency selection

- 🛡️ **Security Features**
  - Fraud detection system
  - Daily transaction limits
  - Request rate limiting

- 📊 **Transaction Management**
  - Detailed transaction history
  - Pagination support

## Technology Stack

- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt, helmet
- **API Security**: express-rate-limit


## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/digital-wallet.git
cd digital-wallet
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the root directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/digital-wallet
JWT_SECRET=your_jwt_secret_key
```

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Documentation

### Authentication Routes

#### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123",
    "defaultCurrency": "USD"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123"
}
```

### Wallet Routes

#### Get Balance
```http
GET /api/wallet/balance
Authorization: Bearer <token>
```

#### Add Funds
```http
POST /api/wallet/add-funds
Authorization: Bearer <token>
Content-Type: application/json

{
    "amount": 1000.00,
    "currency": "USD"
}
```

#### Transfer Funds
```http
POST /api/wallet/transfer
Authorization: Bearer <token>
Content-Type: application/json

{
    "recipientEmail": "recipient@example.com",
    "amount": 100.00
}
```

#### Withdraw Funds
```http
POST /api/wallet/withdraw
Authorization: Bearer <token>
Content-Type: application/json

{
    "amount": 50.00
}
```

### Transaction Routes

#### Get Transaction History
```http
GET /api/transactions/history?page=1&limit=10
Authorization: Bearer <token>
```

## Security Features

### Rate Limiting
- API requests: 100 requests per 15 minutes per IP
- Login attempts: 5 attempts per hour per IP

### Fraud Detection
- Suspicious activity monitoring
- Multiple high-value transaction detection

### Data Security
- Password hashing using bcrypt
- JWT token encryption
- Secure HTTP headers using helmet
- CORS protection


## Project Structure

```
digital-wallet/
├── config/
│   ├── database.js
│   └── config.js
├── controllers/
│   ├── authController.js
│   ├── walletController.js
│   └── transactionController.js
├── middleware/
│   ├── auth.js
│   ├── rateLimiter.js
│   └── fraudDetection.js
├── models/
│   ├── User.js
│   ├── Wallet.js
│   └── Transaction.js
├── routes/
│   ├── authRoutes.js
│   ├── walletRoutes.js
│   └── transactionRoutes.js
├── services/
│   ├── currencyService.js
├── .env
├── .gitignore
├── package.json
└── server.js
```
