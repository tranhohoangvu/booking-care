'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  Search, 
  CheckCircle2, 
  Clock3, 
  XCircle, 
  AlertCircle, 
  FileText, 
  Filter, 
  Phone, 
  Printer, 
  X, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { DoctorSubnav } from '@/components/doctor/DoctorSubnav';
import { ClinicalNotesModal } from '@/components/doctor/ClinicalNotesModal';
import { 
  getDoctorAppointments, 
  confirmAppointment, 
  rejectDoctorAppointment, 
  type AppointmentWithDetails 
} from '@/lib/services/appointments';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { AppointmentStatus } from '@/types/database.types';

type FilterTab = 'ALL' | 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export default function DoctorAppointmentsWorkspacePage() {
  const doctorId = 'doc-1';

  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState<string>('');

  // Modals state
  const [activeConsultation, setActiveConsultation] = useState<AppointmentWithDetails | null>(null);
  const [rejectTarget, setRejectTarget] = useState<AppointmentWithDetails | null>(null);
  const [rejectReason, setRejectReason] = useState('Bác sĩ có ca phẫu thuật cấp cứu');
  const [rejecting, setRejecting] = useState(false);
  const [rejectError, setRejectError] = useState<string | null>(null);

  // Load appointments
  const loadAppointments = async () => {
    setLoading(true);
    try {
      const data = await getDoctorAppointments(doctorId, {
        date: filterDate || undefined,
      });
      setAppointments(data);
    } catch (err) {
      console.error('Failed to load doctor appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [filterDate]);

  // Confirm appointment
  const handleConfirm = async (id: string) => {
    const res = await confirmAppointment(id);
    if (res.success) {
      loadAppointments();
    }
  };

  // Reject appointment
  const handleConfirmReject = async () => {
    if (!rejectTarget) return;
    setRejecting(true);
    setRejectError(null);

    try {
      const res = await rejectDoctorAppointment(rejectTarget.id, rejectReason);
      if (!res.success) {
        setRejectError(res.error || 'Không thể hủy lịch hẹn');
        setRejecting(false);
        return;
      }
      setRejectTarget(null);
      loadAppointments();
    } catch (err: any) {
      setRejectError(err.message || 'Lỗi khi từ chối ca khám');
    } finally {
      setRejecting(false);
    }
  };

  // Filter logic
  const filteredList = appointments.filter((apt) => {
    if (activeTab !== 'ALL' && apt.status !== activeTab) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = apt.patient_name.toLowerCase().includes(q);
      const matchPhone = apt.patient_phone.includes(q);
      const matchCode = apt.id.toLowerCase().includes(q);
      const matchReason = apt.reason.toLowerCase().includes(q);
      const matchDiagnosis = apt.diagnosis?.toLowerCase().includes(q);
      return matchName || matchPhone || matchCode || matchReason || matchDiagnosis;
    }

    return true;
  });

  const pendingCount = appointments.filter((a) => a.status === 'PENDING').length;
  const confirmedCount = appointments.filter((a) => a.status === 'CONFIRMED').length;
  const completedCount = appointments.filter((a) => a.status === 'COMPLETED').length;
  const cancelledCount = appointments.filter((a) => a.status === 'CANCELLED').length;

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-[#f8faf9] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <DoctorSubnav
          title="Hồ Sơ Bệnh Án & Lịch Hẹn Bệnh Nhân"
          subtitle="Tra cứu lịch sử khám bệnh, tiếp nhận bệnh nhân mới, và cập nhật kết luận chẩn đoán y khoa."
        />

        {/* Filters & Search Toolbar */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 mb-8 space-y-4">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Status Tabs */}
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
                onClick={() => setActiveTab('PENDING')}
                className={`py-2 px-3.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'PENDING'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                }`}
              >
                Chờ tiếp nhận ({pendingCount})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('CONFIRMED')}
                className={`py-2 px-3.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'CONFIRMED'
                    ? 'bg-[#22c55e] text-white shadow-xs'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                }`}
              >
                Đã tiếp nhận ({confirmedCount})
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
                Đã khám xong ({completedCount})
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

            {/* Date filter */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-semibold text-gray-500 hidden sm:inline">Lọc theo ngày:</span>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="h-10 px-3 rounded-xl border border-gray-200 text-xs font-medium bg-white outline-hidden cursor-pointer"
              />
              {filterDate && (
                <button
                  type="button"
                  onClick={() => setFilterDate('')}
                  className="px-2.5 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 text-xs font-semibold cursor-pointer"
                >
                  Xóa lọc ngày
                </button>
              )}
            </div>

          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên bệnh nhân, số điện thoại, mã phiếu khám, triệu chứng hoặc chẩn đoán..."
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-hidden bg-white/90"
            />
          </div>

        </div>

        {/* Appointments List */}
        {loading ? (
          <div className="glass-card rounded-[28px] p-12 flex flex-col items-center justify-center gap-3 text-gray-600">
            <div className="w-6 h-6 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold">Đang tải hồ sơ bệnh án...</span>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="glass-card rounded-[32px] p-12 text-center space-y-4 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#22c55e] flex items-center justify-center mx-auto">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#1a2e24]">Không tìm thấy hồ sơ phù hợp</h3>
            <p className="text-xs text-gray-600">
              Không có lượt hẹn nào tương ứng với bộ lọc hoặc từ khóa tìm kiếm của bạn.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredList.map((apt) => (
              <div
                key={apt.id}
                className="glass-card rounded-[28px] p-5 sm:p-6 transition-all hover:border-[#22c55e]/40 space-y-4"
              >
                {/* Header line: ID, Date, Status */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3.5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-extrabold text-[#1a2e24] bg-gray-100 px-3 py-1 rounded-lg">
                      {apt.id}
                    </span>
                    <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#22c55e]" />
                      {apt.formatted_date}
                    </span>
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#22c55e]" />
                      {apt.formatted_time}
                    </span>
                  </div>

                  <div>
                    {apt.status === 'PENDING' && (
                      <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold flex items-center gap-1">
                        <Clock3 className="w-3.5 h-3.5 text-amber-500" /> Chờ tiếp nhận
                      </span>
                    )}
                    {apt.status === 'CONFIRMED' && (
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e]" /> Đã tiếp nhận
                      </span>
                    )}
                    {apt.status === 'COMPLETED' && (
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /> Đã khám xong
                      </span>
                    )}
                    {apt.status === 'CANCELLED' && (
                      <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5 text-rose-500" /> Đã hủy
                      </span>
                    )}
                  </div>
                </div>

                {/* Patient Information & Clinical Details */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Patient Bio */}
                  <div className="lg:col-span-4 space-y-2 text-xs">
                    <div className="font-extrabold text-base text-[#1a2e24] flex items-center gap-2">
                      <User className="w-4 h-4 text-[#22c55e]" />
                      <span>{apt.patient_name}</span>
                    </div>
                    <div className="text-gray-600 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span>{apt.patient_phone}</span>
                    </div>
                    <div className="text-gray-500">
                      {apt.patient_gender && <span>Giới tính: <strong>{apt.patient_gender}</strong> • </span>}
                      {apt.patient_dob && (
                        <span>
                          Tuổi:{' '}
                          <strong>
                            {new Date().getFullYear() - new Date(apt.patient_dob).getFullYear()}
                          </strong>
                        </span>
                      )}
                    </div>
                    <div className="text-gray-500 text-[11px]">
                      Hình thức: {apt.booking_for === 'SELF' ? 'Khám cho bản thân' : 'Đặt cho người thân'}
                    </div>
                  </div>

                  {/* Clinical Description & Diagnosis Area */}
                  <div className="lg:col-span-8 space-y-3 text-xs">
                    {/* Symptoms */}
                    <div className="p-3.5 rounded-2xl bg-[#f8faf9] border border-gray-100 text-gray-800 space-y-1">
                      <span className="font-bold text-gray-700 block">Lý do khám / Triệu chứng ban đầu:</span>
                      <p className="leading-relaxed font-medium">{apt.reason}</p>
                    </div>

                    {/* Stored Medical Diagnosis if COMPLETED */}
                    {apt.diagnosis && (
                      <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-1.5">
                        <div className="font-extrabold text-blue-950 flex items-center gap-1.5">
                          <Stethoscope className="w-4 h-4 text-blue-600" />
                          <span>Chẩn đoán y khoa: {apt.diagnosis}</span>
                        </div>
                        {apt.doctor_notes && (
                          <div className="text-blue-900 leading-relaxed font-medium whitespace-pre-line pl-5">
                            {apt.doctor_notes}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Stored Cancel reason if CANCELLED */}
                    {apt.status === 'CANCELLED' && apt.doctor_notes && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                        <strong>Ghi chú hủy:</strong> {apt.doctor_notes}
                      </div>
                    )}
                  </div>

                </div>

                {/* Bottom Action Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 text-xs">
                  <span className="text-gray-500">
                    Phí khám niêm yết: <strong className="text-gray-900">{formatCurrency(apt.doctor_info?.consultation_fee || 350000)}</strong>
                  </span>

                  <div className="flex items-center gap-2 ml-auto">
                    {/* Confirm Button */}
                    {apt.status === 'PENDING' && (
                      <Button
                        onClick={() => handleConfirm(apt.id)}
                        className="h-9 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Tiếp nhận ca khám
                      </Button>
                    )}

                    {/* Clinical Notes Button */}
                    {apt.status !== 'CANCELLED' && (
                      <Button
                        onClick={() => setActiveConsultation(apt)}
                        className="h-9 px-4 rounded-full bg-[#1a2e24] hover:bg-[#22c55e] text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
                      >
                        <Stethoscope className="w-3.5 h-3.5" />
                        {apt.status === 'COMPLETED' ? 'Xem / Sửa bệnh án' : 'Khám bệnh & Bệnh án'}
                      </Button>
                    )}

                    {/* Reject Button (Only for PENDING or CONFIRMED) */}
                    {(apt.status === 'PENDING' || apt.status === 'CONFIRMED') && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setRejectTarget(apt);
                          setRejectError(null);
                        }}
                        className="h-9 px-4 rounded-full border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold cursor-pointer"
                      >
                        Từ chối / Hủy ca
                      </Button>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Clinical Notes Modal */}
        <ClinicalNotesModal
          isOpen={!!activeConsultation}
          onClose={() => setActiveConsultation(null)}
          appointment={activeConsultation}
          onSuccess={() => {
            loadAppointments();
          }}
        />

        {/* Doctor Reject / Cancel Modal */}
        {rejectTarget && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="glass-card rounded-[32px] p-6 sm:p-8 max-w-md w-full bg-white shadow-2xl space-y-5 animate-in zoom-in-95">
              
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2 text-rose-600 font-extrabold text-base">
                  <AlertCircle className="w-5 h-5" />
                  <span>Xác nhận từ chối / hủy ca khám</span>
                </div>
                <button
                  type="button"
                  onClick={() => setRejectTarget(null)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-gray-700">
                <p>
                  Bác sĩ có chắc chắn muốn hủy lịch hẹn <strong>{rejectTarget.id}</strong> của bệnh nhân{' '}
                  <strong>{rejectTarget.patient_name}</strong> vào ngày{' '}
                  <strong>{rejectTarget.formatted_date} ({rejectTarget.formatted_time})</strong> không?
                </p>

                <p className="text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
                  ⚠️ Khung giờ khám này sẽ được giải phóng ngay lập tức trên hệ thống để đảm bảo tính sẵn sàng.
                </p>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Lý do bác sĩ hủy ca:
                  </label>
                  <select
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-rose-500 outline-hidden bg-white"
                  >
                    <option value="Bác sĩ có ca phẫu thuật cấp cứu đột xuất">Bác sĩ có ca phẫu thuật cấp cứu đột xuất</option>
                    <option value="Bác sĩ bận lịch hội chẩn chuyên khoa">Bác sĩ bận lịch hội chẩn chuyên khoa</option>
                    <option value="Bệnh nhân không có mặt đúng giờ hẹn">Bệnh nhân không có mặt đúng giờ hẹn</option>
                    <option value="Chuyên khoa không phù hợp với triệu chứng">Chuyên khoa không phù hợp với triệu chứng</option>
                    <option value="Lý do bất khả kháng khác">Lý do bất khả kháng khác</option>
                  </select>
                </div>
              </div>

              {rejectError && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold">
                  {rejectError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setRejectTarget(null)}
                  disabled={rejecting}
                  className="h-10 px-5 rounded-full border-gray-200 text-xs font-bold cursor-pointer"
                >
                  Đóng
                </Button>
                <Button
                  onClick={handleConfirmReject}
                  disabled={rejecting}
                  className="h-10 px-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-2"
                >
                  {rejecting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <span>Xác nhận từ chối</span>
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
