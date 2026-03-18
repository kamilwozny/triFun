'use client';

import { useState, useRef, useEffect } from 'react';
import { Pencil, Check, X, Loader2 } from 'lucide-react';
import { updateUserField } from '@/actions/updateUser';

type EditableField = 'name' | 'bio' | 'location';

interface EditableFieldProps {
  field: EditableField;
  label: string;
  value: string;
  placeholder?: string;
  multiline?: boolean;
}

export function EditableField({
  field,
  label,
  value: initialValue,
  placeholder,
  multiline = false,
}: EditableFieldProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  async function handleSave() {
    if (value.trim() === initialValue) {
      setEditing(false);
      return;
    }
    setPending(true);
    setError(null);
    try {
      await updateUserField(field, value);
      setEditing(false);
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setPending(false);
    }
  }

  function handleCancel() {
    setValue(initialValue);
    setEditing(false);
    setError(null);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') handleCancel();
    if (e.key === 'Enter' && !multiline) handleSave();
  }

  return (
    <div className="group relative py-3 border-b border-base-300 last:border-b-0">
      <label className="text-xs font-semibold text-base-content/50 uppercase tracking-wider block mb-1">
        {label}
      </label>

      {editing ? (
        <div className="flex items-start gap-2">
          {multiline ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={3}
              className="textarea textarea-bordered textarea-sm w-full resize-none"
              disabled={pending}
            />
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="input input-bordered input-sm w-full"
              disabled={pending}
            />
          )}
          <div className="flex gap-1 shrink-0 mt-0.5">
            <button
              onClick={handleSave}
              disabled={pending}
              className="btn btn-ghost btn-xs btn-circle text-success"
              aria-label="Save"
            >
              {pending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={pending}
              className="btn btn-ghost btn-xs btn-circle text-error"
              aria-label="Cancel"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setEditing(true)}
        >
          <span className={`flex-1 text-sm ${value ? '' : 'text-base-content/30 italic'}`}>
            {value || placeholder || 'Not set'}
          </span>
          <Pencil className="h-3.5 w-3.5 text-base-content/30 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </div>
      )}

      {error && <p className="text-xs text-error mt-1">{error}</p>}
    </div>
  );
}
