import { NextResponse } from 'next/server';
import { getOrderById } from '@/lib/db';
import { paymeService } from '@/lib/payments/payme';

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'orderId обязателен' }, { status: 400 });
    }

    const order = getOrderById(orderId);
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
