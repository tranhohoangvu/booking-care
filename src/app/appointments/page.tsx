'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Stethoscope, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  FileText, 
  Search, 
  ArrowRight,
  Filter,
  X,
  CreditCard,
  Building2,
  Phone
} from 'lucide-react';
import { getPatientAppointments, cancelAppointment, type AppointmentWithDetails } from '@/lib/services/appointments';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { AppointmentStatus } from '@/types/database.types';

type FilterTab = 'ALL' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED';

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Cancel Modal State
  const [cancelTarget, setCancelTarget] = useState<AppointmentWithDetails | null>(null);
  const [cancelReason, setCancelReason] = useState('Bận công việc đột xuất');
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  // Load appointments
  const loadData = async () => {
    setLoading(true);
    let patientId = 'demo-patient-id';

    // 1. Check demo user cookie
    if (typeof document !== 'undefined') {
      const demoCookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith('bookingcare_demo_user='));
      if (demoCookie) {
        try {
          const parsed = JSON.parse(decodeURIComponent(demoCookie.split('=')[1]));
          if (parsed.id) patientId = parsed.id;
        } catch {
          // ignore
        }
      }
    }

    // 2. Check supabase auth
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          patientId = session.user.id;
        }
      } catch (err) {
        console.warn('Error checking supabase session:', err);
      }
    }

    try {
      const data = await getPatientAppointments(patientId);
      setAppointments(data);
    } catch (err) {
      console.error('Failed to load patient appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle appointment cancellation
  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    setCancelError(null);

    try {
      const res = await cancelAppointment(cancelTarget.id, cancelReason);
      if (!res.success) {
        setCancelError(res.error || 'Không thể hủy lịch hẹn');
        setCancelling(false);
        return;
      }

      // Update in state
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === cancelTarget.id
            ? { ...a, status: 'CANCELLED', doctor_notes: `Lý do hủy: ${cancelReason}` }
            : a
        )
      );

      setCancelTarget(null);
    } catch (err: any) {
      setCancelError(err.message || 'Lỗi kết nối khi hủy lịch');
    } finally {
      setCancelling(false);
    }
  };

  // Filter appointments according to active tab & search query
  const filteredAppointments = appointments.filter((apt) => {
    // Tab filtering
    if (activeTab === 'UPCOMING') {
      if (apt.status !== 'PENDING' && apt.status !== 'CONFIRMED') return false;
    } else if (activeTab === 'COMPLETED') {
      if (apt.status !== 'COMPLETED') return false;
    } else if (activeTab === 'CANCELLED') {
      if (apt.status !== 'CANCELLED') return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDoc = apt.doctor_info?.full_name.toLowerCase().includes(q);
      const matchSpecialty = apt.doctor_info?.specialty_name.toLowerCase().includes(q);
      const matchCode = apt.id.toLowerCase().includes(q);
      const matchPatient = apt.patient_name.toLowerCase().includes(q);
      return matchDoc || matchSpecialty || matchCode || matchPatient;
    }

    return true;
  });

  // Calculate stats count
  const upcomingCount = appointments.filter((a) => a.status === 'PENDING' || a.status === 'CONFIRMED').length;
  const completedCount = appointments.filter((a) => a.status === 'COMPLETED').length;
  const cancelledCount = appointments.filter((a) => a.status === 'CANCELLED').length;

  const renderStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-500" /> Chờ tiếp đón
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#22c55e]" /> Đã xác nhận
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-blue-500" /> Đã hoàn thành
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold flex items-center gap-1">
            <XCircle className="w-3 h-3 text-rose-500" /> Đã hủy lịch
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-10 bg-gradient-to-b from-[#f8faf9] to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1a2e24] tracking-tight">
              Lịch Hẹn Khám Bệnh Của Tôi
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Theo dõi trạng thái, xem phiếu khám điện tử và quản lý các lượt khám của bạn và người thân.
            </p>
          </div>
          <Link href="/doctors">
            <Button className="h-11 px-5 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer">
              <Calendar className="w-4 h-4" /> Đặt thêm lịch khám mới
            </Button>
          </Link>
        </div>

        {/* Filter Controls & Search */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('ALL')}
              className={`py-2 px-3.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'ALL'
                  ? 'bg-[#1a2e24] text-white shadow-xs'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
              }`}
            >
              Tất cả ({appointments.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('UPCOMING')}
              className={`py-2 px-3.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'UPCOMING'
                  ? 'bg-[#22c55e] text-white shadow-xs'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
              }`}
            >
              Chờ khám ({upcomingCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('COMPLETED')}
              className={`py-2 px-3.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'COMPLETED'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
              }`}
            >
              Đã khám ({completedCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('CANCELLED')}
              className={`py-2 px-3.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'CANCELLED'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
              }`}
            >
              Đã hủy ({cancelledCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo mã, bác sĩ, chuyên khoa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-hidden bg-white/90"
            />
          </div>

        </div>

        {/* Appointments List */}
        {loading ? (
          <div className="glass-card rounded-[28px] p-12 flex flex-col items-center justify-center gap-3 text-gray-600">
            <div className="w-6 h-6 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold">Đang tải danh sách lịch hẹn...</span>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="glass-card rounded-[32px] p-12 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#22c55e] flex items-center justify-center mx-auto">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#1a2e24]">Không tìm thấy lịch hẹn phù hợp</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Bạn chưa có lịch hẹn nào trong mục này hoặc không có kết quả phù hợp với từ khóa tìm kiếm.
            </p>
            <Link href="/doctors">
              <Button className="rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs px-6">
                Đặt lịch với bác sĩ ngay
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((apt) => (
              <div
                key={apt.id}
                className="glass-card rounded-[28px] p-5 sm:p-6 transition-all hover:border-[#22c55e]/40 space-y-5"
              >
                {/* Card Top: Code, Status & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-extrabold text-[#1a2e24] bg-gray-100 px-3 py-1 rounded-lg">
                      {apt.id}
                    </span>
                    <span className="text-xs text-gray-500">
                      Tạo lúc: {new Date(apt.created_at).toLocaleDateString('vi-VN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {renderStatusBadge(apt.status)}
                  </div>
                </div>

                {/* Card Middle: Doctor & Appointment Specs */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  
                  {/* Doctor Info */}
                  <div className="lg:col-span-7 flex items-start gap-4">
                    <img
                      src={apt.doctor_info?.avatar_url || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80'}
                      alt={apt.doctor_info?.full_name || 'Bác sĩ'}
                      className="w-14 h-14 rounded-2xl object-cover border border-gray-200 shrink-0"
                    />
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#16a34a] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {apt.doctor_info?.degree || 'Bác sĩ'}
                      </span>
                      <h4 className="text-base font-extrabold text-[#1a2e24]">
                        {apt.doctor_info?.full_name}
                      </h4>
                      <div className="text-xs text-gray-600 flex items-center gap-1.5">
                        <Stethoscope className="w-3.5 h-3.5 text-[#22c55e]" />
                        <span>Chuyên khoa: {apt.doctor_info?.specialty_name}</span>
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                        <span>{apt.doctor_info?.clinic_name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Date, Time & Patient */}
                  <div className="lg:col-span-5 space-y-2 text-xs border-t lg:border-t-0 lg:border-l border-gray-100 pt-3 lg:pt-0 lg:pl-6">
                    <div className="flex items-center gap-2 font-bold text-[#1a2e24]">
                      <Calendar className="w-4 h-4 text-[#22c55e]" />
                      <span>Ngày khám: {apt.formatted_date}</span>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-emerald-800">
                      <Clock className="w-4 h-4 text-[#22c55e]" />
                      <span>Khung giờ: {apt.formatted_time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>
                        Người khám: <strong className="text-gray-900">{apt.patient_name}</strong> ({apt.patient_phone})
                      </span>
                    </div>
                  </div>

                </div>

                {/* Reason snippet */}
                {apt.reason && (
                  <div className="p-3 rounded-xl bg-[#f8faf9] border border-gray-100 text-xs text-gray-700 flex items-start gap-2">
                    <FileText className="w-3.5 h-3.5 text-[#22c55e] shrink-0 mt-0.5" />
                    <span className="line-clamp-2"><strong>Triệu chứng:</strong> {apt.reason}</span>
                  </div>
                )}

                {/* Card Bottom: Action Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 text-xs">
                  <div className="flex items-center gap-2 text-gray-500">
                    <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                    <span>Phí khám: <strong className="text-gray-900">{formatCurrency(apt.doctor_info?.consultation_fee || 350000)}</strong></span>
                    <span>•</span>
                    <span>{apt.payment_method === 'ONLINE' ? 'Đã thanh toán Online' : 'Thanh toán tại viện'}</span>
                  </div>

                  <div className="flex items-center gap-2 ml-auto">
                    {/* View Receipt Button */}
                    <Link href={`/booking/success/${apt.id}`}>
                      <Button
                        variant="outline"
                        className="h-9 px-4 rounded-full border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 flex items-center gap-1.5 cursor-pointer"
                      >
                        Phiếu khám điện tử <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>

                    {/* Cancel Button (only for PENDING/CONFIRMED) */}
                    {(apt.status === 'PENDING' || apt.status === 'CONFIRMED') && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setCancelTarget(apt);
                          setCancelError(null);
                        }}
                        className="h-9 px-4 rounded-full border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold cursor-pointer"
                      >
                        Hủy lịch hẹn
                      </Button>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Cancellation Confirmation Modal */}
        {cancelTarget && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="glass-card rounded-[32px] p-6 sm:p-8 max-w-md w-full bg-white shadow-2xl space-y-5 animate-in zoom-in-95">
              
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2 text-rose-600 font-extrabold text-base">
                  <AlertCircle className="w-5 h-5" />
                  <span>Xác nhận hủy lịch khám</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCancelTarget(null)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-gray-700">
                <p>
                  Bạn có chắc chắn muốn hủy lịch hẹn <strong>{cancelTarget.id}</strong> với{' '}
                  <strong>{cancelTarget.doctor_info?.full_name}</strong> vào ngày{' '}
                  <strong>{cancelTarget.formatted_date} ({cancelTarget.formatted_time})</strong> không?
                </p>

                <p className="text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
                  ⚠️ Khung giờ khám này sẽ được giải phóng ngay lập tức để bệnh nhân khác có thể đặt.
                </p>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Lý do hủy lịch:
                  </label>
                  <select
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-rose-500 outline-hidden bg-white"
                  >
                    <option value="Bận công việc đột xuất">Bận công việc đột xuất</option>
                    <option value="Thay đổi thời gian khám">Thay đổi thời gian khám khác</option>
                    <option value="Đã khỏi bệnh / không cần khám nữa">Đã khỏi bệnh / không cần khám nữa</option>
                    <option value="Đặt nhầm chuyên khoa hoặc bác sĩ">Đặt nhầm chuyên khoa hoặc bác sĩ</option>
                    <option value="Lý do khác">Lý do khác</option>
                  </select>
                </div>
              </div>

              {cancelError && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold">
                  {cancelError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setCancelTarget(null)}
                  disabled={cancelling}
                  className="h-10 px-5 rounded-full border-gray-200 text-xs font-bold cursor-pointer"
                >
                  Đóng
                </Button>
                <Button
                  onClick={handleConfirmCancel}
                  disabled={cancelling}
                  className="h-10 px-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-2"
                >
                  {cancelling ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang hủy...</span>
                    </>
                  ) : (
                    <span>Xác nhận hủy</span>
                  )}
                </Button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
