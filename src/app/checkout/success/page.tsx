'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Sparkles, ArrowRight, Package, Truck, ShieldCheck, ShoppingBag } from 'lucide-react';
import { Order } from '@/types';
import { formatUSD, formatUZS } from '@/data/products';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const method = searchParams.get('method') || 'card';
  const sessionId = searchParams.get('session_id') || searchParams.get('tx');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        // Ensure order is marked as paid
        await fetch(`/api/orders/${orderId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: 'paid',
            paymentStatus: 'succeeded',
            paymentId: sessionId || undefined,
          }),
        });

        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (data.order) {
          setOrder(data.order);
        }
      } catch (e) {
        console.error('Error loading order in success page:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, sessionId]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white rounded-3xl border border-glow-200 p-8 sm:p-12 shadow-card text-center relative overflow-hidden">
        {/* Soft decorative glow */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-glow-400 via-glow-600 to-glow-400" />
        
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center mb-6 shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs uppercase tracking-[0.25em] text-emerald-700 font-semibold">
          Оплата прошла успешно
        </span>

        <h1 className="font-serif text-3xl sm:text-5xl text-luxury-dark mt-2 font-normal">
          Спасибо за ваш заказ!
        </h1>

        <p className="text-xs sm:text-sm text-luxury-muted max-w-lg mx-auto mt-3 leading-relaxed">
          Мы получили оплату и уже начали бережно собирать вашу посылку красоты в фирменную подарочную упаковку.
        </p>

        {/* Order Meta Bar */}
        <div className="my-8 p-4 rounded-2xl bg-glow-50/70 border border-glow-200 inline-flex flex-wrap items-center justify-center gap-6 text-xs text-luxury-dark">
          <div>
            <span className="text-luxury-muted block text-[11px]">Номер заказа:</span>
            <span className="font-mono font-bold text-glow-900 text-sm">{orderId || 'ORD-NEW-GB'}</span>
          </div>
          <div className="h-8 w-px bg-glow-200 hidden sm:block" />
          <div>
            <span className="text-luxury-muted block text-[11px]">Способ оплаты:</span>
            <span className="font-semibold uppercase text-xs">
              {method === 'payme' ? 'Payme (UZCARD / HUMO)' : 'Stripe (Банковская карта)'}
            </span>
          </div>
          <div className="h-8 w-px bg-glow-200 hidden sm:block" />
          <div>
            <span className="text-luxury-muted block text-[11px]">Статус:</span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Оплачен
            </span>
          </div>
        </div>

        {/* Order Items & Customer details if available */}
        {order && (
          <div className="text-left border-t border-glow-200 pt-8 mt-8 space-y-6">
            <h3 className="font-serif text-xl text-luxury-dark font-normal flex items-center gap-2">
              <Package className="w-5 h-5 text-glow-700" />
              <span>Состав заказа</span>
            </h3>

            <div className="divide-y divide-glow-100 bg-glow-50/40 rounded-2xl p-4 border border-glow-200">
              {order.items.map((it, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-white shrink-0 border border-glow-200">
                      <Image src={it.image} alt={it.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-medium text-luxury-dark">{it.name}</h4>
                      <p className="text-luxury-muted text-[11px]">{it.volume} × {it.quantity}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-luxury-dark">{formatUSD(it.price * it.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Delivery address & total */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-white p-4 rounded-2xl border border-glow-200">
              <div>
                <span className="font-semibold text-luxury-dark block mb-1">Получатель и адрес:</span>
                <p className="text-luxury-muted">{order.customer.fullName}</p>
                <p className="text-luxury-muted">{order.customer.phone}</p>
                <p className="text-luxury-muted">{order.customer.city}, {order.customer.address}</p>
              </div>
              <div className="sm:text-right">
                <span className="font-semibold text-luxury-dark block mb-1">Итоговая сумма:</span>
                <div className="text-xl font-bold text-glow-900">{formatUSD(order.total)}</div>
                <div className="text-xs text-glow-700">≈ {formatUZS(order.total)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-8 mt-8 border-t border-glow-200 flex flex-col sm:flex-row items-center justify-center gap-4">
          {orderId && (
            <Link
              href={`/order/${orderId}`}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-glow-700 hover:bg-glow-800 text-white text-xs uppercase tracking-widest font-semibold transition shadow-md flex items-center justify-center gap-2"
            >
              <span>Отслеживать статус заказа</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
          <Link
            href="/catalog"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white border border-glow-300 hover:border-glow-500 text-luxury-dark text-xs uppercase tracking-widest font-semibold transition"
          >
            Вернуться в каталог
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-glow-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
