# Render.com Deployment Guide

This guide explains how to deploy MashchukCRM to Render.com using the monorepo structure.

## 🎯 **Deployment Overview**

The application is deployed as **two separate services**:

1. **Backend Web Service** - Node.js API server
2. **Frontend Static Site** - React application

## 📋 **Prerequisites**

- GitHub repository with the project
- Render.com account
- Environment variables configured

## 🚀 **Step-by-Step Deployment**

### **1. Database Setup**

1. Go to Render Dashboard → **Databases**
2. Click **New PostgreSQL**
3. Configure:
   - **Name**: `mashchuk-crm-db`
   - **Database**: `mycrm`
   - **User**: `mycrm_user`
   - **Region**: Oregon (or closest to your users)
   - **Plan**: Free
4. Click **Create Database**
5. **Copy the External Database URL** for backend configuration

### **2. Backend Service Deployment**

1. Go to Render Dashboard → **Web Services**
2. Click **New Web Service**
3. Connect your GitHub repository
4. Configure:

   - **Name**: `mashchuk-crm-backend`
   - **Region**: Oregon
   - **Branch**: `main`
   - **Root Directory**: `apps/backend`
   - **Runtime**: Node
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. **Environment Variables**:

   ```env
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=<your-database-url-from-step-1>
   JWT_SECRET=<generate-strong-secret>
   REFRESH_SECRET=<generate-strong-secret>
   CORS_ORIGIN=https://mashchuk-crm-frontend.onrender.com
   ```

6. **Advanced Settings**:

   - **Health Check Path**: `/api/health`
   - **Auto-Deploy**: Yes

7. Click **Create Web Service**

### **3. Frontend Service Deployment**

1. Go to Render Dashboard → **Static Sites**
2. Click **New Static Site**
3. Connect your GitHub repository
4. Configure:

   - **Name**: `mashchuk-crm-frontend`
   - **Branch**: `main`
   - **Root Directory**: `apps/frontend`
   - **Build Command**: `npm ci && npm run build`
   - **Publish Directory**: `dist`

5. **Environment Variables**:

   ```env
   VITE_API_URL=https://mashchuk-crm-backend.onrender.com/api
   VITE_NODE_ENV=production
   VITE_APP_NAME=MyCRM
   VITE_APP_VERSION=1.0.0
   ```

6. **Advanced Settings**:

   - **Auto-Deploy**: Yes

7. Click **Create Static Site**

## 🔄 **Automatic Deployment with GitHub Actions**

The repository includes a GitHub Actions workflow that:

1. **Runs on every push to main**
2. **Executes linting and tests**
3. **Triggers Render deployments** via webhook

### **Setup GitHub Secrets**

1. Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**
2. Add the following secrets:
   - `RENDER_BACKEND_DEPLOY_HOOK`: Backend service deploy hook URL
   - `RENDER_FRONTEND_DEPLOY_HOOK`: Frontend service deploy hook URL

### **Get Deploy Hook URLs**

1. In Render Dashboard, go to your service
2. Go to **Settings** → **Deploy Hook**
3. Copy the webhook URL
4. Add to GitHub secrets

## 🔐 **Environment Variables Reference**

### **Backend Required Variables**

| Variable         | Description                      | Example                               |
| ---------------- | -------------------------------- | ------------------------------------- |
| `DATABASE_URL`   | PostgreSQL connection string     | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET`     | Secret for JWT tokens            | `your-super-secret-jwt-key`           |
| `REFRESH_SECRET` | Secret for refresh tokens        | `your-refresh-secret-key`             |
| `NODE_ENV`       | Environment mode                 | `production`                          |
| `PORT`           | Server port (auto-set by Render) | `10000`                               |
| `CORS_ORIGIN`    | Frontend URL for CORS            | `https://your-frontend.onrender.com`  |

### **Frontend Required Variables**

| Variable        | Description      | Example                                 |
| --------------- | ---------------- | --------------------------------------- |
| `VITE_API_URL`  | Backend API URL  | `https://your-backend.onrender.com/api` |
| `VITE_NODE_ENV` | Environment mode | `production`                            |
| `VITE_APP_NAME` | Application name | `MyCRM`                                 |

## 🛠️ **Database Migration**

After backend deployment, run database migration:

1. Go to backend service → **Shell**
2. Run: `npm run migrate:deploy`
3. Optionally seed data: `npm run seed`

## 📊 **Monitoring & Logs**

### **Backend Logs**

- Go to backend service → **Logs**
- Monitor for startup errors, API errors, database connection issues

### **Frontend Logs**

- Go to frontend service → **Logs**
- Monitor build process and deployment status

### **Health Checks**

- Backend: `https://your-backend.onrender.com/api/health`
- Frontend: Your frontend URL should load without errors

## 🔧 **Troubleshooting**

### **Backend Issues**

- **503 Service Unavailable**: Check logs for startup errors
- **Database Connection**: Verify DATABASE_URL is correct
- **CORS Errors**: Ensure CORS_ORIGIN matches frontend URL

### **Frontend Issues**

- **API Connection**: Verify VITE_API_URL points to backend
- **Build Errors**: Check Node.js version compatibility
- **404 on Refresh**: Configure `_redirects` file for SPA routing

### **Common Solutions**

```bash
# For backend debugging
npm run dev  # Test locally first

# For database issues
npm run migrate:deploy  # Re-run migrations
npm run db:generate     # Regenerate Prisma client

# For frontend issues
npm run build           # Test build locally
npm run preview         # Preview production build
```

## 🚀 **Performance Optimization**

### **Backend**

- Enable **Auto-Scale** for traffic spikes
- Monitor **CPU and Memory** usage
- Consider upgrading to **Starter Plan** for better performance

### **Frontend**

- Static site deployment is already optimized
- **CDN** distribution handled by Render
- **Gzip compression** enabled by default

## 🔄 **CI/CD Pipeline**

The automated pipeline:

```
GitHub Push → GitHub Actions → Lint/Test → Deploy to Render
```

**Benefits:**

- ✅ Automatic quality checks
- ✅ Consistent deployments
- ✅ Rollback capability
- ✅ Zero-downtime deployments

## 📞 **Support**

For deployment issues:

1. Check Render service logs
2. Verify environment variables
3. Test locally with production settings
4. Contact team for assistance
