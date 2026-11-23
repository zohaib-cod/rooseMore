import './globals.css';
import { CartProvider } from '../context/CartContext';
import Navbar from '../components/Navbar';
import CartSidebar from '../components/CartSidebar';

export const metadata = {
  title: 'Roose More Floral & Events | Premium Decor in Lahore',
  description: 'Premium original and artificial flower decoration, birthday events, room decor, car decor, baby shower and more. Located at Chungi Amar Sidhu, Lahore.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          <CartSidebar />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
