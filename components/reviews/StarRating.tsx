'use client';

import { useEffect, useState } from 'react';

interface StarRatingProps {
  rating?: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRating({
  rating: initialRating = 0,
  onChange,
  readonly = false,
  size = 'md',
}: StarRatingProps) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const sizeClasses = {
    sm: 'mask-size-8',
    md: 'mask-size-12',
    lg: 'mask-size-16',
  };

  const handleRatingChange = (value: number) => {
    if (readonly) return;
    setRating(value);
    onChange?.(value);
  };

  return (
    <div className="flex gap-1 items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          className={`${
            readonly ? '' : 'cursor-pointer'
          } transition-all duration-100`}
          onClick={() => handleRatingChange(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
        >
          <div
            className={`
              h-8 w-8
              mask mask-star-2 
              ${sizeClasses[size]}
              ${(hover || rating) >= star ? 'bg-warning' : 'bg-warning/20'}
            `}
          />
        </button>
      ))}
    </div>
  );
}
