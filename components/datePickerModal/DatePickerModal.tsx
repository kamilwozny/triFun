import { RefObject } from 'react';
import { DayPicker } from 'react-day-picker';

interface DatePickerModalProps {
  modalRef: RefObject<HTMLDialogElement>;
  handleVisibilityPicker: () => void;
  selectedDate?: Date;
  handleDateSelect: (value: Date | undefined) => void;
}

export const DatePickerModal = ({
  modalRef,
  handleVisibilityPicker,
  selectedDate,
  handleDateSelect,
}: DatePickerModalProps) => {
  return (
    <dialog
      ref={modalRef}
      className="modal modal-bottom sm:modal-middle"
      onClose={handleVisibilityPicker}
    >
      <div className="modal-box p-0 relative bg-white rounded-lg shadow-xl">
        <div className="p-4 border-b">
          <h3 className="font-bold text-lg">Select Event Date</h3>
        </div>
        <div className="pt-4">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => date < new Date()}
            className="flex justify-center min-h-[380px]"
            classNames={{
              day_selected: 'bg-primary text-primary-content',
              day_today: 'bg-neutral text-neutral-content',
            }}
          />
        </div>
        <div className="modal-action p-4 border-t">
          <button
            type="button"
            className="btn"
            onClick={handleVisibilityPicker}
          >
            Close
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleVisibilityPicker}>close</button>
      </form>
    </dialog>
  );
};
