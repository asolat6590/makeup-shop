'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  ShieldCheck,
  Truck,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatUSD, formatUZS } from '@/data/products';
import { PaymentMethod } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    subtotal,
    discount,
    discountCode,
    shipping,
    total,
    clearCart,
  } = useCart();

  // Form fields
  const [fullName, setFullName] = useState('Алина Соколова');
  const [email, setEmail] = useState('alina.sokolova@example.com');
  const [phone, setPhone] = useState('+998 90 987 65 43');
  const [address, setAddress] = useState('ул. Шахрисабз, д. 15, кв. 42');
  const [city, setCity] = useState('Ташкент');
  const [notes, setNotes] = useState('Позвонить перед доставкой');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-3xl text-luxury-dark mb-4">Корзина пуста</h1>
        <p className="text-sm text-luxury-muted mb-6">
          Перед оформлением заказа добавьте косметику в корзину.
        </p>
        <Link
          href="/catalog"
          className="px-8 py-3 rounded-full bg-glow-700 text-white text-xs uppercase tracking-widest font-semibold hover:bg-glow-800 transition"
        >
          Перейти в каталог
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      setErrorMessage('Пожалуйста, заполните обязательные поля: ФИО, телефон и адрес');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create order in backend database (with status: 'pending')
      const orderPayload = {
        customer: {
          fullName,
          email,
          phone,
          address,
          city,
          notes,
        },
        items: items.map(it => ({
          productId: it.product.id,
          name: it.product.name,
          price: it.product.price,
          quantity: it.quantity,
          image: it.product.images[0],
          volume: it.product.volume,
        })),
        paymentMethod,
        subtotal,
        shipping,
        discount,
        discountCode,
        total,
      };

      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.order) {
        throw new Error(orderData.error || 'Не удалось сохранить заказ');
      }

      const createdOrder = orderData.order;

      // 2. Initiate Payment Session according to selected provider
      if (paymentMethod === 'stripe') {
        // Stripe flow
        const stripeRes = await fetch('/api/checkout/stripe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: createdOrder.id }),
        });

        const stripeData = await stripeRes.json();
        if (!stripeRes.ok || !stripeData.url) {
          throw new Error(stripeData.error || 'Ошибка инициализации сессии Stripe');
        }

        // Clear cart now that order is safely registered
        clearCart();

        // Redirect to Stripe checkout URL (or realistic test simulator)
        window.location.href = stripeData.url;
      } else {
        // Payme Uzbekistan flow
        const paymeRes = await fetch('/api/payments/payme/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: createdOrder.id }),
        });

        const paymeData = await paymeRes.json();
        if (!paymeRes.ok) {
          throw new Error(paymeData.error || 'Ошибка создания сессии Payme');
        }

        // Clear cart
        clearCart();

        // Redirect to Payme Interactive Sandbox interface
        window.location.href = paymeData.sandboxModalUrl || `/checkout/payme-sandbox?order_id=${createdOrder.id}&amount=${paymeData.amountInUzs}`;
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMessage(err.message || 'Произошла непредвиденная ошибка при оформлении');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top breadcrumb / navigation */}
      <div className="mb-6 flex items-center gap-2 text-xs text-luxury-muted">
        <Link href="/cart" className="flex items-center gap-1 hover:text-glow-700 transition">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Вернуться в корзину</span>
        </Link>
        <span>/</span>
        <span className="text-luxury-dark font-medium">Оформление заказа</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Checkout Form */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-glow-700 font-semibold">
              Шаг 2 из 2
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-luxury-dark mt-1 font-normal">
              Оформление заказа
            </h1>
            <p className="text-xs text-luxury-muted mt-1">
              Укажите ваши контактные данные и выберите удобный способ оплаты
            </p>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. Contact & Delivery Info */}
            <div className="bg-white rounded-3xl border border-glow-200 p-6 sm:p-8 shadow-card space-y-5">
              <h3 className="font-serif text-xl text-luxury-dark font-normal flex items-center gap-2">
                <Truck className="w-5 h-5 text-glow-700" />
                <span>1. Данные покупателя и доставка</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-luxury-dark mb-1.5">
                    ФИО получателя <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Алина Соколова"
                    className="w-full px-4 py-2.5 text-xs bg-glow-50/50 border border-glow-300 rounded-xl text-luxury-dark focus:outline-none focus:border-glow-600 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-luxury-dark mb-1.5">
                    Номер телефона <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998 90 123 45 67"
                    className="w-full px-4 py-2.5 text-xs bg-glow-50/50 border border-glow-300 rounded-xl text-luxury-dark focus:outline-none focus:border-glow-600 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-luxury-dark mb-1.5">
                    Адрес доставки (улица, дом, кв.) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="ул. Шахрисабз, д. 15, кв. 42"
                    className="w-full px-4 py-2.5 text-xs bg-glow-50/50 border border-glow-300 rounded-xl text-luxury-dark focus:outline-none focus:border-glow-600 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-luxury-dark mb-1.5">
                    Город <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ташкент"
                    className="w-full px-4 py-2.5 text-xs bg-glow-50/50 border border-glow-300 rounded-xl text-luxury-dark focus:outline-none focus:border-glow-600 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-luxury-dark mb-1.5">
                  Электронная почта (для отправки чека)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alina@example.com"
                  className="w-full px-4 py-2.5 text-xs bg-glow-50/50 border border-glow-300 rounded-xl text-luxury-dark focus:outline-none focus:border-glow-600 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-luxury-dark mb-1.5">
                  Комментарий для курьера (необязательно)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Домофон #12, позвонить за полчаса"
                  className="w-full px-4 py-2.5 text-xs bg-glow-50/50 border border-glow-300 rounded-xl text-luxury-dark focus:outline-none focus:border-glow-600 focus:bg-white transition"
                />
              </div>
            </div>

            {/* 2. Payment Method Selection */}
            <div className="bg-white rounded-3xl border border-glow-200 p-6 sm:p-8 shadow-card space-y-5">
              <h3 className="font-serif text-xl text-luxury-dark font-normal flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-glow-700" />
                <span>2. Выберите способ оплаты</span>
              </h3>

              <div className="space-y-4">
                
                {/* Option 1: Stripe */}
                <label
                  onClick={() => setPaymentMethod('stripe')}
                  className={`block p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'stripe'
                      ? 'border-glow-700 bg-glow-50/60 shadow-sm'
                      : 'border-glow-200 hover:border-glow-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        paymentMethod === 'stripe'
                          ? 'border-glow-700 bg-glow-700 text-white'
                          : 'border-glow-300'
                      }`}>
                        {paymentMethod === 'stripe' && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-luxury-dark uppercase tracking-wider">
                            Stripe — Банковская карта
                          </span>
                          <span className="bg-glow-200 text-glow-900 text-[10px] font-mono px-2 py-0.5 rounded-full">
                            TEST MODE
                          </span>
                        </div>
                        <p className="text-xs text-luxury-muted mt-1">
                          Международные карты Visa, MasterCard, American Express через защищенный шлюз Stripe Checkout.
                        </p>
                      </div>
                    </div>
                  </div>

                  {paymentMethod === 'stripe' && (
                    <div className="mt-4 pt-3 border-t border-glow-200/80 text-[11px] text-glow-900 bg-white/80 p-3 rounded-xl border border-glow-100 flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Тестовый режим Stripe:</span> Реальное списание денег не производится. Секретные ключи хранятся исключительно на сервере.
                      </div>
                    </div>
                  )}
                </label>

                {/* Option 2: Payme */}
                <label
                  onClick={() => setPaymentMethod('payme')}
                  className={`block p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'payme'
                      ? 'border-glow-700 bg-glow-50/60 shadow-sm'
                      : 'border-glow-200 hover:border-glow-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        paymentMethod === 'payme'
                          ? 'border-glow-700 bg-glow-700 text-white'
                          : 'border-glow-300'
                      }`}>
                        {paymentMethod === 'payme' && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-luxury-dark uppercase tracking-wider">
                            Payme — Локальный провайдер Узбекистана
                          </span>
                          <span className="bg-[#1A80E6]/15 text-[#0066CC] text-[10px] font-mono px-2 py-0.5 rounded-full">
                            UZCARD / HUMO
                          </span>
                        </div>
                        <p className="text-xs text-luxury-muted mt-1">
                          Оплата в узбекских сумах (UZS). Реализация Merchant API с JSON-RPC 2.0 колбэками.
                        </p>
                      </div>
                    </div>
                  </div>

                  {paymentMethod === 'payme' && (
                    <div className="mt-4 pt-3 border-t border-glow-200/80 text-[11px] text-luxury-dark bg-white/80 p-3 rounded-xl border border-glow-100 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-[#0066CC] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Архитектура Payme:</span> Создается платежная сессия на сумму <span className="font-bold text-[#0066CC]">{formatUZS(total)}</span>. Статус заказа переводится в <span className="font-mono bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded">PAID</span> только после подтверждения callback&apos;а от Payme.
                      </div>
                    </div>
                  )}
                </label>

              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-glow-700 hover:bg-glow-800 disabled:bg-glow-400 text-white text-xs uppercase tracking-widest font-semibold transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Инициализация платежа...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Оплатить заказ • {formatUSD(total)}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-luxury-muted">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Безопасное 256-битное шифрование данных</span>
            </div>

          </form>
        </div>

        {/* Right Column: Order Summary Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-glow-200 p-6 sm:p-8 shadow-card space-y-6 sticky top-28">
            <h2 className="font-serif text-2xl text-luxury-dark font-normal border-b border-glow-100 pb-4">
              Ваш заказ ({items.reduce((s, it) => s + it.quantity, 0)})
            </h2>

            {/* Items scroll */}
            <div className="divide-y divide-glow-100 max-h-72 overflow-y-auto pr-1">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="py-3 flex items-center gap-3">
                  <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-glow-50 shrink-0 border border-glow-200">
                    <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-medium text-luxury-dark truncate">{product.name}</h4>
                    <p className="text-[11px] text-luxury-muted">{product.volume} × {quantity}</p>
                  </div>
                  <div className="text-xs font-semibold text-luxury-dark">
                    {formatUSD(product.price * quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <div className="pt-4 border-t border-glow-200 space-y-2 text-xs">
              <div className="flex justify-between text-luxury-muted">
                <span>Сумма товаров:</span>
                <span className="font-medium text-luxury-dark">{formatUSD(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Скидка ({discountCode}):</span>
                  <span>-{formatUSD(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-luxury-muted">
                <span>Доставка:</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-emerald-700 font-semibold">Бесплатно</span>
                  ) : (
                    formatUSD(shipping)
                  )}
                </span>
              </div>

              {/* Total */}
              <div className="pt-4 border-t border-glow-200 flex justify-between items-baseline">
                <div>
                  <div className="text-sm font-semibold text-luxury-dark">К оплате:</div>
                  <div className="text-[11px] text-luxury-muted">Включая налоги</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-glow-900">{formatUSD(total)}</div>
                  <div className="text-xs text-glow-700 font-semibold mt-0.5">≈ {formatUZS(total)}</div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
