import { getCartItems } from '@/lib/handlers';

interface TotalPriceProps {
  userId: string;
}

export default async function TotalPrice({ userId }: TotalPriceProps) {
  const cartItemsData = await getCartItems(userId);

  if (!cartItemsData || !cartItemsData.cartItems) {
    return <p className="text-2xl font-bold text-end">Total price: 0 $</p>;
  }

  const totalSum = cartItemsData.cartItems.reduce(
    (totalSum: number, cartItem: { price: number }) => totalSum + cartItem.price,
    0
  );

  return <p className="text-2xl font-bold text-end">Total price: {totalSum.toFixed(2)} $</p>;
}