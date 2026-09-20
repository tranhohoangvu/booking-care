'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Users, 
  Phone, 
  MapPin, 
  CreditCard, 
  Banknote, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  Stethoscope, 
  Sparkles,
  Building2,
  Lock
} from 'lucide-react';
import { getDoctorById, type DoctorWithDetails } from '@/lib/services/doctors';
import { createAppointment } from '@/lib/services/appointments';
import { getPatientProfile } from '@/lib/services/profiles';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { BookingFor, PaymentMethod } from '@/types/database.types';

function BookingFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const doctorId = searchParams.get('doctorId') || '';
  const initialDate = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const initialSlot = searchParams.get('slot') || '08:30';

  const [doctor, setDoctor] = useState<DoctorWithDetails | null>(null);
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>('demo-patient-id');

  // Booking Form State
  const [bookingFor, setBookingFor] = useState<BookingFor>('SELF');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientDob, setPatientDob] = useState('1995-01-01');
  const [patientGender, setPatientGender] = useState<'Nam' | 'Nữ' | 'Khác'>('Nam');
  const [patientAddress, setPatientAddress] = useState('');
  const [reason, setReason] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');

  // UI status state
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Fetch Doctor Info
  useEffect(() => {
    async function loadDoctor() {
      if (!doctorId) {
        setLoadingDoctor(false);
        return;
      }
      try {
        const doc = await getDoctorById(doctorId);
        setDoctor(doc);
      } catch (err) {
        console.error('Error loading doctor for booking:', err);
      } finally {
        setLoadingDoctor(false);
      }
    }
    loadDoctor();
  }, [doctorId]);

  // 2. Fetch User Profile to autofill
  useEffect(() => {
    async function loadUserProfile() {
      // Check demo cookie first
      if (typeof document !== 'undefined') {
        const demoCookie = document.cookie
          .split('; ')
          .find((row) => row.startsWith('bookingcare_demo_user='));
        if (demoCookie) {
          try {
            const parsed = JSON.parse(decodeURIComponent(demoCookie.split('=')[1]));
            if (parsed.id) {
              setCurrentUserId(parsed.id);
              if (parsed.fullName) setPatientName(parsed.fullName);
              if (parsed.phone) setPatientPhone(parsed.phone);
            }
          } catch {
            // ignore
          }
        }
      }

      // Check supabase session
      if (isSupabaseConfigured()) {
        try {
          const supabase = createClient();
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setCurrentUserId(session.user.id);
            const prof = await getPatientProfile(session.user.id);
            if (prof) {
              setPatientName(prof.full_name || '');
              setPatientPhone(prof.phone || '');
              if (prof.dob) setPatientDob(prof.dob);
              if (prof.gender) setPatientGender(prof.gender as any);
              if (prof.address) setPatientAddress(prof.address);
            }
          }
        } catch (err) {
          console.warn('Error reading profile for booking:', err);
        }
      } else {
        // Fallback default values if empty
        setPatientName((prev) => prev || 'Nguyễn Văn A');
        setPatientPhone((prev) => prev || '0901234567');
        setPatientAddress((prev) => prev || 'Quận 1, TP. Hồ Chí Minh');
      }
    }

    loadUserProfile();
  }, []);

  // Format date display
  const formatDateDisplay = (dateString: string) => {
    try {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return dateString;
    } catch {
      return dateString;
    }
  };

  // Submit appointment handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!patientName.trim()) {
      setErrorMessage('Vui lòng nhập họ và tên người khám bệnh.');
      return;
    }
    if (!patientPhone.trim()) {
      setErrorMessage('Vui lòng nhập số điện thoại liên hệ để nhận mã khám.');
      return;
    }
    if (!reason.trim()) {
      setErrorMessage('Vui lòng mô tả ngắn gọn lý do khám hoặc triệu chứng hiện tại.');
      return;
    }

    setSubmitting(true);

    try {
      // Calculate start and end time (30 minute interval)
      const startTime = initialSlot;
      const [h, m] = startTime.split(':').map(Number);
      const endMinute = (m + 30) % 60;
      const endHour = h + Math.floor((m + 30) / 60);
      const endTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;

      const res = await createAppointment({
        patient_id: currentUserId,
        doctor_id: doctorId || doctor?.id || 'doc-1',
        date: initialDate,
        start_time: startTime,
        end_time: endTime,
        booking_for: bookingFor,
        patient_name: patientName.trim(),
        patient_phone: patientPhone.trim(),
        patient_dob: patientDob,
        patient_gender: patientGender,
        reason: reason.trim(),
        payment_method: paymentMethod,
      });

      if (!res.success || !res.appointment) {
        setErrorMessage(res.error || 'Đặt lịch không thành công. Vui lòng kiểm tra lại khung giờ.');
        setSubmitting(false);
        return;
      }

      // Success redirect to receipt page
      router.push(`/booking/success/${res.appointment.id}`);
    } catch (err: any) {
      console.error('Submit booking error:', err);
      setErrorMessage(err.message || 'Có lỗi xảy ra khi kết nối máy chủ. Vui lòng thử lại sau.');
      setSubmitting(false);
    }
  };

  if (loadingDoctor) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="glass-card rounded-2xl p-8 flex items-center gap-3 text-gray-600">
          <div className="w-5 h-5 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold">Đang chuẩn bị hồ sơ đặt khám...</span>
        </div>
      </div>
    );
  }

  if (!doctor && doctorId) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="glass-card rounded-[28px] p-8 max-w-md text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-xl font-bold text-[#1a2e24]">Không tìm thấy thông tin bác sĩ</h2>
          <p className="text-xs text-gray-600">Bác sĩ bạn đã chọn có thể đã ngừng nhận lịch hoặc liên kết không hợp lệ.</p>
          <Link href="/doctors">
            <Button className="rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs px-6">
              Xem danh sách bác sĩ khác
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#22c55e] transition-colors">Trang chủ</Link>
        <span>/</span>
        <Link href="/doctors" className="hover:text-[#22c55e] transition-colors">Bác sĩ</Link>
        {doctor && (
          <>
            <span>/</span>
            <Link href={`/doctors/${doctor.id}`} className="hover:text-[#22c55e] transition-colors line-clamp-1 max-w-[200px]">
              {doctor.full_name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-[#1a2e24] font-bold">Xác nhận đặt lịch khám</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: Booking Form */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-card rounded-[32px] p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-5">
              <div>
                <h1 className="text-2xl font-extrabold text-[#1a2e24] tracking-tight">
                  Thông Tin Đặt Lịch Khám Bệnh
                </h1>
                <p className="text-xs text-gray-600 mt-1">
                  Vui lòng điền chính xác thông tin để cơ sở y tế chuẩn bị hồ sơ bệnh án tốt nhất.
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" /> Bảo mật thông tin
              </div>
            </div>

            {/* Error Message Notice */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-3 animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Không thể hoàn tất đặt lịch</p>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* 1. Booking Mode: Self vs Relative */}
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2.5">
                  1. Người đi khám là:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setBookingFor('SELF')}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                      bookingFor === 'SELF'
                        ? 'border-[#22c55e] bg-[#22c55e]/10 text-[#1a2e24] shadow-xs'
                        : 'border-gray-200 bg-white/70 hover:bg-white text-gray-600'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      bookingFor === 'SELF' ? 'bg-[#22c55e] text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold">Đặt cho bản thân</div>
                      <div className="text-[11px] text-gray-600">Sử dụng thông tin tài khoản của bạn</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBookingFor('RELATIVE')}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                      bookingFor === 'RELATIVE'
                        ? 'border-[#22c55e] bg-[#22c55e]/10 text-[#1a2e24] shadow-xs'
                        : 'border-gray-200 bg-white/70 hover:bg-white text-gray-600'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      bookingFor === 'RELATIVE' ? 'bg-[#22c55e] text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold">Đặt cho người thân</div>
                      <div className="text-[11px] text-gray-600">Bố mẹ, con cái hoặc người giám hộ</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* 2. Patient Demographics Form */}
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  2. Thông tin cá nhân của người khám
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Họ và tên người khám <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="VD: Nguyễn Văn A"
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-hidden bg-white/90"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Số điện thoại nhận thông báo <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="VD: 0912345678"
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-hidden bg-white/90"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Ngày tháng năm sinh
                    </label>
                    <input
                      type="date"
                      value={patientDob}
                      onChange={(e) => setPatientDob(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-hidden bg-white/90"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Giới tính
                    </label>
                    <select
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value as any)}
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-hidden bg-white/90 cursor-pointer"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Địa chỉ hiện tại
                  </label>
                  <input
                    type="text"
                    value={patientAddress}
                    onChange={(e) => setPatientAddress(e.target.value)}
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-hidden bg-white/90"
                  />
                </div>
              </div>

              {/* 3. Reason for visit / Symptoms */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  3. Lý do khám & Triệu chứng ban đầu <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Mô tả cụ thể triệu chứng của bạn (ví dụ: đau khớp gối 2 tuần nay, đau tăng khi leo cầu thang, có sốt nhẹ...)"
                  className="w-full p-4 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#22c55e] focus:border-transparent outline-hidden bg-white/90 resize-none leading-relaxed"
                />
                <p className="text-[11px] text-gray-600">
                  Gợi ý: Ghi rõ thời gian xuất hiện triệu chứng và các thuốc đang dùng nếu có.
                </p>
              </div>

              {/* 4. Payment Method Choice */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  4. Hình thức thanh toán
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setPaymentMethod('CASH')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      paymentMethod === 'CASH'
                        ? 'border-[#22c55e] bg-[#22c55e]/10 ring-1 ring-[#22c55e]'
                        : 'border-gray-200 bg-white/70 hover:bg-white'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-emerald-100 text-[#16a34a] shrink-0">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1a2e24]">Thanh toán tại cơ sở y tế</div>
                      <div className="text-[11px] text-gray-600 mt-0.5">
                        Thanh toán tiền mặt hoặc thẻ tại quầy tiếp đón của bệnh viện khi đến khám.
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('ONLINE')}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      paymentMethod === 'ONLINE'
                        ? 'border-[#22c55e] bg-[#22c55e]/10 ring-1 ring-[#22c55e]'
                        : 'border-gray-200 bg-white/70 hover:bg-white'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-blue-100 text-blue-600 shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1a2e24]">Thanh toán trực tuyến</div>
                      <div className="text-[11px] text-gray-600 mt-0.5">
                        Thanh toán qua cổng VNPay / MoMo / Thẻ ATM & Visa (Mô phỏng tức thì).
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-12 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white text-sm font-bold shadow-md cursor-pointer transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang kiểm tra slot và tạo lịch hẹn...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Xác nhận hoàn tất đặt lịch khám</span>
                    </>
                  )}
                </Button>

                <p className="text-center text-[11px] text-gray-600 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  Bằng việc bấm xác nhận, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của BookingCare.
                </p>
              </div>

            </form>
          </div>
        </div>

        {/* RIGHT: Booking Summary & Doctor Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card rounded-[32px] p-6 space-y-6 sticky top-24">
            
            <div className="border-b border-gray-100 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Tóm tắt lịch hẹn</span>
              <h2 className="text-base font-extrabold text-[#1a2e24] mt-1">Thông tin buổi khám</h2>
            </div>

            {/* Doctor Avatar & Name */}
            {doctor && (
              <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100">
                <img
                  src={doctor.avatar_url || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80'}
                  alt={doctor.full_name}
                  className="w-14 h-14 rounded-2xl object-cover border border-gray-200 shrink-0"
                />
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold text-[#16a34a] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {doctor.degree}
                  </span>
                  <div className="text-sm font-extrabold text-[#1a2e24] leading-snug">
                    {doctor.full_name}
                  </div>
                  {doctor.specialty && (
                    <div className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                      <Stethoscope className="w-3.5 h-3.5 text-[#22c55e]" />
                      <span>{doctor.specialty.name}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Time & Clinic Specs */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-[#1a2e24]">
                  <Clock className="w-4 h-4 text-[#22c55e]" />
                  <span>Giờ khám: {initialSlot}</span>
                </div>
                <div className="flex items-center gap-2 font-semibold text-emerald-800">
                  <Calendar className="w-4 h-4 text-[#22c55e]" />
                  <span>Ngày khám: {formatDateDisplay(initialDate)}</span>
                </div>
              </div>

              {doctor?.clinic && (
                <div className="p-3.5 rounded-2xl bg-white/70 border border-gray-200 space-y-1">
                  <div className="font-bold text-[#1a2e24] flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-[#22c55e] shrink-0" />
                    <span>{doctor.clinic.name}</span>
                  </div>
                  <div className="text-gray-600 text-[11px] flex items-start gap-1.5 pt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                    <span>{doctor.clinic.address}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Price calculation */}
            <div className="pt-2 border-t border-gray-100 space-y-2 text-xs">
              <div className="flex items-center justify-between text-gray-600">
                <span>Giá khám chuyên khoa:</span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(doctor?.consultation_fee || 350000)}
                </span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Phí đặt lịch trực tuyến:</span>
                <span className="font-bold text-emerald-600 uppercase text-[11px]">Miễn phí 100%</span>
              </div>
              <div className="pt-2 border-t border-gray-100 flex items-baseline justify-between text-sm">
                <span className="font-bold text-[#1a2e24]">Tổng thanh toán:</span>
                <span className="text-xl font-extrabold text-[#1a2e24]">
                  {formatCurrency(doctor?.consultation_fee || 350000)}
                </span>
              </div>
            </div>

            {/* Assurances list */}
            <div className="pt-3 border-t border-gray-100 space-y-2 text-[11px] text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0" />
                <span>Nhận mã số khám ưu tiên không phải chờ đợi</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0" />
                <span>Được hủy lịch hẹn miễn phí trước 2 tiếng</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0" />
                <span>Hỗ trợ y tế khẩn cấp 24/7 qua tổng đài 1900 2805</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <div className="min-h-screen py-6 bg-gradient-to-b from-[#f8faf9] to-white">
      <Suspense fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="glass-card rounded-2xl p-8 flex items-center gap-3 text-gray-600">
            <div className="w-5 h-5 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-semibold">Đang chuẩn bị hồ sơ đặt khám...</span>
          </div>
        </div>
      }>
        <BookingFormContent />
      </Suspense>
    </div>
  );
}
