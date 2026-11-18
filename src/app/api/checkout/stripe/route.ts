import { NextResponse } from 'next/server';
import { getOrderById, saveOrder } from '@/lib/db';
import { createStripeCheckoutSession } from '@/lib/payments/stripe';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, order: fallbackOrder } = body;

    if (!orderId && !fallbackOrder?.id) {
      return NextResponse.json({ error: 'orderId обязателен' }, { status: 400 });
    }

    const effectiveId = orderId || fallbackOrder?.id;
    let order = getOrderById(effectiveId);

    // If order was created in another serverless lambda instance, sync it now
    if (!order && fallbackOrder) {
      order = saveOrder(fallbackOrder);
    }

    if (!order) {
      return NextResponse.json({ error: 'Заказ не найден' }, { status: 404 });
    }

    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const checkoutSession = await createStripeCheckoutSession(order, origin);

    return NextResponse.json({
      success: true,
      sessionId: checkoutSession.sessionId,
      url: checkoutSession.checkoutUrl,
      isSimulated: checkoutSession.isSimulated,
      message: checkoutSession.message,
    });
  } catch (err: any) {
    console.error('Stripe checkout session error:', err);
    return NextResponse.json(
      { error: err.message || 'Ошибка создания сессии Stripe' },
      { status: 500 }
    );
  }
}
