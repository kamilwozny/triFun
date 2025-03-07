import { getTrainingEvent } from '@/actions/getTrainingEvent';
import { getTrainingList } from '@/actions/trainingList';
import { PrimaryButton } from '@/components/primaryButton/PrimaryButton';
import 'leaflet/dist/leaflet.css';
import { Key } from 'react';
import { FaRunning, FaBicycle, FaSwimmer } from 'react-icons/fa';

const activityIcons = {
  Run: <FaRunning className="text-blue-500" />,
  Bike: <FaBicycle className="text-green-500" />,
  Swim: <FaSwimmer className="text-indigo-500" />,
};

export default async function TrainingPage({
  params,
}: {
  params: { id: string };
}) {
  const training = await getTrainingEvent(params.id);
  const atendees = await getTrainingList(params.id);
  if (!training) return <p>Training not found</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800">{training.name}</h1>
      <p className="text-gray-600 text-sm">
        {training.date} | {training.country} | {training.city}
      </p>
      <span className="inline-block bg-blue-100 text-blue-600 px-2 py-1 text-xs rounded mt-2">
        {training.level}
      </span>
      <p className="mt-4 text-gray-700">{training.description}</p>

      <h3 className="text-lg font-semibold mt-6">Activities</h3>
      <div className="space-y-2 mt-2">
        {JSON.parse(training.distances).map(
          (
            dist: { activity: string; distance: number; unit: string },
            index: Key
          ) => (
            <div key={index}>
              <span className=" text-gray-800 font-semibold">
                {`${dist.activity}: ${dist.distance} ${dist.unit}`}
              </span>
            </div>
          )
        )}
      </div>
      <PrimaryButton text="Invite" handleClick={() => {}} />
      <h3 className="text-lg font-semibold mt-6">Attendees</h3>
    </div>
  );
}
