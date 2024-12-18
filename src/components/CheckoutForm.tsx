'use client';

import React, { useState } from 'react';
import CreateOrderButton from '@/components/CreateOrderButton';

export default function CheckoutForm({ userId }: { userId: string }) {
  const [formData, setFormData] = useState({
    address: '',
    cardHolder: '',
    cardNumber: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Shipping Address
        </label>
        <input
          type="text"
          name="address"
          id="address"
          value={formData.address}
          onChange={handleInputChange}
          className="mt-1 block pl-2 h-9 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
          placeholder="Enter your shipping address"
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <div className="w-full sm:w-1/2">
          <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700">
            Card Holder Name
          </label>
          <input
            type="text"
            name="cardHolder"
            id="cardHolder"
            value={formData.cardHolder}
            onChange={handleInputChange}
            className="mt-1 block pl-2 h-9 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
            placeholder="Name on the card"
            required
          />
        </div>

        <div className="w-full sm:w-1/2">
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
            Card Number
          </label>
          <input
            type="text"
            name="cardNumber"
            id="cardNumber"
            value={formData.cardNumber}
            onChange={handleInputChange}
            className="mt-1 block pl-2 h-9 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
            placeholder="Card number"
            required
          />
        </div>
      </div>

      {/* Кнопка создания заказа */}
      <CreateOrderButton
        userId={userId}
        address={formData.address}
        cardHolder={formData.cardHolder}
        cardNumber={formData.cardNumber}
        onSuccess={() => alert('Order created successfully!')}
      />
    </div>
  );
}