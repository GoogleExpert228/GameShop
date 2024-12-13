"use client";

import { ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';

export const navbarButtonClasses = 'rounded-full p-2 text-gray-400 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-white';

interface NavbarSignOutButtonProps {
  children: ReactNode;
}

export default function NavbarSignOutButton({ children }: NavbarSignOutButtonProps) {
  const [error, setError] = useState<string>(''); // Для ошибок
  const router = useRouter(); // Для редиректа

  // Обработчик для выхода
  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        // Перенаправление на страницу входа после успешного выхода
        router.push('/');
      } else {
        const data = await response.json();
        setError(data.error || 'An error occurred while logging out.');
      }
    } catch (err) {
      console.error('Error during sign out:', err);
      setError('An error occurred while logging out.');
    }
  };

  return (
    <div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        onClick={handleSignOut}
        className={navbarButtonClasses}
      >
        {children}
      </button>
    </div>
  );
}