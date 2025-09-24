import { Checkbox } from '@/components/ui/checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';
import { useTranslation } from 'react-i18next';

export interface EventTypeFilters {
  showHostEvents: boolean;
  showPlannedEvents: boolean;
  showPastEvents: boolean;
}

interface EventTypeCheckboxesProps {
  filters: EventTypeFilters;
  onFiltersChange: (filters: EventTypeFilters) => void;
}

export function EventTypeCheckboxes({
  filters,
  onFiltersChange,
}: EventTypeCheckboxesProps) {
  const { t } = useTranslation();

  const handleCheckboxChange = (
    key: keyof EventTypeFilters,
    checked: boolean
  ) => {
    onFiltersChange({
      ...filters,
      [key]: checked,
    });
  };

  return (
    <div className="space-y-4">
      <label
        htmlFor="host-events"
        className={`flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-background transition-colors  ${
          filters.showHostEvents && 'shadow-foreground shadow-md'
        }`}
      >
        <Checkbox
          id="host-events"
          checked={filters.showHostEvents}
          onCheckedChange={(checked) =>
            handleCheckboxChange('showHostEvents', checked as boolean)
          }
        />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">
            {t('hostEvents', 'Host Events')}
          </span>
          <span className="text-xs text-muted-foreground">
            {t('hostEventsDesc', 'Events you are hosting')}
          </span>
        </div>
      </label>

      <label
        htmlFor="planned-events"
        className={`flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-background transition-colors  ${
          filters.showPlannedEvents && 'shadow-foreground shadow-md'
        }`}
      >
        <Checkbox
          id="planned-events"
          checked={filters.showPlannedEvents}
          onCheckedChange={(checked) =>
            handleCheckboxChange('showPlannedEvents', checked as boolean)
          }
        />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">
            {t('plannedEvents', 'Planned Events')}
          </span>
          <span className="text-xs text-muted-foreground">
            {t('plannedEventsDesc', 'Upcoming events you joined')}
          </span>
        </div>
      </label>

      <label
        htmlFor="past-events"
        className={`flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-background transition-colors  ${
          filters.showPastEvents && 'shadow-foreground shadow-md'
        }`}
      >
        <Checkbox
          id="past-events"
          checked={filters.showPastEvents}
          onCheckedChange={(checked) =>
            handleCheckboxChange('showPastEvents', checked as boolean)
          }
        />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">
            {t('pastEvents', 'Past Events')}
          </span>
          <span className="text-xs text-muted-foreground">
            {t('pastEventsDesc', 'Events that already happened')}
          </span>
        </div>
      </label>
    </div>
  );
}
