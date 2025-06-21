# 📖 MashchukCRM - Project Reference (2025)

## Overview

**MashchukCRM** is a full-stack monorepo for company management:
- **Frontend:** React + TypeScript + Vite + TailwindCSS + React Query
- **Backend:** Node.js + Express + Prisma + PostgreSQL
- **Auth:** JWT + Passport.js (Local & JWT Strategies) + Refresh Tokens + Backend validation
- **CI/CD:** GitHub Actions
- **Notifications:** react-hot-toast

---

## Architecture

```
Frontend (React SPA) <-> Backend (Express API) <-> PostgreSQL
│  AuthContext (status, role, backend validation, React Query, cache clear)
│  API Services (axios interceptors, auto token refresh)
│  React Query (data fetching, caching, mutations)
│  react-hot-toast (unified notifications)
│  UI & Page Components
```

---

## 🏗️ Detailed System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend Layer                         │
├─────────────────────────────────────────────────────────────┤
│  Pages (Route Components)                                   │
│  ├─ auth/ (Login, Register)                                 │
│  ├─ Dashboard.tsx                                           │
│  ├─ Companies/ (Companies.tsx)                              │
│  ├─ Users/ (Users.tsx, UsersAdd.tsx)                        │
│  └─ Profile.tsx, History.tsx                                │
│                     ↕                                       │
│  Components (Reusable UI)                                   │
│  ├─ layout/ (Header, Sidebar)                               │
│  ├─ ui/ (Button, Input, Card)                               │
│  ├─ companies/ (CompaniesCard, CompanyDetail)               │
│  └─ users/ (UserCard)                                       │
│                     ↕                                       │
│  Hooks (React Query)                                        │
│  ├─ useCompaniesQuery.ts                                    │
│  ├─ useUsersQueries.ts                                      │
│  ├─ useDashboardQueries.ts                                  │
│  └─ useHistoryQuery.ts                                      │
│                     ↕                                       │
│  Services (API Layer)                                       │
│  ├─ authService.ts (login, register, verifyToken)           │
│  ├─ companyService.ts (CRUD + logo upload)                  │
│  ├─ userService.ts (CRUD + avatar upload)                   │
│  ├─ dashboardService.ts                                     │
│  └─ historyService.ts                                       │
│                     ↕                                       │
│  Contexts & Utils                                           │
│  ├─ AuthContext.tsx (status, role, backend validation)      │
│  └─ utils/ (action-helpers, filtering, shortener)           │
└─────────────────────────────────────────────────────────────┘
                             ↕ HTTP/JSON
┌─────────────────────────────────────────────────────────────┐
│                     Backend Layer                           │
├─────────────────────────────────────────────────────────────┤
│  Routes (API Endpoints)                                     │
│  ├─ auth.js (/login, /register, /verify, /refresh)          │
│  ├─ companies.js (CRUD + logo upload)                       │
│  ├─ users.js (CRUD + avatar upload)                         │
│  ├─ dashboard.js (stats, admins)                            │
│  └─ history.js (action logs)                                │
│                     ↕                                       │
│  Middleware Stack                                           │
│  ├─ CORS, Body Parser                                       │
│  ├─ Passport.js (JWT + Local strategies)                    │
│  ├─ Authentication (JWT verification)                       │
│  ├─ Authorization (role-based)                              │
│  └─ File Upload (multer)                                    │
│                     ↕                                       │
│ ─────────────────────────────────────────────────────────── │
│  Database Layer                                             │
│  ├─ Prisma ORM                                              │
│  ├─ PostgreSQL                                              │
│  └─ File Storage (/public/users/, /public/companies/)       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
MashchukCRM/
/project
├── 📄 package.json                 # Root monorepo config with workspaces
├── 📄 .gitignore                   # Git ignore rules
├── 📄 eslint.config.js             # ESLint configuration
├── 📄 tailwind.config.js           # Shared Tailwind CSS config
├── 📄 tsconfig.json                # Base TypeScript config
├── 📁 .github/workflows/           # CI/CD automation (Continuous (Integration/Deployment))
│   └── 📄 ci-cd.yml                # GitHub Actions workflow
├── 📁 docs/                        # Documentation
│   └── 📄 deployment.md            # Deployment instructions
├── 📁 apps/                        # Monorepo applications directory
│   ├── 📁 frontend/                # React SPA
│   │   ├── 📄 package.json         # Frontend dependencies
│   │   ├── 📄 index.html           # HTML entry point
│   │   ├── 📄 vite.config.ts       # Vite bundler config
│   │   ├── 📄 tailwind.config.js   # Frontend-specific Tailwind
│   │   ├── 📄 tsconfig.json        # Frontend TypeScript config
│   │   ├── 📁 public/              # Static assets
│   │   │   ├── 📄 _redirects       # SPA routing config
│   │   │   ├── 📁 companies/       # Company logos
│   │   │   └── 📁 users/           # User avatars
│   │   └── 📁 src/                 # Source code
│   │       ├── 📄 App.tsx          # Main App component & routing
│   │       ├── 📄 main.tsx         # React entry point
│   │       ├── 📁 components/      # Reusable UI components
│   │       │   ├── 📁 layout/      # Layout components (Header, Sidebar)
│   │       │   ├── 📁 ui/          # Basic UI components (Button, Input, Card)
│   │       │   ├── 📁 companies/   # Company-specific components
│   │       │   │   ├── 📄 CompanyModal.tsx    # Create company modal
│   │       │   │   ├── 📄 CompaniesCard.tsx   # Companies list component
│   │       │   │   ├── 📄 CompanyDetail.tsx   # Company detail view
│   │       │   │   └── 📄 index.ts            # Exports & types
│   │       │   └── 📁 users/      # User-specific components
│   │       │       ├── 📄 UserCard.tsx        # User card component
│   │       │       └── 📄 index.ts            # Exports & types
│   │       ├── 📁 contexts/       # React contexts (Auth Context API)
│   │       ├── 📁 hooks/          # Custom React (Query) hooks
│   │       │   ├── 📄 index.ts                # Hook exports
│   │       │   ├── 📄 useCompaniesQuery.ts    # Company data hooks
│   │       │   ├── 📄 useDashboardQueries.ts  # Dashboard data hooks
│   │       │   ├── 📄 useHistoryQuery.ts      # History data hooks
│   │       │   └── 📄 useUsersQueries.ts      # User data hooks
│   │       ├── 📁 pages/          # Page components (organized by feature)
│   │       │   ├── 📁 auth/       # Authentication pages
│   │       │   │   ├── 📄 LoginPage.tsx       # Login form
│   │       │   │   ├── 📄 RegisterPage.tsx    # Registration form
│   │       │   │   └── 📄 index.ts            # Exports & types
│   │       │   ├── 📄 Dashboard.tsx           # Main dashboard page
│   │       │   ├── 📄 History.tsx             # Action history page
│   │       │   ├── 📄 Profile.tsx             # User profile page
│   │       │   ├── 📁 Companies/  # Company management pages
│   │       │   │   └── 📄 Companies.tsx       # Companies list page
│   │       │   └── 📁 Users/      # User management pages
│   │       │       ├── 📄 Users.tsx           # Users list page
│   │       │       └── 📄 UsersAdd.tsx        # Add new user page
│   │       ├── 📁 services/       # API services (API layer between FE and BE with clean functions)
│   │       │   ├── 📄 api.ts                 # Axios instance&config (centralized api calls for folder)
│   │       │   ├── 📄 authService.ts         # Authentication services (/auth/ endpoints; AuthContext)
│   │       │   ├── 📄 companyService.ts      # Company services (CRUD companies; logo upload)
│   │       │   ├── 📄 dashboardService.ts    # Dashboard services
│   │       │   ├── 📄 historyService.ts      # History services (logs from BD)
│   │       │   └── 📄 userService.ts         # User services (CRUD users, FormData avatar)
│   │       ├── 📁 types/          # TypeScript interfaces
│   │       └── 📁 utils/          # Utility functions (FE helpers)
│   │           ├── 📄 action-helpers.tsx     # History util functions (conditional colors, icons)
│   │           ├── 📄 filtering-helpers.ts   # Filtering utils (filters, pagination)
│   │           ├── 📄 shortener-helpers.ts   # String shortening (numbers and names shortener)
│   │           ├── 📄 toast-helpers.ts       # Toast notifications
│   │           └── 📄 user-helpers.ts        # User-related utilities
│   │
│   └── 📁 backend/                    # Express API
│       ├── 📄 package.json            # Backend dependencies
│       ├── 📄 .env                    # Environment variables
│       ├── 📄 .env.example            # Environment template
│       ├── 📁 prisma/                 # Database layer
│       │   ├── 📄 schema.prisma       # Database schema
│       │   ├── 📄 seed.js             # Database seeding
│       │   └── 📁 migrations/         # Database migrations
│       ├── 📁 public/                 # Static file uploads
│       │   ├── 📁 companies/          # Company logo uploads
│       │   └── 📁 users/              # User avatar uploads
│       └── 📁 src/                    # Source code
│           ├── 📄 index.js            # Express server entry
│           ├── 📄 prisma.js           # Prisma client setup
│           ├── 📄 swaggerSpec.js      # Swagger API documentation config
│           ├── 📁 routes/             # API endpoints
│           │   ├── 📄 auth.js         # Authentication routes (with Swagger docs)
│           │   ├── 📄 companies.js    # Company routes (with Swagger docs)
│           │   ├── 📄 dashboard.js    # Dashboard routes (with Swagger docs)
│           │   ├── 📄 history.js      # History routes (with Swagger docs)
│           │   └── 📄 users.js        # User routes (with Swagger docs & avatar upload)
│           ├── 📁 middleware/         # Express middleware
│           │   ├── 📄 auth.js         # JWT authentication middleware
│           │   └── 📄 passport.js     # Passport.js configuration
│           ├── 📁 utils/              # Utility functions
│           │   └── 📄 tokenUtils.js   # JWT token utilities
│           └── 📁 jobs/               # Background tasks
│               └── 📄 tokenCleanup.js # Refresh token cleanup
└── 📁 node_modules/                   # Dependencies
```

---

## 🔧 Package Dependencies Analysis

### **Root Dependencies**

```json
{
  "workspaces": ["apps/frontend", "apps/backend"],
  "devDependencies": {
    "@eslint/js": "^9.9.1",          # JavaScript linting
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
    "passport-local": "^1.0.0",      # Local passport strategy
    "node-cron": "^4.1.0",           # Scheduled tasks
    "multer": "^2.0.1",              # File uploads
    "pg": "^8.16.0",                 # PostgreSQL driver
    "swagger-jsdoc": "^6.2.8",       # Swagger JSDoc generator
    "swagger-ui-express": "^5.0.0"   # Swagger UI middleware
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
┌──────────────────┐
│ axios.interceptor│
│ Add Bearer Token │
└─────────┬────────┘
          │
          ▼
    ┌─────────┐     ┌──────────────────┐
    │API Call │────▶│ Passport.js JWT  │
    └─────────┘     │ Strategy         │
          │         └─────┬────────────┘
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

### **3. Passport.js Integration (Updated 2025)**

```javascript
// passport.js Complete Strategy Setup
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

// Local Strategy for login authentication
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });
      
      if (!user || !await bcrypt.compare(password, user.password)) {
        return done(null, false, { message: "Invalid credentials" });
      }
      
      return done(null, user);
    }
  )
);

// JWT Strategy for protected routes
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });
      return done(null, user || false);
    }
  )
);

// Usage in routes
router.post("/login", 
  passport.authenticate("local", { session: false }),
  (req, res) => {
    // Generate tokens after successful authentication
    const tokens = generateTokenPair(req.user.id);
    res.json({ user: req.user, ...tokens });
  }
);

router.get("/profile", 
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ user: req.user });
  }
);
```

---

## ⚡ Express.js Framework Analysis

### **1. Server Architecture**

```javascript
// apps/backend/src/index.js
import express from "express";
import cors from "cors";
import path from "path";
import passport from "./middleware/passport.js";
import swaggerUI from 'swagger-ui-express';
import swaggerSpec from "./swaggerSpec.js";

const app = express();

// Middleware Stack (Order matters!)
app.use(cors()); // 1. CORS headers
app.use(express.json({ limit: '10mb' })); // 2. JSON body parser with file upload support
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // 3. URL encoded parser
app.use(passport.initialize()); // 4. Passport initialization

// Static file serving for uploads
app.use("/public", express.static(path.join(process.cwd(), "public")));

// API Documentation
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Route mounting
app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/history", historyRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

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
│   ├── POST /logout        # User logout
│   ├── GET /verify         # Token verification
│   ├── GET /profile        # User profile
│   └── GET /profile-passport # Alternative profile endpoint
├── /users                  # User management
│   ├── GET /               # List users (Admin+)
│   ├── POST /              # Create user with avatar upload (Admin+)
│   ├── GET /me             # Current user profile
│   ├── PUT /me             # Update current user profile
│   ├── PUT /:id            # Update user by ID (Admin+)
│   ├── PUT /change-password # Change password
│   └── DELETE /:id         # Delete user (SuperAdmin)
├── /companies              # Company management
│   ├── GET /               # List companies with pagination & filters
│   ├── GET /:id            # Get single company
│   ├── POST /              # Create company with logo upload
│   ├── PUT /:id            # Update company
│   ├── DELETE /:id         # Delete company
│   ├── POST /:id/logo      # Upload company logo
│   └── DELETE /:id/logo    # Delete company logo
├── /dashboard              # Analytics & management
│   ├── GET /stats          # Dashboard statistics
│   ├── GET /admins         # List admin users (SuperAdmin)
│   ├── POST /admins        # Create admin user (SuperAdmin)
│   ├── PUT /admins/:id     # Update admin user (SuperAdmin)
│   ├── DELETE /admins/:id  # Delete admin user (SuperAdmin)
│   ├── GET /user-companies # User's assigned companies
│   └── GET /companies-by-capital # Companies sorted by capital
├── /history                # Audit trail
│   ├── GET /               # Action history with pagination & filters
│   └── GET /:id            # Single action history entry
└── /api-docs               # Swagger API Documentation
    └── Interactive API explorer with authentication support
```

---

## 📚 API Documentation (Swagger)

### **Swagger Integration**

Проект включает полную документацию API через Swagger UI:

```javascript
// swaggerSpec.js - Configuration
import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MashchukCRM API',
      version: '1.0.0',
      description: 'API documentation for MashchukCRM',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], // JSDoc comments in route files
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
```

### **JSDoc Documentation Coverage**

Все API endpoints полностью документированы с JSDoc комментариями:

#### **🔐 Authentication Routes** (`/api/auth`)
- `POST /auth/login` - User login with credentials
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Access token refresh
- `POST /auth/logout` - User logout with token revocation
- `GET /auth/verify` - JWT token verification
- `GET /auth/profile` - Get user profile
- `GET /auth/profile-passport` - Alternative profile endpoint

#### **👥 User Management Routes** (`/api/users`)
- `GET /users` - List all users (Admin/SuperAdmin)
- `POST /users` - Create user with avatar upload (Admin/SuperAdmin)
- `GET /users/me` - Get current user profile
- `PUT /users/me` - Update current user profile
- `PUT /users/:id` - Update user by ID (Admin/SuperAdmin)
- `PUT /users/change-password` - Change user password
- `DELETE /users/:id` - Delete user (SuperAdmin only)

#### **🏢 Company Management Routes** (`/api/companies`)
- `GET /companies` - List companies with pagination & filtering
- `GET /companies/:id` - Get single company details
- `POST /companies` - Create company with logo upload
- `PUT /companies/:id` - Update company information
- `DELETE /companies/:id` - Delete company
- `POST /companies/:id/logo` - Upload/update company logo
- `DELETE /companies/:id/logo` - Remove company logo

#### **📊 Dashboard Routes** (`/api/dashboard`)
- `GET /dashboard/stats` - Dashboard statistics by role
- `GET /dashboard/admins` - List admin users (SuperAdmin)
- `POST /dashboard/admins` - Create admin user (SuperAdmin)
- `PUT /dashboard/admins/:id` - Update admin user (SuperAdmin)
- `DELETE /dashboard/admins/:id` - Delete admin user (SuperAdmin)
- `GET /dashboard/user-companies` - Get user's companies
- `GET /dashboard/companies-by-capital` - Companies sorted by capital

#### **📋 History Routes** (`/api/history`)
- `GET /history` - Action history with pagination & filtering
- `GET /history/:id` - Get single action history entry

### **Swagger UI Features**

- **Interactive Testing**: Test API endpoints directly from browser
- **Authentication Support**: JWT Bearer token authentication
- **Request/Response Examples**: Detailed schema definitions
- **File Upload Support**: Multipart form data for avatars/logos
- **Role-based Documentation**: Clear permission requirements
- **Access URL**: `http://localhost:3001/api-docs` when server is running

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

### **1. User Creation Flow (New Implementation)**

```
Frontend Form (UsersAdd Page)
     │ FormData with avatar file
     ▼
React Hook Form Validation
     │
     ▼
userService.createUser(FormData)
     │ POST /api/users (multipart/form-data)
     ▼
Express Router (/users)
     │
     ▼
multer.single('avatar') middleware
     │ Save file to /public/users/
     ▼
Role Permission Check
     │
     ▼
bcrypt.hash(password)
     │
     ▼
prisma.user.create({
  avatar: `/users/${filename}`
})
     │
     ▼
PostgreSQL INSERT with avatar URL
     │
     ▼
createActionHistory() logging
     │
     ▼
Return { user data with avatar }
     │
     ▼
Frontend redirect to /users
```

### **2. Company Logo Upload Flow**

```
Frontend File Input
     │ File selection
     ▼
FormData creation
     │ multipart/form-data
     ▼
companyService API call
     │ POST /companies/:id/logo
     ▼
multer.single('logo') middleware
     │ Save to /public/companies/
     ▼
Permission check (Owner/Admin/SuperAdmin)
     │
     ▼
Delete old logo file (if exists)
     │
     ▼
prisma.company.update({
  logoUrl: `companies/${filename}`
})
     │
     ▼
Action history logging
     │
     ▼
Return updated company with logo URL
```

### **3. Protected Route Access with File Serving**

```
Frontend API Call
     │ Authorization: Bearer <token>
     ▼
authenticateJWT middleware
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
Business Logic + DB Query with file URLs
     │
     ▼
JSON Response with file paths
     │
     ▼
Frontend displays images via /public/ static serving
```

### **3. Database Relationship Flow with File Storage**

```
User (1) ────────── (Many) Company
  │                           │
  │ avatar: String?           │ logoUrl: String?
  │ /public/users/            │ /public/companies/
  │                           │
  │ (1)                  (Many)│
  │                           │
  ▼                           ▼
RefreshToken (Many)    ActionHistory (Many)
  │                           │
  │                           │
  └─── Cleanup Job ───────────┘
       (node-cron)
       
File Storage Structure:
/public/
├── users/
│   ├── avatar-1640995200000-123456789.jpg
│   └── avatar-1640995201000-987654321.png
└── companies/
    ├── company-new-1640995200000-123456789.jpg
    └── company-comp123-1640995201000-987654321.png
```

---

## 🔄 Detailed Data Flow Diagrams

### 1. AuthContext State Management Flow

```
                    ┌─────────────────────┐
                    │   Application       │
                    │   Starts            │
                    └─────────┬───────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │   status:           │
                    │   "loading"         │
                    └─────────┬───────────┘
                              │
                              ▼
                  ┌─────────────────────────┐
                  │ Check localStorage      │
                  │ for token & user        │
                  └─────────┬───────────────┘
                            │
                ┌───────────▼──────────┐
                │ Token exists?        │
                └──────────┬───────────┘
                           │
                ┌──────────▼──────────┐
                │ YES                 │ NO
                │                     │
                ▼                     ▼
    ┌─────────────────────┐  ┌─────────────────────┐
    │ Validate token      │  │ status:             │
    │ via /auth/verify    │  │ "unauthenticated"   │
    └─────────┬───────────┘  └─────────────────────┘
              │
              ▼
    ┌─────────────────────┐
    │ Token valid?        │
    └─────────┬───────────┘
              │
    ┌─────────▼─────────┐
    │ YES               │ NO
    │                   │
    ▼                   ▼
┌─────────────────┐ ┌─────────────────────┐
│ status:         │ │ Clear storage       │
│ "authenticated" │ │ status:             │
│ user: {...}     │ │ "unauthenticated"   │
│ role: user.role │ │ user: null          │
└─────────────────┘ └─────────────────────┘
```

### 2. AuthContext Data Structure Schema

```typescript
interface AuthContextType {
  // Core state
  user: User | null;
  token: string | null;
  status: "loading" | "authenticated" | "unauthenticated";
  
  // Derived state
  role: string | null;              // user?.role || null
  isAuthenticated: boolean;         // status === "authenticated"
  loading: boolean;                 // status === "loading" (backward compatibility)
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: User) => void;
  clearCache: () => void;          // React Query cache invalidation
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "SuperAdmin" | "Admin" | "User";
  avatar?: string;
  createdAt: string;
}
```

### 3. React Query Integration Flow

```
Component Mount
     │
     ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│useCompaniesQuery│───▶│ React Query     │───▶│ companyService  │
│ Hook Called     │    │ Cache Check     │    │ API Call        │
└─────────────────┘    └─────────┬───────┘    └─────────┬───────┘
                                 │                      │
                    ┌────────────▼──────────┐           ▼
                    │ Cache Hit?            │    ┌─────────────┐
                    └────────────┬──────────┘    │ Backend API │
                                 │               │ /companies  │
                    ┌────────────▼──────────┐    └─────────┬───┘
                    │ YES               NO  │              │
                    │                       │              ▼
                    ▼                       ▼        ┌─────────────────┐
            ┌───────────────┐    ┌─────────────────┐ │ Database Query  │
            │ Return Cached │    │ Make API Call   │ │ via Prisma      │
            │ Data          │    │ Update Cache    │ └─────────┬───────┘
            └───────────────┘    └─────────────────┘           │
                    │                      │                   ▼
                    │                      │         ┌─────────────────┐
                    │                      │         │ Return JSON     │
                    │                      │         │ Response        │
                    │                      └─────────┬─────────────────┘
                    │                                │
                    ▼                                ▼
            ┌─────────────────┐              ┌─────────────────┐
            │ Component       │              │ Error Handling  │
            │ Re-renders      │              │ - Refresh token │
            │ with Data       │              │ - Show error    │
            └─────────────────┘              └─────────────────┘
```

### 4. File Upload Flow Schema

```
User Selects File
     │
     ▼
┌─────────────────┐
│ Frontend        │
│ - File Input    │
│ - FormData      │
│ - Validation    │
└─────────┬───────┘
          │ multipart/form-data
          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend Processing                       │
├─────────────────────────────────────────────────────────────┤
│ 1. Express Route Handler                                    │
│    ├─ POST /api/users (with avatar)                         │
│    └─ POST /api/companies/:id/logo                          │
│                                                             │
│ 2. Multer Middleware                                        │
│    ├─ multer.single('avatar') or multer.single('logo')      │
│    ├─ File validation (type, size)                          │
│    ├─ Generate unique filename                              │
│    └─ Save to /public/users/ or /public/companies/          │
│                                                             │
│ 3. Authentication & Authorization                           │
│    ├─ JWT token verification                                │
│    └─ Role-based access control                             │
│                                                             │
│ 4. Database Update                                          │
│    ├─ prisma.user.create() or prisma.company.update()       │
│    ├─ Store file path: "/users/filename" or                 │
│    │   "/companies/filename"                                │
│    └─ Action history logging                                │
│                                                             │
│ 5. Response                                                 │
│    └─ Return updated user/company with file URL             │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────┐
│ Frontend        │
│ - Update UI     │
│ - Show image    │
│ - Cache refresh │
└─────────────────┘
```

### 5. Database Schema Relationships

```
┌─────────────────────────────┐
│           User              │
├─────────────────────────────┤
│ id: String (PK)             │
│ email: String (UNIQUE)      │
│ firstName: String           │
│ lastName: String            │
│ role: Enum                  │
│ avatar: String?             │
│ password: String            │
│ createdAt: DateTime         │
└─────────────┬───────────────┘
              │ 1:M
              ▼
┌─────────────────────────────┐
│        Company              │
├─────────────────────────────┤
│ id: String (PK)             │
│ name: String                │
│ service: String             │
│ capital: Int                │
│ status: String              │
│ logoUrl: String?            │
│ userId: String (FK)         │
│ createdAt: DateTime         │
└─────────────┬───────────────┘
              │ 1:M
              ▼
┌─────────────────────────────┐
│      ActionHistory          │
├─────────────────────────────┤
│ id: String (PK)             │
│ action: String              │
│ type: String                │
│ details: String             │
│ target: String?             │
│ userId: String (FK)         │
│ companyId: String? (FK)     │
│ createdAt: DateTime         │
└─────────────────────────────┘

┌─────────────────────────────┐
│      RefreshToken           │
├─────────────────────────────┤
│ id: String (PK)             │
│ token: String (UNIQUE)      │
│ userId: String (FK)         │
│ expiresAt: DateTime         │
│ createdAt: DateTime         │
└─────────────────────────────┘
              ▲
              │ 1:M
              │
┌─────────────┴───────────────┐
│           User              │
│       (Same as above)       │
└─────────────────────────────┘
```

### 6. API Request/Response Flow

```
Frontend Component
     │ Action triggered (useQuery, useMutation)
     ▼
React Query Hook
     │ Cache check, decide to fetch
     ▼
Service Function (authService, companyService, etc.)
     │ Prepare request data
     ▼
Axios Instance (/api.ts)
     │ Add Authorization header
     │ Add interceptors for token refresh
     ▼
Backend Express Route
     │
     ▼
┌─────────────────────────────────────────┐
│           Middleware Stack              │
├─────────────────────────────────────────┤
│ 1. CORS ────────────────────────────────│
│ 2. Body Parser ─────────────────────────│
│ 3. Passport.js Init ────────────────────│
│ 4. Route Matching ──────────────────────│
│ 5. Authentication (Passport.js JWT Strategy) ──────────│
│ 6. Authorization (role check) ──────────│
│ 7. File Upload (if needed) ─────────────│
└─────────────────────────────────────────┘
     │
     ▼
Route Handler Function
     │ Business logic
     ▼
Prisma Database Query
     │ SQL generation and execution
     ▼
PostgreSQL Database
     │ Return query results
     ▼
Express Response
     │ JSON serialization
     ▼
Axios Response
     │ HTTP response handling
     ▼
React Query
     │ Cache update, component re-render
     ▼
Component Update
```

### 7. Role-Based Access Control Flow

```
                    ┌─────────────────────┐
                    │ User Makes Request  │
                    └─────────┬───────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │ JWT Token           │
                    │ Verification        │
                    └─────────┬───────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │ Extract User Role   │
                    │ from Token Payload  │
                    └─────────┬───────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Role Authorization                         │
├─────────────────────────────────────────────────────────────┤
│  SuperAdmin                                                 │
│  ├─ All operations                                          │
│  ├─ User management (create, update, delete)                │
│  ├─ Company management                                      │
│  └─ Admin management                                        │
│                                                             │
│  Admin                                                      │
│  ├─ User management (create, update)                        │
│  ├─ Company management                                      │
│  └─ History viewing                                         │
│                                                             │
│  User                                                       │
│  ├─ Own profile management                                  │
│  ├─ Assigned companies (view, edit)                         │
│  └─ Limited dashboard access                                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │ Access Granted      │
                    │ or                  │
                    │ 403 Forbidden       │
                    └─────────────────────┘
```

**This comprehensive reference guide now includes detailed flow diagrams and schemas for better understanding of the system architecture and data flow.**
