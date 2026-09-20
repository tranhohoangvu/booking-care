'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  CheckCircle2, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  Copy, 
  Check, 
  Printer, 
  ArrowRight, 
  Home, 
  QrCode, 
  AlertCircle,
  Stethoscope,
  Building2,
  FileText,
  CreditCard
} from 'lucide-react';
import { getAppointmentById, type AppointmentWithDetails } from '@/lib/services/appointments';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function BookingSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params?.id as string;

  const [appointment, setAppointment] = useState<AppointmentWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadAppointment() {
      if (!appointmentId) return;
      try {
        const apt = await getAppointmentById(appointmentId);
        setAppointment(apt);
      } catch (err) {
        console.error('Failed to load appointment receipt:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAppointment();
  }, [appointmentId]);

  const handleCopyCode = () => {
    if (!appointment) return;
    navigator.clipboard.writeText(appointment.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <div className="glass-card rounded-2xl p-8 flex items-center gap-3 text-gray-600">
          <div className="w-5 h-5 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold">Đang chuẩn bị phiếu xác nhận đặt khám...</span>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="glass-card rounded-[28px] p-8 max-w-md text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-xl font-bold text-[#1a2e24]">Không tìm thấy phiếu hẹn</h2>
          <p className="text-xs text-gray-600">
            Mã lịch hẹn không tồn tại hoặc phiên làm việc đã hết hạn.
          </p>
          <Link href="/appointments">
            <Button className="rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs px-6">
              Xem lịch hẹn của tôi
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 bg-gradient-to-b from-emerald-50/40 via-[#f8faf9] to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* 1. Header Success Banner */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-[#16a34a] ring-8 ring-emerald-50 shadow-sm animate-in zoom-in-75">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1a2e24] tracking-tight">
            Đặt Lịch Khám Thành Công!
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto">
            Hệ thống BookingCare đã ghi nhận lịch khám. Tin nhắn xác nhận cùng hướng dẫn chi tiết đã được gửi tới số điện thoại{' '}
            <span className="font-bold text-gray-900">{appointment.patient_phone}</span>.
          </p>
        </div>

        {/* 2. Main Appointment Receipt Ticket */}
        <div className="glass-card rounded-[32px] overflow-hidden border border-emerald-100 shadow-lg mb-8 print:shadow-none print:border-gray-300">
          
          {/* Top Bar: Code & Status */}
          <div className="bg-gradient-to-r from-[#1a2e24] to-[#234234] text-white p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-emerald-300 font-bold">Mã phiếu khám điện tử</span>
              <div className="flex items-center gap-3">
                <span className="text-2xl sm:text-3xl font-mono font-extrabold tracking-wider text-white">
                  {appointment.id}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer text-xs flex items-center gap-1"
                  title="Sao chép mã"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span className="hidden sm:inline text-[11px]">{copied ? 'Đã chép' : 'Sao chép'}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                {appointment.status === 'CONFIRMED' ? 'Đã xác nhận' : 'Chờ tiếp đón'}
              </span>
              <button
                type="button"
                onClick={handlePrint}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer print:hidden"
                title="In phiếu khám"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Ticket Body */}
          <div className="p-6 sm:p-8 space-y-8">
            
            {/* Grid: Doctor & Time + QR Checkin */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              
              {/* Doctor & Clinic Info */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-start gap-4">
                  {appointment.doctor_info?.avatar_url && (
                    <img
                      src={appointment.doctor_info.avatar_url}
                      alt={appointment.doctor_info.full_name}
                      className="w-16 h-16 rounded-2xl object-cover border border-gray-200 shrink-0"
                    />
                  )}
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-[#16a34a] text-[11px] font-bold border border-emerald-200 inline-block">
                      {appointment.doctor_info?.degree || 'Bác sĩ chuyên khoa'}
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-[#1a2e24]">
                      {appointment.doctor_info?.full_name}
                    </h2>
                    <div className="text-xs text-gray-600 flex items-center gap-1">
                      <Stethoscope className="w-3.5 h-3.5 text-[#22c55e]" />
                      <span>{appointment.doctor_info?.specialty_name}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#f8faf9] border border-gray-100 space-y-2 text-xs">
                  <div className="flex items-start gap-2 text-gray-800 font-semibold">
                    <Building2 className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" />
                    <span>{appointment.doctor_info?.clinic_name}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600 pl-6">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                    <span>{appointment.doctor_info?.clinic_address}</span>
                  </div>
                  {appointment.doctor_info?.phone && (
                    <div className="flex items-center gap-2 text-gray-600 pl-6">
                      <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>Hotline hỗ trợ: {appointment.doctor_info.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* QR Code Check-in Box */}
              <div className="p-5 rounded-2xl bg-white border-2 border-dashed border-emerald-300 flex flex-col items-center text-center space-y-3">
                <div className="relative p-2 bg-white rounded-xl shadow-xs border border-gray-100">
                  {/* Visual SVG QR Code Mock */}
                  <svg className="w-28 h-28 text-gray-800" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M0 0h30v30H0zm5 5h20v20H5zm5 5h10v10H10zM70 0h30v30H70zm5 5h20v20H75zm5 5h10v10H80zM0 70h30v30H0zm5 5h20v20H5zm5 5h10v10H10zM35 10h10v10H35zm15 0h15v5H50zm-15 15h5v15h-5zm20 5h10v10H55zm15-5h10v5H70zm0 10h15v5H70zm-35 15h15v5H35zm20 0h10v15H55zm-20 20h5v15h-5zm10 5h10v5H45zm25-15h10v10H70zm15 15h15v10H85zm-15 10h10v5H70z" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-[#22c55e] text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#1a2e24] block">Mã QR Check-in</span>
                  <span className="text-[10px] text-gray-500">Quét tại quầy lễ tân để lấy số thứ tự</span>
                </div>
              </div>

            </div>

            {/* Time & Patient Detail Matrix */}
            <div className="pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              
              <div className="p-3.5 rounded-2xl bg-white border border-gray-200 space-y-1">
                <span className="text-gray-500 text-[11px] block flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#22c55e]" /> Ngày khám:
                </span>
                <span className="font-extrabold text-[#1a2e24] text-sm block">
                  {appointment.formatted_date}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-gray-200 space-y-1">
                <span className="text-gray-500 text-[11px] block flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#22c55e]" /> Khung giờ:
                </span>
                <span className="font-extrabold text-[#1a2e24] text-sm block">
                  {appointment.formatted_time}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-gray-200 space-y-1">
                <span className="text-gray-500 text-[11px] block flex items-center gap-1">
                  <User className="w-3 h-3 text-[#22c55e]" /> Người khám:
                </span>
                <span className="font-extrabold text-[#1a2e24] text-sm block truncate">
                  {appointment.patient_name}
                </span>
                <span className="text-[10px] text-gray-500">
                  {appointment.booking_for === 'SELF' ? 'Đặt cho bản thân' : 'Đặt cho người thân'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-gray-200 space-y-1">
                <span className="text-gray-500 text-[11px] block flex items-center gap-1">
                  <CreditCard className="w-3 h-3 text-[#22c55e]" /> Phí khám & Thanh toán:
                </span>
                <span className="font-extrabold text-emerald-700 text-sm block">
                  {formatCurrency(appointment.doctor_info?.consultation_fee || 350000)}
                </span>
                <span className="text-[10px] text-gray-500">
                  {appointment.payment_method === 'ONLINE' ? 'Đã thanh toán Online' : 'Thanh toán tại viện'}
                </span>
              </div>

            </div>

            {/* Symptoms / Reason Box */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-1">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-600" /> Triệu chứng ban đầu:
              </span>
              <p className="text-amber-950 font-medium leading-relaxed pl-5.5">
                {appointment.reason}
              </p>
            </div>

            {/* Preparation Advice */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-xs space-y-2">
              <span className="font-bold text-[#1a2e24] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#22c55e]" /> Hướng dẫn chuẩn bị trước buổi khám:
              </span>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Vui lòng có mặt tại cơ sở y tế trước giờ hẹn ít nhất <strong>15 phút</strong> để làm thủ tục tiếp đón.</li>
                <li>Xuất trình mã phiếu khám <strong>{appointment.id}</strong> hoặc mã QR tại quầy tiếp nhận ưu tiên BookingCare.</li>
                <li>Mang theo căn cước công dân (CCCD) và thẻ bảo hiểm y tế (BHYT) nếu có.</li>
                <li>Nếu cần xét nghiệm máu hoặc siêu âm ổ bụng, quý khách nên nhịn ăn sáng theo chỉ dẫn.</li>
              </ul>
            </div>

          </div>

        </div>

        {/* 3. Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 print:hidden">
          <Link href="/appointments" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto h-11 px-6 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs font-bold shadow-sm flex items-center justify-center gap-2 cursor-pointer">
              Xem danh sách lịch hẹn của tôi <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto h-11 px-6 rounded-full border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer">
              <Home className="w-4 h-4" /> Quay về trang chủ
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
