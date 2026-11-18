'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CreditCard, ShieldCheck, Lock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { formatUSD } from '@/data/products';

function StripeSimulatorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = searchParams.get('session_id') || `cs_test_${Date.now()}`;
  const orderId = searchParams.get('order_id') || '';
  const amount = parseFloat(searchParams.get('amount') || '0');

  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('123');
  const [cardHolder, setCardHolder] = useState('ALINA SOKOLOVA');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaySuccess = async () => {
    setIsProcessing(true);
    try {
      // Update localStorage immediately
      try {
        const localSaved = localStorage.getItem(`glow_beauty_order_${orderId}`);
        if (localSaved) {
          const parsed = JSON.parse(localSaved);
          parsed.status = 'paid';
          parsed.paymentStatus = 'succeeded';
          parsed.paymentId = sessionId;
          localStorage.setItem(`glow_beauty_order_${orderId}`, JSON.stringify(parsed));
        }
      } catch (e) {}

      // Update order status in backend database to paid
      if (orderId) {
        await fetch(`/api/orders/${orderId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: 'paid',
            paymentStatus: 'succeeded',
            paymentId: sessionId,
          }),
        });
      }
      setTimeout(() => {
        router.push(`/checkout/success?session_id=${sessionId}&order_id=${orderId}&method=stripe`);
      }, 500);
    } catch (e) {
      console.error(e);
      router.push(`/checkout/success?session_id=${sessionId}&order_id=${orderId}&method=stripe`);
    }
  };

  const handlePayCancel = () => {
    router.push(`/checkout/cancel?order_id=${orderId}&method=stripe`);
  };

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-800">
        
        {/* Stripe Header */}
        <div className="bg-[#635BFF] p-6 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-white/80">
              Stripe Test Checkout
            </span>
            <h2 className="text-xl font-bold tracking-tight">Glow Beauty Store</h2>
          </div>
          <div className="text-right">
            <span className="text-xs text-white/80">Сумма к оплате:</span>
            <div className="text-2xl font-bold">{formatUSD(amount)}</div>
          </div>
        </div>

        {/* Test notice */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 text-xs text-amber-800 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
          <span><strong>Тестовый режим Stripe:</strong> деньги с карты не списываются.</span>
        </div>

        {/* Card Form */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Номер тестовой карты (Stripe Test Card)
            </label>
            <div className="relative">
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm font-mono border border-slate-300 rounded-xl focus:outline-none focus:border-[#635BFF]"
              />
              <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Тестовая карта Stripe: 4242 4242 4242 4242</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Срок действия
              </label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-mono border border-slate-300 rounded-xl focus:outline-none focus:border-[#635BFF]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                CVC / CVV
              </label>
              <input
                type="text"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-mono border border-slate-300 rounded-xl focus:outline-none focus:border-[#635BFF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Имя на карте
            </label>
            <input
              type="text"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm font-mono border border-slate-300 rounded-xl focus:outline-none focus:border-[#635BFF]"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 space-y-2.5">
            <button
              onClick={handlePaySuccess}
              disabled={isProcessing}
              className="w-full py-3.5 px-4 bg-[#635BFF] hover:bg-[#5349e0] disabled:bg-slate-400 text-white rounded-xl text-xs uppercase tracking-wider font-bold transition flex items-center justify-center gap-2 shadow-lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Проведение платежа в Stripe...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Оплатить {formatUSD(amount)} (Тест Успешно)</span>
                </>
              )}
            </button>

            <button
              onClick={handlePayCancel}
              disabled={isProcessing}
              className="w-full py-2.5 px-4 border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-xl text-xs uppercase tracking-wider font-medium transition flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              <span>Симулировать отказ / Отмену оплаты</span>
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Lock className="w-3.5 h-3.5" />
            <span>End-to-end encrypted test checkout session</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function StripeSimulatorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-[#635BFF] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <StripeSimulatorContent />
    </Suspense>
  );
}
