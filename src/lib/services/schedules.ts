import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import type { Schedule, ScheduleStatus } from '@/types/database.types';

export interface TimeSlotPreset {
  id: string;
  start_time: string;
  end_time: string;
  period: 'MORNING' | 'AFTERNOON';
  label: string;
}

export const STANDARD_TIME_SLOTS: TimeSlotPreset[] = [
  // Morning (Ca Sáng)
  { id: 'm-1', start_time: '08:00', end_time: '08:30', period: 'MORNING', label: '08:00 - 08:30' },
  { id: 'm-2', start_time: '08:30', end_time: '09:00', period: 'MORNING', label: '08:30 - 09:00' },
  { id: 'm-3', start_time: '09:00', end_time: '09:30', period: 'MORNING', label: '09:00 - 09:30' },
  { id: 'm-4', start_time: '09:30', end_time: '10:00', period: 'MORNING', label: '09:30 - 10:00' },
  { id: 'm-5', start_time: '10:00', end_time: '10:30', period: 'MORNING', label: '10:00 - 10:30' },
  { id: 'm-6', start_time: '10:30', end_time: '11:00', period: 'MORNING', label: '10:30 - 11:00' },
  { id: 'm-7', start_time: '11:00', end_time: '11:30', period: 'MORNING', label: '11:00 - 11:30' },

  // Afternoon (Ca Chiều)
  { id: 'a-1', start_time: '13:30', end_time: '14:00', period: 'AFTERNOON', label: '13:30 - 14:00' },
  { id: 'a-2', start_time: '14:00', end_time: '14:30', period: 'AFTERNOON', label: '14:00 - 14:30' },
  { id: 'a-3', start_time: '14:30', end_time: '15:00', period: 'AFTERNOON', label: '14:30 - 15:00' },
  { id: 'a-4', start_time: '15:00', end_time: '15:30', period: 'AFTERNOON', label: '15:00 - 15:30' },
  { id: 'a-5', start_time: '15:30', end_time: '16:00', period: 'AFTERNOON', label: '15:30 - 16:00' },
  { id: 'a-6', start_time: '16:00', end_time: '16:30', period: 'AFTERNOON', label: '16:00 - 16:30' },
  { id: 'a-7', start_time: '16:30', end_time: '17:00', period: 'AFTERNOON', label: '16:30 - 17:00' },
];

export interface BulkScheduleParams {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  selectedDays: number[]; // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
  selectedSlots: { start_time: string; end_time: string }[];
}

// In-memory offline store for demo when Supabase is not configured yet
let mockSchedulesStore: Schedule[] = [
  {
    id: 'sch-sample-1',
    doctor_id: 'doc-1',
    date: new Date().toISOString().split('T')[0],
    start_time: '08:00',
    end_time: '08:30',
    status: 'AVAILABLE',
    created_at: new Date().toISOString(),
  },
  {
    id: 'sch-sample-2',
    doctor_id: 'doc-1',
    date: new Date().toISOString().split('T')[0],
    start_time: '08:30',
    end_time: '09:00',
    status: 'BOOKED',
    created_at: new Date().toISOString(),
  },
  {
    id: 'sch-sample-3',
    doctor_id: 'doc-1',
    date: new Date().toISOString().split('T')[0],
    start_time: '09:00',
    end_time: '09:30',
    status: 'AVAILABLE',
    created_at: new Date().toISOString(),
  },
  {
    id: 'sch-sample-4',
    doctor_id: 'doc-1',
    date: new Date().toISOString().split('T')[0],
    start_time: '09:30',
    end_time: '10:00',
    status: 'AVAILABLE',
    created_at: new Date().toISOString(),
  },
  {
    id: 'sch-sample-5',
    doctor_id: 'doc-1',
    date: new Date().toISOString().split('T')[0],
    start_time: '10:00',
    end_time: '10:30',
    status: 'BLOCKED',
    created_at: new Date().toISOString(),
  },
  {
    id: 'sch-sample-6',
    doctor_id: 'doc-1',
    date: new Date().toISOString().split('T')[0],
    start_time: '14:00',
    end_time: '14:30',
    status: 'AVAILABLE',
    created_at: new Date().toISOString(),
  },
  {
    id: 'sch-sample-7',
    doctor_id: 'doc-1',
    date: new Date().toISOString().split('T')[0],
    start_time: '14:30',
    end_time: '15:00',
    status: 'AVAILABLE',
    created_at: new Date().toISOString(),
  },
];

/**
 * Get schedules for a doctor, optionally filtered by date or date range
 */
export async function getDoctorSchedules(
  doctorId: string,
  date?: string,
  startDate?: string,
  endDate?: string
): Promise<Schedule[]> {
  if (!isSupabaseConfigured()) {
    return mockSchedulesStore.filter((s) => {
      if (s.doctor_id !== doctorId && doctorId !== 'doc-1' && !doctorId.startsWith('d000')) {
        // allow sample doctor IDs in demo mode
      }
      if (date && s.date !== date) return false;
      if (startDate && s.date < startDate) return false;
      if (endDate && s.date > endDate) return false;
      return true;
    }).sort((a, b) => a.start_time.localeCompare(b.start_time));
  }

  try {
    const supabase = createClient();
    let query = supabase
      .from('schedules')
      .select('*')
      .eq('doctor_id', doctorId);

    if (date) {
      query = query.eq('date', date);
    } else {
      if (startDate) query = query.gte('date', startDate);
      if (endDate) query = query.lte('date', endDate);
    }

    const { data, error } = await query.order('start_time', { ascending: true });

    if (error || !data) {
      return mockSchedulesStore.filter((s) => !date || s.date === date);
    }

    return data;
  } catch (err) {
    console.warn('Error fetching schedules, fallback to mock:', err);
    return mockSchedulesStore.filter((s) => !date || s.date === date);
  }
}

/**
 * Bulk Generate Schedules for a Doctor
 */
export async function bulkCreateSchedules(
  doctorId: string,
  params: BulkScheduleParams
): Promise<{ success: boolean; createdCount: number; error?: string }> {
  const { startDate, endDate, selectedDays, selectedSlots } = params;

  if (!startDate || !endDate) {
    return { success: false, createdCount: 0, error: 'Vui lòng chọn khoảng ngày bắt đầu và kết thúc.' };
  }

  if (selectedDays.length === 0) {
    return { success: false, createdCount: 0, error: 'Vui lòng chọn ít nhất 1 ngày trong tuần.' };
  }

  if (selectedSlots.length === 0) {
    return { success: false, createdCount: 0, error: 'Vui lòng chọn ít nhất 1 khung giờ khám.' };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start > end) {
    return { success: false, createdCount: 0, error: 'Ngày bắt đầu không được lớn hơn ngày kết thúc.' };
  }

  // Generate list of items
  const newItems: Omit<Schedule, 'id' | 'created_at'>[] = [];
  const curr = new Date(start);

  while (curr <= end) {
    const dayOfWeek = curr.getDay(); // 0 is Sunday
    if (selectedDays.includes(dayOfWeek)) {
      const dateStr = curr.toISOString().split('T')[0];
      for (const slot of selectedSlots) {
        newItems.push({
          doctor_id: doctorId,
          date: dateStr,
          start_time: slot.start_time,
          end_time: slot.end_time,
          status: 'AVAILABLE',
        });
      }
    }
    curr.setDate(curr.getDate() + 1);
  }

  if (newItems.length === 0) {
    return { success: false, createdCount: 0, error: 'Không có ngày nào khớp với cấu hình đã chọn.' };
  }

  if (!isSupabaseConfigured()) {
    // Add to mock store, preventing duplicate (doctor_id, date, start_time)
    let added = 0;
    for (const item of newItems) {
      const exists = mockSchedulesStore.some(
        (s) => s.date === item.date && s.start_time === item.start_time
      );
      if (!exists) {
        mockSchedulesStore.push({
          id: `sch-gen-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          ...item,
          created_at: new Date().toISOString(),
        });
        added++;
      }
    }
    return { success: true, createdCount: added };
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('schedules')
      .upsert(newItems, { onConflict: 'doctor_id,date,start_time', ignoreDuplicates: true })
      .select();

    if (error) {
      return { success: false, createdCount: 0, error: error.message };
    }

    return { success: true, createdCount: data ? data.length : newItems.length };
  } catch (err: any) {
    return { success: false, createdCount: 0, error: err.message || 'Lỗi khi tạo lịch hàng loạt' };
  }
}

/**
 * Toggle Schedule Status (AVAILABLE <-> BLOCKED)
 */
export async function toggleScheduleStatus(
  scheduleId: string,
  currentStatus: ScheduleStatus
): Promise<{ success: boolean; newStatus?: ScheduleStatus; error?: string }> {
  if (currentStatus === 'BOOKED') {
    return {
      success: false,
      error: 'Khung giờ này đã có bệnh nhân đặt khám, không thể trực tiếp khóa hoặc chuyển trạng thái.',
    };
  }

  const targetStatus: ScheduleStatus = currentStatus === 'AVAILABLE' ? 'BLOCKED' : 'AVAILABLE';

  if (!isSupabaseConfigured()) {
    const item = mockSchedulesStore.find((s) => s.id === scheduleId);
    if (item) {
      item.status = targetStatus;
      return { success: true, newStatus: targetStatus };
    }
    return { success: false, error: 'Không tìm thấy khung giờ.' };
  }

  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('schedules')
      .update({ status: targetStatus })
      .eq('id', scheduleId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, newStatus: targetStatus };
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi khi cập nhật trạng thái lịch' };
  }
}

/**
 * Delete an unbooked schedule slot
 */
export async function deleteSchedule(
  scheduleId: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    const idx = mockSchedulesStore.findIndex((s) => s.id === scheduleId);
    if (idx !== -1) {
      if (mockSchedulesStore[idx].status === 'BOOKED') {
        return { success: false, error: 'Không thể xóa khung giờ đã có bệnh nhân đặt hẹn.' };
      }
      mockSchedulesStore.splice(idx, 1);
      return { success: true };
    }
    return { success: false, error: 'Không tìm thấy khung giờ.' };
  }

  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('schedules')
      .delete()
      .eq('id', scheduleId)
      .neq('status', 'BOOKED');

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi khi xóa khung giờ' };
  }
}

/**
 * Add a single schedule slot
 */
export async function addSingleSchedule(
  doctorId: string,
  date: string,
  start_time: string,
  end_time: string
): Promise<{ success: boolean; schedule?: Schedule; error?: string }> {
  if (!isSupabaseConfigured()) {
    const exists = mockSchedulesStore.some(
      (s) => s.date === date && s.start_time === start_time
    );
    if (exists) {
      return { success: false, error: 'Khung giờ này đã tồn tại trong ngày.' };
    }

    const newSch: Schedule = {
      id: `sch-manual-${Date.now()}`,
      doctor_id: doctorId,
      date,
      start_time,
      end_time,
      status: 'AVAILABLE',
      created_at: new Date().toISOString(),
    };
    mockSchedulesStore.push(newSch);
    return { success: true, schedule: newSch };
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('schedules')
      .insert({
        doctor_id: doctorId,
        date,
        start_time,
        end_time,
        status: 'AVAILABLE',
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, schedule: data };
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi khi thêm khung giờ' };
  }
}
