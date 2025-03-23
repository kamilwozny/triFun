'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'react-hot-toast';
import { signUpEventAction } from '@/actions/attendeesEvents';

interface SignupButtonProps {
  eventId: string;
}

export function SignupButton({ eventId }: SignupButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      setIsLoading(true);

      // Create FormData with the eventId
      const formData = new FormData();
      formData.append('eventId', eventId);

      // Start the server action as a transition
      startTransition(async () => {
        const result = await signUpEventAction(formData);

        if (result.success) {
          // For successful responses, the message property exists
          toast.success(
            'message' in result
              ? result.message
              : 'Successfully signed up for the event!'
          );
          router.refresh();
        } else {
          // For error responses, the error property exists
          toast.error('error' in result ? result.error : 'Failed to sign up');
        }

        setIsLoading(false);
      });
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error('Failed to sign up for the event');
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignUp}
      className="btn btn-primary"
      disabled={isLoading || isPending}
    >
      {isLoading || isPending ? 'Signing up...' : 'Sign up'}
    </button>
  );
}
