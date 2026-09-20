'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Stethoscope, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Building2, 
  DollarSign, 
  Star, 
  Award,
  Layers
} from 'lucide-react';
import { AdminSubnav } from '@/components/admin/AdminSubnav';
import { 
  getAllAdminDoctors, 
  getAllAdminSpecialties, 
  getAllAdminClinics, 
  createDoctor, 
  updateDoctor, 
  deleteDoctor 
} from '@/lib/services/admin';
import type { DoctorWithDetails } from '@/lib/services/doctors';
import type { SpecialtyWithCount } from '@/lib/services/specialties';
import type { ClinicWithStats } from '@/lib/services/clinics';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<DoctorWithDetails[]>([]);
  const [specialties, setSpecialties] = useState<SpecialtyWithCount[]>([]);
  const [clinics, setClinics] = useState<ClinicWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formDegree, setFormDegree] = useState('Bác sĩ Chuyên khoa I');
  const [formSpecialtyId, setFormSpecialtyId] = useState('');
  const [formClinicId, setFormClinicId] = useState('');
  const [formFee, setFormFee] = useState('350000');
  const [formExp, setFormExp] = useState('12');
  const [formBio, setFormBio] = useState('');
  const [formAvatar, setFormAvatar] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [docs, specs, clins] = await Promise.all([
        getAllAdminDoctors(),
        getAllAdminSpecialties(),
        getAllAdminClinics(),
      ]);
      setDoctors(docs);
      setSpecialties(specs);
      setClinics(clins);
      if (specs[0]) setFormSpecialtyId(specs[0].id);
      if (clins[0]) setFormClinicId(clins[0].id);
    } catch (err) {
      console.error('Failed to load doctors for admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setFormName('');
    setFormDegree('Bác sĩ Chuyên khoa I');
    if (specialties[0]) setFormSpecialtyId(specialties[0].id);
    if (clinics[0]) setFormClinicId(clinics[0].id);
    setFormFee('350000');
    setFormExp('10');
    setFormBio('');
    setFormAvatar('https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80');
    setErrorMsg(null);
    setModalOpen(true);
  };

  const openEditModal = (doc: DoctorWithDetails) => {
    setEditingId(doc.id);
    setFormName(doc.full_name);
    setFormDegree(doc.degree);
    setFormSpecialtyId(doc.specialty_id || (specialties[0]?.id || ''));
    setFormClinicId(doc.clinic_id || (clinics[0]?.id || ''));
    setFormFee(String(doc.consultation_fee));
    setFormExp(String(doc.experience_years));
    setFormBio(doc.bio || '');
    setFormAvatar(doc.avatar_url || '');
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setErrorMsg('Vui lòng nhập họ và tên bác sĩ.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    const spec = specialties.find((s) => s.id === formSpecialtyId);
    const clinic = clinics.find((c) => c.id === formClinicId);

    try {
      if (editingId) {
        const res = await updateDoctor(editingId, {
          full_name: formName.trim(),
          degree: formDegree.trim(),
          specialty_id: formSpecialtyId,
          clinic_id: formClinicId,
          consultation_fee: parseInt(formFee, 10) || 350000,
          experience_years: parseInt(formExp, 10) || 10,
          bio: formBio.trim() || null,
          avatar_url: formAvatar.trim() || null,
          specialty: spec,
          clinic: clinic,
        });
        if (!res.success) {
          setErrorMsg(res.error || 'Lỗi cập nhật bác sĩ');
          setSaving(false);
          return;
        }
      } else {
        const res = await createDoctor({
          full_name: formName.trim(),
          degree: formDegree.trim(),
          specialty_id: formSpecialtyId,
          clinic_id: formClinicId,
          consultation_fee: parseInt(formFee, 10) || 350000,
          experience_years: parseInt(formExp, 10) || 10,
          bio: formBio.trim(),
          avatar_url: formAvatar.trim(),
        });
        if (!res.success) {
          setErrorMsg(res.error || 'Lỗi tạo bác sĩ');
          setSaving(false);
          return;
        }
      }

      setModalOpen(false);
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa hồ sơ bác sĩ "${name}" không?`)) return;
    await deleteDoctor(id);
    loadData();
  };

  const filteredDoctors = doctors.filter((d) =>
    d.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.specialty?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.clinic?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-[#f8faf9] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <AdminSubnav
          title="Quản Lý Đội Ngũ Bác Sĩ Chuyên Khoa"
          subtitle="Thiết lập danh mục bác sĩ, phân bổ chuyên khoa, liên kết bệnh viện và thiết lập biểu phí khám."
        />

        {/* Action Header */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên bác sĩ, chuyên khoa, bệnh viện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#22c55e] outline-hidden bg-white/90"
            />
          </div>

          <Button
            onClick={openCreateModal}
            className="h-10 px-5 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" /> Thêm hồ sơ bác sĩ mới
          </Button>
        </div>

        {/* Doctors Grid */}
        {loading ? (
          <div className="glass-card rounded-[28px] p-12 flex flex-col items-center justify-center gap-3 text-gray-600">
            <div className="w-6 h-6 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold">Đang tải danh sách bác sĩ...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="glass-card rounded-[28px] p-5 flex flex-col justify-between space-y-4 hover:border-[#22c55e]/50 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3.5">
                    <img
                      src={doc.avatar_url || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80'}
                      alt={doc.full_name}
                      className="w-16 h-16 rounded-2xl object-cover border border-gray-200 shrink-0"
                    />
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-[#16a34a] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 inline-block">
                        {doc.degree}
                      </span>
                      <h4 className="text-base font-extrabold text-[#1a2e24]">
                        {doc.full_name}
                      </h4>
                      <div className="text-xs text-gray-600 flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-[#22c55e]" />
                        <span>{doc.specialty?.name || 'Đa khoa'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-gray-600 border-t border-gray-100 pt-2.5">
                    <div className="flex items-center gap-1.5 truncate">
                      <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{doc.clinic?.name || 'Bệnh viện liên kết'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 font-semibold text-gray-700">
                        <Award className="w-3.5 h-3.5 text-[#22c55e]" />
                        {doc.experience_years} năm KN
                      </span>
                      <span className="font-extrabold text-[#1a2e24]">
                        {formatCurrency(doc.consultation_fee)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <Link
                    href={`/doctors/${doc.id}`}
                    target="_blank"
                    className="text-[11px] font-bold text-[#22c55e] hover:underline"
                  >
                    Xem trang chi tiết
                  </Link>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(doc)}
                      className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors cursor-pointer"
                      title="Chỉnh sửa"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(doc.id, doc.full_name)}
                      className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Modal Create / Edit Doctor */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="glass-card rounded-[32px] p-6 sm:p-8 max-w-lg w-full bg-white shadow-2xl space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
              
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-base font-extrabold text-[#1a2e24]">
                  {editingId ? 'Chỉnh Sửa Hồ Sơ Bác Sĩ' : 'Thêm Bác Sĩ Mới'}
                </h3>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Họ và tên bác sĩ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="VD: TS.BS Lê Hoàng Nam"
                    className="w-full h-10 px-3.5 rounded-xl border border-gray-200 font-semibold focus:ring-2 focus:ring-[#22c55e] outline-hidden bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Học hàm, học vị
                    </label>
                    <input
                      type="text"
                      value={formDegree}
                      onChange={(e) => setFormDegree(e.target.value)}
                      placeholder="VD: Tiến sĩ, Bác sĩ"
                      className="w-full h-10 px-3.5 rounded-xl border border-gray-200 font-medium focus:ring-2 focus:ring-[#22c55e] outline-hidden bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Số năm kinh nghiệm
                    </label>
                    <input
                      type="number"
                      value={formExp}
                      onChange={(e) => setFormExp(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl border border-gray-200 font-medium focus:ring-2 focus:ring-[#22c55e] outline-hidden bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Chuyên khoa
                    </label>
                    <select
                      value={formSpecialtyId}
                      onChange={(e) => setFormSpecialtyId(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 font-medium focus:ring-2 focus:ring-[#22c55e] outline-hidden bg-white cursor-pointer"
                    >
                      {specialties.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Cơ sở y tế công tác
                    </label>
                    <select
                      value={formClinicId}
                      onChange={(e) => setFormClinicId(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 font-medium focus:ring-2 focus:ring-[#22c55e] outline-hidden bg-white cursor-pointer"
                    >
                      {clinics.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Giá khám niêm yết (VNĐ)
                  </label>
                  <input
                    type="number"
                    step="10000"
                    value={formFee}
                    onChange={(e) => setFormFee(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-gray-200 font-bold focus:ring-2 focus:ring-[#22c55e] outline-hidden bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Link ảnh chân dung (URL)
                  </label>
                  <input
                    type="url"
                    value={formAvatar}
                    onChange={(e) => setFormAvatar(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full h-10 px-3.5 rounded-xl border border-gray-200 font-medium focus:ring-2 focus:ring-[#22c55e] outline-hidden bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Tiểu sử & Thành tựu chuyên môn
                  </label>
                  <textarea
                    rows={3}
                    value={formBio}
                    onChange={(e) => setFormBio(e.target.value)}
                    placeholder="Mô tả quá trình đào tạo, chức vụ từng đảm nhiệm..."
                    className="w-full p-3 rounded-xl border border-gray-200 font-medium focus:ring-2 focus:ring-[#22c55e] outline-hidden bg-white resize-none"
                  />
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-50 text-rose-700 font-semibold">
                    {errorMsg}
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setModalOpen(false)}
                    disabled={saving}
                    className="h-10 px-5 rounded-full border-gray-200 text-xs font-bold cursor-pointer"
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="h-10 px-5 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs font-bold cursor-pointer"
                  >
                    {saving ? 'Đang lưu...' : 'Lưu hồ sơ bác sĩ'}
                  </Button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
