import './globals.css';
import { CartProvider } from '../context/CartContext';
import Navbar from '../components/Navbar';
import CartSidebar from '../components/CartSidebar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Roose More Floral & Events | Premium Decor in Lahore',
  description: 'Premium original and artificial flower decoration, birthday events, room decor, car decor, baby shower and more. Located at Chungi Amar Sidhu, Lahore.',
  icons: {
    icon: '/images/logo.png',
    shortcut: '/images/logo.png',
    apple: '/images/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          <CartSidebar />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
