'use client';

import { useEffect, useRef } from 'react';
import { TrainingEvent } from '@/types/training';
import { BulkReviewForm } from '../reviews/BulkReviewForm';
import { useTranslation } from 'react-i18next';

interface ReviewModalProps {
  reviewEvent: TrainingEvent | undefined;
  reviewEventId: string;
  userId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewModal({
  reviewEvent,
  reviewEventId,
  userId,
  isOpen,
  onClose,
}: ReviewModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen && reviewEvent?.attendees && modalRef.current) {
      modalRef.current.showModal();
    }
  }, [isOpen, reviewEvent]);

  const handleClose = () => {
    modalRef.current?.close();
    onClose();
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
