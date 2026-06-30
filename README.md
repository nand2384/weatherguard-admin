# 🌦️ WeatherGuard

> A secure, invite-only weather alert platform built with **NestJS**, **React**, **MongoDB**, and **Telegram**.

WeatherGuard is a full-stack application developed as part of a backend engineering take-home assessment. It demonstrates a production-style architecture where users authenticate using Google OAuth, complete their profile, connect their Telegram account, and request access to the platform.

Access is controlled through an administrator approval workflow. Only approved users receive scheduled weather alerts via Telegram, showcasing authentication, role-based authorization, background scheduling, and third-party API integration within a modular architecture.

## ✨ Key Features

- Google OAuth authentication
- JWT-based authentication
- Admin approval workflow
- Telegram Bot integration
- Scheduled weather alerts using Node-Cron
- OpenWeatherMap integration
- Modular NestJS backend
- Responsive React + Tailwind frontend

---

# 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | NestJS, TypeScript |
| Authentication | Google OAuth 2.0, Passport.js, JWT |
| Database | MongoDB + Mongoose |
| Scheduling | Node-Cron |
| Bot | Telegram Bot API (Telegraf) |
| Weather API | OpenWeatherMap |
| Deployment | Azure App Service, Vercel |

---

# 🏗️ System Design

WeatherGuard follows a modular client-server architecture where the React frontend communicates with a NestJS backend. The backend is responsible for authentication, authorization, business logic, scheduling, and third-party integrations.

```
                    React Admin Panel
                            │
                            ▼
                    NestJS REST API
          ┌──────────┼──────────┬──────────┐
          ▼          ▼          ▼          ▼
     MongoDB    Google OAuth  Telegram  OpenWeatherMap
          │
          ▼
      Node-Cron Scheduler
          │
          ▼
    Weather Alert Delivery
```

The scheduler periodically retrieves weather data from OpenWeatherMap and sends Telegram notifications only to users whose accounts have been approved by an administrator.

---

# 🗄️ Database Schema

The application uses a single **User** collection to keep authentication, profile information, authorization state, and notification preferences together.

| Field | Description |
|--------|-------------|
| `name` | User's display name |
| `email` | Unique email address |
| `provider` | OAuth provider |
| `providerId` | OAuth provider ID |
| `role` | USER / ADMIN |
| `approvalStatus` | INCOMPLETE / PENDING / APPROVED / REJECTED |
| `city` | Selected city |
| `country` | Country |
| `latitude` | Latitude |
| `longitude` | Longitude |
| `alertFrequency` | Weather notification frequency |
| `telegramConnected` | Telegram connection status |
| `telegramChatId` | Telegram chat identifier |
| `telegramLinkToken` | Temporary linking token |
| `createdAt` | Creation timestamp |
| `updatedAt` | Last update timestamp |

This schema enables profile management, authorization, Telegram integration, and scheduled notifications using a single database query.

---

# 🔄 Application Flow

The following workflow ensures that only approved users receive weather alerts.

```text
Google OAuth Login
        │
        ▼
 Complete Profile
        │
        ▼
 Connect Telegram
        │
        ▼
 Request Access
        │
        ▼
 Approval Status = PENDING
        │
        ▼
 Admin Approval
        │
        ▼
 Approval Status = APPROVED
        │
        ▼
 Node-Cron Scheduler
        │
        ▼
 Fetch Weather Data
        │
        ▼
 Send Telegram Alert
```

During each scheduled execution, the backend queries only users with `approvalStatus = APPROVED`, fetches the latest weather information from OpenWeatherMap, and delivers alerts through the Telegram Bot API.

---

# 💡 Design Decisions

The project goes beyond the minimum assessment requirements by making several architectural decisions that improve maintainability, deployment reliability, and scalability.

| Decision | Reason |
|----------|--------|
| **JWT Authentication** | Migrated from server-side sessions after deployment because JWTs provide a more reliable solution for independently hosted frontend and backend applications. |
| **Backend API Proxy** | Weather and geocoding requests are routed through the backend to prevent exposing third-party API keys to the client. |
| **Approval-Based Access Control** | Weather alerts are processed only for users whose `approvalStatus` is **APPROVED**, ensuring pending or rejected users never receive notifications. |
| **Configurable Alert Frequency** | Users can choose how often they receive weather updates. The scheduler evaluates each user's configured interval before sending notifications, avoiding unnecessary alerts. |
| **Location-Based Weather Alerts** | Instead of broadcasting a single weather update, alerts are generated using each user's saved city coordinates, providing personalized weather notifications. |
| **Single User Collection** | Authentication, profile, approval status, Telegram configuration, and notification preferences are stored together to simplify authorization and scheduled processing. |
| **Node-Cron Scheduling** | Node-Cron was selected over BullMQ because periodic weather checks do not require distributed job queues, keeping the solution lightweight and maintainable. |
| **Polling + Webhook Support** | Telegram integration supports polling during development and webhooks in production, simplifying local development while following production best practices. |
| **Monorepo Structure** | The React frontend (`/admin`) and NestJS backend (`/api`) are maintained in a single repository, simplifying version control, development, and deployment. |

---

# ⚙️ Local Setup

## Prerequisites

- Node.js (v22+)
- MongoDB Atlas (or local MongoDB)
- Google OAuth credentials
- Telegram Bot Token
- OpenWeatherMap API Key

## Installation

```bash
# Clone the repository
git clone https://github.com/nand2384/weatherguard-admin.git
cd weatherguard-admin

# Backend
cd api
npm install

# Frontend
cd ../admin
npm install
```

Create `.env` files for both **/api** and **/admin**, then start the applications:

```bash
# Backend
cd api
npm run start:dev

# Frontend
cd admin
npm run dev
```

---

# 🚀 Deployment

| Service | Platform |
|----------|----------|
| Frontend | Vercel |
| Backend | Azure App Service |
| Database | MongoDB Atlas |
| CI/CD | GitHub Actions |

For Azure Free Tier deployments, a lightweight `/health` endpoint is periodically invoked using **cron-job.org** to reduce application idle shutdowns during demonstrations.

---

# 🎥 Demo Video

The demonstration video covers:

- Google OAuth authentication
- Profile completion
- Telegram account linking
- Request Access workflow
- Admin approval process
- Telegram approval notification
- Scheduled weather alert delivery

**Video:**  
> https://youtu.be/olXsyj2z0jo

---

# 🌐 Live Demo

**URL**
> https://weatherguard-admin-nu.vercel.app/

---

# 🔮 Future Improvements

- Docker & Kubernetes deployment
- BullMQ for distributed scheduling
- Refresh Token authentication
- Redis caching
- GitHub OAuth support

---

# 👨‍💻 Author

**Nand Patel**

- GitHub: https://github.com/nand2384
- LinkedIn: https://linkedin.com/in/nand-patel-2308np6409/
