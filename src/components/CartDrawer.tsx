'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatUSD } from '@/data/products';

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    shipping,
    freeShippingThreshold,
    total,
    totalCount,
  } = useCart();

  if (!isCartOpen) return null;

  const progressToFreeShipping = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const diffToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-luxury-dark/40 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer content */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-up">
        {/* Header */}
        <div className="p-5 border-b border-glow-200 flex items-center justify-between bg-glow-50/50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-glow-700" />
            <h3 className="font-serif text-xl font-normal text-luxury-dark">Ваша корзина</h3>
            <span className="text-xs bg-glow-200 text-glow-900 px-2 py-0.5 rounded-full font-medium">
              {totalCount}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 text-luxury-muted hover:text-luxury-dark rounded-full hover:bg-glow-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free shipping progress bar */}
        <div className="px-5 py-3 bg-glow-100/60 border-b border-glow-200 text-xs">
          {diffToFreeShipping > 0 ? (
            <p className="text-luxury-muted text-center mb-1.5">
              До бесплатной доставки осталось <span className="font-semibold text-glow-800">{formatUSD(diffToFreeShipping)}</span>
            </p>
          ) : (
            <p className="text-emerald-700 font-medium text-center mb-1.5 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Поздравляем! Доставка бесплатна
            </p>
          )}
          <div className="w-full bg-white h-1.5 rounded-full overflow-hidden border border-glow-200">
            <div
              className="bg-glow-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-glow-100">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-glow-100 flex items-center justify-center text-glow-400 mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-xl text-luxury-dark">Корзина пуста</h4>
              <p className="text-xs text-luxury-muted max-w-xs mt-1 mb-6">
                Ваша косметичка еще ждет своих фаворитов. Познакомьтесь с нашими бестселлерами.
              </p>
              <Link
                href="/catalog"
                onClick={closeCart}
                className="px-6 py-2.5 rounded-full bg-glow-700 hover:bg-glow-800 text-white text-xs uppercase tracking-wider font-medium transition shadow-sm"
              >
                В каталог
              </Link>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div key={product.id} className="py-4 flex gap-4 items-center">
                <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-glow-50 shrink-0 border border-glow-200">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-luxury-dark truncate">
                    {product.name}
                  </h4>
                  <p className="text-xs text-luxury-muted mt-0.5">{product.volume}</p>
                  <p className="text-xs font-semibold text-glow-800 mt-1">
                    {formatUSD(product.price)}
                  </p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center border border-glow-300 rounded-lg bg-white overflow-hidden">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="p-1 hover:bg-glow-100 text-luxury-muted hover:text-luxury-dark transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 text-xs font-semibold text-luxury-dark min-w-[20px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="p-1 hover:bg-glow-100 text-luxury-muted hover:text-luxury-dark transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="p-1 text-luxury-muted hover:text-rose-600 transition ml-auto"
                      title="Удалить"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout button */}
        {items.length > 0 && (
          <div className="p-5 border-t border-glow-200 bg-glow-50/70">
            <div className="space-y-1.5 text-xs text-luxury-muted mb-4">
              <div className="flex justify-between">
                <span>Промежуточный итог:</span>
                <span className="font-medium text-luxury-dark">{formatUSD(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Доставка:</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-emerald-700 font-medium">Бесплатно</span>
                  ) : (
                    formatUSD(shipping)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-luxury-dark pt-2 border-t border-glow-200">
                <span>Итого:</span>
                <span className="text-base text-glow-900">{formatUSD(total)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/cart"
                onClick={closeCart}
                className="w-full py-3 px-3 text-center border border-glow-300 rounded-xl text-xs uppercase tracking-wider font-semibold text-luxury-dark hover:bg-white transition"
              >
                Корзина
              </Link>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full py-3 px-3 text-center bg-glow-700 hover:bg-glow-800 text-white rounded-xl text-xs uppercase tracking-wider font-semibold transition flex items-center justify-center gap-1 shadow-md"
              >
                <span>Оформить</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
