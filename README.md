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
│   │   │   ├── login/page.tsx          # Login with quick role-switcher (Patient, Doctor, Admin)
│   │   │   ├── register/page.tsx       # Registration with Patient/Doctor role selection
│   │   │   └── forgot-password/page.tsx# Password reset request
│   │   ├── auth/callback/route.ts      # OAuth / email verification callback
│   │   ├── doctor/                     # Protected Doctor Portal
│   │   │   ├── profile/page.tsx        # Doctor professional profile & credentials editor
│   │   │   └── schedule/page.tsx       # Daily schedule board, slot toggle & bulk generator
│   │   ├── doctors/                    # Public Doctor Directory
│   │   │   ├── page.tsx                # Multi-criteria search (keyword, specialty, clinic, price, sort)
│   │   │   └── [id]/page.tsx           # Doctor profile details & interactive slot booking
│   │   ├── specialties/                # Specialties Catalog
│   │   │   ├── page.tsx                # Realtime specialty directory
│   │   │   └── [slug]/page.tsx         # Specialty details & associated doctors
│   │   ├── clinics/                    # Healthcare Facilities Catalog
│   │   │   ├── page.tsx                # Clinics & hospitals directory with region filter
│   │   │   └── [slug]/page.tsx         # Clinic overview & working staff
│   │   ├── profile/page.tsx            # Patient personal profile management
│   │   ├── globals.css                 # Custom medical theme & design tokens
│   │   ├── layout.tsx                  # Root layout with Inter font & Navbar/Footer
│   │   └── page.tsx                    # Dynamic Landing Page connected to services layer
│   ├── components/
│   │   ├── doctor/
│   │   │   └── DoctorSubnav.tsx        # Doctor portal sub-navigation tabs
│   │   ├── layout/
│   │   │   ├── Navbar.tsx              # Dynamic session-aware header with role badge
│   │   │   └── Footer.tsx              # Medical disclaimers & contact info
│   │   └── ui/                         # Reusable UI primitives (Button, Input, Card)
│   ├── lib/
│   │   ├── services/                   # Application Data & Business Logic Layer
│   │   │   ├── doctors.ts              # Doctor search, filters, and detail queries
│   │   │   ├── specialties.ts          # Specialty catalog services
│   │   │   ├── clinics.ts              # Hospital & clinic catalog services
│   │   │   ├── profiles.ts             # Patient & Doctor profile CRUD
│   │   │   └── schedules.ts            # Schedule management, bulk generator & toggling
│   │   ├── supabase/
│   │   │   ├── client.ts               # Browser client with fast offline fallback detection
│   │   │   ├── server.ts               # Server Supabase client with cookies
│   │   │   └── middleware.ts           # Session refresher & RBAC role guard
│   │   └── utils.ts                    # cn(), formatCurrency(), formatDate()
│   ├── middleware.ts                   # Next.js Route Guard Middleware
│   └── types/
│       └── database.types.ts           # TypeScript database entities & enums
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql      # Tables, Enums, Constraints, Triggers & RLS
│       └── 002_seed_data.sql           # Seed Specialties, Clinics, Doctors & Schedules
├── .env.example
├── package.json
└── README.md
```

---

## ⚡ Getting Started

### 1. Prerequisites
- **Node.js**: `v20+` or `v24+`
- **npm** or **pnpm**
- A free [Supabase](https://supabase.com) account (or use built-in offline mock mode)

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

> [!TIP]
> The app includes a zero-latency **Offline Mock Engine**. If Supabase credentials remain unconfigured or set to placeholders, all features run offline at sub-second speeds.

### 4. Apply Database Migrations

1. Go to your **Supabase Dashboard** $\to$ **SQL Editor**.
2. Run [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql).
3. Run [`supabase/migrations/002_seed_data.sql`](supabase/migrations/002_seed_data.sql).

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗺️ Sprint Roadmap

- [x] **Sprint 1: Setup, Database Schema & Authentication**
  - Next.js 15, TypeScript, Tailwind CSS, and Inter font.
  - PostgreSQL schema with RLS, triggers, anti-race-condition indexes, and seed data.
  - Supabase SSR Auth, session middleware, login, registration, and responsive landing page.
- [x] **Sprint 2: Profile & Master Data Management**
  - Role-Based Access Control (RBAC) route guarding (`/profile`, `/doctor/*`, `/admin/*`).
  - Patient personal profile management (`/profile`).
  - Doctor credentials & bio management (`/doctor/profile`).
  - Specialties catalog & detail pages (`/specialties`, `/specialties/[slug]`).
  - Healthcare facilities catalog with region filtering (`/clinics`, `/clinics/[slug]`).
- [x] **Sprint 3: Doctor Directory, Search & Filtering**
  - Multi-criteria search engine (`searchDoctors`): keyword, specialty, clinic, price range, and sort order.
  - Public doctor search page (`/doctors`) with bidirectional 2-way URL params synchronization.
  - Doctor detail page (`/doctors/[id]`) with interactive slot picker, pricing details, and verified patient reviews.
- [x] **Sprint 4: Doctor Schedule Management & Bulk Slot Generator**
  - Doctor schedule service (`/src/lib/services/schedules.ts`) with standard 30-min time slots.
  - Daily & weekly schedule board (`/doctor/schedule`) categorized by Morning and Afternoon shifts.
  - **Bulk Schedule Generator**: Multi-day range, day-of-week selection (Mon–Sun), shift presets, and preview.
  - Slot toggling: Instant switching between `AVAILABLE` and `BLOCKED` with protection for `BOOKED` slots.
  - Unified Doctor Portal sub-navigation bar (`DoctorSubnav`).
- [ ] **Sprint 5: Appointment Booking Flow (Self & Relatives)**
- [ ] **Sprint 6: Doctor Consultation Dashboard & Medical Notes**
- [ ] **Sprint 7: Admin Control Panel & Analytics**
- [ ] **Sprint 8: Reviews, Realtime Updates & Deployment**

---

## 📄 License

This project is licensed under the MIT License.
