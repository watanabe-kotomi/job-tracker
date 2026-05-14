# Job Tracker

A full-stack web application for tracking job applications throughout the hiring process.

## Features

- **Authentication** — JWT-based registration and login
- **Job Applications** — Create and manage applications with status tracking, salary range, location, and notes
- **Companies** — Manage companies linked to applications
- **Filtering** — Filter applications by status, company, or keyword search
- **Pagination** — Server-side pagination on all list endpoints

## Tech Stack

**Frontend**
- React 19 / TypeScript / Vite
- React Router

**Backend**
- NestJS / TypeScript
- Prisma ORM
- PostgreSQL
- Passport.js + JWT

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL

### Backend

```bash
cd backend
cp .env.example .env    # fill in DATABASE_URL and JWT_SECRET
npm install
npx prisma migrate dev
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Project Structure

```
job-tracker/
├── backend/    # NestJS API  (port 3000)
└── frontend/   # React app   (port 5173)
```

## Development

Feature-based branching with conventional commits.
Architectural decisions, API design, and data modeling were designed and reviewed manually.
