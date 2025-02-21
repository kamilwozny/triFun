interface FilterButtonProps {
  text: string;
  handleClick: () => void;
}

export const FilterButton = ({ text, handleClick }: FilterButtonProps) => {
  return (
    <button
      onClick={handleClick}
      className="btn btn-outline w-20  border-2 border-black text-black bg-white hover:text-white hover:bg-neutral"
    >
      {text}
    </button>
  );
};
