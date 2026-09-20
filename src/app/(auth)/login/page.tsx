'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, HeartHandshake, AlertCircle, Loader2 } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Vui lòng điền đầy đủ email và mật khẩu');
      return;
    }

    // If in demo / offline mode without real Supabase credentials:
    if (!isSupabaseConfigured()) {
      let role: 'PATIENT' | 'DOCTOR' | 'ADMIN' = 'PATIENT';
      const lowerEmail = email.toLowerCase();
      if (lowerEmail.includes('doctor') || lowerEmail.includes('bacsi') || lowerEmail.includes('bs')) {
        role = 'DOCTOR';
      } else if (lowerEmail.includes('admin')) {
        role = 'ADMIN';
      }
      handleDemoLogin(role, email.split('@')[0], email);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrorMsg('Email hoặc mật khẩu không chính xác');
        } else {
          setErrorMsg(error.message);
        }
        return;
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('bookingcare_auth_change'));
      }

      router.push(redirectPath);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Đã có lỗi xảy ra khi đăng nhập';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role: 'PATIENT' | 'DOCTOR' | 'ADMIN', fullName: string, demoEmail: string) => {
    const demoPayload = {
      id: `demo-${role.toLowerCase()}-id`,
      email: demoEmail,
      role,
      fullName,
    };
    // Set cookie for 7 days
    document.cookie = `bookingcare_demo_user=${encodeURIComponent(JSON.stringify(demoPayload))}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
    
    // Notify Navbar and other components immediately
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('bookingcare_auth_change'));
    }

    // Auto redirect based on role or searchParams
    let target = redirectPath;
    if (target === '/') {
      if (role === 'DOCTOR') target = '/doctor/schedule';
      else if (role === 'ADMIN') target = '/admin';
      else target = '/profile';
    }

    router.push(target);
    router.refresh();
  };

  return (
    <Card className="shadow-[0px_12px_32px_-16px_oklch(0.2_0.012_250_/_0.14),0px_1px_2px_0px_oklch(0.2_0.012_250_/_0.06)] border-[oklch(0.86_0.014_90)] bg-white rounded-[20px]">
      <form onSubmit={handleLogin}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-base font-bold text-[oklch(0.2_0.012_250)]">Đăng nhập</CardTitle>
          <CardDescription className="text-xs text-[oklch(0.28_0.014_250)]">Nhập thông tin tài khoản của bạn</CardDescription>
        </CardHeader>

        <CardContent className="space-y-3.5">
          {errorMsg && (
            <div className="p-3 rounded-[12px] bg-rose-50 border border-rose-200 flex items-start gap-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" strokeWidth={1.75} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[oklch(0.2_0.012_250)]">Địa chỉ Email</label>
            <Input
              type="email"
              placeholder="name@example.com"
              icon={<Mail className="w-4 h-4" strokeWidth={1.75} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[oklch(0.2_0.012_250)]">Mật khẩu</label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-[oklch(0.54_0.19_240)] hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" strokeWidth={1.75} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-2">
          <Button type="submit" className="w-full h-10 text-xs font-bold rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.75} /> Đang xác thực...
              </>
            ) : (
              'Đăng nhập ngay'
            )}
          </Button>

          <div className="text-center text-xs text-gray-600">
            Chưa có tài khoản?{' '}
            <Link href="/register" className="font-semibold text-[#22c55e] hover:underline">
              Đăng ký tài khoản mới
            </Link>
          </div>

          {/* Quick Demo Role Switcher for Testing RBAC */}
          <div className="w-full pt-4 mt-2 border-t border-gray-200">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center mb-2.5">
              Đăng nhập nhanh để kiểm tra phân quyền (RBAC)
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleDemoLogin('PATIENT', 'Nguyễn Văn A', 'patient.demo@bookingcare.vn')}
                className="py-2 px-1 rounded-xl bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-gray-200 text-gray-700 font-semibold text-[11px] transition-all text-center"
              >
                Bệnh nhân
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('DOCTOR', 'PGS.TS.BS Nguyễn Văn Liệu', 'doctor.lieu@bookingcare.vn')}
                className="py-2 px-1 rounded-xl bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-gray-200 text-gray-700 font-semibold text-[11px] transition-all text-center"
              >
                Bác sĩ
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('ADMIN', 'Quản trị viên', 'admin@bookingcare.vn')}
                className="py-2 px-1 rounded-xl bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-gray-200 text-gray-700 font-semibold text-[11px] transition-all text-center"
              >
                Admin
              </button>
            </div>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[oklch(0.54_0.19_240)] text-white shadow-xs mb-3.5">
            <HeartHandshake className="h-6 w-6" strokeWidth={1.75} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[oklch(0.2_0.012_250)]">Chào mừng bạn quay lại</h1>
          <p className="text-xs sm:text-sm text-[oklch(0.28_0.014_250)] mt-1">Đăng nhập tài khoản để quản lý lịch khám sức khỏe</p>
        </div>

        <Suspense fallback={<div className="h-72 w-full bg-white rounded-[20px] border border-[oklch(0.86_0.014_90)] animate-pulse" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
