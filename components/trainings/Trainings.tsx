'use client';

import Image from 'next/image';
import { FilterButton } from '../filterButton/FilterButton';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
  const router = useRouter();

  const handleCreateTraining = () => {
    router.push('/trainings/create');
  };

  const filters = ['Swim', 'Bike', 'Run'];
  return (
    <>
      <div className="card card-side rounded-none bg-base-100 shadow-xl mx-20">
        <figure>
          <Image
            src="/images/swim.jpg"
            width={600}
            height={200}
            alt="Open water training"
          />
        </figure>
        <div className="card-body bg-neutral">
          <h2 className="card-title text-white pb-2 mt-2 text-lg">
            Organise your own party training!
          </h2>
          <p className="text-white">
            Click the button to create or find events around you to train with
            your colleagues and meet new athletes.
          </p>
          <div className="card-actions justify-end ">
            <button onClick={handleCreateTraining} className="btn btn-primary">
              Create event
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col justify-center items-center">
        <div className="flex justify-center space-x-6">
          {filters.map((filter) => (
            <FilterButton key={filter} text={filter} handleClick={() => {}} />
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {trainings.map((training, index) => (
                <tr key={training.id}>
                  <th>{index + 1}</th>
                  <td>
                    <Link href={`/trainings/${training.id}`}>
                      {training.name}
                    </Link>
                  </td>
                  <td>{training.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
