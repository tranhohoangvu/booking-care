'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { 
  Search, 
  Building2, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Activity,
  Heart,
  Smile,
  Zap,
  Check,
  Sparkles,
  MapPin,
  ChevronRight,
  BadgeCheck,
  CalendarCheck2
} from 'lucide-react';

const specialties = [
  { 
    name: 'Cơ Xương Khớp', 
    slug: 'co-xuong-khop', 
    icon: <Activity className="w-5 h-5 text-[#22c55e]" strokeWidth={2} />, 
    doctors: 45, 
    desc: 'Điều trị thoái hóa cột sống, viêm khớp dạng thấp, chấn thương dây chằng thể thao.',
    badge: 'Chuyên khoa mũi nhọn'
  },
  { 
    name: 'Tim Mạch & Mạch Máu', 
    slug: 'tim-mach', 
    icon: <Heart className="w-5 h-5 text-rose-500" strokeWidth={2} />, 
    doctors: 32, 
    desc: 'Tầm soát rối loạn nhịp tim, suy tim, tăng huyết áp, can thiệp mạch vành chuyên sâu.',
    badge: 'Kỹ thuật cao'
  },
  { 
    name: 'Thần Kinh & Đột Quỵ', 
    slug: 'than-kinh', 
    icon: <Zap className="w-5 h-5 text-amber-500" strokeWidth={2} />, 
    doctors: 28, 
    desc: 'Khám đau nửa đầu mãn tính, rối loạn tiền đình, di chứng sau tai biến mạch máu não.' 
  },
  { 
    name: 'Tiêu Hóa & Gan Mật', 
    slug: 'tieu-hoa-gan-mat', 
    icon: <Sparkles className="w-5 h-5 text-emerald-600" strokeWidth={2} />, 
    doctors: 39, 
    desc: 'Nội soi dạ dày không đau, điều trị trĩ, viêm gan B-C, tầm soát ung thư sớm.' 
  },
  { 
    name: 'Tai Mũi Họng', 
    slug: 'tai-mui-hong', 
    icon: <Smile className="w-5 h-5 text-teal-600" strokeWidth={2} />, 
    doctors: 30, 
    desc: 'Nội soi ống mềm phát hiện sớm ung thư vòm họng, viêm xoang và amidan hốc mủ.' 
  },
  { 
    name: 'Da Liễu & Thẩm Mỹ', 
    slug: 'da-lieu', 
    icon: <Heart className="w-5 h-5 text-indigo-500" strokeWidth={2} />, 
    doctors: 25, 
    desc: 'Điều trị mụn viêm, chàm cơ địa, vảy nến, trẻ hóa và phục hồi tế bào da liễu.' 
  },
];

const featuredDoctors = [
  {
    name: 'PGS.TS.BS Nguyễn Văn Liệu',
    degree: 'Phó Giáo sư, Tiến sĩ, Bác sĩ',
    specialty: 'Thần kinh & Cơ Xương Khớp',
    hospital: 'Bệnh viện Đại học Y Dược TP.HCM',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80',
    fee: 350000,
    slots: ['08:30', '09:00', '10:30'],
  },
  {
    name: 'ThS.BSCKII Trần Thị Mai Hương',
    degree: 'Thạc sĩ, Bác sĩ Chuyên khoa II',
    specialty: 'Tim Mạch Can Thiệp',
    hospital: 'Bệnh viện Chợ Rẫy',
    avatar: 'https://images.unsplash.com/photo-1594824813581-2292f7e025ff?w=600&auto=format&fit=crop&q=80',
    fee: 300000,
    slots: ['13:30', '14:30', '15:30'],
  },
  {
    name: 'TS.BS Lê Hoàng Nam',
    degree: 'Tiến sĩ, Giảng viên Y khoa',
    specialty: 'Tiêu Hóa & Nội Soi Can Thiệp',
    hospital: 'Phòng khám Đa khoa Quốc tế CarePlus',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600&auto=format&fit=crop&q=80',
    fee: 280000,
    slots: ['09:30', '11:00', '14:00'],
  },
];

const hospitalPartners = [
  'Bệnh viện Chợ Rẫy',
  'BV Đại học Y Dược TP.HCM',
  'Bệnh viện Bạch Mai',
  'BV Tai Mũi Họng TW',
  'Phòng khám Quốc tế CarePlus',
  'BV Đa khoa Hồng Ngọc'
];

export default function HomePage() {
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeSlot, setActiveSlot] = useState<string>('08:30');
  const [isSubheadlineAnimated, setIsSubheadlineAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSubheadlineAnimated(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      router.push(`/doctors?search=${encodeURIComponent(searchKeyword.trim())}`);
    } else {
      router.push('/doctors');
    }
  };

  const handleQuickTag = (tag: string) => {
    router.push(`/doctors?search=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="flex flex-col gap-12 md:gap-20 pb-24">
      {/* 1. MODERN KINETIC HERO SECTION */}
      <section className="pt-12 md:pt-20 pb-8 text-center max-w-5xl mx-auto w-full px-4 sm:px-6 z-20">
        
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-gray-300/80 shadow-xs mb-6 animate-nav-fade">
          <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
          <span className="text-xs font-semibold text-[#1a2e24] tracking-wide">
            Nền tảng Y tế Số Chuẩn Xác • Hẹn Khám Không Chờ Đợi
          </span>
        </div>

        {/* Kinetic Animated Headline: 46px font size, font-bold leading-[1.1] tracking-tight */}
        <h1 className="text-[36px] sm:text-[48px] md:text-[54px] font-bold leading-[1.12] tracking-tight text-center text-[#1a2e24]">
          <span className="word-group" style={{ animationDelay: '0.15s' }}>Khám</span>{' '}
          <span className="word-group" style={{ animationDelay: '0.30s' }}>Đúng</span>{' '}
          <span className="word-group" style={{ animationDelay: '0.45s' }}>Bác</span>{' '}
          <span className="word-group" style={{ animationDelay: '0.60s' }}>Sĩ.</span>{' '}
          <span className="word-group" style={{ animationDelay: '0.75s' }}>Hẹn</span>{' '}
          <span className="word-group" style={{ animationDelay: '0.90s' }}>Đúng</span>{' '}
          <span className="word-group" style={{ animationDelay: '1.05s' }}>Giờ.</span>
          <br />
          <span className="word-group text-[#22c55e]" style={{ animationDelay: '1.20s' }}>Chăm</span>{' '}
          <span className="word-group text-[#22c55e]" style={{ animationDelay: '1.35s' }}>Sóc</span>{' '}
          <span className="word-group text-[#22c55e]" style={{ animationDelay: '1.50s' }}>Tận</span>{' '}
          <span className="word-group text-[#22c55e]" style={{ animationDelay: '1.65s' }}>Tâm.</span>
        </h1>

        {/* Subheadline (15px, 2-line break) */}
        <p className={`mt-6 text-[15px] font-normal text-gray-700 max-w-[44rem] mx-auto leading-relaxed transition-all duration-700 ${
          isSubheadlineAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
        }`}>
          Nền tảng y tế số kết nối người bệnh trực tiếp với hơn 500+ bác sĩ chuyên khoa đầu ngành.<br className="hidden sm:inline" />
          Đặt lịch chuẩn xác theo thời gian thực, không xếp hàng chờ đợi tại 50+ bệnh viện và phòng khám uy tín.
        </p>

        {/* Glassmorphic Unified Search Bar */}
        <div className="mt-8 max-w-2xl mx-auto">
          <form 
            onSubmit={handleSearch} 
            className="flex items-center gap-2 p-2 bg-white/90 backdrop-blur-md rounded-full border border-gray-300 shadow-[0_8px_30px_rgb(0,0,0,0.06)] focus-within:border-[#22c55e] focus-within:ring-2 focus-within:ring-[#22c55e]/20 transition-all"
          >
            <div className="flex-1 flex items-center pl-4">
              <Search className="w-5 h-5 text-gray-400 shrink-0" strokeWidth={2} />
              <input
                type="text"
                placeholder="Tìm bác sĩ, chuyên khoa hoặc bệnh viện..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-3 pr-2 py-2 text-[14px] text-gray-900 placeholder:text-gray-400 bg-transparent border-0 focus:outline-none"
              />
            </div>
            <button 
              type="submit" 
              className="px-6 py-2.5 rounded-full font-medium text-[14px] bg-[#22c55e] hover:bg-[#16a34a] text-white transition-colors shadow-sm shrink-0"
            >
              Tìm kiếm
            </button>
          </form>

          {/* Quick Search Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-gray-600">
            <span className="font-semibold text-gray-500">Phổ biến:</span>
            {['Cơ Xương Khớp', 'Tim Mạch', 'Da Liễu', 'Tai Mũi Họng', 'Tiêu Hóa', 'Thần Kinh'].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleQuickTag(chip)}
                className="px-3 py-1 rounded-full bg-white/70 hover:bg-white hover:text-[#22c55e] border border-gray-300/80 text-[12px] font-medium transition-all active:scale-[0.98]"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Hero CTA Buttons & Trust Points */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link 
            href="/doctors" 
            className="px-6 py-2.5 rounded-full font-medium text-[14px] bg-[#22c55e] hover:bg-[#16a34a] text-white transition-colors shadow-sm"
          >
            Đặt lịch khám ngay
          </Link>
          <Link 
            href="/specialties" 
            className="px-6 py-2.5 rounded-full font-medium text-[14px] border border-gray-400 text-gray-800 hover:bg-gray-100/60 transition-colors"
          >
            Xem chuyên khoa
          </Link>
        </div>

        {/* Trust Points */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-700">
          <div className="flex items-center gap-1.5">
            <BadgeCheck className="w-4 h-4 text-[#22c55e]" strokeWidth={2} />
            <span>100% Bác sĩ có chứng chỉ hành nghề</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-[#22c55e]" strokeWidth={2.5} />
            <span>Khám đúng giờ hẹn đã đặt</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#22c55e]" strokeWidth={2} />
            <span>Bảo mật dữ liệu hồ sơ y tế</span>
          </div>
        </div>

      </section>

      {/* 2. VERIFIED HOSPITAL PARTNER WALL */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-20">
        <div className="glass-card rounded-[24px] px-6 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 shrink-0 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#22c55e]" />
              <span>Đối tác y tế liên kết:</span>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-2.5 text-xs font-semibold text-gray-700">
              {hospitalPartners.map((hospital) => (
                <div key={hospital} className="flex items-center gap-1.5 hover:text-[#22c55e] transition-colors cursor-pointer">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]/60" />
                  <span>{hospital}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE SPOTLIGHT + POPULAR SPECIALTIES */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Live Slot Booking Simulation Card */}
          <div className="lg:col-span-5">
            <div className="glass-card rounded-[24px] p-6 space-y-5 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#22c55e] uppercase tracking-wider bg-[#22c55e]/10 px-3 py-1 rounded-full border border-[#22c55e]/20">
                  Lịch khám khả dụng hôm nay
                </span>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-ping" />
                  Trực tuyến
                </span>
              </div>

              {/* Doctor Info */}
              <div className="flex gap-4 items-start pt-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80"
                  alt="PGS.TS Nguyễn Văn Liệu"
                  className="w-16 h-16 rounded-[16px] object-cover border border-white shadow-xs shrink-0"
                />
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                    Bác sĩ tiêu biểu
                  </span>
                  <h3 className="font-bold text-base text-[#1a2e24] leading-tight">
                    PGS.TS.BS Nguyễn Văn Liệu
                  </h3>
                  <p className="text-xs text-gray-600">Chuyên khoa Thần kinh & Cột sống</p>
                  <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#22c55e]" />
                    <span>BV Đại học Y Dược TP.HCM</span>
                  </p>
                </div>
              </div>

              {/* Live Slot Simulation */}
              <div className="space-y-2.5 pt-3 border-t border-gray-200/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-800 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#22c55e]" strokeWidth={2} /> Chọn giờ khám:
                  </span>
                  <span className="text-[11px] text-gray-500">Thời lượng: 30 phút</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {['08:30', '09:00', '10:30'].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setActiveSlot(slot)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all active:scale-[0.98] ${
                        activeSlot === slot
                          ? 'bg-[#22c55e] text-white shadow-sm'
                          : 'bg-white/80 text-gray-700 hover:bg-white border border-gray-200'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price & Action */}
              <div className="pt-3 border-t border-gray-200/60 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-gray-500 block">Giá khám niêm yết</span>
                  <span className="text-base font-bold text-[#1a2e24]">{formatCurrency(350000)}</span>
                </div>

                <Link href="/doctors">
                  <Button size="sm" className="h-9 px-5 text-xs font-semibold rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white shadow-xs">
                    Đặt lịch ngay <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Specialties Bento Showcase */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#22c55e]">Khám theo chuyên khoa</span>
                <h2 className="text-2xl font-bold tracking-tight text-[#1a2e24] mt-0.5">
                  Chuyên khoa khám phổ biến
                </h2>
              </div>
              <Link href="/specialties" className="inline-flex items-center gap-1 text-xs font-semibold text-[#22c55e] hover:underline">
                Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {specialties.slice(0, 4).map((spec) => (
                <Link key={spec.slug} href={`/specialties/${spec.slug}`} className="group">
                  <div className="glass-card rounded-[20px] p-5 h-full flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-xl bg-white/90 shadow-xs flex items-center justify-center border border-gray-200">
                          {spec.icon}
                        </div>
                        {spec.badge && (
                          <span className="px-2.5 py-0.5 rounded-full bg-white/80 text-[#22c55e] border border-gray-200 text-[10px] font-bold">
                            {spec.badge}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-[#1a2e24] group-hover:text-[#22c55e] transition-colors">
                          {spec.name}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                          {spec.desc}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-gray-200/50 flex items-center justify-between text-xs">
                      <span className="text-gray-500">{spec.doctors} Bác sĩ</span>
                      <span className="font-semibold text-[#22c55e] flex items-center gap-0.5">
                        Xem lịch <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 4. DOCTOR SPOTLIGHT */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#22c55e]">Đội ngũ y khoa</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1a2e24] mt-1">
              Bác sĩ chuyên khoa tiêu biểu
            </h2>
          </div>
          <Link href="/doctors" className="inline-flex items-center gap-1 text-xs font-semibold text-[#22c55e] hover:underline">
            Xem tất cả bác sĩ <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredDoctors.map((doc) => (
            <div key={doc.name} className="glass-card rounded-[24px] p-6 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Doctor Headshot & Degree */}
                <div className="flex gap-3.5 items-start">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    className="w-16 h-16 rounded-[16px] object-cover border border-white shadow-xs shrink-0"
                  />
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-[#22c55e] uppercase">{doc.degree}</span>
                    <h3 className="font-bold text-sm text-[#1a2e24] leading-tight">{doc.name}</h3>
                    <p className="text-xs font-medium text-gray-700">{doc.specialty}</p>
                    <p className="text-[11px] text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                      <span className="truncate">{doc.hospital}</span>
                    </p>
                  </div>
                </div>

                {/* Slot Pickers */}
                <div className="space-y-1.5 pt-3 border-t border-gray-200/60">
                  <span className="text-[11px] font-semibold text-gray-700 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#22c55e]" strokeWidth={2} /> Khung giờ khám hôm nay:
                  </span>
                  <div className="flex gap-2">
                    {doc.slots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        className="flex-1 py-1 px-2 rounded-lg bg-white/80 hover:bg-[#22c55e] hover:text-white border border-gray-200 text-gray-800 font-bold text-xs transition-colors active:scale-[0.98]"
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Fee & Booking Link */}
              <div className="pt-4 mt-4 border-t border-gray-200/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-500 block">Giá khám</span>
                  <span className="text-sm font-bold text-[#1a2e24]">{formatCurrency(doc.fee)}</span>
                </div>
                <Link href="/doctors">
                  <Button size="sm" variant="outline" className="h-8 px-3.5 text-xs font-semibold rounded-full border-gray-300 hover:border-[#22c55e] hover:text-[#22c55e] transition-colors">
                    Chi tiết & Đặt hẹn
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CLINICAL ASSURANCE PILLARS */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-20">
        <div className="glass-card rounded-[28px] p-8 sm:p-12">
          <div className="max-w-2xl mb-8 space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#22c55e]">Cam kết dịch vụ</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1a2e24]">
              Vì sao hàng triệu người bệnh tin tưởng BookingCare?
            </h2>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              Quy trình kết nối y tế chuẩn hoá, minh bạch và an toàn tuyệt đối cho người bệnh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#22c55e]/15 text-[#22c55e] flex items-center justify-center font-bold text-xs">
                01
              </div>
              <h3 className="font-bold text-sm sm:text-base text-[#1a2e24]">Chống trùng lịch tuyệt đối</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Ràng buộc khoá slot thời gian thực ở cấp độ cơ sở dữ liệu, đảm bảo khung giờ của bạn không bao giờ bị người khác đặt trùng.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#22c55e]/15 text-[#22c55e] flex items-center justify-center font-bold text-xs">
                02
              </div>
              <h3 className="font-bold text-sm sm:text-base text-[#1a2e24]">Minh bạch viện phí niêm yết</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Toàn bộ giá khám được công khai theo đúng quy định của bệnh viện và phòng khám, hoàn toàn không thu thêm bất kỳ phụ phí ẩn nào.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#22c55e]/15 text-[#22c55e] flex items-center justify-center font-bold text-xs">
                03
              </div>
              <h3 className="font-bold text-sm sm:text-base text-[#1a2e24]">Lưu trữ lời dặn & đơn thuốc</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Sau khi buổi khám hoàn tất, kết luận sơ bộ và lời dặn dò của bác sĩ được cập nhật trực tiếp vào hồ sơ cá nhân để bạn dễ dàng theo dõi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-20">
        <div className="rounded-[28px] bg-[#1a2e24] text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#22c55e]/10 blur-3xl pointer-events-none" />
          
          <div className="space-y-2 max-w-xl text-center md:text-left z-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Chủ động chăm sóc sức khỏe của bạn và người thân
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Đặt lịch trước giúp giảm thiểu thời gian chờ đợi và bảo đảm được bác sĩ giỏi trực tiếp thăm khám.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0 z-10">
            <Link href="/doctors">
              <button 
                type="button" 
                className="px-6 py-3 rounded-full font-medium text-[14px] bg-[#22c55e] hover:bg-[#16a34a] text-white transition-colors shadow-sm"
              >
                Tìm bác sĩ chuyên khoa
              </button>
            </Link>
            <Link href="/register">
              <button 
                type="button" 
                className="px-6 py-3 rounded-full font-medium text-[14px] border border-gray-400 text-white hover:bg-white/10 transition-colors"
              >
                Đăng ký tài khoản
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
