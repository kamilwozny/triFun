import { getTrainingEvent } from '@/actions/getTrainingEvent';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { FaRunning, FaBicycle, FaSwimmer } from 'react-icons/fa';

const activityIcons = {
  running: <FaRunning className="text-blue-500" />,
  cycling: <FaBicycle className="text-green-500" />,
  swimming: <FaSwimmer className="text-indigo-500" />,
};

export default async function TrainingPage({
  params,
}: {
  params: { id: string };
}) {
  const training = await getTrainingEvent(params.id); // Fetch training data

  if (!training) return <p>Training not found</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800">{training.name}</h1>
      <p className="text-gray-600 text-sm">{training.date}</p>
      <span className="inline-block bg-blue-100 text-blue-600 px-2 py-1 text-xs rounded mt-2">
        {training.level}
      </span>
      <p className="mt-4 text-gray-700">{training.description}</p>

      <h3 className="text-lg font-semibold mt-6">Activities</h3>
      <div className="space-y-2 mt-2"></div>

      <h3 className="text-lg font-semibold mt-6">Location</h3>
      <div className="h-64 w-full mt-2 rounded-lg overflow-hidden">
        {/* <MapContainer
          center={training.country}
          zoom={13}
          className="h-full w-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={training.city} />
        </MapContainer> */}
      </div>
    </div>
  );
}
