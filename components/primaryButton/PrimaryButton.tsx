interface PrimaryButtonProps {
  text: string;
  handleClick: () => void;
}

export const PrimaryButton = ({ text, handleClick }: PrimaryButtonProps) => {
  return (
    <button
      onClick={handleClick}
      className="btn btn-outline w-20 border-2 border-accent hover:bg-white hover:text-neutral"
    >
      {text}
    </button>
  );
};
