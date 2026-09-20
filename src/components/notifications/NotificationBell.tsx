'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Bell, CheckCircle2, Clock, FileText, AlertCircle, X } from 'lucide-react';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'appointment' | 'doctor' | 'system';
  link?: string;
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Lịch khám đã được tiếp nhận',
    message: 'PGS.TS.BS Nguyễn Văn Liệu đã tiếp nhận hồ sơ lịch hẹn #BKC-10192 của bạn.',
    time: '5 phút trước',
    read: false,
    type: 'appointment',
    link: '/appointments',
  },
  {
    id: 'notif-2',
    title: 'Đã có kết quả khám & Bệnh án',
    message: 'Bác sĩ đã hoàn tất kết luận chẩn đoán và lời dặn điều trị cho ca khám trước.',
    time: '2 giờ trước',
    read: false,
    type: 'doctor',
    link: '/appointments',
  },
  {
    id: 'notif-3',
    title: 'Nhắc nhở chuẩn bị trước khám',
    message: 'Vui lòng có mặt trước giờ hẹn 15 phút và mang theo CCCD/BHYT khi đến viện.',
    time: 'Hôm qua',
    read: true,
    type: 'system',
    link: '/appointments',
  },
];

export function NotificationBell() {
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Listen for custom real-time notification events in browser
  useEffect(() => {
    const handleNewNotif = (e: CustomEvent<Partial<AppNotification>>) => {
      if (e.detail) {
        const newNotif: AppNotification = {
          id: `notif-${Date.now()}`,
          title: e.detail.title || 'Thông báo mới',
          message: e.detail.message || '',
          time: 'Vừa xong',
          read: false,
          type: e.detail.type || 'system',
          link: e.detail.link || '/appointments',
        };
        setNotifications((prev) => [newNotif, ...prev]);
      }
    };

    window.addEventListener('bookingcare_notification' as any, handleNewNotif);
    return () => window.removeEventListener('bookingcare_notification' as any, handleNewNotif);
  }, []);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markItemAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
        title="Thông báo"
        aria-label="Thông báo"
      >
        <Bell className="w-5 h-5" strokeWidth={2} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Popup */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white border border-gray-200/80 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
          
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-[#f8faf9]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-[#1a2e24]">Thông Báo Của Bạn</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#16a34a] text-[10px] font-bold">
                  {unreadCount} mới
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] font-bold text-[#22c55e] hover:underline cursor-pointer"
              >
                Đọc tất cả
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-500">
                Không có thông báo mới.
              </div>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.link || '#'}
                  onClick={() => {
                    markItemAsRead(n.id);
                    setIsOpen(false);
                  }}
                  className={`p-3.5 block transition-colors hover:bg-gray-50 ${
                    !n.read ? 'bg-emerald-50/30' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {n.type === 'appointment' ? (
                        <div className="w-7 h-7 rounded-xl bg-emerald-100 text-[#16a34a] flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      ) : n.type === 'doctor' ? (
                        <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                          <FileText className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                          <Clock className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs ${!n.read ? 'font-bold text-[#1a2e24]' : 'font-semibold text-gray-700'}`}>
                          {n.title}
                        </span>
                        <span className="text-[10px] text-gray-400 shrink-0 ml-2">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>
                    </div>

                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-[#22c55e] shrink-0 mt-1.5" />
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="p-2.5 text-center border-t border-gray-100 bg-[#f8faf9]">
            <Link
              href="/appointments"
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-bold text-gray-600 hover:text-[#22c55e] transition-colors"
            >
              Xem tất cả lịch hẹn y tế →
            </Link>
          </div>

        </div>
      )}
    </div>
  );
}
