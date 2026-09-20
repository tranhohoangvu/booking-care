'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Clock, 
  Building2, 
  Star, 
  ShieldCheck, 
  ChevronRight, 
  Activity 
} from 'lucide-react';
import { getClinicBySlug, type ClinicWithStats } from '@/lib/services/clinics';
import type { DoctorProfile } from '@/types/database.types';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function ClinicDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [clinic, setClinic] = useState<ClinicWithStats | null>(null);
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      try {
        const { clinic: c, doctors: docs } = await getClinicBySlug(slug);
        setClinic(c);
        setDoctors(docs);
      } catch (err) {
        console.error('Error loading clinic details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 max-w-7xl mx-auto flex items-center justify-center">
        <div className="glass-card rounded-2xl p-8 flex items-center gap-3 text-gray-600">
          <div className="w-5 h-5 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold">Đang tải thông tin cơ sở y tế...</span>
        </div>
      </div>
    );
  }

  if (!clinic) {
    return (
      <div className="min-h-screen py-16 px-4 max-w-lg mx-auto text-center">
        <div className="glass-card rounded-[28px] p-10 space-y-4">
          <h2 className="text-xl font-bold text-[#1a2e24]">Không tìm thấy cơ sở y tế</h2>
          <p className="text-xs text-gray-600">Cơ sở y tế bạn tìm kiếm không tồn tại hoặc đã ngừng tiếp nhận trực tuyến.</p>
          <Link href="/clinics">
            <Button className="rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs px-5">
              Quay lại danh sách cơ sở y tế
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#22c55e] flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Trang chủ
        </Link>
        <span>/</span>
        <Link href="/clinics" className="hover:text-[#22c55e] transition-colors">
          Cơ sở y tế
        </Link>
        <span>/</span>
        <span className="text-[#1a2e24] font-semibold">{clinic.name}</span>
      </div>

      {/* Clinic Hero Banner */}
      <div className="glass-card rounded-[28px] p-8 md:p-12 mb-12 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#22c55e]/15 border border-[#22c55e]/25 text-[#16a34a] text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              <span>Cơ sở y tế đạt chuẩn kiểm định</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#1a2e24]">
              {clinic.name}
            </h1>

            <div className="space-y-2 pt-1 text-sm text-gray-700">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" />
                <span><strong>Địa chỉ:</strong> {clinic.address}</span>
              </p>
              {clinic.phone && (
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#22c55e] shrink-0" />
                  <span><strong>Hotline tiếp nhận:</strong> {clinic.phone}</span>
                </p>
              )}
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#22c55e] shrink-0" />
                <span><strong>Giờ làm việc:</strong> Thứ 2 - Thứ 7 (07:30 - 16:30)</span>
              </p>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-2xl pt-2">
              {clinic.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold text-gray-700">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#22c55e]" />
                <span>Xác nhận lịch hẹn tự động</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#22c55e]" />
                <span>{clinic.doctor_count} Bác sĩ đang công tác</span>
              </div>
            </div>
          </div>

          {clinic.image_url && (
            <div className="lg:col-span-4">
              <div className="w-full h-64 rounded-[22px] overflow-hidden shadow-sm border border-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={clinic.image_url}
                  alt={clinic.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Doctors at this Clinic */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200/60 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-[#1a2e24]">Bác sĩ đang tiếp nhận khám</h2>
            <p className="text-xs text-gray-600 mt-0.5">Chọn bác sĩ và thời gian khám phù hợp để được tiếp đón ưu tiên</p>
          </div>
          <span className="text-xs font-semibold text-gray-500">
            {doctors.length} Bác sĩ
          </span>
        </div>

        {doctors.length === 0 ? (
          <div className="glass-card rounded-[24px] p-12 text-center text-gray-600 space-y-2">
            <p className="font-semibold text-sm">Chưa có danh sách bác sĩ trực tuyến cho cơ sở này.</p>
            <p className="text-xs text-gray-500">Vui lòng quay lại sau hoặc liên hệ tổng đài bệnh viện để biết thêm thông tin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="glass-card rounded-[24px] p-6 flex flex-col justify-between hover:border-[#22c55e]/50 transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Doctor Profile Header */}
                  <div className="flex gap-4 items-start">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={doctor.avatar_url || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80'}
                      alt={doctor.full_name}
                      className="w-20 h-20 rounded-[18px] object-cover border border-white shadow-xs shrink-0"
                    />
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#22c55e] uppercase tracking-wide">
                        {doctor.degree}
                      </span>
                      <h3 className="font-bold text-base text-[#1a2e24] leading-tight">
                        {doctor.full_name}
                      </h3>
                      {doctor.specialty && (
                        <p className="text-xs text-gray-600 font-medium">
                          Chuyên khoa: {doctor.specialty.name}
                        </p>
                      )}
                      <div className="flex items-center gap-3 pt-0.5 text-xs text-gray-500">
                        <span>{doctor.experience_years} năm kinh nghiệm</span>
                        {doctor.average_rating && (
                          <span className="flex items-center gap-1 font-semibold text-amber-600">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            {doctor.average_rating} ({doctor.total_reviews})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Doctor Bio Snippet */}
                  {doctor.bio && (
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed bg-white/60 p-3 rounded-xl border border-gray-200/50">
                      {doctor.bio}
                    </p>
                  )}

                  {/* Sample Time Slots */}
                  <div className="space-y-1.5 pt-2 border-t border-gray-200/50">
                    <span className="text-[11px] font-semibold text-gray-600 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#22c55e]" /> Khung giờ khám hôm nay:
                    </span>
                    <div className="flex gap-2">
                      {['08:30', '09:30', '13:30', '15:00'].map((slot) => (
                        <span
                          key={slot}
                          className="px-2.5 py-1 rounded-lg bg-white/80 border border-gray-200 text-xs font-semibold text-gray-800 hover:border-[#22c55e] cursor-pointer transition-colors"
                        >
                          {slot}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Consultation Fee & Booking CTA */}
                <div className="pt-4 mt-4 border-t border-gray-200/60 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-gray-500 block">Giá khám niêm yết</span>
                    <span className="text-base font-bold text-[#1a2e24]">
                      {formatCurrency(doctor.consultation_fee)}
                    </span>
                  </div>

                  <Link href={`/doctors?clinic=${slug}`}>
                    <Button size="sm" className="h-9 px-4 text-xs font-semibold rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white shadow-xs">
                      Đặt lịch khám <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
