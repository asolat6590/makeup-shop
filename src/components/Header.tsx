'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, ShoppingBag, Menu, X, Shield, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const pathname = usePathname();
  const { totalCount, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Главная' },
    { href: '/catalog', label: 'Каталог' },
    { href: '/catalog?category=skincare', label: 'Уход' },
    { href: '/catalog?category=makeup', label: 'Макияж' },
    { href: '/catalog?category=perfume', label: 'Парфюмерия' },
    { href: '/catalog?category=sets', label: 'Наборы' },
  ];

  return (
    <>
      {/* Top micro banner */}
      <div className="bg-glow-900 text-glow-100 text-xs py-2 px-4 text-center tracking-wider font-light flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-glow-300" />
        <span>Используйте промокод <span className="font-semibold text-white underline underline-offset-2">GLOW10</span> для скидки 10% на первый заказ</span>
        <span className="hidden sm:inline opacity-60">•</span>
        <span className="hidden sm:inline">Бесплатная доставка при заказе от $75</span>
      </div>

      {/* Main sticky header */}
      <header className="sticky top-0 z-40 w-full glass-header border-b border-glow-200/60 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Mobile hamburger */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-luxury-dark hover:text-glow-700 transition"
              aria-label="Открыть меню"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Link href="/catalog" className="p-2 text-luxury-dark hover:text-glow-700">
              <Search className="w-5 h-5" />
            </Link>
          </div>

          {/* Brand Logo */}
          <Link href="/" className="flex flex-col items-center group">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl sm:text-3xl font-normal tracking-[0.2em] text-luxury-dark uppercase group-hover:text-glow-700 transition-colors">
                Glow Beauty
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-[0.35em] text-luxury-muted -mt-1 font-medium">
              Haute Cosmétique
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm tracking-wider uppercase transition-colors duration-200 ${
                    isActive
                      ? 'text-glow-700 font-medium border-b-2 border-glow-600 pb-0.5'
                      : 'text-luxury-dark/80 hover:text-glow-700'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action icons */}
          <div className="flex items-center space-x-4 sm:space-x-5">
            {/* Search shortcut desktop */}
            <Link
              href="/catalog"
              className="hidden lg:flex items-center gap-1.5 text-xs text-luxury-muted hover:text-glow-700 transition py-1.5 px-3 rounded-full bg-white/70 border border-glow-200"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Поиск косметики</span>
            </Link>

            {/* Admin shortcut */}
            <Link
              href="/admin"
              className="p-2 text-luxury-muted hover:text-glow-700 transition relative rounded-full hover:bg-glow-100/50"
              title="Панель администратора"
            >
              <Shield className="w-5 h-5" />
            </Link>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-full bg-white text-luxury-dark border border-glow-300 hover:border-glow-500 shadow-sm transition hover:shadow-soft flex items-center gap-2"
              aria-label="Корзина"
            >
              <ShoppingBag className="w-5 h-5 text-glow-700" />
              {totalCount > 0 && (
                <span className="bg-glow-700 text-white text-[11px] font-semibold w-5 h-5 rounded-full flex items-center justify-center animate-fade-in">
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-md border-b border-glow-200 px-6 py-6 animate-slide-up">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base tracking-wider uppercase text-luxury-dark hover:text-glow-700 py-1 border-b border-glow-100"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 text-sm text-luxury-dark font-medium"
                >
                  <span>Корзина</span>
                  <span className="bg-glow-200 text-glow-900 px-2.5 py-0.5 rounded-full text-xs">
                    {totalCount} товаров
                  </span>
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-sm text-luxury-muted hover:text-glow-700"
                >
                  <Shield className="w-4 h-4 text-glow-600" />
                  <span>Панель управления (Admin)</span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
