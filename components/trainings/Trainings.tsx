'use client';

import Image from 'next/image';
import { FilterButton } from '../filterButton/FilterButton';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaSort } from 'react-icons/fa';

interface ITraining {
  id: string;
  name: string;
  description: string;
}

interface TrainingsPageClientProps {
  trainings: ITraining[];
}

export const Trainings: React.FC<TrainingsPageClientProps> = ({
  trainings,
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ITraining;
    direction: string;
  }>({ key: 'id', direction: 'asc' });

  const sortedTrainings = [...trainings].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
  const requestSort = (key: keyof ITraining) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  const router = useRouter();

  const handleCreateTraining = () => {
    router.push('/trainings/create');
  };

  const filters = ['Swim', 'Bike', 'Run'];
  return (
    <div>
      <div className="card card-side flex flex-col md:flex-row items-center justify-between bg-neutral p-6 rounded-xl shadow-lg mx-40">
        <Image
          src="/images/swim4.jpg"
          width={500}
          height={100}
          className="w-3/4 h-80 object-cover rounded-lg"
          alt="Open water training"
        />
        <div className="card-body bg-neutral">
          <h2 className="text-2xl font-bold text-white">
            Organize Your Own Party Training!
          </h2>
          <p className="text-gray-300 mt-2">
            Discover and join training events in your area.
          </p>
          <button
            onClick={handleCreateTraining}
            className="btn btn-primary mt-4 bg-light text-white"
          >
            Create Event
          </button>
        </div>
      </div>

      <div className="mt-12 flex flex-col justify-center items-center">
        <div className="flex justify-center gap-4 my-6">
          {filters.map((filter) => (
            <FilterButton key={filter} text={filter} handleClick={() => {}} />
          ))}
        </div>
        <div className="rounded-xl shadow-lg p-4 bg-secondary-light">
          <table className="w-full border-collapse border border-white">
            <thead className="bg-[#082042] text-white">
              <tr className="border border-white">
                <td
                  onClick={() => requestSort('id')}
                  className={`border border-white text-white p-2 cursor-pointer flex justify-center gap-2 items-center`}
                >
                  ID <FaSort />
                </td>
                <td
                  onClick={() => requestSort('name')}
                  className={`border border-white p-2 cursor-pointer`}
                >
                  Name <FaSort />
                </td>
                <td
                  onClick={() => requestSort('description')}
                  className={`border border-white p-2 cursor-pointer`}
                >
                  Description <FaSort />
                </td>
              </tr>
            </thead>
            <tbody>
              {sortedTrainings.map((training, index) => (
                <tr key={training.id} className="border border-white">
                  <td className="border border-white p-2">{index + 1}</td>
                  <td className="border border-white p-2">{training.name}</td>
                  <td className="border border-white p-2">
                    {training.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
