# ResiPilot - Care Management Platform

AI-powered residential care management platform for foster care and child welfare.

## Tech Stack

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Node.js + Express + MongoDB + JWT Auth
- **Charts**: Recharts
- **Routing**: React Router v6

## Project Structure

```
├── frontend/          # React (Vite) frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components (shadcn/ui)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── layouts/       # Layout wrappers (DashboardLayout)
│   │   ├── lib/           # Utilities, API client, auth context
│   │   └── pages/         # Route pages
│   │       ├── dashboard/ # All dashboard sub-pages
│   │       ├── LoginPage.tsx
│   │       ├── SignupPage.tsx
│   │       └── OnboardingPage.tsx
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── package.json
│
├── backend/           # Node.js Express API
│   ├── src/
│   │   ├── middleware/    # Auth & role check middleware
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   └── index.js       # Server entry point
│   ├── package.json
│   └── .env.example
```

## Getting Started

### Backend

```bash
cd backend
cp .env.example .env    # Edit with your MongoDB URI and JWT secret
npm install
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env    # Edit API URL if needed
npm install
npm run dev
```

The frontend runs on `http://localhost:3000` and proxies `/api` requests to the backend at `http://localhost:5000`.

## Features

- **Dashboard** - Overview stats, charts, recent activity
- **Children Management** - CRUD for child profiles with risk levels
- **Foster Families** - Family management with capacity tracking
- **Case Management** - Cases with priority levels and timelines
- **Document Management** - Upload and manage documents
- **AI Assistant** - AI-powered chat for insights
- **Smart Matching** - AI placement matching
- **Risk Detection** - Automated risk alerts
- **Pulse** - Real-time system health monitoring
- **Communications** - Internal messaging system
- **Reports** - Generate and download reports
- **Analytics** - Data visualization and KPIs
- **Notifications** - Alert management
- **User Management** - Role-based access control
- **Settings** - System configuration
