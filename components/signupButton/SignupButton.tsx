'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { signUpEventAction } from '@/actions/attendeesEvents';
import { useTranslation } from 'react-i18next';

interface SignupButtonProps {
  eventId: string;
}

export function SignupButton({ eventId }: SignupButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { t } = useTranslation();

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
      {isLoading || isPending ? t('signingUp') : t('signUp')}
    </button>
  );
}
