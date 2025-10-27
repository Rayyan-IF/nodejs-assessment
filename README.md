# Node.js Assessment API

Node.js REST API menggunakan TypeScript, Express, dan Sequelize dengan autentikasi JWT untuk manajemen User, Category, dan Product.

## 🚀 Cara Install dan Menjalankan Aplikasi

### Prerequisites
- Node.js (v18 atau lebih tinggi)
- MySQL 8.0
- npm atau yarn

### Installation

1. **Clone repository**
```bash
git clone <repository-url>
cd nodejs-assessment
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
Buat file `.env` di root folder:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=nodejs_assessment
DB_USER=root
DB_PASSWORD=your_password
DB_DIALECT=mysql

# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
```

4. **Setup Database**
```bash
# Buat database MySQL
mysql -u root -p
CREATE DATABASE nodejs_assessment;
```

5. **Build dan Jalankan**
```bash
# Build TypeScript
npm run build

# Jalankan aplikasi
npm start
```

## 📁 Struktur Folder

```
src/
├── config/
│   ├── database.ts         # Konfigurasi database Sequelize
│   ├── logging.ts          # Konfigurasi Winston logger
│   └── web.ts              # Konfigurasi Express server
├── controller/
│   ├── user-controller.ts  # Controller untuk User
│   ├── category-controller.ts
│   └── product-controller.ts
├── dto/
│   ├── request/
│   │   ├── user-request.ts
│   │   ├── category-request.ts
│   │   └── product-request.ts
│   └── response/
│       ├── user-response.ts
│       ├── category-response.ts
│       └── product-response.ts
├── error/
│   └── response-error.ts   # Custom error handling
├── middleware/
│   ├── auth-middleware.ts  # JWT authentication
│   ├── error-middleware.ts # Global error handling
│   ├── not-found-middleware.ts
│   └── request-logging-middleware.ts
├── models/
│   ├── user-model.ts
│   ├── category-model.ts
│   ├── product-model.ts
│   └── index.ts           # Model registration
├── route/
│   ├── api.ts             # Protected routes
│   └── public-api.ts      # Public routes
├── service/
│   ├── user-service.ts
│   ├── category-service.ts
│   └── product-service.ts
├── validation/
│   ├── validation.ts      # Base validation
│   ├── user-validation.ts
│   ├── category-validation.ts
│   └── product-validation.ts
└── main.ts                 # Main application entry
```

## 🛠️ Tools/Library yang Digunakan

### **Core Framework**
- **Node.js** - Runtime environment
- **Express.js 5.1.0** - Web framework
- **TypeScript 5.9.3** - Type-safe JavaScript

### **Database & ORM**
- **MySQL 8.0** - Database
- **mysql2** - MySQL driver
- **Sequelize 6.37.7** - ORM untuk MySQL

### **Authentication & Security**
- **cookie-parser** - Cookie parsing
- **bcrypt 6.0.0** - Password hashing
- **jsonwebtoken** - JWT token handling

### **Validation & Data Handling**
- **Zod** - Schema validation
- **uuid 13.0.0** - UUID generation

### **Logging & Development**
- **Winston** - Logging framework
- **dotenv** - Environment variables

## 📝 Contoh Request API

### **Base URL**
```
http://localhost:3000
```

### **1. Authentication (Public Routes)**

#### Register User
```http
POST /register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Refresh Token
```http
POST /refresh
Cookie: refreshToken=<refresh_token_from_login>
```

### **2. Category Management (Protected Routes)**

#### Create Category
```http
POST /api/categories
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Electronics"
}
```

#### Get All Categories (with pagination & filter)
```http
GET /api/categories?page=1&limit=10&category=tech
Authorization: Bearer <access_token>
```

#### Get Category by ID
```http
GET /api/categories/{category_id}
Authorization: Bearer <access_token>
```

#### Update Category
```http
PUT /api/categories/{category_id}
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Updated Electronics"
}
```

#### Delete Category
```http
DELETE /api/categories/{category_id}
Authorization: Bearer <access_token>
```

### **3. Product Management (Protected Routes)**

#### Create Product
```http
POST /api/products
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "iPhone 15",
  "price": 999.99,
  "stock": 50,
  "categoryId": "category-uuid-here"
}
```

#### Get All Products (with pagination)
```http
GET /api/products?page=1&limit=10
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "data": {
    "products": [
      {
        "id": "product-uuid",
        "name": "iPhone 15",
        "price": 999.99,
        "stock": 50,
        "categoryId": "category-uuid",
        "category": {
          "id": "category-uuid",
          "name": "Electronics"
        },
        "created_at": "2025-10-27T10:00:00.000Z",
        "created_by": "user-uuid",
        "modified_at": "2025-10-27T10:00:00.000Z",
        "modified_by": null
      }
    ],
    "total": 25,
    "page": 1,
    "limit": 10
  }
}
```

#### Get Product by ID
```http
GET /api/products/{product_id}
Authorization: Bearer <access_token>
```

#### Update Product
```http
PUT /api/products/{product_id}
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "iPhone 15 Pro",
  "price": 1199.99,
  "stock": 30
}
```

#### Delete Product
```http
DELETE /api/products/{product_id}
Authorization: Bearer <access_token>
```

## 🔐 Authentication

Semua route di `/api/*` memerlukan JWT token di header:
```
Authorization: Bearer <access_token>
```

Access token berlaku selama 30 menit. Gunakan refresh token untuk mendapatkan access token baru.