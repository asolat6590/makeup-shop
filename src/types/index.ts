export type ProductCategory = 
  | 'skincare' 
  | 'makeup' 
  | 'perfume' 
  | 'body' 
  | 'sets';

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: ProductCategory;
  categoryLabel: string;
  price: number; // in USD
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  volume: string; // e.g. "50 мл", "30 г"
  inStock: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  images: string[];
  description: string;
  benefits: string[];
  ingredients: string;
  usageInstructions: string;
  skinType: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PaymentMethod = 'stripe' | 'payme';

export type OrderStatus = 
  | 'pending'    // ожидает оплаты
  | 'paid'       // оплачен
  | 'processing' // собирается на складе
  | 'shipped'    // передан курьеру
  | 'delivered'  // доставлен
  | 'cancelled'; // отменён

export interface DeliveryDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  volume: string;
}

export interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'succeeded' | 'failed' | 'refunded';
  paymentId?: string; // Stripe session id or Payme transaction id
  customer: DeliveryDetails;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  discountCode?: string;
  total: number;
}

export interface PaymeRpcRequest {
  method: string;
  params: Record<string, any>;
  id: number | string;
}

export interface PaymeRpcResponse {
  jsonrpc?: string;
  id: number | string;
  result?: any;
  error?: {
    code: number;
    message: {
      ru: string;
      uz: string;
      en: string;
    };
    data?: any;
  };
}
