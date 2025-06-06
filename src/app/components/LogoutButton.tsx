'use client';

import { useState } from 'react';
import { logoutAction } from '../login/actions';

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSignOut = async () => {
    setIsLoading(true);
    await logoutAction();
  }
  
  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className="bg-red-600 hover:bg-red-700 text-white cursor-pointer font-semibold py-2 px-4 rounded transition-colors duration-200 disabled:opacity-70">
      {isLoading ? 'Signing out...' : 'Sign Out'}
    </button>
  );
}