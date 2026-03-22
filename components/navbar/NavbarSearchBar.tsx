'use client';

import { useState, useCallback, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useTrainingsSearch } from '@/providers/TrainingsSearchContext';
import { LocationSearch } from '@/components/trainings/LocationSearch';
import { useClickOutside } from '@/hooks/useClickOutside';
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const DISTANCES_SEARCH = [
  { text: '10km', value: '10' },
  { text: '20km', value: '20' },
  { text: '30km', value: '30' },
  { text: '50km', value: '50' },
  { text: '100km', value: '100' },
];

const RECENT_SEARCHES_KEY = 'trifun-recent-searches';
const MAX_RECENT = 5;

function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function saveRecentSearch(term: string) {
  const prev = getRecentSearches();
  const updated = [term, ...prev.filter((s) => s !== term)].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
}

export function NavbarSearchBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const { locationSuggestions } = useTrainingsSearch();

  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState('10');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecent, setShowRecent] = useState(false);

  const searchRef = useClickOutside<HTMLDivElement>(useCallback(() => setShowRecent(false), []));

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  if (pathname !== '/trainings') return null;

  const hasInput = search.trim() !== '' || location.trim() !== '';
  const showRadius = location.trim() !== '';

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search.trim()) {
      params.set('search', search.trim());
      saveRecentSearch(search.trim());
      setRecentSearches(getRecentSearches());
    }
    if (location.trim()) params.set('location', location.trim());
    if (showRadius && radius !== '0') params.set('radius', radius);
    const query = params.toString();
    router.push(`/trainings${query ? `?${query}` : ''}`);
    setShowRecent(false);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
    if (e.key === 'Escape') setShowRecent(false);
    if (e.key === 'ArrowDown' && recentSearches.length > 0) setShowRecent(true);
  };

  const filteredRecent = recentSearches.filter(
    (s) => !search || s.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-64 shrink-0" ref={searchRef}>
        <input
          className="input input-bordered h-9 w-full text-sm text-black pr-2"
          placeholder={t('searchEventKeyword', 'Search event, keyword…')}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowRecent(true);
          }}
          onFocus={() => setShowRecent(true)}
          onKeyDown={handleSearchKeyDown}
        />
        {showRecent && filteredRecent.length > 0 && (
          <div className="absolute z-50 top-full mt-1 w-full bg-white rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {filteredRecent.map((item) => (
              <button
                key={item}
                className="w-full px-4 py-2 text-left text-sm hover:bg-neutral/5 flex items-center gap-2"
                onClick={() => {
                  setSearch(item);
                  setShowRecent(false);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 text-neutral-400 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="12 8 12 12 14 14" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
                <span className="truncate">{item}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <LocationSearch
          searchInput={location}
          setSearchInput={setLocation}
          locationSuggestions={locationSuggestions}
          onSearch={handleSearch}
          className={`transition-[width] duration-200 ${showRadius ? 'w-40' : 'w-60'}`}
        />

        {showRadius && (
          <Select value={radius} onValueChange={setRadius}>
            <SelectTrigger className="h-9 w-20 text-sm text-black shrink-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DISTANCES_SEARCH.map((d) => (
                <SelectItem key={d.value} value={d.value}>
                  {d.text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <button
        className="btn btn-sm rounded-full bg-foreground text-white hover:bg-foreground/80 shrink-0 flex items-center gap-1.5 transition-all duration-200"
        onClick={handleSearch}
        aria-label="Search"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m21 21-4.34-4.34" />
          <circle cx="11" cy="11" r="8" />
        </svg>
        {hasInput && (
          <span className="text-sm font-medium">{t('search', 'Search')}</span>
        )}
      </button>
    </div>
  );
}
