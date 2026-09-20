import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BookingCare - Nền tảng đặt lịch khám bệnh trực tuyến hàng đầu',
  description:
    'Đặt lịch khám chuyên khoa, bác sĩ giỏi, bệnh viện uy tín dễ dàng, nhanh chóng và không lo xếp hàng chờ đợi.',
  keywords: [
    'booking care',
    'đặt lịch khám bệnh',
    'bác sĩ giỏi',
    'chuyên khoa y tế',
    'phòng khám uy tín',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50/50 text-slate-900 font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
