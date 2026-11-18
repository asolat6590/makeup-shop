'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  Home,
  ShieldCheck,
  CreditCard,
  ArrowLeft,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { formatUSD, formatUZS } from '@/data/products';

const STATUS_STEPS: { key: OrderStatus; label: string; desc: string }[] = [
  { key: 'pending', label: 'Ожидает оплаты', desc: 'Заказ создан' },
  { key: 'paid', label: 'Оплачен', desc: 'Платеж подтвержден' },
  { key: 'processing', label: 'В сборке', desc: 'Упаковка на складе' },
  { key: 'shipped', label: 'Передан курьеру', desc: 'В пути к вам' },
  { key: 'delivered', label: 'Доставлен', desc: 'Заказ вручен' },
];

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`);
        const data = await res.json();
        if (res.ok && data.order) {
          setOrder(data.order);
        } else {
          // Client-side fallback from localStorage
          const localSaved = localStorage.getItem(`glow_beauty_order_${id}`);
          if (localSaved) {
            const parsed = JSON.parse(localSaved);
            setOrder(parsed);
            // Sync back to server in background
            fetch('/api/orders', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(parsed),
            }).catch(() => {});
          } else {
            setError(data.error || 'Заказ не найден');
          }
        }
      } catch (err: any) {
        // Fallback to localStorage on network or server error
        const localSaved = localStorage.getItem(`glow_beauty_order_${id}`);
        if (localSaved) {
          setOrder(JSON.parse(localSaved));
        } else {
          setError(err.message || 'Ошибка загрузки заказа');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-glow-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-luxury-muted uppercase tracking-widest">Загрузка данных заказа...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl text-luxury-dark font-normal">Заказ не найден</h1>
        <p className="text-xs text-luxury-muted mt-2 mb-6">
          Заказ с номером {id} не существует или был удален.
        </p>
        <Link
          href="/catalog"
          className="px-6 py-2.5 rounded-full bg-glow-700 text-white text-xs uppercase tracking-wider font-semibold"
        >
          В каталог
        </Link>
      </div>
    );
  }

  // Determine current step index
  const statusRank: Record<OrderStatus, number> = {
    pending: 0,
    paid: 1,
    processing: 2,
    shipped: 3,
    delivered: 4,
    cancelled: -1,
  };

  const currentStep = statusRank[order.status];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Link href="/catalog" className="inline-flex items-center gap-2 text-xs text-luxury-muted hover:text-glow-700 transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Вернуться в магазин</span>
        </Link>
        <Link href="/admin" className="text-xs text-glow-800 font-medium hover:underline">
          Панель администратора
        </Link>
      </div>

      {/* Order Header Box */}
      <div className="bg-white rounded-3xl border border-glow-200 p-6 sm:p-8 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-glow-700 font-semibold uppercase tracking-wider">
            <Package className="w-4 h-4" />
            <span>Детали заказа</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-luxury-dark mt-1 font-normal font-mono">
            {order.id}
          </h1>
          <p className="text-xs text-luxury-muted flex items-center gap-1.5 mt-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Оформлен: {new Date(order.createdAt).toLocaleString('ru-RU')}</span>
          </p>
        </div>

        <div className="flex flex-col sm:items-end">
          <div className="text-2xl font-bold text-glow-900">{formatUSD(order.total)}</div>
          <div className="text-xs text-glow-700">≈ {formatUZS(order.total)}</div>
          <div className="mt-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
              order.status === 'paid' || order.status === 'delivered'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : order.status === 'cancelled'
                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}>
              {order.status === 'pending' && 'Ожидает оплаты'}
              {order.status === 'paid' && 'Оплачен'}
              {order.status === 'processing' && 'Собирается на складе'}
              {order.status === 'shipped' && 'Передан курьеру'}
              {order.status === 'delivered' && 'Доставлен'}
              {order.status === 'cancelled' && 'Отменен'}
            </span>
          </div>
        </div>
      </div>

      {/* Stepper Timeline */}
      {order.status !== 'cancelled' && (
        <div className="bg-white rounded-3xl border border-glow-200 p-6 sm:p-8 shadow-card">
          <h3 className="font-serif text-xl text-luxury-dark font-normal mb-6">
            Статус выполнения заказа
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {STATUS_STEPS.map((step, idx) => {
              const isCompleted = currentStep >= idx;
              const isCurrent = currentStep === idx;

              return (
                <div key={step.key} className="relative flex flex-col items-center text-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-200 ${
                      isCompleted
                        ? 'bg-glow-700 text-white shadow-md'
                        : 'bg-glow-100 text-luxury-muted'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>
                  <h4 className={`text-xs font-semibold mt-2.5 ${isCurrent ? 'text-glow-900 font-bold' : 'text-luxury-dark'}`}>
                    {step.label}
                  </h4>
                  <p className="text-[11px] text-luxury-muted mt-0.5">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Grid: Items & Customer details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Items */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-glow-200 p-6 shadow-card space-y-4">
          <h3 className="font-serif text-xl text-luxury-dark font-normal border-b border-glow-100 pb-3">
            Товары в заказе ({order.items.reduce((s, it) => s + it.quantity, 0)})
          </h3>

          <div className="divide-y divide-glow-100">
            {order.items.map((it, idx) => (
              <div key={idx} className="py-3 flex items-center gap-4">
                <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-glow-50 shrink-0 border border-glow-200">
                  <Image src={it.image} alt={it.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-luxury-dark truncate">{it.name}</h4>
                  <p className="text-xs text-luxury-muted mt-0.5">{it.volume}</p>
                  <p className="text-xs text-luxury-muted">{it.quantity} шт. × {formatUSD(it.price)}</p>
                </div>
                <div className="text-sm font-semibold text-luxury-dark">
                  {formatUSD(it.price * it.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-glow-200 space-y-2 text-xs">
            <div className="flex justify-between text-luxury-muted">
              <span>Промежуточный итог:</span>
              <span className="font-medium text-luxury-dark">{formatUSD(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Скидка ({order.discountCode || 'Промокод'}):</span>
                <span>-{formatUSD(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-luxury-muted">
              <span>Доставка:</span>
              <span>{order.shipping === 0 ? 'Бесплатно' : formatUSD(order.shipping)}</span>
            </div>
            <div className="pt-2 border-t border-glow-200 flex justify-between items-baseline font-bold text-sm">
              <span>Итого:</span>
              <span className="text-lg text-glow-900">{formatUSD(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Customer & Payment details */}
        <div className="lg:col-span-5 space-y-6">
          {/* Delivery Card */}
          <div className="bg-white rounded-3xl border border-glow-200 p-6 shadow-card space-y-3">
            <h3 className="font-serif text-lg text-luxury-dark font-normal flex items-center gap-2">
              <Truck className="w-4 h-4 text-glow-700" />
              <span>Адрес и получатель</span>
            </h3>
            <div className="text-xs text-luxury-muted space-y-1.5">
              <p><strong className="text-luxury-dark">ФИО:</strong> {order.customer.fullName}</p>
              <p><strong className="text-luxury-dark">Телефон:</strong> {order.customer.phone}</p>
              {order.customer.email && <p><strong className="text-luxury-dark">Email:</strong> {order.customer.email}</p>}
              <p><strong className="text-luxury-dark">Город:</strong> {order.customer.city}</p>
              <p><strong className="text-luxury-dark">Адрес:</strong> {order.customer.address}</p>
              {order.customer.notes && (
                <p className="pt-2 text-luxury-dark italic">«{order.customer.notes}»</p>
              )}
            </div>
          </div>

          {/* Payment info Card */}
          <div className="bg-white rounded-3xl border border-glow-200 p-6 shadow-card space-y-3">
            <h3 className="font-serif text-lg text-luxury-dark font-normal flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-glow-700" />
              <span>Платежные данные</span>
            </h3>
            <div className="text-xs text-luxury-muted space-y-2">
              <div>
                <span className="block text-[11px]">Платежная система:</span>
                <span className="font-semibold text-luxury-dark uppercase">
                  {order.paymentMethod === 'payme' ? 'Payme (UZCARD / HUMO)' : 'Stripe Test Card'}
                </span>
              </div>
              <div>
                <span className="block text-[11px]">Статус транзакции:</span>
                <span className={`font-semibold ${order.paymentStatus === 'succeeded' ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {order.paymentStatus === 'succeeded' ? 'Успешно подтверждена' : 'Ожидает оплаты'}
                </span>
              </div>
              {order.paymentId && (
                <div>
                  <span className="block text-[11px]">ID транзакции:</span>
                  <span className="font-mono text-glow-900 bg-glow-50 px-2 py-0.5 rounded text-[11px] break-all">
                    {order.paymentId}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
