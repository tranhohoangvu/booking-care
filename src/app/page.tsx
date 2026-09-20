'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  Stethoscope, 
  Building2, 
  CalendarCheck, 
  Clock, 
  ShieldAlert, 
  Award, 
  ArrowRight,
  Sparkles,
  CheckCircle,
  Activity,
  Heart,
  Eye,
  Baby,
  Smile,
  Zap
} from 'lucide-react';

const specialties = [
  { name: 'Cơ Xương Khớp', slug: 'co-xuong-khop', icon: <Activity className="w-6 h-6 text-sky-600" />, count: '45+ Bác sĩ' },
  { name: 'Thần Kinh', slug: 'than-kinh', icon: <Zap className="w-6 h-6 text-indigo-600" />, count: '38+ Bác sĩ' },
  { name: 'Tiêu Hóa - Gan Mật', slug: 'tieu-hoa-gan-mat', icon: <Heart className="w-6 h-6 text-rose-500" />, count: '52+ Bác sĩ' },
  { name: 'Tim Mạch', slug: 'tim-mach', icon: <Heart className="w-6 h-6 text-red-600" />, count: '30+ Bác sĩ' },
  { name: 'Tai Mũi Họng', slug: 'tai-mui-hong', icon: <Smile className="w-6 h-6 text-amber-600" />, count: '40+ Bác sĩ' },
  { name: 'Da Liễu', slug: 'da-lieu', icon: <Sparkles className="w-6 h-6 text-emerald-600" />, count: '28+ Bác sĩ' },
  { name: 'Nhi Khoa', slug: 'nhi-khoa', icon: <Baby className="w-6 h-6 text-pink-500" />, count: '35+ Bác sĩ' },
  { name: 'Mắt - Nhãn Khoa', slug: 'mat-nhan-khoa', icon: <Eye className="w-6 h-6 text-cyan-600" />, count: '22+ Bác sĩ' },
];

const featuredClinics = [
  {
    name: 'Bệnh viện Đại học Y Dược TP.HCM',
    slug: 'benh-vien-dai-hoc-y-duoc',
    address: '215 Hồng Bàng, P.11, Q.5, TP.HCM',
    badge: 'Tuyến Trung Ương',
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Bệnh viện Chợ Rẫy',
    slug: 'benh-vien-cho-ray',
    address: '201B Nguyễn Chí Thanh, P.12, Q.5, TP.HCM',
    badge: 'Hạng Đặc Biệt',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Phòng khám Đa khoa Quốc tế CarePlus',
    slug: 'phong-kham-careplus',
    address: '66-68 Nam Kỳ Khởi Nghĩa, Q.1, TP.HCM',
    badge: 'Tiêu chuẩn Quốc tế',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      router.push(`/doctors?search=${encodeURIComponent(searchKeyword.trim())}`);
    } else {
      router.push('/doctors');
    }
  };

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/70 via-white to-slate-50/40 pt-16 pb-24 border-b border-slate-100">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.sky.100),white)] opacity-50" />
        
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 border border-sky-200 text-sky-800 text-xs font-semibold animate-in fade-in slide-in-from-top-4 duration-500">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            Nền tảng Y tế Chăm sóc Sức khỏe Toàn diện
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight sm:leading-none">
              Đặt lịch khám với <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-sky-600 to-cyan-500 bg-clip-text text-transparent">
                Bác sĩ chuyên khoa giỏi
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Giải pháp đặt lịch khám bệnh thông minh giúp bạn chọn đúng bác sĩ, đúng chuyên khoa, tiết kiệm thời gian chờ đợi tại bệnh viện.
            </p>
          </div>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5 p-2 bg-white rounded-2xl shadow-xl shadow-sky-900/5 border border-slate-200">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Tìm theo tên bác sĩ, chuyên khoa hoặc bệnh viện..."
                  icon={<Search className="w-5 h-5 text-sky-600" />}
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="border-0 shadow-none focus:ring-0 text-sm h-12"
                />
              </div>
              <Button type="submit" size="lg" className="sm:w-auto w-full">
                Tìm kiếm
              </Button>
            </form>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-200/60">
            <div className="p-3">
              <p className="text-2xl font-bold text-sky-600">500+</p>
              <p className="text-xs text-slate-600 mt-0.5">Bác sĩ chuyên khoa giỏi</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-bold text-indigo-600">80+</p>
              <p className="text-xs text-slate-600 mt-0.5">Cơ sở y tế & Bệnh viện</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-bold text-emerald-600">200.000+</p>
              <p className="text-xs text-slate-600 mt-0.5">Lượt khám thành công</p>
            </div>
            <div className="p-3">
              <p className="text-2xl font-bold text-amber-600">99%</p>
              <p className="text-xs text-slate-600 mt-0.5">Bệnh nhân hài lòng</p>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Chuyên khoa khám</span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">Chuyên khoa phổ biến</h2>
          </div>
          <Link href="/specialties" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-sky-600 hover:text-sky-700">
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {specialties.map((item) => (
            <Link key={item.slug} href={`/specialties/${item.slug}`} className="group">
              <Card className="hover:border-sky-300 hover:shadow-md transition-all duration-200 h-full">
                <CardContent className="p-5 flex flex-col gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-sky-50 flex items-center justify-center transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-sky-600 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{item.count}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Clinics */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Hệ thống y tế đối tác</span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">Cơ sở y tế & Bệnh viện uy tín</h2>
          </div>
          <Link href="/clinics" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-sky-600 hover:text-sky-700">
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredClinics.map((clinic) => (
            <Link key={clinic.slug} href={`/clinics/${clinic.slug}`} className="group">
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={clinic.image}
                    alt={clinic.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-white/95 backdrop-blur text-[11px] font-bold text-sky-700 px-2.5 py-1 rounded-full shadow-sm">
                    {clinic.badge}
                  </span>
                </div>
                <CardContent className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-2">
                      {clinic.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-1">{clinic.address}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-sky-600">
                    <span>Xem lịch khám</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works: 4 Steps */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16 rounded-3xl mx-4 sm:mx-6 lg:mx-8 px-6 lg:px-12">
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Quy trình đơn giản</span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">4 Bước Đặt Lịch Khám Tiện Lợi</h2>
          <p className="text-slate-400 text-sm">Chỉ với vài thao tác đơn giản trên điện thoại hoặc máy tính</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800/80 border border-slate-700/60 p-6 rounded-2xl flex flex-col gap-3 relative">
            <span className="text-4xl font-black text-sky-500/20">01</span>
            <h3 className="font-bold text-base text-white">Tìm bác sĩ / Cơ sở</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Lựa chọn chuyên khoa phù hợp và tham khảo hồ sơ bác sĩ có chuyên môn cao.
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 p-6 rounded-2xl flex flex-col gap-3 relative">
            <span className="text-4xl font-black text-sky-500/20">02</span>
            <h3 className="font-bold text-base text-white">Chọn khung giờ khám</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Chọn ngày và khung giờ 30 phút còn trống phù hợp nhất với lịch trình của bạn.
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 p-6 rounded-2xl flex flex-col gap-3 relative">
            <span className="text-4xl font-black text-sky-500/20">03</span>
            <h3 className="font-bold text-base text-white">Xác nhận thông tin</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Điền thông tin người đi khám (cho bản thân hoặc người thân) và gửi yêu cầu.
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/60 p-6 rounded-2xl flex flex-col gap-3 relative">
            <span className="text-4xl font-black text-sky-500/20">04</span>
            <h3 className="font-bold text-base text-white">Đi khám đúng hẹn</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nhận thông báo xác nhận và đến cơ sở y tế khám mà không cần xếp hàng lấy số.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-sky-600 to-cyan-600 text-white space-y-6 shadow-xl shadow-sky-600/20">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Sức khỏe là tài sản quý giá nhất của bạn
          </h2>
          <p className="text-sky-100 max-w-xl mx-auto text-sm leading-relaxed">
            Đừng để bệnh tật cản trở cuộc sống. Hãy chủ động kiểm tra sức khỏe định kỳ cùng các chuyên gia y tế hàng đầu ngay hôm nay.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/doctors">
              <Button size="lg" className="bg-white text-sky-700 hover:bg-sky-50 font-bold shadow-md">
                Tìm bác sĩ ngay
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="border-white/40 text-white bg-transparent hover:bg-white/10 font-bold">
                Tạo tài khoản miễn phí
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
