'use client';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FaBug } from 'react-icons/fa';
export const Footer = () => {
  const modalReportRef = useRef<HTMLDialogElement>(null);
  const modalContactRef = useRef<HTMLDialogElement>(null);
  const { t } = useTranslation();

  const handleOpenContactModal = () => {
    modalContactRef.current?.showModal();
  };

  const handleOpenReportModal = () => {
    modalReportRef.current?.showModal();
  };

  return (
    <footer className="footer footer-center p-4 bg-neutral text-base-content flex gap-4 justify-end w-full">
      <div className="flex items-center gap-2 hover:bg-neutral-light hover:cursor-pointer">
        <FaBug className="text-error" />
        <span className="text-error" onClick={handleOpenReportModal}>
          {t('reportBug')}
        </span>
      </div>
      <div className="text-error hover:cursor-pointer hover:bg-neutral-light">
        <span onClick={handleOpenContactModal}>{t('contactUs')}</span>
      </div>
      <dialog ref={modalContactRef} className="modal">
        <div className="modal-box flex flex-col gap-4">
          <h3 className="font-bold text-lg">Enter your email</h3>
          <input type="email" placeholder="Email" />
          <textarea
            placeholder="Message"
            className="textarea textarea-bordered"
          />
          <button className="btn btn-primary">Send</button>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>{t('close')}</button>
        </form>
      </dialog>
      <dialog ref={modalReportRef} className="modal">
        <div className="modal-box flex flex-col gap-4">
          <h3 className="font-bold text-lg">{t('reportBug')}</h3>
          <textarea
            placeholder="Message"
            className="textarea textarea-bordered"
          />
          <button className="btn btn-primary">Send</button>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>{t('close')}</button>
        </form>
      </dialog>
    </footer>
  );
};
