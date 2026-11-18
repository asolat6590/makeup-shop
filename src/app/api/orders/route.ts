import { NextResponse } from 'next/server';
import { getAllOrders, saveOrder, generateOrderId } from '@/lib/db';
import { Order, OrderItem } from '@/types';

export async function GET() {
  const orders = getAllOrders();
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer, items, paymentMethod, subtotal, shipping, discount, discountCode, total } = body;

    // Basic validation
    if (!customer || !customer.fullName || !customer.phone || !customer.address) {
      return NextResponse.json(
        { error: 'Пожалуйста, заполните имя, телефон и адрес доставки' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Корзина пуста. Добавьте товары перед оформлением' },
        { status: 400 }
      );
    }

    const orderId = generateOrderId();
    const now = new Date().toISOString();

    const newOrder: Order = {
      id: orderId,
      createdAt: now,
      updatedAt: now,
      status: 'pending',
      paymentMethod: paymentMethod === 'payme' ? 'payme' : 'stripe',
      paymentStatus: 'pending',
      customer: {
        fullName: customer.fullName.trim(),
        email: customer.email?.trim() || '',
        phone: customer.phone.trim(),
        address: customer.address.trim(),
        city: customer.city?.trim() || 'Ташкент',
        notes: customer.notes?.trim() || '',
      },
      items: items.map((it: OrderItem) => ({
        productId: it.productId,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
        image: it.image,
        volume: it.volume || '',
      })),
      subtotal: Number(subtotal) || 0,
      shipping: Number(shipping) || 0,
      discount: Number(discount) || 0,
      discountCode: discountCode || undefined,
      total: Number(total) || 0,
    };

    saveOrder(newOrder);

    return NextResponse.json({
      success: true,
      order: newOrder,
    }, { status: 201 });
  } catch (err: any) {
    console.error('Error creating order:', err);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера при создании заказа' }, { status: 500 });
  }
}
