import { FaRunning, FaBicycle, FaSwimmer } from 'react-icons/fa';

export const activityIcons: Record<string, React.ReactNode> = {
  Run: <FaRunning className="text-red-500 h-6 w-6" />,
  Bike: <FaBicycle className="text-green-500 h-6 w-6" />,
  Swim: <FaSwimmer className="text-blue-500 h-6 w-6" />,
};
