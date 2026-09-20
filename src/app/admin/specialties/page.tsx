'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Layers, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Check, 
  AlertCircle, 
  Stethoscope, 
  Image as ImageIcon 
} from 'lucide-react';
import { AdminSubnav } from '@/components/admin/AdminSubnav';
import { 
  getAllAdminSpecialties, 
  createSpecialty, 
  updateSpecialty, 
  deleteSpecialty 
} from '@/lib/services/admin';
import type { SpecialtyWithCount } from '@/lib/services/specialties';
import { Button } from '@/components/ui/button';

export default function AdminSpecialtiesPage() {
  const [specialties, setSpecialties] = useState<SpecialtyWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAllAdminSpecialties();
      setSpecialties(data);
    } catch (err) {
      console.error('Failed to load specialties for admin:', err);
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
    setFormDescription('');
    setFormImage('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80');
    setErrorMsg(null);
    setModalOpen(true);
  };

  const openEditModal = (spec: SpecialtyWithCount) => {
    setEditingId(spec.id);
    setFormName(spec.name);
    setFormDescription(spec.description || '');
    setFormImage(spec.image_url || '');
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setErrorMsg('Vui lòng nhập tên chuyên khoa.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    try {
      if (editingId) {
        const res = await updateSpecialty(editingId, {
          name: formName.trim(),
          description: formDescription.trim(),
          image_url: formImage.trim() || null,
        });
        if (!res.success) {
          setErrorMsg(res.error || 'Lỗi cập nhật chuyên khoa');
          setSaving(false);
          return;
        }
      } else {
        const res = await createSpecialty({
          name: formName.trim(),
          description: formDescription.trim(),
          image_url: formImage.trim() || undefined,
        });
        if (!res.success) {
          setErrorMsg(res.error || 'Lỗi tạo chuyên khoa');
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
    if (!confirm(`Bạn có chắc chắn muốn xóa chuyên khoa "${name}" không?`)) return;
    await deleteSpecialty(id);
    loadData();
  };

  const filteredSpecialties = specialties.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-[#f8faf9] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <AdminSubnav
          title="Quản Lý Chuyên Khoa Y Tế"
          subtitle="Thiết lập danh mục chuyên khoa, biểu tượng, hình ảnh đại diện và liên kết bác sĩ khám."
        />

        {/* Action Header */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm chuyên khoa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#22c55e] outline-hidden bg-white/90"
            />
          </div>

          <Button
            onClick={openCreateModal}
            className="h-10 px-5 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" /> Thêm chuyên khoa mới
          </Button>
        </div>

        {/* Specialties Grid */}
        {loading ? (
          <div className="glass-card rounded-[28px] p-12 flex flex-col items-center justify-center gap-3 text-gray-600">
            <div className="w-6 h-6 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold">Đang tải danh mục chuyên khoa...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpecialties.map((spec) => (
              <div
                key={spec.id}
                className="glass-card rounded-[28px] overflow-hidden p-5 flex flex-col justify-between space-y-4 hover:border-[#22c55e]/50 transition-all group"
              >
                <div className="space-y-3">
                  <div className="relative h-36 w-full rounded-2xl overflow-hidden bg-gray-100">
                    <img
                      src={spec.image_url || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80'}
                      alt={spec.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold flex items-center gap-1">
                      <Stethoscope className="w-3 h-3 text-[#22c55e]" />
                      <span>{spec.doctor_count} bác sĩ</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-extrabold text-[#1a2e24]">
                      {spec.name}
                    </h4>
                    <span className="text-[11px] font-mono text-gray-500 block">
                      /{spec.slug}
                    </span>
                    <p className="text-xs text-gray-600 line-clamp-2 mt-1.5 leading-relaxed">
                      {spec.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <Link
                    href={`/specialties/${spec.slug}`}
                    target="_blank"
                    className="text-[11px] font-bold text-[#22c55e] hover:underline"
                  >
                    Xem trên website
                  </Link>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(spec)}
                      className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors cursor-pointer"
                      title="Chỉnh sửa"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(spec.id, spec.name)}
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

        {/* Modal Create / Edit */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="glass-card rounded-[32px] p-6 sm:p-8 max-w-md w-full bg-white shadow-2xl space-y-5 animate-in zoom-in-95">
              
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-base font-extrabold text-[#1a2e24]">
                  {editingId ? 'Chỉnh Sửa Chuyên Khoa' : 'Thêm Chuyên Khoa Mới'}
                </h3>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Tên chuyên khoa <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="VD: Nhãn Khoa (Mắt)"
                    className="w-full h-10 px-3.5 rounded-xl border border-gray-200 font-semibold focus:ring-2 focus:ring-[#22c55e] outline-hidden bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Link ảnh đại diện (URL)
                  </label>
                  <input
                    type="url"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full h-10 px-3.5 rounded-xl border border-gray-200 font-medium focus:ring-2 focus:ring-[#22c55e] outline-hidden bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Mô tả phạm vi điều trị
                  </label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Mô tả các bệnh lý khám chữa tại chuyên khoa này..."
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
                    {saving ? 'Đang lưu...' : 'Lưu chuyên khoa'}
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
