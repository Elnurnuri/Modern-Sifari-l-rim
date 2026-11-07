/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  Share2, 
  RotateCw, 
  FileText, 
  MessageSquare, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  HelpCircle,
  Truck,
  Heart,
  ExternalLink,
  Check
} from 'lucide-react';
import { OrderProgressTracker } from './components/OrderProgressTracker';
import { OrderStatusCard } from './components/OrderStatusCard';
import { OrderItemsList } from './components/OrderItemsList';
import { OrderSummaryDetails } from './components/OrderSummaryDetails';
import { OrderTimelineLog } from './components/OrderTimelineLog';
import { CourierTrackingMapModal } from './components/CourierTrackingMapModal';
import { SellerChatModal } from './components/SellerChatModal';
import { InvoiceModal } from './components/InvoiceModal';
import { ReviewModal } from './components/ReviewModal';
import { OrderData, OrderStage } from './types/order';
import { calculateTimeline } from './utils/orderTracker';

export default function App() {
  const [activeTab, setActiveTab] = useState<'izleme' | 'magaza' | 'qaydalar'>('izleme');
  
  // Interactive Order Stage (starts at 'sifaris_alindi' like user's screenshot)
  const [currentStage, setCurrentStage] = useState<OrderStage>('sifaris_alindi');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);

  // Modals state
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // Initial order data matching user's screenshot
  const initialOrderData: OrderData = {
    orderId: 'd22b7225-2586-4353-b943-356b73ef59f3',
    trackingNumber: 'AZ-PNS-892401',
    transactionId: 'wallet-payment-09abdd31',
    createdAt: '24 oktyabr 2026 23:42',
    estimatedDeliveryDate: '26 Oktyabr 2026, 14:00 - 18:00',
    paymentMethod: {
      type: 'wallet',
      name: 'Panshop Cüzdan',
      details: 'wallet-payment-09abdd31',
    },
    deliveryAddress: {
      fullName: 'Elnur Nuri',
      phone: '+994 55 455 ** 01',
      city: 'Bakı şəhəri',
      district: 'Nərimanov rayonu',
      street: 'Təbriz küçəsi 45, mənzil 12',
      notes: 'Zəhmət olmasa çatdırmazdan əvvəl zəng edin.',
    },
    seller: {
      name: "Elnur660's Store 7932",
      code: 'STORE-7932',
      rating: 4.9,
      responseTime: '15 dəqiqə',
      totalOrders: 7932,
    },
    items: [
      {
        id: 'item-1',
        name: 'Bant naxışlı qız uşağı geyim dəsti (3-lü)',
        category: 'Uşaq geyimləri',
        sellerName: "Elnur660's Store 7932",
        sellerId: '7932',
        sellerRating: 4.9,
        sellerVerified: true,
        price: 10.87,
        quantity: 1,
        attributes: {
          size: '1-2 yaş (86-92 sm)',
          color: 'Pudra Çəhrayı & Süd ağ',
          pieceCount: '3-lü dəst (Köynək + Şalvar + Saç bantı)',
        },
        sku: 'PNS-KID-7932-BANT',
      },
    ],
    shippingFee: 0.00,
    discount: 0.00,
    currentStage: 'sifaris_alindi',
    timeline: calculateTimeline('sifaris_alindi'),
    courier: {
      name: 'Kamran Əliyev',
      phone: '+994 50 123 45 67',
      rating: 4.95,
      deliveriesCount: 1420,
      vehicle: 'Express Honda Scooter',
      vehiclePlate: '99-KJ-412',
      currentLocationName: 'Heydər Əliyev mərkəzi yaxınlığı',
      estimatedMinutes: 18,
    },
  };

  const [order, setOrder] = useState<OrderData>(initialOrderData);

  const handleStageChange = (newStage: OrderStage) => {
    setCurrentStage(newStage);
    setOrder((prev) => ({
      ...prev,
      currentStage: newStage,
      timeline: calculateTimeline(newStage, prev.createdAt),
    }));

    triggerToast(`Status yeniləndi: ${newStage.replace('_', ' ').toUpperCase()}`);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      triggerToast('Sifariş məlumatları yeniləndi!');
    }, 600);
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 2500);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      triggerToast('İzləmə linki kopyalandı!');
    }
  };

  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f8fa] flex flex-col font-sans text-slate-900">
      {/* Google Maps Quota Banner if exceeded */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-bottom-5 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{showToast}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
        {/* Breadcrumb Navigation & Top Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 font-medium overflow-x-auto whitespace-nowrap">
            <span className="font-bold text-emerald-700">Panshop</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Sifarişlərim</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-900 font-semibold truncate max-w-[200px] sm:max-w-none">
              Sifariş #{order.orderId}
            </span>
          </nav>

          {/* Quick Header Utility Actions */}
          <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
            <button
              onClick={handleRefresh}
              aria-label="Sifarişi yenilə"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 shadow-2xs transition-colors"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-600' : 'text-slate-500'}`} />
              <span>Yenilə</span>
            </button>

            <button
              onClick={handleShare}
              aria-label="Sifariş linkini paylaş"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 shadow-2xs transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Paylaş</span>
            </button>

            <button
              onClick={() => setIsInvoiceOpen(true)}
              aria-label="Elektron çeki aç"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Qaimə / Çek</span>
            </button>
          </div>
        </div>

        {/* 5-Step Order Progress Tracker */}
        <OrderProgressTracker
          currentStage={currentStage}
          onSelectStage={handleStageChange}
        />

        {/* Elevated Status Hero Banner (replacing the old olive bar) */}
        <OrderStatusCard
          currentStage={currentStage}
          orderDate={order.createdAt}
          estimatedDate={order.estimatedDeliveryDate}
          onOpenInvoice={() => setIsInvoiceOpen(true)}
          onOpenChat={() => setIsChatOpen(true)}
          onOpenMap={() => setIsMapOpen(true)}
          courier={order.courier}
        />

        {/* View Switcher Tabs (İzləmə, Mağaza detalları, Qaydalar) */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('izleme')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'izleme'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            Sifariş və Məhsul Detalları
          </button>

          <button
            onClick={() => setActiveTab('magaza')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'magaza'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            Satıcı & Mağaza Məlumatı
          </button>

          <button
            onClick={() => setActiveTab('qaydalar')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'qaydalar'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            Qaytarılma & Çatdırılma Şərtləri
          </button>
        </div>

        {/* Tab 1: Order Tracking, Items & Summary */}
        {activeTab === 'izleme' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (Items List & Chronological Log) - 7 cols */}
            <div className="lg:col-span-7 space-y-6">
              {/* Product and Seller Card */}
              <OrderItemsList
                items={order.items}
                seller={order.seller}
                onOpenChat={() => setIsChatOpen(true)}
                onOpenReview={() => setIsReviewOpen(true)}
              />

              {/* Detailed Activity & Location Log */}
              <OrderTimelineLog
                timeline={order.timeline}
                currentStage={currentStage}
              />
            </div>

            {/* Right Column (Financial Breakdown, Address, Security) - 5 cols */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-6">
              <OrderSummaryDetails
                order={order}
                onOpenInvoice={() => setIsInvoiceOpen(true)}
                onOpenMap={() => setIsMapOpen(true)}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Seller Information */}
        {activeTab === 'magaza' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-2xl shadow-sm">
                  E
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{order.seller.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Panshop Təsdiqlənmiş Tərəfdaş · 2024-cü ildən fəaliyyət göstərir
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <span className="font-bold text-amber-600">★ 4.9 (7,932 rəy)</span>
                    <span>·</span>
                    <span className="text-emerald-700 font-medium">99.4% Müsbət Rəy</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsChatOpen(true)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Satıcı ilə canlı yazış</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-400 block font-semibold">Göndərilmə sürəti</span>
                <p className="text-sm font-bold text-slate-800 mt-1">Eyni gün içində</p>
                <p className="text-slate-500 mt-0.5">Sifarişlərin 98%-i 12 saatda hazırlanır</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-400 block font-semibold">Məhsul Orijinallığı</span>
                <p className="text-sm font-bold text-emerald-700 mt-1">100% Zəmanətli</p>
                <p className="text-slate-500 mt-0.5">Sertifikatlaşdırılmış uşaq tekstili</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-400 block font-semibold">Qaytarılma Nisbəti</span>
                <p className="text-sm font-bold text-slate-800 mt-1">&lt; 0.8% (Çox aşağı)</p>
                <p className="text-slate-500 mt-0.5">Müştərilərin 99%-i razı qalıb</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Delivery Terms & Returns */}
        {activeTab === 'qaydalar' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-slate-900">
              Panshop Çatdırılma və Geri Qaytarma Zəmanəti
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
              <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>Sürətli Çatdırılma Qaydaları</span>
                </div>
                <p className="leading-relaxed">
                  Bakı və Abşeron ərazisi üzrə bütün sifarişlər 24-48 saat ərzində birbaşa qapıya qədər çatdırılır. Kuryer çatmazdan 30 dəqiqə əvvəl müştəri ilə əlaqə saxlayır.
                </p>
              </div>

              <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-2">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>14 Gün Ərzində Ödənişsiz Qaytarılma</span>
                </div>
                <p className="leading-relaxed">
                  Məhsulun ölçüsü uyğun gəlmədikdə və ya xoşunuza gəlmədikdə, etiketləri zədələnməmək şərtilə 14 gün ərzində kuryeri çağıraraq pulsuz geri qaytara və pulunuzu dərhal ala bilərsiniz.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Interactive Modals */}
      <CourierTrackingMapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        courier={order.courier!}
        deliveryAddress={order.deliveryAddress}
      />

      <SellerChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        sellerName={order.seller.name}
        orderId={order.orderId}
        itemName={order.items[0].name}
      />

      <InvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        order={order}
      />

      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        itemName={order.items[0].name}
      />
    </div>
  );
}
