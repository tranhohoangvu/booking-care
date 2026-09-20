import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import type { Review } from '@/types/database.types';
import { MOCK_DOCTORS } from '@/lib/services/doctors';

export interface CreateReviewPayload {
  appointment_id: string;
  doctor_id: string;
  patient_id: string;
  patient_name: string;
  rating: number; // 1 to 5
  comment: string;
}

// In-memory reviews store
let mockReviewsStore: (Review & { patient_name: string })[] = [
  {
    id: 'rev-1',
    doctor_id: 'doc-1',
    patient_id: 'patient-demo-3',
    appointment_id: 'BKC-19042',
    rating: 5,
    comment: 'Bác sĩ Liệu rất ân cần, giải thích cặn kẽ tình trạng thoái hóa khớp vai của tôi và cho phác đồ tập vật lý trị liệu rất hiệu quả.',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    patient_name: 'Phạm Minh Đức',
  },
  {
    id: 'rev-2',
    doctor_id: 'doc-1',
    patient_id: 'usr-demo-sample',
    appointment_id: 'apt-sample-prev',
    rating: 5,
    comment: 'Khám đúng giờ hẹn, không phải chen lấn chờ đợi tại bệnh viện. Bác sĩ chuyên môn rất giỏi.',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    patient_name: 'Trần Hoài Nam',
  },
  {
    id: 'rev-3',
    doctor_id: 'doc-1',
    patient_id: 'usr-demo-sample-2',
    appointment_id: 'apt-sample-prev-2',
    rating: 4,
    comment: 'Bác sĩ tư vấn kỹ lưỡng, dặn dò chu đáo về chế độ ăn uống và vận động hợp lý.',
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    patient_name: 'Nguyễn Thị Thu',
  },
];

/**
 * Get verified reviews for a doctor
 */
export async function getDoctorReviews(
  doctorId: string
): Promise<(Review & { patient_name: string })[]> {
  if (!isSupabaseConfigured()) {
    return mockReviewsStore.filter(
      (r) => r.doctor_id === doctorId || doctorId === 'doc-1'
    );
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('reviews')
      .select('*, patient:users(id, email)')
      .eq('doctor_id', doctorId)
      .order('created_at', { ascending: false });

    if (error || !data) {
      return mockReviewsStore.filter(
        (r) => r.doctor_id === doctorId || doctorId === 'doc-1'
      );
    }

    return data.map((item: any) => ({
      id: item.id,
      doctor_id: item.doctor_id,
      patient_id: item.patient_id,
      appointment_id: item.appointment_id,
      rating: item.rating,
      comment: item.comment,
      created_at: item.created_at,
      patient_name: item.patient?.email?.split('@')[0] || 'Người bệnh ẩn danh',
    }));
  } catch (err) {
    console.warn('Error fetching doctor reviews:', err);
    return mockReviewsStore.filter(
      (r) => r.doctor_id === doctorId || doctorId === 'doc-1'
    );
  }
}

/**
 * Check if a patient has already submitted a review for an appointment
 */
export async function hasPatientReviewed(
  appointmentId: string,
  patientId?: string
): Promise<boolean> {
  const found = mockReviewsStore.some((r) => r.appointment_id === appointmentId);
  if (found) return true;

  if (!isSupabaseConfigured()) return false;

  try {
    const supabase = createClient();
    const { data } = await supabase
      .from('reviews')
      .select('id')
      .eq('appointment_id', appointmentId)
      .maybeSingle();

    return !!data;
  } catch {
    return false;
  }
}

/**
 * Create a new verified patient review
 */
export async function createReview(
  payload: CreateReviewPayload
): Promise<{ success: boolean; review?: Review; error?: string }> {
  const { appointment_id, doctor_id, patient_id, patient_name, rating, comment } = payload;

  if (!rating || rating < 1 || rating > 5) {
    return { success: false, error: 'Vui lòng chọn đánh giá từ 1 đến 5 sao.' };
  }
  if (!comment.trim()) {
    return { success: false, error: 'Vui lòng nhập nhận xét về buổi khám.' };
  }

  // Check duplicate
  const already = await hasPatientReviewed(appointment_id, patient_id);
  if (already) {
    return { success: false, error: 'Lịch khám này đã được gửi đánh giá trước đó.' };
  }

  const newReview: Review & { patient_name: string } = {
    id: `rev-${Date.now()}`,
    appointment_id,
    doctor_id,
    patient_id,
    rating,
    comment: comment.trim(),
    created_at: new Date().toISOString(),
    patient_name: patient_name || 'Bệnh nhân BookingCare',
  };

  mockReviewsStore.unshift(newReview);

  // Update doctor rating stats in mock
  const doc = MOCK_DOCTORS.find((d) => d.id === doctor_id);
  if (doc) {
    const allDocReviews = mockReviewsStore.filter((r) => r.doctor_id === doctor_id);
    const sum = allDocReviews.reduce((acc, cur) => acc + cur.rating, 0);
    doc.total_reviews = (doc.total_reviews || 0) + 1;
    doc.average_rating = parseFloat((sum / allDocReviews.length).toFixed(1));
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      await supabase.from('reviews').insert({
        appointment_id,
        doctor_id,
        patient_id,
        rating,
        comment: comment.trim(),
      });
    } catch (err) {
      console.warn('Error inserting review to supabase:', err);
    }
  }

  return { success: true, review: newReview };
}
