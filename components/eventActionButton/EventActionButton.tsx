'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'react-hot-toast';
import { FaUserPlus, FaUserFriends } from 'react-icons/fa';
import { signUpEventAction } from '@/actions/attendeesEvents';
import { useTranslation } from 'react-i18next';

interface EventActionButtonProps {
  eventId: string;
  isAttending: boolean;
}

export function EventActionButton({
  eventId,
  isAttending,
}: EventActionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { t } = useTranslation();

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
          toast.success(
            'message' in result && result.message
              ? result.message
              : 'Successfully signed up for the event!'
          );
          router.refresh();
        } else {
          toast.error(
            'error' in result && result.error
              ? result.error
              : 'Failed to sign up'
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

  if (isAttending) {
    return (
      <button
        className="btn btn-outline gap-2"
        onClick={() => toast.success('Invite feature coming soon!')}
      >
        <FaUserFriends className="h-5 w-5" />
        {t('inviteFriends')}
      </button>
    );
  }

  return (
    <button
      onClick={handleSignUp}
      className="btn btn-primary gap-2"
      disabled={isLoading || isPending}
    >
      <FaUserPlus className="h-5 w-5" />
      {isLoading || isPending ? t('signingUp') : t('signUp')}
    </button>
  );
}
