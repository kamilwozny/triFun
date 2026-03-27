'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BulkReviewForm } from '../reviews/BulkReviewForm';

interface TrainingReviewSectionProps {
  eventId: string;
  userId: string;
  attendees: {
    id: string | null;
    name: string | null;
    isHost: boolean;
    status: string;
  }[];
}

export function TrainingReviewSection({
  eventId,
  userId,
  attendees,
}: TrainingReviewSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.showModal();
    }
  }, [isOpen]);

  const handleClose = () => {
    modalRef.current?.close();
    setIsOpen(false);
  };

  const participants = attendees.map((a) => ({
    attendeeId: a.id ?? '',
    name: a.name,
    status: a.status,
    isHost: a.isHost,
  }));

  return (
    <>
      <button className="btn btn-primary btn-sm" onClick={() => setIsOpen(true)}>
        {t('reviewParticipants')}
      </button>

      {isOpen && (
        <dialog ref={modalRef} className="modal">
          <div className="modal-box max-w-3xl">
            <h3 className="font-bold text-lg mb-6">{t('reviewParticipants')}</h3>
            <BulkReviewForm
              eventId={eventId}
              participants={participants}
              userId={userId}
            />
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={handleClose}>{t('close')}</button>
          </form>
        </dialog>
      )}
    </>
  );
}
