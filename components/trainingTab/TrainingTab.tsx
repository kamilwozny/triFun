interface TabProps {
  label: string;
  activeTab: string;
  activeLabel: string;
  onClick: () => void;
}

export const TrainingTab = ({
  label,
  activeTab,
  activeLabel,
  onClick,
}: TabProps) => {
  return (
    <button
      className={`tab text-xl font-medium transition-all duration-200 hover:bg-neutral hover:text-white ${
        activeTab === activeLabel ? 'bg-neutral text-white' : 'text-neutral'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
