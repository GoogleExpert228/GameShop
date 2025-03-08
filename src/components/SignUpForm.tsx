"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormValues {
  email: string;
  password: string;
  name: string;
  surname: string;
  address: string;
  birthdate: string;
}

export default function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [formValues, setFormValues] = useState<FormValues>({
    email: '',
    password: '',
    name: '',
    surname: '',
    address: '',
    birthdate: '',
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    if (!event.currentTarget.checkValidity()) {
      return false;
    }
  
    // Преобразование строки из input в объект Date
    const formattedFormValues = {
      ...formValues,
      birthdate: new Date(formValues.birthdate), // Преобразуем строку в объект Date
    };
  
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedFormValues),
      });
  
      if (res.ok) {
        setError('');
        router.push('/signin');
      } else {
        const data = await res.json();
        setError(data.error || 'An unexpected error occurred.');
      }
    } catch (err) {
      console.error('Error during form submission:', err);
      setError('An unexpected error occurred. Please try again later.');
    }
  };
  
  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-900">
          E-mail address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-2 block w-full rounded-md border px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
          value={formValues.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormValues((prev) => ({ ...prev, email: e.target.value }))
          }
        />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-900">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-2 block w-full rounded-md border px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
          value={formValues.password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormValues((prev) => ({ ...prev, password: e.target.value }))
          }
        />
      </div>

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-900">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-2 block w-full rounded-md border px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
          value={formValues.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormValues((prev) => ({ ...prev, name: e.target.value }))
          }
        />
      </div>

      {/* Surname */}
      <div>
        <label htmlFor="surname" className="block text-sm font-medium text-gray-900">
          Surname
        </label>
        <input
          id="surname"
          name="surname"
          type="text"
          required
          className="mt-2 block w-full rounded-md border px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
          value={formValues.surname}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormValues((prev) => ({ ...prev, surname: e.target.value }))
          }
        />
      </div>

      {/* Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-900">
          Address
        </label>
        <input
          id="address"
          name="address"
          type="text"
          required
          className="mt-2 block w-full rounded-md border px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
          value={formValues.address}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormValues((prev) => ({ ...prev, address: e.target.value }))
          }
        />
      </div>

      {/* Birthdate */}
      <div>
        <label htmlFor="birthdate" className="block text-sm font-medium text-gray-900">
          Birthdate
        </label>
        <input
          id="birthdate"
          name="birthdate"
          type="date"
          required
          className="mt-2 block w-full rounded-md border px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
          value={formValues.birthdate}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormValues((prev) => ({ ...prev, birthdate: e.target.value }))
          }
        />
      </div>

      {/* Error */}
      {error && <div className="text-sm text-red-500">{error}</div>}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
      >
        Sign Up
      </button>
    </form>
  );
}