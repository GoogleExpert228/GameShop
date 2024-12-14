'use client'

import { MinusIcon, PlusIcon } from '@heroicons/react/16/solid';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CartItemCounterProps {
  userId: string;
  productId: string;
  value: number;
}

export default function CartItemCounter({
  userId,
  productId,
  value,
}: CartItemCounterProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const onMinusBtnClick = async () => {
    setIsUpdating(true);
    try {
      await fetch(`/api/users/${userId}/cart/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({
          qty: value - 1
        }),
      });
      router.refresh();
    } finally {
      setIsUpdating(false);
    }
  };

  const onPlusBtnClick = async () => {
    setIsUpdating(true);
    try {
      await fetch(`/api/users/${userId}/cart/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({
          qty: value + 1
        }),
      });
      router.refresh();
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-stretch">
      {/* Кнопка уменьшения */}
      <button
        onClick={onMinusBtnClick}
        className="flex items-center justify-center bg-gray-100 px-3 py-2 text-sm font-medium text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:bg-gray-100 disabled:text-gray-400 h-9"
        disabled={isUpdating}
      >
        <span className="sr-only">Remove one</span>
        <MinusIcon className="h-4 w-4" aria-hidden="true" />
      </button>

      {/* Значение */}
      <div className="flex items-center justify-center bg-white px-4 py-2 text-sm font-medium text-gray-900 ring-1 ring-inset ring-gray-300 w-20 h-9">
        {value}
      </div>

      {/* Кнопка увеличения */}
      <button
        onClick={onPlusBtnClick}
        className="flex items-center justify-center bg-gray-100 px-3 py-2 text-sm font-medium text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:bg-gray-100 disabled:text-gray-400 h-9"
        disabled={isUpdating}
      >
        <span className="sr-only">Add one</span>
        <PlusIcon className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}