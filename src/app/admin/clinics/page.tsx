'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  MapPin, 
  Phone, 
  Stethoscope 
} from 'lucide-react';
import { AdminSubnav } from '@/components/admin/AdminSubnav';
import { 
  getAllAdminClinics, 
  createClinic, 
  updateClinic, 
  deleteClinic 
} from '@/lib/services/admin';
import type { ClinicWithStats } from '@/lib/services/clinics';
import { Button } from '@/components/ui/button';

export default function AdminClinicsPage() {
  const [clinics, setClinics] = useState<ClinicWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAllAdminClinics();
      setClinics(data);
    } catch (err) {
      console.error('Failed to load clinics for admin:', err);
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
    setFormAddress('');
    setFormPhone('1900 2805');
    setFormDescription('');
    setFormImage('https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=80');
    setErrorMsg(null);
    setModalOpen(true);
  };

  const openEditModal = (clinic: ClinicWithStats) => {
    setEditingId(clinic.id);
    setFormName(clinic.name);
    setFormAddress(clinic.address);
    setFormPhone(clinic.phone || '');
    setFormDescription(clinic.description || '');
    setFormImage(clinic.image_url || '');
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formAddress.trim()) {
      setErrorMsg('Vui lòng nhập tên cơ sở y tế và địa chỉ.');
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    try {
      if (editingId) {
        const res = await updateClinic(editingId, {
          name: formName.trim(),
          address: formAddress.trim(),
          phone: formPhone.trim() || null,
          description: formDescription.trim() || null,
          image_url: formImage.trim() || null,
        });
        if (!res.success) {
          setErrorMsg(res.error || 'Lỗi cập nhật cơ sở y tế');
          setSaving(false);
          return;
        }
      } else {
        const res = await createClinic({
          name: formName.trim(),
          address: formAddress.trim(),
          phone: formPhone.trim(),
          description: formDescription.trim(),
          image_url: formImage.trim(),
        });
        if (!res.success) {
          setErrorMsg(res.error || 'Lỗi tạo cơ sở y tế');
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
    if (!confirm(`Bạn có chắc chắn muốn xóa cơ sở y tế "${name}" không?`)) return;
    await deleteClinic(id);
    loadData();
  };

  const filteredClinics = clinics.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-[#f8faf9] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <AdminSubnav
          title="Quản Lý Cơ Sở Y Tế & Bệnh Viện"
          subtitle="Quản lý mạng lưới bệnh viện công lập, phòng khám đa khoa và trung tâm y tế chất lượng cao."
        />

        {/* Action Header */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên bệnh viện, địa chỉ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#22c55e] outline-hidden bg-white/90"
            />
          </div>

          <Button
            onClick={openCreateModal}
            className="h-10 px-5 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" /> Thêm cơ sở y tế mới
          </Button>
        </div>

        {/* Clinics Grid */}
        {loading ? (
          <div className="glass-card rounded-[28px] p-12 flex flex-col items-center justify-center gap-3 text-gray-600">
            <div className="w-6 h-6 border-2 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold">Đang tải danh sách cơ sở y tế...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClinics.map((clinic) => (
              <div
                key={clinic.id}
                className="glass-card rounded-[28px] overflow-hidden p-5 flex flex-col justify-between space-y-4 hover:border-[#22c55e]/50 transition-all group"
              >
                <div className="space-y-3">
                  <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-gray-100">
                    <img
                      src={clinic.image_url || 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=80'}
                      alt={clinic.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-base font-extrabold text-[#1a2e24]">
                      {clinic.name}
                    </h4>

                    <div className="text-xs text-gray-600 flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{clinic.address}</span>
                    </div>

                    {clinic.phone && (
                      <div className="text-xs text-gray-500 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span>{clinic.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <Link
                    href={`/clinics/${clinic.slug}`}
                    target="_blank"
                    className="text-[11px] font-bold text-[#22c55e] hover:underline"
                  >
                    Xem trên website
                  </Link>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(clinic)}
                      className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors cursor-pointer"
                      title="Chỉnh sửa"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(clinic.id, clinic.name)}
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

        {/* Modal Create / Edit Clinic */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="glass-card rounded-[32px] p-6 sm:p-8 max-w-md w-full bg-white shadow-2xl space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
              
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-base font-extrabold text-[#1a2e24]">
                  {editingId ? 'Chỉnh Sửa Cơ Sở Y Tế' : 'Thêm Cơ Sở Y Tế Mới'}
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
                    Tên cơ sở y tế / bệnh viện <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="VD: Bệnh viện Quân Y 175"
                    className="w-full h-10 px-3.5 rounded-xl border border-gray-200 font-semibold focus:ring-2 focus:ring-[#22c55e] outline-hidden bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Địa chỉ cụ thể <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    placeholder="Số nhà, đường, phường, quận/huyện, tỉnh/thành..."
                    className="w-full h-10 px-3.5 rounded-xl border border-gray-200 font-medium focus:ring-2 focus:ring-[#22c55e] outline-hidden bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Tổng đài / Hotline tiếp đón
                  </label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="VD: 028 3855 4269"
                    className="w-full h-10 px-3.5 rounded-xl border border-gray-200 font-medium focus:ring-2 focus:ring-[#22c55e] outline-hidden bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Link ảnh cơ sở y tế (URL)
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
                    Mô tả giới thiệu
                  </label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Giới thiệu về cơ sở vật chất, thế mạnh khám chữa bệnh..."
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
                    {saving ? 'Đang lưu...' : 'Lưu cơ sở y tế'}
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
