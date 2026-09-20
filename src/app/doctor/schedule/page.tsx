'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Lock, 
  Unlock, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  CalendarCheck2, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal,
  X,
  User,
  Check
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { DoctorSubnav } from '@/components/doctor/DoctorSubnav';
import { 
  getDoctorSchedules, 
  bulkCreateSchedules, 
  toggleScheduleStatus, 
  deleteSchedule, 
  addSingleSchedule,
  STANDARD_TIME_SLOTS,
  type TimeSlotPreset
} from '@/lib/services/schedules';
import type { Schedule, ScheduleStatus } from '@/types/database.types';
import { Button } from '@/components/ui/button';

// Helper to format date to YYYY-MM-DD
function formatDateToISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Helper to format date string to Vietnamese display
function formatDateToVN(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
  const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  return `${days[dateObj.getDay()]}, ngày ${d}/${m}/${y}`;
}

export default function DoctorSchedulePage() {
  const router = useRouter();
  const [doctorId, setDoctorId] = useState<string>('doc-1');
  const [selectedDate, setSelectedDate] = useState<string>(formatDateToISO(new Date()));
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal states
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isSingleModalOpen, setIsSingleModalOpen] = useState(false);

  // Bulk generator state
  const [bulkStartDate, setBulkStartDate] = useState<string>(formatDateToISO(new Date()));
  const [bulkEndDate, setBulkEndDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return formatDateToISO(d);
  });
  // 1 = Mon, 2 = Tue, ..., 6 = Sat, 0 = Sun
  const [bulkSelectedDays, setBulkSelectedDays] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [bulkSelectedSlotIds, setBulkSelectedSlotIds] = useState<string[]>(
    STANDARD_TIME_SLOTS.map((s) => s.id)
  );
  const [bulkSubmitting, setBulkSubmitting] = useState(false);

  // Single slot state
  const [singleDate, setSingleDate] = useState<string>(formatDateToISO(new Date()));
  const [singleSlotId, setSingleSlotId] = useState<string>(STANDARD_TIME_SLOTS[0].id);
  const [singleSubmitting, setSingleSubmitting] = useState(false);

  // Load current doctor info
  useEffect(() => {
    async function loadDoctorInfo() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('doctor_profiles')
            .select('id')
            .eq('user_id', user.id)
            .single();
          if (profile?.id) {
            setDoctorId(profile.id);
          }
        }
      } catch (err) {
        console.warn('Using default demo doctorId:', err);
      }
    }
    loadDoctorInfo();
  }, []);

  // Fetch schedules whenever doctorId or selectedDate changes
  useEffect(() => {
    async function fetchSchedules() {
      setLoading(true);
      try {
        const data = await getDoctorSchedules(doctorId, selectedDate);
        setSchedules(data);
      } catch (err) {
        console.error('Error loading schedules:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSchedules();
  }, [doctorId, selectedDate]);

  // Handle slot toggle
  const handleToggle = async (schedule: Schedule) => {
    if (schedule.status === 'BOOKED') {
      setFeedback({
        type: 'error',
        text: 'Khung giờ này đã có người đặt, không thể trực tiếp chuyển trạng thái!',
      });
      return;
    }

    setActionLoadingId(schedule.id);
    try {
      const res = await toggleScheduleStatus(schedule.id, schedule.status);
      if (res.success && res.newStatus) {
        setSchedules((prev) =>
          prev.map((s) => (s.id === schedule.id ? { ...s, status: res.newStatus! } : s))
        );
        setFeedback({
          type: 'success',
          text: `Đã ${res.newStatus === 'AVAILABLE' ? 'mở lại' : 'khóa'} khung giờ ${schedule.start_time} - ${schedule.end_time}.`,
        });
      } else {
        setFeedback({ type: 'error', text: res.error || 'Thao tác thất bại.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Lỗi không xác định.' });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle slot delete
  const handleDelete = async (schedule: Schedule) => {
    if (schedule.status === 'BOOKED') {
      setFeedback({
        type: 'error',
        text: 'Khung giờ này đã có bệnh nhân đặt khám, không thể xóa!',
      });
      return;
    }

    if (!confirm(`Bạn có chắc muốn xóa khung giờ ${schedule.start_time} - ${schedule.end_time}?`)) {
      return;
    }

    setActionLoadingId(schedule.id);
    try {
      const res = await deleteSchedule(schedule.id);
      if (res.success) {
        setSchedules((prev) => prev.filter((s) => s.id !== schedule.id));
        setFeedback({ type: 'success', text: 'Đã xóa khung giờ khám thành công.' });
      } else {
        setFeedback({ type: 'error', text: res.error || 'Không thể xóa khung giờ.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Lỗi khi xóa khung giờ.' });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Bulk Generator Submit
  const handleBulkGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setBulkSubmitting(true);
    setFeedback(null);

    const slotsToGenerate = STANDARD_TIME_SLOTS.filter((s) =>
      bulkSelectedSlotIds.includes(s.id)
    ).map((s) => ({ start_time: s.start_time, end_time: s.end_time }));

    try {
      const res = await bulkCreateSchedules(doctorId, {
        startDate: bulkStartDate,
        endDate: bulkEndDate,
        selectedDays: bulkSelectedDays,
        selectedSlots: slotsToGenerate,
      });

      if (res.success) {
        setFeedback({
          type: 'success',
          text: `Tạo thành công ${res.createdCount} khung giờ khám mới!`,
        });
        setIsBulkModalOpen(false);
        // Refresh current date view
        const refreshed = await getDoctorSchedules(doctorId, selectedDate);
        setSchedules(refreshed);
      } else {
        setFeedback({ type: 'error', text: res.error || 'Tạo lịch hàng loạt thất bại.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Lỗi xử lý.' });
    } finally {
      setBulkSubmitting(false);
    }
  };

  // Handle Single Slot Submit
  const handleAddSingleSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setSingleSubmitting(true);
    setFeedback(null);

    const targetPreset = STANDARD_TIME_SLOTS.find((s) => s.id === singleSlotId);
    if (!targetPreset) return;

    try {
      const res = await addSingleSchedule(
        doctorId,
        singleDate,
        targetPreset.start_time,
        targetPreset.end_time
      );

      if (res.success && res.schedule) {
        if (singleDate === selectedDate) {
          setSchedules((prev) => [...prev, res.schedule!].sort((a, b) => a.start_time.localeCompare(b.start_time)));
        }
        setFeedback({
          type: 'success',
          text: `Đã thêm khung giờ ${targetPreset.start_time} - ${targetPreset.end_time} cho ngày ${singleDate}.`,
        });
        setIsSingleModalOpen(false);
      } else {
        setFeedback({ type: 'error', text: res.error || 'Thêm khung giờ thất bại.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Lỗi thêm khung giờ.' });
    } finally {
      setSingleSubmitting(false);
    }
  };

  // Quick date navigation
  const shiftDate = (days: number) => {
    const [y, m, d] = selectedDate.split('-');
    const curr = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    curr.setDate(curr.getDate() + days);
    setSelectedDate(formatDateToISO(curr));
  };

  // Filter slots by morning and afternoon
  const morningSlots = schedules.filter((s) => s.start_time < '12:00');
  const afternoonSlots = schedules.filter((s) => s.start_time >= '12:00');

  // Stats calculation
  const totalSlots = schedules.length;
  const availableSlots = schedules.filter((s) => s.status === 'AVAILABLE').length;
  const bookedSlots = schedules.filter((s) => s.status === 'BOOKED').length;
  const blockedSlots = schedules.filter((s) => s.status === 'BLOCKED').length;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <DoctorSubnav
        title="Quản lý lịch làm việc & Khung giờ khám"
        subtitle="Thiết lập các ca khám bệnh, sinh lịch hàng loạt và kiểm soát trạng thái các khung giờ đặt hẹn."
      />

      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`mb-6 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs font-semibold animate-nav-fade ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Control Bar: Date Selector & Actions */}
      <div className="glass-card rounded-[24px] p-6 mb-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Date Selector Navigation */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => shiftDate(-1)}
              className="h-9 w-9 p-0 rounded-xl border-gray-200 bg-white/80 hover:bg-white"
            >
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </Button>

            <div className="flex items-center gap-2 bg-white/90 px-4 py-1.5 rounded-2xl border border-gray-200/80 shadow-xs">
              <Calendar className="w-4 h-4 text-[#22c55e]" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
                className="text-xs font-bold text-[#1a2e24] bg-transparent border-0 focus:outline-none cursor-pointer"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => shiftDate(1)}
              className="h-9 w-9 p-0 rounded-xl border-gray-200 bg-white/80 hover:bg-white"
            >
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </Button>

            <button
              type="button"
              onClick={() => setSelectedDate(formatDateToISO(new Date()))}
              className="text-xs font-semibold text-[#22c55e] hover:underline px-2"
            >
              Hôm nay
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSingleDate(selectedDate);
                setIsSingleModalOpen(true);
              }}
              className="h-9 px-3.5 text-xs font-semibold rounded-xl border-gray-300 bg-white hover:border-[#22c55e]"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Thêm khung giờ lẻ
            </Button>

            <Button
              size="sm"
              onClick={() => setIsBulkModalOpen(true)}
              className="h-9 px-4 text-xs font-semibold rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Sinh lịch hàng loạt (Bulk)
            </Button>
          </div>
        </div>

        {/* Selected Date Title & Stats Pills */}
        <div className="pt-4 border-t border-gray-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Lịch khám trong ngày
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#1a2e24]">
              {formatDateToVN(selectedDate)}
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="px-3 py-1 rounded-xl bg-gray-100/80 border border-gray-200 text-xs font-semibold text-gray-700">
              Tổng: <span className="font-bold text-[#1a2e24]">{totalSlots}</span>
            </div>
            <div className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
              Sẵn sàng: <span className="font-bold text-[#22c55e]">{availableSlots}</span>
            </div>
            <div className="px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-800">
              Đã đặt: <span className="font-bold text-amber-600">{bookedSlots}</span>
            </div>
            <div className="px-3 py-1 rounded-xl bg-gray-100 border border-gray-300 text-xs font-semibold text-gray-500">
              Tạm khóa: <span className="font-bold text-gray-700">{blockedSlots}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="glass-card rounded-[24px] p-12 text-center space-y-3">
          <div className="w-6 h-6 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-gray-600">Đang tải khung giờ làm việc...</p>
        </div>
      ) : totalSlots === 0 ? (
        /* Empty State */
        <div className="glass-card rounded-[28px] p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-[#22c55e]/10 text-[#22c55e] flex items-center justify-center mx-auto">
            <Clock className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#1a2e24]">
              Chưa có khung giờ khám cho ngày này
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Bạn chưa thiết lập lịch làm việc cho {formatDateToVN(selectedDate)}. Hãy sử dụng công cụ sinh lịch hàng loạt hoặc thêm khung giờ riêng lẻ.
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <Button
              size="sm"
              onClick={() => {
                setBulkStartDate(selectedDate);
                setBulkEndDate(selectedDate);
                setIsBulkModalOpen(true);
              }}
              className="h-9 px-4 text-xs font-semibold rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Sinh lịch cho ngày này
            </Button>
          </div>
        </div>
      ) : (
        /* Schedule Board: Morning & Afternoon */
        <div className="space-y-8">
          {/* Morning Section */}
          <div className="glass-card rounded-[24px] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <h3 className="font-bold text-sm text-[#1a2e24]">
                  Ca Sáng (08:00 - 11:30)
                </h3>
              </div>
              <span className="text-xs text-gray-500 font-medium">
                {morningSlots.length} khung giờ
              </span>
            </div>

            {morningSlots.length === 0 ? (
              <p className="text-xs text-gray-400 italic py-2">Không có ca khám buổi sáng.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {morningSlots.map((slot) => (
                  <SlotCard
                    key={slot.id}
                    slot={slot}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    actionLoading={actionLoadingId === slot.id}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Afternoon Section */}
          <div className="glass-card rounded-[24px] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                <h3 className="font-bold text-sm text-[#1a2e24]">
                  Ca Chiều (13:30 - 17:00)
                </h3>
              </div>
              <span className="text-xs text-gray-500 font-medium">
                {afternoonSlots.length} khung giờ
              </span>
            </div>

            {afternoonSlots.length === 0 ? (
              <p className="text-xs text-gray-400 italic py-2">Không có ca khám buổi chiều.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {afternoonSlots.map((slot) => (
                  <SlotCard
                    key={slot.id}
                    slot={slot}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    actionLoading={actionLoadingId === slot.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BULK GENERATOR MODAL */}
      {/* ========================================================================= */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-nav-fade">
          <div className="bg-white rounded-[28px] max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#22c55e]/15 text-[#22c55e] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#1a2e24]">
                    Công cụ sinh lịch hàng loạt
                  </h3>
                  <p className="text-xs text-gray-500">
                    Tự động tạo các ca khám Available theo khoảng ngày & thứ trong tuần
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBulkGenerate} className="space-y-6">
              {/* Date Range */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">
                  Khoảng ngày áp dụng
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-500 block">Từ ngày</span>
                    <input
                      type="date"
                      required
                      value={bulkStartDate}
                      onChange={(e) => setBulkStartDate(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 focus:border-[#22c55e] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-500 block">Đến ngày</span>
                    <input
                      type="date"
                      required
                      value={bulkEndDate}
                      onChange={(e) => setBulkEndDate(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 focus:border-[#22c55e] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Day of week selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700">
                    Áp dụng vào các thứ
                  </label>
                  <div className="flex gap-2 text-[11px] font-semibold text-[#22c55e]">
                    <button
                      type="button"
                      onClick={() => setBulkSelectedDays([1, 2, 3, 4, 5])}
                      className="hover:underline"
                    >
                      T2 - T6
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setBulkSelectedDays([0, 1, 2, 3, 4, 5, 6])}
                      className="hover:underline"
                    >
                      Cả tuần
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1.5">
                  {[
                    { day: 1, label: 'T2' },
                    { day: 2, label: 'T3' },
                    { day: 3, label: 'T4' },
                    { day: 4, label: 'T5' },
                    { day: 5, label: 'T6' },
                    { day: 6, label: 'T7' },
                    { day: 0, label: 'CN' },
                  ].map((item) => {
                    const isSelected = bulkSelectedDays.includes(item.day);
                    return (
                      <button
                        key={item.day}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setBulkSelectedDays((prev) => prev.filter((d) => d !== item.day));
                          } else {
                            setBulkSelectedDays((prev) => [...prev, item.day]);
                          }
                        }}
                        className={`py-2 rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-[#22c55e] text-white shadow-xs'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slot selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700">
                    Chọn các khung giờ tạo lịch ({bulkSelectedSlotIds.length} slot)
                  </label>
                  <div className="flex gap-2 text-[11px] font-semibold text-[#22c55e]">
                    <button
                      type="button"
                      onClick={() => setBulkSelectedSlotIds(STANDARD_TIME_SLOTS.map((s) => s.id))}
                      className="hover:underline"
                    >
                      Chọn tất cả
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setBulkSelectedSlotIds([])}
                      className="hover:underline"
                    >
                      Bỏ chọn
                    </button>
                  </div>
                </div>

                {/* Morning Slots */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                    Ca Sáng
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {STANDARD_TIME_SLOTS.filter((s) => s.period === 'MORNING').map((slot) => {
                      const isChecked = bulkSelectedSlotIds.includes(slot.id);
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => {
                            setBulkSelectedSlotIds((prev) =>
                              isChecked ? prev.filter((id) => id !== slot.id) : [...prev, slot.id]
                            );
                          }}
                          className={`p-2 rounded-xl text-xs font-semibold border transition-all flex items-center justify-between ${
                            isChecked
                              ? 'bg-emerald-50 border-[#22c55e] text-emerald-900'
                              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <span>{slot.label}</span>
                          {isChecked && <Check className="w-3 h-3 text-[#22c55e]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Afternoon Slots */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                    Ca Chiều
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {STANDARD_TIME_SLOTS.filter((s) => s.period === 'AFTERNOON').map((slot) => {
                      const isChecked = bulkSelectedSlotIds.includes(slot.id);
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => {
                            setBulkSelectedSlotIds((prev) =>
                              isChecked ? prev.filter((id) => id !== slot.id) : [...prev, slot.id]
                            );
                          }}
                          className={`p-2 rounded-xl text-xs font-semibold border transition-all flex items-center justify-between ${
                            isChecked
                              ? 'bg-emerald-50 border-[#22c55e] text-emerald-900'
                              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <span>{slot.label}</span>
                          {isChecked && <Check className="w-3 h-3 text-[#22c55e]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="h-9 px-4 text-xs font-semibold rounded-xl"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={bulkSubmitting || bulkSelectedSlotIds.length === 0}
                  className="h-9 px-5 text-xs font-semibold rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white"
                >
                  {bulkSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang tạo...</span>
                    </div>
                  ) : (
                    'Xác nhận sinh lịch'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SINGLE SLOT MODAL */}
      {/* ========================================================================= */}
      {isSingleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-nav-fade">
          <div className="bg-white rounded-[28px] max-w-md w-full p-6 space-y-5 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-sm text-[#1a2e24]">Thêm một khung giờ khám lẻ</h3>
              <button
                type="button"
                onClick={() => setIsSingleModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSingleSlot} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Ngày khám</label>
                <input
                  type="date"
                  required
                  value={singleDate}
                  onChange={(e) => setSingleDate(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 focus:border-[#22c55e] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Khung giờ 30 phút</label>
                <select
                  value={singleSlotId}
                  onChange={(e) => setSingleSlotId(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-gray-200 focus:border-[#22c55e] focus:outline-none bg-white"
                >
                  {STANDARD_TIME_SLOTS.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {slot.label} ({slot.period === 'MORNING' ? 'Sáng' : 'Chiều'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSingleModalOpen(false)}
                  className="h-9 px-4 text-xs font-semibold rounded-xl"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={singleSubmitting}
                  className="h-9 px-4 text-xs font-semibold rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white"
                >
                  {singleSubmitting ? 'Đang thêm...' : 'Thêm khung giờ'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component for individual Slot Card
function SlotCard({
  slot,
  onToggle,
  onDelete,
  actionLoading,
}: {
  slot: Schedule;
  onToggle: (s: Schedule) => void;
  onDelete: (s: Schedule) => void;
  actionLoading: boolean;
}) {
  const isAvailable = slot.status === 'AVAILABLE';
  const isBooked = slot.status === 'BOOKED';
  const isBlocked = slot.status === 'BLOCKED';

  return (
    <div
      className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
        isAvailable
          ? 'bg-white/90 border-emerald-200/80 shadow-xs hover:border-[#22c55e]'
          : isBooked
          ? 'bg-amber-50/90 border-amber-200 shadow-xs'
          : 'bg-gray-100/80 border-gray-200 opacity-75'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Clock className={`w-3.5 h-3.5 ${isAvailable ? 'text-[#22c55e]' : isBooked ? 'text-amber-500' : 'text-gray-400'}`} />
          <span className={`text-xs font-bold ${isBlocked ? 'line-through text-gray-500' : 'text-[#1a2e24]'}`}>
            {slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}
          </span>
        </div>

        {/* Status Badge */}
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isAvailable
              ? 'bg-emerald-100 text-emerald-800'
              : isBooked
              ? 'bg-amber-100 text-amber-800'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          {isAvailable ? 'Sẵn sàng' : isBooked ? 'Đã có hẹn' : 'Tạm khóa'}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        {isBooked ? (
          <span className="text-[11px] font-medium text-amber-700 flex items-center gap-1">
            <User className="w-3 h-3" /> Đã có bệnh nhân đặt
          </span>
        ) : (
          <button
            type="button"
            disabled={actionLoading}
            onClick={() => onToggle(slot)}
            className={`text-[11px] font-semibold flex items-center gap-1 transition-colors ${
              isAvailable
                ? 'text-gray-500 hover:text-amber-600'
                : 'text-[#22c55e] hover:text-[#16a34a]'
            }`}
          >
            {isAvailable ? (
              <>
                <Lock className="w-3 h-3" /> Khóa ca
              </>
            ) : (
              <>
                <Unlock className="w-3 h-3" /> Mở lại ca
              </>
            )}
          </button>
        )}

        {!isBooked && (
          <button
            type="button"
            disabled={actionLoading}
            onClick={() => onDelete(slot)}
            className="text-gray-400 hover:text-rose-500 p-1 transition-colors"
            title="Xóa khung giờ"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
