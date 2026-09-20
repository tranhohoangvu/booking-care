import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import type { 
  Appointment, 
  AppointmentStatus, 
  BookingFor, 
  PaymentMethod, 
  PaymentStatus,
  DoctorProfile,
  Schedule
} from '@/types/database.types';
import { getDoctorById, MOCK_DOCTORS } from '@/lib/services/doctors';

export interface CreateAppointmentPayload {
  patient_id: string;
  doctor_id: string;
  schedule_id?: string;
  date: string;       // YYYY-MM-DD
  start_time: string; // HH:MM
  end_time?: string;   // HH:MM
  booking_for: BookingFor;
  patient_name: string;
  patient_phone: string;
  patient_dob?: string | null;
  patient_gender?: string | null;
  reason: string;
  payment_method: PaymentMethod;
}

export interface AppointmentWithDetails extends Appointment {
  doctor_info?: {
    id: string;
    full_name: string;
    degree: string;
    avatar_url: string | null;
    specialty_name: string;
    clinic_name: string;
    clinic_address: string;
    consultation_fee: number;
    phone: string | null;
  };
  formatted_time?: string;
  formatted_date?: string;
}

// In-memory offline store for demo when Supabase is not configured yet
let mockAppointmentsStore: AppointmentWithDetails[] = [
  {
    id: 'apt-demo-101',
    patient_id: 'demo-patient-id',
    doctor_id: 'doc-1',
    schedule_id: 'sch-sample-2',
    booking_for: 'SELF',
    patient_name: 'Nguyễn Văn A',
    patient_phone: '0901234567',
    patient_dob: '1995-06-15',
    patient_gender: 'Nam',
    reason: 'Đau khớp gối kéo dài sau khi chạy bộ, đau nhức khi co duỗi.',
    status: 'CONFIRMED',
    payment_method: 'CASH',
    payment_status: 'UNPAID',
    diagnosis: null,
    doctor_notes: null,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    doctor_info: {
      id: 'doc-1',
      full_name: 'PGS.TS.BS Nguyễn Văn Liệu',
      degree: 'Phó Giáo sư, Tiến sĩ, Bác sĩ',
      avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80',
      specialty_name: 'Cơ Xương Khớp',
      clinic_name: 'Bệnh viện Đại học Y Dược TP.HCM',
      clinic_address: '215 Hồng Bàng, Phường 11, Quận 5, TP. Hồ Chí Minh',
      consultation_fee: 350000,
      phone: '028 3855 4269',
    },
    formatted_time: '08:30 - 09:00',
    formatted_date: new Date().toISOString().split('T')[0],
  },
  {
    id: 'BKC-28491',
    patient_id: 'patient-demo-2',
    doctor_id: 'doc-1',
    schedule_id: 'sch-sample-3',
    booking_for: 'SELF',
    patient_name: 'Lê Thị Hoa',
    patient_phone: '0988776655',
    patient_dob: '1988-04-20',
    patient_gender: 'Nữ',
    reason: 'Tê buốt cánh tay phải lan xuống ngón tay út và áp út, hay xuất hiện khi ngồi làm việc lâu.',
    status: 'PENDING',
    payment_method: 'CASH',
    payment_status: 'UNPAID',
    diagnosis: null,
    doctor_notes: null,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
    doctor_info: {
      id: 'doc-1',
      full_name: 'PGS.TS.BS Nguyễn Văn Liệu',
      degree: 'Phó Giáo sư, Tiến sĩ, Bác sĩ',
      avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80',
      specialty_name: 'Cơ Xương Khớp',
      clinic_name: 'Bệnh viện Đại học Y Dược TP.HCM',
      clinic_address: '215 Hồng Bàng, Phường 11, Quận 5, TP. Hồ Chí Minh',
      consultation_fee: 350000,
      phone: '028 3855 4269',
    },
    formatted_time: '09:30 - 10:00',
    formatted_date: new Date().toISOString().split('T')[0],
  },
  {
    id: 'BKC-19042',
    patient_id: 'patient-demo-3',
    doctor_id: 'doc-1',
    schedule_id: 'sch-sample-1',
    booking_for: 'RELATIVE',
    patient_name: 'Phạm Minh Đức',
    patient_phone: '0913554433',
    patient_dob: '1962-11-10',
    patient_gender: 'Nam',
    reason: 'Thoái hóa khớp vai, cử động giơ tay lên cao bị đau chói nhiều về đêm.',
    status: 'COMPLETED',
    payment_method: 'ONLINE',
    payment_status: 'PAID',
    diagnosis: 'Viêm gân cơ chóp xoay vai phải mức độ vừa / Thoái hóa khớp vai',
    doctor_notes: 'Chỉ định: Siêu âm khớp vai, tập vật lý trị liệu phục hồi chức năng 2 lần/tuần. Tránh xách vật nặng bên tay phải. Tái khám sau 3 tuần.',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    doctor_info: {
      id: 'doc-1',
      full_name: 'PGS.TS.BS Nguyễn Văn Liệu',
      degree: 'Phó Giáo sư, Tiến sĩ, Bác sĩ',
      avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80',
      specialty_name: 'Cơ Xương Khớp',
      clinic_name: 'Bệnh viện Đại học Y Dược TP.HCM',
      clinic_address: '215 Hồng Bàng, Phường 11, Quận 5, TP. Hồ Chí Minh',
      consultation_fee: 350000,
      phone: '028 3855 4269',
    },
    formatted_time: '08:00 - 08:30',
    formatted_date: new Date().toISOString().split('T')[0],
  },
  {
    id: 'BKC-55120',
    patient_id: 'patient-demo-4',
    doctor_id: 'doc-1',
    schedule_id: 'sch-sample-4',
    booking_for: 'SELF',
    patient_name: 'Hoàng Thị Mai',
    patient_phone: '0977221199',
    patient_dob: '1992-08-05',
    patient_gender: 'Nữ',
    reason: 'Đau buốt vùng thắt lưng lan xuống đùi trái khi đứng lâu.',
    status: 'CONFIRMED',
    payment_method: 'CASH',
    payment_status: 'UNPAID',
    diagnosis: null,
    doctor_notes: null,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    updated_at: new Date(Date.now() - 7200000).toISOString(),
    doctor_info: {
      id: 'doc-1',
      full_name: 'PGS.TS.BS Nguyễn Văn Liệu',
      degree: 'Phó Giáo sư, Tiến sĩ, Bác sĩ',
      avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80',
      specialty_name: 'Cơ Xương Khớp',
      clinic_name: 'Bệnh viện Đại học Y Dược TP.HCM',
      clinic_address: '215 Hồng Bàng, Phường 11, Quận 5, TP. Hồ Chí Minh',
      consultation_fee: 350000,
      phone: '028 3855 4269',
    },
    formatted_time: '14:00 - 14:30',
    formatted_date: new Date().toISOString().split('T')[0],
  },
];

/**
 * Helper to enrich appointment with doctor & clinic details
 */
async function enrichAppointmentDetails(apt: any): Promise<AppointmentWithDetails> {
  const doctor = await getDoctorById(apt.doctor_id);
  const startTime = apt.schedule?.start_time || apt.start_time || '08:30';
  const endTime = apt.schedule?.end_time || apt.end_time || '09:00';
  const dateStr = apt.schedule?.date || apt.date || new Date().toISOString().split('T')[0];

  return {
    ...apt,
    doctor_info: {
      id: doctor?.id || apt.doctor_id,
      full_name: doctor?.full_name || 'Bác sĩ chuyên khoa',
      degree: doctor?.degree || 'Bác sĩ',
      avatar_url: doctor?.avatar_url || null,
      specialty_name: doctor?.specialty?.name || 'Đa khoa',
      clinic_name: doctor?.clinic?.name || 'Cơ sở y tế',
      clinic_address: doctor?.clinic?.address || 'Tại phòng khám',
      consultation_fee: doctor?.consultation_fee || 300000,
      phone: doctor?.clinic?.phone || '1900 2805',
    },
    formatted_time: `${startTime.substring(0, 5)} - ${endTime.substring(0, 5)}`,
    formatted_date: dateStr,
  };
}

/**
 * Create a new appointment with Anti-Race Condition safety
 */
export async function createAppointment(
  payload: CreateAppointmentPayload
): Promise<{ success: boolean; appointment?: AppointmentWithDetails; error?: string }> {
  const {
    patient_id,
    doctor_id,
    date,
    start_time,
    end_time = '09:00',
    booking_for,
    patient_name,
    patient_phone,
    patient_dob = null,
    patient_gender = null,
    reason,
    payment_method,
  } = payload;

  if (!patient_name || !patient_phone || !reason) {
    return { success: false, error: 'Vui lòng điền đầy đủ họ tên, số điện thoại và triệu chứng khám.' };
  }

  // 1. Offline Mode / Supabase not configured
  if (!isSupabaseConfigured()) {
    // Check if slot is already booked in mock store
    const alreadyBooked = mockAppointmentsStore.some(
      (a) =>
        a.doctor_id === doctor_id &&
        a.formatted_date === date &&
        a.formatted_time?.startsWith(start_time.substring(0, 5)) &&
        a.status !== 'CANCELLED'
    );

    if (alreadyBooked) {
      return {
        success: false,
        error: 'Rất tiếc! Khung giờ này vừa có người đặt trước. Vui lòng chọn khung giờ khác.',
      };
    }

    const newAptId = `BKC-${Math.floor(10000 + Math.random() * 90000)}`;
    const newApt: AppointmentWithDetails = {
      id: newAptId,
      patient_id,
      doctor_id,
      schedule_id: payload.schedule_id || `sch-${Date.now()}`,
      booking_for,
      patient_name,
      patient_phone,
      patient_dob,
      patient_gender,
      reason,
      status: 'PENDING',
      payment_method,
      payment_status: payment_method === 'ONLINE' ? 'PAID' : 'UNPAID',
      diagnosis: null,
      doctor_notes: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      formatted_time: `${start_time.substring(0, 5)} - ${end_time.substring(0, 5)}`,
      formatted_date: date,
    };

    const enriched = await enrichAppointmentDetails(newApt);
    mockAppointmentsStore.unshift(enriched);

    return { success: true, appointment: enriched };
  }

  // 2. Real Supabase Database with Atomic Lock & Anti-Race Condition
  try {
    const supabase = createClient();

    // Step A: Find or create the schedule slot
    let scheduleId = payload.schedule_id;

    if (!scheduleId) {
      const { data: existingSlot, error: slotErr } = await supabase
        .from('schedules')
        .select('id, status')
        .eq('doctor_id', doctor_id)
        .eq('date', date)
        .eq('start_time', start_time)
        .maybeSingle();

      if (existingSlot) {
        if (existingSlot.status !== 'AVAILABLE') {
          return {
            success: false,
            error: 'Khung giờ này hiện không còn khả dụng (đã có người đặt hoặc đang tạm khóa).',
          };
        }
        scheduleId = existingSlot.id;
      } else {
        // Create slot as AVAILABLE first
        const { data: newSlot, error: createSlotErr } = await supabase
          .from('schedules')
          .insert({
            doctor_id,
            date,
            start_time,
            end_time,
            status: 'AVAILABLE',
          })
          .select('id')
          .single();

        if (createSlotErr || !newSlot) {
          return { success: false, error: 'Không thể khởi tạo khung giờ khám.' };
        }
        scheduleId = newSlot.id;
      }
    }

    // Step B: Atomic update schedule from AVAILABLE to BOOKED
    // If another transaction already booked it, this update affects 0 rows!
    const { data: updatedSlot, error: lockErr } = await supabase
      .from('schedules')
      .update({ status: 'BOOKED' })
      .eq('id', scheduleId)
      .eq('status', 'AVAILABLE')
      .select('id')
      .maybeSingle();

    if (lockErr || !updatedSlot) {
      return {
        success: false,
        error: 'Rất tiếc! Khung giờ này vừa có người đặt trước trong tích tắc. Vui lòng chọn khung giờ khác.',
      };
    }

    // Step C: Insert Appointment record
    const { data: newApt, error: aptErr } = await supabase
      .from('appointments')
      .insert({
        patient_id,
        doctor_id,
        schedule_id: scheduleId,
        booking_for,
        patient_name,
        patient_phone,
        patient_dob,
        patient_gender,
        reason,
        status: 'PENDING',
        payment_method,
        payment_status: payment_method === 'ONLINE' ? 'PAID' : 'UNPAID',
      })
      .select('*, schedule:schedules(*)')
      .single();

    if (aptErr || !newApt) {
      // Rollback schedule lock
      await supabase
        .from('schedules')
        .update({ status: 'AVAILABLE' })
        .eq('id', scheduleId);

      return {
        success: false,
        error: aptErr?.message.includes('unique')
          ? 'Khung giờ này đã được đặt bởi bệnh nhân khác.'
          : 'Không thể tạo lịch hẹn. Vui lòng thử lại.',
      };
    }

    const enriched = await enrichAppointmentDetails(newApt);
    return { success: true, appointment: enriched };
  } catch (err: any) {
    console.error('Error creating appointment:', err);
    return { success: false, error: err.message || 'Lỗi hệ thống khi đặt lịch khám' };
  }
}

/**
 * Get all appointments for a patient
 */
export async function getPatientAppointments(
  patientId: string
): Promise<AppointmentWithDetails[]> {
  if (!isSupabaseConfigured()) {
    return mockAppointmentsStore.filter(
      (a) => a.patient_id === patientId || a.patient_id === 'demo-patient-id'
    );
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('appointments')
      .select('*, schedule:schedules(*)')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error || !data) {
      return mockAppointmentsStore;
    }

    const enrichedList = await Promise.all(data.map((item) => enrichAppointmentDetails(item)));
    return enrichedList;
  } catch (err) {
    console.warn('Error fetching patient appointments, fallback:', err);
    return mockAppointmentsStore;
  }
}

/**
 * Get appointment by ID (for receipt page)
 */
export async function getAppointmentById(
  appointmentId: string
): Promise<AppointmentWithDetails | null> {
  if (!isSupabaseConfigured()) {
    const found = mockAppointmentsStore.find((a) => a.id === appointmentId);
    if (found) return found;
    return mockAppointmentsStore[0] || null;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('appointments')
      .select('*, schedule:schedules(*)')
      .eq('id', appointmentId)
      .single();

    if (error || !data) {
      return mockAppointmentsStore.find((a) => a.id === appointmentId) || mockAppointmentsStore[0] || null;
    }

    return await enrichAppointmentDetails(data);
  } catch (err) {
    return mockAppointmentsStore.find((a) => a.id === appointmentId) || mockAppointmentsStore[0] || null;
  }
}

/**
 * Cancel an appointment and release the schedule slot
 */
export async function cancelAppointment(
  appointmentId: string,
  cancelReason?: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    const apt = mockAppointmentsStore.find((a) => a.id === appointmentId);
    if (apt) {
      apt.status = 'CANCELLED';
      apt.doctor_notes = cancelReason ? `Lý do hủy: ${cancelReason}` : 'Bệnh nhân hủy lịch hẹn';
      return { success: true };
    }
    return { success: false, error: 'Không tìm thấy lịch hẹn.' };
  }

  try {
    const supabase = createClient();
    // 1. Get schedule_id from appointment
    const { data: apt, error: fetchErr } = await supabase
      .from('appointments')
      .select('schedule_id, status')
      .eq('id', appointmentId)
      .single();

    if (fetchErr || !apt) {
      return { success: false, error: 'Không tìm thấy lịch hẹn.' };
    }

    if (apt.status === 'CANCELLED') {
      return { success: false, error: 'Lịch hẹn này đã được hủy trước đó.' };
    }

    // 2. Update appointment status to CANCELLED
    const { error: cancelErr } = await supabase
      .from('appointments')
      .update({
        status: 'CANCELLED',
        doctor_notes: cancelReason ? `Lý do hủy: ${cancelReason}` : 'Bệnh nhân hủy lịch',
      })
      .eq('id', appointmentId);

    if (cancelErr) {
      return { success: false, error: cancelErr.message };
    }

    // 3. Release schedule slot back to AVAILABLE
    if (apt.schedule_id) {
      await supabase
        .from('schedules')
        .update({ status: 'AVAILABLE' })
        .eq('id', apt.schedule_id);
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi khi hủy lịch hẹn' };
  }
}

/**
 * Get all appointments for a doctor (optionally filter by date or status)
 */
export async function getDoctorAppointments(
  doctorId: string,
  filter?: { date?: string; status?: AppointmentStatus }
): Promise<AppointmentWithDetails[]> {
  if (!isSupabaseConfigured()) {
    let list = mockAppointmentsStore.filter((a) => a.doctor_id === doctorId || doctorId === 'doc-1');
    if (filter?.date) {
      list = list.filter((a) => a.formatted_date === filter.date);
    }
    if (filter?.status) {
      list = list.filter((a) => a.status === filter.status);
    }
    return list.sort((a, b) => (a.formatted_time || '').localeCompare(b.formatted_time || ''));
  }

  try {
    const supabase = createClient();
    let query = supabase
      .from('appointments')
      .select('*, schedule:schedules(*)')
      .eq('doctor_id', doctorId);

    if (filter?.status) {
      query = query.eq('status', filter.status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error || !data) {
      let fallback = mockAppointmentsStore.filter((a) => a.doctor_id === doctorId || doctorId === 'doc-1');
      if (filter?.date) fallback = fallback.filter((a) => a.formatted_date === filter.date);
      if (filter?.status) fallback = fallback.filter((a) => a.status === filter.status);
      return fallback;
    }

    let enriched = await Promise.all(data.map((item) => enrichAppointmentDetails(item)));
    if (filter?.date) {
      enriched = enriched.filter((a) => a.formatted_date === filter.date);
    }
    return enriched.sort((a, b) => (a.formatted_time || '').localeCompare(b.formatted_time || ''));
  } catch (err) {
    console.warn('Error fetching doctor appointments, fallback:', err);
    let fallback = mockAppointmentsStore.filter((a) => a.doctor_id === doctorId || doctorId === 'doc-1');
    if (filter?.date) fallback = fallback.filter((a) => a.formatted_date === filter.date);
    if (filter?.status) fallback = fallback.filter((a) => a.status === filter.status);
    return fallback;
  }
}

/**
 * Doctor confirms an appointment (PENDING -> CONFIRMED)
 */
export async function confirmAppointment(
  appointmentId: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    const apt = mockAppointmentsStore.find((a) => a.id === appointmentId);
    if (apt) {
      apt.status = 'CONFIRMED';
      apt.updated_at = new Date().toISOString();
      return { success: true };
    }
    return { success: false, error: 'Không tìm thấy lịch hẹn' };
  }

  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('appointments')
      .update({ status: 'CONFIRMED', updated_at: new Date().toISOString() })
      .eq('id', appointmentId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi khi xác nhận lịch hẹn' };
  }
}

/**
 * Doctor records clinical diagnosis and completes appointment (CONFIRMED/PENDING -> COMPLETED)
 */
export async function completeConsultation(
  appointmentId: string,
  payload: {
    diagnosis: string;
    doctor_notes: string;
  }
): Promise<{ success: boolean; error?: string }> {
  if (!payload.diagnosis.trim()) {
    return { success: false, error: 'Vui lòng nhập chẩn đoán y khoa trước khi hoàn thành ca khám.' };
  }

  if (!isSupabaseConfigured()) {
    const apt = mockAppointmentsStore.find((a) => a.id === appointmentId);
    if (apt) {
      apt.status = 'COMPLETED';
      apt.diagnosis = payload.diagnosis.trim();
      apt.doctor_notes = payload.doctor_notes.trim();
      apt.updated_at = new Date().toISOString();
      return { success: true };
    }
    return { success: false, error: 'Không tìm thấy lịch hẹn' };
  }

  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('appointments')
      .update({
        status: 'COMPLETED',
        diagnosis: payload.diagnosis.trim(),
        doctor_notes: payload.doctor_notes.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', appointmentId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi khi hoàn tất hồ sơ bệnh án' };
  }
}

/**
 * Doctor rejects / cancels an appointment with reason and releases slot
 */
export async function rejectDoctorAppointment(
  appointmentId: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  return await cancelAppointment(appointmentId, `Bác sĩ từ chối / hủy ca: ${reason}`);
}

/**
 * Realtime KPI Consultation Metrics for Doctor Dashboard
 */
export async function getDoctorConsultationMetrics(doctorId: string): Promise<{
  todayCount: number;
  pendingCount: number;
  confirmedCount: number;
  completedCount: number;
  cancelledCount: number;
  estimatedRevenue: number;
}> {
  const allAppointments = await getDoctorAppointments(doctorId);
  const todayStr = new Date().toISOString().split('T')[0];

  const todayList = allAppointments.filter((a) => a.formatted_date === todayStr);
  const pendingCount = allAppointments.filter((a) => a.status === 'PENDING').length;
  const confirmedCount = allAppointments.filter((a) => a.status === 'CONFIRMED').length;
  const completedCount = allAppointments.filter((a) => a.status === 'COMPLETED').length;
  const cancelledCount = allAppointments.filter((a) => a.status === 'CANCELLED').length;

  const fee = allAppointments[0]?.doctor_info?.consultation_fee || 350000;
  const estimatedRevenue = (confirmedCount + completedCount) * fee;

  return {
    todayCount: todayList.length,
    pendingCount,
    confirmedCount,
    completedCount,
    cancelledCount,
    estimatedRevenue,
  };
}

