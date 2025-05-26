'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const handleSignOut = async () => {
    try {
      setIsLoading(true);

      // Call your logout API route
      await fetch('/api/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
    router.push('/login');
    router.refresh();
  };
  
  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className="bg-red-600 hover:bg-red-700 text-white cursor-pointer font-semibold py-2 px-4 rounded transition-colors duration-200 disabled:opacity-70">
      {isLoading ? 'Signing out...' : 'Sign Out'}
    </button>
  );
}