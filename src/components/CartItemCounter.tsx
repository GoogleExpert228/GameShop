'use client';

import { MinusIcon, PlusIcon } from '@heroicons/react/16/solid';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CartItemCounterProps {
  userId: string;
  productId: string;
  initialQty: number;
  initialPrice: number; // Начальная цена товара
}

export default function CartItemCounter({
  userId,
  productId,
  initialQty,
  initialPrice,
}: CartItemCounterProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [qty, setQty] = useState(initialQty);
  const [price, setPrice] = useState(initialPrice);
  const [totalPrice, setTotalPrice] = useState(initialQty * initialPrice);

  const updateCart = async (newQty: number, newPrice: number) => {
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/users/${userId}/cart/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qty: newQty, price: (newPrice * newQty) }),
      });

      if (response.ok) {
        setQty(newQty);
        setPrice(newPrice);
        setTotalPrice(newQty * newPrice);
        router.refresh();
      } else {
        console.error('Ошибка обновления корзины:', await response.text());
      }
    } catch (error) {
      console.error('Ошибка при обновлении корзины:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const onMinusBtnClick = () => {
    if (qty > 1) updateCart(qty - 1, price);
  };

  const onPlusBtnClick = () => {
    updateCart(qty + 1, price);
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={onMinusBtnClick}
        className="flex items-center justify-center bg-gray-100 px-3 py-2 text-sm font-medium text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400 h-9"
        disabled={isUpdating || qty <= 1}
      >
        <MinusIcon className="h-4 w-4" aria-hidden="true" />
      </button>

      <div className="flex items-center justify-center bg-white px-4 py-2 text-sm font-medium text-gray-900 ring-1 ring-inset ring-gray-300 w-20 h-9">
        {qty}
      </div>

      <button
        onClick={onPlusBtnClick}
        className="flex items-center justify-center bg-gray-100 px-3 py-2 text-sm font-medium text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400 h-9"
        disabled={isUpdating}
      >
        <PlusIcon className="h-4 w-4" aria-hidden="true" />
      </button>

      <div className="text-sm font-medium text-gray-900">
        ${totalPrice.toFixed(2)}
      </div>
    </div>
  );
}