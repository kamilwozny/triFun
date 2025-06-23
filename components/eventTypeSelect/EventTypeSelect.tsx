import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaGlobe, FaLock } from 'react-icons/fa';

interface EventTypeSelectProps {
  onChange: (isPrivate: boolean) => void;
}

export const EventTypeSelect = ({ onChange }: EventTypeSelectProps) => {
  const [isPrivate, setIsPrivate] = useState(false);

  const handleToggle = () => {
    const newValue = !isPrivate;
    setIsPrivate(newValue);
    onChange(newValue);
  };
  return (
    <button
      type="button"
      className="relative w-16 h-8 rounded-full transition-colors duration-300 ease-in-out focus:outline-none"
      style={{
        backgroundColor: isPrivate ? 'rgb(var(--p))' : '#e5e7eb',
      }}
      onClick={handleToggle}
    >
      <motion.div
        className="absolute top-1 left-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md"
        animate={{
          x: isPrivate ? 32 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        <motion.div
          animate={{
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 0.3,
          }}
        >
          {isPrivate ? (
            <FaLock className="w-3 h-3 text-secondary" />
          ) : (
            <FaGlobe className="w-3 h-3 text-neutral" />
          )}
        </motion.div>
      </motion.div>
    </button>
  );
};
