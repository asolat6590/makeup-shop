import Stripe from 'stripe';
import { Order } from '@/types';

// Server-side only Stripe instance
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

// Helper to check if Stripe is configured with a valid test secret key
export function isRealStripeConfigured(): boolean {
  return (
    typeof stripeSecretKey === 'string' &&
    stripeSecretKey.startsWith('sk_test_') &&
    !stripeSecretKey.includes('placeholder') &&
    !stripeSecretKey.includes('sample')
  );
}

export function getStripeClient(): Stripe | null {
  if (!isRealStripeConfigured()) {
    return null;
  }
  return new Stripe(stripeSecretKey, {
    apiVersion: '2024-09-30.acacia' as any,
  });
}

export interface StripeCheckoutResult {
  sessionId: string;
  checkoutUrl: string;
  isSimulated: boolean;
  message?: string;
}

/**
 * Creates a Stripe Checkout Session or provides a realistic test simulator
 * adhering to strict separation: STRIPE_SECRET_KEY is only used server-side!
 */
export async function createStripeCheckoutSession(
  order: Order,
  origin: string
): Promise<StripeCheckoutResult> {
  const stripe = getStripeClient();

  const successUrl = `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}&method=stripe`;
  const cancelUrl = `${origin}/checkout/cancel?order_id=${order.id}&method=stripe`;

  // 1. If valid real Stripe test keys are present in .env.local, use official Stripe API
  if (stripe) {
    try {
      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = order.items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: [item.image],
            description: `Объем: ${item.volume}`,
          },
          unit_amount: Math.round(item.price * 100), // in cents
        },
        quantity: item.quantity,
      }));

      // Add shipping as line item if not free
      if (order.shipping > 0) {
        line_items.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Курьерская доставка',
            },
            unit_amount: Math.round(order.shipping * 100),
          },
          quantity: 1,
        });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        customer_email: order.customer.email,
        client_reference_id: order.id,
        metadata: {
          orderId: order.id,
          customerPhone: order.customer.phone,
        },
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      return {
        sessionId: session.id,
        checkoutUrl: session.url || successUrl.replace('{CHECKOUT_SESSION_ID}', session.id),
        isSimulated: false,
      };
    } catch (err: any) {
      console.warn('Real Stripe call failed or credentials invalid, falling back to Stripe Test Simulation:', err.message);
    }
  }

  // 2. Test Mode Simulator (Educational safe fallback)
  // Generates a mock Stripe Checkout session that allows testing card payment flow
  const mockSessionId = `cs_test_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
  // Use relative URL so it never redirects away from Vercel / current host
  const simulatedCheckoutUrl = `/checkout/stripe-simulator?session_id=${mockSessionId}&order_id=${order.id}&amount=${order.total}`;

  return {
    sessionId: mockSessionId,
    checkoutUrl: simulatedCheckoutUrl,
    isSimulated: true,
    message: 'Запущен Stripe Test Mode Simulator (для проверки без ввода боевых ключей)',
  };
}
