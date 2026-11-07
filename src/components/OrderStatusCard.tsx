import React from 'react';
import { 
  Clock, 
  Calendar, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  FileText, 
  MessageSquare, 
  PhoneCall,
  Sparkles,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { OrderStage, CourierInfo } from '../types/order';

interface OrderStatusCardProps {
  currentStage: OrderStage;
  orderDate: string;
  estimatedDate: string;
  onOpenInvoice: () => void;
  onOpenChat: () => void;
  onOpenMap: () => void;
  courier?: CourierInfo;
}

export const OrderStatusCard: React.FC<OrderStatusCardProps> = ({
  currentStage,
  orderDate,
  estimatedDate,
  onOpenInvoice,
  onOpenChat,
  onOpenMap,
  courier,
}) => {
  const getStageContent = () => {
    switch (currentStage) {
      case 'sifaris_alindi':
        return {
          title: 'Sifariş qəbul edildi və ödəniş təsdiqləndi',
          subtitle: 'Satıcı sifarişi təsdiqləmək və anbara yönləndirmək üçün nəzərdən keçirir.',
          badge: 'Sifariş İşlənir',
          estimatedText: 'Təxmini təhvil tarixi:',
          accentBg: 'from-emerald-700 via-emerald-800 to-teal-900',
        };
      case 'hazirlanir':
        return {
          title: 'Məhsul anbarda qablaşdırılır',
          subtitle: 'Satıcı Elnur660 sifarişi qutulayır və Panshop etiketlərini yerləşdirir.',
          badge: 'Hazırlıq Mərhələsində',
          estimatedText: 'Təxmini kuryerə verilmə:',
          accentBg: 'from-emerald-800 via-teal-900 to-slate-900',
        };
      case 'istehsalda':
        return {
          title: 'Məhsul xüsusi naxış və keyfiyyət yoxlanışındadır',
          subtitle: 'Bant naxışlı dəstin parçası və tikişləri texniki nəzarətdən keçirilir.',
          badge: 'Keyfiyyət Nəzarətində',
          estimatedText: 'Təxmini tamamlama:',
          accentBg: 'from-teal-800 via-emerald-900 to-slate-900',
        };
      case 'gonderilib':
        return {
          title: 'Kuryer yoldadır — ünvanınıza yaxınlaşır',
          subtitle: `Kuryer ${courier?.name || 'Kamran Ə.'} bağlamanı ünvana çatdırır. Təxmini 15-20 dəqiqəyə çatacaq.`,
          badge: 'Çatdırılma Yolunda',
          estimatedText: 'Gözlənilən təhvil saatı:',
          accentBg: 'from-emerald-600 via-teal-800 to-cyan-950',
        };
      case 'tehvil_verilib':
        return {
          title: 'Sifariş uğurla təhvil verildi',
          subtitle: 'Məhsul alıcıya çatdırıldı. Panshop-u seçdiyiniz üçün təşəkkür edirik!',
          badge: 'Tamamlandı',
          estimatedText: 'Təhvil verildi:',
          accentBg: 'from-emerald-800 via-green-900 to-emerald-950',
        };
    }
  };

  const stageInfo = getStageContent();

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stageInfo.accentBg} text-white p-6 sm:p-8 shadow-xl border border-emerald-600/30`}>
      {/* Subtle modern background decorative shapes */}
      <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div className="absolute right-32 -bottom-20 w-80 h-80 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />

      <div className="relative z-10">
        {/* Top bar with Status Badge & Date */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse ring-4 ring-emerald-400/20" />
            <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/15 text-emerald-100">
              {stageInfo.badge}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-100/90 font-medium">
            <Calendar className="w-3.5 h-3.5 text-emerald-300" />
            <span>Sifariş tarixi: <strong className="text-white">{orderDate}</strong></span>
          </div>
        </div>

        {/* Main Status Headline */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white max-w-2xl text-balance">
          {stageInfo.title}
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100/90 mt-2 max-w-2xl leading-relaxed">
          {stageInfo.subtitle}
        </p>

        {/* Delivery ETA & Guarantee Info Strip */}
        <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
              <Clock className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <span className="text-[11px] text-emerald-200/80 block uppercase tracking-wider font-semibold">
                {stageInfo.estimatedText}
              </span>
              <span className="text-sm sm:text-base font-bold text-white tracking-tight">
                {estimatedDate}
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center flex-wrap gap-2.5">
            <button
              onClick={onOpenChat}
              className="flex items-center gap-2 px-3.5 py-2 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white rounded-xl text-xs font-semibold backdrop-blur-sm border border-white/20 transition-all shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Satıcı ilə yazış</span>
            </button>

            <button
              onClick={onOpenInvoice}
              className="flex items-center gap-2 px-3.5 py-2 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white rounded-xl text-xs font-semibold backdrop-blur-sm border border-white/20 transition-all shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Elektron Çek</span>
            </button>

            <button
              onClick={onOpenMap}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-sm"
            >
              <MapPin className="w-3.5 h-3.5 text-slate-950" />
              <span>Kuryer Xəritəsi</span>
            </button>
          </div>
        </div>

        {/* Courier Active Strip (only when stage is gonderilib or has courier) */}
        {currentStage === 'gonderilib' && courier && (
          <div className="mt-4 p-3.5 bg-black/20 backdrop-blur-md rounded-xl border border-white/15 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs ring-2 ring-emerald-400/30">
                <Truck className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{courier.name}</span>
                  <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-1.5 py-0.2 rounded-md font-semibold">
                    ★ {courier.rating}
                  </span>
                </div>
                <span className="text-[11px] text-emerald-200/80">
                  {courier.vehicle} ({courier.vehiclePlate}) · {courier.currentLocationName}
                </span>
              </div>
            </div>

            <a
              href={`tel:${courier.phone}`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors shrink-0"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Əlaqə</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
