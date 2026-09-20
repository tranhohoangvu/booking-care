'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Building2, MapPin, Phone, ChevronRight, ArrowLeft } from 'lucide-react';
import { getAllClinics, type ClinicWithStats } from '@/lib/services/clinics';

export default function ClinicsPage() {
  const [clinics, setClinics] = useState<ClinicWithStats[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getAllClinics();
        setClinics(data);
      } catch (err) {
        console.error('Failed to load clinics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredClinics = clinics.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCity === 'HCM') {
      return c.address.toLowerCase().includes('hồ chí minh') || c.address.toLowerCase().includes('quận');
    }
    if (selectedCity === 'HN') {
      return c.address.toLowerCase().includes('hà nội') || c.address.toLowerCase().includes('ba đình');
    }

    return true;
  });

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#22c55e] flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Trang chủ
        </Link>
        <span>/</span>
        <span className="text-[#1a2e24] font-semibold">Cơ sở y tế & Bệnh viện</span>
      </div>

      {/* Header Banner */}
      <div className="glass-card rounded-[28px] p-8 md:p-12 mb-10 relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#22c55e]/15 border border-[#22c55e]/25 text-[#16a34a] text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Mạng lưới Cơ sở Y tế Toàn quốc</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#1a2e24]">
            Bệnh viện & Phòng khám Uy tín
          </h1>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-2xl">
            BookingCare liên kết trực tiếp với các bệnh viện tuyến trung ương và phòng khám quốc tế chuẩn mực, bảo đảm quy trình tiếp đón chu đáo và thông suốt.
          </p>

          {/* Search Box & Location Pills */}
          <div className="pt-4 space-y-3 max-w-xl">
            <div className="flex items-center gap-2 p-2 bg-white/95 rounded-full border border-gray-300 shadow-sm focus-within:border-[#22c55e] focus-within:ring-2 focus-within:ring-[#22c55e]/20 transition-all">
              <Search className="w-5 h-5 text-gray-400 ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Tìm theo tên bệnh viện, phòng khám hoặc địa chỉ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-2 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 bg-transparent border-0 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mr-2 text-xs font-semibold text-gray-400 hover:text-gray-600 px-2 py-1"
                >
                  Xóa
                </button>
              )}
            </div>

            {/* City Filters */}
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="text-gray-500">Khu vực:</span>
              <button
                type="button"
                onClick={() => setSelectedCity('ALL')}
                className={`px-3 py-1 rounded-full transition-all ${
                  selectedCity === 'ALL'
                    ? 'bg-[#22c55e] text-white shadow-xs'
                    : 'bg-white/80 text-gray-700 hover:bg-white border border-gray-200'
                }`}
              >
                Tất cả
              </button>
              <button
                type="button"
                onClick={() => setSelectedCity('HCM')}
                className={`px-3 py-1 rounded-full transition-all ${
                  selectedCity === 'HCM'
                    ? 'bg-[#22c55e] text-white shadow-xs'
                    : 'bg-white/80 text-gray-700 hover:bg-white border border-gray-200'
                }`}
              >
                TP. Hồ Chí Minh
              </button>
              <button
                type="button"
                onClick={() => setSelectedCity('HN')}
                className={`px-3 py-1 rounded-full transition-all ${
                  selectedCity === 'HN'
                    ? 'bg-[#22c55e] text-white shadow-xs'
                    : 'bg-white/80 text-gray-700 hover:bg-white border border-gray-200'
                }`}
              >
                Hà Nội
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Clinics Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="glass-card rounded-[24px] p-6 h-72 animate-pulse bg-white/60 space-y-4">
              <div className="h-40 w-full bg-gray-200 rounded-xl" />
              <div className="h-6 w-3/4 bg-gray-200 rounded-md" />
              <div className="h-4 w-1/2 bg-gray-200 rounded-md" />
            </div>
          ))}
        </div>
      ) : filteredClinics.length === 0 ? (
        <div className="glass-card rounded-[24px] p-12 text-center max-w-md mx-auto space-y-3">
          <p className="text-base font-semibold text-gray-800">Không tìm thấy cơ sở y tế phù hợp</p>
          <p className="text-xs text-gray-500">Vui lòng thử lại với tên cơ sở hoặc khu vực khác.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCity('ALL');
            }}
            className="mt-2 px-5 py-2 rounded-full bg-[#22c55e] text-white text-xs font-semibold hover:bg-[#16a34a] transition-colors"
          >
            Hiển thị tất cả cơ sở y tế
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredClinics.map((clinic) => (
            <Link
              key={clinic.id}
              href={`/clinics/${clinic.slug}`}
              className="group block"
            >
              <div className="glass-card rounded-[24px] overflow-hidden p-6 flex flex-col justify-between h-full border border-white/80 hover:border-[#22c55e]/50 transition-all duration-300">
                <div className="space-y-4">
                  {/* Clinic Photo */}
                  <div className="w-full h-48 rounded-[20px] overflow-hidden relative shadow-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={clinic.image_url || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80'}
                      alt={clinic.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-white/60 text-[11px] font-bold text-[#1a2e24]">
                      {clinic.doctor_count} Bác sĩ
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-[#1a2e24] group-hover:text-[#22c55e] transition-colors">
                      {clinic.name}
                    </h2>
                    <p className="text-xs text-gray-600 flex items-start gap-1.5 mt-2">
                      <MapPin className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" />
                      <span>{clinic.address}</span>
                    </p>
                    {clinic.phone && (
                      <p className="text-xs text-gray-600 flex items-center gap-1.5 mt-1">
                        <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>Hotline tiếp nhận: {clinic.phone}</span>
                      </p>
                    )}
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                      {clinic.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-200/60 flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-500">{clinic.specialty_count} Chuyên khoa tiếp nhận</span>
                  <span className="font-bold text-[#22c55e] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Xem chi tiết cơ sở <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
