import { getSession } from '@/lib/auth';
import { getUser } from '@/lib/handlers';
import CheckoutForm from '@/components/CheckoutForm';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { CartItem } from '@/models/User';
import TotalPrice from '@/components/TotalPriceComponent';

export default async function Checkout() {
  const session = await getSession();

  if (!session || !session.userId) {
    redirect('/sign-in');
  }

  const userId = session.userId;

  try {
    const user = await getUser(userId);

    if (!user || !user.cart || user.cart.length === 0) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-8 bg-white shadow-md rounded-md">
          <h1 className="text-4xl font-bold mb-6">Checkout</h1>
          <p className="text-gray-600 italic">Your cart is empty.</p>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto min-h-[500px] px-4 py-8 bg-gray-100 shadow-md rounded-md">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Checkout</h1>

        {/* Cart Items Table */}
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-3 text-left font-semibold text-gray-700">Product</th>
                <th className="border px-4 py-3 text-left font-semibold text-gray-700">Quantity</th>
                <th className="border px-4 py-3 text-left font-semibold text-gray-700">Price</th>
                <th className="border px-4 py-3 text-left font-semibold text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {user.cart.map((item: CartItem) => (
                <tr
                  key={item.product.toString()}
                  className="border-b hover:bg-gray-50 transition-colors duration-300"
                >
                  <td className="border px-4 py-3">
                    <Link
                      href={`/products/${item.product.toString()}`}
                      className="text-gray-600 hover:underline"
                    >
                      {item.name}
                    </Link>
                  </td>
                  <td className="border px-4 py-3">{item.qty}</td>
                  <td className="border px-4 py-3">{(item.price / item.qty).toFixed(2)}$</td>
                  <td className="border px-4 py-3">{item.price.toFixed(2)}$</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <TotalPrice userId={userId} />

        {/* Checkout Form */}
        <CheckoutForm userId={userId} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching user:', error);
    redirect('/not-found');
  }
}