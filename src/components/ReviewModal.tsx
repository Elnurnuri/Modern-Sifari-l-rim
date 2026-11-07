import React, { useState } from 'react';
import { X, Star, Check, Sparkles } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  itemName,
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 id="review-modal-title" className="text-base font-bold text-slate-900">
            Məhsulu qiymətləndirin
          </h3>
          <button
            onClick={onClose}
            aria-label="Pəncərəni bağla"
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Rəyiniz üçün təşəkkür edirik!</h4>
            <p className="text-xs text-slate-500">
              Rəyiniz yoxlanışdan sonra Panshop-da dərc olunacaq.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <span className="text-xs text-slate-500 block">Məhsul:</span>
              <p className="text-sm font-bold text-slate-800 line-clamp-1">{itemName}</p>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-700 block mb-1">
                Reytinq seçin:
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="review-text" className="text-xs font-semibold text-slate-700 block mb-1">
                Fikirləriniz (parçası, ölçüsü, çatdırılma):
              </label>
              <textarea
                id="review-text"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Məhsul haqqında fikirlərinizi bölüşün..."
                className="w-full p-3 bg-slate-50 focus:bg-white text-xs text-slate-900 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
            >
              Rəyi göndər
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
