# MashchukCRM - Enterprise CRM System

A modern, full-stack CRM application built with React, TypeScript, Node.js, and PostgreSQL.

## 🏗️ **Monorepo Structure**

```
mashchukCRM/
├── apps/
│   ├── frontend/              # React + TypeScript + Vite
│   │   ├── src/              # React components and logic
│   │   ├── public/           # Static assets
│   │   └── package.json      # Frontend dependencies
│   └── backend/              # Node.js + Express + Prisma
│       ├── src/              # API routes and middleware
│       ├── prisma/           # Database schema and migrations
│       └── package.json      # Backend dependencies
├── .github/workflows/        # CI/CD automation
├── package.json              # Root workspace configuration
└── render.yaml              # Render.com deployment config
```

## 🚀 **Quick Start**

### **Prerequisites**

- Node.js 18+
- npm 8+
- PostgreSQL 13+

### **Local Development**

```bash
# Clone the repository
git clone <your-repo-url>
cd mashchukCRM

# Install all dependencies
npm install

# Set up environment variables
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# Configure your database URL in apps/backend/.env
# DATABASE_URL="postgresql://username:password@localhost:5432/mycrm"

# Run database migrations
npm run migrate

# Start development servers (both frontend and backend)
npm run dev
```

### **Available Scripts**

```bash
# Development
npm run dev                   # Start both frontend and backend
npm run dev:frontend         # Start only frontend (port 5173)
npm run dev:backend          # Start only backend (port 3001)

# Building
npm run build                # Build both applications
npm run build:frontend       # Build only frontend
npm run build:backend        # Build only backend

# Linting & Testing
npm run lint                 # Lint both applications
npm run test                 # Run tests for both applications

# Database
npm run migrate              # Run database migrations
npm run seed                 # Seed database with initial data
```

## 🌐 **Deployment**

### **Render.com (Recommended)**

This project is configured for deployment on Render.com with:

- **Backend**: Web Service (Node.js)
- **Frontend**: Static Site
- **Database**: Managed PostgreSQL

#### **Deploy Steps:**

1. Connect your GitHub repository to Render.com
2. Render will automatically detect `render.yaml` configuration
3. Set up environment variables in Render dashboard:
   - Backend: `JWT_SECRET`, `REFRESH_SECRET`, `DATABASE_URL`
   - Frontend: `VITE_API_URL`

#### **Manual Deploy:**

```bash
# Build for production
npm run build

# Backend will be deployed as Node.js service
# Frontend will be deployed as static site from apps/frontend/dist
```

### **Environment Variables**

#### **Backend (.env)**

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
REFRESH_SECRET="your-refresh-secret"
PORT=3001
NODE_ENV="production"
CORS_ORIGIN="https://your-frontend-domain.com"
```

#### **Frontend (.env)**

```env
VITE_API_URL="https://your-backend-domain.com/api"
VITE_NODE_ENV="production"
VITE_APP_NAME="MyCRM"
```

## 🔧 **Technology Stack**

### **Frontend**

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Query** - Server state management

### **Backend**

- **Node.js** - Runtime
- **Express** - Web framework
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Passport.js** - Authentication strategies
- **bcrypt** - Password hashing

### **DevOps & CI/CD**

- **GitHub Actions** - Continuous Integration
- **Render.com** - Hosting and deployment
- **ESLint** - Code linting
- **npm workspaces** - Monorepo management

## 🔐 **Authentication System**

- **JWT-based authentication** with refresh tokens
- **Role-based authorization** (SuperAdmin, Admin, User)
- **Automatic token refresh** on frontend
- **Secure logout** with token blacklisting
- **Password hashing** with bcrypt

## 📊 **Features**

- **Dashboard** - Overview statistics and metrics
- **User Management** - CRUD operations for users
- **Company Management** - Manage companies and relationships
- **History Tracking** - Audit trail for all actions
- **Profile Management** - User profile updates
- **Role-based Access Control** - Granular permissions

## 🤝 **Contributing**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is private and proprietary.

## 📞 **Support**

For support and questions, please contact the development team.
