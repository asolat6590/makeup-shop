import { NextResponse } from 'next/server';
import { getOrderById, updateOrderStatus } from '@/lib/db';
import { OrderStatus } from '@/types';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const order = getOrderById(id);

  if (!order) {
    return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 });
  }

  return NextResponse.json({ order });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, paymentStatus, paymentId } = body;

    const validStatuses: OrderStatus[] = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Недопустимый статус заказа' }, { status: 400 });
    }

    const updated = updateOrderStatus(id, status, paymentStatus, paymentId);
    if (!updated) {
      return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    return NextResponse.json({ error: 'Ошибка обновления заказа' }, { status: 500 });
  }
}
