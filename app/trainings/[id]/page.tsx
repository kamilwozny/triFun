import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTrainingEvent } from '@/actions/getTrainingEvent';
import { getTrainingList } from '@/actions/trainingList';
import { auth } from '@/app/auth';
import { SignupButton } from '@/components/signupButton/SignupButton';
import { ApproveAttendeeButtons } from '@/components/trainings/ApproveAttendeeButtons';
import { TrainingReviewSection } from '@/components/trainings/TrainingReviewSection';
import { hasCurrentUserReviewedEvent } from '@/actions/reviews';
import { FaMapMarkerAlt, FaCalendarAlt, FaUserFriends, FaRoute } from 'react-icons/fa';
import { BackToListButton } from '@/components/trainings/BackToListButton';
import { MdSportsScore } from 'react-icons/md';
import RouteMap from '@/components/map/RouteMapClient';

import { Badge } from '@/components/ui/badge';
import { getServerTranslation } from '@/localization/server';
import { formatDateLong, getTodayMidnight, parseDistances } from '@/lib/utils';
import { activityIcons } from '@/lib/activityIcons';

enum Difficulties {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Expert = 'expert',
}

const difficultyColors = {
  Beginner: Difficulties.Beginner,
  Intermediate: Difficulties.Intermediate,
  Expert: Difficulties.Expert,
};

interface Attendee {
  id: string | null;
  name: string | null;
  isHost: boolean;
  status: 'pending' | 'confirmed' | 'declined';
  joinedDate: Date;
}

export default async function TrainingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const training = await getTrainingEvent(id);

  if (!training) notFound();

  const session = await auth();
  const user = session?.user;
  const isHost = training.createdBy === user?.id;
  const attendees = await getTrainingList(id);
  const isUserParticipantOrHost =
    attendees?.some((a) => a.id === user?.id && a.status === 'confirmed') ?? false;

  if (training.isPrivate && !isHost && !isUserParticipantOrHost) notFound();

  const isPast = new Date(training.date) < getTodayMidnight();
  const hasReviewed =
    user?.id && isPast && isUserParticipantOrHost
      ? await hasCurrentUserReviewedEvent(id)
      : false;
  const { t } = await getServerTranslation();

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-6 space-y-8">
      <BackToListButton label={t('backToList')} />
      <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-800">
              {training.name}
            </h1>
            <div className="flex items-center gap-2 mt-2 text-neutral-600">
              <FaCalendarAlt className="h-4 w-4" />
              <span>{formatDateLong(training.date)}</span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-neutral-600">
              <FaMapMarkerAlt className="h-4 w-4" />
              <span>
                {training.city}, {training.country}
              </span>
            </div>
          </div>
          <Badge variant={difficultyColors[training.level] || 'default'}>
            {t(training.level.toLowerCase())}
          </Badge>
        </div>

        <p className="mt-4 text-neutral-700 leading-relaxed">
          {training.description}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
        <div className="flex items-center gap-2 mb-4">
          <MdSportsScore className="h-6 w-6" />
          <h2 className="text-2xl font-semibold text-neutral-800">
            {t('activities')}
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {parseDistances(training.distances).map((dist, index) => (
            <div
              key={index}
              className="bg-neutral-50 p-4 rounded-lg flex items-center gap-4"
            >
              {activityIcons[dist.activity as keyof typeof activityIcons]}
              <div>
                <span className="block text-lg font-semibold text-neutral-800">
                  {t(dist.activity.toLowerCase())}
                </span>
                <span className="text-neutral-600 text-lg">
                  {dist.distance} {dist.unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {training.routeGeoJson && (
        <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaRoute className="h-5 w-5" />
            <h2 className="text-2xl font-semibold text-neutral-800">
              {t('route')}
            </h2>
          </div>
          <RouteMap
            routeGeoJson={training.routeGeoJson}
            activityColor={(() => {
              const first = parseDistances(training.distances)[0]?.activity;
              return first === 'Run'
                ? '#FF2E63'
                : first === 'Swim'
                  ? '#00BBF9'
                  : '#9B5DE5';
            })()}
          />
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6">
        <div className="flex flex-wrap justify-between items-center gap-2 mb-6">
          <div className="flex items-center gap-2">
            <FaUserFriends className="h-6 w-6" />
            <h2 className="text-2xl font-semibold text-neutral-800">
              {t('atendees')} ({attendees?.length || 0})
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {isPast && isUserParticipantOrHost && !hasReviewed && user?.id && (
              <TrainingReviewSection
                eventId={id}
                userId={user.id}
                attendees={attendees ?? []}
              />
            )}
            {!isPast && (
              attendees?.find((attendee) => attendee.id === user?.id) ? (
                <button>{t('inviteFriends')}</button>
              ) : (
                training.createdBy !== user?.id && <SignupButton eventId={id} />
              )
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="bg-neutral-100 rounded-l-lg pl-16">
                  {t('participant')}
                </th>
                <th className="bg-neutral-100">{t('status')}</th>
                <th className="bg-neutral-100">{t('joinedDateEvent')}</th>
                {isHost && (
                  <th className="bg-neutral-100 rounded-r-lg">
                    {t('actions')}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {attendees?.map((attendee: Attendee) => (
                <tr key={attendee.id} className="hover:bg-neutral-50">
                  <td className="py-4">
                    <div className="flex gap-3">
                      <div className="avatar placeholder">
                        <div className="text-white rounded-full w-10">
                          <span className="text-lg">
                            {attendee.name?.charAt(0).toUpperCase() || 'A'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-800 flex gap-1">
                          {attendee.id ? (
                            <Link href={`/profile/${attendee.id}`} className="hover:underline">
                              {attendee.name}
                            </Link>
                          ) : (
                            attendee.name
                          )}
                          <p className="font-bold">
                            {attendee.isHost && `(${t('host')})`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="font-semibold text-neutral-800">
                      {t(attendee.status)}
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="font-semibold text-neutral-800">
                      {attendee.joinedDate.toLocaleDateString()}
                    </div>
                  </td>
                  {isHost && (
                    <td className="py-4">
                      {attendee.status === 'pending' && attendee.id && (
                        <ApproveAttendeeButtons
                          eventId={id}
                          attendeeId={attendee.id}
                        />
                      )}
                    </td>
                  )}
                </tr>
              ))}
              {(!attendees || attendees.length === 0) && (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-neutral-500">
                    {t('noAtendeesYet')}
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
