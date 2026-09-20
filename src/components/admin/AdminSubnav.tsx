'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Layers, 
  Building2, 
  Stethoscope, 
  CalendarDays, 
  ShieldCheck, 
  Activity 
} from 'lucide-react';

interface AdminSubnavProps {
  title?: string;
  subtitle?: string;
}

export function AdminSubnav({ title, subtitle }: AdminSubnavProps) {
  const pathname = usePathname();

  const links = [
    {
      href: '/admin',
      label: 'Tổng quan hệ thống',
      icon: BarChart3,
      active: pathname === '/admin',
    },
    {
      href: '/admin/specialties',
      label: 'Quản lý Chuyên khoa',
      icon: Layers,
      active: pathname === '/admin/specialties',
    },
    {
      href: '/admin/clinics',
      label: 'Quản lý Cơ sở y tế',
      icon: Building2,
      active: pathname === '/admin/clinics',
    },
    {
      href: '/admin/doctors',
      label: 'Quản lý Bác sĩ',
      icon: Stethoscope,
      active: pathname === '/admin/doctors',
    },
    {
      href: '/admin/appointments',
      label: 'Giám sát Lịch hẹn',
      icon: CalendarDays,
      active: pathname === '/admin/appointments',
    },
  ];

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Trung Tâm Quản Trị Hệ Thống (Admin Control Panel)</span>
          </div>
          {title && (
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1a2e24]">
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
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                link.active
                  ? 'bg-[#1a2e24] text-white shadow-sm'
                  : 'bg-white/80 hover:bg-white text-gray-700 hover:text-gray-900 border border-gray-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${link.active ? 'text-[#22c55e]' : 'text-gray-500'}`} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
