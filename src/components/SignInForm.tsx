"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormValues {
  email: string;
  password: string;
}

export default function SignInForm() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [formValues, setFormValues] = useState<FormValues>({
    email: '',
    password: '',
  });

  // Обработчик отправки формы
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!event.currentTarget.checkValidity()) {
      return false; // Остановка, если форма невалидна
    }

    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // Добавлены заголовки
        body: JSON.stringify(formValues), // Отправляем данные формы
      });

      if (res.ok) {
        setError('');
        router.push('/'); // Перенаправление на главную страницу
        router.refresh(); // Обновление страницы
      } else {
        const data = await res.json();
        if (data.error === 'WRONG_CREDENTIALS') {
          setError('Wrong e-mail or password.');
        } else {
          setError('An error occurred while processing your request. Please try again later.');
        }
      }
    } catch (err) {
      console.error('Error during form submission:', err);
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  // JSX-разметка формы
  return (
    <form className="group space-y-6" onSubmit={handleSubmit} noValidate>
      {/* Поле для ввода email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
          E-mail address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="johndoe@example.com"
          required
          className="peer mt-2 block w-full rounded-md border-0 px-1.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
          placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6
          invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-500"
          value={formValues.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormValues((prevFormValues) => ({
              ...prevFormValues,
              email: e.target.value,
            }))
          }
        />
        <p className="mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
          Please provide a valid email address.
        </p>
      </div>

      {/* Поле для ввода пароля */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          required
          className="peer mt-2 block w-full rounded-md border-0 px-1.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
          placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6
          invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-500"
          value={formValues.password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFormValues((prevFormValues) => ({
              ...prevFormValues,
              password: e.target.value,
            }))
          }
        />
        <p className="mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
          Please provide a valid password.
        </p>
      </div>

      {/* Ошибки */}
      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* Кнопка отправки */}
      <div>
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600" >
          Sign In
        </button>
      </div>
    </form>
  );
}