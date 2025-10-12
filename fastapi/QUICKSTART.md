# 🚀 Quick Start Guide - BuildCraft RealEstate API

## ⚡ Start the Server (3 Ways)

### Method 1: Using start.py script (Easiest)

```bash
cd /home/om_patil/Desktop/Codes/projects/RealEstate/fastapi

# Default (port 8000, auto-reload)
python start.py

# Custom port
python start.py --port 8001

# Production mode (no auto-reload)
python start.py --no-reload
```

### Method 2: Using main.py directly

```bash
cd /home/om_patil/Desktop/Codes/projects/RealEstate/fastapi

python main.py
```

### Method 3: Using uvicorn command

```bash
cd /home/om_patil/Desktop/Codes/projects/RealEstate/fastapi

uvicorn main:app --reload --port 8000
```

---

## 📚 Access API Documentation

Once server is running:

-   **Swagger UI (Interactive)**: http://localhost:8000/api/docs
-   **ReDoc (Clean)**: http://localhost:8000/api/redoc
-   **Health Check**: http://localhost:8000/health

---

## 🏗️ Project Structure

```
fastapi/
├── main.py              ← 🎯 Main entry point (START HERE)
├── start.py             ← 🚀 Easy startup script
├── database/
│   ├── auth.py          ← 🔐 Authentication
│   ├── database.py      ← 💾 Database config
│   ├── models.py        ← 📊 Data models
│   ├── schemas.py       ← 📋 API schemas
│   └── crud.py          ← 🔧 Database operations
└── routes/              ← 📍 All API routes
    ├── auth.py          ← Login/Register
    ├── projects.py      ← Projects
    ├── bookings.py      ← Bookings
    ├── appointments.py  ← Appointments
    ├── messages.py      ← Messages
    ├── payments.py      ← Payments
    └── notifications.py ← Notifications
```

---

## 🔑 Quick API Test

### 1. Register a User

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "user_type": "customer",
    "full_name": "Test User",
    "phone": "1234567890"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Use Token

```bash
# Save token from login response
TOKEN="your_access_token_here"

# Make authenticated request
curl http://localhost:8000/api/projects \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📋 All API Endpoints

### 🔐 Authentication

-   `POST /api/auth/register` - Register
-   `POST /api/auth/login` - Login
-   `GET /api/auth/me` - Get profile

### 🏢 Projects

-   `GET /api/projects` - List all
-   `GET /api/projects/{id}` - Get one
-   `POST /api/projects` - Create (builder)
-   `PATCH /api/projects/{id}` - Update (builder)

### 🏠 Units

-   `POST /api/units` - Create (builder)

### 📝 Bookings

-   `POST /api/bookings` - Create (customer)
-   `GET /api/builder/bookings` - List (builder)
-   `GET /api/bookings/{id}` - Get details

### 📅 Appointments

-   `POST /api/appointments` - Create
-   `GET /api/appointments` - List with filters
-   `PATCH /api/appointments/{id}/status` - Update status

### 💬 Messages

-   `GET /api/messages/conversations` - Get conversations
-   `POST /api/messages` - Send message
-   `GET /api/messages/conversation/{customer}/{project}` - Get messages

### 💰 Payments

-   `POST /api/payments` - Record payment (builder)

### 🔔 Notifications

-   `GET /api/notifications` - Get notifications
-   `PATCH /api/notifications/{id}/read` - Mark read

---

## 🔧 Configuration

### Environment Variables (optional)

Create `.env` file:

```env
DATABASE_URL=postgresql://user:password@localhost/buildcraft_db
SECRET_KEY=your-secret-key-here
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Database Setup

```bash
# Initialize database
python init_db.py
```

---

## 🐛 Troubleshooting

### Port already in use?

```bash
# Use different port
python start.py --port 8001
```

### Import errors?

```bash
# Install dependencies
pip install -r requirements.txt
```

### Database connection issues?

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Or start it
sudo systemctl start postgresql
```

---

## 📖 More Documentation

-   **Full Architecture Guide**: `MODULAR_ARCHITECTURE.md`
-   **API Integration Guide**: `BUILDER_PAGES_API.md`
-   **Database Schema**: `DATABASE_SCHEMA.md`

---

## ✨ That's It!

Your API is ready to use! 🎉

**Default URL**: http://localhost:8000  
**API Docs**: http://localhost:8000/api/docs  
**Health Check**: http://localhost:8000/health
