'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import { TRAININGS_RETURN_URL_KEY } from '@/helpers/constants';

interface BackToListButtonProps {
  label: string;
}

export function BackToListButton({ label }: BackToListButtonProps) {
  const router = useRouter();

  const handleBack = useCallback(() => {
    const saved = sessionStorage.getItem(TRAININGS_RETURN_URL_KEY);
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
