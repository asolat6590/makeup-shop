'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import {
  Star,
  ShoppingBag,
  Check,
  Plus,
  Minus,
  ArrowLeft,
  Truck,
  ShieldCheck,
  Sparkles,
  Heart,
  Share2
} from 'lucide-react';
import { PRODUCTS, getProductById, formatUSD, formatUZS } from '@/data/products';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const product = getProductById(params.id);

  if (!product) {
    notFound();
  }

  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'benefits' | 'ingredients' | 'usage'>('benefits');
  const [isAdded, setIsAdded] = useState(false);

  // Related products from the same category or bestsellers
  const related = PRODUCTS.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <div className="mb-6 flex items-center gap-2 text-xs text-luxury-muted">
        <Link href="/" className="hover:text-glow-700 transition">Главная</Link>
        <span>/</span>
        <Link href="/catalog" className="hover:text-glow-700 transition">Каталог</Link>
        <span>/</span>
        <Link href={`/catalog?category=${product.category}`} className="hover:text-glow-700 transition">{product.categoryLabel}</Link>
        <span>/</span>
        <span className="text-luxury-dark truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main product view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left: Images */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:w-24 shrink-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 transition ${
                    selectedImage === idx
                      ? 'border-glow-600 ring-2 ring-glow-200'
                      : 'border-glow-200 hover:border-glow-400 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`${product.name} thumb ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main Photo */}
          <div className="flex-1 relative aspect-[4/5] rounded-3xl overflow-hidden bg-glow-50 border border-glow-200 shadow-card">
            <Image
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              fill
              priority
              className="object-cover object-center"
            />
            {product.isBestSeller && (
              <span className="absolute top-4 left-4 bg-glow-900 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                Бестселлер
              </span>
            )}
          </div>
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div>
            {/* Category tag & volume */}
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-xs uppercase tracking-[0.25em] text-glow-700 font-semibold">
                {product.categoryLabel}
              </span>
              <span className="bg-glow-100 text-glow-900 px-2.5 py-0.5 rounded-full font-medium">
                Объем: {product.volume}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-luxury-dark font-normal leading-snug">
              {product.name}
            </h1>
            <p className="text-xs sm:text-sm text-luxury-muted mt-2 leading-relaxed">
              {product.subtitle}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-glow-100">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400 stroke-amber-400'
                        : 'stroke-amber-300 text-transparent'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-luxury-dark">{product.rating}</span>
              <span className="text-xs text-luxury-muted">({product.reviewCount} отзывов покупателей)</span>
            </div>

            {/* Price Box */}
            <div className="mt-5 p-4 rounded-2xl bg-glow-50/70 border border-glow-200">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-luxury-dark">
                  {formatUSD(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-luxury-muted line-through">
                    {formatUSD(product.originalPrice)}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="text-xs font-semibold text-glow-700 bg-glow-200/60 px-2 py-0.5 rounded-md">
                    Экономия {formatUSD(product.originalPrice - product.price)}
                  </span>
                )}
              </div>
              <div className="text-xs text-glow-800/80 font-medium mt-1">
                Эквивалент в сумах: <span className="font-semibold">{formatUZS(product.price)}</span>
              </div>
            </div>

            {/* Skin type tags */}
            <div className="mt-4">
              <span className="text-xs font-medium text-luxury-muted">Рекомендовано для: </span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {product.skinType.map((st, idx) => (
                  <span key={idx} className="text-[11px] bg-white border border-glow-200 px-2.5 py-0.5 rounded-full text-luxury-dark">
                    {st}
                  </span>
                ))}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-glow-300 rounded-2xl bg-white p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-luxury-muted hover:text-luxury-dark transition"
                    aria-label="Уменьшить"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-semibold text-luxury-dark min-w-[28px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-luxury-muted hover:text-luxury-dark transition"
                    aria-label="Увеличить"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 px-6 rounded-2xl text-xs uppercase tracking-widest font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-glow-700 hover:bg-glow-800 text-white'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Добавлено в корзину</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>В корзину • {formatUSD(product.price * quantity)}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Buy Now Direct */}
              <button
                onClick={handleBuyNow}
                className="w-full py-3 px-6 rounded-2xl text-xs uppercase tracking-widest font-semibold bg-glow-900 hover:bg-glow-800 text-white transition shadow-sm"
              >
                Купить сразу в 1 клик
              </button>
            </div>

            {/* Delivery & Trust highlights */}
            <div className="mt-6 pt-6 border-t border-glow-100 space-y-2.5 text-xs text-luxury-muted">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-glow-600 shrink-0" />
                <span>Бесплатная курьерская доставка при заказе от $75</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-glow-600 shrink-0" />
                <span>Оригинальная продукция с сертификатами подлинности</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-glow-600 shrink-0" />
                <span>Оплата картой Stripe или через Payme (Uzcard / Humo)</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Tabs: Benefits, Ingredients, Usage */}
      <div className="mt-16 bg-white rounded-3xl border border-glow-200 p-6 sm:p-10 shadow-card">
        <div className="flex items-center gap-6 border-b border-glow-200 pb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('benefits')}
            className={`text-xs uppercase tracking-widest font-semibold pb-2 transition relative whitespace-nowrap ${
              activeTab === 'benefits'
                ? 'text-glow-700 border-b-2 border-glow-600'
                : 'text-luxury-muted hover:text-luxury-dark'
            }`}
          >
            Описание и преимущества
          </button>
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`text-xs uppercase tracking-widest font-semibold pb-2 transition relative whitespace-nowrap ${
              activeTab === 'ingredients'
                ? 'text-glow-700 border-b-2 border-glow-600'
                : 'text-luxury-muted hover:text-luxury-dark'
            }`}
          >
            Полный состав (INCI)
          </button>
          <button
            onClick={() => setActiveTab('usage')}
            className={`text-xs uppercase tracking-widest font-semibold pb-2 transition relative whitespace-nowrap ${
              activeTab === 'usage'
                ? 'text-glow-700 border-b-2 border-glow-600'
                : 'text-luxury-muted hover:text-luxury-dark'
            }`}
          >
            Способ применения
          </button>
        </div>

        <div className="pt-6">
          {activeTab === 'benefits' && (
            <div className="space-y-6">
              <p className="text-sm text-luxury-dark leading-relaxed font-light">
                {product.description}
              </p>
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-glow-800 mb-3">
                  Ключевые преимущества формулы:
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-luxury-muted">
                      <span className="w-1.5 h-1.5 rounded-full bg-glow-600 mt-1.5 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div className="space-y-4">
              <p className="text-xs text-luxury-muted leading-relaxed font-mono bg-glow-50 p-4 rounded-xl border border-glow-200">
                {product.ingredients}
              </p>
              <p className="text-[11px] text-luxury-muted italic">
                * Формула не содержит парабенов, формальдегидов, фталатов, минеральных масел, оксибензона и гидрохинона.
              </p>
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="space-y-4">
              <p className="text-sm text-luxury-dark leading-relaxed font-light">
                {product.usageInstructions}
              </p>
              <div className="p-4 rounded-xl bg-glow-50 border border-glow-200 text-xs text-glow-900">
                <span className="font-semibold">Совет косметолога:</span> Для максимального сияния наносите на слегка влажную кожу сразу после умывания или использования тонера.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-20">
          <div className="mb-8">
            <span className="text-xs uppercase tracking-[0.25em] text-glow-700 font-semibold">Вам также понравится</span>
            <h3 className="font-serif text-2xl sm:text-3xl text-luxury-dark mt-1 font-normal">
              Похожие средства
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
