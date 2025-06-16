# JWT Authentication & Authorization System - Complete Implementation Guide

## 🎯 Overview

Полноценная система аутентификации и авторизации с использованием JWT (JSON Web Tokens), включающая:

- **Access tokens** (короткоживущие, 15 минут)
- **Refresh tokens** (долгоживущие, 7 дней)
- **Passport.js** интеграция
- **Token blacklist/revoke** система
- **Automatic token refresh** на фронтенде
- **Cron задачи** для очистки истекших токенов

---

## 🏗️ Architecture & Flow

### 1. **Token-based Authentication Flow**

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Client    │    │    Server    │    │  Database   │
│ (Frontend)  │    │   (Backend)  │    │  (Prisma)   │
└─────────────┘    └──────────────┘    └─────────────┘
       │                   │                   │
       │ 1. Login Request  │                   │
       │──────────────────→│                   │
       │                   │ 2. Verify User    │
       │                   │──────────────────→│
       │                   │                   │
       │                   │ 3. Generate Tokens│
       │                   │◄──────────────────│
       │ 4. Return Tokens  │                   │
       │◄──────────────────│                   │
       │                   │                   │
       │ 5. API Request +  │                   │
       │    Access Token   │                   │
       │──────────────────→│                   │
       │                   │ 6. Verify Token   │
       │                   │──────────────────→│
       │                   │                   │
       │ 7. Protected Data │                   │
       │◄──────────────────│                   │
```

### 2. **Automatic Token Refresh Flow**

```
┌─────────────┐    ┌──────────────┐
│   Client    │    │    Server    │
└─────────────┘    └──────────────┘
       │                   │
       │ API Request       │
       │ (Expired Token)   │
       │──────────────────→│
       │                   │
       │ 401 Unauthorized  │
       │◄──────────────────│
       │                   │
       │ Refresh Request   │
       │ + Refresh Token   │
       │──────────────────→│
       │                   │
       │ New Access Token  │
       │◄──────────────────│
       │                   │
       │ Retry Original    │
       │ Request           │
       │──────────────────→│
       │                   │
       │ Success Response  │
       │◄──────────────────│
```

---

## 🔐 Security Features

### **1. Dual Token System**

- **Access Token**: Короткий срок жизни (15 минут), содержит user payload
- **Refresh Token**: Длительный срок жизни (7 дней), хранится в БД с возможностью отзыва

### **2. Token Blacklist/Revoke System**

- Refresh токены хранятся в БД с возможностью немедленного отзыва
- Поддержка "logout со всех устройств" через `revokeAllUserTokens()`

### **3. Automatic Cleanup**

- Cron задача запускается каждую ночь в 00:00
- Удаляет истекшие refresh токены из БД
- Предотвращает накопление мусора в таблице tokens

---

## 🛠️ Technical Implementation

### **Backend Components**

#### **1. Database Schema (Prisma)**

```prisma
model RefreshToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("refresh_tokens")
}
```

#### **2. Token Utilities (`utils/tokenUtils.js`)**

```javascript
// Генерация пары токенов
export const generateTokenPair = async (userId) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken();

  await storeRefreshToken(userId, refreshToken);

  return {
    accessToken,
    refreshToken,
    expiresIn: ACCESS_TOKEN_EXPIRY,
  };
};
```

#### **3. Middleware Integration**

- **Standard JWT Middleware**: `authenticateToken()` для обычных роутов
- **Passport.js Middleware**: `passportJWT` для альтернативной аутентификации
- **Role-based Access**: `requireRole(['Admin', 'SuperAdmin'])`

#### **4. Authentication Routes**

```javascript
// Login - выдает пару токенов
POST / api / auth / login;

// Refresh - обновляет access token
POST / api / auth / refresh;

// Logout - отзывает один refresh token
POST / api / auth / logout;

// Logout All - отзывает все refresh токены пользователя
POST / api / auth / logout - all;
```

### **Frontend Components**

#### **1. Automatic Token Refresh (`api.ts`)**

```typescript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Попытка обновить токен
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        const response = await axios.post("/auth/refresh", { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Обновляем токены и повторяем запрос
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);
```

#### **2. Authentication Context**

```typescript
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>; // логаут отовсюду
}
```

---

## 🔄 Key Workflows

### **1. User Login Process**

1. **Frontend** отправляет `email` + `password`
2. **Backend** проверяет credentials через bcrypt
3. **Backend** генерирует `accessToken` + `refreshToken`
4. **Backend** сохраняет refresh token в БД
5. **Frontend** сохраняет оба токена в localStorage
6. **Frontend** устанавливает Authorization header для всех API запросов

### **2. Protected API Access**

1. **Frontend** автоматически добавляет `Bearer ${accessToken}` в заголовки
2. **Backend** проверяет токен через `authenticateToken` middleware
3. **Backend** извлекает userId из JWT payload
4. **Backend** загружает данные пользователя из БД
5. **Backend** возвращает защищенные данные

### **3. Token Expiration Handling**

1. **Frontend** получает 401 Unauthorized
2. **axios interceptor** перехватывает ошибку
3. **Frontend** отправляет refresh token на `/auth/refresh`
4. **Backend** проверяет refresh token в БД
5. **Backend** генерирует новый access token
6. **Frontend** обновляет токены и повторяет запрос

### **4. Secure Logout**

1. **Frontend** вызывает `logout()` или `logoutAll()`
2. **Backend** удаляет refresh token(ы) из БД
3. **Frontend** очищает localStorage
4. **Frontend** перенаправляет на страницу входа

---

## 🚀 Advanced Features

### **1. Passport.js Integration**

```javascript
// JWT Strategy для Passport
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

// Использование в роутах
router.get(
  "/profile-passport",
  passport.authenticate("jwt", { session: false }),
  handler
);
```

### **2. Role-based Authorization**

```javascript
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    next();
  };
};
```

### **3. Token Cleanup Job**

```javascript
// Cron задача (каждый день в 00:00)
cron.schedule("0 0 * * *", async () => {
  const deletedCount = await prisma.refreshToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
  console.log(`Cleaned up ${deletedCount.count} expired refresh tokens`);
});
```

---

## 📋 Security Best Practices

### **✅ Implemented**

- ✅ **Short-lived access tokens** (15 minutes)
- ✅ **Refresh token rotation** (новый refresh token при каждом обновлении)
- ✅ **Token storage in database** (возможность отзыва)
- ✅ **Automatic cleanup** (cron задачи)
- ✅ **HTTPS enforcement** (рекомендуется для production)
- ✅ **Role-based access control**
- ✅ **Password hashing** (bcrypt)

### **⚠️ Production Considerations**

- ⚠️ **Environment variables** для JWT secrets
- ⚠️ **Rate limiting** для auth endpoints
- ⚠️ **CORS configuration** для specific domains
- ⚠️ **Logging & monitoring** для security events
- ⚠️ **Input validation** и sanitization

---

## 🎯 Benefits of This Implementation

### **1. Security**

- Минимизирует риск token theft через короткий срок жизни access tokens
- Позволяет немедленно отзывать доступ через refresh token blacklist
- Поддерживает logout со всех устройств для compromised accounts

### **2. User Experience**

- Прозрачное обновление токенов без перерыва в работе
- Сохранение сессии между визитами (refresh tokens)
- Быстрый доступ к API через кэшированные access tokens

### **3. Scalability**

- Stateless authentication через JWT
- Минимальная нагрузка на БД (только для refresh operations)
- Автоматическая очистка устаревших данных

### **4. Flexibility**

- Поддержка нескольких стратегий аутентификации (standard + Passport.js)
- Легкое расширение для OAuth providers
- Гибкая система ролей и разрешений

---

## 🔧 Testing & Verification

### **API Endpoints Testing**

```bash
# 1. Login
POST /api/auth/login
{"email": "user@example.com", "password": "password123"}

# 2. Protected route with access token
GET /api/auth/verify
Authorization: Bearer <access_token>

# 3. Passport.js route
GET /api/auth/profile-passport
Authorization: Bearer <access_token>

# 4. Refresh token
POST /api/auth/refresh
{"refreshToken": "<refresh_token>"}

# 5. Logout
POST /api/auth/logout
{"refreshToken": "<refresh_token>"}
Authorization: Bearer <access_token>
```

---

## 📚 Summary

Эта реализация предоставляет **enterprise-grade** систему аутентификации с:

- 🔒 **Высокий уровень безопасности** через dual token system
- 🔄 **Seamless user experience** через automatic token refresh
- 🛡️ **Immediate access revocation** через token blacklist
- 🧹 **Automatic maintenance** через cron cleanup jobs
- 🔧 **Flexible architecture** поддерживающая расширения

Система готова для **production use** и соответствует современным стандартам безопасности веб-приложений.
