import React from 'react';
import { 
  Store, 
  ShieldCheck, 
  ExternalLink, 
  MessageSquare, 
  Tag, 
  RotateCcw, 
  Check, 
  Sparkles,
  ShoppingBag,
  Award
} from 'lucide-react';
import { OrderItem } from '../types/order';
import { formatAzn } from '../utils/orderTracker';

interface OrderItemsListProps {
  items: OrderItem[];
  seller: {
    name: string;
    code: string;
    rating: number;
    responseTime: string;
    totalOrders: number;
  };
  onOpenChat: () => void;
  onOpenReview: () => void;
}

export const OrderItemsList: React.FC<OrderItemsListProps> = ({
  items,
  seller,
  onOpenChat,
  onOpenReview,
}) => {
  return (
    <div className="space-y-4">
      {/* Satıcı (Seller) Info Card */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 transition-all hover:border-slate-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-emerald-500/10 shrink-0">
              <Store className="w-6 h-6 text-white" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Rəsmi Satıcı
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Təsdiqlənmiş Mağaza
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                {seller.name}
              </h3>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1 font-semibold text-amber-600">
                  ★ {seller.rating}
                  <span className="text-slate-400 font-normal">({seller.totalOrders}+ satış)</span>
                </span>
                <span>·</span>
                <span>Cavab müddəti: ~{seller.responseTime}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={onOpenChat}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-semibold rounded-xl transition-colors border border-transparent hover:border-emerald-200"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Satıcı ilə yazış</span>
            </button>
            <button
              className="flex items-center gap-1 px-3 py-2 text-slate-500 hover:text-slate-800 text-xs font-medium hover:bg-slate-50 rounded-xl transition-colors"
              title="Mağazanın digər məhsulları"
            >
              <span>Profil</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Məhsullar (Products) Container */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Sifariş olunan məhsullar ({items.length})
            </h3>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Zəmanətli Orijinal Məhsul
          </span>
        </div>

        {/* Product Items List */}
        <div className="divide-y divide-slate-100">
          {items.map((item) => (
            <div key={item.id} className="pt-4 first:pt-0 pb-4 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-5 group">
              {/* Product Visual & Details */}
              <div className="flex items-start gap-4">
                {/* Visual Product Box / Artwork */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-pink-50 via-rose-50/50 to-amber-50/30 border border-pink-100/80 flex items-center justify-center p-2 shrink-0 relative overflow-hidden shadow-xs group-hover:border-pink-200 transition-colors">
                  {/* Stylized SVG of the bow-embroidered girl outfit */}
                  <svg viewBox="0 0 100 100" className="w-full h-full text-pink-400">
                    {/* Cute cute dress silhouette */}
                    <path
                      d="M32 28 C35 22 45 20 50 20 C55 20 65 22 68 28 L78 40 L68 44 L64 36 L66 75 C66 78 64 80 60 80 L40 80 C36 80 34 78 34 75 L36 36 L32 44 L22 40 Z"
                      fill="#fce7f3"
                      stroke="#f472b6"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                    />
                    {/* Pretty bow embroidery on the chest */}
                    <g transform="translate(50, 42)">
                      <circle cx="0" cy="0" r="3" fill="#ec4899" />
                      <path d="M-2 -2 C-10 -7 -10 7 -2 2 Z" fill="#f43f5e" />
                      <path d="M2 -2 C10 -7 10 7 2 2 Z" fill="#f43f5e" />
                      <path d="M-1 2 L-4 9" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
                      <path d="M1 2 L4 9" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
                    </g>
                    {/* Collar embroidery dots */}
                    <circle cx="45" cy="28" r="1.5" fill="#db2777" />
                    <circle cx="50" cy="29" r="1.5" fill="#db2777" />
                    <circle cx="55" cy="28" r="1.5" fill="#db2777" />
                  </svg>

                  {/* 3-piece badge */}
                  <span className="absolute bottom-1 right-1 text-[9px] font-bold bg-white/90 text-pink-600 px-1.5 py-0.2 rounded-md shadow-2xs border border-pink-100">
                    3-lü
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md">
                      Qız Uşağı Dəsti
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      SKU: {item.sku}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {item.name}
                  </h4>

                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 font-medium">
                    <span>Ölçü: <strong className="text-slate-700">{item.attributes.size || '1-2 yaş'}</strong></span>
                    <span>·</span>
                    <span>Rəng: <strong className="text-slate-700">{item.attributes.color || 'Çəhrayı'}</strong></span>
                    <span>·</span>
                    <span>Dəst: <strong className="text-slate-700">{item.attributes.pieceCount || '3 hissəli'}</strong></span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                      <Check className="w-3 h-3 text-emerald-600" />
                      14 gün ödənişsiz qaytarılma
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500 font-medium">
                      Miqdar: <strong className="text-slate-800">{item.quantity} ədəd</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Action Row */}
              <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 gap-2 shrink-0">
                <div className="text-left md:text-right">
                  <div className="text-base sm:text-xl font-black text-slate-900 tabular-nums">
                    {formatAzn(item.price)}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    ƏDV (18%) daxildir
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={onOpenReview}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Rəy yaz
                  </button>
                  <button
                    onClick={() => alert('Məhsul səbətinizə əlavə olundu!')}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Təkrar sifariş</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
