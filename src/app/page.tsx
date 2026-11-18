import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Feather, ShieldCheck, Leaf, Star, Heart } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '@/data/products';
import ProductCard from '@/components/ProductCard';

export default function HomePage() {
  const bestsellers = PRODUCTS.filter(p => p.isBestSeller).slice(0, 4);
  const newArrivals = PRODUCTS.filter(p => p.isNew || p.id === 'fleur-de-soie-perfume' || p.id === 'silk-cushion-foundation').slice(0, 4);

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-glow-50/70 border-b border-glow-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-glow-300 shadow-sm text-xs text-glow-800 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-glow-600" />
                <span>Весенняя коллекция сияния 2026</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-luxury-dark tracking-tight leading-[1.08]">
                Искусство <br />
                <span className="italic font-light text-glow-700">естественного</span> сияния
              </h1>

              <p className="text-base sm:text-lg text-luxury-muted max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                Инновационные формулы с биоактивными пептидами, редкими ботаническими экстрактами и шёлковыми текстурами для безупречной кожи.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/catalog"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-glow-900 hover:bg-glow-800 text-white text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-lg hover:shadow-glow-400/30 flex items-center justify-center gap-2 group"
                >
                  <span>Открыть каталог</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/catalog?category=skincare"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-white border border-glow-300 hover:border-glow-500 text-luxury-dark text-xs uppercase tracking-widest font-semibold transition shadow-sm hover:shadow-soft"
                >
                  Уход за кожей
                </Link>
              </div>

              {/* Stats badges */}
              <div className="pt-8 border-t border-glow-200/80 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
                <div>
                  <div className="font-serif text-2xl sm:text-3xl font-normal text-luxury-dark">100%</div>
                  <div className="text-[11px] uppercase tracking-wider text-luxury-muted mt-0.5">Cruelty-Free</div>
                </div>
                <div>
                  <div className="font-serif text-2xl sm:text-3xl font-normal text-luxury-dark">4.9 ★</div>
                  <div className="text-[11px] uppercase tracking-wider text-luxury-muted mt-0.5">Средний рейтинг</div>
                </div>
                <div>
                  <div className="font-serif text-2xl sm:text-3xl font-normal text-luxury-dark">24/7</div>
                  <div className="text-[11px] uppercase tracking-wider text-luxury-muted mt-0.5">Stripe & Payme</div>
                </div>
              </div>
            </div>

            {/* Right Hero Image Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative blob / ring */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-glow-200 via-nude-200 to-glow-300 rounded-[2.5rem] blur-xl opacity-60 transform -rotate-3" />
                
                {/* Main Image Frame */}
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl bg-white">
                  <Image
                    src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1200&q=80"
                    alt="Glow Beauty Luxury Skincare"
                    fill
                    priority
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  
                  {/* Floating badge inside image */}
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/90 backdrop-blur-md border border-white/60 shadow-lg">
                    <p className="text-[11px] uppercase tracking-widest text-glow-800 font-semibold">Культовый продукт</p>
                    <p className="font-serif text-base text-luxury-dark font-medium">Rose Quartz Radiance Serum</p>
                    <p className="text-xs text-luxury-muted mt-0.5">Витамин C 15% & дамасская роза</p>
                  </div>
                </div>

                {/* Floating pill badge */}
                <div className="absolute -top-4 -right-4 bg-white px-4 py-2 rounded-2xl shadow-lg border border-glow-200 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-glow-600 fill-glow-600" />
                  <span className="text-xs font-semibold text-luxury-dark">Выбор редакции</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-glow-700 font-semibold">Коллекции</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-luxury-dark mt-1 font-normal">
            Категории красоты
          </h2>
          <p className="text-xs sm:text-sm text-luxury-muted mt-2">
            Выберите ритуал ухода под ваши индивидуальные потребности
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalog?category=${cat.id}`}
              className="group p-6 rounded-2xl bg-white border border-glow-200/80 hover:border-glow-400 hover:shadow-hover transition-all duration-300 text-center flex flex-col items-center justify-center space-y-2"
            >
              <div className="w-14 h-14 rounded-full bg-glow-100/70 group-hover:bg-glow-200/70 flex items-center justify-center text-glow-800 transition-colors">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-normal text-luxury-dark group-hover:text-glow-700 transition">
                {cat.label}
              </h3>
              <p className="text-[11px] text-luxury-muted line-clamp-1 leading-snug">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Bestsellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-glow-700 font-semibold">Фавориты клиентов</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-luxury-dark mt-1 font-normal">
              Бестселлеры Glow Beauty
            </h2>
          </div>
          <Link
            href="/catalog"
            className="text-xs uppercase tracking-widest font-semibold text-glow-800 hover:text-glow-600 flex items-center gap-1.5 transition"
          >
            <span>Смотреть все</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Philosophy / Value Props Banner */}
      <section className="bg-glow-100/70 border-y border-glow-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.25em] text-glow-700 font-semibold">Философия бренда</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-luxury-dark mt-1 font-normal">
              Осознанный подход к вашей красоте
            </h2>
            <p className="text-xs sm:text-sm text-luxury-muted mt-2">
              Мы создаем косметику, которая бережно заботится о коже и не требует компромиссов между эффективностью и безопасностью.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-glow-200/80 text-center">
              <div className="w-12 h-12 rounded-full bg-glow-200/70 text-glow-800 mx-auto flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-medium text-luxury-dark">Чистые формулы</h3>
              <p className="text-xs text-luxury-muted mt-2 leading-relaxed">
                Без парабенов, сульфатов, минеральных масел и микропластика. Только биосовместимые ингредиенты.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-glow-200/80 text-center">
              <div className="w-12 h-12 rounded-full bg-glow-200/70 text-glow-800 mx-auto flex items-center justify-center mb-4">
                <Feather className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-medium text-luxury-dark">Cruelty-Free</h3>
              <p className="text-xs text-luxury-muted mt-2 leading-relaxed">
                Мы никогда не тестируем продукцию на животных и сотрудничаем только с этичными поставщиками.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-glow-200/80 text-center">
              <div className="w-12 h-12 rounded-full bg-glow-200/70 text-glow-800 mx-auto flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-medium text-luxury-dark">Доказанный эффект</h3>
              <p className="text-xs text-luxury-muted mt-2 leading-relaxed">
                Все формулы проходят независимые дерматологические тесты и клинические исследования.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-glow-200/80 text-center">
              <div className="w-12 h-12 rounded-full bg-glow-200/70 text-glow-800 mx-auto flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-medium text-luxury-dark">Премиум текстуры</h3>
              <p className="text-xs text-luxury-muted mt-2 leading-relaxed">
                Нежные шелковые эмульсии, моментально впитывающиеся масла и утонченные французские отдушки.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-glow-700 font-semibold">Свежие новинки</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-luxury-dark mt-1 font-normal">
              Новые поступления
            </h2>
          </div>
          <Link
            href="/catalog"
            className="text-xs uppercase tracking-widest font-semibold text-glow-800 hover:text-glow-600 flex items-center gap-1.5 transition"
          >
            <span>В каталог</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Editorial Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-glow-900 text-white p-8 sm:p-14 lg:p-16">
          <div className="absolute inset-0 opacity-25">
            <Image
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=80"
              alt="Glow Beauty Collection"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="text-xs uppercase tracking-[0.3em] text-glow-300 font-semibold">
              Специальное предложение
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal leading-tight">
              Подарите себе ритуал королевского ухода
            </h2>
            <p className="text-sm text-glow-100/80 leading-relaxed font-light">
              Используйте промокод <span className="font-semibold text-white underline underline-offset-4">GLOW10</span> при оформлении заказа и получите скидку 10% на всю корзину. Доставка бесплатна при заказе от $75.
            </p>
            <div className="pt-2">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-luxury-dark hover:bg-glow-100 text-xs uppercase tracking-widest font-semibold transition shadow-lg"
              >
                <span>Выбрать косметику</span>
                <ArrowRight className="w-4 h-4 text-glow-700" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
