# Company Dashboard App — План разработки (10–12 дней)

## Что изучить/уточнить заранее

- **JWT и Passport**: [JWT Guide](https://jwt.io/introduction/), [Passport.js Docs](http://www.passportjs.org/docs/)
- **Ролевая система**: [RBAC Pattern](https://en.wikipedia.org/wiki/Role-based_access_control)
- **React Query**: [React Query Docs](https://tanstack.com/query/latest)
- **Express + PostgreSQL**: [Express Docs](https://expressjs.com/), [node-postgres Docs](https://node-postgres.com/)
- **Tailwind CSS**: [Tailwind Docs](https://tailwindcss.com/docs/installation)
- **Swagger**: [Swagger Docs](https://swagger.io/docs/)
- **Docker (опционально)**: [Docker Getting Started](https://docs.docker.com/get-started/)
- **Требования к ролям и доступам**: уточнить у наставника, кто что может (например, может ли Admin удалять пользователей?)

---

## День 1: Анализ, проектирование, подготовка

- Изучить ТЗ, уточнить вопросы по ролям и доступам.
- Нарисовать схему БД (ER-диаграмму): User, Company, роли, связи.
- Настроить репозиторий, линтеры, базовую структуру проекта (frontend + backend).
- Поднять PostgreSQL (можно через Docker).
- Создать базовый сервер Express/NestJS, подключить к БД.
- Буфер: если что-то не получается с БД — не залипать, идти дальше, вернуться позже.

---

## День 2: Аутентификация и роли (Backend)

- Реализовать регистрацию и вход (JWT, Passport).
- Миграции: User, Role, Company.
- Middleware для проверки токена и ролей.
- CRUD для пользователей (только для SuperAdmin/Admin).
- Проверить работу через Postman.
- Буфер: JWT/Passport могут занять больше времени — заложить запас.

---

## День 3: CRUD компаний (Backend)

- CRUD для компаний (создание, просмотр, редактирование, удаление).
- Ограничения по ролям: User — только свои компании, Admin/SuperAdmin — все.
- Фильтрация, сортировка, пагинация (поиск по имени/сервису, статус).
- Swagger-документация.
- Буфер: Swagger можно оставить на конец дня или позже.

---

## День 4: Базовый Frontend, Auth Flow

- Настроить роутинг в React, Tailwind.
- Реализовать страницы Sign In/Sign Up, подключить к API.
- Хранить токен, реализовать ProtectedRoute.
- Валидация форм (react-hook-form).
- Буфер: если не успеваешь — сделать только Sign In.

---

## День 5: Dashboard и Companies List (Frontend)

- Страница Dashboard: получить статистику с backend.
- Companies List: таблица, пагинация, фильтры, сортировка.
- Реализовать отображение компаний по ролям.
- Буфер: если не успеваешь — сделать только список без фильтров.

---

## День 6: Company Detail и Profile

- Company Detail: просмотр, редактирование (только владелец/Admin/SuperAdmin).
- Profile: просмотр и редактирование своих данных.
- Валидация форм.
- Буфер: загрузку аватара/логотипа можно оставить на потом.

---

## День 7: CRUD UI, Logout, тестирование

- Добавить создание/удаление компаний из UI.
- Logout, сброс токена.
- Проверить все сценарии по ролям.
- Буфер: если не успеваешь — оставить удаление на потом.

---

## День 8: Доп. фичи и багфиксы

- Сброс пароля (можно без email, просто форма).
- Уведомления (toaster).
- Логика refresh token (если есть время).
- Буфер: багфиксы, рефакторинг.

---

## День 9: Swagger, Docker, деплой

- Swagger-документация (если не сделали).
- Dockerfile для backend (и frontend, если есть время).
- Проверить запуск всего проекта.
- Буфер: деплой на Render/Heroku (если требуется).

---

## День 10: Тестирование, презентация, доработка

- Пройтись по чек-листу требований.
- Проверить все роли, сценарии.
- Подготовить демо/скринкасты.
- Оставить время на вопросы и доработки.

---

## Что оставить на конец или как _доп._

- История действий (history page).
- Загрузка/редактирование аватаров и логотипов.
- Двухфакторная аутентификация.
- Геолокация компаний.
- Полноценный email-ресет пароля.
- Docker Compose для всего проекта.

---

## Критичные буферы

- Аутентификация и роли (JWT, Passport, middleware)
- CRUD и права доступа (особенно фильтрация по ролям)
- Интеграция frontend-backend (CORS, токены)
- Валидация и UX форм

---

## MVP (минимум для сдачи)

- Регистрация/вход, хранение токена, ProtectedRoute
- CRUD компаний и пользователей с учетом ролей
- Dashboard, Companies List, Profile (без загрузки файлов)
- Swagger (минимальный)
- Проверка ролей на backend и frontend

---

**Удачи! Не бойся спрашивать и делай по чуть-чуть каждый день.**
