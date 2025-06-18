# 📖 MashchukCRM - Comprehensive Project Reference Guide

## 🎯 Project Overview

**MashchukCRM** - Full-stack монорепозиторий для управления компаниями с современной архитектурой:

- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Backend**: Node.js + Express.js + Prisma ORM + PostgreSQL
- **Authentication**: JWT + Passport.js + Refresh Tokens
- **Deployment**: Render.com (раздельные сервисы)
- **CI/CD**: GitHub Actions

---

## 🏗️ Architecture Overview

```
┌────────────────────────────────────────────────────────────-─┐
│                    MashchukCRM Monorepo                      │
├────────────────────────────────────────────────────────────-─┤
│  Frontend (React SPA)     │     Backend (Express API)        │
│  Port: 5173               │     Port: 3001                   │
│  ┌─────────────────────┐  │  ┌─────────────────────────────┐ │
│  │ React Components    │  │  │ Express Routes              │ │
│  │ ├─ Auth Context     │◄─┼──┤ ├─ /api/auth                │ │
│  │ ├─ API Service      │  │  │ ├─ /api/users               │ │
│  │ ├─ UI Components    │  │  │ ├─ /api/companies           │ │
│  │ └─ Page Components  │  │  │ └─ /api/dashboard           │ │
│  └─────────────────────┘  │  │                             │ │
│           │               │  │ Middleware Layer            │ │
│           │ HTTP/JSON     │  │ ├─ JWT Authentication       │ │
│           │               │  │ ├─ Passport.js Strategy     │ │
│           │               │  │ ├─ Role Authorization       │ │
│           └───────────────┼──┤ └─ CORS & Body Parser       │ │
│                           │  │                             │ │
│                           │  │ Database Layer              │ │
│                           │  │ ├─ Prisma ORM               │ │
│                           │  │ ├─ PostgreSQL Connection    │ │
│                           │  │ └─ Migration System         │ │
└─────────────────────────────┼────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────────┐
                    │   PostgreSQL DB      │
                    │ ┌──────────────────┐ │
                    │ │ Tables:          │ │
                    │ │ ├─ users         │ │
                    │ │ ├─ companies     │ │
                    │ │ ├─ refresh_tokens│ │
                    │ │ └─ action_history│ │
                    │ └──────────────────┘ │
                    └──────────────────────┘
```

---

## 📁 Project Structure

```
mashchukCRM/
├── 📄 package.json                 # Root monorepo config with workspaces
├── 📄 .gitignore                   # Git ignore rules
├── 📄 eslint.config.js             # ESLint configuration
├── 📄 tailwind.config.js           # Shared Tailwind CSS config
├── 📄 tsconfig.json                # Base TypeScript config
├── 📄 render.yaml                  # Render.com deployment config
├── 📄 JWT_AUTHENTICATION_GUIDE.md  # Detailed auth documentation
├── 📄 IMPLEMENTATION_SUMMARY.md    # Project implementation summary
├── 📁 .github/workflows/           # CI/CD automation (Continuous (Integration/Deployment))
│   └── 📄 ci-cd.yml               # GitHub Actions workflow
├── 📁 docs/                       # Documentation
│   └── 📄 deployment.md           # Deployment instructions
├── 📁 apps/                       # Monorepo applications directory
│   ├── 📁 frontend/               # React SPA
│   │   ├── 📄 package.json        # Frontend dependencies
│   │   ├── 📄 index.html          # HTML entry point
│   │   ├── 📄 vite.config.ts      # Vite bundler config
│   │   ├── 📄 tailwind.config.js  # Frontend-specific Tailwind
│   │   ├── 📄 tsconfig.json       # Frontend TypeScript config
│   │   ├── 📁 public/             # Static assets
│   │   │   ├── 📄 _redirects      # SPA routing config
│   │   │   └── 📁 companies/      # Company logos
│   │   └── 📁 src/                # Source code
│   │       ├── 📄 App.tsx         # Main App component & routing
│   │       ├── 📄 main.tsx        # React entry point
│   │       ├── 📁 components/     # Reusable UI components
│   │       │   ├── 📁 layout/     # Layout components (Header, Sidebar)
│   │       │   ├── 📁 ui/         # Basic UI components (Button, Input, Card)
│   │       │   ├── 📁 companies/  # Company-specific components
│   │       │   │   ├── 📄 CompanyModal.tsx    # Create company modal
│   │       │   │   ├── 📄 CompaniesCard.tsx   # Companies list component
│   │       │   │   ├── 📄 CompanyDetail.tsx   # Company detail view
│   │       │   │   └── 📄 index.ts           # Exports & types
│   │       │   └── 📁 users/      # User-specific components
│   │       │       ├── 📄 AddUserModal.tsx   # Create/edit user modal
│   │       │       └── 📄 index.ts           # Exports & types
│   │       ├── 📁 contexts/       # React contexts (Auth)
│   │       ├── 📁 hooks/          # Custom React hooks
│   │       ├── 📁 pages/          # Page components (organized by feature)
│   │       │   ├── 📁 auth/       # Authentication pages
│   │       │   │   ├── 📄 LoginPage.tsx      # Login form
│   │       │   │   ├── 📄 RegisterPage.tsx   # Registration form
│   │       │   │   └── 📄 index.ts           # Exports & types
│   │       │   ├── 📁 dashboard/  # Dashboard pages
│   │       │   │   └── 📄 DashboardPage.tsx  # Main dashboard
│   │       │   ├── 📁 companies/  # Company management pages
│   │       │   │   └── 📄 CompaniesPage.tsx  # Companies list page
│   │       │   ├── 📁 users/      # User management pages
│   │       │   │   └── 📄 UsersPage.tsx      # Users list page
│   │       │   ├── 📁 profile/    # User profile pages
│   │       │   │   └── 📄 ProfilePage.tsx    # User profile
│   │       │   └── 📁 history/    # Action history pages
│   │       │       └── 📄 HistoryPage.tsx    # Action history list
│   │       ├── 📁 services/       # API services
│   │       ├── 📁 types/          # TypeScript interfaces
│   │       └── 📁 utils/          # Utility functions
│   └── 📁 backend/                # Express API
│       ├── 📄 package.json        # Backend dependencies
│       ├── 📄 .env                # Environment variables
│       ├── 📄 .env.example        # Environment template
│       ├── 📁 prisma/             # Database layer
│       │   ├── 📄 schema.prisma   # Database schema
│       │   ├── 📄 seed.js         # Database seeding
│       │   └── 📁 migrations/     # Database migrations
│       └── 📁 src/                # Source code
│           ├── 📄 index.js        # Express server entry
│           ├── 📄 prisma.js       # Prisma client setup
│           ├── 📁 routes/         # API endpoints
│           ├── 📁 middleware/     # Express middleware
│           ├── 📁 utils/          # Utility functions
│           └── 📁 jobs/           # Background tasks
└── 📁 node_modules/               # Dependencies
```

---

## 🔧 Package Dependencies Analysis

### **Root Dependencies**

```json
{
  "workspaces": ["apps/frontend", "apps/backend"],
  "devDependencies": {
    "@eslint/js": "^9.9.1",           # JavaScript linting
    "concurrently": "^8.2.2",        # Run multiple commands
    "eslint": "^9.9.1",              # Code linting
    "globals": "^15.9.0",            # Global variables for ESLint
    "typescript": "^5.5.3",          # TypeScript compiler
    "typescript-eslint": "^8.3.0"    # TypeScript ESLint rules
  }
}
```

### **Frontend Dependencies**

```json
{
  "dependencies": {
    "react": "^18.3.1",                # UI library
    "react-dom": "^18.3.1",            # DOM renderer
    "react-router-dom": "^6.29.0",     # Client-side routing
    "axios": "^1.7.9",                 # HTTP client
    "lucide-react": "^0.469.0",        # Icon library
    "@tanstack/react-query": "^5.62.7" # Data fetching/caching
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.3",  # Vite React plugin
    "vite": "^6.0.7",                  # Build tool
    "tailwindcss": "^3.4.17",          # CSS framework
    "autoprefixer": "^10.4.20",        # CSS post-processor
    "postcss": "^8.5.0"                # CSS processor
  }
}
```

### **Backend Dependencies**

```json
{
  "dependencies": {
    "@prisma/client": "^6.9.0",      # Database ORM client
    "express": "^4.18.2",            # Web framework
    "cors": "^2.8.5",                # Cross-origin requests
    "bcryptjs": "^2.4.3",            # Password hashing
    "jsonwebtoken": "^9.0.2",        # JWT tokens
    "passport": "^0.7.0",            # Authentication middleware
    "passport-jwt": "^4.0.1",        # JWT passport strategy
    "node-cron": "^4.1.0",           # Scheduled tasks
    "multer": "^2.0.1",              # File uploads
    "pg": "^8.16.0"                  # PostgreSQL driver
  },
  "devDependencies": {
    "prisma": "^6.9.0",              # Database toolkit
    "nodemon": "^3.0.2",             # Auto-restart server
    "dotenv-cli": "^7.4.2"           # Environment variables
  }
}
```

---

## 🔐 Authentication Flow Deep Dive

### **1. JWT + Refresh Token Architecture**

```
User Login Request
       │
       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│                 │    │                 │    │                 │
│ LoginPage Form  │───▶│ POST /auth/login│───▶│ Verify User     │
│                 │    │                 │    │ (bcrypt)        │
│                 │    │ Generate Tokens │◄───│                 │
│                 │◄───│ - Access (15m)  │    │ Store Refresh   │
│ Store Tokens    │    │ - Refresh (7d)  │───▶│ Token in DB     │
│ - localStorage  │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **2. API Request with Auto Token Refresh**

```
API Request
     │
     ▼
┌─────────────────┐
│ axios.interceptor│
│ Add Bearer Token│
└─────────┬───────┘
          │
          ▼
    ┌─────────┐     ┌────────────────┐
    │API Call │────▶│ authenticateToken│
    └─────────┘     │ middleware      │
          │         └─────┬──────────┘
          │               │
          │          Valid Token?
          │               │
          ▼               ▼
    ┌─────────┐      ┌─────────┐
    │Success  │      │401 Error│
    │Response │      └─────┬───┘
    └─────────┘            │
                           ▼
                   ┌─────────────────┐
                   │Auto Refresh Flow│
                   │1. Get refresh   │
                   │2. POST /refresh │
                   │3. New tokens    │
                   │4. Retry request │
                   └─────────────────┘
```

### **3. Passport.js Integration**

```javascript
// passport.js Strategy Setup
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    async (payload, done) => {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });
      return done(null, user ? { userId: payload.userId, ...user } : false);
    }
  )
);

// Usage in routes
router.get(
  "/profile-passport",
  passport.authenticate("jwt", { session: false }),
  handler
);
```

---

## ⚡ Express.js Framework Analysis

### **1. Server Architecture**

```javascript
// apps/backend/src/index.js
import express from "express";
import cors from "cors";
import passport from "./middleware/passport.js";

const app = express();

// Middleware Stack (Order matters!)
app.use(cors()); // 1. CORS headers
app.use(express.json()); // 2. JSON body parser
app.use(passport.initialize()); // 3. Passport initialization

// Route mounting
app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/history", historyRoutes);

app.listen(PORT);
```

### **2. Middleware Chain**

```
HTTP Request
     │
     ▼
┌─────────────┐
│ CORS        │ ← Allow cross-origin requests
├─────────────┤
│ Body Parser │ ← Parse JSON requests
├─────────────┤
│ Passport    │ ← Initialize auth strategies
├─────────────┤
│ Route       │ ← Match URL to handler
├─────────────┤
│ Auth        │ ← authenticateToken middleware
├─────────────┤
│ Role Check  │ ← requireRole middleware
├─────────────┤
│ Controller  │ ← Business logic
└─────────────┘
     │
     ▼
HTTP Response
```

### **3. Route Structure**

```
/api
├── /auth                    # Authentication endpoints
│   ├── POST /login         # User login
│   ├── POST /register      # User registration
│   ├── POST /refresh       # Token refresh
│   ├── POST /logout        # Single device logout
│   ├── POST /logout-all    # All devices logout
│   └── GET /verify         # Token verification
├── /users                  # User management
│   ├── GET /               # List users (Admin+)
│   ├── POST /              # Create user (SuperAdmin)
│   ├── PUT /:id            # Update user
│   └── DELETE /:id         # Delete user (SuperAdmin)
├── /companies              # Company management
│   ├── GET /               # List companies
│   ├── POST /              # Create company
│   ├── PUT /:id            # Update company
│   └── DELETE /:id         # Delete company
├── /dashboard              # Analytics
│   └── GET /stats          # Dashboard statistics
└── /history                # Audit trail
    └── GET /               # Action history
```

---

## 🗄️ Database Layer (Prisma + PostgreSQL)

### **1. Prisma ORM Architecture**

```
┌─────────────────────────────────────────────────────────┐
│                   Prisma Ecosystem                     │
├─────────────────────────────────────────────────────────┤
│  schema.prisma          │  Prisma Client              │
│  ┌─────────────────┐    │  ┌─────────────────────────┐ │
│  │ Data Models     │───▶│  │ Generated JavaScript    │ │
│  │ - User          │    │  │ Client with Methods     │ │
│  │ - Company       │    │  │ - prisma.user.findMany()│ │
│  │ - RefreshToken  │    │  │ - prisma.company.create│ │
│  │ - ActionHistory │    │  │ - Type Safety           │ │
│  └─────────────────┘    │  └─────────────────────────┘ │
│                         │                             │
│  Migrations             │  Database Operations        │
│  ┌─────────────────┐    │  ┌─────────────────────────┐ │
│  │ SQL Files       │───▶│  │ PostgreSQL Database     │ │
│  │ - Schema Changes│    │  │ - ACID Transactions     │ │
│  │ - Version Control│   │  │ - Indexes & Relations   │ │
│  │ - Auto-generated│    │  │ - Data Validation       │ │
│  └─────────────────┘    │  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### **2. Database Schema**

```prisma
// User Model
model User {
  id           String    @id @default(cuid())
  email        String    @unique
  password     String
  firstName    String
  lastName     String
  role         UserRole  @default(User)
  avatar       String?

  // Relations
  companies    Company[]
  refreshTokens RefreshToken[]
  actionHistory ActionHistory[]

  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

// Role-based Access Control
enum UserRole {
  SuperAdmin    # Full system access
  Admin         # Manage users & companies
  User          # View assigned companies
}
```

### **3. Prisma Client Usage Patterns**

```javascript
// Create with relations
const company = await prisma.company.create({
  data: {
    name: "TechCorp",
    service: "Software",
    capital: 1000000,
    userId: "user-id",
  },
  include: {
    owner: true,
    actionHistory: true,
  },
});

// Complex queries with filtering
const companies = await prisma.company.findMany({
  where: {
    OR: [{ userId: req.user.id }, { userId: null }],
    status: "Active",
  },
  include: {
    owner: {
      select: {
        firstName: true,
        lastName: true,
        email: true,
      },
    },
  },
});
```

---

## 🚀 CI/CD Pipeline (GitHub Actions)

### **1. Workflow Structure (.github/workflows/ci-cd.yml)**

```yaml
name: CI/CD Pipeline
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  # 1. Testing & Linting
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Run linting
        run: npm run lint

  # 2. Build & Deploy
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Render
        run: echo "Triggered by Render webhook"
```

### **2. Deployment Flow**

```
Git Push to main
       │
       ▼
┌─────────────────┐
│ GitHub Actions  │
│ 1. Install deps │
│ 2. Run tests    │
│ 3. Run linting  │
│ 4. Build check  │
└─────┬───────────┘
      │ Success?
      ▼
┌─────────────────┐    ┌─────────────────┐
│ Render Webhook  │───▶│ Render.com      │
│ Auto-triggered  │    │ 1. Pull code    │
└─────────────────┘    │ 2. Build        │
                       │ 3. Deploy       │
                       │ 4. Health check │
                       └─────────────────┘
```

---

## 📄 YAML Files Explained

### **What is YAML?**

**YAML** (YAML Ain't Markup Language) - человекочитаемый формат сериализации данных.

### **Key Features:**

- **Indentation-based** (как Python)
- **Case-sensitive**
- **No tabs** (только пробелы)
- **Comments** с `#`

### **1. render.yaml (Render.com Configuration)**

```yaml
services:
  # Backend Web Service
  - type: web
    name: mashchuk-crm-backend
    runtime: node
    buildCommand: npm install && npm run build --workspace=apps/backend
    startCommand: npm run start --workspace=apps/backend
    rootDir: ./
    env:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: mashchuk-crm-db
          property: connectionString

  # Frontend Static Site
  - type: web
    name: mashchuk-crm-frontend
    runtime: static
    buildCommand: npm install && npm run build --workspace=apps/frontend
    staticPublishPath: ./apps/frontend/dist
    rootDir: ./

# Managed PostgreSQL Database
databases:
  - name: mashchuk-crm-db
    databaseName: mashchuk_crm
    user: postgres
```

### **2. GitHub Actions YAML Structure**

```yaml
# Workflow metadata
name: CI/CD Pipeline
on: # Triggers
  push:
    branches: [main]
  pull_request:
    branches: [main]

# Job definitions
jobs:
  test: # Job name
    runs-on: ubuntu-latest # Runner environment
    steps: # Sequential steps
      - name: Checkout # Step name
        uses: actions/checkout@v4 # Predefined action

      - name: Setup Node
        uses: actions/setup-node@v4
        with: # Action parameters
          node-version: "18"
          cache: "npm"

      - name: Install
        run: npm ci # Shell command
```

---

## 🔄 Data Flow Analysis

### **1. User Registration Flow**

```
Frontend Form (RegisterPage)
     │ POST /api/auth/register
     ▼
Express Router (/auth)
     │
     ▼
bcrypt.hash(password)
     │
     ▼
prisma.user.create()
     │
     ▼
PostgreSQL INSERT
     │
     ▼
generateTokenPair()
     │
     ▼
Store Refresh Token in DB
     │
     ▼
Return { user, accessToken, refreshToken }
     │
     ▼
Frontend stores in localStorage
```

### **2. Protected Route Access**

```
Frontend API Call (from Pages/Components)
     │ Authorization: Bearer <token>
     ▼
authenticateToken middleware
     │
     ▼
jwt.verify(token, secret)
     │
     ▼
prisma.user.findUnique()
     │
     ▼
req.user = userData
     │
     ▼
requireRole(['Admin', 'SuperAdmin'])
     │
     ▼
Route Handler
     │
     ▼
Business Logic + DB Query
     │
     ▼
JSON Response
```

### **3. Database Relationship Flow**

```
User (1) ────────── (Many) Company
  │                           │
  │                           │
  │ (1)                  (Many)│
  │                           │
  ▼                           ▼
RefreshToken (Many)    ActionHistory (Many)
  │                           │
  │                           │
  └─── Cleanup Job ───────────┘
       (node-cron)
```

---

## 🛠️ Development Commands Reference

### **Monorepo Commands**

```bash
# Development
npm run dev                 # Start both frontend & backend
npm run dev:frontend        # Start only frontend (port 5173)
npm run dev:backend         # Start only backend (port 3001)

# Building
npm run build               # Build both apps
npm run build:frontend      # Build frontend only
npm run build:backend       # Build backend only

# Quality
npm run lint                # Lint both apps
npm test                    # Run tests

# Database
npm run migrate             # Run database migrations
npm run seed                # Seed database with test data
npm run studio              # Open Prisma Studio (port 5555)
```

### **Individual Workspace Commands**

```bash
# Frontend workspace
npm run dev --workspace=apps/frontend
npm run build --workspace=apps/frontend

# Backend workspace
npm run dev --workspace=apps/backend
npm run start --workspace=apps/backend
npm run migrate --workspace=apps/backend
```

---

## 🎯 Key Integration Points

### **1. Frontend ↔ Backend**

- **Protocol**: HTTP/JSON over REST API
- **Authentication**: Bearer tokens in Authorization header
- **Error Handling**: Axios interceptors for token refresh
- **Type Safety**: Shared TypeScript interfaces
- **Component Architecture**:
  - **Pages**: Route-level components in `/pages` organized by feature
  - **Components**: Reusable UI components in `/components` organized by domain
  - **Modular Structure**: Each feature has its own index.ts with exports and types

### **2. Component Organization**

```
Frontend Architecture
├── 📁 pages/              # Route-level components
│   ├── auth/             # Authentication flows
│   ├── dashboard/        # Analytics & overview
│   ├── companies/        # Company management
│   ├── users/           # User management
│   ├── profile/         # User profile
│   └── history/         # Action tracking
├── 📁 components/        # Reusable components
│   ├── layout/          # App layout (Header, Sidebar)
│   ├── ui/             # Basic UI components
│   ├── companies/      # Company-specific components
│   └── users/          # User-specific components
└── 📁 services/         # API integration layer
```

### **3. Backend ↔ Database**

- **ORM**: Prisma Client with type-safe queries
- **Connection**: PostgreSQL with connection pooling
- **Migrations**: Version-controlled schema changes
- **Seeding**: Automated test data insertion

### **4. Code ↔ Deployment**

- **CI**: GitHub Actions for testing & validation
- **CD**: Render.com webhooks for auto-deployment
- **Environment**: Separate configs for dev/staging/prod
- **Monitoring**: Health checks & error logging

---

## 🚨 Critical Dependencies Chain

```
Node.js Runtime
     │
     ▼
Express.js Framework
     │
     ├─ Middleware Stack
     │  ├─ CORS (cors)
     │  ├─ Body Parser (express.json)
     │  ├─ Authentication (passport + jsonwebtoken)
     │  └─ Authorization (custom middleware)
     │
     ├─ Database Layer
     │  ├─ Prisma ORM (@prisma/client)
     │  ├─ PostgreSQL Driver (pg)
     │  └─ Connection Pool
     │
     └─ Security Layer
        ├─ Password Hashing (bcryptjs)
        ├─ JWT Tokens (jsonwebtoken)
        ├─ Refresh Token Storage
        └─ Role-based Access Control
```

---

## 📋 Quick Start Checklist

1. **Clone & Install**

   ```bash
   git clone <repo>
   npm install
   ```

2. **Database Setup**

   ```bash
   # Create PostgreSQL database
   npm run migrate
   npm run seed
   ```

3. **Environment**

   ```bash
   # Copy and configure .env files
   cp apps/backend/.env.example apps/backend/.env
   ```

4. **Development**

   ```bash
   npm run dev  # Starts both frontend & backend
   ```

5. **Verify**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001/api/health
   - Prisma: http://localhost:5555

---

**🎉 Готово! Теперь у вас есть complete reference guide для понимания всей архитектуры проекта за 5 минут.**
