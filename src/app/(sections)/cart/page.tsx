import { redirect } from 'next/navigation'
import { getCartItems } from '@/lib/handlers'
import { getSession } from '@/lib/auth'
import { CartItem } from '@/models/User'

export default async function Cart() {
  const session = await getSession();
  
  if (!session) {
    redirect('/auth/signin')
  }

  const cartItemsData = await getCartItems(session.userId)
  if (!cartItemsData) {
    redirect('/auth/signin')
  }

  return (
    <div className="flex flex-col p-4 lg:p-8 bg-gray-50 min-h-screen">
      <h3 className="pb-4 text-3xl font-bold text-gray-800 sm:pb-6 lg:pb-8 text-center">
        My Shopping Cart
      </h3>
      {cartItemsData.cartItems.length === 0 ? (
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
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6">
          {cartItemsData.cartItems.map((cartItem: CartItem) => (
            <div
              className="flex items-center justify-between mb-6 last:mb-0 rounded-lg shadow-sm bg-gray-100 p-4"
              key={cartItem.product._id.toString()}
            >
              {/* Изображение товара */}
              <div className="flex-shrink-0">
                <img
                  src={cartItem.img}
                  alt={cartItem.name}
                  className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                />
              </div>
  
              {/* Название товара */}
              <div className="flex-1 px-4">
                <h4 className="text-lg font-semibold text-gray-800 line-clamp-1">
                  {cartItem.name}
                </h4>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {cartItem.description}
                </p>
              </div>
  
              {/* Цена и количество */}
              <div className="flex flex-col items-end">
                <div className="text-xl font-semibold text-gray-800">
                  ${cartItem.price}
                </div>
                <div className="mt-2 flex items-center">
                  {/* Кнопка уменьшения */}
                  <button className="px-3 py-1 bg-gray-300 text-white rounded-l hover:bg-gray-400">
                    −
                  </button>
                  {/* Поле для количества */}
                  <input
                    type="text"
                    value={cartItem.qty}
                    readOnly
                    className="w-20 h-9 text-center border-t border-b border-gray-300 text-gray-700"
                  />
                  {/* Кнопка увеличения */}
                  <button className="px-3 py-1 bg-gray-300 text-white rounded-r hover:bg-gray-400">
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
          {/* Кнопка для оформления заказа */}
          <div className="flex justify-center mt-6">
            <button className="px-6 py-3 bg-gray-600 text-white text-lg font-medium rounded-lg hover:bg-gray-700 transition-all shadow-md">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
//sdfsdf
//sdfsdfsdf