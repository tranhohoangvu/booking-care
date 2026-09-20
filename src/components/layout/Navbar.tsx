'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { 
  HeartHandshake, 
  Calendar, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck, 
  Stethoscope, 
  PhoneCall
} from 'lucide-react';
import type { UserRole } from '@/types/database.types';

interface AuthUserState {
  id: string;
  email: string;
  role: UserRole;
  fullName?: string;
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUserState | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function loadUser() {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', authUser.id)
            .single();

          let fullName = authUser.user_metadata?.full_name || authUser.email?.split('@')[0];

          if (userData?.role === 'DOCTOR') {
            const { data: docData } = await supabase
              .from('doctor_profiles')
              .select('full_name')
              .eq('user_id', authUser.id)
              .single();
            if (docData?.full_name) fullName = docData.full_name;
          } else if (userData?.role === 'PATIENT') {
            const { data: patientData } = await supabase
              .from('patient_profiles')
              .select('full_name')
              .eq('user_id', authUser.id)
              .single();
            if (patientData?.full_name) fullName = patientData.full_name;
          }

          setUser({
            id: authUser.id,
            email: authUser.email || '',
            role: (userData?.role as UserRole) || 'PATIENT',
            fullName,
          });
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error loading user session:', err);
      } finally {
        setLoading(false);
      }
    }

    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsDropdownOpen(false);
    router.push('/');
    router.refresh();
  };

  const navLinks = [
    { href: '/specialties', label: 'Chuyên khoa' },
    { href: '/clinics', label: 'Cơ sở y tế' },
    { href: '/doctors', label: 'Bác sĩ' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/60 bg-[#eef1f0]/80 backdrop-blur-md supports-[backdrop-filter]:bg-[#eef1f0]/70 transition-all">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* BookingCare Emerald Medical Icon */}
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#22c55e] to-[#16a34a] text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
              <svg className="h-5 w-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                <path d="M12 7v6" />
                <path d="M9 10h6" />
              </svg>
            </div>
            {/* Brand Name */}
            <div className="flex flex-col">
              <span className="text-[18px] font-extrabold tracking-tight text-[#1a2e24] leading-none">
                Booking<span className="text-[#22c55e]">Care</span>
              </span>
              <span className="text-[8.5px] font-bold tracking-[0.14em] uppercase text-gray-500 mt-1">
                Chăm sóc y tế số
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-6 text-[14px]">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-medium transition-colors ${
                    isActive
                      ? 'text-[#22c55e] font-semibold'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Support Hotline & Auth Controls */}
        <div className="hidden md:flex items-center gap-4 text-[14px]">
          <div className="flex items-center gap-1.5 text-xs text-gray-700 border-r border-gray-300 pr-4">
            <PhoneCall className="w-3.5 h-3.5 text-[#22c55e]" strokeWidth={2} />
            <span className="text-gray-500">Hỗ trợ:</span>
            <span className="font-semibold text-gray-900">1900 2805</span>
          </div>

          {loading ? (
            <div className="h-8 w-24 bg-gray-200/60 animate-pulse rounded-full" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 py-1 px-3 rounded-full border border-gray-300 bg-white/80 hover:bg-white transition-all text-left"
              >
                <div className="h-6 w-6 rounded-full bg-[#22c55e] text-white flex items-center justify-center font-bold text-[11px]">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="max-w-[110px]">
                  <p className="text-xs font-semibold text-gray-900 truncate leading-none">
                    {user.fullName || user.email}
                  </p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-[12px] border border-[oklch(0.86_0.014_90)] bg-white py-1.5 shadow-[0px_12px_32px_-16px_oklch(0.2_0.012_250_/_0.14)] animate-in fade-in-50 zoom-in-95">
                  <div className="px-3.5 py-2 border-b border-[oklch(0.86_0.014_90)]">
                    <p className="text-xs font-bold text-[oklch(0.2_0.012_250)] truncate">{user.fullName}</p>
                    <p className="text-[11px] text-[oklch(0.52_0.014_90)] truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-[oklch(0.95_0.04_240)] text-[oklch(0.48_0.19_240)]">
                      {user.role === 'ADMIN' ? 'Quản trị viên' : user.role === 'DOCTOR' ? 'Bác sĩ' : 'Bệnh nhân'}
                    </span>
                  </div>

                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-xs text-[oklch(0.28_0.014_250)] hover:bg-[oklch(0.95_0.04_240)] hover:text-[oklch(0.48_0.19_240)]"
                    >
                      <ShieldCheck className="w-4 h-4 text-[oklch(0.54_0.19_240)]" strokeWidth={1.75} />
                      Bảng điều khiển Admin
                    </Link>
                  )}

                  {user.role === 'DOCTOR' && (
                    <Link
                      href="/doctor/dashboard"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-xs text-[oklch(0.28_0.014_250)] hover:bg-[oklch(0.95_0.04_240)] hover:text-[oklch(0.48_0.19_240)]"
                    >
                      <Stethoscope className="w-4 h-4 text-[oklch(0.54_0.19_240)]" strokeWidth={1.75} />
                      Bàn làm việc Bác sĩ
                    </Link>
                  )}

                  <Link
                    href="/appointments"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs text-[oklch(0.28_0.014_250)] hover:bg-[oklch(0.95_0.04_240)] hover:text-[oklch(0.48_0.19_240)]"
                  >
                    <Calendar className="w-4 h-4 text-[oklch(0.52_0.014_90)]" strokeWidth={1.75} />
                    Lịch hẹn đã đặt
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs text-[oklch(0.28_0.014_250)] hover:bg-[oklch(0.95_0.04_240)] hover:text-[oklch(0.48_0.19_240)]"
                  >
                    <UserIcon className="w-4 h-4 text-[oklch(0.52_0.014_90)]" strokeWidth={1.75} />
                    Hồ sơ bệnh nhân
                  </Link>

                  <div className="my-1 border-t border-[oklch(0.86_0.014_90)]" />

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" strokeWidth={1.75} />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-gray-700 hover:text-gray-900 text-[14px] font-normal transition-colors px-2 py-1.5"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 border border-gray-400 rounded-full text-gray-900 hover:bg-white/80 text-[14px] font-normal transition-all"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 text-[oklch(0.28_0.014_250)] hover:text-[oklch(0.2_0.012_250)] rounded-[12px]"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[oklch(0.86_0.014_90)] bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-[12px] text-[oklch(0.28_0.014_250)] hover:bg-[oklch(0.95_0.04_240)] hover:text-[oklch(0.48_0.19_240)]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-[oklch(0.86_0.014_90)]">
            {user ? (
              <div className="space-y-2">
                <div className="px-3 py-1">
                  <p className="text-xs font-bold text-[oklch(0.2_0.012_250)]">{user.fullName}</p>
                  <p className="text-[11px] text-[oklch(0.52_0.014_90)]">{user.email}</p>
                </div>
                <Link
                  href="/appointments"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-[oklch(0.28_0.014_250)] rounded-[12px] hover:bg-[oklch(0.94_0.016_95)]"
                >
                  <Calendar className="w-4 h-4 text-[oklch(0.52_0.014_90)]" strokeWidth={1.75} /> Lịch hẹn đã đặt
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-rose-600 rounded-[12px] hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4" strokeWidth={1.75} /> Đăng xuất
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full h-9 text-xs">
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full h-9 text-xs">Đăng ký tài khoản</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
