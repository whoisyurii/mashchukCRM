# Passport.js Authentication Implementation

## Обзор системы аутентификации

Наше приложение использует **Passport.js** с двумя стратегиями:
- **JWT Strategy** - для защищенных роутов
- **Local Strategy** - для логина по email/password

## Архитектура

```
Frontend (React) ↔ Backend (Express + Passport.js) ↔ Database (PostgreSQL)
```

## Компоненты системы

### 1. Стратегии Passport.js

#### JWT Strategy
- **Цель**: Аутентификация защищенных роутов
- **Источник токена**: Authorization Bearer header
- **Проверка**: JWT подпись + проверка пользователя в БД
- **Результат**: `req.user` содержит полные данные пользователя

#### Local Strategy
- **Цель**: Первичная аутентификация (логин)
- **Поля**: email (username), password
- **Проверка**: bcrypt сравнение паролей
- **Результат**: Пользователь без пароля в `req.user`

### 2. Middleware системы

#### authenticateJWT
```javascript
passport.authenticate('jwt', { session: false })
```
- Проверяет JWT токен из заголовка Authorization
- Загружает полные данные пользователя из БД
- Устанавливает `req.user`

#### authenticateLocal
```javascript
passport.authenticate('local', { session: false })
```
- Проверяет email/password
- Используется только для роута /login
- Устанавливает `req.user` при успешной аутентификации

#### requireRole([roles])
```javascript
requireRole(['Admin', 'SuperAdmin'])
```
- Проверяет роль пользователя из `req.user.role`
- Должен использоваться ПОСЛЕ authenticateJWT

#### requireOwnerOrAdmin
- Проверяет, что пользователь владелец ресурса ИЛИ админ
- Использует `req.user.id` и `req.params.userId`

## Поток аутентификации

### 1. Регистрация
```
1. POST /api/auth/register
2. Валидация данных
3. Хеширование пароля (bcrypt)
4. Создание пользователя в БД
5. Генерация JWT пары (access + refresh)
6. Запись в ActionHistory
7. Возврат { user, accessToken, refreshToken }
```

### 2. Логин через Passport Local Strategy
```
1. POST /api/auth/login { email, password }
2. authenticateLocal middleware
   ├── Поиск пользователя по email
   ├── bcrypt.compare(password, user.password)
   └── Установка req.user
3. Генерация JWT пары
4. Запись в ActionHistory
5. Возврат { user, accessToken, refreshToken }
```

### 3. Защищенные роуты через JWT Strategy
```
1. Клиент отправляет: Authorization: Bearer <token>
2. authenticateJWT middleware
   ├── Извлечение токена из заголовка
   ├── jwt.verify(token, secret)
   ├── Поиск пользователя по payload.id
   └── Установка req.user
3. requireRole middleware (если нужно)
   └── Проверка req.user.role
4. Выполнение роута с доступом к req.user
```

### 4. Обновление токена
```
1. POST /api/auth/refresh { refreshToken }
2. Проверка refreshToken в БД
3. Генерация нового accessToken
4. Возврат нового токена
```

### 5. Выход
```
1. POST /api/auth/logout (с JWT аутентификацией)
2. authenticateJWT проверяет токен
3. Отзыв refreshToken из БД
4. Запись в ActionHistory
5. Возврат success: true
```

## Структура данных

### User в req.user (после JWT Strategy)
```javascript
{
  id: "uuid",
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  role: "User|Admin|SuperAdmin",
  avatar: "base64_string_or_null",
  createdAt: "2025-06-19T...",
  updatedAt: "2025-06-19T..."
}
```

### JWT Payload
```javascript
{
  id: "user_uuid",
  iat: 1703019600,
  exp: 1703023200  // 1 час для access token
}
```

### RefreshToken в БД
```javascript
{
  id: "uuid",
  token: "hashed_refresh_token",
  userId: "user_uuid",
  expiresAt: "2025-07-19T...",  // 30 дней
  createdAt: "2025-06-19T..."
}
```

## Таблица роутов с аутентификацией

| Роут | Метод | Middleware | Роли | Описание |
|------|-------|------------|------|----------|
| `/auth/register` | POST | - | - | Регистрация |
| `/auth/login` | POST | authenticateLocal | - | Логин |
| `/auth/refresh` | POST | - | - | Обновление токена |
| `/auth/logout` | POST | authenticateJWT | - | Выход |
| `/auth/verify` | GET | authenticateJWT | - | Проверка токена |
| `/auth/profile` | GET | authenticateJWT | - | Профиль |
| `/users` | GET | authenticateJWT + requireRole | Admin, SuperAdmin | Список пользователей |
| `/users/me` | GET | authenticateJWT | - | Мой профиль |
| `/users/me` | PUT | authenticateJWT | - | Обновить профиль |
| `/users/:id` | PUT | authenticateJWT + requireRole | Admin, SuperAdmin | Обновить пользователя |
| `/users/:id` | DELETE | authenticateJWT + requireRole | SuperAdmin | Удалить пользователя |
| `/companies` | GET | authenticateJWT | - | Список компаний |
| `/companies` | POST | authenticateJWT | - | Создать компанию |
| `/companies/:id` | PUT | authenticateJWT | - | Обновить компанию |
| `/companies/:id` | DELETE | authenticateJWT + requireRole | Admin, SuperAdmin | Удалить компанию |
| `/dashboard/*` | ALL | authenticateJWT | - | Дашборд данные |
| `/history` | GET | authenticateJWT | - | История действий |

## Безопасность

### 1. Токены
- **Access Token**: 1 час жизни, JWT
- **Refresh Token**: 30 дней, хранится в БД в хешированном виде
- **Secret**: Из переменной окружения JWT_SECRET

### 2. Пароли
- Хеширование: bcrypt с saltRounds = 10
- Минимальная длина: 6 символов

### 3. Роли и права
```
SuperAdmin > Admin > User
```

- **User**: Может видеть/редактировать свои данные
- **Admin**: Может управлять пользователями и компаниями
- **SuperAdmin**: Полный доступ + удаление пользователей

### 4. Защита от атак
- CORS настроен
- Лимит размера JSON: 10mb
- Автоматическая очистка истекших refresh токенов
- Логирование всех действий в ActionHistory

## Синхронизация Frontend ↔ Backend

### 1. AuthContext (React)
```javascript
{
  user: User | null,           // Данные пользователя
  token: string | null,        // Access token
  login: (email, password) => Promise<void>,
  logout: () => Promise<void>,
  updateUser: (user) => void   // Обновление данных пользователя
}
```

### 2. Хранение на клиенте
```javascript
localStorage.setItem('token', accessToken);
localStorage.setItem('refreshToken', refreshToken);
localStorage.setItem('user', JSON.stringify(user));
```

### 3. Автоматическое обновление токенов
- Axios interceptor отлавливает 401 ошибки
- Автоматически пытается обновить access token
- При неудаче - редирект на логин

### 4. Защищенные запросы
```javascript
// Все API запросы автоматически включают заголовок:
Authorization: Bearer <accessToken>
```

## Логирование действий

### ActionHistory записи
```javascript
{
  action: "login|logout|register|updated|created|deleted",
  type: "auth|user|company|profile",
  details: "Описание действия",
  target: "email или название объекта",
  userId: "uuid пользователя",
  createdAt: "timestamp"
}
```

### Примеры записей
- `login` / `auth` - "User logged in successfully"
- `updated` / `profile` - "Updated profile information"  
- `created` / `company` - "Created new company: Company Name"
- `deleted` / `user` - "Deleted user account"

## Файловая структура

```
apps/backend/src/
├── config/
│   └── passport.js          # Конфигурация стратегий
├── middleware/
│   └── auth.js              # Passport middleware
├── routes/
│   ├── auth.js              # Аутентификация
│   ├── users.js             # Пользователи  
│   ├── companies.js         # Компании
│   └── dashboard.js         # Дашборд
├── utils/
│   ├── tokenUtils.js        # JWT утилиты
│   └── historyUtils.js      # Логирование действий
└── index.js                 # Инициализация Passport
```

## Error Handling

### Типы ошибок
- **401 Unauthorized**: Нет токена или токен недействителен
- **403 Forbidden**: Недостаточно прав доступа
- **404 Not Found**: Пользователь не найден
- **409 Conflict**: Пользователь уже существует
- **500 Server Error**: Внутренняя ошибка сервера

### Обработка на Frontend
```javascript
// AuthContext автоматически обрабатывает:
// 401 -> logout + redirect to login
// 403 -> показать сообщение об ошибке
// 500 -> показать общую ошибку
```

## Миграция с текущей системы

### Изменения в коде
1. ✅ Обновить config/passport.js
2. ✅ Создать новые middleware в auth.js
3. ✅ Обновить все роуты с authenticateToken → authenticateJWT
4. ✅ Обновить роут /login для использования Local Strategy
5. ✅ Добавить passport.initialize() в app.js
6. ✅ Обновить импорты во всех файлах

### Совместимость
- ✅ Frontend код НЕ изменяется
- ✅ API endpoints остаются теми же
- ✅ Структура ответов не изменяется
- ✅ JWT токены остаются совместимыми

### Тестирование
После миграции проверить:
- [x] Регистрация нового пользователя
- [x] Логин существующего пользователя  
- [x] Доступ к защищенным роутам
- [x] Обновление профиля
- [x] Права доступа по ролям
- [x] Logout и очистка токенов
- [x] Автоматическое обновление токенов

## ✅ МИГРАЦИЯ ЗАВЕРШЕНА

### Выполненные изменения:

1. **Обновлена конфигурация Passport.js** (`middleware/passport.js`)
   - Добавлена Local Strategy для логина
   - Обновлена JWT Strategy с правильным payload
   - Добавлен возврат поля avatar

2. **Обновлены middleware** (`middleware/auth.js`)
   - Добавлен authenticateJWT и authenticateLocal
   - Добавлен requireOwnerOrAdmin middleware
   - Сохранена обратная совместимость с authenticateToken

3. **Обновлены auth роуты** (`routes/auth.js`)
   - Логин через Passport Local Strategy
   - Logout через Passport JWT
   - Verify и Profile через Passport JWT

4. **Обновлены все роуты на Passport JWT**:
   - `routes/users.js` - все роуты переведены на authenticateJWT
   - `routes/companies.js` - все роуты переведены на authenticateJWT
   - `routes/dashboard.js` - все роуты переведены на authenticateJWT
   - `routes/history.js` - все роуты переведены на authenticateJWT

5. **Исправлен JWT payload**:
   - Изменен с `{ userId }` на `{ id }` для совместимости с Passport

6. **Passport инициализирован** в `index.js`

### Результат:
✅ **Все роуты используют Passport.js**  
✅ **JWT Strategy для защищенных роутов**  
✅ **Local Strategy для логина**  
✅ **Централизованная система ролей**  
✅ **Совместимость с существующим frontend**  
✅ **Логирование действий сохранено**

### Для запуска:
```bash
cd apps/backend
npm start
```

**Frontend код остается без изменений - полная совместимость!**
