# Movie Tinder 🎬

Веб-додаток для спільного вибору фільмів у реальному часі. Створюйте кімнати, запрошуйте друзів та знаходьте фільми, які сподобаються всім!

## Особливості

- 🎮 Режими гри: популярні фільми, нові релізи, топ фільми
- 👥 Мультиплеєр у реальному часі через WebSocket
- 🎯 Система свайпів (подобається/не подобається)
- 🎉 Автоматичне визначення збігів
- 📱 Адаптивний дизайн
- 🎨 Сучасний UI з Tailwind CSS

## Технології

### Frontend
- React 19
- TypeScript
- Redux Toolkit
- Socket.IO Client
- React Router
- Tailwind CSS
- Vite

### Backend
- Node.js
- Express
- TypeScript
- Socket.IO
- TMDB API

## Встановлення

### Вимоги
- Node.js 18+
- npm або yarn
- TMDB API ключ (безкоштовно на https://www.themoviedb.org/settings/api)

### Крок 1: Клонування репозиторію
```bash
git clone <repository-url>
cd movie-tinder
```

### Крок 2: Встановлення залежностей
```bash
npm run install:all
```

Або окремо:
```bash
# Root
npm install

# Client
cd client && npm install

# Server
cd server && npm install
```

### Крок 3: Налаштування змінних оточення

#### Server (.env)
Створіть файл `server/.env` на основі `server/.env.example`:
```env
TMDB_API_KEY=your_tmdb_api_key_here
PORT=8000
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

#### Client (.env)
Створіть файл `client/.env` на основі `client/.env.example`:
```env
VITE_SERVER_URL=http://localhost:8000
```

## Запуск

### Режим розробки

Запустити все одночасно:
```bash
npm run dev
```

Або окремо:
```bash
# Server (порт 8000)
npm run dev:server

# Client (порт 5173)
npm run dev:client
```

### Production build

```bash
# Збірка всього проекту
npm run build

# Запуск production сервера
npm start
```

Клієнт буде зібрано в `client/dist/`, сервер в `server/dist/`.

## Структура проекту

```
movie-tinder/
├── client/                 # React frontend
│   ├── src/
│   │   ├── features/      # Feature-based модулі
│   │   ├── pages/         # Сторінки
│   │   ├── store/         # Redux store
│   │   ├── services/      # API сервіси
│   │   ├── hooks/         # Custom hooks
│   │   └── ui/            # UI компоненти
│   └── dist/              # Production build
│
├── server/                # Node.js backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── services/      # Business logic
│   │   ├── sockets/       # WebSocket handlers
│   │   ├── routes/        # API routes
│   │   └── types/         # TypeScript types
│   └── dist/              # Production build
│
└── package.json           # Root scripts
```

## API Endpoints

### REST API
- `GET /api/health` - Health check
- `GET /api/movies/popular` - Популярні фільми
- `GET /api/movies/top-rated` - Топ фільми
- `GET /api/movies/now-playing` - Нові релізи

### WebSocket Events
- `create-room` - Створити кімнату
- `join-room` - Приєднатися до кімнати
- `start-game` - Почати гру
- `swipe` - Свайп фільму
- `match-found` - Знайдено збіг

## Скрипти

```bash
npm run install:all    # Встановити всі залежності
npm run dev            # Запустити dev режим
npm run build          # Зібрати production
npm start              # Запустити production сервер
npm run lint           # Перевірити код
npm run type-check     # Перевірити типи TypeScript
```

## Деплой

### Підготовка до деплою

1. Переконайтеся що всі змінні оточення налаштовані
2. Зберіть проект: `npm run build`
3. Перевірте що `client/dist/` та `server/dist/` створені

### Варіанти деплою

#### Vercel / Netlify (Frontend)
- Деплойте папку `client/dist/`
- Налаштуйте `VITE_SERVER_URL` на production URL сервера

#### Heroku / Railway / Render (Backend)
- Деплойте папку `server/`
- Налаштуйте змінні оточення
- Команда запуску: `npm start`

#### Docker
Можна створити Dockerfile для контейнеризації обох частин.

## Ліцензія

ISC

## Автор

guitobi
