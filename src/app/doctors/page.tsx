'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Star, 
  ChevronRight, 
  RotateCcw, 
  Stethoscope, 
  Building2, 
  ArrowLeft 
} from 'lucide-react';
import { searchDoctors, type DoctorWithDetails, type DoctorFilterParams } from '@/lib/services/doctors';
import { getAllSpecialties, type SpecialtyWithCount } from '@/lib/services/specialties';
import { getAllClinics, type ClinicWithStats } from '@/lib/services/clinics';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

function DoctorsContent() {
  const searchParams = useSearchParams();

  const [doctors, setDoctors] = useState<DoctorWithDetails[]>([]);
  const [specialties, setSpecialties] = useState<SpecialtyWithCount[]>([]);
  const [clinics, setClinics] = useState<ClinicWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchKeyword, setSearchKeyword] = useState<string>(searchParams.get('search') || '');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(searchParams.get('specialty') || 'ALL');
  const [selectedClinic, setSelectedClinic] = useState<string>(searchParams.get('clinic') || 'ALL');
  const [priceRange, setPriceRange] = useState<DoctorFilterParams['priceRange']>('ALL');
  const [sortBy, setSortBy] = useState<DoctorFilterParams['sortBy']>('RATING_DESC');

  // Load master data once
  useEffect(() => {
    async function loadMasterData() {
      try {
        const [specs, clns] = await Promise.all([
          getAllSpecialties(),
          getAllClinics(),
        ]);
        setSpecialties(specs);
        setClinics(clns);
      } catch (err) {
        console.error('Error loading filter options:', err);
      }
    }
    loadMasterData();
  }, []);

  // Sync state if searchParams change
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    const urlSpecialty = searchParams.get('specialty');
    const urlClinic = searchParams.get('clinic');

    if (urlSearch !== null) setSearchKeyword(urlSearch);
    if (urlSpecialty !== null) setSelectedSpecialty(urlSpecialty);
    if (urlClinic !== null) setSelectedClinic(urlClinic);
  }, [searchParams]);

  // Query doctors when filters change
  useEffect(() => {
    async function fetchFilteredDoctors() {
      setLoading(true);
      try {
        const data = await searchDoctors({
          searchKeyword,
          specialtySlug: selectedSpecialty,
          clinicSlug: selectedClinic,
          priceRange,
          sortBy,
        });
        setDoctors(data);
      } catch (err) {
        console.error('Failed to search doctors:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(fetchFilteredDoctors, 150);
    return () => clearTimeout(timer);
  }, [searchKeyword, selectedSpecialty, selectedClinic, priceRange, sortBy]);

  const handleResetFilters = () => {
    setSearchKeyword('');
    setSelectedSpecialty('ALL');
    setSelectedClinic('ALL');
    setPriceRange('ALL');
    setSortBy('RATING_DESC');
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#22c55e] flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Trang chủ
        </Link>
        <span>/</span>
        <span className="text-[#1a2e24] font-semibold">Tìm kiếm & Lọc bác sĩ</span>
      </div>

      {/* Hero Search & Filter Header */}
      <div className="glass-card rounded-[28px] p-6 md:p-10 mb-8 space-y-6">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22c55e]/15 text-[#16a34a] text-xs font-bold uppercase tracking-wider">
            <Stethoscope className="w-4 h-4" />
            <span>Mạng lưới Y tế Chuyên sâu</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#1a2e24]">
            Tìm kiếm bác sĩ chuyên khoa giỏi
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Khám phá đội ngũ chuyên gia, phó giáo sư, tiến sĩ và bác sĩ chuyên khoa đầu ngành.
          </p>
        </div>

        {/* Central Search Input */}
        <div className="flex items-center gap-2 p-2 bg-white/95 rounded-full border border-gray-300 shadow-sm focus-within:border-[#22c55e] focus-within:ring-2 focus-within:ring-[#22c55e]/20 transition-all max-w-3xl">
          <Search className="w-5 h-5 text-gray-400 ml-3 shrink-0" />
          <input
            type="text"
            placeholder="Nhập tên bác sĩ, chuyên khoa, hoặc bệnh viện (vd: Liệu, Cơ xương khớp, Chợ Rẫy...)"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 bg-transparent border-0 focus:outline-none"
          />
          {searchKeyword && (
            <button
              type="button"
              onClick={() => setSearchKeyword('')}
              className="mr-2 text-xs font-semibold text-gray-400 hover:text-gray-600 px-2 py-1"
            >
              Xóa
            </button>
          )}
        </div>

        {/* Multi-Criteria Filters Bar */}
        <div className="pt-2 border-t border-gray-200/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Specialty Filter */}
          <div className="space-y-1">
            <label className="font-semibold text-gray-600 flex items-center gap-1">
              <Stethoscope className="w-3.5 h-3.5 text-[#22c55e]" /> Chuyên khoa:
            </label>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/90 border border-gray-300 text-gray-800 focus:outline-none focus:border-[#22c55e] transition-all"
            >
              <option value="ALL">Tất cả chuyên khoa</option>
              {specialties.map((spec) => (
                <option key={spec.id} value={spec.slug}>
                  {spec.name}
                </option>
              ))}
            </select>
          </div>

          {/* Clinic Filter */}
          <div className="space-y-1">
            <label className="font-semibold text-gray-600 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-[#22c55e]" /> Cơ sở y tế:
            </label>
            <select
              value={selectedClinic}
              onChange={(e) => setSelectedClinic(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/90 border border-gray-300 text-gray-800 focus:outline-none focus:border-[#22c55e] transition-all"
            >
              <option value="ALL">Tất cả bệnh viện / phòng khám</option>
              {clinics.map((clinic) => (
                <option key={clinic.id} value={clinic.slug}>
                  {clinic.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-1">
            <label className="font-semibold text-gray-600 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-[#22c55e]" /> Khoảng giá khám:
            </label>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-white/90 border border-gray-300 text-gray-800 focus:outline-none focus:border-[#22c55e] transition-all"
            >
              <option value="ALL">Tất cả mức giá</option>
              <option value="UNDER_300">Dưới 300.000 đ</option>
              <option value="300_500">Từ 300.000 đ - 500.000 đ</option>
              <option value="ABOVE_500">Trên 500.000 đ</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="space-y-1">
            <label className="font-semibold text-gray-600">Sắp xếp theo:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-white/90 border border-gray-300 text-gray-800 focus:outline-none focus:border-[#22c55e] transition-all"
            >
              <option value="RATING_DESC">Đánh giá cao nhất ⭐</option>
              <option value="PRICE_ASC">Giá khám: Thấp đến cao</option>
              <option value="PRICE_DESC">Giá khám: Cao đến thấp</option>
              <option value="EXPERIENCE_DESC">Nhiều năm kinh nghiệm nhất</option>
            </select>
          </div>
        </div>

        {/* Reset Filter Action */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="font-semibold text-gray-500">
            Tìm thấy {doctors.length} bác sĩ phù hợp
          </span>
          <button
            type="button"
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-[#22c55e] hover:underline font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Đặt lại bộ lọc
          </button>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="glass-card rounded-[24px] p-6 h-52 animate-pulse bg-white/60 space-y-4">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-2xl" />
                <div className="space-y-2 flex-1">
                  <div className="h-5 w-1/3 bg-gray-200 rounded-md" />
                  <div className="h-4 w-1/4 bg-gray-200 rounded-md" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : doctors.length === 0 ? (
        <div className="glass-card rounded-[28px] p-12 text-center max-w-md mx-auto space-y-3">
          <p className="text-base font-semibold text-gray-800">Không tìm thấy bác sĩ nào phù hợp</p>
          <p className="text-xs text-gray-500">Hãy thử nới lỏng bộ lọc hoặc xóa từ khóa tìm kiếm để xem thêm bác sĩ.</p>
          <button
            onClick={handleResetFilters}
            className="mt-2 px-5 py-2 rounded-full bg-[#22c55e] text-white text-xs font-semibold hover:bg-[#16a34a] transition-colors"
          >
            Xem tất cả bác sĩ
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="glass-card rounded-[24px] p-6 hover:border-[#22c55e]/50 transition-all duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Left: Doctor Profile & Credentials */}
                <div className="lg:col-span-7 flex flex-col sm:flex-row gap-4 items-start">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={doctor.avatar_url || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80'}
                      alt={doctor.full_name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white shadow-xs"
                    />
                    <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-[#22c55e] border-2 border-white" />
                  </div>

                  {/* Info */}
                  <div className="space-y-1.5 flex-1">
                    <span className="text-[10px] font-bold text-[#22c55e] uppercase tracking-wide">
                      {doctor.degree}
                    </span>
                    <h2 className="text-lg font-bold text-[#1a2e24] leading-snug">
                      {doctor.full_name}
                    </h2>
                    {doctor.specialty && (
                      <p className="text-xs font-semibold text-gray-700">
                        Chuyên khoa: <span className="text-[#1a2e24]">{doctor.specialty.name}</span>
                      </p>
                    )}
                    {doctor.clinic && (
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">{doctor.clinic.name}</span>
                      </p>
                    )}
                    <div className="flex items-center gap-4 pt-1 text-xs text-gray-600">
                      <span>{doctor.experience_years} năm kinh nghiệm</span>
                      {doctor.average_rating && (
                        <span className="flex items-center gap-1 font-semibold text-amber-600">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          {doctor.average_rating} ({doctor.total_reviews} đánh giá)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Slots & Booking CTA */}
                <div className="lg:col-span-5 lg:border-l lg:border-gray-200/60 lg:pl-6 space-y-3.5">
                  <div>
                    <span className="text-[11px] font-semibold text-gray-600 flex items-center gap-1 mb-2">
                      <Clock className="w-3.5 h-3.5 text-[#22c55e]" /> Khung giờ khám hôm nay:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(doctor.available_slots || ['08:30', '09:30', '14:00', '15:30']).slice(0, 5).map((slot) => (
                        <Link
                          key={slot}
                          href={`/doctors/${doctor.id}?slot=${slot}`}
                          className="px-2.5 py-1 rounded-lg bg-white/90 hover:bg-[#22c55e] hover:text-white border border-gray-200/80 text-xs font-semibold text-gray-800 transition-colors shadow-2xs"
                        >
                          {slot}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-200/50">
                    <div>
                      <span className="text-[10px] text-gray-500 block">Giá khám niêm yết</span>
                      <span className="text-base font-bold text-[#1a2e24]">
                        {formatCurrency(doctor.consultation_fee)}
                      </span>
                    </div>

                    <Link href={`/doctors/${doctor.id}`}>
                      <Button size="sm" className="h-9 px-4 text-xs font-semibold rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white shadow-xs">
                        Chi tiết & Đặt khám <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DoctorsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="glass-card rounded-2xl p-8 flex items-center gap-3 text-gray-600">
          <div className="w-5 h-5 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold">Đang tải danh sách bác sĩ...</span>
        </div>
      </div>
    }>
      <DoctorsContent />
    </Suspense>
  );
}
