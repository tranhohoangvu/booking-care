'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, User, Phone, HeartHandshake, AlertCircle, CheckCircle2, Loader2, Stethoscope, UserCheck } from 'lucide-react';
import type { UserRole } from '@/types/database.types';

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('PATIENT');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!fullName || !email || !password || !confirmPassword) {
      setErrorMsg('Vui lòng điền đầy đủ các thông tin bắt buộc');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Mật khẩu phải chứa ít nhất 6 ký tự');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp');
      return;
    }

    // Offline / Demo fallback if Supabase is not configured
    if (!isSupabaseConfigured()) {
      const demoPayload = {
        id: `demo-${role.toLowerCase()}-${Date.now()}`,
        email,
        role,
        fullName,
      };
      document.cookie = `bookingcare_demo_user=${encodeURIComponent(JSON.stringify(demoPayload))}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('bookingcare_auth_change'));
      }
      router.push(role === 'DOCTOR' ? '/doctor/profile' : '/profile');
      router.refresh();
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone || null,
            role: role,
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      if (data.session) {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('bookingcare_auth_change'));
        }
        router.push('/');
        router.refresh();
      } else {
        setSuccessMsg('Đăng ký thành công! Vui lòng kiểm tra hộp thư email của bạn để xác thực tài khoản.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Đã có lỗi xảy ra khi đăng ký';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[oklch(0.54_0.19_240)] text-white shadow-xs mb-3.5">
            <HeartHandshake className="h-6 w-6" strokeWidth={1.75} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[oklch(0.2_0.012_250)]">Tạo tài khoản mới</h1>
          <p className="text-xs sm:text-sm text-[oklch(0.28_0.014_250)] mt-1">Đăng ký dễ dàng để trải nghiệm dịch vụ y tế tiện lợi</p>
        </div>

        <Card className="shadow-[0px_12px_32px_-16px_oklch(0.2_0.012_250_/_0.14),0px_1px_2px_0px_oklch(0.2_0.012_250_/_0.06)] border-[oklch(0.86_0.014_90)] bg-white rounded-[20px]">
          <form onSubmit={handleRegister}>
            <CardHeader className="space-y-1">
              <CardTitle className="text-base font-bold text-[oklch(0.2_0.012_250)]">Thông tin đăng ký</CardTitle>
              <CardDescription className="text-xs text-[oklch(0.28_0.014_250)]">Chọn loại tài khoản và điền thông tin</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3.5">
              {errorMsg && (
                <div className="p-3 rounded-[12px] bg-rose-50 border border-rose-200 flex items-start gap-2 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" strokeWidth={1.75} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-[12px] bg-emerald-50 border border-emerald-200 flex items-start gap-2 text-xs text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" strokeWidth={1.75} />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Role Picker - Hallmark 12px radius & 120ms duration */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[oklch(0.2_0.012_250)]">Bạn là:</label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRole('PATIENT')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-[12px] border text-xs font-bold transition-all duration-[120ms] active:scale-[0.98] ${
                      role === 'PATIENT'
                        ? 'border-[oklch(0.54_0.19_240)] bg-[oklch(0.95_0.04_240)] text-[oklch(0.48_0.19_240)]'
                        : 'border-[oklch(0.86_0.014_90)] text-[oklch(0.28_0.014_250)] hover:bg-[oklch(0.97_0.012_95)]'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" strokeWidth={1.75} /> Bệnh nhân
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('DOCTOR')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-[12px] border text-xs font-bold transition-all duration-[120ms] active:scale-[0.98] ${
                      role === 'DOCTOR'
                        ? 'border-[oklch(0.54_0.19_240)] bg-[oklch(0.95_0.04_240)] text-[oklch(0.48_0.19_240)]'
                        : 'border-[oklch(0.86_0.014_90)] text-[oklch(0.28_0.014_250)] hover:bg-[oklch(0.97_0.012_95)]'
                    }`}
                  >
                    <Stethoscope className="w-3.5 h-3.5" strokeWidth={1.75} /> Bác sĩ
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[oklch(0.2_0.012_250)]">Họ và tên *</label>
                <Input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  icon={<User className="w-4 h-4" strokeWidth={1.75} />}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[oklch(0.2_0.012_250)]">Địa chỉ Email *</label>
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
                <label className="text-xs font-semibold text-[oklch(0.2_0.012_250)]">Số điện thoại</label>
                <Input
                  type="tel"
                  placeholder="0912 345 678"
                  icon={<Phone className="w-4 h-4" strokeWidth={1.75} />}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[oklch(0.2_0.012_250)]">Mật khẩu *</label>
                <Input
                  type="password"
                  placeholder="Tối thiểu 6 ký tự"
                  icon={<Lock className="w-4 h-4" strokeWidth={1.75} />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[oklch(0.2_0.012_250)]">Xác nhận mật khẩu *</label>
                <Input
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  icon={<Lock className="w-4 h-4" strokeWidth={1.75} />}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-2">
              <Button type="submit" className="w-full h-10 text-xs font-bold rounded-[12px]" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.75} /> Đang tạo tài khoản...
                  </>
                ) : (
                  'Đăng ký tài khoản'
                )}
              </Button>

              <div className="text-center text-xs text-[oklch(0.28_0.014_250)]">
                Đã có tài khoản?{' '}
                <Link href="/login" className="font-semibold text-[oklch(0.54_0.19_240)] hover:underline">
                  Đăng nhập tại đây
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
