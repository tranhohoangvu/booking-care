'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ArrowLeft, HeartHandshake, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const supabase = createClient();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email) {
      setErrorMsg('Vui lòng nhập địa chỉ email');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      setSuccessMsg('Đã gửi email khôi phục mật khẩu! Vui lòng kiểm tra hòm thư của bạn.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Đã có lỗi xảy ra';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[oklch(0.54_0.19_240)] text-white shadow-xs mb-3.5">
            <HeartHandshake className="h-6 w-6" strokeWidth={1.75} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[oklch(0.2_0.012_250)]">Quên mật khẩu?</h1>
          <p className="text-xs sm:text-sm text-[oklch(0.28_0.014_250)] mt-1">Nhập email để nhận liên kết thiết lập lại mật khẩu</p>
        </div>

        <Card className="shadow-[0px_12px_32px_-16px_oklch(0.2_0.012_250_/_0.14),0px_1px_2px_0px_oklch(0.2_0.012_250_/_0.06)] border-[oklch(0.86_0.014_90)] bg-white rounded-[20px]">
          <form onSubmit={handleResetPassword}>
            <CardHeader className="space-y-1">
              <CardTitle className="text-base font-bold text-[oklch(0.2_0.012_250)]">Khôi phục mật khẩu</CardTitle>
              <CardDescription className="text-xs text-[oklch(0.28_0.014_250)]">Chúng tôi sẽ gửi liên kết bảo mật về hòm thư của bạn</CardDescription>
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

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[oklch(0.2_0.012_250)]">Địa chỉ Email đã đăng ký</label>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  icon={<Mail className="w-4 h-4" strokeWidth={1.75} />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-2">
              <Button type="submit" className="w-full h-10 text-xs font-bold rounded-[12px]" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.75} /> Đang gửi yêu cầu...
                  </>
                ) : (
                  'Gửi hướng dẫn'
                )}
              </Button>

              <Link
                href="/login"
                className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[oklch(0.28_0.014_250)] hover:text-[oklch(0.54_0.19_240)] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} /> Quay lại đăng nhập
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
