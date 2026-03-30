'use client';

import { toast } from 'sonner';
import { FaUserPlus, FaUserFriends } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useSignUpEvent } from '@/hooks/useSignUpEvent';

interface EventActionButtonProps {
  eventId: string;
  isAttending: boolean;
}

export function EventActionButton({
  eventId,
  isAttending,
}: EventActionButtonProps) {
  const { handleSignUp, isLoading } = useSignUpEvent(eventId);
  const { t } = useTranslation();

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
      disabled={isLoading}
    >
      <FaUserPlus className="h-5 w-5" />
      {isLoading ? t('signingUp') : t('signUp')}
    </button>
  );
}
