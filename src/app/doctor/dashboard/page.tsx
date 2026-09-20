'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  Clock3, 
  DollarSign, 
  ChevronRight, 
  Stethoscope, 
  ArrowRight, 
  ChevronLeft, 
  FileText, 
  UserCheck, 
  AlertCircle, 
  Sparkles,
  Phone,
  Building2,
  CalendarDays
} from 'lucide-react';
import { DoctorSubnav } from '@/components/doctor/DoctorSubnav';
import { ClinicalNotesModal } from '@/components/doctor/ClinicalNotesModal';
import { 
  getDoctorAppointments, 
  confirmAppointment, 
  rejectDoctorAppointment, 
  getDoctorConsultationMetrics, 
  type AppointmentWithDetails 
} from '@/lib/services/appointments';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function DoctorDashboardPage() {
  const doctorId = 'doc-1'; // PGS.TS.BS Nguyễn Văn Liệu

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [metrics, setMetrics] = useState({
    todayCount: 0,
    pendingCount: 0,
    confirmedCount: 0,
    completedCount: 0,
    cancelledCount: 0,
    estimatedRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  // Active consultation modal
  const [activeConsultation, setActiveConsultation] = useState<AppointmentWithDetails | null>(null);

  // Load data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [aptList, kpis] = await Promise.all([
        getDoctorAppointments(doctorId, { date: selectedDate }),
        getDoctorConsultationMetrics(doctorId),
      ]);
      setAppointments(aptList);
      setMetrics(kpis);
    } catch (err) {
      console.error('Failed to load doctor dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [selectedDate]);

  // Handle Quick Confirm
  const handleQuickConfirm = async (id: string) => {
    const res = await confirmAppointment(id);
    if (res.success) {
      loadDashboardData();
    }
  };

  // Date Navigation
  const changeDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  const formatVietnameseDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-');
    const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    return `${dayNames[dateObj.getDay()]}, ${d}/${m}/${y}`;
  };

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-[#f8faf9] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <DoctorSubnav
          title="Bàn Làm Việc Bác Sĩ"
          subtitle="Quản lý tiếp đón người bệnh, theo dõi ca khám trong ngày và ghi nhận hồ sơ bệnh án điện tử."
        />

        {/* 1. KPI Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          <div className="glass-card rounded-[24px] p-5 space-y-2 border-emerald-100 hover:border-emerald-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ca khám hôm nay</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#16a34a] flex items-center justify-center">
                <CalendarDays className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-[#1a2e24]">
              {metrics.todayCount}
            </div>
            <p className="text-[11px] text-gray-500">
              Lịch hẹn đã lên lịch trong ngày
            </p>
          </div>

          <div className="glass-card rounded-[24px] p-5 space-y-2 border-amber-100 hover:border-amber-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Chờ xác nhận</span>
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Clock3 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-[#1a2e24]">
              {metrics.pendingCount}
            </div>
            <p className="text-[11px] text-gray-500">
              Bệnh nhân mới đặt cần tiếp nhận
            </p>
          </div>

          <div className="glass-card rounded-[24px] p-5 space-y-2 border-blue-100 hover:border-blue-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Đã hoàn thành</span>
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-[#1a2e24]">
              {metrics.completedCount}
            </div>
            <p className="text-[11px] text-gray-500">
              Ca khám đã hoàn tất bệnh án
            </p>
          </div>

          <div className="glass-card rounded-[24px] p-5 space-y-2 border-emerald-100 hover:border-emerald-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Doanh thu tạm tính</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#16a34a] flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#1a2e24]">
              {formatCurrency(metrics.estimatedRevenue)}
            </div>
            <p className="text-[11px] text-gray-500">
              Tổng phí khám từ các ca tiếp nhận
            </p>
          </div>

        </div>

        {/* 2. Main Daily Consultation Queue */}
        <div className="space-y-6">
          
          {/* Header & Date Controller */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card rounded-[24px] p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#1a2e24] text-white flex items-center justify-center shrink-0">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1a2e24]">
                  Hàng Đợi Khám Bệnh Trong Ngày
                </h2>
                <span className="text-xs font-semibold text-emerald-700">
                  {formatVietnameseDate(selectedDate)} {isToday && '• Hôm nay'}
                </span>
              </div>
            </div>

            {/* Date Navigator */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => changeDate(-1)}
                className="p-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                title="Ngày trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {!isToday && (
                <button
                  type="button"
                  onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                  className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Hôm nay
                </button>
              )}

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="h-9 px-3 rounded-xl border border-gray-200 text-xs font-semibold bg-white cursor-pointer outline-hidden"
              />

              <button
                type="button"
                onClick={() => changeDate(1)}
                className="p-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                title="Ngày tiếp theo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Queue List */}
          {loading ? (
            <div className="glass-card rounded-[28px] p-12 flex flex-col items-center justify-center gap-3 text-gray-600">
              <div className="w-6 h-6 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-semibold">Đang tải danh sách ca khám...</span>
            </div>
          ) : appointments.length === 0 ? (
            <div className="glass-card rounded-[32px] p-12 text-center space-y-4 max-w-md mx-auto">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#22c55e] flex items-center justify-center mx-auto">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-[#1a2e24]">Không có ca khám trong ngày này</h3>
              <p className="text-xs text-gray-600">
                Bác sĩ chưa có lịch hẹn nào vào ngày {formatVietnameseDate(selectedDate)}. Bạn có thể mở thêm ca trực tại trang Quản lý lịch khám.
              </p>
              <Link href="/doctor/schedule">
                <Button className="rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs px-6">
                  Quản lý ca trực ngày này
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className={`glass-card rounded-[28px] p-5 sm:p-6 transition-all border ${
                    apt.status === 'CONFIRMED'
                      ? 'border-emerald-200 bg-white/90 shadow-sm'
                      : apt.status === 'COMPLETED'
                      ? 'border-blue-100 bg-[#f8faf9]/70 opacity-90'
                      : apt.status === 'PENDING'
                      ? 'border-amber-200 bg-amber-50/20'
                      : 'border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    {/* Time & Patient Demographics */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 rounded-2xl bg-[#1a2e24] text-white flex flex-col items-center justify-center shrink-0 shadow-xs">
                        <Clock className="w-4 h-4 text-emerald-400 mb-0.5" />
                        <span className="text-xs font-mono font-bold leading-none">
                          {apt.formatted_time?.split(' - ')[0] || '08:30'}
                        </span>
                        <span className="text-[10px] text-gray-300 font-mono leading-none mt-1">
                          {apt.formatted_time?.split(' - ')[1] || '09:00'}
                        </span>
                      </div>

                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
                            {apt.id}
                          </span>

                          {apt.status === 'PENDING' && (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-200 flex items-center gap-1">
                              <Clock3 className="w-3 h-3 text-amber-500" /> Chờ tiếp nhận
                            </span>
                          )}
                          {apt.status === 'CONFIRMED' && (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-[#22c55e]" /> Đã tiếp nhận • Sẵn sàng khám
                            </span>
                          )}
                          {apt.status === 'COMPLETED' && (
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-blue-500" /> Đã hoàn tất khám
                            </span>
                          )}
                          {apt.status === 'CANCELLED' && (
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-bold border border-rose-200">
                              Đã hủy
                            </span>
                          )}
                        </div>

                        <h4 className="text-base font-extrabold text-[#1a2e24]">
                          {apt.patient_name}
                          {apt.patient_gender && (
                            <span className="text-xs font-medium text-gray-500 ml-2">
                              ({apt.patient_gender}
                              {apt.patient_dob ? `, ${new Date().getFullYear() - new Date(apt.patient_dob).getFullYear()} tuổi` : ''})
                            </span>
                          )}
                        </h4>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            {apt.patient_phone}
                          </span>
                          <span>•</span>
                          <span>Hình thức: {apt.payment_method === 'ONLINE' ? 'Đã thanh toán online' : 'Thanh toán tại viện'}</span>
                        </div>

                        {/* Symptoms summary */}
                        <div className="pt-1 text-xs text-gray-700">
                          <span className="font-semibold text-gray-800">Lý do khám:</span>{' '}
                          <span className="line-clamp-2">{apt.reason}</span>
                        </div>

                        {/* Stored Diagnosis snippet if completed */}
                        {apt.diagnosis && (
                          <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200/80 text-xs text-blue-900 space-y-0.5 mt-2">
                            <div className="font-bold flex items-center gap-1">
                              <FileText className="w-3.5 h-3.5 text-blue-600" />
                              <span>Chẩn đoán: {apt.diagnosis}</span>
                            </div>
                            {apt.doctor_notes && (
                              <p className="text-[11px] text-blue-800 line-clamp-1 pl-4.5">
                                Lời dặn: {apt.doctor_notes}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions Toolbar */}
                    <div className="flex flex-wrap sm:flex-col lg:flex-row items-center gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0">
                      
                      {/* PENDING -> Quick Confirm button */}
                      {apt.status === 'PENDING' && (
                        <Button
                          onClick={() => handleQuickConfirm(apt.id)}
                          className="h-10 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Tiếp nhận ca khám
                        </Button>
                      )}

                      {/* CONFIRMED or PENDING -> Start Consultation / Clinical Notes */}
                      {(apt.status === 'CONFIRMED' || apt.status === 'PENDING') && (
                        <Button
                          onClick={() => setActiveConsultation(apt)}
                          className="h-10 px-4 rounded-full bg-[#1a2e24] hover:bg-[#22c55e] text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
                        >
                          <Stethoscope className="w-4 h-4" /> Khám bệnh & Ghi bệnh án
                        </Button>
                      )}

                      {/* COMPLETED -> View / Edit Notes */}
                      {apt.status === 'COMPLETED' && (
                        <Button
                          variant="outline"
                          onClick={() => setActiveConsultation(apt)}
                          className="h-10 px-4 rounded-full border-blue-200 text-blue-700 hover:bg-blue-50 text-xs font-bold cursor-pointer flex items-center gap-1.5"
                        >
                          <FileText className="w-4 h-4" /> Xem lại hồ sơ bệnh án
                        </Button>
                      )}

                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Clinical Notes & Prescription Modal */}
        <ClinicalNotesModal
          isOpen={!!activeConsultation}
          onClose={() => setActiveConsultation(null)}
          appointment={activeConsultation}
          onSuccess={() => {
            loadDashboardData();
          }}
        />

      </div>
    </div>
  );
}
