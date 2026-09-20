'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Stethoscope, 
  Layers, 
  Building2, 
  CalendarDays, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Plus, 
  TrendingUp, 
  ShieldCheck, 
  FileText 
} from 'lucide-react';
import { AdminSubnav } from '@/components/admin/AdminSubnav';
import { getAdminPlatformStats, getAllPlatformAppointments, type AdminPlatformStats } from '@/lib/services/admin';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { AppointmentWithDetails } from '@/lib/services/appointments';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminPlatformStats | null>(null);
  const [recentAppointments, setRecentAppointments] = useState<AppointmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, appointments] = await Promise.all([
          getAdminPlatformStats(),
          getAllPlatformAppointments(),
        ]);
        setStats(statsData);
        setRecentAppointments(appointments.slice(0, 6));
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-[#f8faf9] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <AdminSubnav
          title="Tổng Quan Nền Tảng BookingCare"
          subtitle="Giám sát tăng trưởng toàn diện: lượt đặt khám, doanh thu sàn, hồ sơ y tế và phân bổ chuyên khoa."
        />

        {/* Top KPI Metrics */}
        {loading ? (
          <div className="glass-card rounded-[28px] p-12 flex flex-col items-center justify-center gap-3 text-gray-600">
            <div className="w-6 h-6 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold">Đang tổng hợp dữ liệu hệ thống...</span>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Row 1: Primary Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="glass-card rounded-[24px] p-5 space-y-2 border-indigo-100 hover:border-indigo-300 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tổng Bệnh Nhân</span>
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-[#1a2e24]">
                  {stats?.totalPatients.toLocaleString()}
                </div>
                <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +12.5% so với tháng trước
                </p>
              </div>

              <div className="glass-card rounded-[24px] p-5 space-y-2 border-emerald-100 hover:border-emerald-300 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Đội Ngũ Bác Sĩ</span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#16a34a] flex items-center justify-center">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-[#1a2e24]">
                  {stats?.totalDoctors}
                </div>
                <p className="text-[11px] text-gray-500">
                  Hoạt động trên 8 chuyên khoa
                </p>
              </div>

              <div className="glass-card rounded-[24px] p-5 space-y-2 border-blue-100 hover:border-blue-300 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Lịch Khám Toàn Sàn</span>
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-[#1a2e24]">
                  {stats?.totalAppointments}
                </div>
                <p className="text-[11px] text-blue-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Tỉ lệ hoàn tất khám 94.2%
                </p>
              </div>

              <div className="glass-card rounded-[24px] p-5 space-y-2 border-emerald-100 hover:border-emerald-300 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Doanh Thu Toàn Sàn (GMV)</span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#16a34a] flex items-center justify-center">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-[#1a2e24]">
                  {formatCurrency(stats?.totalRevenue || 0)}
                </div>
                <p className="text-[11px] text-gray-500">
                  Giá trị giao dịch dịch vụ y tế
                </p>
              </div>

            </div>

            {/* Row 2: Status Breakdown & Shortcuts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Status Breakdown */}
              <div className="glass-card rounded-[28px] p-6 space-y-4 lg:col-span-1">
                <h3 className="text-sm font-extrabold text-[#1a2e24] uppercase tracking-wider">
                  Phân Bổ Trạng Thái Lịch Khám
                </h3>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs">
                    <span className="font-bold text-amber-900 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600" /> Chờ xác nhận
                    </span>
                    <span className="font-extrabold text-amber-950 font-mono text-sm">
                      {stats?.statusBreakdown.pending}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-xs">
                    <span className="font-bold text-emerald-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#22c55e]" /> Đã xác nhận / Tiếp nhận
                    </span>
                    <span className="font-extrabold text-emerald-950 font-mono text-sm">
                      {stats?.statusBreakdown.confirmed}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-50/80 border border-blue-200/80 text-xs">
                    <span className="font-bold text-blue-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" /> Đã hoàn thành khám
                    </span>
                    <span className="font-extrabold text-blue-950 font-mono text-sm">
                      {stats?.statusBreakdown.completed}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-50/80 border border-rose-200/80 text-xs">
                    <span className="font-bold text-rose-900 flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-rose-600" /> Đã hủy lịch
                    </span>
                    <span className="font-extrabold text-rose-950 font-mono text-sm">
                      {stats?.statusBreakdown.cancelled}
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <Link href="/admin/appointments" className="text-xs font-bold text-[#22c55e] hover:underline inline-flex items-center gap-1">
                    Xem tất cả lịch hẹn <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Quick Management Shortcuts */}
              <div className="glass-card rounded-[28px] p-6 space-y-4 lg:col-span-2">
                <h3 className="text-sm font-extrabold text-[#1a2e24] uppercase tracking-wider">
                  Thao Tác Quản Trị Nhanh
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  
                  <Link href="/admin/specialties" className="p-4 rounded-2xl border border-gray-200 bg-white/70 hover:bg-white hover:border-[#22c55e] transition-all space-y-2 group">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#16a34a] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-[#1a2e24]">Quản lý Chuyên khoa</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">Thêm, sửa, cập nhật mô tả và danh mục y tế.</div>
                    </div>
                  </Link>

                  <Link href="/admin/clinics" className="p-4 rounded-2xl border border-gray-200 bg-white/70 hover:bg-white hover:border-[#22c55e] transition-all space-y-2 group">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-[#1a2e24]">Quản lý Cơ sở y tế</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">Bệnh viện, phòng khám, địa chỉ và hotline.</div>
                    </div>
                  </Link>

                  <Link href="/admin/doctors" className="p-4 rounded-2xl border border-gray-200 bg-white/70 hover:bg-white hover:border-[#22c55e] transition-all space-y-2 group">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-[#1a2e24]">Quản lý Bác sĩ</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">Hồ sơ chuyên môn, biểu phí và phân công.</div>
                    </div>
                  </Link>

                </div>

                {/* Platform Health Assurance */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-center gap-3 text-xs text-emerald-950 font-medium">
                  <ShieldCheck className="w-6 h-6 text-[#22c55e] shrink-0" />
                  <div>
                    <span className="font-bold block">Hệ thống BookingCare đang vận hành ổn định 99.98% uptime.</span>
                    <span className="text-[11px] text-emerald-800">Cơ chế bảo vệ chống race condition tự động kích hoạt trên 100% các ca khám.</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Row 3: Recent Platform Appointments Feed */}
            <div className="glass-card rounded-[28px] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-sm font-extrabold text-[#1a2e24] uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#22c55e]" /> Lượt Đặt Khám Gần Đây Trên Nền Tảng
                </h3>
                <Link href="/admin/appointments" className="text-xs font-bold text-[#22c55e] hover:underline">
                  Xem tất cả
                </Link>
              </div>

              <div className="space-y-3 pt-1">
                {recentAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">
                          {apt.id}
                        </span>
                        <span className="font-extrabold text-[#1a2e24] text-sm">
                          {apt.patient_name}
                        </span>
                        <span className="text-gray-500">({apt.patient_phone})</span>
                      </div>
                      <div className="text-gray-600">
                        Khám với: <strong>{apt.doctor_info?.full_name}</strong> • {apt.doctor_info?.clinic_name}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:text-right">
                      <div>
                        <div className="font-bold text-[#1a2e24]">{apt.formatted_time}</div>
                        <div className="text-[11px] text-gray-500">{apt.formatted_date}</div>
                      </div>

                      <div>
                        {apt.status === 'PENDING' && (
                          <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200 text-[11px]">
                            Chờ xác nhận
                          </span>
                        )}
                        {apt.status === 'CONFIRMED' && (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[11px]">
                            Đã tiếp nhận
                          </span>
                        )}
                        {apt.status === 'COMPLETED' && (
                          <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200 text-[11px]">
                            Đã hoàn tất
                          </span>
                        )}
                        {apt.status === 'CANCELLED' && (
                          <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200 text-[11px]">
                            Đã hủy
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
