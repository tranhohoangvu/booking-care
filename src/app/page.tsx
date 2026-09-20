'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { 
  Search, 
  Stethoscope, 
  Building2, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Activity,
  Heart,
  Eye,
  Baby,
  Smile,
  Zap,
  Check,
  Sparkles,
  MapPin,
  ChevronRight,
  BadgeCheck
} from 'lucide-react';

const specialties = [
  { 
    name: 'Cơ Xương Khớp', 
    slug: 'co-xuong-khop', 
    icon: <Activity className="w-5 h-5 text-sky-600" strokeWidth={1.75} />, 
    doctors: 45, 
    desc: 'Điều trị thoái hóa cột sống, viêm khớp dạng thấp, chấn thương dây chằng thể thao.',
    badge: 'Chuyên khoa mũi nhọn'
  },
  { 
    name: 'Tim Mạch & Mạch Máu', 
    slug: 'tim-mach', 
    icon: <Heart className="w-5 h-5 text-rose-600" strokeWidth={1.75} />, 
    doctors: 32, 
    desc: 'Tầm soát rối loạn nhịp tim, suy tim, tăng huyết áp, đặt stent mạch vành.',
    badge: 'Kỹ thuật cao'
  },
  { 
    name: 'Thần Kinh & Đột Quỵ', 
    slug: 'than-kinh', 
    icon: <Zap className="w-5 h-5 text-indigo-600" strokeWidth={1.75} />, 
    doctors: 28, 
    desc: 'Khám đau nửa đầu mãn tính, rối loạn giấc ngủ, di chứng sau tai biến.' 
  },
  { 
    name: 'Tiêu Hóa & Gan Mật', 
    slug: 'tieu-hoa-gan-mat', 
    icon: <Heart className="w-5 h-5 text-amber-600" strokeWidth={1.75} />, 
    doctors: 39, 
    desc: 'Nội soi dạ dày không đau, điều trị trĩ, viêm gan B-C, sỏi mật.' 
  },
  { 
    name: 'Tai Mũi Họng', 
    slug: 'tai-mui-hong', 
    icon: <Smile className="w-5 h-5 text-teal-600" strokeWidth={1.75} />, 
    doctors: 30, 
    desc: 'Nội soi ống mềm phát hiện sớm ung thư vòm họng, viêm amidan hốc mủ.' 
  },
  { 
    name: 'Da Liễu & Thẩm Mỹ', 
    slug: 'da-lieu', 
    icon: <Sparkles className="w-5 h-5 text-emerald-600" strokeWidth={1.75} />, 
    doctors: 25, 
    desc: 'Điều trị mụn viêm, chàm cơ địa, vảy nến, trẻ hóa và phục hồi da liễu.' 
  },
];

const featuredDoctors = [
  {
    name: 'PGS.TS.BS Nguyễn Văn Liệu',
    degree: 'Phó Giáo sư, Tiến sĩ, Bác sĩ',
    specialty: 'Thần kinh & Cơ Xương Khớp',
    hospital: 'Bệnh viện Đại học Y Dược TP.HCM',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80',
    experience: '32 năm kinh nghiệm',
    fee: 350000,
    slots: ['08:30', '09:00', '10:30'],
  },
  {
    name: 'ThS.BSCKII Trần Thị Mai Hương',
    degree: 'Thạc sĩ, Bác sĩ Chuyên khoa II',
    specialty: 'Tim Mạch Can Thiệp',
    hospital: 'Bệnh viện Chợ Rẫy',
    avatar: 'https://images.unsplash.com/photo-1594824813581-2292f7e025ff?w=600&auto=format&fit=crop&q=80',
    experience: '24 năm kinh nghiệm',
    fee: 300000,
    slots: ['13:30', '14:30', '15:30'],
  },
  {
    name: 'TS.BS Lê Hoàng Nam',
    degree: 'Tiến sĩ, Giảng viên Y khoa',
    specialty: 'Tiêu Hóa & Nội Soi Can Thiệp',
    hospital: 'Phòng khám Đa khoa Quốc tế CarePlus',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600&auto=format&fit=crop&q=80',
    experience: '19 năm kinh nghiệm',
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
    <div className="flex flex-col gap-14 md:gap-20 pb-20">
      {/* 1. ASYMMETRIC SPLIT HERO SECTION (Anti-center bias, fits in initial viewport) */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-sky-50/40 via-white to-slate-50/20 pt-10 sm:pt-14 pb-14">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Value Prop & Unified Search */}
            <div className="lg:col-span-7 space-y-6">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100/70 border border-sky-200/80 text-sky-800 text-[11px] font-semibold tracking-wide uppercase">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-700" strokeWidth={2} />
                <span>Nền tảng Y tế Số Chuẩn Xác • Xác Nhận Tức Thì</span>
              </div>

              {/* Headline - max 2 lines, tight tracking */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                  Đặt lịch khám với <br />
                  <span className="text-sky-600">bác sĩ chuyên khoa đầu ngành</span>
                </h1>
                
                {/* Subtext - under 20 words */}
                <p className="text-sm sm:text-base text-slate-600 max-w-[50ch] leading-relaxed">
                  Chọn đúng bác sĩ, hẹn đúng giờ, không xếp hàng chờ đợi tại hơn 50 bệnh viện và phòng khám uy tín.
                </p>
              </div>

              {/* Unified Search Bar with High Contrast */}
              <div className="space-y-3 pt-2">
                <form 
                  onSubmit={handleSearch} 
                  className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-300 shadow-sm focus-within:border-sky-600 focus-within:ring-4 focus-within:ring-sky-500/10 transition-all max-w-xl"
                >
                  <div className="flex-1 flex items-center pl-3">
                    <Search className="w-4 h-4 text-slate-400 shrink-0" strokeWidth={2} />
                    <input
                      type="text"
                      placeholder="Tìm bác sĩ, chuyên khoa hoặc bệnh viện..."
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      className="w-full pl-2.5 pr-2 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-transparent border-0 focus:outline-none"
                    />
                  </div>
                  <Button type="submit" size="default" className="h-10 px-5 text-xs font-semibold rounded-xl shrink-0">
                    Tìm kiếm
                  </Button>
                </form>

                {/* Fast Search Chips */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
                  <span className="text-[11px] font-semibold text-slate-700">Phổ biến:</span>
                  {['Cơ Xương Khớp', 'Tim Mạch', 'Da Liễu', 'Tai Mũi Họng'].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleQuickTag(chip)}
                      className="px-2.5 py-1 rounded-full bg-slate-100/90 hover:bg-sky-50 hover:text-sky-700 border border-slate-200 text-[11px] transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trust Indicators Pill */}
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <BadgeCheck className="w-4 h-4 text-emerald-600" strokeWidth={2} />
                  <span>100% Bác sĩ có chứng chỉ hành nghề</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" strokeWidth={2.5} />
                  <span>Khám đúng giờ hẹn đã đặt</span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive Doctor Availability Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md">
                {/* Floating Notification chip */}
                <div className="absolute -top-3.5 right-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-semibold shadow-md shadow-emerald-600/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  <span>Lịch khám hôm nay còn trống</span>
                </div>

                {/* Specialist Card */}
                <Card className="rounded-2xl border-slate-200/90 shadow-md shadow-slate-200/50 overflow-hidden bg-white">
                  <CardContent className="p-6 space-y-5">
                    {/* Doctor Mini Profile */}
                    <div className="flex gap-4 items-start">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80"
                        alt="PGS.TS Nguyễn Văn Liệu"
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-sky-700 uppercase tracking-wide">
                          Bác sĩ nổi bật trong tuần
                        </span>
                        <h3 className="font-bold text-sm text-slate-900 leading-tight">
                          PGS.TS.BS Nguyễn Văn Liệu
                        </h3>
                        <p className="text-xs text-slate-500">Chuyên khoa Thần kinh & Cột sống</p>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>BV Đại học Y Dược TP.HCM</span>
                        </div>
                      </div>
                    </div>

                    {/* Slot Picker Live Simulation */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-sky-600" /> Chọn giờ khám:
                        </span>
                        <span className="text-[11px] text-slate-500">Thời lượng: 30 phút</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {['08:30', '09:00', '10:30'].map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setActiveSlot(slot)}
                            className={`py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                              activeSlot === slot
                                ? 'bg-sky-600 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Consultation Fee and Action Button */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-slate-500 block">Giá khám niêm yết</span>
                        <span className="text-base font-bold text-slate-900">{formatCurrency(350000)}</span>
                      </div>

                      <Link href="/doctors">
                        <Button size="sm" className="h-10 px-5 text-xs font-semibold rounded-xl">
                          Đặt lịch ngay <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. VERIFIED HOSPITAL PARTNER WALL (Placed cleanly under the hero) */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-xs">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0">
              Đối tác y tế liên kết:
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-2 text-xs font-semibold text-slate-700">
              {hospitalPartners.map((hospital) => (
                <div key={hospital} className="flex items-center gap-1.5 hover:text-sky-600 transition-colors">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} />
                  <span>{hospital}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. ASYMMETRIC BENTO SPECIALTIES GRID (Hallmark Bento rhythm & structure) */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700">Khám theo chuyên khoa</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
              Chuyên khoa khám phổ biến
            </h2>
          </div>
          <Link href="/specialties" className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-800">
            Xem tất cả chuyên khoa <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Bento Grid: 1 Large Anchor + 1 Highlight + 4 Compact Cells (Total = 6 items) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Bento Cell 1: Large Anchor (Cơ Xương Khớp) */}
          <Link href={`/specialties/${specialties[0].slug}`} className="group md:col-span-2">
            <Card className="h-full rounded-2xl border-slate-200 hover:border-sky-300 hover:shadow-md transition-all p-6 flex flex-col justify-between bg-gradient-to-br from-sky-50/50 via-white to-white">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                    {specialties[0].icon}
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold">
                    {specialties[0].badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                    {specialties[0].name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-md leading-relaxed">
                    {specialties[0].desc}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">{specialties[0].doctors} Bác sĩ đầu ngành</span>
                <span className="font-semibold text-sky-700 flex items-center gap-1">
                  Xem danh sách bác sĩ <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Card>
          </Link>

          {/* Bento Cell 2: Highlight (Tim Mạch) */}
          <Link href={`/specialties/${specialties[1].slug}`} className="group">
            <Card className="h-full rounded-2xl border-slate-200 hover:border-rose-300 hover:shadow-md transition-all p-6 flex flex-col justify-between bg-gradient-to-br from-rose-50/40 via-white to-white">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                    {specialties[1].icon}
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                    {specialties[1].badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-rose-700 transition-colors">
                    {specialties[1].name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {specialties[1].desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">{specialties[1].doctors} Bác sĩ</span>
                <span className="font-semibold text-rose-700 flex items-center gap-1">
                  Đặt khám <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Card>
          </Link>

          {/* Bento Cells 3, 4, 5, 6: 4 Compact Tiles */}
          {specialties.slice(2).map((item) => (
            <Link key={item.slug} href={`/specialties/${item.slug}`} className="group">
              <Card className="h-full rounded-2xl border-slate-200 hover:border-sky-300 hover:shadow-md transition-all p-5 flex flex-col justify-between bg-white">
                <div className="space-y-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-sky-50 flex items-center justify-center transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">{item.doctors} Bác sĩ</span>
                  <span className="font-semibold text-sky-700">Xem lịch</span>
                </div>
              </Card>
            </Link>
          ))}

        </div>
      </section>

      {/* 4. DOCTOR SPOTLIGHT: Real Clinical Profiles */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700">Đội ngũ y khoa</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
              Bác sĩ chuyên khoa tiêu biểu
            </h2>
          </div>
          <Link href="/doctors" className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-800">
            Xem tất cả bác sĩ <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredDoctors.map((doc) => (
            <Card key={doc.name} className="rounded-2xl border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition-all">
              <CardContent className="p-6 space-y-4">
                {/* Doctor Headshot & Degree */}
                <div className="flex gap-3.5 items-start">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-sky-700 uppercase">{doc.degree}</span>
                    <h3 className="font-bold text-sm text-slate-900 leading-tight">{doc.name}</h3>
                    <p className="text-xs font-medium text-slate-600">{doc.specialty}</p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{doc.hospital}</span>
                    </p>
                  </div>
                </div>

                {/* Practical Slot Pickers */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-sky-600" /> Khung giờ khám hôm nay:
                  </span>
                  <div className="flex gap-2">
                    {doc.slots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        className="flex-1 py-1.5 px-2 rounded-lg bg-sky-50 text-sky-800 font-bold text-xs hover:bg-sky-600 hover:text-white transition-colors"
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fee & Booking Link */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Giá khám</span>
                    <span className="text-sm font-bold text-slate-900">{formatCurrency(doc.fee)}</span>
                  </div>
                  <Link href="/doctors">
                    <Button size="sm" variant="outline" className="h-9 px-3 text-xs font-semibold rounded-xl">
                      Chi tiết & Đặt hẹn
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 5. CLINICAL ASSURANCE & TRUST PILLARS (Anti-slop: real operational commitments) */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xs">
          <div className="max-w-2xl mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700">Cam kết dịch vụ</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Vì sao hàng triệu người bệnh tin tưởng BookingCare?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Quy trình kết nối y tế chuẩn hoá, minh bạch và an toàn tuyệt đối cho người bệnh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="font-bold text-base text-slate-900">Chống trùng lịch tuyệt đối</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ràng buộc khoá slot thời gian thực ở cấp độ cơ sở dữ liệu, đảm bảo khung giờ của bạn không bao giờ bị người khác đặt trùng.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="font-bold text-base text-slate-900">Minh bạch viện phí niêm yết</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Toàn bộ giá khám được công khai theo đúng quy định của bệnh viện và phòng khám, hoàn toàn không thu thêm bất kỳ phụ phí ẩn nào.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="font-bold text-base text-slate-900">Lưu trữ lời dặn & đơn thuốc</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sau khi buổi khám hoàn tất, kết luận sơ bộ và lời dặn dò của bác sĩ được cập nhật trực tiếp vào hồ sơ cá nhân để bạn dễ dàng theo dõi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER (Restrained, high-contrast, no generic AI purple glow) */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Chủ động chăm sóc sức khỏe của bạn và người thân
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Đặt lịch trước giúp giảm thiểu thời gian chờ đợi và bảo đảm được bác sĩ giỏi trực tiếp thăm khám.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link href="/doctors">
              <Button size="default" className="h-11 px-6 text-xs font-bold rounded-xl bg-sky-600 text-white hover:bg-sky-500">
                Tìm bác sĩ chuyên khoa
              </Button>
            </Link>
            <Link href="/register">
              <Button size="default" variant="outline" className="h-11 px-6 text-xs font-bold rounded-xl border-slate-700 text-slate-200 hover:bg-slate-800 bg-transparent">
                Đăng ký tài khoản
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
