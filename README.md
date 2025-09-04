## `README.md` — Проект `medusa-core-voice`

### 🧩 Назначение

Проект `medusa-core-voice` — это модульная e-commerce-платформа на базе [Medusa.js](https://medusajs.com), адаптированная для управления маркетплейсом голосовых AI-ассистентов.

Структура построена как **monorepo** с кастомным бэкендом и фронтендом.

---

## 📦 Структура проекта

```
/packages
  └── backend           # Medusa backend
  └── frontend          # Next.js 15 кастомный фронт
```

---

## 🛠️ Установка

```bash
pnpm install
```

Убедитесь, что у вас локально установлен:
- Node.js >= 18
- Docker / Docker Compose

---

## ⚙️ Настройка окружения

Создайте `.env` файл в `packages/backend`:

```bash
cd packages/backend
cp .env.template .env
```

И измените строку подключения к базе, если PostgreSQL проброшен на порт `5433`:

```env
DATABASE_URL=postgres://medusa:medusadbpass@localhost:5433/medusa-db
```

---

## 🧪 Проверка подключения к базе

```bash
docker exec -it medusa-postgres psql -U medusa -d medusa-db
```

Если вы видите `medusa-db=#`, значит всё работает. Если нет — проверьте имя контейнера и переменные окружения:

```bash
docker inspect medusa-postgres | grep POSTGRES
```

---

## 🐘 Важное про порт `5433`

Если у вас уже работает другая PostgreSQL (например, rasa), Docker по умолчанию **не сможет использовать порт `5432`**. В этом случае Medusa использует:

```
5433:5432
```

То есть:

- Внутри контейнера PostgreSQL работает на `5432`
- Снаружи (localhost) он доступен на `5433`

---

## 🧯 Устранение ошибки

Ошибка:
```
psql: error: connection to server on socket "/var/run/postgresql/.s.PGSQL.5432" failed: FATAL: database "medusa" does not exist
```

Решение:
```bash
docker exec -it medusa-postgres psql -U medusa -d medusa-db
```

---

## 🚀 Запуск

### 🔧 Быстрый запуск backend

```bash
pnpm run dev:backend
```

(Запускает backend из packages/backend напрямую из корня проекта)

### ⚠️ Решение проблемы с переменными окружения

**Проблема:** Backend не видит переменные к базе данных.

**Причина:** `.env` файл отсутствует в `packages/backend/`.

**Решение:** Скопировать `.env` файл из корня проекта в `packages/backend/`:

```bash
cp .env packages/backend/.env
```

**Проверка:** Убедиться, что в `packages/backend/.env` есть правильные значения:

```env
DATABASE_URL=postgres://medusa:medusadbpass@localhost:5433/medusa-db
REDIS_URL=redis://localhost:6379
```

### 📊 Создание таблиц БД

```bash
pnpm run create-tables
```

(Создает необходимые таблицы в базе данных)

### 🚀 Простой backend сервер

```bash
pnpm run simple-server
```

(Запускает простой Express сервер с API для голосовых ассистентов)

### 📁 Запуск из папки backend

```bash
cd packages/backend
pnpm run dev
```

---

## 💡 Как мы решили ошибку запуска

### Ошибка 1: `Couldn't find medusa-config.js`

Хотя файл `medusa-config.js` существовал, Medusa CLI не видел его. Причина: вы запускали не из корня backend-папки.

✅ **Решение:**
Перейти в `packages/backend` и запустить команду там:

```bash
cd packages/backend
pnpm run dev
```

### Ошибка 2: `medusa migrations run --action run` с ошибкой `id must be string`

Проблема с Medusa CLI при попытке запуска миграций.

✅ **Решение:**
1. **Исправить пароль в .env файле:**
   ```env
   DATABASE_URL=postgres://medusa:medusadbpass@localhost:5433/medusa-db
   ```
   (Пароль должен быть `medusadbpass`, а не `medusa`)

2. **Создать таблицы вручную:**
   ```bash
   cd packages/backend
   pnpm run create-tables
   ```

3. **Установить ts-node:**
   ```bash
   pnpm add -D ts-node
   ```

### 🔧 **Альтернативные команды для инициализации БД:**

```bash
# Создание таблиц
pnpm run create-tables

# Инициализация БД
pnpm run init-db

# Запуск backend
pnpm run dev
```

---

## 🔁 Отправка `README.md` в корень проекта

Если ты создавал `README.md` в `packages/backend`, можешь скопировать в корень:

```bash
cp packages/backend/README.md README.md
```

