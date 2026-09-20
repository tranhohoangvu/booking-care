'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Stethoscope, 
  Building2, 
  Award, 
  DollarSign, 
  FileText, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  ArrowLeft,
  CalendarCheck2
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { getDoctorProfile, updateDoctorProfile } from '@/lib/services/profiles';
import { getAllSpecialties, type SpecialtyWithCount } from '@/lib/services/specialties';
import { getAllClinics, type ClinicWithStats } from '@/lib/services/clinics';
import type { DoctorProfile } from '@/types/database.types';
import { Button } from '@/components/ui/button';
import { DoctorSubnav } from '@/components/doctor/DoctorSubnav';

export default function DoctorProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [specialties, setSpecialties] = useState<SpecialtyWithCount[]>([]);
  const [clinics, setClinics] = useState<ClinicWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [degree, setDegree] = useState('Bác sĩ');
  const [specialtyId, setSpecialtyId] = useState('');
  const [clinicId, setClinicId] = useState('');
  const [experienceYears, setExperienceYears] = useState(10);
  const [consultationFee, setConsultationFee] = useState(300000);
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    async function loadInitialData() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        let userId = user?.id;
        let role: string | null = null;

        if (user) {
          const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();
          role = userData?.role || null;
        } else if (typeof document !== 'undefined') {
          // Check demo cookie
          const demoCookie = document.cookie
            .split('; ')
            .find((row) => row.startsWith('bookingcare_demo_user='));
          if (demoCookie) {
            try {
              const parsed = JSON.parse(decodeURIComponent(demoCookie.split('=')[1]));
              userId = parsed.id;
              role = parsed.role;
            } catch {
              userId = undefined;
            }
          }
        }

        // Enforce login
        if (!userId) {
          router.push('/login?redirect=/doctor/profile');
          return;
        }

        // Enforce doctor/admin role
        if (role && role !== 'DOCTOR' && role !== 'ADMIN') {
          router.push('/profile');
          return;
        }

        const [specs, clns] = await Promise.all([
          getAllSpecialties(),
          getAllClinics(),
        ]);
        setSpecialties(specs);
        setClinics(clns);

        const docProfile = await getDoctorProfile(userId);
        if (docProfile) {
          setProfile(docProfile);
          setFullName(docProfile.full_name || '');
          setDegree(docProfile.degree || 'Bác sĩ');
          setSpecialtyId(docProfile.specialty_id || specs[0]?.id || '');
          setClinicId(docProfile.clinic_id || clns[0]?.id || '');
          setExperienceYears(docProfile.experience_years || 10);
          setConsultationFee(docProfile.consultation_fee || 300000);
          setBio(docProfile.bio || '');
          setAvatarUrl(docProfile.avatar_url || '');
        }
      } catch (err) {
        console.error('Failed to load doctor profile data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setMessage({ type: 'error', text: 'Vui lòng nhập họ tên bác sĩ.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || 'demo-doctor-id';

      const res = await updateDoctorProfile(userId, {
        full_name: fullName.trim(),
        degree,
        specialty_id: specialtyId || null,
        clinic_id: clinicId || null,
        experience_years: Number(experienceYears) || 0,
        consultation_fee: Number(consultationFee) || 300000,
        bio: bio.trim() || null,
        avatar_url: avatarUrl.trim() || null,
      });

      if (res.success) {
        setMessage({ type: 'success', text: 'Đã cập nhật hồ sơ bác sĩ thành công!' });
      } else {
        setMessage({ type: 'error', text: res.error || 'Có lỗi xảy ra khi cập nhật hồ sơ.' });
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
          <span className="text-sm font-semibold">Đang tải hồ sơ bác sĩ...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <DoctorSubnav
        title="Hồ sơ chuyên môn Bác sĩ"
        subtitle="Cập nhật học vị, chuyên khoa, bệnh viện công tác, biểu phí khám và giới thiệu tiểu sử của bạn."
      />

      <div className="glass-card rounded-[28px] p-8 md:p-10 relative overflow-hidden">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/60 pb-6 mb-8">
          <div className="flex items-center gap-4">
            {/* Avatar Preview */}
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80'}
                alt={fullName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#22c55e] border-2 border-white" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#1a2e24]">{degree} {fullName}</h1>
              <p className="text-xs text-gray-500 mt-0.5">Quản lý thông tin hồ sơ y tế hiển thị với người bệnh</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-[#22c55e]/15 text-[#16a34a] text-[10px] font-bold border border-[#22c55e]/20">
                Tài khoản Bác sĩ
              </span>
            </div>
          </div>

          <Link href="/doctor/dashboard">
            <Button variant="outline" size="sm" className="rounded-full border-gray-300 hover:border-[#22c55e] text-xs flex items-center gap-1.5">
              <CalendarCheck2 className="w-4 h-4 text-[#22c55e]" />
              Bàn làm việc Bác sĩ
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

        {/* Doctor Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">
                Họ và tên Bác sĩ <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn Liệu"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition-all"
              />
            </div>

            {/* Degree */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#22c55e]" /> Học vị / Danh hiệu
              </label>
              <select
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition-all"
              >
                <option value="Bác sĩ">Bác sĩ</option>
                <option value="Thạc sĩ, Bác sĩ">Thạc sĩ, Bác sĩ</option>
                <option value="Tiến sĩ, Bác sĩ">Tiến sĩ, Bác sĩ</option>
                <option value="Bác sĩ Chuyên khoa I">Bác sĩ Chuyên khoa I (BSCKI)</option>
                <option value="Bác sĩ Chuyên khoa II">Bác sĩ Chuyên khoa II (BSCKII)</option>
                <option value="Phó Giáo sư, Tiến sĩ, Bác sĩ">Phó Giáo sư, Tiến sĩ, Bác sĩ (PGS.TS.BS)</option>
                <option value="Giáo sư, Tiến sĩ, Bác sĩ">Giáo sư, Tiến sĩ, Bác sĩ (GS.TS.BS)</option>
              </select>
            </div>

            {/* Specialty */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-[#22c55e]" /> Chuyên khoa phụ trách
              </label>
              <select
                value={specialtyId}
                onChange={(e) => setSpecialtyId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition-all"
              >
                {specialties.map((spec) => (
                  <option key={spec.id} value={spec.id}>
                    {spec.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Clinic */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#22c55e]" /> Cơ sở y tế công tác
              </label>
              <select
                value={clinicId}
                onChange={(e) => setClinicId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition-all"
              >
                {clinics.map((clinic) => (
                  <option key={clinic.id} value={clinic.id}>
                    {clinic.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience Years */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Số năm kinh nghiệm</label>
              <input
                type="number"
                min={0}
                max={60}
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition-all"
              />
            </div>

            {/* Consultation Fee */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-[#22c55e]" /> Giá khám niêm yết (VNĐ)
              </label>
              <input
                type="number"
                min={50000}
                step={50000}
                value={consultationFee}
                onChange={(e) => setConsultationFee(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition-all"
              />
            </div>
          </div>

          {/* Avatar URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#22c55e]" /> Đường dẫn ảnh chân dung (Avatar URL)
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition-all"
            />
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#22c55e]" /> Tiểu sử tóm tắt & Quá trình công tác
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Mô tả tóm tắt kinh nghiệm làm việc, các chứng chỉ chuyên ngành, đề tài nghiên cứu..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition-all leading-relaxed"
            />
          </div>

          {/* Save Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-full font-semibold text-xs bg-[#22c55e] hover:bg-[#16a34a] text-white transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Đang lưu...' : 'Lưu hồ sơ bác sĩ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
