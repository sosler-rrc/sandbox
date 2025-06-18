'use client';

import { logoutAction } from '@/app/login/actions';
import { useState } from 'react';
import { Button } from './Button';

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSignOut = async () => {
    setIsLoading(true);
    await logoutAction();
  }
  
  return (
    <Button
      onClick={handleSignOut}
      disabled={isLoading}
      variant='red'>
      {isLoading ? 'Signing out...' : 'Sign Out'}
    </Button>
  );
}