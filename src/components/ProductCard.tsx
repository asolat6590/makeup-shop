'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingBag, Check } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatUSD, formatUZS } from '@/data/products';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-glow-200/80 hover:border-glow-400 shadow-card hover:shadow-hover transition-all duration-300">
      {/* Product Image Container */}
      <Link href={`/product/${product.id}`} className="relative aspect-[4/5] bg-glow-50 overflow-hidden block">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {product.isBestSeller && (
            <span className="bg-glow-900 text-white text-[10px] uppercase font-semibold tracking-wider px-2.5 py-1 rounded-full shadow-sm">
              Бестселлер
            </span>
          )}
          {product.isNew && (
            <span className="bg-nude-700 text-white text-[10px] uppercase font-semibold tracking-wider px-2.5 py-1 rounded-full shadow-sm">
              Новинка
            </span>
          )}
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="bg-glow-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Volume badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-white/85 backdrop-blur-sm text-luxury-dark text-[11px] font-medium px-2 py-0.5 rounded-md border border-glow-200 shadow-sm">
            {product.volume}
          </span>
        </div>

        {/* Image */}
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Quick Add Overlay on desktop */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block">
          <button
            onClick={handleAddToCart}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-medium uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-md ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-white/95 backdrop-blur-md text-luxury-dark hover:bg-glow-700 hover:text-white'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Добавлено</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>В корзину</span>
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Info Container */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-luxury-muted mb-1.5">
            <span className="uppercase tracking-widest text-[10px] text-glow-700 font-semibold">
              {product.categoryLabel}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-medium">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
              <span className="text-[11px] text-luxury-dark">{product.rating}</span>
              <span className="text-[10px] text-luxury-muted">({product.reviewCount})</span>
            </div>
          </div>

          <Link href={`/product/${product.id}`} className="group-hover:text-glow-700 transition">
            <h3 className="font-serif text-lg font-normal text-luxury-dark line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-luxury-muted line-clamp-2 mt-1 leading-relaxed">
            {product.subtitle}
          </p>
        </div>

        {/* Price & Mobile Add button */}
        <div className="pt-4 mt-2 border-t border-glow-100 flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-semibold text-luxury-dark">
                {formatUSD(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-luxury-muted line-through">
                  {formatUSD(product.originalPrice)}
                </span>
              )}
            </div>
            <div className="text-[11px] text-glow-700/80 font-medium">
              ≈ {formatUZS(product.price)}
            </div>
          </div>

          {/* Mobile direct button */}
          <button
            onClick={handleAddToCart}
            className={`sm:hidden p-2.5 rounded-xl border transition-all ${
              isAdded
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-glow-100 text-glow-800 border-glow-200 active:bg-glow-700 active:text-white'
            }`}
            aria-label="В корзину"
          >
            {isAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
