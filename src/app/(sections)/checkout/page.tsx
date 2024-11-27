import { getSession } from '@/lib/auth'; // Fetch session info
import { notFound, redirect } from 'next/navigation'; // Redirect helpers
import { getUser } from '@/lib/handlers'; // Fetch user data
import Link from 'next/link'; // For navigation
import { CartItem } from '@/models/User';

export default async function Checkout() {
    const session = await getSession();

    // Redirect to sign-in if user is not logged in
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

        // Calculate total price
        const totalPrice = user.cart.reduce(
            (sum: number, item: CartItem) => sum + item.price * item.qty,
            0
        );

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
                        <td className="border px-4 py-3">${item.price.toFixed(2)}</td>
                        <td className="border px-4 py-3">
                          ${(item.price * item.qty).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          
              {/* Total Price */}
              <div className="mb-6 text-right">
                <p className="text-xl font-semibold text-gray-800">
                  Total Price: <span className="text-gray-600">${totalPrice.toFixed(2)}</span>
                </p>
              </div>
          
              {/* Checkout Form */}
              <form className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Shipping Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    className="mt-1 block pl-2 h-9 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                    placeholder="Enter your shipping address"
                  />
                </div>
          
                {/* Card Information */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                  <div className="w-full sm:w-1/2">
                    <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700">
                      Card Holder Name
                    </label>
                    <input
                      type="text"
                      id="cardHolder"
                      className="mt-1 block pl-2 h-9 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                      placeholder="Name on the card"
                    />
                  </div>
          
                  <div className="w-full sm:w-1/2">
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      className="mt-1 block pl-2 h-9 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                      placeholder="Card number"
                    />
                  </div>
                </div>
          
                {/* Submit Button */}
                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full bg-gray-600 text-white py-2 px-4 rounded-md text-lg hover:bg-gray-700 transition"
                  >
                    Place Order
                  </button>
                </div>
              </form>
            </div>
          );
    } catch (error) {
        console.error('Error fetching user:', error);
        notFound();
    }
}