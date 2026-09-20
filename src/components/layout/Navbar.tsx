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
  Building2,
  PhoneCall,
  Search
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
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/85 transition-all">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm group-hover:bg-sky-700 transition-colors">
              <HeartHandshake className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 leading-none">
                Booking<span className="text-sky-600">Care</span>
              </span>
              <span className="text-[9px] font-semibold tracking-wider uppercase text-slate-500 mt-0.5">
                Chăm sóc y tế số
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links - Single Line Strict */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'text-sky-700 bg-sky-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Support Hotline & Auth Controls */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 border-r border-slate-200 pr-4">
            <PhoneCall className="w-3.5 h-3.5 text-sky-600" strokeWidth={1.75} />
            <span className="text-slate-500">Hỗ trợ:</span>
            <span className="font-semibold text-slate-800">1900 2805</span>
          </div>

          {loading ? (
            <div className="h-8 w-24 bg-slate-100 animate-pulse rounded-lg" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 py-1 px-2 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left"
              >
                <div className="h-7 w-7 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-[11px]">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="max-w-[110px]">
                  <p className="text-xs font-semibold text-slate-800 truncate leading-none">
                    {user.fullName || user.email}
                  </p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200/90 bg-white py-1.5 shadow-lg shadow-slate-200/50 animate-in fade-in-50 zoom-in-95">
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800 truncate">{user.fullName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-sky-50 text-sky-700">
                      {user.role === 'ADMIN' ? 'Quản trị viên' : user.role === 'DOCTOR' ? 'Bác sĩ' : 'Bệnh nhân'}
                    </span>
                  </div>

                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-700"
                    >
                      <ShieldCheck className="w-4 h-4 text-sky-600" strokeWidth={1.75} />
                      Bảng điều khiển Admin
                    </Link>
                  )}

                  {user.role === 'DOCTOR' && (
                    <Link
                      href="/doctor/dashboard"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-700"
                    >
                      <Stethoscope className="w-4 h-4 text-sky-600" strokeWidth={1.75} />
                      Bàn làm việc Bác sĩ
                    </Link>
                  )}

                  <Link
                    href="/appointments"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-700"
                  >
                    <Calendar className="w-4 h-4 text-slate-400" strokeWidth={1.75} />
                    Lịch hẹn đã đặt
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-700"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" strokeWidth={1.75} />
                    Hồ sơ bệnh nhân
                  </Link>

                  <div className="my-1 border-t border-slate-100" />

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
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="h-8 px-3 text-xs font-medium">
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="h-8 px-3 text-xs font-semibold">
                  Đăng ký
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg text-slate-700 hover:bg-sky-50 hover:text-sky-700"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100">
            {user ? (
              <div className="space-y-2">
                <div className="px-3 py-1">
                  <p className="text-xs font-bold text-slate-900">{user.fullName}</p>
                  <p className="text-[11px] text-slate-500">{user.email}</p>
                </div>
                <Link
                  href="/appointments"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  <Calendar className="w-4 h-4 text-slate-400" strokeWidth={1.75} /> Lịch hẹn đã đặt
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-rose-600 rounded-lg hover:bg-rose-50"
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
