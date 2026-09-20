'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CalendarDays, 
  Search, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Clock3, 
  User, 
  Stethoscope, 
  Building2, 
  DollarSign, 
  FileText 
} from 'lucide-react';
import { AdminSubnav } from '@/components/admin/AdminSubnav';
import { getAllPlatformAppointments } from '@/lib/services/admin';
import type { AppointmentWithDetails } from '@/lib/services/appointments';
import { formatCurrency } from '@/lib/utils';
import type { AppointmentStatus } from '@/types/database.types';

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | AppointmentStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getAllPlatformAppointments();
        setAppointments(data);
      } catch (err) {
        console.error('Failed to load all appointments for admin:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredAppointments = appointments.filter((apt) => {
    if (activeTab !== 'ALL' && apt.status !== activeTab) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchPatient = apt.patient_name.toLowerCase().includes(q);
      const matchPhone = apt.patient_phone.includes(q);
      const matchCode = apt.id.toLowerCase().includes(q);
      const matchDoctor = apt.doctor_info?.full_name.toLowerCase().includes(q);
      const matchClinic = apt.doctor_info?.clinic_name.toLowerCase().includes(q);
      return matchPatient || matchPhone || matchCode || matchDoctor || matchClinic;
    }
    return true;
  });

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-[#f8faf9] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <AdminSubnav
          title="Giám Sát Lịch Hẹn Toàn Nền Tảng"
          subtitle="Theo dõi toàn bộ các lượt đặt khám theo thời gian thực trên toàn bộ hệ thống bác sĩ và bệnh viện."
        />

        {/* Toolbar */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('ALL')}
                className={`py-2 px-3.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'ALL'
                    ? 'bg-[#1a2e24] text-white shadow-xs'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                }`}
              >
                Tất cả ({appointments.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('PENDING')}
                className={`py-2 px-3.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'PENDING'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                }`}
              >
                Chờ xác nhận ({appointments.filter((a) => a.status === 'PENDING').length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('CONFIRMED')}
                className={`py-2 px-3.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'CONFIRMED'
                    ? 'bg-[#22c55e] text-white shadow-xs'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                }`}
              >
                Đã tiếp nhận ({appointments.filter((a) => a.status === 'CONFIRMED').length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('COMPLETED')}
                className={`py-2 px-3.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'COMPLETED'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                }`}
              >
                Đã hoàn tất ({appointments.filter((a) => a.status === 'COMPLETED').length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('CANCELLED')}
                className={`py-2 px-3.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'CANCELLED'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                }`}
              >
                Đã hủy ({appointments.filter((a) => a.status === 'CANCELLED').length})
              </button>
            </div>

          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo mã khám, tên người bệnh, số điện thoại, bác sĩ hoặc bệnh viện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#22c55e] outline-hidden bg-white/90"
            />
          </div>
        </div>

        {/* Appointments Feed */}
        {loading ? (
          <div className="glass-card rounded-[28px] p-12 flex flex-col items-center justify-center gap-3 text-gray-600">
            <div className="w-6 h-6 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold">Đang tải danh sách lịch khám toàn sàn...</span>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="glass-card rounded-[32px] p-12 text-center space-y-4 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-[#1a2e24]">Không tìm thấy lịch hẹn phù hợp</h3>
            <p className="text-xs text-gray-600">Không có bản ghi nào khớp với điều kiện lọc hiện tại.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((apt) => (
              <div
                key={apt.id}
                className="glass-card rounded-[24px] p-5 space-y-3.5 hover:border-[#22c55e]/40 transition-all text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-md">
                      {apt.id}
                    </span>
                    <span className="font-semibold text-gray-700">
                      Ngày: {apt.formatted_date} • {apt.formatted_time}
                    </span>
                  </div>

                  <div>
                    {apt.status === 'PENDING' && (
                      <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
                        Chờ xác nhận
                      </span>
                    )}
                    {apt.status === 'CONFIRMED' && (
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                        Đã tiếp nhận
                      </span>
                    )}
                    {apt.status === 'COMPLETED' && (
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                        Đã khám xong
                      </span>
                    )}
                    {apt.status === 'CANCELLED' && (
                      <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200">
                        Đã hủy
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider block">Người khám</span>
                    <div className="font-bold text-[#1a2e24] text-sm">{apt.patient_name}</div>
                    <div className="text-gray-600">SĐT: {apt.patient_phone}</div>
                    <div className="text-gray-500 text-[11px]">Hình thức: {apt.booking_for === 'SELF' ? 'Bản thân' : 'Người thân'}</div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider block">Bác sĩ phụ trách</span>
                    <div className="font-bold text-[#1a2e24] text-sm">{apt.doctor_info?.full_name}</div>
                    <div className="text-gray-600">{apt.doctor_info?.clinic_name}</div>
                    <div className="text-emerald-700 font-semibold">{formatCurrency(apt.doctor_info?.consultation_fee || 350000)}</div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider block">Lý do & Chẩn đoán</span>
                    <p className="text-gray-700 line-clamp-2"><strong>Triệu chứng:</strong> {apt.reason}</p>
                    {apt.diagnosis && (
                      <p className="text-blue-900 line-clamp-1 font-semibold">
                        <strong>Chẩn đoán:</strong> {apt.diagnosis}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
