import { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface LocationSuggestion {
  text: string;
  type: 'city' | 'country';
}

// Hook for detecting clicks outside of a component
function useClickOutside(callback: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback]);

  return ref;
}

interface LocationSearchProps {
  searchInput: string;
  setSearchInput: (input: string) => void;
  locationSuggestions: LocationSuggestion[];
}

export function LocationSearch({
  searchInput,
  setSearchInput,
  locationSuggestions,
}: LocationSearchProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { t } = useTranslation();

  // Close suggestions when clicking outside
  const searchRef = useClickOutside(() => setShowSuggestions(false));

  // Filter suggestions based on input
  const filteredSuggestions = useMemo(() => {
    if (!searchInput) return [];
    return locationSuggestions.filter((suggestion) =>
      suggestion.text.toLowerCase().includes(searchInput.toLowerCase()),
    );
  }, [locationSuggestions, searchInput]);

  // Handle keyboard navigation in suggestions
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0,
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1,
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          setSearchInput(filteredSuggestions[selectedIndex].text);
          setShowSuggestions(false);
          setSelectedIndex(-1);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [filteredSuggestions]);

  return (
    <div className="relative" ref={searchRef}>
      <label className="input flex items-center gap-2">
        <svg
          className="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          type="search"
          placeholder={t('searchByLocation')}
          className="w-full"
          aria-label="Search locations"
          aria-controls="location-suggestions"
          aria-activedescendant={
            selectedIndex >= 0
              ? `suggestion-${filteredSuggestions[selectedIndex].text}`
              : undefined
          }
        />
      </label>
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div
          id="location-suggestions"
          role="listbox"
          className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.type}-${suggestion.text}-${index}`}
              id={`suggestion-${suggestion.text}`}
              role="option"
              aria-selected={index === selectedIndex}
              className={`w-full px-4 py-2 text-left hover:bg-neutral/5 flex items-center gap-2 ${
                index === selectedIndex ? 'bg-neutral/10' : ''
              }`}
              onClick={() => {
                setSearchInput(suggestion.text);
                setShowSuggestions(false);
                setSelectedIndex(-1);
              }}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <span className="text-neutral-500 text-sm">
                {suggestion.type === 'city' ? '🏙️' : '🌍'}
              </span>
              <span className="font-medium">{suggestion.text}</span>
              <span className="text-xs text-neutral-400 ml-auto">
                {suggestion.type}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
