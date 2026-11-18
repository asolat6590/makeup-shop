'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { XCircle, RefreshCw, ShoppingBag, ArrowLeft, ShieldAlert } from 'lucide-react';

function CancelContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const method = searchParams.get('method');

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <div className="bg-white rounded-3xl border border-rose-200 p-8 sm:p-12 shadow-card text-center relative overflow-hidden">
        {/* Top red bar */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-rose-400 via-rose-500 to-rose-400" />

        {/* Cancel Icon */}
        <div className="w-20 h-20 rounded-full bg-rose-50 border-2 border-rose-200 text-rose-500 mx-auto flex items-center justify-center mb-6 shadow-sm">
          <XCircle className="w-10 h-10" />
        </div>

        <span className="text-xs uppercase tracking-[0.25em] text-rose-700 font-semibold">
          Платеж отменен
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl text-luxury-dark mt-2 font-normal">
          Оплата не была завершена
        </h1>

        <p className="text-xs sm:text-sm text-luxury-muted max-w-md mx-auto mt-3 leading-relaxed">
          Операция оплаты была отменена или отклонена банком. Средства с вашего счета не списывались.
        </p>

        {orderId && (
          <div className="my-6 p-3 rounded-xl bg-rose-50/60 border border-rose-200 inline-block text-xs text-rose-900 font-mono">
            Заказ: <strong>{orderId}</strong> ({method === 'payme' ? 'Payme' : 'Stripe'})
          </div>
        )}

        <div className="text-left bg-glow-50/70 p-5 rounded-2xl border border-glow-200 text-xs text-luxury-muted space-y-2 mb-8">
          <h4 className="font-semibold text-luxury-dark uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-glow-700" />
            Возможные причины:
          </h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Вы нажали «Отменить» на странице платежного шлюза.</li>
            <li>Лимит по онлайн-платежам или недостаточно средств на карте.</li>
            <li>Неверно введен проверочный SMS-код или CVC/CVV.</li>
            <li>Банк запросил дополнительное подтверждение в мобильном приложении.</li>
          </ul>
        </div>

        {/* Retry Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/checkout"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-glow-700 hover:bg-glow-800 text-white text-xs uppercase tracking-widest font-semibold transition shadow-md flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Попробовать оплатить снова</span>
          </Link>
          <Link
            href="/cart"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white border border-glow-300 hover:border-glow-500 text-luxury-dark text-xs uppercase tracking-widest font-semibold transition flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Вернуться в корзину</span>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function CheckoutCancelPage() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-glow-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      </div>
    }>
      <CancelContent />
    </Suspense>
  );
}
