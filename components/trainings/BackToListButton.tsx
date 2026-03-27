'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

const RETURN_URL_STORAGE_KEY = 'trainings-return-url';

interface BackToListButtonProps {
  label: string;
}

export function BackToListButton({ label }: BackToListButtonProps) {
  const router = useRouter();

  const handleBack = useCallback(() => {
    const saved = sessionStorage.getItem(RETURN_URL_STORAGE_KEY);
    router.push(saved || '/trainings');
  }, [router]);

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900"
    >
      <FaArrowLeft className="h-3 w-3" />
      {label}
    </button>
  );
}
