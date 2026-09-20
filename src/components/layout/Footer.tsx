import React from 'react';
import Link from 'next/link';
import { HeartHandshake, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Booking<span className="text-sky-600">Care</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Nền tảng đặt lịch khám bệnh trực tuyến hàng đầu, kết nối hàng triệu bệnh nhân với các bác sĩ và cơ sở y tế uy tín trên toàn quốc.
            </p>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Liên hệ & Hỗ trợ</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span>28 Thành Thái, Phường 12, Quận 10, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Hotline: 1900 2805 (8:00 - 18:00)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-600 shrink-0" />
                <span>support@bookingcare.vn</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Dịch vụ y tế</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link href="/specialties" className="hover:text-sky-600 transition-colors">Khám Chuyên khoa</Link></li>
              <li><Link href="/clinics" className="hover:text-sky-600 transition-colors">Cơ sở y tế & Bệnh viện</Link></li>
              <li><Link href="/doctors" className="hover:text-sky-600 transition-colors">Đội ngũ Bác sĩ giỏi</Link></li>
              <li><Link href="/faq" className="hover:text-sky-600 transition-colors">Câu hỏi thường gặp</Link></li>
            </ul>
          </div>

          {/* Medical Notice */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Lưu ý quan trọng</h4>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/60 text-[11px] text-amber-800 leading-relaxed">
              Các thông tin trên website chỉ mang tính chất tham khảo. Trong các trường hợp cấp cứu khẩn cấp, vui lòng liên hệ ngay <strong>115</strong> hoặc đến cơ sở y tế gần nhất.
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600">
          <p>© 2026 BookingCare. Bản quyền thuộc về nền tảng y tế số.</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <Link href="/terms" className="hover:text-slate-700">Điều khoản sử dụng</Link>
            <Link href="/privacy" className="hover:text-slate-700">Chính sách bảo mật</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
