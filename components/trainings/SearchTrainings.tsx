'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface SearchDistances {
  value: string;
  text: string;
}

const DISTANCES_SEARCH: SearchDistances[] = [
  { text: '0km', value: '0' },
  { text: '10km', value: '10' },
  { text: '20km', value: '20' },
  { text: '30km', value: '30' },
  { text: '40km', value: '40' },
  { text: '50km', value: '50' },
  { text: '100km', value: '100' },
];

interface SearchTrainingsProps {
  initialSearch?: string;
  initialLocation?: string;
  initialRadius?: string;
}

export function SearchTrainings({
  initialSearch = '',
  initialLocation = '',
  initialRadius = '0',
}: SearchTrainingsProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [location, setLocation] = useState(initialLocation);
  const [radius, setRadius] = useState(initialRadius);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (location.trim()) params.set('location', location.trim());
    if (radius !== '0') params.set('radius', radius);
    const query = params.toString();
    router.push(`/trainings${query ? `?${query}` : ''}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="flex gap-2">
      <Input
        className="h-10 w-60"
        placeholder="Search: Event name, keyword"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Input
        className="h-10 w-28"
        placeholder="City or country"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Select value={radius} onValueChange={setRadius}>
        <SelectTrigger className="h-10 w-20 border-r-4 text-black">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {DISTANCES_SEARCH.map((distance) => (
            <SelectItem key={distance.value} value={distance.value}>
              {distance.text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        className="rounded-full bg-foreground hover:bg-card-foreground"
        onClick={handleSearch}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
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
      </Button>
    </div>
  );
}
