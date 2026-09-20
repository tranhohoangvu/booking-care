'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Clock, 
  Calendar, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard, 
  Building2, 
  Stethoscope, 
  ChevronRight, 
  Award, 
  FileText 
} from 'lucide-react';
import { getDoctorById, type DoctorWithDetails } from '@/lib/services/doctors';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Helper to generate next 4 dates
function getUpcomingDates() {
  const dates = [];
  const daysOfWeek = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

  for (let i = 0; i < 4; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);

    const dayName = i === 0 ? 'Hôm nay' : i === 1 ? 'Ngày mai' : daysOfWeek[d.getDay()];
    const dateFormatted = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
    const fullDate = `${dayName} - ${dateFormatted}`;

    dates.push({
      key: d.toISOString().split('T')[0],
      label: fullDate,
      shortLabel: dayName,
      dateFormatted,
    });
  }
  return dates;
}

function DoctorDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const doctorId = params?.id as string;
  const initialSlot = searchParams?.get('slot') || '08:30';

  const [doctor, setDoctor] = useState<DoctorWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // Booking slot state
  const upcomingDates = getUpcomingDates();
  const [selectedDate, setSelectedDate] = useState(upcomingDates[0].key);
  const [selectedSlot, setSelectedSlot] = useState<string>(initialSlot);
  const [bookingNotice, setBookingNotice] = useState<string | null>(null);

  useEffect(() => {
    async function loadDoctor() {
      if (!doctorId) return;
      try {
        const data = await getDoctorById(doctorId);
        setDoctor(data);
      } catch (err) {
        console.error('Failed to load doctor profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDoctor();
  }, [doctorId]);

  const handleBookNow = () => {
    if (!doctor) return;
    router.push(`/booking?doctorId=${doctor.id}&date=${selectedDate}&slot=${selectedSlot}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="glass-card rounded-2xl p-8 flex items-center gap-3 text-gray-600">
          <div className="w-5 h-5 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold">Đang tải hồ sơ bác sĩ...</span>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen py-16 px-4 max-w-lg mx-auto text-center">
        <div className="glass-card rounded-[28px] p-10 space-y-4">
          <h2 className="text-xl font-bold text-[#1a2e24]">Không tìm thấy bác sĩ</h2>
          <p className="text-xs text-gray-600">Bác sĩ bạn đang tìm kiếm không tồn tại hoặc đã ngừng nhận lịch hẹn trực tuyến.</p>
          <Link href="/doctors">
            <Button className="rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs px-5">
              Quay lại danh sách bác sĩ
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const morningSlots = (doctor.available_slots || ['08:00', '08:30', '09:00', '10:00', '10:30']).filter(
    (s) => parseInt(s.split(':')[0], 10) < 12
  );
  const afternoonSlots = (doctor.available_slots || ['13:30', '14:00', '14:30', '15:30']).filter(
    (s) => parseInt(s.split(':')[0], 10) >= 12
  );

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#22c55e] flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Trang chủ
        </Link>
        <span>/</span>
        <Link href="/doctors" className="hover:text-[#22c55e] transition-colors">
          Bác sĩ
        </Link>
        <span>/</span>
        <span className="text-[#1a2e24] font-semibold">{doctor.full_name}</span>
      </div>

      {/* 1. Doctor Main Header Card */}
      <div className="glass-card rounded-[28px] p-8 md:p-10 mb-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Avatar with Verified Status */}
          <div className="relative shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={doctor.avatar_url || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80'}
              alt={doctor.full_name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-white shadow-sm"
            />
            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#22c55e] border-2 border-white shadow-xs" />
          </div>

          {/* Details */}
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#22c55e]/15 text-[#16a34a] text-xs font-bold uppercase tracking-wider border border-[#22c55e]/20">
                {doctor.degree}
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-gray-500">
                <ShieldCheck className="w-4 h-4 text-[#22c55e]" /> Đã xác thực chứng chỉ hành nghề
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1a2e24]">
              {doctor.full_name}
            </h1>

            {doctor.specialty && (
              <p className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-[#22c55e]" />
                <span>Chuyên khoa:</span>
                <Link href={`/specialties/${doctor.specialty.slug}`} className="text-[#22c55e] hover:underline">
                  {doctor.specialty.name}
                </Link>
              </p>
            )}

            {doctor.clinic && (
              <p className="text-sm text-gray-600 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#22c55e] shrink-0" />
                <span>Cơ sở y tế:</span>
                <Link href={`/clinics/${doctor.clinic.slug}`} className="text-gray-900 font-semibold hover:text-[#22c55e] transition-colors">
                  {doctor.clinic.name}
                </Link>
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-gray-600">
              <span className="flex items-center gap-1 font-semibold text-gray-700">
                <Award className="w-4 h-4 text-[#22c55e]" />
                {doctor.experience_years} năm kinh nghiệm chuyên khoa
              </span>
              {doctor.average_rating && (
                <span className="flex items-center gap-1 font-bold text-amber-600">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  {doctor.average_rating} ({doctor.total_reviews} người bệnh đánh giá hài lòng)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Schedule & Fee Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        
        {/* Left: Schedule & Time Slots Selector */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-card rounded-[28px] p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#1a2e24] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#22c55e]" /> Lịch khám bệnh trực tuyến
              </h2>
              <p className="text-xs text-gray-600 mt-1">
                Chọn ngày và khung giờ mong muốn. Phí đặt lịch hoàn toàn miễn phí, thanh toán tiền khám tại viện.
              </p>
            </div>

            {/* Date Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
              {upcomingDates.map((d) => (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => setSelectedDate(d.key)}
                  className={`py-2 px-3.5 rounded-xl transition-all shrink-0 cursor-pointer ${
                    selectedDate === d.key
                      ? 'bg-[#22c55e] text-white shadow-xs font-bold'
                      : 'bg-white/80 hover:bg-white text-gray-700 border border-gray-200'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Time Slots: Morning & Afternoon */}
            <div className="space-y-4 pt-2">
              {/* Morning */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-600" /> Buổi Sáng:
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {morningSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedSlot === slot
                          ? 'bg-[#1a2e24] text-white shadow-sm ring-2 ring-[#22c55e]'
                          : 'bg-white/90 hover:bg-white text-gray-800 border border-gray-200 hover:border-[#22c55e]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Afternoon */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-600" /> Buổi Chiều:
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {afternoonSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedSlot === slot
                          ? 'bg-[#1a2e24] text-white shadow-sm ring-2 ring-[#22c55e]'
                          : 'bg-white/90 hover:bg-white text-gray-800 border border-gray-200 hover:border-[#22c55e]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Booking Bar Notice */}
            {bookingNotice && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800 font-semibold animate-in fade-in-50">
                <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0" />
                <span>{bookingNotice}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Consultation Fee & Hospital Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card rounded-[28px] p-6 space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Chi phí & Thanh toán</span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-xs text-gray-600">Giá khám niêm yết:</span>
                <span className="text-2xl font-extrabold text-[#1a2e24]">
                  {formatCurrency(doctor.consultation_fee)}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Giá đã bao gồm thuế VAT và phí khám với chuyên gia theo quy định của bệnh viện.
              </p>
            </div>

            <div className="pt-3 border-t border-gray-200/60 space-y-2.5 text-xs text-gray-700">
              <div className="flex items-center gap-2 font-medium">
                <CreditCard className="w-4 h-4 text-[#22c55e]" />
                <span>Thanh toán: Tiền mặt tại viện hoặc chuyển khoản</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <Clock className="w-4 h-4 text-[#22c55e]" />
                <span>Được ưu tiên vào khám đúng giờ đã đặt</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
                <span>Được hủy lịch miễn phí trước 2 giờ</span>
              </div>
            </div>

            {/* Selected Slot Summary & Book Button */}
            <div className="pt-3 border-t border-gray-200/60 space-y-3">
              <div className="p-3 rounded-xl bg-white/70 border border-gray-200 text-xs">
                <span className="text-gray-500 block">Khung giờ đang chọn:</span>
                <span className="font-bold text-[#1a2e24] text-sm">
                  {selectedSlot} • {upcomingDates.find((d) => d.key === selectedDate)?.shortLabel} (
                  {upcomingDates.find((d) => d.key === selectedDate)?.dateFormatted})
                </span>
              </div>

              <Button
                onClick={handleBookNow}
                className="w-full h-11 text-xs font-bold rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Tiếp tục đặt lịch khám <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Hospital Address Card */}
          {doctor.clinic && (
            <div className="glass-card rounded-[24px] p-6 space-y-3 text-xs">
              <h3 className="font-bold text-[#1a2e24] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#22c55e]" /> Địa chỉ phòng khám
              </h3>
              <p className="font-semibold text-gray-800">{doctor.clinic.name}</p>
              <p className="text-gray-600">{doctor.clinic.address}</p>
              {doctor.clinic.phone && (
                <p className="text-gray-500 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span>Tổng đài tiếp đón: {doctor.clinic.phone}</span>
                </p>
              )}
            </div>
          )}
        </div>

      </div>

      {/* 3. Detailed Biography & Qualifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        <div className="lg:col-span-8 space-y-8">
          
          {/* Biography */}
          <div className="glass-card rounded-[28px] p-8 space-y-4">
            <h2 className="text-xl font-bold text-[#1a2e24] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#22c55e]" /> Giới thiệu chuyên môn & Quá trình công tác
            </h2>
            <div className="text-sm text-gray-700 leading-relaxed space-y-3">
              <p>{doctor.bio}</p>
              <p>
                Bác sĩ luôn chú trọng việc lắng nghe triệu chứng kỹ lưỡng từ người bệnh, đưa ra phác đồ điều trị chuẩn xác, hạn chế tối đa việc lạm dụng thuốc kháng sinh hay các can thiệp xâm lấn không cần thiết.
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200/60 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-white/70 border border-gray-200 space-y-1">
                <span className="font-bold text-[#1a2e24] block">Kinh nghiệm lâm sàng</span>
                <span className="text-gray-600">{doctor.experience_years} năm cống hiến trong ngành y tế</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/70 border border-gray-200 space-y-1">
                <span className="font-bold text-[#1a2e24] block">Đào tạo & Tu nghiệp</span>
                <span className="text-gray-600">Đào tạo chuyên sâu trong nước và quốc tế</span>
              </div>
            </div>
          </div>

          {/* Patient Reviews Section */}
          <div className="glass-card rounded-[28px] p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200/60 pb-4">
              <div>
                <h2 className="text-xl font-bold text-[#1a2e24] flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> Đánh giá từ người bệnh đã khám
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">Phản hồi thực tế từ những bệnh nhân đã hoàn thành buổi khám</p>
              </div>
              <span className="text-sm font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                ⭐ {doctor.average_rating} / 5.0
              </span>
            </div>

            <div className="space-y-4">
              {(doctor.reviews_list || []).map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-white/80 border border-gray-200/70 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1a2e24]">{rev.patient_name}</span>
                    <span className="text-gray-400">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Advice Pillar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card rounded-[24px] p-6 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-[#1a2e24]">Lưu ý trước khi đi khám</h3>
            <ul className="space-y-2.5 text-gray-600 list-disc list-inside leading-relaxed">
              <li>Vui lòng đến trước giờ hẹn 10 - 15 phút để làm thủ tục tiếp đón tại quầy ưu tiên.</li>
              <li>Mang theo thẻ Căn cước công dân hoặc VNeID cùng các kết quả xét nghiệm, đơn thuốc cũ (nếu có).</li>
              <li>Đối với khám tiêu hóa hoặc xét nghiệm máu, nên nhịn ăn sáng theo chỉ dẫn.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DoctorDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="glass-card rounded-2xl p-8 flex items-center gap-3 text-gray-600">
          <div className="w-5 h-5 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold">Đang tải thông tin bác sĩ...</span>
        </div>
      </div>
    }>
      <DoctorDetailContent />
    </Suspense>
  );
}
