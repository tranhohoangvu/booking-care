'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Stethoscope, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gradient-to-b from-[#f8faf9] to-white">
      <div className="glass-card rounded-[32px] p-8 sm:p-12 max-w-lg w-full text-center space-y-6 shadow-xl border border-gray-200/80">
        
        <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-[#22c55e] flex items-center justify-center mx-auto border border-emerald-200/60 shadow-xs">
          <Stethoscope className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl sm:text-5xl font-extrabold text-[#1a2e24] font-mono tracking-tight block">
            404
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1a2e24]">
            Trang Không Tồn Tại
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
            Đường dẫn bạn đang truy cập có thể đã được thay đổi, xóa bỏ hoặc tạm thời không khả dụng trên hệ thống BookingCare.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto h-11 px-6 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 cursor-pointer">
              <Home className="w-4 h-4" /> Về trang chủ
            </Button>
          </Link>
          <Link href="/doctors" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto h-11 px-6 rounded-full border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer">
              <Search className="w-4 h-4" /> Tìm bác sĩ
            </Button>
          </Link>
        </div>

        <div className="pt-4 border-t border-gray-100 text-[11px] text-gray-500">
          Tổng đài hỗ trợ y tế 24/7: <strong className="text-gray-900">1900 2805</strong>
        </div>

      </div>
    </div>
  );
}
