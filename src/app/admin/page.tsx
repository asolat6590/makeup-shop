'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  Search,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle2,
  Clock,
  Package,
  DollarSign,
  TrendingUp,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { formatUSD, formatUZS } from '@/data/products';

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error('Error fetching admin orders:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          paymentStatus: newStatus === 'paid' || newStatus === 'delivered' ? 'succeeded' : undefined,
        }),
      });
      const data = await res.json();
      if (data.order) {
        setOrders(prev => prev.map(o => o.id === orderId ? data.order : o));
      }
    } catch (e) {
      alert('Ошибка обновления статуса');
    } finally {
      setUpdatingId(null);
    }
  };

  // Metrics
  const totalRevenue = orders
    .filter(o => o.status === 'paid' || o.status === 'processing' || o.status === 'shipped' || o.status === 'delivered')
    .reduce((sum, o) => sum + o.total, 0);

  const paidCount = orders.filter(o => o.status === 'paid' || o.status === 'delivered' || o.status === 'processing').length;
  const stripeOrdersCount = orders.filter(o => o.paymentMethod === 'stripe').length;
  const paymeOrdersCount = orders.filter(o => o.paymentMethod === 'payme').length;
  const aov = paidCount > 0 ? Math.round(totalRevenue / paidCount) : 0;

  // Filtered orders
  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchId = order.id.toLowerCase().includes(q);
      const matchName = order.customer.fullName.toLowerCase().includes(q);
      const matchPhone = order.customer.phone.toLowerCase().includes(q);
      const matchEmail = order.customer.email.toLowerCase().includes(q);
      return matchId || matchName || matchPhone || matchEmail;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-glow-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-glow-700 font-semibold">
            <Shield className="w-4 h-4 text-glow-600" />
            <span>Панель управления</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-luxury-dark mt-1 font-normal">
            Заказы магазина Glow Beauty
          </h1>
        </div>

        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-glow-300 hover:border-glow-500 text-xs text-luxury-dark font-medium transition shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Обновить данные</span>
        </button>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-glow-200 shadow-card">
          <div className="flex items-center justify-between text-luxury-muted mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Общая выручка</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-luxury-dark">{formatUSD(totalRevenue)}</div>
          <div className="text-xs text-glow-700 mt-1">≈ {formatUZS(totalRevenue)}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-glow-200 shadow-card">
          <div className="flex items-center justify-between text-luxury-muted mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Всего заказов</span>
            <Package className="w-4 h-4 text-glow-600" />
          </div>
          <div className="text-2xl font-bold text-luxury-dark">{orders.length}</div>
          <div className="text-xs text-emerald-700 mt-1">{paidCount} оплачено успешно</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-glow-200 shadow-card">
          <div className="flex items-center justify-between text-luxury-muted mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Средний чек (AOV)</span>
            <TrendingUp className="w-4 h-4 text-glow-600" />
          </div>
          <div className="text-2xl font-bold text-luxury-dark">{formatUSD(aov)}</div>
          <div className="text-xs text-luxury-muted mt-1">По оплаченным заказам</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-glow-200 shadow-card">
          <div className="flex items-center justify-between text-luxury-muted mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold">Методы оплаты</span>
            <CreditCard className="w-4 h-4 text-glow-600" />
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="bg-glow-100 text-glow-900 px-2.5 py-1 rounded-md font-mono">
              Stripe: {stripeOrdersCount}
            </span>
            <span className="bg-sky-100 text-sky-900 px-2.5 py-1 rounded-md font-mono">
              Payme: {paymeOrdersCount}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {[
            { key: 'all', label: 'Все' },
            { key: 'pending', label: 'Ожидают' },
            { key: 'paid', label: 'Оплачены' },
            { key: 'processing', label: 'В сборке' },
            { key: 'shipped', label: 'В доставке' },
            { key: 'delivered', label: 'Доставлены' },
            { key: 'cancelled', label: 'Отменены' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition whitespace-nowrap ${
                statusFilter === tab.key
                  ? 'bg-glow-900 text-white shadow-sm'
                  : 'bg-white text-luxury-dark border border-glow-200 hover:border-glow-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по ID, имени или телефону..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-glow-300 rounded-full focus:outline-none focus:border-glow-600 shadow-sm"
          />
          <Search className="w-3.5 h-3.5 text-luxury-muted absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-glow-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-glow-50/70 border-b border-glow-200 text-luxury-muted uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4 font-semibold">ID заказа</th>
                <th className="py-3.5 px-4 font-semibold">Дата</th>
                <th className="py-3.5 px-4 font-semibold">Покупатель</th>
                <th className="py-3.5 px-4 font-semibold">Товары</th>
                <th className="py-3.5 px-4 font-semibold">Способ оплаты</th>
                <th className="py-3.5 px-4 font-semibold">Сумма</th>
                <th className="py-3.5 px-4 font-semibold">Статус</th>
                <th className="py-3.5 px-4 font-semibold text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glow-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-luxury-muted">
                    Заказы не найдены
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-glow-50/40 transition">
                    {/* Order ID */}
                    <td className="py-4 px-4 font-mono font-bold text-luxury-dark">
                      <Link href={`/order/${order.id}`} className="text-glow-800 hover:underline">
                        {order.id}
                      </Link>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-luxury-muted whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-4">
                      <div className="font-medium text-luxury-dark">{order.customer.fullName}</div>
                      <div className="text-[11px] text-luxury-muted">{order.customer.phone}</div>
                      <div className="text-[10px] text-luxury-muted truncate max-w-[140px]">{order.customer.city}</div>
                    </td>

                    {/* Items */}
                    <td className="py-4 px-4">
                      <div className="text-luxury-dark font-medium">
                        {order.items.length} {order.items.length === 1 ? 'позиция' : 'позиций'}
                      </div>
                      <div className="text-[11px] text-luxury-muted truncate max-w-[180px]">
                        {order.items.map(it => it.name).join(', ')}
                      </div>
                    </td>

                    {/* Payment Method */}
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono uppercase font-semibold ${
                        order.paymentMethod === 'payme'
                          ? 'bg-sky-100 text-sky-900 border border-sky-200'
                          : 'bg-glow-100 text-glow-900 border border-glow-200'
                      }`}>
                        {order.paymentMethod === 'payme' ? 'Payme (UZS)' : 'Stripe Card'}
                      </span>
                    </td>

                    {/* Total */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="font-bold text-luxury-dark">{formatUSD(order.total)}</div>
                      <div className="text-[10px] text-luxury-muted">≈ {formatUZS(order.total)}</div>
                    </td>

                    {/* Status dropdown */}
                    <td className="py-4 px-4">
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-medium focus:outline-none cursor-pointer ${
                          order.status === 'paid'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : order.status === 'delivered'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : order.status === 'processing'
                            ? 'bg-purple-50 text-purple-800 border-purple-300'
                            : order.status === 'shipped'
                            ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                            : order.status === 'cancelled'
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="pending">Ожидает оплаты</option>
                        <option value="paid">Оплачен</option>
                        <option value="processing">В сборке</option>
                        <option value="shipped">Передан курьеру</option>
                        <option value="delivered">Доставлен</option>
                        <option value="cancelled">Отменен</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <Link
                        href={`/order/${order.id}`}
                        className="inline-flex items-center gap-1 p-1.5 rounded-lg text-luxury-muted hover:text-glow-700 hover:bg-glow-100 transition"
                        title="Просмотр заказа"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
