'use client';

import { useTranslation } from 'react-i18next';
import { useSignUpEvent } from '@/hooks/useSignUpEvent';

interface SignupButtonProps {
  eventId: string;
}

export function SignupButton({ eventId }: SignupButtonProps) {
  const { handleSignUp, isLoading } = useSignUpEvent(eventId);
  const { t } = useTranslation();

  return (
    <button
      onClick={handleSignUp}
      className="btn btn-primary"
      disabled={isLoading}
    >
      {isLoading ? t('signingUp') : t('signUp')}
    </button>
  );
}
