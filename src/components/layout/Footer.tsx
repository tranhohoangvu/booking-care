import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200/60 bg-[#eef1f0]/85 backdrop-blur-md">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#22c55e] to-[#16a34a] text-white shadow-xs">
                <svg className="h-4.5 w-4.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  <path d="M12 7v6" />
                  <path d="M9 10h6" />
                </svg>
              </div>
              <span className="text-base font-bold tracking-tight text-[#1a2e24]">
                Booking<span className="text-[#22c55e]">Care</span>
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Nền tảng đặt lịch khám bệnh trực tuyến hàng đầu, kết nối hàng triệu bệnh nhân với các bác sĩ và cơ sở y tế uy tín trên toàn quốc.
            </p>
          </div>

          {/* Contact Details */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1a2e24]">Liên hệ & Hỗ trợ</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#22c55e] shrink-0 mt-0.5" strokeWidth={2} />
                <span>28 Thành Thái, Phường 12, Quận 10, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#22c55e] shrink-0" strokeWidth={2} />
                <span>Hotline: 1900 2805 (8:00 - 18:00)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#22c55e] shrink-0" strokeWidth={2} />
                <span>support@bookingcare.vn</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1a2e24]">Dịch vụ y tế</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><Link href="/specialties" className="hover:text-[#22c55e] transition-colors">Khám Chuyên khoa</Link></li>
              <li><Link href="/clinics" className="hover:text-[#22c55e] transition-colors">Cơ sở y tế & Bệnh viện</Link></li>
              <li><Link href="/doctors" className="hover:text-[#22c55e] transition-colors">Đội ngũ Bác sĩ giỏi</Link></li>
              <li><Link href="/faq" className="hover:text-[#22c55e] transition-colors">Câu hỏi thường gặp</Link></li>
            </ul>
          </div>

          {/* Medical Notice */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1a2e24]">Lưu ý quan trọng</h4>
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-900 leading-relaxed">
              Các thông tin trên website chỉ mang tính chất tham khảo. Trong các trường hợp cấp cứu khẩn cấp, vui lòng liên hệ ngay <strong>115</strong> hoặc đến cơ sở y tế gần nhất.
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© 2026 BookingCare. Bản quyền thuộc về nền tảng y tế số.</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <Link href="/terms" className="hover:text-gray-800 transition-colors">Điều khoản sử dụng</Link>
            <Link href="/privacy" className="hover:text-gray-800 transition-colors">Chính sách bảo mật</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
