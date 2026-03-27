'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { approveAttendee } from '@/actions/attendeesEvents';
import { useTranslation } from 'react-i18next';

interface ApproveAttendeeButtonsProps {
  eventId: string;
  attendeeId: string;
}

export function ApproveAttendeeButtons({
  eventId,
  attendeeId,
}: ApproveAttendeeButtonsProps) {
  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation();

  const handle = (action: 'confirm' | 'decline') => {
    startTransition(async () => {
      const result = await approveAttendee(eventId, attendeeId, action);
      if (result.success) {
        toast.success(
          action === 'confirm' ? t('attendeeApproved') : t('attendeeDeclined'),
        );
      } else {
        toast.error(result.error ?? t('somethingWentWrong'));
      }
    });
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handle('confirm')}
        disabled={isPending}
        className="btn btn-xs btn-success"
      >
        {t('approve')}
      </button>
      <button
        onClick={() => handle('decline')}
        disabled={isPending}
        className="btn btn-xs btn-error btn-outline"
      >
        {t('decline')}
      </button>
    </div>
  );
}
