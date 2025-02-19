interface FilterButtonProps {
  text: string;
  handleClick: () => void;
}

export const FilterButton = ({ text, handleClick }: FilterButtonProps) => {
  return (
    <button
      onClick={handleClick}
      className="btn btn-outline w-20 border-2 border-accent hover:bg-white hover:text-neutral"
    >
      {text}
    </button>
  );
};
