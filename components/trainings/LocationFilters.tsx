import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';

export interface LocationFilters {
  city: string;
  distanceKm: number;
}

interface LocationFiltersProps {
  filters: LocationFilters;
  onFiltersChange: (filters: LocationFilters) => void;
}

const MIN_LENGTH = 0;
const MAX_LENGTH = 100;
const SLIDER_STEPS = 5;

export function LocationFilters({
  filters,
  onFiltersChange,
}: LocationFiltersProps) {
  const { t } = useTranslation();

  const handleCityChange = (city: string) => {
    onFiltersChange({
      ...filters,
      city,
    });
  };

  const handleDistanceChange = (distance: number[]) => {
    onFiltersChange({
      ...filters,
      distanceKm: distance[0],
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="city-filter" className="text-sm font-medium text-black">
          {t('city')}
        </Label>
        <Input
          id="city-filter"
          type="text"
          placeholder={t('searchByCity')}
          value={filters.city}
          onChange={(e) => handleCityChange(e.target.value)}
          className="w-full text-black focus-visible:ring-foreground"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium text-black">
          {t('distanceRange')}: ±{filters.distanceKm} {t('km')}
        </Label>
        <Slider
          value={[filters.distanceKm]}
          onValueChange={handleDistanceChange}
          max={MAX_LENGTH}
          min={MIN_LENGTH}
          step={SLIDER_STEPS}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {MIN_LENGTH} {t('km')}
          </span>
          <span>
            {MAX_LENGTH} {t('km')}
          </span>
        </div>
      </div>
    </div>
  );
}
