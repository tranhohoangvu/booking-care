export type UserRole = 'PATIENT' | 'DOCTOR' | 'ADMIN';
export type ScheduleStatus = 'AVAILABLE' | 'BOOKED' | 'BLOCKED';
export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
export type PaymentMethod = 'CASH' | 'ONLINE';
export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED';
export type BookingFor = 'SELF' | 'RELATIVE';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface Specialty {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export interface Clinic {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string | null;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export interface DoctorProfile {
  id: string;
  user_id: string;
  specialty_id: string | null;
  clinic_id: string | null;
  full_name: string;
  degree: string;
  experience_years: number;
  consultation_fee: number;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  // Joins
  specialty?: Specialty;
  clinic?: Clinic;
  average_rating?: number;
  total_reviews?: number;
}

export interface PatientProfile {
  id: string;
  user_id: string;
  full_name: string;
  phone: string | null;
  dob: string | null;
  gender: string | null;
  address: string | null;
  created_at: string;
}

export interface Schedule {
  id: string;
  doctor_id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: ScheduleStatus;
  created_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  schedule_id: string;
  booking_for: BookingFor;
  patient_name: string;
  patient_phone: string;
  patient_dob: string | null;
  patient_gender: string | null;
  reason: string;
  status: AppointmentStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  diagnosis: string | null;
  doctor_notes: string | null;
  created_at: string;
  updated_at: string;
  // Joins
  doctor?: DoctorProfile;
  schedule?: Schedule;
  patient_user?: User;
}

export interface Review {
  id: string;
  doctor_id: string;
  patient_id: string;
  appointment_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  patient_name?: string;
}
