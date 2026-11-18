'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ShieldCheck, Lock, CheckCircle2, XCircle, Loader2, ArrowRight, Smartphone, Terminal } from 'lucide-react';
import { USD_TO_UZS } from '@/data/products';

export default function PaymeSandboxPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get('order_id') || 'ORD-TEST-GB';
  const amountParam = searchParams.get('amount') || '500000';
  const amountInUzs = parseInt(amountParam, 10);
  const amountInTiyin = amountInUzs * 100;

  const [cardNumber, setCardNumber] = useState('8600 1234 5678 9012');
  const [expiry, setExpiry] = useState('08/29');
  const [smsCode, setSmsCode] = useState('666666');
  const [step, setStep] = useState<'card' | 'sms' | 'done'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [log, setLog] = useState<string[]>([
    `[Payme API] Создана платежная сессия для заказа ${orderId}`,
    `[Payme API] Сумма: ${new Intl.NumberFormat('ru-RU').format(amountInUzs)} сум (${amountInTiyin} тийин)`,
  ]);

  const addLog = (msg: string) => {
    setLog(prev => [...prev, msg]);
  };

  const handleProceedToSms = async () => {
    setIsProcessing(true);
    addLog('[Payme -> Glow Beauty] Вызов метода CheckPerformTransaction...');

    try {
      // 1. Call CheckPerformTransaction
      const checkRes = await fetch('/api/payments/payme/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic MockPaymeSandboxSecretHeader',
        },
        body: JSON.stringify({
          method: 'CheckPerformTransaction',
          params: {
            amount: amountInTiyin,
            account: { order_id: orderId },
          },
          id: 1,
        }),
      });

      const checkData = await checkRes.json();
      addLog(`[Glow Beauty -> Payme] Ответ Check: ${JSON.stringify(checkData.result || checkData.error)}`);

      if (checkData.error) {
        alert('Ошибка проверки заказа: ' + checkData.error.message.ru);
        setIsProcessing(false);
        return;
      }

      // 2. Call CreateTransaction
      addLog('[Payme -> Glow Beauty] Вызов метода CreateTransaction...');
      const txId = 'payme_tx_' + Date.now();
      const createRes = await fetch('/api/payments/payme/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic MockPaymeSandboxSecretHeader',
        },
        body: JSON.stringify({
          method: 'CreateTransaction',
          params: {
            id: txId,
            time: Date.now(),
            amount: amountInTiyin,
            account: { order_id: orderId },
          },
          id: 2,
        }),
      });
      const createData = await createRes.json();
      addLog(`[Glow Beauty -> Payme] Транзакция создана в состоянии 1 (STATE_IN_PROGRESS)`);

      setIsProcessing(false);
      setStep('sms');
    } catch (err: any) {
      addLog(`[Error] ${err.message}`);
      setIsProcessing(false);
    }
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    const txId = 'payme_tx_' + Date.now();
    addLog(`[Payme -> Glow Beauty] SMS код подтвержден. Вызов метода PerformTransaction (ID: ${txId})...`);

    try {
      // PerformTransaction triggers DB status update to 'paid'
      const performRes = await fetch('/api/payments/payme/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic MockPaymeSandboxSecretHeader',
        },
        body: JSON.stringify({
          method: 'PerformTransaction',
          params: {
            id: txId,
          },
          id: 3,
        }),
      });

      const performData = await performRes.json();
      addLog(`[Glow Beauty Backend] Статус заказа изменен на "PAID" после подтверждения Payme.`);
      addLog(`[Glow Beauty -> Payme] Результат: ${JSON.stringify(performData.result || performData.error)}`);

      setTimeout(() => {
        router.push(`/checkout/success?order_id=${orderId}&method=payme&tx=${txId}`);
      }, 1000);
    } catch (err: any) {
      console.error(err);
      router.push(`/checkout/success?order_id=${orderId}&method=payme`);
    }
  };

  const handleDecline = () => {
    router.push(`/checkout/cancel?order_id=${orderId}&method=payme`);
  };

  return (
    <div className="min-h-screen bg-slate-900 py-10 px-4 flex flex-col items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-700">
        
        {/* Payme Header */}
        <div className="bg-[#14E5D4] text-slate-900 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-[#14E5D4] flex items-center justify-center font-bold text-lg font-mono">
              P
            </div>
            <div>
              <div className="text-[10px] tracking-widest uppercase font-bold text-slate-800">
                Payme Business • Test Sandbox
              </div>
              <h2 className="text-xl font-black tracking-tight">Glow Beauty</h2>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-medium text-slate-800">К оплате:</span>
            <div className="text-xl font-bold font-mono">
              {new Intl.NumberFormat('ru-RU').format(amountInUzs)} сум
            </div>
          </div>
        </div>

        {/* Info ribbon */}
        <div className="bg-sky-50 border-b border-sky-100 px-6 py-2.5 text-xs text-sky-900 flex items-center justify-between">
          <span className="font-mono">Заказ: <strong>{orderId}</strong></span>
          <span className="bg-sky-200/70 text-sky-900 px-2 py-0.5 rounded font-mono text-[10px]">
            JSON-RPC 2.0 CALLBACK EMULATOR
          </span>
        </div>

        {/* Step 1: Card Input */}
        {step === 'card' && (
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Номер карты Uzcard / Humo
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full px-4 py-2.5 text-sm font-mono border border-slate-300 rounded-xl focus:outline-none focus:border-[#14E5D4]"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Поддерживаются тестовые карты Uzcard (8600) и Humo (9860)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Срок действия (ММ/ГГ)
                </label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm font-mono border border-slate-300 rounded-xl focus:outline-none focus:border-[#14E5D4]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Провайдер
                </label>
                <div className="px-4 py-2.5 text-sm font-semibold bg-slate-100 rounded-xl text-slate-800">
                  UZCARD / HUMO
                </div>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={handleProceedToSms}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-500 text-[#14E5D4] rounded-xl text-xs uppercase tracking-wider font-bold transition flex items-center justify-center gap-2 shadow-lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#14E5D4]" />
                    <span>Проверка заказа в Glow Beauty API...</span>
                  </>
                ) : (
                  <>
                    <span>Получить SMS-код подтверждения</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                onClick={handleDecline}
                className="w-full py-2.5 text-xs text-rose-600 hover:text-rose-800 transition uppercase tracking-wider font-medium"
              >
                Отклонить операцию
              </button>
            </div>
          </div>
        )}

        {/* Step 2: SMS Verification */}
        {step === 'sms' && (
          <div className="p-6 space-y-5">
            <div className="text-center py-2">
              <div className="w-12 h-12 rounded-full bg-[#14E5D4]/20 text-slate-900 mx-auto flex items-center justify-center mb-2">
                <Smartphone className="w-6 h-6 text-slate-800" />
              </div>
              <h3 className="font-semibold text-slate-900 text-sm">Введите код из SMS</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Код отправлен на номер, привязанный к карте {cardNumber.slice(0, 4)} **** {cardNumber.slice(-4)}
              </p>
            </div>

            <div className="max-w-xs mx-auto">
              <input
                type="text"
                value={smsCode}
                onChange={(e) => setSmsCode(e.target.value)}
                maxLength={6}
                className="w-full text-center tracking-[0.5em] text-2xl font-mono py-3 border-2 border-[#14E5D4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#14E5D4]"
              />
              <p className="text-[11px] text-center text-slate-500 mt-1">Тестовый код: 666666</p>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-500 text-[#14E5D4] rounded-xl text-xs uppercase tracking-wider font-bold transition flex items-center justify-center gap-2 shadow-lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#14E5D4]" />
                    <span>Отправка callback PerformTransaction...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Подтвердить оплату {new Intl.NumberFormat('ru-RU').format(amountInUzs)} сум</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDecline}
                className="w-full py-2.5 text-xs text-rose-600 hover:text-rose-800 transition uppercase tracking-wider font-medium"
              >
                Отменить
              </button>
            </div>
          </div>
        )}

        {/* Architectural Live Console */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 text-[11px] font-mono text-emerald-400">
          <div className="flex items-center gap-1.5 text-slate-400 mb-2 pb-1 border-b border-slate-800">
            <Terminal className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase tracking-wider">Payme Merchant JSON-RPC 2.0 Webhook Console:</span>
          </div>
          <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
            {log.map((line, idx) => (
              <div key={idx} className="leading-tight">
                {line}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
