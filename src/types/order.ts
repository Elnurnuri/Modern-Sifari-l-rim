export type OrderStage = 
  | 'sifaris_alindi'
  | 'hazirlanir'
  | 'istehsalda'
  | 'gonderilib'
  | 'tehvil_verilib';

export interface OrderItem {
  id: string;
  name: string;
  category: string;
  sellerName: string;
  sellerId: string;
  sellerRating: number;
  sellerVerified: boolean;
  price: number;
  quantity: number;
  attributes: {
    size?: string;
    color?: string;
    pieceCount?: string;
  };
  sku: string;
}

export interface TimelineEvent {
  stage: OrderStage;
  title: string;
  description: string;
  timestamp: string;
  location: string;
  completed: boolean;
  current: boolean;
}

export interface CourierInfo {
  name: string;
  phone: string;
  rating: number;
  deliveriesCount: number;
  vehicle: string;
  vehiclePlate: string;
  currentLocationName: string;
  estimatedMinutes: number;
}

export interface OrderData {
  orderId: string;
  trackingNumber: string;
  transactionId: string;
  createdAt: string;
  estimatedDeliveryDate: string;
  paymentMethod: {
    type: 'wallet' | 'card' | 'cash';
    name: string;
    details: string;
  };
  deliveryAddress: {
    fullName: string;
    phone: string;
    city: string;
    district: string;
    street: string;
    notes?: string;
  };
  seller: {
    name: string;
    code: string;
    rating: number;
    responseTime: string;
    totalOrders: number;
  };
  items: OrderItem[];
  shippingFee: number;
  discount: number;
  currentStage: OrderStage;
  timeline: TimelineEvent[];
  courier?: CourierInfo;
}
