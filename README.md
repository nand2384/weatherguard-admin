# WeatherGuard

WeatherGuard is a secure, invite-only weather alert service that connects a web application and a Telegram bot.
Users can authenticate securely using Google OAuth, complete their profile with real-time city geocoding, and connect their Telegram accounts.
Administrators can approve or reject access requests and monitor the system from a dedicated admin dashboard.
Once approved, users receive automated weather alerts on Telegram based on their configured frequency, with alerts scheduled securely on the backend.

## Architecture

The project follows a decoupled client-server architecture:

- **Frontend (admin/)**: React, TypeScript, Tailwind CSS, Vite
- **Backend (api/)**: NestJS, TypeScript, MongoDB (Mongoose), Passport OAuth, Node-Cron, Telegraf (Telegram Bot)

## Features

### Users
- **Authentication**: Secure Google OAuth authentication relying on Express session cookies (HTTP-only).
- **Profile Setup**: Real-time city search using OpenWeatherMap geocoding API.
- **Telegram Linking**: Secure UUID-based token linking process to connect users' Telegram accounts.
- **Weather Dashboard**: Access to current weather metrics once approved.

### Administrators
- **Dashboard**: View system statistics and user metrics.
- **Approval Workflow**: Approve or reject access requests.
- **Role-Based Routing**: Admins are automatically routed to the admin view upon login.

### Backend Infrastructure
- **Security**: Strict rate-limiting using `@nestjs/throttler` to prevent abuse.
- **Scheduling**: Robust polling and scheduling using Node-Cron to query OpenWeatherMap and emit alerts via Telegram.
- **API Proxy**: Frontend geocoding goes through the backend to protect API keys.

## Prerequisites

- Node.js (v18+)
- MongoDB instance (local or Atlas)
- Google Cloud Console Project (for OAuth Credentials)
- OpenWeatherMap API Key
- Telegram Bot Token (from BotFather)

## Environment Variables

### Backend (`api/.env`)
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/weatherguard
JWT_SECRET=your_super_secret_session_key
FRONTEND_URL=http://localhost:5173

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_BOT_USERNAME=your_telegram_bot_username

OPENWEATHER_API_KEY=your_openweathermap_api_key
```

### Frontend (`admin/.env`)
```env
VITE_API_URL=http://localhost:3000
```

## Running the Project

### 1. Backend

```bash
cd api
npm install
npm run start:dev
```

### 2. Frontend

```bash
cd admin
npm install
npm run dev
```

## Build for Production

```bash
# Build backend
cd api
npm run build

# Build frontend
cd admin
npm run build
```

## License
MIT License
