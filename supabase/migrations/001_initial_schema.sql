-- ==============================================================================
-- BOOKING CARE DATABASE SCHEMA
-- Migration: 001_initial_schema.sql
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM TYPES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('PATIENT', 'DOCTOR', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE schedule_status AS ENUM ('AVAILABLE', 'BOOKED', 'BLOCKED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE appointment_status AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('CASH', 'ONLINE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('UNPAID', 'PAID', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_for AS ENUM ('SELF', 'RELATIVE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. TABLES

-- Users table (mirrors auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'PATIENT',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Specialties table
CREATE TABLE IF NOT EXISTS public.specialties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Clinics table
CREATE TABLE IF NOT EXISTS public.clinics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(50),
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Doctor Profiles table
CREATE TABLE IF NOT EXISTS public.doctor_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    specialty_id UUID REFERENCES public.specialties(id) ON DELETE SET NULL,
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE SET NULL,
    full_name VARCHAR(255) NOT NULL,
    degree VARCHAR(100) DEFAULT 'Bác sĩ', -- Bác sĩ, Thạc sĩ, Tiến sĩ, PGS, GS...
    experience_years INT DEFAULT 0,
    consultation_fee NUMERIC(12, 2) NOT NULL DEFAULT 300000,
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Patient Profiles table
CREATE TABLE IF NOT EXISTS public.patient_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    dob DATE,
    gender VARCHAR(10), -- 'MALE', 'FEMALE', 'OTHER'
    address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Schedules table (30-min time slots)
CREATE TABLE IF NOT EXISTS public.schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES public.doctor_profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status schedule_status NOT NULL DEFAULT 'AVAILABLE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_doctor_slot UNIQUE (doctor_id, date, start_time)
);

-- Appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES public.doctor_profiles(id) ON DELETE CASCADE,
    schedule_id UUID NOT NULL REFERENCES public.schedules(id) ON DELETE RESTRICT,
    booking_for booking_for NOT NULL DEFAULT 'SELF',
    patient_name VARCHAR(255) NOT NULL,
    patient_phone VARCHAR(20) NOT NULL,
    patient_dob DATE,
    patient_gender VARCHAR(10),
    reason TEXT NOT NULL,
    status appointment_status NOT NULL DEFAULT 'PENDING',
    payment_method payment_method NOT NULL DEFAULT 'CASH',
    payment_status payment_status NOT NULL DEFAULT 'UNPAID',
    diagnosis TEXT,
    doctor_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Anti-Race Condition Constraint: Only 1 active (non-cancelled) appointment per schedule slot
CREATE UNIQUE INDEX IF NOT EXISTS idx_appointments_unique_active_slot 
ON public.appointments (schedule_id) 
WHERE status NOT IN ('CANCELLED');

-- Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES public.doctor_profiles(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    appointment_id UUID UNIQUE NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. TRIGGERS & FUNCTIONS

-- Function to handle new user registration from Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_role_val public.user_role;
    raw_role text;
BEGIN
    raw_role := COALESCE(NEW.raw_user_meta_data->>'role', 'PATIENT');
    IF raw_role = 'DOCTOR' THEN
        user_role_val := 'DOCTOR'::public.user_role;
    ELSIF raw_role = 'ADMIN' THEN
        user_role_val := 'ADMIN'::public.user_role;
    ELSE
        user_role_val := 'PATIENT'::public.user_role;
    END IF;

    -- Insert into public.users
    INSERT INTO public.users (id, email, role)
    VALUES (NEW.id, NEW.email, user_role_val)
    ON CONFLICT (id) DO NOTHING;

    -- If role is PATIENT, create default patient_profile
    IF user_role_val = 'PATIENT' THEN
        INSERT INTO public.patient_profiles (user_id, full_name, phone)
        VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
            NEW.raw_user_meta_data->>'phone'
        )
        ON CONFLICT (user_id) DO NOTHING;
    END IF;

    -- If role is DOCTOR, create empty doctor_profile
    IF user_role_val = 'DOCTOR' THEN
        INSERT INTO public.doctor_profiles (user_id, full_name)
        VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'full_name', 'Bác sĩ ' || split_part(NEW.email, '@', 1))
        )
        ON CONFLICT (user_id) DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to update updated_at on appointments
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_appointments_updated_at ON public.appointments;
CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Helpers for RLS check
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() AND role = 'ADMIN'
    );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_current_role()
RETURNS text AS $$
    SELECT role::text FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- USERS POLICIES
CREATE POLICY "Users can read their own record or Admin can read all"
    ON public.users FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Admin can update users"
    ON public.users FOR UPDATE
    USING (public.is_admin());

-- SPECIALTIES POLICIES
CREATE POLICY "Specialties are viewable by everyone"
    ON public.specialties FOR SELECT
    USING (true);

CREATE POLICY "Only admins can manage specialties"
    ON public.specialties FOR ALL
    USING (public.is_admin());

-- CLINICS POLICIES
CREATE POLICY "Clinics are viewable by everyone"
    ON public.clinics FOR SELECT
    USING (true);

CREATE POLICY "Only admins can manage clinics"
    ON public.clinics FOR ALL
    USING (public.is_admin());

-- DOCTOR PROFILES POLICIES
CREATE POLICY "Doctor profiles are viewable by everyone"
    ON public.doctor_profiles FOR SELECT
    USING (true);

CREATE POLICY "Doctors can update their own profile or Admin full access"
    ON public.doctor_profiles FOR UPDATE
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins can insert/delete doctor profiles"
    ON public.doctor_profiles FOR ALL
    USING (public.is_admin());

-- PATIENT PROFILES POLICIES
CREATE POLICY "Patients can view their own profile or Admin full access"
    ON public.patient_profiles FOR SELECT
    USING (
        auth.uid() = user_id 
        OR public.is_admin() 
        OR EXISTS (
            -- Doctors can view patient profile if there is an appointment between them
            SELECT 1 FROM public.appointments a
            JOIN public.doctor_profiles d ON d.id = a.doctor_id
            WHERE a.patient_id = public.patient_profiles.user_id AND d.user_id = auth.uid()
        )
    );

CREATE POLICY "Patients can update their own profile"
    ON public.patient_profiles FOR UPDATE
    USING (auth.uid() = user_id OR public.is_admin());

-- SCHEDULES POLICIES
CREATE POLICY "Schedules are viewable by everyone"
    ON public.schedules FOR SELECT
    USING (true);

CREATE POLICY "Doctors can manage their own schedules or Admin"
    ON public.schedules FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.doctor_profiles 
            WHERE id = schedules.doctor_id AND user_id = auth.uid()
        )
        OR public.is_admin()
    );

-- APPOINTMENTS POLICIES
CREATE POLICY "Patients can view their own appointments"
    ON public.appointments FOR SELECT
    USING (
        auth.uid() = patient_id 
        OR EXISTS (
            SELECT 1 FROM public.doctor_profiles 
            WHERE id = appointments.doctor_id AND user_id = auth.uid()
        )
        OR public.is_admin()
    );

CREATE POLICY "Patients can create appointments"
    ON public.appointments FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can cancel or Doctors can update their appointments"
    ON public.appointments FOR UPDATE
    USING (
        auth.uid() = patient_id 
        OR EXISTS (
            SELECT 1 FROM public.doctor_profiles 
            WHERE id = appointments.doctor_id AND user_id = auth.uid()
        )
        OR public.is_admin()
    );

-- REVIEWS POLICIES
CREATE POLICY "Reviews are viewable by everyone"
    ON public.reviews FOR SELECT
    USING (true);

CREATE POLICY "Patients can create review for completed appointment"
    ON public.reviews FOR INSERT
    WITH CHECK (
        auth.uid() = patient_id 
        AND EXISTS (
            SELECT 1 FROM public.appointments 
            WHERE id = reviews.appointment_id 
              AND patient_id = auth.uid() 
              AND status = 'COMPLETED'
        )
    );
