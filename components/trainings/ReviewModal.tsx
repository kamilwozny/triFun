'use client';

import { useEffect, useRef, useState } from 'react';
import { TrainingEvent } from '@/types/training';
import { BulkReviewForm } from '../reviews/BulkReviewForm';
import { useTranslation } from 'react-i18next';

interface ReviewModalProps {
  reviewEvent: TrainingEvent | undefined;
  reviewEventId: string;
  userId?: string;
  modalTrigger: number;
}

export function ReviewModal({
  reviewEvent,
  reviewEventId,
  userId,
  modalTrigger,
}: ReviewModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [lastTrigger, setLastTrigger] = useState<number>(0);
  const { t } = useTranslation();

  useEffect(() => {
    if (
      reviewEvent?.attendees &&
      reviewEventId &&
      modalTrigger > lastTrigger &&
      modalRef.current
    ) {
      modalRef.current.showModal();
      setLastTrigger(modalTrigger);
    }
  }, [reviewEvent, reviewEventId, modalTrigger, lastTrigger]);

  const handleClose = () => {
    modalRef.current?.close();
  };

  if (!reviewEvent?.attendees || !reviewEventId) {
    return null;
  }

  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box max-w-3xl">
        <h3 className="font-bold text-lg mb-6">
          {t('reviewParticipants')} - {reviewEvent.name}
        </h3>
        <BulkReviewForm
          eventId={reviewEventId}
          participants={reviewEvent.attendees}
          userId={userId}
        />
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>{t('close')}</button>
      </form>
    </dialog>
  );
}
