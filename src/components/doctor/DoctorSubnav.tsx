'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, UserCheck, CalendarCheck2, Clock, Activity } from 'lucide-react';

interface DoctorSubnavProps {
  title?: string;
  subtitle?: string;
}

export function DoctorSubnav({ title, subtitle }: DoctorSubnavProps) {
  const pathname = usePathname();

  const links = [
    {
      href: '/doctor/schedule',
      label: 'Quản lý lịch khám',
      icon: Calendar,
      active: pathname === '/doctor/schedule',
    },
    {
      href: '/doctor/profile',
      label: 'Hồ sơ chuyên môn',
      icon: UserCheck,
      active: pathname === '/doctor/profile',
    },
    {
      href: '/doctor/appointments',
      label: 'Lịch hẹn bệnh nhân',
      icon: CalendarCheck2,
      active: pathname === '/doctor/appointments',
    },
  ];

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] text-xs font-bold mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Cổng Bác sĩ Chuyên khoa</span>
          </div>
          {title && (
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1a2e24]">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200/80 pb-3 overflow-x-auto no-scrollbar">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                link.active
                  ? 'bg-[#1a2e24] text-white shadow-sm'
                  : 'bg-white/80 text-gray-600 hover:text-gray-900 hover:bg-white border border-gray-200/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${link.active ? 'text-[#22c55e]' : 'text-gray-400'}`} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
