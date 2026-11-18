'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Tag,
  ShieldCheck,
  Check,
  ArrowLeft
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatUSD, formatUZS } from '@/data/products';

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discount,
    discountCode,
    applyPromoCode,
    removePromoCode,
    shipping,
    freeShippingThreshold,
    total,
    totalCount,
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; success: boolean } | null>(null);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = applyPromoCode(inputCode);
    setPromoMessage({ text: res.message, success: res.success });
    if (res.success) {
      setInputCode('');
    }
  };

  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const diffToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-glow-100 text-glow-500 mx-auto flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-luxury-dark font-normal">
          Ваша корзина пуста
        </h1>
        <p className="text-sm text-luxury-muted max-w-md mx-auto mt-2 mb-8 leading-relaxed">
          В вашей косметичке пока нет товаров. Загляните в наш каталог, чтобы открыть для себя лучшие формулы ухода и макияжа.
        </p>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-glow-900 hover:bg-glow-800 text-white text-xs uppercase tracking-widest font-semibold transition shadow-md"
        >
          <span>Перейти в каталог</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Title */}
      <div className="border-b border-glow-200 pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-glow-700 font-semibold">
            Мои покупки
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-luxury-dark mt-1 font-normal">
            Корзина товаров ({totalCount})
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-luxury-muted hover:text-rose-600 transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Очистить всю корзину</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Free Shipping Progress Alert */}
          <div className="p-4 rounded-2xl bg-white border border-glow-200 shadow-sm">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-luxury-dark font-medium">
                {diffToFreeShipping > 0 ? (
                  <>До бесплатной доставки осталось <span className="font-bold text-glow-700">{formatUSD(diffToFreeShipping)}</span></>
                ) : (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Вы получили бесплатную доставку!
                  </span>
                )}
              </span>
              <span className="text-luxury-muted font-mono">{progressToFreeShipping}%</span>
            </div>
            <div className="w-full bg-glow-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-glow-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Items Table / Cards */}
          <div className="bg-white rounded-3xl border border-glow-200 shadow-card divide-y divide-glow-100 overflow-hidden">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-center">
                {/* Product Thumbnail */}
                <Link
                  href={`/product/${product.id}`}
                  className="relative w-24 h-28 sm:w-28 sm:h-32 rounded-2xl overflow-hidden bg-glow-50 shrink-0 border border-glow-200"
                >
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <span className="text-[10px] uppercase tracking-widest text-glow-700 font-semibold">
                    {product.categoryLabel}
                  </span>
                  <Link href={`/product/${product.id}`} className="hover:text-glow-700 transition">
                    <h3 className="font-serif text-lg text-luxury-dark font-normal truncate mt-0.5">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-luxury-muted mt-0.5">Объем: {product.volume}</p>
                  <p className="text-xs font-semibold text-luxury-dark mt-1">
                    Цена за ед.: {formatUSD(product.price)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-glow-300 rounded-xl bg-white p-1">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="p-1.5 text-luxury-muted hover:text-luxury-dark transition"
                      aria-label="Уменьшить"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-luxury-dark min-w-[24px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="p-1.5 text-luxury-muted hover:text-luxury-dark transition"
                      aria-label="Увеличить"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right min-w-[80px]">
                    <div className="text-base font-bold text-luxury-dark">
                      {formatUSD(product.price * quantity)}
                    </div>
                    <div className="text-[10px] text-luxury-muted">
                      ≈ {formatUZS(product.price * quantity)}
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="p-2 text-luxury-muted hover:text-rose-600 transition rounded-lg hover:bg-rose-50"
                    title="Удалить из корзины"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Continue shopping link */}
          <div className="pt-2">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-glow-800 hover:text-glow-600 font-semibold transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Продолжить покупки в каталоге</span>
            </Link>
          </div>

        </div>

        {/* Right Column: Order Summary & Checkout CTA */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-glow-200 p-6 shadow-card space-y-6">
            <h2 className="font-serif text-2xl text-luxury-dark font-normal">
              Итого к оплате
            </h2>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="space-y-2">
              <label className="text-xs font-medium text-luxury-dark flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-glow-700" />
                <span>Промокод на скидку:</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="GLOW10"
                  className="flex-1 px-3 py-2 text-xs uppercase bg-glow-50 border border-glow-200 rounded-xl focus:outline-none focus:border-glow-600 font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-glow-900 hover:bg-glow-800 text-white text-xs font-medium uppercase tracking-wider rounded-xl transition"
                >
                  Применить
                </button>
              </div>

              {promoMessage && (
                <p className={`text-xs ${promoMessage.success ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {promoMessage.text}
                </p>
              )}

              {discountCode && (
                <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 p-2 rounded-lg border border-emerald-200">
                  <span>Активен промокод: <strong>{discountCode}</strong></span>
                  <button
                    type="button"
                    onClick={removePromoCode}
                    className="text-xs underline hover:text-emerald-950"
                  >
                    Отменить
                  </button>
                </div>
              )}
            </form>

            {/* Price Calculations */}
            <div className="space-y-3 pt-4 border-t border-glow-100 text-xs">
              <div className="flex justify-between text-luxury-muted">
                <span>Промежуточный итог (Subtotal):</span>
                <span className="font-medium text-luxury-dark">{formatUSD(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Скидка по промокоду ({discountCode}):</span>
                  <span>-{formatUSD(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-luxury-muted">
                <span>Стоимость доставки:</span>
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
                <span className="text-sm font-semibold text-luxury-dark">Итоговая сумма:</span>
                <div className="text-right">
                  <div className="text-2xl font-bold text-glow-900">
                    {formatUSD(total)}
                  </div>
                  <div className="text-xs text-glow-700/80 font-medium mt-0.5">
                    ≈ {formatUZS(total)}
                  </div>
                </div>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <Link
              href="/checkout"
              className="w-full py-4 rounded-2xl bg-glow-700 hover:bg-glow-800 text-white text-xs uppercase tracking-widest font-semibold transition-all duration-200 shadow-lg flex items-center justify-center gap-2 group"
            >
              <span>Оформить заказ</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Guarantees */}
            <div className="pt-2 border-t border-glow-100 flex items-center justify-center gap-2 text-xs text-luxury-muted">
              <ShieldCheck className="w-4 h-4 text-glow-600" />
              <span>Безопасная оплата через Stripe и Payme</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
