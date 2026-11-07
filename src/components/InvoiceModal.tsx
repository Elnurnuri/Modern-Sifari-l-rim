import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Check, 
  ShieldCheck, 
  FileCheck,
  Building2,
  QrCode
} from 'lucide-react';
import { OrderData } from '../types/order';
import { formatAzn, calculateOrderTotals } from '../utils/orderTracker';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderData;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  if (!isOpen) return null;

  const totals = calculateOrderTotals(order.items, order.shippingFee, order.discount);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="invoice-modal-title"
      >
        {/* Modal Controls Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-600" />
            <h3 id="invoice-modal-title" className="text-base font-bold text-slate-900">
              Rəsmi Elektron Qaimə / ƏDV Çeki
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl transition-colors shadow-2xs"
            >
              <Printer className="w-4 h-4" />
              <span>Çap et</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Qaimə pəncərəsini bağla"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Document Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 bg-white" id="printable-invoice">
          {/* Top Brand & Fiscal Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-emerald-700">panshop<span className="text-emerald-500">.az</span></span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                  Rəsmi Çek
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                "PANSHOP MMC" · VÖEN: 1302948171
              </p>
              <p className="text-xs text-slate-500">
                Bakı şəhəri, Nizami r., Heydər Əliyev pr. 115
              </p>
            </div>

            <div className="text-left sm:text-right text-xs space-y-1">
              <p className="font-mono font-bold text-slate-900">
                Qaimə №: <span className="text-emerald-700">PNS-INV-2026-09A</span>
              </p>
              <p className="text-slate-500">Tarix: {order.createdAt}</p>
              <p className="font-mono text-slate-500 text-[11px]">
                Əməliyyat ID: {order.transactionId}
              </p>
            </div>
          </div>

          {/* Parties: Buyer & Seller */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Satıcı Məlumatları
              </span>
              <p className="font-bold text-slate-900">{order.seller.name}</p>
              <p className="text-slate-600">Satıcı Kodu: {order.seller.code}</p>
              <p className="text-slate-600">VÖEN: 1405928171</p>
              <p className="text-slate-600">Status: Təsdiqlənmiş Tərəfdaş</p>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Alıcı Məlumatları
              </span>
              <p className="font-bold text-slate-900">{order.deliveryAddress.fullName}</p>
              <p className="text-slate-600">{order.deliveryAddress.phone}</p>
              <p className="text-slate-600">{order.deliveryAddress.city}, {order.deliveryAddress.district}</p>
              <p className="text-slate-600">{order.deliveryAddress.street}</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Məhsulun adı</th>
                  <th className="py-2.5 px-3 text-center">Say</th>
                  <th className="py-2.5 px-4 text-right">Qiymət</th>
                  <th className="py-2.5 px-4 text-right">Cəmi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {order.items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{item.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {item.attributes.size} · {item.attributes.color} · SKU: {item.sku}
                      </p>
                    </td>
                    <td className="py-3 px-3 text-center font-semibold">{item.quantity}</td>
                    <td className="py-3 px-4 text-right tabular-nums">{formatAzn(item.price)}</td>
                    <td className="py-3 px-4 text-right font-bold tabular-nums">
                      {formatAzn(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Breakdown & Fiscal QR */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 w-full sm:w-auto">
              {/* QR Code graphic */}
              <div className="w-16 h-16 bg-white p-1 rounded-xl border border-slate-200 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-full h-full text-slate-900">
                  <path fill="currentColor" d="M2 2h8v8H2zm2 2v4h4V4zm-2 10h8v8H2zm2 2v4h4v-4zm10-14h8v8h-8zm2 2v4h4V4zm3 8h1v2h-1zm-3 2h2v1h-2zm4 0h2v2h-2zm-2 2h2v2h-2zm3 2h2v2h-2zm-3 0h1v2h-1zm0-4h2v2h-2zm-2-2h1v1h-1z" />
                </svg>
              </div>
              <div className="text-[11px] text-slate-600">
                <p className="font-bold text-slate-900">Elektron Yoxlanış QR</p>
                <p>Vergilər Nazirliyi elektron portalında yoxlana bilər.</p>
                <span className="font-mono text-emerald-700 font-semibold mt-0.5 block">
                  Fiskal №: 902847192847
                </span>
              </div>
            </div>

            <div className="w-full sm:w-64 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Ara cəm:</span>
                <span className="font-semibold text-slate-900 tabular-nums">{formatAzn(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Çatdırılma:</span>
                <span className="font-semibold text-emerald-700">0.00 ₼</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>ƏDV (18% daxil):</span>
                <span className="tabular-nums">{formatAzn(totals.vatIncluded)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-sm font-bold text-slate-900">
                <span>Ödənilən məbləğ:</span>
                <span className="text-emerald-700 text-base tabular-nums">{formatAzn(totals.total)}</span>
              </div>
              <div className="text-[10px] text-slate-400 text-right">
                Ödəniş növü: Panshop Wallet (Uğurlu)
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Panshop.az tərəfindən avtomatik tərtib edilmişdir.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors"
          >
            Bağla
          </button>
        </div>
      </div>
    </div>
  );
};
