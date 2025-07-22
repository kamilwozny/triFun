import { useTranslation } from 'react-i18next';
import { FaSwimmer, FaBiking, FaRunning } from 'react-icons/fa';

const activityIcons = {
  Swim: <FaSwimmer className="h-5 w-5" />,
  Bike: <FaBiking className="h-5 w-5" />,
  Run: <FaRunning className="h-5 w-5" />,
};

interface EventFiltersProps {
  selectedActivity: string | null;
  setSelectedActivity: (activity: string | null) => void;
}

export function EventFilters({
  selectedActivity,
  setSelectedActivity,
}: EventFiltersProps) {
  const { t } = useTranslation();
  const activities = [
    { key: 'All', label: t('All') },
    { key: 'Run', label: t('Run') },
    { key: 'Bike', label: t('Bike') },
    { key: 'Swim', label: t('Swim') },
  ];
  return (
    <>
      {activities.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => setSelectedActivity(key === 'All' ? null : key)}
          className={`px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 hover:bg-neutral hover:text-white ${
            (key === 'All' && !selectedActivity) || selectedActivity === key
              ? 'bg-neutral text-white shadow-lg scale-105'
              : 'bg-white text-neutral'
          }`}
        >
          {key !== 'All' && activityIcons[key as keyof typeof activityIcons]}
          {label}
        </button>
      ))}
    </>
  );
}
