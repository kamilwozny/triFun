'use client';

import { TrainingEvent } from '@/types/training';
import { BulkReviewForm } from '../reviews/BulkReviewForm';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewEvent: TrainingEvent | undefined;
  reviewEventId: string;
  userId?: string;
}

export function ReviewModal({
  isOpen,
  onClose,
  reviewEvent,
  reviewEventId,
  userId,
}: ReviewModalProps) {
  if (!isOpen || !reviewEvent?.attendees) {
    return null;
  }

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-3xl">
        <h3 className="font-bold text-lg mb-6">
          Review Participants - {reviewEvent.name}
        </h3>
        <BulkReviewForm
          eventId={reviewEventId}
          participants={reviewEvent.attendees}
          userId={userId}
        />
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}