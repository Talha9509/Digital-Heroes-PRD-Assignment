# Digital Heroes

A full-stack subscription web application that combines golf score tracking, monthly draw-based rewards, and charity contributions in one platform.[1] The product is designed to feel modern and emotionally engaging, with the UI led by charitable impact rather than traditional golf visuals.[1]

## Overview

Digital Heroes lets subscribers choose a monthly or yearly plan, enter their latest Stableford golf scores, participate in monthly prize draws, and direct part of their subscription toward a selected charity.[1] The platform includes separate public, subscriber, and administrator experiences, plus support for winner proof uploads, payout tracking, and charity management.[1]

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Fetch API
- Custom CSS / responsive UI

### Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL (Neon)
- Stripe
- JWT authentication
- Multer for winner proof uploads

### Deployment
- Frontend: Vercel
- Backend: Render / Railway / Fly.io
- Database: Neon Postgres

## Core Features

### Public visitor
- View the platform concept and CTA flow.[1]
- Explore listed charities and understand draw mechanics.[1]
- Start a monthly or yearly subscription.[1]

### Registered subscriber
- Sign up, log in, and manage profile settings.[1]
- Enter, edit, and delete Stableford scores.[1]
- Keep only the latest 5 scores, shown in reverse chronological order.[1]
- Select a charity and set a contribution percentage of at least 10%.[1]
- View subscription status, participation summary, winnings overview, and payment state.[1]
- Upload winner proof screenshots for admin verification.[1]

### Administrator
- Manage users, subscriptions, and scores.[1]
- Add, edit, and delete charities and related content.[1]
- Configure draw logic, run simulations, and publish monthly draw results.[1]
- Review winner submissions, approve or reject proof, and mark payouts as complete.[1]
- Access reports covering total users, prize pool totals, charity contributions, and draw statistics.[1]

## Product Rules

- Users can store only their latest 5 golf scores at any time.[1]
- Score values must be in Stableford format and remain between 1 and 45.[1]
- Only one score is allowed per date; duplicate dates are not allowed.[1]
- Monthly draws support 5-number, 4-number, and 3-number matches.[1]
- Prize pool allocation is 40% for 5-match winners, 35% for 4-match winners, and 25% for 3-match winners.[1]
- The 5-match jackpot rolls over if unclaimed.[1]
- Charity contribution starts at a minimum of 10% of the subscription fee, and users may increase it.[1]

## UI / UX Direction

The interface must not look like a conventional golf website.[1] The design should feel clean, modern, motion-enhanced, and emotionally driven, with charity impact emphasized more strongly than sport.[1] Golf clichés such as fairways, plaid, and club imagery should not be used as the primary visual language.[1]

## Project Structure

```text
Digital-Heroes/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── prisma.config.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── modules/
│   │   ├── utils/
│   │   ├── generated/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

## Backend Modules

- `auth` – registration, login, current user profile, JWT validation.
- `subscription` – Stripe checkout, webhooks, subscription status.
- `scores` – add, update, delete, and list latest golf scores.
- `charity` – charity listing and profile endpoints.
- `draws` – draw simulation, publish flow, prize pool logic.
- `winners` – winnings history, proof upload, verification, payout tracking.
- `admin` – admin-only management and reporting routes.

## Database Design

The backend uses PostgreSQL through Prisma and Neon. Core models include `User`, `GolfScore`, `Charity`, `CharityEvent`, `Payment`, `Donation`, `Draw`, `Winner`, and `WinnerProof`, which map directly to the subscription, score, draw, charity, and verification requirements in the PRD.[1]

## Environment Variables

### Backend

Create `backend/.env`:

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your_jwt_secret"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_MONTHLY="price_..."
STRIPE_PRICE_YEARLY="price_..."
FRONTEND_URL="http://localhost:5173"
PORT=4000
```

### Frontend

Create `frontend/.env`:

```env
VITE_API_URL="http://localhost:4000/api"
VITE_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

## Local Development

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Digital-Heroes
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure Prisma and database

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Start backend

```bash
npm run dev
```

### 5. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 6. Start frontend

```bash
npm run dev
```

## Stripe Setup

1. Create monthly and yearly recurring prices in Stripe.[1]
2. Add the Stripe price IDs to backend environment variables.
3. Configure the webhook endpoint:
   - `http://localhost:4000/api/stripe/webhook` for local development.
   - Your deployed backend URL for production.
4. Listen for subscription and invoice events to update user subscription state and payment records.

## Recommended Scripts

### Backend

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "seed": "ts-node prisma/seed.ts"
  }
}
```

### Frontend

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  }
}
```

## Deployment Notes

The PRD requires a live deployed website, a working user panel, a working admin panel, backend connectivity, and clean structured source code.[1] It also requires the project to be deployed using a new Vercel account and a new database project with properly configured environment variables.[1]

## Testing Checklist

- User signup and login work correctly.[1]
- Monthly and yearly subscription checkout flows work.[1]
- 5-score rolling logic behaves correctly.[1]
- Duplicate score dates are blocked.[1]
- Draw simulation and publish flows work correctly.[1]
- Prize pool calculations and jackpot rollover are accurate.[1]
- Charity selection and contribution percentages persist correctly.[1]
- Winner proof upload, admin verification, and payout state updates work.[1]
- User and admin dashboards are functional on mobile and desktop.[1]
- Edge cases and error handling are covered.[1]

## Future Scalability

The PRD expects the architecture to support multi-country expansion, future team and corporate account models, a campaign module, and a codebase structure that can extend into a mobile app later.[1] The repository should therefore be kept modular, API-first, and easy to extend across new user types and product modules.[1]

## Status

This repository is intended to implement the full Digital Heroes trainee assignment from the provided PRD, including frontend, backend, payment flow, charity workflows, draw engine, and admin operations.[1]