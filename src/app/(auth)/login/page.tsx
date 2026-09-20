'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
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

      router.push(redirectPath);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Đã có lỗi xảy ra khi đăng nhập';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg shadow-slate-100 border-slate-200">
      <form onSubmit={handleLogin}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-lg">Đăng nhập</CardTitle>
          <CardDescription>Nhập thông tin tài khoản của bạn</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Địa chỉ Email</label>
            <Input
              type="email"
              placeholder="name@example.com"
              icon={<Mail className="w-4 h-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">Mật khẩu</label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-sky-600 hover:text-sky-700 hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Đang xác thực...
              </>
            ) : (
              'Đăng nhập ngay'
            )}
          </Button>

          <div className="text-center text-xs text-slate-600">
            Chưa có tài khoản?{' '}
            <Link href="/register" className="font-semibold text-sky-600 hover:underline">
              Đăng ký tài khoản mới
            </Link>
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
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-500/25 mb-4">
            <HeartHandshake className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Chào mừng bạn quay lại</h1>
          <p className="text-sm text-slate-600 mt-1">Đăng nhập tài khoản để quản lý lịch khám sức khỏe</p>
        </div>

        <Suspense fallback={<div className="h-72 w-full bg-white rounded-2xl border border-slate-200 animate-pulse" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
