import { getTrainingEvent } from '@/actions/getTrainingEvent';
import { getTrainingList } from '@/actions/trainingList';
import { auth } from '@/app/auth';
import 'leaflet/dist/leaflet.css';
import {
  FaRunning,
  FaBicycle,
  FaSwimmer,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUserFriends,
} from 'react-icons/fa';
import { MdSportsScore } from 'react-icons/md';
import { SignupButton } from '@/components/signupButton/SignupButton';

const activityIcons = {
  Run: <FaRunning className="text-red-500 h-6 w-6" />,
  Bike: <FaBicycle className="text-green-500 h-6 w-6" />,
  Swim: <FaSwimmer className="text-blue-500 h-6 w-6" />,
};

const difficultyColors = {
  Beginner: 'bg-green-100 text-green-800',
  Intermediate: 'bg-yellow-100 text-yellow-800',
  Advanced: 'bg-red-100 text-red-800',
};

const statusColors = {
  confirmed: 'badge-success',
  pending: 'badge-warning',
  declined: 'badge-error',
};

interface Attendee {
  id: string | null;
  name: string | null;
  email: string | null;
  status: 'pending' | 'confirmed' | 'declined';
  joinedDate: Date;
}

export default async function TrainingPage({
  params,
}: {
  params: { id: string };
}) {
  const training = await getTrainingEvent(params.id);
  const attendees = await getTrainingList(params.id);
  const session = await auth();
  const user = session?.user;

  if (!training) return <p>Training not found</p>;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800">
              {training.name}
            </h1>
            <div className="flex items-center gap-2 mt-2 text-neutral-600">
              <FaCalendarAlt className="h-4 w-4" />
              <span>{formatDate(training.date)}</span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-neutral-600">
              <FaMapMarkerAlt className="h-4 w-4" />
              <span>
                {training.city}, {training.country}
              </span>
            </div>
          </div>
          <span
            className={`${
              difficultyColors[training.level as keyof typeof difficultyColors]
            } px-4 py-2 rounded-full text-sm font-semibold`}
          >
            {training.level}
          </span>
        </div>

        <p className="mt-4 text-neutral-700 leading-relaxed">
          {training.description}
        </p>
      </div>

      {/* Activities Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <MdSportsScore className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold text-neutral-800">
            Activities
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {JSON.parse(training.distances).map(
            (
              dist: { activity: string; distance: number; unit: string },
              index: number
            ) => (
              <div
                key={index}
                className="bg-neutral-50 p-4 rounded-lg flex items-center gap-4"
              >
                {activityIcons[dist.activity as keyof typeof activityIcons]}
                <div>
                  <span className="block text-lg font-semibold text-neutral-800">
                    {dist.activity}
                  </span>
                  <span className="text-neutral-600 text-lg">
                    {dist.distance} {dist.unit}
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Attendees Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <FaUserFriends className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold text-neutral-800">
              Attendees ({attendees?.length || 0})
            </h2>
          </div>
          {attendees?.find((attendee) => attendee.id === user?.id) ? (
            <button>Invite friends</button>
          ) : (
            <SignupButton eventId={params.id} />
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="bg-neutral-100 rounded-l-lg">Participant</th>
                <th className="bg-neutral-100">Status</th>
                <th className="bg-neutral-100 rounded-r-lg">Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {attendees?.map((attendee: Attendee) => (
                <tr key={attendee.id} className="hover:bg-neutral-50">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-primary text-white rounded-full w-10">
                          <span className="text-lg">
                            {attendee.name?.charAt(0).toUpperCase() || 'A'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-800">
                          {attendee.name || 'Anonymous'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-semibold text-neutral-800">
                          {attendee.status}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-semibold text-neutral-800">
                          {attendee.joinedDate.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {(!attendees || attendees.length === 0) && (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-neutral-500">
                    No attendees yet. Be the first to join!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
