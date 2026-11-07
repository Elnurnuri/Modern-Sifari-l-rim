import { OrderStage, TimelineEvent, OrderItem } from '../types/order';

export const ORDER_STAGES: {
  key: OrderStage;
  labelAz: string;
  labelEn: string;
  iconName: string;
  shortDesc: string;
}[] = [
  {
    key: 'sifaris_alindi',
    labelAz: 'Sifariş alındı',
    labelEn: 'Order Received',
    iconName: 'Clock',
    shortDesc: 'Sifariş qeydə alındı və ödəniş təsdiqləndi',
  },
  {
    key: 'hazirlanir',
    labelAz: 'Hazırlanır',
    labelEn: 'Preparing',
    iconName: 'Package',
    shortDesc: 'Məhsul anbardan seçilir və qablaşdırılır',
  },
  {
    key: 'istehsalda',
    labelAz: 'İstehsalda',
    labelEn: 'In Production',
    iconName: 'Factory',
    shortDesc: 'Məhsulun keyfiyyət yoxlanışı və xüsusi naxış işlənməsi',
  },
  {
    key: 'gonderilib',
    labelAz: 'Göndərilib',
    labelEn: 'Shipped',
    iconName: 'Truck',
    shortDesc: 'Kuryerə təhvil verildi və çatdırılma yolundadır',
  },
  {
    key: 'tehvil_verilib',
    labelAz: 'Təhvil verilib',
    labelEn: 'Delivered',
    iconName: 'CheckCircle2',
    shortDesc: 'Sifariş müştəriyə uğurla təhvil verildi',
  },
];

export function getStageIndex(stage: OrderStage): number {
  return ORDER_STAGES.findIndex((s) => s.key === stage);
}

export function calculateTimeline(
  currentStage: OrderStage,
  orderDateStr: string = '2026-10-24 23:42'
): TimelineEvent[] {
  const currentIndex = getStageIndex(currentStage);

  const defaultEvents: { stage: OrderStage; title: string; desc: string; loc: string; time: string }[] = [
    {
      stage: 'sifaris_alindi',
      title: 'Sifariş alındı və təsdiqləndi',
      desc: 'Panshop sistemi tərəfindən ödəniş yoxlanıldı və qeydə alındı.',
      loc: 'Panshop Mərkəzi Serveri, Bakı',
      time: orderDateStr,
    },
    {
      stage: 'hazirlanir',
      title: 'Məhsul anbarda hazırlanır',
      desc: 'Satıcı Elnur660 sifarişi qəbul etdi və bağlamaya hazırlayır.',
      loc: 'Elnur660 Mağazası / Əsas Anbar, Nəsimi',
      time: '25 oktyabr 2026 10:15',
    },
    {
      stage: 'istehsalda',
      title: 'Keyfiyyət yoxlanışı və naxış tamamlama',
      desc: 'Bant naxışlı geyim dəstinin dərzi yoxlanışı tamamlandı.',
      loc: 'Geyim Emalatxanası #4, Bakı',
      time: '25 oktyabr 2026 14:30',
    },
    {
      stage: 'gonderilib',
      title: 'Kuryerə təhvil verildi və çatdırılma yolunda',
      desc: 'Ekspres kuryer bağlamanı qəbul etdi və ünvana doğru hərəkət edir.',
      loc: 'Panshop Logistika Hub #2, Xətai',
      time: '26 oktyabr 2026 11:20',
    },
    {
      stage: 'tehvil_verilib',
      title: 'Müştəriyə təhvil verildi',
      desc: 'Bağlama alıcıya təhvil verildi, imza təsdiqləndi.',
      loc: 'Çatdırılma ünvanı, Bakı şəhəri',
      time: '26 oktyabr 2026 15:45',
    },
  ];

  return defaultEvents.map((evt, idx) => ({
    stage: evt.stage,
    title: evt.title,
    description: evt.desc,
    timestamp: evt.time,
    location: evt.loc,
    completed: idx <= currentIndex,
    current: idx === currentIndex,
  }));
}

export function calculateOrderTotals(
  items: OrderItem[],
  shippingFee: number = 0,
  discount: number = 0
) {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = Math.max(0, subtotal + shippingFee - discount);
  const vatIncluded = Number((total * 0.18).toFixed(2)); // 18% ƏDV daxildir

  return {
    subtotal: Number(subtotal.toFixed(2)),
    shippingFee: Number(shippingFee.toFixed(2)),
    discount: Number(discount.toFixed(2)),
    total: Number(total.toFixed(2)),
    vatIncluded,
    itemCount: items.reduce((acc, item) => acc + item.quantity, 0),
  };
}

export function formatAzn(amount: number): string {
  return `${amount.toFixed(2)} ₼`;
}

export function validateTransactionId(id: string): boolean {
  return /^wallet-payment-[a-z0-9]+$/i.test(id) || /^[a-z0-9-]+$/i.test(id);
}
