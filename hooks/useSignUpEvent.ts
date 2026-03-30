'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signUpEventAction } from '@/actions/attendeesEvents';

export function useSignUpEvent(eventId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('eventId', eventId);

      startTransition(async () => {
        const result = await signUpEventAction(formData);

        if (result.success) {
          toast.success(
            ('message' in result && result.message) ||
              'Successfully signed up for the event!',
          );
          router.refresh();
        } else {
          toast.error(
            ('error' in result && result.error) || 'Failed to sign up',
          );
        }

        setIsLoading(false);
      });
    } catch {
      toast.error('Failed to sign up for the event');
      setIsLoading(false);
    }
  };

  return { handleSignUp, isLoading: isLoading || isPending };
}
