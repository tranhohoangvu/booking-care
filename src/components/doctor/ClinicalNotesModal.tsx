'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Stethoscope, 
  User, 
  Calendar, 
  Clock, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  Save, 
  Building2,
  Phone
} from 'lucide-react';
import { completeConsultation, type AppointmentWithDetails } from '@/lib/services/appointments';
import { Button } from '@/components/ui/button';

interface ClinicalNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentWithDetails | null;
  onSuccess: () => void;
}

export function ClinicalNotesModal({
  isOpen,
  onClose,
  appointment,
  onSuccess,
}: ClinicalNotesModalProps) {
  const [diagnosis, setDiagnosis] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccessFeedback, setIsSuccessFeedback] = useState(false);

  useEffect(() => {
    if (appointment) {
      setDiagnosis(appointment.diagnosis || '');
      setDoctorNotes(
        appointment.doctor_notes ||
          'Chỉ định: Nghỉ ngơi hợp lý, vận động nhẹ nhàng.\nTái khám sau 2 tuần hoặc khi có dấu hiệu bất thường.'
      );
      setErrorMessage(null);
      setIsSuccessFeedback(false);
    }
  }, [appointment]);

  if (!isOpen || !appointment) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!diagnosis.trim()) {
      setErrorMessage('Vui lòng nhập chẩn đoán y khoa chính xác.');
      return;
    }

    setSaving(true);
    try {
      const res = await completeConsultation(appointment.id, {
        diagnosis: diagnosis.trim(),
        doctor_notes: doctorNotes.trim(),
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Không thể lưu hồ sơ bệnh án.');
        setSaving(false);
        return;
      }

      setIsSuccessFeedback(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 900);
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi kết nối khi lưu bệnh án');
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in overflow-y-auto">
      <div className="glass-card rounded-[32px] p-6 sm:p-8 max-w-2xl w-full bg-white shadow-2xl space-y-6 my-auto max-h-[92vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#16a34a] flex items-center justify-center shrink-0 border border-emerald-200">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#1a2e24]">
                Hồ Sơ Khám Bệnh & Toa Thuốc
              </h3>
              <p className="text-xs text-gray-500 font-mono">
                Mã phiếu khám: <strong className="text-gray-900">{appointment.id}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              type="button"
              onClick={handlePrint}
              className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
              title="In phiếu khám"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Patient & Clinic Quick Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#f8faf9] border border-gray-100 text-xs">
          <div className="space-y-1.5">
            <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px] block">
              Thông tin người bệnh
            </span>
            <div className="font-extrabold text-sm text-[#1a2e24] flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#22c55e]" />
              <span>{appointment.patient_name}</span>
              {appointment.patient_gender && (
                <span className="text-xs font-semibold text-gray-500">
                  ({appointment.patient_gender}
                  {appointment.patient_dob ? `, ${new Date().getFullYear() - new Date(appointment.patient_dob).getFullYear()} tuổi` : ''})
                </span>
              )}
            </div>
            <div className="text-gray-600 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              <span>SĐT liên hệ: {appointment.patient_phone}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px] block">
              Thời gian & Địa điểm khám
            </span>
            <div className="font-semibold text-gray-800 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#22c55e]" />
              <span>{appointment.formatted_date}</span>
              <span>•</span>
              <Clock className="w-3.5 h-3.5 text-[#22c55e]" />
              <span>{appointment.formatted_time}</span>
            </div>
            <div className="text-gray-600 flex items-center gap-1 truncate">
              <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{appointment.doctor_info?.clinic_name || 'Phòng khám chuyên khoa'}</span>
            </div>
          </div>
        </div>

        {/* Reported Initial Symptoms */}
        <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-950 space-y-1">
          <span className="font-bold text-amber-900 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-amber-600" /> Triệu chứng bệnh nhân mô tả lúc đặt lịch:
          </span>
          <p className="pl-5 leading-relaxed font-medium">
            {appointment.reason}
          </p>
        </div>

        {/* Clinical Form */}
        <form onSubmit={handleSave} className="space-y-4">
          
          {/* Diagnosis Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">
              Chẩn đoán y khoa của Bác sĩ <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="VD: Thoái hóa khớp gối hai bên độ 2 (M17.0) / Viêm màng hoạt dịch"
              className="w-full h-11 px-4 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-hidden bg-white"
            />
            <p className="text-[11px] text-gray-500">
              Ghi rõ tên bệnh lý và phân độ nếu có theo chuẩn ICD-10.
            </p>
          </div>

          {/* Doctor Notes & Treatment instructions */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">
              Kết luận, Lời dặn & Đơn thuốc điều trị
            </label>
            <textarea
              rows={5}
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              placeholder="Nhập hướng điều trị, các loại thuốc kê đơn, chế độ sinh hoạt và hẹn ngày tái khám..."
              className="w-full p-4 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-hidden bg-white resize-none leading-relaxed"
            />
          </div>

          {/* Error / Success Feedback */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isSuccessFeedback && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0" />
              <span>Đã lưu bệnh án và cập nhật ca khám thành công!</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 print:hidden">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={saving}
              className="h-11 px-5 rounded-full border-gray-200 text-xs font-bold cursor-pointer"
            >
              Hủy bỏ
            </Button>

            <Button
              type="submit"
              disabled={saving || isSuccessFeedback}
              className="h-11 px-6 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang lưu bệnh án...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Lưu bệnh án & Hoàn thành ca khám</span>
                </>
              )}
            </Button>
          </div>

        </form>

      </div>
    </div>
  );
}
