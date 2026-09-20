'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ChevronRight, Activity, ArrowLeft } from 'lucide-react';
import { getAllSpecialties, type SpecialtyWithCount } from '@/lib/services/specialties';

export default function SpecialtiesPage() {
  const [specialties, setSpecialties] = useState<SpecialtyWithCount[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getAllSpecialties();
        setSpecialties(data);
      } catch (err) {
        console.error('Failed to load specialties:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredSpecialties = specialties.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#22c55e] flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Trang chủ
        </Link>
        <span>/</span>
        <span className="text-[#1a2e24] font-semibold">Chuyên khoa khám bệnh</span>
      </div>

      {/* Header Banner */}
      <div className="glass-card rounded-[28px] p-8 md:p-12 mb-10 relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#22c55e]/15 border border-[#22c55e]/25 text-[#16a34a] text-xs font-bold uppercase tracking-wider">
            <Activity className="w-4 h-4" />
            <span>Danh mục Y tế Toàn diện</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#1a2e24]">
            Chuyên khoa Y tế Kỹ thuật cao
          </h1>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-2xl">
            Tìm kiếm bác sĩ giỏi theo đúng tình trạng sức khỏe và chuyên khoa mũi nhọn. Hệ thống kết nối hơn 500+ bác sĩ uy tín tại các bệnh viện hàng đầu.
          </p>

          {/* Search Box */}
          <div className="pt-4 max-w-xl">
            <div className="flex items-center gap-2 p-2 bg-white/95 rounded-full border border-gray-300 shadow-sm focus-within:border-[#22c55e] focus-within:ring-2 focus-within:ring-[#22c55e]/20 transition-all">
              <Search className="w-5 h-5 text-gray-400 ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Nhập tên chuyên khoa hoặc triệu chứng (Cơ xương khớp, Đau đầu, Tim mạch...)"
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
          </div>
        </div>
      </div>

      {/* Specialties Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="glass-card rounded-[24px] p-6 h-64 animate-pulse bg-white/60 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gray-200" />
              <div className="h-6 w-3/4 bg-gray-200 rounded-md" />
              <div className="h-14 w-full bg-gray-200 rounded-md" />
            </div>
          ))}
        </div>
      ) : filteredSpecialties.length === 0 ? (
        <div className="glass-card rounded-[24px] p-12 text-center max-w-md mx-auto space-y-3">
          <p className="text-base font-semibold text-gray-800">Không tìm thấy chuyên khoa phù hợp</p>
          <p className="text-xs text-gray-500">Vui lòng thử lại với từ khóa khác như &quot;Cơ xương khớp&quot;, &quot;Tiêu hóa&quot;, &quot;Tim mạch&quot;.</p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-2 px-5 py-2 rounded-full bg-[#22c55e] text-white text-xs font-semibold hover:bg-[#16a34a] transition-colors"
          >
            Xem tất cả chuyên khoa
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpecialties.map((specialty) => (
            <Link
              key={specialty.id}
              href={`/specialties/${specialty.slug}`}
              className="group block"
            >
              <div className="glass-card rounded-[24px] overflow-hidden p-6 flex flex-col justify-between h-full border border-white/80 hover:border-[#22c55e]/50 transition-all duration-300">
                <div className="space-y-4">
                  {/* Image banner or Icon */}
                  {specialty.image_url ? (
                    <div className="w-full h-40 rounded-[18px] overflow-hidden relative shadow-xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={specialty.image_url}
                        alt={specialty.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-white/60 text-[11px] font-bold text-[#1a2e24]">
                        {specialty.doctor_count} Bác sĩ
                      </div>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#22c55e] flex items-center justify-center font-bold text-xl border border-emerald-100">
                      {specialty.name.charAt(0)}
                    </div>
                  )}

                  <div>
                    <h2 className="text-lg font-bold text-[#1a2e24] group-hover:text-[#22c55e] transition-colors">
                      {specialty.name}
                    </h2>
                    <p className="text-xs text-gray-600 mt-1.5 line-clamp-3 leading-relaxed">
                      {specialty.description || 'Chuyên khoa cung cấp dịch vụ khám và điều trị chuyên sâu bởi các chuyên gia y tế hàng đầu.'}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-200/60 flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-500">Khám đúng chuyên gia</span>
                  <span className="font-bold text-[#22c55e] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Xem bác sĩ <ChevronRight className="w-3.5 h-3.5" />
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
