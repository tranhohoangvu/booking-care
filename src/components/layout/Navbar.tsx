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
  Building2
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
          // Fetch role from public.users table
          const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', authUser.id)
            .single();

          // Fetch full_name from patient_profiles or doctor_profiles
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
    { href: '/specialties', label: 'Chuyên khoa', icon: <HeartHandshake className="w-4 h-4" /> },
    { href: '/clinics', label: 'Cơ sở y tế', icon: <Building2 className="w-4 h-4" /> },
    { href: '/doctors', label: 'Bác sĩ', icon: <Stethoscope className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-all">
            <HeartHandshake className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
              Booking<span className="text-sky-600">Care</span>
            </span>
            <span className="text-[10px] font-medium tracking-wider uppercase text-slate-600 mt-0.5">
              Nền tảng y tế số
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'text-sky-600 bg-sky-50 font-semibold'
                    : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User Auth Controls */}
        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <div className="h-9 w-24 bg-slate-100 animate-pulse rounded-lg" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 text-white flex items-center justify-center font-semibold text-xs shadow-sm">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden lg:block">
                  <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[120px]">
                    {user.fullName || user.email}
                  </p>
                  <p className="text-[10px] font-medium text-sky-600">
                    {user.role === 'ADMIN' ? 'Quản trị viên' : user.role === 'DOCTOR' ? 'Bác sĩ' : 'Bệnh nhân'}
                  </p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200/80 bg-white py-2 shadow-xl shadow-slate-200/50 animate-in fade-in-50 zoom-in-95">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-800 truncate">{user.fullName}</p>
                    <p className="text-xs text-slate-600 truncate">{user.email}</p>
                  </div>

                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-600"
                    >
                      <ShieldCheck className="w-4 h-4 text-sky-600" />
                      Trang Quản trị Admin
                    </Link>
                  )}

                  {user.role === 'DOCTOR' && (
                    <Link
                      href="/doctor/dashboard"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-600"
                    >
                      <Stethoscope className="w-4 h-4 text-sky-600" />
                      Bàn làm việc Bác sĩ
                    </Link>
                  )}

                  <Link
                    href="/appointments"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-600"
                  >
                    <Calendar className="w-4 h-4 text-slate-400" />
                    Lịch khám của tôi
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-600"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    Hồ sơ cá nhân
                  </Link>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Đăng ký</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-slate-700 hover:bg-sky-50 hover:text-sky-600"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100">
            {user ? (
              <div className="space-y-2">
                <div className="px-3 py-1">
                  <p className="text-sm font-semibold text-slate-900">{user.fullName}</p>
                  <p className="text-xs text-slate-600">{user.email}</p>
                </div>
                <Link
                  href="/appointments"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  <Calendar className="w-4 h-4 text-slate-400" /> Lịch khám của tôi
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-rose-600 rounded-lg hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4" /> Đăng xuất
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full">Đăng ký tài khoản</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
