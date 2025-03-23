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
  return (
    <>
      {['All', 'Run', 'Bike', 'Swim'].map((activity) => (
        <button
          key={activity}
          onClick={() =>
            setSelectedActivity(activity === 'All' ? null : activity)
          }
          className={`px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 hover:bg-neutral hover:text-white ${
            (activity === 'All' && !selectedActivity) ||
            selectedActivity === activity
              ? 'bg-neutral text-white shadow-lg scale-105'
              : 'bg-white text-neutral'
          }`}
        >
          {activity !== 'All' &&
            activityIcons[activity as keyof typeof activityIcons]}
          {activity}
        </button>
      ))}
    </>
  );
}
