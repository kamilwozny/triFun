import * as React from 'react';
import { FaLock, FaGlobe } from 'react-icons/fa';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export function Switch({ checked, onChange, label }: SwitchProps) {
  const id = React.useId();

  return (
    <div className="flex items-center gap-3">
      <button
        role="switch"
        aria-checked={checked}
        id={id}
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex h-8 w-14 items-center rounded-full
          transition-colors duration-300 ease-in-out focus-visible:outline-none 
          focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
          ${checked ? 'bg-card-foreground' : 'bg-foreground'}
        `}
      >
        <span
          className={`
            ${checked ? 'translate-x-7' : 'translate-x-1'}
            inline-block h-6 w-6 transform rounded-full bg-white 
            transition duration-300 ease-in-out flex items-center justify-center
          `}
        >
          {checked ? (
            <FaLock className="h-3 w-3 text-neutral-500" />
          ) : (
            <FaGlobe className="h-3 w-3 text-primary" />
          )}
        </span>
      </button>
      {label && (
        <label htmlFor={id} className="text-sm font-medium cursor-pointer">
          {label}
        </label>
      )}
    </div>
  );
}
