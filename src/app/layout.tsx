import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

export const metadata: Metadata = {
  title: 'Glow Beauty | Современный интернет-магазин косметики',
  description: 'Премиальная косметика, чистые формулы, деликатный уход за кожей и макияж. Быстрая доставка и удобная оплата Stripe и Payme.',
  keywords: ['косметика', 'интернет-магазин', 'уход за кожей', 'макияж', 'Glow Beauty', 'Stripe', 'Payme'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen flex flex-col antialiased">
        <CartProvider>
          <Header />
          <CartDrawer />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
