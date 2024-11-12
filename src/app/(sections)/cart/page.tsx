import { redirect } from 'next/navigation'
import { getCartItems } from '@/lib/handlers'
import Link from 'next/link'
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
    <div className='flex flex-col'>
      <h3 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
        My Shopping Cart
      </h3>
      {cartItemsData.cartItems.length === 0 ? (
        <div className='text-center'>
          <span className='text-sm text-gray-400'>The cart is empty</span>
        </div>
      ) : (
        <>
          {cartItemsData.cartItems.map((cartItem: CartItem) => (
            <div className="w-full h-auto mb-6" key={cartItem.product._id.toString()}>
              <Link href={`/products/${cartItem.product._id.toString()}`}>
                <h2 className="font-bold text-xl">{cartItem.name}</h2>
              </Link>
              <div className="grid grid-cols-12 gap-4 mt-4">
                {/* Первый блок (4 колонки) */}
                <div className="col-span-4">
                  <img src={cartItem.img} alt={cartItem.name} className="w-full h-auto object-cover" />
                  <p>{cartItem.price.toFixed(2)} €</p>
                  <p>Quantity: {cartItem.qty}</p>
                </div>
                {/* Второй блок (8 колонок) */}
                <div className="col-span-8">
                
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}