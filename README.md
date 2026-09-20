# 🏥 BookingCare - Digital Healthcare Appointment Booking Platform

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%7C%20Auth%20%7C%20RLS-3ecf8e?style=flat-square&logo=supabase)](https://supabase.com/)

A modern, production-ready digital healthcare appointment booking platform inspired by **BookingCare**. It enables patients to discover specialists, browse available clinic schedules, book appointments for themselves or family members, and allows doctors and administrators to manage healthcare services efficiently.

---

## 🚀 Key Features

### 👤 Role-Based Access Control (RBAC)
- **Patient**: Search doctors/specialties, book appointments (self or relatives), view appointment history, and leave reviews upon completion.
- **Doctor**: Manage availability slots (bulk schedule creation), view patient rosters, confirm or cancel appointments, and record post-consultation diagnoses/notes.
- **Admin**: Comprehensive platform management across users, specialties, clinics, and doctor profiles.

### 🛡️ Enterprise-Grade Architecture & Security
- **Anti-Race Condition Booking**: Atomic PostgreSQL update patterns coupled with unique partial constraints on schedule slots prevent double bookings under concurrent traffic.
- **Supabase Row Level Security (RLS)**: Enforces access control directly at the database layer.
- **Automated Database Triggers**: Synchronizes `auth.users` to application profiles (`patient_profiles` / `doctor_profiles`) seamlessly.
- **SSR Session Middleware**: Robust token refresh and role-guarded routing (`/admin/*`, `/doctor/*`, `/appointments`).

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router, Server Components & Actions) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) & Radix UI / Shadcn design patterns |
| **Typography** | [Inter](https://fonts.google.com/specimen/Inter) (via `next/font/google`) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **State & Fetching** | [TanStack React Query v5](https://tanstack.com/query/latest) |
| **Validation** | [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/) |
| **Backend & DB** | [Supabase](https://supabase.com/) (PostgreSQL, Supabase Auth SSR, RLS, Storage) |

---

## 📁 Project Structure

```text
booking-care/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx          # Login with Suspense boundary
│   │   │   ├── register/page.tsx       # Registration with Patient/Doctor role selection
│   │   │   └── forgot-password/page.tsx# Password reset request
│   │   ├── auth/callback/route.ts      # OAuth / email verification callback
│   │   ├── globals.css                 # Custom medical theme & design tokens
│   │   ├── layout.tsx                  # Root layout with Inter font & Navbar/Footer
│   │   └── page.tsx                    # Hero Landing Page with search & highlights
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx              # Dynamic session-aware header
│   │   │   └── Footer.tsx              # Medical disclaimers & contact info
│   │   └── ui/                         # Reusable UI primitives (Button, Input, Card)
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts               # Browser Supabase client (@supabase/ssr)
│   │   │   ├── server.ts               # Server Supabase client with cookies
│   │   │   └── middleware.ts           # Session refresher & role guard
│   │   └── utils.ts                    # cn(), formatCurrency(), formatDate()
│   ├── middleware.ts                   # Next.js Route Guard Middleware
│   └── types/
│       └── database.types.ts           # TypeScript database entities & enums
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql      # Tables, Enums, Constraints, Triggers & RLS
│       └── 002_seed_data.sql           # Initial 8 Specialties & 4 Clinics
├── .env.example
├── package.json
└── README.md
```

---

## ⚡ Getting Started

### 1. Prerequisites
- **Node.js**: `v20+` or `v24+`
- **npm** or **pnpm**
- A free [Supabase](https://supabase.com) account

### 2. Clone and Install Dependencies

```bash
git clone https://github.com/tranhohoangvu/booking-care.git
cd booking-care
npm install
```

### 3. Setup Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your Supabase project credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Apply Database Migrations

1. Go to your **Supabase Dashboard** $\to$ **SQL Editor**.
2. Run the script in [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql).
3. Run the seed data script in [`supabase/migrations/002_seed_data.sql`](supabase/migrations/002_seed_data.sql).

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🗺️ Sprint Roadmap

- [x] **Sprint 1: Setup, Database Schema & Authentication**
  - Next.js 15, TypeScript, Tailwind CSS, and Inter font.
  - PostgreSQL schema with RLS, triggers, anti-race-condition indexes, and seed data.
  - Supabase SSR Auth, session middleware, login, registration, and responsive landing page.
- [ ] **Sprint 2: Profile & Master Data Management**
  - Patient & Doctor profiles, specialties directory, and clinic listings.
- [ ] **Sprint 3: Doctor Directory, Search & Filtering**
- [ ] **Sprint 4: Doctor Schedule Management & Bulk Slot Generator**
- [ ] **Sprint 5: Appointment Booking Flow (Self & Relatives)**
- [ ] **Sprint 6: Doctor Consultation Dashboard & Medical Notes**
- [ ] **Sprint 7: Admin Control Panel & Analytics**
- [ ] **Sprint 8: Reviews, Realtime Updates & Deployment**

---

## 📄 License

This project is licensed under the MIT License.
