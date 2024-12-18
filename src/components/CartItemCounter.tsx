'use client';

import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/16/solid';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface CartItemCounterProps {
  productId: string;
  userId: string; // Добавлен userId как пропс
}

export default function CartItemCounter({ productId, userId }: CartItemCounterProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState({ price: 0, name: '', img: '', description: '' });
  const [qty, setQty] = useState<number | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const productResponse = await fetch(`/api/products/${productId}`);
        if (productResponse.ok) {
          const productData = await productResponse.json();
          setProduct(productData);
        }

        const cartResponse = await fetch(`/api/users/${userId}/cart/${productId}`);
        if (cartResponse.ok) {
          const { cartItem } = await cartResponse.json();
          setQty(cartItem?.qty || 0);
        } else {
          setQty(0);
        }
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [userId, productId]);

  const addToCart = async (newQty: number) => {
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/users/${userId}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItem: {
            product: productId,
            name: product.name,
            price: product.price,
            img: product.img,
            description: product.description,
            qty: newQty,
          },
        }),
      });

      if (response.ok) {
        setQty(newQty);
        router.refresh();
      } else {
        console.error('Ошибка добавления товара в корзину:', await response.text());
      }
    } catch (error) {
      console.error('Ошибка при добавлении товара:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const updateCart = async (newQty: number) => {
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/users/${userId}/cart/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qty: newQty, price: newQty * product.price }),
      });

      if (response.ok) {
        setQty(newQty);
        router.refresh();
      } else {
        console.error('Error updating cart:', await response.text());
      }
    } catch (error) {
      console.error('Ошибка при обновлении корзины:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const removeFromCart = async () => {
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/users/${userId}/cart/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setQty(0);
        router.refresh();
      } else {
        console.error('Error deleting item from cart:', await response.text());
      }
    } catch (error) {
      console.error('Error while deleting item:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const onMinusBtnClick = () => {
    if (qty && qty > 0) updateCart(qty - 1);
  };

  const onPlusBtnClick = () => {
    if (qty !== null) {
      if (qty === 0) {
        addToCart(1);
      } else {
        updateCart(qty + 1);
      }
    }
  };

  if (isLoading) {
    return <div className="flex items-center space-x-4">Loading...</div>;
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={onMinusBtnClick}
        className="flex items-center justify-center bg-gray-100 w-9 h-9 text-sm font-medium text-gray-900 rounded-l-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
        disabled={isUpdating || qty === null || qty <= 0}
      >
        <MinusIcon className="h-4 w-4" aria-hidden="true" />
      </button>

      <div className="flex items-center justify-center bg-white w-12 h-9 text-sm font-medium text-gray-900 ring-1 ring-inset ring-gray-300">
        {qty !== null ? qty : 0}
      </div>

      <button
        onClick={onPlusBtnClick}
        className="flex items-center justify-center bg-gray-100 w-9 h-9 text-sm font-medium text-gray-900 rounded-r-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
        disabled={isUpdating || qty === null}
      >
        <PlusIcon className="h-4 w-4" aria-hidden="true" />
      </button>

      <button
        onClick={removeFromCart}
        className="flex items-center justify-center bg-red-100 w-9 h-9 text-sm font-medium text-red-700 rounded-full ring-1 ring-inset ring-red-300 hover:bg-red-50 focus:outline-none"
        disabled={isUpdating || qty === 0}
      >
        <TrashIcon className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}