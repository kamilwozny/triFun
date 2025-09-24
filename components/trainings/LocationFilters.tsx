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
          {t('city', 'City')}
        </Label>
        <Input
          id="city-filter"
          type="text"
          placeholder={t('searchByCity', 'Search by city...')}
          value={filters.city}
          onChange={(e) => handleCityChange(e.target.value)}
          className="w-full text-black focus-visible:ring-foreground"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium text-black">
          {t('distance', 'Distance')}: ±{filters.distanceKm} km
        </Label>
        <Slider
          value={[filters.distanceKm]}
          onValueChange={handleDistanceChange}
          max={100}
          min={0}
          step={5}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0 km</span>
          <span>100 km</span>
        </div>
      </div>
    </div>
  );
}
