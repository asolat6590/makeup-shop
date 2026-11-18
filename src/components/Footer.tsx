'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Truck, RefreshCw, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-glow-900 text-nude-100 pt-16 pb-12 mt-20 border-t border-glow-800">
      {/* Top trust badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-glow-800/80">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-full bg-glow-800/60 border border-glow-700/60 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 text-glow-300" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wide text-white uppercase">Бережная доставка</h4>
              <p className="text-xs text-glow-200/70 mt-0.5">Бесплатно от $75. Надежная упаковка с заботой</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-full bg-glow-800/60 border border-glow-700/60 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-glow-300" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wide text-white uppercase">100% Оригинал</h4>
              <p className="text-xs text-glow-200/70 mt-0.5">Сертифицированная чистая косметика и cruelty-free</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center sm:justify-start">
            <div className="w-12 h-12 rounded-full bg-glow-800/60 border border-glow-700/60 flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6 text-glow-300" />
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wide text-white uppercase">Безопасная оплата</h4>
              <p className="text-xs text-glow-200/70 mt-0.5">Международный Stripe и локальный Payme (Uzcard / Humo)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-light tracking-[0.25em] text-white uppercase">
                Glow Beauty
              </span>
            </Link>
            <p className="text-sm text-glow-200/80 mt-4 leading-relaxed max-w-sm">
              Премиальная косметика для тех, кто ценит естественное сияние, научно обоснованные формулы и эстетику бережного ухода за собой каждый день.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs text-glow-300">
              <Sparkles className="w-4 h-4" />
              <span>Создано с любовью к красоте и технологиям</span>
            </div>
          </div>

          {/* Catalog links */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-[0.2em] text-glow-300 mb-4">
              Каталог
            </h5>
            <ul className="space-y-2.5 text-sm text-glow-200/70">
              <li><Link href="/catalog?category=skincare" className="hover:text-white transition">Уход за лицом</Link></li>
              <li><Link href="/catalog?category=makeup" className="hover:text-white transition">Макияж</Link></li>
              <li><Link href="/catalog?category=perfume" className="hover:text-white transition">Парфюмерия</Link></li>
              <li><Link href="/catalog?category=body" className="hover:text-white transition">Тело и СПА</Link></li>
              <li><Link href="/catalog?category=sets" className="hover:text-white transition">Подарочные сеты</Link></li>
            </ul>
          </div>

          {/* Service links */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-[0.2em] text-glow-300 mb-4">
              Сервис
            </h5>
            <ul className="space-y-2.5 text-sm text-glow-200/70">
              <li><Link href="/cart" className="hover:text-white transition">Корзина</Link></li>
              <li><Link href="/checkout" className="hover:text-white transition">Оформление заказа</Link></li>
              <li><Link href="/admin" className="hover:text-white transition">Административная панель</Link></li>
              <li><span className="text-glow-200/50">Доставка и возврат</span></li>
              <li><span className="text-glow-200/50">Сертификаты качества</span></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-[0.2em] text-glow-300 mb-4">
              Клуб привилегий
            </h5>
            <p className="text-xs text-glow-200/70 mb-3">
              Получайте первыми доступ к лимитированным коллекциям и секретным подаркам.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Спасибо за подписку на клуб Glow Beauty!'); }} className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Ваш e-mail"
                required
                className="w-full px-3.5 py-2.5 text-xs bg-glow-800/80 border border-glow-700 rounded-md text-white placeholder-glow-300/50 focus:outline-none focus:border-glow-400"
              />
              <button
                type="submit"
                className="w-full bg-glow-700 hover:bg-glow-600 text-white text-xs font-medium py-2.5 rounded-md tracking-wider uppercase transition"
              >
                Подписаться
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Bottom bar & payment logos */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-glow-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-glow-300/60">
        <div>
          © {new Date().getFullYear()} Glow Beauty. Учебный e-commerce проект. Все права защищены.
        </div>

        {/* Payment Badges */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-glow-300/50 mr-1">Способы оплаты:</span>
          <span className="px-2 py-0.5 rounded bg-glow-800 text-glow-200 font-mono text-[10px] border border-glow-700">
            STRIPE (TEST)
          </span>
          <span className="px-2 py-0.5 rounded bg-[#1A80E6]/20 text-[#60A5FA] font-mono text-[10px] border border-[#1A80E6]/40">
            PAYME (UZCARD / HUMO)
          </span>
          <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">
            VISA / MASTERCARD
          </span>
        </div>
      </div>
    </footer>
  );
}
