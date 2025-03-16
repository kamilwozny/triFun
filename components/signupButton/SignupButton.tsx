'use client';

import { signUpForEvent } from '@/actions/attendeesEvents';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export function SignupButton({ eventId }: { eventId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      setIsLoading(true);
      const result = await signUpForEvent(eventId);

      if (result.success) {
        toast.success('Successfully signed up for the event!');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to sign up');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error('Failed to sign up for the event');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignUp}
      className="btn btn-primary"
      disabled={isLoading}
    >
      {isLoading ? 'Signing up...' : 'Sign up'}
    </button>
  );
}
