'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { ProductCategory } from '@/types';

export default function CatalogPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // In stock filter
      if (inStockOnly && !product.inStock) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesSubtitle = product.subtitle.toLowerCase().includes(query);
        const matchesCategory = product.categoryLabel.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        return matchesName || matchesSubtitle || matchesCategory || matchesDesc;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [selectedCategory, searchQuery, sortBy, inStockOnly]);

  const activeCategoryTitle = selectedCategory === 'all'
    ? 'Все коллекции'
    : CATEGORIES.find(c => c.id === selectedCategory)?.label || 'Каталог';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="border-b border-glow-200 pb-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-glow-700 font-semibold">
              Glow Beauty Collection
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-luxury-dark mt-1 font-normal">
              {activeCategoryTitle}
            </h1>
            <p className="text-xs sm:text-sm text-luxury-muted mt-2">
              Найдено {filteredProducts.length} косметических средств
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по названию или составу..."
              className="w-full pl-10 pr-10 py-2.5 text-xs bg-white border border-glow-300 rounded-full text-luxury-dark placeholder-luxury-muted/70 focus:outline-none focus:border-glow-600 focus:ring-1 focus:ring-glow-500 shadow-sm transition"
            />
            <Search className="w-4 h-4 text-luxury-muted absolute left-3.5 top-3" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3 text-luxury-muted hover:text-luxury-dark"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Category Navigation Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-8">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-glow-900 text-white shadow-sm'
                : 'bg-white text-luxury-dark border border-glow-200 hover:border-glow-400'
            }`}
          >
            Все ({PRODUCTS.length})
          </button>
          {CATEGORIES.map(cat => {
            const count = PRODUCTS.filter(p => p.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-glow-900 text-white shadow-sm'
                    : 'bg-white text-luxury-dark border border-glow-200 hover:border-glow-400'
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Sort & In-stock toggle */}
        <div className="flex items-center gap-3 self-end lg:self-auto shrink-0">
          <label className="flex items-center gap-2 text-xs text-luxury-dark cursor-pointer select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded text-glow-700 focus:ring-glow-500 w-4 h-4"
            />
            <span>Только в наличии</span>
          </label>

          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-glow-200 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-luxury-muted" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-transparent text-luxury-dark text-xs focus:outline-none cursor-pointer"
            >
              <option value="default">Сортировка: Популярные</option>
              <option value="price-asc">Цена: по возрастанию</option>
              <option value="price-desc">Цена: по убыванию</option>
              <option value="rating">По рейтингу</option>
            </select>
          </div>
        </div>

      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-glow-200 p-8">
          <div className="w-16 h-16 rounded-full bg-glow-100 flex items-center justify-center text-glow-500 mx-auto mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl text-luxury-dark font-normal">
            Товары не найдены
          </h3>
          <p className="text-xs text-luxury-muted max-w-sm mx-auto mt-2 mb-6">
            Попробуйте изменить поисковый запрос или сбросить фильтры, чтобы увидеть всю коллекцию.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setInStockOnly(false);
              setSortBy('default');
            }}
            className="px-6 py-2.5 rounded-full bg-glow-700 text-white text-xs uppercase tracking-wider font-semibold hover:bg-glow-800 transition"
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
