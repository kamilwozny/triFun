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

export function SearchTrainings() {
  return (
    <div className="flex gap-2">
      <Input
        className="h-10 w-60"
        placeholder="Search: Event name, athlete, keyword"
      />
      <Input className="h-10 w-28" placeholder="Search by location" />
      <Select defaultValue="20">
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
      <Button className="rounded-full bg-foreground hover:bg-card-foreground">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-search-icon lucide-search"
        >
          <path d="m21 21-4.34-4.34" />
          <circle cx="11" cy="11" r="8" />
        </svg>
      </Button>
    </div>
  );
}
