import fs from 'fs';
import path from 'path';
import os from 'os';
import { Order, OrderStatus } from '@/types';

// Initial seed orders for demonstration in the admin panel
const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-7821-GB',
    createdAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
    status: 'paid',
    paymentMethod: 'stripe',
    paymentStatus: 'succeeded',
    paymentId: 'pi_test_3OQ18b2eZvKYlo2C1gK9p29L',
    customer: {
      fullName: 'Анастасия Воронова',
      email: 'anastasia.v@example.com',
      phone: '+998 90 123 45 67',
      address: 'ул. Амира Темура, д. 45, кв. 12',
      city: 'Ташкент',
      notes: 'Позвонить за 30 минут до доставки',
    },
    items: [
      {
        productId: 'glow-radiance-serum',
        name: 'Rose Quartz Radiance Serum',
        price: 48,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80',
        volume: '30 мл',
      },
      {
        productId: 'silk-tint-lipstick',
        name: 'Silk Petal Cashmere Lipstick',
        price: 32,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1000&q=80',
        volume: '3.8 г',
      }
    ],
    subtotal: 80,
    shipping: 0,
    discount: 8,
    discountCode: 'GLOW10',
    total: 72,
  },
  {
    id: 'ORD-6542-GB',
    createdAt: new Date(Date.now() - 3600 * 1000 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 16).toISOString(),
    status: 'processing',
    paymentMethod: 'payme',
    paymentStatus: 'succeeded',
    paymentId: 'payme_tx_65df987216a92b',
    customer: {
      fullName: 'Дильноза Каримова',
      email: 'dilnoza.k@example.uz',
      phone: '+998 97 789 12 34',
      address: 'ул. Навои, д. 18, оф. 4',
      city: 'Ташкент',
    },
    items: [
      {
        productId: 'fleur-de-soie-perfume',
        name: 'Fleur De Soie Eau de Parfum',
        price: 95,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80',
        volume: '50 мл',
      }
    ],
    subtotal: 95,
    shipping: 0,
    discount: 0,
    total: 95,
  },
  {
    id: 'ORD-5198-GB',
    createdAt: new Date(Date.now() - 3600 * 1000 * 42).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 20).toISOString(),
    status: 'delivered',
    paymentMethod: 'stripe',
    paymentStatus: 'succeeded',
    paymentId: 'pi_test_2NP74a1eXvJKmo1B0fJ8o18K',
    customer: {
      fullName: 'Елена Смирнова',
      email: 'elena.smirnova@gmail.com',
      phone: '+7 916 555 33 22',
      address: 'Кутузовский пр-т, д. 22, кв. 89',
      city: 'Москва',
    },
    items: [
      {
        productId: 'ultimate-glow-gift-set',
        name: 'The Royal Glow Signature Collection',
        price: 129,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1000&q=80',
        volume: 'Сет из 4 продуктов',
      }
    ],
    subtotal: 129,
    shipping: 0,
    discount: 0,
    total: 129,
  }
];

// Persistent global memory cache across serverless function invocations
declare global {
  // eslint-disable-next-line no-var
  var __glow_orders_cache: Order[] | undefined;
}

if (!globalThis.__glow_orders_cache) {
  globalThis.__glow_orders_cache = [...INITIAL_ORDERS];
}

// In serverless environments like Vercel, the root folder is read-only.
// os.tmpdir() (/tmp) is the only writable filesystem location.
function getStorageFilePath(): string {
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    return path.join(os.tmpdir(), 'glow_beauty_orders.json');
  }
  return path.join(process.cwd(), '.data', 'orders.json');
}

function loadOrdersFromDisk(): Order[] {
  const filePath = getStorageFilePath();
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed: Order[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    // Silently fallback to memory cache if disk is inaccessible
  }
  return globalThis.__glow_orders_cache || INITIAL_ORDERS;
}

function persistOrdersToDisk(orders: Order[]): void {
  const filePath = getStorageFilePath();
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (err) {
    // If filesystem write fails on serverless, in-memory cache still holds the orders!
  }
}

export function getAllOrders(): Order[] {
  // Try loading latest from disk, merge with global memory cache
  const diskOrders = loadOrdersFromDisk();
  const memoryOrders = globalThis.__glow_orders_cache || [];

  // Merge unique orders by ID
  const map = new Map<string, Order>();
  for (const o of INITIAL_ORDERS) {
    map.set(o.id, o);
  }
  for (const o of diskOrders) {
    map.set(o.id, o);
  }
  for (const o of memoryOrders) {
    map.set(o.id, o);
  }

  const merged = Array.from(map.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  globalThis.__glow_orders_cache = merged;
  return merged;
}

export function getOrderById(id: string): Order | undefined {
  if (!id) return undefined;
  const orders = getAllOrders();
  return orders.find(o => o.id.toLowerCase() === id.toLowerCase());
}

export function saveOrder(order: Order): Order {
  const orders = getAllOrders();
  const existingIdx = orders.findIndex(o => o.id === order.id);

  if (existingIdx >= 0) {
    orders[existingIdx] = {
      ...orders[existingIdx],
      ...order,
      updatedAt: new Date().toISOString(),
    };
  } else {
    orders.unshift(order);
  }

  globalThis.__glow_orders_cache = orders;
  persistOrdersToDisk(orders);

  return order;
}

export function updateOrderStatus(
  id: string, 
  status: OrderStatus, 
  paymentStatus?: Order['paymentStatus'],
  paymentId?: string
): Order | null {
  const order = getOrderById(id);
  if (!order) return null;

  order.status = status;
  if (paymentStatus) {
    order.paymentStatus = paymentStatus;
  }
  if (paymentId) {
    order.paymentId = paymentId;
  }
  order.updatedAt = new Date().toISOString();

  saveOrder(order);
  return order;
}

export function generateOrderId(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${randomNum}-GB`;
}
