'use client';

import React, { useState } from 'react';
import { Star, X, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { createReview } from '@/lib/services/reviews';
import { Button } from '@/components/ui/button';
import type { AppointmentWithDetails } from '@/lib/services/appointments';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentWithDetails | null;
  onSuccess: () => void;
}

export function ReviewModal({
  isOpen,
  onClose,
  appointment,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen || !appointment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMsg('Vui lòng chia sẻ cảm nhận của bạn về buổi khám.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await createReview({
        appointment_id: appointment.id,
        doctor_id: appointment.doctor_id,
        patient_id: appointment.patient_id,
        patient_name: appointment.patient_name,
        rating,
        comment: comment.trim(),
      });

      if (!res.success) {
        setErrorMsg(res.error || 'Không thể gửi đánh giá.');
        setSubmitting(false);
        return;
      }

      setSuccessMsg(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi gửi đánh giá');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="glass-card rounded-[32px] p-6 sm:p-8 max-w-md w-full bg-white shadow-2xl space-y-5 animate-in zoom-in-95">
        
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2 text-[#1a2e24] font-extrabold text-base">
            <MessageSquare className="w-5 h-5 text-[#22c55e]" />
            <span>Đánh Giá Buổi Khám Bệnh</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#f8faf9] border border-gray-100 text-xs space-y-1">
          <div className="font-bold text-[#1a2e24]">
            Bác sĩ: {appointment.doctor_info?.full_name}
          </div>
          <div className="text-gray-600">
            {appointment.doctor_info?.clinic_name} • Ngày khám: {appointment.formatted_date}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Star selector */}
          <div className="text-center space-y-2 py-2">
            <span className="font-bold text-gray-700 block">
              Bạn đánh giá chất lượng dịch vụ như thế nào?
            </span>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  onClick={() => setRating(star)}
                  className="p-1 cursor-pointer transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      (hoverRating !== null ? star <= hoverRating : star <= rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-[11px] font-bold text-amber-600 block">
              {rating === 5 ? '⭐ Rất hài lòng - Bác sĩ rất tận tình' : rating === 4 ? '⭐ Hài lòng - Dịch vụ tốt' : rating === 3 ? '⭐ Bình thường' : '⭐ Cần cải thiện'}
            </span>
          </div>

          <div>
            <label className="font-bold text-gray-700 block mb-1">
              Nhận xét chi tiết của bạn <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về thái độ phục vụ, mức độ đúng giờ, sự rõ ràng trong lời dặn của bác sĩ..."
              className="w-full p-3 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-[#22c55e] outline-hidden bg-white resize-none leading-relaxed"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0" />
              <span>Cảm ơn bạn! Đánh giá đã được ghi nhận.</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
              className="h-10 px-5 rounded-full border-gray-200 text-xs font-bold cursor-pointer"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              disabled={submitting || successMsg}
              className="h-10 px-6 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
            </Button>
          </div>

        </form>

      </div>
    </div>
  );
}
