# 🛒 Demo E-Commerce Shop — Backend API

A structured REST API for an e-commerce platform built with **Node.js**, **TypeScript**, and **Express.js**.

---

## 🚀 Tech Stack

| Technology | Purpose |
|---|---|
| Node.js + TypeScript | Runtime & Language |
| Express.js | HTTP Framework |
| PostgreSQL | Database |
| JWT | Authentication |
| bcrypt | Password Hashing |
| dotenv | Environment Variables |

---

## 🏗️ Architecture

This project follows a **Layered Architecture** pattern:

```
Request → Controller → Service → Repository → Database
```

- **Controller** — Handles HTTP requests and responses
- **Service** — Business logic and validation
- **Repository** — Database queries (SQL)

---

## 📁 Project Structure

```
src/
├── controllers/
│   ├── user.controller.ts
│   ├── product.controller.ts
│   ├── order.controller.ts
│   └── cart.controller.ts
├── services/
│   ├── user.service.ts
│   ├── product.service.ts
│   ├── order.service.ts
│   └── cart.service.ts
├── repositories/
│   ├── user.repository.ts
│   ├── product.repository.ts
│   ├── order.repository.ts
│   └── cart.repository.ts
├── middleware/
│   ├── auth.middleware.ts
│   ├── asyncHandler.ts
│   ├── errorHandler.ts
│   └── types/
│       ├── AppError.ts
│       └── adminMiddleware.ts
├── routes.ts
├── app.ts
└── server.ts
```

---

## 🔐 Authentication & Authorization

- **JWT** tokens for session management
- **bcrypt** for secure password hashing
- **Role-based access control** — `user` and `admin` roles
- Protected routes via `authMiddleware` and `adminMiddleware`

---

## 📋 API Endpoints

### Auth
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login and get JWT token | Public |

### Products
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/task` | Get all products (with filters) | Public |
| GET | `/api/task/:id` | Get product by ID | Public |
| POST | `/api/task` | Create product | Admin |

### Orders
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/orders` | Create order | User |
| GET | `/api/orders` | Get user orders | User |
| GET | `/api/orders/:id` | Get order by ID | User |

### Cart
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/cart` | Get cart | User |
| POST | `/api/cart` | Add item to cart | User |
| DELETE | `/api/cart/:id` | Remove item from cart | User |

---

## ⚙️ Features

- ✅ User registration and login
- ✅ JWT authentication
- ✅ Role-based authorization (Admin / User)
- ✅ Product listing with search, filters, sorting and pagination
- ✅ Order creation with database transactions
- ✅ Shopping cart management
- ✅ Global error handling middleware
- ✅ SQL Injection protection

---

## 🗄️ Database Schema

```sql
users         — id, email, password, username, role, created_at
categories    — id, name
products      — id, name, description, price, stock_quantity, category_id, created_at
orders        — id, user_id, status, total_price, created_at
order_items   — id, order_id, product_id, quantity, price
carts         — id, user_id, created_at
cart_items    — id, cart_id, product_id, quantity, added_at
```

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js v18+
- PostgreSQL

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/YordanB-Dev/Demo-E---Comerse-Shop.git
cd Demo-E---Comerse-Shop

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env

# 4. Fill in your .env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/yourdb
JWT_SECRET=your_secret_key

# 5. Run the database schema
# Execute the SQL from schema.sql in pgAdmin or psql

# 6. Start the server
npm run dev
```

---

## 👨‍💻 Author

**Yordan Borisov** — Node.js / TypeScript Backend Developer

- GitHub: [@YordanB-Dev](https://github.com/YordanB-Dev)
