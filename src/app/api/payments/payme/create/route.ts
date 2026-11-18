import { NextResponse } from 'next/server';
import { getOrderById, saveOrder } from '@/lib/db';
import { paymeService } from '@/lib/payments/payme';

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
    const callbackReturnUrl = `${origin}/checkout/success?order_id=${order.id}&method=payme`;

    const paymentInfo = paymeService.generatePaymentLink(order, callbackReturnUrl);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      paymeUrl: paymentInfo.paymeUrl,
      amountInUzs: paymentInfo.amountInUzs,
      amountInTiyin: paymentInfo.amountInTiyin,
      sandboxModalUrl: `/checkout/payme-sandbox?order_id=${order.id}&amount=${paymentInfo.amountInUzs}`,
    });
  } catch (err: any) {
    console.error('Payme session error:', err);
    return NextResponse.json(
      { error: err.message || 'Ошибка создания платежной сессии Payme' },
      { status: 500 }
    );
  }
}
