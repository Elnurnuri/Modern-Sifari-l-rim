import React, { useState } from 'react';
import { 
  CreditCard, 
  Wallet, 
  MapPin, 
  Copy, 
  Check, 
  Phone, 
  User, 
  Receipt, 
  HelpCircle, 
  ShieldCheck, 
  ChevronRight,
  Download
} from 'lucide-react';
import { OrderData } from '../types/order';
import { formatAzn, calculateOrderTotals } from '../utils/orderTracker';

interface OrderSummaryDetailsProps {
  order: OrderData;
  onOpenInvoice: () => void;
  onOpenMap: () => void;
}

export const OrderSummaryDetails: React.FC<OrderSummaryDetailsProps> = ({
  order,
  onOpenInvoice,
  onOpenMap,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const totals = calculateOrderTotals(order.items, order.shippingFee, order.discount);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(type);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Transaction & Reference ID Card */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                Maliyyə & İdentifikator
              </span>
              <h4 className="text-sm font-bold text-slate-900">
                Əməliyyat məlumatları
              </h4>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
            <Check className="w-3 h-3 text-emerald-600" />
            Ödənilib
          </span>
        </div>

        <div className="mt-3 space-y-2.5 text-xs">
          {/* Transaction ID */}
          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <span className="text-slate-400 text-[11px] block">Əməliyyat nömrəsi:</span>
              <span className="font-mono font-semibold text-slate-800 break-all select-all">
                {order.transactionId}
              </span>
            </div>
            <button
              onClick={() => handleCopy(order.transactionId, 'tx')}
              aria-label="Əməliyyat nömrəsini kopyala"
              className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
              title="Kopyala"
            >
              {copiedId === 'tx' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Sifariş ID */}
          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <span className="text-slate-400 text-[11px] block">Sifariş kodu:</span>
              <span className="font-mono font-semibold text-slate-800 break-all select-all">
                {order.orderId}
              </span>
            </div>
            <button
              onClick={() => handleCopy(order.orderId, 'order')}
              aria-label="Sifariş kodunu kopyala"
              className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
              title="Kopyala"
            >
              {copiedId === 'order' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Çatdırılma Ünvanı (Delivery Address) */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Çatdırılma ünvanı
            </h4>
          </div>

          <button
            onClick={onOpenMap}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1"
          >
            <span>Xəritədə bax</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-3.5 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>{order.deliveryAddress.fullName}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono">{order.deliveryAddress.phone}</span>
          </div>

          <div className="pt-2 text-slate-700 leading-relaxed bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
            <span className="font-medium">{order.deliveryAddress.city}, {order.deliveryAddress.district}</span>
            <p className="text-slate-500 mt-0.5">{order.deliveryAddress.street}</p>
            {order.deliveryAddress.notes && (
              <p className="text-emerald-700 text-[11px] mt-1 font-medium">
                Qeyd: {order.deliveryAddress.notes}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Ödəniş və Hesablama (Payment & Price Summary) */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Ödəniş xülasəsi
            </h4>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
            <span>Panshop Cüzdan</span>
          </div>
        </div>

        <div className="mt-3.5 space-y-2.5 text-xs text-slate-600">
          <div className="flex justify-between items-center">
            <span>Məhsulların dəyəri ({totals.itemCount} ədəd)</span>
            <span className="font-bold text-slate-900 tabular-nums">{formatAzn(totals.subtotal)}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <span>Çatdırılma</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                Panshop Express
              </span>
            </div>
            <span className="font-bold text-emerald-700">0.00 ₼ (Pulsuz)</span>
          </div>

          {totals.discount > 0 && (
            <div className="flex justify-between items-center text-emerald-600">
              <span>Promokod endirimi</span>
              <span className="font-bold tabular-nums">-{formatAzn(totals.discount)}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-slate-400 text-[11px]">
            <span>Daxil olan ƏDV (18%)</span>
            <span className="tabular-nums">{formatAzn(totals.vatIncluded)}</span>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
            <div>
              <span className="text-sm font-bold text-slate-900 block">Yekun ödəniş</span>
              <span className="text-[10px] text-slate-400 font-medium">Bütün vergilər və xidmətlər daxil</span>
            </div>
            <div className="text-xl font-extrabold text-emerald-700 tabular-nums">
              {formatAzn(totals.total)}
            </div>
          </div>
        </div>

        {/* Download Invoice Button */}
        <button
          onClick={onOpenInvoice}
          className="w-full mt-4 py-2.5 px-4 bg-slate-100 hover:bg-slate-200/80 active:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-200"
        >
          <Download className="w-3.5 h-3.5 text-slate-600" />
          <span>Rəsmi elektron qaiməni endir (PDF)</span>
        </button>
      </div>

      {/* Panshop Zəmanət və Təhlükəsizlik Card */}
      <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-100 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
        <div className="text-xs">
          <p className="font-bold text-emerald-950">Panshop Alıcı Qorunması Zəmanəti</p>
          <p className="text-emerald-800/90 mt-0.5 leading-relaxed">
            Məhsul təsvirə uyğun gəlmədikdə və ya zədəli çatdırıldıqda 14 gün ərzində dərhal tam geri ödəniş təmin edilir.
          </p>
        </div>
      </div>
    </div>
  );
};
