import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import type { Specialty, Clinic, DoctorProfile, Appointment } from '@/types/database.types';
import { MOCK_SPECIALTIES, type SpecialtyWithCount } from '@/lib/services/specialties';
import { MOCK_CLINICS, type ClinicWithStats } from '@/lib/services/clinics';
import { MOCK_DOCTORS, type DoctorWithDetails } from '@/lib/services/doctors';
import { getDoctorAppointments, type AppointmentWithDetails } from '@/lib/services/appointments';

// Mutable in-memory stores for Admin CRUD in demo mode
let adminSpecialtiesStore = [...MOCK_SPECIALTIES];
let adminClinicsStore = [...MOCK_CLINICS];
let adminDoctorsStore = [...MOCK_DOCTORS];

export interface AdminPlatformStats {
  totalPatients: number;
  totalDoctors: number;
  totalSpecialties: number;
  totalClinics: number;
  totalAppointments: number;
  totalRevenue: number;
  statusBreakdown: {
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
}

/**
 * Get comprehensive platform KPI statistics
 */
export async function getAdminPlatformStats(): Promise<AdminPlatformStats> {
  const appointments = await getAllPlatformAppointments();

  const pending = appointments.filter((a) => a.status === 'PENDING').length;
  const confirmed = appointments.filter((a) => a.status === 'CONFIRMED').length;
  const completed = appointments.filter((a) => a.status === 'COMPLETED').length;
  const cancelled = appointments.filter((a) => a.status === 'CANCELLED').length;

  const totalRevenue = appointments
    .filter((a) => a.status === 'CONFIRMED' || a.status === 'COMPLETED')
    .reduce((sum, cur) => sum + (cur.doctor_info?.consultation_fee || 350000), 0);

  return {
    totalPatients: 1420 + appointments.length,
    totalDoctors: adminDoctorsStore.length,
    totalSpecialties: adminSpecialtiesStore.length,
    totalClinics: adminClinicsStore.length,
    totalAppointments: appointments.length,
    totalRevenue,
    statusBreakdown: {
      pending,
      confirmed,
      completed,
      cancelled,
    },
  };
}

/**
 * Get all platform appointments
 */
export async function getAllPlatformAppointments(): Promise<AppointmentWithDetails[]> {
  return await getDoctorAppointments('doc-1');
}

// -------------------------------------------------------------
// 1. SPECIALTY CRUD
// -------------------------------------------------------------

export async function getAllAdminSpecialties(): Promise<SpecialtyWithCount[]> {
  if (!isSupabaseConfigured()) {
    return adminSpecialtiesStore;
  }
  try {
    const supabase = createClient();
    const { data } = await supabase.from('specialties').select('*, doctors:doctor_profiles(count)');
    if (data && data.length > 0) {
      return data.map((s: any) => ({
        ...s,
        doctor_count: s.doctors?.[0]?.count || 0,
      }));
    }
    return adminSpecialtiesStore;
  } catch {
    return adminSpecialtiesStore;
  }
}

export async function createSpecialty(payload: {
  name: string;
  slug?: string;
  description?: string;
  image_url?: string;
}): Promise<{ success: boolean; data?: Specialty; error?: string }> {
  if (!payload.name.trim()) {
    return { success: false, error: 'Tên chuyên khoa không được để trống.' };
  }

  const slug = payload.slug || payload.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const newSpec: SpecialtyWithCount = {
    id: `spec-${Date.now()}`,
    name: payload.name.trim(),
    slug,
    description: payload.description || 'Chuyên khoa y tế phục vụ khám và điều trị chuyên sâu.',
    image_url: payload.image_url || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    doctor_count: 0,
  };

  adminSpecialtiesStore.unshift(newSpec);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      await supabase.from('specialties').insert({
        name: newSpec.name,
        slug: newSpec.slug,
        description: newSpec.description,
        image_url: newSpec.image_url,
      });
    } catch (err) {
      console.warn('Supabase insert specialty failed:', err);
    }
  }

  return { success: true, data: newSpec };
}

export async function updateSpecialty(
  id: string,
  payload: Partial<Specialty>
): Promise<{ success: boolean; error?: string }> {
  const index = adminSpecialtiesStore.findIndex((s) => s.id === id);
  if (index !== -1) {
    adminSpecialtiesStore[index] = { ...adminSpecialtiesStore[index], ...payload };
    return { success: true };
  }
  return { success: false, error: 'Không tìm thấy chuyên khoa.' };
}

export async function deleteSpecialty(id: string): Promise<{ success: boolean; error?: string }> {
  adminSpecialtiesStore = adminSpecialtiesStore.filter((s) => s.id !== id);
  return { success: true };
}

// -------------------------------------------------------------
// 2. CLINIC CRUD
// -------------------------------------------------------------

export async function getAllAdminClinics(): Promise<ClinicWithStats[]> {
  if (!isSupabaseConfigured()) {
    return adminClinicsStore;
  }
  try {
    const supabase = createClient();
    const { data } = await supabase.from('clinics').select('*');
    if (data && data.length > 0) {
      return data.map((c: any) => ({
        ...c,
        doctor_count: 0,
        specialty_count: 0,
      }));
    }
    return adminClinicsStore;
  } catch {
    return adminClinicsStore;
  }
}

export async function createClinic(payload: {
  name: string;
  slug?: string;
  address: string;
  phone?: string;
  description?: string;
  image_url?: string;
}): Promise<{ success: boolean; data?: Clinic; error?: string }> {
  if (!payload.name.trim() || !payload.address.trim()) {
    return { success: false, error: 'Vui lòng điền tên cơ sở y tế và địa chỉ cụ thể.' };
  }

  const slug = payload.slug || payload.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const newClinic: ClinicWithStats = {
    id: `clinic-${Date.now()}`,
    name: payload.name.trim(),
    slug,
    address: payload.address.trim(),
    phone: payload.phone || '1900 2805',
    description: payload.description || 'Cơ sở khám chữa bệnh hiện đại đạt chuẩn chất lượng quốc gia.',
    image_url: payload.image_url || 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    doctor_count: 0,
    specialty_count: 0,
  };

  adminClinicsStore.unshift(newClinic);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      await supabase.from('clinics').insert({
        name: newClinic.name,
        slug: newClinic.slug,
        address: newClinic.address,
        phone: newClinic.phone,
        description: newClinic.description,
        image_url: newClinic.image_url,
      });
    } catch (err) {
      console.warn('Supabase insert clinic failed:', err);
    }
  }

  return { success: true, data: newClinic };
}

export async function updateClinic(
  id: string,
  payload: Partial<Clinic>
): Promise<{ success: boolean; error?: string }> {
  const index = adminClinicsStore.findIndex((c) => c.id === id);
  if (index !== -1) {
    adminClinicsStore[index] = { ...adminClinicsStore[index], ...payload };
    return { success: true };
  }
  return { success: false, error: 'Không tìm thấy cơ sở y tế.' };
}

export async function deleteClinic(id: string): Promise<{ success: boolean; error?: string }> {
  adminClinicsStore = adminClinicsStore.filter((c) => c.id !== id);
  return { success: true };
}

// -------------------------------------------------------------
// 3. DOCTOR CRUD
// -------------------------------------------------------------

export async function getAllAdminDoctors(): Promise<DoctorWithDetails[]> {
  return adminDoctorsStore;
}

export async function createDoctor(payload: {
  full_name: string;
  degree: string;
  specialty_id: string;
  clinic_id: string;
  consultation_fee: number;
  experience_years: number;
  bio?: string;
  avatar_url?: string;
}): Promise<{ success: boolean; data?: DoctorWithDetails; error?: string }> {
  if (!payload.full_name.trim()) {
    return { success: false, error: 'Vui lòng điền họ tên bác sĩ.' };
  }

  const spec = adminSpecialtiesStore.find((s) => s.id === payload.specialty_id);
  const clinic = adminClinicsStore.find((c) => c.id === payload.clinic_id);

  const newDoc: DoctorWithDetails = {
    id: `doc-${Date.now()}`,
    user_id: `usr-${Date.now()}`,
    specialty_id: payload.specialty_id,
    clinic_id: payload.clinic_id,
    full_name: payload.full_name.trim(),
    degree: payload.degree || 'Bác sĩ chuyên khoa',
    experience_years: payload.experience_years || 10,
    consultation_fee: payload.consultation_fee || 350000,
    bio: payload.bio || 'Bác sĩ có nhiều năm kinh nghiệm tại các bệnh viện tuyến đầu.',
    avatar_url: payload.avatar_url || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    specialty: spec,
    clinic: clinic,
    average_rating: 5.0,
    total_reviews: 1,
    available_slots: ['08:00', '08:30', '09:00', '09:30', '14:00', '14:30', '15:00'],
  };

  adminDoctorsStore.unshift(newDoc);
  return { success: true, data: newDoc };
}

export async function updateDoctor(
  id: string,
  payload: Partial<DoctorWithDetails>
): Promise<{ success: boolean; error?: string }> {
  const index = adminDoctorsStore.findIndex((d) => d.id === id);
  if (index !== -1) {
    adminDoctorsStore[index] = { ...adminDoctorsStore[index], ...payload };
    return { success: true };
  }
  return { success: false, error: 'Không tìm thấy bác sĩ.' };
}

export async function deleteDoctor(id: string): Promise<{ success: boolean; error?: string }> {
  adminDoctorsStore = adminDoctorsStore.filter((d) => d.id !== id);
  return { success: true };
}
