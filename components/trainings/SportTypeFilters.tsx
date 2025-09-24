import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export type SportType = 'Run' | 'Bike' | 'Swim';

interface SportTypeFiltersProps {
  selectedSports: SportType[];
  onSportsChange: (sports: SportType[]) => void;
}

const sportTypes: { value: SportType; labelKey: string }[] = [
  { value: 'Run', labelKey: 'running' },
  { value: 'Bike', labelKey: 'cycling' },
  { value: 'Swim', labelKey: 'swimming' },
];

export function SportTypeFilters({
  selectedSports,
  onSportsChange,
}: SportTypeFiltersProps) {
  const { t } = useTranslation();

  const handleSportToggle = (sport: SportType) => {
    if (selectedSports.includes(sport)) {
      onSportsChange(selectedSports.filter((s) => s !== sport));
    } else {
      onSportsChange([...selectedSports, sport]);
    }
  };

  return (
    <div className="space-y-2 flex flex-col gap-2">
      {sportTypes.map((sport) => (
        <Button
          key={sport.value}
          variant={selectedSports.includes(sport.value) ? 'active' : 'default'}
          className="w-20 rounded-lg border-none shadow-md text-sm hover:bg-foreground hover:text-white text-center"
          onClick={() => handleSportToggle(sport.value)}
        >
          {t(sport.labelKey, sport.value)}
        </Button>
      ))}
    </div>
  );
}
