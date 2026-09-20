'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User as UserIcon, 
  Phone, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  CalendarCheck2, 
  ShieldCheck, 
  Save, 
  ArrowLeft 
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { getPatientProfile, updatePatientProfile } from '@/lib/services/profiles';
import type { PatientProfile } from '@/types/database.types';
import { Button } from '@/components/ui/button';

export default function PatientProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Nam');
  const [address, setAddress] = useState('');

  useEffect(() => {
    async function loadUserAndProfile() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        let userId = user?.id;
        let email = user?.email;

        // If no supabase auth, check demo user cookie
        if (!userId && typeof document !== 'undefined') {
          const demoCookie = document.cookie
            .split('; ')
            .find((row) => row.startsWith('bookingcare_demo_user='));
          if (demoCookie) {
            try {
              const parsed = JSON.parse(decodeURIComponent(demoCookie.split('=')[1]));
              userId = parsed.id;
              email = parsed.email;
            } catch {
              userId = undefined;
            }
          }
        }

        // Enforce login requirement
        if (!userId) {
          router.push('/login?redirect=/profile');
          return;
        }

        setUserEmail(email || 'patient.demo@bookingcare.vn');

        const profileData = await getPatientProfile(userId);
        if (profileData) {
          setProfile(profileData);
          setFullName(profileData.full_name || '');
          setPhone(profileData.phone || '');
          setDob(profileData.dob || '');
          setGender(profileData.gender || 'Nam');
          setAddress(profileData.address || '');
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    }

    loadUserAndProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setMessage({ type: 'error', text: 'Vui lòng nhập họ và tên của bạn.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || 'demo-user-id';

      const res = await updatePatientProfile(userId, {
        full_name: fullName.trim(),
        phone: phone.trim() || null,
        dob: dob || null,
        gender,
        address: address.trim() || null,
      });

      if (res.success) {
        setMessage({ type: 'success', text: 'Đã cập nhật thông tin hồ sơ thành công!' });
      } else {
        setMessage({ type: 'error', text: res.error || 'Có lỗi xảy ra khi lưu hồ sơ.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Không thể kết nối đến máy chủ. Vui lòng thử lại.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="glass-card rounded-2xl p-8 flex items-center gap-3 text-gray-600">
          <div className="w-5 h-5 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold">Đang tải hồ sơ bệnh nhân...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#22c55e] flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Trang chủ
        </Link>
        <span>/</span>
        <span className="text-[#1a2e24] font-semibold">Hồ sơ cá nhân</span>
      </div>

      <div className="glass-card rounded-[28px] p-8 md:p-10 relative overflow-hidden">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/60 pb-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#22c55e] to-[#16a34a] text-white flex items-center justify-center font-bold text-2xl shadow-sm">
              {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1a2e24]">{fullName || 'Hồ sơ bệnh nhân'}</h1>
              <p className="text-xs text-gray-500 mt-0.5">{userEmail}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-[#22c55e]/15 text-[#16a34a] text-[10px] font-bold border border-[#22c55e]/20">
                Tài khoản Bệnh nhân
              </span>
            </div>
          </div>

          <Link href="/appointments">
            <Button variant="outline" size="sm" className="rounded-full border-gray-300 hover:border-[#22c55e] text-xs flex items-center gap-1.5">
              <CalendarCheck2 className="w-4 h-4 text-[#22c55e]" />
              Lịch hẹn đã đặt
            </Button>
          </Link>
        </div>

        {/* Feedback Alert */}
        {message && (
          <div
            className={`p-4 rounded-2xl mb-6 flex items-center gap-3 text-xs font-semibold ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-[#22c55e]" /> Họ và tên <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition-all"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#22c55e]" /> Số điện thoại
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0901234567"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition-all"
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#22c55e]" /> Ngày sinh
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition-all"
              />
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Giới tính</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition-all"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#22c55e]" /> Địa chỉ cư trú
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition-all"
            />
          </div>

          {/* Privacy Note */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200/80 flex items-start gap-2.5 text-xs text-gray-600">
            <ShieldCheck className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" />
            <span>
              Thông tin cá nhân của bạn được bảo mật theo tiêu chuẩn y tế quốc gia và chỉ được sử dụng để liên hệ đón tiếp khi đến khám bệnh tại cơ sở y tế.
            </span>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-full font-semibold text-xs bg-[#22c55e] hover:bg-[#16a34a] text-white transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
