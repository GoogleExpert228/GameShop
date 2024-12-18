import { redirect } from 'next/navigation';
import { getCartItems } from '@/lib/handlers';
import { getSession } from '@/lib/auth';
import { CartItem } from '@/models/User';
import CartItemComponent from '@/components/CartItemComponent';
import Link from 'next/link';
import TotalPriceComponent from '@/components/TotalPriceComponent';

export default async function Cart() {
    const session = await getSession();

    if (!session || !session.userId) {
        console.error("No session or userId found");
        redirect('/auth/signin');
    }

    const cartItemsData = await getCartItems(session.userId);

    if (!cartItemsData || cartItemsData.cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center">
                <img
                    src="/empty-cart.svg"
                    alt="Empty Cart"
                    className="w-32 h-32 mb-4"
                />
                <span className="text-lg font-medium text-gray-500">
                    Your cart is empty
                </span>
            </div>
        );
    }

    return (
        <div className="flex flex-col p-4 lg:p-8 bg-gray-50 min-h-screen">
            <h3 className="pb-4 text-3xl font-bold text-gray-800 sm:pb-6 lg:pb-8 text-center">
                My Shopping Cart
            </h3>
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6">
                {cartItemsData.cartItems.map((cartItem: CartItem) => (
                    <CartItemComponent
                        key={cartItem.product._id.toString()}
                        cartItem={cartItem}
                        userId={session.userId.toString()}
                    />
                ))}

                <TotalPriceComponent userId={session.userId.toString()}/>

                {/* Кнопка для оформления заказа */}
                <div className="flex justify-center mt-6">
                    <Link href="/checkout">
                        <button className="px-6 py-3 bg-gray-600 text-white text-lg font-medium rounded-lg hover:bg-gray-700 transition-all shadow-md">
                            Proceed to Checkout
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}