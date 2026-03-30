'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signUpEventAction } from '@/actions/attendeesEvents';

export function useSignUpEvent(eventId: string) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSignUp = () => {
    const formData = new FormData();
    formData.append('eventId', eventId);

    startTransition(async () => {
      try {
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
      } catch {
        toast.error('Failed to sign up for the event');
      }
    });
  };

  return { handleSignUp, isLoading: isPending };
}
